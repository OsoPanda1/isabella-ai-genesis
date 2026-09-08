import { describe, expect, it } from "vitest";
import { governIntelligence } from "@/lib/intelligence/router";
import { evaluateModelRelease } from "@/lib/genesis-model/release-gate";
import { aggregateFedAvg, validateFederatedUpdate } from "@/lib/learning/federation";
import { hashObject } from "@/lib/learning/registry";

const updateBase = { updateId: "u1", nodeId: "n1", modelId: "m1", baseModelVersion: "1", deltaWeights: [1, 2], deltaBias: 0.5, sampleCount: 10, createdAt: new Date().toISOString() };

function signedUpdate(secret: string) {
  const updateHash = hashObject(updateBase);
  const signature = hashObject(`${secret}:${updateHash}`);
  return { ...updateBase, updateHash, signature };
}

describe("FGAIS integration gates", () => {
  it("denies requests without tenant or actor", () => {
    expect(governIntelligence({ requestId: "r", tenantId: "", actorId: "a", messages: [{ role: "user", content: "x" }] }).decision).toBe("DENY");
  });

  it("requires all evidence for model release", () => {
    expect(evaluateModelRelease({ modelId: "m", version: "1", artifactHash: "a", manifestHash: "b", evidenceId: "e", modelApproved: true, evaluationPassed: true, securityPassed: true, provenanceComplete: true, humanApproval: true }).allowed).toBe(true);
    expect(evaluateModelRelease({ modelId: "m", version: "1", artifactHash: "", manifestHash: "b", evidenceId: "e", modelApproved: true, evaluationPassed: true, securityPassed: true, provenanceComplete: true, humanApproval: true }).allowed).toBe(false);
  });

  it("validates signed federation updates and rejects tampering", () => {
    const update = signedUpdate("secret");
    expect(validateFederatedUpdate(update, "secret").allowed).toBe(true);
    expect(validateFederatedUpdate({ ...update, deltaBias: 99 }, "secret").allowed).toBe(false);
  });

  it("aggregates updates by sample-weighted FedAvg", () => {
    const a = signedUpdate("secret");
    const b = { ...signedUpdate("secret"), updateId: "u2", deltaWeights: [3, 4], sampleCount: 30 };
    expect(aggregateFedAvg([a, b]).deltaWeights).toEqual([2.5, 3.5]);
  });
});
