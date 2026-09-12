import { describe, expect, it } from "vitest";
import { trainBinaryClassifier } from "@/lib/native-ml";

describe("native ML governance", () => {
  it("trains deterministically and requires explicit approval", async () => {
    const dataset = {
      datasetId: "d1",
      version: "1",
      territoryId: "mx-01",
      source: "test",
      license: "MIT",
      schemaHash: "schema",
      contentHash: "content",
      createdAt: new Date().toISOString(),
    };
    const input = {
      dataset,
      features: [[0], [1], [2], [3]],
      labels: [0, 0, 1, 1],
    };
    const a = await trainBinaryClassifier(input, "owner", "mx-01");
    const b = await trainBinaryClassifier(input, "owner", "mx-01");
    expect(a.trainingHash).toBe(b.trainingHash);
    expect(a.approvalRequired).toBe(true);
    expect(a.model.approvalStatus).toBe("PENDING_REVIEW");
  });

  it("honors the governance hook", async () => {
    await expect(
      trainBinaryClassifier(
        {
          dataset: {
            datasetId: "d",
            version: "1",
            territoryId: "mx",
            source: "t",
            license: "MIT",
            schemaHash: "s",
            contentHash: "c",
            createdAt: new Date().toISOString(),
          },
          features: [[0], [1]],
          labels: [0, 1],
        },
        "owner",
        "mx",
        {
          authorize: () => ({
            decision: "DENY",
            riskScore: 1,
            policyIds: ["P0"],
            reasons: ["blocked"],
          }),
        },
      ),
    ).rejects.toThrow("native_ml_deny");
  });
});
