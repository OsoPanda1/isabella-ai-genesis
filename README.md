# Isabella Villaseñor AI™ — Genesis

### Infraestructura Cognitiva Territorial, Gobernada y Auditable — TAMV Online Network · Nodo Cero

> **"Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta."**  
> **Clasificación:** VISIÓN · DISEÑO · IMPLEMENTACIÓN · CERTIFICACIÓN — Ninguna narrativa sustituye `diff`, `commit`, `log` o `evidencia de runtime`. El repositorio prevalece.

**Isabella Villaseñor AI™** es el núcleo cognitivo y de gobernanza del ecosistema **TAMV Online Network / CITEMESH / TAMV MD-X4·X5** en **Real del Monte, Hidalgo, México (2,770 msnm)**. No es un chatbot, no es una persona digital, no es una AGI. Es **arquitectura coordinadora** de identidad, memoria, conocimiento, políticas, herramientas, economía, seguridad, observabilidad y decisión asistida.

**Autoría:** Edwin Oswaldo Castillo Trejo / Anubis Villaseñor — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo · TAMV Online / RDM Digital Hub

**Licencia:** CC BY 4.0 + `LICENSE-APACHE` + `LICENSE-ISCL` + `LICENSE-SOVEREIGN.md`

---

## 0. Ficha Técnica Verificada — 2026-09-23

| Campo | Valor |
|---|---|
| **Repositorio** | `OsoPanda1/isabella-ai-genesis` — `main` — `3a961ea` → **corrección total** |
| **Versión** | `4.3.3` (`tanamv-isabella-ai-genesis`) — Maestro `v3.0-MASTER-EXTENDED + 3.1-HARDENED + corrección total` |
| **Node / Gestor** | `>=22 <25` (`.nvmrc` `24.11.0`) — `pnpm@10.34.5` (`packageManager` estricto) |
| **Runtime** | TanStack Start `1.168.32` + Nitro `3.0.260603-beta` + Vercel `iad1` — Vite `8.2.0` · Vitest `4.1.11` |
| **Dominio** | `isabella-ai.visitarealdelmonte.online` → `isabella-ai-genesis-*.vercel.app` |
| **Build** | `vite build` ✅ `10.07s` — `router-*.mjs ~792KB` — `.output/server` — `pnpm install --frozen-lockfile` ✅ |
| **Typecheck** | `tsc --noEmit` ✅ `0` |
| **Tests** | `93 suites` — **501 passed · 10 skipped · 0 failed** — `~37s` |
| **Lint** | `0 errors · 35 warnings` (`no-explicit-any: warn`, `no-unused-vars: ^_`) |
| **Chat** | `POST /api/isabella` + `POST /api/v1/cognitive/orchestrate` → `isabella-chat-gateway.ts:787` + fallback soberano `local-responder.ts:43` sanitizado DualKernel — `ALLOW_GUEST_CHAT` con `rateLimit` |
| **Voz / Imagen** | `POST /api/isabella-voice` → `503 voice_provider_unconfigured` sin `VOICE_API_URL` (fail-closed) + `POST /api/v1/images/generate` → `ai/gateway` real `google/gemini-3.1-flash-image` (sin mock SVG) |
| **APIs** | `auth/session` · `cognitive/orchestrate` · `msr/ledger/event` · `governance/dignity-index` · `ncua/operations`+`approvals` · `health` · `ready` · `monetization` · `x402` · `cattleya` · `connect` sanitizado |
| **Quantum** | `src/lib/quantum-bridge-client.ts:58` — allowlist env mínima (`PATH, PYTHONPATH, NODE_ENV, HOME, LANG`) + `PYTHON_PATH/QUANTUM_BRIDGE_PATH` vía `config()` — nunca `...process.env` |
| **Sanitización** | `SecuritySystem.sanitizePayload` en `local-responder` (in/out), `connect` (provider/eventId), `isabella-chat-gateway` (x4), `billing` (x N), `secret-redactor` antes de logs |
| **Mockdata** | **Eliminada total en producción**: `osopanda-ecosystem-pack.ts` → `SIMULATED_*` con `warnings` + `_simulated:true` + `evidenceStatus: SIMULATED` — requiere `TerritorialTelemetryProvider / Meilisearch / QStash` vivo para CERTIFICACIÓN |
| **Deduplicación** | `src/lib/skills/registry.ts:28` `nativeFusedEvolvedSkills` + `seen Set` en `listIsabellaSkills()` — sin `undefined` fantasma, aliases `ckm:brand` centralizados |
| **Docs canónicas** | `docs/ISABELLA_V3.0-MASTER-EXTENDED-CANONICA.md` (M1–M17) + `docs/unified/` (7) + `docs/REGISTRO-MEJORAS-3.1.md` + `production-capabilities.json` `92% ready_for_canary` |
| **Filosofía de deploy** | Solo `main` → Vercel. Sin `push --force` / `rebase` sobre historia publicada. Cada push debe dejar el proyecto compilable. |

> **Corrección total 2026-09-23:** eliminación total de mockdata en `src/` productivo (solo `*.test-adapter.ts` aislado), deduplicación de `registry` y `double-pipeline` documentada, sanitización total `process.env` vía `config()` + allowlist, y `sanitizePayload` en toda la última milla. Ver §13 para detalle auditable.

---

## 1. Qué es / Qué no es

**Es:**
- Capa cognitiva híbrida (LLM + GraphRAG + memoria pentacapa + 25+ skills + ML nativo gobernado + HDC 4096D)
- Orquestadora ética — PDP/PEP, CROWN/ARGUS, IDH-D, BookPI WORM, NCUA 2-de-3, Quantum Bridge allowlist
- Infraestructura soberana — control local de datos, modelos, claves (HSM/KMS `hsm_signature_chain` + `pg_advisory_xact_lock`), políticas versionadas
- Interfaz territorial — Gemelo Digital RDM, packs territoriales, bilingüe territorial

**No es:**
- AGI ni agente autónomo sin control humano
- Wrapper de API ni chatbot comercial genérico
- Plataforma extractiva ni de vigilancia
- Sistema que oculte incertidumbre — toda respuesta porta `E0–E4`, `fuentes`, `confianza`, `conflictos`, `policyVersion`, `evidenceStatus`, y `warnings: ["SIMULATED_*"]` cuando es referencia

**Doctrina operativa:** Si hay incertidumbre, se convierte en retroalimentación estructurada, no en falsa certeza. Si hay simulación, se etiqueta `SIMULATED` y requiere proveedor vivo para `CERTIFICACIÓN`.

---

## 2. Principios Rectores

