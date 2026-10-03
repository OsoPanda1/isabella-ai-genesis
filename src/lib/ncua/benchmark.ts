/**
 * NCUA Benchmark Engine (src/lib/ncua/benchmark.ts)
 * -------------------------------------------------------------
 * Automated benchmarks for ERI scoring, entropy patching, and pipeline latency.
 */
import { runAcademicPipeline } from "./academic-pipeline";

export interface BenchmarkMetrics {
  iterations: number;
  totalTimeMs: number;
  meanLatencyMs: number;
  p95LatencyMs: number;
  successRate: number;
  allPassedVerification: boolean;
}

export async function runNcuaBenchmark(iterations: number = 20): Promise<BenchmarkMetrics> {
  const latencies: number[] = [];
  let successCount = 0;

  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    const result = runAcademicPipeline({
      text: `Isabella sovereign academic hypothesis test iteration #${i}: ERI empirical validation.`,
      sourceCount: 3,
      peerReviewedCount: 2,
    });
    const t1 = performance.now();
    latencies.push(t1 - t0);
    if (result.passedVerification) {
      successCount++;
    }
  }

  latencies.sort((a, b) => a - b);
  const total = latencies.reduce((a, b) => a + b, 0);
  const p95Idx = Math.min(latencies.length - 1, Math.floor(latencies.length * 0.95));

  return {
    iterations,
    totalTimeMs: Number(total.toFixed(2)),
    meanLatencyMs: Number((total / iterations).toFixed(2)),
    p95LatencyMs: Number(latencies[p95Idx].toFixed(2)),
    successRate: successCount / iterations,
    allPassedVerification: successCount === iterations,
  };
}

export default { runNcuaBenchmark };
