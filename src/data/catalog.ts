import type { ExperimentCategoryDef, ExperimentItem } from "../types";
import { ebedoxExperiments } from "./ebedox-experiments.generated";
import { experimentThumbnailOverrides } from "./experimentThumbnailOverrides";

function applyThumbnailOverrides(items: ExperimentItem[]): ExperimentItem[] {
  return items.map((e) => {
    const url = experimentThumbnailOverrides[e.slug];
    return url ? { ...e, thumbnailUrl: url } : e;
  });
}

/**
 * Katalog: kompletní seznam z oficiální stránky eBedox.
 * Aktualizace dat: `npm run data:ebedox`
 */
export const experimentCategories: ExperimentCategoryDef[] = [
  {
    slug: "seznam",
    title: "Chemické pokusy",
    pageHeadline: "Chemické pokusy",
    folderTheme: {
      tab: "#6e7ec8",
      tabSoft: "#eaebf8",
      onTab: "#ffffff",
    },
    experiments: applyThumbnailOverrides(ebedoxExperiments),
  },
];

/** Výchozí zobrazení po `/`. */
export const defaultCategorySlug = "seznam";

export function getExperimentCategory(slug: string): ExperimentCategoryDef | undefined {
  return experimentCategories.find((c) => c.slug === slug);
}

export function getExperiment(
  categorySlug: string,
  experimentSlug: string,
): { category: ExperimentCategoryDef; experiment: ExperimentItem } | undefined {
  const category = getExperimentCategory(categorySlug);
  if (!category) return undefined;
  const experiment = category.experiments.find((e) => e.slug === experimentSlug);
  if (!experiment) return undefined;
  return { category, experiment };
}