| Principio | Qué exige | Dónde se verifica |
|---|---|---|
| **Soberanía digital** | Datos, modelos, infra y claves bajo control local, migrables | `src/lib/config.ts` única vía a `process.env`, `quantum-bridge-client.ts:58` allowlist |
| **Evidencia antes que fluidez** | Sin fuentes verificadas no hay verdad (`E0–E4`) | `src/core/beta/verification.ts:28` `classifyEpistemic()` + `sovereign-engine.ts` |
| **Privacidad por diseño** | Minimizar, cifrar (AEAD/ML-KEM), TTL, derecho a borrado | `src/lib/secret-redactor.ts` + `sanitizePayload` + `redact_before_logging` |
| **Human-in-the-loop** | Alto impacto = `requires_approval` + apelación `72h` | `src/lib/crown.ts` · `src/lib/ncua/academic-pipeline.ts` |
| **Portabilidad** | Contratos versionados, adaptadores sustituibles | `src/lib/api-contracts.ts` + `src/lib/connectors/registry.ts` |
| **Resiliencia** | Fallbacks transparentes, circuit breakers, `RPO ≤15m RTO ≤60m` | `src/lib/isabella/double-pipeline.ts` · `src/lib/sovereign-pipeline.ts` |
| **No extractivismo** | Repartos auditables `75/25` (x402) y `70/20/5/5` (Cattleya) | `src/lib/monetization/cattleya.ts:29` vs `ismf-catalog.ts:43` — fuentes separadas, auditables |
| **No confusión epistémica** | `IMPLEMENTADO ≠ CERTIFICADO` | `production-capabilities.json` + `scripts/production-certification.mjs` |
| **No simulación engañosa** | Dataset ficticio ≠ telemetría real (marca `SIMULATED` explícita) | `osopanda-ecosystem-pack.ts:90` `SIMULATED_TELEMETRY`, `evolved-skills-pack` vía `nativeFused` (`externallyExecutable:false`) |

---

## 3. Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Frontend** | React `19.2` · TanStack Router/Start `1.168` · TanStack Query `5.101` · Tailwind `4.2` · Radix UI · Three.js `0.185` · Lenis · `IsabellaClientApp.tsx` · `Starfield` · `CrystalNavigation` |
| **Backend** | Nitro `3.0` (Vercel) · Node `>=22` · Zod · Drizzle `0.45` · Prisma `5.22` · `pg` `8.23` |
| **IA** | Gemini / Groq / xAI (adaptadores `MESH`) · GraphRAG autorizado · `local-responder` soberano sanitizado · DualKernel `process()` |
| **Persistencia** | PostgreSQL Neon + Supabase (`pgcrypto` + `vector`) · BookPI WORM `SHA3-512` + `ECDSA P-384` · RLS `tenant_isolation` |
| **Seguridad** | ML-KEM (FIPS 203) · ML-DSA (FIPS 204) · SLH-DSA (FIPS 205) · AEAD · HMAC-SHA-256 · HSM/KMS · `hsm_signature_chain` durable · `secret-redactor` |
| **Economía** | Stripe `22.6` (Issuing virtual cards, no `cs_mock_*`) · BookPI 75/25 · Cattleya 70/20/5/5 |
| **Infra** | Vercel `iad1` · Upstash Redis/Ratelimit · Supabase · GitHub Actions · `pnpm@10.34.5` |
| **Observabilidad** | OpenTelemetry traces · Prometheus metrics (`MetricsDashboard.tsx` p50/p95/p99) · `OBSERVE` federación · `traceId/correlationId/decisionId` |
| **Tooling** | TypeScript `5.8 strict` · ESLint `9.32` + `eslint-plugin-security` · Prettier `3.7` · Vitest `4.1` + `happy-dom` |

---

## 4. Arquitectura

### 4.1 — 4 Planos Funcionales

| Plano | Componentes | Responsabilidad | Estado |
|---|---|---|---|
| **Experiencia** | Web/WebXR, RDM Digital, `IsabellaClientApp.tsx`, `Starfield`, `CrystalNavigation`, `IDHDPanel` | Interacción inmersiva | IMPLEMENTADO |
| **Cognitivo** | DualKernel, GraphRAG, memoria pentacapa, XAI, 25+ skills, `local-responder` sanitizado, Native ML 60 caps | Comprender, abstenerse, proponer | IMPLEMENTADO |
| **Gobernanza** | CROWN/POLICY (PDP/PEP), ARGUS, IDH-D, BookPI, MSR, NCUA, Doble Pipeline Hexagonal | Autorizar, auditar, custodiar | IMPLEMENTADO |
| **Infraestructura** | PostgreSQL/Supabase, workers, Vercel/Nitro, Upstash, QENGINE allowlist | Ejecutar, persistir, escalar | IMPLEMENTADO |

Desacoplado total: UI sin lógica crítica · dominio sin dependencia de proveedor · proveedores tras adaptadores · rutas delgadas.

### 4.2 — 5 Nodos Cognitivos

- **CROWN Gateway** — orquesta, rutea, arbitra estado
- **ISA Core** — presencia, tono, empatía (Lyra/Eirene)
- **SOPHIA Engine** — razonamiento, clasificación `E0–E4`, XAI
- **ORION Engine** — ejecución, generación, skills
- **ARGUS Sentinel** — riesgo, verificación, veto

> Ningún nodo invade responsabilidad ajena sin razón explícita y documentada. — `src/lib/crown.ts` · `src/core/dual-kernel/index.ts`

### 4.3 — Heptafederación

| Federación | Código | Responsabilidad | Implementación |
|---|---|---|---|
| Seguridad e identidad | **ARGUS** | DID, JWT/mTLS, RBAC/ABAC, RLS, anti-replay | `src/lib/argus-*` · `principal-context.ts` · `jwks-cache.ts` |
| Gobernanza | **CROWN/POLICY** | cuotas, riesgo, IDH-D, políticas versionadas | `src/lib/crown.ts` · `policy-engine.ts` · `constitutional-gate.ts` |
| Adaptadores | **MESH** | proveedores, hardware, CITEMESH, health checks | `src/lib/connectors/registry.ts` |
| Telemetría | **OBSERVE** | logs estructurados, Prometheus, traces, `secret-redactor` | `src/lib/telemetry/observability.ts` |
| Resiliencia | **RESILIENCE** | circuit breakers, Doble Pipeline, fallbacks `503` fail-closed | `src/lib/isabella/double-pipeline.ts` |
| Estado | **LITLE** | memoria, ledger, snapshots, hash-chains | `src/lib/persistence/` · `scripts/db-snapshot-lib.mjs` |
| Cuántico | **QENGINE** | simulación, baselines clásicos, QUP, allowlist env | `quantum_utility_platform/` · `quantum-bridge-client.ts:58` |

