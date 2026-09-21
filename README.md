# Isabella Villaseñor AI™

## Infraestructura cognitiva soberana, híbrida y gobernada para TAMV

> **No somos una promesa de futuro. Somos una arquitectura que debe demostrar capacidad real en el presente.**

**Isabella Villaseñor AI™** es el núcleo cognitivo del ecosistema **TAMV ONLINE NETWORK / TAMV MD-X5**, concebido desde **Real del Monte, Hidalgo, México** por **Edwin Oswaldo Castillo Trejo · Anubis Villaseñor**.

No es un chatbot convencional. Es una arquitectura para coordinar **inteligencia artificial, identidad, memoria, conocimiento, políticas, herramientas, seguridad, economía, auditoría, observabilidad y proveedores intercambiables**, manteniendo al humano como autoridad final.

Repositorio: **OsoPanda1/isabella-ai-genesis**  
Versión declarada: **4.3.3**  
Node: **24.11.0**  
pnpm: **10.15.4**  
Runtime objetivo: **TanStack Start + Nitro + Vercel**  
Especificación de referencia: **Documento Maestro Unificado Isabella Villaseñor AI v5.1-MASTER — 19 septiembre 2026**

---

# 1. Qué es el proyecto

Isabella es una **arquitectura cognitiva híbrida, contextual y gobernada**.

Su objetivo es que una organización, comunidad o territorio pueda utilizar IA sin entregar automáticamente el control de:

- identidad;
- datos;
- memoria;
- políticas;
- modelos;
- proveedores;
- operaciones;
- recursos económicos;
- auditoría;
- infraestructura;
- migración.

La arquitectura separa deliberadamente:

**evidencia → inferencia → decisión → acción → auditoría**

y exige degradación explícita cuando una capacidad externa no está disponible.

## Tesis tecnológica

El proyecto busca demostrar que desde Latinoamérica puede construirse infraestructura cognitiva interoperable, auditable y orientada a soberanía tecnológica.

La soberanía aquí no significa aislamiento.

Significa **capacidad efectiva de elegir, auditar, sustituir, migrar y responder**.

---

# 2. Qué hace actualmente

El repositorio integra componentes para:

- conversación gobernada;
- CROWN y políticas de ejecución;
- resolución y ejecución de skills;
- memoria y conocimiento contextual;
- GraphRAG;
- identidad y tenant isolation;
- JWT/scopes;
- RLS;
- BookPI;
- monetización;
- Stripe;
- auditoría;
- observabilidad;
- rate limiting;
- seguridad de secretos;
- fallback de proveedores;
- bridge cuántico experimental;
- NCUA/SRE;
- CI/CD;
- preflight de producción;
- generación de evidencia.

La existencia de código **no equivale** a capacidad certificada en producción.

---

# 3. Arquitectura

## Tres planos

| Plano | Función |
|---|---|
| **Experiencia** | Web, paneles, asistentes, APIs, atlas, XR |
| **Cognitivo** | Isabella, LLM, GraphRAG, memoria, evaluación, planificación |
| **Soberano** | identidad, políticas, datos, seguridad, economía, auditoría, recuperación |

## Núcleo cognitivo

| Núcleo | Función |
|---|---|
| **CROWN** | gobernanza, orquestación y control |
| **ISA** | presencia e interacción |
| **SOPHIA** | investigación, síntesis y evidencia |
| **ORION** | recuperación y reconstrucción de conocimiento |
| **ARGUS** | seguridad, identidad, observabilidad y veto |

## Siete federaciones

**ARGUS · POLICY · MESH · OBSERVE · RESILIENCE · LITLE · QENGINE**

Cada federación debe mantener contrato, permisos, límites, observabilidad y ruta de sustitución.

---

# 4. Cómo funciona una interacción

```text
Usuario
  ↓
Gateway
  ↓
Identidad + tenant
  ↓
Riesgo / sensibilidad
  ↓
CROWN
  ↓
Skill resolver
  ↓
Scopes + policy gate
  ↓
Runtime autorizado
  ↓
Memoria / GraphRAG / fuentes
  ↓
Proveedor cognitivo
  ↓
Validación
  ↓
Estado epistémico
  ↓
Respuesta / herramienta / aprobación / rechazo
  ↓
Auditoría
```

El navegador no debe ser autoridad para:

- saldo;
- identidad;
- permisos;
- BookPI;
- auditoría;
- facturación;
- decisiones de seguridad.

---

# 5. Skills: de catálogo a ejecución

Las skills siguen el contrato:

