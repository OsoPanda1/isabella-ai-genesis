/**
 * Trusted Client IP Extractor
 */
import type { IncomingMessage } from "node:http";

export function getTrustedClientIp(req: IncomingMessage): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim().length > 0) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || "127.0.0.1";
}

export default getTrustedClientIp;
