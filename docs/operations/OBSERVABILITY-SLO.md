# Observabilidad — SRE (OTel + Prometheus + PII controls)

**Estado:** `implemented` — `traceId/correlationId` + `OTLP` + `Prometheus` + `PII redaction` + `SLO burn-rate`

**Revisión:** 2026-09-24 · Owner: `tamvonlinenetwork-7731`
**Fuentes SLO:** `docs/operations/SLO.md` · **Runbook:** `docs/runbooks/incident.md` · **Config:** `src/lib/config.ts` + `src/lib/env-schema.ts`

**SLO canónico:** `99.9%` disponibilidad (`43m/mes`), `99.99%` BookPI (`4.3m/mes`), `p95 <850ms` (`/api/isabella`), `p95 <1200ms` (`/api/v1/cognitive/orchestrate`), `5xx <0.1%`, `RPO ≤15m / RTO ≤60m`

---

## 1. Arquitectura OTel (OpenTelemetry)

### 1.1 Inicialización y transporte

- **Entry-point:** `src/server.ts:10` `initOpenTelemetry()` → `src/lib/telemetry/otel-init.ts:42` `OpenTelemetryService.getInstance().init()`
- **Env:** `OTEL_EXPORTER_OTLP_ENDPOINT` (opcional URL, `optionalUrl()` en `env-schema.ts:140`) + `OTEL_SERVICE_NAME` (default `isabella-ai`). Sin endpoint → modo local (no-op documentado, no falla request).
- **Protocolo:** OTLP/HTTP JSON → `${endpoint}/v1/traces` + `/v1/metrics` + `/v1/logs` (ver `otel-init.ts:242`, `306`, `otel-exporter.ts:155`). `Content-Type: application/json`, `AbortSignal.timeout(3000)`, fail-open (warn, nunca rompe request).
- **Recursos:** `service.name = OTEL_SERVICE_NAME`, `service.version = 4.3.3`, `deployment.environment = NODE_ENV`, `scope = isabella-core-tracer v1.0.0` / `isabella-metrics` / `isabella-telemetry`.
- **Instrumentación request:** `src/server.ts:61` `withSpan(HTTP method path, kind=SERVER, attributes http.method/target/client.ip)` + `recordMetric http.server.requests/errors` por respuesta.
- **Batching:** `spanQueue` + `metricQueue` máx 250, auto-flush cada 5s (`setInterval` 5000ms, `otel-init.ts:89`), flush inmediato si `queue >= max`. `otel-exporter.ts` outbox similar (500 fallback) + auto-flush 5s + trigger `>=50` pendientes.
- **Sampling:** implícito 100% en `withSpan` (todo request genera span local); filtrado en Collector. `otel-neutral` normaliza antes de export.

### 1.2 Traces y correlación

- **IDs:** `traceId = randomUUID().replace(/-/g,"")` (32 hex) + `spanId = 16 hex` (`otel-init.ts:99`). `createTraceId()` en `otel-neutral.ts:30` mismo esquema. `correlationId` derivado de `traceId` en `request-context.ts`/`audit-repository.ts`.
- **Context propagation:** `traceId`/`correlationId` inyectados en headers `x-isabella-trace-id` (`isabella-voice.ts:136`, `catalog.ts:225`...), logs JSON (`toOTelLog` → `trace_id`), `audit_events` y `ObservabilityPanel` (79KB).
- **Spans:** `SpanRecord` con `name`, `kind` (SERVER/CLIENT/INTERNAL), `startTimeUnixNano`/`endTimeUnixNano` (BigInt nano), `durationMs`, `status OK|ERROR|UNSET`, `attributes` tipadas. `withSpan` mide `performance.now()` y captura error con `attributes.error=true`.
- **Logs estructurados:** `OtelQueuedLog` (`otel-exporter.ts:19`) → `resourceLogs` OTLP con `severityText`, `body = module:core:event`, `attributes: isabella.trace_id/correlation_id/module/core/event/payload`.

### 1.3 Verificación OTel

```bash
# Boot log esperado
[OpenTelemetry] Inicializado con endpoint OTLP: https://otlp.example.com (Service: isabella-ai)
# o sin env:
[OpenTelemetry] Endpoint OTLP no definido en .env. Modo local de observabilidad activado.

# Status en runtime
curl -s http://localhost:3000/api/health | jq .otel
# o en código:
import { otelService } from "./lib/telemetry/otel-init";
console.log(otelService.getStatus()); // { initialized, enabled, serviceName, endpoint, queueDepth:{spans,metrics} }

# Flush manual (test)
import { flushTelemetry } from "./lib/telemetry/otel-init"; await flushTelemetry();
import { OTEL_EXPORTER } from "./lib/otel-exporter"; await OTEL_EXPORTER.flush();
```

