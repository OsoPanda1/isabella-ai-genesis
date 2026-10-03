# Isabella Villaseñor AI — Isabella AI Genesis

**Plataforma de orquestación cognitiva gobernada** para contexto, evidencia, memoria, herramientas, economía y decisiones humanas.
Isabella no es AGI, no es consciencia artificial ni autoridad autónoma: el sistema sugiere, calcula y evalúa; la persona revisa, aprueba y ejecuta.

| Ficha | Valor |
|---|---|
| Paquete | `tanamv-isabella-ai-genesis` (`package.json`) |
| Versión canónica | **4.3.3** (SSOT: `package.json`) |
| Descripción del paquete | *«Isabella AI Genesis — sistema federado de inteligencia artificial gobernada.»* |
| Runtime | Node `24.x`, pnpm `10.34.5`, Vite `8`, React `19`, TypeScript `6` |
| Código fuente | 809 archivos `*.ts`/`*.tsx` en `src/`, 142 documentos en `docs/` |
| Licencia | Ver `LICENSE`, `LICENSE-APACHE`, `LICENSE-CONTENT`, `LICENSE-ISCL`, `LICENSE-SOVEREIGN.md` |
| Ecosistema | TAMV ONLINE NETWORK · RDM Digital Hub · Nodo Cero · Real del Monte, Hidalgo, México |

---

## 1. Categoría

**Categoría de proyecto: AI / plataforma de orquestación cognitiva gobernada** (no una app de un solo uso, no un chatbot con prompt).

Fuentes verificables:

- `package.json` → `description`: *«sistema federado de inteligencia artificial gobernada.»*
- `index.html` → `<title>`: *«Isabella Villaseñor AI — Inteligencia aplicada»*; `lang="es-MX"`.
- `docs/07-TINA-CATEGORIA.md` → **categoría propia TINA** (*Trusted Intelligence, Native & Adaptive*), `Isabella = first_declared_member`, certificación **`declared_not_certified`**.
- `src/lib/tina/` (módulo), `src/lib/skills/tina-category.ts` (skill `TINA`), `platform-capabilities.ts` → `category.tina` con `productionSafe: false`.

TINA **no** afirma AGI, consciencia ni certificación de producción. Es una declaración de categoría, no un sello auditor.

---

## 2. Avance real a producción y despliegue

Cifra ancla declarada en **`production-capabilities.json`** (auto-declarada, coherente con el código):

| Dimensión | Porcentaje | Base de cálculo |
|---|---|---|
| **Implementación** | **46 %** | Auditoría ISA-500 (500 ítems): 44 FIXED (8.8 %), 374 PARTIAL (74.8 %), 72 STILL_BROKEN (14.4 %), 8 BLOCKED_ENVIRONMENT (1.6 %). Ponderado FIXED=1 / PARTIAL=0.5 |
| **Despliegue** | **62 %** | Viven hasta Neon/Stripe/HSM; tiers de despliegue |
| **Global** | **54 %** | Media (46 + 62) / 2 |

Desglose de despliegue (`deployment_tiers`):

| Tier | Estado | % |
|---|---|---|
| `tier_0_predeployment` | `passed` | 100 % |
| `tier_1_staging` | `evidence_required` | 62 % |
| `tier_2_production` | `blocked_pending_evidence` | 62 % |

### Lo que SÍ está verificado hoy

- `pnpm typecheck` (`tsc --noEmit`) → **0 errores**.
- `pnpm lint` (`eslint .`) → **0 errores** (363 warnings, no bloqueantes).
- 45 migraciones SQL versionadas en `supabase/migrations/` (RLS, inmutabilidad BookPI, hash chain SHA3-512, policy-as-code, borrado legal en cascada).
- 4 modelos Prisma en `prisma/schema.prisma`.
- 3 manifiestos Kubernetes (`k8s/deployment.yaml` con 2 réplicas, `runAsNonRoot`, seccomp, probes; `networkpolicy.yaml`; `qup-psp.yaml`) e `Dockerfile` multi-stage `node:24.11.0-alpine` con usuario no-root.
- `vercel.json` endurecido (CSP, 7 headers globales, salida `.vercel/output`).
- 18 workflows de GitHub Actions en `.github/workflows/` (`ci.yml`, `fgais-gate.yml`, `deploy-production.yml`, `security.yml`, `sast.yml`, `secret-scan.yml`, `ci-cosign.yml`, `supabase.yml`, …).

