#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const packagePath = resolve(root, "package.json");
const lockPath = resolve(root, "pnpm-lock.yaml");

if (!existsSync(packagePath) || !existsSync(lockPath)) {
  console.error("LOCK-CONTRACT: package.json y pnpm-lock.yaml son obligatorios.");
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
const lock = readFileSync(lockPath, "utf8");
const errors = [];
if (pkg.packageManager !== "pnpm@10.15.4") errors.push("packageManager=" + (pkg.packageManager ?? "<missing>") + "; esperado pnpm@10.15.4");
if (!/^lockfileVersion:\s*['\"]?9(?:\\.0)?['\"]?\s*$/m.test(lock)) errors.push("pnpm-lock.yaml debe ser lockfileVersion 9.x para pnpm 10.");

const importerMatch = lock.match(/\nimporters:\n(?<block>[\s\S]*?)\npackages:\n/);
if (!importerMatch?.groups?.block) {
  errors.push("No se pudo localizar importer "." en pnpm-lock.yaml.");
} else {
  const rootImporterMatch = importerMatch.groups.block.match(/\n  \\.:\\n(?<root>[\\s\\S]*)/);
  if (!rootImporterMatch?.groups?.root) errors.push("No se pudo localizar importador raíz "." en pnpm-lock.yaml.");
  else {
    const specs = new Map();
    const lines = rootImporterMatch.groups.root.split("\n");
    let current = null;
    for (const line of lines) {
      const entry = line.match(/^      (.+):\s*$/);
      if (entry) { current = entry[1].replace(/^['\"]|['\"]$/g, ""); continue; }
      const spec = line.match(/^        specifier:\s+(.+)$/);
      if (spec && current) { specs.set(current, spec[1].trim()); current = null; }
    }
    const expected = new Map([...Object.entries(pkg.dependencies ?? {}), ...Object.entries(pkg.devDependencies ?? {})]);
    for (const [name, range] of expected) {
      if (!specs.has(name)) errors.push("Dependencia directa ausente del lockfile: " + name);
      else if (specs.get(name) !== range) errors.push("Specifier desalineado: " + name + ": package.json=" + range + " lock=" + specs.get(name));
    }
    for (const name of specs.keys()) if (!expected.has(name)) errors.push("Entrada directa obsoleta en lockfile: " + name);
  }
}

if (errors.length) {
  console.error("LOCK-CONTRACT: FAILED");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}
console.log("LOCK-CONTRACT: PASS — package.json y pnpm-lock.yaml tienen contrato de importers coherente.");