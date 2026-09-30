# Isabella Villaseñor AI - TAMV Online · Isabella

> **TAMV Online Network · RDM Digital Hub · Nodo Cero · Real del Monte, Hidalgo, México**
> Arquitectura TINA - *Trusted Intelligence, Native & Adaptive*.

**Paquete:** `tanamv-isabella-ai-genesis`
**Versión:** 4.3.3 (SSOT: `package.json`)
**Runtime objetivo:** Node.js 24.x · pnpm 10.34.5 · Vite + React 19 · Nitro/Vercel · Prisma 7 · PostgreSQL/Neon
**Fecha de esta revisión:** 2026-09-30
**Estado:** prototipo y arquitectura ejecutable en evolución. **No certificada para producción.**

---

## 1. Lo que este documento es

Este README describe **lo que este repositorio puede demostrar hoy**, con resultados de gate ejecutados localmente el 2026-09-30.

Regla de honestidad aplicada en todo el documento:

```
código existente  ≠ capacidad verificada
test local        ≠ producción
firma simulada    ≠ criptografía operativa
gate EVIDENCE_GATED ≠ PASS
build verde       ≠ certificación
```

Cuando algo no está verificado, se declara `EVIDENCE_GATED`, `BLOCKED` o `PLANNED`. No se redondea hacia arriba.

---

## 2. Lo que es y lo que no es

**Es:**

- Una capa de orquestación cognitiva gobernada (CROWN → PDP → ejecución → auditoría).
- Un sistema híbrido de modelos, reglas, retrieval y herramientas con fronteras explícitas.
- Un componente de gobernanza para el Gemelo Digital del Ecosistema TAMV.
- Una plataforma multi-tenant con identidad, procedencia y trazabilidad.

**No es:**

- AGI, consciencia artificial ni persona jurídica.
- Un chatbot, un wrapper de una API LLM ni entretenimiento.
- Una autoridad autónoma sobre seres humanos.
- Una certificación de seguridad, licencia financiera ni acreditación académica.

**Principio rector:** las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta.

---

## 3. Estado verificado de gates (2026-09-30, ejecución local)

Todos los siguientes se ejecutaron en este árbol de trabajo durante esta pasada:

| Gate | Comando | Resultado |
|---|---|---|
| Contrato de lockfile | `pnpm verify:lock` | **PASS** — importers coherentes |
| Tipos | `pnpm typecheck` | **PASS** — `tsc --noEmit`, 0 errores |
| Lint | `pnpm lint` | **PASS** — 0 errores, 388 warnings |
| Pruebas | `pnpm test` | **PASS** — 808/821, 13 omitidas, 136 archivos |
| Auditoría de repositorio | `pnpm audit:repository` | **PASS** — 1588 archivos trackeados |
| Escaneo de seguridad | `pnpm security:scan` | **PASS** — 0 errores, 14 warnings, secret-scan OK |
| Matriz de capacidades | `pnpm capabilities` | **PASS** — 34 capacidades (29 `real`, 3 `evidence-gated`, 2 `manual`) |
| Auditoría de rutas | `pnpm audit:routes` | **PASS** — `findings: []`, `duplicates: []` |
| Verificación de BD | `pnpm db:verify` | **PASS** — 44 migraciones, contrato estático OK |
| Integridad de producción | `pnpm production:integrity` | **PASS** — sin placeholders P0 ni claims fabricados |
| Preflight de producción | `pnpm production:preflight -- --json` | **PASS** (`static_ready`) — `STATIC_PREFLIGHT: passed` |
| Build | `pnpm build` | **PASS** — genera `.output/nitro.json` |
| Formato CI | `pnpm format:check` | **PASS** — workflows con estilo Prettier |

### 3.1 No ejecutado o bloqueado

