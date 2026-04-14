import type {
  VividbooksBookManifest,
  VividbooksDocumentItem,
  VividbooksWorksheetPair,
  VividbooksWorksheetRow,
} from "./vividbooksTypes";

/** Suffix v názvu druhé varianty (v API bývá NBSP místo mezery). */
const PRO_VSECHNY_RE = /\(pro[\s\u00a0]+všechny\)\s*$/i;

/** Úvodní „str. 12 …“ pro párování stejného listu v obou variantách. */
const STR_PREFIX_RE = /^str\.\s*[\d\u00a0\s]+\s*/i;

function normalizeSpaces(s: string): string {
  return s.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

export function isWorksheetProVsechny(name: string | null | undefined): boolean {
  if (!name) return false;
  return PRO_VSECHNY_RE.test(normalizeSpaces(name));
}

/**
 * Klíč pro párování dvou řádků ve stejném content bloku: stejný obsah bez čísla strany a bez suffixu.
 */
export function worksheetPairKey(rawName: string | null | undefined): string {
  if (!rawName) return "";
  let s = normalizeSpaces(rawName);
  s = s.replace(PRO_VSECHNY_RE, "").trim();
  s = s.replace(STR_PREFIX_RE, "").trim();
  s = s.replace(/\.+$/, "").trim();
  return s.toLowerCase();
}

function normalizeDocuments(raw: unknown): VividbooksDocumentItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((d): d is VividbooksDocumentItem => d != null && typeof d === "object");
}

function rowFromDoc(
  book: VividbooksBookManifest,
  chapterId: number,
  chapterName: string,
  blockId: number | null,
  blockName: string | null,
  doc: VividbooksDocumentItem,
): VividbooksWorksheetRow | null {
  const name = doc.name?.trim() ?? "";
  if (!name) return null;
  const v = isWorksheetProVsechny(name) ? "for_all" : "without_pro_vsechny";
  return {
    bookId: book.id,
    bookName: book.name,
    chapterId,
    chapterName,
    contentBlockId: blockId,
    contentBlockName: blockName,
    documentId: doc.id ?? null,
    name,
    variant: v,
    documentUrl: doc.documentUrl ?? null,
    previewUrl: doc.previewUrl ?? null,
  };
}

/** Všechny pracovní listy z manifestu (contentBlocks → documents, type worksheet). */
export function extractMathWorksheetsFromBook(book: VividbooksBookManifest): VividbooksWorksheetRow[] {
  const out: VividbooksWorksheetRow[] = [];
  for (const ch of book.chapters ?? []) {
    for (const block of ch.contentBlocks ?? []) {
      const blockId = block.id ?? null;
      const blockName = block.name ?? null;
      for (const doc of normalizeDocuments(block.documents)) {
        if (doc.type !== "worksheet") continue;
        const row = rowFromDoc(book, ch.id, ch.name, blockId, blockName, doc);
        if (row) out.push(row);
      }
    }
  }
  return out;
}

export type VividbooksWorksheetPairingResult = {
  pairs: VividbooksWorksheetPair[];
  /** Listy bez druhé varianty ve stejném bloku (procvičení jen jednou, …). */
  unpaired: VividbooksWorksheetRow[];
  /** Více než dvě položky se stejným klíčem — zatím nepárováno. */
  ambiguous: { pairKey: string; chapterId: number; contentBlockId: number | null; rows: VividbooksWorksheetRow[] }[];
};

/**
 * Uvnitř každého content bloku páruje řádky se stejným `worksheetPairKey` + jedna variant „for_all“ a jedna „without“.
 */
export function pairMathWorksheets(rows: VividbooksWorksheetRow[]): VividbooksWorksheetPairingResult {
  const byBlock = new Map<string, VividbooksWorksheetRow[]>();
  for (const r of rows) {
    const k = `${r.chapterId}:${r.contentBlockId ?? "x"}`;
    if (!byBlock.has(k)) byBlock.set(k, []);
    byBlock.get(k)!.push(r);
  }

  const pairs: VividbooksWorksheetPair[] = [];
  const unpaired: VividbooksWorksheetRow[] = [];
  const ambiguous: VividbooksWorksheetPairingResult["ambiguous"] = [];

  for (const group of byBlock.values()) {
    const byKey = new Map<string, VividbooksWorksheetRow[]>();
    for (const r of group) {
      const pk = worksheetPairKey(r.name);
      if (!pk) {
        unpaired.push(r);
        continue;
      }
      if (!byKey.has(pk)) byKey.set(pk, []);
      byKey.get(pk)!.push(r);
    }

    for (const [pairKey, list] of byKey) {
      const w = list.filter((x) => x.variant === "without_pro_vsechny");
      const f = list.filter((x) => x.variant === "for_all");
      if (list.length === 2 && w.length === 1 && f.length === 1) {
        pairs.push({
          pairKey,
          chapterId: list[0].chapterId,
          contentBlockId: list[0].contentBlockId,
          withoutProVsechny: w[0],
          forAll: f[0],
        });
        continue;
      }
      if (list.length === 1) {
        unpaired.push(list[0]);
        continue;
      }
      ambiguous.push({
        pairKey,
        chapterId: list[0].chapterId,
        contentBlockId: list[0].contentBlockId,
        rows: list,
      });
    }
  }

  return { pairs, unpaired, ambiguous };
}

export function worksheetsSummaryFromBooks(books: VividbooksBookManifest[]): VividbooksWorksheetPairingResult {
  const all = books.flatMap((b) => extractMathWorksheetsFromBook(b));
  return pairMathWorksheets(all);
}