### Lo que NO está listo (no se convierte en PASS)

- **Suite de tests: 0 archivos en el commit HEAD.** La suite de 811 tests (798 passing) existía el 2026-09-29 y fue eliminada en el commit `d7926f7` (2026-10-01, −97 690 líneas, 144 archivos bajo `test/`). Hoy `test/` sólo conserva `test/setup.ts` y un runner placeholder; por eso **`pnpm test` reporta `No test files found`** y la cobertura real es 0 %.
- **CI sin evidencia same-commit.** El propio manifiesto lo declara: *«CI de GitHub Actions bloqueado por billing (issue #66): ningún workflow corre en HEAD, gates canónicos SKIPPED»*.
- **`production-readiness.yml` está roto**: declara un job `rust-core` (`cargo fmt/clippy/test/build`) y **no existe ningún `Cargo.toml`** en el repositorio.
- **500 gates en `EVIDENCE_GATED` con `pass_executed: 0`** (AGENTS §19: `EVIDENCE_GATED` ≠ PASS).
- **Release blockers abiertos**: `economy.ledger productionSafe=false` (rutas 503), migración `20260926030000` versionada pero no aplicada, P0 de autoridad abiertos (output security gate ISA-140/175, intelligence router/model gate bypass, **MoE real ausente**).
- **HSM**: `cryptography.hsm` = `experimental` (30 %). `EnvKMSProvider` (AES-256-GCM + HKDF-SHA3-512) es criptografía real, **pero no es un HSM hardware**.
- **CHANGELOG** sin entrada para 4.3.x (última: `v4.2.0`).

> **Veredicto honesto: ~54 % de avance global.** Código implementado en buena parte, despliegue parcial, evidencia de tests/CI **no presente**. Un build verde no demuestra producción.

---

## 3. Qué hace (funciones principales)

| Área | Qué hace | Ruta canónica |
|---|---|---|
| **Chat gobernado** | Un único gateway con rate-limit, Zod, kill-switch de inferencia, clasificación de riesgo y firewall semántico; rutas `/api/isabella` y `/api/v1/isabella` son adaptadores delgados | `src/lib/isabella-chat-gateway.ts` |
| **Pipeline soberano** | `PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND` ejecutable | `src/lib/sovereign-pipeline.ts` |
| **Gobernanza CROWN** | Arbitraje de routing, política, cuotas y obligaciones; fail-closed | `src/lib/crown.ts`, `crown-v6.ts`, `crown-runtime-authority.ts` |
| **Autorización** | RBAC/ABAC centralizado, tenant isolation, scopes por ruta | `src/lib/authorization.ts`, `rbac.ts`, `principal-context.ts` |
| **Memoria jerárquica** | Scopes `immediate/session/project/territorial/historical` con TTL y procedencia | `src/lib/memory-engine.ts`, `isabella-learning*.ts` |
| **Skills** | 54 skills registradas, ejecución con identidad → schema → autorización → auditoría | `src/lib/skills/`, `src/routes/api/v1/skills.ts` |
| **Ledger BookPI** | Cadena append-only con PoW, CID, firmas y verificación de integridad | `src/lib/bookpi.server.ts`, `src/lib/repositories/bookpi-repository.ts` |
| **Sellos IGDS** | JCS RFC 8785, Ed25519, Merkle RFC 6962, RFC 3161, manifiesto C2PA | `src/lib/igds/`, `src/server-routes/api/igds.ts` |
| **NCUA / epistemología** | Clasificación E0–E4, gate ERI, sello Merkle SHA3-512, trajectory HMAC | `src/lib/ncua/` |
| **Economía** | Billing Stripe, idempotencia durable, one-time capability, eventos económicos, x402 (bloqueado 503 en prod) | `src/server-routes/api/billing.ts`, `src/lib/monetization/` |
| **Seguridad** | Redacción de secretos, CSP, headers, parsing JSON acotado, rate limiting distribuido, AEGIS-X | `src/lib/secret-redactor.ts`, `src/middleware/security.ts`, `latam-aegis-x/` |
| **Observabilidad** | OpenTelemetry, métricas p50/p95/p99, salud A/B del doble pipeline | `src/lib/telemetry/`, `src/lib/isabella/double-pipeline.ts` |
| **Puente cuántico** | Ejecución Python (PennyLane/Qiskit) con política y timeout, degradación explícita | `src/lib/quantum-bridge.server.ts` |

---

## 4. Arquitectura

```text
                    ┌────────────────────────┐
                    │     CROWN Gateway      │
                    │ arbitration · routing  │
                    └───────────┬────────────┘
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
┌───────────────┐     ┌────────────────┐       ┌────────────────┐
│   ISA Core    │     │ SOPHIA Engine  │       │  ORION Engine  │
│ presence      │     │ epistemology   │       │ tools/sandbox  │
└───────┬───────┘     └───────┬────────┘       └────────┬───────┘
        └─────────────────────┼─────────────────────────┘
                              ▼
                    ┌────────────────────────┐
                    │    ARGUS Sentinel      │
                    │ defense · veto · audit │
                    └────────────────────────┘
```

- **CROWN** arbitra routing, estado y política. **ISA** presencia y tono. **SOPHIA** evidencia y E0–E4. **ORION** herramientas y ejecución. **ARGUS** riesgo, veto, redacción y kill switch. **MNEMOS** memoria. **BookPI** procedencia.

Las mutaciones sensibles son **fail-closed**: identidad, tenant, capability, cuota, aprobación, validación de entrada/salida y auditoría deben resolverse antes de ejecutar.

---

## 5. Motor núcleo nativo (cómo funciona)

1. **Dos entradas de servidor.** `server.ts` (monolito Express, ~120 rutas `/api/v1/...`) y `src/server.ts` (entrada TanStack Start/Nitro: CSP con nonce, sanitizado de `x-forwarded-*`, OTel, `validateStartupEnvironment()` como *C.R.O.W.N. Startup Gate*). `src/start.ts` añade CSRF y error middleware.
2. **Pipeline de 7 etapas.** `src/lib/sovereign-pipeline.ts` ejecuta `CROWN.assessIntent → createRoutingDecision → constitutional gate (fail-closed) → memoryEngine.retrieve() → evaluatePolicy() → executionAuthority.execute() → auditRepository.append()`.
3. **Doble pipeline hexagonal A/B.** `src/lib/isabella/double-pipeline.ts` mantiene dos instancias con 6 puertos (`Ingest · Policy · Context · Inference · Evidence · Delivery`), métricas p50/p95/p99, cola, cripto, inferencia, DB, reintentos y backpressure; el enrutamiento usa **salud medida**, no supuesta.
4. **`TriangularTurboCache`**: 3 anillos TTL (veredictos CROWN / identidad-contexto / inferencia-cripto).
5. **Autoridad CROWN v6 con compat-adapter** (`src/lib/crown.ts`). `production-capabilities.json` advierte: los 7 módulos extendidos de v6 **no están cableados al pipeline** (`extended_modules_wired_into_pipeline: false`, readiness 70 %).
6. **Gateway de chat único** (`src/lib/isabella-chat-gateway.ts`): rate-limit distribuido → `parseSafeJsonBody` → schema Zod → sanitizado → **kill-switch de inferencia (503)** → `classifyTextRisk()` nativo → firewall AEGIS-X → runtime cognitivo → proveedor.
7. **Nativo vs externo es una línea nítida.** *Externo opcional*: Gemini, Groq, xAI mediante `secrets.optionalProviderKey`. *Nativo*: `src/lib/isabella-inference-engine.ts`, cuyo docstring dice literalmente *«Zero-dependency cognitive engine. No Gemini, no OpenAI, no external LLM»* (tokenizador NFD, glosario, `INTENT_PATTERNS`, entidades, sentimiento léxico, memoria de 10 turnos, `inferSovereign()`).
8. **Integración nativa de runtime** (`src/lib/isabella/native-integration.ts`): escribe `.isabella-state/isabella.lifecycle.json` (0600/0700, escritura atómica), detecta salida sucia previa / sospecha de OOM, lee `/proc/meminfo` (se degrada en Windows), calcula `codeFingerprint` y marca `health: degraded` si RSS supera el 65 % de RAM.
9. **`src/lib/node-require.ts`**: `createRequire` dual ESM/CJS para módulos nativos (`better-sqlite3`) bajo tsx/Vercel/esbuild.
10. **`src/lib/platform-capabilities.ts`**: registro de capacidades runtime con `owner`, `status`, `productionSafe` y `evidence[]`. `assertProductionCapability()` **lanza error si `productionSafe=false`**. Estados: 2 `verified`, 6 `implemented`, 1 `experimental`, 1 `simulated`, 1 `planned`.
11. **Persistencia durable** (`src/lib/persistence/`): adaptadores SQLite/Postgres, stores de suscripción, sin `process.env` fuera de `config.ts`.
12. **Superficies duplicadas sin consolidar** (riesgo conocido): además del gateway existen `isabella-native-gateway.ts`, `cognitive/native-engine.ts`, `native-comprehension.ts`, `isabella-v5.ts`, `isabella-inference-engine.ts` y tres registros de skills distintos.

---

## 6. Machine Learning nativo

### Qué es real (implementado y verificable en código)

| Componente | Qué hace | Ruta |
|---|---|---|
| **Entrenador binario** | Regresión logística con SGD **entrenada en proceso** (lr 0.05, 40 épocas), calcula `accuracy`, `logLoss`, `artifactHash`, `trainingHash`, `provenanceId`; `predictBinary()` rechaza si `approvalStatus !== "APPROVED"` | `src/lib/native-ml/engine.ts` |
| **Embeddings por feature hashing** | N-gramas de bytes (2–4), dim 192, FNV-1a, firma SimHash + distancia Hamming, coseno, compresión a latente | `src/lib/ncua/embed.ts` |
| **Índice LSH** | Bucket grueso de 16 bits + reranking por Hamming/coseno | `src/lib/ncua/lsh.ts` |
| **Tensor-lite** | `Float64Array` con pesos Xavier de **semilla fija**; el propio docstring dice *«los pesos con semilla fija NO son un modelo entrenado»* | `src/lib/ncua/tensor.ts` |
| **Learning plane** | Conceptos, procedimientos, preferencias, episodios y competencia por skill, con persistencia; *«does not pretend to update model weights»* | `src/lib/isabella-learning.ts`, `isabella-learning-persistence.ts` |
| **Refuerzo supervisado** | Evaluación y refuerzo sobre el learning plane, auditado por `production-integrity-gate.mjs` (prohíbe `Math.random` y stubs) | `src/lib/isabella/ml/reinforcement.ts` |

### Qué es heurística o simulado (no es un modelo entrenado)

- `src/lib/native-ml/text-classifier.ts` → **pesos fijos** (`WEIGHTS = [1.8, 2.4, 1.1, 1.5]`, `BIAS = -2.2`) sobre 4 features léxicas. Es un scorer, no un entrenamiento.
- `src/lib/native-ml/moe-engine.ts` → el repo mismo lo admite: *«router/clasificador local, no un MoE neuronal entrenado»*; `genesis-turbo.ts` son 24 expertos nominales con selección top-3 por keyword.
- `src/lib/native-ml/skill-fusion.ts` → `NATIVE_SKILL_SOURCES` **declara** repositorios de origen; no descarga ni ejecuta nada de ellos.
- `src/lib/isabella-native-ml.ts` → docstring explícito: *«clasificador determinista … NO generativo … no genera, no razona, no sustituye inferencia»*.
- `ml-service/app/__init__.py` → **0 bytes**; el servicio Python de ML está vacío.
- **Cero** archivos `.onnx`, `.pt`, `.pth`, `.safetensors`, `.pkl`; **cero** imports de `onnxruntime`, `tensorflow`, `torch`, `transformers` o `sklearn`; **cero** pesos versionados.

> **Veredicto ML:** hay **un** entrenador real (logística binaria en TS, con hash de artefacto y aprobación obligatoria) y **cero** inferencia local de modelos profundos. Todo lo demás es heurística determinista + feature hashing, con docstrings que lo dicen. Etiqueta justa: `IMPLEMENTED` en gobernanza/heurística, `SIMULATED` donde se habla de expertos neuronales o telemetría territorial.

---

## 7. Skills — qué hay y qué hace cada una

**54 skills únicas registradas.** Pipeline de ejecución (`src/lib/skills/run-skill.ts`):
`identidad → validación de input (Zod) → evaluateAuthorization → skill.run() → auditoría BookPI`.

API: `GET/POST /api/v1/skills` (scopes `system:read` / `system:execute`) y `GET/POST /api/isabella-skills`.
Contratos: `IsabellaSkill`, `SkillContext`, `SkillResult`, `FederationId`, `SkillRisk` (`LOW|MEDIUM|HIGH|CRITICAL`), `SkillStatus` (`SUCCESS|PARTIAL|BLOCKED|ESCALATED|FAILED`).

### 7.1 Pack Core (7)

| Id | Nombre | Qué hace |
|---|---|---|
| `ORION` | Cognitive Archaeology Engine | Recupera artefactos, reconstruye relaciones y detecta vacíos de memoria |
| `SOPHIA` | Deep Research and Synthesis Engine | Construye síntesis verificables, distingue evidencia de hipótesis y detecta vacíos |
| `ARGUS` | Sentinel and Observability Layer | Detecta anomalías, degradación operativa, abuso y riesgos de infraestructura |
| `HERMES` | Narrative and Communication Engine | Traduce información compleja en mensajes claros, responsables y contextuales |
| `ATLAS` | Territorial Modeling and Simulation | Simula impactos territoriales y detecta puntos de palanca para decisiones responsables |
| `ANUBIS` | Cryptographic Provenance Sentinel | Verifica integridad, procedencia y trazabilidad de artefactos críticos |
| `GEMET` | Ethical Governance Matrix | Evalúa decisiones contra dignidad, consentimiento, equidad y soberanía |

### 7.2 Packs territoriales, de infraestructura y archivo (9)

| Id | Nombre | Qué hace |
|---|---|---|
| `AURORA` | Contextual Orientation Layer | Orienta a usuarios dentro de RDM Digital con recomendaciones contextuales |
| `GAIA` | Territorial Sustainability Engine | Evalúa sostenibilidad integral de iniciativas con enfoque territorial y cultural (puede emitir `BLOCKED/REVIEW`) |
| `NODO_CERO` | Real del Monte Node Zero Operations | Gestiona etapas, dependencias y acciones de iniciativas del Nodo Cero |
| `PHAROS` | Responsible Territorial Discovery | Recomienda experiencias territoriales con criterios culturales, comunitarios y de accesibilidad |
| `CITEMESH` | Federated Mesh Coordination | Evalúa salud federada, detecta particiones y propone resiliencia |
| `HEPHAESTUS` | Sovereign Architecture Builder | Deriva artefactos técnicos y criterios de aceptación desde requerimientos gobernados |
| `MNEMOSYNE` | Living Institutional Memory | Indexa, resume, etiqueta y versiona artefactos de la memoria del ecosistema |
| `CHRONOS` | Temporal Continuity Engine | Ordena eventos, preserva trazabilidad temporal e inconsistencias cronológicas |
| `PROMETEO` | Civilizational Compiler | Convierte documentos y repositorios en blueprints, contratos y unidades implementables |

### 7.3 Packs de ética, soberanía, economía y educación (8 + 2)

| Id | Nombre | Qué hace |
|---|---|---|
| `VIGIA` | Triple-Lock Safety Guardian | Aplica protección ontológica, semántica y conductual a las interacciones |
| `LYRA` | Aesthetic and Cultural Coherence Engine | Evalúa coherencia estética, respeto cultural, accesibilidad y calidad de experiencia |
| `EIRENE` | Conflict Mediation Support | Facilita diálogo básico y deriva situaciones de riesgo hacia atención humana |
| `THEMIS` | Explainable Audit Engine | Genera expedientes explicables de decisiones, evidencia y rutas de auditoría |
| `SENTINEL` | Operational Abuse Protection | Detecta abuso de interacción y recomienda rate limit o bloqueo temporal auditable |
| `HELIOS` | Systemic Analytics Engine | Identifica tendencias, señales sistémicas y puntos de atención en series métricas |
| `KAIROS` | Strategic Prioritization Engine | Prioriza iniciativas con métricas explícitas de impacto, urgencia, riesgo y viabilidad |
| `UTAMV` | University-OS Learning Path Engine | Diseña rutas de aprendizaje y proyectos aplicados con evidencia de competencia |
| `HEPTA` | Heptafederated Cognitive Orchestrator | Identifica la federación dominante y compone planes cognitivos gobernados |
| `TINA` | TINA Category Authority | Declara y sostiene la categoría TINA (`productionSafe: false`) |

### 7.4 Pack ecosistema OsoPanda / Nodo Cero (6) — **parcialmente SIMULATED**

| Id | Qué hace | Estado declarado |
|---|---|---|
| `nodo-cero-twin` | Gemelo Digital territorial de Real del Monte: telemetría de montaña (2 700 m), minas históricas, rutas patrimoniales, monitoreo ambiental | `SIMULATED_TELEMETRY` hasta conectar `TerritorialTelemetryProvider` vivo |
| `rdm-sovereign-commerce` | Certificación de denominación de origen y comercio justo para artesanos y prestadores de RDM | `ADMITTED_FOR_DELIBERATION / REQUIRES_SIGNATURES / DENIED_CONSTITUTIONAL` |
| `rdm-community-assembly` | Deliberación cívica, asamblea digital y presupuestos participativos | `BLOCKED` ante veredicto `DENIED_CONSTITUTIONAL` |
| `fast-parallel-ingest` | Ingesta y descarga segmentada en paralelo para datasets territoriales masivos | `SIMULATED_THROUGHPUT` |
| `qstash-event-dispatcher` | Enrutador de eventos asincrónicos sin estado entre nodos cognitivos | `SIMULATED_DISPATCH` (18 ms es referencia) |
| `docs-instant-search` | Búsqueda indexada y semántica sobre la documentación canónica | `SIMULATED_SEARCH` (base de 4 docs de referencia) |

### 7.5 Pack «evolved» (22) — ejecución **nativa parcial**, sin efectos externos

Estos 22 skills se ejecutan vía `executeNativeSkill()`, que devuelve `status: "PARTIAL"`, `externallyExecutable: false`,
`warnings: ["La ejecución nativa no simula efectos externos; requiere un adaptador autorizado."]`.
Generan plan, vector semántico, riesgo y hash de procedencia **en local**: **no invocan** Firecrawl, Tavily ni CKM reales.

| Id | Qué hace |
|---|---|
| `firecrawl-market-research` | Investigación de mercado, tamaño de oportunidad y síntesis de inteligencia web |
| `firecrawl-monitor` | Monitoreo de cambios web, diff semántico de DOM y alertas de deriva |
| `firecrawl-seo-audit` | Auditoría SEO técnica: OpenGraph, JSON-LD schema.org, jerarquía de títulos |
| `firecrawl-knowledge-base` | Rastreo de documentación, limpieza de markdown y partición semántica para RAG |
| `firecrawl-workflows` | Orquestación de extracción web multiciclo: Crawl → Extract → Validate → Webhook |
| `firecrawl-dashboard-reporting` | Tableros ejecutivos a partir de métricas web extraídas |
| `firecrawl-lead-gen` | Descubrimiento de oportunidades B2B y calificación con cumplimiento ético |
| `firecrawl-lead-research` | Dossier de organizaciones objetivo: tecnología, modelo de negocio, directivos |
| `firecrawl-competitive-intel` | Monitoreo de competidores: precios, paridad de funciones, contra-posicionamiento |
| `tavily-search` | Búsqueda web fáctica optimizada para LLM con filtrado y re-ordenamiento |
| `ckm-brand` | Identidad de marca, escala tipográfica, contraste matemático y guía de tono |
| `ckm-banner-design` | Banners de conversión en 16:9, 1:1, 4:5 y 9:16 |
| `ckm-slides` | Diapositivas ejecutivas con arquetipos Problema/Solución/Arquitectura/Tracción |
| `baoyu-infographic` | Infografías estructuradas, esquemas SVG y modelos conceptuales |
| `baoyu-markdown-to-html` | Markdown → HTML semántico con matemáticas y sin inyección XSS |
| `flutter-add-widget-test` | Pruebas de widgets Flutter con `WidgetTester` y aserciones semánticas |
| `flutter-add-integration-test` | Pruebas de integración extremo a extremo con `integration_test` |
| `browser-testing-with-devtools` | Auditoría de Core Web Vitals, accesibilidad axe-core y errores de consola |
| `swiftui-expert-skill` | SwiftUI: `@Observable`, concurrencia moderna, `NavigationStack` |
| `source-driven-development` | Desarrollo dirigido por especificación: contratos tipados, invariantes AST |
| `ci-cd-and-automation` | Pipelines CI/CD con SAST y compresión de artefactos |
| `shipping-and-launch` | Checklist de lanzamiento, verificación de rollback y compuertas de despliegue |

> **Nota:** `src/lib/skills/native-skills-pack.ts` exporta 7 skills (`frontend-design`, `web-design-guidelines`, `caveman`, `prisma-*`) que **no están registradas** en ningún pack; permanecen fuera del catálogo.

---

## 8. Motor de skills — API y ejecución

```bash
GET  /api/v1/skills          # listado (system:read)
POST /api/v1/skills          # ejecución (system:execute)
GET  /api/isabella-skills    # catálogo conversacional con cuota distribuida
```

`run-skill.ts` encadena: identidad → esquema Zod → `evaluateAuthorization()` → `skill.run()` → evento de auditoría en BookPI.
Todo resultado lleva `evidence[]`, `warnings[]` y `auditEvents[]`; un skill puede terminar en `BLOCKED` o `ESCALATED` (revisión humana).

---

## 9. Inicio local

```bash
pnpm install --frozen-lockfile
pnpm dev
```

El servidor de desarrollo valida el entorno antes de iniciar. Nunca expongas secretos en `VITE_*`, código cliente, fixtures, logs o documentación.

---

## 10. Verificación

```bash
pnpm typecheck          # tsc --noEmit          → 0 errores
pnpm lint               # eslint .              → 0 errores
pnpm test               # vitest run            → ⚠ 0 archivos de test en HEAD
pnpm security:scan      # eslint.security + secret-scan
pnpm audit:repository
pnpm audit:architecture
pnpm audit:routes
pnpm verify:lock
pnpm build
```

El gate completo es `pnpm production:gate` (14 pasos encadenados). Si un gate depende de infraestructura, claves o evidencia externa, su resultado debe permanecer explícitamente bloqueado: **`EVIDENCE_GATED` no se convierte en `PASS`** (AGENTS §19).

---

## 11. Estructura del repositorio

```text
src/
  routes/          rutas TanStack Start (API + UI)
  server-routes/   rutas Express/BFF (billing, igds, observability, db…)
  lib/             núcleo: pipeline, crown, gateway, skills, native-ml, ncua, igds, ledger
  components/      UI React (Dashboard, Terminal, Ledger, Security, Quantum…)
  context/         CrownContext (estado global, feedback de mensajes)
  core/            runtime: provider-registry, skills versionados
  middleware/      rateLimit, security
  persistence/     adaptadores SQLite/Postgres
  domains/         dominios de negocio (economy, …)
supabase/migrations  45 migraciones SQL con RLS
prisma/             schema (4 modelos) + cliente generado
k8s/                deployment, networkpolicy, qup-psp
docs/               142 documentos canónicos (INDEX, gates, evidencia, runbooks)
test/               setup de vitest (la suite fue eliminada en d7926f7)
scripts/            gates, auditorías, generadores, verificación de lockfile
```

---

## 12. Seguridad aplicada

- Validación de contratos con Zod y límites de body, mensajes, adjuntos y herramientas.
- Parsing JSON acotado, UTF-8 fatal, rechazo de JSON inválido y respuestas sin cache.
- Autenticación soberana (JWT/OIDC), scopes por ruta y aislamiento de tenant.
- Rate limiting distribuido (Redis/Upstash con fallback en memoria explícito), timeouts, allowlist de egress, redacción de secretos.
- CSP y headers de defensa en profundidad (`SecuritySystem` + `vercel.json`).
- No se persisten tokens en `localStorage`; los logs no contienen prompts completos, respuestas, PII, credenciales ni tokens.
- Fail-closed: identidad, tenant, política, cuota, validación, firma e integridad de BookPI.

---

## 13. Deduplicación

Existe **un** gateway de chat: `src/lib/isabella-chat-gateway.ts`. Las superficies `/api/isabella` y `/api/v1/isabella` son adaptadores delgados y comparten `toGatewayContext`, evitando contratos divergentes. Antes de eliminar otro módulo aparentemente duplicado, verifica importadores, tests, rutas generadas y estado de despliegue.

---

## 14. Variables de entorno

Configura secretos **únicamente** en Vercel VVars o el gestor de secretos del entorno. `.env.example` no contiene valores reales; el arranque valida con Zod.

- `JWT` o `AUTH_JWT_SECRET` para autenticación server-side.
- `DATABASE_URL` para persistencia cuando aplique.
- `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET`, claves de proveedores AI y de Stripe: **solo servidor**.
- Variables `VITE_*`: jamás secretos.

---

## 15. Límites honestos

- Un build verde **no** demuestra producción.
- Un hash **no** equivale a WORM regulatorio.
- Una firma simulada **no** equivale a criptografía operativa.
- Un gate `EVIDENCE_GATED` **no** equivale a `PASS`.
- Una licencia **no** concede autorización sobre datos, marcas o modelos.
- KMS local **no** es un HSM.
- Las capacidades parciales, simuladas o bloqueadas permanecen visibles en UI, contratos y evidencia (`platform-capabilities.ts`, manifiestos `production-capabilities.json` y `docs/status/`).

> Principio rector (AGENTS.md): **las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta.**

---

## 16. Documentación

- `AGENTS.md` — documento maestro de arquitectura, seguridad y especificación canónica.
- `docs/INDEX.md` — índice de los 142 documentos.
- `docs/01…07-*.md` — canónica, operaciones, seguridad, economía BookPI, ML, desarrollo y categoría TINA.
- `docs/status/` — auditorías ISA-500, checklist, auditoría crítica.
- `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODEOWNERS`.
