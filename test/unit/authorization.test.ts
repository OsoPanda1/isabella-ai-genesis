import { describe, expect, it } from "vitest";
import { evaluateAuthorization } from "@/lib/authorization";

const base = {
  tenant_id: "tenant-a",
  subject_id: "user-a",
  action: "execute",
  resource: "tool",
  role: "Operator",
  authenticated: true,
  context: {
    ip_address: "127.0.0.1",
    user_agent: "vitest",
    timestamp: new Date(),
  },
};

describe("Authorization PDP", () => {
  it("denies missing identity", async () => {
    const decision = await evaluateAuthorization({ ...base, subject_id: "" });
    expect(decision.allow).toBe(false);
    expect(decision.obligations.join(" ")).toContain("missing-identity");
  });

  it("denies unauthenticated principals", async () => {
    const decision = await evaluateAuthorization({ ...base, authenticated: false });
    expect(decision.allow).toBe(false);
  });

  it("denies unknown roles and operations", async () => {
    const unknownRole = await evaluateAuthorization({ ...base, role: "root" });
    const unknownAction = await evaluateAuthorization({ ...base, action: "delete" });
    expect(unknownRole.allow).toBe(false);
    expect(unknownAction.allow).toBe(false);
  });

  it("allows a scoped read for an authenticated operator", async () => {
    const decision = await evaluateAuthorization(base);
    expect(decision.allow).toBe(true);
    expect(decision.tenant_id).toBe(base.tenant_id);
    expect(decision.subject_id).toBe(base.subject_id);
    expect(decision.signature).toBeTruthy();
  });

  it("fails closed on behavioral anomaly", async () => {
    const decision = await evaluateAuthorization({
      ...base,
      context: { ...base.context, behavior_score: 99 },
    });
    expect(decision.allow).toBe(false);
  });
});

export {};
