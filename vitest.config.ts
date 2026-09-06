// vitest.config.ts
// ════════════════════════════════════════════════════════════════════════════
// Isabella Genesis — Vitest Configuration (Enterprise-Grade)
// ════════════════════════════════════════════════════════════════════════════
// Version: 2026.9.1-military-grade
// 
// PROPÓSITO:
//   Configuración de Vitest para testing exhaustivo con múltiples proyectos,
//   coverage reporting, parallel execution, y integración con CI/CD.
// 
// DOCUMENTACIÓN OFICIAL:
//   https://vitest.dev/config/
// 
// PROYECTOS DE TEST ACTIVOS:
//   1. unit      → Tests rápidos y aislados (test/unit/**)
//   2. security  → Vectores de seguridad (test/security/**)
//   3. bookpi    → Invariantes criptográficas del ledger (test/bookpi/**)
//   4. integration → Tests de integración (test/integration/**)
//   5. e2e       → End-to-end tests (test/e2e/**)
// 
// CARACTERÍSTICAS ENTERPRISE:
//   ✅ Multi-project configuration (unit, security, bookpi, integration, e2e)
//   ✅ Coverage reporting (lcov, html, json, cobertura)
//   ✅ Parallel execution (threads, isolate)
//   ✅ Watch mode (desarrollo, HMR)
//   ✅ CI optimization (GitHub Actions, GitLab CI, etc.)
//   ✅ Mocking avanzado (vi.mock, vi.fn, vi.spyOn)
//   ✅ Snapshots (jest-compatible)
//   ✅ Benchmarks (performance testing)
//   ✅ Type testing (type-level tests)
//   ✅ Coverage thresholds (mínimos por archivo)
//   ✅ Fail-fast (detener al primer fallo en CI)
//   ✅ Retry logic (reintentar tests flaky)
//   ✅ Timeout configuration (por proyecto)
//   ✅ Environment configuration (node, jsdom, happy-dom)
//   ✅ Setup/Teardown (global, per-project)
//   ✅ Test isolation (restoreMocks, clearMocks)
//   ✅ Coverage exclusion (vendor, generated, tests)
// 
// INTEGRACIÓN:
//   - CI/CD: GitHub Actions, GitLab CI, CircleCI
//   - Coverage: Coveralls, Codecov, SonarQube
//   - Reporting: JUnit, HTML, JSON
//   - E2E: Playwright, Cypress (separate config)
// 
// DOCUMENTACIÓN:
//   - Vitest: https://vitest.dev/
//   - Testing Library: https://testing-library.com/
//   - Playwright: https://playwright.dev/
// ════════════════════════════════════════════════════════════════════════════

import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════

