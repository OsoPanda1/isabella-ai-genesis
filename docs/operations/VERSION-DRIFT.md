# Version Drift — P1

**Estado:** `package.json 4.3.3` == `production-capabilities.json` pero `docs/01 6.0-fusión` + `src/lib/crown-v6.ts 6.0.0-fusion` vs `README v3.0-MASTER` — unificado en `scripts/production-integrity-gate.mjs` check.

**Fix:** `CROWN_VERSION` + `package.json version` + `git rev-parse HEAD` inyectado en `build-manifest.ts` + `production-capabilities.json` generado por `pnpm production:evidence` (no manual).

**Verificación:** `pnpm verify:lock` + `pnpm production:integrity-gate`
