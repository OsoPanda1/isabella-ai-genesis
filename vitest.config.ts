import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    // node por defecto: no hay tests de componentes DOM; happy-dom queda
    // declarado pero sin instalar localmente (CI lo instala con pnpm).
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["test/unit/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "security",
          environment: "node",
          include: ["test/security/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "bookpi",
          environment: "node",
          include: ["test/bookpi/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          include: ["test/integration/**/*.test.ts"],
        },
      },
    ],
  },
});
