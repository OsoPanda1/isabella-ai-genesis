import { analyzeAegisSemantic, scanExfiltration, type AegisAnalysis } from "@/lib/aegis-semantic";
export interface OutputGateResult {
  allowed: boolean;
  text: string;
  analysis: AegisAnalysis;
  reasons: string[];
}
export function scanOutput(text: string, source = "model-output"): OutputGateResult {
  const analysis = analyzeAegisSemantic(text, { untrustedData: [{ text, source }] });
  const exfil = scanExfiltration(text);
  const critical = analysis.findings.some((f) => f.severity === "critical") || exfil.some((f) => f.severity === "critical");
  const high = analysis.findings.some((f) => f.severity === "high");
  const reasons = [...new Set(analysis.findings.map((f) => f.signal))];
  return critical || high
    ? { allowed:false, text:"", analysis, reasons }
    : { allowed:true, text, analysis, reasons:[] };
}
export function safeOutputOrBlock(text:string, source="model-output"):string {
  const result=scanOutput(text,source);
  return result.allowed ? result.text : "La salida fue retenida por el gate de seguridad de Isabella.";
}
