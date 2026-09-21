/**
 * Doble Pipeline Hexagonal — Capítulo XVI v3.0
 * 6 puertos: Ingest, Policy, Context, Inference, Evidence, Delivery
 * Pipeline A (principal activo) y Pipeline B (failover / activo-activo)
 * Métricas: p50,p95,p99, queue, crypto, inference, DB, total, retries, backpressure
 */
export type PipelinePort = "Ingest"|"Policy"|"Context"|"Inference"|"Evidence"|"Delivery";
export type PipelineId = "A"|"B";
export type PipelineMetrics = { p50:number; p95:number; p99:number; queueMs:number; cryptoMs:number; inferenceMs:number; dbMs:number; totalMs:number; retries:number; backpressure:number };

export class HexagonalPipeline {
  id: PipelineId;
  ports: PipelinePort[] = ["Ingest","Policy","Context","Inference","Evidence","Delivery"];
  private latencies: number[] = [];
  constructor(id: PipelineId){ this.id=id; }

  async execute<T>(fn: ()=>Promise<T>): Promise<{ result:T; metrics: PipelineMetrics }> {
    const start = performance.now();
    const qStart = performance.now();
    // simulate queue
    await new Promise(r=>setTimeout(r, Math.random()*5));
    const queueMs = performance.now()-qStart;
    const cStart = performance.now();
    // crypto gate placeholder
    const cryptoMs = 2 + Math.random()*3;
    await new Promise(r=>setTimeout(r,cryptoMs));
    const cryptoEnd = performance.now()-cStart;
    const iStart = performance.now();
    const result = await fn();
    const inferenceMs = performance.now()-iStart;
    const dbMs = 1 + Math.random()*4;
    const totalMs = performance.now()-start;
    this.latencies.push(totalMs);
    if(this.latencies.length>1000) this.latencies.shift();
    const sorted=[...this.latencies].sort((a,b)=>a-b);
    const p = (pct:number)=> sorted[Math.floor(sorted.length*pct)] ?? totalMs;
    return { result, metrics: { p50:p(0.5), p95:p(0.95), p99:p(0.99), queueMs, cryptoMs: cryptoEnd, inferenceMs, dbMs, totalMs, retries:0, backpressure: this.latencies.length/1000 } };
  }
}

export class DoublePipelineRouter {
  A = new HexagonalPipeline("A");
  B = new HexagonalPipeline("B");
  async route<T>(fn: ()=>Promise<T>, health: {A:number; B:number; latencyA:number; latencyB:number}) {
    // health score 0-1, latency p95
    const scoreA = health.A*0.5 + (1-health.latencyA/100)*0.5;
    const scoreB = health.B*0.5 + (1-health.latencyB/100)*0.5;
    const chosen = scoreA >= scoreB ? this.A : this.B;
    const fallback = chosen===this.A ? this.B : this.A;
    try { return await chosen.execute(fn); } catch (e) {
      // failover
      return await fallback.execute(fn);
    }
  }
}

export const doublePipeline = new DoublePipelineRouter();
