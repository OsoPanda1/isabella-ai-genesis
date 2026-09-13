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
**Proyecto:** TAMV ONLINE NETWORK · RDM Digital Hub
**Repositorio:** `OsoPanda1/isabella-ai-genesis`
**Licencia:** Creative Commons Attribution 4.0 International (CC BY 4.0)

</div>

> **Principio fundacional: la capacidad no implica autoridad.**
>
> Isabella puede razonar, recordar, aprender, seleccionar modelos, utilizar capacidades y ejecutar acciones, pero ninguna capacidad técnica obtiene permiso por sí misma. Identidad, política, contexto, autorización, aprobación y evidencia determinan qué puede ocurrir.

---

## 1. Qué es Isabella

**Isabella Villaseñor AI — Genesis** es una arquitectura de IA gobernada denominada **FGAIS — Federated Governed Artificial Intelligence System**: una capa cognitiva híbrida, contextual, territorial y profundamente gobernada que coordina proveedores de inteligencia, memoria, aprendizaje, herramientas, skills, datos y sistemas externos manteniendo una frontera estricta entre:

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

- Una plataforma de IA gobernada (FGAIS).
- Un gateway de inferencia federada con failover explícito.
- Un runtime conversacional con memoria, aprendizaje y comprensión nativa.
- Un plano de skills y ejecución gobernada con sandbox soberano.
- Una arquitectura multi-tenant con aislamiento e identidad server-side.
- Un sistema de evidencia, trazabilidad y auditoría (Genesis 2.0).
- Una aplicación full-stack React + TanStack Start + Vite + Nitro.
- **NCUA**: un motor nativo de comprensión continua token-free, determinista y sin dependencias de ML.
- Una base real para futuras generaciones de modelos Genesis.

### Isabella todavía no es

- Una AGI demostrada.
- Un foundation model propio entrenado a escala.
- Una plataforma independiente de proveedores externos.
- Una certificación independiente de seguridad.
- Un sistema de pagos reales Production-Verified únicamente por integrar Stripe.
- Un sistema Production-Verified únicamente porque exista CI.
- Criptografía poscuántica productiva cuando el subsistema sea todavía experimental o simulado.

---

## 2. Estado real y actualización — 2026-09-12

Sobre la base `669b68d` (restauración exacta del lockfile dependencias) verificado y sincronizado con `main`, el proyecto acumula **11 commits nuevos** en dos tandas (mañana y tarde de 2026-09-12) y la rama está empujada a `main` (`cab8150` actual):

| Commit    | Alcance                                                                                                                                                                           |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `4111bfa` | **NCUA:** motor nativo de comprensión continua token-free (11 módulos `src/lib/ncua/`)                                                                                            |
| `b6603b2` | **Contrato de entorno alineado:** lecturas directas `process.env` (OLLAMA/VERCEL/openai-compatible) migradas a `config.ts` → `env-contract` GREEN                                 |
| `e1884d2` | **Neon + build:** scanner SQL consciente de cuerpos `$$...$$`, script `db:neon:preflight`, shim criptográfico Vite cross-platform (build en Windows)                              |
| `b0d52df` | **README:** estado real con NCUA, gates medidos y % de avance                                                                                                                     |
| `73707a0` | **Tests reintegrados:** 3 suites huérfanas de `tests/` movidas a `test/unit/` (motor cognitivo, decision ledger, protocolo federado)                                              |
| `c747e22` | **NCUA conectada:** endpoint `POST /api/isabella/native` (auth `system:execute`) + señal opt-in `native` en el gateway de chat (`NATIVE_COMPREHENSION_ENABLED=false` por defecto) |
| `796c11f` | **Prettier baseline:** 358 archivos reformateados, `.prettierignore` alineado (generados excluidos)                                                                               |
| `d51687c` | **Security fix:** regex sin ReDoS en `inference-firewall` y `ncua/pipeline`; ignores anidados de `routeTree.gen.ts`                                                               |
| `5a59fac` | **README:** NCUA conectada, prettier baseline y security:scan verde documentados                                                                                                  |
| `01ccc36` | **Prettier baseline corregido:** re-aplicado resolviendo `.prettierrc` (printWidth 100, alineado al gate eslint-plugin-prettier) — 342 archivos, +4337/−10587                     |
| `cab8150` | **Type debt reducida:** sin `any` en accounting (Prisma/PostgreSQL), governance, claim-engine, audit-orchestrator, json-reporter; `qup-v3-engine` null-safe                       |

### Gates verificados hoy (máquina local, Node 22.18, Windows)

```text
typecheck .......... PASS (tsc --noEmit, EXIT 0)
unit ............... PASS  35 archivos unit + sincronizados
test (todo) ........ PASS  51 archivos | 291 tests (281 passed · 10 skip)
security+integration PASS  (incluido arriba)
bookpi  ............ PASS  (incluido arriba)
production:preflight PASS  (22 archivos críticos + contratos de runtime/DB)
build .............. PASS  (cliente + SSR → Nitro preset vercel → .vercel/output)
secret-scan ........ PASS  (sin secretos hardcodeados)
security:scan ...... PASS  (eslint security + secret-scan; regex sin ReDoS tras `d51687c`)
capabilities ....... PASS  (manifiesto de capacidades válido)
audit:routes ....... PASS  (sin rutas duplicadas ni delegación con autoridad)
lint ............... PASS  en archivos tocados (0 errores tras `cab8150`); full-run `eslint .` en Windows excede timeout por rendimiento → el gate CI/Linux manda
db-neon-preflight... FIX   (escáner desbloqueado; ejecución real requiere `DATABASE_URL` autorizada)
```