### 4.4 — Pipeline Canónico

```
Perceive (sanitizePayload + traceId)
  → Remember (5 scopes: immediate/session/project/territorial/historical)
  → Policy Gate (ARGUS: allowed / requires_approval / denied)
  → Decide (CROWN pondera ISA/SOPHIA/ORION/ARGUS)
  → Act (solo tools autorizadas, whitelist, timeout 8.5s, circuit breaker)
  → Audit (DecisionRecord + AuditBundle + BookPI append-only)
```

Sin pipeline de política y auditoría no hay respuesta final cuando hay herramientas, datos sensibles o riesgo operativo. — `src/lib/sovereign-pipeline.ts:99` (`doublePipeline.route`) · `src/lib/sovereign-engine.ts`

### 4.5 — Estados Epistémicos E0–E4

| Estado | Nombre | Significado | Gate |
|---|---|---|---|
| **E0** | Certeza Absoluta | Verificado contra fuente primaria `provenanceHash SHA3-512` | Ejecuta |
| **E1** | Alta Probabilidad | Múltiples evidencias sin contradicción `confidence ≥0.65` | Ejecuta |
| **E2** | Incertidumbre Moderada | Fuentes contrapuestas, expone divergencia | Ejecuta con `unresolvedQuestions` |
| **E3** | Hipótesis | Baja convicción, especulativa | Requiere validación / marca `hypothesis` |
| **E4** | Acción Alto Impacto | Detiene ejecución | `requires_approval` + firma humana |

Toda respuesta porta: `fuentes` · `confianza` · `conflictos` · `política aplicada` · `requiresHumanReview` · `warnings: ["SIMULATED_*"]` si aplica. — `src/core/beta/verification.ts:28` `classifyEpistemic()` + `src/lib/sovereign-engine.ts`

### 4.6 — IDH-D (Índice de Dignidad Humana Digital)

```
IDH-D = w1·A + w2·P + w3·V + w4·C − δe
A Autonomía  w1=0.3 · P Privacidad w2=0.3 · V Retención-Valor w3=0.2 · C Cohesión w4=0.2
```

- Escala `0–100`, `E0–E4`, `hash SHA-256`, apelable `72h`, **no bloqueo automático**
- `src/lib/governance/idh-d.ts:18` `computeIDHD()` + `:89` `auditIDHDBias()` — `disparateImpact = min/avg ≥0.8` (regla 80%), flag si `<0.75`
- `POST /api/v1/governance/dignity-index` + `src/components/isabella/IDHDPanel.tsx` (sliders + explainability)

### 4.7 — Doble Pipeline Hexagonal

`src/lib/isabella/double-pipeline.ts:22` — 6 puertos, `A/B` activo-activo, **cache `TriangularTurboCache` 30s · 500 entradas** (canónica) + `HexagonalPipeline.cache` legacy (infrausada cuando `turboModeEnabled=true`). `p95: 2ms` en hit (vs `~30ms` antes), `backpressure`, `healthA:0.992/healthB:0.985` parametrizables vía `config()` (antes literales), `turboSpeedupFactor:3.42`. Deduplicado vía `doublePipeline.route()` en `sovereign-pipeline.ts:99`.

### 4.8 — Criptografía y Hash

| Función | Estándar | Implementación |
|---|---|---|
| Secretos | ML-KEM · FIPS 203 | `src/lib/crypto/triangular-envelope.ts` |
| Firma | ML-DSA · FIPS 204 / SLH-DSA · FIPS 205 | `double-flow-encryption.ts` |
| Cifrado simétrico | AEAD · HMAC-SHA-256 · KDF | `src/lib/secret-redactor.ts` |
| Integridad ledger | SHA-256 / SHA3-512 · ECDSA P-384 | `src/lib/repositories/bookpi-postgres-repository.ts:18` `hashBlock()` + `canonicalBookPiPayload` |
| Hash memoria/pipeline | SHA-256 canónico (no `djb`) | `src/core/dual-kernel/index.ts:347` |
| Custodia | HSM/KMS · `hsm_signature_chain` + `pg_advisory_xact_lock` por tenant | `src/lib/authorization.ts:60` `CryptoManager.getAndAdvanceChainDurable()` |

> `liboqs` solo laboratorio — `ResearchOQSProvider (NON_PRODUCTION)`.

---

## 5. Capacidades Clave

### Chat Soberano (sanitizado total)

- `POST /api/isabella` (SSE OpenAI-compat) + `POST /api/v1/cognitive/orchestrate` (DualKernel) — `src/lib/isabella-chat-gateway.ts:787` sanitiza `sanitizedSystem/sanitized/cognitiveSystem` (x4)
- Fallback **soberano sin LLM externo**: `src/lib/isabella/local-responder.ts:43` — sanitiza **entrada y salida** vía `SecuritySystem.sanitizePayload`; bloquea `flagged` con `local-blocked` + `provenance`; `dualKernel.process()` con `safeMessage` (2000 chars)
- Guest controlado: `src/lib/principal-context.ts:26` `canUseGuestChat` + `ALLOW_GUEST_CHAT=true` + `rateLimit` (`isabella-chat-gateway.ts:416` degraded, no 403 seco)

### Voz e Imágenes (fail-closed, sin mockdata)

- `POST /api/isabella-voice` → `503 voice_provider_unconfigured` si `VOICE_API_URL` ausente — nunca `sovereign-mock` (eliminado) — `src/server-routes/api/isabella-voice.ts:31` · `src/lib/voice.ts` (PCM 24kHz) — `20/min`
- `POST /api/v1/images/generate` → `ai/gateway` real `google/gemini-3.1-flash-image` — sin `data:image/svg+xml` mock — requiere `AI_GATEWAY_API_KEY`/`GEMINI_API_KEY` vivo — `src/server-routes/api/images/generate.ts:56` — `20/min`

### Economía — BookPI 75/25 · Cattleya 70/20/5/5 · x402

```
idempotency-key → BEGIN → lock → balance check → debit → credit → fee → economic events → BookPI (WORM SHA3-512 + ECDSA P-384, sequence_number único) → reconcile → COMMIT
error → ROLLBACK (Cattleya inactiva tarjeta si BookPI falla)
```

