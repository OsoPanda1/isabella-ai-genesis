import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";

const failures = [];
const requiredFiles = [
  ".github/CODEOWNERS",
  ".github/workflows/security.yml",
  ".github/workflows/secret-scan.yml",
  ".github/workflows/sast.yml",
  ".github/workflows/fgais-gate.yml",
  "Dockerfile",
  "vercel.json",
];

for (const file of requiredFiles)
  if (!existsSync(file)) failures.push(`missing required control: ${file}`);

const docker = readFileSync("Dockerfile", "utf8");
if (!/USER\s+isabella\b/.test(docker)) failures.push("Docker runtime must use non-root user");
if (!/HEALTHCHECK\b/.test(docker)) failures.push("Docker image must define HEALTHCHECK");

const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));
const headers = JSON.stringify(vercel.headers ?? []);
for (const header of [
  "Strict-Transport-Security",
  "Content-Security-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
]) {
  if (!headers.includes(header)) failures.push(`Vercel security header missing: ${header}`);
}

const securityWorkflow = readFileSync(".github/workflows/security.yml", "utf8");
for (const marker of [
  "pnpm audit",
  "pnpm security:scan",
  "trufflehog",
  "trivy",
  "sbom",
  "CodeQL",
]) {
  if (!securityWorkflow.toLowerCase().includes(marker.toLowerCase()))
    failures.push(`security workflow missing control: ${marker}`);
}

if (failures.length) {
  console.error("Policy-as-code FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("Policy-as-code OK");