> Lectura interpretativa: los bloqueos que aún separan a Isabella de **Production-Verified** no son de código: son de **entorno y evidencia operacional** (base de datos real aplicada, secretos en el dashboard de Vercel, deploy real con smoke HTTP, CI remoto verde).

---

## 3. Rúbrica de avance (estado real con evidencia)

Los porcentajes siguientes son una **estimación de readiness basada en implementación y evidencia medida**; no son una certificación independiente.

| Área                         |   Avance | Estado real (con evidencia)                                                                                                                                                                                                                                         |
| ---------------------------- | -------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Implementación de ingeniería | **~90%** | ~340 archivos TS/TSX en `src/` (404 en toda la app) compilan; ambos registros de capacidades verificados por script; ADRs y tests verdes.                                                                                                                           |
| Isabella end-to-end          | **~84%** | Conversación, gateway, learning, cognitive training, skills, voz, memoria y gobernanza integrados en código; NCUA conectada y servida en `/api/isabella/native`; falta runtime productivo real.                                                                     |
| Production Readiness         | **~74%** | Gates de código verdes localmente (typecheck, tests, build, security:scan, capabilities, rutas, integrity, preflight); prettier baseline correcto; deuda `any` mayor reducida. Pendiente: DB real, secretos Vercel, full-lint en CI/Linux, certificación de payout. |
| Deployment Readiness         | **~66%** | Build productivo genera `.vercel/output`; `vercel.json` (tanstack-start + frozen-lockfile) y `.nvmrc=24.11.0` listos; falta deploy real verificado con smoke HTTP.                                                                                                  |
| Production Verification      | **~48%** | Evidencia local reproducible alta; falta CI remoto verde, deploy, DB en producción, proveedores reales y rollback.                                                                                                                                                  |
| Motor propio (GENESIS)       | **~25%** | NCUA token-free implementada, medida y conectada — primer ladrillo real de GENESIS-3/4.                                                                                                                                                                             |
| Foundation Model propio      | **~18%** | Arquitectura y Learning Plane avanzados; entrenamiento fundacional a escala pendiente.                                                                                                                                                                              |

### Por qué no se declara 100%

1. CI remoto reproducible con pasos, logs y resultado verde (el run observado de `fgais-gate.yml` quedó en `failure` sin logs atribuibles).
2. Build productivo ejecutado sobre el commit candidato en CI (local: PASS).
3. Migración, backup y restore contra la base real (Neon); el preflight read-only sigue pendiente de `DATABASE_URL` autorizada.
4. Deployment real en Vercel (último estado productivo: 500 por secretos pendientes en el dashboard).
5. Smoke tests HTTP de producción.
6. Verificación de secretos/configuración en runtime.
7. Verificación de Gemini y fallback real.
8. Pruebas de observabilidad y recuperación.
9. Rollback real.
10. Auditoría final de cualquier simulación que pueda alcanzar autoridad productiva.

**Porcentaje de producción recomendado para comunicar externamente: ~71% de readiness, no 71% de certificación.**

### Actualización visual — Intro cinematográfico Enterprise Sovereign v2.0

La entrada de Isabella ahora utiliza un campo WebGL procedural con núcleo poliédrico, capas orbitales, partículas estelares, iluminación volumétrica simulada, telemetría de reproducción y una secuencia narrativa de 59 segundos. La experiencia conserva el audio local real (`public/assets/isabella-intro-mashup.mp3`) y puede superponer un stream Mux únicamente cuando el endpoint server-side devuelve un playback ID válido; nunca inventa datos ni bloquea el arranque si Mux no está configurado.

- **Rendimiento:** pixel ratio adaptativo (1.25 en móvil, 1.75 máximo en escritorio), `ResizeObserver`, limpieza explícita de geometrías/materiales y fallback visual con `isabella-intro-backdrop.png` cuando WebGL no está disponible.
- **Accesibilidad:** compuerta activada por gesto para audio, teclado (`Enter`, `Espacio`, `Esc`, `M`), `prefers-reduced-motion`, barra de progreso semántica y etiqueta accesible para la banda sonora.
- **Resiliencia:** Mux es una mejora opcional; el intro funciona con WebGL, fallback de imagen y audio local. Los errores de red no rompen la ruta principal.
- **Telemetría:** `TelemetryPayload` mide progreso, escena, FPS y frames descartados sin enviar datos fuera del navegador por defecto.

**Readiness actualizado tras esta evolución:** ingeniería visual **~94%**, experiencia end-to-end **~88%**, deployment readiness **~70%**. Estos porcentajes expresan evidencia de código y pruebas locales; no sustituyen un deploy, smoke test HTTP, CI remoto ni la validación operacional de producción descrita arriba.

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

### Cadena de autoridad del servidor

Toda request pasa por la cadena de `server.ts`:

```text
correlación → identidad → tenant → rate limit → validación → política → handler → auditoría
```

Las decisiones de autoridad nunca dependen del cliente: **PDP** (RBAC + ABAC + permission matrix), **capability tokens** HMAC-SHA256 con TTL corto y prefijo `isa_cap_`, **constitutional gate** y **kill switch** evalúan en el servidor.

---

## 5. Nodos cognitivos y gobernanza

