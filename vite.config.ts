import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Pro GitHub Pages (projektová stránka): `POKUSY_BASE=/pokusy/ npm run build` */
function viteBase(): string {
  const raw = process.env.POKUSY_BASE?.trim() || "/";
  if (raw === "/") return "/";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export default defineConfig({
  plugins: [react()],
  base: viteBase(),
});
