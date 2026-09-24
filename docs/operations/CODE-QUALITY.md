# Code Quality — P2

**Estado:** `lint 0 errors, 47 warnings` — `typecheck 0` — `build 2.98s`

**Deuda catalogada:**
- `113 TODO/FIXME/HACK` en `src/` — clasificados `TEST_ONLY`/`DOCUMENTATION`/`TECH_DEBT` en `docs/evidence/`
- `47 warnings` `no-explicit-any` / `no-unused-vars` — permitidos, `error` solo para `no-floating-promises`
- `eslint.config.js` ignora `contrib`, `test`, `quantum_utility_platform` — `security:scan` los cubre

**Próximo:** `typescript-eslint recommendedStrict` + `knip` para código muerto + `depcheck`.
