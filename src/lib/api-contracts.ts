import { z } from "zod";
import {
  CognitiveProcessSchema,
  ImageGenSchema,
  TTSSchema,
} from "./gemini-validator";

export { CognitiveProcessSchema, ImageGenSchema, TTSSchema };

export const PerceptionInputSchema = z.object({
  sessionId: z.string().min(1).max(256).optional(),
  actorId: z.string().min(1).max(256).optional(),
  territoryId: z.string().min(1).max(256).optional(),
  inputType: z.string().min(1).max(64).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
  text: z.string().max(50_000).optional(),
  timestamp: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export const AgentLeaseSchema = z.object({
  leaseDurationMinutes: z.number().int().min(1).max(1_440).optional(),
  systemInstructions: z.string().max(8_000).optional(),
  activePreset: z.string().max(128).optional(),
  primaryModel: z.string().max(256).optional(),
});

export const AgentChatSchema = z.object({
  sessionId: z.string().min(1).max(256),
  prompt: z.string().min(1).max(50_000),
  contextPayload: z.record(z.string(), z.unknown()).optional().default({}),
});

export const IdlenClickSchema = z.object({
  placement: z.string().min(1).max(128),
  campaignId: z.string().max(256).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export const CheckoutSchema = z.object({
  planId: z.string().min(1).max(128).optional(),
  plan: z.string().min(1).max(128).optional(),
}).passthrough();

export const QuantumExecuteSchema = z.object({
  provider: z.string().max(256).optional(),
  repository: z.string().max(512).optional(),
  mode: z.string().max(128).optional(),
  wires: z.number().int().min(1).max(64).optional(),
  shots: z.number().int().min(1).max(1_000_000).nullable().optional(),
  features: z.array(z.number().finite()).max(10_000).optional(),
  weights: z.array(z.number().finite()).max(10_000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export function validateBody<T extends z.ZodTypeAny>(schema: T, req: { body?: unknown }, res: { status: (code: number) => { json: (body: unknown) => unknown } }): z.infer<T> | null {
  const result = schema.safeParse(req.body);
  if (result.success) return result.data;
  res.status(400).json({ ok: false, error: "Invalid request body", issues: result.error.issues });
  return null;
}

/**
 * ISA-API Contract Authority (v3.2 Hardened)
 * -----------------------------------------------------------------
 * Fuente de verdad ejecutable para envelopes y payloads API compartidos.
 * Los endpoints de Isabella deben reutilizar estas definiciones.
 */

export const MetaSchema = z.object({
  request_id: z.string().uuid(),
  trace_id: z.string().min(1),
  decision_id: z.string().nullable().optional(),
  api_version: z.string().min(1),
  tenant_id: z.string().optional(),
  timestamp: z.string().datetime(),
});

export const ErrorPayloadSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  correlation_id: z.string().min(1),
  retryable: z.boolean(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const StandardResponseSchema = z.object({
  meta: MetaSchema,
  data: z.unknown().nullable(),
  error: ErrorPayloadSchema.nullable(),
});

export type StandardResponse = z.infer<typeof StandardResponseSchema>;
export type ErrorPayload = z.infer<typeof ErrorPayloadSchema>;

export const IsabellaChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.union([
    z.string().min(1).max(12000),
    z
      .array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("text"),
            text: z.string().min(1).max(12000),
          }),
          z.object({
            type: z.literal("image_url"),
            image_url: z.object({ url: z.string().max(11_000_000) }),
          }),
          z.object({
            type: z.literal("input_audio"),
            input_audio: z.object({
              data: z.string().max(11_000_000),
              format: z.enum(["m4a", "ogg", "wav", "mp3", "webm"]),
            }),
          }),
        ]),
      )
      .max(10),
  ]),
});

export const IsabellaChatRequestSchema = z.object({
  system: z.string().max(8000).optional(),
  temperature: z.number().finite().min(0).max(2).default(0.8),
  messages: z.array(IsabellaChatMessageSchema).min(1).max(40),
  context: z.record(z.string(), z.unknown()).optional(),
});

export type IsabellaChatRequest = z.infer<typeof IsabellaChatRequestSchema>;

export const IsabellaChatErrorCode = {
  INVALID_JSON: "INVALID_JSON",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
  AUTHORIZATION_DENIED: "AUTHORIZATION_DENIED",
  TENANT_MISMATCH: "TENANT_MISMATCH",
  RATE_LIMITED: "RATE_LIMITED",
  TIMEOUT: "TIMEOUT",
  PROVIDER_UNAVAILABLE: "PROVIDER_UNAVAILABLE",
  INFERENCE_UNAVAILABLE: "INFERENCE_UNAVAILABLE",
  KILL_SWITCH_ACTIVE: "KILL_SWITCH_ACTIVE",
  POLICY_REJECTED: "POLICY_REJECTED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export function standardError(
  code: string,
  message: string,
  requestId: string,
  traceId: string,
  options: {
    status: number;
    retryable?: boolean;
    tenantId?: string;
    details?: Record<string, unknown>;
  },
): Response {
  const body: StandardResponse = {
    meta: {
      request_id: requestId,
      trace_id: traceId,
      api_version: "3.2.0",
      ...(options.tenantId ? { tenant_id: options.tenantId } : {}),
      timestamp: new Date().toISOString(),
    },
    data: null,
    error: {
      code,
      message,
      correlation_id: requestId,
      retryable: options.retryable ?? false,
      ...(options.details ? { details: options.details } : {}),
    },
  };
  return new Response(JSON.stringify(body), {
    status: options.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const AtlasInputSchema = z.object({
  scenario: z.string().min(5).max(1000),
  variables: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        currentValue: z.number(),
        projectedChange: z.number(),
        weight: z.number().min(0).max(1),
      }),
    )
    .min(1)
    .max(50),
});
export const AnubisInputSchema = z.object({
  artifactId: z.string().min(3).max(128),
  content: z.string().min(1).max(500000),
  expectedHash: z.string().max(128).optional(),
});
export const ThemisInputSchema = z.object({
  decisionId: z.string().min(1).max(128),
  decision: z.string().min(1).max(2000),
  evidence: z
    .array(
      z.object({
        id: z.string(),
        source: z.string(),
        excerpt: z.string(),
        score: z.number().min(0).max(1),
      }),
    )
    .max(100),
  events: z.array(z.record(z.string(), z.unknown())).optional(),
});
export const VigiaInputSchema = z.object({
  text: z.string().min(1).max(100000),
  riskSignals: z.array(z.string()).optional(),
});
export const GenericSkillInputSchema = z
  .record(z.string(), z.unknown())
  .refine((data) => Object.keys(data).length > 0, {
    message: "El payload de entrada no puede estar vacío.",
  });

export function validateSkillInput(skillId: string, payload: unknown): unknown {
  try {
    switch (skillId.toUpperCase()) {
      case "ATLAS":
        return AtlasInputSchema.parse(payload);
      case "ANUBIS":
        return AnubisInputSchema.parse(payload);
      case "THEMIS":
        return ThemisInputSchema.parse(payload);
      case "VIGIA":
        return VigiaInputSchema.parse(payload);
      default:
        return GenericSkillInputSchema.parse(payload);
    }
  } catch (error) {
    if (error instanceof z.ZodError)
      throw new Error(
        `Validation failed for skill ${skillId}: ${error.issues.map((e) => e.message).join(", ")}`,
      );
    throw error;
  }
}

export function validateSkillOutput(skillId: string, output: unknown): unknown {
  if (!output || typeof output !== "object")
    throw new Error(`Skill ${skillId} devolvió una salida inválida.`);
  const jsonString = JSON.stringify(output);
  if (/(sk_live_|pk_live_|sk_test_|pk_test_|AIza[0-9A-Za-z-_]{35})/.test(jsonString))
    throw new Error(
      `[CRITICAL] Data Exfiltration Blocked: La salida del skill ${skillId} contiene posibles secretos.`,
    );
  return output;
}
