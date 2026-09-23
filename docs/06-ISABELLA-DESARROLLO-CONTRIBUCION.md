# 06 — ISABELLA DESARROLLO Y CONTRIBUCIÓN

> **Unifica:** `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE*`, `AGENTS.md`, `ROADMAP*`, `RELEASE-CHECKLIST`, `RFC-ARC-INDEX`, `rfcs/*`, `PRODUCT-PRESENTATION-STANDARD`, `api/API_CONTRACT_AUTHORITY`, `architecture/*`, `arcs/*`, `audits/*`, `unified/README-UNIFICACION.md`

**Stack:** `Vite 8.2` + `TanStack Start 1.168` + `Nitro 3.0` + `pnpm 10.34.5` + `Node >=22 <25` + `Prisma 5.22` + `Vitest 4.1` + `Tailwind 4`

**Comandos:**
```bash
pnpm verify:lock && pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm production:gate # 14 gates mismo SHA
```

**Estructura:** `src/routes/api/v1` (delgadas) + `src/server-routes/api` (billing/voice/images) + `src/lib` (300+ archivos) + `supabase/migrations` (30) + `k8s` + `policy/catalog.json`

**APIs:** `57` rutas TanStack — `ISA-API v.GENESIS` `OpenAPI 3.1` `Zod` — `POST /api/v1/language/profile` (nuevo, `CROWN v6`)

**Contribución:** `feat/fix/docs` + `conventional commits` + `CODEOWNERS` + `PR template` con gates blanco/negro — `main` siempre compilable, sin `--force`

**Licencia:** `CC BY 4.0` + `Apache-2.0` + `ISC` — `LICENSES.md` separa `software/docs/marca/assets` — `CLA` pendiente

**ADRs:** `11` (`authorization-plane`, `api-key-plane`, `aegis-integration`, `bookpi-ledger`, `sandbox`, `env-fail-fast`, `health-checks`, `concurrency`, `blueprint-maestro-v2`, `source-of-truth`, `health-checks`) + `ARCs` + `RFCs`

---

*Unifica 20+ docs de desarrollo. Ver `01` para canónica — flujo completo en 6 archivos totales.*
