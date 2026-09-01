// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // FRONTEND/SERVER BOUNDARY
    // -----------------------------------------------
    // 1. Únicamente las variables con prefijo VITE_* se exponen al navegador.
    //    TODO lo demás (secrets, service-role, claves de cifrado) vive en el
    //    servidor y se accede SOLO a través de src/lib/config.ts (Zod).
    // 2. Las dependencias de autoridad/secretos se colocan en ficheros *.server.ts
    //    para evitar su inclusión accidental en el bundle del cliente.
    // 3. El runtime distingue servidor (SSR) de navegador: en código se usa
    //    `import.meta.env.SSR` (true en servidor, false en cliente).
    resolve: {
      alias: {
        // Guarda explícita: cualquier import de server-only desde el cliente
        // debe resolverse a un stub vacío (seguridad por fallo).
        "server-only": "vite/client",
      },
    },
  },
});
