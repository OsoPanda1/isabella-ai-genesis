import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const output = join(root, "release");
const files = ["package.json", "pnpm-lock.yaml", "tsconfig.json", "vite.config.ts"];
const read = (file) => readFileSync(join(root, file), "utf8");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const command = (name, args) => {
  try {
    return execFileSync(name, args, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
};

/**
 * Ejecuta un gate real y captura su resultado. Nunca se declara PASS sin
 * haber corrido el comando: si no se ejecuta, el estado queda UNVERIFIED.
 */
function runGate(label, args) {
  const startedAt = Date.now();
  // En Windows los .cmd exigen shell (Node >= 20.17 rechaza spawn directo
  // de binarios .cmd por CVE-2024-27980 -> EINVAL).
  const useShell = process.platform === "win32";
  try {
    const stdout = execFileSync(args[0], args.slice(1), {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 20 * 60 * 1000,
      shell: useShell,
    });
    return {
      status: "PASS",
      command: args.join(" "),
      durationMs: Date.now() - startedAt,
      tail: String(stdout).trim().split("\n").slice(-5),
      label,
    };
  } catch (error) {
    const out = `${error?.stdout ?? ""}${error?.stderr ?? ""}`.trim();
    return {
      status: "FAIL",
      command: args.join(" "),
      durationMs: Date.now() - startedAt,
      exitCode: error?.status ?? null,
      tail: out.split("\n").slice(-8),
      label,
    };
  }
}

const packageManagerBin = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });

const commitSha = command("git", ["rev-parse", "HEAD"]);
const dirtyTree = command("git", ["status", "--porcelain"]);
const packageJson = JSON.parse(read("package.json"));
const buildRoot = [".vercel/output", ".output", "dist"].find((dir) => existsSync(join(root, dir)));
const buildFiles = buildRoot ? walk(join(root, buildRoot)).map((file) => relative(root, file)) : [];

// Gates ejecutados AHORA, con su salida real capturada. Ninguno se declara
// PASS sin haber corrido el comando en este mismo proceso.
const securityRun = runGate("security", [packageManagerBin, "security:scan"]);
const typecheckRun = runGate("typecheck", [packageManagerBin, "typecheck"]);
const testRun =
  process.env.EVIDENCE_SKIP_TESTS === "1"
    ? {
        status: "UNVERIFIED",
        command: null,
        note: "EVIDENCE_SKIP_TESTS=1: la suite no se ejecuto en este proceso.",
        label: "tests",
      }
    : runGate("tests", [packageManagerBin, "test"]);

const gatesPass =
  securityRun.status === "PASS" && typecheckRun.status === "PASS" && testRun.status === "PASS";
// PASS exige: commit conocido + arbol limpio + los 3 gates PASS.
// Cualquier otra combinacion queda UNVERIFIED o EVIDENCE_GATED (nunca PASS).
const overallStatus = !commitSha
  ? "UNVERIFIED"
  : dirtyTree
    ? "UNVERIFIED"
    : gatesPass
      ? "PASS"
      : "EVIDENCE_GATED";

const evidence = {
  generatedAt: new Date().toISOString(),
  status: overallStatus,
  commitSha,
  repositoryClean: dirtyTree === "",
  node: process.version,
  packageManager: packageJson.packageManager,
  buildRoot: buildRoot ?? null,
  buildFileCount: buildFiles.length,
  buildDigest: buildFiles.length
    ? sha256(buildFiles.map((file) => `${file}:${sha256(read(file))}`).join("\n"))
    : null,
  gates: {
    security: securityRun.status,
    typecheck: typecheckRun.status,
    tests: testRun.status,
  },
  checks: {
    lockfile: existsSync(join(root, "pnpm-lock.yaml")),
    environmentSchema: existsSync(join(root, "src/lib/env-schema.ts")),
    productionIntegrity: existsSync(join(root, "scripts/production-integrity-gate.mjs")),
    productionPreflight: existsSync(join(root, "scripts/production-preflight.mjs")),
    backupProcedure: existsSync(join(root, "scripts/db-backup.mjs")),
    restoreProcedure: existsSync(join(root, "scripts/db-restore.mjs")),
  },
};
mkdirSync(output, { recursive: true });

for (const [name, value] of Object.entries({
  "commit.json": { commitSha: evidence.commitSha, repositoryClean: evidence.repositoryClean },
  "build.json": {
    generatedAt: evidence.generatedAt,
    buildRoot: evidence.buildRoot,
    buildFileCount: evidence.buildFileCount,
    buildDigest: evidence.buildDigest,
  },
  "dependencies.json": { packageManager: evidence.packageManager, node: evidence.node },
  "security.json": securityRun,
  "typecheck.json": typecheckRun,
  "tests.json": testRun,
  "migration.json": { status: "UNVERIFIED", note: "Attach database verification output." },
  "deployment.json": { status: "UNVERIFIED", note: "Attach deployment provider evidence." },
  "rollback.json": { status: "UNVERIFIED", note: "Attach rollback verification evidence." },
  "manifest.json": evidence,
}))
  writeFileSync(join(output, name), JSON.stringify(value, null, 2) + "\n");
writeFileSync(
  join(output, "checksums.txt"),
  walk(output)
    .filter((file) => !file.endsWith("checksums.txt"))
    .map((file) => `${sha256(readFileSync(file))}  ${relative(root, file)}`)
    .join("\n") + "\n",
);
console.log(JSON.stringify(evidence, null, 2));
if (evidence.status !== "PASS") process.exitCode = 1;
