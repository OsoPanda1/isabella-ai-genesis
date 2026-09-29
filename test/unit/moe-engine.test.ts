import { describe, expect, it } from "vitest";
import { createMoERoute, executeMoE } from "../../src/lib/native-ml/moe-engine";

const expert = (expertId: string, value: number) => ({
  expertId,
  version: "1.0.0",
  modelHash: `sha256:${expertId}`,
  datasetId: `dataset:${expertId}`,
  datasetVersion: "1",
  license: "MIT",
  capacity: 4,
  execute: async (input: number[]) => input.map(() => value),
});

describe("governed MoE engine", () => {
  it("routes by softmax/top-k and combines selected outputs", async () => {
    const route = createMoERoute([expert("a", 1), expert("b", 3), expert("fallback", 0)], { topK: 2 });
    const result = await executeMoE(route, [1, 1], [0, 2, -5]);
    expect(result.trace.selected.map((x) => x.expertId)).toEqual(["b", "a"]);
    expect(result.output[0]).toBeGreaterThan(1);
    expect(result.trace.contributions).toHaveLength(2);
  });

  it("fails closed when expert output is invalid", async () => {
    const bad = { ...expert("bad", 1), execute: async () => [Number.NaN] };
    const route = createMoERoute([bad, expert("fallback", 0)]);
    await expect(executeMoE(route, [1], [1, 0])).rejects.toThrow("moe_expert_output_invalid");
  });
});
