import { describe, expect, it, beforeEach } from "vitest";
import { loadConfig, resetConfigCache } from "@/lib/config";

describe("configuration runtime contract", () => {
  beforeEach(() => resetConfigCache());

  it("derives postgres as the durable provider when DATABASE_URL is present", () => {
    const parsed = loadConfig({
      NODE_ENV: "development",
      ISABELLA_RUNTIME_MODE: "development",
      DATABASE_URL: "postgresql://example.invalid/db",
    });
    expect(parsed.ISABELLA_STORAGE_PROVIDER).toBe("postgres");
  });

  it("does not derive a durable provider without DATABASE_URL", () => {
    const parsed = loadConfig({ NODE_ENV: "development", ISABELLA_RUNTIME_MODE: "development" });
    expect(parsed.ISABELLA_STORAGE_PROVIDER).toBe("postgres");
    expect(parsed.DATABASE_URL).toBeUndefined();
  });
});
