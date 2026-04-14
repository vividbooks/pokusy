import { flattenVividbooksLessons } from "./vividbooksFlatten";
import { selectKnowledgeIdsForExperiment } from "./vividbooksExperimentMatch";
import { getLessonOverrideForExperiment } from "./vividbooksLessonMappings";
import type { VividbooksBookManifest } from "./vividbooksTypes";
import type { VividbooksFlatLesson } from "./vividbooksTypes";

export type VividbooksPanelData = {
  lessons: VividbooksFlatLesson[];
  note?: string;
  missingKnowledgeIds: number[];
};

let booksCache: VividbooksBookManifest[] | null = null;

async function loadBooks(): Promise<VividbooksBookManifest[]> {
  if (!booksCache) {
    const mod = await import("./vividbooksIndex.generated");
    booksCache = mod.vividbooksChemBooks;
  }
  return booksCache;
}

/** Stejná logika jako při sestavování panelu lekcí na detailu pokusu. */
export function resolveKnowledgeIdsForExperiment(
  experimentSlug: string,
  experimentTitle: string,
  flat: VividbooksFlatLesson[],
): number[] {
  const override = getLessonOverrideForExperiment(experimentSlug);
  if (override?.replaceKnowledgeIds?.length) {
    return override.replaceKnowledgeIds;
  }
  const auto = selectKnowledgeIdsForExperiment(experimentSlug, experimentTitle, flat, 5);
  if (override?.prependKnowledgeIds?.length) {
    const merged = [...override.prependKnowledgeIds, ...auto];
    return [...new Set(merged)].slice(0, 6);
  }
  return auto;
}

/**
 * Načte manifesty (lazy chunk) a sestaví lekce podle názvu pokusu + volitelných override.
 */
export async function loadVividbooksPanelDataForExperiment(
  experimentSlug: string,
  experimentTitle: string,
): Promise<VividbooksPanelData | null> {
  const books = await loadBooks();
  const flat = flattenVividbooksLessons(books);
  const knowledgeIds = resolveKnowledgeIdsForExperiment(experimentSlug, experimentTitle, flat);

  const byId = new Map(flat.map((l) => [l.knowledgeId, l]));
  const lessons: VividbooksFlatLesson[] = [];
  const missingKnowledgeIds: number[] = [];

  for (const id of knowledgeIds) {
    const lesson = byId.get(id);
    if (lesson) lessons.push(lesson);
    else missingKnowledgeIds.push(id);
  }

  return {
    lessons,
    note: "Automaticky vybrané lekce z chemických učebnic Vividbooks (offline manifesty). PDF podle licence školy / účtu.",
    missingKnowledgeIds,
  };
}
