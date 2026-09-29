import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyWebhookSignature } from "@/lib/connectors/webhook-verification";

function makeLinearRequest(secret: string, body: string): Headers {
  const signature = createHmac("sha256", secret).update(body, "utf8").digest("hex");
  const headers = new Headers();
  headers.set("linear-signature", signature);
  headers.set("linear-delivery", "11111111-1111-4111-8111-111111111111");
  headers.set("linear-timestamp", "1700000000000");
  return headers;
}

describe("Linear webhook verification", () => {
  it("accepts a valid HMAC over the raw body within the replay window", () => {
    const secret = "test-secret";
    const body = JSON.stringify({ webhookTimestamp: 1700000000000, type: "Issue", data: {} });
    const result = verifyWebhookSignature({
      provider: "linear",
      rawBody: body,
      byteLength: Buffer.byteLength(body),
      headers: makeLinearRequest(secret, body),
      secret,
      nowSeconds: 1700000000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.scheme).toBe("hmac-sha256-linear");
  });

  it("rejects an altered payload", () => {
    const secret = "test-secret";
    const original = JSON.stringify({ webhookTimestamp: 1700000000000, type: "Issue", data: {} });
    const altered = JSON.stringify({ webhookTimestamp: 1700000000000, type: "Issue", data: { id: "tampered" } });
    const result = verifyWebhookSignature({
      provider: "linear",
      rawBody: altered,
      byteLength: Buffer.byteLength(altered),
      headers: makeLinearRequest(secret, original),
      secret,
      nowSeconds: 1700000000,
    });
    expect(result).toEqual({ ok: false, code: "WEBHOOK_SIGNATURE_INVALID" });
  });

  it("rejects stale deliveries", () => {
    const secret = "test-secret";
    const body = JSON.stringify({ webhookTimestamp: 1700000000000, type: "Issue", data: {} });
    const result = verifyWebhookSignature({
      provider: "linear",
      rawBody: body,
      byteLength: Buffer.byteLength(body),
      headers: makeLinearRequest(secret, body),
      secret,
      nowSeconds: 1700000120,
    });
    expect(result).toEqual({ ok: false, code: "WEBHOOK_TIMESTAMP_REPLAY" });
  });
});
