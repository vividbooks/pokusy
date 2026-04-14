#!/usr/bin/env node
/**
 * Přegeneruje obrázky přes Gemini (Nano Banana 2) a nahraje výsledek do Supabase Storage jako binární PNG
 * (ne ukládá base64 do DB — jen bajty do Storage API).
 *
 * Klíč Gemini: GEMINI_API_KEY / GOOGLE_API_KEY / GEMINI_API_KEY_RAG (.env),
 * nebo app_config (GEMINI_API_KEY_RAG / gemini_api_key).
 * Bez klíče v .env ani v app_config: volá se Edge funkce imagen-generate
 * (GEMINI_API_KEY_RAG jen na serveru) — potřeba SUPABASE_URL + SUPABASE_ANON_KEY.
 *
 * Model na Edge: gemini-3.1-flash-image-preview (parametr model: "flash").
 * Timeouty 504 jsou často limit brány Supabase (Edge musí stihnout Gemini + upload),
 * ne „pomalý“ model. U souborů mq*.jpg z eBedox se defaultně posílá referenceImageUrl
 * (malý request) místo base64 — vypnout: GEMINI_EDGE_PREFER_REFERENCE_URL=0
 *
 * .env (viz .env.example):
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   GEMINI_API_KEY (volitelné, pokud je klíč v app_config)
 *
 * npm run gemini:images
 * npm run gemini:images -- ./a.png ./b.jpg
 */

import "dotenv/config";
import { GoogleGenAI, Modality } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3.1-flash-image-preview";
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "gemini-images";

const IMAGE_REGEN_PROMPT = `Předělej mi přiloženou fotku na obrázek v následujícím stylu.

Chci jen tu přední scénu !!

Zbytek je bílé pozadí. Dej pryč i veškeré loga a vizuální šum, co není součástí hlavní scény.

Styl:

LINE ART:
- Dead line technique - consistent line weight, no pressure variation
- Clean, technical, organized appearance
- Every object clearly outlined with black or dark gray contour
- Closed shapes with clear boundaries

COLORS & SHADING:
- Limited pastel palette with vibrant, professional colors
- Flat design - no gradients, large areas of single color
- Minimal hard-edged shadows only (sharply defined darker blocks, no blur)
- Often no shading at all for clarity

COMPOSITION:
- Stylized anatomy - simplified features but proportional
- Static, calm poses - frontal or slight profile view
- Icon/infographic feel
- Pure white background (negative space)
- Clean, clear, aesthetically pleasing`;

function mimeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return null;
}

function isImageFile(name) {
  return /\.(png|jpe?g|webp)$/i.test(name);
}

function safeSegment(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 100) || "image";
}

/** Pro náhledy eBedox (mq….jpg) — Edge si stáhne obrázek sám, bez obřího base64 v těle. */
function resolveEbedoxReferenceUrl(filePath) {
  if (process.env.GEMINI_EDGE_PREFER_REFERENCE_URL === "0") return null;
  const base = (process.env.EBEDOX_THUMB_BASE?.trim() || "https://ebedox.cz/wp-content/uploads/2022/04").replace(
    /\/$/,
    "",
  );
  const name = path.basename(filePath);
  if (!/^mq[a-zA-Z0-9._-]+\.(jpe?g|webp|png)$/i.test(name)) return null;
  return `${base}/${name}`;
}

async function collectInputs() {
  const fromArgs = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  if (fromArgs.length > 0) {
    return fromArgs.map((p) => path.resolve(p));
  }
  const dir = process.env.GEMINI_SOURCE_DIR
    ? path.resolve(process.env.GEMINI_SOURCE_DIR)
    : path.join(ROOT, "scripts/gemini-source-images");
  const names = await readdir(dir).catch(() => []);
  return names.filter(isImageFile).map((n) => path.join(dir, n));
}

/**
 * Gemini API vyžaduje vstupní obrázek jako inline base64 — to je jen transport do modelu.
 * Výstup ukládáme do Storage jako raw Buffer (binární), ne jako base64 řetězec.
 */
const APP_CONFIG_GEMINI_KEYS = ["GEMINI_API_KEY_RAG", "gemini_api_key"];

