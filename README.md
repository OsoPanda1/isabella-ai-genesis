# Isabella Villaseñor AI — Genesis

## IA Cognitiva Gobernada Federada (Federated Governed Artificial Intelligence System)

Isabella Villaseñor AI es una arquitectura cognitiva híbrida que coordina interpretación, memoria, gobernanza, herramientas y trazabilidad bajo soberanía humana, operada desde el Nodo Cero (Real del Monte, Hidalgo, México) por TAMV ONLINE.

## 🎯 Declaración de Naturaleza

### Lo que Isabella es

- Una capa de gobernanza, identidad, ruteo, seguridad, memoria y auditoría —propia y verificable— sobre un substrato de inferencia generativa federado (Gemini).
- Un sistema de IA gobernada que opera bajo el marco FGAIS (Federated Governed Artificial Intelligence System).
- Una arquitectura que coordina interpretación, memoria, gobernanza, herramientas y trazabilidad bajo soberanía humana.

### Lo que Isabella no es

- No es una AGI (Inteligencia Artificial General).
- No es un stack totalmente soberano (depende de proveedores federados para inferencia).
- No es un chatbot autónomo sin restricciones.
- No es un sustituto de la decisión humana en operaciones de alto impacto.

Los módulos sugieren, verifican y ejecutan únicamente dentro de políticas explícitas.

## ⚠️ Estado del Proyecto

- **Estado:** Prototipo operativo endurecido en evolución.
- **Advertencia crítica:** Nada en este README afirma preparación productiva sin evidencia enlazada. Ver `docs/governance/01-FGAIS-Governance-Constitution.md` (Nivel 0) y `docs/governance/EVIDENCE-MAP.md` (correspondencia claim↔código).
- **Regla de correspondencia estricta (D.5):** Ninguna capacidad se declara Verified/Production-Verified sin prueba reproducible.

## 📜 Principios Operativos

| Principio                         | Referencia FGAIS | Descripción                                                                        |
| --------------------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| La capacidad no implica autoridad | §2.1             | Existir no autoriza ejecutar. Toda capacidad requiere autorización explícita.      |
| Negar por defecto                 | §2.3             | Verificar → Autorizar → Ejecutar → Registrar → Monitorear → Recuperar.             |
| Soberanía humana                  | §1.6             | Ninguna acción de alto riesgo sin aprobación registrada (HITL).                    |
| Zero Trust                        | §1.8             | Identidad, tenant, alcance y política en cada operación.                           |
| Trazabilidad                      | §1.9             | Toda decisión relevante produce traceId, correlationId y evidencia auditable.      |
| Incertidumbre honesta             | §1.4             | Los fallos de proveedores y modos degradados se comunican, no se disfrazan.        |
| Correspondencia estricta          | D.5              | Ninguna capacidad se declara Verified/Production-Verified sin prueba reproducible. |

## 🏗️ Arquitectura

### Componentes Principales

| Componente                   | Ubicación                                                                   | Función                                                                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CROWN Gateway                | `src/lib/crown.ts`, `constitutional-gate.ts`, `policy-engine.ts`            | Ruteo, arbitraje, estado y composición de políticas.                                                                                                                             |
| ISA / SOPHIA / ORION / ARGUS | `src/lib/`                                                                  | Presencia, razonamiento, ejecución y veto.                                                                                                                                       |
| AEGIS Semántico              | `src/lib/aegis-semantic.ts`                                                 | 7 detectores (classifier, contextual, inyección indirecta, tool poisoning, retrieval poisoning, exfiltración, conductual) integrados al firewall, 37 casos adversariales verdes. |
| Authorization Real           | `src/lib/authorization.ts`                                                  | PDP RBAC (matriz + catálogo) + ABAC deny-overrides + anomalía, decisiones firmadas ECDSA P-384.                                                                                  |
| Execution Authority          | `src/lib/execution-authority.ts`                                            | Decide → Authorization → Approval (un solo uso / capability tokens firmados) → Execution → Validation → Audit.                                                                   |
| Kill Switch                  | `src/lib/kill-switch.ts` (§7.1)                                             | Parada por capacidad (inference, tool-execution, skill-execution, payouts, quantum-jobs), durable en PG, API emergency-\* solo SovereignOwner.                                   |
| BookPI + Contabilidad        | `src/lib/repositories/bookpi-postgres-repository.ts`, `src/lib/accounting/` | Ledger append-only con firmas reales, doble entrada con asiento atómico, eventos económicos idempotentes.                                                                        |
| Memoria y Auditoría          | `src/lib/`                                                                  | Hash-chain, mutex anti-bifurcación y verificación de integridad.                                                                                                                 |
| Observabilidad Durable       | `src/lib/otel-exporter.ts`                                                  | OTLP/HTTP → Collector → backend/SIEM; el buffer en memoria es solo fallback local.                                                                                               |

