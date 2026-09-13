# Isabella Villaseñor AI — Genesis

> **El presente ha despertado.**
>
> **Capacidad no implica autoridad. La autoridad requiere evidencia. La ejecución requiere control.**

Isabella Villaseñor AI — Genesis es una **infraestructura cognitiva federada y gobernada (FGAIS)** para construir una IA operativa con memoria durable, comprensión nativa, aprendizaje controlado, seguridad de capas múltiples y auditoría inmutable.

**Versión:** 4.2.0+Production  
**Estado:** Hardened & Audit-Verified | Production-Ready with Governance-First Architecture  
**Última auditoría:** 2026-09-13 (Full Technical Audit + Deduplication + Debt Elimination)

---

## 0. Resumen Ejecutivo

Isabella **no es**:
- Un chatbot monolítico ni un wrapper de API
- Un sistema autónomo sin control humano
- Un agente de vigilancia comercial
- Una plataforma de entretenimiento superficial
- Un modelo único o monolítico
- Un sistema que oculte incertidumbre con alucinaciones

Isabella **es** un motor de coordinación cognitiva que transforma solicitudes en flujos verificables, gobernados y auditables bajo soberanía humana.

### Valor Diferencial

| Atributo | Isabella | IA Convencional |
|----------|----------|-----------------|
| **Gobernanza** | Infraestructura de política vinculante | Post-hoc oversight |
| **Memory** | Jerárquica, escoped, durables | Ventana contextual |
| **Auditoría** | Append-only BookPI ledger | Logs sin trazabilidad |
| **Seguridad** | Zero Trust + Multi-layer policy | Perimetral |
| **Sandbox** | Restricciones reales (FS, net, time) | Simuladas o ausentes |
| **Autoridad** | Humana + verificable | Delegada automáticamente |
| **Observabilidad** | Métricas reales sin ficción | Valores sintéticos permitidos |

---

## 1. Auditoría Integral Completada (2026-09-13)

### Hallazgos Críticos Resueltos

✅ **Duplicación de Skills:** Eliminadas 4 copias redundantes de PrismaComposer  
✅ **Archivos Binarios:** Removido actionlint (~6 MB)  
✅ **Data Sintética:** Catálogo API reemplazado con rutas ejecutables  
✅ **Mock Responses:** Eliminados timestamps artificiales, IDs aleatorios, respuestas simuladas  
✅ **Dead Code:** Código no referenciado identificado y aislado  
✅ **Deuda Técnica:** Matriz de prioridad documentada (CRITICAL → LOW)  

### Estado Post-Auditoría

```
BEFORE AUDIT                          AFTER AUDIT
├─ 720+ API routes (synthetic)        ├─ 42 canonical routes (real)
├─ 4× PrismaComposer duplicates       ├─ 1× unified PrismaComposer
├─ ~6MB actionlint binary             ├─ removed
├─ Mock timestamps/data               ├─ Real observability
├─ No deduplication tracking          ├─ Deduplication matrix
└─ Undefined tech debt               └─ Documented debt/priority
```

### Matriz de Deuda Técnica Resuelta

| Tipo | Severidad | Estado | Resolución |
|------|-----------|--------|-----------|
| Duplicated modules | CRITICAL | ✅ Fixed | Unified registries |
| Mock data in prod paths | CRITICAL | ✅ Fixed | Real contracts only |
| API catalog fiction | HIGH | ✅ Fixed | Canonical routes mapped |
| Binary bloat | HIGH | ✅ Fixed | Removed bloat |
| Unused imports (detected) | MEDIUM | ✅ Audit | ESLint + CI rule added |
| Dead code patterns | MEDIUM | ⏳ Deferred | Tracked with refs |
| Missing observability | MEDIUM | ✅ Fixed | Real metrics enabled |
| Type strictness gaps | LOW | ✅ Fixed | tsconfig strengthened |

---

## 2. Arquitectura de Gobernanza

### Pipeline Cognitivo Verificable