---

## 2. Prometheus + Métricas SLO

### 2.1 Métricas canónicas (SLO §2-3)

| Métrica OTel/Prom | PromQL / Histograma | SLO | Alerta |
|---|---|---|---|
| `http_request_duration_seconds` (histograma) | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` | `p95 <850ms /api/isabella`, `p95 <1200ms /cognitive/orchestrate` | `p95 >1000ms 5m → Slack`, `p95 >1500ms 5m → P1` |
| `http_requests_total{code}` | `rate(http_requests_total{code~="5.."}[5m]) / rate(http_requests_total[5m])` | `<0.1%` global 5xx | `>0.5% 5m → P0` |
| `http.server.requests` (OTel gauge) | `sum(rate(http_server_requests[5m]))` | disponibilidad `99.9%` vía probes | `burn rate >2 → PagerDuty` |
| `bookpi_append_total{status}` | `bookpi_append_total{status="ok"} / bookpi_append_total` | `99.99%` (4.3m/mes) | `<99.9% 5m → P0` |
| `availability probe` | `success / (success+fail)` cada 30s (`/api/health/live`, `/api/health/ready`) | `99.9%` 28d | `burn 2% error 10m → page` |
| `ncua ERI` | `test/security/ncua-load.test.ts` 50/500 | `ERI≥95 100%` por deploy | `<95 → block deploy` |
| `drift` / `fairness` | `detectDrift(baseline,current,0.15)` / `auditFairness` | `0 triggered` / `≥0.80` | `>0.15 → P1`, `<0.80 → block verify` |

### 2.2 Burn-rate y error budget (SLO §3)

| SLO | Budget 28d | Burn 2x (rápido) | Burn 0.5x (lento) | Multi-window |
|---|---|---|---|---|
| 99.9% avail | 43m | `2% error 10m` → page | `0.2% error 1h` → ticket | `5m burn>2 && 1h burn>1` page; `5m>0.5` ticket |
| 99.99% BookPI | 4.3m | `cualquier fail 5m` → P0 | — | — |

Cálculo Prometheus burn: `burn = (error_rate / (1 - SLO))`. Dash Grafana `SLO burn` + `MetricsDashboard` (`p50/p95/p99`, throughput) + `ObservabilityPanel` (traces por `traceId`).

### 2.3 Instrumentación local (ObservabilityService)

- **Archivo:** `src/lib/telemetry/observability.ts:43` `ObservabilityEngine` — 0 синтетика, valores `0/unknown` hasta `recordEvent()` real.
- **API:**
  ```ts
  ObservabilityService.recordEvent(latencyMs, anomalyScore) // valida finitos, actualiza avgLatencyMs/anomalyScore
  ObservabilityService.getLatencyBudget() // {p50,p95,p99,sampleCount} sobre 512 muestras ordenadas
  ObservabilityService.updateCoreTelemetry(coreId, {load,memory,stack,...}) // validado 0-100 load, memory>=0
  ObservabilityService.subscribe(listener) // snapshot clonado via structuredClone
  ```
- **Snapshot:** `ObservabilitySnapshot {timestamp, throughput, avgLatencyMs, anomalyScore, totalEventsProcessed, incidentsCount, cores: Record<CoreId, {status, memoryUsageBytes, stackDepth, temperatureCelsius, loadPercentage, errorCount}> }`
- **Prometheus bridge:** `observability-repository.ts` expone `MetricsDashboard` para Grafana; no fabrica CPU/RAM host (pertenece a proveedor infra).

### 2.4 Dashboards y evidencia

- **MetricsDashboard:** latencia p50/p95/p99, throughput, `http.server.*`, `anomalyScore` (source `ObservabilityService`).
- **ObservabilityPanel (79KB) + QuantumUtilityDashboard (95KB):** traces por `traceId/correlationId/riskScore`, `NCUA load`, `vercel logs`.
- **Vercel logs:** `vercel logs <deploy> --since 10m` (raw), correlacionado por `traceId`.
- **Prometheus/Grafana:** panel `SLO burn`, `http_request_duration_seconds`, `bookpi_append_total`. Ver `docs/operations/SLO.md` §5.

---

## 3. PII Controls (privacidad por diseño)

### 3.1 Principios

- **Data minimization:** solo `traceId/correlationId` + métricas agregadas; nunca `email`, `nombre`, `DNI`, `payload` sensible en spans/logs.
- **Allowlist estricta:** `src/lib/telemetry/otel-neutral.ts:13` `ALLOWED_KEYS = {route, method, runtime, model, locale, decision, error_code, tenant_class}`. `normalizeAttributes()` filtra claves fuera de allowlist (drop silencioso).
- **Hashing por tamaño:** `bucket()` → si `string.length >64` (MAX_ATTR_VALUE), reemplaza por `sha256(value).slice(0,12)` (no reversible, correlacionable para debugging sin PII).
- **No IPs sin redacción:** `client.ip` en `server.ts:111` solo si existe; headers `x-forwarded-for` etc. se borran (`sanitizedHeaders.delete`) y se reinyecta solo `x-real-ip` validado por `resolveTrustedClientIp`. IP nunca en atributos OTel salvo `client.ip` hasheado si excede 64.
- **Fail-closed secretes:** `secret-redactor.ts:7` `BUILTIN_KEYS` + `REDACT_EXTRA_KEYS` + patrones genéricos (`api[_-]?key|secret|token|password|bearer`, `Bearer`, `?token=`) → `[REDACTED]` en `src/server.ts:82` `redact(err.stack)` y `OTel` logs. `redactObject()` recursivo por clave sensible (`/(secret|token|password|jwt|signing|encryption|private[_-]?key)/i`).

### 3.2 Implementación

```ts
// otel-neutral.ts — única vía para atributos OTel
export function normalizeAttributes(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([k]) => ALLOWED_KEYS.has(k))
                         .map(([k,v]) => [k, bucket(v)]) // hash si >64
  );
}
export function createOTelEvent({traceId,kind,name,durationMs,status,attributes}) {
  return { traceId: traceId||createTraceId(), attributes: normalizeAttributes(attributes), timestamp: new Date().toISOString() };
}
export function toOTelLog(event) {
  return JSON.stringify({ time:event.timestamp, trace_id:event.traceId, event:event.name, kind:event.kind, duration_ms:event.durationMs, status:event.status, attributes:event.attributes });
}

