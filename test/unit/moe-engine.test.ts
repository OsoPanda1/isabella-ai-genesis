import { describe, expect, it } from "vitest";
import { createMoERoute, executeMoE } from "@/lib/native-ml/moe-engine";

const expert = (expertId: string, bias: number) => ({
  expertId,
  version: "1.0.0",
  modelHash: `${expertId}-sha256`,
  datasetId: "synthetic-test",
  datasetVersion: "1",
  license: "internal-test",
  capacity: 1,
  execute: (input: number[]) => input.map((value) => value + bias),
});

describe("governed MoE runtime", () => {
  it("routes top-k experts and combines finite outputs", async () => {
    const route = createMoERoute([expert("alpha", 1), expert("beta", 3)], { topK: 2 });
    const result = await executeMoE(route, [1, 2], [2, 1]);

    expect(result.output).toHaveLength(2);
    expect(result.output.every(Number.isFinite)).toBe(true);
    expect(result.trace.selected.map(({ expertId }) => expertId)).toEqual(["alpha", "beta"]);
    expect(result.trace.fallbackUsed).toBe(false);
  });

  it("fails closed when capacity is exhausted without fallback", async () => {
    const route = createMoERoute([expert("alpha", 1)], { topK: 1, capacityFactor: 0.1 });
    await expect(executeMoE(route, [1], [1])).resolves.toMatchObject({
      trace: { fallbackUsed: false },
    });
  });

  it("rejects malformed expert output", async () => {
    const invalid = { ...expert("invalid", 0), execute: () => [Number.NaN] };
    const route = createMoERoute([invalid]);

    await expect(executeMoE(route, [1], [1])).rejects.toThrow("moe_expert_output_invalid:invalid");
  });
});

it("keeps artifact metadata mandatory", () => {
  expect(() => createMoERoute([{ ...expert("x", 0), modelHash: "" }])).toThrow(
    "moe_expert_artifact_invalid:x",
  );
});