### Flujo Canónico

```text
Perceive → Remember → Policy Gate → Decide → Act → Audit
```

## 🏛️ Autoridades de Producción (Sin Ambigüedad)

| Autoridad         | Fuente Única                                           | Infraestructura (No Autoridad)           |
| ----------------- | ------------------------------------------------------ | ---------------------------------------- |
| Estado Relacional | PostgreSQL vía `DATABASE_URL`                          | Neon / Supabase Postgres (mismo cluster) |
| Identidad         | OIDC/Supabase JWT + API keys server-side               | Supabase Auth (emisión)                  |
| Inferencia        | Proveedor federado Gemini                              | `generativelanguage.googleapis.com`      |
| Auditoría         | Hash-chain + PG append-only + HMAC-SHA3-512            | Sistema de archivos inmutable            |
| Pagos             | Stripe + `webhook_events` + `economic_events` + BookPI | Stripe API                               |
| Observabilidad    | OTLP Collector → backend/SIEM                          | —                                        |

### Requisitos Críticos

- `DATABASE_URL` es obligatoria en producción (`requiredEnvKeys`, CI y `production-authority.ts` la exigen).
- `assertProductionAuthorities()` / `runtime-integrity` degradan el arranque si una autoridad crítica falla.

## 🌐 Inferencia Federada (Declaración Honesta)

### Modo Producción

- Sin `GEMINI_API_KEY` en producción, `/api/isabella` responde 503 `inference_unavailable` explícito.
- No existe fallback generativo silencioso.

### Modo Desarrollo

El clasificador local determinista (`isabella-native-ml`, no generativo) opera declarado como:

- `provider: native-fallback`
- `degraded: true`

En payload, headers e insignia UI.

### Criptografía Poscuántica

ML-DSA-87 es SIMULATION-ONLY por contrato. No se presenta como autoridad criptográfica productiva.

## 🔒 Seguridad Operativa

### Controles Implementados

| Control                      | Implementación                                               | Estado      |
| ---------------------------- | ------------------------------------------------------------ | ----------- |
| Autenticación Soberana       | `withSovereignAuth` en rutas sensibles                       | Implemented |
| Tenant Derivado de Identidad | Nunca del body/query                                         | Implemented |
| Validación Zod + Límites     | Todos los inputs                                             | Implemented |
| Rate Limiting Distribuido    | Fail-closed en prod sin Redis → 503                          | Partial     |
| Egress Allowlist Anti-SSRF   | Dominios y puertos explícitos                                | Implemented |
| Idempotencia                 | Pagos, webhooks, mutaciones                                  | Implemented |
| Auditoría con Correlación    | traceId, correlationId                                       | Implemented |
| Errores Genéricos            | Sin filtrar stack traces                                     | Implemented |
| Dev-auth Deshabilitado       | oauth-\*, dev-session → 404 en prod                          | Implemented |
| Invitados y Atajos Dev       | Deshabilitados en prod                                       | Implemented |
| CSP                          | En transición documentada (enforced + Report-Only con nonce) | Partial     |

## 💰 Economía y BookPI

### Modelo de Créditos

- Créditos = consumo prefinanciado.
- Recarga solo tras PaymentIntent verificado, con claim atómico `UNIQUE(tenant, idempotency_key)`.
- Débitos con gate de saldo.
- Reembolsos como eventos nuevos (nunca UPDATE).
- Chargebacks con disputa + congelamiento de payouts.

