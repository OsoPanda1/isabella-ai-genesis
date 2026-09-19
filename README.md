# Isabella Villaseñor AI

## Infraestructura cognitiva híbrida, contextual y gobernada

**Repositorio:** `OsoPanda1/isabella-ai-genesis`  
**Arquitectura:** Isabella Villaseñor AI · Ecosistema TAMV ONLINE NETWORK  
**Autoría técnica y arquitectura declarada:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)  
**Ecosistema:** TAMV ONLINE NETWORK · RDM Digital Hub · Nodo Cero · Real del Monte, Hidalgo, México  
**Versión del paquete:** `4.3.3`  
**Node:** `24.11.0` en CI / `>=22 <25` como contrato del paquete  
**Package manager:** pnpm `10.15.4`  
**Runtime objetivo:** TanStack Start + Nitro + Vercel  
**Rama de hardening auditada:** `repair/production-hardening-2026-09-19`  
**Commit auditado en esta revisión:** `f960481becf939b15ba4453dca7cc062e7c21357`

> **Estado actual: PRE-PRODUCCIÓN / HARDENING.** La rama contiene correcciones reales de integración y seguridad, pero la producción no se considera certificada hasta que CI, build de Vercel, smoke/E2E, base de datos, BookPI, carga y evidencia reproducible resulten verificablemente PASS.

---

## 1. Resumen ejecutivo

Isabella Villaseñor AI es una arquitectura cognitiva que separa **percepción, memoria, gobernanza, razonamiento, herramientas, persistencia, identidad y auditoría**. El objetivo técnico no es presentar un modelo de lenguaje como autoridad, sino construir una capa gobernada alrededor de modelos y servicios intercambiables.

La implementación actual contiene:

- gateway canónico de Isabella;
- CROWN como plano de orquestación/gobernanza;
- ARGUS y Constitutional Gate;
- memoria por scopes;
- Sovereign Engine / Sovereign Pipeline;
- registro de skills nativas y skills evolucionadas;
- ejecución endurecida mediante `runIsabellaSkill()`;
- BookPI para trazabilidad económica y de ejecución;
- persistencia PostgreSQL/Neon/Supabase según el contrato de despliegue;
- autenticación, autorización, tenant isolation y RLS;
- NCUA para benchmarks y carga;
- gates de integridad, preflight, seguridad y evidencia;
- integración de monetización con checkout e idempotencia;
- dashboards que deben mostrar datos backend, no métricas inventadas.

### Regla de evidencia

> **La arquitectura se documenta. La funcionalidad se prueba. La producción se demuestra.**

Una capacidad presente en código no se convierte automáticamente en capacidad certificada de producción.

---

## 2. Indicador público de madurez

Los porcentajes siguientes son **estimaciones técnicas separadas por naturaleza**, no porcentaje de líneas de código. La métrica de implementación/integración pondera el estado funcional de los módulos y su integración; la readiness de producción pondera además CI/CD, despliegue, base de datos, E2E, carga y evidencia externa. Esta separación evita penalizar artificialmente una corrección de código porque un proveedor de infraestructura todavía no haya certificado el deployment.

| Dimensión | Estimación | Estado | Bloqueador principal |
|---|---:|---|---|
| Arquitectura e integración | 78% | Consolidación | pruebas cruzadas del sistema completo |
| Interacción Isabella ↔ usuario | 76% | Avanzada | E2E del flujo autenticado completo |
| CROWN / gobernanza | 82% | Avanzada | evidencia bajo carga y proveedores |
| Skills / ejecución | 74% | Integración | validar contratos de todas las skills nativas |
| BookPI / trazabilidad | 78% | Avanzada | certificación real de cadena e integridad |
| Seguridad / JWT / RLS | 70% | Hardening | gates y aislamiento con entorno real |
| Monetización / billing | 75% | Integración | webhook Stripe + pruebas E2E |
| NCUA / rendimiento | 80% | Avanzada | evidencia reproducible 50–500 concurrentes |
| Testing | 72% | En expansión | E2E/regresión y pruebas de frontera |
| CI/CD | 60% | Pendiente | ejecutar gates verdes tras los últimos cambios |
| Vercel / despliegue | 45% | Bloqueado | deployment READY + smoke |
| Observabilidad / evidencia | 68% | Consolidación | paquete de evidencia de producción |
| **Madurez de implementación/integración estimada** | **≈74%** | **Hardening avanzado** | integración E2E y evidencia de runtime |
| **Readiness de producción estimada** | **≈51%** | **No certificada** | CI + Vercel + DB + E2E + carga |
| **Madurez técnica global ponderada** | **≈74%** | **Hardening avanzado** | la certificación productiva se calcula aparte y permanece bloqueada |

