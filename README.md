# Isabella Villaseñor AI

Plataforma de orquestación cognitiva gobernada para contexto, evidencia, memoria, herramientas y decisiones humanas. Isabella no es AGI, consciencia artificial ni autoridad autónoma: el modelo sugiere; la persona revisa, aprueba y ejecuta.

## Estado actual

- Versión canónica: `4.3.3` (`package.json`).
- Runtime: Node `24.x`, pnpm `10.34.5`, Vite `8`, React `19`, TypeScript `6`.
- Despliegue: Vercel con salida `dist` y `vercel.json` endurecido.
- Chat: rutas canónicas `/api/isabella` y `/api/v1/isabella`, ambas delegan en el mismo gateway gobernado.
- Persistencia: PostgreSQL/Neon y Prisma cuando el entorno de despliegue está configurado.
- Clasificación: implementado en evolución; no certificado para producción regulada, finanzas o seguridad gubernamental.

## Arquitectura

```text
PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND
```

- **CROWN** arbitra routing, estado y políticas.
- **ISA** gestiona presencia, tono y presentación.
- **SOPHIA** clasifica evidencia y límites epistemológicos.
- **ORION** ejecuta herramientas autorizadas.
- **ARGUS** aplica riesgo, veto, redacción y kill switch.
- **MNEMOS** mantiene memoria con scopes.
- **BookPI** conserva procedencia y trazabilidad.

Las mutaciones sensibles son fail-closed: identidad, tenant, capability, cuota, aprobación, validación de entrada/salida y auditoría deben resolverse antes de ejecutar.

## Inicio local

```bash
pnpm install --frozen-lockfile
pnpm dev
```

El servidor de desarrollo valida el entorno antes de iniciar. Nunca expongas secretos en `VITE_*`, código cliente, fixtures, logs o documentación.

## Verificación

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm security:scan
pnpm audit:repository
pnpm audit:architecture
pnpm audit:routes
pnpm verify:lock
pnpm build
```

El gate completo es `pnpm production:gate`. Si un gate depende de infraestructura, claves o evidencia externa, su resultado debe permanecer explícitamente bloqueado; no se convierte `EVIDENCE_GATED` en `PASS`.

## Seguridad aplicada

- Validación de contratos con Zod y límites de body, mensajes, adjuntos y herramientas.
- Parsing JSON acotado, UTF-8 fatal, rechazo de JSON inválido y respuestas sin cache.
- Autenticación soberana y scopes por ruta.
- Rate limiting, timeouts, allowlist de egress y redacción de secretos.
- CSP y headers de defensa en profundidad mediante `SecuritySystem` y `vercel.json`.
- No se persisten tokens en `localStorage`.
- Los logs no deben contener prompts completos, respuestas, PII, credenciales ni tokens.

## Deduplicación

Existe un único gateway de chat: `src/lib/isabella-chat-gateway.ts`. Las superficies `/api/isabella` y `/api/v1/isabella` son adaptadores delgados y comparten `toGatewayContext`, evitando contratos divergentes. Antes de eliminar otro módulo aparentemente duplicado, verifica importadores, tests, rutas generadas y estado de despliegue.

## Variables

Configura secretos únicamente en Vercel Vars o el gestor de secretos del entorno:

- `JWT` o `AUTH_JWT_SECRET` para autenticación server-side.
- `MUX_TOKEN_ID` y `MUX_TOKEN_SECRET` sólo en servidor.
- `DATABASE_URL` para persistencia cuando aplique.
- Variables de proveedores AI sólo en el runtime server-side correspondiente.

## Límites honestos

Un build verde no demuestra producción; un hash no equivale a WORM regulatorio; una firma simulada no equivale a criptografía operativa; una licencia no concede autorización sobre datos, marcas o modelos. Las capacidades parciales, simuladas o bloqueadas deben permanecer visibles en UI, contratos y evidencia.

## Gobierno del repositorio

`AGENTS.md` es la especificación operativa. Conserva trazabilidad, no reescribas historia publicada, no fuerces pushes y documenta cada degradación. Código, dependencias y contenido conservan sus licencias respectivas.

**Principio rector:** la inteligencia asiste; la responsabilidad humana permanece.

**SSOT:** `AGENTS.md` · `package.json` · lockfile · `SECURITY.md` · `LICENSES.md` · migraciones · contratos runtime · manifiestos de evidencia.
