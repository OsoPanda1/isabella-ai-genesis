import { createFileRoute } from "@tanstack/react-router";

const loadHandler = async (context: unknown): Promise<Response> => {
  const module = (await import(/* @vite-ignore */ "../../../server-routes/api/health")) as {
    Route: { options: { server: { handlers: { GET: (ctx: unknown) => Promise<Response> } } } };
  };
  return module.Route.options.server.handlers.GET({ request: new Request(new URL("/api/health/live", (context as { request: Request }).request.url)) });
};

export const Route = createFileRoute("/api/health/live")({
  server: { handlers: { GET: (context) => loadHandler(context) } },
});
