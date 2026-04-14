/**
 * Zjednodušené typy odpovídající JSON z GET /v1/books/{id}?user-code=…
 * Plná pole z API jsou volitelná — manifesty se mění.
 */

export type VividbooksAnimationItem = {
  id?: number;
  animationUrl?: string | null;
  type?: string;
};

export type VividbooksAnimation = {
  type?: string | null;
  items?: VividbooksAnimationItem[];
};

/** Položka z pole `documents` u lekce nebo u content bloku (PDF, pracovní list, …). */
export type VividbooksDocumentItem = {
  id?: number;
  type?: string | null;
  name?: string | null;
  documentUrl?: string | null;
  previewUrl?: string | null;
  interactiveWorksheets?: unknown;
  interactiveSolutions?: unknown;
  abcdTests?: unknown;
  solutionUrl?: string | null;
};

/** Blok obsahu v kapitole (matematika: pracovní listy v `documents`). */
export type VividbooksContentBlock = {
  id?: number;
  name?: string | null;
  documents?: VividbooksDocumentItem[] | unknown;
};

export type VividbooksKnowledge = {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isDemo?: boolean;
  animation?: VividbooksAnimation | null;
  questions?: string | null;
  methodicalInspiration?: string | null;
  pdfUrl?: string | null;
  extendedPdfUrl?: string | null;
  methodicalInspirationPdfUrl?: string | null;
  documents?: VividbooksDocumentItem[] | unknown;
};

export type VividbooksChapter = {
  id: number;
  name: string;
  knowledge: VividbooksKnowledge[];
  /** Matematické učebnice: pracovní listy jsou zde, ne v `knowledge`. */
  contentBlocks?: VividbooksContentBlock[];
};

export type VividbooksBookManifest = {
  id: number;
  name: string;
  description?: string | null;
  authors?: string | null;
  chapters: VividbooksChapter[];
};

/** Zploštěná lekce pro UI (jedna položka ze všech knih). */
export type VividbooksFlatLesson = {
  bookId: number;
  bookName: string;
  chapterId: number;
  chapterName: string;
  knowledgeId: number;
  name: string;
  pdfUrl: string | null;
  extendedPdfUrl: string | null;
  methodicalInspirationPdfUrl: string | null;
  previewImageUrl: string | null;
  documents: VividbooksDocumentItem[];
};

/** Jedna položka pracovního listu vytažená z manifestu (matematika). */
export type VividbooksWorksheetRow = {
  bookId: number;
  bookName: string;
  chapterId: number;
  chapterName: string;
  contentBlockId: number | null;
  contentBlockName: string | null;
  documentId: number | null;
  name: string;
  /** Bez suffixu „(pro všechny)“ — druhá stopa (např. krok za krokem); API to explicitně nejmenuje. */
  variant: "without_pro_vsechny" | "for_all";
  documentUrl: string | null;
  previewUrl: string | null;
};

/** Pár dvou variant (bez „pro všechny“ × s „pro všechny“) ve stejném content bloku. */
export type VividbooksWorksheetPair = {
  pairKey: string;
  chapterId: number;
  contentBlockId: number | null;
  withoutProVsechny: VividbooksWorksheetRow;
  forAll: VividbooksWorksheetRow;
};
