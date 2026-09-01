import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

/**
 * CONFIGURACIÓN DE TESTS (vitest.config.ts)
 * -----------------------------------------------------------------
 * Proyectos de test:
 *   unit        → tests rápidos y aislados (test/unit/**)
 *   integration → lógica con dependencias reales/inyectadas (test/integration/**)
 *   e2e         → flujos de extremo a extremo (test/e2e/**)
 *   security    → vectores de seguridad (test/security/**)
 *
 * Los tests unitarios e de integración usan alias @/* y corren en
 * Node (sin DOM). Los e2e/security se definen según si requieren DOM.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["test/unit/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["test/integration/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          include: ["test/e2e/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "security",
          include: ["test/security/**/*.test.ts"],
        },
      },
    ],
  },
});
