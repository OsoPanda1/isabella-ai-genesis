import { config } from "@/lib/config";

const MUX_API_ORIGIN = "https://api.mux.com";
const ID_PATTERN = /^[A-Za-z0-9_-]{3,128}$/;

export class MuxUnavailableError extends Error {
  readonly code = "MUX_UNAVAILABLE";
  constructor(message = "Mux no está configurado en este entorno.") {
    super(message);
    this.name = "MuxUnavailableError";
  }
}

export class MuxApiError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "MuxApiError";
    this.status = status;
    this.code = code;
  }
}

type MuxUploadData = {
  id?: string;
  url?: string;
  timeout?: number;
  status?: string;
  asset_id?: string;
  new_asset_settings?: Record<string, unknown>;
  cors_origin?: string;
};

type MuxAssetData = {
  id?: string;
  status?: string;
  playback_ids?: Array<{ id?: string; policy?: string }>;
  duration?: number;
  aspect_ratio?: string;
  created_at?: number;
};

function credentials(): { id: string; secret: string } {
  const cfg = config();
  const id = cfg.MUX_TOKEN_ID?.trim() ?? "";
  const secret = cfg.MUX_TOKEN_SECRET?.trim() ?? "";
  if (!id || !secret) throw new MuxUnavailableError();
  return { id, secret };
}

function basicAuth(id: string, secret: string): string {
  return "Basic " + Buffer.from(id + ":" + secret, "utf8").toString("base64");
}

async function muxRequest<T>(path: string, init: RequestInit): Promise<T> {
  const { id, secret } = credentials();
  const response = await fetch(MUX_API_ORIGIN + path, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init.body ? { "content-type": "application/json" } : {}),
      authorization: basicAuth(id, secret),
      ...init.headers,
    },
    signal: init.signal ?? AbortSignal.timeout(10_000),
  });
  const raw = await response.text();
  let parsed: { data?: T; error?: { type?: string; messages?: string[] } } = {};
  try {
    parsed = raw ? (JSON.parse(raw) as typeof parsed) : {};
  } catch {
    parsed = {};
  }
  if (!response.ok) {
    const code = parsed.error?.type || "MUX_API_ERROR";
    const message = parsed.error?.messages?.[0] || "Mux rechazó la operación.";
    throw new MuxApiError(response.status, code, message.slice(0, 500));
  }
  return (parsed.data ?? {}) as T;
}

export async function createMuxDirectUpload(publicUrl: string): Promise<{
  id: string;
  url: string;
  timeout: number;
  status: string;
  assetId: string | null;
}> {
  const origin = new URL(publicUrl).origin;
  const data = await muxRequest<MuxUploadData>("/video/v1/uploads", {
    method: "POST",
    body: JSON.stringify({
      cors_origin: origin,
      timeout: 3600,
      new_asset_settings: {
        playback_policies: ["public"],
        video_quality: "basic",
      },
    }),
  });
  if (!data.id || !data.url)
    throw new MuxApiError(502, "MUX_RESPONSE_INVALID", "Mux devolvió un upload incompleto.");
  return {
    id: data.id,
    url: data.url,
    timeout: Number(data.timeout ?? 3600),
    status: String(data.status ?? "waiting"),
    assetId: data.asset_id && ID_PATTERN.test(data.asset_id) ? data.asset_id : null,
  };
}

export async function getMuxAsset(assetId: string): Promise<{
  id: string;
  status: string;
  playbackIds: Array<{ id: string; policy: string }>;
  duration: number | null;
  aspectRatio: string | null;
  createdAt: string | null;
}> {
  const id = assetId.trim();
  if (!ID_PATTERN.test(id))
    throw new MuxApiError(400, "INVALID_ASSET_ID", "Identificador de asset Mux inválido.");
  const data = await muxRequest<MuxAssetData>("/video/v1/assets/" + encodeURIComponent(id), {
    method: "GET",
  });
  if (!data.id)
    throw new MuxApiError(502, "MUX_RESPONSE_INVALID", "Mux devolvió un asset incompleto.");
  return {
    id: data.id,
    status: String(data.status ?? "unknown"),
    playbackIds: (data.playback_ids ?? [])
      .filter((item) => typeof item.id === "string" && ID_PATTERN.test(item.id))
      .map((item) => ({ id: String(item.id), policy: String(item.policy ?? "unknown") })),
    duration: Number.isFinite(data.duration) ? Number(data.duration) : null,
    aspectRatio: typeof data.aspect_ratio === "string" ? data.aspect_ratio : null,
    createdAt: Number.isFinite(data.created_at)
      ? new Date(Number(data.created_at) * 1000).toISOString()
      : null,
  };
}
