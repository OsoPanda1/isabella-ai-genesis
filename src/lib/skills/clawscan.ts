export type ClawSeverity = "INFO" | "HIGH" | "CRITICAL";
export interface ClawFinding { code: string; severity: ClawSeverity; message: string; }
export interface ClawScanResult { allowed: boolean; findings: ClawFinding[]; scannerVersion: string; }

const rules: Array<[string, ClawSeverity, RegExp, string]> = [
  ["CS-001", "CRITICAL", /\beval\s*\(|\bnew\s+Function\s*\(|\bFunction\s*\(/i, "dynamic code execution"],
  ["CS-002", "CRITICAL", /process\.env|SECRET|TOKEN|PRIVATE_KEY|API_KEY/i, "potential secret access"],
  ["CS-003", "HIGH", /\b(GPL-?3|AGPL|proprietary)\b/i, "license requires review"],
  ["CS-004", "HIGH", /child_process|spawn\s*\(|exec\s*\(|rm\s+-rf|chmod\s+\+x/i, "privileged execution or mutation pattern"],
];

export function scanSkill(manifest: { source: string; license?: string; content: string }): ClawScanResult {
  if (!manifest.source.trim()) throw new Error("skill source required");
  const findings: ClawFinding[] = [];
  const text = `${manifest.license ?? ""}\n${manifest.content}`;
  for (const [code, severity, pattern, message] of rules) if (pattern.test(text)) findings.push({ code, severity, message });
  return { allowed: !findings.some((f) => f.severity === "CRITICAL"), findings, scannerVersion: "1.0.0-static" };
}
