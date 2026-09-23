# SLO/SLI — Isabella AI Genesis (P1)

**Objetivos de disponibilidad y latencia — blanco o negro.**
**Revisión:** 2026-09-23 · Owner: `tamvonlinenetwork-7731` · Fuente: `MetricsDashboard` + `ObservabilityPanel` + `OTel` + `Prometheus`

## 1. SLIs/SLOs canónicos

| SLI | SLO | Ventana | Error budget | Alert | Runbook |
|---|---|---|---|---|---|
| Disponibilidad `GET /api/health/live` | `99.9%` | 28d | 43m/mes | `burn rate >2` → PagerDuty | `docs/runbooks/incident.md` |
| Disponibilidad `GET /api/health/ready` | `99.9%` | 28d | 43m/mes | `success <99.9% 5m` → Slack | `docs/runbooks/incident.md` |
| Latencia `p95 /api/isabella` | `< 850ms` | 5m | — | `p95 >1000ms 5m` → Slack | `k8s/HPA` |
| Latencia `p95 /api/v1/cognitive/orchestrate` | `< 1200ms` | 5m | — | `p95 >1500ms 5m` → Slack | `double-pipeline` |
| Tasa error `5xx` global | `< 0.1%` | 5m | — | `>0.5% 5m` → P1 | `vercel logs` |
| BookPI `append` éxito | `99.99%` | 28d | 4.3m/mes | `<99.9% 5m` → P0 | `src/lib/repositories/bookpi-postgres-repository.ts` |
| NCUA `50/500` `ERI≥95` | `100%` | por deploy | 0 | `<95` → block deploy | `test/security/ncua-load.test.ts` |
| Drift modelos `threshold 0.15` | `0 triggered` sin reentrenar | 28d | — | `detectDrift >0.15` → P1 | `docs/ml/DRIFT.md` |
| Fairness `disparateImpact ≥0.80` | `100%` check | por train | 0 | `<0.80` → block verify | `src/lib/native-ml/governed-ml.ts` |

> **No hay maquillaje:** si `SLO` se quema, `canary` se revierte automáticamente (ver `k8s/deployment.yaml` `livenessProbe` + `readinessProbe`).

## 2. Definiciones y medición

- **Disponibilidad:** `success / (success+fail)` de probes sintéticos cada 30s (`/api/health/live`, `/api/health/ready`). Excluye 429 whitelisted en burn calculation.
- **Latencia p95:** histograma `http_request_duration_seconds` bucket `prometheus` + `OTel` → `MetricsDashboard`. Ventana 5m rolling.
- **Error 5xx:** `rate(http_requests_total{code~="5.."}[5m]) / rate(http_requests_total[5m])`.
- **BookPI append:** `bookpi_append_total{status="ok"} / bookpi_append_total`. Debajo de 99.99% → P0 (ledger inmutable).
- **Drift/Fairness:** vía `detectDrift(baseline,current,0.15)` y `auditFairness(scores)` en `src/lib/native-ml/governed-ml.ts`.

## 3. Error budgets y burn rate

| SLO | Budget 28d | Burn 2x (rápido) | Burn 0.5x (lento) |
|---|---|---|---|
| 99.9% avail | 43m | `2% error 10m` → page | `0.2% error 1h` → ticket |
| 99.99% BookPI | 4.3m | `cualquier fail 5m` → P0 | — |

Multi-window: `5m burn>2 && 1h burn>1` para páginas; `5m>0.5` solo ticket.

## 4. RPO/RTO unificado (corrige P1-09 inconsistencia)

- `RPO ≤15m` (backup `scripts/db-backup.mjs` cada 15m, `pg_basebackup` + `supabase/migrations`).
- `RTO ≤60m` (restore `scripts/db-restore.mjs` + `vercel redeploy` + `node scripts/db-verify.mjs`).

Validación post-restore: `sumEconomicBalance` por tenant vs snapshot + `verifyIntegrity` BookPI + `/api/health/ready` 200.

Ver también `docs/operations/DISASTER_RECOVERY.md`.

## 5. Alertas y dashboards

- **OTel + Prometheus:** métricas en `ObservabilityPanel` (`traceId`, `correlationId`, `riskScore`).
- **Vercel logs:** `vercel logs <deploy> --since 10m`.
- **PagerDuty:** P0/P1 disponibilidad/error. Slack: latencia/drift/fairness.
- **Evidencia:** `MetricsDashboard` (latencia, throughput), `ObservabilityPanel` (traces), `Prometheus` (SLO burn), `vercel logs` (raw).

## 6. Canary y rollback

- `k8s/deployment.yaml`: `livenessProbe: /api/health/live`, `readinessProbe: /api/health/ready`, `maxUnavailable: 0`.
- Si burn rate >2 durante canary (5m), rollback automático `vercel redeploy <prev> --prod` o `git revert HEAD && git push`.
- Postmortem obligatorio: `docs/postmortems/YYYY-MM-DD.md` con `SHA + workflow run + artifact hash`.

## 7. Historial y revisión

- Trimestral o tras cada P0.
- Cambios a SLO requieren ADR + aprobación `SovereignOwner`.
