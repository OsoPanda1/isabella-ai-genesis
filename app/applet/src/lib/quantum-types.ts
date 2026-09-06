import { z } from "zod";

export const QuantumJobRequestSchema = z.object({
  jobId: z.string().uuid(),
  workloadType: z.enum(["inference", "data-processing", "model-training", "system-audit"]),
  priority: z.enum(["low", "normal", "high", "critical"]),
  tenantId: z.string(),
  actorId: z.string(),
  payload: z.record(z.unknown()),
  constraints: z.object({
    maxExecutionTimeMs: z.number().positive(),
    requiresHardwareIsolation: z.boolean(),
    dataSovereigntyZone: z.enum(["nodo-cero", "mx-central", "global-restricted"]),
  }).optional(),
});

export type QuantumJobRequest = z.infer<typeof QuantumJobRequestSchema>;

export const QuantumJobResultSchema = z.object({
  jobId: z.string().uuid(),
  status: z.enum(["success", "failed", "timeout", "rejected"]),
  output: z.record(z.unknown()).optional(),
  error: z.string().optional(),
  executionMetrics: z.object({
    durationMs: z.number(),
    memoryUsedMb: z.number().optional(),
  }),
  auditHash: z.string().optional(),
});

export type QuantumJobResult = z.infer<typeof QuantumJobResultSchema>;
