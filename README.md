# Isabella Villaseñor AI

> **Cerebro Operativo y Arquitectura Cognitiva Soberana**  
> *Gemelo Digital Territorial de Real del Monte · Ecosistema TAMV Network / RDM Digital Hub / Nodo Cero*

[![Licencia](https://img.shields.io/badge/Licencia-Mixta_(Apache--2.0%2FISCL--1.0%2FCC_BY_4.0)-blue.svg)](#8-esquema-de-licenciamiento-mixto)
[![Estado](https://img.shields.io/badge/Estado-Operativo_verificado-success.svg)](#2-estado-de-capacidades)
[![Versión](https://img.shields.io/badge/Versión-4.2.0-purple.svg)](#1-ficha-técnica)
[![Gobernanza](https://img.shields.io/badge/Gobernanza-C.R.O.W.N.-info.svg)](#5-malla-de-hardening-de-7-niveles)

**Especificación Técnica y Marco Canónico unificado · Versión 4.2.0**

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Ficha Técnica](#2-ficha-técnica)
3. [Estado de Capacidades](#3-estado-de-capacidades)
4. [Arquitectura del Sistema](#4-arquitectura-del-sistema)
5. [Malla de Hardening de 7 Niveles](#5-malla-de-hardening-de-7-niveles)
6. [Clasificación de Riesgo Operativo](#6-clasificación-de-riesgo-operativo-determinista)
7. [Interfaz, Intro Cinemática y Crystal Glow](#7-interfaz-intro-cinemática-y-crystal-glow)
8. [Esquema de Licenciamiento Mixto](#8-esquema-de-licenciamiento-mixto)
9. [Marco Legal Canónico](#9-marco-legal-canónico)
10. [Hoja de Ruta de Implantación](#10-hoja-de-ruta-de-implantación)
11. [Puesta en Marcha](#11-puesta-en-marcha)
12. [Estructura del Repositorio](#12-estructura-del-repositorio)
13. [Declaración de Responsabilidad](#13-declaración-de-responsabilidad)

---

## 1. Resumen Ejecutivo

**Isabella Villaseñor AI** es una arquitectura cognitiva híbrida, descentralizada y soberana, concebida como el cerebro operativo y la interfaz territorial del **Gemelo Digital de Real del Monte** (Hidalgo, México). Frente a los paradigmas extractivos de la IA corporativa, Isabella implementa un modelo de **soberanía humana y computacional** sustentado en el principio: *"Nacimos para guiar, no para explotar"*.

Isabella no es un chatbot comercial, un wrapper de una API ni un modelo monolítico. Funciona como un **orquestador ético** de gobernanza, memoria pentacapa, inferencia modular y ejecución de herramientas técnicas, bajo supervisión humana: *las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta*.

### Desafío detectado en la IA corporativa

| Vulnerabilidad del mercado | Mitigación en Isabella |
| :--- | :--- |
| **Extracción extractiva de datos** locales y comunitarios sin soberanía. | Memoria pentacapa con soberanía territorial y minimización estricta. |
| **Opacidad y falta de trazabilidad** en el razonamiento y la ejecución. | Libro mayor inmutable **BookPI** con encadenamiento criptográfico. |
| **Ausencia de gobernanza pre-ejecución** (no se puede vetar una acción riesgosa). | Enrutador determinista **C.R.O.W.N.** + filtro **PRAXIS** + aprobación humana (HITL). |
| **Inseguridad ante inyecciones de prompt y contaminación de contexto.** | Malla de hardening de 7 niveles con sanitización anti-Jailbreak y anti-SQLi. |
| **Incertidumbre presentada como certeza** (alucinaciones). | Scoring de riesgo determinista y estados de capacidad transparentes. |

### Propuesta de remedio

Isabella integra un **hardening multicapa de 7 niveles** coordinado por el enrutador determinista **C.R.O.W.N. Gateway**, verificado por el filtro estático **PRAXIS** y registrado en el ledger inmutable **BookPI**. Cada inferencia, consulta territorial y ejecución de API se valida estructuralmente, se escanea contra patrones hostiles y se audita en tiempo real para el operador soberano.

---

## 2. Ficha Técnica

| Dimensión | Especificación Canónica |
| :--- | :--- |
| **Categorización** | Arquitectura Cognitiva de Gobernanza Territorial & Civic Tech |
| **Ecosistema de red** | TAMV Network / RDM Digital Hub / Nodo Cero |
| **Sede territorial** | Real del Monte, Hidalgo, México |
| **Licencia marco** | Mixta (Apache-2.0 / ISCL-1.0 / CC BY 4.0) |
| **Versión de interoperabilidad** | `4.2.0` (compatibilidad `4`, schema `1`, protocolo `1`) |
| **Modos de runtime** | `development` · `staging` · `production` · `emergency` · `maintenance` |

### Stack tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework / SSR** | TanStack Start + TanStack Router (React 19) |
| **UI** | Tailwind CSS 4, Radix UI, shadcn/ui, lucide-react, recharts, sonner |
| **Renderizado 3D** | Three.js (intro cinemática y visualización WebGL) |
| **Validación** | Zod 3 (contratos y esquemas de entorno) |
| **Datos / Auth** | Supabase (PostgreSQL + Auth) vía `@supabase/supabase-js` |
| **Estado / Datos cliente** | TanStack Query |
| **Lenguaje** | TypeScript estricto (`strict: true`) |
| **Pruebas** | Vitest (proyectos unit / integration / e2e / security) |
| **Lint / Format / Seguridad** | ESLint 9 + `eslint-plugin-security`, Prettier, `security:scan` |

---

## 3. Estado de Capacidades

> **Taxonomía canónica (sin porcentajes arbitrarios):** toda capacidad reporta uno de estos estados — `implemented` (funciona, sin prueba formal), `verified` (existe prueba automatizada o verificación reproducible), `experimental`, `simulated` (runtime de respaldo), `shadow`, `planned` o `unavailable`. Ver `src/lib/capability-registry.ts` y `/api/system-state`.

| Capacidad | Estado | Evidencia |
| :--- | :--- | :--- |
| **BUILD** (typecheck / lint / build / test) | `implemented` | Scripts en `package.json`, ejecutables vía CI |
| **CONFIG** (configuración tipada en servidor) | `implemented` | `config.ts` + `env-schema.ts` (Zod), único acceso a `process.env` |
| **SECURITY** (malla de 7 niveles y servidor) | `implemented` | `server.ts`, `input-limits.ts`, `secret-redactor.ts`, `error-contract.ts` |
| **AUTH / TENANCY** (OIDC/JWT/RBAC/tenants) | `implemented` | `principal-context.ts`, `rbac.ts`, `jwt-verifier.ts`, RLS |
| **MEMORY** (memoria pentacapa) | `implemented` | `memory-engine.ts` + tabla `memories` (pgvector) |
| **BOOKPI** (ledger inmutable) | `implemented` | `bookpi*.ts` + tabla `bookpi_ledger` |
| **AUDIT** (auditoría encadenada) | `implemented` | `audit-repository.ts` + tabla `audit_events` |
| **CROWN** (gobernanza / autoridad) | `implemented` | `crown*.ts`, `constitutional-gate.ts` |
| **LLM** (inferencia) | `implemented` | `routes/api/isabella.ts` (requiere `LOVABLE_API_KEY`) |
| **VOICE** (síntesis de voz) | `implemented` | `routes/api/isabella-voice.ts` |
| **MONETIZACIÓN** (suscripción 85/15, retiros, guías) | `implemented` | `src/lib/monetization/` (dominio real, sin mockdata) |
| **TOOLS / ORION** (ejecución de herramientas) | `experimental` | `tool-registry.ts`, `orion-engine.ts` |
| **SANDBOX** (ejecución aislada) | `experimental` | `sovereign-sandbox.ts` (contrato definido) |
| **PQC** (firma post-cuántica) | `unavailable` | `bookpi-pqc.ts` — sin implementación integrada |
| **12 CABEZAS COGNITIVAS** | `configured` | `sovereign-engine.ts` |
| **24 NÚCLEOS ALPHA/BETA** | `configured` | `sovereign-engine.ts` |
| **OIDC externo** | `planned` | `oidc.ts`, `jwks-cache.ts` |

---

## 4. Arquitectura del Sistema

### Pipeline canónico de procesamiento

Toda entrada pasa por el ciclo continuo **Perceive → Remember → Policy Gate → Decide → Act → Audit**:

```text
[Operador humano]
        │
        ▼
┌──────────────┐      ┌──────────────┐      ┌────────────────┐
│  1. PERCEIVE │ ───► │  2. REMEMBER │ ───► │ 3. POLICY GATE │  (ARGUS evalúa riesgo)
│  sanitización│      │  memoria      │      │  allowed/      │
│  + traceId   │      │  pentacapa    │      │  approval/denied│
└──────────────┘      └──────────────┘      └────────────────┘
                                                      │
                                                      ▼
┌──────────────┐      ┌──────────────┐      ┌────────────────┐
│   6. AUDIT   │ ◄─── │    5. ACT    │ ◄─── │   4. DECIDE    │  (C.R.O.W.N. pondera
│  BookPI +    │      │  herramientas │      │  nodos y peso   │   ISA/SOPHIA/ORION/ARGUS)
│  AuditBundle │      │  autorizadas  │      │  del plan       │
└──────────────┘      └──────────────┘      └────────────────┘
        │
        ▼
  [Ledger inmutable BookPI]
```

### Los 5 nodos funcionales

- **CROWN Gateway** — orquestación, ruteo, arbitraje y control de estado. Decide qué nodo responde y con qué peso.
- **ISA Core** — presencia, tono, empatía y modulación expresiva.
- **SOPHIA Engine** — epistemología, razonamiento, síntesis y análisis.
- **ORION Engine** — ejecución, generación, síntesis visual y soporte técnico.
- **ARGUS Sentinel** — gobernanza, defensa, verificación y veto.

### Memoria pentacapa

| Capa | Función | Control |
| :--- | :--- | :--- |
| **Immediate** | Contexto inmediato | Expiración automática |
| **Session** | Coherencia de sesión | TTL y borrado |
| **Project** | Documentos y configuración | Aislamiento por tenant |
| **Territorial** | GIS, sensores y memoria local | Gobernanza territorial y cultural |
| **Historical** | Preservación y auditoría | Retención y licencia explícitas |

Reglas de memoria: no se mezclan scopes sin justificación; no se promocionan inferencias a hechos; se conservan procedencia, confianza, vigencia y fuente; se aplica retención mínima; y **ninguna memoria persistente almacena secretos o PII innecesaria**.

---

## 5. Malla de Hardening de 7 Niveles

Todo el backend (`src/server.ts`, `src/routes/api/*`) se blinda con una cadena de 7 capas:

1. **Validación estricta de esquemas (Zod)**: cada payload entrante se valida contra contratos estructurados; se rechazan campos extra o corruptos en la capa de transporte.
2. **Control de flujo y rate limiting activo**: máximos de peticiones por IP/minuto — 40 req/min en inferencia de texto y 20 req/min en síntesis de voz — para mitigar denegación de servicio.
3. **Verificación de credenciales soberanas**: acceso mediante llaves firmadas electrónicamente (`isa_live_...`) con ámbitos y permisos (_scopes_) específicos.
4. **Cabeceras OWASP**: inyección sistémica de `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security` y `X-Content-Type-Options` para mitigar XSS, *clickjacking* e intercepción de tráfico.
5. **Circuit breaker y fallback seguro ascendente**: `timeout` máximo de 8.5 s en la interacción con APIs externas para evitar colgar el servidor local.
6. **Correlación de telemetría anónima**: `traceId` y `correlationId` no correlacionables para rastrear el pipeline sin exponer datos personales.
7. **Filtro sanitizante anti-inyección de prompts**: escaneo algorítmico contra patrones hostiles, sentencias SQL destructivas (`DROP TABLE`), evasión de instrucciones del sistema y ejecución arbitraria.

> **Prohibiciones absolutas:** sin mockdata en producción (salvo contratos `simulated`); sin `process.env` fuera de `config.ts`; sin decisiones de autorización basadas solo en el cliente; sin ejecución de código arbitrario sin sandbox ni política; sin mutación de BookPI ni de auditoría fuera de sus motores.

---

## 6. Clasificación de Riesgo Operativo (Determinista)

Cada instrucción o invocación de API se pondera con entradas normalizadas en el intervalo `[0.0, 1.0]`:

- **C** — Criticidad (continuidad operativa).
- **S** — Sensibilidad (confidencialidad de los datos).
- **F** — Fidelidad requerida (tolerancia a la alucinación).
- **P** — Impacto potencial (severidad del daño externo).
- **U** — Incertidumbre (estocasticidad de la respuesta).

$$R = 0.25\,C + 0.25\,S + 0.20\,F + 0.15\,P + 0.15\,U$$

| Umbral | Núcleo de procesamiento |
| :--- | :--- |
| `R < 0.35` | Núcleo **Alpha** (Beta en observación) |
| `0.35 ≤ R ≤ 0.64` | Núcleo **Beta** selectivo |
| `0.65 ≤ R ≤ 0.84` | Núcleo **Beta** de cabezas relevantes |
| `R ≥ 0.85` | **Modo EPIC** (Emergency Plan and Immediate Control) — bloqueo hasta aprobación humana |
| Violación de límites | Bloqueo inmediato de la llamada |

> Los umbrales no son garantías: deben calibrarse con pruebas, casos conocidos, revisión humana y resultados históricos.

---

## 7. Interfaz, Intro Cinemática y Crystal Glow

### Navegador triple lateral retráctil

- **Segmento superior (Cognición & Flujos):** Terminal Cognitivo y Consola Retro CLI.
- **Segmento medio (Catálogo & Contratos):** Catálogo de API y monitor C.R.O.W.N. (filtro SAST / salud del enrutador).
- **Segmento inferior (Soberanía & Cuotas):** Suscripción y cuotas (BookPI, membresía) y Estado Constitucional.

### Intro cinemática de entrada (autoplay autorizado)

Al ingresar, la plataforma muestra un **recuadro de ingreso con un botón** que autoriza explícitamente el autoplay del audio y lanza la intro cinemática WebGL (Three.js). Solo al aceptar se inicia la experiencia, y al terminar aparece la interfaz de Isabella. La intro incluye:

- **Audio de fondo** `src/assets/background-audio.mp3` (reproducido tras la autorización del usuario; si el navegador bloquea el autoplay, la experiencia visual continúa de forma degradada).
- Una vez por sesión de pestaña (`sessionStorage`): se muestra en cada ingreso, pero no se repite al recargar dentro de la misma pestaña.
- Omisión accesible mediante el botón *"Omitir Intro · Esc"* y cumplimiento de `prefers-reduced-motion`.

### Efecto óptico "Crystal Glow"

La interfaz emite un destello translúcido según la naturaleza del módulo: **azul eléctrico** (cognición), **violeta real** (contratos/integraciones) y **verde esmeralda** (soberanía y finanzas).

---

## 8. Esquema de Licenciamiento Mixto

| Activo | Licencia |
| :--- | :--- |
| SDKs públicos | Apache-2.0 |
| Utilidades simples | MIT |
| Servicios modificados | AGPLv3 |
| Documentación | CC BY 4.0 |
| Datasets abiertos | CC BY / CC BY-SA / ODbL |
| Datos comunitarios | Licencia comunitaria específica e inmutable |
| Marca Isabella/TAMV | Uso reservado (propiedad industrial) |
| Código nuclear / prompts / políticas | ISCL-1.0 (propietaria TAMV Network) |
| Secretos comerciales | Confidencialidad contractual estricta |

Las licencias de terceros deben conservarse en un **SBOM** y en el inventario de obligaciones del repositorio. La **ISCL-1.0** puede limitar la redistribución comercial del motor, la ingeniería inversa de pesos/prompts y el reentrenamiento no autorizado, pero **nunca** anular derechos fundamentales ni invalidar licencias de código abierto de terceros.

---

## 9. Marco Legal Canónico

Este marco regula Isabella Villaseñor AI, TAMV Network, BookPI, CITEMESH, GEMET, OpenESS, APIs, skills, modelos, memoria, infraestructura, integraciones y despliegues territoriales, para operaciones en México, Latinoamérica, EE. UU. y la UE. **No constituye asesoría jurídica**; debe ser revisado por abogados locales.

> **ISO/IEC 42001** es un sistema de gestión para políticas, riesgos, controles, auditoría y mejora continua; **no certifica automáticamente** a Isabella. **UNESCO** aporta principios éticos que no sustituyen la ley. El **AI Act (UE 2024/1689)** es norma vinculante y exige análisis específico de rol, producto, finalidad y riesgo.

### Título I — Gobernanza Interna

**Art. 1 · Naturaleza del sistema.** Isabella es una plataforma sociotécnica (12 cabezas cognitivas, 24 núcleos Alpha/Beta, memoria pentacapa, herramientas, políticas y operadores). No es una persona jurídica, autoridad, profesional certificado por defecto, fuente infalible, sistema consciente ni garantía de resultados. Toda capacidad declara uno de los estados: `implemented`, `verified`, `experimental`, `simulated`, `shadow`, `planned`, `unavailable`.

**Art. 2 · Principios.** Legalidad, dignidad humana, supervisión humana, seguridad, privacidad, transparencia, proporcionalidad, no discriminación, accesibilidad, reversibilidad, soberanía de datos, auditabilidad, responsabilidad y sostenibilidad.

**Art. 3 · Responsabilidad distribuida.** Comité con funciones separadas (dirección, arquitectura, legal, privacidad, seguridad, custodia criptográfica, operaciones, auditoría, ciencia abierta, territorio/cultura, usuarios). Ninguna persona controla simultáneamente código de producción, claves privadas, despliegue, auditoría, pagos y aprobaciones.

**Art. 4 · Jerarquía normativa.** Ley → resolución de autoridad → contrato → DPA → políticas de privacidad/seguridad → reglamento interno → configuración técnica → preferencia del usuario → prompt.

**Art. 5 · Acciones críticas (HITL).** Pagos, contratos, eliminación de datos, publicación inmutable, cambio de claves, decisiones de salud/laborales/crediticias/judiciales, seguridad pública, infraestructura crítica y exportación internacional requieren aprobación humana, registro en BookPI y controles reforzados. Isabella asiste, pero no sustituye a un profesional o autoridad competente.

### Título II — Datos y Privacidad

**Art. 6 · Clasificación.** Públicos, internos, confidenciales, personales, sensibles, secretos, comunitarios protegidos e infraestructura crítica; cada dato con finalidad, base legal, responsable, tenant, retención, licencia, procedencia, acceso y borrado.

**Art. 7 · Recolección y uso.** Minimización, limitación de finalidad, exactitud, retención limitada, seudonimización, anonimización, cifrado, control de acceso y registro de actividad. No se recolectan datos "por si acaso" ni se entrena con datos de usuarios sin autorización o base legal.

**Art. 8 · Memoria pentacapa.** (ver sección [4](#4-arquitectura-del-sistema)). El usuario dispone de mecanismos de consulta, corrección, exportación, restricción, eliminación y revocación del consentimiento.

**Art. 9 · Datos comunitarios.** Requieren consentimiento informado, aprobación comunitaria, atribución, licencia acordada, control de acceso, corrección, retiro y beneficio compartido. Un DOI/hash no sustituye la autorización cultural.

**Art. 10 · Fuentes externas.** Para GitHub, ORCID, Zenodo, Figshare, OSF o sensores se registra URI, fecha de recuperación, autoría, versión, licencia, hash, tipo, sensibilidad y calidad. La autoría no se infiere por coincidencia de nombres (*OsoPanda1* / *Anubis Villaseñor* se validan por titularidad documental).

**Art. 11 · Transferencias transfronterizas.** Se analizan países, categoría de datos, proveedor y subencargados, base legal, mecanismo (adecuación, SCCs, TIA), medidas suplementarias, residencia y riesgo de acceso gubernamental, conforme a GDPR, LFPDPPP y normas de LATAM.

### Título III — Riesgo, Uso y Cumplimiento

**Art. 12 · Clasificación de impacto.** Fórmula determinista `R` (sección [6](#6-clasificación-de-riesgo-operativo-determinista)).

**Art. 13 · Usos permitidos.** Educación, redacción, programación, investigación, traducción y preservación de lenguas, análisis documental, organización del conocimiento, visualización espacial, hipótesis científicas y auditoría técnica preliminar.

**Art. 14 · Usos prohibidos.** Fraude, malware, phishing, doxxing, acoso, vigilancia ilegal, discriminación algorítmica, manipulación electoral, robo de secretos industriales, elusión de controles y contenido nocivo.

**Art. 15 · Usos restringidos.** Salud, finanzas, justicia, selección laboral, educación de alto impacto, migración, seguridad pública, infraestructura crítica, biometría, datos de menores y prestaciones sociales. Requieren DPIA, base legal explícita, supervisión humana continua, mecanismos de reclamación y apelación.

**Art. 16 · AI Act europeo.** Se determina proveedor, implementador, distribuidor, importador, finalidad, sector, modelo, riesgo y geografía de los afectados.

> [!CAUTION]
> **No** publicar afirmaciones genéricas como *"Isabella cumple con el AI Act"*. La redacción admisible es: **"Se ha iniciado una evaluación de aplicabilidad del Reglamento (UE) 2024/1689 para los productos, funciones y mercados identificados."**

**Art. 17 · EE. UU. y Latinoamérica.** Considerar FTC, NIST AI RMF, CCPA/CPRA, HIPAA/FERPA, SEC (EE. UU.); y LFPDPPP, PROFECO, contratación pública, salud/finanzas/energía, telecomunicaciones, ciberseguridad, PI y tratados de transferencia (México/LATAM).

### Título IV — Contratos, Licencias y Descargos

**Art. 18 · Contratos.** Términos de uso, política de privacidad, DPA, SLA, SOW, NDA, licencias de software y datos, acuerdos de investigación, residencia de datos y acuerdos institucionales. Cada contrato define roles, categorías de datos, subencargados, seguridad, respuesta a incidentes, auditoría mutua, PI, indemnizaciones, terminación, borrado y jurisdicción.

**Art. 19 · Licenciamiento mixto.** (ver sección [8](#8-esquema-de-licenciamiento-mixto)).

**Art. 20 · ISCL-1.0.** Limita redistribución comercial, sublicenciamiento, extracción de pesos/prompts, reentrenamiento no autorizado, elusión de controles y divulgación de secretos; no puede anular derechos fundamentales ni licencias abiertas de terceros.

**Art. 21 · Descargo de responsabilidad.** Isabella es asistencia tecnológica; sus salidas pueden contener errores, omisiones o sesgos y **no** constituyen asesoría médica, jurídica, financiera o técnica certificada. El usuario revisa y asume responsabilidad sobre sus decisiones. La existencia de una fuente, DOI, hash, KEC, VAD o registro BookPI no vuelve una salida verdadera o válida. Isabella puede rechazar o escalar solicitudes ilegales o abusivas.

**Art. 22 · Consentimiento para acciones externas.** Antes de una operación irreversible o transacción, se muestra acción exacta, destinatario, datos/recursos, herramientas, consecuencias, coste decimal, reversibilidad y riesgo; se requiere confirmación expresa y, en críticas, MFA/step-up + llave de idempotencia + ID de aprobación, antes del registro en BookPI.

### Título V — Auditoría y Respuesta ante Incidentes

**Art. 23 · BookPI reforzado.** Registra inmutablemente `run-id`, `trace-id`, `actor hash`, `tenant hash`, `policy version`, `artifact hash`, `tool used`, `decision metadata`, `approval credentials`, `timestamp`, `previous event hash` y `event hash` (encadenamiento). **No** registra prompts literales con datos personales, secretos, claves, PII innecesaria ni datos comunitarios restringidos.

**Art. 24 · Gestión de incidentes.**

| Nivel | Ejemplo | Contención | Notificación |
| :--- | :--- | :--- | :--- |
| **S0 Crítico** | Fuga de llaves / inyección de prompt exitosa | < 1 h | < 24 h |
| **S1 Alto** | Fallas de BookPI / caída del gateway | < 4 h | < 48 h |
| **S2 Medio** | Degradación de voz / CSP omisas | < 24 h | Según informe |
| **S3 Bajo** | Desalineación visual Crystal Glow | Próximo sprint | No requerida |

Flujo obligatorio: identificación → contención → preservación de evidencia → clasificación → evaluación jurídica → notificación → remediación → rollback → comunicación → revisión → cierre (registro en BookPI). La regla de 72 h del GDPR se refiere a la notificación del responsable a la autoridad y **no** es un plazo universal aplicable a todo incidente.

**Art. 25 · Auditoría sistémica.** Programa continuo: auditoría interna trimestral, revisión de privacidad semestral (DPIA), auditoría de seguridad anual (pen-test), auditoría externa independiente, pruebas adversariales (jailbreak), *fairness* testing, pruebas de recuperación y revisión de proveedores. **No** se afirma la obtención de certificados ISO, cumplimiento absoluto o seguridad perfecta sin alcance, fecha, organismo acreditado y evidencia documental.

---

## 10. Hoja de Ruta de Implantación

```text
 FASE 1 · Inicialización (0–30 días)
   ├── Nombrar comités de gobernanza y responsables de custodia
   ├── Matriz legal de cumplimiento local e inventario de datos
   └── Retención mínima de memoria y BookPI básico + aviso de IA

 FASE 2 · Soberanía y Consentimiento (31–90 días)
   ├── Redactar DPA y plantillas DPIA por llamada de API
   ├── Activar consentimientos explícitos de telemetría en la interfaz
   └── Control de acceso por scopes (API keys)

 FASE 3 · Blindaje y Resiliencia (3–6 meses)
   ├── Sandboxing (PRAXIS) para skills externos
   ├── TLS avanzado, seudonimización y módulos HSM/KMS
   └── Pruebas adversariales, auditoría externa y deploys con rollback

 FASE 4 · Certificación y Madurez (6–12 meses)
   ├── Readiness ISO/IEC 42001, 27001 y privacidad 27701
   ├── Descentralización de nodos BookPI en el territorio
   └── Monitoreo continuo de sesgos y métricas éticas
```

---

## 11. Puesta en Marcha

### Requisitos

- Node.js ≥ 20 y gestor de paquetes (el repositorio usa `bun.lock`; `npm`/`pnpm` son compatibles para desarrollo).
- Cuenta **Supabase** para persistencia y autenticación (opcional en desarrollo local).

### Instalación y desarrollo

```bash
# 1. Instalar dependencias
bun install          # o: npm install

# 2. Configurar variables de entorno (ver .env.example)
cp .env.example .env

# 3. Servidor de desarrollo (puerto 3000)
bun run dev          # o: npm run dev
```

### Scripts principales

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `build:production` | Build (dev / producción) |
| `npm run preview` | Previsualización del build |
| `npm run typecheck` | Verificación estricta de tipos |
| `npm run lint` / `lint:fix` | Lint (y auto-corrección) |
| `npm run format` / `format:check` | Formateo (y verificación) |
| `npm test` | Suite completa de pruebas |
| `npm run test:unit` / `integration` / `e2e` / `security` | Suites por proyecto |
| `npm run db:migrate` / `db:verify` | Migraciones y verificación de esquema |
| `npm run security:scan` | Escaneo de seguridad (ESLint + secreto) |

### Configuración de entorno (`.env.example`)

Toda configuración se valida con **Zod** en `env-schema.ts` y solo se accede a través de `config.ts` (nunca `process.env` directo fuera de él). El contrato documenta: Supabase (URL, anon), credenciales de inferencia (`LOVABLE_API_KEY`), autenticación/JWT/realm, cifrado CROWN, BookPI, Redis/rate limiting, gateway de IA, telemetría/redacción y límites de entrada.

---

## 12. Estructura del Repositorio

```text
src/
  assets/            # assets locales (incl. background-audio.mp3, logo)
  components/
    isabella/        # CinematicIntro, CommandLine, MessageStream, TerminalView,
                     #   MonetizationDashboard, ApiCatalogExplorer, ...
    ui/              # primitivas shadcn/ui (Radix)
  lib/
    config.ts        # acceso tipificado a configuración (Zod)
    env-schema.ts    # esquema y claves requeridas por modo
    secrets.ts       # gestión de secretos
    capability-registry.ts  # taxonomía de estados de capacidad
    error-contract.ts / input-limits.ts / secret-redactor.ts
    principal-context.ts / rbac / tenant-guard
    crown*.ts / constitutional-gate.ts ...  # gobernanza
    sovereign-engine.ts / sovereign-sandbox.ts
    monetization/    # types, revenue (85/15), eligibility, guides, withdrawal
    useIsabella.ts   # hook cliente del terminal
  routes/
    __root.tsx       # layout raíz
    index.tsx        # puerta de entrada (intro cinemática) + interfaz Isabella
    api/             # isabella, isabella-voice, catalog, db
  server.ts          # entrada SSR: cadena de seguridad (correlación→validación→headers→handler→audit)
  styles.css
supabase/migrations/ # esquema, RLS, extensiones, constrains, índices
scripts/             # db-migrate, db-verify, secret-scan
```

---

## 13. Declaración de Responsabilidad

Isabella Villaseñor AI se desarrolla con criterios estrictos de transparencia, ética, seguridad, privacidad, supervisión humana y responsabilidad profesional. El sistema puede equivocarse; **ninguna salida debe considerarse automáticamente verdadera, completa, actualizada o adecuada para actuar**.

El usuario conserva el control y la responsabilidad sobre sus datos, instrucciones y decisiones. Isabella informa sus límites, aplica controles razonables, protege la información, registra las acciones críticas, permite correcciones y responde ante incidentes conforme a la ley aplicable.

La responsabilidad del usuario por sus decisiones no elimina las obligaciones de Isabella, sus operadores, proveedores, implementadores, distribuidores o aliados. Toda limitación de responsabilidad se aplica solo en la medida permitida por la ley.

El blindaje más fuerte de Isabella no radica en exenciones absolutas, sino en la coexistencia de **contratos transparentes, minimización estricta de datos, seguridad técnica de 7 niveles, supervisión humana activa y auditoría criptográfica reproducible**.

---

*Documento maestro unificado a partir de la especificación técnica y el marco legal canónico. Versión 4.2.0 · Ecosistema TAMV Network / RDM Digital Hub · Nodo Cero, Real del Monte, Hidalgo.*
