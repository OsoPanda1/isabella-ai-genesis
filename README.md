# Isabella Villaseñor AI — Genesis

> **Capacidad no implica autoridad.**

Isabella Villaseñor AI es una plataforma de inteligencia artificial gobernada, federada y auditable para coordinar inferencia, memoria, aprendizaje, skills, herramientas y sistemas externos bajo soberanía humana. Su arquitectura FGAIS separa capacidad, autorización, ejecución y evidencia.

**Ecosistema:** TAMV ONLINE NETWORK · RDM Digital Hub · Nodo Cero, Real del Monte, Hidalgo, México  
**Repositorio:** `OsoPanda1/isabella-ai-genesis`  
**Licencia:** CC BY 4.0  
**Runtime:** TanStack Start · Vite · Nitro · React 19 · Node 22 · pnpm 10

## Propósito

Isabella no es una AGI certificada, un chatbot monolítico ni un sistema autónomo sin control humano. Es una infraestructura cognitiva con límites verificables, procedencia, trazabilidad y políticas explícitas. Las inteligencias sugieren, calculan y evalúan; las personas autorizan y ejecutan las acciones de impacto.

## Arquitectura

```text
Usuario
  -> Presentation / CROWN UI
  -> API + identidad + tenant + rate limit + Zod
  -> ARGUS / políticas / aprobaciones / kill switch
  -> CROWN / ISA / SOPHIA / ORION
  -> NCUA + registros de modelos + skills gobernadas
  -> Persistencia durable / ledger / memoria
  -> Audit bundle / telemetry / traces / recovery
```

### Nodos cognitivos

- **CROWN:** orquestación, ruteo y control de estado.
- **ISA:** presencia, tono y contexto humano.
- **SOPHIA:** consistencia, epistemología y síntesis.
- **ORION:** ejecución técnica y creativa autorizada.
- **ARGUS:** riesgo, verificación, veto y auditoría.
- **NCUA:** comprensión continua nativa, determinista y token-free.

## Capacidades reales

- Gateway conversacional gobernado con identidad server-side y aislamiento multi-tenant.
- NCUA nativa en TypeScript, sin dependencia de un foundation model.
- Memoria, aprendizaje, skills, sandbox y registros de auditoría.
- Ledger económico durable, marketplace y checkout Stripe sujeto a verificación operacional.
- Conectores Vercel Connect por usuario para GitHub, Slack y Linear, con scopes mínimos y webhooks verificados.
- Observabilidad de runtime con métricas explícitas; no se fabrican CPU, temperatura, uptime ni eventos.
- Allowlist de egress, validación Zod, rate limiting distribuido y headers defensivos.
- Cifrado doble server-only disponible en `src/lib/crypto/double-flow-encryption.ts`: AES-256-GCM para flujo de entrada, ChaCha20-Poly1305 para flujo server-side y HMAC de integridad.

## Gobernanza y seguridad

Cada operación sensible sigue el flujo:

```text
Perceive -> Identify -> Retrieve -> Validate -> Govern -> Decide
-> Authorize -> Approve -> Execute -> Audit -> Observe -> Recover
```

Los secretos nunca se incluyen en el repositorio ni en logs. La protección criptográfica no se presenta como certificación militar: producción exige KMS, rotación, TLS gestionado, backup/restore, pruebas de penetración y evidencia independiente.

## Integraciones externas

Las integraciones usan Vercel Connect para mantener tokens server-side y autorización por usuario:

| Proveedor | Uso                                             | Rutas                 |
| --------- | ----------------------------------------------- | --------------------- |
| GitHub    | repositorios, issues y automatización gobernada | `/api/connect/github` |
| Slack     | acciones y eventos de workspace                 | `/api/connect/slack`  |
| Linear    | issues, proyectos y coordinación operativa      | `/api/connect/linear` |

Los webhooks se reciben en `/api/connect/{provider}/webhook`. Toda acción debe derivar el sujeto desde la sesión autenticada; nunca desde un `userId` enviado por el cliente.

## Monetización

Billing opera con aislamiento por tenant, ledger durable y Stripe. Los flujos comerciales requieren validar precio y cantidad en servidor, idempotencia, webhook firmado, reconciliación y autorización del entorno Stripe. La presencia de una clave o SDK no constituye evidencia de pagos productivos.

## Desarrollo

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm production:integrity
pnpm production:preflight
pnpm production:evidence
pnpm capabilities
pnpm audit:routes
pnpm audit:repository
```

Variables y proveedores se configuran en el entorno de despliegue. No se deben copiar secretos a `.env` versionado ni imprimir archivos de variables en terminales, CI o reportes.

## Quality gates

- `typecheck`: contratos TypeScript.
- `lint` y `security:scan`: calidad, reglas de seguridad y secret scan.
- `test`, `test:unit`, `test:integration`, `test:security`: comportamiento y controles.
- `production:integrity`: integridad de manifests, capacidades y rutas.
- `production:preflight`: readiness de runtime y dependencias.
- `audit:routes` y `audit:repository`: autoridad única y auditoría reproducible.

## Documentación normativa

- [Auditoría integral 2026-09-13](./docs/audit-report-2026-09-13.md)
- [Runbook de recuperación productiva](./docs/operations/PRODUCTION-RECOVERY-RUNBOOK.md)
- [Índice RFC/ARC](./docs/RFC-ARC-INDEX.md)
- [RFC de conectores gobernados](./docs/rfcs/RFC-0002-connectors-governed-por-usuario.md)
- [Constitución FGAIS](./docs/governance/01-FGAIS-Governance-Constitution.md)
- [AGENTS.md](./AGENTS.md)

## Producción y transparencia

El proyecto está preparado para ejecutar sus gates y desplegarse, pero solo debe comunicarse como **Production-Verified** después de completar deploy real, smoke HTTP, CI remoto verde, migración/backup/restore, observabilidad, revocación de conectores y rollback probado. El reporte de auditoría enumera explícitamente las evidencias faltantes; esa frontera es parte del diseño, no una limitación oculta.

## Principios

1. Soberanía humana.
2. Zero Trust y mínima autoridad.
3. Soberanía territorial y procedencia.
4. Trazabilidad auditable.
5. Transparencia radical sin datos sensibles.
6. Reversibilidad y recuperación.
7. Apertura con responsabilidad.

**La inteligencia puede ampliar la capacidad humana; nunca debe sustituir la autoridad humana verificable.**