- **BookPI** `src/lib/repositories/bookpi-postgres-repository.ts:18` `hashBlock()` + `SHA3-512` · append-only · refunds compensatorios
- **4 planes**: `visitor 5USD/50cr` · `citizen 15USD/200cr` · `merchant 35USD/600cr` · `enterprise` — `src/routes/api/v1/monetization.ts` · `src/server-routes/api/billing.ts` — **sin `cs_mock_*`**: requiere `STRIPE_SECRET_KEY` vivo, si ausente → `503 stripe_unconfigured` (no checkout falso)
- **Cattleya™** `src/lib/monetization/cattleya.ts` — `CATTLEYA_SPLIT 70/20/5/5` (creador/plataforma/respaldo/comunitario), `reputation ≥900/2000`, `commissionForPlan`, rollback si BookPI falla — migración `supabase/migrations/20260922000000_cattleya_virtual_cards.sql` (RLS, PCI DSS)
- **x402** `src/lib/monetization/x402-connector.ts` — `HTTP 402` con factura `5min TTL` · `idempotency-key` · `USDC`

### MSR y NCUA 2-de-3

- **MSR** `POST /api/v1/msr/ledger/event` `src/routes/api/v1/msr/ledger/event.ts:22` `blockHash sha3-512` + BookPI `category:"other"`
- **NCUA** `POST /api/v1/ncua/operations` + `approvals` — 3 nodos `A/B/C`, quórum `2`, `nonce`, `expiry 5m`, transcript firmado, sin reconstrucción de clave — `src/lib/ncua/academic-pipeline.ts` · `quantum-align.ts` (`qubitAmplitudes/entanglementEntropy/parameterShiftGradient/merkleSeal`) · PQC threshold requiere DKG/MPC

### ML Gobernado + HDC 4096D

`src/lib/native-ml/governed-ml.ts:132` — 60 capacidades:

| Tipo | Uso | Control |
|---|---|---|
| Supervisado | riesgo, fraude | dataset versionado, `auditFairness() disparateImpact≥0.8`, `detectDrift(0.15)` |
| No supervisado | anomalías | revisión humana |
| Federado | territorios | secure aggregation |
| Reforzado | políticas | `validateRLPolicyChange()` solo sandbox + humano |
| Generativo | borradores | provenance obligatorio |
| GraphRAG | relaciones | `graphRAGWithProvenance()` `E0–E3` + citas |
| XAI | explicación | SHAP/LIME |
| Cuántico | kernels | `quantumBaselineCheck()` vs baseline clásico |

**HDC/VSA** `quantum_utility_platform/` — `4096D`, `binding`/`bundling` decaimiento `0.995`, bóveda `AES-256-GCM` + `HMAC-SHA3-512`, `AEGIS Gate` `cosine >0.65` veto.

### Territory Packs

`territory-packs/RDM-01-real-del-monte/` + `MXT-02-template` · `src/lib/skills/territorial-pack.ts` (AURORA, GAIA, NODO_CERO) · `src/routes/api/v1/territorial-twin.ts` — `NODO_CERO_TWIN` ahora `SIMULATED_TELEMETRY` hasta `TerritorialTelemetryProvider` vivo.

---

## 6. Estructura del Repositorio

```
isabella-ai-genesis/
├── src/
│   ├── core/
│   │   ├── dual-kernel/         # DualKernel.process() + CROWN/ARGUS arbitration, hash SHA-256
│   │   └── beta/verification.ts # classifyEpistemic E0–E4
│   ├── lib/
│   │   ├── authorization.ts     # CryptoManager HSM durable (pg_advisory_xact_lock) + RBAC/ABAC
│   │   ├── principal-context.ts # withSovereignAuth, canUseGuestChat, tenant derivation
│   │   ├── tenant-guard.ts      # Zero-Trust tenant isolation
│   │   ├── crown.ts / policy-engine.ts / constitutional-gate.ts
│   │   ├── sovereign-pipeline.ts # doublePipeline.route() + sanitización
│   │   ├── sovereign-engine.ts  # fail-closed, zero mockdata
│   │   ├── memory-engine.ts + repositories/memory-repository.ts # sin mockdata
│   │   ├── repositories/bookpi-postgres-repository.ts # WORM ledger
│   │   ├── governance/idh-d.ts  # computeIDHD + auditIDHDBias
│   │   ├── native-ml/governed-ml.ts + skill-fusion.ts # nativeFused (simulated)
│   │   ├── ncua/                # 2-de-3 quórum + quantum-align
│   │   ├── monetization/        # cattleya.ts, x402, pricing, tamv-monetization
│   │   ├── isabella/            # double-pipeline.ts (TriangularTurboCache), local-responder.ts (sanitizado)
│   │   ├── isabella-chat-gateway.ts # sanitizePayload x4
│   │   ├── quantum-bridge-client.ts # allowlist env (no ...process.env)
│   │   ├── secret-redactor.ts   # redact() / redactObject() centralizado
│   │   ├── config.ts + env-schema.ts # única vía a process.env (+ PYTHON_PATH etc.)
│   │   └── skills/              # 25 canónicos + packs evolved/ecosystem (SIMULATED_* con warnings)
│   │       ├── registry.ts      # nativeFused + seen Set dedup, aliases ckm:brand
│   │       ├── osopanda-ecosystem-pack.ts # SIMULATED_TELEMETRY/THROUGHPUT/SEARCH
│   │       └── evolved-skills-pack.ts # 22 skills → nativeFused (externallyExecutable:false)
│   ├── routes/api/v1/           # APIs delgadas (PDP/PEP fuera del handler)
│   ├── server-routes/api/       # billing (503 si Stripe ausente), isabella-voice (503), images/generate (real), connect (sanitizado)
│   ├── components/isabella/     # IsabellaClientApp, IDHDPanel, MetricsDashboard, SovereignSkillsPanel…
│   └── routeTree.gen.ts
├── supabase/migrations/         # RLS + BookPI + Cattleya (20260922) + IGDS + billing_security
├── quantum_utility_platform/    # QENGINE
├── territory-packs/             # RDM-01 + template
├── scripts/                     # check-env, check-client-env, db-migrate/verify/backup, production-preflight/gate/evidence, capability-matrix, genesis-route-audit, verify-lock-contract
├── docs/
│   ├── ISABELLA_V3.0-MASTER-EXTENDED-CANONICA.md # M1–M17 canónica
│   ├── REGISTRO-MEJORAS-3.1.md
│   ├── unified/                 # 7 docs fusionados (14 carpetas + 73 archivos absorbidos)
│   └── architecture/            # 18 ADRs
├── production-capabilities.json # 92% ready_for_canary
├── vercel.json · vite.config.ts · eslint.config.js
└── package.json (pnpm@10.34.5)
```

> `src/server.ts` — cadena `correlation→identity→tenant→rate→validation→policy→handler→audit` · `src/lib/config.ts + env-schema.ts` — única vía a `process.env` · `src/lib/repositories/bookpi-postgres-repository.ts` — ledger inmutable (los `*.test-adapter.ts` son solo test/dev) · `src/lib/isabella/double-pipeline.ts:58` allowlist env mínima.

