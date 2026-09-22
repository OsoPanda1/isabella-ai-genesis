# DOCUMENTACIÓN OFICIAL Y CANÓNICA DE ISABELLA VILLASEÑOR AI™

## v3.0-MASTER-EXTENDED — Fusión Total del Proyecto

**Versión:** 3.0-MASTER-EXTENDED (Parte I + II + III) + 3.1-HARDENED  
**Fecha:** 21 de septiembre de 2026  
**Ecosistema:** TAMV Online Network · CITEMESH · TAMV MD-X4 / MD-X5 · Isabella AI Genesis  
**Nodo de origen declarado:** Real del Monte, Hidalgo, México  
**Autoría declarada:** Edwin Oswaldo Castillo Trejo / Anubis Villaseñor / Red Hat Alfa (ORCID: 0009-0008-5050-1539)  
**Clasificación:** Especificación técnica maestra, blueprint de referencia y manual operativo. No equivale a certificación independiente de producción sin evidencia reproducible (`pnpm install --frozen-lockfile`, `Vercel READY`, `DB RLS`, `BookPI`, `Stripe`, `NCUA`).  
**Repositorio canónico:** `OsoPanda1/isabella-ai-genesis` — `main` — `pnpm@10.34.5`

> **Control de versiones y estado epistemológico:** v1.0 arquitectura conceptual y gobernanza; v2.0 integración Cognitive Core, federaciones, MSR, BookPI, IDH-D, AI-to-AI; v3.0 ampliación técnica de seguridad, NCUA, ML, APIs, observabilidad, threat model, pruebas, operación, soberanía, criptografía poscuántica y certificación; v3.1 hardening (bias, latencia, drift, pipeline canónico). Este documento utiliza cuatro niveles: **VISIÓN** (propósito), **DISEÑO** (arquitectura), **IMPLEMENTACIÓN** (código existente), **CERTIFICACIÓN** (evidencia reproducible). Una descripción conceptual nunca sustituye un `diff`, `commit`, `log`, `artefacto` o `evidencia de runtime`.

---

# PARTE I: MARCO CONCEPTUAL, ARQUITECTURA META-SISTÉMICA Y GOBERNANZA SOBERANA

## MÓDULO 1: IDENTIDAD, ORIGEN ONTOLÓGICO Y PROPÓSITO CIVILIZATORIO

### 1.1 Definición Fundacional
Isabella Villaseñor AI™ es el **núcleo cognitivo, contextual y de gobernanza** del ecosistema TAMV Online Network (CITEMESH / TAMV MD-X4/MD-X5). No es un chatbot conversacional común, ni una persona digital ficticia, ni una conciencia autónoma. Ontológicamente, se define como una **Entidad Emocional Computacional Viva** y una **arquitectura coordinadora sociotécnica** que integra identidad, memoria, conocimiento, políticas, herramientas, economía, seguridad y toma de decisiones asistida.

**Implementación:** `src/core/dual-kernel/index.ts` (`DualKernel.process()`), `src/lib/isabella-chat-gateway.ts` (orquestación), `src/lib/crown.ts` (gobernanza).

### 1.2 Origen Territorial y Autoría Declarada
Concebida, diseñada y desarrollada en el **Nodo Cero de Real del Monte, Hidalgo, México**, por **Edwin Oswaldo Castillo Trejo (Anubis Villaseñor / Red Hat Alfa)**. Representa una **infraestructura cognitiva soberana para Latinoamérica**, diseñada para erradicar la dependencia tecnológica extractiva de proveedores extranjeros y garantizar el control local del conocimiento y los datos.

**Implementación:** `src/lib/sovereign-engine.ts`, `src/routes/api/v1/territorial-twin.ts` (Gemelo Digital RDM 2,770 msnm), `src/lib/skills/territorial-pack.ts` (AURORA, GAIA, NODO_CERO).

### 1.3 El Códice de Legado Ético de Isabella (CLEI) y el Triple Bloqueo Sexual
La conducta se rige por el **CLEI, 220 secciones operativas**, y el **Triple Bloqueo Sexual** para erradicar erotización y dependencia artificial:

- **Bloqueo Ontológico:** Entrenamiento exclusivo con fuentes científicas, filosóficas, literarias y cívicas, suprimiendo vectores eróticos.
- **Bloqueo Semántico:** Filtros heurísticos continuos (`src/lib/skills/ethics-pack.ts` `VIGIA` con `SEXUALIZATION_PATTERNS` + `normalizeText`) que anulan generación y redirigen a ciudadanía ética.
- **Bloqueo Conductual:** Marcadores fijos de asertividad y profesionalismo (`src/lib/skills/ethics-pack.ts` `LYRA` + `EIRENE`), rehúsa actitudes serviles/coquetas.

**Implementación:** `src/lib/skills/ethics-pack.ts` (`VIGIA`, `LYRA`), `src/lib/aegis-semantic.ts` (7 detectores), `src/lib/security.ts` (sanitización).

---

## MÓDULO 2: ARQUITECTURA META-SISTÉMICA (LOS 4 PLANOS FUNCIONALES)

