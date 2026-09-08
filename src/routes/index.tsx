import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const IsabellaClientApp = lazy(() => import("@/components/isabella/IsabellaClientApp"));

const TITLE = "Isabella Villaseñor AI — Terminal Cognitivo C.R.O.W.N.";
const DESC =
  "Terminal cognitivo de Isabella Villaseñor AI: orquestación C.R.O.W.N. con ISA, SOPHIA, ORION y ARGUS, Policy Gate en vivo y telemetría desde Nodo Cero, Real del Monte, Hidalgo.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function ServerSafeFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-4 size-10 animate-pulse rounded-full border border-electric/40 bg-electric/10" />
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Inicializando Isabella C.R.O.W.N.
        </p>
        <p className="mt-2 font-mono text-[9px] text-muted-foreground/70">
          Nodo de presentación disponible · módulos interactivos cargando
        </p>
      </div>
    </main>
  );
}

function Index() {
  // Hard client boundary: React SSR may resolve lazy components while rendering.
  // Do not even initialize the browser-only Isabella graph on the server.
  if (typeof window === "undefined") return <ServerSafeFallback />;

  return (
    <Suspense fallback={<ServerSafeFallback />}>
      <IsabellaClientApp />
    </Suspense>
  );
}