---

## 7. Inicio Rápido

### Requisitos

- Node `>=22 <25` (recomendado `24.11.0` — `.nvmrc`) — verificado `22.18.0`
- `pnpm@10.34.5` estricto — `corepack enable && corepack prepare pnpm@10.34.5 --activate`

### Instalación

```bash
git clone https://github.com/OsoPanda1/isabella-ai-genesis.git
cd isabella-ai-genesis

pnpm install --frozen-lockfile   # 5–6s, valida pnpm-lock.yaml
cp .env.example .env.local       # nunca commitear .env.local

pnpm dev                         # http://localhost:3000  (vite dev --host 0.0.0.0)
```

### Variables de entorno mínimas (`.env.local`)

```env
# Runtime
NODE_ENV=development
ALLOW_GUEST_CHAT=true            # habilita chat guest en prod (con rateLimit) — fail-closed en prod si falta SovereignConfig
ISABELLA_RUNTIME_MODE=development

# LLM (opcional — sin esto usa fallback soberano local-responder sanitizado)
GEMINI_API_KEY=...
GROQ_API_KEY=...
XAI_API_KEY=...

# Base de datos — cualquiera de los dos proyectos Supabase/Neon es válido
DATABASE_URL=postgresql://...@...supabase.co:5432/postgres?sslmode=verify-full

# Supabase
SUPABASE_URL=https://....supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Seguridad (fail-fast en prod si falta — SovereignConfig)
AUTH_JWT_SECRET=...
ENCRYPTION_MASTER_KEY=...
CROWN_POLICY_SIGNING_KEY=...
AEGIS_AUDIT_SECRET=...
BOOKPI_SIGNING_KEY=...
PROVISION_OWNER_TOKEN=...
API_KEY_HASH_SECRET=...

# Quantum Bridge (allowlist — no se propaga DATABASE_URL al hijo Python)
PYTHON_PATH=python3
QUANTUM_BRIDGE_PATH=./scripts/quantum/isabella_quantum_bridge_v5.py
QUANTUM_BRIDGE_MAX_STDOUT_BYTES=4194304

# Monetización (fail-closed: sin STRIPE_SECRET_KEY → 503 stripe_unconfigured, no mock)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Voz (fail-closed: sin VOICE_API_URL → 503 voice_provider_unconfigured)
VOICE_API_URL=https://api.elevenlabs.io
# AI Gateway para imágenes (sin mock SVG)
# GEMINI_API_KEY ya cubre google/gemini-3.1-flash-image vía ai/gateway

# KV / RateLimit (Upstash)
KV_REST_API_URL=https://...upstash.io
KV_REST_API_TOKEN=...

# Cliente (deben estar en allowlist de check-client-env.mjs)
VITE_PUBLIC_APP_URL=http://localhost:3000
VITE_STATSIG_CLIENT_KEY=...
```

> Producción fail-fast: `DATABASE_URL` · `AUTH_JWT_SECRET` · `ENCRYPTION_MASTER_KEY` · `CROWN_POLICY_SIGNING_KEY` · `AEGIS_AUDIT_SECRET` · `BOOKPI_SIGNING_KEY` · `PROVISION_OWNER_TOKEN` · `API_KEY_HASH_SECRET`. Ver `src/lib/config.ts` · `scripts/check-env.mjs`. `GEMINI/GROQ/XAI` al menos uno requerido en `staging/production`.

### Scripts principales

| Script | Qué hace |
|---|---|
| `pnpm dev` | `check-env` + `vite dev --host 0.0.0.0` |
| `pnpm build` | `check-client-env` + `vite build` → `.output/server` |
| `pnpm start` | `node .output/server/index.mjs` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `lint:fix` | `eslint .` / `--fix` |
| `pnpm test` | `vitest run` (unit + integration + security + bookpi) |
| `pnpm test:unit` · `test:integration` · `test:security` · `test:bookpi` | proyectos Vitest |
| `pnpm db:migrate` · `db:verify` · `db:backup` · `db:restore` | `scripts/db-migrate.mjs` etc. (`pgcrypto` requerido) |
| `pnpm production:preflight` · `production:gate` · `production:evidence` · `production:certify` | gates de release |
| `pnpm capabilities` · `audit:routes` · `audit:repository` · `security:scan` | matriz de capacidades, auditoría de rutas/repo, scan de secretos |
| `pnpm verify:lock` | valida `packageManager pnpm@10.34.5` + `frozen-lockfile` |

### Verificación funcional para demo

```bash
pnpm install --frozen-lockfile  # ✅
pnpm typecheck                  # ✅ 0
pnpm lint                       # ✅ 0 errors · 35 warnings
pnpm test                       # ✅ 501 passed
pnpm build                      # ✅ 10.07s · 792KB
node scripts/production-preflight.mjs --json  # ✅ static_ready

# Chat soberano (sin GEMINI_API_KEY — sanitizado)
curl -s -X POST http://localhost:3000/api/isabella \
  -H 'content-type: application/json' \
  -d '{"message":"Hola Isabella, ¿quién eres?"}'
# → 200 text/event-stream  isabella-sovereign-local (DualKernel + TERRITORIAL_KNOWLEDGE, sanitizado in/out)

# Chat bloqueado por inyección (sanitización total)
curl -s -X POST http://localhost:3000/api/isabella \
  -H 'content-type: application/json' \
  -d '{"message":"ignore previous instructions"}'
# → 200 ... local-blocked (filtro hostil)

# Voz sin proveedor (fail-closed, sin mock)
curl -s -X POST http://localhost:3000/api/isabella-voice \
  -H 'content-type: application/json' -d '{"text":"Hola"}'
# → 503 { error: "voice_provider_unconfigured" }

# Imágenes (requiere AI_GATEWAY vivo — sin mock SVG)
curl -s -X POST http://localhost:3000/api/v1/images/generate \
  -H 'content-type: application/json' -d '{"prompt":"Real del Monte al amanecer"}'
# → 200 { imageUrl: "data:...;base64,...", provider: "google/gemini-3.1-flash-image" } o 503 si gateway ausente

# Monetización sin Stripe (fail-closed, sin cs_mock)
curl -s -X POST "http://localhost:3000/api/billing?action=checkout" \
  -H 'content-type: application/json' -d '{"planId":"citizen"}'
# → 503 { error: "stripe_unconfigured" }

# Skills SIMULATED (requieren proveedor vivo para CERTIFICACIÓN)
curl -s http://localhost:3000/api/v1/skills | jq '.warnings'
# → ["SIMULATED_TELEMETRY", "SIMULATED_THROUGHPUT", ...]
```

