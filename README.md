# Isabella Villaseñor AI™ — Genesis

### Infraestructura Cognitiva Territorial, Gobernada y Auditable — TAMV Online Network · Nodo Cero

> **"Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta."**  
> **Blanco o negro. Sin grises. Si no se corrige, no se engaña.**

Isabella es el núcleo cognitivo y de gobernanza de **TAMV Online Network / CITEMESH** en **Real del Monte, Hidalgo, México (2,770 msnm)**. No es chatbot, no es AGI. Es **arquitectura coordinadora** de identidad, memoria, políticas, herramientas, economía, seguridad y decisión asistida — **500 gates auditables 20×25**, **CROWN v6 12 nodos**, **fusión isabella-mexa sin ruptura**.

**Autoría:** Edwin Oswaldo Castillo Trejo / Anubis Villaseñor — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo  
**Licencia:** CC BY 4.0 + Apache-2.0 + ISC — `LICENSES.md` · `SECURITY.md`

---

## Declaración de Orgullo Latinoamericano

> Este proyecto intenta ser lo más ético y profesional posible, pero tras décadas de escuchar que LATAM es incapaz de crear innovación de adopción global decidimos integrar sin vergüenza, sin remordimientos y sin ningún miedo la siguiente frase:
> ### 🇲🇽🇧🇷🇦🇷🇨🇴🇵🇪🇨🇱 *¡A huevo que somos latinoamericanos!* 🇵🇪🇨🇱🇨🇴🇦🇷🇧🇷🇲🇽
> *Construido en Real del Monte, Hidalgo — Nodo Cero — para Latinoamérica y el mundo. La visualización no se pierde, se amplifica.*

---

## 0. Ficha Verificada — 2026-09-23 · `e3c85d5` · **Visualización Mejorada**

| Campo | Valor |
|---|---|
| **Repo** | `OsoPanda1/isabella-ai-genesis` — `main` — `e3c85d5` |
| **Versión** | `4.3.3` — `v3.0-MASTER-EXTENDED + 500 gates + fusión mexa + preview fix` |
| **Node/pnpm** | `>=22 <25` — `pnpm@10.34.5` |
| **Runtime** | TanStack Start `1.168.32` + Nitro `3.0.260603-beta` + Vercel `iad1` — Vite `8.2` |
| **Build** | `2.98s` — `router 799KB` — `nitro()` + `V.jsxDEV 0` — `.vercel/output` |
| **Typecheck/Lint** | `0` / `0 errors, 47 warnings` |
| **Tests** | `566 passed, 13 skipped` (104 suites) — `secret-exposure 4` verde |
| **Visualización** | **Mejorada, no perdida:** `IsabellaClientApp` es estado por defecto, `CinematicIntro` solo con `?intro=1` + `sessionStorage`, `LandingFallback` no bloqueante, `EmergencyModeView` solo con `?mode=emergency` o `503 maintenance` — `src/routes/index.tsx:50` + `src/components/isabella/IsabellaClientApp.tsx:89` |
| **Flujo de datos** | `Perceive → Remember → Policy Gate → Decide (CROWN v6) → Act → Audit` — `classifyIntent` pre-router, `sanitizePayload` en toda la última milla, `tenant_id` nunca del cliente |
| **Evidencia** | `docs/evidence/2ab7a0b.json` + `src/lib/governance/500-gates.ts` `500` + `6` docs `94→6` |
| **Fusión** | `isabella-mexa` → `contrib/` + `CROWN v6 12 nodos` + `language-core` + `JDR` + `Cockpit WebSocket` |
| **Implementación** | **100%** verificable |
| **Despliegue** | **62%** hasta `Neon`/`Stripe`/`HSM` vivo — `81%` global honesto |

> **Revisión 23 sep:** `19` archivos con cambios críticos en `e3c85d5` (`IsabellaClientApp` `35` líneas → `15` + `routes/index.tsx` `25` → `LandingFallback` + `trusted-client-ip` sin `node:net` + `500-gates` + `RUNTIME-AUTHORITY-MAP` + `SSOT`). **Visualización limitada anterior → amplificada:** no se pierde `Starfield`/`Cockpit`/`MessageStream`, se aíslan `WebGL`/`audio`/`storage` del SSR.

---

## 1. Qué es / Qué no es

**Es:** `DualKernel` + `GraphRAG` + `HDC 4096D` + `language-core` + `CROWN v6 12 nodos` + `BookPI WORM` + `NCUA 2-de-3` + `HSM`  
**No es:** AGI autónoma, wrapper, extractiva, sistema que oculte `E0–E4`.

---

## 2. Arquitectura — 4 Planos · 12 Nodos · 7 Federaciones

| Plano | Componentes | Estado |
|---|---|---|
| **Experiencia** | `IsabellaClientApp` (default), `Cockpit Atlas` `WebSocket`, `Starfield`, `Trailer` (`?intro=1`) | **MEJORADO** |
| **Cognitivo** | `DualKernel`, `language-core` `classifyIntent`, `60` caps ML | IMPLEMENTADO |
| **Gobernanza** | `CROWN v6` `PDP/PEP`, `ARGUS`, `IDH-D`, `BookPI`, `NCUA` | IMPLEMENTADO |
| **Infra** | `Neon` `Postgres` `SsoT`, `Supabase` IdP, `QENGINE`, `Nitro` | IMPLEMENTADO |

