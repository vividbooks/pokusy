/**
 * Stáhne veřejné HTML https://ebedox.cz/seznam-pokusu/ a vygeneruje TypeScript modul
 * s titulkem, odkazem a náhledem z Elementor CTA (background-image), stejně jako na webu.
 *
 * Spuštění: node scripts/fetch-ebedox-experiments.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/data/ebedox-experiments.generated.ts");

const PAGE_URL = "https://ebedox.cz/seznam-pokusu/";

/** Jeden blok: odkaz na pokus + náhled z pozadí CTA + nadpis h5 */
const CTA_BLOCK_RE =
  /<a class="elementor-cta" href="(https?:\/\/ebedox\.cz\/[^"]+\/)">[\s\S]*?<div class="elementor-cta__bg elementor-bg" style="background-image:\s*url\(([^)]+)\);"><\/div>[\s\S]*?<h5 class="elementor-cta__title[^"]*">([^<]+)<\/h5>/gi;

function slugFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    const seg = u.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    return seg[seg.length - 1] || "unknown";
  } catch {
    return "unknown";
  }
}

function normalizePageUrl(urlStr) {
  const u = urlStr.replace(/\/+$/, "") + "/";
  return u.startsWith("http://") ? "https://" + u.slice("http://".length) : u;
}

function normalizeThumbUrl(raw) {
  let s = raw.trim().replace(/^["']|["']$/g, "");
  if (s.startsWith("//")) s = "https:" + s;
  else if (s.startsWith("http://")) s = "https://" + s.slice("http://".length);
  return s;
}

function escapeTsString(s) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r?\n/g, " ");
}

const tints = ["sky", "cream", "mint", "blush"];

async function main() {
  const res = await fetch(PAGE_URL, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "Mozilla/5.0 (compatible; pokusy-catalog-fetch/1.0; +https://ebedox.cz/)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} při stahování ${PAGE_URL}`);
  const html = await res.text();

  const items = [];
  let m;
  while ((m = CTA_BLOCK_RE.exec(html)) !== null) {
    const sourceUrl = normalizePageUrl(m[1]);
    const thumbnailUrl = normalizeThumbUrl(m[2]);
    const title = m[3].trim().replace(/\s+/g, " ");
    if (!title || !thumbnailUrl) continue;
    const slug = slugFromUrl(sourceUrl);
    items.push({ slug, title, sourceUrl, thumbnailUrl });
  }

  if (items.length === 0) {
    throw new Error(
      "Nepodařilo se najít žádný Elementor CTA blok — změnila se šablona stránky?",
    );
  }

  const seen = new Set();
  const unique = items.filter((x) => {
    if (seen.has(x.sourceUrl)) return false;
    seen.add(x.sourceUrl);
    return true;
  });

  const lines = unique.map((x, i) => {
    const tint = tints[i % tints.length];
    return `    { slug: "${x.slug}", title: "${escapeTsString(x.title)}", tint: "${tint}", thumbnailUrl: "${escapeTsString(x.thumbnailUrl)}", sourceUrl: "${x.sourceUrl}" },`;
  });

  const ts = `/* eslint-disable */
/**
 * Automaticky generováno: node scripts/fetch-ebedox-experiments.mjs
 * Zdroj: https://ebedox.cz/seznam-pokusu/ (Elementor CTA — náhledy z ebedox.cz)
 */
import type { ExperimentItem } from "../types";

export const ebedoxExperiments: ExperimentItem[] = [
${lines.join("\n")}
];
`;

  writeFileSync(OUT, ts, "utf8");
  console.log(`OK: ${unique.length} pokusů (s náhledy z eBedox) → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
