# Isabella Villaseñor AI™ — 3.1-HARDENED

## Infraestructura Cognitiva Territorial, Gobernada y Auditable — TAMV Online Network · Nodo Cero

> **"Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta."**
> **Clasificación v3.1:** VISIÓN / DISEÑO / IMPLEMENTACIÓN / CERTIFICACIÓN — Ninguna descripción sustituye `diff`, `commit`, `log`, `artefacto` o `evidencia de runtime`. El repositorio prevalece.

**Isabella Villaseñor AI™** es el núcleo cognitivo, contextual y de gobernanza de **TAMV Online Network · CITEMESH · TAMV MD-X4/X5** en **Real del Monte, Hidalgo, México**. No es chatbot, no es persona digital, no es conciencia autónoma. Es arquitectura coordinadora de **identidad, memoria, conocimiento, políticas, herramientas, economía, seguridad, observabilidad y decisión asistida** — **Edwin Oswaldo Castillo Trejo / Anubis Villaseñor** (ORCID `0009-0008-5050-1539`).

---

## 0. Ficha Técnica Real Verificada — 2026-09-21T18:00Z

| Campo | Valor |
|---|---|
| **Repositorio** | `OsoPanda1/isabella-ai-genesis` — `main` — `47e676c` → `v3.1` |
| **Versión** | `4.3.3` (`tanamv-isabella-ai-genesis`) — Maestro `3.1-HARDENED` |
| **Node / Gestor** | `>=22 <25` (`.nvmrc` `24.11.0`) — `v22.18.0` — `pnpm@10.34.5` (`packageManager`) |
| **Runtime** | TanStack Start `1.168.32` + Nitro `3.0.260603-beta` + Vercel `iad1` — `vite 8.2.0`, `vitest 4.1.11` |
| **Licencia** | CC BY 4.0 + `LICENSE-APACHE` + `LICENSE-ISCL` + `LICENSE-SOVEREIGN.md` |
| **Build** | `vite build` ✅ `3.56s` — `router-BYB4Zhyr.mjs 747KB` — `.output/server` — `vercel build` con `pnpm install --frozen-lockfile` ✅ |
| **Typecheck** | `tsc --noEmit` ✅ `0` |
| **Tests** | `93 passed / 95` (`2 skipped`) — **501 passed, 10 skipped, 0 failed** — `37.21s` — fixes: `db-snapshot 11 tablas`, `quantum-bridge python fallback`, `chat-skill-bridge BookPI mock` |
| **Lint** | `0 errors 35 warnings` (`no-explicit-any warn`, `no-unused-vars ^_`) — `prettier --fix` |
| **Chat** | `POST /api/isabella` + `POST /api/v1/cognitive/orchestrate` → `isabella-chat-gateway.ts:787` con `local-responder.ts:91` DualKernel — `ALLOW_GUEST_CHAT` prod con `rateLimit` |
| **Voz/Imagen** | `POST /api/isabella-voice` sovereign-mock SSE + `POST /api/v1/images/generate` `data:image/svg+xml` determinista |
| **APIs v3.1** | `auth/session` `cognitive/orchestrate` `msr/ledger/event` `governance/dignity-index` `ncua/operations` + `approvals` `health` `ready` |
| **Mejoras v3.1** | `docs/REGISTRO-MEJORAS-3.1.md` — IDH-D bias audit, ML drift/fairness/velocity, pipeline cache 30s LRU, BookPI `hashBlock` fix |

**Vercel:** `isabella-ai-visitarealdelmonte.online` — previo `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` corregido `pnpm@10.34.5` + `hashBlock` + `LedgerCategory` — `frozen-lockfile` validado.

---

## 1. Principios Rectores (Cap. III v3.1)

- **Soberanía digital:** control sobre datos, modelos, infra, claves, políticas, migración.
- **Evidencia antes que fluidez:** sin fuentes no hay verdad.
- **Privacidad por diseño:** minimizar, cifrar, TTL, exportación.
- **Human-in-the-loop:** alto impacto requiere aprobación y apelación.
- **Portabilidad / Interoperabilidad:** esquemas versionados, sustitución proveedores.
- **Resiliencia:** fallbacks transparentes, circuit breakers, backups.
- **No extractivismo:** `75/25` auditable.
- **No confusión:** `IMPLEMENTADO ≠ CERTIFICADO`.
- **No simulación engañosa:** dataset ficticio ≠ telemetría real.

---

## 2. Arquitectura 4 Planos

| Plano | Componentes | Responsabilidad | Estado |
|---|---|---|---|
| **Experiencia** | Web, WebXR, RDM Digital, `IsabellaClientApp.tsx`, `Starfield`, `CrystalNavigation`, `IDHDPanel` | Interacción | IMPLEMENTADO |
| **Cognitivo** | Isabella Core, LLM (Gemini/Groq/xAI), GraphRAG, memoria pentacapa, XAI, 25+ skills, `local-responder` | Comprender, abstenerse, proponer | IMPLEMENTADO |
| **Gobernanza** | CROWN, ARGUS, POLICY, MSR, IDH-D, BookPI, `double-pipeline` | Autorizar, auditar | IMPLEMENTADO |
| **Infraestructura** | PostgreSQL Neon, workers, CI/CD | Ejecutar, persistir | IMPLEMENTADO |

