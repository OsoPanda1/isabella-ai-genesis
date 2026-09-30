#!/usr/bin/env node
/**
 * scripts/attestation-keygen.mjs
 * ------------------------------------------------------------------
 * Genera, firma y verifica atestaciones RSA-2048 / SHA-256 / PKCS#1 v1.5
 * para Isabella. Es la ÚNICA vía autorizada para materializar la clave
 * privada: nunca vive en el código ni en el repositorio.
 *
 * Uso:
 *   node scripts/attestation-keygen.mjs --slot 1 --payload "Mensaje confidencial"
 *   node scripts/attestation-keygen.mjs --slot 2 --payload-file ./contrato.txt
 *   node scripts/attestation-keygen.mjs --slot 1 --verify
 *
 * Salida:
 *   secrets/attestations/<slot>.key.pem   (privada, gitignored)
 *   secrets/attestations/<slot>.pub.pem   (pública, gitignored)
 *   secrets/attestations/<slot>.payload.txt (bytes firmados, gitignored)
 *   stdout: ISABELLA_ATTESTATION_<N>_SIGNATURE=<base64>
 *
 * Reglas:
 *   - Nunca sobrescribe una clave existente sin --force.
 *   - `--verify` NO genera claves: solo comprueba evidencia ya presente.
 *   - Los tres elementos (firma, pública, payload) deben provenir del MISMO
 *     par de claves y de los MISMOS bytes; si falta alguno, la verificación
 *     queda NO VERIFICADA (fail-closed).
 */
import {
  createPrivateKey,
  createPublicKey,
  generateKeyPairSync,
  sign,
  verify,
  createHash,
} from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Las firmas viven en el .env local (gitignored). Se carga para que --verify
// opere sin exportar variables a mano. Nunca sobrescribe el entorno real.
loadDotenv({ path: join(ROOT, ".env"), quiet: true });

