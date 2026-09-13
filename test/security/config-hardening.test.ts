import { describe, expect, it, beforeEach } from "vitest";
import { envSchema } from "@/lib/env-schema";
import { canUseGuestChat, isExplicitDevelopmentAuth } from "@/lib/principal-context";
import { loadConfig, resetConfigCache } from "@/lib/config";

describe("configuration hardening", () => {
  beforeEach(() => {
    resetConfigCache();
  });

  it("rejects malformed runtime modes instead of normalizing them", () => {
    const result = envSchema.safeParse({ ISABELLA_RUNTIME_MODE: "== development" });
    expect(result.success).toBe(false);
  });

  it("requires explicit and authoritative development guest configuration", () => {
    expect(
      canUseGuestChat({
        ALLOW_GUEST_CHAT: true,
        NODE_ENV: "development",
        ISABELLA_RUNTIME_MODE: "production",
      }),
    ).toBe(false);
    expect(
      canUseGuestChat({
        ALLOW_GUEST_CHAT: true,
        NODE_ENV: "production",
        ISABELLA_RUNTIME_MODE: "development",
      }),
    ).toBe(false);
    expect(
      canUseGuestChat({
        ALLOW_GUEST_CHAT: true,
        NODE_ENV: "development",
        ISABELLA_RUNTIME_MODE: "development",
      }),
    ).toBe(true);
  });

  it("requires all three development-auth conditions", () => {
    expect(
      isExplicitDevelopmentAuth({
        NODE_ENV: "development",
        ISABELLA_RUNTIME_MODE: "development",
        AUTH_DEV_SESSION_ENABLED: true,
      }),
    ).toBe(true);
    expect(
      isExplicitDevelopmentAuth({
        NODE_ENV: "development",
        ISABELLA_RUNTIME_MODE: "production",
        AUTH_DEV_SESSION_ENABLED: true,
      }),
    ).toBe(false);
  });

  it("fails closed when staging has no explicit storage provider", () => {
    expect(() =>
      loadConfig({
        NODE_ENV: "production",
        ISABELLA_RUNTIME_MODE: "staging",
        PUBLIC_URL: "https://example.invalid",
      }),
    ).toThrow();
  });
});
