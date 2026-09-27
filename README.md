# Isabella Villaseñor AI Genesis

Plataforma de interacción cognitiva gobernada (Next.js/TanStack Start + Nitro), con pipeline FGAIS, autorización soberana, memoria jerárquica, registro de herramientas, economía con ledger, módulos de ejecución restringida, **policy-as-code** y **ledger durable de decisiones**.

**Versión:** `4.3.3` (SSOT: `package.json`). **Rama:** `main`. **Fecha de esta revisión:** 2026-09-26.

> Doctrina de capacidad (`AGENTS.md`): código existente ≠ capacidad verificada; build verde ≠ certificación; un gate `EVIDENCE_GATED` ≠ `PASS`; una firma simulada ≠ criptografía operativa.

## Estado real

Las cifras provienen de la auditoría de 500 ítems (`ISA-001..ISA-500`, 134 de severidad P0) re-verificada contra el código el 2026-09-26. Detalle y metodología: [`docs/status/ISA-500-STATUS-2026-09-26.md`](docs/status/ISA-500-STATUS-2026-09-26.md); checklist completo versionado en [`docs/status/ISABELLA-GENESIS-500-CHECKLIST.md`](docs/status/ISABELLA-GENESIS-500-CHECKLIST.md) (y `.json`/`.csv`). El mismo estado es el SSOT publicado en `production-capabilities.json`.

| Métrica | Valor | Cómo se calcula |
|---|---:|---|
| Ítems `FIXED` (implementados **y** con prueba) | **44 / 500 = 8.8%** | sólo ítems con código + test |
| Ítems `PARTIAL` | 374 / 500 = 74.8% | implementación parcial |
| Ítems `STILL_BROKEN` | 72 / 500 = 14.4% | sin implementación verificable |
| Ítems `BLOCKED_ENVIRONMENT` | 8 / 500 = 1.6% | requiere DB/GHCR/CI vivos |
| **Implementación ponderada** | **46%** | `(44×1 + 374×0.5) / 500 = 46.2%` — **cota inferior** |
| Ítems P0 `FIXED` | 35 / 134 = 26.1% | P0 ponderado: 47.0% |
| Despliegue | 62% | avance real hasta Neon/Stripe/HSM vivos |
| **Global** | **54%** | media aritmética `(46 + 62) / 2` |

Se declara explícitamente lo que **no** está: no hay un 100% de implementación ni un 97% de avance; el 46% es una cota inferior porque `PARTIAL` es además el valor por defecto para los ítems P1/P2 no auditados en profundidad.

> Los cambios del 2026-09-26 posteriores a la auditoría (canonicalización JCS en la cadena durable, aislamiento territorial ABAC, telemetría real del double-pipeline, policy-as-code y ledger de decisiones) **aún no se han re-contado** dentro de las 500 casillas; hasta re-ejecutar el conteo, las cifras de arriba se mantienen sin inflar.

### Qué está verificado localmente (2026-09-26)

| Gate | Estado |
|---|---|
| `pnpm typecheck` | PASS — 0 errores |
| `pnpm lint` | PASS — 0 errores, 33 warnings |
| `pnpm test` | PASS — **720 pruebas**, 13 omitidas, 0 fallos (117 archivos aprobados, 119 en total) |
| `pnpm build` | PASS (Vite + Nitro) |
| `pnpm security:scan` | PASS (SAST + secret scan) |
| `pnpm verify:lock` | PASS |
| `pnpm capabilities` | PASS — 31 capacidades (28 `real`, 2 `evidence-gated`, 1 `manual`) |
| `pnpm audit:repository`, `pnpm audit:routes` | PASS |
| `pnpm db:verify` | PASS — 36 migraciones, contrato estático OK (sin base viva) |
| `pnpm production:integrity`, `pnpm production:preflight` | PASS — `static_ready`, 30 archivos validados |
| `pnpm format:check` | PASS |

### Qué sigue bloqueado o sin ejecutar

