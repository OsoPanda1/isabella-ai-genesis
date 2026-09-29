/**
 * Tests: Native subscription persistence and money-flow safety
 *
 * The quota engine must keep its public semantics regardless of the
 * backend (SQLite vs memory), and consumption must persist so daily
 * quotas survive restarts instead of resetting on redeploy.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { getSubscriptionStore, resetSubscriptionStore } from "../src/lib/persistence/subscription-store";
import { consumeUsage, evaluateUsage, getUserPlan, getUsage, setUserPlan } from "../src/lib/subscription.server";

beforeEach(() => {
  process.env.ISABELLA_PERSISTENCE = "memory";
  resetSubscriptionStore();
});

describe("subscription store semantics", () => {
  it("round-trips usage buckets", () => {
    const store = getSubscriptionStore();
    expect(store.getBucket("u1", "2026-08-23")).toBeNull();
    store.saveBucket({ userId: "u1", dayKey: "2026-08-23", messages: 3, images: 1, voiceSeconds: 40, agentSessions: 0, updatedAt: "t" });
    const bucket = store.getBucket("u1", "2026-08-23");
    expect(bucket?.messages).toBe(3);
    expect(bucket?.voiceSeconds).toBe(40);
  });

  it("isolates buckets per day", () => {
    const store = getSubscriptionStore();
    store.saveBucket({ userId: "u1", dayKey: "d1", messages: 2, images: 0, voiceSeconds: 0, agentSessions: 0, updatedAt: "t" });
    expect(store.getBucket("u1", "d2")).toBeNull();
  });

  it("round-trips plan assignments", () => {
    const store = getSubscriptionStore();
    expect(store.getPlan("u9")).toBeNull();
    store.savePlan("u9", "premium");
    expect(store.getPlan("u9")).toBe("premium");
    store.savePlan("u9", "plus");
    expect(store.getPlan("u9")).toBe("plus");
  });
});

describe("engine persists consumption", () => {
  it("consumeUsage changes survive re-reads", async () => {
    const before = await getUsage("persistence-user");
    expect(before.messages).toBe(0);
    await consumeUsage("persistence-user", "chat", 2);
    expect((await getUsage("persistence-user")).messages).toBe(2);
    await consumeUsage("persistence-user", "chat", 3);
    expect((await getUsage("persistence-user")).messages).toBe(5);
  });

  it("evaluateUsage never mutates stored state", async () => {
    await consumeUsage("eval-user", "chat", 2);
    await evaluateUsage("eval-user", "chat", 1000);
    expect((await getUsage("eval-user")).messages).toBe(2);
  });

  it("plan upgrades apply immediately across reads", async () => {
    expect((await import("../src/lib/subscription.server")).getUserPlanAsync("upgrade-user")).resolves.toMatchObject({ id: "free" });
    await import("../src/lib/persistence/subscription-store").then(({ saveSubscriptionPlan }) => saveSubscriptionPlan("upgrade-user", "vip"));
    await expect((await import("../src/lib/subscription.server")).getUserPlanAsync("upgrade-user")).resolves.toMatchObject({ id: "vip" });
  });

  it("quota exhaustion blocks with an upgrade signal", async () => {
    const user = "quota-bound-user";
    let decision = await consumeUsage(user, "chat", 30, "free");
    expect(decision.allowed).toBe(false);
    expect(decision.upgradeRequired).toBe(true);
    decision = await consumeUsage(user, "chat", 25, "free");
    expect(decision.allowed).toBe(true);
    expect((await getUsage(user)).messages).toBe(25);
  });
});
