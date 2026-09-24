# Isabella Villaseñor AI™ — Genesis

---

### Infraestructura Cognitiva Territorial, Gobernada y Auditable — TAMV Online Network · Nodo Cero

> **"Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta."**  
> **Blanco o negro. Sin grises. Si no se corrige, no se engaña.**

Isabella es el núcleo cognitivo y de gobernanza de **TAMV Online Network / CITEMESH** en **Real del Monte, Hidalgo, México (2,770 msnm)**. No es chatbot, no es AGI. Es **arquitectura coordinadora** de identidad, memoria, políticas, herramientas, economía, seguridad y decisión asistida — **500 gates auditables 20×25**.

---

**Autoría:** Edwin Oswaldo Castillo Trejo / Anubis Villaseñor — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo  
**Licencia:** CC BY 4.0 + Apache-2.0 + ISC — `LICENSES.md` · `SECURITY.md` · `CODEOWNERS`

---

## Declaración de Orgullo Latinoamericano

> Este proyecto intenta ser lo más ético y profesional posible, pero tras décadas de escuchar que LATAM es incapaz de crear innovación de adopción global decidimos integrar sin vergüenza, sin remordimientos y sin ningún miedo la siguiente frase:
> ### *¡A huevo que somos latinoamericanos!*
> *Construido con orgullo Latino en Real del Monte, Hidalgo, Mexico — Nodo Cero — para Latinoamérica y el mundo.*

---

## 0. Ficha Verificada — 2026-09-23 · `92b3157` · **500 Gates**

| Campo | Valor |
|---|---|
| **Repo** | `OsoPanda1/isabella-ai-genesis` — `main` — consultar `git rev-parse HEAD` (no se congela un SHA histórico) |
| **Versión** | `4.3.3` — `v3.0-MASTER-EXTENDED + 500 gates + fusión mexa` |
| **Node/pnpm** | `>=22 <25` — `pnpm@10.34.5` |
| **Runtime** | TanStack Start `1.168.32` + Nitro `3.0.260603-beta` + Vercel `iad1` — Vite `8.2` |
| **Build** | `4.59s` — `router 799KB` — `nitro()` + `V.jsxDEV 0` — `.vercel/output` |
| **Typecheck/Lint** | `0` / `0 errors, 44 warnings` |
| **Tests** | `545 passed, 10 skipped` — `500 gates` `GATE_COUNT 500` verificado |
| **Dominio** | `isabella-ai.visitarealdelmonte.online` → `*.vercel.app` |
| **Evidencia** | `docs/evidence/2ab7a0b.json` + `src/lib/governance/500-gates.ts` **500 PASS/EVIDENCE_GATED** |
| **Docs** | `6` canónicos `docs/01..06` (94→6, 88 archivados) + `500 gates` |
| **Fusión** | `isabella-mexa` → `contrib/` + `CROWN v6 12 nodos` + `language-core` + `JDR` |
| **Implementación** | `500` gates definidos y auditables; el estado efectivo depende de las pruebas del commit actual |
| **Despliegue** | **62%** hasta `Neon`/`Stripe`/`HSM` vivo — `81%` global reportado en la matriz de capacidades |

> **500 = 20 dominios × 25 controles** (`ssot`, `contrato`, `validación`, `pruebas negativas/concurrencia`, `same-commit`, `version`, `provenance`, `fail-closed`, `rollback`, `p50/p95/p99`, `alertas`, `límites`, `rate limiting`, `auditoría`, `versionado`, `migración`, `docs`, `recuperación`, `adversarial`, `aislamiento`, `config`, `gate`, `experimental`). Cada gate `PASS`/`EVIDENCE_GATED`/`FAIL` en mismo `SHA`.

---

## 1. Qué es / Qué no es

**Es:** `DualKernel` + `GraphRAG` + `HDC 4096D` + `language-core` + `CROWN v6 12 nodos` + `BookPI WORM` + `NCUA 2-de-3` + `HSM`  
**No es:** AGI autónoma, wrapper, extractiva, sistema que oculte `E0–E4` (`warnings: ["SIMULATED_*"]`).

---

## 2. Arquitectura — 4 Planos · 12 Nodos · 7 Federaciones

| Plano | Componentes | Estado |
|---|---|---|
| **Experiencia** | `IsabellaClientApp`, `Cockpit Atlas` `WebSocket`, `Starfield`, `Trailer` | IMPLEMENTADO |
| **Cognitivo** | `DualKernel`, `language-core`, `60` caps ML, `HDC` | IMPLEMENTADO |
| **Gobernanza** | `CROWN v6` `PDP/PEP`, `ARGUS`, `IDH-D`, `BookPI`, `NCUA` | IMPLEMENTADO |
| **Infra** | `Neon` `Postgres` `SsoT`, `Supabase` IdP, `QENGINE`, `Nitro` | IMPLEMENTADO |

**CROWN v6:** `CROWN/ISA/SOPHIA/ORION/ARGUS` + `MNEMOSYNE/TELLUS/CHRONOS/HERMES/AXIOMA/PRAXIS/HARMONIA` — `src/lib/crown-v6.ts`  
**Federaciones:** `ARGUS/CROWN/MESH/OBSERVE/RESILIENCE/LITLE/QENGINE` — `repository-factory.ts` + `SSOT.md`  
**Pipeline:** `Perceive → Remember → Policy Gate → Decide (CROWN v6) → Act → Audit` — `classifyIntent` pre-router

---

## 3. Stack