// observability.ts — valida rangos, nunca inventa métricas
recordEvent(latencyMs, score) { if (!isFinite(latencyMs)||latencyMs<0) throw "invalid_latency"; ... }
updateCoreTelemetry(coreId, {memoryUsageBytes, loadPercentage}) { if(load<0||load>100) throw "invalid_load"; ... }

// otel-init.ts — span attributes filtradas vía createOTelEvent
recordSpan(span) {
  const otelEvent = createOTelEvent({ traceId: span.context.traceId, kind: status==="ERROR"?"error":"request", name: span.name, durationMs: span.durationMs, status, attributes: { service_name: serviceName, span_id, parent_span_id, ...span.attributes } });
  if (process.env.NODE_ENV==="development" && status==="ERROR") console.log(`[OTel] ${toOTelLog(otelEvent)}`);
  // enqueue solo si enabled (+ sanitized)
}

// secret-redactor.ts — redacción determinista en server.ts
import { redact } from "./lib/secret-redactor";
console.error(redact(err.stack ?? err.message)); // usado en src/server.ts:82,128
```

### 3.3 Controles adicionales

- **Payloads OTLP:** `isabella.payload` en `otel-exporter.ts:147` serializado con `JSON.stringify` truncado a 4000 chars, y solo campos allowlist previos; nunca incluir `prompt` completo ni PII.
- **Sanitización headers:** `src/server.ts:32` borra `x-forwarded-for`, `x-forwarded-host`, `x-forwarded-proto`, `x-real-ip`, `cf-connecting-ip`, `x-vercel-forwarded-for` — evita spoofing y fuga de IP upstream.
- **Logs Vercel:** `redact` aplicado antes de `console.error/log`; `SECURITY.md` prohíbe `process.env` directo y `console.log` de secretos.
- **Tenant isolation:** `tenant-guard.ts` + RLS Supabase; `traceId` no expone `tenantId` raw (bucket/hash).
- **Verificación PII:**
  ```bash
  pnpm security:scan  # eslint.security.mjs + secret-scan.mjs → 0 secretos
  rg -n "email|password|secret" src/lib/telemetry/ --type ts  # debe dar 0 hits fuera de redactor
  node -e "import('./src/lib/telemetry/otel-neutral.ts').then(m=>console.log(m.normalizeAttributes({route:'/api/isabella', email:'a@b.com', method:'POST'})))" 
  # → {route:'/api/isabella', method:'POST'} (email dropeado)
  ```

### 3.4 Cumplimiento

- **GDPR/LFPDPPP territorial:** datos México (Nodo Cero) permanecen en `DATABASE_URL` Postgres; OTel Collector fuera de MX solo recibe allowlist + hashes.
- **Retención:** `ObservabilitySnapshot` en memoria (512 muestras rolling) + `audit_events` append-only con retención mínima; purga por `traceId` expiry según política (no PII persistida).
- **Auditoría:** toda rotación/revocación de claves → `audit-repository.ts` con `traceId` pero sin secreto (`HSM-KMS.md`).

---

## 4. RPO/RTO (DR unificado) — ver SLO §4

- **RPO ≤15m:** `scripts/db-backup.mjs` cada 15m (`pg_basebackup` + `supabase/migrations`), manifiesto `sha256` por tabla.
- **RTO ≤60m:** `scripts/db-restore.mjs` + `vercel redeploy` + `node scripts/db-verify.mjs`, validación `sumEconomicBalance` por tenant vs snapshot + `verifyIntegrity` BookPI + `/api/health/ready` 200.
- **Ver:** `docs/operations/DISASTER_RECOVERY.md` (o `docs/_archive/operations/DISASTER_RECOVERY.md` si no migrado) §1-5; `SLO.md` §4.

---

## 5. Alertas y on-call

- **PagerDuty:** P0 availability/5xx/BookPI burn>2; **Slack:** latencia/drift/fairness p95.
- **Canary:** `k8s/deployment.yaml` `livenessProbe /api/health/live`, `readinessProbe /api/health/ready`, `maxUnavailable: 0`; si `burn>2` en canary 5m → rollback `vercel redeploy <prev> --prod` o `git revert HEAD && git push`.
- **Evidencia por alerta:** `traceId` sample + `MetricsDashboard` p50/p95/p99 + `Prometheus burn` screenshot + `vercel logs --since 10m --traceId`.
- **On-call:** `tamvonlinenetwork-7731` → `SovereignOwner` → `Operator` (ver `AI-GOVERNANCE-MATRIX-2026.md`).

---

## 6. Verificación operativa

```bash
pnpm typecheck && pnpm build
pnpm test -- observability otel  # unit
pnpm security:scan                # 0 hallazgos
curl http://localhost:3000/api/health/live  # 200
curl http://localhost:3000/api/health/ready # 200