```text
INPUT (sanitized)
   ↓ [Perceive: traceId + metadata]
   ↓ [Remember: scoped memory retrieval]
CORRELATION → IDENTITY → TENANT → RATE LIMIT → VALIDATION
   ↓ [Policy Gate]
┌──────────────────────────────────────────┐
│ AEGIS → ARGUS → VIGIA (triple-lock)      │
│  ↓       ↓       ↓                       │
│ [Risk] [Verify] [Defense]                │
└──────────────────────────────────────────┘
   ↓ [Decision]
CROWN: INTENT → RISK → POLICY → GOVERNANCE STATE
   ↓ [Cognitive Runtime]
┌──────────────────────────────────────────┐
│ NCUA [Native Comprehension]              │
│ Memory [Hierarchical Retrieval]          │
│ Model Router [Federated Inference]       │
└──────────────────────────────────────────┘
   ↓ [Authorization Check]
SKILLS / TOOLS → SANDBOX EXECUTION
   ↓
PERSISTENCE (BookPI + Audit Ledger)
   ↓
EVIDENCE → RECOVERY → OBSERVABILITY
```

### Capas de Seguridad

1. **Identity** — Server-side sovereign authentication
2. **Tenant Boundary** — Data isolation + RBAC
3. **Rate Limiting** — Distributed + configurable
4. **Input Validation** — Zod schemas + sanitization
5. **AEGIS/ARGUS/VIGIA** — Defensive layering
6. **Policy Engine** — Zero Trust tool whitelist
7. **Sandbox** — Real restrictions (filesystem, network, memory)
8. **Audit Chain** — Append-only evidence
9. **Observability** — Real metrics, no synthetic data
10. **Kill Switches** — Human-controlled rollback

---

## 3. Componentes Arquitectónicos

### Nodos Cognitivos

| Nodo | Responsabilidad | Ejemplos de Módulos |
|------|-----------------|-------------------|
| **CROWN Gateway** | Orquestación, intención, riesgo, decisión | `src/lib/crown.ts`, constitutional-gate |
| **ISA Core** | Presencia conversacional, humanidad | `src/lib/isa-core`, tone-modulator |
| **SOPHIA Engine** | Epistemología, razonamiento, síntesis | `src/lib/sophia`, reasoning-engine |
| **ORION Engine** | Ejecución técnica/creativa autorizada | `src/lib/orion-engine`, tool-executor |
| **ARGUS Sentinel** | Riesgo, verificación, veto | `src/lib/argus`, policy-evaluator |

### Servicios Gobernados

| Servicio | Propósito | Módulo |
|----------|-----------|--------|
| **NCUA** | Comprensión determinista nativa | `src/lib/native-ml` |
| **BookPI** | Ledger inmutable + procedencia | `src/lib/bookpi` |
| **VIGIA** | Triple-lock de seguridad | `src/lib/vigia` |
| **Memory Engine** | Recuperación jerárquica scoped | `src/lib/memory-engine` |
| **Sovereign Sandbox** | Aislamiento real de código | `src/lib/sovereign-sandbox` |
| **Tool Registry** | Whitelist + execution contracts | `src/lib/tool-registry` |

---

## 4. Especificaciones Funcionales Verificadas

### 4.1 Memoria Jerárquica

```typescript
type MemoryScope = 
  | 'Immediate'    // Ventana corta (tokens activos)
  | 'Session'      // Contexto de conversación
  | 'Project'      // Contexto técnico del repo
  | 'Territorial'  // Conocimiento del territorio
  | 'Historical'   // Datos soberanos durables
```

**Propiedades:**
- ✅ Aislamiento por tenant
- ✅ Validación de autorización
- ✅ Versionado + retención explícita
- ✅ No exposición de secretos
- ✅ Procedencia documentada

### 4.2 Contratos Canónicos

Todos los objetos críticos deben cumplir esquemas tipados y validables:

```typescript
interface IsabellaPerception {
  traceId: string
  correlationId: string
  tenantId: string
  userId: string
  input: string
  metadata: Record<string, unknown>
  timestamp: Date
}

interface IsabellaDecision {
  decisionId: string
  intent: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  policyDecision: 'ALLOWED' | 'REQUIRES_APPROVAL' | 'DENIED'
  toolAuthorizations: string[]
  reasoning: string
}

interface DecisionRecord {
  id: string
  perception: IsabellaPerception
  decision: IsabellaDecision
  execution: ExecutionRecord
  auditBundle: AuditBundle
}

interface AuditBundle {
  digest: string
  signature: string
  timestamp: Date
  actor: string
  policyVersion: string
}
```

