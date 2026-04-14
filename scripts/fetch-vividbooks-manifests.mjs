/**
 * Stáhne manifesty knih z api.vividbooks.com a uloží je jako JSON + vygeneruje sjednocený index.
 *
 * Spuštění:
 *   node scripts/fetch-vividbooks-manifests.mjs
 *
 * Volitelně:
 *   VIVIDBOOKS_BOOK_IDS=73,82,88        — chemické učebnice (výchozí seznam v kódu)
 *   VIVIDBOOKS_MATH_IDS=105,106         — matematika (pracovní listy v contentBlocks); prázdné = nestahovat
 *   VIVIDBOOKS_USER_CODE=pascal
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../src/data/vividbooks");
const OUT_INDEX = join(__dirname, "../src/data/vividbooksIndex.generated.ts");

const DEFAULT_CHEM_IDS = [73, 82, 88, 91, 94, 97, 100, 103];
const DEFAULT_MATH_IDS = [105, 106];

function parseIds(raw, fallback) {
  if (raw === "") return [];
  if (!raw || !raw.trim()) return fallback;
  return raw.split(/[\s,]+/).map((x) => parseInt(x.trim(), 10)).filter((n) => !Number.isNaN(n));
}

function parseChemIds() {
  return parseIds(process.env.VIVIDBOOKS_BOOK_IDS, DEFAULT_CHEM_IDS);
}

function parseMathIds() {
  return parseIds(process.env.VIVIDBOOKS_MATH_IDS, DEFAULT_MATH_IDS);
}

const USER_CODE = process.env.VIVIDBOOKS_USER_CODE || "pascal";

async function fetchBook(id) {
  const url = `https://api.vividbooks.com/v1/books/${id}?user-code=${encodeURIComponent(USER_CODE)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "pokusy-vividbooks-fetch/1.0",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} při ${url}`);
  return res.json();
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true });
  const chemIds = parseChemIds();
  const mathIds = parseMathIds();
  const chemImports = [];
  const mathImports = [];

  for (const id of chemIds) {
    console.log(`Stahuji chemickou knihu ${id}…`);
    const data = await fetchBook(id);
    const fileName = `vividbooks-chem-${id}.json`;
    writeFileSync(join(DATA_DIR, fileName), JSON.stringify(data, null, 0), "utf8");
    chemImports.push({ id, varName: `vividbooksChem${id}`, fileName });
  }

  for (const id of mathIds) {
    console.log(`Stahuji matematickou knihu ${id}…`);
    const data = await fetchBook(id);
    const fileName = `vividbooks-math-${id}.json`;
    writeFileSync(join(DATA_DIR, fileName), JSON.stringify(data, null, 0), "utf8");
    mathImports.push({ id, varName: `vividbooksMath${id}`, fileName });
  }

  const allImports = [...chemImports, ...mathImports];
  const importLines = allImports.map((x) => `import ${x.varName} from "./vividbooks/${x.fileName}";`).join("\n");

  const chemLines = chemImports.map((x) => `  ${x.varName} as VividbooksBookManifest,`).join("\n");
  const mathLines = mathImports.map((x) => `  ${x.varName} as VividbooksBookManifest,`).join("\n");

  const ts = `/* eslint-disable */
/**
 * Automaticky generováno: node scripts/fetch-vividbooks-manifests.mjs
 * Zdroj: https://api.vividbooks.com/v1/books/{id}?user-code=…
 */
import type { VividbooksBookManifest } from "./vividbooksTypes";

${importLines}

export const vividbooksChemBooks: VividbooksBookManifest[] = [
${chemLines}
];

export const vividbooksMathBooks: VividbooksBookManifest[] = [
${mathLines}
];
`;

  writeFileSync(OUT_INDEX, ts, "utf8");
  console.log(
    `OK: chem ${chemIds.length}, math ${mathIds.length} → ${DATA_DIR} + ${OUT_INDEX}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
