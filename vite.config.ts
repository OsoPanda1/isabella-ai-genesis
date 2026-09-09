import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    {
      name: "browser-node-crypto-shim",
      enforce: "pre",
      resolveId(id, _importer, options) {
        if (!options?.ssr && id === "node:crypto") {
          return new URL("./src/lib/browser-node-crypto.ts", import.meta.url).pathname;
        }
        return null;
      },
    },
    tanstackStart(),
    nitro(),
    viteReact(),
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@tanstack")) return "vendor-tanstack";
            if (id.includes("react") || id.includes("react-dom")) return "vendor-react";
            if (id.includes("@radix-ui")) return "vendor-radix";
            return "vendor";
          }
          return undefined;
        },
      },
    },
  },
  ssr: {
    noExternal: [],
    external: ["three"],
  },
});
