/**
 * Stáhne pro každý pokus z katalogu WordPress REST API (content.rendered),
 * vytáhne PDF, YouTube ID, shrnutí (cílová skupina, tematické celky) a rychlé údaje (čas, riziko, druh, nebezpečí).
 * Volitelně uloží očištěný text pro sekce (pracovní postup / chemikálie / didaktika / bezpečnost).
 *
 * Spuštění: node scripts/fetch-ebedox-rich-content.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG = join(__dirname, "../src/data/ebedox-experiments.generated.ts");
const OUT = join(__dirname, "../src/data/ebedox-rich-content.generated.ts");

const UA =
  "Mozilla/5.0 (compatible; pokusy-rich-fetch/1.0; +https://ebedox.cz/)";

function slugsFromCatalog() {
  const src = readFileSync(CATALOG, "utf8");
  const re = /slug:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) out.push(m[1]);
  return [...new Set(out)];
}

function stripTags(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeEbedoxPdfUrl(raw) {
  if (!raw) return null;
  let u = raw.trim();
  if (u.startsWith("//")) u = "https:" + u;
  if (u.startsWith("http://")) u = "https://" + u.slice(7);
  return u;
}

function extractPdf(html) {
  if (!html) return null;
  const norm = html.replace(/\\\//g, "/");
  // Tlačítko „Stáhnout metodický list“ často používá href="//ebedox.cz/... (bez https)
  const nearBtn = norm.match(
    /href="((?:https?:)?\/\/ebedox\.cz\/wp-content\/uploads\/[^"]+\.pdf)"[^>]*>[\s\S]{0,4000}?Stáhnout metodický list/i,
  );
  if (nearBtn) {
    return normalizeEbedoxPdfUrl(nearBtn[1]);
  }
  const m =
    norm.match(/https:\/\/ebedox\.cz\/wp-content\/uploads\/[^"'>\s]+\.pdf/i) ||
    norm.match(/\/\/ebedox\.cz\/wp-content\/uploads\/[^"'>\s]+\.pdf/i);
  return m ? normalizeEbedoxPdfUrl(m[0]) : null;
}

/**
 * Elementor ukládá URL v JSON s escapovanými lomítky: https:\/\/www.youtube.com\/watch?v=…
 * Bez normalizace \/ → / neprojde ani youtu.be ani youtube.com/watch.
 */
function extractYoutubeId(html) {
  if (!html) return null;
  const norm = html.replace(/\\\//g, "/");
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = norm.match(re);
    if (m) return m[1];
  }
  return null;
}

