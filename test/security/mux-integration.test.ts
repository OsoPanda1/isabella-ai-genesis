import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  MuxApiError,
  MuxUnavailableError,
  createMuxDirectUpload,
  getMuxAsset,
} from "@/lib/mux/mux.server";

const TOKEN_ID = "mux-token-id-0001";
const TOKEN_SECRET = "mux-token-secret-0001";
const CORS_ORIGIN = "https://isabella.example";

const MANAGED_KEYS = ["ISABELLA_RUNTIME_MODE", "MUX_TOKEN_ID", "MUX_TOKEN_SECRET"] as const;
let saved: Record<string, string | undefined>;

function setEnv(values: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

beforeEach(() => {
  saved = Object.fromEntries(MANAGED_KEYS.map((key) => [key, process.env[key]]));
  setEnv({ ISABELLA_RUNTIME_MODE: "development" });
});

afterEach(() => {
  setEnv(saved);
  vi.unstubAllGlobals();
});

describe("Mux server integration", () => {
  it("fails closed when the account credentials are absent", async () => {
    setEnv({ MUX_TOKEN_ID: undefined, MUX_TOKEN_SECRET: undefined });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(createMuxDirectUpload(CORS_ORIGIN)).rejects.toBeInstanceOf(
      MuxUnavailableError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never returns the account credential to the caller", async () => {
    setEnv({ MUX_TOKEN_ID: TOKEN_ID, MUX_TOKEN_SECRET: TOKEN_SECRET });
    const fetchMock = vi.fn().mockResolvedValue(
      json({
        id: "upload-1",
        url: "https://upload.mux.com/upload-1",
        asset_id: "asset-1",
        status: "waiting",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const upload = await createMuxDirectUpload(CORS_ORIGIN);
    expect(upload).toEqual({
      uploadId: "upload-1",
      uploadUrl: "https://upload.mux.com/upload-1",
      assetId: "asset-1",
      timeoutSeconds: 3600,
    });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.mux.com/video/v1/uploads");
    const headers = init.headers as Record<string, string>;
    expect(headers.authorization).toMatch(/^Basic /);
    expect(headers.authorization).not.toContain(TOKEN_SECRET);
    expect(String(init.body)).toContain(CORS_ORIGIN);
    expect(JSON.stringify(upload)).not.toContain(TOKEN_SECRET);
    expect(JSON.stringify(upload)).not.toContain(TOKEN_ID);
  });

  it("rejects a malformed asset id before reaching the network", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getMuxAsset("../etc/passwd")).rejects.toBeInstanceOf(MuxApiError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps the asset state and prefers a public playback id", async () => {
    setEnv({ MUX_TOKEN_ID: TOKEN_ID, MUX_TOKEN_SECRET: TOKEN_SECRET });
    const fetchMock = vi.fn().mockResolvedValue(
      json({
        id: "asset-1",
        status: "ready",
        duration: 12.5,
        aspect_ratio: "16:9",
        playback_ids: [
          { id: "signed-playback", policy: "signed" },
          { id: "public-playback", policy: "public" },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const asset = await getMuxAsset("asset-1");
    expect(asset).toEqual({
      assetId: "asset-1",
      status: "ready",
      playbackId: "public-playback",
      durationSeconds: 12.5,
      aspectRatio: "16:9",
      errorMessage: undefined,
    });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.mux.com/video/v1/assets/asset-1");
    expect((init.headers as Record<string, string>).authorization).toMatch(/^Basic /);
  });

  it("reports an API rejection as MuxApiError without leaking the credential", async () => {
    setEnv({ MUX_TOKEN_ID: TOKEN_ID, MUX_TOKEN_SECRET: TOKEN_SECRET });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        json({ error: { type: "invalid-credentials", message: "bad token" } }, 401),
      ),
    );

    const error = await createMuxDirectUpload(CORS_ORIGIN).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(MuxApiError);
    expect((error as MuxApiError).status).toBe(401);
    expect((error as MuxApiError).message).not.toContain(TOKEN_SECRET);
  });
});
