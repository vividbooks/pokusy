export type CardTint = "sky" | "cream" | "mint" | "blush";

export type ExperimentItem = {
  slug: string;
  title: string;
  tint: CardTint;
  /** Náhledová fotka (volitelné — jinak se použije pastel podle `tint`). */
  thumbnailUrl?: string;
  /** Kanonická stránka pokusu na eBedox (nebo jiný zdroj). */
  sourceUrl: string;
};

/** Barvy „záložky“ složky — stejný princip jako u 3D modelů. */
export type MainCategoryFolderTheme = {
  tab: string;
  tabSoft: string;
  onTab: string;
};

export type ExperimentCategoryDef = {
  slug: string;
  title: string;
  pageHeadline: string;
  folderTheme: MainCategoryFolderTheme;
  experiments: ExperimentItem[];
};
