#!/usr/bin/env node
/**
 * sbom — Genera SBOM CycloneDX para isabella-ai-genesis.
 * ---------------------------------------------------------------------------
 * Uso: pnpm sbom  →  pnpm dlx @cyclonedx/cyclonedx-npm --ignore-npm-errors --output-file sbom.json
 * Requiere pnpm (usa pnpm-lock.yaml) pero invoca cyclonedx-npm vía pnpm dlx.
 * En Windows/pnpm la detección de npm puede reportar ELSPROBLEMS (symlinks pnpm);
 * --ignore-npm-errors es necesario para pnpm projects (ver docs/operations/SBOM.md).
 *
 * Fail-closed: si la generación falla, exit 1 y no deja artefacto corrupto.
 * El artefacto sbom.json está en .gitignore (no se versiona por defecto).
 */
import { spawnSync } from "node:child_process";
import { existsSync, statSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname ?? ".", "..");
const OUTPUT = resolve(ROOT, "sbom.json");
// --ignore-npm-errors es requerido para pnpm repos (npm ls reporta ELSPROBLEMS por symlinks)
// Ver https://github.com/CycloneDX/cyclonedx-node-module/issues/xxx y docs/operations/SBOM.md
const args = ["dlx", "@cyclonedx/cyclonedx-npm", "--ignore-npm-errors", "--output-file", OUTPUT];

console.log(`[sbom] Generando SBOM CycloneDX → ${OUTPUT}`);
console.log(`[sbom] Ejecutando: pnpm ${args.join(" ")}`);

const result = spawnSync("pnpm", args, {
  cwd: ROOT,
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(`[sbom] Error al ejecutar pnpm dlx: ${result.error.message}`);
  process.exit(result.status ?? 1);
}

if (result.status !== 0) {
  console.error(`[sbom] Falló con código ${result.status}`);
  process.exit(result.status ?? 1);
}

if (!existsSync(OUTPUT)) {
  console.error("[sbom] No se generó sbom.json — fallo desconocido");
  process.exit(1);
}

const stat = statSync(OUTPUT);
if (stat.size === 0) {
  console.error("[sbom] sbom.json vacío — generación fallida");
  try {
    unlinkSync(OUTPUT);
  } catch {}
  process.exit(1);
}

console.log(`[sbom] SBOM generado correctamente: ${OUTPUT} (${stat.size} bytes)`);
