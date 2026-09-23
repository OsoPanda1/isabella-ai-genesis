# SLO/SLI — Isabella AI Genesis (P1)

**Objetivos de disponibilidad y latencia — blanco o negro.**

| SLI | SLO | Ventana | Alert | Runbook |
|---|---|---|---|---|
| Disponibilidad `GET /api/health/live` | `99.9%` | 28d | `burn rate >2` → PagerDuty | `docs/runbooks/incident.md` |
| Latencia `p95 /api/isabella` | `< 850ms` | 5m | `p95 >1000ms 5m` → Slack | `k8s/HPA` |
| Latencia `p95 /api/v1/cognitive/orchestrate` | `< 1200ms` | 5m | `p95 >1500ms` | `double-pipeline` |
| Tasa error `5xx` | `< 0.1%` | 5m | `>0.5%` → P1 | `vercel logs` |
| BookPI `append` éxito | `99.99%` | 28d | `<99.9%` → P0 | `src/lib/repositories/bookpi-postgres-repository.ts` |
| NCUA `50/500` `ERI≥95` | `100%` | por deploy | `<95` → block deploy | `test/security/ncua-load.test.ts` |

**RPO/RTO unificado (corrige P1-09 inconsistencia):**
- `RPO ≤15m` (backup `scripts/db-backup.mjs` cada 15m, `pg_basebackup`)
- `RTO ≤60m` (restore `scripts/db-restore.mjs` + `vercel redeploy`)

**Evidencia:** `MetricsDashboard` + `ObservabilityPanel` + `OTel` + `Prometheus` + `vercel logs`.

**No hay maquillaje:** si `SLO` se quema, `canary` se revierte automáticamente (ver `k8s/deployment.yaml` `livenessProbe`).
