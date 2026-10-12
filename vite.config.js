import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base relative : le site marche sur GitHub Pages (…/PokeMmoDex/) comme sur un domaine perso.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
