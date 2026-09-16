# ISABELLA AI GENESIS

## Governed Cognitive Infrastructure · Production Engineering Manual

**Estado de ingeniería: 69.8% de preparación real para producción y despliegue**  
**Fecha de corte:** 2026-09-16  
**Repositorio:** `OsoPanda1/isabella-ai-genesis`  
**Plataforma objetivo:** Vercel + TanStack Start/Nitro + PostgreSQL/Neon  
**Dominio de producción declarado:** `isabella-ai.visitarealdelmonte.online`

> **Este porcentaje no es marketing ni certificación. Es un índice reproducible definido por evidencia disponible en el repositorio y por el estado operativo observado en Vercel.**

---

# 1. Qué es Isabella

Isabella AI Genesis es una infraestructura de software para interacción con IA gobernada, auditable y orientada a identidad, tenant isolation, políticas, memoria, seguridad, capacidades nativas, proveedores externos y evidencia operacional.

La regla de diseño es:

```text
El modelo propone.
La política evalúa.
La identidad delimita.
El usuario autoriza.
El sistema registra evidencia.
```

Isabella **no se presenta como AGI, conciencia artificial, autoridad autónoma ni sistema infalible**. Las capacidades deben considerarse implementadas, verificadas o aptas para producción únicamente cuando exista evidencia correspondiente.

---

# 2. Índice real de producción y despliegue

## 2.1 Método de cálculo

El índice se calcula sobre ocho dominios con pesos fijos. Cada dominio se puntúa por evidencia observable: código ejecutable, pruebas, integración real, despliegue, configuración y validación operacional.

| Dominio | Peso | Estado actual | Evidencia | Contribución |
|---|---:|---:|---|---:|
| Gobernanza C.R.O.W.N. / seguridad | 15% | 95% | políticas, gates y pruebas existentes | 14.25 |
| Identidad / autenticación / autorización | 15% | 90% | principal context, JWT/OIDC, scopes, tenant context | 13.50 |
| ML nativo / NCUA | 15% | 85% | pipeline determinista, convergencia, caching, proveedores | 12.75 |
| Persistencia / PostgreSQL / memoria | 15% | 75% | repositorios y contratos; evidencia live incompleta | 11.25 |
| Integraciones externas | 15% | 50% | adaptadores implementados; validación operacional incompleta | 7.50 |
| Operaciones / observabilidad / DR | 10% | 45% | telemetría y scripts presentes; drills incompletos | 4.50 |
| Vercel / CI-CD / smoke de producción | 10% | 20% | deployments READY históricos; los deployments recientes están ERROR | 2.00 |
| Cliente / UX cognitiva | 5% | 80% | terminal, streaming, accesibilidad y mejoras recientes | 4.00 |
| **TOTAL** | **100%** | **69.75% ≈ 69.8%** | | **69.75** |

### Interpretación

- **69.8%:** infraestructura avanzada, pero **no certificada como producción integral**.
- El porcentaje no significa que 69.8% de cada archivo esté terminado.
- El principal déficit actual no es conceptual: es **evidencia operacional, despliegue reproducible, integraciones live, resiliencia y pruebas end-to-end**.
- Vercel constituye actualmente un bloqueo objetivo porque los deployments más recientes asociados a `main` aparecen como `ERROR / BUILD_FAILED / Resource provisioning failed`, aunque existen deployments anteriores `READY`.

La evaluación previa de `2026-09-13` reportaba **72%**. El nuevo índice reduce el valor porque incorpora el estado real de despliegue observado después de esa evaluación y no reutiliza un porcentaje histórico como si fuera evidencia actual.

---

# 3. Matriz de estados

| Estado | Significado |
|---|---|
| **Código presente** | Existe implementación en el repositorio. |
| **Implementado** | Existe flujo funcional suficiente para ser ejercitado. |
| **Verificado** | Existe una prueba reproducible que cubre el comportamiento. |
| **Live verified** | Se ejecutó contra infraestructura real. |
| **Production-safe** | Pasó pruebas de configuración, seguridad, recuperación y despliegue en el entorno objetivo. |
| **Production certified** | Existe evidencia operacional sostenida, controles, runbooks y sign-off correspondiente. |

Nunca deben mezclarse estos estados.

---

# 4. Arquitectura de ejecución