- **CI de GitHub Actions bloqueado por billing (issue #66):** ningún workflow corre en HEAD (fallan en segundos sin runner asignado); es un bloqueo de cuenta, no de código. Los gates canónicos quedan `SKIPPED`/`EVIDENCE_GATED`.
- **Migración `20260926030000` versionada pero no aplicada:** `isabella_policies` e `isabella_decisions` existen en código y RLS está declarado, pero hasta aplicarla en el ambiente, policy-as-code y decision ledger se publican como `production_safe: false`.
- `k8s:image:verify --require-digest`: **BLOCKED_ENVIRONMENT** (GHCR devuelve `DENIED` en lectura anónima).
- `db:migrate`, RLS en vivo, Neon/Stripe/HSM reales: sin `DATABASE_URL`/credenciales en este entorno; sólo se validan estáticamente. Docker no está instalado localmente.
- `production:evidence`: declara `EVIDENCE_GATED` salvo con árbol limpio y commit *same-commit*; `EVIDENCE_GATED` no cuenta como `PASS`.
- Ítems P0 abiertos de mayor impacto: MoE real (`ISA-003..017`), gate de salida de seguridad (`ISA-140/175`), gobierno del router de inteligencia (`ISA-125`), borrado verificable (`ISA-427/428`), gate de secretos en CI (`ISA-325`, existe en `fgais-gate.yml` pero la protección de rama no es verificable desde aquí) y suites `ISA-379..391`/`ISA-393`.

## Cambios recientes (2026-09-26)

| Lote | Commits | Contenido |
|---|---|---|
| Seguridad | `f0896d2` | Cadena durable fail-closed en runtime productivo (`HsmDurableUnavailableError`, sin fallback a memoria), canonicalización JCS (RFC 8785) en hash/firma de `authorization` y `ncua-protocol`, aislamiento territorial ABAC desde el contexto, salidas marcadas sin `raw`, telemetría **medida** en double-pipeline/sovereign-pipeline (fin de los valores sembrados con `Math.sin`), Dockerfile a `node:24-alpine` con `.dockerignore` y sin label SBOM embebido. |
| Policy-as-code | `5dcef2d` | Migración `20260926030000` (tablas + RLS server-only + seeds fail-closed), `policy-repository`, `db-policy-gate` (overlay monótono) y su wiring en `execution-authority` (stage `db-policy`). 27 tests. |
| Decisiones | `c1f5059` | `decision-repository` (ledger Postgres con verificación de cadena previa, idempotencia y `verifyChain`), persistencia del `ALLOW` **antes** del despacho (si la cadena no escribeable no se ejecuta) y del `DENY`/`REVIEW` best-effort, inyección desde `isabella-chat-gateway` cuando hay `DATABASE_URL`. 8 tests. |

## Integración de Nodo Cero

`nodo-cero-isabella` es el repositorio del Nodo Cero (Real del Monte, Hidalgo), origen de los intentos previos de Isabella. Se reconstruyó desde su `.git/objects` (147 objetos sueltos + 2 packfiles; 62 commits, 4 puntas) y se integró lo funcional con `isabella-ai-genesis`:

**Integrado (adaptado a `AGENTS.md`):**

- `data/migrations/006_rls_security.sql` + `data/seed/006_policies.sql` → migración `20260926030000_isabella_policy_as_code.sql`: tablas `isabella_policies`/`isabella_decisions`, RLS con el patrón server-only de este repo (`ENABLE` + `REVOKE`, no las políticas permisivas de origen), triggers append-only y seeds reescritos al vocabulario propio (`risk`, `category`, `territorialBoundary`, `authenticated`).
- `domains/ai/src/infrastructure/policy-gate.ts` → `src/lib/db-policy-gate.ts`: **cambiado de fail-open a fail-closed** (el original devolvía `default_allow`/`no_rule_matched` → `allowed`); aquí sólo puede endurecer la decisión de ARGUS y la indisponibilidad de la fuente exige aprobación humana para herramientas sensibles.
- `domains/ai/src/infrastructure/audit-tracer.ts` + tabla de decisiones → `src/lib/repositories/decision-repository.ts` sobre `governance/decision-ledger.ts` (la firma HMAC-SHA256 de origen se omite: aquí la cadena ya es SHA3-512 con `audit_events`/BookPI como autoridad de evidencia).

**Evaluado y NO integrado:**

- `apps/rdm-hub/**` (Next.js territorial con audio/imagenes): producto distinto, sin relación con los huecos ISA-500; mezclarlo rompería el alcance del proyecto.
- `packages/tamv-kernel/*` (event bus/store): solapado por `decision-ledger` + BookPI + outbox ya existentes.
- `supabase/functions/model-router` y `cron-audit-sync` (Edge Functions Deno): duplicarían el router de inteligencia y la auditoría ya presentes.
- `domains/*/src/contracts.ts`: contratos mínimos inferiores a `AGENTS.md` §7.
- `docs/architecture/tamv-kernel-unificado.md` y `docs/isabella/blueprint.md`: documentación de diseño sin evidencia ejecutable; conservados como referencia, no como estado.

## Funciones principales

- Chat de Isabella con autorización soberana (RBAC + PDP) y fallback de invitado limitado a desarrollo/Preview.
- Intro cinematográfica inicial por sesión, omisible y accesible.
- Navegación modular con estado persistido en hash.
- Pipeline FGAIS canónico: `PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND`, con fail-closed en identidad, tenant, política, cuota, validación y evidencia.
- **Policy-as-code:** reglas versionadas en `isabella_policies` (seeds fail-closed) aplicadas como overlay monótono sobre ARGUS; sin `DATABASE_URL` la capa se declara `not_configured` y no inventa un allow.
- **Ledger de decisiones durable:** `isabella_decisions` append-only con cadena SHA3-512 verificada antes de cada insert; el `ALLOW` se persiste antes de ejecutar y un fallo de escritura bloquea la ejecución.
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

El `POLICY GATE` evalúa en dos capas: motor ARGUS de código (`policy-engine.ts`) y overlay de reglas versionadas (`db-policy-gate.ts` sobre `isabella_policies`); la segunda sólo puede endurecir a la primera. Las mutaciones, operaciones económicas, cambios de permisos y herramientas con efectos laterales fallan cerradas cuando falta identidad, decisión de política, capability, cuota, validación o evidencia requerida.

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

**Orden de despliegue con la nueva gobernanza:** aplicar `pnpm db:migrate` (job `migrate` de `deploy-production.yml`) *antes* de servir tráfico: `isabella_policies` e `isabella_decisions` deben existir para que el `ALLOW` de herramientas pueda persistirse. Sin `DATABASE_URL` (Preview/dev) la capa se desactiva de forma declarada, no silenciosa.

En Preview, el chat invitado requiere `ALLOW_GUEST_CHAT=true`; en producción debe usarse identidad firmada o `X-Isabella-API-Key`. Los proveedores IA remotos son opt-in, exigen endpoint HTTPS explícito y una respuesta de modelo nunca se convierte automáticamente en evidencia verificada.

## Documentación y limpieza

- `AGENTS.md`: reglas canónicas de arquitectura, seguridad y despliegue.
- `docs/INDEX.md`: entrada única a documentación viva.
- `docs/status/ISA-500-STATUS-2026-09-26.md`: estado real de la auditoría de 500 ítems.
- `docs/status/ISABELLA-GENESIS-500-CHECKLIST.{md,json,csv}`: checklist de remediación completo (500 ítems) versionado en el repo.
- `docs/01..07`: canon funcional, operaciones, seguridad, economía, ML, contribución y categoría.
- `docs/operations/`, `docs/security/`, `docs/evidence/`: runbooks, contratos y evidencia.
- `docs/_archive/`: histórico deliberado; no es fuente de estado actual.

Los duplicados binarios rastreados con funciones distintas se conservan separados (assets, fixtures de despliegue, catálogos de policy y documentación histórica no son intercambiables). Los directorios `.output`, `dist`, `.next` y caches son generados y no deben versionarse.

## Seguridad y honestidad operativa

No introduzcas tokens, claves, datos personales, dumps ni certificados privados. Las claves de firma y credenciales se mantienen **REDACTED** en la documentación y se gestionan únicamente mediante variables seguras del entorno/Secret Manager.

Prohibiciones verificadas por gates: sin datos sintéticos en runtime productivo, sin adapters de test fuera de test/dev, sin `process.env` directo fuera de `src/lib/config.ts`, sin secretos en el repositorio (`pnpm security:scan`).

Un modelo no es una autoridad; una predicción no es un hecho; una recomendación no es una aprobación. Toda capacidad debe conservar procedencia, límites, revisión humana cuando corresponda y evidencia reproducible.

## Licencias

Consulta `LICENSE`, `LICENSES.md`, `LICENSE-CONTROL.md`, `LICENSE-SOVEREIGN.md` y `NOTICE`. Las dependencias y subproyectos conservan sus propias licencias. El material proveniente del Nodo Cero se integra bajo las mismas condiciones; su procedencia queda registrada en la sección *Integración de Nodo Cero*.

## Mantenimiento

Antes de publicar: ejecuta los checks reproducibles, revisa `git diff`, confirma las variables del entorno objetivo y registra cualquier check bloqueado. No se afirma que el proyecto esté certificado o listo para producción sólo porque el build local sea verde.