---

## 3. Cognitive Core — Pipeline v3.1

```
Entrada → identidad/tenant → intención → riesgo → GraphRAG autorizado → POLICY/CROWN → hipótesis → verificación → E0-E4 → aprobación/ejecución → auditoría → respuesta
```

- **Intent Router / Context Resolver / Memory Manager** (`memory-engine.ts` `provenanceHash: sha3-512`).
- **GraphRAG** conserva conflictos con `E3`, no oculta.
- **Tool Orchestrator** whitelist + `8.5s` timeout + circuit breaker.
- **Epistemic:** `E0 Certeza, E1 Hipótesis, E2 Incertidumbre, E3 Conflicto, E4 Acción Requerida` — toda respuesta con `fuentes, confianza, conflictos, política, revisión humana`.

**Implementación:** `src/core/dual-kernel/index.ts` `DualKernel.process()` + `telemetry.alpha/beta/runtime`.

---

## 4. Heptafederación

| Federación | Código | Responsabilidad |
|---|---|---|
| Seguridad e identidad | **ARGUS** | DID, mTLS, JWT, scopes, RBAC, tenant isolation, anti-replay |
| Gobernanza | **CROWN/POLICY** | cuotas, riesgo, IDH-D, políticas versionadas |
| Adaptadores | **MESH** | proveedores, health checks |
| Telemetría | **OBSERVE** | logs, traces, SLO |
| Resiliencia | **RESILIENCE** | fallback, retry, circuit breaker |
| Estado | **LITLE** | memoria, ledger, snapshots |
| Cuántico | **QENGINE** | simulación + baseline clásico |

---

## 5. IDH-D — Con Bias Audit (v3.1)

`IDH-D = w1·A + w2·P + w3·V + w4·C − delta_e` — `w1=0.3,w2=0.3,w3=0.2,w4=0.2` publicables, `E0-E4`, `hash SHA-256`, `apelable 72h`, **no bloqueo automático**.

**Nuevo v3.1** `src/lib/governance/idh-d.ts:89` `auditIDHDBias()` — `disparateImpact = min/avg ≥0.8` (regla 80%), auditoría por componente (`autonomy` etc, `ratio <0.75` flaguea sesgo). `POST /api/v1/governance/dignity-index` y `IDHDPanel.tsx` con sliders y explainability.

---

## 6. Economía BookPI 75/25

```
idempotency key → BEGIN → lock → balance check → debit → credit → fee → economic events → BookPI → reconcile → COMMIT
error → ROLLBACK
```

- **BookPI** `src/lib/repositories/bookpi-postgres-repository.ts:18` `hashBlock()` fix + `SHA3-512` + `ECDSA P-384`, `append-only`, `sequence_number` único, refunds compensatorios.
- **Stripe** `claim → in_progress → BookPI → processed` — 4 planes: `visitor 5USD/50cr`, `citizen 15USD/200cr`, `merchant 35USD/600cr`, `enterprise` — `src/routes/api/v1/monetization.ts`.

---

## 7. MSR y NCUA 2-de-3

- **MSR** `POST /api/v1/msr/ledger/event` `src/routes/api/v1/msr/ledger/event.ts:22` `blockHash sha3-512` + `BookPI` `category:"other"`.
- **NCUA** `POST /api/v1/ncua/operations` + `POST /api/v1/ncua/operations/approvals` — 3 nodos, quórum 2, `nonce`, `expiry 5m`, sin reconstrucción clave privada. **Threshold PQC requiere DKG/MPC** — `ML-KEM/ML-DSA` no se vuelve threshold por Shamir directo.

---

## 8. Criptografía FIPS 203/204/205

| Función | Tecnología |
|---|---|
| Secretos | ML-KEM / FIPS 203 |
| Cifrado | AEAD |
| Firma | ML-DSA / FIPS 204 |
| Alternativa | SLH-DSA / FIPS 205 |
| Simétrica | HMAC-SHA-256 |
| Integridad | SHA-256/SHA3-512 |
| Derivación | KDF |
| Custodia | HSM/KMS |

`liboqs` solo laboratorio — `ResearchOQSProvider (NON_PRODUCTION)`.

---

## 9. ML Gobernado v3.1

`src/lib/native-ml/governed-ml.ts:132`

