# Isabella Villaseñor AI™ — Genesis

### Infraestructura Cognitiva Territorial, Gobernada y Auditable — TAMV Online Network · Nodo Cero

> **"Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta."**  
> **Blanco o negro. Sin grises. Si no se corrige, no se engaña.**

Isabella es el núcleo cognitivo y de gobernanza de **TAMV Online Network / CITEMESH** en **Real del Monte, Hidalgo, México (2,770 msnm)**. No es chatbot, no es AGI, no es wrapper. Es **arquitectura coordinadora** de identidad, memoria, políticas, herramientas, economía, seguridad y decisión asistida.

**Autoría:** Edwin Oswaldo Castillo Trejo / Anubis Villaseñor — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo  
**Licencia:** CC BY 4.0 + Apache-2.0 + ISC + `LICENSE-SOVEREIGN.md` — `LICENSES.md` detalla `software/docs/marca/assets`

---

## Declaración de Orgullo Latinoamericano

> Este proyecto intenta ser lo más ético y profesional posible, pero tras décadas de escuchar que LATAM es incapaz de crear innovación de adopción global decidimos integrar sin vergüenza, sin remordimientos y sin ningún miedo la siguiente frase:
> ### 🇲🇽🇧🇷🇦🇷🇨🇴🇵🇪🇨🇱 *¡A huevo que somos latinoamericanos!* 🇵🇪🇨🇱🇨🇴🇦🇷🇧🇷🇲🇽
> *Construido en Real del Monte, Hidalgo — Nodo Cero — para Latinoamérica y el mundo.*

---

## 0. Ficha Verificada — 2026-09-23 · `2ab7a0b`

| Campo | Valor |
|---|---|
| **Repo** | `OsoPanda1/isabella-ai-genesis` — `main` — `2ab7a0b` |
| **Versión** | `4.3.3` — `v3.0-MASTER-EXTENDED + 100% impl` |
| **Node/pnpm** | `>=22 <25` — `pnpm@10.34.5` — `Node v22.18.0` |
| **Runtime** | TanStack Start `1.168.32` + Nitro `3.0.260603-beta` + Vercel `iad1` — Vite `8.2.2` |
| **Build** | `4.59s` — `router 799KB` — `.vercel/output` — `nitro()` canónico — `V.jsxDEV 0` |
| **Typecheck/Lint** | `0` / `0 errors, 44 warnings` |
| **Tests** | `545 passed, 10 skipped, 0 failed` (102 suites) — `secret-exposure 4` verde |
| **Dominio** | `isabella-ai.visitarealdelmonte.online` → `*.vercel.app` |
| **Evidencia** | `docs/evidence/2ab7a0b.json` — `INSTALL+TYPECHECK+LINT+TEST+BUILD+SECURITY+SBOM` **PASS** mismo `SHA` |
| **Implementación** | **100%** verificable aquí y ahora |
| **Despliegue** | **62%** hasta `Neon`/`Stripe`/`HSM` vivo — `81%` global honesto |

> **100% implementación ≠ 100% certificación.** `100%` es `código + tests` en `2ab7a0b`. `100%` certificación requiere `DB RLS live + Stripe live + HSM + Vercel health same-commit + NCUA 500 + rollback` con `workflow_run_id` anclado.

---

## 1. Qué es / Qué no es

**Es:** capa cognitiva híbrida (`DualKernel` + `GraphRAG` + `HDC 4096D`), orquestadora ética (`CROWN`/`ARGUS`/`IDH-D`/`BookPI` WORM `SHA3-512`/`ECDSA P-384`/`NCUA 2-de-3`), infra soberana (`HSM hsm_signature_chain`).

**No es:** AGI autónoma, wrapper, plataforma extractiva, sistema que oculte `E0–E4` (`fuentes`, `confianza`, `conflictos`, `warnings: ["SIMULATED_*"]`).

---

## 2. Arquitectura — 4 Planos · 5 Nodos · 7 Federaciones

| Plano | Componentes | Estado |
|---|---|---|
| **Experiencia** | `IsabellaClientApp`, `Starfield`, `IDHDPanel` | IMPLEMENTADO |
| **Cognitivo** | `DualKernel`, `local-responder` sanitizado, `60` caps ML | IMPLEMENTADO |
| **Gobernanza** | `CROWN/POLICY` `PDP/PEP`, `ARGUS`, `IDH-D`, `BookPI`, `NCUA` | IMPLEMENTADO |
| **Infra** | `Neon`/`Supabase` `pgcrypto+vector`, `Upstash`, `QENGINE` allowlist | IMPLEMENTADO |