**Interpretación:** un módulo puede estar muy avanzado y, aun así, el sistema completo permanecer sin certificar si falla una dependencia, una migración, un gate, una prueba de aislamiento o el despliegue.

**Producción certificada ≠ porcentaje de código implementado.**

---

## 3. Arquitectura cognitiva

| Núcleo | Responsabilidad |
|---|---|
| **CROWN** | Orquestación, ruteo, política y control del flujo cognitivo |
| **ISA** | Presencia, tono y modulación de interacción |
| **SOPHIA** | Investigación, síntesis, evidencia y razonamiento |
| **ORION** | Recuperación y reconstrucción de conocimiento |
| **ARGUS** | Gobernanza, defensa, observabilidad y veto |

La autoridad no reside en el modelo. El modelo opera dentro de un contexto construido y gobernado por el sistema.

### Pipeline canónico

```text
Perceive
   ↓
Remember
   ↓
Policy Gate
   ↓
Decide
   ↓
Act
   ↓
Audit
```

Cada transición crítica debe poder asociarse a identidad, tenant, decisión, correlación y evidencia.

---

## 4. CROWN: corrección de la inconsistencia principal

Una inconsistencia importante detectada durante la auditoría era que CROWN podía producir `governance.systemPrompt`, pero determinadas rutas de inferencia no lo incorporaban realmente al contexto enviado al proveedor.

La implementación corregida aplica el contexto gobernado a:

- AI Gateway;
- Gemini;
- proveedores OpenAI-compatible directos, incluyendo Groq/xAI.

La regla ahora es:

```text
CROWN governance
      +
sanitized cognitive context
      ↓
provider inference
```

Esto evita que un proveedor alternativo pueda recibir únicamente el contexto cognitivo sanitizado y omitir las obligaciones de gobernanza.

**Pendiente de certificación:** comprobar el comportamiento real de cada proveedor mediante pruebas de integración y evidencia de ejecución.

---

## 5. Skills: reconciliación entre catálogo y runtime

El proyecto contiene dos autoridades que cumplen funciones diferentes:

1. `src/lib/skill-registry.ts): catálogo, resolución y metadatos de skills.
2. `src/lib/skills/registry.ts): runtime ejecutable de skills evolucionadas/nativas de bajo nivel.
3. `src/lib/skills/run-skill.ts`: pipeline endurecido de ejecución.

### Hallazgo corregido

El primer endurecimiento intentó exigir que cada ID del catálogo existiera literalmente como key del runtime. Esto era incorrecto para las **skills nativas**, porque algunas están respaldadas por límites de API/capacidad y no por una key homónima de `isabellaSkills`.

La regla corregida distingue:

- **skills nativas del catálogo:** resueltas contra sus límites de capacidad;
- **skills evolucionadas/directamente ejecutables:** deben tener runtime real.

Esto evita falsos `SKILL_RUNTIME_NOT_FOUND` para las skills nativas sin eliminar la comprobación de runtime de las skills que realmente requieren ejecución directa.

### Ejecución endurecida

```text
skill request
   ↓
identity
   ↓
schema validation
   ↓
authorization / CROWN
   ↓
runtime canRun()
   ↓
skill.run()
   ↓
output validation
   ↓
BookPI append
   ↓
response
```