```text
Browser
  │
  ├── IsabellaClientApp
  │     ├── Cognitive Terminal
  │     ├── CommandLine
  │     ├── MessageStream
  │     ├── telemetry
  │     └── cognitive preferences
  │
  ▼
HTTP Request
  ▼
Request Context / Trace / Correlation
  ▼
Principal Context
  ├── JWT/OIDC
  ├── API Key
  ├── tenant
  ├── role
  └── scopes
  ▼
Rate Limit
  ▼
ARGUS / AEGIS
  ▼
C.R.O.W.N.
  ▼
Native ML / NCUA
  ▼
Memory / Knowledge / Skills
  ▼
Authorized Provider Adapter
  ▼
Streaming Response
  ▼
Audit / Evidence / Telemetry
  ▼
Browser
```

No route should invent its own authentication, tenant, authorization or persistence model.

---

# 5. Current implemented improvements

## 5.1 Cognitive theme persistence

The terminal now supports persistent visual cognitive palettes:

- Abyss;
- Arctic;
- Aurora;
- Ember.

Preference storage key:

```text
isabella.cognitive-theme.v1
```

The selected palette is applied through `data-cognitive-theme` on `<html>` and overrides the default Abyss variables without duplicating the entire component design system.

## 5.2 Keyboard workflow

Implemented shortcuts:

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + K` | Focus command input |
| `Cmd/Ctrl + Enter` | Send current command |
| `Esc` | Stop active inference / close settings |
| `Enter` | Send |
| `Shift + Enter` | New line |

## 5.3 Native voice-to-text

The CommandLine now exposes a microphone button for Spanish Mexican dictation.

Target locale:

```text
es-MX
```

The implementation uses the browser Speech Recognition interface when available and verifies microphone capability before activation. Unsupported browsers receive a visible fallback message rather than a silent failure.

A separate audio-note path remains available through `MediaRecorder` for multimodal attachments.

## 5.4 Cognitive state indicator

The terminal header contains a small non-authoritative cognitive-state indicator:

- `EN ESPERA`;
- `ANALIZANDO`;
- `ESTABLE`;
- `ALERTA`.

The indicator is deliberately heuristic. It is a UI signal, **not a claim that Isabella possesses an internal human-like emotional state**. It must never be used for safety, authorization or financial decisions.

The next hardening step is to feed it directly from the canonical assistant stream rather than from UI-local text.

---

# 6. Vercel: estado real y corrección requerida

## 6.1 Evidence observed

Recent Vercel production deployments associated with the latest commits are marked `ERROR` with:

```text
BUILD_FAILED
Resource provisioning failed
```

The Vercel build-log endpoint reported no compiler error events for the latest failed deployment, indicating that the failure is occurring at the Vercel provisioning/deployment layer rather than proving an application compile failure.

Older deployments of the same project are recorded as `READY`.

## 6.2 Production smoke gate

```text
[ ] Latest production deployment READY
[ ] Production alias points to that deployment
[ ] / returns 200
[ ] /api/health/live returns 200
[ ] /api/mux-intro returns an intentional response
[ ] Browser intro renders/falls back
[ ] authenticated /api/isabella accepts a valid principal
[ ] SSE response produces first token
[ ] provider header is present
[ ] audit event is written
[ ] memory read/write uses PostgreSQL
[ ] API key issuance and verification work
[ ] tenant isolation test passes
[ ] rate limiter works against the real distributed backend
[ ] rollback deployment remains available
```

A Vercel deployment being `READY` is not sufficient by itself. A production smoke test is required.

## 6.3 Vercel configuration principle

The project uses TanStack Start with Nitro integration. Vercel currently identifies the project as a Nitro deployment. Framework detection, build output and the actual Vite/Nitro integration must remain consistent.

Do not solve provisioning failures by weakening application fail-fast checks or by introducing JSON/memory persistence as an undocumented production fallback.

---

# 7. Production configuration contract

Production/staging require a canonical durable database configuration.

The current configuration authority is `src/lib/config.ts`.

Important invariant:

```text
DATABASE_URL + ISABELLA_STORAGE_PROVIDER=postgres|neon
```

If `DATABASE_URL` exists and the provider alias is omitted, the configuration layer can derive `postgres`; this avoids the previous Vercel startup failure caused by the missing provider alias while preserving the durable-database requirement.

If the database is absent, production must **fail closed**. It must not silently fall back to JSON or browser memory.

Required production categories include database, authentication, encryption, CROWN, AEGIS, BookPI and the credentials of every enabled external provider. Exact variables remain defined by the environment schema; secrets must never be copied into documentation.

---

# 8. Authentication, authorization and API keys

The production authority chain is:

```text
Credential
 → Authentication
 → Principal
 → Tenant
 → Role
 → Scope
 → Policy
 → Operation
 → Audit