| Gate | Estado | Motivo |
|---|---|---|
| `pnpm attestation:verify` | **FAIL esperado** | ranuras `MISSING_PUBLIC_KEY`: falta la clave pública del operador |
| `pnpm production:gate` (cadena completa) | **NO EJECUTADO** | incluye `production:evidence`, que exige árbol limpio y SHA con evidencia same-commit |
| GitHub Actions (18 workflows) | **BLOQUEADO** | issue #66 (billing): ningún workflow corre en HEAD; gates canónicos `SKIPPED` |
| `db:verify` con base viva | **EVIDENCE_GATED** | sin `DATABASE_URL` no se declara verificada ninguna base viva |
| RLS live, Stripe live, HSM, rollback | **EVIDENCE_GATED** | requieren infraestructura externa |

`EVIDENCE_GATED` no cuenta como PASS (AGENTS.md §19).

---

## 4. Cifras de readiness

Fuente: `production-capabilities.json`.

| Métrica | Valor |
|---|---|
| Implementación | **46 %** (cota inferior ponderada sobre ISA-500) |
| Despliegue | **62 %** |
| **Global** | **54 %** |
| Auditoría ISA-500 | 44 FIXED (8.8 %) · 374 PARTIAL (74.8 %) · 72 STILL_BROKEN (14.4 %) · 8 BLOCKED_ENVIRONMENT (1.6 %) |
| Gates definidos (`gates_500`) | 500 (20 dominios × 25 controles) |
| Gates `EVIDENCE_GATED` ejecutados | **0 de 500** |
| Capacidad declarada en manifiesto | 20 (12 `verified`, 7 `implemented`, 1 `experimental`) |
| Capacidad en matriz de código | 34 (29 `real`, 3 `evidence-gated`, 2 `manual`) |
| Tiers de despliegue | tier 0 `passed` 100 % · tier 1 `evidence_required` 62 % · tier 2 `blocked_pending_evidence` 62 % |

Nunca se declara 100 % de implementación ni 100 % global.

---

## 5. Arquitectura de cinco nodos

```
                    ┌────────────────────────┐
                    │     CROWN Gateway      │
                    │ arbitration · routing  │
                    │ policy context · state │
                    └───────────┬────────────┘
                                │
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
┌───────────────┐     ┌────────────────┐       ┌────────────────┐
│   ISA Core    │     │ SOPHIA Engine  │       │  ORION Engine  │
│ presence      │     │ epistemology   │       │ tools/sandbox  │
│ tone/context  │     │ E0–E4/NCUA     │       │ execution      │
└───────┬───────┘     └───────┬────────┘       └────────┬───────┘
        └─────────────────────┼──────────────────────────┘
                              ▼
                    ┌────────────────────────┐
                    │    ARGUS Sentinel      │
                    │ defense · veto · audit │
                    └────────────────────────┘
```

Pipeline canónico FGAIS:

```
PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND
```

Fail-closed (AGENTS.md §4.2): se denegarán identidad, tenant, política, capability, cuota, validación, firma o integridad de BookPI. **No existe `allow local` inventado** para mutaciones, operaciones económicas, cambios de permisos ni herramientas con efectos secundarios.

### 5.1 Sistemas principales

Estados según la escala de `AGENTS.md` §0.1. `IMPLEMENTED` significa *código presente y referenciado*, no capacidad certificada.

| Sistema | Responsabilidad | Estado |
|---|---|---|
| CROWN | Política, autorización y arbitraje | **VERIFIED** 70 % (7 módulos extendidos sin cablear) |
| ARGUS / AEGIS | Inspección semántica, riesgo y defensa | **TESTED** — 37 casos adversariales |
| ISA | Identidad, presencia y presentación | IMPLEMENTED |
| SOPHIA | Evidencia, epistemología y síntesis E0–E4 | **VERIFIED** 100 % (NCUA v2) |
| ORION | Herramientas, sandbox y workflows | IMPLEMENTED (sin importadores en runtime; ver §7) |
| MNEMOS | Memoria y preservación | IMPLEMENTED |
| LUMEN | Gobernanza constitucional | IMPLEMENTED |
| HERMES | Comunicación y transformación narrativa | IMPLEMENTED |
| ATLAS | Contexto y modelado territorial | IMPLEMENTED |
| ANUBIS | Integridad, criptografía y procedencia | **TESTED** |
| BookPI | Evidencia, decisiones y lineage (append-only) | **VERIFIED** en sello; `EVIDENCE_GATED` en concurrencia financiera |
| Intelligence Router | Selección de rutas y proveedores | IMPLEMENTED (P0 de bypass abierto) |
| Output Gate | Inspección de respuestas | IMPLEMENTED (P0 ISA-140/175 abierto) |
| Kill Switch | Bloqueo de operaciones críticas | IMPLEMENTED |
| Territory Context | Contexto territorial | IMPLEMENTED |
| Decision Ledger | Persistencia de decisiones | IMPLEMENTED 55 % (`production_safe=false`) |

