#!/usr/bin/env node
/**
 * sbom-verify — Verifica SBOM CycloneDX generado por scripts/sbom.mjs
 * ---------------------------------------------------------------------------
 * Fail-closed: exit 1 si sbom.json falta, es inválido o no es CycloneDX.
 * Uso: pnpm sbom:verify
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname ?? ".", "..");
const SBOM = resolve(ROOT, "sbom.json");

function fail(msg) {
  console.error(`[sbom:verify] FAIL — ${msg}`);
  process.exit(1);
}
function ok(msg) {
  console.log(`[sbom:verify] OK — ${msg}`);
}

console.log(`[sbom:verify] Verificando ${SBOM}`);

if (!existsSync(SBOM)) fail(`sbom.json no encontrado. Ejecuta: pnpm sbom`);

const stat = statSync(SBOM);
if (stat.size === 0) fail("sbom.json vacío (0 bytes)");
ok(`sbom.json existe (${stat.size} bytes)`);

let json;
try {
  json = JSON.parse(readFileSync(SBOM, "utf-8"));
} catch (e) {
  fail(`JSON inválido: ${e.message}`);
}

if (json.bomFormat !== "CycloneDX") fail(`bomFormat esperado "CycloneDX", hallado "${json.bomFormat}"`);
ok(`bomFormat=CycloneDX`);

if (!json.specVersion) fail("specVersion ausente");
ok(`specVersion=${json.specVersion}`);

if (!json.metadata || !json.metadata.component) fail("metadata.component ausente");
ok(`metadata.component=${json.metadata.component.name ?? "?"}@${json.metadata.component.version ?? "?"}`);

if (!Array.isArray(json.components)) fail("components no es array");
ok(`components=${json.components.length}`);

if (json.components.length === 0) {
  console.warn("[sbom:verify] WARN — SBOM sin componentes (proyecto sin dependencias?)");
} else {
  // Validación mínima de cada componente crítico
  const invalid = json.components.filter((c) => !c.name || !c.version || !c.purl);
  if (invalid.length > 0) {
    console.warn(`[sbom:verify] WARN — ${invalid.length} componentes sin name/version/purl`);
  }
  ok(`muestra: ${json.components.slice(0, 3).map((c) => `${c.name}@${c.version}`).join(", ")}`);
}

if (!json.serialNumber) console.warn("[sbom:verify] WARN — serialNumber ausente (recomendado CycloneDX >=1.3)");

console.log("[sbom:verify] SBOM válido — verificación completa");