```

API keys must be cryptographically random, stored as hashes, prefixed, scoped, tenant-bound, revocable, expirable, rotatable and audited.

Required tests:

```text
[ ] valid key accepted
[ ] invalid key rejected
[ ] expired key rejected
[ ] revoked key rejected
[ ] wrong tenant rejected
[ ] missing scope rejected
[ ] excessive scope rejected
[ ] rotation invalidates previous key when policy requires it
[ ] key creation itself is authorized
[ ] secret never appears in logs
```

---

# 9. Isabella chat pipeline and latency debt

The gateway contains multiple sequential controls before provider streaming. The next optimization must parallelize only independent read-only work.

Target shape:

```text
                 ┌─ runtime context
Request ─ parse ├─ memory context
                 ├─ kill-switch state
                 └─ provider availability
                       ↓
                 policy arbitration
                       ↓
                    stream
```

Required latency metrics:

- request parse;
- authentication;
- policy;
- memory;
- NCUA;
- provider selection;
- time-to-first-token;
- stream duration;
- total response;
- provider retries/errors.

Provider retries must not silently duplicate billable generations.

---

# 10. NCUA and native ML debt

The current NCUA pipeline caches the deterministic knowledge graph, intent classifier, memory index and corpus metrics. This removes repeated construction from the request hot path.

Next:

```text
[ ] cold/warm benchmark
[ ] p50/p95/p99 NCUA latency
[ ] cache hit/miss telemetry
[ ] bounded corpus and embedding work
[ ] tenant-safe cache keys
[ ] Spanish regression corpus
[ ] confidence calibration
[ ] artifact versioning
[ ] reproducible training/promotion gates for future learned models
```

Deterministic local ML must not be represented as equivalent to a frontier generative model.

---

# 11. Spanish Latin American native layer

Default product locale:

```text
es-MX → es-419 fallback
```

Required:

```text
[ ] canonical locale constant
[ ] system prompt localization contract
[ ] Mexican/Latin American terminology policy
[ ] date/time/number formatting
[ ] Spanish error messages
[ ] Spanish UI labels
[ ] provider prompt locale metadata
[ ] Mexican Spanish test corpus
[ ] no accidental Spain-specific forms
[ ] preserve code and technical identifiers
```

Multilingual operation remains possible; the default should be Latin American Spanish rather than forced translation of a user who explicitly communicates in another language.

---

# 12. Mux cinematic intro

The client uses a Mux playback ID and a browser-compatible MP4 rendition:

```text
https://stream.mux.com/<playbackId>/high.mp4
```

This avoids relying on native HLS support in every desktop browser. The fail-safe path is:

```text
Mux MP4 → static/procedural fallback → usable terminal
```

Required evidence:

```text
[ ] Mux credentials configured
[ ] asset exists
[ ] playback ID returned
[ ] Chrome playback
[ ] Edge playback
[ ] 403/404/network fallback
[ ] reduced-motion behavior
[ ] intro never blocks terminal access
```

---

# 13. ARGUS / AEGIS debt

ARGUS/AEGIS must remain a security/governance boundary and must not become an opaque source of random false positives.

Required corpus:

```text
[ ] classification reason
[ ] safe operator-facing block reason
[ ] false-positive regression tests
[ ] Spanish threat patterns
[ ] prompt-injection tests
[ ] personal-data tests
[ ] financial-data tests
[ ] adversarial encoding tests
[ ] tenant breakout
[ ] scope escalation
[ ] replay
[ ] malformed SSE
[ ] oversized input
[ ] provider timeout/failure
[ ] database failure
[ ] rate-limit failure
```

Responsibility separation is mandatory:

```text
Authentication ≠ authorization
AEGIS ≠ business authorization
CROWN ≠ identity provider
Rate limit ≠ permission
```

---

# 14. PostgreSQL and memory

Production memory must use canonical PostgreSQL authority.

Required evidence:

```text
[ ] clean migration
[ ] representative migration
[ ] CRUD
[ ] tenant filter/RLS
[ ] retention
[ ] provenance
[ ] consent metadata
[ ] backup
[ ] restore
[ ] rollback
[ ] pool exhaustion
[ ] timeout
[ ] unavailable database
```

Browser storage must never become production memory authority.

---

# 15. BookPI / Stripe

Required financial evidence:

```text
[ ] test payment
[ ] signed webhook
[ ] idempotency
[ ] duplicate webhook
[ ] delayed webhook
[ ] out-of-order webhook
[ ] refund
[ ] partial refund
[ ] failed payment
[ ] reconciliation
[ ] ledger projection
[ ] audit seal
[ ] browser cannot authoritatively set balance
```

Simulated cryptography must never become financial authority.

---

# 16. Sandbox / ORION

Privileged execution requires real isolation evidence:

```text
[ ] filesystem isolation
[ ] network egress policy
[ ] CPU/memory/process limits
[ ] timeout/cancellation
[ ] secret isolation
[ ] container escape test
[ ] malicious workload test
```

Until this exists, privileged execution remains disabled or controlled.

---

# 17. Observability and SLOs

Minimum production metrics:

```text
request count
error rate
4xx/5xx
p50/p95/p99
TTFT
provider latency
NCUA latency
DB latency
rate-limit rejects
auth failures
AEGIS blocks
CROWN denials
stream aborts
deployment version
```

Never log API secrets, JWTs, plaintext API keys, payment credentials or ungoverned private user content.

---

# 18. Disaster recovery

Define and execute RPO/RTO. A runbook is incomplete until exercised.

```text
[ ] database outage
[ ] provider outage
[ ] rate-limit outage
[ ] bad deployment
[ ] bad migration
[ ] webhook failure
[ ] credential expiry
[ ] secret rotation
[ ] rollback
[ ] backup restore
```

---

# 19. CI/CD production gate

Target release gate:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm security:scan
pnpm build
pnpm production:integrity
pnpm production:preflight
pnpm capabilities
pnpm audit:routes
```