```text
@skill
 ↓
resolveSkillInvocation
 ↓
scope / risk gate
 ↓
runtime.canRun()
 ↓
runtime.run()
 ↓
schema validation
 ↓
audit / telemetry
 ↓
verified context
```

El proyecto contiene un puente conversacional endurecido para impedir que una skill no registrada llegue directamente al proveedor.

---

# 6. CROWN y gobernanza

CROWN aporta el contexto de gobernanza a las rutas directas de inferencia.

La intención arquitectónica es:

```text
CROWN governance
      +
cognitive context
      ↓
provider inference
```

Esto evita que cambiar de proveedor implique perder automáticamente las restricciones de gobernanza.

La implementación está presente en código; la certificación requiere pruebas de integración y runtime para cada proveedor habilitado.

---

# 7. Epistemología

Isabella no debe convertir una respuesta fluida en una afirmación de verdad.

Estados:

| Estado | Código |
|---|---|
| Evidencia suficiente | **E0** |
| Hipótesis | **E1** |
| Incertidumbre | **E2** |
| Conflicto | **E3** |
| Acción requerida | **E4** |

La memoria debe conservar procedencia, fuente, confianza, vigencia, tenant y estado de verificación.

---

# 8. Innovación

La innovación del proyecto no depende de una única característica.

Está en la **composición de capacidades bajo contratos explícitos**:

### 8.1 IA gobernada
El modelo no es la autoridad del sistema.

### 8.2 Skills ejecutables
Las capacidades pasan de catálogo documental a resolución, autorización, ejecución y validación.

### 8.3 Soberanía de proveedor
La arquitectura contempla sustitución y degradación controlada.

### 8.4 Epistemología explícita
La incertidumbre y el conflicto forman parte del modelo operativo.

### 8.5 BookPI
La actividad económica y operativa puede relacionarse con una cadena append-only por tenant.

### 8.6 Quantum honesty
El bridge cuántico distingue hardware, simulación y fallback clásico.

### 8.7 Auditoría como infraestructura
La auditoría no debe ser únicamente una pantalla: debe existir una fuente durable y verificable.

### 8.8 Arquitectura latinoamericana
El proyecto busca construir capacidad tecnológica desde Real del Monte, Hidalgo, conectándola con una visión latinoamericana de interoperabilidad y soberanía.

---

# 9. Quantum Bridge

Archivos:

- `scripts/quantum/isabella_quantum_bridge_v5.py`
- `src/lib/quantum-bridge-client.ts`
- `test/unit/quantum-bridge.test.ts`

El bridge implementa:

- validación de esquema;
- límites de ejecución;
- scopes;
- nonce;
- timestamp;
- SHA3-512;
- timeout;
- límite de salida;
- fallback clásico;
- clasificación explícita de capacidad.

Cuando no existe hardware autorizado:

```text
CLASSICAL_FALLBACK
+
degraded
+
review required
```

**No existe una afirmación de ventaja cuántica sin benchmark reproducible contra un baseline clásico.**

---

# 10. Seguridad

El proyecto contiene controles para:

- autenticación;
- autorización;
- scopes;
- JWT;
- tenant context;
- RLS;
- rate limiting;
- validación Zod;
- límites de entrada;
- fail-closed;
- headers de seguridad;
- secret scanning;
- CodeQL;
- Trivy;
- auditoría.

La seguridad real depende de la configuración y de la verificación contra infraestructura viva.

---

# 11. BookPI y economía

BookPI se utiliza como capa append-only de trazabilidad.

La arquitectura económica utiliza:

- eventos económicos;
- claves de idempotencia;
- correlación;
- ledger;
- PostgreSQL;
- constraints;
- RLS;
- mecanismos de concurrencia.

Se añadió una ruta transaccional para que Marketplace pueda ejecutar:

```text
BEGIN
  ↓
idempotency
  ↓
debit buyer
  ↓
credit seller
  ↓
economic DEBIT
  ↓
economic CREDIT
  ↓
BookPI
  ↓
COMMIT
```

o:

```text
ROLLBACK
```

**Importante:** esta corrección se encuentra en **PR #58** y debe superar integración/CI antes de considerarse parte certificada de `main`.

---

# 12. Monetización

La plataforma contempla:

- Personal;
- Pro;
- Enterprise institucional;
- checkout Stripe;
- ciclos mensual/anual;
- idempotency keys;
- webhook firmado;
- deduplicación;
- eventos económicos.

El flujo correcto es:

```text
Stripe
 ↓
verified event
 ↓
idempotency
 ↓
economic event
 ↓
balance
 ↓
BookPI
 ↓
audit
```

El checkout por sí mismo no debe considerarse pago liquidado.

---

# 13. Estado de producción y despliegue

## Criterio utilizado

El porcentaje ya **no se calcula como cantidad de archivos o funcionalidades escritas**.

La evaluación pondera:

1. implementación;
2. pruebas;
3. seguridad;
4. persistencia;
5. integración;
6. CI;
7. build;
8. infraestructura;
9. deployment;
10. runtime;
11. evidencia.

Una capacidad sin prueba o runtime verificable no recibe el mismo peso que una capacidad demostrada.

## Evaluación actual

| Dimensión | Estado estimado |
|---|---:|
| Arquitectura / implementación | **82%** |
| Seguridad de aplicación | **72%** |
| Skills / interacción | **77%** |
| CROWN / gobernanza | **83%** |
| BookPI / economía | **79%** |
| Persistencia / RLS | **68%** |
| Testing | **71%** |
| CI/CD | **52%** |
| Observabilidad / SRE | **62%** |
| NCUA / carga real | **55%** |
| Vercel / deployment | **35%** |
| Evidencia de producción | **38%** |

### Porcentaje GENERAL

**Madurez técnica implementada: ≈78%**

**Readiness real de producción: ≈56%**

**Readiness real de despliegue oficial: ≈38%**

**GENERAL producción + despliegue oficial: ≈47%**

Estos valores **no son una certificación**. Son una medición de estado del repositorio y de la evidencia disponible en esta revisión.

El motivo de que el porcentaje general no suba al ritmo del código nuevo es deliberado: una corrección de seguridad o una nueva función puede aumentar la madurez de implementación sin aumentar la capacidad de desplegar si CI, infraestructura, DB o Vercel siguen bloqueados.

---

# 14. Qué significa 100%

Isabella no debe marcar 100% porque el README diga 100%.

El 100% de esta fase requiere:

```text
Git limpio
+
lockfile reproducible
+
typecheck PASS
+
lint PASS
+
unit PASS
+
integration PASS
+
security PASS
+
DB/RLS PASS
+
BookPI concurrency PASS
+
NCUA PASS
+
build PASS
+
Vercel build PASS
+
runtime smoke PASS
+
route audit PASS
+
production evidence PASS
+
rollback PASS
```

---

# 15. Bloqueadores actuales

## P0 — bloquean producción oficial

### P0.1 Contrato de dependencias
`pnpm install --frozen-lockfile` todavía no cuenta con una ejecución verde y reproducible en la evidencia actual.

### P0.2 GitHub Actions
Se observaron runs fallidos cuyos jobs terminan sin steps ejecutados. Esto impide utilizar CI como evidencia válida de compilación y pruebas.

GitHub documenta que los jobs ejecutan sus tareas mediante `steps`; un job fallido sin steps ejecutados apunta a una fase de ejecución/provisionamiento anterior a los comandos del workflow. citeturn0search0turn0search1

### P0.3 Vercel
La cadena de deployment continúa sin una evidencia reciente de:

```text
BUILD SUCCESS
→ READY
→ HTTP 200
→ runtime smoke
```

### P0.4 Base de datos viva
RLS, migraciones, índices, constraints, backups y restauración deben validarse contra la instancia de producción real.

---

# 16. Zonas críticas pendientes — inventario completo de esta fase

