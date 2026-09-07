# Isabella Villaseñor AI — Genesis

## IA cognitiva gobernada federada (Federated Governed Artificial Intelligence System)

Isabella Villaseñor AI es una arquitectura cognitiva híbrida que coordina interpretación, memoria, gobernanza, herramientas y trazabilidad bajo soberanía humana, operada desde el Nodo Cero (Real del Monte, Hidalgo, México) por TAMV ONLINE.

**Lo que Isabella es:** una capa de gobernanza, identidad, ruteo, seguridad, memoria y auditoría —propia y verificable— sobre un substrato de inferencia generativa federado (Gemini). **Lo que no es:** una AGI, un stack totalmente soberano, un chatbot autónomo ni un sustituto de la decisión humana. Los módulos sugieren, verifican y ejecutan únicamente dentro de políticas explícitas.

> Estado: prototipo operativo endurecido en evolución. Nada en este README afirma preparación productiva sin evidencia enlazada. Ver `docs/governance/01-FGAIS-Governance-Constitution.md` (Nivel 0) y `docs/governance/EVIDENCE-MAP.md` (correspondencia claim↔código).

## Principios operativos

- **La capacidad no implica autoridad** (axioma FGAIS §2.1): existir no autoriza ejecutar.
- **Negar por defecto:** verificar → autorizar → ejecutar → registrar → monitorear → recuperar.
- **Soberanía humana:** ninguna acción de alto riesgo sin aprobación registrada.
- **Zero Trust:** identidad, tenant, alcance y política en cada operación.
- **Trazabilidad:** toda decisión relevante produce `traceId`, `correlationId` y evidencia auditable.
- **Incertidumbre honesta:** los fallos de proveedores y modos degradados se comunican, no se disfrazan.
- **Correspondencia estricta (D.5):** ninguna capacidad se declara `Verified`/`Production-Verified` sin prueba reproducible.

## Arquitectura

- **CROWN Gateway:** ruteo, arbitraje, estado y composición (`src/lib/crown.ts`, `constitutional-gate.ts`, `policy-engine.ts`).
- **ISA / SOPHIA / ORION / ARGUS:** presencia, razonamiento, ejecución y veto.
- **AEGIS semántico** (`src/lib/aegis-semantic.ts`): 7 detectores (classifier, contextual, inyección indirecta, tool poisoning, retrieval poisoning, exfiltración, conductual) integrados al firewall, 37 casos adversariales verdes.
- **Authorization real** (`src/lib/authorization.ts`): PDP RBAC (matriz + catálogo) + ABAC deny-overrides + anomalía, decisiones firmadas ECDSA P-384.
- **Execution Authority** (`src/lib/execution-authority.ts`): Decide → Authorization → Approval (un solo uso / capability tokens firmados) → Execution → Validation → Audit.
- **Kill switch** (`src/lib/kill-switch.ts`, §7.1): parada por capacidad (`inference`, `tool-execution`, `skill-execution`, `payouts`, `quantum-jobs`), durable en PG, API `emergency-*` solo SovereignOwner.
- **BookPI + contabilidad** (`src/lib/repositories/bookpi-postgres-repository.ts`, `src/lib/accounting/`): ledger append-only con firmas reales, doble entrada con asiento atómico, eventos económicos idempotentes.
- **Memoria y auditoría** con hash-chain, mutex anti-bifurcación y verificación de integridad.
- **Observabilidad durable**: OTLP/HTTP → Collector → backend/SIEM (`src/lib/otel-exporter.ts`); el buffer en memoria es solo fallback local.

Flujo canónico: `Perceive → Remember → Policy Gate → Decide → Act → Audit`.

## Autoridades de producción (sin ambigüedad)

| Autoridad | Fuente única | Infraestructura (no autoridad) |
|---|---|---|
| Estado relacional | PostgreSQL vía `DATABASE_URL` | Neon / Supabase Postgres (mismo cluster) |
| Identidad | OIDC/Supabase JWT + API keys server-side | Supabase Auth (emisión) |
| Inferencia | Proveedor federado Gemini | `generativelanguage.googleapis.com` |
| Auditoría | Hash-chain + PG append-only + HMAC-SHA3-512 | Sistema de archivos inmutable |
| Pagos | Stripe + `webhook_events` + `economic_events` + BookPI | Stripe API |
| Observabilidad | OTLP Collector → backend/SIEM | — |

`DATABASE_URL` es obligatoria en producción (`requiredEnvKeys`, CI y `production-authority.ts` la exigen). `assertProductionAuthorities()` / `runtime-integrity` degradan el arranque si una autoridad crítica falla.

## Inferencia federada (declaración honesta)

Sin `GEMINI_API_KEY` en producción, `/api/isabella` responde **503 `inference_unavailable`** explícito; no existe fallback generativo silencioso. En desarrollo, el clasificador local determinista (`isabella-native-ml`, no generativo) opera declarado como `provider: native-fallback, degraded: true` en payload, headers e insignia UI. ML-DSA-87 es SIMULATION-ONLY por contrato.

## Seguridad operativa

