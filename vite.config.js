import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false, // permite usar otro puerto si el 3000 está ocupado
  },
  build: {
    outDir: "dist",
  },
});
