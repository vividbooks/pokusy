/* eslint-disable */
/**
 * Automaticky generováno: node scripts/fetch-vividbooks-manifests.mjs
 * Zdroj: https://api.vividbooks.com/v1/books/{id}?user-code=…
 */
import type { VividbooksBookManifest } from "./vividbooksTypes";

import vividbooksChem73 from "./vividbooks/vividbooks-chem-73.json";
import vividbooksChem82 from "./vividbooks/vividbooks-chem-82.json";
import vividbooksChem88 from "./vividbooks/vividbooks-chem-88.json";
import vividbooksChem91 from "./vividbooks/vividbooks-chem-91.json";
import vividbooksChem94 from "./vividbooks/vividbooks-chem-94.json";
import vividbooksChem97 from "./vividbooks/vividbooks-chem-97.json";
import vividbooksChem100 from "./vividbooks/vividbooks-chem-100.json";
import vividbooksChem103 from "./vividbooks/vividbooks-chem-103.json";
import vividbooksMath105 from "./vividbooks/vividbooks-math-105.json";
import vividbooksMath106 from "./vividbooks/vividbooks-math-106.json";

export const vividbooksChemBooks: VividbooksBookManifest[] = [
  vividbooksChem73 as VividbooksBookManifest,
  vividbooksChem82 as VividbooksBookManifest,
  vividbooksChem88 as VividbooksBookManifest,
  vividbooksChem91 as VividbooksBookManifest,
  vividbooksChem94 as VividbooksBookManifest,
  vividbooksChem97 as VividbooksBookManifest,
  vividbooksChem100 as VividbooksBookManifest,
  vividbooksChem103 as VividbooksBookManifest,
];

export const vividbooksMathBooks: VividbooksBookManifest[] = [
  vividbooksMath105 as VividbooksBookManifest,
  vividbooksMath106 as VividbooksBookManifest,
];