| Nodo               | Rol                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **CROWN Gateway**  | Orquestación, ruteo, arbitraje y control de estado. Decide qué nodo responde y con qué peso.     |
| **ISA Core**       | Presencia, tono, empatía y modulación expresiva. Da forma humana y contextual a la salida.       |
| **SOPHIA Engine**  | Epistemología, razonamiento, síntesis y análisis. Valida consistencia lógica y profundidad.      |
| **ORION Engine**   | Ejecución, generación, síntesis visual y soporte técnico. Ejecuta tareas operativas o creativas. |
| **ARGUS Sentinel** | Gobernanza, defensa, verificación y veto. Evalúa riesgo, aplica políticas y puede bloquear.      |

Ningún nodo invade la responsabilidad de otro sin una razón explícita y documentada. La política C.R.O.W.N. (control, riesgo, orquestación, whitelist y notificación) define los niveles `allowed` / `requires_approval` / `denied` y mantiene el control humano en el circuito para acciones de alto riesgo.

---

## 6. NCUA — Motor nativo de comprensión continua (token-free)

**NCUA (Native Continuous Understanding Architecture)** es el equivalente TypeScript puro, determinista y **sin ninguna dependencia de ML** del motor del documento técnico del proyecto. Opera directamente sobre bytes UTF-8, proyecta a un espacio latente continuo y coordina siete federaciones con atención cruzada y consenso gobernado. `package.json` no ganó ni una sola dependencia (baseline `pnpm-lock.yaml` intacto).

### Módulos (`src/lib/ncua/`)

| Archivo          | Responsabilidad                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `bytes.ts`       | Alfabeto `B={0..255}`: codificación/validación UTF-8, FNV-1a, n-gramas de bytes con sentinela, igualdad de bytes.             |
| `embed.ts`       | Representaciones continuas por hashing de n-gramas (latente 192), normalización, coseno, SimHash 64 bits, latente por chunks. |
| `tensor.ts`      | Tensor-lite: PRNG mulberry32, GELU, sigmoid, matmul, softmax, init Xavier determinista, capas lineales.                       |
| `lsh.ts`         | Índice SimHash de dos etapas: bucket grueso de 16 bits + rerank por Hamming/coseno.                                           |
| `intent.ts`      | Clasificador de intención por centroides continuos con margen y abstinencia; seeds territoriales RDM.                         |
| `kg.ts`          | Grafo de conocimiento soberano con hechos tipados y procedencia; no promueve inferencias a hechos.                            |
| `privacy.ts`     | Presupuesto (ε, δ), ruido Laplace/Gaussiano, k-anonimato, l-diversidad, límite de riesgo de membresía.                        |
| `federations.ts` | Heptafederación F1–F7 (vetos duros F1/F2/F7, consenso ≥ 0.7, mayoría 5/7) + `FederatedAttentionBridge`.                       |
| `metrics.ts`     | Métricas medidas honestamente en este repositorio (`measureOnCorpus`).                                                        |
| `pipeline.ts`    | Pipeline soberano de **exactamente 12 pasos** encadenados por SHA-256 + firma; integra `resolveInferencePolicy`.              |
| `index.ts`       | Bundle público + `createNativeEngine` (intención sembrada + KG + LSH sobre el corpus de memoria).                             |

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

### Puente de atención federada

`FederatedAttentionBridge` traduce el documento original a TypeScript determinista:

- Proyección por federación: `h_f = W₃·GELU(W₂·GELU(W₁·z))` (sub-espacios 128-d).
- Atención multi-cabeza: `headᵢ = softmax(Q·Kᵀ/√dₖ)·V` (8×16).
- Gate de consenso: `g = σ(MLP(flatten(H_attended)))`, `consensus = 1{mean(g) > 0.7}`.
- Latente consensuado: `z_out = W_out·GELU(Σ_f g_f·h_gated^f)`.
- Exposiciones auditables: `attentionWeights`, `gateContributions`, `mathematicalFormulation()`.
- Pesos con semilla fija (reproducible) y, por defecto, **congelados** — la fase de entrenamiento de autoencoders sigue siendo objetivo GENESIS.

### Rendimiento medido (honesto, no A100)

Medido localmente con `measureOnCorpus` (Node 22, portátil de desarrollo; autocorpus de 5 documentos):

| Métrica                                             | Valor                             |
| --------------------------------------------------- | --------------------------------- |
| Pipeline completo (12 pasos, incl. re-instantación) | ≈ 416 ms/ejecución → ≈ 2.4 ejec/s |
| Fidelidad media / recall exacto (autocorpus)        | 1.0 / 1.0 (coincidencia de bytes) |
| Latente                                             | 192-d                             |
| Densidad                                            | ≈ 55.85 bits/byte                 |
| Throughput de corpus                                | ≈ 937 B/s                         |

Las cifras del documento fuente (fidelidad > 99.9%, 2.3 ms en A100) son **objetivos de investigación**, no mediciones de este repositorio.

### Soberanía y estado

- 0 lecturas directas de `process.env`; solo tipos y librería estándar de Node.
- En producción sin proveedor autorizado → `503` fail-closed, sin sustituto generativo.
- Vector `NATIVE_DECLARED` cuando el runtime admite estilo nativo; autenticación/tenant/política siguen siendo prerrequisitos.
- **Estado actual:** motor completo, testeado (5 suites de unidad) y medido; **conectado al runtime** — endpoint `POST /api/isabella/native` (auth `system:execute`, scope `isabella:chat`) y señal `native` opt-in en el chat cuando `NATIVE_COMPREHENSION_ENABLED=true` (default `false`).

