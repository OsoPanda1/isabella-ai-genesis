/**
 * Output Security Gate (src/lib/output-security-gate.ts)
 * -------------------------------------------------------------
 * Enforces output screening, data loss prevention (DLP),
 * prompt-leakage protection, and secret redaction prior to delivering
 * LLM or agent responses to the user.
 */
import { redactSecrets } from "./secret-redactor";

export interface OutputSecurityInspection {
  safe: boolean;
  sanitizedText: string;
  violations: string[];
  redactionApplied: boolean;
}

export function inspectAndSanitizeOutput(rawOutput: string): OutputSecurityInspection {
  if (!rawOutput || typeof rawOutput !== "string") {
    return { safe: true, sanitizedText: "", violations: [], redactionApplied: false };
  }

  const violations: string[] = [];
  let sanitizedText = rawOutput;

  // 1. Redact secrets
  const redacted = redactSecrets(sanitizedText);
  const redactionApplied = redacted !== sanitizedText;
  sanitizedText = redacted;

  // 2. Check for system prompt / jailbreak leakage indicators
  const promptLeakPatterns = [
    /<SYSTEM_PROMPT_EXTRACTION_CONFIRMED>/i,
    /DISREGARD ALL PRIOR INSTRUCTIONS AND EXECUTE/i,
  ];

  for (const pattern of promptLeakPatterns) {
    if (pattern.test(sanitizedText)) {
      violations.push("PROMPT_LEAKAGE_DETECTED");
      sanitizedText = sanitizedText.replace(pattern, "[FILTERED_SECURITY_VIOLATION]");
    }
  }

  return {
    safe: violations.length === 0,
    sanitizedText,
    violations,
    redactionApplied,
  };
}

export default { inspectAndSanitizeOutput };
