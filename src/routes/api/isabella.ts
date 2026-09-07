import { createFileRoute } from "@tanstack/react-router";

// Autoridad única de routing: la lógica canónica vive en
// src/server-routes/api/isabella.ts. Este archivo solo delega
// (ver ADR-001-source-of-truth). No duplicar handlers aquí.
const loadHandler = async (method: string, context: unknown): Promise<Response> => {
  const module = (await import(/* @vite-ignore */ "../../server-routes/api/isabella")) as {
    Route: { options: { server: { handlers: Record<string, (ctx: unknown) => Promise<Response>> } } };
  };
  return module.Route.options.server.handlers[method](context);
};

export const Route = createFileRoute("/api/isabella")({
  server: { handlers: {
    POST: (context) => loadHandler("POST", context),
  } },
});
