// @lovable.dev/vite-tanstack-config ya incluye tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        "server-only": "vite/client",
      },
    },
    // Excluir dependencias pesadas del bundle SSR de Nitro para prevenir errores Node/Client
    ssr: {
      noExternal: [],
      external: ["three"],
    },
    build: {
      target: "esnext",
      // Separación de chunks para aislamiento de rendimiento
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/three")) {
              return "vendor-three";
            }
            if (id.includes("node_modules/lucide-react")) {
              return "vendor-icons";
            }
          },
        },
      },
    },
  },
});