El archivo canónico es:

```text
src/lib/skills/run-skill.ts
```

---

## 6. Interacción Isabella ↔ usuario

El cliente:

1. valida y sanitiza la entrada;
2. resuelve una skill explícita cuando existe;
3. construye contexto de conversación;
4. solicita identidad/sesión;
5. llama al gateway canónico;
6. procesa SSE;
7. conserva trazabilidad local limitada para la experiencia;
8. presenta errores de forma explícita.

El servidor añade:

- autenticación;
- tenant context;
- rate limiting;
- kill-switch;
- CROWN/ARGUS;
- memoria;
- provider routing;
- telemetría;
- evidencia.

### Principio

El navegador **no es fuente de verdad** para:

- saldo;
- BookPI;
- uso facturable;
- permisos;
- auditoría;
- identidad;
- decisiones de seguridad.

---

## 7. Memoria

Scopes definidos:

- Immediate
- Session
- Project
- Territorial
- Historical

La memoria persistente debe conservar, cuando corresponda:

- procedencia;
- confianza;
- vigencia;
- fuente;
- tenant;
- actor;
- correlación.

No debe convertirse información sensible innecesaria en memoria durable.

---

## 8. Identidad, autorización y multi-tenancy

La arquitectura mantiene separados:

- identidad;
- autenticación;
- autorización;
- tenant context;
- RBAC/ABAC;
- RLS;
- políticas cognitivas;
- auditoría.

### JWT y RLS

El JWT de aplicación y el JWT utilizado por Supabase/PostgREST no deben confundirse.

El principio operativo es:

```text
Identity
  ↓
Principal Context
  ↓
Authorization
  ↓
Tenant Context
  ↓
RLS / repository boundary
```

La ausencia de secretos críticos debe producir comportamiento fail-closed.

---

## 9. Persistencia y Sovereign Engine

La persistencia debe tener una única fuente durable por entorno.

Se distinguen:

- estado cognitivo;
- memoria;
- repositorios;
- adaptadores;
- PostgreSQL/Neon;
- Supabase;
- JSON local de desarrollo.

**Regla:** un fallback de desarrollo no puede convertirse silenciosamente en fuente de verdad productiva.

### Corrección aplicada

El adaptador Neon ahora ordena los eventos de auditoría por `timestamp`, no por `created_at`, porque el esquema de `audit_events` utiliza `timestamp`.

Esto elimina un fallo real que impedía recuperar auditoría correctamente en ese adaptador.

---

## 10. BookPI

BookPI funciona como capa de:

- trazabilidad;
- ledger append-only;
- operaciones económicas;
- coste medido;
- correlación de ejecución;
- integridad.

La ejecución de skills utiliza el repositorio PostgreSQL de BookPI y no genera automáticamente cargos monetarios: solo registra coste cuando el resultado declara explícitamente un `billableCostUsd` válido.

### No confundir

```text
BookPI code exists
      ≠
BookPI production-certified
```

Para certificación deben ejecutarse:

- integridad de cadena;
- aislamiento tenant;
- idempotencia;
- doble partida donde corresponda;
- reconciliación;
- pruebas de concurrencia;
- recuperación.

---

## 11. Monetización

La capa de monetización fue revisada para eliminar señales de simulación.

### Correcciones

- checkout conectado al endpoint real `/api/billing?action=checkout`;
- idempotency key en header y body;
- Personal y Pro como planes de checkout directo;
- Enterprise tratado como contratación institucional;
- ciclos mensual/anual diferenciados;
- métricas de uso sintéticas eliminadas;
- panel de uso muestra `No disponible` cuando el backend no entrega un dato;
- estado financiero se deriva del servidor.

### Corrección de UX

Enterprise ya no aparece como botón muerto: la acción puede abrir el flujo institucional existente.

### Pendiente

- webhook Stripe verificado;
- reconciliación de suscripción;
- pruebas E2E;
- idempotencia bajo reintentos;
- evidencia de conciliación BookPI ↔ Stripe.