/** Z očištěného textu — čas typicky „15 min“ hned za „Časová náročnost“. */
function extractQuickFromText(t) {
  const timeM =
    t.match(/Časová náročnost\s*(\d+\s*min)/i) ||
    t.match(/Časová náročnost[^0-9]*?(\d+\s*min)/i);
  const time = timeM ? timeM[1].trim() : "—";

  const riskM =
    t.match(/Míra rizika ohrožení zdraví\s*([^#\n]+?)(?=Druh pokusu|Možná|Tematické|Vhodná|###|Časová|$)/i) ||
    t.match(/Míra rizika ohrožení zdraví\s*([^\n]+)/i);
  let risk = riskM ? riskM[1].replace(/\s+/g, " ").trim() : "—";
  if (risk.length > 80) risk = risk.slice(0, 77) + "…";

  const kindM = t.match(/Druh pokusu\s*([^\n]+?)(?=Možná nebezpečí|Míra|Tematické|Vhodná|###|Časová|$)/i);
  let kind = kindM ? kindM[1].replace(/\s+/g, " ").trim() : "—";
  if (kind.length > 120) kind = kind.slice(0, 117) + "…";

  const hazM = t.match(/Možná nebezpečí\s*([^\n]+?)(?=Míra rizika|Druh pokusu|###|Časová|Tematické|Vhodná|$)/i);
  let hazards = hazM ? hazM[1].replace(/\s+/g, " ").trim() : "—";
  if (hazards.length > 160) hazards = hazards.slice(0, 157) + "…";

  return { time, risk, kind, hazards };
}

/** „Vhodná cílová skupina“ / „Tematické celky“ — stejný vzor jako ruční stránky (Shrnutí), ne infografika. */
function normalizeDashList(s) {
  if (!s) return null;
  const parts = s.split(/\s*-\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  return parts.join(", ");
}

function capLen(s, max) {
  if (!s) return null;
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function extractSummaryFromText(t) {
  const lower = t.toLowerCase();
  const mkV = "vhodná cílová skupina";
  const mkT = "tematické celky";
  const iV = lower.indexOf(mkV);
  const iT = iV >= 0 ? lower.indexOf(mkT, iV + mkV.length) : lower.indexOf(mkT);

  let targetGroup = null;
  if (iV >= 0 && iT > iV) {
    const raw = t.slice(iV + mkV.length, iT)
      .replace(/^[\s\-–—:]+/u, "")
      .trim();
    targetGroup = normalizeDashList(raw);
  }

  let thematicUnits = null;
  if (iT >= 0) {
    const afterT = t.slice(iT + mkT.length);
    const la = afterT.toLowerCase();
    const endMarkers = [
      "druh pokusu",
      "možná nebezpečí",
      "míra rizika ohrožení zdraví",
      "časová náročnost",
    ];
    let end = afterT.length;
    for (const mk of endMarkers) {
      const j = la.indexOf(mk, 2);
      if (j !== -1 && j < end) end = j;
    }
    const raw = afterT
      .slice(0, end)
      .replace(/^[\s\-–—:]+/u, "")
      .trim();
    thematicUnits = normalizeDashList(raw);
  }

  return {
    targetGroup: capLen(targetGroup, 320),
    thematicUnits: capLen(thematicUnits, 320),
  };
}

/** Rozdělí text na bloky podle nadpisů v textu (zůstaly z h3/h4). */
function extractProcedureParagraphs(html) {
  const text = stripTags(html);
  const idx = text.toLowerCase().indexOf("pracovní postup");
  if (idx === -1) return [];
  const rest = text.slice(idx);
  const endMarkers = ["chemikálie", "didaktická část", "pokyny pro bezpečné"];
  let end = rest.length;
  for (const mk of endMarkers) {
    const j = rest.toLowerCase().indexOf(mk, 20);
    if (j !== -1 && j < end) end = j;
  }
  const block = rest.slice(0, end).replace(/^[^a-záčďéěíňóřšťúůýž]*pracovní postup\s*/i, "");
  const sentences = block
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);
  const steps = [];
  let buf = "";
  for (const s of sentences) {
    buf = buf ? `${buf} ${s}` : s;
    if (buf.length > 80 || s.endsWith(".")) {
      steps.push(buf);
      buf = "";
    }
  }
  if (buf) steps.push(buf);
  return steps.slice(0, 12).map((body, i) => ({
    title: `Krok ${i + 1}`,
    body,
  }));
}

async function fetchPageJson(slug) {
  const url = `https://ebedox.cz/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=content,title`;
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA } });
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const arr = await res.json();
  if (!arr || !arr[0]) return null;
  return arr[0];
}

function escapeStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n");
}

async function main() {
  const slugs = slugsFromCatalog();
  const results = [];
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    process.stderr.write(`\r[${i + 1}/${slugs.length}] ${slug.padEnd(50)}`);
    try {
      const page = await fetchPageJson(slug);
      await new Promise((r) => setTimeout(r, 120));
      if (!page) {
        results.push({ slug, error: "no_page" });
        fail++;
        continue;
      }
      const html = page.content?.rendered || "";
      const pdfHref = extractPdf(html);
      const youtubeVideoId = extractYoutubeId(html);
      const plain = stripTags(html);
      const q = extractQuickFromText(plain);
      const summary = extractSummaryFromText(plain);
      const procedureSteps = extractProcedureParagraphs(html);

      results.push({
        slug,
        pdfHref,
        youtubeVideoId,
        quick: q,
        summary,
        procedureSteps,
      });
      ok++;
    } catch (e) {
      results.push({ slug, error: String(e.message || e) });
      fail++;
    }
  }
  process.stderr.write("\n");

  const lines = results.map((r) => {
    if (r.error) {
      return `  "${r.slug}": { error: ${JSON.stringify(r.error)} },`;
    }
    const stepsJson = JSON.stringify(r.procedureSteps || []);
    return `  "${r.slug}": {\n    pdfHref: ${r.pdfHref ? `"${escapeStr(r.pdfHref)}"` : "null"},\n    youtubeVideoId: ${r.youtubeVideoId ? `"${r.youtubeVideoId}"` : "null"},\n    quick: ${JSON.stringify(r.quick)},\n    summary: ${JSON.stringify(r.summary)},\n    procedureSteps: ${stepsJson},\n  },`;
  });

  const ts = `/* eslint-disable */
/**
 * Automaticky generováno: node scripts/fetch-ebedox-rich-content.mjs
 * Zdroj: WordPress REST API + HTML (PDF, YouTube, shrnutí, rychlé údaje, kroky postupu).
 */
export type EbedoxProcedureStep = { title: string; body: string };

export type EbedoxRichEntry = {
  pdfHref: string | null;
  youtubeVideoId: string | null;
  quick: { time: string; risk: string; kind: string; hazards: string };
  summary: { targetGroup: string | null; thematicUnits: string | null };
  procedureSteps: EbedoxProcedureStep[];
  error?: string;
};

export const ebedoxRichContent: Record<string, EbedoxRichEntry> = {
${lines.join("\n")}
};
`;

  writeFileSync(OUT, ts, "utf8");
  console.log(`OK: ${ok} stránek, chyb: ${fail} → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