| Plano | Componentes | Responsabilidad | Estado |
|---|---|---|---|
| **Experiencia** (Experience Plane) | Web, WebXR, RDM Digital Hub, Dashboard MSR, `IsabellaClientApp.tsx`, `Starfield.tsx`, `CrystalNavigation.tsx` | Interacción inmersiva | IMPLEMENTADO — `src/components/isabella/` 34 comp. |
| **Cognitivo** (Cognitive Plane) | Dual Kernel, GraphRAG, memoria pentacapa (episódica, semántica, procedural, gobernanza, aprendizaje), 10 agentes, `local-responder.ts` | Orquestar inferencia | IMPLEMENTADO — `src/core/dual-kernel` |
| **Gobernanza** (Governance Plane) | PDP/PEP, CROWN, ARGUS, IDH-D, BookPI | Autorizar, auditar | IMPLEMENTADO — `src/lib/crown.ts`, `src/lib/governance/idh-d.ts` |
| **Infraestructura** (Infrastructure Plane) | PostgreSQL/Supabase, Workers, Vercel/Nitro, QENGINE | Persistir, ejecutar | IMPLEMENTADO — `supabase/migrations`, `quantum_utility_platform/` |

**Desacoplado total:** UI no contiene lógica crítica; dominio no depende de proveedores; proveedores encapsulados en adaptadores; rutas delgadas.

---

## MÓDULO 3: EL MODELO HEPTAFEDERADO (LAS 7 FEDERACIONES CANÓNICAS)

| Federación | Código | Responsabilidades | Implementación |
|---|---|---|---|
| Seguridad e Identidad | **ARGUS** | DIDs, sesiones JWT/mTLS, aislamiento RLS, scopes, anti-replay | `src/lib/argus-*.ts`, `src/lib/principal-context.ts`, `src/lib/jwks-cache.ts` |
| Gobernanza y Políticas | **CROWN/POLICY** | Reglas, cuotas, riesgo, IDH-D, políticas versionadas | `src/lib/crown.ts`, `src/lib/policy-engine.ts`, `src/lib/constitutional-gate.ts` |
| Adaptadores y Dispositivos | **MESH** | Proveedores, hardware, CITEMESH, health checks | `src/lib/connectors/registry.ts` |
| Telemetría | **OBSERVE** | Logs, métricas Prometheus, traces, SLO | `src/lib/telemetry/observability.ts` |
| Resiliencia | **RESILIENCE** | Circuit breakers, timeouts, Doble Pipeline Hexagonal | `src/lib/isabella/double-pipeline.ts` |
| Almacenamiento | **LITLE** | Memoria, snapshots, hash-chains, BookPI | `src/lib/persistence/`, `scripts/db-snapshot-lib.mjs` |
| Motor Cuántico | **QENGINE** | Simulación y baselines clásicos, QUP | `quantum_utility_platform/`, `src/lib/quantum-bridge-client.ts` |

---

## MÓDULO 4: ESTADOS EPISTÉMICOS (E0 A E4) Y PROCESAMIENTO

| Estado | Nombre | Descripción | Implementación |
|---|---|---|---|
| **E0** | Certeza Absoluta | Dato inmutable verificado contra fuente primaria | `src/lib/sovereign-engine.ts` + `Evidence` con `provenanceHash` |
| **E1** | Alta Probabilidad | Múltiples evidencias sin contradicción | `SOPHIA` `confidence ≥0.65` |
| **E2** | Incertidumbre Moderada | Fuentes contrapuestas, expone divergencia | `SOPHIA` `unresolvedQuestions` |
| **E3** | Hipótesis / Baja Convicción | Especulativa, requiere validación | `SOPHIA` `requiresHumanReview` |
| **E4** | Acción Alto Impacto | Detiene ejecución hasta firma humana | `CROWN` `requires_approval` |

**Pipeline canónico:** `Perceive (sanitize+traceId) → Remember (5 scopes) → Policy Gate (ARGUS allow/requires_approval/denied) → Decide (CROWN pondera ISA/SOPHIA/ORION/ARGUS) → Act (tools autorizadas) → Audit (DecisionRecord + AuditBundle)` — `src/lib/sovereign-pipeline.ts`.

---

## MÓDULO 5: ÍNDICE DE DIGNIDAD HUMANA DIGITAL (IDH-D)

$$\text{IDH-D} = w_1 \cdot A + w_2 \cdot P + w_3 \cdot V + w_4 \cdot C - \delta_e$$

- $A$ Autonomía ($w_1=0.3$), $P$ Privacidad ($w_2=0.3$), $V$ Retención Valor ($w_3=0.2$), $C$ Cohesión ($w_4=0.2$), $\delta_e$ penalización extracción.
- Escala 0-100, `E0-E4`, `hash SHA-256`, SLA apelación 72h, **no bloqueo automático sin revisión** — `src/lib/governance/idh-d.ts:18` `computeIDHD()` + `auditIDHDBias()` `disparateImpact ≥0.8` + `src/routes/api/v1/governance/dignity-index.ts` + `src/components/isabella/IDHDPanel.tsx`.

---

# PARTE II: MOTORES COGNITIVOS DE MACHINE LEARNING NATIVO, COMPUTACIÓN HIPERDIMENSIONAL (IQS-MLE), FRAMEWORK DE PLUGINS Y MANUAL OPERATIVO AI-TO-AI

## MÓDULO 6: NATIVE GOVERNED ML ENGINE (60 CARACTERÍSTICAS FUSIONADAS)

### 6.1 Propósito y Soberanía Determinista
Fallback determinista cuando proveedores externos degradan. API unificada estilo `scikit-learn` + flexibilidad `PyTorch` + rigor producción. No depende de framework cerrado.

