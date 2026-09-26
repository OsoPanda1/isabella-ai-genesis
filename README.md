# Isabella Villaseñor AI Genesis

Plataforma de interacción cognitiva gobernada (Next.js/TanStack Start + Nitro), con pipeline FGAIS, autorización soberana, memoria jerárquica, registro de herramientas, economía con ledger y módulos de ejecución restringida.

**Versión:** `4.3.3` (SSOT: `package.json`). **Rama:** `main`. **Fecha de esta revisión:** 2026-09-26.

> Doctrina de capacidad (`AGENTS.md`): código existente ≠ capacidad verificada; build verde ≠ certificación; un gate `EVIDENCE_GATED` ≠ `PASS`; una firma simulada ≠ criptografía operativa.

## Estado real

Las cifras provienen de la auditoría de 500 ítems (`ISA-001..ISA-500`, 134 de severidad P0) re-verificada contra el código el 2026-09-26. Detalle y metodología: [`docs/status/ISA-500-STATUS-2026-09-26.md`](docs/status/ISA-500-STATUS-2026-09-26.md). El mismo estado es el SSOT publicado en `production-capabilities.json`.

| Métrica | Valor | Cómo se calcula |
|---|---:|---|
| Ítems `FIXED` (implementados **y** con prueba) | **42 / 500 = 8.4%** | sólo ítems con código + test |
| Ítems `PARTIAL` | 376 / 500 = 75.2% | implementación parcial |
| Ítems `STILL_BROKEN` | 74 / 500 = 14.8% | sin implementación verificable |
| Ítems `BLOCKED_ENVIRONMENT` | 8 / 500 = 1.6% | requiere DB/GHCR/CI vivos |
| **Implementación ponderada** | **46%** | `(42×1 + 376×0.5) / 500` — **cota inferior** |
| Ítems P0 `FIXED` | 33 / 134 = 24.6% | P0 ponderado: 46.3% |
| Despliegue | 62% | avance real hasta Neon/Stripe/HSM vivos |
| **Global** | **54%** | media aritmética `(46 + 62) / 2` |

Se declara explícitamente lo que **no** está: no hay un 100% de implementación ni un 97% de avance; el 46% es una cota inferior porque `PARTIAL` es además el valor por defecto para los ítems P1/P2 no auditados en profundidad.

### Qué está verificado localmente (2026-09-26)

| Gate | Estado |
|---|---|
| `pnpm typecheck` | PASS — 0 errores |
| `pnpm lint` | PASS — 0 errores, 47 warnings |
| `pnpm test` | PASS — **671 pruebas**, 13 omitidas, 0 fallos (114 archivos, 116 en total) |
| `pnpm build` | PASS (Vite + Nitro) |
| `pnpm security:scan` | PASS (SAST + secret scan) |
| `pnpm verify:lock` | PASS |
| `pnpm capabilities` | PASS |
| `pnpm audit:repository`, `pnpm audit:routes` | PASS |
| `pnpm db:verify` | PASS (sólo validación estática) |
| `pnpm production:integrity`, `pnpm production:preflight` | PASS |
| `pnpm format:check` | PASS |

### Qué sigue bloqueado o sin ejecutar

- `k8s:image:verify --require-digest`: **BLOCKED_ENVIRONMENT** (GHCR devuelve `DENIED` en lectura anónima).
- `db:migrate`, RLS en vivo, Neon/Stripe/HSM reales: sin `DATABASE_URL`/credenciales en este entorno; sólo se validan estáticamente.
- `production:evidence`: declara `EVIDENCE_GATED` salvo con árbol limpio y commit *same-commit*; `EVIDENCE_GATED` no cuenta como `PASS`.
- Ítems P0 abiertos de mayor impacto: MoE real (`ISA-003..017`), gate de salida de seguridad (`ISA-140/175`), gobierno del router de inteligencia (`ISA-125`), sanitización en `ncua/lsh.ts` (`ISA-083`), borrado verificable (`ISA-427/428`), gate de secretos en CI (`ISA-325`) y suites `ISA-379..393`.

## Funciones principales

- Chat de Isabella con autorización soberana (RBAC + PDP) y fallback de invitado limitado a desarrollo/Preview.
- Intro cinematográfica inicial por sesión, omisible y accesible.
- Navegación modular con estado persistido en hash.
- Pipeline FGAIS canónico: `PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND`, con fail-closed en identidad, tenant, política, cuota, validación y evidencia.
- Memoria jerárquica (`immediate`, `session`, `project`, `territorial`, `historical`) con procedencia y límites de scope.
- Registro de herramientas con `requiredPermissions` mapeados de forma explícita a RBAC (deny-by-default si el permiso no está mapeado) y re-evaluación inmediata antes de ejecutar.
- Proveedores de inteligencia locales/OpenAI-compatible y federación gratuita opt-in; todo egress remoto pasa por la allowlist centralizada (`SecuritySystem.fetchSafeUpstream`, HTTPS + host exacto + sin redirecciones).
- Webhooks de connect verificados por firma con cola idempotente durable.
- BookPI y telemetría para trazabilidad: las abstracciones **no** se presentan como WORM, HSM ni certificación sin evidencia externa.