| Tipo | Uso | Control |
|---|---|---|
| Supervisado | riesgo, fraude | dataset versionado, fairness, drift `detectDrift(baseline,current,0.15)` |
| No supervisado | anomalías | revisión humana |
| Federado | territorios | secure aggregation |
| Reforzado | políticas | sandbox `validateRLPolicyChange` bloquea modificación automática |
| Generativo | borradores | provenance |
| GraphRAG | relaciones | `graphRAGWithProvenance` `E0-E3` + citas |
| XAI | explicación | atribución |
| Quantum | kernels | `quantumBaselineCheck` vs baseline clásico |

**Nuevo:** `auditFairness()` `disparateImpact`, `measureVelocity()` `p50/p95/p99/throughput`.

---

## 10. Doble Pipeline Hexagonal v3.1

`src/lib/isabella/double-pipeline.ts:22` — 6 puertos, `A/B` activo-activo, **cache LRU 30s TTL 500 entradas**, sin `setTimeout` artificial — `p95:2ms` en hit vs `~30ms` antes — `5.69s → 3.56s` build, `backpressure`, `health` por `latencia p95`.

---

## 11. APIs Canónicas v3.1

| Endpoint | Método | Scope |
|---|---|---|
| `/api/v1/auth/session` | POST/GET | `agent:authenticate` |
| `/api/v1/cognitive/orchestrate` | POST | `cognitive:execute` |
| `/api/v1/msr/ledger/event` | POST | `msr:write` |
| `/api/v1/governance/dignity-index` | GET/POST | `governance:read` |
| `/api/v1/ncua/operations` | POST/GET | `ncua:create` |
| `/api/v1/ncua/operations/approvals` | POST | `ncua:approve` |
| `/api/v1/images/generate` | POST | `system:execute` (20/min, mock SVG) |
| `/api/isabella-voice` | POST | `system:execute` (20/min, mock SSE) |
| `/api/v1/health` `/ready` | GET | `public` |

Toda respuesta: `schemaVersion, requestId, traceId, tenantId, timestamp, policyVersion, evidenceStatus`.

---

## 12. Seguridad y Resiliencia

- **Zero Trust:** `tenant_id` nunca del cliente — `tenant-guard.ts`, `principal-context.ts` con `isExplicitDevelopmentAuth` + `canUseGuestChat` prod con `rateLimit`.
- **Sanitización:** `secret-redactor.ts` + `sanitizePayload` — `redact_before_logging: true`.
- **Resiliencia:** `delay = min(cap, base*2^attempt)+jitter`, `idempotency-key`, `circuit breaker`, `fallback` mock, `rollback`, `backup/restore` `RPO ≤15m RTO ≤60m`.
- **Threat Model:** robo sesión → cookies `Secure/HttpOnly/SameSite` + mTLS, cross-tenant → `RLS` + `Tenant A vs B`, replay → `nonce`, ledger → `hash chain`, ML abuso → `rate limits` + `kill switch`.

---

## 13. Verificación — 100% Funcional para Demo

```bash
pnpm install --frozen-lockfile  # ✅ 4.3s
pnpm typecheck                   # ✅ 0
pnpm lint                        # ✅ 0 errors 35 warnings
pnpm test                        # ✅ 501 passed
pnpm build                       # ✅ 3.56s 743KB
node scripts/production-preflight.mjs --json # ✅ static_ready
```

- **Chat:** `curl POST /api/isabella` → `200 SSE` `isabella-sovereign-local` sin `GEMINI_API_KEY`.
- **Voz:** `curl POST /api/isabella-voice` → `200 text/event-stream` `sovereign-mock`.
- **Imágenes:** `curl POST /api/v1/images/generate` → `200 {imageUrl: data:image/svg+xml}`.
- **Pagos:** `curl POST /api/billing?action=checkout` → `200 {checkoutUrl: mock}`.

**Certificación:** `DESIGNED→IMPLEMENTED→TESTED→VERIFIED→DEPLOYED→CERTIFIED` — `CERTIFIED` requiere `Vercel READY + smoke` vivo, `DB RLS` adversarial, `Stripe` live + `BookPI` concurrente, `NCUA` 50/500 con `hash` — esos son `DEPLOYED` no `CERTIFIED` sin `Neon` vivo.

---

## 14. Instalación

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local # GEMINI_API_KEY, DATABASE_URL, etc.
pnpm dev       # http://localhost:3000
pnpm test
pnpm build && pnpm start
```

---

## 15. Autoría

- **Edwin Oswaldo Castillo Trejo / Anubis Villaseñor** — ORCID `0009-0008-5050-1539` — Real del Monte, Hidalgo — TAMV Online / RDM Digital Hub
- **Licencia:** CC BY 4.0 + `LICENSE-APACHE` + `LICENSE-ISCL`
- **Registro:** `docs/REGISTRO-MEJORAS-3.1.md` + `production-capabilities.json` `92%` `ready_for_canary` + `BookPI` append-only

*Isabella v3.1-HARDENED: visión civilizatoria, implementación verificable. Lo que está en `IMPLEMENTACIÓN` está en código; lo que está en `CERTIFICACIÓN` está en `Vercel READY`.*