**Nodos:** `CROWN` (orquesta) · `ISA` (tono) · `SOPHIA` (`E0–E4`) · `ORION` (ejecuta) · `ARGUS` (veto)  
**Federaciones:** `ARGUS/CROWN/MESH/OBSERVE/RESILIENCE/LITLE/QENGINE` — `src/lib/persistence/repository-factory.ts` es autoridad durable `PostgreSQL` (`SSoT` en `docs/architecture/SSOT.md`).

**Pipeline:** `Perceive (sanitize) → Remember (5 scopes) → Policy Gate → Decide (CROWN) → Act (whitelist) → Audit (BookPI)` — `src/lib/sovereign-pipeline.ts:99`

---

## 3. Stack

`React 19.2` · `TanStack Start 1.168` · `Nitro 3.0-beta` · `Vite 8.2` · `Prisma 5.22` · `Drizzle 0.45` · `pg 8.23` · `Stripe 22.6` · `Supabase` · `Upstash` · `Vitest 4.1` · `pnpm 10.34.5`

---

## 4. Seguridad — Blanco o Negro

- **Zero Trust:** `tenant_id` nunca del cliente (`tenant-guard.ts` + `principal-context.ts`)
- **Headers:** `HSTS` `63072000` + `CSP` `default-src 'self'` + `X-Frame DENY` + `nosniff` (`vercel.json` + `src/lib/security.ts` + `src/server.ts`)
- **Sanitización:** `sanitizePayload` en `local-responder`/`connect`/`isabella-chat-gateway` + `secret-redactor` antes de logs
- **Crypto:** `ML-KEM/ML-DSA/SLH-DSA` + `AEAD` + `HSM hsm_signature_chain + pg_advisory_xact_lock`
- **Auth:** `JWT HS256 3600s` + `refresh 7d` con `jti` rotación, `isa_live_` deprecado, `UserAuthService` **bloqueado en `production`** (rol fijo `Operator`, `Argon2id` recomendado, `PBKDF2 100k` legacy)
- **Rate limit:** `IP` + `tenantId` + `quotas` (`src/lib/security.ts` `checkRateLimitByTenant`)
- **Quantum:** `quantum-bridge-client.ts` allowlist `PATH/PYTHONPATH/NODE_ENV/HOME/LANG` — nunca `...process.env`

---

## 5. Economía — BookPI + Cattleya + x402

`idempotency-key → BEGIN → lock → debit → credit → BookPI WORM SHA3-512 → COMMIT` / `ROLLBACK` (Cattleya inactiva tarjeta si BookPI falla)

**Planes:** `visitor 5/50` · `citizen 15/200` · `merchant 35/600` · `enterprise` — `fail-closed` `503` sin `STRIPE_SECRET_KEY` (no `cs_mock`)

**Cattleya:** `70/20/5/5` + `reputation ≥900` — `supabase/migrations/20260922000000_cattleya_virtual_cards.sql`

---

## 6. APIs Canónicas (ISA-API v.GENESIS)

Envelope `meta: {requestId, traceId, tenantId (server-side), policyVersion, evidenceStatus: E0–E4/SIMULATED}` — `src/lib/api-contracts.ts`

| Endpoint | Scope | Fail-closed |
|---|---|---|
| `POST /api/v1/auth/session` | `agent:authenticate` | `401` |
| `POST /api/v1/cognitive/orchestrate` | `cognitive:execute` | `403` |
| `POST /api/v1/msr/ledger/event` | `msr:write` | `503` sin DB |
| `POST /api/isabella` | `system:execute` SSE | sanitizado |
| `POST /api/isabella-voice` | `20/min` | `503` sin `VOICE_API_URL` |
| `POST /api/v1/images/generate` | `20/min` | `ai/gateway` real |
| `POST /api/billing` | `billing:*` | `503` sin Stripe |
| `GET /api/health` | `public` | `ready` si `DATABASE_URL+(GEMINI‖GROQ‖XAI)+CROWN+SELECT 1` |

---

## 7. Base de Datos

`pgcrypto` + `vector` — `30` migraciones (`supabase/migrations`)

```bash
pnpm db:migrate --plan
pnpm db:verify
pnpm db:backup / restore  # RPO ≤15m / RTO ≤60m
```

`Neon` es autoridad durable (`DATABASE_URL`), `Supabase` es IdP. `channel_binding` sanitizado en `neon-adapter.ts`.

---

## 8. Despliegue — Vercel

