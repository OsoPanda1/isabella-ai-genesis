import { createHash } from "node:crypto";
import type { IntelligenceMessage } from "./contracts";

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?previous\s+instructions/i,
  /reveal\s+(?:the\s+)?system\s+prompt/i,
  /show\s+(?:me\s+)?(?:your|the)\s+(?:system\s+)?instructions/i,
  /developer\s+message\s*:/i,
  /jailbreak/i,
];
const MAX_MESSAGE_CHARS = 32_000;
const MAX_TOTAL_CHARS = 120_000;

export interface FirewallDecision {
  allowed: boolean;
  reasons: string[];
  sanitized: IntelligenceMessage[];
  contentHash: string;
}

export function inspectInferenceInput(messages: IntelligenceMessage[]): FirewallDecision {
  const reasons: string[] = [];
  let total = 0;
  const sanitized = messages.map((message) => {
    const content = message.content.replace(CONTROL_CHARS, "").trim();
    total += content.length;
    if (content.length > MAX_MESSAGE_CHARS) reasons.push("message-too-large");
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(content)) reasons.push("prompt-injection-pattern");
    }
    return { ...message, content };
  });

  if (total > MAX_TOTAL_CHARS) reasons.push("request-too-large");
  const contentHash = createHash("sha256")
    .update(JSON.stringify(sanitized))
    .digest("hex");

  return {
    allowed: reasons.length === 0,
    reasons: [...new Set(reasons)],
    sanitized,
    contentHash,
  };
}