### Prevención de Fraude

- Fraud review con scoring.
- Hold/decisión única.
- Doble aprobación en montos altos.

### Payouts

- Payouts Stripe reales con cuenta destino + idempotencia.
- Sin destino, programado manual etiquetado.
- Pagos en vivo: ver matriz (evidencia en vivo pendiente).

## ✅ Verificación (Todo Reproducible Localmente)

### Comandos Base

```bash
# Instalación congelada
pnpm install --frozen-lockfile

# Type checking y linting
pnpm run typecheck && pnpm run lint

# Tests (unit + security + bookpi + integration)
pnpm run test
# DB-gateados se omiten sin PG

# Matriz de capacidades (27 capabilities)
pnpm run capabilities

# Verificación de migraciones
pnpm run db:verify

# Security scanning
pnpm run security:scan
# eslint security + secret-scan

# Build (bundle cliente + SSR)
pnpm run build
```

### Con PostgreSQL

```bash
# Tests de concurrencia, idempotencia, reconciliación, refunds, approvals atómicos
TEST_DATABASE_URL=... pnpm exec vitest run --project bookpi --project integration
```

### CI (ci.yml)

Build + security + CodeQL + migrate-check + db-tests (pgvector:pg16 con migraciones aplicadas) + release-readiness honesto.

## 🚀 Despliegue en Vercel

### Rama Fuente Única

Rama `main` (cada push despliega).

### Secretos Requeridos

Todos los siguientes son obligatorios (`requiredEnvKeys("production")`, paridad CI↔prod verificada por test):

| Variable                      | Propósito                         |
| ----------------------------- | --------------------------------- |
| `PUBLIC_URL`                  | URL pública del servicio          |
| `DATABASE_URL`                | Conexión PostgreSQL               |
| `SUPABASE_URL`                | Supabase project URL              |
| `SUPABASE_ANON_KEY`           | Supabase anon key                 |
| `AUTH_JWT_SECRET`             | Firma JWT                         |
| `GEMINI_API_KEY`              | Inferencia Gemini                 |
| `ENCRYPTION_MASTER_KEY`       | Cifrado maestro                   |
| `CROWN_POLICY_SIGNING_KEY`    | Firma de políticas CROWN          |
| `AEGIS_AUDIT_SECRET`          | Auditoría AEGIS                   |
| `BOOKPI_SIGNING_KEY`          | Firma BookPI                      |
| `STRIPE_SECRET_KEY`           | Pagos Stripe                      |
| `STRIPE_WEBHOOK_SECRET`       | Webhooks Stripe                   |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Observabilidad durable (opcional) |

### Post-install

`postinstall` regenera Prisma (`schema.prisma` es la fuente; `src/generated` no se versiona).

### Health Endpoints

| Endpoint            | Propósito                |
| ------------------- | ------------------------ |
| `/api/health/live`  | Proceso vivo             |
| `/api/health/ready` | Puede atender tráfico    |
| `/api/health/deep`  | Dependencias verificadas |

### Lockfile

`pnpm-lock.yaml` es el único lockfile canónico (pnpm 10, Node ≥22).

### Prohibiciones

- No publicar ramas con fallos de build.
- No publicar ramas con secretos expuestos.
- No publicar ramas con datos de prueba con apariencia real.
- No publicar ramas con afirmaciones sin evidencia.

## 📁 Estructura Principal

```text
src/
├── components/isabella/   # Interfaz, terminal y paneles
├── lib/                   # CROWN, seguridad, identidad, persistencia y contratos
│   ├── sandbox/           # Ejecutor VM aislado real (JS puro, timeout enforced)
│   ├── monetization/      # Fraud review, payouts, withdrawals
│   ├── repositories/      # PG durables (bookpi, approvals, marketplace, memoria, auditoría)
│   └── skills/            # Registro y packs de habilidades soberanas
├── routes/api/            # Delegación fina → server-routes (autoridad única)
├── server-routes/api/     # Handlers canónicos (billing, db, isabella, health…)
└── styles.css             # Tokens visuales

docs/
├── governance/            # Charter FGAIS v2.0 (Nivel 0) + EVIDENCE-MAP
├── architecture/          # ADRs de la cadena de autoridad
├── operations/            # Matrices, runbook DR, reparación, dependencias
└── api/                   # Contratos de autoridad de API

supabase/migrations/       # Esquema, RLS, inmutabilidad, seeds auditables

scripts/                   # Verificación, backup/restore, supply-chain, capabilities

prisma/                    # Esquema fuente (migraciones vía Supabase)
```

