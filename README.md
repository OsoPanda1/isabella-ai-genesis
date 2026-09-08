# Isabella Villaseñor AI — Genesis

<div align="center">

## FGAIS · Federated Governed Artificial Intelligence System

**Arquitectura de Inteligencia Artificial Gobernada, Federada, Auditable y Humano-Soberana**

[![Genesis 2.0](https://img.shields.io/badge/Genesis-2.0-111827?style=for-the-badge)](./docs/governance/01-FGAIS-Governance-Constitution.md)
[![Node](https://img.shields.io/badge/Node-%3E%3D22-1f2937?style=for-the-badge)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.15.0-f97316?style=for-the-badge)](https://pnpm.io/)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-React-0f172a?style=for-the-badge)](https://tanstack.com/start)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge)](https://vercel.com/)

**Nodo Cero:** Real del Monte, Hidalgo, México  
**Operación / proyecto:** TAMV ONLINE  
**Repositorio:** `OsoPanda1/isabella-ai-genesis`

</div>

> **Regla fundacional:** **La capacidad no implica autoridad.**
>
> Isabella coordina capacidades de inteligencia, pero ninguna capacidad técnica constituye por sí misma permiso para actuar. La autorización, la política, la identidad, el contexto, la aprobación requerida y la evidencia determinan qué puede ocurrir.

---

## 1. Naturaleza del sistema

**Isabella Villaseñor AI — Genesis** es una arquitectura de IA gobernada que coordina inferencia federada, identidad, políticas, memoria, herramientas, seguridad, persistencia, auditoría, aprendizaje y ejecución dentro de un marco denominado **FGAIS — Federated Governed Artificial Intelligence System**.

El proyecto **no se declara AGI** ni presenta un foundation model propio a escala como una capacidad ya terminada. La implementación actual combina infraestructura propia de gobernanza y orquestación con proveedores externos de inferencia e infraestructura.

### Sí es

- Full-stack React + TanStack Start + Vite + Nitro.
- Superficie cognitiva C.R.O.W.N.
- Arquitectura de gobernanza con separación entre capacidad, autorización y ejecución.
- Plano de inteligencia para registro, selección y ejecución de proveedores/modelos.
- Controles de seguridad, identidad, validación, límites, egress y auditoría.
- Persistencia orientada a PostgreSQL como autoridad relacional crítica.
- BookPI y plano económico orientados a doble partida, idempotencia y reconciliación.
- Learning Plane con datasets, modelos, runs, evaluaciones y releases.
- Sistema de evidencia que distingue capacidad declarada de capacidad verificada.

### No es

- Una AGI.
- Un sistema completamente independiente de proveedores externos.
- Un foundation model propio ya entrenado a escala.
- Criptografía poscuántica productiva cuando el componente está definido como simulación.
- Un sistema de dinero real Production-Verified sin evidencia operacional.
- Una certificación independiente derivada únicamente de CI.
- Una afirmación de soberanía jurídica sobre infraestructura de terceros.

---

# 2. Estado de ingeniería

| Dominio | Estado | Interpretación |
|---|---|---|
| Código fuente | **Activo** | Desarrollo continuo sobre `main`. |
| Arquitectura FGAIS | **Implementada en múltiples planos** | Existen contratos, gates, governance y documentación; no todo es Production-Verified. |
| Web / SSR | **Endurecido** | El shell público separa el grafo browser-only del SSR. |
| Interfaz Isabella | **Implementada** | C.R.O.W.N. y módulos visuales existen; la validación final depende del despliegue. |
| Inferencia | **Federada / provider-backed** | Gemini integrado; la aprobación durable multi-instancia aún requiere infraestructura persistente. |
| PostgreSQL | **Autoridad prevista para producción** | Requiere configuración, migraciones y evidencia operacional correctas. |
| Auditoría | **Implementada / parcial según subsistema** | Existen hash chains, correlación y controles; ciertas propiedades requieren pruebas concurrentes/externas. |
| Seguridad | **Endurecida / parcial** | Existen controles importantes; CSP estricto con nonce y controles de infraestructura requieren evidencia final. |
| Economía | **Implementada por capas** | Dinero real requiere pruebas de producción, reconciliación y restore. |
| Federación | **En evolución** | Secure-update gates existen; replay/durabilidad multi-instancia requiere persistencia. |
| Learning Plane | **En evolución** | Contratos y release gates existen; entrenamiento fundacional requiere infraestructura externa. |
| Foundation Model propio | **Roadmap** | GENESIS-0…GENESIS-4. |
| Certificación | **No automática** | La evidencia determina el nivel de afirmación. |

> Una capacidad puede estar `Implemented`, `Tested` o `Verified` en un subsistema sin que el sistema completo sea `Production-Verified`.

---

# 3. Genesis 2.0 y correspondencia estricta

La gobernanza del proyecto exige correspondencia entre afirmaciones y evidencia:

```text
Claim
  ↓
Implementation / Policy
  ↓
Evidence
  ↓
Verification
  ↓
Production verification
```

Ninguna capacidad debe declararse `Verified` o `Production-Verified` sin evidencia reproducible apropiada.

Fuentes normativas principales:

- `docs/governance/01-FGAIS-Governance-Constitution.md`
- `docs/governance/EVIDENCE-MAP.md`
- `docs/architecture/`
- `docs/operations/`

---

# 4. Arquitectura FGAIS

```text
┌───────────────────────────────────────────────────────────────┐
│                    PRESENTATION PLANE                         │
│ C.R.O.W.N. · Terminal · Dashboards · Visual Intelligence      │
└──────────────────────────────┬────────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────────┐
│                    INTERACTION / API PLANE                    │
│ TanStack Routes · validation · auth · rate limits · contracts │
└──────────────────────────────┬────────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────────┐
│                    GOVERNANCE PLANE                           │
│ CROWN · policy · authorization · capabilities · approvals    │
└──────────────────────────────┬────────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────────┐
│                    INTELLIGENCE PLANE                         │
│ Registry · Router · Providers · Evaluation · Model Health     │
└──────────────────────────────┬────────────────────────────────┘
                               │
┌───────────────┬──────────────▼──────────────┬─────────────────┐
│ MEMORY / DATA │ LEARNING / GENESIS          │ EXECUTION       │
│ PostgreSQL    │ datasets · runs · releases  │ tools · skills  │
│ audit · state │ evaluation · federation    │ authority       │
└───────────────┴──────────────┬──────────────┴─────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────────┐
│                 EVIDENCE / OBSERVABILITY PLANE                │
│ traces · audit · hashes · manifests · OTLP · release gates    │
└───────────────────────────────────────────────────────────────┘
```

Flujo canónico:

```text
Perceive → Identify → Remember → Validate → Govern → Decide
→ Authorize → Approve → Execute → Validate → Audit → Observe → Recover
```

---

# 5. Gobernanza y autoridad

CROWN y los módulos asociados concentran conceptos de política, autorización, ejecución y parada de capacidades.

Componentes relevantes:

- `src/lib/crown.ts`
- `src/lib/constitutional-gate.ts`
- `src/lib/policy-engine.ts`
- `src/lib/authorization.ts`
- `src/lib/execution-authority.ts`
- `src/lib/kill-switch.ts`

Principios:

1. **Capability ≠ Authority.**
2. **Deny by default.**
3. **Human sovereignty.**
4. **Zero Trust.**
5. **Tenant isolation.**
6. **Traceability.**
7. **Explicit degradation.**
8. **Fail closed for critical authorities.**
9. **Evidence before certification.**
10. **No silent provider fallback.**

---

# 6. Plano de inteligencia federada

`src/lib/intelligence/` contiene contratos y componentes para proveedores y modelos.

```text
src/lib/intelligence/
├── contracts.ts
├── model-registry.ts
├── router.ts
├── gemini-provider.ts
├── openai-compatible-provider.ts
└── index.ts
```

La inicialización registra Gemini sin confundir registro con autorización: el código indica que la aprobación de producción debe provenir del registro de gobernanza durable. fileciteturn543file0

El registro runtime actual utiliza estructuras en memoria para parte del catálogo; por ello **no debe presentarse como un registro durable de aprobación multi-instancia** hasta completar su persistencia y evidencia correspondiente. fileciteturn544file0

Modelo de autoridad:

```text
Provider discovered
       ↓
Registered
       ↓
Evaluated
       ↓
Policy / license / provenance checks
       ↓
Approved
       ↓
Production enabled
       ↓
Health monitored
       ↓
Revocable
```

---

# 7. Inferencia y modelos

En producción, la ausencia de la configuración requerida de inferencia debe producir una indisponibilidad explícita, no un fallback generativo silencioso.

`src/lib/isabella-native-ml.ts` contiene un motor local determinista de clasificación. **No es generativo y no constituye un foundation model.**

### Genesis roadmap

```text
GENESIS-0  Federación y gobernanza de modelos
    ↓
GENESIS-1  Modelos especializados
    ↓
GENESIS-2  Distillation / compression
    ↓
GENESIS-3  Continued pretraining + federated learning
    ↓
GENESIS-4  Foundation model propio
```

GENESIS-4 requiere cómputo, datasets legalmente utilizables, provenance, entrenamiento reproducible, checkpoints, evaluación, artefactos firmados y release verificable.

---

# 8. Learning Plane

El plano de aprendizaje contempla:

- dataset registry;
- provenance;
- curación y validación;
- training policies;
- training runs;
- fine-tuning;
- distillation;
- preference learning;
- synthetic data governance;
- contamination checks;
- evaluations;
- model releases;
- federation / secure update gates.

Entidades de migración relevantes incluyen:

```text
fgais_datasets
fgais_models
fgais_training_runs
fgais_evaluations
fgais_model_releases
```

El aprendizaje no debe consumir indiscriminadamente Internet como dataset. Los datos de entrenamiento requieren procedencia, licencia, integridad y aprobación adecuadas al caso.

---

# 9. Federación segura

Un update federado debe controlar, como mínimo:

- identidad del nodo;
- integridad;
- firma;
- freshness/timestamp;
- replay protection;
- límites de tamaño y magnitud;
- provenance;
- autorización;
- auditoría;
- persistencia del estado anti-replay.

Un estado anti-replay solamente en memoria no constituye evidencia de federación distribuida Production-Verified.

---

# 10. Seguridad

| Control | Estado |
|---|---|
| Sovereign authentication en rutas sensibles | Implemented |
| Tenant derivado de identidad | Implemented |
| Validación Zod | Implemented |
| Límites de entrada | Implemented |
| Rate limiting distribuido | Partial / depende de infraestructura |
| Egress allowlist / SSRF controls | Implemented |
| Idempotencia | Implemented en varios flujos; verificar por operación |
| `traceId` / `correlationId` | Implemented |
| Redacción de secretos | Implemented |
| Dev-auth bloqueado en producción | Implemented |
| CSP estricto con nonce | Partial / evidencia final pendiente |
| Kill switch | Implemented; evidencia operacional pendiente |
| Sandbox fuerte | Requiere pruebas reales de aislamiento |

La existencia de una función llamada `sandbox`, `audit` o `authorize` no constituye por sí misma evidencia de seguridad.

---

# 11. Persistencia y fuentes de verdad

La arquitectura define PostgreSQL como autoridad relacional para estado crítico de producción.

```text
DATABASE_URL
     ↓
PostgreSQL
     ├── application state
     ├── governance state
     ├── model approvals
     ├── audit state
     ├── economic events
     └── learning metadata
```

El repositorio conserva integraciones con múltiples proveedores/ORMs. Esta coexistencia debe considerarse deuda de consolidación cuando represente fuentes de verdad competidoras.

Para estado crítico:

```text
ONE AUTHORITATIVE WRITE MODEL
        ↓
TRANSACTION
        ↓
IDEMPOTENCY
        ↓
AUDIT
        ↓
RECONCILIATION
```

---

# 12. Auditoría y evidencia

Hashes y manifests proporcionan integridad respecto de los datos que cubren; un hash por sí solo no demuestra autenticidad independiente, inmutabilidad externa ni ausencia de compromiso del generador.

Niveles de evidencia:

```text
E0  DECLARED
    ↓
E1  STATIC VERIFIED
    ↓
E2  RUNTIME VERIFIED
    ↓
E3  PRODUCTION VERIFIED
    ↓
E4  INDEPENDENTLY ASSURED
```

Un test unitario no convierte una capacidad en E3.

---

# 13. BookPI, economía y pagos

BookPI está orientado a ledger durable y auditable:

- doble partida;
- eventos append-only;
- idempotencia;
- reconciliación;
- claims únicos;
- refunds como nuevos eventos;
- chargebacks explícitos;
- aprobaciones sensibles;
- holds/freeze de riesgo;
- separación entre autorización de negocio y ejecución del proveedor.

**Código Stripe no equivale a pagos Production-Verified.** Se requieren pruebas de webhook, idempotencia, concurrencia, reconciliación, recuperación y restore.

---

# 14. Interfaz visual y estabilidad SSR

La interfaz es parte del producto.

La entrada `/` mantiene una frontera explícita:

```text
SSR
 │
 ├── metadata
 ├── accessible fallback
 └── NO browser-only graph
          │
          ▼
      Browser
          │
          ▼
 IsabellaClientApp
          ├── C.R.O.W.N.
          ├── Terminal
          ├── Navigation
          ├── Dashboards
          ├── Three.js / Starfield
          └── interactive intelligence UI
```

`src/routes/index.tsx` mantiene el entrypoint SSR pequeño y carga `IsabellaClientApp` lazy únicamente cuando existe `window`. fileciteturn545file0

Esto evita que código browser-only inicializado durante SSR impida entregar el documento público.

---

# 15. Runtime HTTP

`src/server.ts` funciona como frontera de correlación, validación y seguridad. El SSR público no debe depender obligatoriamente de PostgreSQL.

La hidratación universal de estado soberano fue retirada del camino SSR público. Las rutas stateful deben exigir sus dependencias y fallar cerradas cuando corresponda; `/` puede renderizar su shell público sin convertir una caída de estado externo en una caída total de la superficie pública.

Cadena conceptual:

```text
Request
  ↓
Request context
  ↓
Body limits
  ↓
Runtime integrity signal
  ↓
TanStack server entry
  ↓
Response normalization
  ↓
Security headers
```

---

# 16. Stack

El proyecto usa actualmente, entre otros:

- TypeScript;
- React 19;
- TanStack Start / Router;
- Vite;
- Nitro;
- Tailwind CSS;
- Radix UI;
- Zod;
- Vitest;
- PostgreSQL / `pg`;
- Prisma;
- Supabase integrations;
- Neon integrations;
- Redis / Upstash integrations;
- Stripe;
- Gemini provider;
- Three.js;
- OpenTelemetry/OTLP components.

El `package.json` fija `pnpm@10.15.0`, Node `>=22`, React 19 y scripts para build, typecheck, lint, tests, DB, capabilities, route audit y security scan. fileciteturn542file0

---

# 17. Desarrollo local

Requisitos:

- Node.js >= 22
- pnpm 10.15.0
- PostgreSQL para funcionalidades stateful
- secretos únicamente mediante entorno

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Producción local:

```bash
pnpm build
pnpm start
```

---

# 18. Quality gates

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm security:scan
pnpm capabilities
pnpm audit:routes
pnpm db:verify
pnpm build
```

Suites específicas:

```bash
pnpm test:unit
pnpm test:integration
pnpm test:bookpi
pnpm test:security
```

Con PostgreSQL se deben ejecutar además migraciones, concurrencia, idempotencia, restore y reconciliación.

---

# 19. CI/CD y release engineering

El gate FGAIS incluye actualmente instalación congelada, typecheck, lint, tests, sanitización, capability matrix y route audit.

La madurez objetivo de release es:

```text
source SHA
   =
CI-approved SHA
   =
audited SHA
   =
artifact SHA
   =
deployed SHA
```

Y debe incorporar, según el nivel de riesgo:

- SBOM;
- provenance;
- artifact signing;
- dependency/secret scanning;
- migration checks;
- rollback;
- restore drill;
- deployment smoke tests;
- runtime health checks;
- pruebas externas de seguridad.

---

# 20. Vercel

TanStack Start soporta Vercel mediante Nitro y la documentación oficial recomienda configurar explícitamente el framework `tanstack-start`; Vercel mantiene una guía específica para TanStack Start + Nitro. citeturn0search0turn0search2

La aplicación utiliza Vite + TanStack Start + Nitro para producir el runtime compatible con Vercel.

### Entorno

Los secretos privados no deben exponerse mediante código cliente ni variables `VITE_*`.

Variables críticas, según subsistema:

```text
NODE_ENV
ISABELLA_RUNTIME_MODE
PUBLIC_URL
DATABASE_URL
DATABASE_DIRECT_URL
SUPABASE_URL
SUPABASE_ANON_KEY
AUTH_JWT_SECRET
GEMINI_API_KEY
ENCRYPTION_MASTER_KEY
CROWN_POLICY_SIGNING_KEY
AEGIS_AUDIT_SECRET
BOOKPI_SIGNING_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
REDIS / KV configuration
OTEL configuration
```

La obligatoriedad final se determina por el esquema de entorno y el modo de runtime, no por esta lista documental.

---

# 21. Health model

```text
/api/health/live
    ↓
¿El proceso responde?

/api/health/ready
    ↓
¿Está preparado para tráfico que requiere dependencias críticas?

/api/health/deep
    ↓
¿Las dependencias verificables están operativas?
```

Liveness debe permanecer independiente de PostgreSQL. Readiness puede fallar cuando una autoridad crítica no está disponible.

---

# 22. Estructura del repositorio

```text
src/
├── components/isabella/       # UI y experiencia cognitiva
├── routes/                    # autoridad TanStack Start
│   ├── index.tsx              # shell público SSR-safe
│   ├── __root.tsx              # documento raíz / error boundary
│   └── api/                    # rutas API
├── server-routes/             # handlers en transición/consolidación
├── lib/
│   ├── intelligence/          # providers, registry, router
│   ├── governance/             # governance helpers
│   ├── repositories/           # persistencia
│   ├── accounting/             # BookPI
│   ├── federation/             # federated updates
│   ├── genesis-model/          # model release contracts
│   ├── learning/               # learning plane
│   ├── sandbox/                # ejecución aislada
│   └── security/               # controles
├── server.ts                   # frontera HTTP/runtime
└── routeTree.gen.ts             # generado

docs/
├── governance/
├── architecture/
├── operations/
└── api/

prisma/
supabase/migrations/
scripts/
.github/workflows/
```

La dirección arquitectónica es que `src/routes/**` sea la autoridad de routing y `routeTree.gen.ts` sea generado. La coexistencia de handlers bajo `src/server-routes/**` es deuda de consolidación cuando duplique autoridad.

---

# 23. Gobernanza jurídica, ética y académica

Este repositorio es un artefacto técnico/de investigación aplicada. Su documentación no constituye por sí sola asesoría jurídica, certificación, auditoría independiente o aprobación regulatoria.

Las afirmaciones sobre soberanía, propiedad intelectual, privacidad, jurisdicción, cumplimiento, seguridad, originalidad, precedencia histórica o certificación requieren evidencia apropiada y, cuando corresponda, revisión profesional independiente.

Para datos personales y entrenamiento se deben considerar finalidad, minimización, retención, acceso, eliminación, transferencias, licencia, provenance, copyright, consentimiento cuando aplique y riesgos de memorización/contaminación.

---

# 24. Supply chain

Un release serio debe responder:

```text
¿Qué código fue desplegado?
¿Quién lo aprobó?
¿Qué dependencias contiene?
¿Qué artefacto produjo CI?
¿Qué hash tiene?
¿Qué configuración tenía?
¿Qué migraciones se aplicaron?
¿Qué pruebas pasaron?
¿Qué evidencia generaron?
¿Qué SHA está ejecutando producción?
```

Madurez objetivo:

- SBOM;
- provenance/SLSA cuando aplique;
- firma de artefactos;
- dependency scanning;
- secret scanning bloqueante;
- vulnerability policy;
- build reproducible;
- attestations;
- deployment SHA verification.

---

# 25. Findings y riesgo

Ciclo recomendado:

```text
OPEN → ACKNOWLEDGED → MITIGATION_PLANNED → MITIGATED → VALIDATING → VERIFIED
```

Estados alternativos controlados:

```text
REOPENED · ACCEPTED_RISK · EXPIRED
```

Un riesgo aceptado requiere owner, aprobador, alcance, expiración y evidencia.

---

# 26. Trabajo pendiente

## P0 — Producción

- Verificación real del deployment y SHA servido públicamente.
- Smoke tests contra `/`, `/api/health/live` y `/api/health/ready`.
- Correlación deployment SHA = commit auditado.
- Confirmación de variables del entorno productivo.
- Validación runtime de C.R.O.W.N.

## P1 — Durabilidad y autoridad

- Model Registry durable en PostgreSQL.
- Replay protection federado durable.
- Pruebas multi-instancia.
- Consolidación de providers/ORMs como fuentes de verdad.
- Transacciones financieras y reconciliación completas.
- Restore drill verificable.
- CSP nonce enforcement real.

## P2 — Madurez

- SBOM/provenance automatizados.
- Artifact signing.
- DAST/pentest independiente.
- Observabilidad centralizada obligatoria.
- Pruebas de aislamiento sandbox.
- Evaluación sistemática de modelos/datasets.
- Consolidación de `src/server-routes/**`.

## P3 — Investigación

- Modelos especializados.
- Distillation.
- Continued pretraining.
- Federated learning a escala.
- Foundation model Genesis-4.

---

# 27. Definición de versión funcional

Una versión funcional significa que el sistema tiene una superficie ejecutable y gobernada, no que todas las metas futuras estén terminadas:

```text
[✓] Shell público independiente de DB
[✓] Aislamiento del grafo browser-only respecto de SSR
[✓] Health liveness
[✓] Health readiness
[✓] Plano de inteligencia federada
[✓] Governance / authority gates
[✓] Auditoría y correlación
[✓] Build reproducible
[✓] CI técnico
[ ] Production-Verified requiere evidencia del entorno
[ ] Pagos reales requieren evidencia operacional
[ ] Federación multi-instancia requiere estado durable
```

La palabra **funcional** no debe utilizarse para esconder limitaciones de producción; `Production-Verified` es una categoría de evidencia superior.

---

# 28. Política de declaraciones públicas

Permitido cuando exista evidencia:

- Implemented
- Tested
- Verified
- Production-Verified

Requieren calificación y evidencia:

- soberano;
- autónomo;
- seguro;
- fundacional;
- poscuántico;
- certificado;
- primero;
- único;
- 100%;
- sin dependencia externa.

Nunca sustituir evidencia técnica por lenguaje promocional.

---

# 29. Contribución

1. Leer `AGENTS.md` y governance.
2. Identificar claim/control afectado.
3. Identificar autoridad del cambio.
4. Implementar cambio mínimo reversible.
5. Añadir/actualizar pruebas.
6. Actualizar evidencia.
7. Ejecutar gates.
8. Registrar riesgo residual.
9. No introducir secretos.
10. No declarar una capacidad superior a su evidencia.

Prohibido:

- `push --force` sobre historia publicada;
- secrets en el repositorio;
- datos personales innecesarios;
- fallback silencioso;
- simulación presentada como integración real;
- `Verified` sin evidencia;
- `Production-Verified` sin evidencia de producción.

---

# 30. Referencia de despliegue

La documentación oficial de TanStack Start confirma el soporte de Vercel mediante Nitro y la configuración explícita del framework; Vercel mantiene documentación específica para TanStack Start + Nitro. citeturn0search0turn0search2

---

# 31. Declaración final

**Isabella Villaseñor AI — Genesis** no se define por la cantidad de modelos que puede invocar, sino por la capacidad de gobernar aquello que puede hacer.

```text
Capability
    ≠
Authority

Intelligence
    + Governance
    + Identity
    + Policy
    + Evidence
    + Audit
    + Human sovereignty
    = FGAIS
```

> **Si puede demostrarse, se declara. Si todavía no puede demostrarse, se etiqueta como pendiente.**

**Genesis 2.0 · FGAIS · Nodo Cero · Real del Monte, Hidalgo, México · TAMV ONLINE**
