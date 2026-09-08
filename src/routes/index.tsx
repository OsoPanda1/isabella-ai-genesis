import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";

const IsabellaClientApp = lazy(() => import("@/components/isabella/IsabellaClientApp"));

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

function PublicShell({ onEnter }: { onEnter?: () => void }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
        color: "#f5f7ff",
        background:
          "radial-gradient(circle at 50% 35%, rgba(126,92,255,.18), transparent 34%), radial-gradient(circle at 20% 80%, rgba(41,211,255,.10), transparent 30%), #05060b",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <section style={{ width: "min(920px, 100%)", textAlign: "center" }}>
        <div
          aria-hidden="true"
          style={{
            width: 92,
            height: 92,
            margin: "0 auto 28px",
            borderRadius: 28,
            border: "1px solid rgba(180,150,255,.45)",
            background:
              "radial-gradient(circle at 35% 30%, #fff, #b9a5ff 22%, #5b3bb8 48%, #0b0d18 72%)",
            boxShadow: "0 0 70px rgba(125,91,255,.35)",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 11,
            letterSpacing: ".28em",
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          Nodo Cero · Real del Monte · Hidalgo · México
        </p>
        <h1
          style={{
            margin: "18px 0 12px",
            fontSize: "clamp(40px, 8vw, 82px)",
            lineHeight: 0.95,
            letterSpacing: "-.045em",
            fontWeight: 650,
          }}
        >
          Isabella
        </h1>
        <p style={{ margin: 0, fontSize: "clamp(17px, 2.4vw, 24px)", color: "#cbd5e1" }}>
          Federated Governed Artificial Intelligence System
        </p>
        <p
          style={{
            maxWidth: 680,
            margin: "22px auto 0",
            lineHeight: 1.7,
            color: "#8f98aa",
            fontSize: 15,
          }}
        >
          Una interfaz cognitiva gobernada donde capacidad no implica autoridad: inferencia,
          seguridad, memoria, políticas y trazabilidad se coordinan bajo supervisión humana.
        </p>
        <div
          style={{
            marginTop: 34,
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onEnter}
            style={{
              cursor: onEnter ? "pointer" : "default",
              border: "1px solid rgba(180,150,255,.55)",
              borderRadius: 14,
              padding: "13px 22px",
              background: "linear-gradient(135deg,#7c5cff,#4d36a8)",
              color: "white",
              fontWeight: 650,
              boxShadow: "0 12px 40px rgba(92,65,190,.28)",
            }}
          >
            {onEnter ? "Entrar a Isabella" : "Inicializando Isabella…"}
          </button>
          <a
            href="/api/health/live"
            style={{
              border: "1px solid rgba(148,163,184,.22)",
              borderRadius: 14,
              padding: "13px 22px",
              color: "#cbd5e1",
              textDecoration: "none",
              background: "rgba(255,255,255,.035)",
            }}
          >
            Estado del nodo
          </a>
        </div>
        <div
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: 10,
          }}
        >
          {["C.R.O.W.N.", "AEGIS", "Gobernanza", "Trazabilidad"].map((item) => (
            <div
              key={item}
              style={{
                padding: "14px 12px",
                borderRadius: 14,
                border: "1px solid rgba(148,163,184,.12)",
                background: "rgba(255,255,255,.025)",
                color: "#aab3c4",
                fontSize: 11,
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function ClientFallback() {
  return <PublicShell />;
}

function Index() {
  const [entered, setEntered] = useState(false);

  if (typeof window === "undefined" || !entered) {
    return <PublicShell onEnter={() => setEntered(true)} />;
  }

  return (
    <Suspense fallback={<ClientFallback />}>
      <IsabellaClientApp />
    </Suspense>
  );
}
