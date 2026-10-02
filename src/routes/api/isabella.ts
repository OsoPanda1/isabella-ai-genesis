import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { handleIsabellaChat, toGatewayContext } from "@/lib/isabella-chat-gateway";

export const Route = createFileRoute("/api/isabella")({
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
