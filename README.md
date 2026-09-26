# Isabella Villaseñor AI Genesis

Isabella es una plataforma Next.js/TanStack Start orientada a interacción cognitiva gobernada, con una interfaz operativa, pipeline FGAIS, controles de autorización, proveedores de inteligencia configurables, auditoría y módulos de ejecución restringida.

## Estado real

- **Código:** implementado y compilable en el branch `v0/genesis-turbo-tina`.
- **Validación local actual:** `typecheck` y pruebas unitarias aprobadas; lint sin errores después del saneamiento de formato.
- **Producción:** requiere validar variables, credenciales, proveedor de modelo, base de datos y políticas en el ambiente de despliegue.
- **Certificación:** no se declara certificación jurídica, académica, regulatoria, criptográfica ni de seguridad únicamente por pasar checks locales.

La clasificación de capacidades sigue `AGENTS.md`: `IMPLEMENTED`, `TESTED`, `VERIFIED`, `DEPLOYED`, `HARDENED` y `CERTIFIED` no son equivalentes.

## Funciones principales

- Chat de Isabella con autorización soberana y fallback de invitado limitado a desarrollo/Preview configurado.
- Intro cinematográfica inicial por sesión, omisible y accesible.
- Navegación modular con estado persistido en hash para recuperación de la vista.
- Gate de política y contexto principal para tenant, scopes, sesiones y API keys.
- Router de inteligencia con proveedores locales/OpenAI-compatible y federación gratuita opt-in.
- Registro de modelos, health checks, límites de tiempo, validación HTTPS y degradación controlada.
- CROWN/ARGUS/SOPHIA/ORION como fronteras conceptuales de decisión, evidencia, herramientas y seguridad.
- BookPI y telemetría para trazabilidad; las abstracciones no se presentan como WORM, HSM o certificación sin evidencia externa.

## Arquitectura de ejecución

```text
PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND
```

Las mutaciones, operaciones económicas, permisos y herramientas con efectos laterales deben fallar cerradas cuando falten identidad, policy decision, capability check, cuotas, validación o evidencia requerida.

## Desarrollo

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm build
```

Para el gate completo de producción, revisar primero los scripts disponibles en `package.json` y ejecutar únicamente los que tengan variables e infraestructura configuradas:

```bash
pnpm production:gate
```

El build Vercel usa Nitro y genera `.vercel/output`; ese directorio es artefacto generado y está excluido del control de versiones.

## Configuración esencial

Usa `.env.example` como contrato. Nunca publiques secretos. En Preview, el chat invitado requiere `ALLOW_GUEST_CHAT=true`; en producción debe usarse una identidad firmada o `X-Isabella-API-Key`. Los proveedores de IA remotos son opt-in, deben tener endpoint HTTPS explícito y no convierten automáticamente una respuesta en evidencia verificada.

## Documentación y limpieza

- `AGENTS.md`: reglas canónicas de arquitectura, seguridad y despliegue.
- `docs/INDEX.md`: entrada única a documentación viva.
- `docs/01..07`: canon funcional, operaciones, seguridad, economía, ML, contribución y categoría.
- `docs/operations/`, `docs/security/`, `docs/evidence/`: runbooks, contratos y evidencia.
- `docs/_archive/`: histórico deliberado; no es fuente de estado actual y no debe citarse sin revisión.

Los duplicados binarios rastreados que tienen funciones distintas se conservan separados: assets públicos/runtime, fixtures de despliegue, catálogos de policy y documentación histórica no son intercambiables. Los directorios `.output`, `dist`, `.next` y caches son generados y no deben versionarse.

## Claves de operación

El catálogo completo y actualizado de credenciales externas e internas está en [`docs/operations/SECRETS-CATALOG.md`](docs/operations/SECRETS-CATALOG.md). Para la operación mínima de producción se requieren persistencia configurada, `AUTH_JWT_SECRET`, `ENCRYPTION_MASTER_KEY`, `CROWN_POLICY_SIGNING_KEY`, `AEGIS_AUDIT_SECRET`, `BOOKPI_SIGNING_KEY`, `PROVISION_OWNER_TOKEN`, `API_KEY_HASH_SECRET` y, si se habilita inferencia externa, la credencial del proveedor correspondiente.

## Seguridad y honestidad operativa

No introduzcas tokens, claves, datos personales, dumps ni certificados privados. Las claves de firma y credenciales se mantienen **REDACTED** en documentación y se gestionan únicamente mediante variables seguras del entorno. Un modelo no es una autoridad; una predicción no es un hecho; una recomendación no es una aprobación. Toda capacidad debe conservar procedencia, límites, revisión humana cuando corresponda y evidencia reproducible.

## Licencias

Consulta `LICENSE`, `LICENSES.md`, `LICENSE-CONTROL.md`, `LICENSE-SOVEREIGN.md` y `NOTICE`. Las dependencias y subproyectos conservan sus propias licencias.

## Mantenimiento

Antes de publicar, ejecuta checks reproducibles, revisa el diff, confirma las variables del entorno objetivo y registra cualquier check bloqueado. No se debe afirmar que el proyecto está certificado o listo para producción solo porque el build local sea verde.
