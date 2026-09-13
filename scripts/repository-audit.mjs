import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const files = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);
const code = files.filter((file) => /\.(ts|tsx|js|jsx|mjs)$/.test(file));
const docs = files.filter((file) => /\.(md|mdx|txt|docx)$/.test(file));
const report = {
  generatedAt: new Date().toISOString(),
  trackedFiles: files.length,
  codeFiles: code.length,
  documentationFiles: docs.length,
  riskSignals: {
    todo: count("TODO|FIXME"),
    mocks: count("mock|placeholder|sample data|demo data"),
    consoleLogs: count("console\\.log"),
  },
  canonicalEntrypoints: {
    nativeML: "src/lib/native-ml/canonical-engine.ts",
    aiVault: "src/lib/governance/ai-vault.ts",
    openness: "docs/rfcs/RFC-0001-openness-cooperacion-cognitiva.md",
  },
};

function count(pattern) {
  try {
    const output = execFileSync("git", ["grep", "-n", "-E", pattern, "--", ...files], {
      encoding: "utf8",
    });
    return output ? output.trim().split("\n").length : 0;
  } catch {
    return 0;
  }
}

writeFileSync(
  "genesis/reports/repository-audit-latest.json",
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
