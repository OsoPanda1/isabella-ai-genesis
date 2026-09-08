export type ClawScanSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ClawScanFinding {
  id: string;
  severity: ClawScanSeverity;
  category: "dynamic-code" | "secret-access" | "license" | "mutation";
  evidence: string;
}

export interface ClawScanResult {
  allowed: boolean;
  findings: ClawScanFinding[];
}

const RULES: Array<{ id: string; category: ClawScanFinding["category"]; severity: ClawScanSeverity; pattern: RegExp; evidence: string }> = [
  { id: "CS-001", category: "dynamic-code", severity: "CRITICAL", pattern: /\b(?:eval|new Function|Function\s*\()/i, evidence: "Ejecución dinámica detectada" },
  { id: "CS-002", category: "secret-access", severity: "CRITICAL", pattern: /(?:process\.env|SECRET|TOKEN|PRIVATE_KEY|API_KEY)/i, evidence: "Acceso potencial a secretos detectado" },
  { id: "CS-003", category: "license", severity: "HIGH", pattern: /GPL-?3|AGPL|proprietary/i, evidence: "Licencia requiere revisión" },
  { id: "CS-004", category: "mutation", severity: "HIGH", pattern: /(?:chmod\s+\+x|rm\s+-rf|child_process|spawn\(|exec\()/i, evidence: "Mutación/ejecución privilegiada detectada" },
];

/** Static pre-install gate. It does not replace sandboxing, signature verification or human review. */
export function scanSkillManifest(manifest: unknown): ClawScanResult {
  const text = typeof manifest === "string" ? manifest : JSON.stringify(manifest ?? {});
  const findings = RULES.filter(rule => rule.pattern.test(text)).map(rule => ({
    id: rule.id,
    severity: rule.severity,
    category: rule.category,
    evidence: rule.evidence,
  }));
  return { allowed: !findings.some(f => f.severity === "CRITICAL"), findings };
}
