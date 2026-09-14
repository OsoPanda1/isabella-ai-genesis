import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { AionRecoveryPlan } from "./argus-aion";

export interface RecoveryAttestation {
  nodeId: string;
  planId: string;
  planDigest: string;
  epoch: string;
  attestedAt: string;
  signature: string;
}

export interface RecoveryMeshResult {
  accepted: boolean;
  reason: "QUORUM_REACHED" | "INSUFFICIENT_ATTESTATIONS" | "INVALID_ATTESTATION" | "EPOCH_MISMATCH" | "REPLAYED_PLAN";
  acceptedNodeIds: string[];
}

export interface RecoveryMeshConfig {
  quorum?: number;
  maxClockSkewMs?: number;
}

function hmac(secret: string, value: unknown): string {
  return createHmac("sha256", secret).update(JSON.stringify(value)).digest("hex");
}

function safeEqualHex(left: string, right: string): boolean {
  if (!/^[a-f0-9]{64}$/u.test(left) || !/^[a-f0-9]{64}$/u.test(right)) return false;
  return timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

/** A deterministic epoch bound to one exact recovery plan and checkpoint. */
export function deriveRecoveryEpoch(plan: AionRecoveryPlan): string {
  return createHash("sha256")
    .update(`${plan.planId}:${plan.planDigest}:${plan.targetCheckpoint.sequence}`)
    .digest("hex")
    .slice(0, 32);
}

/**
 * Recovery mesh validates node attestations against an exact recovery plan.
 * It deliberately has no infrastructure restart capability; callers receive a
 * boolean authorization result and must route any mutation through a separate
 * execution authority.
 */
export class ArgusRecoveryMesh {
  private readonly quorum: number;
  private readonly maxClockSkewMs: number;
  private readonly consumedPlanIds = new Set<string>();

  constructor(config: RecoveryMeshConfig = {}) {
    this.quorum = Math.max(2, Math.min(16, config.quorum ?? 2));
    this.maxClockSkewMs = Math.max(1_000, Math.min(300_000, config.maxClockSkewMs ?? 30_000));
  }

  static signAttestation(
    secret: string,
    input: Omit<RecoveryAttestation, "signature">,
  ): RecoveryAttestation {
    if (secret.length < 32) throw new Error("recovery_mesh_secret_too_short");
    return { ...input, signature: hmac(secret, input) };
  }

  verifyAndAuthorize(
    plan: AionRecoveryPlan,
    attestations: readonly RecoveryAttestation[],
    nodeSecrets: ReadonlyMap<string, string>,
    epoch: string,
    now = Date.now(),
  ): RecoveryMeshResult {
    if (this.consumedPlanIds.has(plan.planId))
      return { accepted: false, reason: "REPLAYED_PLAN", acceptedNodeIds: [] };
    if (epoch !== deriveRecoveryEpoch(plan))
      return { accepted: false, reason: "EPOCH_MISMATCH", acceptedNodeIds: [] };

    const allowed = new Set(plan.requiredNodeIds);
    const acceptedNodeIds = new Set<string>();
    let sawInvalid = false;
    for (const attestation of attestations) {
      if (!allowed.has(attestation.nodeId) || acceptedNodeIds.has(attestation.nodeId)) {
        sawInvalid = true;
        continue;
      }
      if (attestation.planId !== plan.planId || attestation.planDigest !== plan.planDigest || attestation.epoch !== epoch) {
        sawInvalid = true;
        continue;
      }
      const timestamp = Date.parse(attestation.attestedAt);
      if (!Number.isFinite(timestamp) || Math.abs(now - timestamp) > this.maxClockSkewMs) {
        sawInvalid = true;
        continue;
      }
      const secret = nodeSecrets.get(attestation.nodeId);
      if (!secret || secret.length < 32) {
        sawInvalid = true;
        continue;
      }
      const unsigned = {
        nodeId: attestation.nodeId,
        planId: attestation.planId,
        planDigest: attestation.planDigest,
        epoch: attestation.epoch,
        attestedAt: attestation.attestedAt,
      };
      const expected = hmac(secret, unsigned);
      if (safeEqualHex(expected, attestation.signature)) acceptedNodeIds.add(attestation.nodeId);
      else sawInvalid = true;
    }

    if (acceptedNodeIds.size < this.quorum)
      return { accepted: false, reason: sawInvalid ? "INVALID_ATTESTATION" : "INSUFFICIENT_ATTESTATIONS", acceptedNodeIds: [...acceptedNodeIds].sort() };

    this.consumedPlanIds.add(plan.planId);
    return { accepted: true, reason: "QUORUM_REACHED", acceptedNodeIds: [...acceptedNodeIds].sort() };
  }
}
