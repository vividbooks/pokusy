import type {
  VividbooksBookManifest,
  VividbooksDocumentItem,
  VividbooksFlatLesson,
} from "./vividbooksTypes";

function normalizeDocuments(raw: unknown): VividbooksDocumentItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((d): d is VividbooksDocumentItem => d != null && typeof d === "object");
}

export function flattenVividbooksLessons(books: VividbooksBookManifest[]): VividbooksFlatLesson[] {
  const out: VividbooksFlatLesson[] = [];
  for (const book of books) {
    for (const ch of book.chapters ?? []) {
      for (const k of ch.knowledge ?? []) {
        out.push({
          bookId: book.id,
          bookName: book.name,
          chapterId: ch.id,
          chapterName: ch.name,
          knowledgeId: k.id,
          name: k.name,
          pdfUrl: k.pdfUrl ?? null,
          extendedPdfUrl: k.extendedPdfUrl ?? null,
          methodicalInspirationPdfUrl: k.methodicalInspirationPdfUrl ?? null,
          previewImageUrl: k.imageUrl ?? null,
          documents: normalizeDocuments(k.documents),
        });
      }
    }
  }
  return out;
}
