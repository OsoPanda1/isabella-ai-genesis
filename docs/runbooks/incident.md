# Runbook — Incidentes (P0/P1)

**On-call:** `tamvonlinenetwork-7731` (ver `docs/operations/SLO.md`).
**Fuente SLO:** `docs/operations/SLO.md` · **DR:** `docs/operations/DISASTER_RECOVERY.md` (o `docs/_archive/operations/DISASTER_RECOVERY.md`) · **Observabilidad:** `docs/operations/OBSERVABILITY-SLO.md`
**Revisión:** 2026-09-24 · Owner: `tamvonlinenetwork-7731`

## 0. Clasificación y severidad

| Severidad | Criterio | Tiempo respuesta | Canal |
|---|---|---|---|
| **P0** | `repository_unhealthy` / `BookPI <99.9%` / data loss / `5xx >0.5% 5m` / `RPO/RTO breach` | 5m | PagerDuty + Slack #incidents |
| **P1** | `p95 >1500ms 5m` / `drift >0.15` / `fairness <0.80` / degradación parcial / `burn rate >2` | 15m | Slack #incidents |
| **P2** | latencia p95 >1000ms / WCAG fail / no crítico | 1h | Slack #ops |

> Burn-rate: `docs/operations/SLO.md` §3 — `5m burn>2 && 1h burn>1` → page; `5m>0.5` → ticket. `99.9%` = 43m/mes, `99.99%` BookPI = 4.3m/mes.

## 1. Detección (primeros 2 min)

1. `vercel logs <deploy> --since 10m` → buscar `V.jsxDEV` / `repository_unhealthy` / `genesis_service_unconfigured` / `burn rate` / `hsm_signature_chain` lag
2. `curl https://isabella-ai.visitarealdelmonte.online/api/health | jq .checks`
3. `curl https://isabella-ai.visitarealdelmonte.online/api/health/ready | jq .` — debe ser 200 (readinessProbe `k8s/deployment.yaml`)
4. `curl https://isabella-ai.visitarealdelmonte.online/api/health/live | jq .` — livenessProbe
5. Grafana/Prometheus: `burn rate` panel + `MetricsDashboard` + `ObservabilityPanel` (`traceId`, `correlationId`, `riskScore`) + `http_request_duration_seconds` p95
6. OTel: `otelService.getStatus()` → `queueDepth` spans/metrics; verificar `OTEL_EXPORTER_OTLP_ENDPOINT` en Vercel env

## 2. Triage blanco/negro

| Síntoma | Check | Acción inmediata |
|---|---|---|
| `repository_unhealthy` | `vercel env ls` → verificar `DATABASE_URL` sin `channel_binding`, `ISABELLA_STORAGE_PROVIDER=postgres`, `SELECT 1` | rotar `DATABASE_URL` si corrupto, ver `bookpi-postgres-repository.ts` |
| `genesis_service_unconfigured` | `vercel env ls \| grep CROWN` | rotar `CROWN_POLICY_SIGNING_KEY` (64 hex), redeploy |
| `V.jsxDEV` / `CROWN-SSR-01` | `vite.config.ts` debe forzar `oxc.jsx.development:false` en build y NO contener rename ciego `generateBundle` | revert el commit que reintroduzca el hack, push canónico |
| `5xx >0.5% 5m` | `vercel logs --since 5m \| grep 5xx` + `rate(http_requests_total{code~="5.."}[5m])` | escalar P0, freeze deploys |
| `p95 >1500ms` | `k8s/HPA` metrics, `double-pipeline` queue, `ObservabilityService.getLatencyBudget()` | escalar HPA, revisar `measureVelocity` |
| `drift >0.15` | `detectDrift(baseline,current)` en `governed-ml.ts:141` | P1, abrir `docs/ml/DRIFT.md` §3, bloquear promoción |
| `fairness <0.80` | `auditFairness(scores)` | P1, bloquear `TESTED→VERIFIED`, auditar dataset |
| `OTel queue >200` o `no-endpoint` | `otelService.getStatus()` / `flushOtelOutbox()` error | verificar `OTEL_EXPORTER_OTLP_ENDPOINT` + Collector `/v1/traces` reachable, `fetch timeout 3s` |
| `hsm_chain_lag >5m` | `SELECT tenant_id, updated_at FROM hsm_signature_chain ORDER BY updated_at DESC LIMIT 10` | investigar `Pool`/`DATABASE_URL`, ver `docs/operations/HSM-KMS.md` |

