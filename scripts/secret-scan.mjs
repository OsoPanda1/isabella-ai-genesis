#!/usr/bin/env node
/**
 * secret-scan — Escaneo de secretos hardcodeados (SAST ligero).
 * -----------------------------------------------------------------
 * Recorre los archivos de la aplicación y detecta:
 *   1. Secretos de longitud >= 16 tras claves sensibles.
 *   2. Un secreto fallback conocido.
 *   3. Archivos .env/.env.local versionados accidentalmente.
 *
 * Se invoca desde `npm run security:scan`.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

// ROOT es la raíz del repositorio, NO el directorio del script.
const ROOT = resolve(import.meta.dirname ?? ".", "..");
const SCAN_DIRS = ["src", "supabase"];
const SKIP = [
  ".git",
  "node_modules",
  "dist",
  ".output",
  ".vinxi",
  "routeTree.gen.ts",
  "coverage",
  "assets",
];

const SECRET_LITERAL_RE =
  /\b(?:sk|pk|secret|password|passwd|api[_-]?key|token|jwt|private[_-]?key|signing|encryption[_-]?key)\b\s*[:=]\s*["'][A-Za-z0-9_\-\.\+\/=]{16,}["']/gi;

const KNOWN_FALLBACK = "isabella_sovereign_security_secret_tamv_hidalgo";

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP.includes(entry.name)) continue;
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|mjs|sql)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function checkEnvFiles() {
  const problems = [];
  const envFiles = [".env", ".env.local", ".env.production", ".env.vercel"];
  let tracked = null;
  try {
    // La regla correcta es "estar versionado", no "existir en disco":
    // un .env local no versionado es esperado en desarrollo.
    tracked = execFileSync("git", ["ls-files", "--", ...envFiles], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    tracked = null;
  }
  if (tracked !== null) {
    for (const line of tracked
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)) {
      problems.push(`Archivo ${line} versionado en el repositorio — no debe versionarse.`);
    }
    return problems;
  }
  // Fallback (git no disponible): al menos reporta los que estén tracked-en-disco.
  for (const f of envFiles) {
    if (existsSync(resolve(ROOT, f))) {
      problems.push(`Archivo ${f} detectado en el repositorio — no debe versionarse.`);
    }
  }
  return problems;
}

function checkSecrets() {
  const problems = [];
  const files = SCAN_DIRS.flatMap((d) => walk(resolve(ROOT, d)));
  // Un escáner que no lee nada no puede declarar "OK" (gate vacío).
  if (files.length === 0) {
    problems.push(
      `SECRET-SCAN: no se pudo leer ningún archivo bajo ${SCAN_DIRS.join(", ")} en ${ROOT} — gate vacío.`,
    );
    return problems;
  }
  for (const file of files) {
    if (file.includes("env-schema") || file.includes("config.ts")) continue;
    const content = readFileSync(file, "utf8");
    if (content.includes(KNOWN_FALLBACK)) {
      problems.push(`${file}: secreto fallback hardcodeado detectado (${KNOWN_FALLBACK}).`);
    }
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      SECRET_LITERAL_RE.lastIndex = 0;
      if (SECRET_LITERAL_RE.test(line)) {
        problems.push(`${file}:${idx + 1}: posible literal de secreto hardcodeado.`);
      }
    });
  }
  return problems;
}

const problems = [...checkEnvFiles(), ...checkSecrets()];
if (problems.length) {
  console.error("SECRET-SCAN: PROBLEMAS DETECTADOS");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("SECRET-SCAN: OK — no se detectaron secretos hardcodeados.");
process.exit(0);
