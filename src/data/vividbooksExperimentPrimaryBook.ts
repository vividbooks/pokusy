import { vividbooksChemBooks } from "./vividbooksIndex.generated";
import { LAB_SAFETY_KNOWLEDGE_ID } from "./vividbooksExperimentMatch";
import { flattenVividbooksLessons } from "./vividbooksFlatten";
import { resolveKnowledgeIdsForExperiment } from "./vividbooksResolve";
import type { ExperimentItem } from "../types";

const flatAll = flattenVividbooksLessons(vividbooksChemBooks);
const byKnowledgeId = new Map(flatAll.map((l) => [l.knowledgeId, l]));

/**
 * Kniha z první „obsahové“ lekce (přeskočí úvod o bezpečnosti 1789, pokud je jen na začátku).
 */
export function getPrimaryVividbooksBookForExperiment(
  experimentSlug: string,
  experimentTitle: string,
): { bookId: number; bookName: string } | null {
  const ids = resolveKnowledgeIdsForExperiment(experimentSlug, experimentTitle, flatAll);
  for (const id of ids) {
    if (id === LAB_SAFETY_KNOWLEDGE_ID) continue;
    const lesson = byKnowledgeId.get(id);
    if (lesson) return { bookId: lesson.bookId, bookName: lesson.bookName };
  }
  for (const id of ids) {
    const lesson = byKnowledgeId.get(id);
    if (lesson) return { bookId: lesson.bookId, bookName: lesson.bookName };
  }
  return null;
}

export type VividbooksBookFilterOption = {
  bookId: number;
  bookName: string;
  slugCount: number;
};

export type ExperimentVividbooksBookMeta = {
  slugToBook: Map<string, { bookId: number; bookName: string } | null>;
  bookOptions: VividbooksBookFilterOption[];
};

/** Jedno načtení: mapa slug → kniha + seřazené bobánky pro filtr. */
export function buildVividbooksCatalogMeta(experiments: ExperimentItem[]): ExperimentVividbooksBookMeta {
  const slugToBook = new Map<string, { bookId: number; bookName: string } | null>();
  const counts = new Map<number, { bookName: string; slugCount: number }>();
  for (const exp of experiments) {
    const b = getPrimaryVividbooksBookForExperiment(exp.slug, exp.title);
    slugToBook.set(exp.slug, b);
    if (b) {
      const cur = counts.get(b.bookId) ?? { bookName: b.bookName, slugCount: 0 };
      cur.slugCount += 1;
      cur.bookName = b.bookName;
      counts.set(b.bookId, cur);
    }
  }
  const bookOptions = [...counts.entries()]
    .map(([bookId, { bookName, slugCount }]) => ({ bookId, bookName, slugCount }))
    .sort((a, b) => a.bookName.localeCompare(b.bookName, "cs"));
  return { slugToBook, bookOptions };
}
