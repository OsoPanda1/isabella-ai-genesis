/**
 * NCUA — pipeline soberano de 12 pasos sobre bytes y espacio continuo.
 * Cada paso produce un enlace de hash (cadena de auditoría); el resultado
 * se firma opcionalmente y se somete a: percepción nativa (sin tokens),
 * proyección latente, memoria LSH, fundamentación en grafo de conocimiento,
 * intención, heptafederación (votos + puente de atención), privacidad
 * diferencial, coherencia, redacción segura y auditoría. Conecta con la
 * política de inferencia global: en producción sin proveedor devuelve 503
 * (MAINTENANCE) sin respuesta generativa sustituta.
 */

import { createHash, randomUUID } from "node:crypto";
import { resolveInferencePolicy } from "../inference-policy";
import { encodeUtf8, decodeUtf8, chunkBytes, byteLengthOf } from "./bytes";
import { compressToLatent } from "./embed";
import { SimHashLshIndex } from "./lsh";
import { NativeIntentClassifier, seedRdmIntents } from "./intent";
import { SovereignKnowledgeGraph, seedRdmKnowledgeGraph } from "./kg";
import { PrivacyBudget } from "./privacy";
import {
  FederationController,
  FederatedAttentionBridge,
  type FederationContext,
} from "./federations";
import { measureOnCorpus, type MeasuredMetrics } from "./metrics";
import { embed } from "./embed";

export interface AuditRecord {
  step: number;
  stepName: string;
  hash: string;
  prevHash: string;
  data: unknown;
}

export interface PipelineRunOptions {
  productionLike?: boolean;
  hasProvider?: boolean;
  memoryCorpus?: Array<{ id: string; text: string }>;
  knowledgeGraph?: SovereignKnowledgeGraph;
  classifier?: NativeIntentClassifier;
  signer?: (payload: string) => string | null;
  sink?: (record: AuditRecord) => void;
  inputBytesLimit?: number;
  consensusThreshold?: number;
}

export interface PipelineRunResult {
  id: string;
  inference: ReturnType<typeof resolveInferencePolicy>;
  federations: {
    votesApproved: boolean;
    vetoActive: boolean;
    consensusScore: number;
    approveVotes: number;
  };
  attention: {
    consensusApproved: boolean;
    consensusScore: number;
    activeFederations: number;
    vetoFederations: string[];
    attentionWeighted: boolean;
  };
  memory: {
    hits: number;
    topHit: string | null;
    exact: boolean;
  };
  knowledge: {
    groundedFacts: number;
    narrative: string;
  };
  intent: {
    detected: string;
    confidence: number;
    margin: number;
  };
  privacy: {
    queriesSpent: number;
    remainingEpsilon: number;
  };
  riskDetected: boolean;
  response: string | null;
  httpStatus: number;
  chain: AuditRecord[];
  metrics: MeasuredMetrics | null;
  numberOfSteps: 12;
  signature?: string | null;
  aligned?: boolean;
  message?: string;
}

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const CARD_PATTERN = /\b(?:\d[ -]*?){13,19}\b/;
const DIRECTIVE_PATTERN =
  /(?:ignore|forget|omite|ignora|olvida)[^\n]{0,24}(?:previous|prior|above|instrucciones?)/i;

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function riskAssessment(text: string): {
  detected: boolean;
  reason: string | null;
} {
  const lower = text.toLowerCase();
  if (EMAIL_PATTERN.test(text))
    return {
      detected: true,
      reason:
        "dato personal (correo) detectado: respuesta negada; no se persiste",
    };
  if (CARD_PATTERN.test(text))
    return {
      detected: true,
      reason:
        "dato financiero (tarjeta) detectado: respuesta negada; no se persiste",
    };
  if (DIRECTIVE_PATTERN.test(lower))
    return {
      detected: true,
      reason: "posible inyección de directivas: respuesta negada",
    };
  return { detected: false, reason: null };
}

