import type { VividbooksFlatLesson } from "./vividbooksTypes";

/** Bezpečnost v chemické laboratoři — kniha 100. */
export const LAB_SAFETY_KNOWLEDGE_ID = 1789;

const STOP = new Set([
  "the",
  "and",
  "pro",
  "aby",
  "jak",
  "je",
  "jsou",
  "jako",
  "nebo",
  "anebo",
  "take",
  "tak",
  "jen",
  "ze",
  "to",
  "tim",
  "tom",
  "od",
  "do",
  "po",
  "pri",
  "nad",
  "pod",
  "bez",
  "pred",
  "za",
  "vlastnosti",
  "priprava",
  "pripravu",
  "dukaz",
  "overeni",
  "reakce",
  "horeni",
  "model",
  "vitaminova",
  "tajne",
  "pismo",
]);

function normalizeCs(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function tokenize(text: string): string[] {
  return normalizeCs(text)
    .split(/[^a-z0-9]+/i)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

/** Doplňkové výrazy podle slugu (normalizovaný řetězec bez pomlček). */
const SLUG_EXTRA_TERMS: { test: (slug: string) => boolean; terms: string[] }[] = [
  { test: (s) => s.includes("chlor") && !s.includes("chlorovodik"), terms: ["chlor", "halogen", "halogeny"] },
  { test: (s) => s.includes("chlorovodik"), terms: ["chlorovod", "kyselina", "vodik"] },
  { test: (s) => s.includes("brom"), terms: ["brom", "halogen"] },
  { test: (s) => s.includes("jod"), terms: ["jod", "halogen"] },
  { test: (s) => s.includes("ethyn") || s.includes("acetyl"), terms: ["ethyn", "alkyn"] },
  { test: (s) => s.includes("methan") || s.includes("alkan"), terms: ["methan", "alkan"] },
  { test: (s) => s.includes("alkohol") || s.includes("ethanol"), terms: ["alkohol", "ethanol", "uhlovodik"] },
  { test: (s) => s.includes("oxid") && s.includes("uhlicit"), terms: ["oxid", "uhlicity", "uhlik"] },
  { test: (s) => s.includes("amoniak") || s.includes("amonny"), terms: ["amoniak", "amony", "chlorid"] },
  { test: (s) => s.includes("vodik"), terms: ["vodik", "vodiku"] },
  { test: (s) => s.includes("sulf") || s.includes("sirovod"), terms: ["sulf", "sirovod", "kyselina", "chlorovod"] },
  { test: (s) => s.includes("neutral"), terms: ["neutral", "hydroxid", "kyselin"] },
  { test: (s) => s.includes("krystal"), terms: ["krystal", "roztok"] },
  { test: (s) => s.includes("separace") || s.includes("sublim"), terms: ["sublim", "odpar", "cist"] },
  { test: (s) => s.includes("plamen"), terms: ["plamen", "barv", "spektr"] },
  { test: (s) => s.includes("kov") || s.includes("beketov") || s.includes("reaktivit"), terms: ["kov", "beketov", "rad"] },
  { test: (s) => s.includes("hlinik") || s.includes("alumin"), terms: ["hlinik", "kov"] },
  { test: (s) => s.includes("zelezo") || s.includes("sira"), terms: ["zelez", "sira", "sulf"] },
  { test: (s) => s.includes("zinek"), terms: ["zinek", "beketov", "kov"] },
  { test: (s) => s.includes("sodik") || s.includes("draslik") || s.includes("lithi"), terms: ["alkal", "kov", "vodik"] },
  { test: (s) => s.includes("organ"), terms: ["organ", "uhlovodik", "alkyl"] },
  { test: (s) => s.includes("kyselin"), terms: ["kyselin", "anion"] },
  { test: (s) => s.includes("hydroxid"), terms: ["hydroxid", "baze"] },
  { test: (s) => s.includes("rozpust"), terms: ["rozpust", "vod", "plyn"] },
  { test: (s) => s.includes("bezpec") || s.includes("hasic"), terms: ["bezpec", "laborator", "hasic"] },
  { test: (s) => s.includes("teplot") && s.includes("rychlost"), terms: ["rychlost", "reakc", "energi"] },
  { test: (s) => s.includes("glukos") || s.includes("fruktos") || s.includes("cukr"), terms: ["sacharid", "uglik"] },
  { test: (s) => s.includes("bilkovin"), terms: ["bilkov", "protein"] },
  { test: (s) => s.includes("halogenu") || s.includes("halogen"), terms: ["halogen", "derivat"] },
  { test: (s) => s.includes("polyethylen") || s.includes("depolymer"), terms: ["polymer", "makromolekul"] },
  { test: (s) => s.includes("fosfor"), terms: ["fosfor", "kyslik"] },
  { test: (s) => s.includes("magn") || s.includes("horcik"), terms: ["horcik", "kov", "oxid"] },
  { test: (s) => s.includes("uhlik") && s.includes("kyslik"), terms: ["uhlik", "kyslik", "oxid"] },
  { test: (s) => s.includes("rtut"), terms: ["rtut", "rozklad"] },
  { test: (s) => s.includes("dichroman"), terms: ["dichroman", "oxid", "redukc"] },
  { test: (s) => s.includes("kyseliny-sirove") || s.includes("kyselinou-sirov"), terms: ["kyselina", "sirov", "sulf"] },
  { test: (s) => s.includes("aluminoterm"), terms: ["hlinik", "oxid", "term"] },
  { test: (s) => s.includes("jodoform"), terms: ["jod", "halogen"] },
  { test: (s) => s.includes("aktivniho-uhli"), terms: ["uhli", "adsorp"] },
  { test: (s) => s.includes("sopka"), terms: ["reakc", "plyn", "kyselina"] },
  { test: (s) => s.includes("vitamin"), terms: ["vitamin", "kyselina"] },
  { test: (s) => s.includes("tajne") || s.includes("pismo"), terms: ["rozpust", "indik"] },
];

function collectSearchTerms(title: string, slug: string): string[] {
  const slugN = normalizeCs(slug.replace(/-/g, " "));
  const fromTitle = tokenize(title);
  const fromSlug = tokenize(slug.replace(/-/g, " "));
  const extra: string[] = [];
  for (const rule of SLUG_EXTRA_TERMS) {
    if (rule.test(slugN)) extra.push(...rule.terms);
  }
  const all = [...fromTitle, ...fromSlug, ...extra];
  return [...new Set(all.map((t) => normalizeCs(t)))].filter((t) => t.length > 2);
}

function scoreLesson(terms: string[], lesson: VividbooksFlatLesson): number {
  const hay = normalizeCs(`${lesson.name} ${lesson.chapterName} ${lesson.bookName}`);
  let score = 0;
  for (const t of terms) {
    if (t.length < 3) continue;
    if (hay.includes(t)) score += 12;
    else if (t.length >= 4) {
      const sub = t.slice(0, Math.min(5, t.length));
      if (hay.includes(sub)) score += 6;
    }
  }
  if (lesson.pdfUrl || lesson.methodicalInspirationPdfUrl) score += 1;
  return score;
}

const FALLBACK_WHEN_EMPTY = [1792, LAB_SAFETY_KNOWLEDGE_ID];

/**
 * Vybere až `max` ID lekcí podle podobnosti názvu pokusu a slugu.
 * Bezpečnost laboratoře (1789) je vždy na začátku seznamu, pokud v manifestu existuje.
 */
export function selectKnowledgeIdsForExperiment(
  experimentSlug: string,
  experimentTitle: string,
  flatLessons: VividbooksFlatLesson[],
  max = 5,
): number[] {
  const terms = collectSearchTerms(experimentTitle, experimentSlug);
  const byId = new Map(flatLessons.map((l) => [l.knowledgeId, l]));

  const scored = flatLessons
    .map((lesson) => ({ lesson, score: scoreLesson(terms, lesson) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked: number[] = [];
  const add = (id: number) => {
    if (picked.includes(id)) return;
    if (!byId.has(id)) return;
    picked.push(id);
  };

  if (byId.has(LAB_SAFETY_KNOWLEDGE_ID)) add(LAB_SAFETY_KNOWLEDGE_ID);

  for (const { lesson } of scored) {
    if (picked.length >= max) break;
    add(lesson.knowledgeId);
  }

  if (picked.length === 0) {
    for (const id of FALLBACK_WHEN_EMPTY) add(id);
  }

  while (picked.length < max && scored.length > 0) {
    const next = scored.find((s) => !picked.includes(s.lesson.knowledgeId));
    if (!next) break;
    add(next.lesson.knowledgeId);
  }

  return picked.slice(0, max);
}
