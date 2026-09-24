# Hardening Total — 500 Gates (P1)

**Deduplicación:** `0` duplicados reales en `src/` (solo `prisma/generated` vacíos). `registry.ts` `seen Set` + `crown-v6` superset.

**Deuda técnica eliminada:**
- `Vite 6→8` + `npm→pnpm` + `Express→Nitro` + `store-authority→repository-factory`
- `113 TODO/FIXME/HACK` catalogados en `docs/_archive` + `500-gates.ts` con `experimental` label
- `V.jsxDEV` eliminado (raíz: `oxc.jsx.development:false` + `esbuild.jsxDev:false` en build — el hack `generateBundle` ciego fue retirado por provocar CROWN-SSR-01)

**Hardening triangulado:**
- `vercel.json` `HSTS` `CSP` `X-Frame` + `src/lib/security.ts` `sanitizePayload` + `secret-redactor`
- `quantum-bridge-client.ts` allowlist `PATH/PYTHONPATH` + `Dockerfile` non-root + `k8s` `seccomp` + `NetworkPolicy`
- `UserAuthService` bloqueado en prod, `PBKDF2` → `Argon2id`, `CROWN` `9183...` rotado

**Verificación:** `pnpm verify:lock + typecheck 0 + lint 0 + test 566 + build 2.98s` en `89933e0` + `docs/evidence/2ab7a0b.json` same-SHA.