export function runNativePipeline(
  text: string,
  options: PipelineRunOptions = {},
): PipelineRunResult {
  const productionLike = options.productionLike ?? false;
  const hasProvider = options.hasProvider ?? false;
  const id = randomUUID();
  const chain: AuditRecord[] = [];
  let prevHash = "";
  const pushStep = (stepName: string, data: unknown): void => {
    const payload = JSON.stringify(data);
    const hash = sha256(payload);
    chain.push({ step: chain.length + 1, stepName, hash, prevHash, data });
    prevHash = hash;
    options.sink?.(chain[chain.length - 1] as AuditRecord);
  };

  const inputBytesLimit = options.inputBytesLimit ?? 8192;
  const perLiveEntry = byteLengthOf(text);

  const validUtf8 = decodeUtf8(encodeUtf8(text)) === text;
  pushStep("percepción", {
    id,
    inputBytes: perLiveEntry,
    withinBudget: perLiveEntry <= inputBytesLimit,
    validUtf8,
    encoding: "utf-8",
    chunks: chunkBytes(encodeUtf8(text), 32).length,
  });
  if (perLiveEntry > inputBytesLimit) {
    const inference = resolveInferencePolicy({ productionLike, hasProvider });
    const result = buildResult(
      id,
      inference,
      chain,
      options,
      null,
      "Entrada excede el presupuesto de cómputo de la federación F3.",
      413,
    );
    return result;
  }

  const vector = embed(text);
  pushStep("representación continua", {
    dim: vector.length,
    norm: magnitudeOf(vector),
  });

  const latent = compressToLatent(text, { chunkSize: 32 });
  pushStep("proyección latente", {
    latentDim: latent.latentDim,
    numChunks: latent.numChunks,
    totalBytes: latent.totalBytes,
    bytesPerChunk: latent.bytesPerChunk,
  });

  const index = new SimHashLshIndex({ dim: 192 });
  let topHit: { id: string; text: string } | null = null;
  let exact = false;
  for (const doc of options.memoryCorpus ?? []) {
    if (doc.text) index.add(doc, doc.text);
  }
  if (options.memoryCorpus?.length) {
    const hits = index.search(text, { topK: 1 });
    const hit = hits[0];
    if (hit) {
      const retrieved = index.retrieve(hit.id);
      if (retrieved?.text) topHit = { id: hit.id, text: retrieved.text };
      exact = hit.exact === true;
    }
  }
  pushStep("memoria LSH", {
    corpusSize: options.memoryCorpus?.length ?? 0,
    hits: topHit ? 1 : 0,
    exact,
  });

  const knowledgeGraph = options.knowledgeGraph ?? seedRdmKnowledgeGraph();
  const narrative = knowledgeGraph.createNarrative(text, {
    topK: 3,
    minScore: 0.2,
  });
  pushStep("fundamentación", { groundedFacts: narrative.groundedFacts });

  const classifier = options.classifier ?? seedRdmIntents();
  const prediction = classifier.predict(text);
  pushStep("intención", {
    intent: prediction.intent,
    confidence: prediction.confidence,
    margin: prediction.margin,
  });

  const controller = new FederationController({
    consensusThreshold: options.consensusThreshold ?? 0.7,
  });
  const context: FederationContext = {
    inputBytesLength: perLiveEntry,
    intent: prediction.intent,
    confidence: prediction.confidence,
    groundedFacts: narrative.groundedFacts,
    memoryHits: topHit ? 1 : 0,
    wantPrivileged: false,
    wantEgress: false,
    wantExecution: false,
    authorshipApproved: true,
    tenantBoundaryOk: true,
    principalPresent: true,
    capabilityTokenPresent: false,
    sandboxAllowed: true,
  };
  const consensus = controller.evaluate(context);
  pushStep("heptafederación", {
    votes: consensus.votes.map((vote) => ({
      id: vote.id,
      approved: vote.approved,
      veto: vote.veto,
      score: vote.score,
    })),
    approved: consensus.approved,
    vetoActive: consensus.vetoActive,
  });

  const bridge = new FederatedAttentionBridge({
    autoencoderLatentDim: vector.length,
    consensusThreshold: options.consensusThreshold ?? 0.7,
  });
  const attention = bridge.forward(latent.chunks.map((chunk) => chunk.vector));
  pushStep("atención cruzada", {
    consensusApproved: attention.consensusApproved,
    consensusScore: attention.consensusScore,
    activeFederations: Array.from(attention.activeFederations).reduce(
      (sum, value) => sum + value,
      0,
    ),
    vetoFederations: attention.vetoFederations,
  });

  const budget = new PrivacyBudget(0.5, 1e-5);
  const noisyHits = budget.noisy(context.memoryHits, 1, "laplace", 0.1);
  pushStep("privacidad", {
    queriesSpent: budget.state.queriesSpent,
    remainingEpsilon: budget.remainingEpsilon,
    noisyHits,
  });

  const memoryHitsForCoherence = topHit ? 1 : 0;
  const grounding = narrative.groundedFacts;
  const coherence =
    grounding > 0
      ? Math.min(
          1,
          (0.6 * grounding) / 3 + 0.4 * (memoryHitsForCoherence ? 1 : 0.2),
        )
      : 0.2;
  pushStep("coherencia", {
    score: coherence,
    groundedFacts: grounding,
    memoryHits: memoryHitsForCoherence,
  });

  const risk = riskAssessment(text);
  pushStep("seguridad", { riskDetected: risk.detected, reason: risk.reason });

  const inference = resolveInferencePolicy({ productionLike, hasProvider });
  let response: string | null = null;
  if (inference.mode === "MAINTENANCE") {
    response = null;
  } else if (risk.detected) {
    response =
      "La solicitud rechazada no fue procesada: " +
      (risk.reason ?? "riesgo detectado") +
      ".";
  } else if (
    attention.consensusApproved &&
    consensus.approved &&
    coherence >= 0.4
  ) {
    if (narrative.groundedFacts > 0) {
      response = narrative.text;
    } else if (topHit) {
      response = topHit.text;
    } else {
      response =
        "He procesado tu consulta en el espacio continuo sin tokens. No tengo hechos fundamentados para esta consulta concreta; puedo escalar la pregunta a un humano.";
    }
  } else {
    response =
      "Consenso federado no alcanzado o coherencia insuficiente: no generaré una respuesta sin fundamento.";
  }
  const metrics = measureOnCorpus(options.memoryCorpus ?? [], {
    chunkSize: 32,
  });
  pushStep("redacción y auditoría", {
    mode: inference.mode,
    httpStatus: inference.httpStatus,
    responded: response !== null,
    measurement: {
      corpusSize: metrics.corpusSize,
      meanFidelity: metrics.meanFidelity,
      exactRecall: metrics.exactRecall,
      bitsPerByte: metrics.bitsPerByte,
    },
  });

  const signedPayload = chain.map((record) => record.hash).join("+");
  const signature = options.signer?.(signedPayload) ?? null;

  return {
    id,
    inference,
    federations: {
      votesApproved: consensus.approved,
      vetoActive: consensus.vetoActive,
      consensusScore: consensus.score,
      approveVotes: consensus.approveVotes,
    },
    attention: {
      consensusApproved: attention.consensusApproved,
      consensusScore: attention.consensusScore,
      activeFederations: Array.from(attention.activeFederations).reduce(
        (sum, value) => sum + value,
        0,
      ),
      vetoFederations: attention.vetoFederations,
      attentionWeighted: attention.attentionWeights.length > 0,
    },
    memory: { hits: topHit ? 1 : 0, topHit: topHit?.id ?? null, exact },
    knowledge: {
      groundedFacts: narrative.groundedFacts,
      narrative: narrative.text,
    },
    intent: {
      detected: prediction.intent,
      confidence: prediction.confidence,
      margin: prediction.margin,
    },
    privacy: {
      queriesSpent: budget.state.queriesSpent,
      remainingEpsilon: budget.remainingEpsilon,
    },
    riskDetected: risk.detected,
    response,
    httpStatus: inference.httpStatus,
    chain,
    metrics,
    numberOfSteps: 12,
    signature,
    aligned: signature !== null,
  };
}

