# Isabella Villaseñor AI

Arquitectura cognitiva soberana para el Ecosistema TAMV / RDM Digital / Nodo Cero, Real del Monte, Hidalgo. Isabella coordina cognición, memoria, gobernanza, herramientas, evidencia y economía bajo una regla central: **las inteligencias sugieren; el humano decide, aprueba y ejecuta**.

> Nacimos para guiar, no para explotar.

## Estado de producción honesto

Este repositorio contiene una plataforma operativa de referencia con frontend TanStack Start/Vite, pipeline CROWN, política ARGUS, memoria pentacapa, BookPI, sandbox determinista, Aegis-X, rutas API, telemetría de correlación y módulos de monetización. El registro ejecutable de capacidades está en `src/lib/platform-capabilities.ts`.

`implemented` no significa certificado. `verified` requiere evidencia automatizada. Quantum, federaciones externas y fondos reales permanecen bloqueados o experimentales hasta contar con proveedores, controles y pruebas de producción verificables.

## Arquitectura

`Perceive → Remember → Policy Gate (ARGUS) → Decide (CROWN) → Act (ORION) → Audit (BookPI)`

- **CROWN**: orquestación, ruteo y decisión constitucional.
- **ARGUS/Aegis-X**: riesgo, defensa, veto y frontera territorial.
- **ISA**: presencia, tono y modulación expresiva.
- **SOPHIA**: síntesis, epistemología y análisis.
- **ORION**: herramientas con whitelist y sandbox.
- **MNEMOS**: memoria inmediata, sesión, proyecto, territorial e histórica.
- **BookPI**: evidencia y ledger append-only.
- **QUP**: puente cuántico acotado; puede degradar explícitamente a cálculo clásico determinista.

## Persistencia y autoridad

La matriz de autoridad debe mantenerse explícita:

| Dominio | Sistema de registro | Estado efímero | Evidencia |
|---|---|---|---|
| Identidad y dominio | PostgreSQL/Supabase según boundary | Redis | Security audit |
| Memoria | PostgreSQL/vector store aprobado | Redis cache | Provenance |
| Ledger | PostgreSQL transaccional | Ninguno | BookPI |
| Sesiones, rate limit e idempotencia | DB/IdP | Upstash Redis | Security events |
| Pagos | Stripe + ledger interno | Redis locks | Webhook audit |

JSON/SQLite local solo puede utilizarse en desarrollo, pruebas o migración, nunca como autoridad financiera multi-tenant.

## Seguridad

- Zod/runtime validation y límites de cuerpo, mensajes y herramientas.
- Identidad OIDC/JWT o API key con scopes; no se fabrican tokens en el cliente.
- Tenant derivado del principal, nunca confiado desde payload sensible.
- PEP → PDP → decisión → PEP; fail-closed.
- Rate limiting por IP/principal/tenant/endpoint.
- Replay e idempotencia para operaciones mutables.
- Sandbox sin `eval`, con funciones y recursos limitados.
- Hash/HMAC y redacción de secretos en auditoría.
- Cabeceras OWASP y errores contractuales sin stack traces.
- Acciones críticas requieren aprobación humana.

## Contratos

`docs/api/API_CONTRACT_AUTHORITY.md` define la autoridad contractual, versionado, compatibilidad, errores y drift. Las especificaciones de los adjuntos se tratan como diseño de referencia; no se anuncian como implementadas si no existe un path ejecutable y evidencia.

## Observabilidad

Cada request debe conservar `requestId`, `correlationId`, `traceId`, `decisionId` y `auditId` desde HTTP hasta evidencia. `src/lib/request-context.ts`, BookPI, Aegis-X y los contratos de error proveen los límites actuales. Las métricas de operación deben cubrir disponibilidad, p95/p99, latencia PDP, inferencia, memoria, DB, cache, tools, economía y persistencia de auditoría.

## Desarrollo

```bash
pnpm install
pnpm dev
```

Validación completa:

```bash
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm run test
pnpm run security:scan
pnpm run build:production
```

## Variables de entorno

Usa `.env.example` como catálogo. Nunca comitees secretos. Las integraciones gestionadas suministran sus variables; la aplicación debe leer configuración a través de los módulos de configuración existentes. En producción son obligatorios un IdP OIDC/Supabase real, secretos criptográficos rotados, PostgreSQL, Redis administrado, endpoints de observabilidad y webhooks Stripe verificados si se habilita economía.

## Economía y monetización

El código de economía expone cuotas, BookPI, revenue y retiros como capacidades gobernadas. Para dinero real todavía deben completarse reconciliación, doble entrada formal, fraude/KYC cuando aplique, payout provider, idempotencia, webhook signatures y separación de funciones operativas. No usar balances simulados ni declarar ingresos reales sin eventos Stripe confirmados.

## Frontend

La intro cinematográfica usa el logo oficial y `src/assets/background-audio.mp3`, se activa por gesto del usuario, respeta reduced motion y tiene duración acotada. La consola incluye navegación crystal, CROWN/ARGUS visibles y estados de autoridad; los controles visuales nunca reemplazan al backend.

## Limitaciones y despliegue

Antes de producción enterprise ejecutar pruebas de tenant isolation, policy drift, red-team, fuzzing, revocación, replay, ledger invariants, webhooks, fallos de proveedores y recuperación. Revisar legalmente privacidad, DPA, residencia, licencias, AI Act/NIST/ISO aplicables y datos comunitarios. El despliegue solo es listo cuando las capacidades estén `verified`, los secretos estén en un gestor, las integraciones estén conectadas y el pipeline CI pase.

## Licencia

Consultar `AGENTS.md` y los avisos de cada componente. La documentación canónica del dominio usa CC BY 4.0; componentes y dependencias conservan sus licencias originales.
