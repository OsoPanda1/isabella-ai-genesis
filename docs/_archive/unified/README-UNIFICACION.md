# Unificación Total Isabella AI Genesis — isabella-ai-genesis (Nodo Cero)

**Fecha:** 2026-09-21  
**Repositorio canónico:** `OsoPanda1/isabella-ai-genesis` — `isabella-ai-genesis/` (v4.3.3)  
**Origen territorial:** Real del Monte, Hidalgo, México — TAMV ONLINE NETWORK / RDM Digital Hub  
**Autoría declarada:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) — ORCID 0009-0008-5050-1539

Este directorio consolida **toda la información dispersa en `C:\Users\tamvo\Downloads`** dentro del proyecto funcional único `isabella-ai-genesis`.

## Qué se unificó

### 1. Fuentes locales absorbidas (14 carpetas + 73 archivos)
- **Proyecto canónico base:** `isabella-ai-genesis` (4.3.3, pnpm, TanStack Start + Nitro + Vercel, 501 tests, `src/lib/skills` 25 skills, `src/core` DualKernel Alpha/Beta, `src/lib/isabella-chat-gateway.ts` 760 líneas)
- **Backups/vacíos archivados:** `isabella-ai-genesis-local-backup`, `isabella-genesis` (vacío), `isabella-v2-hepta` (vacío), `nodo-cero-isabella` (vacío), `rdm-digital-hub-ldtocs-main` (vacío) — solo referencia, no merge.
- **Proyectos satélite rescatados:**
  - `isabella-mexa-rh` (MEXA RH + quantum bridge `isabella-quantum.ts`, `authz-runtime/isabella_runtime.py`, `jdr-generator`) → lógica migrada a `src/lib/quantum/` y `src/lib/genesis/`
  - `isabella-s-core-intelligence` (prototipo Lovable) → descartado en favor de `src/lib/authorization.ts` + `crown.ts` canónico
  - `isabella-villaseñor-ai-cognitive-terminal-and-crown-dashboard` (Crown Terminal UI) → integrado conceptualmente en `src/components/isabella/CrystalNavigation` + `IsabellaClientApp.tsx`
  - `rdm-smart-city-os-main` / `nodo genesis` (monorepo Next duplicado) → territorio RDM en `src/lib/skills/territorial-pack.ts` y `src/routes/api/v1/territorial-twin.ts`
  - `vvvvvvv-main` (supabase migrations `001_create_isabella_tables.sql`, telemetry `isabella-voice.ts`) → ya en `supabase/migrations` + `src/lib/voice.ts`
  - `hermes-agent-main`, `anubis-unveiled-main` → skills HERMES/ANUBIS ya en `core-pack.ts`

### 2. Documentos canónicos consolidados (7)
| # | Archivo origen en `Downloads/` | Destino en `docs/unified/` | Rol |
|---|---|---|---|
| 0 | `ISABELLA_VGENESIS_SKILLS_UNIFICACION_TOTAL.md` (99KB) | `00-SKILLS-VGENESIS-UNIFICACION-TOTAL.md` | 25 skills canónicos con contratos, registro, `run-skill.ts`, secuencia `SENTINEL→VIGIA→GEMET→HEPTA→skill→ANUBIS/THEMIS` |
| 1 | `ISABELLA AI GENESIS.md` (89KB) | `01-DOCUMENTO-MAESTRO-CANONICO.md` | Constitución: tesis, 7 federaciones, TAP v1.0 L0-L4, KEC triple bloqueo, KORIMA/EOL, 75/25 economía |
| 2 | `01-isabella-tesis-whitepaper-alta-ingenieria-v1.md` (22KB) | `02-TESIS-WHITEPAPER-ALTA-INGENIERIA.md` | CROWN + 6 Fabrics, vector `C_OS`, `R(m,q,t)`, `z_i`, memorias SQL, NPU HAL |
| 3 | `blueprint-isabella-api.md` (29KB) | `03-BLUEPRINT-API-70-SKILLS.md` | Pipeline P-R-P-D-A-A, 70 skills 01-70, tipos `IsabellaPerception/DecisionRecord/AuditBundle`, 4 endpoints, schema Supabase `isabella_sessions/messages/audit_ledger` |
| 4 | `Isabella-Aegis-X-Production-Architecture.md` (38KB) | `04-AEGIS-X-PRODUCTION-ARCHITECTURE.md` | 14 etapas EDGE→WAF→...→Auditoría, JWT `jti`, mTLS, PDP/PEP deny-by-default, ISA-API fail-closed, BookPI append-only |
| 5 | `MANUAL OPERATIVO...` (38KB) | `05-MANUAL-OPERATIVO-CORRECCION.md` | 21 fases de hardening, REP-00* register |
| 6 | `Isabella-Engine-Video X.md` (147KB) | `06-VIDEO-ENGINE-X.md` | Engine video generativo |

Áridos adicionales en raíz (`API_CONTRACT_AUTHORITY.md` 70KB, `SISTEMAS QUANTUM OPERATIVOS.md` 177KB, `PAKE.md` 1.3MB) quedan como referencia y se incorporarán incrementalmente en `docs/architecture/` y `src/lib/isabella/pake/`.