---

## 7. Conversación real de Isabella

La entrada principal es `POST /api/isabella` (SSE). El camino de conversación integra:

```text
Request
 ↓
Schema validation (Zod)
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
Provider selection (federada, con NCUA opt-in)
 ↓
Real inference
 ↓
SSE response
 ↓
Telemetry / audit
```

El **Cognitive Runtime Bridge** ya está conectado al gateway: Isabella puede recuperar recuerdos relevantes del tenant y proporcionarlos al modelo como **referencia no confiable**. Los recuerdos aprendidos no pueden convertirse por sí mismos en instrucciones del sistema, permisos, secretos, identidad, autoridad ni aprobaciones.

---

## 8. Learning Plane

El aprendizaje es provider-neutral y representa **estado durable estructurado** (no pretende cambiar los pesos de Gemini). Puede almacenar: conceptos, procedimientos, preferencias, episodios, outcomes, calidad, reinforcement count, competencia por skill y snapshots versionados.

Modos: `supervised · contrastive · preference · episodic · procedural · reflective · multimodal`.

El aprendizaje durable no supervisado requiere consentimiento explícito y existen controles contra prompt injection antes de persistir material.

### Cognitive Training

Ocho estrategias: `semantic · procedural · contrastive · counterfactual · retrieval · reflection · preference · multimodal`.

Capacidades: entrenamiento individual y batch, evaluación, retrieval, snapshots, firmas deterministas SHA3-512, deduplicación, sanitización y quality clamping. Endpoint: `POST /api/isabella-cognitive-training` (acciones `train`, `train-batch`, `retrieve`, `evaluate`, `snapshot`).

### Learning API y persistencia durable

```text
POST /api/isabella-learning   # ingest, retrieve, evaluate, snapshot
GET  /api/isabella-learning
```

Persistencia en `public.isabella_learning_state` (migración `20260909120000`):

- `tenant_id` PK, snapshot JSONB versionado, hash SHA3-512, canonicalización estable, restore del runtime.
- Si `DATABASE_URL` no existe, el runtime puede operar en memoria para desarrollo. **Eso no cuenta como persistencia durable Production-Verified.**

---

## 9. Skills gobernadas

`POST /api/isabella-skills` (auth soberana). Runtime: `runIsabellaSkill`. Flujo:

```text
Identity → Tenant → Role → CROWN/ARGUS → Validación → Ejecución → Validación de salida → BookPI/audit
```

Skills desconocidas: **deny-by-default**. Que una skill exista no implica autorización en cualquier contexto. Paquetes disponibles (`src/lib/skills/`):

`core · economy · education · ethics · sovereignty · territorial · infrastructure · hepta · archive · clawscan · gemet-human-review` (+ contratos tipados en `contracts.ts`).

La ejecución de código pasa por **sovereign-sandbox** (ejecución en VM de Node con límites y sin acceso al host): `src/lib/sandbox/node-vm-executor.ts`.

---

## 10. Inteligencia federada

Arquitectura: Provider discovered → Registered → Evaluated → Policy/provenance/license → Approved → Production enabled → Health monitored → Revocable.

- Proveedor principal: **Gemini** (configurable en `config.ts`).
- Fallbacks autorizados (cuando están configurados): Groq, xAI, OpenAI-compatible.
- Fallbacks locales opcionales (opt-in, nunca autorización productiva): Ollama (`OLLAMA_ENABLED`), OpenAI-compatible local (`OPENAI_COMPATIBLE_LOCAL_ENABLED`).
- La degradación es explícita; sin proveedor autorizado el sistema responde indisponibilidad en lugar de fabricar una respuesta generativa silenciosa.
- Referenciado por **open-model-catalog** y protegido por **inference firewall** (regex sin ReDoS tras `d51687c`).
- Registro durable de modelos con runtime registry (migración `20260908123000_fgais_model_runtime_registry`).

**Contrato de entorno:** toda la configuración de proveedores y de la variable `VERCEL` vive **exclusivamente** en `src/lib/config.ts` + `src/lib/env-schema.ts` (verificado por `env-contract.test.ts`; lecturas directas de `process.env` fuera de la capa de configuración → error de lint/contrato).

---

## 11. Genesis 2.0 — Evidence & Claim Engine

```text
Claim → Implementation / Policy → Evidence → Verification → Production Verification
```

El `ClaimEngine` usa el hash real de `pnpm-lock.yaml` (SHA3-512) para `dependencyLockHash`. El production integrity gate rechaza hashes ausentes, inválidos, vacíos o artificialmente all-zero.

### Audit CLI (`src/lib/genesis/cli`)

```text
audit                        # auditor completo: 9 scanners + tests + evidencia + manifiesto
claim <claimId>              # estado y evidencia de un claim
evidence list / verify       # evidencia del manifiesto
evidence diff <a> <b>        # delta entre commits
release-check                # release gate determinista
sbom generate                # CycloneDX 1.6 o SPDX 2.3
sign <manifest>              # firma del manifiesto
verify-signature <file>      # verificación
```

### Scanners (`src/lib/genesis/scanners`)

`source · environment · security · database · financial · auth · ci · supply-chain · governance` — los 9 escaners producen hallazgos tipados que alimentan el graph de evidencia, el engine de claims y el release gate.

### E0 → E4

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

## 12. QUP — Quantum Understanding Pipeline (experimental)

`src/lib/qup-v3-engine.ts` implementa el **Quantum Understanding Pipeline Sovereign Engine v3** (véase también `quantum-types.ts`):

