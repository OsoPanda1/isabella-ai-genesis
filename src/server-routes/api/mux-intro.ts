import { loadConfig } from "@/lib/config";
import { SecuritySystem } from "@/lib/security";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: SecuritySystem.injectSecureHeaders(
      new Headers({
        "content-type": "application/json; charset=utf-8",
        "cache-control": "private, max-age=60",
      }),
    ),
  });
}

export const Route = {
  options: {
    server: {
      handlers: {
        GET: async () => {
          const config = loadConfig();
          const tokenId = config.MUX_TOKEN_ID;
          const tokenSecret = config.MUX_TOKEN_SECRET;
          const requestedAssetId = config.MUX_INTRO_ASSET_ID;

          // Never guess which Mux asset is the canonical intro. Production must
          // explicitly bind the intro to an immutable asset id.
          if (!tokenId || !tokenSecret || !requestedAssetId) {
            return json({ enabled: false });
          }

          const authorization = `Basic ${Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64")}`;
          const endpoint = `https://api.mux.com/video/v1/assets/${encodeURIComponent(requestedAssetId)}`;

          try {
            const response = await SecuritySystem.fetchSafeUpstream(endpoint, {
              headers: { authorization, accept: "application/json" },
              signal: AbortSignal.timeout(
                Math.min(config.LLM_UPSTREAM_TIMEOUT_MS, 5000),
              ),
            });
            if (!response.ok) return json({ enabled: false }, 502);

            const payload = (await response.json()) as {
              data?: {
                id?: string;
                status?: string;
                playback_ids?: Array<{ id?: string; policy?: string }>;
              };
            };
            const asset = payload.data;
            if (
              !asset ||
              asset.id !== requestedAssetId ||
              asset.status !== "ready"
            ) {
              return json({ enabled: false });
            }

            const playbackId = asset.playback_ids?.find(
              (id) => id.policy === "public",
            )?.id;
            if (!playbackId) return json({ enabled: false });

            return json({ enabled: true, playbackId, assetId: asset.id });
          } catch {
            return json({ enabled: false }, 503);
          }
        },
      },
    },
  },
};

export const MuxIntroRoute = Route;
