import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [
    {
      name: "browser-node-crypto-shim",
      enforce: "pre",
      resolveId(id, _importer, options) {
        if (!options?.ssr && id === "node:crypto") {
          return fileURLToPath(new URL("./src/lib/browser-node-crypto.ts", import.meta.url));
        }
        return null;
      },
    },
    tanstackStart(),
    react(),
    nitro(),
    tailwindcss(),
    {
      name: "fix-jsxDEV-production",
      enforce: "post",
      generateBundle(_options, bundle) {
        for (const file of Object.values(bundle)) {
          if (
            file.type === "chunk" &&
            typeof file.code === "string" &&
            file.code.includes("jsxDEV")
          ) {
            file.code = file.code.replace(/\.jsxDEV/g, ".jsx").replace(/\.jsxsDEV/g, ".jsxs");
          }
        }
      },
    },
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": "vite/client",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
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