- Gobernanza cuántica previa por skill ATLAS/ANUBIS/THEMIS/VIGIA con sello HMAC-SHA3-512 verificable (fail-closed si la verificación falla).
- Respaldo de ejecución: simulador local o servicios cuánticos (AWS Braket) según disponibilidad — la ruta real de hardware es **experimental**.
- Ledger soberano + BookPI integrity y firma de auditoría criptográfica por experimento; pricing dinámico en `src/lib/monetization/pricing`.
- Acepta ejecución solo tras validación de política, identidad, tenant y presupuesto; produce evidencia (merkle SHA-3) auditable.

> Estado honesto: capacidades relacionadas (núcleo cuántico, firmas post-cuánticas) permanecen **simuladas/experimentales**; no se declaran Production-Verified.

---

## 13. Seguridad

| Control                        | Estado                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| Sovereign authentication       | Implementado                                                                          |
| Tenant isolation               | Implementado en rutas críticas                                                        |
| Zod validation                 | Implementado                                                                          |
| Input limits                   | Implementado                                                                          |
| SSRF / egress controls         | Implementado                                                                          |
| Trace / correlation IDs        | Implementado                                                                          |
| Secret redaction               | Implementado                                                                          |
| Production dev-auth protection | Implementado                                                                          |
| Kill switch                    | Implementado; evidencia operacional pendiente                                         |
| Security scan                  | Integrado al gate (secret-scan PASS hoy)                                              |
| Rate limiting distribuido      | Capacidad `manual`; requiere infraestructura y evidencia                              |
| CSP strict + nonce             | Implementado en código; evidencia final pendiente                                     |
| Sandbox fuerte                 | Implementado (`sovereign-sandbox` / VM); tests de aislamiento presentes               |
| Replay protection distribuido  | Persistente para federación (`fgais_federation_replay`); parcial en otros subsistemas |
| Contrato de entorno            | PASS (schema ↔ `.env.example` ↔ uso bajo `config()`)                                  |

---

## 14. PostgreSQL y fuentes de verdad

PostgreSQL/Supabase es la autoridad prevista para estado relacional crítico:

```text
application state · governance state · model approvals · audit state · economic events · learning state
```

**23 migraciones** (`supabase/migrations/`, 2026-08-31 → 09-09) construyen el modelo de datos completo:

`init_schema · api_keys · tenants/align · audit_transactional · audit immutability · memory/sessions RLS · bookpi immutability · accounting · sovereign_state · economic_contract (+RLS) · approval_ledger · memory_plane · marketplace · monetization_accounts · kill_switch (+seed) · fgais_learning_registry · fgais_model_runtime_registry · fgais_federation_replay · isabella_learning_state · hardening_rls_memory_capabilities`

Existen integraciones Prisma, Drizzle, Supabase, Neon y Upstash/Redis. En `staging`/`production` se exige `DATABASE_URL` (autoridad única) **o** Supabase con `AUTH_JWT_SECRET`, `ISABELLA_STORAGE_PROVIDER`, `DURABLE_JSON_ALLOWED=false`, `AUTH_DEV_SESSION_ENABLED=false`.

Para estado crítico:

```text
AUTHORITATIVE WRITE MODEL → TRANSACTION → IDEMPOTENCY → AUDIT → RECONCILIATION
```

---

## 15. BookPI y economía

Contabilidad de doble entrada (repositorios PostgreSQL y Prisma), eventos append-only, idempotencia, reconciliación, claims únicos, refunds como eventos, chargebacks explícitos, holds/freeze de riesgo, aprobaciones sensibles y separación autorización/proveedor.

- **BookPI**: ledger inmutable firmado (ML-DSA-87/ECDSA-P384), royalties y canonical-payload (`src/lib/bookpi/`).
- **Stripe**: integración de cobro y webhooks idempotentes; **no implica dinero real Production-Verified**.
- La certificación de economía real exige pruebas de webhooks, idempotencia, concurrencia, reconciliación, recuperación, backup y restore.
- Los payouts en vivo permanecen bloqueados hasta certificar el circuito (`ISABELLA_PAYOUT_CIRCUIT_CERTIFIED` default `false` → `503 payouts_locked`).
- Monetización (`src/lib/monetization/`): revenue, payout-executor, fraud-review, withdrawal, phoenix-allocation.

---

## 16. Federación segura (FGAIS)

Un update federado debe controlar: identidad del nodo, integridad, firma, freshness/timestamp, **replay protection persistente** (`fgais_federation_replay`), límites de tamaño/magnitud, provenance, autorización, auditoría y persistencia del estado anti-replay. Un anti-replay únicamente en memoria no constituye evidencia de federación distribuida Production-Verified.

**Nota de despliegue:** el preflight Neon permite el `DELETE FROM` de retención contenido en el cuerpo `$$...$$` de `fgais_federation_replay_prune` (escáner consciente de cuerpos) sin debilitar el fail-closed para SQL destructivo de nivel superior.

---

## 17. UI y SSR

React + TanStack Start + Vite + Tailwind 4 + Radix UI. La frontera SSR separa código browser-only:

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

`check-client-env.mjs` aborta si alguna variable `VITE_*` sensible (secretos, claves de servidor) se filtra al cliente.

---

## 18. Stack

### Runtime

Node.js 22+ (`.nvmrc` fija 24.11.0) · pnpm 10.15.0 (lockfile congelado) · TypeScript 5.8 · Vite 8 · TanStack Start v1 · Nitro · React 19.