## 🤝 Contribución

### Lineamientos

- Lee `AGENTS.md`.
- TypeScript estricto, contratos runtime.
- Cambios pequeños reversibles.
- Prueba por cada invariante de seguridad.
- Documentación sincronizada.
- Sin `any` injustificado.
- Sin simulaciones como integraciones.
- Sin inferencias promovidas a hechos.
- `main` siempre compilable.
- Prohibido `push --force`/rebase sobre historia publicada.

## ⚠️ Limitaciones Conocidas (Deuda Declarada, No Oculta)

| Limitación                                                    | Estado    | Owner                | Evidencia    |
| ------------------------------------------------------------- | --------- | -------------------- | ------------ |
| Pagos Stripe en vivo sin evidencia de transferencia ejecutada | Pendiente | Payments Owner       | EVIDENCE-MAP |
| Multi-región                                                  | Pendiente | Infrastructure Owner | EVIDENCE-MAP |
| Nonce-CSP enforcement                                         | Partial   | Security Owner       | EVIDENCE-MAP |
| DAST/pentesting/red-team externo                              | Pendiente | AI Safety Officer    | EVIDENCE-MAP |
| MFA admins                                                    | Planned   | Security Owner       | EVIDENCE-MAP |
| Rotación programada de 90 días                                | Planned   | CISO                 | EVIDENCE-MAP |
| Payouts masivos                                               | Pendiente | Payments Owner       | EVIDENCE-MAP |
| happy-dom/pnpm sin instalar localmente (CI los provee)        | Known     | DevOps               | EVIDENCE-MAP |

Ver matriz y `EVIDENCE-MAP.md` para dueño y estado por brecha.

## 📄 Licencia y Autoría

### Dominio Público Arquitectónico

- **Licencia:** CC BY 4.0
- **Autor:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
- **Ecosistema:** TAMV ONLINE NETWORK / RDM Digital Hub / Nodo Cero (Real del Monte, Hidalgo, México)

### Nota Legal

La licencia no elimina obligaciones de privacidad, seguridad, pagos ni cumplimiento legal del despliegue.

## 📎 Documentación Relacionada

| Documento                                             | Nivel   | Propósito                                              |
| ----------------------------------------------------- | ------- | ------------------------------------------------------ |
| `docs/governance/01-FGAIS-Governance-Constitution.md` | Nivel 0 | Charter FGAIS v2.0 Final — Marco maestro de gobernanza |
| `docs/governance/EVIDENCE-MAP.md`                     | Nivel 5 | Correspondencia claim↔código↔evidencia                 |
| `docs/architecture/`                                  | Nivel 2 | ADRs de la cadena de autoridad                         |
| `docs/operations/`                                    | Nivel 3 | Matrices, runbook DR, reparación, dependencias         |
| `docs/api/`                                           | Nivel 2 | Contratos de autoridad de API                          |
| `AGENTS.md`                                           | Nivel 3 | Lineamientos de contribución                           |

## 🌍 Nodo Cero

Isabella Villaseñor AI es orgullosamente realmontense.

- **Origen:** Real del Monte, Hidalgo, México (20.1597° N, 98.6669° O)
- **Operador:** TAMV ONLINE
- **Soberanía Tecnológica:** Preservada, documentada y jurídicamente protegida conforme al derecho aplicable.

---

_Isabella Villaseñor AI — A Federated Governed Artificial Intelligence System._
_By TAMV ONLINE._
_Orgullosamente Realmontenses._
_Nodo Cero: Real del Monte, Hidalgo, México._
