# Process Env Audit — P1

**Regla AGENTS.md §12:** `process.env` solo en `src/lib/config.ts` + `env-schema.ts` + `build-manifest.ts`.

**Estado:** `src/lib/quantum-bridge-client.ts:61` + `src/hooks/use-isabella-observability.ts:22` migrados a `config()` en `fbcfac5` — verificado `grep process.env` solo en allowlist.

**Verificación:** `pnpm run lint` con `no-restricted-syntax` para `process.env` + `test/unit/env-contract.test.ts` 2 tests.

**Falta:** `eslint` rule `no-process-env` en `genesis/scanners` ya existe pero no enforced en `eslint.config.js` — añadir.
