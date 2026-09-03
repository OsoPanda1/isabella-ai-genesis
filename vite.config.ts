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
  },
});
