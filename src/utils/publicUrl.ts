/** Soubory z `public/` nebo kořenové cesty začínající na `/` — respektuje Vite `base` (např. GitHub Pages). */
export function publicUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${p}`;
}