Green build without runtime smoke testing is not sufficient.

---

# 20. 100% production definition

The 100% gate requires all code, infrastructure, runtime, operational and evidence gates to pass simultaneously.

### Code

```text
[ ] typecheck
[ ] lint
[ ] tests
[ ] security scan
[ ] production integrity
[ ] route audit
```

### Infrastructure

```text
[ ] Vercel READY
[ ] canonical domain healthy
[ ] PostgreSQL live
[ ] migrations applied
[ ] backups verified
[ ] restore verified
[ ] rate limiter live
[ ] enabled providers live
[ ] Mux live if enabled
[ ] Stripe reconciliation if enabled
```

### Runtime

```text
[ ] health 200
[ ] browser no SSR 500
[ ] intro works
[ ] chat works
[ ] streaming works
[ ] auth works
[ ] API keys work
[ ] tenant isolation works
[ ] ARGUS/AEGIS works
[ ] CROWN works
[ ] memory works
[ ] audit works
[ ] metrics work
```

### Operations

```text
[ ] SLOs
[ ] alerts
[ ] incident runbook tested
[ ] rollback tested
[ ] backup restore tested
[ ] security assessment
[ ] load test
[ ] failure/chaos tests
```

Every capability requires:

```text
implementation → test → live evidence → deployment evidence → runbook
```

---

# 21. Technical debt register

## P0 — production blockers

1. Vercel production deployment stability.
2. Live PostgreSQL evidence.
3. Full production smoke suite.
4. Real browser authentication flow.
5. End-to-end `/api/isabella` streaming verification.
6. Tenant-isolation runtime tests.
7. Distributed rate-limit validation.
8. Production observability evidence.
9. Backup/restore drill.
10. Stripe reconciliation if enabled.
11. Sandbox isolation proof if ORION is enabled.
12. Current CI evidence on the exact release commit.

## P1 — performance/reliability

1. Parallelize independent gateway reads.
2. TTFT and p95/p99 instrumentation.
3. NCUA warm caches.
4. Bound memory/attachment work.
5. Provider retry accounting.
6. Reduce duplicate serialization.
7. Browser smoke tests.
8. Mux compatibility tests.

## P2 — maintainability

1. Consolidate configuration helpers.
2. Remove obsolete compatibility paths after migration evidence.
3. Decompose oversized UI components.
4. Centralize locale constants.
5. Extract sentiment classifier.
6. Provider adapter contract tests.
7. Explicit subsystem ownership.

## P3 — research

1. Continuous rewinding.
2. External federation contracts.
3. Hybrid QML.
4. Real post-quantum provider integration.
5. Multi-region active/active.
6. Model drift detection.

Experimental capabilities must never silently become production authority.

---

# 22. Manual exacto para llegar a 100%

## Fase A — Stabilize

