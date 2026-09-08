import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const checks = [
  {
    file: "src/components/isabella/SystemMonitor.tsx",
    forbidden: [/Math\.random\s*\(/, /Simulated node/i, /Escalar K8s/i, /tamv-worker-[0-9]+/i],
    label: "SystemMonitor must not fabricate infrastructure telemetry",
  },
  {
    file: "src/lib/telemetry/observability.ts",
    forbidden: [/Math\.random\s*\(/, /startSimulation/i, /generateInitialSnapshot/i],
    label: "Observability must not generate synthetic runtime metrics",
  },
  {
    file: "src/lib/isabella/ml/reinforcement.ts",
    forbidden: [/Math\.random\s*\(/, /simulated/i, /system-auto-evaluator/i],
    label: "Production evaluation must not fabricate metrics or approval",
  },
  {
    file: "src/server.ts",
    required: [/production\s*=\s*process\.env\.NODE_ENV\s*===\s*['\"]production['\"]/, /script-src \$\{scriptSource\}/],
    label: "Production server boundary must enforce strict script CSP",
  },
];

const errors = [];
for (const check of checks) {
  const path = resolve(root, check.file);
  let content;
  try {
    content = readFileSync(path, "utf8");
  } catch (error) {
    errors.push(`${check.label}: missing/unreadable ${check.file}: ${error.message}`);
    continue;
  }
  for (const pattern of check.forbidden ?? []) {
    if (pattern.test(content)) errors.push(`${check.label}: forbidden pattern ${pattern} in ${check.file}`);
  }
  for (const pattern of check.required ?? []) {
    if (!pattern.test(content)) errors.push(`${check.label}: required pattern ${pattern} missing from ${check.file}`);
  }
}

if (errors.length) {
  console.error("PRODUCTION INTEGRITY GATE FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("PRODUCTION INTEGRITY GATE PASSED: no known P0 synthetic-runtime patterns detected.");