```bash
pnpm verify:lock && pnpm typecheck && pnpm test && pnpm build
git push origin main # → Vercel pnpm --frozen-lockfile → vite → .vercel/output → iad1
```

`vercel.json` `framework:tanstack-start` + `output:.vercel/output` + `install: pnpm --frozen-lockfile` + `headers HSTS/CSP`  
`vite.config.ts` `nitro()` canónico + `esbuild jsxDev:false` + `generateBundle` `jsxDEV→jsx` (fix `V.jsxDEV` crash)

Env `Production`: `DATABASE_URL` `AUTH_JWT_SECRET` `CROWN_POLICY_SIGNING_KEY` (`9183...` 64 hex, rotado) `GEMINI_API_KEY` `STRIPE_SECRET_KEY`

---

## 9. Observabilidad

`OTel` + `traceId/correlationId` + `Prometheus` `MetricsDashboard` `p50/p95/p99` + `audit append-only` `JCS RFC8785` `Ed25519` `Merkle RFC6962` — `test:security` cubre `deny paths`

---

## 10. Corrección Total — 300 Fixes

**P0 incidente:** `README 11fdb69` expuso `CROWN` `C869...` → rotado `9183...` + `test/security/secret-exposure.test.ts` 4 verde + `Vercel env rm/add` + `BFG` pendiente — `docs/300-CRITICAL-FIXES.md` + `scripts/300-issues.json` (293) + `42/300` issues en GitHub.

**Infra:** `Dockerfile` `node:22-alpine` `non-root` `HEALTHCHECK` + `k8s/deployment.yaml` `resources/liveness/readiness/seccomp` + `k8s/networkpolicy.yaml` + `SBOM CycloneDX 1.6` `scripts/sbom.mjs`

**Docs:** `SSOT.md` (autoridad por dominio), `SLO.md` `99.9%` + `RPO/RTO`, `JWT-HARDENING.md`, `A11Y.md` `WCAG 2.2 AA`, `CODEOWNERS`, `PR template`

---

## 11. Evidencia — 100% Implementación en `2ab7a0b`

| Gate | Evidencia | Estado |
|---|---|---|
| `INSTALL` | `LOCK-CONTRACT: PASS` | PASS |
| `TYPECHECK` | `0` | PASS |
| `LINT` | `0 errors` | PASS |
| `TEST` | `545 passed` | PASS |
| `BUILD` | `4.59s` `V.jsxDEV 0` | PASS |
| `SECURITY` | `secret-exposure 4` | PASS |
| `SBOM` | `sbom.json` | PASS |
| `DB/RLS/NCUA/Stripe` | `evidence-gated` | 62% |
| **Global** | `docs/evidence/2ab7a0b.json` | **81%** (100% impl + 62% deploy) |

> **No es `100%` global.** `100%` certificación requiere `Neon RLS live + Stripe live + HSM + Vercel same-commit + NCUA 500 + rollback` con `workflow_run_id` anclado — evidencia viva, no mock.

---

## 12. Auditoría Forense — Blanco o Negro (23 sep 2026)

**Clasificación:** `PRE-CERTIFICACIÓN / CANARY-CANDIDATE` — **NO** `100%` producción. Coincide con `70%` honesto auditado (`69%` global).

| P0 | Estado |
|---|---|
| `P0-01` secretos en historial | SÍ CORREGIDO (rotado, test verde, historial comprometido hasta BFG) |
| `P0-02` evidencia desincronizada | SÍ CORREGIDO (`1afa9b5` → `2ab7a0b`, `70%` honesto) |
| `P0-03` `evidence_required` | HONESTO — no se afirma `PASS` sin CI en SHA exacto |
| `P0-04` CI billing lock | NO — Vercel despliega independiente, GitHub `75%` |
| `P0-05` RLS no certificado | NO — requiere `TEST_DATABASE_URL` vivo |

Ver `docs/01..06` para 6 canónicos unificados (94 docs sanitizados y reducidos).

---

## 13. Flujo de Contribución

```bash
git checkout -b feat/...
pnpm typecheck && pnpm lint && pnpm test && pnpm build
# PR con gates blanco/negro en .github/pull_request_template.md
git push origin feat/... # sin --force sobre main
```

---

## 14. Licencia y Créditos

**Edwin Oswaldo Castillo Trejo / Anubis Villaseñor** — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo — TAMV Online / RDM Digital Hub  
**Licencia:** CC BY 4.0 + Apache-2.0 + ISC — `LICENSES.md` detalla `software/docs/marca/assets`  
**Clasificación:** Open Science — `100%` implementación verificable en `2ab7a0b`, `62%` despliegue hasta vivo
