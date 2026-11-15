import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        app: path.resolve(__dirname, "app.html"),
      },
      // Treat browser importmap modules in index.html as external
      external: [
        "three",
        /^three\/.*/,
        "lenis",
      ],
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