Toda ruta sensible conserva: `withSovereignAuth`, tenant derivado de identidad, validación Zod + límites, rate limiting distribuido (fail-closed en prod sin Redis → 503), egress allowlist anti-SSRF, idempotencia en pagos/webhooks/mutaciones, auditoría con correlación y errores genéricos. Dev-auth (`oauth-*`, `dev-session`) responde 404 en producción. Invitados y atajos de desarrollo deshabilitados en prod. CSP en transición documentada (enforced + Report-Only con nonce).

## Economía y BookPI

Créditos = consumo prefinanciado. Recarga solo tras `PaymentIntent` verificado, con claim atómico `UNIQUE(tenant, idempotency_key)`. Débitos con gate de saldo, reembolsos como eventos nuevos (nunca UPDATE), chargebacks con disputa + congelamiento de payouts. Fraud review con scoring, hold/decisión única y doble aprobación en montos altos. Payouts Stripe reales con cuenta destino + idempotencia; sin destino, programado manual etiquetado. Pagos en vivo: ver matriz (evidencia en vivo pendiente).

## Verificación (todo reproducible localmente)

```bash
pnpm install --frozen-lockfile
pnpm run typecheck && pnpm run lint
pnpm run test            # unit + security + bookpi + integration (DB-gateados se omiten sin PG)
pnpm run capabilities    # matriz 27 capabilities contra archivos + manifiesto
pnpm run db:verify       # estructura de migraciones
pnpm run security:scan   # eslint security + secret-scan
pnpm run build           # bundle cliente + SSR
```

Con PostgreSQL: `TEST_DATABASE_URL=... pnpm exec vitest run --project bookpi --project integration` (concurrencia, idempotencia, reconciliación, refunds, approvals atómicos). En CI (`ci.yml`): build + security + CodeQL + `migrate-check` + `db-tests` (pgvector:pg16 con migraciones aplicadas) + `release-readiness` honesto.

## Despliegue en Vercel

1. Rama `main` (fuente única; cada push despliega).
2. Secretos requeridos = `requiredEnvKeys("production")` (paridad CI↔prod verificada por test): `PUBLIC_URL`, `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AUTH_JWT_SECRET`, `GEMINI_API_KEY`, `ENCRYPTION_MASTER_KEY`, `CROWN_POLICY_SIGNING_KEY`, `AEGIS_AUDIT_SECRET`, `BOOKPI_SIGNING_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (+ `OTEL_EXPORTER_OTLP_ENDPOINT` para observabilidad durable).
3. `postinstall` regenera Prisma (`schema.prisma` es la fuente; `src/generated` no se versiona).
4. Health: `/api/health/live` (proceso), `/api/health/ready` (tráfico), `/api/health/deep` (dependencias).
5. `pnpm-lock.yaml` es el único lockfile canónico (pnpm 10, Node ≥22).

No publicar ramas con fallos de build, secretos, datos de prueba con apariencia real o afirmaciones sin evidencia.

## Estructura principal

```text
src/
├── components/isabella/   Interfaz, terminal y paneles
├── lib/                   CROWN, seguridad, identidad, persistencia y contratos
│   ├── sandbox/           Ejecutor VM aislado real (JS puro, timeout enforced)
│   ├── monetization/      Fraud review, payouts, withdrawals
│   ├── repositories/      PG durables (bookpi, approvals, marketplace, memoria, auditoría)
│   └── skills/            Registro y packs de habilidades soberanas
├── routes/api/            Delegación fina → server-routes (autoridad única)
├── server-routes/api/     Handlers canónicos (billing, db, isabella, health…)
├── styles.css             Tokens visuales
docs/
├── governance/            Charter FGAIS v2.0 (Nivel 0) + EVIDENCE-MAP
├── architecture/          ADRs de la cadena de autoridad
├── operations/            Matrices, runbook DR, reparación, dependencias
└── api/                   Contratos de autoridad de API
supabase/migrations/      Esquema, RLS, inmutabilidad, seeds auditables
scripts/                  Verificación, backup/restore, supply-chain, capabilities
prisma/                   Esquema fuente (migraciones vía Supabase)
```

## Contribución

Lee `AGENTS.md`. TypeScript estricto, contratos runtime, cambios pequeños reversibles, prueba por cada invariante de seguridad, documentación sincronizada. Sin `any` injustificado, sin simulaciones como integraciones, sin inferencias promovidas a hechos. `main` siempre compilable; prohibido `push --force`/rebase sobre historia publicada.

## Limitaciones conocidas (deuda declarada, no oculta)

Pagos Stripe en vivo sin evidencia de transferencia ejecutada; multi-región; nonce-CSP enforcement; DAST/pentesting/red-team externo; MFA admins; rotación programada de 90 días; payouts masivos; `happy-dom`/`pnpm` sin instalar localmente (CI los provee). Ver matriz y EVIDENCE-MAP para dueño y estado por brecha.

## Licencia y autoría

Dominio público arquitectónico bajo CC BY 4.0, Edwin Oswaldo Castillo Trejo (Anubis Villaseñor), ecosistema TAMV ONLINE NETWORK / RDM Digital Hub / Nodo Cero (Real del Monte, Hidalgo, México). La licencia no elimina obligaciones de privacidad, seguridad, pagos ni cumplimiento legal del despliegue.
