import { loadConfig } from "../config";

const MUX_API_BASE = "https://api.mux.com";
const MUX_REQUEST_TIMEOUT_MS = 15_000;
const MUX_UPLOAD_TIMEOUT_SECONDS = 3600;

export const MUX_ASSET_ID_PATTERN = /^[A-Za-z0-9_-]{3,128}$/;

export class MuxUnavailableError extends Error {
  readonly code = "MUX_UNAVAILABLE";
  constructor(message: string) {
    super(message);
    this.name = "MuxUnavailableError";
  }
}

export class MuxApiError extends Error {
  readonly code = "MUX_API_ERROR";
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "MuxApiError";
    this.status = status;
  }
}

export interface MuxDirectUpload {
  uploadId: string;
  uploadUrl: string;
  assetId: string;
  timeoutSeconds: number;
}

export type MuxAssetStatus = "queued" | "processing" | "ready" | "errored" | "unknown";

export interface MuxAssetState {
  assetId: string;
  status: MuxAssetStatus;
  playbackId?: string;
  durationSeconds?: number;
  aspectRatio?: string;
  errorMessage?: string;
}

function credentials(): { id: string; secret: string } {
  const cfg = loadConfig();
  const id = cfg.MUX_TOKEN_ID?.trim();
  const secret = cfg.MUX_TOKEN_SECRET?.trim();
  if (!id || !secret)
    throw new MuxUnavailableError(
      "Mux no está configurado: faltan MUX_TOKEN_ID y MUX_TOKEN_SECRET.",
    );
  return { id, secret };
}

async function muxRequest<T>(pathname: string, init?: RequestInit): Promise<T> {
  const { id, secret } = credentials();
  const authorization = `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
  let response: Response;
  try {
    response = await fetch(`${MUX_API_BASE}${pathname}`, {
      ...init,
      headers: {
        accept: "application/json",
        authorization,
        ...(init?.body ? { "content-type": "application/json" } : {}),
        ...init?.headers,
      },
      signal: AbortSignal.timeout(MUX_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new MuxUnavailableError(
      `Mux no responde: ${error instanceof Error ? error.message : "error de red"}`,
    );
  }
  const text = await response.text();
  if (!response.ok) throw new MuxApiError(muxErrorMessage(text), response.status);
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new MuxApiError("Mux devolvió una respuesta no JSON.", response.status);
  }
}

function muxErrorMessage(body: string): string {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string; type?: string } };
    const detail = parsed?.error?.message || parsed?.error?.type;
    return detail ? `Mux rechazó la operación: ${detail}.` : `Mux rechazó la operación.`;
  } catch {
    return `Mux rechazó la operación.`;
  }
}

interface MuxUploadResponse {
  id: string;
  url: string;
  asset_id: string;
}

export async function createMuxDirectUpload(corsOrigin: string): Promise<MuxDirectUpload> {
  credentials();
  const body = await muxRequest<MuxUploadResponse>("/video/v1/uploads", {
    method: "POST",
    body: JSON.stringify({
      cors_origin: corsOrigin,
      timeout: MUX_UPLOAD_TIMEOUT_SECONDS,
      playback_policy: ["public"],
    }),
  });
  if (!body?.id || !body.url || !body.asset_id)
    throw new MuxApiError("Mux no devolvió un upload firmado completo.", 200);
  return {
    uploadId: body.id,
    uploadUrl: body.url,
    assetId: body.asset_id,
    timeoutSeconds: MUX_UPLOAD_TIMEOUT_SECONDS,
  };
}

interface MuxAssetResponse {
  id: string;
  status: string;
  duration?: number;
  aspect_ratio?: string;
  playback_ids?: Array<{ id: string; policy?: string }>;
  errors?: Array<{ message?: string }>;
}

function normalizeAssetStatus(status: string): MuxAssetStatus {
  switch (status) {
    case "queued":
      return "queued";
    case "preparing":
      return "processing";
    case "ready":
      return "ready";
    case "errored":
      return "errored";
    default:
      return "unknown";
  }
}

export async function getMuxAsset(assetId: string): Promise<MuxAssetState> {
  if (!MUX_ASSET_ID_PATTERN.test(assetId))
    throw new MuxApiError("Identificador de asset inválido.", 400);
  const asset = await muxRequest<MuxAssetResponse>(
    `/video/v1/assets/${encodeURIComponent(assetId)}`,
  );
  const playbackId =
    asset?.playback_ids?.find((entry) => entry.policy !== "signed")?.id ??
    asset?.playback_ids?.[0]?.id;
  return {
    assetId: asset?.id ?? assetId,
    status: normalizeAssetStatus(asset?.status ?? ""),
    playbackId,
    durationSeconds: typeof asset?.duration === "number" ? asset.duration : undefined,
    aspectRatio: asset?.aspect_ratio,
    errorMessage: asset?.errors?.[0]?.message,
  };
}