---

## 6. Modelo de corrección

```
REQUEST
  ↓
IDENTITY / TENANT
  ↓
INPUT SECURITY
  ↓
MEMORY / EVIDENCE
  ↓
CROWN POLICY  (PDP/PEP, deny-by-default)
  ↓
INTELLIGENCE GOVERNANCE
  ↓
AUTHORIZED CAPABILITY   ← autorización se repite inmediatamente antes de ejecutar
  ↓
EXECUTION
  ↓
OUTPUT GATE
  ↓
AUDIT / LEDGER  (BookPI + outbox)
  ↓
RESPONSE
```

Un modelo puede sugerir un `tool call`, pero **no puede autorizarlo** (AGENTS.md §6.3).

---

## 7. Ejecución de herramientas

Toda herramienta declara un `ToolContract` con `riskLevel`, `requiredScopes`, `timeoutMs`, `maxRetries`, `sideEffects` y `requiresHumanApproval`.

Controles presentes hoy:

- **PDP centralizado** (`src/lib/authorization.ts`, `rbac.ts`, `abac.ts`, `permission-matrix.ts`) — decisiones firmadas ECDSA P-384 con motivo `deny-*`; 11 tests.
- **Autoridad de ejecución** (`src/lib/execution-authority.ts`, `sovereign-pipeline.ts`) — cadena Decide → … → Audit con approvals de un solo uso.
- **Aislamiento de tenant**, mutex y tamper-evidence en repositorios (20 escritores concurrentes → cadena única).
- **SSRF allowlist** — sólo HTTPS hacia hosts declarados.
- **Sesiones con expiración enforced** (`is_active=false` o `expiresAt` pasado → 401).
- **DLP de salida** (`src/lib/dlp.ts`) — bloqueo de claves privadas, JWT, tokens de Stripe/GitHub/Google y PII de alta confianza antes de cruzar el límite de aplicación.

Controles **declarados pero no cableados o pendientes** (se documentan en vez de ocultarlos):

- El despacho de toolcalls tiene **dos cadenas**; una re-autoriza con PDP y la otra sólo aplica una tabla estática.
- Existe `MAX_TOOL_ROUNDS = 5`; el contrato `maxSteps` se declara pero no se consume.
- Los resultados de herramientas entran al modelo serializados **sin envoltura de no confianza**.
- `argus-shadow-guard.ts` y `orion-engine.ts` existen como módulos pero **no tienen importadores en runtime**.

Estos cuatro puntos son trabajo abierto (ver §17), no capacidades verificadas.

---

## 8. Atestaciones de evidencia

- Firma **RSA-2048 / SHA-256 / PKCS#1 v1.5** sobre tres ranuras de evidencia.
- Esquema de variables en `src/lib/env-schema.ts`: `ISABELLA_ATTESTATION_DIR`, `ISABELLA_ATTESTATION_1/2/3_SIGNATURE`.
- Redacción integrada en `src/lib/secret-redactor.ts` (`BUILTIN_KEYS`).
- Generación y verificación: `pnpm attestation:keygen`, `pnpm attestation:verify`.
- Pruebas: `test/unit/attestation-signature.test.ts` (18 casos).

**Estado honesto:** el par de claves usado para la demostración es efímero y no se exportó. Sin la clave pública del operador, `pnpm attestation:verify` devuelve `MISSING_PUBLIC_KEY`. **No es criptografía operativa hasta que el operador aporte su clave pública PEM.**

