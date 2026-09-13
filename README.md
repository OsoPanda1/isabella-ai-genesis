# Isabella Villaseñor AI — Genesis

> **El presente ha despertado.**
>
> **Capacidad no implica autoridad. La autoridad requiere evidencia. La ejecución requiere control.**

Isabella Villaseñor AI — Genesis es una **infraestructura cognitiva federada y gobernada (FGAIS)** para construir una IA operativa con memoria durable, comprensión nativa, aprendizaje controlado, skills, herramientas, inferencia externa, ejecución restringida, gobernanza humana, trazabilidad y recuperación.

No es un chatbot monolítico ni se presenta como AGI, como modelo fundacional propio, como sistema autónomo sin límites ni como plataforma certificada de seguridad. El proyecto separa deliberadamente cuatro planos que suelen confundirse: **capacidad, autorización, ejecución y evidencia**.

## Qué es

Isabella es una capa de coordinación cognitiva que convierte una solicitud en un flujo verificable:

```text
INPUT
  ↓
CORRELATION → IDENTITY → TENANT → RATE LIMIT → VALIDATION
  ↓
AEGIS / ARGUS / VIGIA
  ↓
CROWN: INTENT → RISK → POLICY → DECISION
  ↓
MEMORY / NCUA / SKILLS / MODEL ROUTER
  ↓
HUMAN APPROVAL (cuando aplica)
  ↓
EXECUTION / SANDBOX / CONNECTORS
  ↓
AUDIT → EVIDENCE → OBSERVABILITY → RECOVERY
```

La arquitectura está diseñada para que una capacidad nueva no se convierta automáticamente en autoridad nueva. Una skill puede proponer; una política puede restringir; una persona autorizada puede aprobar; un executor puede ejecutar; el sistema debe dejar evidencia de lo ocurrido.

## Valor técnico

### 1. Gobernanza como infraestructura

CROWN, ARGUS, VIGIA y el pipeline soberano forman un plano de decisión que precede a las operaciones de impacto. Las aprobaciones se vinculan al actor, tenant, request, digest y versión de política, reduciendo el riesgo de reutilizar una autorización fuera de su contexto.

### 2. Multi-tenancy real

El tenant es una frontera de seguridad, no un campo decorativo. Memoria, persistencia, auditoría, conectores y operaciones sensibles deben resolver el sujeto desde el contexto server-side. El cliente nunca es autoridad para seleccionar el tenant o actor de una operación privilegiada.

### 3. Memoria y aprendizaje con límites

Isabella incorpora memoria jerárquica y un runtime cognitivo que puede recuperar contexto durable. La recuperación está sometida a autorización de tenant y scopes. La ausencia de memoria no se convierte silenciosamente en una memoria inventada.

### 4. Comprensión nativa

NCUA aporta capacidades deterministas de comprensión y clasificación sin fingir ser un LLM. El ML nativo funciona como señal auxiliar de riesgo y no como sustituto de la política, de la evidencia ni de la aprobación humana.

### 5. Inferencia federada

La conversación puede utilizar proveedores de inferencia configurados por entorno. El proveedor externo es una dependencia explícita: si no existe configuración válida, el sistema debe fallar de forma gobernada y observable en lugar de fabricar respuestas simuladas.

### 6. Ejecución restringida

El sandbox exige executor real, límites de memoria/tiempo, filesystem restringido, red deshabilitada cuando la política lo exige y artefactos identificables. No se considera suficiente registrar que un sandbox "existe" si no puede ejecutar de manera verificable.

### 7. Economía verificable

Billing, marketplace y BookPI están separados de la autoridad cognitiva. Las operaciones económicas deben ser durables, idempotentes y reconciliables; una clave de Stripe o un SDK instalado no constituye evidencia de que un flujo comercial esté operativo en producción.

### 8. Observabilidad sin ficción

El proyecto privilegia métricas y trazas derivadas del runtime real. No deben publicarse valores ficticios de CPU, temperatura, uptime, latencia, modelos, balances o eventos.

## Componentes principales

| Componente | Responsabilidad |
| --- | --- |
| **CROWN** | Orquestación, intención, riesgo, política, decisión y control de estado. |
| **ISA** | Presencia conversacional, contexto humano y continuidad de interacción. |
| **SOPHIA** | Consistencia, evaluación epistemológica y síntesis. |
| **ORION** | Praxis y ejecución técnica/creativa autorizada. |
| **ARGUS** | Riesgo, verificación, veto y controles defensivos. |
| **VIGIA** | Triple-lock de seguridad para operaciones sensibles. |
| **NCUA** | Comprensión nativa determinista y señales cognitivas auxiliares. |
| **GEMET** | Escalamiento y revisión humana gobernada. |
| **BookPI** | Procedencia, integridad y ledger verificable. |
| **FGAIS** | Marco constitucional de infraestructura cognitiva federada y gobernada. |

## Estado actual — 13 de septiembre de 2026

