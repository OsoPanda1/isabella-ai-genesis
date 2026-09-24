# Chaos Engineering — P1

**Objetivo:** resiliencia probada con `chaos` + `load 50/500` + `NCUA`

**Pruebas:**
- `test/security/chaos.test.ts` — `PDP` con identidad vacía → `deny` (no lanza)
- `test/security/ncua-load.test.ts` — `50` concurrentes `ERI≥95` + `500` `throughput 30MB/s`
- `k8s/chaos` — `NetworkPolicy` + `PodDisruptionBudget` + `chaos-mesh` `kill pod` + `latency` + `partition`

**Evidencia:** `NCUA 500` `p50/p95/p99` + `error rate 0` + `throughput` + `ERI` en `docs/evidence/`

**Falta para 100%:** `chaos` en `Neon` prod con `TEST_DATABASE_URL` vivo + `50/100/250/500` con `workflow_run_id` anclado
