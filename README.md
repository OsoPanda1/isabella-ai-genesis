# Isabella Villaseñor AI™ — Genesis

### Infraestructura Cognitiva Territorial, Gobernada y Auditable — TAMV Online Network · Nodo Cero

> **"Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta."**  
> **Blanco o negro. Sin grises. Si no se corrige, no se engaña.**

Isabella es el núcleo cognitivo y de gobernanza de **TAMV Online Network / CITEMESH** en **Real del Monte, Hidalgo, México (2,770 msnm)**. No es chatbot, no es AGI. Es **arquitectura coordinadora** de identidad, memoria, políticas, herramientas, economía, seguridad y decisión asistida — **500 gates auditables 20×25**, **CROWN v6 12 nodos**, **fusión isabella-mexa sin ruptura**, **ML gobernado con AdvancedReinforcementEngine + EthicalValidator SHA-256**.

**Autoría:** Edwin Oswaldo Castillo Trejo / Anubis Villaseñor — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo  
**Licencia:** CC BY 4.0 + Apache-2.0 + ISC — `LICENSES.md` · `SECURITY.md`

---

## Declaración de Orgullo Latinoamericano

> Este proyecto intenta ser lo más ético y profesional posible, pero tras décadas de escuchar que LATAM es incapaz de crear innovación de adopción global decidimos integrar sin vergüenza, sin remordimientos y sin ningún miedo la siguiente frase:
> ### 🇲🇽🇧🇷🇦🇷🇨🇴🇵🇪🇨🇱 *¡A huevo que somos latinoamericanos!* 🇵🇪🇨🇱🇨🇴🇦🇷🇧🇷🇲🇽
> *Construido en Real del Monte, Hidalgo — Nodo Cero — para Latinoamérica y el mundo. La visualización no se pierde, se amplifica.*

---

## 0. Ficha Verificada — 2026-09-23 · `c70ea56` · **Operativa y Visual**

| Campo | Valor |
|---|---|
| **Repo** | `OsoPanda1/isabella-ai-genesis` — `main` — `c70ea56` |
| **Versión** | `4.3.3` — `v3.0-MASTER-EXTENDED + 500 gates + fusión mexa + ML gobernado` |
| **Node/pnpm** | `>=22 <25` — `pnpm@10.34.5` |
| **Runtime** | TanStack Start `1.168.32` + Nitro `3.0.260603-beta` + Vercel `iad1` — Vite `8.2` |
| **Build** | `4.23s` — `router 807KB` — `nitro()` + `V.jsxDEV 0` — `.vercel/output` |
| **Typecheck/Lint** | `0` / `0 errors, 44 warnings` |
| **Tests** | `566 passed, 13 skipped` (104 suites) — `secret-exposure 4` + `AdvancedReinforcementEngine` con `thresholds` + `EthicalValidator SHA-256` |
| **Visualización** | **Operativa y amplificada:** `IsabellaClientApp` default sin bloqueo, `CinematicIntro` solo `?intro=1`, `Starfield`/`Cockpit`/`MessageStream`/`PakeMonitor` con `EthicalValidator` SHA-256 aislados del SSR |
| **Flujo de datos** | `Perceive → Remember → Policy Gate → Decide (CROWN v6 12 nodos) → Act → Audit` — `language-core classifyIntent` + `sanitizePayload` en toda la última milla |
| **Evidencia** | `docs/evidence/2ab7a0b.json` + `500-gates.ts` `500` + `6` docs `94→6` + `CROWN v6` + `language-core` + `JDR` + `AdvancedReinforcementEngine` |
| **Implementación** | **100%** verificable |
| **Despliegue** | **62%** hasta `Neon`/`Stripe`/`HSM` vivo — `81%` global honesto |

> **Revisión 23 sep (fusión ML):** `AdvancedReinforcementEngine` ahora con `EvaluationThresholds` (`minAccuracy 0.85/minF1 0.85/maxBias 0.1`), `EvaluationMetrics` (`p50/p95/p99`, `datasetDigest`, `benchmarkId`), `canonicalize` determinista, `MAX_TEXT_LENGTH 1M`, `validateSample`, `percentile`; `EthicalValidator` con `SHA-256` (no hash 8-char), `EthicalFlag[]` con `severity`, `threshold 0.6`, `MAX_CONTENT_LENGTH 1M`, `generateHash` criptográfico. **Visualización operativa:** `PakeMonitor` mapea `flags` a `string[]` para `addTransparencyMarker`.

---

## 1. Qué es / Qué no es

**Es:** `DualKernel` + `GraphRAG` + `HDC 4096D` + `language-core` + `CROWN v6 12 nodos` + `BookPI WORM` + `NCUA 2-de-3` + `AdvancedReinforcementEngine` + `EthicalValidator SHA-256`  
**No es:** AGI autónoma, wrapper, extractiva, sistema que oculte `E0–E4`.

---

## 2. Arquitectura — 4 Planos · 12 Nodos · 7 Federaciones

