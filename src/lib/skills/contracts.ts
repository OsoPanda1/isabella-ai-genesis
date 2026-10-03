/**
 * Skill Contracts (src/lib/skills/contracts.ts)
 */
export interface SkillInvocationRequest {
  skillId: string;
  parameters: Record<string, unknown>;
  tenantId: string;
  userId: string;
  traceId?: string;
}

export interface SkillInvocationResult {
  success: boolean;
  result?: unknown;
  error?: string;
  durationMs: number;
}
