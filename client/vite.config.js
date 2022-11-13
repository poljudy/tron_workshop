import { defineConfig } from "vite";
import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        GlobalPolyFill({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
    },
  },
});