---

## 12. Auditoría de seguridad

El dashboard ya no inicia con eventos de seguridad sintéticos.

Los registros deben venir del backend autenticado:

```text
/api/security?action=audit-logs
```

La interfaz falla cerrada cuando:

- no existe sesión;
- el endpoint devuelve error HTTP;
- el store de auditoría no está disponible;
- no existe evidencia positiva del secreto de auditoría.

También se corrigió la semántica para no presentar `severity` como si fuera un nivel AEGIS 0–5.

La UI identifica el dato como **severidad** y el identificador como **evidence ID**.

---

## 13. NCUA y rendimiento

Scripts principales:

```bash
pnpm ncua:benchmark
pnpm ncua:load
```

La suite está destinada a evaluar:

- latencia;
- throughput;
- transferencia;
- concurrencia;
- estabilidad del ERI;
- comportamiento de patching;
- consistencia de operaciones.

La campaña solicitada de referencia es:

```text
50 → 100 → 250 → 500 solicitudes concurrentes
```

Debe conservar:

- commit;
- entorno;
- dataset;
- configuración;
- p50/p95/p99;
- errores;
- MB/s;
- ERI;
- consumo de recursos;
- estado BookPI.

**No se declara un resultado hasta ejecutar la prueba.**

---

## 14. Contrato de producción

### Integridad

```bash
pnpm production:integrity
```

### Preflight

```bash
pnpm production:preflight -- --json
```

### Gate canónico

```bash
pnpm production:gate
```

El gate canónico incluye:

```text
typecheck
→ lint
→ tests
→ repository audit
→ security scan
→ capabilities
→ route audit
→ database verification
→ production integrity
→ production preflight
→ build
→ production evidence
```

### Evidencia

```bash
pnpm production:evidence
```

El generador nunca debe convertir una comprobación no ejecutada en PASS.

---

## 15. Desarrollo local

Requisitos:

```text
Node 24.11.0
pnpm 10.15.4
```

Instalación:

```bash
pnpm install --frozen-lockfile
```

Desarrollo:

```bash
pnpm dev
```

El servidor de Vite se expone en el host configurado por el proyecto; normalmente se utiliza:

```text
http://localhost:5173
```

La aplicación requiere el conjunto de variables definido en `.env.example`. Los secretos de producción no deben copiarse al repositorio.

Validación:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm security:scan
pnpm audit:repository
```

---

## 16. Reproducibilidad

El contrato es:

```json
{
  "packageManager": "pnpm@10.15.4",
  "engines": {
    "node": ">=22 <25"
  }
}
```

CI utiliza Node `24.11.0` y pnpm `10.15.4`.

Vercel también utiliza:

```bash
pnpm install --frozen-lockfile
```

Esto evita que Vercel reconstruya silenciosamente un lockfile diferente del commit evaluado.

---

## 17. CI/CD

Workflows relevantes:

- `.github/workflows/ci.yml`
- `.github/workflows/fgais-gate.yml`
- `.github/workflows/security.yml`
- `.github/workflows/release.yml`

### Estado conocido de la auditoría

Las ejecuciones observadas antes de este último lote de correcciones presentaron fallos en:

- **FGAIS Production Gate**
- **Isabella Genesis — Security Gate**

Además, un deployment de Vercel asociado al commit revisado anteriormente terminó en estado de error.

Por tanto, esas ejecuciones históricas **no se reinterpretan como PASS** después de modificar el código. Deben volver a ejecutarse.

---

## 18. Vercel

Contrato:

```text
Framework: TanStack Start
Build: pnpm run build
Install: pnpm install --frozen-lockfile
Output: .vercel/output
```

Secuencia de liberación:

```text
GitHub
  ↓
frozen install
  ↓
typecheck / lint / tests
  ↓
security / integrity / preflight
  ↓
build
  ↓
Preview
  ↓
smoke / E2E
  ↓
Production
  ↓