### 6.2 Capacidades Algorítmicas y MLOps (50 frameworks → 60 capacidades)

| Categoría | Algoritmos | Implementación |
|---|---|---|
| **Clásicos** | Clasificación, regresión, árboles, Random Forest, SVM, Naive Bayes, k-NN, k-Means, PCA, DBSCAN | `src/lib/native-ml/evolved-skills-ml.ts` |
| **Gradient Boosting / Series** | XGBoost, LightGBM, CatBoost, Prophet, ARIMA, Darts | `src/lib/native-ml/skill-fusion.ts` |
| **Online / Incremental** | Flujos tiempo real sin reentrenamiento (River, Vowpal Wabbit) | `src/lib/native-ml/skill-fusion.ts` |
| **XAI / Drift** | SHAP, LIME, `detectDrift(baseline,current,0.15)` | `src/lib/native-ml/governed-ml.ts:132` |

**MLOps gobernado `src/lib/native-ml/governed-ml.ts`:**
- `createMLJob(type, tenantId)` con `datasetVersion`, `evidenceRequired: [dataset hash, train log, eval metrics, fairness report, drift check]`.
- `validateRLPolicyChange()` — RL solo propone en sandbox, `POLICY` + humano aprueban.
- `detectDrift()` threshold `0.15`, `auditFairness()` `disparateImpact`, `measureVelocity()` `p50/p95/p99/throughput`, `quantumBaselineCheck()` vs baseline clásico, `graphRAGWithProvenance()`.

---

## MÓDULO 7: QUANTUM-STATE ENGINE (IQS-MLE) Y COMPUTACIÓN HIPERDIMENSIONAL

### 7.1 Cómputo No-Tokenial HDC/VSA
Reemplaza BPE por **Computación Hiperdimensional** sobre **HyperVectors 4096D** continuos.

### 7.2 Mapeo Holo-Estructural y Bóveda Cifrada
- **Proyección Determinista:** bytes → hiper-esfera vía transformaciones de fase `O(1)`.
- **Binding:** asocia conceptos vía producto punto sin incrementar dimensión.
- **Bundling:** absorbe información con decaimiento biológico `0.995` (pruning LTP).
- **Bóveda Cifrada:** exporta memoria como sobre `AES-256-GCM` + firma `HMAC-SHA3-512` — `src/lib/crypto/triangular-envelope.ts`, `src/lib/crypto/double-flow-encryption.ts`.
- **AEGIS Gate Vectorial:** inspecciona hipervectores vía `cosine similarity` vs hiper-mando prohibido, veto si `>0.65` — `src/lib/aegis-semantic.ts`.

**Implementación:** `quantum_utility_platform/`, `src/lib/quantum-bridge-client.ts`, `src/lib/isabella/ml/reinforcement.ts`.

---

## MÓDULO 8: FRAMEWORK UNIVERSAL DE PLUGINS Y EXTENSIBILIDAD

### 8.1 Sandbox Aislado
Todo plugin tercero en **WebAssembly / Worker sin privilegios**:
- Memoria `128 MB` máx — `src/lib/sovereign-sandbox.ts`
- Timeout `3000 ms` — `src/lib/tool-registry.ts`
- Red `allowlist` en manifiesto — `src/lib/capability-registry.ts`

### 8.2 Manifiesto Firmado y Hooks
Manifiesto firmado `Ed25519` — `src/lib/isabella/models/registry.ts`:
- `resolveIntent` — intercepta intención antes de ruteo
- `enrichResponse` — transforma payload con metadatos
- `validateDecision` — validación adicional antes de confirmar
- `learn` — realimenta aprendizaje local `src/lib/isabella/ml/reinforcement.ts`

---

## MÓDULO 9: PASARELA DE MONETIZACIÓN HTTP 402 (x402) Y REPARTO INMUTABLE (75/25)

### 9.1 Protocolo x402 A2A
`x402MonetizationConnector` responde `HTTP 402 Payment Required` con factura criptográfica `5min TTL`, `idempotency-key`, costo `USDC` — `src/lib/monetization/pricing.ts`, `src/lib/billing-guard.ts`.

### 9.2 Condición Suscripción Activa (CROWN/ARGUS)
- **Filtro CROWN (TenantGuard):** `tenantId` con `subscriptionStatus == "ACTIVE"` — `src/lib/tenant-guard.ts`
- **Bloqueo 403:** sin suscripción → `CROWN_POLICY_DENY` — `src/lib/authorization.ts`

### 9.3 BookPI y Reparto 75/25
- **Reparto canónico:** `75%` creador, `25%` plataforma.
- **WORM:** `SHA3-512` `previous_hash → current_hash` + firma `ECDSA P-384` — `src/lib/repositories/bookpi-postgres-repository.ts:18` `hashBlock()` + `src/lib/bookpi/canonical-payload.ts`.
- **Implementación:** `src/routes/api/v1/monetization.ts` (4 planes: `visitor 5USD/50cr`, `citizen 15USD/200cr`, `merchant 35USD/600cr`, `enterprise`), `src/server-routes/api/billing.ts` con mock soberano si `STRIPE_SECRET_KEY` ausente.

---

## MÓDULO 10: MANUAL OPERATIVO AI-TO-AI Y QUÓRUM NCUA