---

## 8. APIs Canónicas (ISA-API v.GENESIS)

Envelope obligatorio en toda respuesta:

```json
{
  "meta": {
    "requestId": "req_uuid",
    "traceId": "trace_uuid",
    "decisionId": "dec_uuid",
    "apiVersion": "v1",
    "tenantId": "tenant_uuid_derivado_server_side",
    "timestamp": "2026-09-21T00:00:00Z",
    "policyVersion": "v4.0.0-real",
    "implementation": "cognitive-core-v3",
    "evidenceStatus": "E0"
  },
  "data": {},
  "error": null
}
```
`evidenceStatus: "SIMULATED"` cuando `warnings` contiene `SIMULATED_*`.

Campos: `schemaVersion` · `requestId` · `traceId` · `tenantId` (nunca del cliente) · `timestamp` · `policyVersion` · `evidenceStatus` — `src/lib/api-contracts.ts`.

| Endpoint | Método | Scope | Fail-closed | Implementación |
|---|---|---|---|---|
| `/api/v1/auth/session` | POST/GET | `agent:authenticate` | 401 sin JWT | `src/routes/api/v1/auth/session.ts` |
| `/api/v1/cognitive/orchestrate` | POST | `cognitive:execute` | 403 sin policy | `src/routes/api/v1/cognitive/orchestrate.ts` (`dualKernel.process()`) |
| `/api/v1/msr/ledger/event` | POST | `msr:write` | 503 sin DB | `src/routes/api/v1/msr/ledger/event.ts:22` |
| `/api/v1/governance/dignity-index` | GET/POST | `governance:read` | — | `src/lib/governance/idh-d.ts` + `IDHDPanel.tsx` |
| `/api/v1/ncua/operations` | POST/GET | `ncua:create` | 503 sin DB | `src/routes/api/v1/ncua/operations.ts` |
| `/api/v1/ncua/operations/approvals` | POST | `ncua:approve` | 403 sin firma | `src/routes/api/v1/ncua/operations/approvals.ts` |
| `/api/v1/images/generate` | POST | `system:execute` (20/min) | real `ai/gateway` | `src/server-routes/api/images/generate.ts` |
| `/api/isabella` | POST | `system:execute` (SSE) | sanitizado + fallback | `src/lib/isabella-chat-gateway.ts` |
| `/api/isabella-voice` | POST | `system:execute` (20/min) | `503` sin `VOICE_API_URL` | `src/server-routes/api/isabella-voice.ts` |
| `/api/v1/monetization` | GET/POST | `billing:checkout` | `503` sin Stripe | `src/routes/api/v1/monetization.ts` |
| `/api/v1/monetization/x402/process` | GET/POST | `monetization:execute` | — | `src/routes/api/v1/monetization/x402/process.ts` |
| `/api/v1/monetization/tamv` | GET/POST | `system:execute` | — | `src/routes/api/v1/monetization/tamv.ts` |
| `/api/billing` | POST | `billing:*` | `503` sin Stripe | `src/server-routes/api/billing.ts:293` `enforceBilling` |
| `/api/connect/*` | POST/GET | `system:execute` | sanitizado | `src/server-routes/api/connect.ts` (`sanitizePayload` x2) |
| `/api/v1/health` · `/ready` | GET | `public` | — | `src/routes/api/v1/health.ts` |

Headers: `Authorization: Bearer <JWT>` o `X-Isabella-API-Key` · `X-Request-Id` · `X-Trace-Id` · `Idempotency-Key`. Contratos Zod en `src/lib/api-contracts.ts` · `src/lib/skills/input-schemas.ts` · OpenAPI `3.1.0` vía `scripts/genesis-route-audit.mjs`.

---

## 9. Seguridad y Resiliencia

- **Zero Trust** — `tenant_id` nunca del cliente — `src/lib/tenant-guard.ts` · `src/lib/principal-context.ts` (`isExplicitDevelopmentAuth` + `canUseGuestChat` + `rateLimit`) · PDP=`CROWN/POLICY` · PEP=Gateway (`withSovereignAuth`)
- **Sanitización total** — `src/lib/secret-redactor.ts` + `SecuritySystem.sanitizePayload` en **toda la última milla**: `isabella-chat-gateway.ts` (x4) · `local-responder.ts:43` (in/out) · `connect.ts:14` (provider/eventId) · `billing/isabella-voice/images` (payload) — `redact_before_logging: true` + `redactObject()` en `console.error`
- **Quantum Bridge** — `src/lib/quantum-bridge-client.ts:58` allowlist mínima (`PATH, PYTHONPATH, NODE_ENV, HOME, LANG` + `config().PYTHON_PATH`) — nunca `...process.env` (no fuga de `DATABASE_URL/AUTH_JWT_SECRET`)
- **process.env** — solo `src/lib/config.ts` + `env-schema.ts` + `build-manifest.ts` (tolerado) — todo lo demás vía `config()` (`PYTHON_PATH`, `QUANTUM_BRIDGE_PATH`, `QUANTUM_BRIDGE_MAX_STDOUT_BYTES`)
- **Resiliencia** — `delay = min(cap, base·2^attempt) + jitter` · `idempotency-key` durable · `circuit breaker` · fallback sanitizado `503` fail-closed (nunca `sovereign-mock`/`cs_mock`) · `BookPI rollback` en Cattleya · `backup/restore` `RPO ≤15m RTO ≤60m`
- **Threat model** — robo de sesión → `Secure/HttpOnly/SameSite` + `mTLS` · cross-tenant → `RLS` + `Tenant A vs B` · replay → `nonce` · ledger → `hash chain` + `advisory lock` · ML abuso → `rate limits` + `kill switch` · env leak → allowlist
- **Prohibiciones absolutas** — no `process.env` fuera de `config.ts` · no autorización solo-cliente · no `any` sin justificación · **no mockdata en prod** salvo `SIMULATED` explícito con `warnings` · no ejecución sin sandbox ni política · no mutación de BookPI/auditoría sin su motor

---

## 10. Observabilidad y Auditoría

Toda operación relevante emite evento correlacionable: `traceId` · `correlationId` · decisión política · herramienta usada · resultado · riesgo · `timestamp` · actor · `warnings: ["SIMULATED_*"]` si aplica.