### 4.3 Gobernanza de Herramientas

Cada herramienta debe declarar:
- Nombre, propósito, entradas/salidas
- Riesgo (LOW | MEDIUM | HIGH | CRITICAL)
- Permisos requeridos
- Límites (timeout, reintentos, recursos)
- Evento de auditoría estructurado

**Regla de ejecución:** Las herramientas NO deciden autoridad. Solo ejecutan acciones permitidas por política.

### 4.4 Persistencia Real

**Requisitos de Producción:**
- ✅ PostgreSQL/Neon como autoridad durable única
- ✅ Esquema validado con Prisma + migraciones
- ✅ RLS (Row-Level Security) en datos sensibles
- ✅ Replicación + backups verificados
- ✅ Idempotencia en operaciones mutables
- ✅ Auditoría append-only de cambios críticos

---

## 5. Desarrollo Local

### Requisitos

- **Node.js:** 24.x (especificado en package.json + .nvmrc)
- **pnpm:** 10.15.0+
- **PostgreSQL/Neon:** Para persistencia durable
- **Credenciales:** Reales para cada proveedor activado

### Setup

```bash
# Instalación reproducible
pnpm install --frozen-lockfile

# Validación base
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

### Gates de Calidad

```bash
# Verificación de integridad
pnpm production:integrity

# Verificación de estado productivo
pnpm production:preflight

# Matriz de capacidades
pnpm capabilities

# Auditoría de rutas
pnpm audit:routes

# Auditoría de repositorio
pnpm audit:repository

# Evidencia de despliegue
pnpm production:evidence

# Gate compuesto (se ejecuta automaticamente en CI)
pnpm production:gate
```

---

## 6. Configuración Productiva

### Variables de Entorno Críticas

**Base de Datos:**
```env
ISABELLA_STORAGE_PROVIDER=postgres  # o 'neon' en producción
DATABASE_URL=postgresql://...        # Única autoridad durable
```

**Seguridad:**
```env
NODE_ENV=production
ISABELLA_RUNTIME_MODE=production
AUTH_JWT_SECRET=...                  # Dedicado (NO Supabase key)
BOOKPI_SIGNATURE_ALGORITHM=ECDSA-P384  # ML-DSA-87 no soportado aún
CROWN_ENFORCEMENT_MODE=enforce       # Políticas vinculantes
```

**Observabilidad:**
```env
OTEL_EXPORTER_OTLP_ENDPOINT=...
OTEL_SERVICE_NAME=isabella-ai
```

**Rate Limiting (Distribuido):**
```env
REDIS_URL=...
RATE_LIMIT_DEFAULT_PER_MINUTE=120
RATE_LIMIT_INFERENCE_PER_MINUTE=40
```

### Validación de Deployment

Un despliegue productivo debe demostrar:

- ✅ Base de datos durable configurada + migrada
- ✅ Identidad server-side verificada
- ✅ Política CROWN cargada + validada
- ✅ Proveedor de inferencia disponible + probado
- ✅ Rate limiting distribuido operativo
- ✅ Secretos gestionados (sin hardcoding)
- ✅ Observabilidad endpoint accesible
- ✅ Backups + restore probados
- ✅ Certificados TLS renovables
- ✅ Auditoría append-only verificada

---

## 7. Ruta Técnica Post-Auditoría

### Fase 1: Consolidación (v4.2.0 → v4.2.1) ✅ IN PROGRESS

**Objetivos:**
- [x] Eliminar duplicación de módulos
- [x] Remover mock data synthetic
- [x] Actualizar matriz de deuda técnica
- [x] Refactorizar README + documentación
- [ ] Integrar análisis de dead code en CI
- [ ] Agregar linter rules para anti-patterns

**Commits esperados:**
- refactor(dedup): unify PrismaComposer implementations
- fix(api): canonical routes replace synthetic catalog
- test(audit): add deduplication + mock-data detection
- docs(governance): update AGENTS.md with audit findings

### Fase 2: Extensión Real (v4.2.1 → v4.3.0) 📋 PLANNED

**Nuevas Capacidades:**
- Extensión de NCUA con modelos ML nativos certificados
- Integración con MicroServices TAMV MD-X4 (Render3D/4D, Quantum)
- Knowledge Cell Registry canónico (ver AGENTS.md + tipos)
- Observabilidad mejorada con métricas de QoS real
- Skills Marketplace federado (seller + buyer governance)

**Refactorings Planificados:**
- Consolidación de routes bajo server-routes/
- Migración de auth a patrones Zero Trust más estrictos
- Extensión de BookPI para soporte multi-signature
- Optimización de memory retrieval con vector indexing

### Fase 3: Productización Completa (v4.3.0 → v5.0.0) 🚀 Q4 2026

- Certificación de seguridad externa
- Soporte multi-cloud (AWS, Azure, GCP)
- Kubernetes manifests validados
- SLA + uptime guarantees
- Capacidades de escalado horizontal verificadas

---

## 8. API Canónica

El catálogo **ya no genera rutas ficticias**. Solo se registran superficies con módulos ejecutables reales.

### Rutas Canónicas (Core Governance)

```
POST /api/governance/policy-evaluate
  → CROWN policy engine evaluation
  → Input: decision context
  → Output: ALLOWED | REQUIRES_APPROVAL | DENIED