### Data / backend

PostgreSQL · `pg` · Prisma 5 · Drizzle · Supabase · Neon · Upstash (Redis, rate limit, qstash, vector).

### AI / observabilidad

Gemini · OpenAI-compatible · Groq · xAI · Ollama (opt-in) · Braintrust · OTLP/telemetry · NCUA (nativa, zero-dep).

### UI

React · Tailwind CSS 4 · Radix UI · Three.js · Recharts · Lucide · Lenis · embla · date-fns.

### Economics

Stripe · BookPI · double-entry accounting.

### Sandbox / tools

`node:vm` executor · tool-registry · capability tokens.

---

## 19. Scripts de ingeniería y producción (18)

Gates y validación:

```bash
pnpm typecheck                    # tsc --noEmit
pnpm lint                         # eslint . (full-run local: timeout por perf en Windows; CI/Linux manda)
pnpm security:scan                # eslint security + secret-scan
pnpm test                         # vitest (4 proyectos: unit · security · bookpi · integration)
pnpm build                        # build productivo local verificado
pnpm production:integrity         # gate de integridad de producción
pnpm production:preflight         # preflight de producción
pnpm production:gate              # gate canónico completo
pnpm capabilities                 # verifica el manifiesto de capacidades
pnpm audit:routes                 # auditor de rutas/delegación de autoridad
```

Base de datos:

```bash
pnpm db:migrate                   # runner transaccional con ledger y fail-closed
pnpm db:neon:preflight            # reconciliación read-only (escáner consciente de cuerpos SQL)
pnpm db:verify                    # verificación de esquema
pnpm db:backup / db:restore       # backup y restore
```

Operaciones:

```bash
node scripts/check-env.mjs        # validación de entorno (aborta si faltan claves críticas)
node scripts/check-client-env.mjs # anti-fugas VITE_* al cliente
node scripts/sanitize-repo.mjs    # higiene del repo
node scripts/secret-scan.mjs      # escáner de secretos
node scripts/capability-matrix.mjs --check
node scripts/supply-chain.mjs     # análisis de cadena de suministro
node scripts/audit-ledger.ts      # balance de comprobación de BookPI
node scripts/approve-fgais-model.mjs # aprobar modelo en runtime registry
```

---

## 20. CI/CD

5 workflows en `.github/workflows/`:

| Workflow         | Responsabilidad                                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fgais-gate.yml` | Gate completo en push a `main`/ramas/PR: checkout → install congelado → typecheck → lint → tests → hygiene → security scan → capabilities → rutas → migración → integrity → preflight → build → output Vercel/Nitro → evidencia → artifact |
| `ci.yml`         | Workflow reutilizable del gate                                                                                                                                                                                                             |
| `security.yml`   | SAST CodeQL · TruffleHog · Trivy · npm audit · eslint-security                                                                                                                                                                             |
| `supabase.yml`   | lint SQL · aplicabilidad · replay · schema diff · backup/restore                                                                                                                                                                           |
| `release.yml`    | Versionado por tags y validación de secretos                                                                                                                                                                                               |

### Evidencia actual

Gates locales de esta actualización: todos verdes (ver §2). El último run observado del gate en GitHub terminó en `failure` sin logs atribuibles → **no cuenta como CI verde**.

---

## 21. Producción y deployment

Target: **Vercel / Nitro**. `vercel.json`: `framework=tanstack-start`, `installCommand=pnpm install --frozen-lockfile`, `outputDirectory=.vercel/output`. El build productivo genera el output verificable (PASS hoy).

Verificación definitiva requerida en el target real:

```text
Commit candidato → Build → Deploy → Health → Authentication → Database
→ Real inference → Learning → Skills → Observabilidad → Rollback
```

**Bloqueos operacionales abiertos (ninguno es de código):**

1. **Secretos de Vercel** pendientes en el dashboard (`DATABASE_URL`, `GEMINI_API_KEY`, `SUPABASE_URL/ANON/JWT`, `AUTH_JWT_SECRET`, `ENCRYPTION_MASTER_KEY`, `CROWN_POLICY_SIGNING_KEY`, `AEGIS_AUDIT_SECRET`, `BOOKPI_SIGNING_KEY`, `STRIPE_*`, `PUBLIC_URL`, `ISABELLA_*`); retirar `VITE_STATSIG_CLIENT_KEY`/`VITE_PUBLIC_APP_URL` obsoletos. Último estado productivo: 500.
2. **Neon**: preflight read-only pendiente con `DATABASE_URL_UNPOOLED` y, tras plan, aplicar migraciones con `pnpm db:migrate`.
3. **ML-DSA-87** no productivo en este runtime → producción/staging requieren `ECDSA-P384` o `RSA-SHA256` (fail-fast configurado).
4. **Payouts** en vivo sin certificar (`ISABELLA_PAYOUT_CIRCUIT_CERTIFIED=false`).
5. ~~Deuda de formato prettier~~ → resuelta (baseline con `printWidth 100` en `01ccc36`); la deuda `any` mayor quedó reducida en `cab8150` (remanentes aislados: cli/index.ts y algunos helpers, siguiente ronda).

---

## 22. Configuración y secretos

Nunca se deben commitear secretos. `validate-env.mjs` aborta si faltan las claves críticas (`GEMINI_API_KEY`, `SUPABASE_URL/ANON/JWT/SERVICE_ROLE`). `env-schema.ts` cataloga ~90 variables con criticidad (~13 **CRITICAL**: `DATABASE_URL`, `AUTH_JWT_SECRET`, `ENCRYPTION_MASTER_KEY`, `CROWN_POLICY_SIGNING_KEY`, `AEGIS_AUDIT_SECRET`, `BOOKPI_SIGNING_KEY`, `STRIPE_SECRET_KEY`, …). El contrato de entorno garantiza: schema ↔ `.env.example` ↔ uso vía `config()`.

Según capacidades habilitadas, producción puede requerir:

```text
DATABASE_URL · GEMINI_API_KEY · GROQ_API_KEY · XAI_API_KEY
STRIPE_SECRET_KEY · STRIPE_WEBHOOK_SECRET · BOOKPI_SIGNING_KEY
AUTH / SESSION SECRETS · OBSERVABILITY / OTLP · REDIS / UPSTASH
```

Los valores reales nunca deben aparecer en README, issues, logs ni commits.

---

## 23. Desarrollo local

Requisitos: Node.js 22+, pnpm 10.15.0, PostgreSQL (persistencia durable).

```bash
pnpm install       # (frozen-lockfile; postinstall: prisma generate)
pnpm dev
```

Validación:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Gate completo: `pnpm production:gate`.

---

## 24. API surface

Rutas bajo `src/routes/api/**` (TanStack `createFileRoute` con `handlers` por método, autenticación soberana) y `src/server-routes/api/**`:

| Endpoint                           | Métodos   | Propósito                                                     |
| ---------------------------------- | --------- | ------------------------------------------------------------- |
| `/api/isabella`                    | POST      | Gateway de conversación (SSE)                                 |
| `/api/isabella/native`             | POST      | Comprensión nativa NCUA (auth `system:execute`)               |
| `/api/isabella-learning`           | GET, POST | Learning API (`ingest/retrieve/evaluate/snapshot`)            |
| `/api/isabella-cognitive-training` | POST      | Cognitive training (`train/batch/retrieve/evaluate/snapshot`) |
| `/api/isabella-skills`             | GET, POST | Ejecución gobernada de skills (deny-by-default)               |
| `/api/isabella-voice`              | POST      | Voz (routes y server-routes)                                  |
| `/api/v1/isabella`                 | POST      | Variante v1 del gateway                                       |
| `/api/health`                      | GET       | Health check                                                  |
| `/api/health/live`                 | GET       | Liveness                                                      |
| `/api/health/ready`                | GET       | Readiness                                                     |
| `/api/health/deep`                 | GET       | Deep health (dependencias)                                    |
| `/api/billing`                     | GET, POST | Billing (routes y server-routes)                              |
| `/api/catalog`                     | GET, POST | Catálogo                                                      |
| `/api/db`                          | GET, POST | Diagnóstico/estado de DB                                      |
| `/api/security`                    | POST      | Controles de seguridad                                        |
| `/api/economic-integrity`          | —         | Integridad económica (doble partida/reconciliación)           |
| `/api/mux-intro`                   | GET       | Intro MUX (server-routes)                                     |

El `genesis-route-audit` verifica que no existan rutas duplicadas ni lógica de autoridad en handlers.

---

## 25. Estructura del repositorio

```text
src/
├── server.ts                 # entrada de seguridad (correlación→identidad→tenant→rate→validación→política→handler→audit)
├── routes/api/               # capa delgada (isabella, native, learning, cognitive-training, skills, voice, health/*, billing, catalog, db, security, economic-integrity, v1)
├── server-routes/api/        # handlers complementarios (health, db, catalog, billing, security, isabella-voice, mux-intro, economic-integrity)
├── lib/
│   ├── ncua/                 # motor nativo token-free (bytes, embed, tensor, lsh, intent, kg, privacy, federations, metrics, pipeline)
│   ├── genesis/              # audiencia de evidencia: cli·scanners(9)·schemas·engines·verification·findings·graph·evidence·reporters·runners·release
│   ├── accounting/           # doble partida (repositorios Prisma y PostgreSQL)
│   ├── bookpi/               # ledger inmutable, royalties, canonical-payload
│   ├── monetization/         # revenue, payout-executor, fraud-review, withdrawal, phoenix-allocation
│   ├── skills/               # registry, run-skill, packs (core, economy, education, ethics, sovereignty, territorial, infrastructure, hepta, archive, clawscan, gemet-human-review)
│   ├── intelligence/         # router, providers, open-model-catalog, inference-firewall, production-model-gate, durable-model-registry
│   ├── cognitive/            # native-engine
│   ├── repositories/         # memory, bookpi, audit, marketplace, approval, api-key, postgres…
│   ├── persistence/          # repository-factory + adapters (supabase, neon, json)
│   ├── sandbox/              # node-vm-executor (sovereign-sandbox)
│   ├── security/             # entropy y controles criptográficos
│   ├── telemetry/            # observability, health, otel-exporter
│   ├── services/             # tenant-service, …
│   ├── crown.ts · constitutional-gate.ts · sovereign-engine|pipeline · authorization · rbac · abac · permission-matrix · tool-registry
│   ├── principal-context · request-context · tenant-guard · tenant-context
│   ├── config.ts · env-schema.ts            # ÚNICA vía a process.env
│   ├── capability-registry · capability-tokens · platform-capabilities · production-authority
│   ├── memory-engine · isabella-* (learning, cognitive, chat-gateway, native-gateway) · qup-v3-engine
│   └── crypto/               # bookpi-signer, kms, api-key-crypto
└── generated/                # artefactos generados (prisma), no editables

test/                         # suites activas: unit · security · integration · bookpi (51 archivos reportados por vitest, 4 proyectos)
scripts/                      # 18 scripts de ingeniería y producción
docs/                         # ADRs, governance, operations, policies, architecture, api
supabase/migrations/          # 23 migraciones
.github/workflows/            # fgais-gate · ci · security · supabase · release
```

---

## 26. Definición de “Isabella funcionando”

No basta con que la UI cargue. Mínimo end-to-end:

```text
Browser → Authenticated request → Tenant identified → Security passed
→ Governance passed → Learning retrieved → Authorized provider selected
→ Real inference → Response returned → Telemetry recorded
→ Optional governed skill → Audit persisted → Learning persisted (cuando se permita)
```

Para producción se agrega: Backup + Restore + Rollback + Monitoring + Secrets verification + Provider verification.

---

## 27. Roadmap

### P0 — Llegar a Production-Verified

1. **CI**: ejecución real del gate remoto con pasos/logs verdes.
2. **Database**: migración real (Neon), schema verification, backup, restore, learning snapshot integrity, tenant isolation, recovery.
3. **Deployment**: deployment del commit candidato con ID, artifact verification, health, SSR, `/api/isabella`, aprendizaje, skills, observabilidad.
4. **Providers**: Gemini real, fallback autorizado, timeout, rate limit, degraded mode, revocación.
5. **Secrets**: configuración runtime, redacción, rotación, comportamiento ante ausencia.
6. **Rollback**: release candidata, rollback real, health post-rollback, compatibilidad de DB y snapshots.
7. **Simulation audit**: toda simulación que pueda alcanzar autoridad productiva debe reemplazarse, aislarse o bloquearse fail-closed.

### P1 — Después de la primera producción

Pruebas de carga, chaos testing, concurrencia extendida, failover/multi-región, disaster recovery, threat modeling, fuzzing, rotación automática de claves, SLO/SLA, capacity planning, evaluación continua de modelos, canary releases y rollback automático.

### P2 — Evolución de Isabella

Planner avanzado, memoria semántica/vectorial gobernada, aprendizaje federado productivo, modelos especializados propios, distillation, continued pretraining, foundation model Genesis (con la NCUA como base real), confidential computing, aceleración de hardware y post-quantum cryptography donde corresponda.

---

## 28. Regla de certificación

> **No confundir código con capacidad verificada.**
> **No confundir capacidad con autoridad.**

### 🟡 ENGINEERING-IMPLEMENTED

Arquitectura y subsistemas críticos implementados; gates de código locales verdes (2026-09-12, `cab8150`).

### 🟡 PRE-PRODUCTION

Fase avanzada de preparación para despliegue (build y preflight OK; deploy/DB/secretos pendientes).

### 🔴 NOT YET PRODUCTION-VERIFIED

Falta evidencia operacional reproducible de CI remoto, deployment, database, runtime, secrets y rollback.

---

## 29. Documentación de referencia

```text
docs/governance/01-FGAIS-Governance-Constitution.md
docs/governance/EVIDENCE-MAP.md
docs/architecture/FGAIS-PRODUCTION-STATUS.md
docs/architecture/RUNTIME-AUTHORITY-MAP.md
docs/architecture/AUTHORITY_MATRIX.md
docs/architecture/OPEN-MODEL-FAILOVER.md
docs/operations/CAPABILITY_MATRIX.md
docs/operations/P0-IMPLEMENTATION-STATUS-2026-09-09.md
docs/operations/PRODUCTION-GO-LIVE-GATE.md
docs/PRODUCTION_GATE.md
docs/RELEASE-CHECKLIST.md
docs/PRODUCT-PRESENTATION-STANDARD.md
docs/api/API_CONTRACT_AUTHORITY.md
AGENTS.md   # documento maestro de arquitectura y especificación canónica
```

---

## 30. Resumen ejecutivo

### Ya implementado

- FGAIS governance architecture (CROWN / ARGUS / constitutional gate / PDP / kill switch).
- Isabella conversation gateway con Cognitive Runtime Bridge.
- **NCUA**: motor nativo token-free de 12 pasos con heptafederación y atención cruzada (medido, zero-dep, conectado al runtime).
- Inferencia federada + proveedor principal configurable + fallbacks autorizados + open-model-catalog + inference firewall.
- Contrato de entorno cumplido (schema ↔ `.env.example` ↔ `config()`); `env-contract` GREEN.
- Multi-tenant learning runtime + persistencia PostgreSQL (snapshots SHA3-512) + cognitive training (8 estrategias).
- Skills gobernadas (deny-by-default, sandbox VM) y QUP Sovereign Engine (experimental, fail-closed).
- BookPI (ledger inmutable), doble partida, Stripe idempotente, payouts tras guard fail-closed.
- Genesis 2.0: audit CLI, claim engine, 9 scanners, evidence graph, release gate, SBOM, firma/verificación de manifiestos.
- Production integrity, preflight, capabilities y route audits, secret scan, client-env guard.
- 23 migraciones PostgreSQL, 5 workflows CI/CD, 18 scripts, ~291 tests (281 passed).

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
+ LINT FULL GREEN EN CI (baseline aplicado; full-run local limitado por perf Windows)
= PRODUCTION-VERIFIED
```

---

## 31. Declaración de Isabella

Isabella no se define por un único modelo ni por una única interfaz. Se define por la coordinación gobernada de:

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