runtime verification
```

Un deployment `READY` es necesario pero no suficiente.

---

## 19. Evidence-first production

Un paquete de evidencia completo debe responder:

- commit SHA;
- estado limpio del repositorio;
- Node/pnpm;
- lockfile;
- tests;
- security;
- migraciones;
- build digest;
- deployment ID;
- smoke;
- BookPI;
- tenant isolation;
- NCUA;
- rollback.

Los archivos generados por `production:evidence` diferencian:

- `PASS`;
- `UNVERIFIED`;
- evidencia faltante.

Eso evita que un JSON decorativo sea confundido con certificación.

---

## 20. Sesgos y debilidades detectados

La auditoría no se limitó a errores de compilación. También se revisaron riesgos metodológicos.

### 20.1 Sesgo de implementación

Una función presente en el repositorio puede parecer terminada aunque no esté integrada.

**Corrección:** separar implementación, integración y certificación.

### 20.2 Sesgo de UI

Una interfaz terminada puede sugerir que existe backend funcional.

**Corrección:** dashboards financieros y de seguridad dependen de datos backend reales.

### 20.3 Sesgo de proveedor

Un proveedor puede recibir una política diferente a otro.

**Corrección:** CROWN se incorpora al prompt de inferencia en las rutas revisadas.

### 20.4 Sesgo de evidencia

Un valor hardcoded puede aparentar ser resultado de ejecución.

**Corrección:** el Claim Engine deriva la versión de pnpm del contrato real de `package.json`.

### 20.5 Sesgo de catálogo

Un ID declarativo puede confundirse con una implementación runtime.

**Corrección:** separación entre catálogo de skills nativas y runtime de skills evolucionadas.

### 20.6 Sesgo de fallback

Un fallback local puede terminar actuando como persistencia productiva.

**Corrección:** repository factory y preflight deben fallar cerrado ante configuraciones productivas inválidas.

---

## 21. Checklist de liberación

### Obligatorio

- [ ] conflictos Git = 0
- [ ] typecheck = PASS
- [ ] lint = PASS
- [ ] tests = PASS
- [ ] repository audit = PASS
- [ ] security scan = PASS
- [ ] capability contract = PASS
- [ ] route audit = PASS
- [ ] database verification = PASS
- [ ] production integrity = PASS
- [ ] production preflight = PASS
- [ ] build = PASS
- [ ] Vercel build = PASS

### Producción

- [ ] deployment = READY
- [ ] runtime smoke = PASS
- [ ] E2E = PASS
- [ ] tenant isolation = PASS
- [ ] BookPI integrity = PASS
- [ ] Stripe webhook verification = PASS
- [ ] NCUA 50–500 concurrency = PASS
- [ ] rollback verification = PASS
- [ ] evidence bundle = COMPLETE

### Condición

Si un punto obligatorio no tiene evidencia, el estado debe permanecer **Pre-Producción / Hardening** o **Production Candidate**, nunca **Production Certified**.

---

## 22. Archivos de autoridad técnica

```text
src/server.ts
src/lib/config.ts
src/lib/env-schema.ts
src/lib/principal-context.ts
src/lib/tenant-guard.ts
src/lib/tenant-context.ts
src/lib/authorization.ts
src/lib/rbac.ts
src/lib/abac.ts
src/lib/crown.ts
src/lib/constitutional-gate.ts
src/lib/sovereign-engine.ts
src/lib/sovereign-pipeline.ts
src/lib/memory-engine.ts
src/lib/skill-registry.ts
src/lib/skills/registry.ts
src/lib/skills/run-skill.ts
src/lib/bookpi*.ts
src/lib/repositories/bookpi-repository.ts
src/lib/repositories/audit-repository.ts
src/lib/persistence/repository-factory.ts
src/lib/isabella-chat-gateway.ts
src/server-routes/api/security.ts
src/server-routes/api/billing.ts
supabase/migrations/*
scripts/production-integrity-gate.mjs
scripts/production-preflight.mjs
scripts/production-evidence.mjs
.github/workflows/*
vercel.json
```

La documentación derivada nunca debe convertirse en una autoridad superior al código ejecutable y sus pruebas.

---

## 23. Cambios realizados en esta auditoría

Se corrigieron, entre otros:

1. contrato de instalación congelada en Vercel;
2. duplicidad de permisos en release workflow;
3. variables duplicadas en `.env.example`;
4. mensaje inconsistente del endpoint de billing;
5. acción Enterprise inutilizable en el selector;
6. estados `undefined` en Usage Dashboard;
7. afirmación implícita de renovación automática sin evidencia;
8. estado fail-closed del Security Audit Dashboard;
9. headers de seguridad en respuestas GET de error;
10. lectura opcional del estado del secreto AEGIS;
11. ordenamiento incorrecto de `audit_events`;
12. semántica incorrecta de `aegisLevel`;
13. identificación falsa de un ID como firma criptográfica;
14. CROWN aplicado a proveedores directos;
15. evidencia hardcoded de pnpm;
16. reconciliación entre skills nativas y runtime;
17. gate `production:gate` convertido en contrato más completo;
18. README reconstruido como documento de evidencia y no como marketing técnico.
19. Preflight de Vercel alineado con `pnpm install --frozen-lockfile`.
20. QuantumBridgeMonitor convertido a evidencia-only: se eliminaron latencia, throughput, fidelidad y QNode simulados.
21. QuantumBridgeStatus convertido a evidencia-only: se eliminaron heartbeat, ejecuciones y latencia inventados.
22. CognitiveStatusDashboard dejó de fabricar métricas, logs históricos y resultados de boost; los diagnósticos sin backend pasan a estado no verificado.
23. Production Integrity Gate ampliado para impedir regresiones de telemetría sintética en esos dashboards.

---

## 24. Lo que todavía NO debe afirmarse

No debe afirmarse todavía que Isabella está:

- 100% terminada;
- certificada para producción;
- libre de deuda técnica;
- validada bajo 500 concurrentes;
- certificada por BookPI;
- validada con Stripe en producción;
- validada con tenant isolation en un entorno real;
- desplegada satisfactoriamente en Vercel en el estado final de esta rama.

Esas afirmaciones requieren evidencia.

---

## 25. Próximo gate real

La siguiente secuencia técnica es:

```text
1. Ejecutar GitHub Actions sobre f960481...
2. Analizar logs de cada fallo restante
3. Corregir typecheck/lint/tests/security
4. Ejecutar production:gate
5. Generar build reproducible
6. Obtener deployment Vercel READY
7. Ejecutar smoke/E2E
8. Verificar DB + RLS
9. Ejecutar BookPI integrity
10. Ejecutar NCUA 50/100/250/500
11. Ejecutar pruebas Stripe/idempotencia
12. Generar production-evidence
13. Reauditar el PR
14. Solo entonces evaluar Production Candidate / Production Certified
```

---

## 26. Licenciamiento y atribución

La especificación arquitectónica declara Creative Commons Attribution 4.0 International (CC BY 4.0) para el material al que dicha licencia resulte aplicable. Los componentes de terceros conservan sus respectivas licencias.

**Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)**  
**TAMV ONLINE NETWORK · RDM Digital Hub · Nodo Cero**  
**Real del Monte, Hidalgo, México**

---

## 27. Declaración final

Isabella no se considera lista porque una interfaz parezca terminada.

Se considera lista cuando:

```text
el código compila
+ las políticas gobiernan
+ la identidad se verifica
+ los tenants permanecen aislados
+ la persistencia es durable
+ BookPI conserva integridad
+ las pruebas reproducen el comportamiento
+ la carga demuestra estabilidad
+ CI reproduce el resultado
+ Vercel despliega el mismo artefacto
+ runtime confirma el comportamiento
+ existe evidencia auditable
```

**No te pedimos que nos creas. Te pedimos que lo pruebes.**