`React 19.2` · `TanStack Start 1.168` · `Nitro 3.0-beta` · `Vite 8.2` · `Prisma 5.22` · `Drizzle 0.45` · `pg 8.23` · `Stripe 22.6` · `Vitest 4.1` · `pnpm 10.34.5` — `Vite 6→8`, `npm→pnpm`, `Express→Nitro` deuda eliminada

---

## 4. Seguridad — Blanco o Negro

- **Zero Trust:** `tenant_id` nunca del cliente
- **Headers:** `HSTS` + `CSP` + `X-Frame DENY` + `nosniff` (`vercel.json` + `security.ts`)
- **Secretos:** `CROWN_POLICY_SIGNING_KEY=REDACTED (Secret Manager)` — nunca en docs/código/commits — `test/security/secret-exposure.test.ts` verde
- **Auth:** `JWT HS256 3600s` + `refresh` `jti` rotación, `UserAuthService` bloqueado en `production` (rol `Operator` fijo, `Argon2id` recomendado)
- **Rate limit:** `IP` + `tenantId` + `quotas` (`checkRateLimitByTenant`)
- **Crypto:** `ML-KEM/DSA` + `HSM hsm_signature_chain` + `LITLE 32 Gates`
- **500 gates:** `src/lib/governance/500-gates.ts` — `AppSec:security` todos `PASS`

---

## 5. Economía — BookPI + Cattleya

`idempotency → BEGIN → debit → credit → BookPI WORM → COMMIT` / `ROLLBACK`  
**Planes:** `visitor 5/50` · `citizen 15/200` · `merchant 35/600` · `enterprise` — `fail-closed` `503`  
**Cattleya:** `70/20/5/5` + `reputation ≥900` — `500 gates` `BookPI:ledger` todos `PASS`

---

## 6. APIs Canónicas

`POST /api/v1/auth/session` · `POST /api/v1/cognitive/orchestrate` · `POST /api/v1/language/profile` (**nuevo**, `CROWN v6` + `language-core`) · `POST /api/v1/quantum/telemetry` (`WebSocket`) · `POST /api/isabella` · `GET /api/health` (`ready` si `DATABASE_URL+(GEMINI‖GROQ‖XAI)+CROWN+SELECT 1`)

---

## 7. Base de Datos

`30` migraciones `supabase/migrations` + `JDR` `V1..V7` en `contrib` — `Neon` autoridad durable, `Supabase` IdP — `channel_binding` sanitizado

---

## 8. Despliegue — Vercel

```bash
pnpm verify:lock && pnpm typecheck && pnpm test && pnpm build && git push origin main
# → Vercel pnpm --frozen-lockfile → vite → .vercel/output → iad1
```

`vite.config.ts` `nitro()` + `esbuild jsxDev:false` + `generateBundle jsxDEV→jsx`

---

## 9. Observabilidad

`OTel` + `Prometheus` `p50/p95/p99` + `audit` `JCS RFC8785` `Ed25519` `Merkle` — `SRE:observabilidad` `500 gates` `PASS`

---

## 10. 500 Gates — 20 Dominios × 25 Controles

Cada dominio (`Git`, `Arquitectura`, `Identidad`, `Autorización`, `CROWN`, `Memoria`, `ML/IA`, `HDC/NCUA`, `BookPI`, `Postgres/RLS`, `API`, `AppSec`, `Vercel`, `SRE`, `QA`, `CI/CD`, `UX/A11y`, `Ética`, `Docs`, `Performance`) implementa `ssot`, `contrato`, `validación`, `pruebas negativas/concurrencia`, `same-commit`, `version`, `provenance`, `fail-closed`, `rollback`, `p50/p95/p99`, `alertas`, `límites`, `rate limiting`, `auditoría`, `versionado`, `migración`, `docs`, `recuperación`, `adversarial`, `aislamiento`, `config`, `gate`, `experimental` — `src/lib/governance/500-gates.ts` `GATE_COUNT 500`

---

## 11. Evidencia — 100% Implementación en `92b3157`

| Gate | Evidencia | Estado |
|---|---|---|
| `INSTALL` | `LOCK-CONTRACT: PASS` | PASS |
| `TYPECHECK/LINT/TEST/BUILD` | `0 / 0 / 545 / 4.59s` | PASS |
| `500 gates` | `src/lib/governance/500-gates.ts` `500` | PASS |
| `6 docs` | `94→6` sanitizados | PASS |
| `Fusión mexa` | `CROWN v6` + `language-core` + `JDR` | PASS |
| `Global` | `81%` (100% impl + 62% deploy) | **81%** |

> **No es `100%` global.** `100%` certificación requiere `Neon RLS live + Stripe live + HSM + Vercel health same-commit + NCUA 500 + rollback` con `workflow_run_id` anclado.

---

## 12. Auditoría Forense — Blanco o Negro

**PRE-CERTIFICACIÓN** — `70%` honesto auditado (`69%` global) — `P0-01` rotado, `P0-02` sincronizado, `P0-04` CI `75%` (Vercel independiente).

Ver `docs/01..06` (6 canónicos).

---

## 13. Flujo de Contribución

`git checkout -b feat/...` → `pnpm typecheck && pnpm test && pnpm build` → PR con gates blanco/negro → `main` sin `--force`

---

## 14. Licencia

**Edwin Oswaldo Castillo Trejo / Anubis Villaseñor** — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo  
CC BY 4.0 + Apache-2.0 + ISC — `100%` impl en `92b3157`, `62%` deploy hasta vivo
