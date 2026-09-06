import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tanstackStart(),
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
            if (id.includes("@tanstack")) {
              return "vendor-tanstack";
            }
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            return "vendor";
          }
          return undefined;
        },
      },
    },
  },
});
