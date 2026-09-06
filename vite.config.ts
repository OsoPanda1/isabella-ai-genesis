import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    command === "build" ? nitro({
      preset: "vercel",
    }) : null,
    viteReact(),
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],
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
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
}));