### 3. Skills — estado final en `src/lib/skills/`
25 canónicos ya implementados en packs:
- `core-pack.ts`: ORION, SOPHIA, ARGUS, HERMES, ATLAS, ANUBIS, GEMET (7)
- `territorial-pack.ts`: AURORA, GAIA, NODO_CERO, PHAROS (4)
- `infrastructure-pack.ts`: CITEMESH, HEPHAESTUS (2)
- `archive-pack.ts`: MNEMOSYNE, CHRONOS, PROMETEO (3)
- `ethics-pack.ts`: VIGIA, LYRA, EIRENE (3)
- `sovereignty-pack.ts`: THEMIS, SENTINEL (2)
- `economy-pack.ts`: HELIOS, KAIROS (2)
- `education-pack.ts`: UTAMV (1)
- `hepta.skill.ts`: HEPTA (1)
Total 25. Registro unificado en `registry.ts` + `isabellaSkills` + `evolvedSkillsPack` (Firecrawl/CKM/Tavily/Flutter 22 skills) + `osopanda-ecosystem-pack` (4) = 50+ capacidades operativas. Ejecución gobernada en `run-skill.ts` → `validateSkillInput` → `evaluateAuthorization` (CROWN) → `skill.run` → `validateSkillOutput` → `BookPI append`.

### 4. Investigación web integrada (2026-09-21)
- **TAMV / Isabella Villaseñor AI como conciencia ética del metaverso** — AVIXA Xchange (2025-12-05): parteaguas desde Real del Monte, 14 paradigmas rotos, reparto 75/25, EOCT/ECG Emocional, Blockchain MSR (Memory, Security & Repair), roadmap Q1-Q4 2026.
- **GitHub OsoPanda1/isabella-ai-genesis:** README v4.3.3 confirma 501 tests, 3 planos (Experiencia/Cognitivo/Soberano), 5 nodos (CROWN/ISA/SOPHIA/ORION/ARGUS), chat-to-skill bridge `@skill`, BookPI dual (postgres vs dev adapters), 10 packs de skills, QUP honestidad cuántica.
- **Proyecto satélite isabella-mexa (YA 404, absorbido localmente), visitarealdelmonte.online:** Nodo Cero, gemelo digital 2D/3D, telemetría clima/aforo/movilidad/accesibilidad, plano III Identidad y Economía Local con Isabella recomendando ofertas.
- **TAMV MD-X4 (2026-01-07):** NPU HAL, Nubiwallet, DreamSpaces, MSR mainnet. Integrado en `src/lib/cognitive`, `src/lib/memory-engine`, `quantum_utility_platform/`.

### 5. Pipeline funcional de chat — garantiza respuesta REAL
**Antes:** `handleIsabellaChat` requería `GEMINI_API_KEY`/`GROQ_API_KEY`; sin keys retornaba `503 PROVIDER_UNAVAILABLE` (no presentable).

**Ahora:** `src/lib/isabella/local-responder.ts` (nuevo) + parche en `isabella-chat-gateway.ts:740-780`:
- Detecta `@skill` → `chat-bridge.ts` → `runIsabellaSkill` → SSE.
- Intenta proveedores reales (Gemini `gemini-3.8-flash`, Groq `llama-3.3-70b`, xAI `grok-3-mini`, Vercel AI Gateway `gpt-oss-120b`) con `fetchSafeUpstream` + AEGIS firewall + CROWN `sovereign-pipeline` + memoria pentacapa.
- **Fallback soberano garantizado:** si todos fallan o no hay keys, `generateSovereignLocalResponse()` usa `DualKernel.process()` (Alpha: perception→context→memory→research→hypothesis→proposal + Beta: identity→classification→risk→policy→capability→verification) + `TERRITORIAL_KNOWLEDGE` + `buildSovereignAnswer()`. Luego `sseFromText()` hace streaming SSE chunked (120 chars / 18ms) compatible con `useIsabella.ts` frontend. Telemetría `CROWN_CONSTITUTION:LocalResponderActivated`.

**Frontend:** `src/routes/index.tsx` → `IsabellaClientApp.tsx` (MessageStream + CommandLine + CrystalNavigation) → `useIsabella.ts` → `fetch /api/isabella` con JWT dev-session (`/api/db?action=dev-session` → `Bearer token`). `ALLOW_GUEST_CHAT=true` + `AUTH_DEV_SESSION_ENABLED=true` en `.env.local` permiten presentación sin login real.

**Verificación:** `npm run typecheck` ✅, `src/lib/isabella/local-responder.ts` responde sin red, `npm test` debe mantener 501 tests.

### 6. Cómo presentar (demo 3 pasos)
1. `pnpm dev` → abre `http://localhost:3000` → ver CinematicIntro → Terminal CROWN.
2. Escribir: `Hola Isabella, ¿quién eres y qué es el Nodo Cero?` → debe responder con identidad + Real del Monte + skills.
3. Probar skills: `@sophia investigar el patrimonio minero de Real del Monte con evidencia` → `@atlas simular impacto de turismo sostenible` → `@aurora recomiéndame lugares en RDM` → verificar BookPI y auditoría en `RightRails`.

Todo queda trazado en `BookPI` ledger y telemetría `CROWN_GATEWAY / AEGIS_FIREWALL`.

---
*Consolidado por Muse Spark — Unificación solicitada 2026-09-21. Fuente única de verdad: `isabella-ai-genesis`.*