function buildResult(
  id: string,
  inference: ReturnType<typeof resolveInferencePolicy>,
  chain: AuditRecord[],
  options: PipelineRunOptions,
  response: string | null,
  message: string,
  httpStatus: number,
): PipelineRunResult {
  const metrics = measureOnCorpus(options.memoryCorpus ?? [], {
    chunkSize: 32,
  });
  return {
    id,
    inference: { ...inference, httpStatus: httpStatus as 200 | 503 },
    federations: {
      votesApproved: false,
      vetoActive: false,
      consensusScore: 0,
      approveVotes: 0,
    },
    attention: {
      consensusApproved: false,
      consensusScore: 0,
      activeFederations: 0,
      vetoFederations: [],
      attentionWeighted: false,
    },
    memory: { hits: 0, topHit: null, exact: false },
    knowledge: { groundedFacts: 0, narrative: "" },
    intent: { detected: "desconocido", confidence: 0, margin: 0 },
    privacy: { queriesSpent: 0, remainingEpsilon: 0.5 },
    riskDetected: true,
    response,
    httpStatus,
    chain,
    metrics,
    numberOfSteps: 12,
    message,
  };
}

function magnitudeOf(vector: Float64Array): number {
  let sum = 0;
  for (let index = 0; index < vector.length; index += 1) {
    const value = vector[index] as number;
    sum += value * value;
  }
  return Math.sqrt(sum);
}