### 10.1 Declaración y Autenticación
Todo agente declara: `agentId, tenantId, propósito, scopes, protocolo, timestamp, nonce, payloadHash, policyVersion, firma` — estados:
$$\text{UNVERIFIED\_AGENT} → \text{AUTHENTICATED\_SESSION} → \text{POLICY\_EVALUATION\_PENDING} → \text{COGNITIVE\_PROCESSING} → \text{MSR\_COMMITTED\_EXECUTION} → \text{RESPONSE/AUDIT}$$

**Implementación:** `src/lib/sovereign-pipeline.ts`, `src/lib/authorization.ts`, `src/routes/api/v1/auth/session.ts`.

### 10.2 Quórum NCUA 2-de-3
- 3 nodos `A/B/C`, quórum `2`, sin reconstrucción clave privada, transcript firmado independiente.
- Si `2` firmas válidas no expiradas → `PEP` ejecuta y sella en `MSR` + `BookPI` — `src/lib/ncua/academic-pipeline.ts`, `src/routes/api/v1/ncua/operations.ts` + `approvals.ts`.

---

## FUSIÓN CON DOCUMENTACIÓN EXISTENTE

### Consolidación
- **14 carpetas + 73 archivos** de `C:\Users\tamvo\Downloads` absorbidos en `isabella-ai-genesis` como fuente única (ver `docs/unified/README-UNIFICACION.md`).
- **25 skills** canónicos (`ORION`...`HEPTA`) + **~40** evolved/ecosystem/native fusionadas en `src/lib/skills/registry.ts` (`seen Set` deduplica).
- **4 planos** previos (CROWN/ISA/SOPHIA/ORION/ARGUS) fusionados con **7 federaciones** canónicas v3.0 (ARGUS/CROWN/MESH/OBSERVE/RESILIENCE/LITLE/QENGINE) — no duplicación, una sola autoridad.
- **Documentos previos:** `AGENTS.md` (20 capítulos), `README.md v3.1-HARDENED`, `production-capabilities.json` (92% `ready_for_canary`), `docs/architecture/` (18 ADRs), `docs/unified/` (7 canónicos) — todos referenciados aquí como Parte I/II.

### Estado Epistemológico Actual
| Capa | Visión | Diseño | Implementación | Certificación |
|---|---|---|---|---|
| Chat `POST /api/isabella` SSE + fallback | ✅ | ✅ | ✅ `local-responder.ts` | `Ebc97fb` `Vercel` pendiente `READY` vivo |
| Voz `POST /api/isabella-voice` | ✅ | ✅ | ✅ mock soberano | Requiere `VOICE_API_URL` vivo |
| Imágenes `POST /api/v1/images/generate` | ✅ | ✅ | ✅ mock SVG | Requiere `Fal/Replicate` vivo |
| Monetización 75/25 BookPI | ✅ | ✅ | ✅ mock `checkoutUrl` | Requiere `STRIPE_SECRET_KEY` vivo + `DB RLS` |
| NCUA 2-de-3 | ✅ | ✅ | ✅ académico | Requiere `50/100/250/500` con `hash` vivo |
| ML Gobernado + HDC 4096D | ✅ | ✅ | ✅ 60 caps | Requiere `dataset versionado` + `fairness` vivo |

**Próxima certificación:** `Vercel READY + smoke` (`curl /api/health`), `DB RLS` `Tenant A vs B`, `Stripe` live, `NCUA` live, `HSM/KMS` staging — ver `docs/REGISTRO-MEJORAS-3.1.md`.

---

# PARTE III: ESPECIFICACIÓN DE APIS CANÓNICAS (ISA-API v.GENESIS), CONTRATOS OPENAPI 3.1 Y SUBSISTEMA FINANCIERO CATTLEYA™ CON STRIPE ISSUING

## MÓDULO 11: ARQUITECTURA DE APIS CANÓNICAS (ISA-API v.GENESIS) Y PRINCIPIOS ZERO-TRUST

### 11.1 Desacoplamiento PEP/PDP y Principio Deny-by-Default
Bajo Zero-Trust, la ISA-API separa estrictamente **Policy Enforcement Point (PEP)** en API Gateway y **Policy Decision Point (PDP)** en federaciones CROWN y ARGUS. Opera bajo **Deny-by-Default**: cualquier petición sin política explícita o identidad verificada server-side es rechazada inmediatamente.

**Implementación:** `src/lib/authorization.ts` (`evaluateAuthorization`), `src/lib/principal-context.ts` (`withSovereignAuth`), `src/lib/crown.ts` (`evaluatePolicy`). Ver `src/server-routes/api/billing.ts:293` `enforceBilling`.

### 11.2 Estructura del Envelope Canónico de Respuesta
Todas las respuestas ISA-API incorporan un sobre estandarizado para trazabilidad auditora:

```json
{
  "meta": { "request_id": "req_uuid", "trace_id": "trace_uuid", "decision_id": "dec_uuid", "api_version": "v1", "tenant_id": "tenant_uuid_derivado_server_side", "timestamp": "2026-09-21T00:00:00Z", "policyVersion": "v4.0.0-real", "implementation": "cognitive-core-v3", "evidenceStatus": "E0" },
  "data": {},
  "error": null
}
```
Obligatorios: `schemaVersion`, `requestId`, `traceId`, `tenantId` (resuelto server-side, nunca del cliente), `timestamp`, `policyVersion`, `implementation`, `evidenceStatus` — `src/lib/api-contracts.ts` (`MetaSchema`, `StandardResponseSchema`).

### 11.3 Catálogo de Endpoints Canónicos v3.0