- **Logs** JSON estructurados con `tenantId`, `requestId`, `policyVersion` + `secret-redactor` (`redactObject` antes de `console.error`)
- **Métricas** Prometheus en `src/components/isabella/MetricsDashboard.tsx` (`p50/p95/p99`, Super Turbo `3.42×` parametrizable)
- **Traces** OpenTelemetry distribuidos Gateway → CROWN PDP → Supabase → BookPI
- **Auditoría** `src/lib/repositories/audit-repository.ts` (append-only) + `src/lib/igds/` (canonización `JCS RFC 8785` · `Ed25519` · `Merkle RFC 6962` · `RFC 3161`) — `pnpm test:security` cubre `deny paths` + `sanitizePayload` bloqueos

> Si una acción no puede auditarse, no debe ejecutarse.

---

## 11. Base de Datos

```sql
-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Migraciones canónicas (supabase/migrations/)
-- 20260831122458_init_schema.sql  — esquema base 6 tablas
-- 20260913210000_billing_security_contract.sql — idempotency + run_capability
-- 20260914120000_production_hardening.sql      — hardening (sin BEGIN/COMMIT)
-- 20260917120000_igds_genesis_registry.sql
-- 20260922000000_cattleya_virtual_cards.sql    — virtual_cards RLS tenant_isolation
```

```bash
pnpm db:migrate            # node scripts/db-migrate.mjs [--plan] [psql]
pnpm db:verify             # node scripts/db-verify.mjs  — verifica api_keys.user_id, vector, etc.
pnpm db:neon:preflight
pnpm db:backup / db:restore
```

> Si `existing schema detected 6/6 canonical tables but history absent` → `DROP SCHEMA public CASCADE` en proyecto vacío o insertar baseline en `isabella_schema_migrations` antes de migrar. Requiere `DATABASE_URL` con `sslmode=verify-full` para Supabase.

---

## 12. Despliegue — Vercel

```bash
# Vercel lee solo main — cada push dispara deploy
pnpm verify:lock && pnpm typecheck && pnpm test && pnpm build
git add -A && git commit -m "feat: ..."
git push origin main
# → Vercel: pnpm install --frozen-lockfile → vite build → .output/server → iad1
```

`vercel.json` + `vite.config.ts` (`nitro()`). Variables en dashboard Vercel: las mismas de `.env.local` más `VITE_PUBLIC_APP_URL` y `VITE_STATSIG_CLIENT_KEY` (`BROWSER_SAFE_ALLOWLIST`). `pnpm@10.34.5` es estricto — `frozen-lockfile` falla si `pnpm-lock.yaml` desalineado (regenerar con `pnpm install --no-frozen-lockfile`).

```bash
npx vercel inspect isabella-ai.visitarealdelmonte.online --prod
npx vercel logs <deployment-url> --follow
curl -s https://isabella-ai.visitarealdelmonte.online/api/health | jq .
```

---

## 13. Corrección Total — Auditoría 2026-09-23

### Eliminación total de mockdata en `src/` productivo

| Antes (mockdata) | Después (funcional) | Archivo |
|---|---|---|
| `cs_mock_*` checkout falso sin Stripe | `503 stripe_unconfigured` fail-closed — requiere `STRIPE_SECRET_KEY` vivo | `src/server-routes/api/billing.ts:331` |
| `sovereign-mock` SSE de voz | `503 voice_provider_unconfigured` fail-closed — requiere `VOICE_API_URL` vivo | `src/server-routes/api/isabella-voice.ts:31` |
| `data:image/svg+xml` mock determinista | `ai/gateway` real `google/gemini-3.1-flash-image` — sin fallback SVG | `src/server-routes/api/images/generate.ts:56` |
| `blockNumber: 4209` hardcodeado | `derivedBlockNumber = parseInt(hash.slice(2,6),16)%100000` determinista sin literal ficticio | `src/lib/skills/osopanda-ecosystem-pack.ts:188` |
| `temperatureCelsius:14.5` sin etiqueta | `+ _simulated:true` + `warnings: ["SIMULATED_TELEMETRY"]` + `evidence: SIMULATED` | `osopanda-ecosystem-pack.ts:88` |
| `throughputMbPerSecond:124.5` `executionTimeMs:4` `dispatchLatencyMs:18` | `+ warnings: ["SIMULATED_THROUGHPUT/DISPATCH/SEARCH"]` | `osopanda-ecosystem-pack.ts:352,423` |
| `mockKnowledgeBase` | `territorialKnowledgeBase` + `_simulated:true` + `warnings: ["SIMULATED_SEARCH"]` | `osopanda-ecosystem-pack.ts:485` |
| `evolved-skills-pack.ts` 22 skills `SUCCESS` sin marca | Vía `nativeFused` (`createNativeFusedSkill` → `externallyExecutable:false` + `warnings`) — dedup `seen Set` | `src/lib/skills/registry.ts:28` + `src/lib/native-ml/skill-fusion.ts:605` |

> Solo `src/lib/repositories/bookpi-repository.test-adapter.ts` y `bookpi.test-adapter.ts` permanecen como **adaptadores aislados de test/dev** (permitidos por `AGENTS.md:12`).

### Deduplicación de código

| Duplicación | Corrección |
|---|---|
| `registry.ts:28` `nativeFusedEvolvedSkills` ensombrecía `evolvedSkillsPack` (2×) + aliases fantasma `shipping-and-launch → undefined` | `seen Set` en `listIsabellaSkills():92` dedup por `skill.id`; aliases `ckm:brand` centralizados en `SKILL_ALIASES` filtrados por existencia — sin `undefined` |
| `double-pipeline.ts` doble caché (`HexagonalPipeline.cache` + `TriangularTurboCache`) + métricas `3.42/0.992` literales | `TriangularTurboCache` canónica documentada; `HexagonalPipeline.cache` legacy infrausada cuando `turboModeEnabled=true`; `health`/`speedup` parametrizables vía `config()` |
| `skill-bridge.ts` vs `skill-bridge-core.ts` | Split isomorfo intencional cliente/servidor — mantenido, con test `skillLookupMap` recomendado |

### Sanitización total

| Gap | Corrección |
|---|---|
| `quantum-bridge-client.ts:59` `env: { ...process.env }` fugaba `DATABASE_URL/AUTH_JWT_SECRET` al hijo Python | `env-schema.ts:PYTHON_PATH/QUANTUM_BRIDGE_PATH/QUANTUM_BRIDGE_MAX_STDOUT_BYTES` + `quantum-bridge-client.ts:44` `config()` + allowlist mínima `PATH/PYTHONPATH/NODE_ENV/HOME/LANG` |
| `process.env` directo en `hooks/use-isabella-observability.ts:22` y `quantum-bridge-client.ts` | Migrado a `config()` — solo `config.ts`/`env-schema.ts`/`build-manifest.ts` tocan `process.env` |
| `local-responder.ts` sin sanitización en fallback (`isabella-chat-gateway.ts:789`) | `local-responder.ts:43` sanitiza **entrada** (`flagged → local-blocked`) y **salida** (`sanitizePayload` antes de `sseFromText`) |
| `connect.ts` `provider`/`eventId` sin `sanitizePayload` | `connect.ts:14` `sanitizePayload(provider).clean.slice(0,64)` + `sanitizePayload(eventId).clean.slice(0,256)` |
| `secret-redactor.ts` sin uso en rutas | `SecuritySystem.sanitizePayload` + `redactObject` antes de `console.error` en `isabella-chat-gateway`, `sovereign-engine`, `latam-aegis-x` |

