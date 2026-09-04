// @lovable.dev/vite-tanstack-config ya incluye tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
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
    },
  },
});
