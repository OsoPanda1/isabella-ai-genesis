import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { handleIsabellaChat, toGatewayContext } from "@/lib/isabella-chat-gateway";

/**
 * Canonical v1 API compatibility surface.
 * The UI route /api/isabella and the documented /api/v1/isabella endpoint
 * intentionally share exactly the same governed implementation.
 */
export const Route = createFileRoute("/api/v1/isabella")({
  server: {
    handlers: {
      POST: withSovereignAuth("chat", "execute", async (context, request) =>
        handleIsabellaChat(
          toGatewayContext(context),
          request,
        ),
      ),
    },
  },
});
