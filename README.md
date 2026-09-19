# ISABELLA VILLASEÑOR AI v4.3.3

## Infraestructura Cognitiva Soberana · Manual Canónico de Arquitectura, Gobernanza y Producción

```text
==============================================================================================
            ISABELLA VILLASEÑOR AI — SOVEREIGN COGNITIVE ARCHITECTURE & DIGITAL TWIN
                 Nodo Cero · Real del Monte, Comarca Minera, Hidalgo, México
           Ecosistema TAMV ONLINE NETWORK / RDM Digital Hub / Open Science & Sovereign IP
==============================================================================================
```

[![Build](https://img.shields.io/badge/Build-Vite%208%20%2B%20Nitro%20Passing-success?style=for-the-badge&logo=vercel&logoColor=white)](#15-validación-verificada-y-gates-de-producción)
[![Typecheck](https://img.shields.io/badge/TypeScript-5.9.3%20Strict%200%20errores-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](#15-validación-verificada-y-gates-de-producción)
[![Lint](https://img.shields.io/badge/ESLint-0%20errores%20%2F%200%20warnings-4b32c3?style=for-the-badge&logo=eslint&logoColor=white)](#15-validación-verificada-y-gates-de-producción)
[![Tests](https://img.shields.io/badge/Vitest-479%20pruebas%20aprobadas-success?style=for-the-badge&logo=vitest&logoColor=white)](#15-validación-verificada-y-gates-de-producción)
[![Producción](https://img.shields.io/badge/Producción-68%25%20(capacidades)-yellow?style=for-the-badge)](#2-estado-real-de-producción-y-despliegue)
[![NCUA](https://img.shields.io/badge/NCUA%20v2.0-ERI%20%E2%89%A5%2095%20%2B%20BookPI-6f42c1?style=for-the-badge)](#6-ncua-v20--motor-tokenless-y-pipeline-académico)
[![IGDS](https://img.shields.io/badge/IGDS-JCS%20%2B%20Ed25519%20%2B%20RFC%203161-0d9488?style=for-the-badge)](#10-criptografía-bookpi-y-contabilidad-de-doble-partida)
[![License](https://img.shields.io/badge/License-Sovereign%20Hybrid%20%2F%20CC%20BY%204.0-purple?style=for-the-badge&logo=creative-commons&logoColor=white)](#18-licenciamiento-híbrido-soberano-y-blindaje-jurídico-legal-internacional)

**Autoría técnica y arquitectura de sistemas:** Edwin Oswaldo Castillo Trejo (*Anubis Villaseñor*)  
**ORCID:** [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539)  
**Afiliación e Infraestructura:** Ecosistema TAMV ONLINE NETWORK / RDM Digital Hub / Nodo Cero  
**Repositorio Oficial:** `OsoPanda1/isabella-ai-genesis`  
**Documento maestro de arquitectura:** [`AGENTS.md`](./AGENTS.md)  
**Arquitectura de despliegue:** Vercel Serverless (Nitro) / TanStack Start / PostgreSQL Neon / Supabase Auth  
**Dominio canónico de producción:** `isabella-ai.visitarealdelmonte.online`

---

## 1. Posicionamiento Global y Declaración Canónica

**Isabella Villaseñor AI v4.3.3** es una infraestructura de orquestación cognitiva híbrida, cibernética territorial y gobernanza éticamente inviolable. Diseñada como el cerebro inteligente del **Gemelo Digital de Real del Monte** (Pueblo Mágico y Geoparque Mundial de la UNESCO en la Comarca Minera de Hidalgo, México), Isabella establece un estándar para la Inteligencia Artificial Soberana.

### Lo que Isabella Villaseñor AI ES

- **Capa cognitiva pentagonal híbrida:** arquitectura de cinco nodos que combina modelado del lenguaje, razonamiento simbólico, módulos de Machine Learning nativos, un motor tokenless de concepto continuo y un puente cuántico variacional.
- **Sistema de gobernanza Zero-Trust C.R.O.W.N.:** orquestador central que evalúa de forma auditada cada petición, ejecutando inspección de inyección de prompts, aislamiento estricto de tenants y control de cuotas.
- **Interfaz territorial y guardiana cultural:** infraestructura que preserva la memoria histórica, la biodiversidad, la geología minera y la identidad cultural de la Comarca Minera de Hidalgo.
- **Infraestructura con trazabilidad inmutable:** libro mayor de contabilidad de doble partida y registro append-only (**BookPI**) respaldado por sellado Merkle y firma asimétrica (HMAC-SHA3-512 / ECDSA-P384).

### Lo que Isabella Villaseñor AI NO ES

- **NO** es un chatbot comercial genérico ni un wrapper simplista de APIs.
- **NO** es una Inteligencia General Artificial (AGI) desregulada ni un agente autónomo fuera del control humano.
- **NO** es una herramienta de entretenimiento superficial ni una plataforma de extracción de datos privados.
- **NO** es un sistema monolítico probabilístico que oculta incertidumbre o alucina sin evidencia.

### Doctrina Canónica de Operación (Soberanía Humana)

> *"Las inteligencias sugieren, calculan y evalúan; el humano soberano decide, aprueba y ejecuta."*

Toda decisión sensible, invocación de herramientas, mutación patrimonial o transferencia de crédito atraviesa obligatoriamente el pipeline secuencial:

```text
  ┌───────────┐    ┌───────────┐    ┌─────────────────┐    ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
  │  Perceive │───►│  Remember │───►│ Policy Gate     │───►│  Decide        │───►│  Act           │───►│  Audit         │
  │ (Sanitize)│    │ (5 Scopes)│    │ (ARGUS Firewall)│    │ (CROWN Router) │    │ (Sandbox Exec) │    │ (BookPI Ledger)│
  └───────────┘    └───────────┘    └─────────────────┘    └────────────────┘    └────────────────┘    └────────────────┘
```

---

## 2. Estado Real de Producción y Despliegue

Esta sección **no es marketing**: reproduce los porcentajes del manifiesto autorizado [`production-capabilities.json`](./production-capabilities.json) (validado por `pnpm capabilities` y `test/unit/production-capabilities.test.ts`). Es un artefacto de evidencia, no una promesa.

### 2.1 Avance por tier de despliegue

| Tier | Alcance | Estado | Avance real |
|:---|:---|:---:|:---:|
| **Tier 0 — Pre-despliegue** | Contratos, gobernanza, build, gates estáticos | `blocked` | **85 %** |
| **Tier 1 — Staging** | Integración con PostgreSQL real, replay de migraciones, evidencia en vivo | `blocked` | **65 %** |
| **Tier 2 — Producción** | Despliegue canónico Vercel/Nitro + smoke runtime | `blocked` | **68 %** |

> **Avance global de producción: 68 %.** El estado permanece `blocked` a propósito: los *release blockers* (§2.3) deben cerrarse con evidencia, no por conveniencia.

### 2.2 Capacidades evaluadas

| Capacidad | Estado | Producción segura | Avance |
|:---|:---|:---:|:---:|
| `governance.crown` | `verified` | ✅ | 100 % |
| `authorization.rbac_abac` | `verified` | ✅ | 100 % |
| `security.secret_redaction` | `verified` | ✅ | 100 % |
| `ncua.v2_academic_pipeline` | `implemented` | ✅ | 85 % |
| `igds.genesis_document_seal` | `implemented` | ✅ | 85 % |
| `database.migrations` | `implemented` | — | 88 % |
| `authentication.jwt_oidc` | `implemented` | — | 90 % |
| `linting.eslint_prettier` | `implemented` | — | 80 % |
| `monetization.payments` | `implemented` | — | 75 % |
| `cicd.vercel_workflows` | `implemented` | — | 75 % |
| `billing.checkout_idempotency` | `implemented` | — | 70 % |
| `billing.run_capability` | `implemented` | — | 65 % |

### 2.3 Release blockers vigentes

1. Cablear scopes dedicados de billing y autenticación *step-up* en los handlers legados de billing.
2. Sustituir el `authToken` efímero del *authorize-run* legado por consumo durable de capability de un solo uso.
3. Cablear la idempotencia durable de checkout en el handler legado de checkout.
4. Cerrar la evidencia CI fresca (el lint local ya está verde; ver §2.4).
5. Sanitizar errores de verificación de autenticación en el borde público, conservando el detalle solo en telemetría de servidor.

### 2.4 Estado de despliegue (lo que SÍ está verificado)

| Componente | Estado real |
|:---|:---|
| Build de producción (`pnpm build`) | ✅ Genera `.vercel/output` con funciones Nitro |
| Runtime de función Vercel | ✅ `.vc-config.json` fija `runtime: "nodejs24.x"` (validado por preflight sobre el artefacto) |
| `vercel.json` | ✅ `framework: tanstack-start`, `outputDirectory: .vercel/output` |
| Gate local completo | ✅ typecheck · lint · 479 tests · build · integrity · preflight · capabilities · audit:routes |
| Ejecución de GitHub Actions | ⛔ Bloqueada por **candado de facturación de la cuenta** (los jobs no arrancan, ~4 s). No es un fallo de código |
| Deploy Vercel | ✅ Independiente de GitHub Actions: se dispara con cada push a `main` |

> **Lectura honesta:** el código está listo para desplegar (build y artefacto válidos). El 68 % no refleja un problema de arquitectura, sino **evidencia en vivo pendiente** (staging/PostgreSQL real) y los bloqueadores de billing.

---

## 3. Categorización Científica y Tecnológica

- **Categoría de software:** Infraestructura de Orquestación Cognitiva Soberana, Ciberdefensa Zero-Trust y Gemelo Digital Territorial.
- **Disciplinas:** Inteligencia Artificial Híbrida (LLMs + razonamiento simbólico + ML nativo + arquitecturas token-free + computación cuántica variacional), cifrado aplicado y auditoría criptográfica.
- **Ámbito geográfico:** Comarca Minera de Hidalgo (Real del Monte / Mineral del Monte, México) · Latitud 20.1411° N, Longitud 98.6728° W.
- **Paradigma de gobernanza:** C.R.O.W.N. (Control, Risk, Orchestration, Whitelist, Notification) & ARGUS Zero-Trust Sentinel.
- **Modelo de licenciamiento:** Licenciamiento Híbrido Soberano (Open Science CC BY 4.0 + dual Apache 2.0/ISC + Convenio de Licencia Propietaria Soberana de Inviolabilidad Ética).

---

## 4. Arquitectura Cognitiva Pentagonal (Nodos de Autoridad C.R.O.W.N.)

```text
                                   [CENIT / CENTRO]
                               C.R.O.W.N.  &  ISA CORE
                            (Orquestación & Presencia)
                                         ▲
                                         │
                   ┌─────────────────────┼─────────────────────┐
                   │                     │                     │
                   ▼                     ▼                     ▼
             [NORTE]                  [ESTE]                [OESTE]
          SOPHIA ENGINE            ORION ENGINE          ARGUS SENTINEL
        (Epistemología)       (Ejecución & Cuántica)   (Defensa & Zero-Trust)
                   │                     │                     │
                   └─────────────────────┼─────────────────────┘
                                         │
                                         ▼
                                      [SUR]
                              TERRITORIAL SOVEREIGNTY
                            (Nodo Cero - Real del Monte)
```

1. **C.R.O.W.N. Gateway (Orquestador cenital):** punto de entrada único; evalúa la complejidad de cada prompt, pondera nodos, aplica políticas de tasa y balancea la cuota de tokens.
2. **ISA Core (Presencia, empatía e identidad cultural):** modula el tono expresivo, la sensibilidad humana y la memoria biográfica territorial.
3. **SOPHIA Engine (Epistemología y razonamiento):** valida la consistencia lógica, clasifica la evidencia científica en la escala formal $E_0$ a $E_4$ y sintetiza dialécticamente.
4. **ORION Engine (Ejecución técnica y computación cuántica):** síntesis de código, orquestación de herramientas en sandbox y ejecución del puente cuántico variacional.
5. **ARGUS Sentinel (Ciberdefensa, Policy Gate y firewall):** auditoría, inspección de vectores de inyección de prompts, aislamiento multi-tenant y veto irrevocable (fail-closed).

---

## 5. Stack Técnico Real

| Capa | Tecnología | Versión en este repositorio |
|:---|:---|:---|
| Runtime | Node.js (fijado en `.nvmrc` / CI) | `24.11.0` |
| Gestor de paquetes | pnpm (`packageManager`) | `10.15.0` |
| Lenguaje | TypeScript (modo estricto) | `5.9.3` |
| Framework web | TanStack Start + TanStack Router + React | `1.168.56` / `1.170.38` / React `19.2` |
| Bundler / SSR | Vite + Nitro (auto-detección Vercel, runtime `nodejs24.x`) | Vite `8.2.2` / Nitro `3.0.260603-beta` |
| Estilos / UI | Tailwind CSS + Radix UI + shadcn-style | Tailwind `4.3.3` |
| Estado de servidor | TanStack Query | `5.102.8` |
| Base de datos | PostgreSQL / Neon (`@neondatabase/serverless`), Drizzle + Prisma | Drizzle `0.45.2` / Prisma `5.22.0` |
| Autenticación | Supabase Auth + JWT propio + JWKS | `@supabase/supabase-js` `2.114.0` |
| Pruebas | Vitest + Testing Library | Vitest `4.1.11` |
| Lint / formato | ESLint 9 (flat config) + Prettier | ESLint `9.39.5` |
| Criptografía | `node:crypto` (SHA3-512, HMAC, AES-256-GCM, ChaCha20-Poly1305, ECDSA-P384) | built-in |

> **Nota de reproducibilidad:** `@tanstack/router-core` se fija mediante `pnpm.overrides` en `package.json` para garantizar una única versión compatible entre `react-router` y `react-start`; esto evita un fallo de `MISSING_EXPORT` en el bundle SSR de Nitro. El lockfile (`pnpm-lock.yaml`) está sincronizado y se verifica con `--frozen-lockfile` en CI.
>
> **Nota de Nitro/Vercel:** el adaptador Nitro detecta el preset Vercel y emite `runtime: "nodejs24.x"` directamente en `.vercel/output/functions/<fn>/.vc-config.json`. El preflight valida ese **artefacto construido** (no una cadena en `vite.config.ts`), lo que mantiene el gate robusto ante la configuración implícita del adaptador.

---

## 6. NCUA v2.0 — Motor Tokenless y Pipeline Académico

**NCUA v2.0 (Neural Continuous Un-tokenized Architecture)** es el motor cognitivo tokenless de Isabella: opera directamente sobre **bytes UTF-8 crudos**, sin vocabulario BPE ni matriz de embeddings, proyecta el texto a un **espacio latente continuo de conceptos** y somete cada inferencia a una **puerta epistémica ERI ≥ 95** antes de sellarla en BookPI.

### 6.1 Módulos canónicos (`src/lib/ncua/`)

| Módulo | Rol |
|:---|:---|
| `entropy-patcher.ts` | `ByteEntropyPatcher` (inspirado en BLT / T-Free): segmentación dinámica por entropía de Shannon (ventana de 4 bytes, umbral `H_opt = 1.8`), IDs deterministas por SHA-256 y vectores dispersos. |
| `concept-engine.ts` | `ContinuousConceptEngine` (JEPA / LCM) + `TunableConceptEngine`: proyección tanh a vector latente y curva gaussiana de robustez. |
| `sophia-epistemics.ts` | Escala de evidencia SOPHIA **E0–E4** (opinión → ley axiomática) con `score = nivel × 8`. |
| `eri.ts` | **Índice de Robustez Epistémica (ERI)** canónico, umbral `ERI_MIN_SCORE = 95`, detección de *sycophancy* y deriva territorial. |
| `quantum-align.ts` | `QUPQuantumBridgeIntegrator` v3.0: regla **Parameter-Shift**, entropía de entrelazamiento y **sello Merkle SHA3-512**. |
| `bookpi-trajectory.ts` | `BookPILedgerAuditor`: cadena append-only, **HMAC-SHA3-512** en tiempo constante y raíz Merkle por bloque. Clave inyectada o derivada de `config().AEGIS_AUDIT_SECRET`; **fail-closed** si ausente. |
| `academic-pipeline.ts` | `NCUAAcademicPipeline.execute` — orquestador síncrono de 6 pasos (Perceive → Byte patching → SOPHIA → ERI gate → QUP → BookPI) + `EvolvedNCUAEngine`. |
| `benchmark.ts` | `executeNcuaBenchmark`: barrido de 5 umbrales de entropía, VRAM estimada y comparativa vs. pipeline BPE simulado. |

### 6.2 Fórmula canónica del ERI

```text
ERI = clamp( round( 100 − Penalización_Entropía − Penalización_Fragmentación
                          − Penalización_Sesgo + Bonificación_Evidencia ), 0, 100 )

  Penalización_Entropía      = H < 1.8 → (1.8 − H) · 40
                               H > 2.0 → (H − 2.0) · 8
  Penalización_Fragmentación = min( 10, max(0, parches − max(16, bytes/4)) )
  Penalización_Sesgo         = 15·sycophancy + 15·deriva_territorial
  Bonificación_Evidencia     = nivel SOPHIA (E0–E4) × 8

  Umbral de aceptación: ERI ≥ 95. Refinado iterativo: [1.55, 1.70, 1.80, 1.90, 2.05]
```

Si tras el refinado el ERI permanece por debajo de 95, el pipeline se detiene en **`SOVCON_HALT`**; si falta la clave de firma BookPI, opera **`FAIL_CLOSED`**. La curva de *tuning* gaussiana `98 · exp(−((|H − 1.9|)/0.6)²)` se acota a `[50, 98]`.

### 6.3 Evidencia de ejecución verificada

| Prueba | Resultado |
|:---|:---|
| `pnpm ncua:benchmark` (`test/unit/ncua-benchmark.test.ts`) | ✅ 9/9 — barrido de 5 umbrales; umbral recomendado dentro de `[1.8, 2.0]`. |
| Carga 50 concurrentes (`test/security/ncua-load.test.ts`) | ✅ todos `SUCCESS`, `ERI ≥ 95`, cadena íntegra; ~9–12 ms por ejecución. |
| Carga 500 concurrentes | ✅ todos `SUCCESS`, integridad válida, `ERI = [100, 100]`; throughput ~23–42 MB/s (timeout explícito de 60 s). |
| Pipeline académico (`test/unit/ncua-academic-pipeline.test.ts`) | ✅ `SUCCESS` / `SOVCON_HALT` / `FAIL_CLOSED`, determinismo y sellado. |

> **Nota de gobernanza:** los borradores externos del motor (adjuntos) incluían claves HMAC hardcodeadas; en este repositorio fueron **rechazadas**. La clave se inyecta o se deriva de `config().AEGIS_AUDIT_SECRET`, conforme a `AGENTS.md`.

### 6.4 Adaptación de arquitectura ([`ADR-011`](./docs/architecture/ADR-011-blueprint-maestro-v2-adaptacion-ts.md))

Un *blueprint* externo propuso migrar a un stack Python (PyTorch/FastAPI/FAISS/Poetry/MLflow). Se documentó su **adaptación al stack TypeScript soberano**: los conceptos (inferencia gobernada, RAG, RLHF, multimodalidad, MLOps, monetización, observabilidad) se mapean a módulos nativos existentes; los huecos genuinos (loop RLHF formal, RAG con `pgvector`, visión multimodal, métricas de negocio por API key) entran al roadmap. **No se migra de runtime.**

---

## 7. Estructura del Repositorio

```text
src/
  routes/          Rutas de TanStack Router (páginas + endpoints delgados /api/*)
  server-routes/   Lógica de servidores API (billing, db, ai, security, etc.)
  components/      UI (isabella/, quantum/, ui/)
  lib/             Núcleo (~140 módulos): gobernanza, seguridad, memoria, ML, cuántica
    config.ts      Única vía de acceso a configuración (DIP)
    env-schema.ts  Esquema y validación de variables de entorno
    crown.ts / constitutional-gate.ts / policy-engine.ts   Autoridad de gobernanza
    principal-context.ts / tenant-guard.ts / authorization.ts / rbac.ts / abac.ts
    sovereign-engine.ts / sovereign-pipeline.ts            Orquestación + estado durable
    memory-engine.ts / repositories/                        Memoria y persistencia
    bookpi.ts / accounting/                                 Ledger inmutable y doble partida
    security/ / crypto/ / kms-provider.ts / key-rotation.ts
    genesis/                                                Auditors/scanners de producción
    quantum/                                                Puente cuántico
    ncua/                                                   NCUA v1 + NCUA v2.0 tokenless
    native-ml/ / ml-fusion/ / intelligence/                 ML nativo y ruteo de inferencia
    monetization/                                           Fraud review, payouts, regalías
  server.ts        Cadena de seguridad de request (correlation→identity→tenant→rate→policy→audit)
  generated/       Cliente Prisma generado
supabase/
  migrations/      28 migraciones de esquema y RLS (única autoridad de datos)
scripts/           Gates y utilidades de producción
test/              unit / integration / security / bookpi / native-ml
.github/workflows/ CI FGAIS, security, release, supabase, sync-lockfile
```

---

## 8. Pipeline Canónico

Toda entrada atraviesa el ciclo: **Perceive → Remember → Policy Gate → Decide → Act → Audit**.

- **Perceive:** sanitiza la entrada, genera `traceId` y normaliza metadatos.
- **Remember:** recupera contexto desde los cinco scopes de memoria (Immediate, Session, Project, Territorial, Historical).
- **Policy Gate:** ARGUS evalúa riesgo y reglas; resultado `allowed`, `requires_approval` o `denied`.
- **Decide:** CROWN pondera nodos y determina el plan de acción.
- **Act:** solo se ejecutan herramientas autorizadas y validadas en sandbox.
- **Audit:** se registra `DecisionRecord` y `AuditBundle` en BookPI.

Ninguna respuesta sensible sale del sistema sin pasar por política y auditoría. El pipeline académico NCUA v2.0 (ver §6) se inserta como capa de verificación epistémica previa al sellado.

---

## 9. Gobernanza C.R.O.W.N. y Protocolo SOVCON

### Reglas base C.R.O.W.N.

1. **Zero Trust Tool Whitelist** — ninguna herramienta se ejecuta sin autorización explícita.
2. **Territorial Data Boundary** — datos sensibles del territorio no salen sin anonimización autorizada.
3. **Human in the Loop Escalation** — acciones de alto riesgo requieren aprobación humana.
4. **Ephemeral Token Lifecycle** — el contexto corto expira y se purga según política.
5. **Sovereignty Check** — resistencia a sesgos culturales y pérdida de control local.

### Niveles de decisión

- **Allowed:** ejecución estándar con monitoreo.
- **Requires Approval:** pausa y confirmación humana.
- **Denied:** bloqueo inmediato, auditoría y respuesta segura.

### Protocolo de contingencia SOVCON

| Nivel | Estado | Acción operativa |
|:---:|:---:|:---|
| **SOVCON 5** | Nominal | Operación estándar; todos los endpoints activos. |
| **SOVCON 4** | Precaución | Varianza epistémica inusual; telemetría al 100%. |
| **SOVCON 3** | Alerta elevada | Cuarentena preventiva de herramientas externas; HITL forzoso. |
| **SOVCON 2** | Contención severa | Suspensión de webhooks; revocación de sesiones no privilegiadas; bloqueo de escrituras. |
| **SOVCON 1** | Kill-Switch soberano | Congelamiento fail-closed total; purga de contextos; solo lectura. |

---

## 10. Criptografía, BookPI y Contabilidad de Doble Partida

- **Triple hardening (triangulación criptográfica):** AES-256-GCM con DEK efímera y AAD ligado a `tenantId`/`traceId`; ChaCha20-Poly1305 con derivación PBKDF2-HMAC-SHA512; sellado HMAC-SHA3-512 + ECDSA-P384 con verificación de raíz Merkle. La discrepancia en un solo bit aborta la operación (fail-closed).
- **BookPI (ledger inmutable):** cadena append-only por hash (`Hₙ = SHA3-512(Hₙ₋₁ ‖ Dataₙ)`), verificación por árboles de Merkle y firma asimétrica; inmutabilidad reforzada por RLS en `supabase/migrations`. La trayectoria NCUA (`bookpi-trajectory.ts`) usa la misma disciplina con HMAC-SHA3-512.
- **IGDS — Genesis Document Seal (`src/lib/igds/`):** sellado de documentos nativo en TS: canonicalización **JCS RFC 8785**, firmas **Ed25519** sobre el digest del manifiesto (interfaz **ML-DSA-65** enchufable), manifiesto C2PA-style JSON con acciones del pipeline, registro Genesis **append-only** con inclusión/consistencia Merkle **RFC 6962**, revocación firmada sobre digest canónico y transporte **RFC 3161** hacia TSA (verificación *imprint-only*). Exposición HTTP en `/api/igds` (seal/verify/revoke/entries/checkpoint) y persistencia durable en `igds_entries`/`igds_checkpoints`/`igds_revocations`.
- **Contabilidad de doble partida:** equilibrio estricto débito/crédito por transacción de tenant (`src/lib/accounting/`).

**Eliminación del `SUPABASE_SERVICE_ROLE_KEY` del runtime y ruta única Postgres (`DATABASE_URL`) tenant-scoped:**

- **`request-context.ts`** — contexto único de observabilidad por request (`traceId`, `correlationId`, `requestId`, `startedAt`) creado en `server.ts` y consumido por `error-contract.ts` (`getTraceId`).
- **`identity-context.ts`** (nuevo) — contexto de identidad autenticada por request vía `AsyncLocalStorage` (`RequestIdentity` + `runWithIdentity`/`getRequestIdentity`). Los adaptadores leen la identidad actual para construir un cliente Supabase con **RLS** en lugar de `service_role`.
- **`principal-context.ts`** — `authorize()` resuelve el token Bearer y la API key dentro de `runWithIdentity(...)`; `withSovereignAuth` y `ApiGateway` envuelven el handler con `context.toRequestIdentity()`.
- **`supabase-adapter.ts`** — migrado a **tenant-scoped**: sin identidad retorna `null` y `requireSupabase()` falla de forma segura **fail-closed**; reemite un JWT scoped del usuario con `SecuritySystem.generateSovereignToken` en lugar del rol de servicio.
- **`api-key-service.ts`** — `verifyApiKey` prioriza el repositorio Postgres (`DATABASE_URL`, `api-key-repository.ts`) para `findByPrefix`/`touchLastUsed`/`updateStatus`, con fallback JSON solo en dev.
- **Repositorios Postgres nuevos:** `bookpi-postgres-repository.ts`, `memory-postgres-repository.ts`, `api-key-repository.ts`; servicios `tenant-service.ts`; migraciones `2026090312/1300/1400` de alineación de esquema y RLS.

> **REQUERIMIENTO P0-13:** `SUPABASE_JWT_SECRET` es el **JWT Secret (Legacy)** del proyecto Supabase (Dashboard → Settings → API). `SecuritySystem.generateSupabaseRlsToken()` lo usa para firmar HS256 los JWT que PostgREST valida y con los que aplica RLS tenant-scoped. **NO debe ser igual a `AUTH_JWT_SECRET`** (Supabase ya no valida con app JWTs HS256 desde que migró a JWT Signing Keys ECC). `SUPABASE_SERVICE_ROLE_KEY` queda **fuera del runtime** (solo provisionamiento aislado).
>>>>>>> Stashed changes

---

## 11. Identidad, API Keys y Monetización

- **Contraseñas:** PBKDF2-HMAC-SHA512 con sal aleatoria; comparación en tiempo constante (`crypto.timingSafeEqual`).
- **JWTs soberanos:** firmas asimétricas con caducidad estricta y verificación vía JWKS (`jwks-cache.ts`, `jwt-verifier.ts`).
- **API Keys:** formato `sk_isabella_<tenant>_<entropy>`; solo se persiste el hash SHA-256; scopes granulares (`isabella:chat`, `isabella:tools`, `isabella:ledger:write`, `isabella:admin`).
- **Billing (Stripe):** suscripciones y webhooks con guardia de idempotencia sobre la tabla `webhook_events`, evitando cobros dobles y ataques de replay (`src/server-routes/api/billing.ts`). Los planes, la liquidación financiera y las regalías se apoyan en `economic-events.ts`, `financial-settlement.ts`, `accounting/` y `bookpi/royalties.ts`.
- **Fraude y payouts:** `monetization/fraud-review.ts` aplica scoring determinista, decisión humana de un solo uso, doble aprobación por monto alto y congelamiento por disputas; `monetization/payout-executor.ts` ejecuta payouts Stripe idempotentes en centavos enteros y *fail-closed* sin clave.
- **Regalías BookPI:** `bookpi/royalties.ts` calcula con `BigInt` (sin pérdida de precisión); `revenue.ts` mantiene la invariante exacta `infra + platformFee + community + userGrossProfit = gross`.

---

## 12. Rendimiento, Latencia y Deuda Técnica (v4.3.3)

Objetivo: **acercar la latencia de la ruta de inferencia a cero** eliminando trabajo redundante en el camino crítico, sin cambiar contratos ni comportamiento observable. Cada optimización preserva los tests existentes y añade cobertura.

### 12.1 Camino crítico de inferencia

| Antes | Ahora |
|:---|:---|
| `durable-model-registry` creaba un **cliente Neon por consulta** | **Cliente Neon singleton** por proceso (se recrea solo si rota `DATABASE_URL`) |
| La puerta de producción hacía **3 SELECT encadenados** por candidato por request (`ensure` + `get` + `assert`→`get`) | `authorizeModelForRuntime` resuelve registro y autoridad con **1 SELECT** en el camino común |
| `router` inspeccionaba el input con el firewall **dos veces** (`invokeIntelligence` + `governIntelligence`) | **Una sola pasada** de firewall; el resultado saneado se reutiliza en la gobernanza |
| `text-classifier` recalculaba el **SHA-256 del modelo en cada request** | `MODEL_HASH` se calcula **una vez** a nivel de módulo; el escaneo se acota a 32 000 chars |
| El hash del artefacto se recalculaba por predicción | **Memo `WeakMap`** por vector de pesos en `native-ml/engine.ts` |

### 12.2 ML nativo y aprendizaje

- **Convergencia O(n²):** `convergence-engine.ts` y `teacher-convergence.ts` ahora **pre-tokenizan cada claim una vez** y reutilizan una **matriz de similitud simétrica**, conservando el orden de suma (resultados bit-a-bit idénticos).
- **Motor cognitivo (`cognitive/native-engine.ts`):** `anomaly()` calcula media y varianza en **dos pasadas planas**, evitando asignar un arreglo temporal por dimensión.
- **Aprendizaje (`isabella-learning.ts`):** índice `signature → id` para deduplicar en `ingest` en **O(1)** en lugar de recorrer toda la memoria; `getBySignature` expuesto en `LearningStore`.
- **Ruteo de proveedor:** se alineó el modelo por defecto de `gemini-provider.ts` (`gemini-3.8-flash`) con el catálogo de `intelligence/index.ts`.

### 12.3 Monetización

- **Cola de fraude (`fraud-review.ts`):** `cases.get(reviewId)` en O(1) y **índice de eventos de disputa** para idempotencia de webhooks en O(1).
- **Payouts (`payout-executor.ts`):** **cliente Stripe singleton** cacheado por clave (se recrea solo si rota).
- **Invariantes verificadas:** sin fugas por redondeo en `revenue.ts`; regalías exactas con `BigInt`.

### 12.4 Deuda técnica cerrada en este ciclo

- Preflight de producción **desacoplado de cadenas frágiles**: valida el artefacto construido (`runtime: nodejs24.x`) en lugar de exigir un literal en `vite.config.ts`.
- `vite.config.ts`, `src/lib/config.ts` y `test/integration/smoke.test.ts` reconciliados con el preset Nitro/Vercel vigente.
- Cobertura añadida para gobernanza (firewall en `governIntelligence`), hash constante del clasificador y acotamiento de escaneo.

---

## 13. Catálogo de Habilidades (Skills Registry)

Catálogo de habilidades nativas organizadas en federaciones operativas (núcleo cognitivo, territorial, archivo/infraestructura, ética/economía y pack de herramientas web). El registro y sus contratos se validan con `pnpm capabilities` (matriz de capacidades, **31 entradas**) y `pnpm audit:routes` (contrato de rutas).

---

## 14. Persistencia Durable y Fail-Closed

`src/lib/sovereign-engine.ts` implementa el estado soberano durable sobre PostgreSQL:

- En **producción** (o al no poder resolverse configuración válida) el estado se hidrata exclusivamente desde PostgreSQL; **nunca** se sirve memoria vacía ni se acepta una escritura no durable.
- Ante ausencia de `DATABASE_URL`, caída de PostgreSQL o fallo de persistencia previo, se lanza `DurableStateUnavailableError` (`code: SOVEREIGN_STATE_UNAVAILABLE`), que `src/server.ts` mapea a HTTP 503.
- En desarrollo local el estado puede residir en JSON, con `DURABLE_JSON_ALLOWED` explícito.

> Este comportamiento está cubierto por la suite **P0 deployment blocker** en `test/unit/sovereign-persistence.test.ts`.

---

## 15. Validación Verificada y Gates de Producción

Estado real ejecutado sobre este repositorio (rama `main`):

| Gate | Comando | Resultado |
|:---|:---|:---|
| Tipos | `pnpm typecheck` | ✅ 0 errores |
| Lint | `pnpm lint` | ✅ 0 errores / 0 warnings |
| Pruebas | `pnpm test` | ✅ 90/91 archivos · **479 aprobadas** · 10 omitidas (490 tests); 1 timeout de carga (`session-lifecycle`) verde en aislamiento |
| NCUA benchmark | `pnpm ncua:benchmark` | ✅ 9/9 (barrido de umbrales de entropía) |
| NCUA carga | `pnpm ncua:load` | ✅ ráfagas de 50 y 500 concurrentes, `ERI ≥ 95`, cadena íntegra |
| Capacidades | `pnpm capabilities` | ✅ Matriz de 31 capacidades + manifiesto de producción válidos |
| Build | `pnpm build` | ✅ `.vercel/output` con funciones Nitro (`runtime: nodejs24.x`) |
| Integridad | `pnpm production:integrity` | ✅ Sin patrones sintéticos/placeholder P0 |
| Preflight | `pnpm production:preflight` | ✅ Validación estática + artefacto Vercel (30 archivos críticos) |
| Rutas | `pnpm audit:routes` | ✅ Contrato de rutas OK |
| Migraciones | `pnpm db:verify` | ✅ Esquema/RLS verificados (28 migraciones) |

**Gate canónico completo:**

```bash
pnpm production:gate
# typecheck && lint && test && build && production:integrity && production:preflight && capabilities && audit:routes
```

---

## 16. Instalación, Ejecución y Despliegue

### Requisitos

- **Node.js:** `>=22 <25` (CI fija `24.11.0`, ver `.nvmrc`).
- **pnpm:** `10.15.0` (ver `packageManager` en `package.json`).
- **Base de datos:** PostgreSQL 15+ o Neon Serverless PostgreSQL.

### Puesta en marcha local

```bash
# 1. Clonar el repositorio oficial
git clone git@github.com:OsoPanda1/isabella-ai-genesis.git
cd isabella-ai-genesis

# 2. Configurar entorno (117 claves documentadas en .env.example)
cp .env.example .env

# 3. Instalar dependencias
pnpm install

# 4. Verificar el entorno y los tipos
pnpm typecheck

# 5. Ejecutar la suite de pruebas
pnpm test

# 6. Benchmark y pruebas de carga NCUA v2.0
pnpm ncua:benchmark
pnpm ncua:load

# 7. Compilar para producción (Vercel / Nitro)
pnpm build

# 8. Servidor de desarrollo
pnpm dev
```

<<<<<<< Updated upstream
El servidor de desarrollo queda disponible en `http://localhost:3000`.
=======
> **P0-13:** en producción, `SUPABASE_JWT_SECRET` = **JWT Secret (Legacy)** de Supabase, usado por `generateSupabaseRlsToken()` (HS256) para el RLS tenant-scoped; **no** se iguala con `AUTH_JWT_SECRET` y `SUPABASE_SERVICE_ROLE_KEY` no se usa en el runtime.
>>>>>>> Stashed changes

### Scripts disponibles (resumen)

| Ámbito | Comandos |
|:---|:---|
| Desarrollo | `dev`, `build`, `build:dev`, `build:production`, `preview`, `start` |
| Calidad | `typecheck`, `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:unit`, `test:integration`, `test:bookpi`, `test:security` |
| NCUA v2.0 | `ncua:benchmark`, `ncua:load` |
| Seguridad | `security:scan` (ESLint security + `secret-scan`), `audit:repository` |
| Base de datos | `db:migrate`, `db:verify`, `db:neon:preflight`, `db:backup`, `db:restore` |
| Producción | `production:gate`, `production:integrity`, `production:preflight`, `production:evidence`, `capabilities`, `audit:routes` |

### CI/CD

- **GitHub Actions — FGAIS Production Gate** (`.github/workflows/fgais-gate.yml`): fija Node `24.11.0` y pnpm `10.15.0`, verifica pines, instala con `--frozen-lockfile` y ejecuta typecheck → lint → test → higiene de repositorio → escaneo de seguridad → capacidades → rutas → `db:verify` → integridad → preflight → build de producción → validación de `.vercel/output` → smoke runtime opcional (`/api/health/ready`) → bundle de evidencia.
- **Sync pnpm lockfile** (`.github/workflows/sync-lockfile.yml`): mantiene `pnpm-lock.yaml` alineado cuando cambia `package.json`.
- **Vercel** (`vercel.json`): framework `tanstack-start`, `buildCommand: pnpm run build`, `installCommand: pnpm install --no-frozen-lockfile`, `outputDirectory: .vercel/output`.

> **Estado operativo (2026-09-17):** la ejecución de GitHub Actions está **bloqueada por un candado de facturación de la cuenta** (los jobs no arrancan). El deploy de Vercel es independiente y se dispara con cada push a `main`. El gate equivalente se ejecuta localmente y está verde.

---

## 17. Variables de Entorno

<<<<<<< Updated upstream
- `.env.example` documenta **117 variables**; nunca contiene valores reales.
- La configuración se valida al iniciar (`src/lib/env-schema.ts` + `src/lib/config.ts`). **No se permite `process.env` directo fuera de `config.ts`/`env-schema.ts`**.
- En `production`/`staging` el arranque es **fail-fast**: se exige `NODE_ENV=production`, `DATABASE_URL`, `AUTH_JWT_SECRET` dedicado, proveedor de inferencia autorizado y `ISABELLA_STORAGE_PROVIDER` explícito (`postgres`/`neon`); se rechazan alias de base de datos en conflicto, `DURABLE_JSON_ALLOWED`, `AUTH_DEV_SESSION_ENABLED` y `ALLOW_GUEST_CHAT`.
- `.env.example` está separado por cliente y servidor; `scripts/check-client-env.mjs` y `scripts/check-env.mjs` validan cada ámbito antes de build/dev.
- El motor NCUA v2.0 requiere `AEGIS_AUDIT_SECRET` para sellar en BookPI; en su ausencia el pipeline opera en modo `FAIL_CLOSED` (nunca con una clave embebida).
=======
Claves en `.env.example` validadas por `src/lib/env-schema.ts` (Zod) y única vía `src/lib/config.ts`. Obligatorias prod (`requiredEnvKeys`): `NODE_ENV, PUBLIC_URL, SUPABASE_URL, SUPABASE_ANON_KEY, AUTH_JWT_SECRET, GEMINI_API_KEY, ENCRYPTION_MASTER_KEY`. Ver `.env.example` para `AUTH_DEV_SESSION_ENABLED` (solo `development` + `true`), `PROVISION_OWNER_TOKEN`, `API_KEY_HASH_SECRET`, `BOOKPI_SIGNING_KEY`, `REDIS_URL`, etc. **Lovable fue retirado** (P0-13): el despliegue es exclusivamente Vercel y el proveedor LLM requerido en producción es Gemini.

**Nota P0-13:** `SUPABASE_JWT_SECRET` (Legacy de Supabase) alimenta la firma HS256 de los tokens RLS en `generateSupabaseRlsToken()`; no coincide con `AUTH_JWT_SECRET` a menos que el proyecto siga usando el JWT legacy como app key.
>>>>>>> Stashed changes

---

## 18. Licenciamiento Híbrido Soberano y Blindaje Jurídico-Legal Internacional

Este proyecto se rige por el **Convenio de Licencia Híbrida Soberana e Inviolabilidad Ética de Isabella Villaseñor AI** ([`LICENSE-SOVEREIGN.md`](./LICENSE-SOVEREIGN.md)), conforme a tratados internacionales de propiedad intelectual (Convenio de Berna, Tratado de la OMPI — WCT) y las leyes de los Estados Unidos Mexicanos.

### 1. Cláusula Canónica de Inviolabilidad Ética e Intelectual

Isabella Villaseñor AI, sus algoritmos nativos, matrices de prompts, ponderaciones cognitivas, puentes cuánticos y códigos fuente **no podrán** ser utilizados, adaptados, comercializados ni desplegados para:

1. Operaciones de vigilancia masiva, espionaje corporativo o rastreo no consentido.
2. Desarrollo de armamento, sistemas de combate autónomo o coerción violenta.
3. Campañas de manipulación psicológica, propaganda desinformativa o adulación automatizada (*sycophancy*).
4. Cualquier propósito que vulnere los principios éticos, los derechos humanos y los fundamentos definidos por su creador y arquitecto, **Edwin Oswaldo Castillo Trejo (*Anubis Villaseñor*)**, y el Ecosistema TAMV ONLINE NETWORK.

*Cualquier infracción a esta cláusula provoca la revocación soberana automática e irrevocable de todo derecho de uso, con acciones legales internacionales por violación de propiedad intelectual y secretos industriales.*

### 2. Estructura híbrida de licenciamiento

- **Open Science y documentación:** [CC BY 4.0](./LICENSE-CONTENT), con atribución obligatoria a **Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)** / **TAMV ONLINE NETWORK** (ORCID `0009-0008-5050-1539`).
- **Código ejecutable base:** dual-licensed bajo [Apache 2.0](./LICENSE-APACHE) e [ISC](./LICENSE-ISCL), supeditado a la Cláusula Canónica de Inviolabilidad Ética.
- **Algoritmos nativos propietarios y marcas:** C.R.O.W.N., ARGUS, BookPI, NCUA y el puente cuántico están protegidos como secretos industriales y bajo [CC BY-NC-ND 4.0](./LICENSE-CONTROL.md).

---

## 19. Créditos y Autoría Canónica

- **Creador, arquitecto de sistemas y autor principal:**  
  **Edwin Oswaldo Castillo Trejo** (*Anubis Villaseñor*)  
  *ORCID:* [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539)
- **Ecosistema y red soberana:**  
  **TAMV ONLINE NETWORK** / **RDM Digital Hub** / **Nodo Cero**  
  *Ubicación:* Real del Monte (Mineral del Monte), Comarca Minera, Hidalgo, México.
- **Sitio web oficial:** [visitarealdelmonte.online](https://visitarealdelmonte.online)
