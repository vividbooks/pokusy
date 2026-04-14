/**
 * Volitelné ruční úpravy výběru lekcí Vividbooks (jinak se používá automatika z vividbooksExperimentMatch.ts).
 */
export type VividbooksLessonOverride = {
  /** Úplně nahradí automatický výběr (stejné ID jako v manifestech). */
  replaceKnowledgeIds?: number[];
  /** Přidá ID na začátek seznamu (před automatiku). */
  prependKnowledgeIds?: number[];
};

export const vividbooksLessonOverrides: Record<string, VividbooksLessonOverride> = {
  // Příklad:
  // "slug-pokusu": { prependKnowledgeIds: [1234] },
};

export function getLessonOverrideForExperiment(slug: string): VividbooksLessonOverride | undefined {
  return vividbooksLessonOverrides[slug];
}
