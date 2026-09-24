# Observabilidad — SRE

**OTel** `traceId/correlationId` + `Prometheus` `MetricsDashboard` + `audit` `JCS RFC8785`

**SLO:** `99.9%` disponibilidad, `p95 <850ms`, `error <0.1%`, `RPO 15m/RTO 60m` — `docs/operations/SLO.md`

**Alertas:** `burn rate >2` → PagerDuty, `p95 >1000ms 5m` → Slack

**Evidencia:** `ObservabilityPanel 79KB` + `QuantumUtilityDashboard 95KB` + `NCUA load` + `vercel logs`
