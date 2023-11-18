import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import viteTsconfigPaths from "vite-tsconfig-paths";

import { dependencies } from "./package.json";

const VENDORS = ["react", "react-dom"];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
    }),
    react(),
    viteTsconfigPaths(),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: VENDORS,
          ...renderChunks(dependencies),
        },
      },
    },
  },
});

function renderChunks(deps: Record<string, string>) {
  const chunks = {};
  Object.keys(deps).forEach((key) => {
    if (VENDORS.includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}
