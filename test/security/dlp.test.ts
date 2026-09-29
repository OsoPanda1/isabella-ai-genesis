import { describe, expect, it } from "vitest";
import { assertDlpSafe, inspectDlp } from "@/lib/dlp";

describe("application DLP", () => {
  it("detects high-confidence credentials", () => {
    expect(inspectDlp("Authorization: Bearer eyJabc1234567890.xxxxxxxxxxx.yyyyyyyyyyy").some((x) => x.type === "jwt")).toBe(true);
    expect(inspectDlp("-----BEGIN PRIVATE KEY-----").some((x) => x.type === "privateKey")).toBe(true);
    expect(inspectDlp("sk_live_12345678901234567890").some((x) => x.type === "stripeSecret")).toBe(true);
  });

  it("blocks sensitive values at the output boundary", () => {
    expect(() => assertDlpSafe({ result: "sk_live_12345678901234567890" }, "test")).toThrow("DLP_BLOCKED:test:stripeSecret");
  });

  it("allows ordinary non-sensitive application output", () => {
    expect(() => assertDlpSafe({ result: "resultado seguro", count: 42 }, "test")).not.toThrow();
  });
});