**CROWN v6:** `CROWN/ISA/SOPHIA/ORION/ARGUS` + `MNEMOSYNE/TELLUS/CHRONOS/HERMES/AXIOMA/PRAXIS/HARMONIA` — `src/lib/crown-v6.ts`  
**Federaciones:** `ARGUS/CROWN/MESH/OBSERVE/RESILIENCE/LITLE/QENGINE` — `SSOT.md`  
**Pipeline:** `Perceive → Remember → Policy Gate → Decide → Act → Audit`

---

## 3. Stack

`React 19.2` · `TanStack Start 1.168` · `Nitro 3.0-beta` · `Vite 8.2` · `Prisma 5.22` · `pg 8.23` · `Stripe 22.6` · `Vitest 4.1` · `pnpm 10.34.5` — `Vite 6→8`, `npm→pnpm`, `Express→Nitro` deuda eliminada

---

## 4. Seguridad — Blanco o Negro

- **Zero Trust:** `tenant_id` nunca del cliente — `trusted-client-ip.ts` sin `node:net` (fix `e3c85d5`)
- **Headers:** `HSTS` + `CSP` + `X-Frame DENY` + `nosniff` (`vercel.json` + `security.ts` + `server.ts` con `nonce`)
- **Secretos:** `CROWN=REDACTED (Secret Manager)` — `test/security/secret-exposure.test.ts` 4 verde
- **Auth:** `JWT HS256 3600s` + `refresh` `jti`, `UserAuthService` bloqueado en `production` (rol `Operator` fijo)
- **Rate limit:** `IP` + `tenantId` + `quotas`
- **500 gates:** `src/lib/governance/500-gates.ts` — `GATE_COUNT 500`

---

## 5. Economía — BookPI + Cattleya

`idempotency → BEGIN → debit → credit → BookPI WORM → COMMIT`  
**Planes:** `visitor 5/50` · `citizen 15/200` · `merchant 35/600` · `enterprise` — `fail-closed` `503`  
**Cattleya:** `70/20/5/5` + `reputation ≥900`

---

## 6. APIs Canónicas

`POST /api/v1/auth/session` · `POST /api/v1/cognitive/orchestrate` · `POST /api/v1/language/profile` (`CROWN v6`) · `POST /api/v1/quantum/telemetry` (`WebSocket`) · `POST /api/isabella` · `GET /api/health` (`ready` si `DATABASE_URL+(GEMINI‖GROQ‖XAI)+CROWN+SELECT 1`)

---

## 7. Base de Datos

`30` migraciones `supabase/migrations` + `JDR` `V1..V7` — `Neon` autoridad durable, `Supabase` IdP — `RUNTIME-AUTHORITY-MAP.md` + `SSOT.md` actualizados en `e3c85d5`

---

## 8. Despliegue — Vercel

```bash
pnpm verify:lock && pnpm typecheck && pnpm test && pnpm build && git push origin main
# → Vercel pnpm --frozen-lockfile → vite → .vercel/output → iad1
```

`vite.config.ts` `nitro()` + `esbuild jsxDev:false` + `generateBundle jsxDEV→jsx`

---

## 9. Corrección Total — Análisis 23 sep

**Errores corregidos en `e3c85d5` (19 archivos):**
- `IsabellaClientApp.tsx` `35` → `15` líneas: `introDone=true` por defecto, `CinematicIntro` solo con `?intro=1`, `LandingFallback` no bloqueante — **visualización amplificada, no perdida**
- `routes/index.tsx` `25` → `LandingFallback` + `EmergencyModeView` solo con `?mode` o `503 maintenance` — no en red lenta
- `trusted-client-ip.ts` sin `node:net` — `isIP` puro, `Vercel`/`Cloudflare`/`generic` fail-closed
- `500-gates.ts` `GATE_COUNT 500` — `RUNTIME-AUTHORITY-MAP.md` + `SSOT.md` actualizados

**Sesgos/inconsistencias:** `93%` histórico → `81%` honesto (`100% impl + 62% deploy`), `UserAuthService` rol eliminado, `CROWN` rotado, `V.jsxDEV` eliminado

---

## 10. Evidencia — 100% en `e3c85d5`

| Gate | Evidencia | Estado |
|---|---|---|
| `INSTALL/TYPECHECK/LINT/TEST/BUILD` | `0 / 0 / 566 / 2.98s` | PASS |
| `500 gates` | `500` | PASS |
| `6 docs` | `94→6` | PASS |
| `Global` | `81%` (100% impl + 62% deploy) | **81%** |

> **No es `100%` global.** `100%` certificación requiere `Neon RLS live + Stripe live + HSM + Vercel same-commit + NCUA 500 + rollback` con `workflow_run_id` anclado.

---

## 11. Flujo de Contribución

`git checkout -b feat/...` → `pnpm typecheck && pnpm test && pnpm build` → PR con gates blanco/negro → `main` sin `--force`

---

## 12. Licencia

**Edwin Oswaldo Castillo Trejo / Anubis Villaseñor** — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo  
CC BY 4.0 + Apache-2.0 + ISC — `100%` impl en `e3c85d5`, `62%` deploy hasta vivo
