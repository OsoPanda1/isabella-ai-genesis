# DOCUMENTACIÓN OFICIAL Y CANÓNICA DE ISABELLA VILLASEÑOR AI™

## v3.0-MASTER-EXTENDED — Fusión Total del Proyecto

**Versión:** 3.0-MASTER-EXTENDED (Parte I + Parte II) + 3.1-HARDENED  
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

*Isabella Villaseñor AI™ v3.0-MASTER-EXTENDED es soberanía cognitiva territorial verificable: lo que está en `IMPLEMENTACIÓN` está en código; lo que está en `CERTIFICACIÓN` está en `Vercel READY`.*

**Licencia:** CC BY 4.0 — **Origen:** Real del Monte, Hidalgo — **Autoría:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) — ORCID `0009-0008-5050-1539`.
