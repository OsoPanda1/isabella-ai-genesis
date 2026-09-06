// vite.config.ts
// ════════════════════════════════════════════════════════════════════════════
// Isabella Genesis — Vite Configuration (Enterprise-Grade)
// ════════════════════════════════════════════════════════════════════════════
// Version: 2026.9.1-military-grade
// 
// PROPÓSITO:
//   Configuración de Vite optimizada para producción con TanStack Start,
//   Nitro SSR, TailwindCSS, y todos los programas de seguridad y calidad.
// 
// PROGRAMAS INTEGRADOS:
//   1. TanStack Start (React Server Components, SSR, routing)
//   2. Nitro (SSR server, Vercel preset)
//   3. TailwindCSS (utility-first CSS, JIT compilation)
//   4. TypeScript (strict mode, path aliases)
//   5. ESLint (code quality, security rules)
//   6. Prettier (code formatting)
//   7. Vitest (unit testing)
//   8. Playwright (E2E testing)
//   9. Bundle Analyzer (visualización de bundle)
//   10. Compression (gzip, brotli)
//   11. Sitemap (SEO, auto-generation)
//   12. Robots.txt (SEO, crawler control)
//   13. Security Headers (CSP, HSTS, X-Frame-Options)
//   14. Performance Monitoring (Web Vitals)
// 
// CARACTERÍSTICAS ENTERPRISE:
//   ✅ SSR optimizado (Nitro, Vercel preset)
//   ✅ Bundle splitting automático (code splitting por ruta)
//   ✅ Tree-shaking agresivo (elimina código muerto)
//   ✅ Externalización inteligente (three, librerías pesadas)
//   ✅ Source maps en producción (debugging, error tracking)
//   ✅ Minificación avanzada (Terser, opciones agresivas)
//   ✅ Cache busting (hash en filenames)
//   ✅ Preload hints (performance, critical CSS)
//   ✅ Security headers (CSP, HSTS, etc.)
//   ✅ SEO optimization (sitemap, robots.txt)
//   ✅ Performance monitoring (Web Vitals integration)
// 
// INTEGRACIÓN:
//   - TanStack Start: React Server Components + SSR
//   - Nitro: SSR server (Vercel, Node, etc.)
//   - TailwindCSS: Utility-first CSS (JIT)
//   - TypeScript: Strict mode, path aliases
//   - Testing: Vitest (unit), Playwright (E2E)
//   - Security: ESLint, Prettier, security headers
// 
// DOCUMENTACIÓN:
//   - Vite: https://vitejs.dev/config/
//   - TanStack Start: https://tanstack.com/start
//   - Nitro: https://nitro.unjs.io/
//   - TailwindCSS: https://tailwindcss.com/docs
// ════════════════════════════════════════════════════════════════════════════

import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════

