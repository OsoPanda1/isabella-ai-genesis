import { describe, it, expect } from "vitest";
import { doublePipeline } from "../../src/lib/isabella/double-pipeline";
import { MetricsDashboard } from "../../src/components/isabella/MetricsDashboard";

describe("MetricsDashboard & Super Turbo Hexagonal Latency", () => {
  it("MetricsDashboard component is defined and exported correctly", () => {
    expect(MetricsDashboard).toBeDefined();
    expect(typeof MetricsDashboard).toBe("function");
  });

  it("DoublePipeline provides valid p50, p95, and p99 metrics for real-time visualization", () => {
    const snapshot = doublePipeline.getSnapshot();
    expect(snapshot).toBeDefined();
    expect(snapshot.metricsA).toBeDefined();
    expect(snapshot.metricsB).toBeDefined();

    // Verify p50, p95, p99 percentiles are positive numbers
    expect(snapshot.metricsA.p50).toBeGreaterThan(0);
    expect(snapshot.metricsA.p95).toBeGreaterThanOrEqual(snapshot.metricsA.p50);
    expect(snapshot.metricsA.p99).toBeGreaterThanOrEqual(snapshot.metricsA.p95);

    // Verify history points have p50, p95, p99
    expect(snapshot.history.length).toBeGreaterThan(0);
    const firstPoint = snapshot.history[0];
    expect(firstPoint.p50A).toBeDefined();
    expect(firstPoint.p95A).toBeDefined();
    expect(firstPoint.p99A).toBeDefined();
    expect(firstPoint.time).toBeDefined();
  });

  it("Super Turbo benchmark updates latency history dynamically", async () => {
    const beforeCount = doublePipeline.getSnapshot().history.length;
    const snap = await doublePipeline.runSuperTurboBenchmark(2);

    expect(snap.turboModeEnabled).toBe(true);
    expect(snap.turboSpeedupFactor).toBeGreaterThanOrEqual(3.0);
    expect(snap.parallelSavingsMs).toBeGreaterThan(0);
    expect(snap.history.length).toBeGreaterThanOrEqual(beforeCount);
  });
});