function parseArgs(argv) {
  const args = { slot: 1, dir: "secrets/attestations", force: false, verify: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--slot") args.slot = Number.parseInt(argv[++i], 10);
    else if (arg === "--dir") args.dir = argv[++i];
    else if (arg === "--payload") args.payload = argv[++i];
    else if (arg === "--payload-file") args.payloadFile = argv[++i];
    else if (arg === "--force") args.force = true;
    else if (arg === "--verify") args.verify = true;
    else if (arg === "--all") args.all = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Argumento desconocido: ${arg}`);
  }
  if (!Number.isInteger(args.slot) || args.slot < 1 || args.slot > 99) {
    throw new Error("--slot debe ser un entero entre 1 y 99");
  }
  return args;
}

function resolveDir(dir) {
  return isAbsolute(dir) ? dir : resolve(ROOT, dir);
}

function readPayloadBytes(args, dir, slot) {
  if (args.payloadFile) {
    const path = isAbsolute(args.payloadFile) ? args.payloadFile : resolve(ROOT, args.payloadFile);
    return readFileSync(path);
  }
  if (typeof args.payload === "string") return Buffer.from(args.payload, "utf8");
  const existing = join(dir, `${slot}.payload.txt`);
  if (existsSync(existing)) return readFileSync(existing);
  return null;
}

function fingerprint(buffer) {
  return `sha256:${createHash("sha256").update(buffer).digest("hex").slice(0, 32)}`;
}

function printUsage() {
  console.log(`Attestation keygen (RSA-2048 · SHA-256 · PKCS#1 v1.5)

  --slot <n>           Ranura de atestación (1..99, por defecto 1)
  --dir <path>         Directorio de material (por defecto secrets/attestations)
  --payload <texto>    Texto UTF-8 exacto a firmar
  --payload-file <p>   Archivo cuyos bytes exactos se firman
  --verify             Verificar evidencia existente (no genera claves)
  --all                Con --verify: recorrer las ranuras 1, 2 y 3
  --force              Sobrescribir la clave privada de la ranura
  -h, --help           Esta ayuda
`);
}

function ensureMaterial(args, dir, slot) {
  const keyPath = join(dir, `${slot}.key.pem`);
  const pubPath = join(dir, `${slot}.pub.pem`);
  mkdirSync(dir, { recursive: true });

  if (existsSync(keyPath) && existsSync(pubPath) && !args.force) {
    return {
      privateKey: readFileSync(keyPath),
      publicKey: readFileSync(pubPath),
      reused: true,
    };
  }
  if (existsSync(keyPath) && args.force) {
    console.warn(`! --force: rotando la clave privada de la ranura ${slot}.`);
  }
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const keyPem = privateKey.export({ type: "pkcs8", format: "pem" });
  const pubPem = publicKey.export({ type: "spki", format: "pem" });
  writeFileSync(keyPath, keyPem, { mode: 0o600 });
  writeFileSync(pubPath, pubPem, { mode: 0o644 });
  return { privateKey: keyPem, publicKey: pubPem, reused: false };
}

function runVerify(dir, slot, payload, publicKeyPem, signatureB64) {
  const problems = [];
  if (!existsSync(join(dir, `${slot}.pub.pem`))) problems.push("falta <slot>.pub.pem");
  if (payload === null) problems.push("falta <slot>.payload.txt");
  if (!signatureB64) problems.push(`falta ISABELLA_ATTESTATION_${slot}_SIGNATURE`);
  if (problems.length > 0) {
    console.error(`✗ ranura ${slot}: NO VERIFICADA — ${problems.join(", ")}`);
    return 1;
  }
  let ok = false;
  try {
    ok = verify(
      "sha256",
      payload,
      createPublicKey(publicKeyPem),
      Buffer.from(signatureB64, "base64"),
    );
  } catch (error) {
    console.error(`✗ ranura ${slot}: NO VERIFICADA — ${error.message}`);
    return 1;
  }
  if (ok) {
    console.log(`✓ ranura ${slot}: firma RSA-2048/SHA-256/PKCS#1 v1.5 VERIFICADA`);
    return 0;
  }
  console.error(`✗ ranura ${slot}: SIGNATURE_MISMATCH — clave o payload distintos a los firmados`);
  return 1;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    return 0;
  }
  const dir = resolveDir(args.dir);
  const slot = args.slot;

  if (args.verify) {
    const slots = args.all ? [1, 2, 3] : [slot];
    let exitCode = 0;
    for (const current of slots) {
      const payload = readPayloadBytes(args, dir, current);
      const signatureB64 = process.env[`ISABELLA_ATTESTATION_${current}_SIGNATURE`];
      const pubPath = join(dir, `${current}.pub.pem`);
      const publicKeyPem = existsSync(pubPath) ? readFileSync(pubPath, "utf8") : null;
      exitCode = Math.max(exitCode, runVerify(dir, current, payload, publicKeyPem, signatureB64));
    }
    return exitCode;
  }

  const payload = readPayloadBytes(args, dir, slot);
  if (payload === null) {
    throw new Error('Indica --payload "texto" o --payload-file <ruta>.');
  }

  const material = ensureMaterial(args, dir, slot);
  const privateKey = createPrivateKey(material.privateKey);
  const signature = sign("sha256", payload, privateKey);
  const signatureB64Out = signature.toString("base64");

  writeFileSync(join(dir, `${slot}.payload.txt`), payload, { mode: 0o600 });

  const pubPem = readFileSync(join(dir, `${slot}.pub.pem`), "utf8");
  const confirmed = verify("sha256", payload, createPublicKey(pubPem), signature);

  console.log(`ranura ${slot} — ${material.reused ? "clave reutilizada" : "clave NUEVA generada"}`);
  console.log(`  payload bytes : ${payload.length}`);
  console.log(`  payload sha256: ${fingerprint(payload)}`);
  console.log(`  firma sha256  : ${fingerprint(signature)}`);
  console.log(`  verificada    : ${confirmed ? "True" : "False"}`);
  console.log("");
  console.log(`ISABELLA_ATTESTATION_${slot}_SIGNATURE=${signatureB64Out}`);
  console.log("");
  console.log("Guarda ese valor en tu .env local (gitignored). La clave pública y el");
  console.log(`payload quedaron en ${dir} y NO deben versionarse.`);
  return confirmed ? 0 : 1;
}

try {
  process.exitCode = await main();
} catch (error) {
  console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