1. Make the production branch deterministic.
2. Resolve Vercel provisioning failure.
3. Verify canonical alias.
4. Smoke `/` and health.
5. Prove no SSR 500.

## Fase B — Identity

1. Production OIDC/JWT authority.
2. Browser session establishment.
3. Tenant binding.
4. API-key issuance.
5. Scope enforcement.
6. Revocation/expiry.

## Fase C — Cognition

1. NCUA cold/warm benchmark.
2. Spanish classification benchmark.
3. ARGUS/AEGIS regression corpus.
4. CROWN policy verification.
5. Provider selection verification.
6. TTFT measurement.

## Fase D — Persistence

1. Staging migration.
2. CRUD.
3. RLS/tenant tests.
4. Backup.
5. Restore.
6. DB outage simulation.

## Fase E — Integrations

1. Mux.
2. AI providers.
3. distributed rate limiting.
4. Stripe/BookPI.
5. external adapters.

Each integration needs contract and failure-mode tests.

## Fase F — Operations

1. Observability.
2. SLOs.
3. Alerts.
4. Load test.
5. Failure test.
6. Rollback.
7. Incident drill.

## Fase G — Release

1. Freeze dependency graph.
2. Generate production evidence.
3. Run full gate.
4. Deploy staging.
5. Smoke staging.
6. Promote production.
7. Smoke production.
8. Record deployment SHA.
9. Record evidence artifacts.
10. Keep rollback candidate.

---

# 23. Files under continuous production attention

### P0

```text
src/lib/config.ts
src/lib/principal-context.ts
src/lib/api-key-service.ts
src/lib/isabella-chat-gateway.ts
src/lib/auth-client.ts
src/lib/useIsabella.ts
src/server.ts
src/components/isabella/CommandLine.tsx
src/components/isabella/CinematicIntro.tsx
src/lib/ncua/pipeline.ts
src/lib/native-comprehension.ts
src/lib/latam-aegis-x.ts
src/lib/repositories/memory-postgres-repository.ts
vercel.json
pnpm-lock.yaml
.github/workflows/*
```

### P1

```text
src/lib/crown.ts
src/lib/policy-engine.ts
src/lib/authorization.ts
src/lib/request-context.ts
src/lib/sovereign-audit.ts
src/lib/inference-policy.ts
src/lib/skills/run-skill.ts
src/lib/platform-capabilities.ts
src/components/isabella/MessageStream.tsx
src/components/isabella/IsabellaClientApp.tsx
```

### Evidence / operations

```text
PRODUCTION-READINESS-*.md
scripts/production-preflight.mjs
scripts/production-integrity-gate.mjs
scripts/production-evidence.mjs
scripts/db-*.mjs
scripts/genesis-route-audit.mjs
```

---

# 24. Anti-regression rules

Never reintroduce:

- JSON as production durable authority;
- anonymous privileged skill execution;
- `SovereignDB.hydrate()` in the authentication hot path;
- synthetic teacher evidence presented as real evidence;
- provider detection that ignores configured authorized providers;
- broad CSP `connect-src https:`;
- untrusted forwarded IP headers;
- plaintext API keys;
- production dev-session recovery;
- guest production chat without an explicit governed product decision;
- simulated cryptography represented as production authority;
- browser-authoritative financial balances.

---

# 25. Engineering standard

```text
Code
  ↓
Test
  ↓
Live integration
  ↓
Failure test
  ↓
Observability
  ↓
Deployment
  ↓
Rollback
  ↓
Evidence
```

If a stage is missing, the capability is not fully production-proven.

---

# 26. Current conclusion

**Current real production/deployment index: 69.8%.**

The project has substantial production-grade architecture and executable infrastructure. The decisive gap is operational proof: recent Vercel production deployments are not healthy, and several integrations have implementation without sufficient live evidence.

The next milestone is not another marketing percentage. It is:

```text
GREEN CI
+ GREEN VERCEL
+ GREEN DB
+ GREEN AUTH
+ GREEN CHAT
+ GREEN STREAM
+ GREEN MEMORY
+ GREEN SECURITY
+ GREEN OBSERVABILITY
+ GREEN RECOVERY
= 100% production gate
```

**No component should be called production-ready merely because its source file exists.**

---

## Project identity

**ISABELLA AI GENESIS**  
Governed Cognitive Infrastructure  
Real del Monte, Hidalgo, México

> Build what can be demonstrated. Measure what can be executed. Refuse to claim what cannot be proved.