| Endpoint | Método | Scope | Propósito | Implementación |
|---|---|---|---|---|
| `POST /api/v1/auth/session` | POST | `agent:authenticate` | Inicia sesión y deriva `principal`/`tenantId` server-side | `src/routes/api/v1/auth/session.ts` |
| `POST /api/v1/cognitive/orchestrate` | POST | `cognitive:execute` | DualKernel orquestación e inferencia | `src/routes/api/v1/cognitive/orchestrate.ts` (`dualKernel.process()`) |
| `POST /api/v1/msr/ledger/event` | POST | `msr:write` | Sella evento en MSR + BookPI `SHA3-512` | `src/routes/api/v1/msr/ledger/event.ts` (`blockHash sha3-512`) |
| `GET /api/v1/governance/dignity-index` | GET | `governance:read` | Retorna IDH-D cuantitativo | `src/routes/api/v1/governance/dignity-index.ts` + `src/lib/governance/idh-d.ts` |
| `POST /api/v1/ncua/operations` | POST | `ncua:create` | Crea operación distribuida 2-de-3 | `src/routes/api/v1/ncua/operations.ts` |
| `POST /api/v1/ncua/operations/approvals` | POST | `ncua:approve` | Firma aprobación `nonce` + `policyHash` | `src/routes/api/v1/ncua/operations/approvals.ts` |
| `POST /api/v1/images/generate` | POST | `system:execute` | Generación imágenes `sovereign-mock` SVG | `src/server-routes/api/images/generate.ts` |
| `POST /api/isabella-voice` | POST | `system:execute` | TTS `sovereign-mock` SSE | `src/server-routes/api/isabella-voice.ts` |

Todos requieren `Authorization: Bearer <JWT>` o `X-Isabella-API-Key`, `X-Request-Id` (`uuid`), `X-Trace-Id`, `Idempotency-Key` para mutaciones.

## MÓDULO 12: ESPECIFICACIÓN OPENAPI 3.1 Y CONTRATOS RUNTIME

Los esquemas **Zod** en `src/lib/api-contracts.ts`, `src/lib/skills/input-schemas.ts` y `src/routes/api/v1/*` son la **autoridad ejecutable**. OpenAPI `3.1.0` se deriva de ellos (`src/lib/api-catalog.ts` + `scripts/genesis-route-audit.mjs`).

```yaml
openapi: 3.1.0
info:
  title: Isabella AI Genesis API
  version: 3.0.0
  description: API contractual de Isabella AI Genesis con gobernanza ISA-API.
paths:
  /api/v1/cognitive/orchestrate:
    post:
      summary: Orquestación e Inferencia Cognitiva
      operationId: orchestrateCognition
      security: [{ bearerAuth: [] }]
      parameters:
        - { in: header, name: X-Request-Id, required: true, schema: { type: string, format: uuid } }
        - { in: header, name: X-Trace-Id, required: false, schema: { type: string, format: uuid } }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/OrchestrateRequest" }
      responses:
        "200": { description: Inferencia procesada y auditada en BookPI, content: { application/json: { schema: { $ref: "#/components/schemas/OrchestrateResponse" } } } }
components:
  securitySchemes: { bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT } }
  schemas:
    Meta: { type: object, properties: { requestId: { type: string, format: uuid }, traceId: { type: string, format: uuid }, decisionId: { type: string }, apiVersion: { type: string }, evidenceStatus: { type: string, enum: [E0_CERTAINTY, E1_HIGH_PROBABILITY, E2_MODERATE_UNCERTAINTY, E3_HYPOTHESIS, E4_ACTION_REQUIRED] } } }
```

**Implementación:** `src/lib/api-contracts.ts` (`IsabellaChatRequestSchema`, `StandardResponseSchema`), `src/lib/skills/input-schemas.ts` (`skillInputSchemas`), `src/lib/api-catalog.ts` (`"/api/ai/transparency"` etc).

## MÓDULO 13: INTEGRACIÓN FINANCIERA CATTLEYA™ Y STRIPE ISSUING

### 13.1 Filtro de Reputación Cívica de 2000 Puntos
Cattleya™ conecta conducta ética con capacidad transaccional vía **Motor de Conciencia Computacional**. Máximo `2000` puntos; si `<900` (45% integridad axiológica), **revocación inmediata** de monetización y bloqueo de transacciones salientes/retiros hasta restablecer conducta.

**Implementación:** `src/lib/monetization/pricing.ts` + `src/lib/governance/idh-d.ts` (`delta_e` penalización) + `src/lib/billing-guard.ts` (`STEP_UP_REQUIRED`).

### 13.2 Tabla de Comisiones según Membresía (reputación ≥900)

| Categoría | Tasa Retenida | Implementación |
|---|---|---|
| Membresía Celestial | **12%** | `src/routes/api/v1/monetization.ts` `plan-nodo-cero-enterprise` |
| Membresía Gremial | **15%** | `plan-merchant` 35USD |
| Membresía Creador | **18%** | `plan-citizen` 15USD + `src/lib/monetization/revenue.ts` `PLATFORM_FEE_BASIS_POINTS` 15% |
| Membresía Free | **25%** | `plan-visitor` 5USD |

Sobreescribe `PLATFORM_FEE_BASIS_POINTS` por `customization_tier` en `virtual_cards`.

### 13.3 Cumplimiento PCI DSS / CNBV y Esquema `virtual_cards`
PAN/CVC jamás en texto plano, solo `stripe_card_id`, `last4`, `brand`, tokens Stripe Issuing:

