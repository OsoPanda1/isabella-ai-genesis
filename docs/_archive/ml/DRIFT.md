# DRIFT — Detección de Desviación de Modelos (ML Governance)

**Estado:** `implemented` — `src/lib/native-ml/governed-ml.ts`
**Threshold canónico:** `0.15` (15% desviación media relativa)
**Revisión:** 2026-09-23 · v3.1

## 1. Propósito

Detectar degradación, sesgo o deriva distribucional en modelos gobernados antes de que
afecte decisiones de CROWN/ARGUS. Ningún modelo despliega sin `drift check` + `fairness report`
en `evidenceRequired` de `MLJob`.

## 2. Contratos canónicos

```ts
import { detectDrift, auditFairness, measureVelocity } from "@/lib/native-ml/governed-ml";
```

### detectDrift(baseline: number[], current: number[], threshold = 0.15): DriftReport

```ts
export type DriftReport = {
  drift: number;          // |avg(current)-avg(baseline)| / |avg(baseline)|
  threshold: number;      // default 0.15
  triggered: boolean;     // drift > threshold
  recommendation: string;
};
```

- **Umbral:** `0.15` por defecto. Override permitido solo con ADR y aprobación `SovereignOwner`.
- **Cálculo:** desviación relativa de medias. Para distribuciones no gaussianas complementar con
  `PSI`/`KS` en pipeline extendido (ver §4).
- **Vacío:** `baseline.length===0 || current.length===0` → `drift=0, triggered=false, recommendation="Sin datos suficientes"`.
- **Acción si triggered:** reentrenar con `dataset versionado` + auditar fairness + registrar `AuditBundle`.

### auditFairness(scores: Array<{ group: string; score: number }>): FairnessReport

```ts
export type FairnessReport = { disparateImpact: number; passed: boolean; groups: string[] };
```

- **Métrica:** `disparateImpact = min(avg_grupo) / max(avg_grupo)` (regla 80% EEOC).
- **Paso:** `passed = disparateImpact >= 0.8`. Si `false` → bloquear promoción `TESTED→VERIFIED`.
- **Grupos:** se infieren de `scores[].group`. Mínimo 2 grupos, si no `passed:true` por insuficiencia.
- **Evidencia:** adjuntar `FairnessReport` a `MLJob.evidenceRequired[3]`.

### measureVelocity(latencies: number[]): VelocityMetrics

```ts
export type VelocityMetrics = { p50: number; p95: number; p99: number; throughput: number };
```

- Percentiles sobre latencias ordenadas. `throughput = N / sum(latencias_s)` (req/s aprox).
- Uso SLO: alimentar `p95 /api/isabella <850ms`, `p95 /api/v1/cognitive/orchestrate <1200ms`.

## 3. Pipeline de detección

1. **Captura baseline** al certificar modelo (`status=CERTIFIED`): histograma/embeddings/latencias.
2. **Muestreo ventana 5m/28d** según SLI en `docs/operations/SLO.md`.
3. **Ejecución:**
   ```ts
   const drift = detectDrift(baselineMeans, currentMeans, 0.15);
   const fairness = auditFairness(scoresByGroup);
   const velocity = measureVelocity(recentLatencies);
   if (drift.triggered || !fairness.passed) {
     // alert P1, rollback canary, abrir docs/postmortems/YYYY-MM-DD.md
   }
   ```
4. **Registro:** `DriftReport` + `FairnessReport` + `VelocityMetrics` → `audit_events` + `ObservabilityPanel`.

## 4. Extensiones recomendadas (no bloqueantes)

| Señal | Método | Umbral sugerido | Acción |
|---|---|---|---|
| PSI | `Σ (p-q) ln(p/q)` | `>0.25` crítico | Reentrenar |
| KS | `max|CDFb-CDFc|` | `p<0.05` | Revisión humana |
| Embeddings | cosine drift | `>0.15` | Versionar dataset |

## 5. Integración con Gobernanza

- **CROWN:** no pondera nodo con `drift.triggered=true` sin `requires_approval`.
- **ARGUS:** puede `denied` si `fairness.passed===false`.
- **SLO linkage:** `drift.triggered` cuenta como `burn rate` para SLI `BookPI append` y latencia.

## 6. Evidencia y auditoría

- `MLJob.evidenceRequired` debe contener `drift check` + `fairness report`.
- Tests: `test/unit/native-ml.test.ts` + futuros `test/native-ml/drift.test.ts`.
- Dashboard: `MetricsDashboard` + `ObservabilityPanel` con `traceId` correlacionado.

## 7. Referencias

- `src/lib/native-ml/governed-ml.ts:141` `detectDrift`
- `src/lib/native-ml/governed-ml.ts:159` `auditFairness`
- `src/lib/native-ml/governed-ml.ts:182` `measureVelocity`
- `docs/operations/SLO.md` — SLI/SLO
- `docs/governance/AI-GOVERNANCE-MATRIX-2026.md` — matriz de riesgo
