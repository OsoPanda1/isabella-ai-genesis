export interface Attachment {
  id: string;
  kind: "image" | "audio";
  /** data URL completo (`data:<mime>;base64,...`). */
  dataUrl: string;
  mime: string;
  name: string;
  size: number;
}

export const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
]);

export function validateAttachment(file: Blob): void {
  if (!Number.isFinite(file.size) || file.size <= 0) {
    throw new Error("El archivo adjunto está vacío o tiene un tamaño inválido.");
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error(`El archivo adjunto excede el límite de ${humanSize(MAX_ATTACHMENT_BYTES)}.`);
  }
  const mime = file.type.split(";")[0]?.trim().toLowerCase() ?? "";
  if (mime && !ALLOWED_MIME.has(mime)) {
    throw new Error(`Tipo MIME de adjunto no permitido: ${mime}.`);
  }
}

export function fileToDataUrl(file: Blob): Promise<string> {
  validateAttachment(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onabort = () => reject(new Error("La lectura del archivo fue cancelada."));
    reader.readAsDataURL(file);
  });
}

/** Formato de contenedor aceptado por el gateway para `input_audio`. */
export function audioFormatFromMime(mime: string): string {
  const base = mime.split(";")[0]?.trim().toLowerCase() ?? "";
  if (base === "audio/mp4" || base === "audio/m4a" || base.includes("m4a")) return "m4a";
  if (base === "audio/ogg" || base.includes("ogg")) return "ogg";
  if (base === "audio/wav" || base === "audio/x-wav" || base.includes("wav")) return "wav";
  if (base === "audio/mpeg" || base.includes("mpeg") || base.includes("mp3")) return "mp3";
  return "webm";
}

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