La rama de hardening de esta intervención parte del commit `075cb60a5345696003b38aafc245af1a7478ce81`, que ya incorpora la corrección de visualización global y habilitación del runtime de Isabella.

En esta fase se ejecutaron cambios reales sobre la rama `v0/debt-elimination-deploy-ready-2026-09-13`:

- se sustituyó el catálogo API sintético por un catálogo canónico basado en rutas ejecutables;
- se eliminaron de ese catálogo los `mockResponse`, IDs aleatorios, timestamps artificiales, credenciales de ejemplo y respuestas simuladas;
- se eliminaron cuatro copias duplicadas del skill de Prisma Composer en `.agents`, `.claude`, `.cursor` y `.devin`;
- se eliminó el binario `actionlint` de ~6 MB versionado dentro del repositorio;
- se preservó la separación entre rutas de compatibilidad y handlers server-side para evitar una eliminación destructiva prematura;
- se creó una rama específica de hardening para que los cambios puedan revisarse antes de llegar a `main`.

### Lo que todavía NO se puede afirmar

No se declara todavía **100% Production-Verified**. La verificación final requiere ejecutar los gates contra un entorno real, confirmar CI remoto verde, comprobar base de datos productiva, migración, backup/restore, secretos/KMS, proveedor de inferencia, smoke HTTP, rollback, observabilidad y las integraciones externas realmente configuradas.

Esto no es una debilidad semántica: es el límite correcto entre **código preparado** y **sistema demostrado en producción**.

## Arquitectura de runtime

```text
React 19 / TanStack Start / Vite
              │
              ▼
       Server-side routes
              │
              ▼
  Sovereign authentication context
              │
              ▼
     CROWN / policy pipeline
       ┌──────┼──────┐
       ▼      ▼      ▼
     ARGUS   VIGIA   AEGIS
       │      │      │
       └──────┼──────┘
              ▼
      Cognitive runtime
       ┌──────┼─────────────┐
       ▼      ▼             ▼
     NCUA   Memory      Model Router
       │      │             │
       └──────┼─────────────┘
              ▼
       Skills / Tools
              │
       ┌──────┴──────┐
       ▼             ▼
    Sandbox      Connectors
       │             │
       └──────┬──────┘
              ▼
    Durable Persistence
              │
       Audit / Evidence
              │
       Recovery / Ops
```

## Persistencia y datos

La producción debe utilizar persistencia durable. El repositorio contiene infraestructura para PostgreSQL/Neon y migraciones; los datos críticos no deben depender de JSON local ni de estado en memoria como fuente de verdad productiva.

La política de datos sigue estos principios:

- aislamiento por tenant;
- mínima autoridad;
- validación de entrada y salida;
- idempotencia para operaciones mutables;
- auditoría de operaciones sensibles;
- retención y recuperación explícitas;
- no exposición de secretos;
- no uso de datos simulados como fuente de verdad.

## Seguridad

La seguridad se implementa en capas:

1. identidad server-side;
2. autorización por scopes y tenant;
3. límites de entrada;
4. rate limiting distribuido;
5. validación Zod;
6. AEGIS/ARGUS/VIGIA;
7. CROWN y aprobación humana;
8. sandbox restringido;
9. secretos y configuración centralizados;
10. auditoría y evidencia;
11. observabilidad;
12. recuperación y kill switch.

El cifrado disponible en el proyecto no debe confundirse con certificación externa. PQC tampoco debe considerarse activo simplemente porque exista un campo de firma o una etiqueta de algoritmo; debe existir una implementación criptográfica funcional, interoperable y verificada antes de declarar esa capacidad como producción.

## Integraciones

El proyecto contempla conectores gobernados y user-scoped para GitHub, Slack y Linear, además de Stripe/Mux y proveedores de inferencia. Cada integración tiene que cumplir el mismo contrato: credencial server-side, scopes mínimos, identificación inequívoca del sujeto, validación de webhook cuando corresponda, protección contra replay, auditoría y revocación.

## Rendimiento y latencia

El objetivo correcto no es prometer "latencia cero" —físicamente no existe— sino minimizar la latencia añadida por Isabella sin sacrificar gobernanza.

Las optimizaciones prioritarias son:

- reutilización de conexiones y pools;
- imports server-side diferidos para rutas que no los necesitan;
- ejecución paralela de checks independientes;
- timeouts explícitos y fail-fast;
- streaming de inferencia;
- caché únicamente para datos no sensibles y con invalidación definida;
- reducción de payloads;
- eliminación de catálogos sintéticos gigantes;
- evitar trabajo de filesystem o serialización en el request path;
- trazas ligeras con cardinalidad controlada;
- consultas indexadas por tenant y tiempo;
- warm paths para configuración validada;
- separación estricta entre liveness barato y readiness profundo.

La corrección visual reciente de CSS se realizó sobre el arranque de la aplicación: el runtime actual integra el stylesheet en el documento y configura `inlineCss` en el build de TanStack Start.

## Desarrollo local

Requisitos declarados por el proyecto:

- Node.js 22.x
- pnpm 10.x
- PostgreSQL/Neon para las funciones que requieren persistencia durable
- credenciales reales para los proveedores que se quieran activar

Instalación reproducible:

```bash
pnpm install --frozen-lockfile
```

Verificación base:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Gates de operación:

```bash
pnpm production:integrity
pnpm production:preflight
pnpm capabilities
pnpm audit:routes
pnpm audit:repository
pnpm production:evidence
```

Gate compuesto:

```bash
pnpm production:gate
```

## Configuración

La configuración de runtime debe atravesar `src/lib/config.ts` y `src/lib/env-schema.ts`. Las variables sensibles pertenecen al entorno de ejecución o al secret manager/KMS; nunca deben escribirse en el repositorio.

Un entorno productivo debe demostrar como mínimo:

- base de datos durable configurada;
- claves de sesión/identidad válidas;
- política CROWN configurada;
- proveedor de inferencia configurado;
- firma BookPI configurada cuando la capacidad esté habilitada;
- rate limiting distribuido disponible;
- secretos gestionados y rotables;
- observabilidad disponible;
- backups y restore probados.

## Contratos de API

El catálogo de API ya no genera 720+ rutas ficticias para aparentar cobertura. El catálogo canónico registra solamente superficies con módulos ejecutables identificables y señala su archivo de implementación.

Esta decisión es deliberada: **una ruta inexistente es mejor que una ruta ficticia presentada como operativa**.

Las rutas de compatibilidad bajo `src/routes/api/*` pueden delegar a handlers canónicos bajo `src/server-routes/api/*` cuando el contrato requiere mantener una superficie estable. Esa duplicación es una frontera de transporte, no dos implementaciones de negocio.

## Gobernanza de IA

Isabella puede:

- interpretar solicitudes;
- recuperar memoria autorizada;
- clasificar señales;
- proponer planes;
- utilizar modelos externos configurados;
- invocar skills gobernadas;
- preparar operaciones;
- solicitar aprobación humana;
- ejecutar acciones permitidas;
- producir evidencia y trazabilidad.

Isabella no obtiene autoridad simplemente por ser capaz de hacer algo. Las operaciones de impacto deben atravesar la política correspondiente.

## Sesgo, epistemología y procedencia

El sistema debe distinguir entre:

- dato recibido del usuario;
- memoria durable;
- inferencia del modelo;
- señal ML;
- fuente externa;
- decisión de política;
- acción ejecutada;
- evidencia posterior.

No se debe presentar una inferencia como hecho verificado. El benchmark futuro debe medir al menos idioma, territorio, tipo de tarea, tasa de abstención, falsos positivos, falsos negativos y calidad de evidencia.

## Licenciamiento

El repositorio define una separación explícita entre código, documentación y activos. El resumen de licencia actual establece doble licencia Apache 2.0/ISC para software, CC BY 4.0 para documentación y CC BY-ND 4.0 para branding/arte/activos territoriales, sujeto a los archivos de licencia correspondientes.

Antes de redistribuir componentes concretos debe revisarse el archivo de licencia que corresponda a ese componente.

## Criterio de 100% operativo

Para Isabella, 100% no significa que cada característica imaginable exista. Significa que **todo lo que v0 promete está implementado o explícitamente deshabilitado, gobernado, probado y demostrado**.

El estado 100% exige simultáneamente:

```text
SOURCE
  + TYPES
  + LINT
  + TESTS
  + SECURITY
  + DATABASE
  + AUTH
  + TENANT ISOLATION
  + GOVERNANCE
  + MEMORY
  + INFERENCE
  + SANDBOX
  + CONNECTORS
  + BILLING
  + AUDIT
  + OBSERVABILITY
  + BACKUP/RESTORE
  + ROLLBACK
  + DEPLOY
  + HTTP SMOKE
  + EVIDENCE
  = PRODUCTION-VERIFIED
```

Hasta que todas esas piezas tengan evidencia real, el sistema debe conservar una etiqueta de estado honesta.

## Documentación normativa

La arquitectura, políticas y operaciones se encuentran en `docs/`, `AGENTS.md` y los RFC/ARC correspondientes. El índice de auditoría debe considerarse una fuente viva: cada hallazgo necesita una decisión, evidencia y criterio de cierre.

## Filosofía Genesis

> **El presente ha despertado.**
>
> Isabella Genesis no nace para aparentar inteligencia. Nace para hacer que la inteligencia pueda operar dentro de límites que puedan ser comprendidos, auditados, revocados y recuperados.
>
> Su evolución no se mide por cuántos modelos llama, cuántas pantallas tiene o cuántas rutas puede enumerar. Se mide por cuánto puede hacer sin inventar, cuánto puede recordar sin romper fronteras, cuánto puede ejecutar sin perder control y cuánto puede demostrar después de haberlo hecho.

**Isabella Villaseñor AI — Genesis**  
**FGAIS · TAMV ONLINE NETWORK · Nodo Cero**  
**v0 — estado de hardening y preparación para despliegue**
