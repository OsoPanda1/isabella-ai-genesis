# DRIFT — Detección, Fairness y Velocidad (ML Gobernado v3.1)

**Fuente canónica:** `src/lib/native-ml/governed-ml.ts` — `detectDrift(auditFairness, measureVelocity)` + `SLO.md` drift/fairness thresholds.

## 1. Drift Detection

**Definición:** Desviación de distribución entre `baseline` (dataset versionado entrenado) y `current` (inferencia reciente). Umbral canónico `0.15` (15%).

```ts
import { detectDrift } from "@/lib/native-ml/governed-ml";
const r = detectDrift(baseline, current, 0.15);
// { drift: 0.18, threshold: 0.15, triggered: true, recommendation: "Drift 0.180 > 0.15 — reentrenar..." }
```

**Fórmula:** `drift = |avg(current) - avg(baseline)| / |avg(baseline) || 1` (4 decimales). `triggered = drift > threshold`.

**Política:**
- `drift ≤0.15` → `E0` continuo, monitoreo `OTel` + `Prometheus`.
- `drift >0.15` → `triggered=true` → P1 Slack (`docs/operations/SLO.md:17`), obligatorio `reentrenar con dataset versionado + auditar fairness` antes de promover.
- `baseline/current vacíos` → `drift=0, recommendation: "Sin datos suficientes"` (fail-safe, no reentrenar a ciegas).

**Versionado:** `MLJob.datasetVersion` (`createMLJob(..., datasetVersion="v1")`) + `provenanceHash` en `graphRAGWithProvenance` — cada train log incluye `dataset hash + eval metrics + drift check` en `evidenceRequired`.

## 2. Fairness Audit

**Definición:** Impacto desproporcionado entre grupos protegidos. Umbral `disparateImpact ≥0.80` (regla 80% EEOC).

```ts
import { auditFairness } from "@/lib/native-ml/governed-ml";
const f = auditFairness([{group:"A",score:0.82},{group:"B",score:0.61}]);
// { disparateImpact: 0.744, passed: false, groups: ["A","B"] }
```

**Fórmula:** `avg por grupo → disparateImpact = min(avg)/max(avg)` (3 decimales). `passed = disparateImpact ≥0.80`.

**Política:**
- `passed=true` → deploy permitido (con `SLO` fairness 100% check por train).
- `passed=false` → block `verify` (`SLO.md:18`), requiere revisión humana + `CONTROLS.supervised.control` (fairness y drift monitoring) + mitigación (rebalanceo, re-muestreo, threshold tuning).
- `<2 scores` → `passed=true, disparateImpact=1` (insuficiente para evaluar, no bloquear).

**Gobernanza:** `validateRLPolicyChange` — ningún `reinforced` puede modificar política sin `POLICY + aprobación humana`; XAI con atribución obligatoria.

## 3. Velocity / Performance

**Definición:** Latencia y throughput del pipeline ML.

```ts
import { measureVelocity } from "@/lib/native-ml/governed-ml";
const v = measureVelocity(latenciesMs); // [12, 45, 67, ...]
// { p50, p95, p99, throughput: req/s }
```

**Fórmula:** `p50=percentil 50, p95=95, p99=99` sobre `latencies` ordenadas; `throughput = N / (sum(latencies)/1000)` (req/s, 2 decimales). `latencias vacías → 0`.

**SLOs vinculados:** `p95 /api/isabella <850ms`, `p95 /api/v1/cognitive/orchestrate <1200ms` (`SLO.md:12-13`). Burn `p95 >1000/1500 5m → Slack`.

## 4. Runbook y Evidencia

- **Alertas:** `detectDrift >0.15` → P1 → `k8s/HPA` review + `scripts/production-evidence.mjs`.
- **Dashboards:** `MetricsDashboard` (latencia/throughput), `ObservabilityPanel` (traces con `traceId`), `Prometheus` `http_request_duration_seconds`.
- **Evidencia por deploy:** `train log + eval metrics + fairness report + drift check + dataset hash` (ver `MLJob.evidenceRequired`).
- **Reversión:** Si SLO drift/fairness se quema en canary → rollback automático `vercel redeploy <prev> --prod` (`SLO.md:58`).

**Verificación:** `pnpm typecheck` 0 errors, `src/lib/native-ml/governed-ml.ts:141` `detectDrift`, `:159` `auditFairness`, `:182` `measureVelocity` + `test` de umbrales.

**Estado:** `implemented` — falta `drift live` con dataset versionado real + `HSM para ML-KEM` (ver `docs/05-ISABELLA-INTELIGENCIA-ML.md:17` y `HSM-KMS.md`).