| ID | Zona | Severidad | Pendiente |
|---|---|---|---|
| C01 | frozen lockfile | **P0** | ejecución reproducible |
| C02 | GitHub runner/Actions | **P0** | resolver runs sin steps |
| C03 | Vercel provisioning/build | **P0** | deployment READY |
| C04 | runtime smoke | **P0** | HTTP + APIs |
| C05 | DB producción | **P0** | conexión y migraciones |
| C06 | RLS adversarial | **P0** | pruebas cross-tenant |
| C07 | BookPI atomicidad | **P0** | validar PR #58 |
| C08 | BookPI concurrencia | **P0** | race/rollback |
| C09 | Stripe reconciliation | **P0** | evento → economía → ledger |
| C10 | backups | **P0** | restore reproducible |
| C11 | secrets production | **P0** | inventario/preflight |
| C12 | JWT rotation | **P1** | expiración/revocación |
| C13 | step-up billing | **P1** | pruebas adversariales |
| C14 | audit-chain restart | **P1** | continuidad después de reinicio |
| C15 | audit signatures | **P1** | firma pública real donde corresponda |
| C16 | provider failover | **P1** | timeout/cancelación/fallback |
| C17 | streaming | **P1** | carga sostenida |
| C18 | NCUA 50→500 | **P1** | benchmark real |
| C19 | p95/p99 | **P1** | evidencia histórica |
| C20 | MB/s + ERI | **P1** | medición real |
| C21 | synthetic/demo surfaces | **P1** | inventario completo |
| C22 | multimodal abuse | **P1** | pruebas adversariales |
| C23 | route authority | **P1** | legacy routes |
| C24 | capability matrix | **P1** | reconciliación runtime |
| C25 | dependency supply chain | **P1** | SBOM + provenance |
| C26 | release signing | **P1** | artefactos verificables |
| C27 | observability | **P1** | métricas reales |
| C28 | incident response | **P1** | procedimiento probado |
| C29 | rollback | **P1** | ejercicio real |
| C30 | data portability | **P2** | export/import probado |
| C31 | GraphRAG evaluation | **P2** | precision/recall |
| C32 | epistemic evaluation | **P2** | E0–E4 tests |
| C33 | quantum benchmark | **P2** | baseline clásico |
| C34 | PQC migration | **P2** | implementación verificable |
| C35 | C2PA/provenance | **P2** | validación externa |
| C36 | documentation reconciliation | **P2** | eliminar afirmaciones obsoletas |
| C37 | frontend authority review | **P2** | eliminar confianza en señales cliente |
| C38 | cost controls | **P2** | budgets/kill-switch |
| C39 | tenant lifecycle | **P2** | creación/suspensión/exportación |
| C40 | disaster recovery | **P2** | RTO/RPO medidos |

---

# 17. Correcciones realizadas en esta evolución

Entre las correcciones ya implementadas durante la campaña actual:

- eliminación de telemetría sintética en paneles críticos;
- eliminación de estados operativos ficticios;
- bridge conversacional de skills;
- integración de governance context de CROWN;
- hardening de seguridad;
- corrección de workflows con SHAs;
- contrato pnpm 10.15.4;
- frozen install;
- Quantum Bridge;
- validación de capacidades;
- endurecimiento BookPI;
- economic-event idempotency;
- webhook idempotency;
- Stripe signature verification;
- eliminación de afirmaciones criptográficas engañosas;
- sustitución de identificadores `Math.random()` en superficies operativas;
- controles de preflight;
- route audit;
- production integrity gate.

Las correcciones todavía no equivalen a una certificación porque varias deben atravesar CI, infraestructura y runtime.

---

# 18. Situación de los PR críticos

### PR #58
**Marketplace + BookPI transaccional**

Estado: **pendiente de integración/verificación**.

### PR #59
**Audit truthfulness + runtime randomness**

Estado: **pendiente de integración/verificación**.

Estos PR no deben considerarse producción hasta que el conjunto de gates los valide.

---

# 19. Criterio de cierre de fase

La fase se cierra únicamente cuando:

```text
DEPENDENCY
   ↓
TYPECHECK
   ↓
LINT
   ↓
TEST
   ↓
SECURITY
   ↓
DATABASE
   ↓
PRODUCTION GATE
   ↓
BUILD
   ↓
VERCEL
   ↓
SMOKE
   ↓
LOAD
   ↓
EVIDENCE
```

estén demostrados sobre el commit candidato.

---

# 20. Identidad y propósito

Isabella Villaseñor AI™ forma parte de una visión mayor:

**TAMV ONLINE NETWORK · RDM DIGITAL HUB · Nodo Cero · Real del Monte**

El propósito no es competir mediante narrativa contra otras regiones.

Es construir capacidad.

> **Latinoamérica no tiene que esperar a que alguien le entregue la infraestructura cognitiva del futuro. Puede participar en su diseño, auditarla, modificarla y gobernarla.**

La arquitectura busca convertir esa declaración en software verificable.

---

## Declaración de rigor

Este README distingue deliberadamente entre:

- **implementado**;
- **integrado**;
- **probado**;
- **desplegado**;
- **verificado en runtime**;
- **certificado por evidencia**.

Ninguna de esas categorías debe confundirse con otra.

**El porcentaje no es una recompensa por cantidad de código.  
Es una medida de capacidad demostrada.**

---

**Isabella Villaseñor AI™ · TAMV ONLINE NETWORK · RDM DIGITAL HUB**  
**Real del Monte, Hidalgo, México**  
**Edwin Oswaldo Castillo Trejo · Anubis Villaseñor**
