import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

/**
 * CONFIGURACIÓN DE TESTS (vitest.config.ts)
 * -----------------------------------------------------------------
 * Proyectos de test activos:
 *   unit     → tests rápidos y aislados (test/unit/**)
 *   security → vectores de seguridad (test/security/**)
 *   bookpi   → invariantes criptográficas del ledger (test/bookpi/**)
 *
 * (En este repositorio no existen directorios test/integration ni
 * test/e2e: eliminados para no exponer proyectos/skripts muertos en CI.)
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
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
          name: "security",
          include: ["test/security/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "bookpi",
          include: ["test/bookpi/**/*.test.ts"],
        },
      },
    ],
  },
});