## 3. Mitigación (5–15 min)

1. **Freeze deploys:** `/lock` en GitHub (branch protection) hasta cierre.
2. **Rollback si SLO quemado:**
   ```bash
   vercel redeploy <prev> --prod
   # o
   git revert HEAD && git push
   ```
   Canary revierte automático si `k8s/deployment.yaml` `livenessProbe` falla (`maxUnavailable: 0`, burn >2 en 5m).
3. **DB:** si `RPO ≤15m` comprometido → `scripts/db-restore.mjs` con último snapshot verificado (`docs/operations/DISASTER_RECOVERY.md` §3-4). `RTO ≤60m` validado vía `sumEconomicBalance` + `verifyIntegrity` BookPI + `/api/health/ready` 200.
4. **OTel/Prometheus:** si Collector caído, `otel-neutral` + `ObservabilityService` siguen en-mem (fail-open telemetría nunca rompe request). Re-encolar con `flushOtelOutbox()` auto cada 5s; tras fix, verificar `queueDepth` drenado.
5. **Secretos comprometidos:** rotar `ENCRYPTION_MASTER_KEY`, `AUTH_JWT_SECRET`, Stripe → `docs/operations/HSM-KMS.md` §3-4, `docs/operations/ENCRYPTION_MATRIX.md`, revocar sesiones/API keys, auditar `audit_events`.

## 4. Comunicación

- **Interna (0–5m):** post en Slack #incidents: `SEV P0/P1 | síntoma | impacto | on-call | ETA update 15m | traceId correlacionado`
- **Externa si afecta usuarios:** banner en `EmergencyModeView` + status page.
- **Updates cada 15m** hasta mitigado. Incluir `burn rate` minutos consumidos y `RPO/RTO` estado.

## 5. Post-incidente (24h)

1. Crear `docs/postmortems/YYYY-MM-DD.md` con: `SHA + workflow run + artifact hash + timeline + causa raíz + 5 whys`.
2. `node scripts/db-verify.mjs` + `verifyIntegrity` BookPI + reconciliación `sumEconomicBalance` por tenant vs snapshot.
3. Burn rate: registrar minutos consumidos del error budget (`docs/operations/SLO.md` §3).
4. OTel: adjuntar `traceId` sample y `MetricsDashboard` p50/p95/p99 + `OTel` spans evidencia.
5. ADR si cambia SLO/SLI o política CROWN/ARGUS.
6. `pnpm production:evidence` regenerado + `pnpm typecheck && pnpm build` verde.

## 6. Contactos y escalado

- On-call primario: `tamvonlinenetwork-7731`
- Escalado: `SovereignOwner` → `Operator` (ver `docs/governance/AI-GOVERNANCE-MATRIX-2026.md`)
- Si no hay ack en 5m (P0) → auto-escala PagerDuty L2.

## 7. Referencias

- `docs/operations/SLO.md` — SLIs/SLOs, RPO/RTO 15m/60m, burn-rate
- `docs/operations/OBSERVABILITY-SLO.md` — OTel, Prometheus, PII controls
- `docs/operations/HSM-KMS.md` — rotación/revocación claves
- `k8s/deployment.yaml` — probes, resources, canary
- `src/lib/telemetry/observability.ts` — `ObservabilityService.getLatencyBudget()`
- `src/lib/telemetry/otel-init.ts` — `OpenTelemetryService`, `withSpan`, `recordMetric`
- `src/lib/telemetry/otel-neutral.ts` — `ALLOWED_KEYS`, `normalizeAttributes`, `bucket` hashing
- `src/lib/otel-exporter.ts` — `enqueueOtelLog`/`flushOtelOutbox` durable OTLP/log
- `src/lib/secret-redactor.ts` — redacción `[REDACTED]` en logs/telemetría
