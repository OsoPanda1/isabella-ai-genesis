#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const jsonOutput = process.argv.includes("--json");
const errors = [];

const required = [
  "package.json",
  "pnpm-lock.yaml",
  "vercel.json",
  "vite.config.ts",
  ".nvmrc",
  "index.html",
  "src/main.tsx",
  "src/App.tsx",
  "server.ts",
  "api/[...path].ts",
  "src/lib/isabella-chat-gateway.ts",
  "src/lib/api-contracts.ts",
  "src/lib/config.ts",
  "src/lib/principal-context.ts",
  "src/lib/production-authority.ts",
  "src/lib/runtime-integrity.ts",
  "src/lib/persistence/repository-factory.ts",
  "src/lib/repositories/decision-repository.ts",
  "src/lib/sovereign-pipeline.ts",
  "src/lib/output-security-gate.ts",
  "src/lib/kill-switch.ts",
  "src/lib/intelligence/router.ts",
  "src/lib/native-ml/index.ts",
  "src/lib/api-catalog.ts",
  "scripts/production-integrity-gate.mjs",
  "scripts/generate-client-shell.mjs",
  ".env.example",
];

for (const file of required) {
  if (!existsSync(resolve(root, file))) errors.push(`missing:${file}`);
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(resolve(root, file), "utf8"));
  } catch (error) {
    errors.push(`invalid-json:${file}:${error.message}`);
    return null;
  }
}

const pkg = readJson("package.json");
if (pkg) {
  if (pkg.packageManager !== "pnpm@10.34.5") errors.push("packageManager must be pnpm@10.34.5");
  if (pkg.engines?.node !== "24.x") errors.push("engines.node must be 24.x");
  for (const script of ["build", "typecheck", "lint", "test", "production:integrity", "production:evidence"]) {
    if (!pkg.scripts?.[script]) errors.push(`missing-script:${script}`);
  }
}

if (readFileSync(resolve(root, ".nvmrc"), "utf8").trim() !== "24.11.0")
  errors.push(".nvmrc must pin Node 24.11.0");

const vercel = readJson("vercel.json");
if (vercel) {
  if (vercel.framework !== "vite") errors.push("vercel.framework must be vite");
  if (vercel.buildCommand !== "pnpm build") errors.push("vercel.buildCommand must be pnpm build");
  if (vercel.outputDirectory !== "dist") errors.push("vercel.outputDirectory must be dist");
  if (!Array.isArray(vercel.rewrites) || vercel.rewrites.length < 2)
    errors.push("vercel.rewrites must preserve API-first plus SPA fallback");
}

const vite = readFileSync(resolve(root, "vite.config.ts"), "utf8");
if (!vite.includes("@vitejs/plugin-react")) errors.push("vite config missing React plugin");
if (!vite.includes('outDir: "dist"')) errors.push("vite config must emit dist");

const apiEntrypoint = readFileSync(resolve(root, "api/[...path].ts"), "utf8");
if (!apiEntrypoint.includes('import("../server")'))
  errors.push("Vercel entrypoint must delegate to server.ts");
if (!apiEntrypoint.includes("externalResolver: true"))
  errors.push("Vercel API entrypoint must preserve externalResolver");

const serverSource = readFileSync(resolve(root, "server.ts"), "utf8");
for (const path of ["/api/health", "/api/health/live", "/api/health/ready"]) {
  if (!serverSource.includes(`app.get("${path}"`)) errors.push(`missing-runtime-route:${path}`);
}

const gateway = readFileSync(resolve(root, "src/lib/isabella-chat-gateway.ts"), "utf8");
for (const [pattern, label] of [
  ["createSovereignPipeline", "sovereign pipeline"],
  ["createPostgresDecisionLedger", "durable decision ledger"],
  ['isKilled("inference")', "inference kill-switch"],
  ["createOutputGateTracker", "output security gate"],
  ["checkRateLimitDistributed", "distributed rate limiting"],
]) {
  if (!gateway.includes(pattern)) errors.push(`gateway-missing:${label}`);
}

if ((gateway.match(/createPostgresDecisionLedger/g) ?? []).length !== 2)
  errors.push("gateway decision ledger contract must remain one import/use pair");
if ((gateway.match(/isKilled\("inference"\)/g) ?? []).length !== 1)
  errors.push("gateway must have exactly one inference kill-switch gate");

const result = {
  status: errors.length ? "failed" : "static_ready",
  phases: {
    staticPreflight: errors.length ? "failed" : "passed",
    externalDependencies: "not-run",
    runtimeSmoke: "not-run",
  },
  validatedFiles: required.length,
  errors,
  note: "Static production/deployment validation only; external Vercel, database and provider health require runtime execution.",
};

if (jsonOutput) console.log(JSON.stringify(result, null, 2));
else {
  console.log(result.status === "failed" ? "Production preflight FAILED" : "Production preflight OK (static only)");
  for (const error of errors) console.error(`- ${error}`);
}
process.exitCode = errors.length ? 1 : 0;
