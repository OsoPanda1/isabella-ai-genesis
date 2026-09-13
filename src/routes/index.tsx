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

function Index() {
  return <IsabellaClientApp />;
}
