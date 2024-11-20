// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";

// Get the current timestamp
const timestamp = new Date().getTime();

export default defineConfig({
  root: "src",
  server: {
    cors: "*",
    hmr: {},
    fs: {
      allow: [".."],
    },
  },
  optimizeDeps: {
    include: ["gsap"],
  },
  build: {
    minify: true,
    emptyOutDir: true,
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: resolve(__dirname, "/js/index.js"),
      output: {
        // Append timestamp to the output filename
        entryFileNames: `[name].${timestamp}.js`,
        format: "umd",
        compact: true,
      },
    },
  },
});
