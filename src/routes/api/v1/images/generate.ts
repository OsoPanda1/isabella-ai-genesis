import { createFileRoute } from "@tanstack/react-router";
import { Route as ServerRoute } from "../../../../server-routes/api/images/generate";

type Handlers = { POST: (ctx: unknown) => Promise<Response> };
const server = ServerRoute.options.server;
if (!server) throw new Error("Ruta images/generate sin handlers.");
const handlers = server.handlers as unknown as Handlers;

// @ts-expect-error - route generated at build time
export const Route = createFileRoute("/api/v1/images/generate")({
  server: { handlers: { POST: (context) => handlers.POST(context) } },
});