| Plano | Componentes | Estado |
|---|---|---|
| **Experiencia** | `IsabellaClientApp` (default), `Cockpit Atlas` `WebSocket`, `PakeMonitor` (`EthicalValidator`), `Starfield` | **OPERATIVA** |
| **Cognitivo** | `DualKernel`, `language-core`, `60` caps ML + `AdvancedReinforcementEngine` | IMPLEMENTADO |
| **Gobernanza** | `CROWN v6` `PDP/PEP`, `ARGUS`, `IDH-D`, `BookPI`, `NCUA`, `EthicalValidator` | IMPLEMENTADO |
| **Infra** | `Neon` `Postgres` `SsoT`, `Supabase` IdP, `QENGINE`, `Nitro` | IMPLEMENTADO |

**CROWN v6:** `CROWN/ISA/SOPHIA/ORION/ARGUS` + `MNEMOSYNE/TELLUS/CHRONOS/HERMES/AXIOMA/PRAXIS/HARMONIA` — `src/lib/crown-v6.ts`  
**Pipeline:** `Perceive → Remember → Policy Gate → Decide → Act → Audit`

---

## 3. Stack

`React 19.2` · `TanStack Start 1.168` · `Nitro 3.0-beta` · `Vite 8.2` · `Prisma 5.22` · `pg 8.23` · `Stripe 22.6` · `Vitest 4.1` · `pnpm 10.34.5`

---

## 4. Seguridad — Blanco o Negro

- **Zero Trust:** `tenant_id` nunca del cliente
- **Headers:** `HSTS` + `CSP` + `X-Frame DENY` + `nosniff`
- **Secretos:** `CROWN=REDACTED (Secret Manager)` — `test/security/secret-exposure.test.ts` 4 verde
- **Auth:** `JWT HS256 3600s` + `refresh` `jti`, `UserAuthService` bloqueado en `production`
- **ML Governance:** `AdvancedReinforcementEngine` valida `finite` + `canonicalize` + `thresholds`; `EthicalValidator` `SHA-256` con `severity` — nunca inventa `actualOutput`
- **500 gates:** `src/lib/governance/500-gates.ts` — `GATE_COUNT 500`

---

## 5. Economía — BookPI + Cattleya

`idempotency → BEGIN → debit → credit → BookPI WORM → COMMIT`  
**Planes:** `visitor 5/50` · `citizen 15/200` · `merchant 35/600` · `enterprise` — `fail-closed` `503`  
**Cattleya:** `70/20/5/5` + `reputation ≥900`

---

## 6. APIs Canónicas

`POST /api/v1/auth/session` · `POST /api/v1/cognitive/orchestrate` · `POST /api/v1/language/profile` (`CROWN v6`) · `POST /api/v1/quantum/telemetry` · `POST /api/isabella` · `GET /api/health`

---

## 7. Base de Datos

`30` migraciones `supabase/migrations` + `JDR` `V1..V7` — `Neon` autoridad durable, `Supabase` IdP

---

## 8. Despliegue — Vercel

```bash
pnpm verify:lock && pnpm typecheck && pnpm test && pnpm build && git push origin main
```

`vite.config.ts` `nitro()` + `esbuild jsxDev:false` + `generateBundle jsxDEV→jsx`

---

## 9. Corrección Total — Fusión ML

**Fusión `isabella-mexa` sin ruptura:**
- `AdvancedReinforcementEngine` ahora `governed` con `EvaluationThresholds` + `percentile` + `canonicalize` + `fail-closed` `EVALUATED_PENDING_APPROVAL` (no `approvedBy` sin humano)
- `EthicalValidator` `SHA-256` (no `hash 8-char` browser-safe) + `EthicalFlag[]` con `OPACITY/GOVERNANCE/FAIRNESS/PRIVACY` + `MISSING_ETHICAL_CONTEXT` — `PakeMonitor` mapea a `string[]` para `addTransparencyMarker`

**Visualización operativa:** `PakeMonitor` + `IsabellaClientApp` + `Starfield` verificados en `build 4.23s` sin `V.jsxDEV`.

---

## 10. Evidencia — 100% en `c70ea56`

| Gate | Evidencia | Estado |
|---|---|---|
| `INSTALL/TYPECHECK/LINT/TEST/BUILD` | `0 / 0 / 566 / 4.23s` | PASS |
| `500 gates` | `500` | PASS |
| `Global` | `81%` (100% impl + 62% deploy) | **81%** |

> **No es `100%` global.** `100%` certificación requiere `Neon RLS live + Stripe live + HSM + Vercel health same-commit + NCUA 500 + rollback` con `workflow_run_id` anclado.

---

## 11. Flujo de Contribución

`git checkout -b feat/...` → `pnpm typecheck && pnpm test && pnpm build` → PR con gates blanco/negro → `main` sin `--force`

---

## 12. Licencia

**Edwin Oswaldo Castillo Trejo / Anubis Villaseñor** — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo  
CC BY 4.0 + Apache-2.0 + ISC — `100%` impl en `c70ea56`, `62%` deploy hasta vivo
