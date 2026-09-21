#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const expectedNode = "24.11.0";
const expectedPnpm = "10.15.4";
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

if (pkg.packageManager !== `pnpm@${expectedPnpm}`) {
  throw new Error(`packageManager must be pnpm@${expectedPnpm}`);
}
if (!existsSync("pnpm-lock.yaml")) {
  throw new Error("pnpm-lock.yaml is missing");
}

const nodeVersion = process.version.slice(1);
if (nodeVersion !== expectedNode) {
  throw new Error(`Node ${expectedNode} required; found ${nodeVersion}`);
}

const pnpmVersion = execFileSync("pnpm", ["--version"], { encoding: "utf8" }).trim();
if (pnpmVersion !== expectedPnpm) {
  throw new Error(`pnpm ${expectedPnpm} required; found ${pnpmVersion}`);
}

// Always resolve the manifest first, then prove the generated lockfile is frozen-installable.
// This command intentionally fails closed: no hand-edited lockfile is accepted as certification.
execFileSync("pnpm", ["install", "--lockfile-only", "--no-frozen-lockfile"], {
  stdio: "inherit",
});
execFileSync("pnpm", ["install", "--frozen-lockfile"], {
  stdio: "inherit",
});
console.log("LOCKFILE_REPAIR_PASS");
