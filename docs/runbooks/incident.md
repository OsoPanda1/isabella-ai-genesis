# Runbook — Incidentes (P0/P1)

**On-call:** `tamvonlinenetwork-7731` (ver `docs/operations/SLO.md`).
**Fuente SLO:** `docs/operations/SLO.md` · **DR:** `docs/operations/DISASTER_RECOVERY.md`
**Revisión:** 2026-09-23

## 0. Clasificación y severidad

| Severidad | Criterio | Tiempo respuesta | Canal |
|---|---|---|---|
| **P0** | `repository_unhealthy` / `BookPI <99.9%` / data loss / `5xx >0.5%` | 5m | PagerDuty + Slack #incidents |
| **P1** | `p95 >1500ms 5m` / `drift >0.15` / `fairness <0.80` / degradación parcial | 15m | Slack #incidents |
| **P2** | latencia p95 >1000ms / WCAG fail / no crítico | 1h | Slack #ops |

## 1. Detección (primeros 2 min)

1. `vercel logs <deploy> --since 10m` → buscar `V.jsxDEV` / `repository_unhealthy` / `genesis_service_unconfigured` / `burn rate`
2. `curl https://isabella-ai.visitarealdelmonte.online/api/health | jq .checks`
3. `curl https://isabella-ai.visitarealdelmonte.online/api/health/ready | jq .` — debe ser 200
4. Grafana/Prometheus: `burn rate` panel + `MetricsDashboard` + `ObservabilityPanel` (`traceId`)

## 2. Triage blanco/negro

| Síntoma | Check | Acción inmediata |
|---|---|---|
| `repository_unhealthy` | `vercel env ls` → verificar `DATABASE_URL` sin `channel_binding`, `ISABELLA_STORAGE_PROVIDER=postgres`, `SELECT 1` | rotar `DATABASE_URL` si corrupto, ver `bookpi-postgres-repository.ts` |
| `genesis_service_unconfigured` | `vercel env ls \| grep CROWN` | rotar `CROWN_POLICY_SIGNING_KEY` (64 hex), redeploy |
| `V.jsxDEV` | `vite.config.ts` `generateBundle` debe estar en `main` | revert commit, push canónico |
| `5xx >0.5%` | `vercel logs --since 5m \| grep 5xx` | escalar P0, freeze deploys |
| `p95 >1500ms` | `k8s/HPA` metrics, `double-pipeline` queue | escalar HPA, revisar `measureVelocity` |
| `drift >0.15` | `detectDrift(baseline,current)` en `governed-ml.ts:141` | P1, abrir `docs/ml/DRIFT.md` §3, bloquear promoción |
| `fairness <0.80` | `auditFairness(scores)` | P1, bloquear `TESTED→VERIFIED`, auditar dataset |

## 3. Mitigación (5–15 min)

1. **Freeze deploys:** `/lock` en GitHub (branch protection) hasta cierre.
2. **Rollback si SLO quemado:**
   ```bash
   vercel redeploy <prev> --prod
   # o
   git revert HEAD && git push
   ```
   Canary revierte automático si `k8s/deployment.yaml` `livenessProbe` falla.
3. **DB:** si `RPO ≤15m` comprometido → `scripts/db-restore.mjs` con último snapshot verificado (`docs/operations/DISASTER_RECOVERY.md` §3-4).
4. **Secretos comprometidos:** rotar `ENCRYPTION_MASTER_KEY`, `AUTH_JWT_SECRET`, Stripe → `docs/operations/ENCRYPTION_MATRIX.md`, revocar sesiones/API keys.

## 4. Comunicación

- **Interna (0–5m):** post en Slack #incidents: `SEV P0/P1 | síntoma | impacto | on-call | ETA update 15m`
- **Externa si afecta usuarios:** banner en `EmergencyModeView` + status page.
- **Updates cada 15m** hasta mitigado.

## 5. Post-incidente (24h)

1. Crear `docs/postmortems/YYYY-MM-DD.md` con: `SHA + workflow run + artifact hash + timeline + causa raíz + 5 whys`.
2. `node scripts/db-verify.mjs` + `verifyIntegrity` BookPI + reconciliación `sumEconomicBalance`.
3. Burn rate: registrar minutos consumidos del error budget (`docs/operations/SLO.md` §3).
4. ADR si cambia SLO/SLI o política CROWN/ARGUS.
5. `production:evidence` regenerado (`pnpm production:evidence`).

## 6. Contactos y escalado

- On-call primario: `tamvonlinenetwork-7731`
- Escalado: `SovereignOwner` → `Operator` (ver `docs/governance/AI-GOVERNANCE-MATRIX-2026.md`)
- Si no hay ack en 5m (P0) → auto-escala PagerDuty L2.