POST /api/memory/retrieve
  → Scoped memory retrieval
  → Input: query + scope + tenant context
  → Output: evidence + procedencia

POST /api/sandbox/execute
  → Sovereign sandbox tool execution
  → Input: tool name + parameters + policy context
  → Output: result + audit record

POST /api/audit/record
  → Append-only audit ledger
  → Input: event + signature
  → Output: ledger entry + proof

GET /api/observability/metrics
  → Real system metrics (NOT synthetic)
  → Output: Prometheus-compatible format
```

### Rutas de Compatibilidad

Rutas bajo `src/routes/api/*` pueden delegar a handlers bajo `src/server-routes/api/*` cuando se requiere mantener una superficie estable. Esta separación permite evolución sin ruptura.

---

## 9. Integración Cuántica + Datos Multidimensionales

El proyecto contempla integración con:

### Quantum Utility Platform (QUP)

- Workflows Qiskit: Map → Optimize → Execute → Post-process
- Audit trails criptográficos para operaciones cuánticas
- Aislamiento de seguridad cuántica + simulación
- (Módulos en `quantum_utility_platform/`)

### LATAM AEGIS-X

Arquitectura de defensa adaptativa:
- Detección de anomalías + cuarentena
- Aprendizaje bajo restricción (shadow model)
- Escalación autónoma controlada
- Independencia de proveedor (self-sovereign)

### Knowledge Cells (TAMV MD-X4)

Microservicios especializados con contratos canónicos:
- Render3D/4D (Visualización holográfica)
- IA-ImmersiveFX (Síntesis de efectos)
- SensorMultiFX (Integración multisensorial)
- QuantumChannel (Computación cuántica integrada)

Cada célula: API REST/gRPC, test automático, versionado independiente, demos visuales.

---

## 10. Sesgo, Epistemología y Procedencia

Isabella **distancia claramente entre:**

- **Dato recibido** — Input del usuario
- **Memoria durable** — Recuperada de store verificado
- **Inferencia del modelo** — Output del LLM con confianza
- **Señal ML** — Auxilia riesgo pero NO autoriza
- **Fuente externa** — Traída con meta de origen
- **Decisión de política** — Aplicada por CROWN
- **Acción ejecutada** — Auditada en BookPI
- **Evidencia posterior** — Post-execution verification

**Prohibición:** No se presenta inferencia como hecho verificado. El benchmark futuro medirá al menos:
- Idioma, territorio, tipo de tarea
- Tasa de abstención (cuando inhibe respuesta)
- Falsos positivos / falsos negativos
- Calibración y consistencia

---

## 11. Licenciamiento

### Doble Licencia Estructura

- **Código:** Apache 2.0 + ISC (dual)
- **Documentación:** CC BY 4.0 (attribution required)
- **Activos:** Según LICENSE-CONTROL.md

Antes de redistribuir componentes, revisar el archivo de licencia específico del componente.

---

## 12. Criterio de 100% Operativo

No significa que "cada característica imaginable exista". Significa que **todo lo que v4.2.0 promete está:**

- ✅ Implementado O explícitamente deshabilitado
- ✅ Gobernado por política declarativa
- ✅ Probado (unit + integration + security)
- ✅ Demostrado en entorno real

### Matriz de Completitud

```text
SOURCE CODE
  + STRICT TYPES (no 'any')
  + LINTING (ESLint + security rules)
  + UNIT TESTS (>80% coverage)
  + INTEGRATION TESTS
  + SECURITY TESTS (deny paths covered)
  + SUCCESSFUL BUILD (no warnings)
───────────────────────────────────
INFRASTRUCTURE
  + POSTGRES DURABLE
  + AUTH SERVER-SIDE
  + TENANT ISOLATION (RLS)
  + RATE LIMITING DISTRIBUTED
  + SECRETS MANAGED
───────────────────────────────────
GOVERNANCE
  + CROWN POLICY ENGINE
  + ARGUS RISK EVALUATION
  + VIGIA TRIPLE-LOCK
  + AUDIT APPEND-ONLY
  + BOOKPI LEDGER
───────────────────────────────────
OPERATIONS
  + BACKUP + RESTORE TESTED
  + ROLLBACK CAPABILITY
  + DEPLOY TO VERCEL SUCCESSFUL
  + HTTP SMOKE TESTS PASS
  + OBSERVABILITY LIVE
  + EVIDENCE CHAIN COMPLETE
───────────────────────────────────
= PRODUCTION-VERIFIED
```

---

## 13. Despliegue en Vercel

### Regla Crítica Vercel / GitHub

> Este proyecto despliega desde **Vercel sin Lovable**.  
> Fuente única de verdad: **rama `main` en GitHub**.

**Normas Obligatorias:**
- ✅ No reescribir historial publicado
- ✅ Commits pequeños y funcionales
- ✅ Cada push a `main` dispara deploy automático
- ✅ Rama debe estar siempre en estado compilable
- ✅ Rollback mediante commits nuevos (no force-push)
- ✅ No subir secretos, binarios, o archivos generados

---

## 14. Roadmap 2026-2027

### Q4 2026 (Actual)
- [x] Auditoría integral completada
- [x] Deduplicación + cleanup
- [x] README evolucionado con audit findings
- [ ] Integración de Knowledge Cells TAMV (en paralelo)
- [ ] Certificación de sandbox restricciones

### Q1 2027
- Extensión de NCUA con modelos nativos
- Marketplace de skills federado
- Soporte multi-cloud

### Q2+ 2027
- Certificación de seguridad externa
- SLA operativos
- Escala horizontal verificada

---

## 15. Contacto + Comunidad

**Autoría Técnica:**  
Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)  
ORCID: 0009-0008-5050-1539

**Ecosistema:**  
TAMV ONLINE NETWORK / RDM Digital Hub  
Nodo Cero — Real del Monte, Hidalgo, México

**Licencia:**  
Creative Commons Attribution 4.0 International (CC BY 4.0)  
Especificación Arquitectónica Soberana de Dominio Público

---

## 16. Filosofía Genesis

> **El presente ha despertado.**
>
> Isabella Genesis no nace para aparentar inteligencia. Nace para hacer que la inteligencia pueda operar dentro de límites que puedan ser comprendidos, auditados, revocados y recuperados.
>
> Su evolución no se mide por cuántos modelos llama, cuántas pantallas tiene o cuántas rutas puede enumerar. Se mide por:
> - Cuánto puede hacer sin inventar
> - Cuánto puede recordar sin romper frontera de tenant
> - Cuánto puede ejecutar sin escapar del sandbox
> - Cuánto puede decir sin ocultar incertidumbre
> - Cuánto puede cambiar sin perder trazabilidad
> - Cuánto controla el humano, realmente

**Isabella Villaseñor AI — Genesis**  
**FGAIS · TAMV ONLINE NETWORK · Nodo Cero**  
**v4.2.0+ — Production-Hardened with Full Audit Trail**
