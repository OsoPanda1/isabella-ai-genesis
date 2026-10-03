/**
 * Observability Engine (src/lib/telemetry/observability.ts)
 * -------------------------------------------------------------
 * Real runtime telemetry, metric tracking, and latency distribution.
 * CRITICAL INTEGRITY RULE: Never fabricates metrics or uses Math.random.
 */

export interface TelemetryEvent {
  id: string;
  traceId: string;
  name: string;
  durationMs: number;
  success: boolean;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface MetricSummary {
  sampleCount: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  successCount: number;
  failureCount: number;
  errorRate: number;
}

class ObservabilityManager {
  private events: TelemetryEvent[] = [];
  private readonly maxBufferSize = 5000;

  public recordEvent(event: TelemetryEvent): void {
    this.events.push({ ...event });
    if (this.events.length > this.maxBufferSize) {
      this.events.shift();
    }
  }

  public getSummary(eventName?: string): MetricSummary {
    const filtered = eventName
      ? this.events.filter((e) => e.name === eventName)
      : [...this.events];

    if (filtered.length === 0) {
      return {
        sampleCount: 0,
        p50Ms: 0,
        p95Ms: 0,
        p99Ms: 0,
        successCount: 0,
        failureCount: 0,
        errorRate: 0,
      };
    }

    const latencies = filtered.map((e) => e.durationMs).sort((a, b) => a - b);
    const percentile = (p: number) => {
      const idx = Math.min(latencies.length - 1, Math.floor((latencies.length - 1) * p));
      return latencies[idx] ?? 0;
    };

    const successCount = filtered.filter((e) => e.success).length;
    const failureCount = filtered.length - successCount;

    return {
      sampleCount: filtered.length,
      p50Ms: percentile(0.5),
      p95Ms: percentile(0.95),
      p99Ms: percentile(0.99),
      successCount,
      failureCount,
      errorRate: failureCount / filtered.length,
    };
  }

  public getRecentEvents(limit: number = 50): readonly TelemetryEvent[] {
    return this.events.slice(-limit);
  }

  public clear(): void {
    this.events = [];
  }
}

export const observability = new ObservabilityManager();

export function recordTelemetry(event: TelemetryEvent): void {
  observability.recordEvent(event);
}

export function getTelemetrySummary(name?: string): MetricSummary {
  return observability.getSummary(name);
}

export default observability;
