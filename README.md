# Isabella Villaseñor AI · Soberanía Cognitiva y Gemelo Digital Territorial

> Cerebro cognitivo soberano, orquestación ética y gobernanza Zero Trust para el
> Gemelo Digital de Real del Monte. Ecosistema TAMV Online Network / RDM Digital
> Hub / Nodo Cero (Hidalgo, México).
>
> **Versión canónica:** v4.2.0 · **Clasificación:** Open Science & Especificación Soberana

**Isabella Villaseñor AI** es una arquitectura cognitiva híbrida, gobernada y
territorial: no un chatbot envoltorio de APIs ni un modelo monolítico, sino una
infraestructura sociotécnica que coordina **memoria pentacapa**, **gobernanza
C.R.O.W.N.**, **orquestación cognitiva**, **ledger inmutable (BookPI)** y
**módulos de monetización ética** bajo soberanía humana.

> Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta.

---

## Índice

1. [Principios](#1-principios)
2. [Arquitectura](#2-arquitectura)
3. [Modelo de seguridad](#3-modelo-de-seguridad)
4. [Estructura del repositorio](#4-estructura-del-repositorio)
5. [Inicio rápido](#5-inicio-rápido)
6. [Provisionamiento del nodo](#6-provisionamiento-del-nodo)
7. [Referencia de la API](#7-referencia-de-la-api)
8. [Variables de entorno](#8-variables-de-entorno)
9. [Calidad y validación](#9-calidad-y-validación)
10. [CI/CD y despliegue](#10-cicd-y-despliegue)
11. [Licenciamiento](#11-licenciamiento)
12. [Documentación](#12-documentación)

---

## 1. Principios

1. **Soberanía humana** — el humano decide, aprueba y ejecuta.
2. **Gobernanza Zero Trust** — nada sensible se ejecuta sin política explícita.
3. **Soberanía territorial** — el contexto local prevalece sobre la abstracción.
4. **Trazabilidad auditable** — toda decisión relevante es auditable.

Toda contribución debe respetar las normas del documento maestro
[`AGENTS.md`](./AGENTS.md). Leerlo antes de tocar código.

---

## 2. Arquitectura

### Nodos cognitivos

| Nodo | Función |
| :--- | :--- |
| **CROWN Gateway** | Orquestación, ruteo, arbitraje y control de estado. |
| **ISA Core** | Presencia, tono, empatía y modulación expresiva. |
| **SOPHIA Engine** | Epistemología, razonamiento, síntesis y análisis. |
| **ORION Engine** | Ejecución, generación, síntesis visual y soporte técnico. |
| **ARGUS Sentinel** | Gobernanza, defensa, verificación y veto. |

### Pipeline canónico

Toda entrada pasa por: **Perceive → Remember → Policy Gate (ARGUS) →
Decide (CROWN) → Act (ORION) → Audit (BookPI)**. Sin pasar por el pipeline de
política y auditoría no sale ninguna respuesta final con herramientas, datos
sensibles o riesgo operativo.

### Motores

- **CROWN / Constitutional Gate** — capa de gobernanza (C.R.O.W.N.):
  control, riesgo, orquestación, whitelist y notificación; niveles de decisión
  `allowed` / `requires_approval` / `denied`.
- **SovereignDB + Memory Engine** — memoria pentacapa (Immediate, Session,
  Project, Territorial, Historical) con repositorios append-only y retención
  mínima necesaria.
- **BookPI Ledger** — libro mayor inmutable, encadenado criptográficamente,
  con verificación integral y eventos de reembolso append-only.
- **ORION Engine + Sandbox** — ejecución de herramientas exclusivamente contra
  la whitelist Zero Trust. El sandbox evalúa fórmulas matemáticas mediante un
  **intérprete determinista sin `eval`/`new Function`** (profundidad máxima
  acotada, funciones Matemáticas en whitelist, variables estrictamente numéricas).
- **LATAM Aegis-X Gateway** — pasarela `/api/security` con motor nativo en
  Python (`latam-aegis-x`) y un motor redundante en TypeScript matemáticamente
  equivalente (+ conmutación automática si falta el runtime de Python).
- **Monetización Soberana** — contabilidad real de cuotas 85/15, retiros con
  MFA y elegibilidad, registrados en BookPI.

---

## 3. Modelo de seguridad

Postura **fail-closed**, sin mockdata en producción:

- **Acceso a configuración** — exclusivo mediante `src/lib/config.ts` +
  `src/lib/env-schema.ts` (validación Zod). Prohibido leer `process.env`
  directamente fuera de estos módulos (incluidos los subprocesos: el entorno
  del proceso hijo de Aegis se construye con una **allowlist explícita**, nunca
  con un spread del entorno del host).
- **Identidad** — los tokens de sesión solo los emite el servidor mediante
  flujos autorizados:
  - **Bootstrap**: `POST /api/db?action=provision-owner`, protegido por
    `PROVISION_OWNER_TOKEN` (comparación en tiempo constante). Sin token ⇒ 403.
  - **OAuth manual (SÓLO desarrollo)**: código de autorización de un solo uso
    en memoria (TTL 120s), validación estricta de origen (`same-origin`),
    `postMessage` dirigido al origen exacto de la app y sin `*`.
    Fuera de `AUTH_DEV_SESSION_ENABLED=true` este flujo responde 403.
  - **Producción**: IDP OIDC/Supabase (`OIDC_JWKS_URL`, `SUPABASE_*`).
- **Autorización** — punto único de decisión
  `src/lib/{authorization,rbac,abac,permission-matrix}.ts`. La matriz de
  permisos define cada recurso; los roles heredan mínimos privilegios
  (`Guest` no puede auditar, administrar sistema ni exportar datos personales).
- **Ejecución de herramientas** — whitelist Zero Trust; la autorización nunca
  se decide en el cliente.
- **Hash de datos sensibles** — se usa HMAC-SHA256 criptográfico (no FNV) para
  redactar actores y orígenes.
- **Cabeceras y rate-limiting** — inyección de cabeceras OWASP y límites por IP
  en las rutas.

---

## 4. Estructura del repositorio

```text
src/
  lib/            → dominio y motores (config, crown, memoria, bookpi,
                    orion, sandbox, rbac/abac, api-keys, repositorios)
  routes/api/     → rutas delgadas (db.ts, security.ts, oakApp, etc.)
  routes/         → UI TanStack
  components/     → dashboards e interfaces
  server.ts       → punto de entrada de seguridad (cadena de middlewares)
tests → test/unit, test/security
latam-aegis-x/    → motor Aegis-X en Python (run_pipeline.py y módulos)
quantum_utility_platform/ → QUP (procesamiento cuántico de utilidad)
supabase/         → migraciones SQL y RLS
scripts/          → db-migrate, db-verify, secret-scan
.github/workflows → ci, release, security, supabase
```

---

## 5. Inicio rápido

### Requisitos

- **Node.js ≥ 20.19** (recomendado **22**)
- **Python ≥ 3.10** (opcional; el motor TS es la redundancia automática)
- **PostgreSQL / Supabase** (recomendada) para persistencia relacional

### Instalación

```bash
npm install
cp .env.example .env
npm run dev        # servidor de desarrollo en http://localhost:3000
```

Edite `.env` y asigne como mínimo:

| Variable | Finalidad |
| :--- | :--- |
| `AUTH_JWT_SECRET` | Firma de tokens de sesión (≥ 16 caracteres). |
| `API_KEY_HASH_SECRET` | HMAC de llaves de API (≥ 16 caracteres; deriva de `AUTH_JWT_SECRET` si se omite). |
| `PROVISION_OWNER_TOKEN` | Bootstrap del primer tenant/owner (generar valor aleatorio). |
| `PUBLIC_URL` | Origen público de la app (SSR). |

Nunca introduzca valores reales en `AGENTS.md`, código ni `.env.example`.

---

## 6. Provisionamiento del nodo

El primer tenant/owner se crea **una vez** con el flujo autenticado:

```bash
curl -sS -X POST "$PUBLIC_URL/api/db?action=provision-owner" \
  -H "content-type: application/json" \
  -H "x-isabella-api-key: $PROVISION_OWNER_TOKEN" \
  -d '{
    "tenantId": "nodo-cero",
    "tenantName": "TAMV ONLINE NETWORK",
    "ownerId": "anubis_villasenor",
    "ownerUsername": "Anubis Villaseñor"
  }'
```

Respuesta:

```json
{ "success": true, "tenantId": "nodo-cero", "ownerId": "anubis_villasenor" }
```

> Los tenants existentes responden `409`. Este endpoint **no** emite tokens:
> solo registra identidad.

### Sesión en desarrollo

1. Desde la UI pulse **Conectar con Isabella** (open OAuth popup).
2. El IDP interno (solo dev) muestra las cuentas registradas del nodo.
3. Al autorizar, la ventana devuelve el token a la app vía `postMessage`
   (origen verificado) y la sesión queda activa.

### Sesión en producción

Configure el IDP OIDC (`OIDC_JWKS_URL`, `AUTH_ISSUER`, `AUTH_AUDIENCE`,
`SUPABASE_*`). El flujo OAuth manual queda bloqueado por defecto
(`AUTH_DEV_SESSION_ENABLED=false`).

---

## 7. Referencia de la API

Rutas de la API sobreranas (SSR TanStack Start):

| Ruta | Acciones principales |
| :--- | :--- |
| `GET /api/db?action=…` | `session`, `ledger`, `verify-ledger`, `verify-audit-chain`, `audit`, `heads`, `list-api-keys`, y flujo OAuth de desarrollo (`oauth-url`, `oauth-provider`, `oauth-callback`). |
| `POST /api/db?action=…` | `provision-owner` (bootstrap), `ledger-add`, `ledger-refund`, `execute-tool` (sandbox), `create-api-key`, `revoke-api-key`, `rotate-api-key`, `memory.create`/`.list`/`.delete`, `approvals.*`, `oauth-authorize-action` (dev). |
| `POST /api/security` | Motor Aegis-X: evalúa el evento y devuelve `score`, `aegis_level`, `decision`, `reasons` y hashes HMAC de actor/origen. |

Autenticación por `Authorization: Bearer <token>`; llaves de API con prefijo
`isa_live_…`.

---

## 8. Variables de entorno

La lista completa y documentada está en [`.env.example`](./.env.example).
Resumen de categorías:

- **Núcleo/SSR**: `NODE_ENV`, `ISABELLA_RUNTIME_MODE`, `PUBLIC_URL`
- **Auth**: `AUTH_JWT_SECRET`, `AUTH_ISSUER`, `AUTH_AUDIENCE`, `AUTH_*_TTL`,
  `OIDC_JWKS_URL`, `JWKS_CACHE_TTL`, `AUTH_DEV_SESSION_ENABLED`,
  `PROVISION_OWNER_TOKEN`
- **Supabase**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`
- **Crypto/BookPI**: `ENCRYPTION_MASTER_KEY`, `ENCRYPTION_ALGORITHM`,
  `BOOKPI_SIGNING_KEY`, `BOOKPI_SIGNATURE_ALGORITHM`, `API_KEY_HASH_SECRET`,
  `API_KEY_PREFIX`, `API_KEY_DEFAULT_TTL`, `API_KEY_MAX_TTL`,
  `API_KEY_ROTATION_GRACE_SECONDS`, `API_KEY_RATE_LIMIT_DEFAULT`
- **Gobernanza**: `CROWN_CONSTITUTION_VERSION`, `CROWN_ENFORCEMENT_MODE`,
  `CROWN_POLICY_SIGNING_KEY`
- **LLM/Telemetría**: `GEMINI_API_KEY`, `LOVABLE_API_KEY`, `LLM_DEFAULT_MODEL`,
  `LLM_VOICE_MODEL`, `LLM_UPSTREAM_TIMEOUT_MS`, `OTEL_*`
- **Límites**: `INPUT_MAX_BODY_BYTES`, `INPUT_MAX_MESSAGES`,
  `INPUT_MAX_ATTACHMENT_BYTES`, `INPUT_MAX_TOOLS_PER_REQUEST`,
  `RATE_LIMIT_*`, `REDACT_EXTRA_KEYS`
- **Aegis**: `AEGIS_HASH_SECRET`, `AEGIS_AUDIT_SECRET`

---

## 9. Calidad y validación

```bash
npm run typecheck      # tipos estrictos (tsc --noEmit)
npm run lint           # ESLint
npm run format:check   # Prettier
npm run test           # Vitest (proyectos unit + security)
npm run test:unit
npm run test:security
npm run security:scan  # ESLint de seguridad + scripts/secret-scan.mjs
npm run build          # build de producción (Vite/TanStack Start)
npm run db:verify      # scripts/db-verify.mjs
```

> Este repositorio no contiene directorios `test/integration` ni
> `test/e2e`; los scripts y proyectos Vitest asociados fueron retirados
> para no exponer comprobaciones muertas en CI.

---

## 10. CI/CD y despliegue

GitHub Actions en `.github/workflows/`:

| Workflow | Disparo | Propósito |
| :--- | :--- | :--- |
| `ci.yml` | push/PR a `main` | lint, format, typecheck, tests unit/security, audit, `security:scan`, build. |
| `security.yml` | push/PR a `main` + semanal | scan de seguridad, `npm audit` (informativo), secret-scan (TruffleHog) y CodeQL. |
| `release.yml` | tags `v*` | build de producción y paquete `.tar.gz` (`.output/`/`dist/` + `package.json`) publicado como Release. |
| `supabase.yml` | cambios en `supabase/**` | `supabase db lint` y `supabase db test`. |

Despliegue SaaS: conectado a **Lovable** (rama `main` sincronizada). No uses
`push --force`, `rebase`, `commit --amend` ni squash sobre historia publicada;
cada push debe dejar el proyecto compilable y reversible.

---

## 11. Licenciamiento

Esquema mixto (ver `LICENSE*`, `NOTICE` y `AGENTS.md` §7):

- Código core / prompts / reglas: **ISCL** (restricciones de explotación)
- SDKs / integración: **Apache-2.0**
- Utilidades auxiliares: **MIT**
- Servicios modificados: **AGPLv3**
- Documentación científica: **CC BY 4.0**
- Datos comunitarios / GIS: licencia territorial exclusiva

Isabella está diseñada para cumplir recomendaciones UNESCO sobre ética de la IA,
directrices de trust & safety del WEF y la Agenda Digital de la ONU, con datos de
Real del Monte bajo residencia local (LFPDPPP / GDPR / CCPA).

---

## 12. Documentación

- [`AGENTS.md`](./AGENTS.md) — documento maestro (arquitectura, contratos,
  flujo de PR, prohibiciones absolutas).
- [`docs/architecture/`](./docs/architecture/) — documentación arquitectónica.
- [`src/routes/README.md`](./src/routes/README.md) — guía de rutas.
- [`latam-aegis-x/README.md`](./latam-aegis-x/README.md) — motor Aegis-X.
- [`quantum_utility_platform/README.md`](./quantum_utility_platform/README.md) — QUP.

---

*Isabella Villaseñor AI: coordinar inteligencia, territorio, memoria y
gobernanza bajo soberanía humana.*