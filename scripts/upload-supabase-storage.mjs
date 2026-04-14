#!/usr/bin/env node
/**
 * Nahraje lokální obrázky do Supabase Storage (binární soubor — žádný Gemini).
 *
 * .env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Volitelně: SUPABASE_STORAGE_BUCKET (výchozí gemini-images), UPLOAD_PREFIX (výchozí manual/)
 *
 * npm run storage:upload -- ./foto.png ./druhy.jpg
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "gemini-images";
const PREFIX = (process.env.UPLOAD_PREFIX ?? "manual/").replace(/\/?$/, "/");

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

function mimeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}

function safeSegment(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 200) || "file";
}

async function main() {
  const files = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  if (!url || !key) {
    console.error("Chybí SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v .env");
    process.exit(1);
  }
  if (files.length === 0) {
    console.error("Použití: npm run storage:upload -- <soubor1> [soubor2 ...]");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const filePath of files) {
    const abs = path.resolve(filePath);
    const base = path.basename(abs);
    const buf = await readFile(abs);
    const objectPath = `${PREFIX}${Date.now()}-${safeSegment(base)}`;
    const contentType = mimeForPath(abs);

    const { error } = await supabase.storage.from(BUCKET).upload(objectPath, buf, {
      contentType,
      upsert: true,
    });
    if (error) {
      console.error(`Chyba ${base}:`, error.message);
      process.exit(1);
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
    console.log(data.publicUrl);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