/** @returns {Promise<{ mode: "sdk", apiKey: string } | { mode: "edge" }>} */
async function resolveGenerationMode(supabase) {
  const fromEnv =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY_RAG?.trim();
  if (fromEnv) return { mode: "sdk", apiKey: fromEnv };

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const anon = process.env.SUPABASE_ANON_KEY?.trim();

  if (supabase && supabaseUrl) {
    const { data: rows, error } = await supabase
      .from("app_config")
      .select("key, value")
      .in("key", APP_CONFIG_GEMINI_KEYS);

    if (error) throw error;
    const byKey = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value?.trim()]));
    const v = byKey.GEMINI_API_KEY_RAG || byKey.gemini_api_key || "";
    if (v) return { mode: "sdk", apiKey: v };
  }

  if (supabaseUrl && anon) {
    return { mode: "edge" };
  }

  throw new Error(
    "Chybí Gemini klíč: doplň GEMINI_API_KEY (nebo řádek v app_config), nebo SUPABASE_ANON_KEY pro volání Edge funkce imagen-generate.",
  );
}

function isTransientEdgeError(res, json) {
  if (res.ok && json?.success && json?.url) return false;
  if (res.status === 504 || res.status === 502 || res.status === 503) return true;
  if (/timeout/i.test(res.statusText || "")) return true;
  const msg = typeof json?.error === "string" ? json.error : "";
  return /UNAVAILABLE|503|try again|high demand|overloaded|INTERNAL|RESOURCE_EXHAUSTED|API error/i.test(msg);
}

/**
 * Stejný styl jako lokální skript; na serveru běží GEMINI_API_KEY_RAG (Edge secret).
 * Model: gemini-3.1-flash-image-preview (model: "flash" v imagen-generate).
 */
async function generateViaEdge(supabaseUrl, anonKey, { prompt, mime, base64, referenceImageUrl }) {
  const fn = process.env.GEMINI_EDGE_FUNCTION?.trim() || "imagen-generate";
  const url = `${supabaseUrl.replace(/\/$/, "")}/functions/v1/${fn}`;
  const payload = {
    prompt,
    model: "flash",
    referenceImageMimeType: mime || "image/jpeg",
  };
  if (referenceImageUrl) {
    payload.referenceImageUrl = referenceImageUrl;
  } else {
    payload.referenceImageBase64 = base64;
  }
  const body = JSON.stringify(payload);

  const maxAttempts = Math.min(6, Math.max(2, Number(process.env.GEMINI_EDGE_MAX_ATTEMPTS) || 3));
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body,
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json?.success && json?.url) {
      return /** @type {string} */ (json.url);
    }
    const transient = isTransientEdgeError(res, json);
    if (transient && attempt < maxAttempts - 1) {
      const waitSec = Math.min(25, 2 + attempt * 3);
      console.warn(
        `  Dočasný výpadek / timeout (pokus ${attempt + 1}/${maxAttempts}), čekám ${waitSec}s…`,
      );
      await new Promise((r) => setTimeout(r, waitSec * 1000));
      continue;
    }
    throw new Error(
      typeof json?.error === "string" ? json.error : JSON.stringify(json?.error ?? json) || res.statusText || "Edge imagen-generate selhalo",
    );
  }
  throw new Error("Edge imagen-generate selhalo po opakování");
}