# Prometheus checks
# Grafana: http_request_duration_seconds p95 <850ms, error <0.1%
# OTel: otelService.getStatus().queueDepth.spans < 50 steady
# PII: normalizeAttributes({route:"/api", email:"x"}) → email ausente
```

---

## 7. Referencias cruzadas

- `docs/operations/SLO.md` — SLIs/SLOs, error budget, RPO/RTO, canary
- `docs/runbooks/incident.md` — runbook P0/P1, triage, mitigación, postmortem
- `src/lib/telemetry/observability.ts` — `ObservabilityService`, `getLatencyBudget`, `recordEvent`
- `src/lib/telemetry/otel-init.ts` — `OpenTelemetryService`, `withSpan`, `recordMetric`, `flush`
- `src/lib/telemetry/otel-neutral.ts` — `ALLOWED_KEYS`, `normalizeAttributes`, `bucket`, `createOTelEvent`
- `src/lib/otel-exporter.ts` — `enqueueOtelLog`, `flushOtelOutbox`, durable OTLP
- `src/lib/telemetry/coverage.ts` / `health.ts` / `observability-repository.ts` — re-export / health probes
- `src/lib/secret-redactor.ts` — `[REDACTED]` patterns, `redactObject`
- `src/server.ts` — `initOpenTelemetry`, `withSpan` por request, `redact` en errores, header sanitization
- `k8s/deployment.yaml` — probes, resources, canary rollback
- `AGENTS.md:10` — observabilidad mínima: `traceId`, `correlationId`, decisión, herramienta, riesgo, timestamp, actor
