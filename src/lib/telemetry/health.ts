import { IsabellaCoreId } from "../latam-aegis-x";
import { CentralizedTelemetryService } from "../latam-aegis-x";
import { ObservabilityService } from "./observability";

export interface HealthEvent {
  timestamp: string;
  coreId: IsabellaCoreId;
  type: "stack_overflow_warning" | "memory_leak_warning" | "auto_restart" | "healthy";
  message: string;
  severity: "low" | "medium" | "high" | "critical";
}

class HealthHeartbeatMonitor {
  private activeInterval: NodeJS.Timeout | null = null;
  private logs: HealthEvent[] = [];
  private readonly STACK_OVERFLOW_THRESHOLD = 160; // Max recursion depth
  private readonly MEMORY_LEAK_LIMIT_BYTES = 120 * 1024 * 1024; // 120MB threshold
  private readonly MAX_LOG_SIZE = 100;

  constructor() {
    this.startMonitoring();
  }

  public startMonitoring() {
    if (this.activeInterval) return;

    this.activeInterval = setInterval(() => {
      this.runDiagnostics();
    }, 4000); // Check core health every 4 seconds
  }

  public stopMonitoring() {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
  }

  /**
   * Run real-time diagnostics on all 24 core modules.
   * Auto-restores any core showing stack overflow or memory leaks.
   */
  public runDiagnostics() {
    const snapshot = ObservabilityService.getSnapshot();
    const timestamp = new Date().toISOString();

    for (const coreId of Object.keys(snapshot.cores) as IsabellaCoreId[]) {
      const core = snapshot.cores[coreId];
      let hasAnomaly = false;

      // 1. Check for stack overflow (exceeds safe depth limit)
      if (core.stackDepth > this.STACK_OVERFLOW_THRESHOLD) {
        this.logHealthEvent({
          timestamp,
          coreId,
          type: "stack_overflow_warning",
          message: `Stack overflow risk detected! Current depth: ${core.stackDepth}. Threshold: ${this.STACK_OVERFLOW_THRESHOLD}.`,
          severity: "critical",
        });
        hasAnomaly = true;
      }

      // 2. Check for memory leak (growth exceeding memory allocation budget)
      if (core.memoryUsageBytes > this.MEMORY_LEAK_LIMIT_BYTES) {
        this.logHealthEvent({
          timestamp,
          coreId,
          type: "memory_leak_warning",
          message: `Memory leak suspected! Usage: ${(core.memoryUsageBytes / (1024 * 1024)).toFixed(2)} MB exceeds limit of ${(this.MEMORY_LEAK_LIMIT_BYTES / (1024 * 1024)).toFixed(0)} MB.`,
          severity: "high",
        });
        hasAnomaly = true;
      }

      // 3. Trigger auto-restart if anomaly was flagged
      if (hasAnomaly) {
        // Log telemetry incident
        CentralizedTelemetryService.logEvent(
          core.moduleId,
          coreId,
          "CoreSelfHealingTriggered",
          {
            diagnosticMessage:
              "Auto-restarting CROWN core task to reclaim heap memory and reset recursion tree.",
            currentMemoryBytes: core.memoryUsageBytes,
            currentStackDepth: core.stackDepth,
          },
          "security_incident",
        );

        // Perform programmatic auto-restart
        ObservabilityService.forceRestartCore(coreId);

        this.logHealthEvent({
          timestamp,
          coreId,
          type: "auto_restart",
          message: `Self-healing protocol triggered. Clean-restarted core ${coreId} safely.`,
          severity: "high",
        });
      }
    }
  }

  private logHealthEvent(event: HealthEvent) {
    this.logs.unshift(event);
    if (this.logs.length > this.MAX_LOG_SIZE) {
      this.logs.pop();
    }

    // Direct system output for auditing
    console.log(
      `[HEALTH_MONITOR] [${event.type.toUpperCase()}] Core: ${event.coreId} - ${event.message}`,
    );
  }

  public getLogs(): HealthEvent[] {
    return [...this.logs];
  }

  /**
   * Intentionally trigger a diagnostic anomaly on a specific core to demo self-healing capabilities
   */
  public injectDiagnosticAnomaly(
    coreId: IsabellaCoreId,
    anomalyType: "stack_overflow" | "memory_leak",
  ) {
    if (anomalyType === "stack_overflow") {
      ObservabilityService.flagCoreWarning(coreId, 95, 192); // exceeds 160 threshold
    } else {
      ObservabilityService.flagCoreError(coreId, 142 * 1024 * 1024); // exceeds 120MB threshold
    }
  }
}

export const HealthMonitorService = new HealthHeartbeatMonitor();