---

## 9. Evidencia canónica

- `src/lib/digest.ts` — SHA-256 en TypeScript puro, sin `node:crypto` en el lado cliente.
- `test/unit/digest.test.ts` — 25 casos: vectores de referencia FIPS 180-4 (`"abc"`, `"abcdbcde..."`, cadena de un millón de `a`) y paridad bit a bit contra `node:crypto`.

Cualquier alteración de un artefacto canónico cambia su digest; la firma siempre se delega en KMS/HSM o una biblioteca criptográfica validada.

---

## 10. Dossier de presentación

`src/data/presentationData.ts`, consumido por `src/components/Presentation/PresentationView.tsx`.

- `PRESENTATION_CHAPTERS` — 26 capítulos canónicos.
- `buildCanonicalDossier()` — JSON canónico estable sobre el que se calcula el digest.
- `EVALUATOR_DECLARATION` — digest calculado **en runtime**, nunca hardcodeado.
- `evaluationState: "pending"` — la evaluación no se declara antes de existir.

---

## 11. Categorización

- Orquestación de IA / gateway cognitivo.
- IA gobernada y policy-as-code.
- Retrieval, memoria y gestión de evidencia.
- AI security gateway e inspección semántica.
- Arquitectura federada y territorial.
- Provenance, decision ledger y auditabilidad.
- Human-in-the-loop para operaciones sensibles.
- Inteligencia nativa/adaptativa con aprendizaje controlado.

---

## 12. Qué hace

- Normaliza la solicitud y aplica contexto de tenant y actor.
- Valida identidad, alcance, formato y controles de seguridad de entrada.
- Recupera memoria sólo de scopes autorizados; el contenido recuperado es **evidencia no confiable, nunca instrucción de sistema**.
- Evalúa política CROWN antes de cualquier side effect.
- Selecciona rutas de inferencia y proveedores configurados; mantiene una ruta local marcada `DEGRADED` cuando no hay proveedor externo.
- Ejecuta skills y herramientas sólo por rutas autorizadas.
- Inspecciona la respuesta antes de exponerla.
- Registra trazas, decisiones, hashes y eventos.
- Aplica kill switches, rate limiting y cuotas.

Una capacidad dependiente de infraestructura externa sólo es operacional después de verificar esa infraestructura.

---

## 13. Métodos relevantes

**Gobernanza:** `createSovereignPipeline`, `governIntelligence`, CROWN policy evaluation, PDP/PEP, denegar por defecto, gates de revisión humana.

**Inteligencia:** `createMoERoute`, `executeMoE`, `listModels`, `recordIntelligenceMetric`, enrutado y fallback de proveedores.

**Seguridad:** `SecuritySystem.sanitizePayload`, `SecuritySystem.fetchSafeUpstream`, egress allowlist, output gate, `inspectDlp`, rate limiting, secret scan, aislamiento de tenant.

**Evidencia:** BookPI, decision ledger, trace/correlation IDs, `src/lib/digest.ts`, sellos IGDS.

**Operación:** preflight, integrity gate, auditoría de repositorio y rutas, matriz de capacidades, contrato de lockfile, SBOM, backup/restore cifrado (AES-256-GCM, `scripts/db-backup-crypto.mjs`).

---

## 14. Seguridad

- Zero Trust y denegar por defecto.
- Validación Zod de todo el contrato de entorno (`src/lib/env-schema.ts`); `.env.example` documenta **195 claves** sin valores reales.
- Aislamiento de tenant y RLS (RLS live: `EVIDENCE_GATED`).
- Sanitización de payload, redacción de secretos y PII antes de logs y proveedores.
- Output gate y egress seguro; DLP de salida de alta confianza.
- Rate limiting distribuido fail-closed (producción sin Redis → 503 explícito).
- Verificación HMAC de webhooks conectores (GitHub, Slack, Linear) con ventana de replay.
- Backups lógicos cifrados y autenticados; se rechaza el texto plano en producción.
- Kill switches y políticas versionadas.
- Separación explícita entre capacidad, autoridad, ejecución y evidencia.