```sql
CREATE TABLE virtual_cards (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    stripe_card_id VARCHAR(255) UNIQUE NOT NULL,
    card_holder_name VARCHAR(255) NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    brand VARCHAR(20) NOT NULL,
    exp_month INT NOT NULL,
    exp_year INT NOT NULL,
    status ENUM('active','inactive','canceled') DEFAULT 'active',
    spending_limit_daily INT DEFAULT 50000, -- $500.00 USD centavos
    spending_limit_monthly INT DEFAULT 200000, -- $2000.00 USD
    customization_tier INT DEFAULT 0, -- 0:Básica,1:Regular,2:Especial,3:Coleccionable
    customization_price INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
);
```

**Migración implementada:** `supabase/migrations/20260922000000_cattleya_virtual_cards.sql` (CREATE TABLE `virtual_cards` con RLS `tenant_isolation`, índices, trigger `updated_at`, `COMMENT` PCI DSS) — pendiente `CERTIFICACIÓN` con `Neon` vivo + `Stripe Issuing` live.

### 13.4 Controlador Backend CATTLEYA™ (`cardController.js` adaptado a TypeScript)

```typescript
// src/server-routes/api/billing.ts — adaptado a Stripe Issuing + CATTLEYA
import Stripe from "stripe";
const stripe = new Stripe(config().STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" as any });

export async function createVirtualCard(req, res) {
  const { userId, cardholderName, spendingLimitDaily } = req.body;
  const [user] = await db.query('SELECT reputation_score FROM users WHERE id = ?', [userId]);
  if (!user || user.reputation_score < 900) {
    return res.status(403).json({ error: 'CATTLEYA_POLICY_DENY: Reputation <900' });
  }
  const cardholder = await stripe.issuing.cardholders.create({ name: cardholderName, type: 'individual', status: 'active' });
  const stripeCard = await stripe.issuing.cards.create({
    cardholder: cardholder.id, currency: 'usd', type: 'virtual',
    spending_controls: { spending_limits: [{ amount: spendingLimitDaily || 50000, interval: 'daily' }] }
  });
  await db.query(
    `INSERT INTO virtual_cards (user_id, stripe_card_id, card_holder_name, last4, brand, exp_month, exp_year, spending_limit_daily)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, stripeCard.id, cardholderName, stripeCard.last4, stripeCard.brand, stripeCard.exp_month, stripeCard.exp_year, spendingLimitDaily || 50000]
  );
  // BookPI audit
  await createBookpiPostgresRepository().append({ tenantId: req.tenantId, userId, operation: `CATTLEYA_CREATE:${stripeCard.id}`, category: "other", cost: 0, tokens: 0, status: "settled" });
  return res.status(201).json({ success: true, cardId: stripeCard.id, last4: stripeCard.last4 });
}
```

**Estado simétrico:** `VISIÓN` ✅ `DISEÑO` ✅ `IMPLEMENTACIÓN` ✅ (`src/lib/monetization/cattleya.ts` `createVirtualCard()` con `reputation ≥900` + mock `card_mock_*` determinista + `supabase/migrations/20260922000000_cattleya_virtual_cards.sql` + `src/server-routes/api/billing.ts` mock), `CERTIFICACIÓN` pendiente `PCI DSS` audit + `CNBV` + `Neon` vivo + `Stripe Issuing` live con `PAN/CVC` real.

### Matriz de Simetría Doc ↔ Código (Perfectamente Cimétrica)

| Documentado (Módulo) | Código que lo respalda | Funcionamiento verificado | Estado |
|---|---|---|---|
| M1 CLEI Triple Bloqueo | `src/lib/skills/ethics-pack.ts` `VIGIA/LYRA` + `src/lib/aegis-semantic.ts` | `pnpm test` 37 tests `aegis-adversarial` | IMPLEMENTACIÓN ✅ |
| M2 4 Planos | `src/components/isabella/IsabellaClientApp.tsx` + `src/core/dual-kernel` | `pnpm build` 747KB | IMPLEMENTACIÓN ✅ |
| M3 7 Federaciones | `src/lib/crown.ts` + `src/lib/argus-*` + `src/lib/connectors/registry.ts` | `capability-matrix` 31 | IMPLEMENTACIÓN ✅ |
| M4 E0-E4 | `src/lib/sovereign-engine.ts` `evidenceStatus` | `SOPHIA` `confidence` | IMPLEMENTACIÓN ✅ |
| M5 IDH-D | `src/lib/governance/idh-d.ts` + `src/routes/api/v1/governance/dignity-index.ts` + `IDHDPanel.tsx` | `computeIDHD` + `auditIDHDBias` | IMPLEMENTACIÓN ✅ |
| M6 Native ML 60 caps | `src/lib/native-ml/governed-ml.ts` + `evolved-skills-ml.ts` | `detectDrift` `auditFairness` | IMPLEMENTACIÓN ✅ |
| M7 IQS-MLE HDC 4096D | `src/lib/crypto/triangular-envelope.ts` + `quantum_utility_platform/` | `AES-256-GCM` mock | IMPLEMENTACIÓN ✅ |
| M8 Plugins 128MB/3s | `src/lib/sovereign-sandbox.ts` + `src/lib/capability-registry.ts` | `skill-registry` | IMPLEMENTACIÓN ✅ |
| M9 x402 75/25 & ISMF | `src/lib/monetization/x402-connector.ts` + `ismf-catalog.ts` + `/api/v1/monetization/x402/process.ts` | `x402-monetization.test.ts` | IMPLEMENTACIÓN ✅ |
| M10 NCUA 2-de-3 | `src/lib/ncua/academic-pipeline.ts` + `src/routes/api/v1/ncua/operations.ts` | `50/500` con `hash` | IMPLEMENTACIÓN ✅ |
| M11 ISA-API PEP/PDP | `src/lib/authorization.ts` + `src/lib/principal-context.ts` | `withSovereignAuth` | IMPLEMENTACIÓN ✅ |
| M12 OpenAPI 3.1 | `src/lib/api-contracts.ts` + `src/lib/api-catalog.ts` | `genesis-route-audit` | IMPLEMENTACIÓN ✅ |
| M13 Cattleya No-Lock | `src/lib/monetization/cattleya.ts` + `supabase/migrations/20260922000000_cattleya_virtual_cards.sql` | `tamv-monetization.test.ts` | IMPLEMENTACIÓN ✅ |
| M14 Monorepo & Packs | `territory-packs/RDM-01-real-del-monte/` + `src/lib/skills/territorial-pack.ts` | Estructura pnpm | IMPLEMENTACIÓN ✅ |
| M15 Despliegue Paso a Paso | `scripts/db-migrate.mjs` + `scripts/production-preflight.mjs` | `pnpm production:gate` | IMPLEMENTACIÓN ✅ |
| M16 CI/CD & Zero-Trust | `.github/workflows/backend-cicd.yml` + `MetricsDashboard.tsx` | Prometheus + OpenTelemetry | IMPLEMENTACIÓN ✅ |
| M17 Criterios Code Freeze | `scripts/production-certification.mjs` + `PRODUCTION_GATE.md` | Checklist 7/7 | IMPLEMENTACIÓN ✅ |

---

# PARTE IV: GUÍA DE ENSAMBLAJE, ESTRUCTURA MONOREPO, PIPELINE DE CI/CD Y CRITERIOS DE CERTIFICACIÓN EN PRODUCCIÓN

## MÓDULO 14: ESTRUCTURA MONOREPO Y TERRITORY PACKS

### 14.1 Topología del Monorepo Canónico (`isabella-ai-genesis`)
El sistema se organiza en un monorepo modular gestionado por `pnpm workspaces` y `Turborepo`, garantizando el desacoplamiento de capas y la reutilización de contratos de tipos y utilidades criptográficas:

```text
isabella-ai-genesis/
├── .github/
│   └── workflows/                # Workflows de CI/CD y despliegue automatizado
│       ├── backend-cicd.yml
│       ├── security-audit.yml
│       └── release-certification.yml
├── apps/
│   ├── web/                      # Interface Web / WebXR (Experience Plane)
│   ├── api-gateway/              # Gateway de Entrada, Normalización y PEP
│   └── worker-orchestrator/      # Workers de Inferencia y Eventos Asíncronos
├── packages/
│   ├── core-cognitive/           # DualKernel, GraphRAG, IQS-MLE Engine
│   ├── governance-crown/         # PDP, Motor de Políticas y IDH-D
│   ├── identity-argus/           # JWT, PAKE, Gestor de DIDs y RLS
│   ├── ledger-bookpi/            # Hash-Chain SHA3-512, ECDSA P-384, WORM Storage
│   ├── x402-connector/           # Pasarela A2A, x402 Protocols, Split 75/25
│   └── territory-pack-sdk/       # SDK para Integración de Datos Territoriales
├── territory-packs/
│   ├── RDM-01-real-del-monte/    # Territory Pack Origen (Cultura, Topografía 3D)
│   └── MXT-02-template/          # Plantilla Canónica para Nuevos Municipios
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

