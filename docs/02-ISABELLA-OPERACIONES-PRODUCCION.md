# 02 — ISABELLA OPERACIONES Y PRODUCCIÓN

> **Unifica:** `PRODUCTION_GATE`, `DEPLOYMENT-ROUTE-RECOVERY`, `ROADMAP-PRODUCTION-HARDENING`, `PLAN-FASES-100`, `RELEASE-CHECKLIST`, `ENTERPRISE-ARCHITECTURE`, `FGAIS-PRODUCTION-STATUS`, `RUNTIME-AUTHORITY-MAP`, `CANONICAL-PRODUCTION-STATUS`, `DISASTER_RECOVERY`, `PRODUCTION-READINESS-*`, `PRODUCTION-RECOVERY-RUNBOOK`, `PRODUCTION_REPAIR_REGISTER`, `OPERATIONAL-RISK-REGISTER`, `CAPABILITY_MATRIX`, `DEPENDENCY_MATRIX`, `ENCRYPTION_MATRIX`, `TELEMETRY-GOVERNANCE`, `300-CRITICAL-FIXES`, `P0-STATUS`, `SLO`, `SBOM`, `HARDENING-TRIANGULADO`

**Estado:** local 2026-09-24 (post-fix CROWN-SSR-01) — `100%` implementación verificable (`623 passed / 0 failed / 13 skipped`), `62%` despliegue hasta `Neon`/`Stripe`/`HSM` vivo — `81%` global honesto — `production-capabilities.json`

## 1. Gates de Producción (mismo SHA)
`INSTALL` `pnpm --frozen-lockfile` → `TYPECHECK 0` → `LINT 0` → `TEST 623` → `SECURITY` → `SBOM` → `DB` → `RLS` → `NCUA 50/100/250/500` → `BUILD` → `VERCEL` → `HEALTH` → `SMOKE` → `BOOKPI` → `ROLLBACK` → `EVIDENCE` → `SAME_COMMIT`

```bash
pnpm production:gate # o pnpm verify:lock && pnpm typecheck && pnpm test && pnpm build
```

## 2. Base de Datos — 30 Migraciones
`pgcrypto` + `vector` — `supabase/migrations` — `Neon` autoridad durable (`DATABASE_URL`), `Supabase` IdP.

```bash
pnpm db:migrate --plan; pnpm db:verify; pnpm db:backup / restore # RPO ≤15m / RTO ≤60m
```

`channel_binding` sanitizado en `neon-adapter.ts`. `isabella_data/*.json` eliminado (`DURABLE_JSON_ALLOWED false`).

## 3. Despliegue — Vercel `iad1`
`vercel.json` `framework:tanstack-start` + `output:.vercel/output` + `install: pnpm --frozen-lockfile` + `headers HSTS/CSP`  
`vite.config.ts` `nitro()` canónico + `oxc.jsx.development:false`/`esbuild jsxDev:false` en build (JSX producción sin rename ciego — fix CROWN-SSR-01)

Env `Production`: `DATABASE_URL` `AUTH_JWT_SECRET` `CROWN_POLICY_SIGNING_KEY` (64 hex, rotado) `GEMINI_API_KEY` `STRIPE_SECRET_KEY`

## 4. SLO / RTO / Observabilidad
`SLO 99.9%` + `p95 <850ms` + `RPO ≤15m / RTO ≤60m` — `docs/operations/SLO.md` — `OTel` + `Prometheus` + `ObservabilityPanel` — `runbooks/incident.md`

## 5. Capacidades
`CAPABILITY_MATRIX.md` `28 real /32` — `28` `real` (código+tests), `2` `evidence-gated` (DB/Stripe), `1` `manual` (rate limit).

---

*Unifica 30+ docs de operaciones. Ver `01` para canónica, `03` para seguridad.*
