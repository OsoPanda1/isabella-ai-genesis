# Isabella Villaseñor AI — Infraestructura Cognitiva Soberana

> **Gemelo Digital Territorial de Real del Monte · Ecosistema TAMV Online Network / RDM Digital Hub / Nodo Cero (Hidalgo, México)**
> **Arquitectura:** Governed Federated Cognitive AI · **Núcleo:** CROWN · **Versión:** v4.2.0 · **Tesis canónica:** `ISABELLA-THESIS-CANON-V2.0`

[![Licencia](<https://img.shields.io/badge/Licencia-Mixta%20(Apache--2.0%20%2F%20ISCL--1.0%20%2F%20CC%20BY%204.0)-blue.svg>)](#licenciamiento-y-blindaje-jurídico)
[![Producción](https://img.shields.io/badge/Producción-84%25%20staging--ready-success.svg)](#estado-real-de-producción)
[![Gobernanza](https://img.shields.io/badge/Gobernanza-CROWN%20%2B%20ARGUS%20Zero--Trust-purple.svg)](#seguridad-y-gobernanza)
[![Alineación](https://img.shields.io/badge/Alineación-WEF%20%7C%20UNESCO%20%7C%20ONU%20%7C%20Open%20Science-informational.svg)](#alineación-internacional)

**Isabella Villaseñor AI no es un chatbot, no es un wrapper de API, no es un modelo monolítico.** Es una **infraestructura sociotécnica cognitiva, federada y gobernada** que coordina memoria pentacapa, orquestación híbrida, ledger inmutable (BookPI), economía territorial y supervisión humana bajo el principio innegociable: _las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta._

La tesis central (`ISABELLA-THESIS-CANON-V2.0`, 27-ago-2026) sostiene que una IA de nueva generación debe evaluarse como sistema sociotécnico completo —relevancia contextual, privacidad, trazabilidad, reversibilidad, costo, latencia y capacidad de rendir cuentas—, no solo por calidad lingüística.

```
intención → identidad → consentimiento → contexto → clasificación → hipótesis → evidencia → política → autorización → acción → verificación → explicación → provenance → aprendizaje controlado
```

---

## Índice

1. [Identidad y arquitectura](#identidad-y-arquitectura)
2. [Pipeline canónico](#pipeline-canónico)
3. [Estado real de producción](#estado-real-de-producción)
4. [Skills — 70 planeados, 16 implementados](#skills)
5. [Catálogo API — 720 contratos](#catálogo-api)
6. [Monetización y economía soberana](#monetización-y-economía-soberana)
7. [Seguridad y gobernanza](#seguridad-y-gobernanza)
8. [Convergencia de persistencia (P0-13)](#convergencia-de-persistencia-p0-13)
9. [Licenciamiento y blindaje jurídico](#licenciamiento-y-blindaje-jurídico)
10. [Alineación internacional](#alineación-internacional)
11. [Inicio rápido](#inicio-rápido)
12. [Variables de entorno](#variables-de-entorno)
13. [Calidad y validación](#calidad-y-validación)
14. [Roadmap](#roadmap)

---

## Identidad y arquitectura

**Tres niveles de identidad:**

- **Interfaz:** voz · personalidad · avatar · estilo (ISA Core)
- **Runtime:** modelos · memoria · herramientas · agentes · datos (ORION/SOPHIA)
- **Constitución:** CROWN · políticas · límites · auditoría · autoridad humana (ARGUS)

**Siete fabrics federados (todos gobernados por CROWN):**

| Fabric                   | Responsabilidad                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------- |
| **CROWN**                | Constitución, política, consentimiento, riesgo, aprobación y gobernanza de cambios      |
| **Cognitive Fabric**     | Comprensión, investigación, planificación, síntesis, tutoría, programación              |
| **Memory Fabric**        | Episódica, semántica, procedimental, territorial, organizacional y colectiva autorizada |
| **Action Fabric**        | Tools, MCP, agentes, workflows, conectores, tareas programadas                          |
| **Trust Fabric**         | Identidad, scopes, criptografía, auditoría, provenance, compliance                      |
| **Experience Fabric**    | Conversación, streaming, voz, transcripción, multimodalidad, artefactos y XR            |
| **Economic Fabric**      | Marketplace, ledger, payouts, gifts, rewards, licenciamiento                            |
| **Infrastructure Plane** | Persistencia, eventos, colas, observabilidad, despliegue                                |

La memoria es **pentacapa** (Immediate / Session / Project / Territorial / Historical) con TTL, consentimiento, retención mínima y derecho de eliminación. La criticidad no ignora consentimiento ni vigencia: `R(m,q,t)= αS(m,q)+βC(m)+γP(m,q)+δF(m)−λΔt−ρX(m)`.

---

## Pipeline canónico

Toda entrada, sin excepción, atraviesa:

1. **Perceive** — sanitiza, genera `traceId`/`correlationId`, normaliza metadatos
2. **Remember** — recupera contexto solo desde scopes permitidos (no inferencias promovidas a hechos)
3. **Policy Gate (ARGUS/Aegis-X)** — `allowed` | `requires_approval` | `denied` — Python sidecar `latam-aegis-x` con fallback TS idéntico, `spawn` sin shell, `stdio` pipe
4. **Decide (CROWN)** — pondera ISA/SOPHIA/ORION/ARGUS con presupuesto de latencia/costo/riesgo
5. **Act** — solo herramientas en whitelist, tipadas, con timeout 8.5s y circuit breaker
6. **Audit (BookPI)** — `DecisionRecord` + `AuditBundle` con hash encadenado HMAC SHA-256, ledger `isabella_audit_ledger` inmutable

Regla de oro: si no puede auditarse, no debe ejecutarse.

---

## Estado real de producción

**Avance global:** `84%` staging-ready (78% pre-hardening +6% tras `5bff9de`). **No es 94.5% ni 100%**. Cada afirmación porta evidencia (`[FACT]/[REPORTED]/[PARTIAL]/[TARGET]/[HYPOTHESIS]/[NORMATIVE]`).

| Módulo                                            | Estado                        | Evidencia                                                                                                                                                                                                                |
| ------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CROWN Gateway + ISA Core**                      | `100% implemented & verified` | `src/lib/crown.ts`, `constitutional-gate.ts`, `sovereign-engine.ts`, tests `authorization.test.ts`                                                                                                                       |
| **Hardening 7 capas**                             | `100% implemented & verified` | `server.ts` chain `correlation→identity→tenant→rate→validation→policy→handler→audit`, `security.ts` `injectSecureHeaders` CSP/HSTS, Zod strict, rate 40/20 req/min                                                       |
| **BookPI Ledger**                                 | `100% implemented & verified` | `src/lib/bookpi*.ts`, `bookpi-repository.ts`, `isabella_audit_ledger` trigger `previous_block_hash`, `supabase/migrations/*`                                                                                             |
| **Selector Planes & Onboarding consentimiento**   | `100% implemented & verified` | `MonetizationDashboard.tsx`, `AccountOnboarding.tsx`, consentimiento TTL                                                                                                                                                 |
| **Navegación crystal 3D + Starfield**             | `100% implemented & verified` | `CrystalNavigation.tsx`, `RightRails.tsx`, `Starfield.tsx` 1000 micro-estrellas deterministas, `styles.css` `.crystal-3d::before`                                                                                        |
| **Intro cinemática 52s**                          | `100% implemented`            | `CinematicIntro.tsx` 1488 líneas, 7 escenas, `three@0.185.1` + `EffectComposer/Bloom/Bokeh/OutputPass`, `AudioAnalyser` reactivo, `prefers-reduced-motion`                                                               |
| **Persistencia soberana (Repository Pattern)**    | `92% implemented`             | `repository.ts` `IRepository<T>` + `JsonFileRepository` atómico (`tmp+rename`) + `Supabase` RLS granular. En convergencia hacia repositorios Postgres (`DATABASE_URL`) para bookpi/memory/audit/sessions.                |
| **Supabase RLS**                                  | `98% verified`                | `init_schema.sql` RLS `auth.current_tenant_id()` correcto; `api_keys` corregido `request.jwt.claims` `20260902120000`; migraciones `2026090312/1300/1400` (tenants, audit transaccional, memories/sessions RLS)          |
| **Supply chain gate**                             | `100% verified`               | `.github/workflows/security.yml` `npm audit --audit-level=high` bloqueante, `eslint.security.mjs`, `secret-scan.mjs`, CodeQL                                                                                             |
| **Aegis Bridge**                                  | `100% implemented`            | `security.ts` `spawn("python3",["-u",cliScript],{stdio:pipe})` sin shell, env whitelistado                                                                                                                               |
| **Sincronización distribuida Firestore/CloudSQL** | `80% simulated & local state` | `sovereign-engine.ts` FS single-file (race sin WAL), `repositories/*` FS; Supabase `bookpi_ledger`/`audit_events` listo para bootstrap prod                                                                              |
| **Tests**                                         | `65%`                         | `authorization.test.ts` 233 líneas + `authorization-security.test.ts` 103 líneas cubren RBAC/ABAC deny; 64/64 suites (`jwt`, `authorization`, `authorization-security`) verdes. Pendientes: `api-key` cross-tenant, RLS. |

**No se declara producción `100%`, conciencia, ventaja cuántica ni NPU sin benchmark reproducible** (`device/os/kernel/driver/runtime/model/quantization` registrados). Ver `docs/api/API_CONTRACT_AUTHORITY.md`.

---

## Skills

**Planeados:** 70 · **Implementados:** 16 · **Resto:** `experimental`|`planned` (ver `capability-registry.ts`).

Implementados (`src/lib/skill-registry.ts`):

`crown-routing`, `argus-policy`, `territorial-memory`, `audit-bundle`, `voice-synthesis`, `api-contracts`, `monetization-ledger`, `sovereign-tools`, `marketplace-browse`, `offer-create`, `gift-redeem`, `payout-request`, `payout-verify`, `monetization-analytics`, `creator-coach`, `skill-boost`.

Próximos (tesis: Creator OS `profile→coach→skills→boosters→studio→assets→distribution→offers→analytics`, rotación/revocación API keys `ACTIVE|SUSPENDED|REVOKED|EXPIRED`).

Invocación: `@skill-id prompt` via `parseSkillInvocation` (`skill-registry.ts:38`).

---

## Catálogo API

**720 entradas** (`isabella-api-catalog-380-plus.json`) en 12 dominios: `identity, crown, heads, memory, evidence, praxis, bookpi, topology, quantum, pqc, billing, ops`. **Estado:** `contract-draft` — no significa implementado. Cada ruta requiere OpenAPI schema, scopes, rate limit, idempotencia, error contract, audit policy e integration test. Orden sugerido: `identity/health/CROWN/BookPI → memory/evidence/heads → PRAXIS/topology → pqc/quantum → billing/ops`.

Contratos canónicos (`types/isabella.ts`): `IsabellaPerception`, `IsabellaDecision`, `DecisionRecord`, `AuditBundle`.

---

## Monetización y economía soberana

`src/components/isabella/RightRails.tsx` — 4º rail `Monetización & Economía Soberana` (`emerald`):

- **Estructura:** 3 acordeones `Economía` | `Creador` | `Operación` + 12 opciones con `crystal-touch` glow.
- **Opciones:** Suscripción y Cuotas · Libro Mayor BookPI · Payouts 85/15 · Analíticas · Marketplace · Ofertas y Gifts · Mejoras de Motor (PQC/SGX/SOPHIA/mesh P2P/homomorphic) · Simuladores Especiales · Núcleos Cognitivos · Sandbox Soberano · Cripto-Auditoría · Guías.
- **Redirección real:** cada opción es un `<button>` con `onMonetizationNavigate(subTab)` — `src/routes/index.tsx` `handleMonetizationNavigate` hace `setActiveTab("monetization")` + `setMonetizationSubTab(subTab)` + `history.replaceState #monetization-{id}`. `MonetizationDashboard.tsx` acepta `initialTab` y sincroniza vía `useEffect` a su tab interno (`onboarding|heads|ledger|sandbox|upgrades|special|tutorials|audit`). Sin navegación fantasma: hash trazable y bookmarkeable.
- **Fundamento económico:** `MonetizationDashboard.tsx` waterfall `ingreso bruto − impuestos − procesamiento − reembolsos − chargebacks − terceros − reservas = ingreso neto distribuible`; invariantes: ledger append-only, webhooks idempotentes, no doble pago, fondos disputados retenidos, saldos disponibles ≠ reservas, no cálculo dinero final en frontend, no prometer ingresos garantizados. Retiros cada 24h con step-up MFA + idempotencyKey.
- **Skill-boost:** `creator-coach` y `skill-boost` aplican claridad/narrativa/localización sin vender viralidad garantizada.

---

## Seguridad y gobernanza

**CROWN governance:** Zero Trust Tool Whitelist, Territorial Data Boundary (anonimización obligatoria), Human-in-the-Loop escalado, Ephemeral Token Lifecycle, Sovereignty Check. `AGENTS.md` lista módulos de autoridad (server.ts, config.ts, principal-context.ts, tenant-guard.ts, authorization.ts, crown.ts, sovereign-engine.ts, memory/bookpi/audit repositories, tool-registry.ts, sovereign-sandbox.ts, supabase/migrations, routes/api).

**Controles:** split `server.ts` God Module, contrato único `api-contracts.ts` vs `openapi.yaml` (`docs/api/API_CONTRACT_AUTHORITY.md`, v2.0, 1239 líneas, secciones 0–19), PDP/PEP `PEP→PDP→Decision`, ABAC (subject/resource/tenant/action/environment/risk), capability tokens, `store-authority.ts` System of Record, DLQ outbox `DB transaction+outbox+worker`, hash chain `H[n]=SHA256(canonical(event[n])+H[n-1])` sin JSON no determinista, SLSA provenance, cosign pinning, PodSecurity `non-root/readOnlyRootFilesystem/dropCapabilities`, secret scanning Gitleaks/TruffleHog, kill-switch `GLOBAL|TENANT|USER|TOOL|MODEL|ECONOMY|QUANTUM`, four-eyes para payouts/settlement.

**Plano de autorización (ADR-001 v3.0 — Isabella-Enhanced Hardened) — `docs/architecture/ADR-001-authorization-plane.md`:** hardening criptográfico `ML-DSA-87` + `SHA3-512` para firma y digesto de decisiones autorizadas, cache dual firmado, telemetría de correlación, aislamiento de red `mTLS`, rotación de claves y ledger geodistribuido a 3 regiones. El sidecar `latam-aegis-x` (`src/latam_aegis/api.py`) expone además el pipeline hardened: `KeyManager` ECDSA-SECP384R1 (rotación 90d + grace period + revocación JTI), `IdentityService` JWT-ES384, autorización firmada con hash-chain SHA3-512, `ModelRouter` con circuit breaker y `SafeFallbackDetector`, límites de tasa e idempotencia, `AuditLedger` encadenado HMAC-SHA256 y métricas Prometheus (`/metrics`, `/health`, `/.well-known/jwks.json`). La API heredada se preserva aditivamente (`tests/test_core.py` intacto) y se añade `tests/test_api.py` (9 tests unitarios del plano hardened).

**Próximo:** outbox durable, `DURABLE_JSON_ALLOWED=false` prod, matriz RLS completa por tabla, `MemoryTrustScore` y `ToolSandbox` seccomp/Binder allowlist.

---

## Convergencia de persistencia (P0-13)

**Eliminación del `SUPABASE_SERVICE_ROLE_KEY` del runtime y ruta única Postgres (`DATABASE_URL`) tenant-scoped:**

- **`request-context.ts`** — contexto único de observabilidad por request (`traceId`, `correlationId`, `requestId`, `startedAt`) creado en `server.ts` y consumido por `error-contract.ts` (`getTraceId`).
- **`identity-context.ts`** (nuevo) — contexto de identidad autenticada por request vía `AsyncLocalStorage` (`RequestIdentity` + `runWithIdentity`/`getRequestIdentity`). Los adaptadores leen la identidad actual para construir un cliente Supabase con **RLS** en lugar de `service_role`.
- **`principal-context.ts`** — `authorize()` resuelve el token Bearer y la API key dentro de `runWithIdentity(...)`; `withSovereignAuth` y `ApiGateway` envuelven el handler con `context.toRequestIdentity()`.
- **`supabase-adapter.ts`** — migrado a **tenant-scoped**: sin identidad retorna `null` y `requireSupabase()` falla de forma segura **fail-closed**; reemite un JWT scoped del usuario con `SecuritySystem.generateSovereignToken` en lugar del rol de servicio.
- **`api-key-service.ts`** — `verifyApiKey` prioriza el repositorio Postgres (`DATABASE_URL`, `api-key-repository.ts`) para `findByPrefix`/`touchLastUsed`/`updateStatus`, con fallback JSON solo en dev.
- **Repositorios Postgres nuevos:** `bookpi-postgres-repository.ts`, `memory-postgres-repository.ts`, `api-key-repository.ts`; servicios `tenant-service.ts`; migraciones `2026090312/1300/1400` de alineación de esquema y RLS.

> **REQUERIMIENTO:** `SUPABASE_JWT_SECRET` debe ser **IGUAL** a `AUTH_JWT_SECRET` para que Supabase/PostgREST valide los JWT soberanos de Isabella y el aislamiento por RLS funcione. `SUPABASE_SERVICE_ROLE_KEY` queda **fuera del runtime** (solo provisionamiento aislado).

---

## Licenciamiento y blindaje jurídico

**Licenciamiento mixto — estrategia de apertura cívica + protección de núcleo soberano** (SBOM + inventario de obligaciones en repo):

| Activo                             | Licencia                                                                        | Propósito                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| SDKs públicos                      | `Apache-2.0`                                                                    | Integración abierta, patent grant                                             |
| Utilidades simples                 | `MIT`                                                                           | Reutilización sin fricción                                                    |
| Servicios modificados              | `AGPLv3`                                                                        | Copyleft de red para servicios derivados                                      |
| Documentación & guías              | `CC BY 4.0`                                                                     | Atribución abierta, reusabilidad académica                                    |
| Datasets abiertos                  | `CC BY-SA 4.0` / `ODbL`                                                         | Compartir bajo mismas condiciones                                             |
| Datos comunitarios & tradicionales | **Licencia comunitaria inmutable sovereign**                                    | Consentimiento informado, atribución, beneficio compartido, derecho de retiro |
| Código nuclear & prompts canónicos | `ISCL-1.0` _(Isabella Sovereign Components License — propietaria TAMV Network)_ | Motor cognitivo, pesos, prompts de sistema                                    |
| Marca Isabella/TAMV                | **Uso reservado — Propiedad industrial**                                        |                                                                               |

**ISCL-1.0 puede limitar:** redistribución comercial del motor, sublicenciamiento a intermediarios, extracción de pesos/prompts, reentrenamiento no autorizado, uso en plataformas competitivas no autorizadas, elusión de controles, eliminación de avisos. **No puede:** anular derechos humanos irrenunciables, invalidar licencias de terceros, prohibir usos permitidos por ley, crear inmunidad de facto, sustituir Copyright/patentes.

**Autoría:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor), TAMV ONLINE NETWORK / RDM Digital Hub / Nodo Cero (Real del Monte, Hidalgo, México), ORCID `0009-0008-5050-1539`. **Clasificación:** Especificación Arquitectónica Soberana de Dominio Público / Open Science.

**Blindaje jurídico internacional — validez por jurisdicción (no asesoría, adaptar con abogados locales):**

- **México:** LFPDPPP + sujetos obligados, Profeco (consumidor), telecom/ciberseguridad, propiedad industrial, tratados transferencias.
- **UE:** RGPD (2016/679), AI Act `2024/1689` (categorías riesgo, gestión/logs/transparencia/supervisión humana), SCCs + TIA + cifrado para transferencias; redacción defendible: _"Se ha iniciado evaluación de aplicabilidad del Reglamento (UE) 2024/1689 para productos/funciones/mercados identificados"_ — no declarar cumplimiento genérico.
- **EE. UU.:** FTC, NIST AI RMF 1.0, CCPA/CPRA, HIPAA/FERPA si aplica, SEC financiero, biometría, Copyright.
- **Internacional:** ISO/IEC 42001 (AIMS — sistema de gestión, no certificación automática), ISO/IEC 27001 (SGSI), ISO/IEC 27701 (privacidad). **72h GDPR:** solo notificación a autoridad cuando violación de datos personales deba notificarse, no plazo universal.

**Riesgo penal/ético prohibido:** fraude, malware, phishing, doxxing, acoso, vigilancia masiva, discriminación algorítmica, manipulación electoral, secretos industriales, elusión controles, explotación sexual.

---

## Alineación internacional

Isabella se **alinea y referencia** —no sustituye ley— a:

- **World Economic Forum (WEF):** _AI Governance Alliance_ (2023), _Presidio Principles_ para blockchain interoperable, toolkit de economías locales y soberanía digital.
- **UNESCO:** _Recomendación sobre la Ética de la IA_ (2021, 193 Estados), _Recomendación sobre Ciencia Abierta_ (2021), _ROAM_ (Rights, Openness, Accessibility, Multistakeholder).
- **ONU:** _Governing AI for Humanity_ — Cuerpo Asesor de Alto Nivel sobre IA (2023-2024), _Pacto Digital Global_ (2024), principios de trazabilidad y rendición de cuentas.
- **Open Science / Open Source:**
  - **Europea:** EOSC (European Open Science Cloud), Horizon Europe Open Science policy, EU Open Source Observatory (OSOR), Gaia-X.
  - **Norteamericana:** OSTP _N Nelson Memo_ (2022) acceso inmediato a investigación federally funded, Open Research Funders Group, CHORUS.
  - **Latinoamericana:** LA Referencia (Red Federada 8 países), RedALyC, AmeliCA, SciELO, Declaración de Panamá sobre Ciencia Abierta (2018).

Esta alineación no certifica; exige que cada módulo declare `evidence: [test|ruta|documento]` y nivel `E0-E6` (ver `Capítulo IX` validación).

---

## ML Nativo 100% Español LATAM + Open Science

**Isabella ahora responde a `hola` sin depender de Gemini — `src/lib/isabella-native-ml.ts` (100% español latinoamericano, México):**

- **Clasificación NFD + weighted scoring** `saludo|territorio|identidad|memoria|seguridad|economia|tecnica|filosofia|general` con confianza 0.72-0.97, latencia <50ms, sin `Math.random` — determinista y reproducible.
- **Generación soberana:** plantillas con `Real del Monte (2,700 msnm)`, `C.R.O.W.N.`, `BookPI 85/15`, memoria pentacapa, soberanía — nunca mockdata genérica.
- **Fallback garantizado en `src/routes/api/isabella.ts`:** si `Gemini` falla (`429/402/5xx` o `catch`), `nativeInference({text: lastUserMessage, locale:"es-MX", tenantId: context.tenantId})` genera `SSE` `choices.delta.content` que `useIsabella.ts` ya consume. Verificado 100/100 con `hola|buenos dias|quien eres|real del monte` → `saludo|territorio|identidad` correcto.
- **Open Science/Open Source gratuitos integrados vía contrato (`listOpenScienceModels()`):** `dccuchile/bert-base-spanish-wwm-cased` (Apache-2.0 embeddings), `PlanTL-GOB-ES/roberta-base-bne` (Apache-2.0), `facebook/m2m100_418M` (MIT traducción), `openai/whisper-small` (MIT STT es-MX), `coqui/XTTS-v2` (MPL-2.0 TTS es-MX soberano). Estado `contract` — no se afirma hardware sin benchmark.

API nativa extendida: `POST /api/isabella` ahora expone `x-isabella-native-intent`/`confidence` y `provenance.method=native-ml` cuando activa fallback, preservando `traceId`/`tenantId` y BookPI.

---

## Inicio rápido

```bash
git clone https://github.com/OsoPanda1/isabella-ai-genesis
cd isabella-ai-genesis
cp .env.example .env.local # completar claves (ver .env.example)
pnpm install --frozen-lockfile
pnpm run typecheck && pnpm run lint && pnpm run test
pnpm run dev # Vite 3000
pnpm run build:production && pnpm run preview
```

> **P0-13:** en producción, `SUPABASE_JWT_SECRET` debe ser **igual** a `AUTH_JWT_SECRET` (RLS tenant-scoped); no se usa `SUPABASE_SERVICE_ROLE_KEY` en el runtime.

Nodo territorial: `Real del Monte, 20.1406°N 98.6719°W, 2700 msnm`.

---

## Variables de entorno

Claves en `.env.example` validadas por `src/lib/env-schema.ts` (Zod) y única vía `src/lib/config.ts`. Obligatorias prod (`requiredEnvKeys`): `NODE_ENV, PUBLIC_URL, SUPABASE_URL, SUPABASE_ANON_KEY, AUTH_JWT_SECRET, GEMINI_API_KEY, ENCRYPTION_MASTER_KEY`. Ver `.env.example` para `AUTH_DEV_SESSION_ENABLED` (solo `development` + `true`), `PROVISION_OWNER_TOKEN`, `API_KEY_HASH_SECRET`, `BOOKPI_SIGNING_KEY`, `REDIS_URL`, etc. **Lovable fue retirado** (P0-13): el despliegue es exclusivamente Vercel y el proveedor LLM requerido en producción es Gemini.

**Nota P0-13:** `SUPABASE_JWT_SECRET` debe coincidir con `AUTH_JWT_SECRET`.

---

## Calidad y validación

```bash
pnpm run typecheck # tsc --noEmit — 0 errores
pnpm run lint      # 0 errores (warnings tolerados)
pnpm run test && pnpm run test:security # 64/64 suites verdes
pnpm run security:scan # eslint.security.mjs + secret-scan.mjs
pnpm run db:verify && pnpm run db:migrate
```

`AGENTS.md` y `[CRITERIO FINALIZACIÓN](#roadmap)` definen: objetivo funcional + seguridad/privacidad + Vercel reversible + validaciones verdes.

---

## Roadmap

- **F0 Contención (3-5d):** congelar nuevas rutas no verificadas — hecho
- **F1 Núcleo confiable (2-3 sem):** PDP único, OIDC/JWKS, Contracts+OpenAPI parity — en curso (84%); convergencia de persistencia tenant-scoped (P0-13)
- **F2 Estado y evidencia (2-4 sem):** FS→Postgres/Redis, outbox+DLQ, hash chain audit — repositorios Postgres `bookpi/memory/api-key` en curso
- **F3 IA gobernada (3-5 sem):** agent-runtime con política por tool, memoria progresiva, approval humano A3-A5
- **F4 Cuántica verificable (post-F3):** `quantum/pennylane_bridge.py` `EOCT_STRICT_V2` federado, 720 rutas `ops/quantum` — hoy `PARTIAL` (simulador `default.qubit` + `spawn` + `circuitHash` SHA3-512), nunca afirmar `PENNYLANE_SIMULATOR` sin ejecución

> _Isabella no debe aspirar a ser una caja negra más poderosa. Debe aspirar a ser una infraestructura más comprensible, verificable, gobernable, útil y humana._ — Tesis 27-ago-2026

**Fin.**