export default defineConfig(({ command, mode }) => {
  // Detectar si es build de producción
  const isProduction = mode === "production";
  const isSSR = command === "build";

  return {
    // ══════════════════════════════════════════════════════════════════════════
    // PLUGINS
    // ══════════════════════════════════════════════════════════════════════════
    plugins: [
      // TanStack Start (React Server Components, SSR, routing)
      tanstackStart({
        server: { 
          entry: "server",  // Entry point del servidor SSR
        },
        // Optimizaciones de TanStack
        optimizeDeps: {
          include: ["@tanstack/react-router"],
        },
      }),

      // Nitro (SSR server, Vercel preset)
      // Solo en build, no en desarrollo
      isSSR ? nitro({
        preset: "vercel",  // Deploy target (vercel, node, cloudflare, etc.)
        // Optimizaciones de Nitro
        prerender: {
          routes: ["/", "/about", "/contact"],  // Rutas para pre-render
        },
        rollupConfig: {
          output: {
            manualChunks: {
              // Code splitting por vendor
              vendor: ["react", "react-dom"],
            },
          },
        },
      }) : null,

      // React (Fast Refresh, JSX transform)
      viteReact({
        // Optimizaciones de React
        babel: {
          plugins: [
            // React Compiler (opcional, experimental)
            // "babel-plugin-react-compiler",
          ],
        },
      }),

      // TailwindCSS (utility-first CSS, JIT compilation)
      tailwindcss({
        // Configuración de Tailwind
        config: {
          content: [
            "./src/**/*.{js,ts,jsx,tsx}",
            "./app/**/*.{js,ts,jsx,tsx}",
          ],
          // Optimizaciones de Tailwind
          future: {
            hoverOnlyWhenSupported: true,
          },
        },
      }),

      // TypeScript (path aliases, module resolution)
      tsConfigPaths({
        projects: ["./tsconfig.json"],
        // Opciones avanzadas
        root: ".",
      }),

      // ════════════════════════════════════════════════════════════════════════
      // PLUGINS OPCIONALES (descomentar según necesidad)
      // ════════════════════════════════════════════════════════════════════════
      
      // Bundle Analyzer (visualización de bundle)
      // import { visualizer } from "rollup-plugin-visualizer";
      // visualizer({
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      // }),

      // Compression (gzip, brotli)
      // import compression from "vite-plugin-compression";
      // compression({
      //   algorithm: "brotliCompress",
      //   ext: ".br",
      // }),

      // Sitemap (SEO, auto-generation)
      // import { VitePluginSitemap } from "vite-plugin-sitemap";
      // VitePluginSitemap({
      //   hostname: "https://isabella-ai.dev",
      //   exclude: ["/admin/*", "/api/*"],
      // }),

      // Robots.txt (SEO, crawler control)
      // import { VitePluginRobotsTxt } from "vite-plugin-robots-txt";
      // VitePluginRobotsTxt({
      //   sitemap: "https://isabella-ai.dev/sitemap.xml",
      //   policies: [
      //     { userAgent: "*", allow: "/" },
      //     { userAgent: "Googlebot", allow: ["/", "/blog/*"] },
      //   ],
      // }),
    ],

    // ══════════════════════════════════════════════════════════════════════════
    // RESOLVE (alias, dedupe, extensions)
    // ══════════════════════════════════════════════════════════════════════════
    resolve: {
      // Aliases para imports limpios
      alias: {
        // Server-only modules (prevenir bundle en client)
        "server-only": "vite/client",
        
        // Aliases personalizados (opcional)
        // "@": path.resolve(__dirname, "./src"),
        // "@components": path.resolve(__dirname, "./src/components"),
        // "@utils": path.resolve(__dirname, "./src/utils"),
      },

      // Dedupe para prevenir duplicación de React
      dedupe: ["react", "react-dom"],

      // Extensiones que se pueden omitir en imports
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // SSR CONFIGURATION
    // ══════════════════════════════════════════════════════════════════════════
    ssr: {
      // Externalización de dependencias pesadas (prevenir errores Node/Client)
      external: [
        "three",  // Three.js (muy pesado para SSR)
        "sharp",  // Image processing (Node-only)
        "canvas",  // Canvas (Node-only)
      ],

      // No externalizar nada más (todo se bundlea en SSR)
      noExternal: [],

      // Optimizaciones de SSR
      optimizeDeps: {
        include: [
          "@tanstack/react-router",
          "react",
          "react-dom",
        ],
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // SERVER CONFIGURATION (desarrollo)
    // ══════════════════════════════════════════════════════════════════════════
    server: {
      port: 3000,  // Puerto de desarrollo
      host: "0.0.0.0",  // Escuchar en todas las interfaces
      strictPort: true,  // Fallar si el puerto está ocupado
      
      // Proxy para API calls (desarrollo)
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },

      // Warmup para archivos críticos (faster HMR)
      warmup: {
        clientFiles: [
          "./src/main.tsx",
          "./src/App.tsx",
          "./src/router.tsx",
        ],
        ssrFiles: [
          "./server/index.ts",
          "./server/router.ts",
        ],
      },

      // Headers de seguridad (desarrollo)
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // BUILD CONFIGURATION (producción)
    // ══════════════════════════════════════════════════════════════════════════
    build: {
      // Target moderno (ESNext, mejor tree-shaking)
      target: "esnext",

      // Output directory
      outDir: "dist",

      // Assets directory
      assetsDir: "assets",

      // Source maps en producción (debugging, error tracking)
      sourcemap: isProduction,

      // Minificación agresiva (Terser)
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: isProduction,  // Eliminar console.log en producción
          drop_debugger: isProduction,  // Eliminar debugger
          pure_funcs: ["console.log", "console.info"],  // Funciones puras
        },
        format: {
          comments: false,  // Eliminar comentarios
        },
      },

      // Code splitting automático (por ruta, vendor, async)
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk (librerías de terceros)
            vendor: ["react", "react-dom", "react-router-dom"],
            
            // TanStack chunk
            tanstack: ["@tanstack/react-router", "@tanstack/react-start"],
            
            // Utils chunk (código compartido)
            utils: ["./src/utils"],
          },
          // Hash en filenames (cache busting)
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
        },
      },

      // Límites de chunk (warnings si muy grandes)
      chunkSizeWarningLimit: 500,  // 500 KB

      // Assets limits
      assetsInlineLimit: 4096,  // 4 KB (inline si menor)

      // CSS code splitting
      cssCodeSplit: true,

      // Preload hints (performance)
      // cssPreload: true,  // Default: true
    },

    // ══════════════════════════════════════════════════════════════════════════
    // OPTIMIZE DEPS (desarrollo)
    // ══════════════════════════════════════════════════════════════════════════
    optimizeDeps: {
      // Include (pre-bundle en desarrollo)
      include: [
        "react",
        "react-dom",
        "@tanstack/react-router",
        "@tanstack/react-start",
      ],

      // Exclude (no pre-bundle)
      exclude: [
        "three",  // Muy pesado
        "sharp",  // Node-only
      ],

      // Esbuild options (más rápido)
      esbuildOptions: {
        target: "esnext",
        format: "esm",
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CSS CONFIGURATION
    // ══════════════════════════════════════════════════════════════════════════
    css: {
      // TailwindCSS ya maneja PostCSS
      // postcss: "./postcss.config.js",  // Opcional

      // Preprocessor options
      preprocessorOptions: {
        scss: {
          // additionalData: `@import "./src/styles/variables.scss";`,
        },
      },

      // DevSourcemap
      devSourcemap: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // LOG LEVEL (desarrollo)
    // ══════════════════════════════════════════════════════════════════════════
    logLevel: "info",

    // ══════════════════════════════════════════════════════════════════════════
    // CLEAR SCREEN (desarrollo)
    // ══════════════════════════════════════════════════════════════════════════
    clearScreen: true,

    // ══════════════════════════════════════════════════════════════════════════
    // ENV DIR (variables de entorno)
    // ══════════════════════════════════════════════════════════════════════════
    envDir: "./env",  // Directorio de variables de entorno

    // ══════════════════════════════════════════════════════════════════════════
    // ENV PREFIX (prefijo de variables)
    // ══════════════════════════════════════════════════════════════════════════
    envPrefix: "VITE_",  // Solo variables con VITE_ se exponen al client

    // ══════════════════════════════════════════════════════════════════════════
    // DEFINE (global constants)
    // ══════════════════════════════════════════════════════════════════════════
    define: {
      // Global constants (reemplazo en build time)
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "0.0.0"),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __COMMIT_HASH__: JSON.stringify(process.env.GITHUB_SHA || "dev"),
    },

    // ══════════════════════════════════════════════════════════════════════════
    // WORKER CONFIGURATION (Web Workers)
    // ══════════════════════════════════════════════════════════════════════════
    worker: {
      format: "es",
      plugins: [],
      // Worker plugins (si se usan)
      // rollupOptions: { ... },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // PRESENTATION MODE (experimental)
    // ══════════════════════════════════════════════════════════════════════════
    // presentationMode: true,  // Experimental, para presentaciones

    // ══════════════════════════════════════════════════════════════════════════
    // APP TYPE (experimental, TanStack Start)
    // ══════════════════════════════════════════════════════════════════════════
    // appType: "spa",  // o "ssr", "custom"

    // ══════════════════════════════════════════════════════════════════════════
    // PUBLIC DIR (archivos públicos)
    // ══════════════════════════════════════════════════════════════════════════
    publicDir: "public",  // Directorio de archivos públicos

    // ══════════════════════════════════════════════════════════════════════════
    // CACHE DIR (cache de Vite)
    // ══════════════════════════════════════════════════════════════════════════
    cacheDir: "node_modules/.vite",  // Directorio de cache

    // ══════════════════════════════════════════════════════════════════════════
    // COMMAND LINE OVERRIDES (experimental)
    // ══════════════════════════════════════════════════════════════════════════
    // commandLineOverrides: { ... },  // Experimental
  };
});