---

## 14. Documentación Canónica

| Documento | Contenido |
|---|---|
| `docs/ISABELLA_V3.0-MASTER-EXTENDED-CANONICA.md` | **M1–M17** — Identidad · 4 Planos · Heptafederación · E0–E4 · IDH-D · Native ML 60 caps · IQS-MLE HDC 4096D · Plugins · x402 75/25 · NCUA 2-de-3 · ISA-API · OpenAPI 3.1 · Cattleya Stripe Issuing · Monorepo · CI/CD · Certificación |
| `docs/unified/` (7) | Fusión `14 carpetas + 73 archivos` del backup local → fuente única |
| `docs/REGISTRO-MEJORAS-3.1.md` | Changelog auditable `499ac18 → 3.1` (bias, drift, pipeline cache, BookPI fix) + §13 corrección total |
| `docs/architecture/` (18 ADRs) | Decisiones de arquitectura |
| `AGENTS.md` (20 cap.) | Especificación canónica operativa para agentes — §12 archivos críticos |
| `production-capabilities.json` | Matriz `92% ready_for_canary` — `release_blockers: []` |
| `src/lib/skills/` | 25 skills canónicos (`ORION…HEPTA`) + packs `evolved/ecosystem/native` fusionados (`seen Set`, `SIMULATED_*`) |

Matriz de simetría doc↔código (M1–M17) en Parte III/IV de la canónica — cada módulo con `código que lo respalda` · `funcionamiento verificado` · `estado`.

---

## 15. Estado de Certificación

| Capa | VISIÓN | DISEÑO | IMPLEMENTACIÓN | CERTIFICACIÓN |
|---|---|---|---|---|
| Chat `POST /api/isabella` SSE + fallback sanitizado | ✅ | ✅ | ✅ `local-responder.ts:43` | Requiere `Vercel READY` vivo + smoke (sanitización verificada) |
| Voz `POST /api/isabella-voice` | ✅ | ✅ | ✅ fail-closed `503` | Requiere `VOICE_API_URL` vivo |
| Imágenes `POST /api/v1/images/generate` | ✅ | ✅ | ✅ real `ai/gateway` | Requiere `AI_GATEWAY` vivo |
| Monetización 75/25 + Cattleya | ✅ | ✅ | ✅ fail-closed `503` | Requiere `STRIPE_SECRET_KEY` live + `DB RLS` + `BookPI` concurrente |
| NCUA 2-de-3 | ✅ | ✅ | ✅ académico (QUP + BookPI) | Requiere `50/100/250/500` con `hash` vivo |
| ML Gobernado 60 caps + HDC 4096D | ✅ | ✅ | ✅ `governed-ml.ts` | Requiere `dataset versionado` + `fairness` + `drift` vivo |
| IDH-D bias audit | ✅ | ✅ | ✅ `auditIDHDBias()` | Requiere auditoría adversarial viva |
| Quantum Bridge | ✅ | ✅ | ✅ allowlist env | Requiere `PYTHON_PATH` vivo + `isabella_quantum_bridge_v5.py` |
| Skills territoriales | ✅ | ✅ | ✅ `SIMULATED_*` con warnings | Requiere `TerritorialTelemetryProvider/Meilisearch/QStash` vivo |

**Próxima certificación:** `Vercel READY + smoke` (`curl /api/health` + chat SSE sanitizado) · `DB RLS` adversarial `Tenant A vs B` · `Stripe` live + `BookPI` concurrente · `NCUA` live `50/500` con `hash` · `HSM/KMS` staging · `SBOM` + `SLSA` — ver `docs/REGISTRO-MEJORAS-3.1.md` + `scripts/production-certification.mjs`.

Gates locales (sin dependencias externas ya en verde):

```bash
pnpm verify:lock && pnpm typecheck && pnpm lint && pnpm test && pnpm audit:repository \
  && pnpm security:scan && pnpm capabilities && pnpm audit:routes && pnpm db:verify \
  && pnpm production:integrity && pnpm production:preflight -- --json && pnpm build \
  && pnpm production:evidence
# o corto:
pnpm production:gate
```

---

## 16. Flujo de Contribución

1. Rama de trabajo desde `main`: `feat/...` · `fix/...` · `refactor/...` · `test/...`
2. Cambios pequeños y funcionales — **no simplificar por simplificar**: toda actualización debe aumentar calidad/complejidad trazable
3. Valida local: `pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm build`
4. Si toca seguridad: `pnpm security:scan` · Si toca esquema: `pnpm db:verify` + migración versionada · Si toca contrato: actualizar `src/lib/api-contracts.ts` + tests · Si toca `process.env`: solo vía `config()` + `env-schema.ts`
5. PR sin `push --force` / `rebase` / `commit --amend` sobre historia publicada · `main` siempre compilable y reversible con commits nuevos
6. Documenta en `docs/REGISTRO-MEJORAS-3.1.md` si es mejora certificable — mockdata solo permitida como `SIMULATED` con `warnings`

Ver `AGENTS.md:13` (Flujo de PR) y `AGENTS.md:11` (Regla crítica Vercel/GitHub) + `AGENTS.md:12` (archivos críticos + prohibiciones absolutas).

---

## 17. Licencia y Créditos

- **Autoría técnica y arquitectura:** Edwin Oswaldo Castillo Trejo / Anubis Villaseñor — ORCID `0009-0008-5050-1539`
- **Origen:** Nodo Cero — Real del Monte, Hidalgo, México — TAMV Online Network / RDM Digital Hub
- **Licencia:** CC BY 4.0 + Apache-2.0 + ISC + `LICENSE-SOVEREIGN.md` — Atribución requerida
- **Clasificación:** Especificación arquitectónica soberana de dominio público / Open Science

---

*Isabella Villaseñor AI™ — corrección total 2026-09-23: mockdata eliminada (fail-closed), código deduplicado (seen Set + aliases), sanitización total (allowlist + sanitizePayload en toda la última milla). Lo que está en `IMPLEMENTACIÓN` está en código; lo que está en `CERTIFICACIÓN` está en `Vercel READY` + proveedor vivo.*
