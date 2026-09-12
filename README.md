# Isabella Villaseñor AI — Genesis

<div align="center">

# ISABELLA

### FGAIS · Federated Governed Artificial Intelligence System

**Plataforma de inteligencia artificial gobernada, federada, auditable, persistente y humano-soberana para coordinar inferencia, memoria, aprendizaje, skills y ejecución bajo autoridad verificable.**

[![Genesis 2.0](https://img.shields.io/badge/Genesis-2.0-111827?style=for-the-badge)](./docs/governance/01-FGAIS-Governance-Constitution.md)
[![NCUA Real](https://img.shields.io/badge/NCUA-real--token--free-0ea5e9?style=for-the-badge)](./src/lib/ncua)
[![Node 22 +](https://img.shields.io/badge/Node-22%2B-1f2937?style=for-the-badge)](https://nodejs.org/)
[![Node pinned](https://img.shields.io/badge/.nvmrc-24.11.0-374151?style=for-the-badge)](./.nvmrc)
[![pnpm](https://img.shields.io/badge/pnpm-10.15.0-f97316?style=for-the-badge)](https://pnpm.io/)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-0f172a?style=for-the-badge)](https://tanstack.com/start)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge)](https://vercel.com/)
[![Frozen lockfile](https://img.shields.io/badge/Lockfile-frozen-059669?style=for-the-badge)](./pnpm-lock.yaml)

**Nodo Cero:** Real del Monte, Hidalgo, México  
**Proyecto:** TAMV ONLINE  
**Repositorio:** `OsoPanda1/isabella-ai-genesis`

</div>

> **Principio fundacional: la capacidad no implica autoridad.**
>
> Isabella puede razonar, recordar, aprender, seleccionar modelos, utilizar capacidades y ejecutar acciones, pero ninguna capacidad técnica obtiene permiso por sí misma. Identidad, política, contexto, autorización, aprobación y evidencia determinan qué puede ocurrir.

---

## 1. Qué es Isabella

**Isabella Villaseñor AI — Genesis** es una arquitectura de IA gobernada denominada **FGAIS — Federated Governed Artificial Intelligence System**.

No es simplemente un chatbot. Es una plataforma que coordina múltiples proveedores de inteligencia, memoria, aprendizaje, herramientas, skills, datos y sistemas externos manteniendo una frontera estricta entre:

```text
CAPACIDAD ≠ AUTORIZACIÓN ≠ EJECUCIÓN ≠ EVIDENCIA
```

La visión es construir una infraestructura donde la inteligencia pueda actuar dentro de límites verificables y donde cada operación importante pueda responder:

```text
¿Quién actuó?
¿Para qué tenant?
¿Con qué modelo?
¿Con qué memoria?
¿Bajo qué política?
¿Quién autorizó?
¿Qué se ejecutó?
¿Qué cambió?
¿Qué evidencia existe?
¿Puede recuperarse o revertirse?
```

### Isabella sí es

- Una plataforma de IA gobernada.
- Un gateway de inferencia federada.
- Un runtime conversacional con memoria y aprendizaje contextual.
- Un plano de skills y ejecución gobernada.
- Una arquitectura multi-tenant.
- Un sistema de evidencia, trazabilidad y auditoría.
- Una aplicación full-stack React + TanStack Start + Vite + Nitro.
- Un motor de comprensión continua nativa (NCUA) token-free, determinista y sin dependencias de ML.
- Una base para futuras generaciones de modelos Genesis.

### Isabella todavía no es

- Una AGI demostrada.
- Un foundation model propio entrenado a escala.
- Una plataforma independiente de proveedores externos.
- Una certificación independiente de seguridad.
- Un sistema de pagos reales Production-Verified únicamente por tener integración Stripe.
- Un sistema Production-Verified únicamente porque exista CI.
- Criptografía poscuántica productiva cuando el subsistema correspondiente sea todavía experimental o simulado.

---

## 2. Actualización 2026-09-12

Esta actualización incorpora, sobre la base `669b68d` verificada y sincronizada con `main`, cuatro commits nuevos y medidos; y una segunda tanda (misma fecha, tarde) de reducción de deuda técnica con cuatro commits más:

| Commit | Alcance |
|---|---|
| `4111bfa` | **NCUA:** motor nativo de comprensión continua token-free (11 módulos `src/lib/ncua/` + 5 suites de prueba) |
| `b6603b2` | **Contrato de entorno alineado:** lecturas directas `process.env` (OLLAMA/VERCEL/openai-compatible) migradas al gateway de configuración → `env-contract` vuelve a GREEN |
| `e1884d2` | **Neon + build:** scanner SQL consciente de cuerpos `$$...$$`, script `db:neon:preflight` restaurado, shim criptográfico de Vite cross-platform (build en Windows) |
| `b0d52df` | **README:** estado real 2026-09-12 con NCUA, gates medidos y % de avance |
| `73707a0` | **Tests reintegrados:** 3 suites huérfanas de `tests/` movidas a `test/unit/` (motor cognitivo, decision ledger, protocolo federado) con lint propio de módulos reales |
| `c747e22` | **NCUA conectada:** endpoint `/api/isabella/native` (auth `system:execute`) + señal opt-in `native` en el gateway de chat (`NATIVE_COMPREHENSION_ENABLED=false` por defecto) |
| `796c11f` | **Prettier baseline:** 358 archivos reformateados, `.prettierignore` alineado (generados excluidos) |
| `d51687c` | **Security fix:** regex sin ReDoS en `inference-firewall` y `ncua/pipeline`; ignores `routeTree.gen.ts` anidado en ambos configs eslint |

Gates verificados en esta actualización (máquina local, Node 22.18, Windows; ronda de la mañana `2026-09-11T23:30` y ronda de deuda técnica de la tarde):

```text
typecheck .......... PASS (tsc --noEmit, EXIT 0)
unit ............... PASS  35 archivos | 181 tests | 1 skip  (env-contract GREEN)
security+integration PASS  14 archivos | 100 tests | 9 skip
bookpi  ............ PASS  (incluido arriba)
test (todo) ........ PASS  51 archivos | 281 tests | 10 skip
production:preflight PASS  (22 archivos críticos + contratos de runtime/DB)
build .............. PASS  (cliente 2818 módulos · SSR 238 → Nitro preset vercel → .vercel/output)
secret-scan ........ PASS  (sin secretos hardcodeados)
security:scan ...... PASS  (eslint security + secret-scan; regex sin ReDoS tras `d51687c`)
capabilities ....... PASS  (29 capacidades · manifiesto válido)
audit:routes ....... PASS  (sin rutas duplicadas ni delegación con autoridad; incluye api/isabella.native)
db-neon-preflight... FIX   (escáner desbloqueado; ejecución real requiere DATABASE_URL autorizada)
lint ............... REFORMAT  (baseline prettier aplicado en `796c11f`; full-run local excede timeout por perf CI/Linux)
```

> Lease interpretativo: los bloquesos que aún separan a Isabella de **Production-Verified** no son de código: son de **entorno y evidencia operacional** (base de datos real aplicada, secretos en el dashboard de Vercel, deploy real con smoke HTTP, CI remoto verde).

---

## 3. Estado real del proyecto — 2026-09-12

Los porcentajes siguientes son una **estimación de readiness basada en la implementación existente y la evidencia disponible medida hoy**. No son una certificación independiente ni una métrica automática de CI remoto.

### Rúbrica de avance

| Área | Avance | Estado real (con evidencia) |
|---|---:|---|
| Implementación de ingeniería | **~90%** | 331 archivos TS/TSX en `src/` (≈65.8k líneas) compilan; 29/29 capacidades declaradas verificadas por script (26 `real`, 2 `evidence-gated`, 1 `manual`); 16 ADR; tests unit y de seguridad verdes. |
| Isabella end-to-end | **~84%** | Conversación, gateway, learning, cognitive training, skills, voz, memoria y gobernanza integrados en código; la NCUA ya está conectada al gateway (señal opt-in) y servida en `/api/isabella/native`; falta runtime productivo real. |
| Production Readiness | **~74%** | Gates de código verdes localmente: typecheck, tests, build, secret-scan, security:scan, capabilities, rutas, integrity, preflight; prettier baseline aplicado (deuda de formato resuelta). Pendiente: DB real, secretos Vercel, full-lint en CI/Linux, certificación de payout. |
| Deployment Readiness | **~66%** | Build productivo genera `.vercel/output`; `vercel.json` (tanstack-start + frozen-lockfile), `.nvmrc=24.11.0` listos; falta deploy real verificado con smoke HTTP. |
| Production Verification | **~48%** | Evidencia local reproducible alta; falta evidencia de CI remoto verde, deploy, DB en producción, proveedores reales y rollback. |
| Motor propio (GENESIS) | **~25%** | NCUA token-free implementada y medida (determinista, sin deps de ML) — primer ladrillo real de GENESIS-3/4. |
| Foundation Model propio | **~18%** | Arquitectura y Learning Plane avanzados; entrenamiento fundacional a escala pendiente. |

### Por qué no se declara 100%

Todavía faltan, como mínimo:

1. CI remoto reproducible con pasos, logs y resultado verde (el run observado de `fgais-gate.yml` quedó en `failure` sin logs atribuibles).
2. Build productivo ejecutado sobre el commit candidato en CI (local: PASS).
3. Migración, backup y restore contra la base real (Neon). El preflight read-only sigue fuera de ejecución hasta contar con `DATABASE_URL` y autorización para aplicar.
4. Deployment real en el target (Vercel; el último estado productivo mostraba 500 por secretos pendientes en el dashboard).
5. Smoke tests HTTP de producción.
6. Verificación de secretos/configuración en runtime.
7. Verificación de Gemini y fallback real.
8. Pruebas de observabilidad y recuperación.
9. Rollback real.
10. Auditoría final de cualquier simulación que pueda alcanzar autoridad productiva.

**Porcentaje de producción recomendado para comunicar externamente: ~71% de readiness, no 71% de certificación.**

---

## 4. Arquitectura FGAIS

```text
                         ┌─────────────────────┐
                         │       USUARIO       │
                         └──────────┬──────────┘
                                    ↓
                    ┌───────────────────────────┐
                    │ PRESENTATION PLANE        │
                    │ C.R.O.W.N. · UI · UX     │
                    └────────────┬──────────────┘
                                 ↓
                    ┌───────────────────────────┐
                    │ API / INTERACTION PLANE   │
                    │ Routes · Auth · Zod       │
                    │ Limits · Contracts        │
                    └────────────┬──────────────┘
                                 ↓
                    ┌───────────────────────────┐
                    │ GOVERNANCE PLANE          │
                    │ CROWN · ARGUS · Policy    │
                    │ Authorization · Approvals │
                    └────────────┬──────────────┘
                                 ↓
              ┌──────────────────┴──────────────────┐
              ↓                                     ↓
    ┌─────────────────────┐              ┌─────────────────────┐
    │ COGNITIVE RUNTIME   │              │ EXECUTION PLANE     │
    │ Memory · Learning   │              │ Skills · Tools      │
    │ Retrieval · Context │              │ Authority · BookPI  │
    └──────────┬──────────┘              └──────────┬──────────┘
               └────────────────┬──────────────────┘
                                ↓
                    ┌───────────────────────────┐
                    │ INTELLIGENCE PLANE        │
                    │ Router · Registry         │
                    │ Gemini · Fallbacks        │
                    │ NCUA (nativa)             │
                    └────────────┬──────────────┘
                                 ↓
                    ┌───────────────────────────┐
                    │ PERSISTENCE PLANE         │
                    │ PostgreSQL · Audit        │
                    │ Learning · Economic state │
                    └────────────┬──────────────┘
                                 ↓
                    ┌───────────────────────────┐
                    │ EVIDENCE / OBSERVABILITY  │
                    │ Trace · Audit · Hash      │
                    │ Manifests · OTLP · Gates  │
                    └───────────────────────────┘
```

Flujo canónico:

```text
Perceive → Identify → Retrieve → Validate → Govern → Decide
→ Authorize → Approve → Execute → Validate → Audit → Observe → Recover
```

---

## 5. NCUA — Motor nativo de comprensión continua (token-free)

**NCUA (Native Continuous Understanding Architecture)** es el equivalente TypeScript puro, determinista y **sin ninguna dependencia de ML** del motor del documento técnico del proyecto. Opera directamente sobre bytes UTF-8, proyecta a un espacio latente continuo, y coordina siete federaciones con atención cruzada y consenso gobernado. `package.json` no ganó ni una sola dependencia (baseline `pnpm-lock.yaml` intacto).

### Módulos (`src/lib/ncua/`)

| Archivo | Responsabilidad |
|---|---|
| `bytes.ts` | Alfabeto `B={0..255}`: codificación/validación UTF-8, FNV-1a, n-gramas de bytes con sentinela, igualdad de bytes. |
| `embed.ts` | Representaciones continuas por hashing de n-gramas (dimensión latente 192), normalización, coseno, SimHash de 64 bits, latente por chunks. |
| `tensor.ts` | Tensor-lite: PRNG mulberry32 con semilla, GELU, sigmoid, matmul, softmax por filas, init Xavier determinista, capas lineales. |
| `lsh.ts` | Índice SimHash de dos etapas: bucket grueso de 16 bits + rerank por Hamming/coseno, con bandera de coincidencia exacta. |
| `intent.ts` | Clasificador de intención por centroides continuos con margen y abstinencia (`desconocido`); seeds territoriales RDM. |
| `kg.ts` | Grafo de conocimiento soberano con hechos tipados y procedencia (`patrimonio-documentado`/`tradición-oral`); no promueve inferencias a hechos. |
| `privacy.ts` | Presupuesto (ε, δ), ruido Laplace/Gaussiano, k-anonimato, l-diversidad, límite de riesgo de membresía. |
| `federations.ts` | Controlador de heptafederación F1–F7 (vetos duros F1/F2/F7, consenso ≥ 0.7, mayoría 5/7) + **`FederatedAttentionBridge`**. |
| `metrics.ts` | Métricas medidas honestamente en este repositorio (`measureOnCorpus`). |
| `pipeline.ts` | Pipeline soberano de **exactamente 12 pasos** encadenados por SHA-256 + firma; integra `resolveInferencePolicy`. |
| `index.ts` | Bundle público + `createNativeEngine` (intención sembrada + KG + LSH sobre el corpus de memoria). |

### Pipeline de 12 pasos

```text
 1 percepción (valida UTF-8 + presupuesto de bytes)
 2 representación (hashing de n-gramas B)
 3 proyección latente por chunks de 32B con sentinela
 4 memoria (LSH SimHash sobre corpus)
 5 fundamentación (grafo de conocimiento)
 6 intención (centroides + abstinencia)
 7 heptafederación (F1…F7)
 8 atención cruzada (8 cabezas × 16d)
 9 privacidad diferencial (ε=0.5)
10 coherencia (anclaje de memoria)
11 seguridad (correo/tarjeta/directivas → deny)
12 redacción + auditoría (hash-encadenado + firma)
```

Cada paso audita su `traceId` firmando el hash del paso anterior; el resultado se reporta con `aligned` cuando la respuesta está anclada al KG y a la memoria del tenant.

### Puente de atención federada (docs NCUA §1–5)

`FederatedAttentionBridge` traduce el documento original a TypeScript determinista:

- Proyección por federación: `h_f = W₃·GELU(W₂·GELU(W₁·z))` (sub-espacios 128-d; F4 con 256-d según el documento).
- Atención multi-cabeza: `headᵢ = softmax(Q·Kᵀ/√dₖ)·V` (8×16).
- Gate de consenso: `g = σ(MLP(flatten(H_attended)))`, `consensus = 1{mean(g) > 0.7}`.
- Latente consensuado: `z_out = W_out·GELU(Σ_f g_f·h_gated^f)`.
- Exposición auditables: `attentionWeights`, `gateContributions`, `mathematicalFormulation()`.
- Pesos inicializados con **semilla fija** (reproducible) y, por defecto, **congelados** — la fase de entrenamiento de los autoencoders sigue siendo objetivo GENESIS, no una afirmación de este repo.

### Rendimiento medido (honesto, no A100)

Medido localmente con `measureOnCorpus` (Node 22, portátil de desarrollo; autocorpus de 5 documentos):

| Métrica | Valor real |
|---|---|
| Pipeline completo (12 pasos, incl. re-instantación) | ≈ 416 ms/ejecución → ≈ 2.4 ejec/s |
| Fidelidad media / recall exacto (autocorpus) | 1.0 / 1.0 (coincidencia de bytes) |
| Latente | 192-d |
| Densidad | ≈ 55.85 bits/byte |
| Eficiencia | ≈ 27.5 bytes/chunk |
| Throughput de corpus | ≈ 937 B/s |

Las cifras del documento fuente (fidelidad > 99.9%, 2.3 ms en A100, factor-K) son **objetivos de investigación**, no mediciones de este repositorio.

### Soberanía y estado

- 0 lecturas directas de `process.env`; solo tipos y librería estándar de Node.
- En producción sin proveedor autorizado → `503` fail-closed (seteos `MAINTENANCE`), sin sustituto generativo.
- Vector `NATIVE_DECLARED` cuando el runtime admite estilo nativo; autenticación/tenant/política siguen siendo prerrequisitos.
- **Estado actual:** motor completo, testeado (5 suites de unidad) y medido; **conectado al runtime** — endpoint `POST /api/isabella/native` (auth `system:execute`, scope `isabella:chat`) vía `src/routes/api/isabella.native.ts`, y señal `native` opt-in en el gateway de chat cuando `NATIVE_COMPREHENSION_ENABLED=true` (default `false`, sin cambio de comportamiento en producción).
- Pruebas: `test/unit/ncua-bytes.test.ts`, `ncua-embed-lsh.test.ts`, `ncua-intent-kg.test.ts`, `ncua-federations-privacy.test.ts`, `ncua-pipeline.test.ts`.

---

## 6. Conversación real de Isabella

La entrada principal es:

```text
/api/isabella
```

El camino de conversación integra:

```text
Request
 ↓
Schema validation
 ↓
Sovereign authentication
 ↓
Tenant resolution
 ↓
Security / policy checks
 ↓
AEGIS firewall
 ↓
Learning retrieval
 ↓
Cognitive context
 ↓
CROWN / governance
 ↓
Provider selection
 ↓
Real inference
 ↓
SSE response
 ↓
Telemetry / audit
```

El **Cognitive Runtime Bridge** ya está conectado al gateway. Isabella puede recuperar recuerdos relevantes del tenant y proporcionarlos al modelo como **referencia no confiable**.

Los recuerdos aprendidos no pueden convertirse por sí mismos en:

- instrucciones del sistema;
- permisos;
- secretos;
- identidad;
- autoridad;
- aprobaciones.

---

## 7. Learning Plane

Isabella tiene un motor de aprendizaje provider-neutral. El aprendizaje actual representa **estado durable estructurado** (no pretende cambiar los pesos de Gemini).

Puede almacenar:

- conceptos;
- procedimientos;
- preferencias;
- episodios;
- outcomes;
- calidad;
- reinforcement count;
- competencia por skill;
- snapshots versionados.

Modos:

```text
supervised
contrastive
preference
episodic
procedural
reflective
multimodal
```

El aprendizaje durable no supervisado requiere consentimiento explícito y existen controles contra patrones conocidos de prompt injection antes de persistir material.

---

## 8. Cognitive Training

Ocho estrategias implementadas:

```text
semantic
procedural
contrastive
counterfactual
retrieval
reflection
preference
multimodal
```

Capacidades: entrenamiento individual y batch, evaluación, retrieval, snapshots, firmas deterministas SHA3-512, deduplicación, sanitización y quality clamping.

```text
POST /api/isabella-cognitive-training
```

Acciones: `train`, `train-batch`, `retrieve`, `evaluate`, `snapshot`.

---

## 9. Learning API

```text
/api/isabella-learning
```

Acciones: `ingest`, `retrieve`, `evaluate`, `snapshot`. Autenticación soberana y estado aislado por tenant.

---

## 10. Persistencia durable del aprendizaje

```text
public.isabella_learning_state
```

- Migration: `supabase/migrations/20260909120000_isabella_learning_state.sql`
- Servicio: `src/lib/isabella-learning-persistence.ts`
- `tenant_id` PK, snapshot JSONB versionado, hash SHA3-512, canonicalización estable, restore del runtime.

Si `DATABASE_URL` no existe, el runtime puede operar en memoria para desarrollo. **Eso no cuenta como persistencia durable Production-Verified.**

---

## 11. Skills gobernadas

```text
/api/isabella-skills
```

Runtime: `runIsabellaSkill`. Flujo: Identity → Tenant → Role → CROWN/ARGUS → Validación → Ejecución → Validación de salida → BookPI/audit. Skills desconocidas: **deny-by-default**. Que una skill exista no implica autorización en cualquier contexto.

---

## 12. Inteligencia federada

Arquitectura: Provider discovered → Registered → Evaluated → Policy/provenance/license → Approved → Production enabled → Health monitored → Revocable.

Proveedor principal configurado: `gemini-3.8-flash`. Fallbacks autorizados (cuando están configurados): Groq, xAI, OpenAI-compatible. Fallbacks locales opcionales (opt-in explícito, nunca autorización productiva): Ollama (`OLLAMA_ENABLED`) y OpenAI-compatible local (`OPENAI_COMPATIBLE_LOCAL_ENABLED`). La degradación es explícita; si no hay proveedor autorizado, el sistema responde indisponibilidad en vez de fabricar una respuesta generativa silenciosa.

La configuración de estos proveedores y de la variable `VERCEL` vive **exclusivamente** en el gateway `src/lib/config.ts`/`env-schema.ts` (contrato de entorno verificado por tests).

---

## 13. Genesis Evidence y Claim Engine

```text
Claim → Implementation / Policy → Evidence → Verification → Production Verification
```

El `ClaimEngine` usa el hash real de `pnpm-lock.yaml` (SHA3-512) para `dependencyLockHash`. El production integrity gate rechaza hashes ausentes, inválidos, vacíos o artificialmente all-zero.

### Genesis CLI

```text
audit
claim <claimId>
evidence list
evidence verify
evidence diff <commitA> <commitB>
release-check
sbom generate
sign <manifestFile>
verify-signature <signedFile>
```

SBOM en CycloneDX 1.6 o SPDX 2.3.

---

## 14. Evidencia: E0 → E4

```text
E0  DECLARED   →  E1  STATIC VERIFIED  →  E2  RUNTIME VERIFIED
→  E3  PRODUCTION VERIFIED  →  E4  INDEPENDENTLY ASSURED
```

- Un documento no demuestra runtime.
- Un unit test no demuestra producción.
- Un hash no demuestra autenticidad independiente.
- Un workflow configurado no demuestra CI verde.
- Un deployment declarado no demuestra Production-Verified.

---

## 15. Seguridad

| Control | Estado |
|---|---|
| Sovereign authentication | Implementado |
| Tenant isolation | Implementado en rutas críticas |
| Zod validation | Implementado |
| Input limits | Implementado |
| SSRF / egress controls | Implementado |
| Trace / correlation IDs | Implementado |
| Secret redaction | Implementado |
| Production dev-auth protection | Implementado |
| Kill switch | Implementado; evidencia operacional pendiente |
| Security scan | Integrado al gate (secret-scan PASS hoy) |
| Rate limiting distribuido | Capacidad `manual`; requiere infraestructura y evidencia |
| CSP strict + nonce | Implementado en código; evidencia final pendiente |
| Sandbox fuerte | Implementado (`sovereign-sandbox` / VM); pruebas de aislamiento presentes |
| Replay protection distribuido | Parcial según subsistema |
| Contrato de entorno | PASS (schema ↔ `.env.example` ↔ uso bajo `config()`) |

---

## 16. PostgreSQL y fuentes de verdad

PostgreSQL es la autoridad prevista para estado relacional crítico:

```text
PostgreSQL
 ├── application state
 ├── governance state
 ├── model approvals
 ├── audit state
 ├── economic events
 └── learning state
```

Existen además integraciones Prisma, Drizzle, Supabase, Neon y Upstash/Redis; la consolidación de fuentes de verdad sigue siendo objetivo de endurecimiento. En `staging`/`production` se exige: `DATABASE_URL` (autoridad única) o Supabase con `AUTH_JWT_SECRET`, `ISABELLA_STORAGE_PROVIDER`, `DURABLE_JSON_ALLOWED=false`, `AUTH_DEV_SESSION_ENABLED=false`.

Para estado crítico:

```text
AUTHORITATIVE WRITE MODEL → TRANSACTION → IDEMPOTENCY → AUDIT → RECONCILIATION
```

---

## 17. BookPI y economía

- Doble partida, eventos append-only, idempotencia, reconciliación, claims únicos, refunds como eventos, chargebacks explícitos, holds/freeze de riesgo, aprobaciones sensibles y separación autorización/proveedor.
- La integración de Stripe **no implica** dinero real Production-Verified.
- La certificación de economía real exige pruebas de webhooks, idempotencia, concurrencia, reconciliación, recuperación, backup y restore.
- Los payouts en vivo permanecen bloqueados hasta la certificación del circuito (`ISABELLA_PAYOUT_CIRCUIT_CERTIFIED` default `false` → `503 payouts_locked`).

---

## 18. Learning Plane hacia modelos propios

```text
GENESIS-0  Federación + gobernanza
    ↓
GENESIS-1  Modelos especializados
    ↓
GENESIS-2  Distillation / compression
    ↓
GENESIS-3  Continued pretraining + federated learning
    ↓
GENESIS-4  Foundation model propio
```

**GENESIS-3/4 ladrillo disponible hoy:** la NCUA aporta el motor determinista de representación continua, federación de 7 integrantes, atención cruzada y consenso — reproducible y sin dependencias de ML. El entrenamiento real (autoencoders, pesos, federated learning sobre datasets con provenance legal) sigue pendiente.

GENESIS-4 requiere datasets legalmente utilizables, provenance, licencias, contaminación controlada, cómputo reproducible, checkpoints, evaluación, seguridad de entrenamiento, artefactos firmados y release gates.

---

## 19. Federación segura

Un update federado debe controlar identidad del nodo, integridad, firma, freshness/timestamp, replay protection (persistente: `fgais_federation_replay`), límites de tamaño/magnitud, provenance, autorización, auditoría y persistencia del estado anti-replay. Un anti-replay únicamente en memoria no constituye evidencia de federación distribuida Production-Verified.

**Nota de despliegue:** el preflight Neon pasó a permitir el `DELETE FROM` de retención contenido en el cuerpo `$$...$$` de `fgais_federation_replay_prune` (escáner consciente de cuerpos) sin debilitar el fail-closed para SQL destructivo de nivel superior.

---

## 20. UI y SSR

React + TanStack Start + Vite. Frontera SSR separa código browser-only:

```text
SSR
 ├── metadata
 ├── accessible fallback
 └── no browser-only graph

Browser
 └── IsabellaClientApp
      ├── C.R.O.W.N.
      ├── Terminal
      ├── Navigation
      ├── Dashboards
      ├── Three.js / visual layer
      └── intelligence UI
```

---

## 21. Stack

### Runtime
- Node.js 22+ (`.nvmrc` fija 24.11.0), pnpm 10.15.0, TypeScript, Vite 8, TanStack Start, Nitro, React 19.

### Data / backend
- PostgreSQL, `pg`, Prisma, Drizzle, Supabase, Neon, Upstash Redis/rate limiting.

### AI / observability
- Gemini, OpenAI-compatible, Groq, xAI, Ollama (opt-in), Braintrust, OTLP/telemetry.

### IA nativa
- NCUA: motor token-free puro (zero-dep, determinista).

### UI
- React, Tailwind CSS, Radix UI, Three.js, Recharts, Lucide.

### Economics
- Stripe, BookPI.

---

## 22. Scripts de ingeniería y producción

```bash
pnpm typecheck
pnpm lint            # baseline prettier aplicado (796c11f); full-run local supera timeout de perf, en CI/Linux
pnpm security:scan   # eslint security + secret-scan: PASS local
pnpm test
pnpm build           # build productivo local verificado
pnpm production:integrity
pnpm production:preflight
pnpm capabilities
pnpm audit:routes
```

Base de datos:

```bash
pnpm db:migrate            # runner transaccional con ledger y fail-closed
pnpm db:neon:preflight     # reconciliación read-only (nuevo)
pnpm db:verify
pnpm db:backup
pnpm db:restore
```

Seguridad:

```bash
pnpm security:scan         # eslint security + secret-scan
pnpm production:gate       # gate integral
```

---

## 23. FGAIS Production Gate

Workflow `.github/workflows/fgais-gate.yml` (corre en push a `main`, ramas de trabajo y PR; también `ci.yml` reutilizable):

```text
Checkout → Frozen dependency install → Typecheck → Lint → Tests
→ Repository hygiene → Security scan → Capability contract → Route contract
→ Migration verification → Production integrity → Production preflight
→ Production build → Vercel/Nitro output → Build evidence → Artifact upload
```

Además: `security.yml` (SAST CodeQL, TruffleHog, Trivy, npm audit), `supabase.yml` (lint, db test, replay, schema diff, backup/restore) y `release.yml` (tags).

### Evidencia actual

Gates **locales** de esta actualización: todos verdes (ver §2). El último run observado del gate en GitHub terminó en `failure` sin logs atribuibles → **no cuenta como CI verde**.

---

## 24. Producción y deployment

Target: Vercel / Nitro. `vercel.json`: `framework=tanstack-start`, `installCommand=pnpm install --frozen-lockfile`, `outputDirectory=.vercel/output`. El build productivo genera el output verificable (PASS hoy).

La verificación definitiva requiere ejecutar en el target real:

```text
Commit candidato → Build → Deploy → Health → Authentication → Database
→ Real inference → Learning → Skills → Observability → Rollback
```

**Bloqueos operacionales abiertos (ninguno es de código):**

1. Secretos de Vercel pendientes en el dashboard (DATABASE_URL, GEMINI_API_KEY, SUPABASE_URL/ANON/JWT, AUTH_JWT_SECRET, ENCRYPTION_MASTER_KEY, CROWN_POLICY_SIGNING_KEY, AEGIS_AUDIT_SECRET, BOOKPI_SIGNING_KEY, STRIPE_*, PUBLIC_URL, ISABELLA_*, etc.); retirar `VITE_STATSIG_CLIENT_KEY`/`VITE_PUBLIC_APP_URL` obsoletos. Último estado productivo: 500.
2. Neon: preflight read-only pendiente con `DATABASE_URL_UNPOOLED` y, tras plan, aplicar migraciones con `npm run db:migrate -- psql`.
3. Proveedor criptográfico ML-DSA-87 no productivo en este runtime → producción/staging requieren `ECDSA-P384` o `RSA-SHA256` (fail-fast configurado).
4. Circuito de pagos en vivo sin certificar (`ISABELLA_PAYOUT_CIRCUIT_CERTIFIED=false`).
5. ~~Deuda de formato prettier del repo (lint rojo preexistente)~~ → **resuelta** en `796c11f` (baseline aplicado); el full-run local de `eslint .` sigue superando el timeout de esta máquina por rendimiento, no por errores (el gate CI/Linux manda).

---

## 25. Configuración y secretos

Nunca se deben commitear secretos. `validate-env.mjs` aborta si faltan las claves críticas (GEMINI_API_KEY, SUPABASE_URL/ANON/JWT/SERVICE_ROLE). Todas las variables sensibles están declaradas en `.env.example` (99 claves) sin valores reales. El contrato de entorno garantiza: schema ↔ `.env.example` ↔ uso vía `config()`.

Dependiendo de las capacidades habilitadas, producción puede requerir:

```text
DATABASE_URL
GEMINI_API_KEY
GROQ_API_KEY
XAI_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
BOOKPI_SIGNING_KEY
AUTH / SESSION SECRETS
OBSERVABILITY / OTLP CONFIG
REDIS / UPSTASH CONFIG
```

Los valores reales nunca deben aparecer en README, issues, logs ni commits.

---

## 26. Desarrollo local

Requisitos: Node.js 22+, pnpm 10.15.0, PostgreSQL (persistencia durable).

```bash
pnpm install
pnpm dev
```

Validación:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Gate: `pnpm production:gate`.

---

## 27. API surface

```text
/api/isabella
/api/isabella-learning
/api/isabella-cognitive-training
/api/isabella-skills
/api/isabella-voice
/api/v1/isabella
/api/health
/api/health/live
/api/health/ready
/api/health/deep
/api/billing
/api/catalog
/api/db
/api/security
/api/economic-integrity
```

La superficie está diseñada alrededor de contratos Zod, autenticación soberana, tenant isolation, policy checks y metadata de correlación; `genesis-route-audit` verifica que no existan rutas duplicadas ni lógica de autoridad en handlers.

---

## 28. P0 para llegar a Production-Verified

### P0.1 CI
- ejecución real del gate remoto con pasos/logs; typecheck, lint, tests, security scan, DB verification, integrity, preflight y build verdes.

### P0.2 Database
- migración real (Neon), schema verification, backup, restore, learning snapshot integrity, tenant isolation, recovery.

### P0.3 Deployment
- deployment del commit candidato con ID, artifact verification, health, SSR, `/api/isabella`, learning, cognitive training, skills, observabilidad.

### P0.4 Providers
- Gemini real, fallback autorizado, timeout, rate limit, degraded mode, revocación.

### P0.5 Secrets
- configuración runtime, redacción, rotación, comportamiento ante secreto ausente.

### P0.6 Rollback
- release candidata, rollback real, health post-rollback, DB compatibility, snapshot compatibility.

### P0.7 Simulation audit
- toda simulación que pueda alcanzar autoridad productiva debe reemplazarse por proveedor real, aislarse fuera de producción o bloquearse fail-closed.

---

## 29. P1 después de la primera producción

Pruebas de carga, chaos testing, concurrencia extendida, failover/multi-región, disaster recovery, threat modeling, fuzzing, rotación automática de claves, SLO/SLA, capacity planning, evaluación continua de modelos, canary releases y rollback automático.

## 30. P2 — evolución de Isabella

Planner avanzado, memoria semántica/vectorial gobernada, aprendizaje federado productivo, modelos especializados propios, distillation, continued pretraining, foundation model Genesis (con la NCUA como base real), confidential computing, aceleración de hardware y post-quantum cryptography donde corresponda.

---

## 31. Estructura principal

```text
src/
├── server.ts               # entrada de seguridad (correlación→identidad→tenant→rate→validación→política→handler→audit)
├── routes/api/             # capa delgada (isabella, learning, cognitive-training, skills, voice, health/*, billing, catalog, db, security, economic-integrity, v1)
├── server-routes/          # handlers delgados complementarios (health, db, catalog, billing, security, isabella-voice, mux-intro, economic-integrity)
├── lib/
│   ├── ncua/               # motor nativo token-free (bytes, embed, tensor, lsh, intent, kg, privacy, federations, metrics, pipeline, index)
│   ├── cognitive/          # native-engine
│   ├── crypto/             # bookpi-signer, kms, api-key-crypto
│   ├── accounting/         # doble partida, repositories
│   ├── bookpi/             # engine, royalties, canonical-payload
│   ├── skills/             # registry, run-skill, packs (core, hepta, economy, sovereignty, territorial…)
│   ├── intelligence/       # router, providers, production-model-gate, durable-model-registry
│   ├── repositories/       # memory, bookpi, audit, marketplace, approval, postgres…
│   ├── crown.ts · constitutional-gate.ts · sovereign-engine|pipeline · authorization · rbac · abac · permission-matrix
│   ├── principal-context · tenant-guard · tenant-context
│   ├── config.ts · env-schema.ts         # ÚNICA vía a process.env
│   ├── capability-registry · capability-tokens · tool-registry · sovereign-sandbox
│   ├── memory-engine · isabella-* (learning, cognitive, chat-gateway, pake)
│   └── telemetry/ · services/
└── generated/              # artefactos generados (prisma), no editables

tests/ (huérfanos: tests/unit/*) — no incluidos en el proyecto vitest
test/                      # suites activas: unit · security · integration · bookpi (54 archivos)
scripts/                   # 18 scripts de ingeniería y producción
docs/                      # 16 ADR + governance + operations + policies + architecture
supabase/migrations/       # 18 migraciones
.github/workflows/         # fgais-gate · ci · security · supabase · release
```

---

## 32. Definición de “Isabella funcionando”

No basta con que la UI cargue. Mínimo end-to-end:

```text
Browser → Authenticated request → Tenant identified → Security passed
→ Governance passed → Learning retrieved → Authorized provider selected
→ Real inference → Response returned → Telemetry recorded
→ Optional governed skill → Audit persisted → Learning persisted (cuando se permita)
```

Para producción se agrega: Backup + Restore + Rollback + Monitoring + Secrets verification + Provider verification.

---

## 33. Regla de certificación

> **No confundir código con capacidad verificada.**
> **No confundir capacidad con autoridad.**

Estado actual:

### 🟡 ENGINEERING-IMPLEMENTED
Arquitectura y subsistemas críticos implementados; gates de código locales verdes (2026-09-12).

### 🟡 PRE-PRODUCTION
Fase avanzada de preparación para despliegue (build y preflight OK; deploy/DB/secretos pendientes).

### 🔴 NOT YET PRODUCTION-VERIFIED
Falta evidencia operacional reproducible de CI remoto, deployment, database, runtime, secrets y rollback.

---

## 34. Documentación de referencia

```text
docs/governance/01-FGAIS-Governance-Constitution.md
docs/governance/EVIDENCE-MAP.md
docs/architecture/FGAIS-PRODUCTION-STATUS.md
docs/architecture/RUNTIME-AUTHORITY-MAP.md
docs/operations/CAPABILITY_MATRIX.md
docs/operations/P0-IMPLEMENTATION-STATUS-2026-09-09.md
docs/operations/PRODUCTION-GO-LIVE-GATE.md
docs/PRODUCTION_GATE.md
AGENTS.md   # documento maestro de arquitectura y especificación canónica
```

---

## 35. Resumen ejecutivo

### Ya implementado

- FGAIS governance architecture (CROWN / ARGUS / constitutional gate).
- Contrato de autoridad: PDP RBAC+ABAC, execution authority, capability tokens, kill switch.
- Isabella conversation gateway con Cognitive Runtime Bridge.
- Inferencia federada + modelo principal `gemini-3.8-flash` + fallbacks autorizados.
- **NCUA: motor nativo token-free de 12 pasos con heptafederación y atención cruzada (medido, zero-dep).**
- Env contract cumplido (schema ↔ `.env.example` ↔ `config()`; `env-contract` GREEN).
- Multi-tenant learning runtime + persistencia PostgreSQL (snapshots SHA3-512).
- Ocho estrategias de cognitive training; Learning API y Cognitive Training API.
- Skills gobernadas (deny-by-default) y sandbox soberano.
- BookPI (doble partida), Stripe idempotente, settlement saga, payout guard fail-closed.
- Genesis Claim Engine, dependency lock hashing, SBOM, firma/verificación de manifiestos.
- Production integrity, production preflight, db migrate/verify/backup/restore + **db:neon:preflight**.
- Capability y route audits; secret scan; client-env guard.
- SSR/browser boundary; build productivo local verificado (Windows).

### Falta para producción certificada

```text
CI REMOTO GREEN
+ REAL DATABASE EVIDENCE (Neon aplicada)
+ REAL DEPLOYMENT (Vercel con secretos)
+ REAL HTTP SMOKE
+ REAL PROVIDER VERIFICATION
+ REAL SECRETS VERIFICATION
+ BACKUP / RESTORE EN PROD
+ REAL ROLLBACK
+ SIMULATION AUDIT
+ LINT REFORMAT (deuda prettier) → HECHO (`796c11f`)
+ NATIVE UNDERSTANDING (NCUA) → HECHO (conectada, `c747e22`)
= PRODUCTION-VERIFIED
```

---

## 36. Declaración de Isabella

**Isabella Villaseñor AI — Genesis** no se define por un único modelo ni por una única interfaz.

Se define por la coordinación gobernada de:

```text
INTELLIGENCE
+ MEMORY
+ LEARNING
+ NATIVE UNDERSTANDING (NCUA)
+ SKILLS
+ GOVERNANCE
+ IDENTITY
+ SECURITY
+ PERSISTENCE
+ ECONOMICS
+ AUDIT
+ EVIDENCE
```

La visión es una infraestructura de inteligencia donde la capacidad de razonar y actuar esté acompañada por una capacidad equivalente de **saber bajo qué autoridad se está razonando, qué evidencia respalda una decisión, qué estado se está modificando y cómo recuperar el sistema cuando algo falla**.

**Isabella no debe ser únicamente inteligente. Debe ser gobernable, trazable, recuperable y verificable.**

<div align="center">

### Isabella Villaseñor AI — Genesis

**FGAIS · Federated Governed Artificial Intelligence System**

**Capability does not imply authority.**

</div>