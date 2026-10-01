# Isabella Villaseñor AI

**TAMV Online Network · RDM Digital Hub · Nodo Cero · Real del Monte, Hidalgo, México**

> Arquitectura TINA: Trusted Intelligence, Native & Adaptive.

Isabella Villaseñor AI es una plataforma de orquestación cognitiva gobernada para contexto territorial, evidencia, memoria, herramientas y decisiones humanas. El producto no se presenta como AGI, consciencia artificial ni autoridad autónoma: los modelos sugieren; las personas deciden, aprueban y ejecutan.

## Estado honesto

- **Versión canónica:** `4.3.3` (`package.json`).
- **Runtime:** Node.js `24.x`, pnpm `10.34.5`, Vite, React 19, TypeScript, Nitro/Vercel.
- **Persistencia:** PostgreSQL/Neon y Prisma cuando el entorno está configurado.
- **Estado:** arquitectura ejecutable en evolución; no certificada para producción, seguridad gubernamental, finanzas o regulación.
- **Regla:** código existente, build verde y test local no equivalen a verificación de producción.

## Experiencia de producto

La aplicación inicia con una entrada cinematográfica de Isabella y una autorización explícita para la inmersión de audio/video, privacidad, cookies y reglamentos internos. Después abre un workspace de inteligencia con una dirección visual editorial: graphite profundo, teal técnico y oro moderado; sin estética arcade, sin claims fabricados y con degradación visible cuando una capacidad no está disponible.

La navegación de alto costo se carga bajo demanda. El cliente no recibe secretos: `JWT`, `MUX_TOKEN_ID` y `MUX_TOKEN_SECRET` son variables server-side. El audio y el video pueden usar MUX cuando existe configuración; el sistema conserva un fallback controlado.

## Arquitectura

```text
PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND
```

- **CROWN:** arbitraje, routing, estado y policy decision.
- **ISA:** presencia, tono y presentación.
- **SOPHIA:** evidencia, epistemología y clasificación E0–E4.
- **ORION:** herramientas, sandbox y workflows autorizados.
- **ARGUS:** riesgo, veto, redacción, kill switch y auditoría.
- **MNEMOS:** memoria con scopes.
- **BookPI:** decisiones, procedencia y evidencia append-only.

Toda mutación sensible debe resolver identidad, tenant, capability, cuota, aprobación, validación de entrada/salida y auditoría. Si falla una condición crítica, la operación se detiene.

## Arranque y variables

El arranque valida el entorno antes de compilar en desarrollo y registra únicamente un resumen no sensible en el servidor. Las variables nativas reconocidas incluyen:

- `JWT` o, preferentemente, `AUTH_JWT_SECRET` para autenticación server-side.
- `MUX_TOKEN_ID` y `MUX_TOKEN_SECRET` para operaciones MUX server-side.
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` sólo para el flujo de preview autorizado.
- `DATABASE_URL`, `ISABELLA_STORAGE_PROVIDER` y las claves de política para staging/producción.

Nunca se deben colocar secretos en `VITE_*`, código cliente, fixtures, README, logs o artefactos de build. Configura los valores desde Vercel Vars o Secret Manager del despliegue.

## Comandos

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm security:scan
pnpm verify:lock
pnpm audit:repository
pnpm audit:routes
pnpm build
```

Para producción, usar la cadena definida en `package.json`:

```bash
pnpm production:gate
```

La cadena puede detenerse por evidencia externa, base viva, claves de atestación, billing de GitHub Actions o infraestructura no disponible. No se debe convertir `EVIDENCE_GATED` en `PASS` manualmente.

## Seguridad y privacidad

- Cookies de sesión HttpOnly; no se persisten tokens en `localStorage`.
- Rate limiting, límites de cuerpo, timeouts y validación Zod en los bordes.
- Redacción de JWT, claves privadas, tokens de proveedores y PII de alta confianza.
- SSRF con allowlist HTTPS.
- Separación explícita entre sugerencia de modelo y autorización de herramienta.
- Logs técnicos sin prompts, respuestas, audio, archivos, coordenadas precisas o credenciales.
- Políticas de seguridad y headers se aplican en el servidor, no mediante meta tags.

La existencia de un módulo criptográfico, PQC, firma o ledger no demuestra certificación ni operación HSM. Las atestaciones requieren clave pública del operador y evidencia reproducible.

## Auditoría y deduplicación

La fuente de verdad operacional es `AGENTS.md`, seguida por `package.json`, lockfile, contratos runtime, migraciones y manifiestos de evidencia. Antes de fusionar:

1. Ejecuta `pnpm audit:repository` y `pnpm audit:routes`.
2. Revisa duplicación de rutas, módulos y documentos antes de eliminar archivos.
3. Conserva un único contrato canónico por dominio; los adaptadores deben delegar, no copiar lógica.
4. No borres archivos sólo por nombre parecido: verifica importadores, tests y estado de despliegue.
5. Documenta cualquier capacidad parcial o bloqueada.

## Integración MUX

La integración debe ejecutarse en servidor con `MUX_TOKEN_ID` y `MUX_TOKEN_SECRET`. El cliente recibe sólo un playback ID o asset autorizado. Si no hay asset configurado, se usa el fallback indicado por `MUX_INTRO_FALLBACK_TYPE`; ningún placeholder se presenta como video real.

## Contribución

- Mantén cambios pequeños y trazables.
- No reescribas historia publicada ni subas secretos.
- Añade pruebas para cada corrección de seguridad o contrato.
- Ejecuta los gates relevantes antes de sincronizar.
- Describe límites, evidencia y ambiente de verificación.

## Licencia y gobernanza

La documentación y contenido siguen la licencia declarada por el repositorio. Código y dependencias conservan sus licencias específicas. Isabella no es persona, autoridad legal, certificación, garantía de exactitud ni sustituto de revisión humana.

**Principio rector:** la inteligencia asiste; la responsabilidad humana permanece.

**SSOT técnico:** `package.json` · `AGENTS.md` · `SECURITY.md` · `LICENSES.md` · migraciones · contratos runtime.
