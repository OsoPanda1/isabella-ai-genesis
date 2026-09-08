import { describe, expect, it } from "vitest";
import { IsabellaNativeMLEngine } from "./engine";

describe("Isabella Native ML", () => {
  it("trains deterministically and requires approval", async () => {
    const engine = new IsabellaNativeMLEngine({ territoryId: "test-territory", deterministic: true });
    const trained = await engine.fitClassification([[0], [1], [2], [3]], [0, 0, 1, 1], "dataset-v1", "logistic_sgd", 40, 0.1);
    expect(trained.model.approvalStatus).toBe("PENDING_REVIEW");
    expect(trained.metrics.accuracy).toBeGreaterThanOrEqual(0.75);
    expect(() => engine.predict(trained.model.modelId, [[2]])).toThrow(/no aprobado/i);
    engine.approve(trained.model.modelId);
    const prediction = await engine.predict(trained.model.modelId, [[2], [0]]);
    expect(prediction.predictions).toHaveLength(2);
    expect(prediction.explanation.method).toBe("linear_logit");
  });

  it("blocks CROWN denial", async () => {
    const engine = new IsabellaNativeMLEngine({
      territoryId: "test-territory",
      hooks: { authorize: () => ({ decision: "DENY", riskScore: 1, policyIds: ["test"], reasons: ["blocked"] }) },
    });
    await expect(engine.fitClassification([[0], [1]], [0, 1], "dataset-v1")).rejects.toThrow(/CROWN DENY/);
  });

  it("aggregates federated updates by sample count", () => {
    const updates = [
      { updateId: "a", nodeId: "a", territoryId: "a", modelId: "m", baseModelVersion: "v1", deltaWeights: [1, 2], deltaBias: 1, sampleCount: 1, metrics: { loss: 0.2 }, updateHash: "ha", signature: "sa", createdAt: new Date().toISOString() },
      { updateId: "b", nodeId: "b", territoryId: "b", modelId: "m", baseModelVersion: "v1", deltaWeights: [3, 4], deltaBias: 3, sampleCount: 3, metrics: { loss: 0.1 }, updateHash: "hb", signature: "sb", createdAt: new Date().toISOString() },
    ];
    const round = IsabellaNativeMLEngine.aggregateFedAvg(updates, "m", "v1");
    expect(round.status).toBe("COMMITTED");
    expect(round.participants).toEqual(["a", "b"]);
    expect(round.nextVersion).toBe("v1-fedavg");
  });
});
