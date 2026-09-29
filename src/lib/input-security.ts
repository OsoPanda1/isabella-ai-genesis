const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EXTENSION = /^[a-z0-9]{1,12}$/i;

export const INPUT_LIMITS = Object.freeze({
  text: 20_000,
  title: 120,
  prompt: 2_000,
  skillPrompt: 20_000,
  executionInput: 20_000,
  payloadBytes: 1_048_576,
  artifactBytes: 25 * 1024 * 1024,
});

const ALLOWED_ARTIFACTS = Object.freeze({
  image: new Set(["image/png", "image/jpeg", "image/webp"]),
  audio: new Set(["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm"]),
});

export function sanitizeText(value: string, max = INPUT_LIMITS.text): string {
  if (typeof value !== "string") throw new Error("Input must be text");
  return value.replace(CONTROL_CHARS, "").trim().slice(0, max);
}

export function assertSafeId(value: string, field = "id"): string {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(value)) throw new Error(`Invalid ${field}`);
  return value;
}

export function validateArtifact(input: {
  kind: "image" | "audio";
  blob: Blob;
  extension: string;
}): void {
  if (!(input.blob instanceof Blob)) throw new Error("Invalid artifact payload");
  if (input.blob.size <= 0 || input.blob.size > INPUT_LIMITS.artifactBytes)
    throw new Error("Artifact exceeds the permitted size");
  if (!EXTENSION.test(input.extension)) throw new Error("Invalid artifact extension");
  const mime = input.blob.type.toLowerCase();
  const allowed = ALLOWED_ARTIFACTS[input.kind];
  if (!allowed.has(mime)) throw new Error(`Unsupported ${input.kind} content type`);
}

export function assertPagination(limit: number, max = 200): number {
  if (!Number.isInteger(limit) || limit < 1 || limit > max) throw new Error("Invalid pagination limit");
  return limit;
}
