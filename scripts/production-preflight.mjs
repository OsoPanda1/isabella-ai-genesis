import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "package.json", "pnpm-lock.yaml", "vercel.json", "vite.config.ts",
  "src/routes/__root.tsx", "src/routes/index.tsx", "src/server.ts",
  "src/routes/api/isabella.ts", "src/routes/api/v1/isabella.ts",
  "src/lib/isabella-chat-gateway.ts", "src/lib/api-contracts.ts",
  "src/lib/production-authority.ts", "docs/architecture/RUNTIME-AUTHORITY-MAP.md",
  "src/server-routes/api/health.ts", "src/lib/intelligence/router.ts",
  "src/lib/intelligence/durable-model-registry.ts", "src/lib/intelligence/production-model-gate.ts",
  "supabase/migrations/20260908123000_fgais_model_runtime_registry.sql", ".env.example",
];
const errors = [];
for (const file of required) if (!existsSync(resolve(root, file))) errors.push(`missing:${file}`);
if (existsSync(resolve(root, "src/server-routes/api/isabella.ts"))) errors.push("legacy duplicate src/server-routes/api/isabella.ts must not exist");
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
if (pkg.packageManager !== "pnpm@10.15.0") errors.push("packageManager must be pnpm@10.15.0");
if (pkg.engines?.node !== ">=22") errors.push("engines.node must be >=22 for deterministic production runtime");
for (const script of ["build", "start", "typecheck", "lint", "test", "db:migrate", "db:verify", "production:preflight", "production:gate"]) if (!pkg.scripts?.[script]) errors.push(`missing npm script:${script}`);
const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
if (vercel.framework !== "tanstack-start") errors.push("vercel.framework must be tanstack-start");
if (vercel.installCommand !== "pnpm install --frozen-lockfile") errors.push("Vercel installCommand must use frozen lockfile");
const server = readFileSync(resolve(root, "src/server.ts"), "utf8");
if (/public-chat/i.test(server)) errors.push("server.ts must not expose the emergency public-chat demo gateway");
if (/GEMINI_API_KEY.*generateContent/s.test(server)) errors.push("server.ts must not contain a direct demo Gemini implementation");
const route = readFileSync(resolve(root, "src/routes/index.tsx"), "utf8");
if (route.includes("CROWN-SSR-01")) errors.push("root route must not be the emergency recovery page");
const gateway = readFileSync(resolve(root, "src/lib/isabella-chat-gateway.ts"), "utf8");
for (const [pattern, label] of [["streamGenerateContent?alt=sse", "Gemini SSE streaming"], ["createSovereignPipeline", "sovereign governance"], ["checkRateLimitDistributed", "distributed rate limiting"], ["isKilled(\"inference\")", "inference kill-switch"]]) if (!gateway.includes(pattern)) errors.push(`canonical Isabella gateway missing ${label}`);
if (errors.length) { console.error("Production preflight FAILED"); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log("Production preflight OK");
console.log(`Validated ${required.length} production-critical files and canonical runtime contracts.`);