## Arquitectura de ejecución

```text
PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND
```

Nodos: `CROWN` (arbitraje/routing/estado), `ISA` (presencia/tono), `SOPHIA` (evidencia/E0–E4), `ORION` (herramientas/sandbox), `ARGUS` (defensa/veto/auditoría).

Las mutaciones, operaciones económicas, cambios de permisos y herramientas con efectos laterales fallan cerradas cuando falta identidad, decisión de política, capability, cuota, validación o evidencia requerida.

## Desarrollo

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Gates completos (revisa `package.json` antes de invocarlos; ejecuta sólo los que tengan variables e infraestructura configuradas):

```bash
pnpm verify:lock && pnpm security:scan && pnpm capabilities
pnpm audit:repository && pnpm audit:routes && pnpm db:verify
pnpm production:integrity && pnpm production:preflight
pnpm production:gate        # cadena completa, incluye production:evidence
```

El build de Vercel usa Nitro y genera `.vercel/output`; es artefacto generado y está excluido del control de versiones.

## Configuración esencial

Usa `.env.example` como contrato. Los secretos reales **REDACTED**: viven sólo en variables seguras del entorno y en Secret Manager del proveedor de despliegue; nunca en código, logs, UI, fixtures ni documentación.

Para la operación mínima de producción se requieren persistencia configurada, `AUTH_JWT_SECRET`, `ENCRYPTION_MASTER_KEY`, `CROWN_POLICY_SIGNING_KEY`, `AEGIS_AUDIT_SECRET`, `BOOKPI_SIGNING_KEY`, `PROVISION_OWNER_TOKEN`, `API_KEY_HASH_SECRET` y, si se habilita inferencia externa, la credencial del proveedor correspondiente. Catálogo completo: [`docs/operations/SECRETS-CATALOG.md`](docs/operations/SECRETS-CATALOG.md).

El acceso a `process.env` está centralizado en `src/lib/config.ts` (`passthroughEnv`, `passthroughChildEnv`, `fingerprintEnvSource`); el resto del código consume esa única superficie.

En Preview, el chat invitado requiere `ALLOW_GUEST_CHAT=true`; en producción debe usarse identidad firmada o `X-Isabella-API-Key`. Los proveedores IA remotos son opt-in, exigen endpoint HTTPS explícito y una respuesta de modelo nunca se convierte automáticamente en evidencia verificada.

## Documentación y limpieza

- `AGENTS.md`: reglas canónicas de arquitectura, seguridad y despliegue.
- `docs/INDEX.md`: entrada única a documentación viva.
- `docs/status/ISA-500-STATUS-2026-09-26.md`: estado real de la auditoría de 500 ítems.
- `docs/01..07`: canon funcional, operaciones, seguridad, economía, ML, contribución y categoría.
- `docs/operations/`, `docs/security/`, `docs/evidence/`: runbooks, contratos y evidencia.
- `docs/_archive/`: histórico deliberado; no es fuente de estado actual.

Los duplicados binarios rastreados con funciones distintas se conservan separados (assets, fixtures de despliegue, catálogos de policy y documentación histórica no son intercambiables). Los directorios `.output`, `dist`, `.next` y caches son generados y no deben versionarse.

## Seguridad y honestidad operativa

No introduzcas tokens, claves, datos personales, dumps ni certificados privados. Las claves de firma y credenciales se mantienen **REDACTED** en la documentación y se gestionan únicamente mediante variables seguras del entorno/Secret Manager.

Prohibiciones verificadas por gates: sin datos sintéticos en runtime productivo, sin adapters de test fuera de test/dev, sin `process.env` directo fuera de `src/lib/config.ts`, sin secretos en el repositorio (`pnpm security:scan`).

Un modelo no es una autoridad; una predicción no es un hecho; una recomendación no es una aprobación. Toda capacidad debe conservar procedencia, límites, revisión humana cuando corresponda y evidencia reproducible.

## Licencias

Consulta `LICENSE`, `LICENSES.md`, `LICENSE-CONTROL.md`, `LICENSE-SOVEREIGN.md` y `NOTICE`. Las dependencias y subproyectos conservan sus propias licencias.

## Mantenimiento

Antes de publicar: ejecuta los checks reproducibles, revisa `git diff`, confirma las variables del entorno objetivo y registra cualquier check bloqueado. No se afirma que el proyecto esté certificado o listo para producción sólo porque el build local sea verde.