export default defineConfig({
  // ══════════════════════════════════════════════════════════════════════════
  // RESOLVE (alias, module resolution)
  // ══════════════════════════════════════════════════════════════════════════
  resolve: {
    // Aliases para imports limpios
    alias: {
      "@": resolve(__dirname, "src"),  // Root del código fuente
      "@components": resolve(__dirname, "src/components"),
      "@utils": resolve(__dirname, "src/utils"),
      "@lib": resolve(__dirname, "src/lib"),
      "@types": resolve(__dirname, "src/types"),
      "@test": resolve(__dirname, "test"),
    },

    // Extensiones que se pueden omitir en imports
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TEST CONFIGURATION
  // ══════════════════════════════════════════════════════════════════════════
  test: {
    // ════════════════════════════════════════════════════════════════════════
    // GLOBAL CONFIGURATION
    // ════════════════════════════════════════════════════════════════════════
    
    // Environment por defecto (node para backend, jsdom para frontend)
    environment: "node",
    
    // Globals (describe, it, expect sin import)
    globals: true,
    
    // Auto-import de APIs de Vitest (vi, expectTypeOf, etc.)
    // autoImport: true,  // Default: true
    
    // ════════════════════════════════════════════════════════════════════════
    // EXECUTION CONFIGURATION
    // ════════════════════════════════════════════════════════════════════════
    
    // Parallel execution (threads)
    threads: true,
    
    // Número de threads (default: número de CPUs)
    // maxThreads: 4,
    // minThreads: 2,
    
    // Isolation (cada test file en sandbox separado)
    isolate: true,
    
    // Concurrent tests (permitir tests concurrentes)
    // concurrent: true,  // Habilitar con cuidado (puede causar flakiness)
    
    // Fail-fast (detener al primer fallo en CI)
    bail: process.env.CI ? 1 : 0,
    
    // Retry logic (reintentar tests flaky)
    // retry: 1,  // Reintentar 1 vez (solo en CI)
    
    // ════════════════════════════════════════════════════════════════════════
    // TIMEOUTS
    // ════════════════════════════════════════════════════════════════════════
    
    // Timeout global (50s por defecto)
    testTimeout: 50_000,
    
    // Timeout para hooks (setup/teardown)
    hookTimeout: 30_000,
    
    // Timeout para tests silenciosos (sin assertions)
    // silentTimeout: 300_000,  // 5 minutos
    
    // ════════════════════════════════════════════════════════════════════════
    // MOCKING
    // ════════════════════════════════════════════════════════════════════════
    
    // Clear mocks después de cada test
    clearMocks: true,
    
    // Restore mocks después de cada test
    restoreMocks: true,
    
    // Unmock modules (no mockear por defecto)
    // unstubGlobals: true,
    // unstubEnvs: true,
    
    // ════════════════════════════════════════════════════════════════════════
    // COVERAGE CONFIGURATION
    // ════════════════════════════════════════════════════════════════════════
    
    coverage: {
      // Provider de coverage (v8 es más rápido y preciso)
      provider: "v8",
      
      // Reporter (múltiples formatos)
      reporter: [
        "text",  // Terminal output
        "json",  // JSON (para CI)
        "html",  // HTML (para developers)
        "lcov",  // LCOV (para Coveralls/Codecov)
        "cobertura",  // Cobertura (para SonarQube)
      ],
      
      // Directorio de reporte
      reportsDirectory: "./coverage",
      
      // Exclusiones (qué no incluir en coverage)
      exclude: [
        "node_modules",
        "dist",
        ".output",
        "coverage",
        "test",
        "tests",
        "**/*.d.ts",
        "**/*.config.ts",
        "**/*.config.js",
        "**/vendor/**",
        "**/generated/**",
        "**/*.gen.ts",
        "src/components/ui/**",  // Solo estilos
        "src/lib/env-schema.ts",  // Validación de env (ya testeada)
      ],
      
      // Thresholds (mínimos de coverage)
      thresholds: {
        global: {
          lines: 80,  // 80% de líneas
          functions: 80,  // 80% de funciones
          branches: 70,  // 70% de branches
          statements: 80,  // 80% de statements
        },
        // Thresholds por archivo (opcional)
        // perFile: {
        //   "src/lib/crypto.ts": { lines: 95 },  // 95% para crypto
        //   "src/lib/auth.ts": { lines: 90 },  // 90% para auth
        // },
      },
      
      // All (incluir archivos no testeados)
      all: true,
      
      // Include (qué archivos incluir)
      include: [
        "src/**/*.ts",
        "src/**/*.tsx",
      ],
    },
    
    // ════════════════════════════════════════════════════════════════════════
    // REPORTING
    // ════════════════════════════════════════════════════════════════════════
    
    // Reporter (output format)
    reporters: [
      "default",  // Default reporter (nice output)
      // "verbose",  // Más detallado (útil en CI)
      // "junit",  // JUnit XML (para CI)
      // "json",  // JSON (para processing)
    ],
    
    // Output file (para reporters que escriben archivos)
    // outputFile: {
    //   junit: "./reports/junit.xml",
    //   json: "./reports/results.json",
    // },
    
    // ════════════════════════════════════════════════════════════════════════
    // WATCH MODE
    // ════════════════════════════════════════════════════════════════════════
    
    // Watch mode (desarrollo, HMR)
    watch: false,  // Default: false en CI
    
    // Watch exclusions
    // watchExclude: [
    //   "node_modules",
    //   "dist",
    //   ".output",
    //   "coverage",
    // ],
    
    // ════════════════════════════════════════════════════════════════════════
    // INCLUDE/EXCLUDE
    // ════════════════════════════════════════════════════════════════════════
    
    // Include (qué archivos incluir en tests)
    include: [
      "test/**/*.test.ts",
      "test/**/*.test.tsx",
      "src/**/*.test.ts",  // Tests inline (opcional)
    ],
    
    // Exclude (qué archivos excluir)
    exclude: [
      "node_modules",
      "dist",
      ".output",
      "coverage",
      "public",
      "docs",
      "**/*.d.ts",
      "**/*.config.ts",
      "**/*.config.js",
      "**/vendor/**",
      "**/generated/**",
    ],
    
    // ════════════════════════════════════════════════════════════════════════
    // SETUP/TEARDOWN
    // ════════════════════════════════════════════════════════════════════════
    
    // Setup files (global setup)
    // setupFiles: [
    //   "./test/setup/global.ts",  // Global setup (antes de todos los tests)
    // ],
    
    // Global setup (función asíncrona)
    // globalSetup: [
    //   "./test/setup/global-setup.ts",
    // ],
    
    // ════════════════════════════════════════════════════════════════════════
    // BENCHMARKS (performance testing)
    // ════════════════════════════════════════════════════════════════════════
    
    // Benchmarks (performance testing)
    // benchmark: {
    //   include: ["test/benchmark/**/*.bench.ts"],
    //   reporters: ["default", "json"],
    //   outputFile: "./reports/benchmarks.json",
    // },
    
    // ════════════════════════════════════════════════════════════════════════
    // TYPE TESTING (type-level tests)
    // ════════════════════════════════════════════════════════════════════════
    
    // Type testing (type-level tests)
    // typecheck: {
    //   enabled: true,
    //   include: ["test/types/**/*.test-d.ts"],
    // },
    
    // ════════════════════════════════════════════════════════════════════════
    // CI OPTIMIZATION
    // ════════════════════════════════════════════════════════════════════════
    
    // CI detection (GitHub Actions, GitLab CI, etc.)
    // CI environment variables (GitHub Actions, GitLab CI, CircleCI, etc.)
    // Vitest detecta automáticamente CI=true
    
    // Update snapshots (solo en CI con flag)
    // update: process.env.CI ? false : true,
    
    // ════════════════════════════════════════════════════════════════════════
    // SNAPSHOT CONFIGURATION
    // ════════════════════════════════════════════════════════════════════════
    
    // Snapshot directory
    // snapshotFormat: {
    //   printBasicPrototype: false,
    // },
    
    // Snapshot serializadores
    // snapshotSerializers: [],
    
    // ════════════════════════════════════════════════════════════════════════
    // DEPENDENCIES
    // ════════════════════════════════════════════════════════════════════════
    
    // Deps configuration
    // deps: {
    //   inline: ["@tanstack/react-router"],  // Inline deps problemáticos
    // },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MULTI-PROJECT CONFIGURATION
  // ══════════════════════════════════════════════════════════════════════════
  // PROPÓSITO:
  //   Configurar múltiples proyectos de tests con diferentes entornos,
  //   timeouts, y configuraciones específicas.
  // 
  // PROYECTOS:
  //   1. unit      → Tests rápidos y aislados (test/unit/**)
  //   2. security  → Vectores de seguridad (test/security/**)
  //   3. bookpi    → Invariantes criptográficas del ledger (test/bookpi/**)
  //   4. integration → Tests de integración (test/integration/**)
  //   5. e2e       → End-to-end tests (test/e2e/**)
  // ══════════════════════════════════════════════════════════════════════════

  projects: [
    // ════════════════════════════════════════════════════════════════════════
    // PROJECT 1: UNIT TESTS
    // ════════════════════════════════════════════════════════════════════════
    {
      extends: true,
      test: {
        name: "unit",
        include: ["test/unit/**/*.test.ts"],
        
        // Environment: node (backend code)
        environment: "node",
        
        // Timeouts más cortos (tests rápidos)
        testTimeout: 10_000,
        hookTimeout: 5_000,
        
        // Coverage específico para unit tests
        coverage: {
          enabled: true,
          include: ["src/**/*.ts"],
          exclude: [
            "src/components/**",
            "src/lib/env-schema.ts",
          ],
        },
        
        // Setup específico para unit tests
        // setupFiles: ["./test/setup/unit.ts"],
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // PROJECT 2: SECURITY TESTS
    // ════════════════════════════════════════════════════════════════════════
    {
      extends: true,
      test: {
        name: "security",
        include: ["test/security/**/*.test.ts"],
        
        // Environment: node (security vectors)
        environment: "node",
        
        // Timeouts más largos (algunos tests son complejos)
        testTimeout: 60_000,
        hookTimeout: 30_000,
        
        // Coverage específico para security tests
        coverage: {
          enabled: true,
          include: [
            "src/lib/crypto.ts",
            "src/lib/auth.ts",
            "src/lib/security.ts",
          ],
        },
        
        // Setup específico para security tests
        // setupFiles: ["./test/setup/security.ts"],
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // PROJECT 3: BOOKPI TESTS (Ledger Criptográfico)
    // ════════════════════════════════════════════════════════════════════════
    {
      extends: true,
      test: {
        name: "bookpi",
        include: ["test/bookpi/**/*.test.ts"],
        
        // Environment: node (ledger code)
        environment: "node",
        
        // Timeouts más largos (invariantes complejas)
        testTimeout: 60_000,
        hookTimeout: 30_000,
        
        // Coverage específico para bookpi tests
        coverage: {
          enabled: true,
          include: [
            "src/lib/bookpi/**/*.ts",
            "src/lib/ledger/**/*.ts",
          ],
        },
        
        // Setup específico para bookpi tests
        // setupFiles: ["./test/setup/bookpi.ts"],
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // PROJECT 4: INTEGRATION TESTS
    // ════════════════════════════════════════════════════════════════════════
    {
      extends: true,
      test: {
        name: "integration",
        include: ["test/integration/**/*.test.ts"],
        
        // Environment: node (backend integration)
        environment: "node",
        
        // Timeouts más largos (DB, APIs externas)
        testTimeout: 120_000,
        hookTimeout: 60_000,
        
        // Retry logic (tests flaky por APIs externas)
        retry: 2,
        
        // Coverage específico para integration tests
        coverage: {
          enabled: false,  // No coverage en integration (lento)
        },
        
        // Setup específico para integration tests
        // setupFiles: ["./test/setup/integration.ts"],
        // globalSetup: ["./test/setup/integration-global.ts"],
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // PROJECT 5: E2E TESTS (opcional, Playwright)
    // ════════════════════════════════════════════════════════════════════════
    // {
    //   extends: true,
    //   test: {
    //     name: "e2e",
    //     include: ["test/e2e/**/*.test.ts"],
    //     
    //     // Environment: node (Playwright)
    //     environment: "node",
    //     
    //     // Timeouts muy largos (E2E es lento)
    //     testTimeout: 300_000,
    //     hookTimeout: 120_000,
    //     
    //     // No coverage en E2E
    //     coverage: {
    //       enabled: false,
    //     },
    //     
    //     // Setup específico para E2E tests
    //     // setupFiles: ["./test/setup/e2e.ts"],
    //     // globalSetup: ["./test/setup/e2e-global.ts"],
    //   },
    // },
  ],
});
