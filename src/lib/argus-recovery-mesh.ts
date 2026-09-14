import { createHmac, createHash, timingSafeEqual } from "node:crypto";

export interface RecoveryPlan {
  planId: string;
  planDigest: string;
  targetCheckpoint: { sequence: number; digest: string };
  expiresAt: number;
  quorum: number;
  authorizedNodes: readonly string[];
}

export interface NodeAttestation {
  nodeId: string;
  planId: string;
  epoch: string;
  signature: string;
}

export function deriveRecoveryEpoch(plan: RecoveryPlan): string {
  return createHash("sha256")
    .update(
      `${plan.planId}:${plan.planDigest}:${plan.targetCheckpoint.sequence}:${plan.targetCheckpoint.digest}`,
    )
    .digest("hex");
}

function sign(epoch: string, nodeId: string, secret: string): string {
  return createHmac("sha256", secret).update(`${epoch}:${nodeId}`).digest("hex");
}

export function createNodeAttestation(
  plan: RecoveryPlan,
  nodeId: string,
  secret: string,
  now = Date.now(),
): NodeAttestation {
  if (!plan.authorizedNodes.includes(nodeId) || now > plan.expiresAt)
    throw new Error("RECOVERY_PLAN_INVALID");
  return {
    nodeId,
    planId: plan.planId,
    epoch: deriveRecoveryEpoch(plan),
    signature: sign(deriveRecoveryEpoch(plan), nodeId, secret),
  };
}

export class ArgusRecoveryMesh {
  private readonly consumed = new Set<string>();
  constructor(private readonly secretByNode: ReadonlyMap<string, string>) {}

  verify(
    plan: RecoveryPlan,
    attestations: readonly NodeAttestation[],
    now = Date.now(),
  ): { approved: boolean; reason: string; epoch: string } {
    const epoch = deriveRecoveryEpoch(plan);
    if (
      !/^([a-f0-9]{64})$/.test(plan.planDigest) ||
      !/^([a-f0-9]{64})$/.test(plan.targetCheckpoint.digest)
    )
      return { approved: false, reason: "INVALID_DIGEST", epoch };
    if (now > plan.expiresAt || plan.quorum < 1 || plan.quorum > plan.authorizedNodes.length)
      return { approved: false, reason: "PLAN_EXPIRED_OR_QUORUM_INVALID", epoch };
    if (this.consumed.has(plan.planId)) return { approved: false, reason: "REPLAY", epoch };

    const valid = new Set<string>();
    for (const attestation of attestations) {
      if (
        attestation.planId !== plan.planId ||
        attestation.epoch !== epoch ||
        valid.has(attestation.nodeId) ||
        !plan.authorizedNodes.includes(attestation.nodeId)
      )
        continue;
      const secret = this.secretByNode.get(attestation.nodeId);
      if (!secret || !/^[a-f0-9]{64}$/.test(attestation.signature)) continue;
      const expected = Buffer.from(sign(epoch, attestation.nodeId, secret), "utf8");
      const received = Buffer.from(attestation.signature, "utf8");
      if (expected.length === received.length && timingSafeEqual(expected, received))
        valid.add(attestation.nodeId);
    }
    if (valid.size < plan.quorum) return { approved: false, reason: "QUORUM_NOT_REACHED", epoch };
    this.consumed.add(plan.planId);
    return { approved: true, reason: "QUORUM_APPROVED", epoch };
  }
}
