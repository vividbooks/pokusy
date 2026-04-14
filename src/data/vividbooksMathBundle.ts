/**
 * Předpočítané pracovní listy (matematika) z manifestů v `vividbooksIndex.generated.ts`.
 * Po `npm run data:vividbooks` jsou data aktuální.
 */
import { vividbooksMathBooks } from "./vividbooksIndex.generated";
import {
  extractMathWorksheetsFromBook,
  worksheetsSummaryFromBooks,
  type VividbooksWorksheetPairingResult,
} from "./vividbooksMathWorksheets";

export function getMathWorksheetsSummary(): VividbooksWorksheetPairingResult {
  return worksheetsSummaryFromBooks(vividbooksMathBooks);
}

export function getMathWorksheetsFlat() {
  return vividbooksMathBooks.flatMap((b) => extractMathWorksheetsFromBook(b));
}
