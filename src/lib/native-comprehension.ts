/**
 * NCUA — comprensión nativa conectada al runtime.
 *
 * Envuelve el pipeline soberano de 12 pasos con el contexto del tenant,
 * medición de latencia y un resumen auditable (hash de cadena). La
 * comprensión nativa nunca sustituye inferencia generativa: la política
 * de inferencia se mantiene en src/lib/inference-policy.ts (fail-closed
 * 503 en producción sin proveedor, sin respuesta generativa sustituta).
 */
import { createHash } from "node:crypto";
import { config } from "@/lib/config";
import { runNativePipeline } from "@/lib/ncua/pipeline";

export interface NativeComprehensionInput {
  input: string;
  tenantId: string;
  traceId: string;
  memoryCorpus?: Array<{ id: string; text: string }>;
}

export interface NativeComprehensionOutput {
  ok: boolean;
  id: string;
  inferenceMode: "PRODUCTION_NORMAL" | "MAINTENANCE" | "NATIVE_DECLARED";
  intent: { detected: string; confidence: number; margin: number };
  federations: {
    votesApproved: boolean;
    vetoActive: boolean;
    consensusScore: number;
  };
  attention: {
    consensusApproved: boolean;
    consensusScore: number;
    activeFederations: number;
  };
  knowledge: { groundedFacts: number };
  memory: { hits: number; topHit: string | null };
  riskDetected: boolean;
  latencyMs: number;
  chainHash: string;
}

export function runNativeComprehension(input: NativeComprehensionInput): NativeComprehensionOutput {
  const runtime = config();
  const mode = runtime.ISABELLA_RUNTIME_MODE;
  const productionLike =
    runtime.NODE_ENV === "production" || mode === "production" || mode === "staging";
  const started = performance.now();
  const result = runNativePipeline(input.input, {
    productionLike,
    hasProvider: Boolean(runtime.GEMINI_API_KEY),
    memoryCorpus: input.memoryCorpus,
  });
  const latencyMs = Number((performance.now() - started).toFixed(1));
  const chainHash = createHash("sha256")
    .update(result.chain.map((record) => record.hash).join("+"))
    .digest("hex");
  return {
    ok: result.httpStatus === 200 && result.inference.mode !== "MAINTENANCE",
    id: result.id,
    inferenceMode: result.inference.mode,
    intent: { ...result.intent },
    federations: {
      votesApproved: result.federations.votesApproved,
      vetoActive: result.federations.vetoActive,
      consensusScore: result.federations.consensusScore,
    },
    attention: {
      consensusApproved: result.attention.consensusApproved,
      consensusScore: result.attention.consensusScore,
      activeFederations: result.attention.activeFederations,
    },
    knowledge: { groundedFacts: result.knowledge.groundedFacts },
    memory: { hits: result.memory.hits, topHit: result.memory.topHit },
    riskDetected: result.riskDetected,
    latencyMs,
    chainHash,
  };
}
