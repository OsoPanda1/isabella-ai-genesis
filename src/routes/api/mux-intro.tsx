import { createFileRoute } from "@tanstack/react-router";
import { Route as ServerRoute } from "../../server-routes/api/mux-intro";

type Handlers = { GET: (ctx: unknown) => Promise<Response> };
const server = ServerRoute.options.server;
if (!server) throw new Error("Ruta servidora Mux sin handlers.");
const handlers = server.handlers as unknown as Handlers;

export const Route = createFileRoute("/api/mux-intro")({
  server: { handlers: { GET: (context) => handlers.GET(context) } },
});
