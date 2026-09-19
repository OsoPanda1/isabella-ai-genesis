import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import path from "node:path";

const bridge = path.resolve(process.cwd(), "scripts/quantum/isabella_quantum_bridge_v5.py");

function run(payload: unknown) {
  const output = execFileSync("python3", [bridge, "--stdio"], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    timeout: 5000,
  });
  return JSON.parse(output) as Record<string, unknown>;
}

describe("Isabella Quantum Bridge v5", () => {
  it("uses an explicit classical fallback when no quantum backend is authorized", () => {
    const result = run({
      schema: "pennylane-request-v5",
      requestId: "req-test",
      tenantId: "tenant-test",
      task: "execute",
      provider: "reference",
      wires: 2,
      shots: 100,
      features: [0.1, 0.2],
      weights: [0.3, 0.4],
      scopes: ["quantum:execute"],
      nonce: "0123456789abcdef",
      timestamp: new Date().toISOString(),
    });
    expect(result.status).toBe("degraded");
    expect(result.implementation).toBe("CLASSICAL_FALLBACK");
    expect((result.fallback as Record<string, unknown>).requiresReview).toBe(true);
  });

  it("rejects unsupported schemas", () => {
    const result = run({ schema: "invalid", requestId: "req-test" });
    expect(result.status).toBe("error");
    expect((result.error as Record<string, unknown>).code).toBe("UNSUPPORTED_SCHEMA");
  });

  it("rejects non-finite numeric input", () => {
    const result = run({
      schema: "pennylane-request-v5",
      requestId: "req-test",
      tenantId: "tenant-test",
      wires: 1,
      features: ["NaN"],
      weights: [],
      scopes: ["quantum:execute"],
      nonce: "0123456789abcdef",
      timestamp: new Date().toISOString(),
    });
    expect(result.status).toBe("error");
    expect((result.error as Record<string, unknown>).code).toBe("NON_FINITE_NUMBER");
  });
});