async function copyUrlToBucket(supabase, publicUrl, objectPath) {
  const r = await fetch(publicUrl);
  if (!r.ok) throw new Error(`Stažení výsledku: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(objectPath, buf, {
    contentType: "image/png",
    upsert: true,
  });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
  return pub.publicUrl;
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  const supabase =
    supabaseUrl && supabaseServiceKey
      ? createClient(supabaseUrl, supabaseServiceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;

  const mode = await resolveGenerationMode(supabase);
  const ai = mode.mode === "sdk" ? new GoogleGenAI({ apiKey: mode.apiKey }) : null;

  if (mode.mode === "edge") {
    console.log(
      "Režim: Edge imagen-generate (model gemini-3.1-flash-image-preview). Bez lokálního GEMINI_API_KEY jdeš přes Supabase → často 1–3 min/obr. a 504 od brány; pro rychlost doplň GEMINI_API_KEY do .env (přímé volání Google, upload do Storage pořád lokálně).",
    );
  }

  const saveLocal = process.env.GEMINI_SAVE_LOCAL === "1" || process.env.GEMINI_SAVE_LOCAL === "true";
  const outDir = process.env.GEMINI_OUTPUT_DIR
    ? path.resolve(process.env.GEMINI_OUTPUT_DIR)
    : path.join(ROOT, "scripts/gemini-output");

  if (saveLocal) {
    await mkdir(outDir, { recursive: true });
  }

  if (!supabase) {
    console.warn(
      "Pozor: bez SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY nelze kopírovat do bucketu gemini-images (Edge vrací URL v generated-images).",
    );
  }

  const inputs = await collectInputs();
  if (inputs.length === 0) {
    console.error(
      "Žádné obrázky: dej .png/.jpg/.webp do scripts/gemini-source-images/ nebo přidej cesty jako argumenty.",
    );
    process.exit(1);
  }

  const anonKey = process.env.SUPABASE_ANON_KEY?.trim();

  for (const filePath of inputs) {
    const mime = mimeForPath(filePath);
    if (!mime) {
      console.warn("Přeskakuji (neznámý typ):", filePath);
      continue;
    }

    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    const ebedoxRef = mode.mode === "edge" ? resolveEbedoxReferenceUrl(filePath) : null;

    let base64Image = null;
    if (mode.mode !== "edge" || !ebedoxRef) {
      const buf = await readFile(filePath);
      base64Image = buf.toString("base64");
    }

    if (mode.mode === "edge") {
      console.log(
        "Generuji (Edge):",
        filePath,
        ebedoxRef ? `→ ref URL (gemini-3.1-flash-image-preview)` : `→ base64 (gemini-3.1-flash-image-preview)`,
      );
      const edgeUrl = await generateViaEdge(supabaseUrl, anonKey, {
        prompt: IMAGE_REGEN_PROMPT,
        mime,
        base64: base64Image,
        referenceImageUrl: ebedoxRef,
      });
      console.log("  Edge → Storage URL:", edgeUrl);

      if (supabase) {
        const objectPath = `lineart/${Date.now()}-${safeSegment(baseName)}.png`;
        const geminiPublic = await copyUrlToBucket(supabase, edgeUrl, objectPath);
        console.log("  Zkopírováno do", STORAGE_BUCKET + "/" + objectPath);
        console.log("  Public URL (gemini-images):", geminiPublic);
      }

      if (saveLocal) {
        const r = await fetch(edgeUrl);
        const outPath = path.join(outDir, `${baseName}-lineart.png`);
        await writeFile(outPath, Buffer.from(await r.arrayBuffer()));
        console.log("  Lokálně:", outPath);
      }
      continue;
    }

    const parts = [
      { text: IMAGE_REGEN_PROMPT },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image,
        },
      },
    ];

    console.log("Generuji:", filePath, "→ model", MODEL);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: parts,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts?.length) {
      console.error("Bez výstupu:", filePath, response.promptFeedback ?? response);
      continue;
    }

    let wrote = false;
    for (const part of candidate.content.parts) {
      if (part.text) {
        console.log("  [text]", part.text.slice(0, 200) + (part.text.length > 200 ? "…" : ""));
      }
      if (part.inlineData?.data) {
        const raw = part.inlineData.data;
        const buffer = Buffer.from(raw, "base64");

        if (saveLocal) {
          const outPath = path.join(outDir, `${baseName}-lineart.png`);
          await writeFile(outPath, buffer);
          console.log("  Lokálně:", outPath);
        }

        if (supabase) {
          const objectPath = `lineart/${Date.now()}-${safeSegment(baseName)}.png`;
          const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(objectPath, buffer, {
            contentType: "image/png",
            upsert: true,
          });
          if (upErr) {
            console.error("  Supabase Storage:", upErr.message);
            throw upErr;
          }
          const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
          console.log("  Storage:", objectPath);
          console.log("  Public URL:", pub.publicUrl);
        }

        wrote = true;
      }
    }
    if (!wrote) {
      console.warn("  Žádný obrázek v odpovědi:", filePath);
    }
  }

  console.log("Hotovo.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
