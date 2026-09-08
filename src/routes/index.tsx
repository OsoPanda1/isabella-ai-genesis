import { createFileRoute } from "@tanstack/react-router";
import IsabellaClientApp from "@/components/isabella/IsabellaClientApp";

const TITLE = "Isabella Villaseñor AI — FGAIS";
const DESC =
  "Isabella Villaseñor AI: sistema federado de inteligencia artificial gobernada, con C.R.O.W.N., seguridad, trazabilidad e inferencia federada.";

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

function ClientFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-5 size-12 animate-pulse rounded-full border border-electric/40 bg-electric/10 shadow-[0_0_40px_rgba(42,180,255,.2)]" />
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Inicializando núcleo C.R.O.W.N.
        </p>
      </section>
    </main>
  );
}

function Index() {
  return <IsabellaClientApp />;
}
