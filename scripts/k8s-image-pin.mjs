#!/usr/bin/env node
/**
 * scripts/k8s-image-pin.mjs — ISA-355
 *
 * Verifica que k8s/deployment.yaml no despliegue imágenes con tag mutable
 * (`latest`, tag vacío) y reporta si el pin es por digest inmutable.
 *
 *   node scripts/k8s-image-pin.mjs                  # PASS / FAIL (tag)
 *   node scripts/k8s-image-pin.mjs --require-digest # exige @sha256:...
 *
 * Estados: PASS (pin por digest), EVIDENCE_GATED (pin por tag versionado,
 * digest aún no resuelto), FAIL (latest/sin tag). EVIDENCE_GATED no cuenta
 * como PASS para certificación de producción (AGENTS §19).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "k8s", "deployment.yaml");

export function evaluateImagePin(image) {
  const ref = String(image ?? "").trim();
  if (!ref) return { status: "FAIL", reason: "IMAGEN_NO_DEFINIDA", image: ref, hasDigest: false };

  const digestMatch = /@sha256:[0-9a-f]{64}$/i.exec(ref);
  if (digestMatch) {
    const tagPart = ref.slice(0, digestMatch.index);
    const tag = tagPart.includes(":") ? tagPart.split(":").pop() : "";
    if (tag === "latest")
      return { status: "FAIL", reason: "TAG_LATEST_CON_DIGEST", image: ref, hasDigest: true };
    return { status: "PASS", reason: "PIN_POR_DIGEST", image: ref, hasDigest: true };
  }

  const lastSegment = ref.split("/").pop() ?? "";
  const colon = lastSegment.lastIndexOf(":");
  const tag = colon > 0 ? lastSegment.slice(colon + 1) : "";
  if (!tag) return { status: "FAIL", reason: "SIN_TAG_NI_DIGEST", image: ref, hasDigest: false };
  if (tag === "latest")
    return { status: "FAIL", reason: "TAG_LATEST", image: ref, hasDigest: false };

  return {
    status: "EVIDENCE_GATED",
    reason: "TAG_VERSIONADO_SIN_DIGEST",
    image: ref,
    hasDigest: false,
  };
}

export function extractImages(yamlText) {
  return [...String(yamlText).matchAll(/^\s*image:\s*(\S+)\s*$/gm)].map((m) => m[1]);
}

function main(argv) {
  const requireDigest = argv.includes("--require-digest");
  const yamlText = readFileSync(manifestPath, "utf8");
  const images = extractImages(yamlText);
  if (images.length === 0) {
    console.error('{"status":"FAIL","reason":"SIN_IMAGEN_EN_MANIFIESTO"}');
    process.exit(1);
  }

  const results = images.map((image) => evaluateImagePin(image));
  const failed = results.find((r) => r.status === "FAIL");
  const gated = results.find((r) => r.status === "EVIDENCE_GATED");

  if (failed) {
    console.error(JSON.stringify({ status: "FAIL", ...failed, manifest: "k8s/deployment.yaml" }));
    process.exit(1);
  }
  if (requireDigest && gated) {
    console.error(
      JSON.stringify({
        status: "FAIL",
        reason: "DIGEST_REQUERIDO_NO_RESUELTO",
        image: gated.image,
        manifest: "k8s/deployment.yaml",
        action: "Resolver image@sha256:... desde el registro y fijarlo en el manifiest.",
      }),
    );
    process.exit(1);
  }

  const status = gated ? "EVIDENCE_GATED" : "PASS";
  console.log(
    JSON.stringify({
      status,
      ...(gated ?? results[0]),
      manifest: "k8s/deployment.yaml",
      note: gated
        ? "Pin por tag versionado: falta evidencia de digest inmutable del registro (BLOCKED_ENVIRONMENT si el registro no es anónimo)."
        : "Imagen fijada por digest inmutable.",
    }),
  );
  process.exit(0);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath && resolve(fileURLToPath(import.meta.url)) === invokedPath) {
  main(process.argv.slice(2));
}
