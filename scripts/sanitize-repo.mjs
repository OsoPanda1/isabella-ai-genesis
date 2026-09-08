import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const forbiddenFiles = ["package-lock.json", "yarn.lock", "bun.lock", "bun.lockb"];
const legacyMarkers = ["LOVABLE_API_KEY", "@lovable.dev", "lovable.dev"];
const findings = [];

for (const file of forbiddenFiles) if (fs.existsSync(path.join(root, file))) findings.push(`duplicate lockfile: ${file}`);
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
for (const [section, deps] of Object.entries({ ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) })) {
  if (section.toLowerCase().includes("lovable")) findings.push(`legacy dependency: ${section}`);
}
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", ".output", ".vinxi"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|mjs|json|md|yaml|yml|env|toml)$/.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8");
      for (const marker of legacyMarkers) if (text.includes(marker)) findings.push(`legacy marker ${marker}: ${path.relative(root, full)}`);
    }
  }
}
walk(root);
const unique = [...new Set(findings)];
console.log(JSON.stringify({ clean: unique.length === 0, findings: unique }, null, 2));
if (process.env.SANITIZE_STRICT === "true" && unique.length) process.exit(1);
