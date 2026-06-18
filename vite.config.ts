import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works both on a user/org Pages site (served at
// root) and on a project Pages site (served under /<repo>/). Combined with the
// hash router in App.tsx, this keeps deep links working on GitHub Pages.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