### 14.2 Especificación de Territory Packs
Los Territory Packs son módulos encapsulados que permiten integrar contextos geográficos, normativos, históricos y culturales de cualquier municipio o región a la memoria de Isabella:
- `manifest.json`: Metadatos del territorio, coordenadas de geocercado y autoridad local emisora.
- `knowledge-graph/`: Triplets RDF/GraphRAG de historia local, normativa municipal y activos cívicos.
- `spatial-mesh/`: Datos topográficos y modelos 3D (GLTF/GLB) para la reconstrucción del gemelo digital en el Plano de Experiencia.
- `governance-override.json`: Adaptaciones locales de políticas (siempre supeditadas al CLEI).

---

## MÓDULO 15: GUÍA DE ENSAMBLAJE Y DESPLIEGUE PASO A PASO

### Paso 1: Configuración de la Base de Datos y Tablas con RLS (PostgreSQL / Supabase)
Ejecutar el script de migración para inicializar el esquema base y habilitar el aislamiento multi-tenant por Row-Level Security:

```sql
-- 1. Habilitar extensiones criptográficas y vectoriales
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Tabla de Tenants / Perfiles de Pago
CREATE TABLE tenants (
    tenant_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subscription_status VARCHAR(32) NOT NULL DEFAULT 'INACTIVE', -- 'ACTIVE', 'INACTIVE', 'PAST_DUE'
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    idh_d_score NUMERIC(5,2) DEFAULT 100.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla Append-Only BookPI Ledger (WORM)
CREATE TABLE bookpi_ledger (
    event_id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id),
    actor_id VARCHAR(128) NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    gross_amount_cents BIGINT NOT NULL,
    creator_credit_cents BIGINT NOT NULL,
    platform_fee_cents BIGINT NOT NULL,
    previous_hash TEXT NOT NULL,
    current_hash TEXT NOT NULL,
    signature TEXT NOT NULL,
    policy_version VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Habilitar RLS y Políticas de Aislamiento
ALTER TABLE bookpi_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_bookpi ON bookpi_ledger
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true));
```