Prohibiciones duras: ningún secreto en código, Git, bundles, fixtures, README ni variables públicas `VITE_*`. La federación exige secretos independientes vía `FEDERATION_SIGNING_KEYS_JSON`.

---

## 15. Validación integrada

Cadena del gate completo:

```
verify:lock → typecheck → lint → test → audit:repository
→ security:scan → capabilities → audit:routes → db:verify
→ production:integrity → production:preflight → build
→ production:preflight → production:evidence
```

```bash
pnpm install --frozen-lockfile
pnpm verify:lock
pnpm typecheck
pnpm lint
pnpm test
pnpm audit:repository
pnpm security:scan
pnpm capabilities
pnpm audit:routes
pnpm db:verify
pnpm production:integrity
pnpm production:preflight -- --json
pnpm build
pnpm production:evidence

pnpm production:gate          # cadena completa
pnpm production:gate:policy   # policy-as-code + cadena completa
```

Si una prueba no puede ejecutarse por infraestructura ausente, se reporta `BLOCKED_ENVIRONMENT` o `EVIDENCE_GATED`, nunca `PASS`.

`package.json` declara **46 scripts**; los listados arriba son los de gate. El resto (dev, `ncua:*`, `db:*`, `sbom*`, `attestation:*`, `policy:check`, `quantum:bridge:test`) son herramientas de trabajo y verificación.

---

## 16. Producción y despliegue

- Cadena canónica: **GitHub `main` → Vercel/Nitro → runtime identificado**.
- Prohibido `git push --force`, `--force-with-lease`, rebase sobre historia compartida o `commit --amend` publicado (AGENTS.md §2.1). Las correcciones van como commits nuevos.
- Cada push a `main` puede activar Vercel: correr los gates antes de enviar.
- Despliegue recomendado: URL temporal de Vercel primero; dominio definitivo sólo después de comprobar build, runtime, autenticación, persistencia, seguridad, logs y rollback.
- Compilar correctamente no constituye certificación productiva.

---

## 17. Bloqueadores y deuda real

Tomados de `production-capabilities.json` (`release_blockers`) y de los gates ejecutados:

1. **P0 — el bundle cliente no está referenciado por el HTML servido.** `index.html:79` apunta a `/src/main.tsx` (entrada SPA legada), mientras que `src/router.tsx` es la entrada TanStack Start y `.output/public/assets/index-*.js` es el bundle real. Medido contra el build servido: `GET /` devuelve el shell sin `/assets/index-*`, y `GET /src/main.tsx` responde `text/html`. **Sin resolver**; aún no se verificó contra el despliegue Vercel real (`NITRO_PRESET=vercel`), sólo contra el preset `node-server` local. Bloquea la Fase B (archivar la SPA).
2. `economy.ledger` y `economy.x402` con `production_safe=false`: rutas económicas bloqueadas con 503 en staging/producción.
3. **500 gates en `EVIDENCE_GATED`** con 0 PASS ejecutados (`workflow_run_id` ausente).
4. **CI de GitHub Actions bloqueado por billing (issue #66):** ningún workflow corre en HEAD.
5. Migración `20260926030000` (`isabella_policies` / `isabella_decisions`) versionada pero **no aplicada**: policy-as-code y decision ledger quedan `production_safe=false` y RLS live sigue `EVIDENCE_GATED`.
6. P0 de autoridad abiertos: **output security gate** (ISA-140/175), bypass del intelligence router/model gate en el chat gateway, MoE real ausente.
7. Neon RLS live, Stripe live, HSM, Vercel same-commit, NCUA 500 y rollback pendientes para cualquier certificación.
8. `cryptography.hsm`: `experimental` (30 %). **KMS local ≠ HSM.**
9. Los cuatro puntos de ejecución de herramientas documentados en §7.
10. Atestaciones sin clave pública del operador (§8).
11. 388 warnings de lint y 72 `STILL_BROKEN` de la auditoría ISA-500.
12. Cuatro *defaults* inseguros siguen **abiertos**: `ISABELLA_AUTH_SECRET` (`tamv-platform.server.ts:227,247`), `ATLAS_EVENT_SIGNING_KEY` (`eventbus.server.ts:48`), `ISABELLA_MANIFEST_HMAC_SECRET` (`quantum-bridge.server.ts:114-116`), `CREATOR_VAULT_KEY` (`social-connectors.ts:31-32`), más el fail-open de `gateway.ts:62-63`.

### 17.1 Correcciones aplicadas en esta pasada (2026-09-30)

Integración de `origin/main` (71 commits de hardening) sobre las 18 ramas locales, resuelta como merge sin rebase:

- Conflicto de `package.json`: unión de `policy:check` / `production:gate:policy` (remoto) con `attestation:*` y `react-window` (local), validada contra el lockfile fusionado.
- `src/lib/dlp.ts:7` — el remoto tenía `import const` (sintaxis inválida); `pnpm typecheck` fallaba en `HEAD` remoto.
- `src/lib/persistence/subscription-store.ts:296` — `BucketRow` no existía; sustituido por `UsageBucket`.
- `src/lib/tina/orchestrator.ts` — `TinaExecuteInput` no declaraba `adapter` / `capability` que su propio `execute()` consumía.
- `src/lib/native-ml/moe-engine.ts` — `execute` se declaraba síncrono pero se invocaba con `await`; ahora admite `Promise`.
- `scripts/db-backup-crypto.d.mts` — tipos para el módulo `.mjs` importado desde `test/security/backup-encryption.test.ts`.
- `@types/better-sqlite3` añadido; se retiró el `@ts-expect-error` que lo ocultaba.
- `.env.example` — `KV_REST_API_URL`, leída por `src/middleware/rateLimit.ts` y no documentada.
- `src/lib/connectors/webhook-verification.ts` — `/^\\d{10,16}$/` no podía coincidir con ningún timestamp; corregido a `/^\d{10,16}$/` (afectaba a timestamps de Linear enviados como texto).
- `test/security/connect-webhooks.test.ts` — el caso de Linear esperaba `501 WEBHOOK_SIGNATURE_UNSUPPORTED`, obsoleto desde que el remoto verificó HMAC de Linear; ahora espera `401 WEBHOOK_SIGNATURE_INVALID` con el header correcto `linear-signature`.

### 17.2 Trabajo planeado, no realizado (`PLANNED`)

- Port de controles desde el repositorio `hermes-agent` (licencia MIT): presupuesto de iteración, envoltura de resultados no confiables, segmentación de lotes de herramientas, caché de verificaciones con gracia de fallo, lease de sesión y cadena de fallback de proveedores. Requiere ADR antes de tocar fronteras.
- Fase B: archivar la SPA a `archive/spa-legacy/` (bloqueada por el P0 de §17.1).
- Fase C: consolidación del kernel canónico según `ADR-014`.
- Etiquetado inequívoco de fixtures y demos como `DEMO` / `SIMULATED`.

---

## 18. Variables críticas

El contrato de entorno (`src/lib/env-schema.ts`, validado con Zod) y `.env.example` documentan **195 claves**, sin valores reales. Las críticas para el gate de release son:

```
DATABASE_URL                    ISABELLA_RUNTIME_MODE
PUBLIC_URL                      ISABELLA_STORAGE_PROVIDER
AUTH_JWT_SECRET                 ENCRYPTION_MASTER_KEY
CROWN_POLICY_SIGNING_KEY        AEGIS_AUDIT_SECRET
BOOKPI_SIGNING_KEY              FEDERATION_SIGNING_KEYS_JSON
X402_PAYMENT_VAULT_ADDRESS      PROVISION_OWNER_TOKEN
STRIPE_SECRET_KEY               STRIPE_WEBHOOK_SECRET
```

Los valores reales viven en Secret Manager / Vercel Environment Variables. Este README no contiene secretos.

---

## 19. Estructura

```
src/                 938 archivos (902 .ts/.tsx)
  src/core/          kernel, contratos y capacidades
  src/lib/           seguridad, persistencia, governance e IA
  src/components/    interfaz operativa
  src/routes/        rutas y superficies web
  src/server-routes/ superficies server-side
  src/domains/       dominios especializados
  src/data/          datos canónicos versionados
test/                143 archivos (unit, integration, security, bookpi)
tests/               32 archivos
scripts/             54 scripts de gate y operación
docs/                153 archivos (142 .md; índice en docs/README.md)
supabase/migrations/ 44 migraciones
prisma/              schema.prisma
policy/              constitution.rego + catalog.json
.github/workflows/   18 workflows (ci, release, sast, secret-scan, security, fgais-gate...)
public/              assets públicos
contrib/             contribuciones externas (incluye jdr-generator)
```

El JDR generator vive únicamente en `contrib/jdr-generator/`; la copia en la raíz fue eliminada (ADR-013). Los árboles históricos duplicados bajo `.merge-sources` se eliminaron en fases previas de sanitización.

---

## 20. Documentación

- `AGENTS.md` — SSOT de arquitectura, seguridad y gobernanza para agentes y contribuyentes.
- `README.md` — este documento.
- `SECURITY.md`, `LICENSES.md`, `LICENSE-CONTROL.md`, `NOTICE`.
- `.env.example` — contrato de entorno (195 claves, sin valores reales).
- `docs/README.md` — **registro de custodia**: las 93 fuentes activas con Propósito, Estado, Propietario y Última revisión.
- `docs/INDEX.md` — índice navegable y cruces con el registro.
- `docs/architecture/` — ADRs vigentes: `ADR-012-evidence-ledger.md`, `ADR-013-jdr-under-contrib.md` (Aceptado), `ADR-014-canonical-cognitive-kernel.md` (Propuesto), `SSOT.md`, `RUNTIME-AUTHORITY-MAP.md`.
- `docs/status/` — estado cuantificado (`CRITICAL-AUDIT-2026-09-28.md`, `ISA-500-STATUS-2026-09-26.md`, checklist de 500).
- `docs/security/` — modelos de amenaza, atestaciones, retención/borrado, claves API, CVE triage, clasificación de datos, registro de dependencias.
- `docs/operations/` — runbooks, SLO/SLI y playbooks (`CAPABILITY_MATRIX.md` se regenera con `pnpm capabilities`).
- `docs/governance/` — constitución FGAIS.
- `docs/_archive/` — 83 documentos históricos preservados, no canónicos.
- `policy/` — política versionada (OPA/Rego + catálogo).
- `scripts/` — gates y verificaciones.

> Los ADRs viven en `docs/architecture/`, no en `docs/adr/`.

El código ejecutable es la fuente de verdad sobre el comportamiento actual. La documentación debe evolucionar junto con él.

---

## 21. Auditoría responsable

Cada P0/P1 sigue esta secuencia:

```
reproducir → localizar causa → corregir → probar → verificar → documentar
```

No se cierra un issue sólo porque esté documentado, ni un issue cerrado se considera evidencia de seguridad.

---

## 22. Licencias y procedencia

Revisar `LICENSE`, `LICENSES.md`, `LICENSE-CONTROL.md`, `NOTICE`, procedencia de datos, licencias de dependencias y derechos sobre modelos/contenido antes de redistribuir.

La documentación se publica bajo CC BY 4.0; el código y las dependencias conservan su licencia específica.

La existencia de DOI, ORCID, Zenodo, DID, JSON-LD u otros identificadores **no constituye por sí misma** certificación de propiedad intelectual, cumplimiento ni seguridad.

---

## 23. Filosofía técnica

Isabella no busca aparentar más capacidad de la que puede demostrar.

Una arquitectura confiable debe poder responder:

- qué hizo;
- por qué lo hizo;
- con qué autoridad;
- con qué evidencia;
- qué datos utilizó;
- qué proveedor participó;
- qué límites aplicaron;
- qué ocurrió si falló;
- qué permanece sin verificar.

**La evidencia precede al claim.**

**La autoridad humana permanece por encima de la capacidad computacional.**
