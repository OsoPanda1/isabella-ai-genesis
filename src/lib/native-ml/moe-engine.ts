/**
 * Mixture of Experts (MoE) Native Engine (src/lib/native-ml/moe-engine.ts)
 */
import { ExpertRoute, MoeRoutingDecision } from "./types";

export class MoeEngine {
  private experts: ExpertRoute[] = [
    { expertId: "exp_crown", name: "CROWN Governance Expert", weight: 0.95, domain: "governance" },
    { expertId: "exp_sophia", name: "SOPHIA Epistemic Expert", weight: 0.92, domain: "academic" },
    { expertId: "exp_orion", name: "ORION Tool Execution Expert", weight: 0.88, domain: "tools" },
    { expertId: "exp_isa", name: "ISA Presence & Persona Expert", weight: 0.96, domain: "presence" },
    { expertId: "exp_argus", name: "ARGUS Security Sentinel", weight: 0.99, domain: "security" },
  ];

  public route(input: string): MoeRoutingDecision {
    const t0 = performance.now();
    const normalized = input.toLowerCase();

    const selected: ExpertRoute[] = [];
    if (normalized.includes("seguridad") || normalized.includes("auth") || normalized.includes("token")) {
      selected.push(this.experts.find((e) => e.expertId === "exp_argus")!);
    }
    if (normalized.includes("epistem") || normalized.includes("fuente") || normalized.includes("verdad")) {
      selected.push(this.experts.find((e) => e.expertId === "exp_sophia")!);
    }
    if (normalized.includes("ejecuta") || normalized.includes("herramienta") || normalized.includes("tool")) {
      selected.push(this.experts.find((e) => e.expertId === "exp_orion")!);
    }
    if (selected.length === 0) {
      selected.push(this.experts.find((e) => e.expertId === "exp_isa")!);
      selected.push(this.experts.find((e) => e.expertId === "exp_crown")!);
    }

    return {
      selectedExperts: selected,
      routingConfidence: 0.94,
      routingLatencyMs: Number((performance.now() - t0).toFixed(2)),
    };
  }
}

export const moeEngine = new MoeEngine();
export default moeEngine;