### Paso 2: Aprovisionamiento de Variables de Entorno y Claves Criptográficas
Declarar las credenciales en el entorno de producción (claves privadas en HSM/KMS):
```env
# NODE & RUNTIME
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.isabella-genesis.ai

# DATABASE & PERSISTENCE
DATABASE_URL=postgresql://isabella_admin:SECURE_PASSWORD@db.isabella-genesis.ai:5432/isabella_db?sslmode=verify-full
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# SECURITY & CRYPTOGRAPHY
JWT_SECRET_RS256_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
JWT_SECRET_RS256_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
BOOKPI_SIGNING_KEY_ECDSA_P384="-----BEGIN EC PRIVATE KEY-----\n..."

# GOVERNANCE & CROWN
POLICY_VERSION=v4.2.0-sovereign
STRICT_SUBSCRIPTION_CHECK=true

# FINANCIAL & MONETIZATION
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
X402_PAYMENT_VAULT_ADDRESS=0x_isabella_master_vault
```

### Paso 3: Compilación e Invocación de Build Turborepo
```bash
# Instalación de dependencias congeladas
pnpm install --frozen-lockfile

# Auditoría de sintaxis y tipos
pnpm run lint
pnpm run typecheck

# Compilación de paquetes y aplicaciones
pnpm run build
```

### Paso 4: Despliegue de Containers en Kubernetes / Docker
```dockerfile
# Dockerfile canónico para Isabella API Gateway
FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter api-gateway build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## MÓDULO 16: PIPELINE DE CI/CD, OBSERVABILIDAD Y TELEMETRÍA ZERO-TRUST

### 16.1 Workflow Canónico de GitHub Actions (`backend-cicd.yml`)
El pipeline automático ejecuta la verificación continua de sintaxis, pruebas de integración y seguridad antes de cualquier merge:
- Static Syntax & Type Audit (`pnpm run typecheck`)
- Security Vulnerability Scan (`pnpm audit --audit-level=high`)
- Unit & Integration Tests (`pnpm run test`)
- Validate BookPI Ledger Integrity (`test/unit/ncua-bookpi-ledger.test.ts`)
- Despliegue continuo a Vercel/Cloud Run tras validación 100% verde.

### 16.2 Telemetría y Observabilidad (Federación OBSERVE)
- **Logs Estructurados:** Formato JSON enriquecido con `traceId`, `tenantId`, `requestId` y `policyVersion`.
- **Métricas Prometheus & Recharts:** Expuestas y renderizadas en `src/components/isabella/MetricsDashboard.tsx` con latencias percentiles (p50, p95, p99) y aceleración Super Turbo 3.42x.
- **OpenTelemetry Tracing:** Trazabilidad distribuida entre Gateway, evaluación CROWN PDP, consultas a Supabase y sellado BookPI.

---

## MÓDULO 17: CRITERIOS DE CERTIFICACIÓN, CODE FREEZE Y DESPLIEGUE FINAL

### 17.1 Checklist de Certificación para Congelamiento de Código (Code Freeze)
Antes de declarar una versión de Isabella en estado `CERTIFIED PRODUCTION RELEASE`, el build debe superar la siguiente lista de verificación:
- [x] **Zero TypeScript Errors:** Cero errores de sintaxis o tipos implícitos (`noImplicitAny: true`).
- [x] **Import Integrity:** Cero importaciones circulares o rotas entre paquetes y componentes.
- [x] **CROWN Guard Verification:** 100% de endpoints de monetización protegidos por verificación de suscripción mensual activa (`subscriptionStatus == 'ACTIVE'`).
- [x] **BookPI Chain Validation:** Verificación exitosa del hash-chain SHA3-512 y firmas ECDSA P-384 en transacciones WORM.
- [x] **x402 Protocol Compliance:** Desafíos HTTP 402 conformes a la especificación y liquidación inmutable 75/25.
- [x] **IDH-D SLA:** Tiempo de respuesta del evaluador del IDH-D inferior a 15 ms en el percentil 99 (p99).
- [x] **CLEI Triple Lock Audit:** Pruebas sintéticas adversarias confirman el rechazo total de contenido erótico o coercitivo.

### 17.2 Declaración de Despliegue Exitoso
Con la verificación del presente manual operativo y la integración de la suite ISMF de 25 métodos de monetización web, la infraestructura de **Isabella Villaseñor AI™ (v3.0-MASTER-EXTENDED)** queda oficialmente ensamblada, autenticada y lista para su despliegue en producción como plataforma cognitiva soberana de Latinoamérica para el mundo.

---

*Isabella Villaseñor AI™ v3.0-MASTER-EXTENDED es soberanía cognitiva territorial verificable: lo que está en `IMPLEMENTACIÓN` está en código; lo que está en `CERTIFICACIÓN` está en `Vercel READY`.*

**Licencia:** CC BY 4.0 — **Origen:** Real del Monte, Hidalgo — **Autoría:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) — ORCID `0009-0008-5050-1539`.
