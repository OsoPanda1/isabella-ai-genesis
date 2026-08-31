import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CommandLine } from "@/components/isabella/CommandLine";
import { MessageStream } from "@/components/isabella/MessageStream";
import { TelemetryPanel } from "@/components/isabella/TelemetryPanel";
import { ApiCatalogExplorer } from "@/components/isabella/ApiCatalogExplorer";
import { TerminalView } from "@/components/isabella/TerminalView";
import { MonetizationDashboard } from "@/components/isabella/MonetizationDashboard";
import { useIsabella } from "@/lib/useIsabella";

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

function Index() {
  const isabella = useIsabella();
  const [panel, setPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "cli" | "catalog" | "monetization">(
    "terminal",
  );
  const lastInput = useRef("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const send = (text: string) => {
    lastInput.current = text;
    void isabella.send(text);
  };

  const turns = isabella.messages.filter((m) => m.role === "user").length;

  return (
    <div className="min-h-screen">
      <header className="hairline sticky top-0 z-20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div>
              <h1 className="text-iridescent font-display text-[26px] leading-none tracking-tight sm:text-[32px]">
                Isabella Villaseñor
              </h1>
              <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.32em] text-muted-foreground">
                Nodo Cero · Real del Monte, Hidalgo · C.R.O.W.N.
              </p>
            </div>
            {/* Elegant Tab Switcher */}
            <div className="flex gap-4 border-b border-border/10 pb-0">
              <button
                onClick={() => setActiveTab("terminal")}
                className={`pb-1 px-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === "terminal"
                    ? "border-electric text-platinum"
                    : "border-transparent text-muted-foreground hover:text-platinum"
                }`}
              >
                Terminal
              </button>
              <button
                onClick={() => setActiveTab("cli")}
                className={`pb-1 px-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === "cli"
                    ? "border-electric text-platinum"
                    : "border-transparent text-muted-foreground hover:text-platinum"
                }`}
              >
                CLI Retro
              </button>
              <button
                onClick={() => setActiveTab("catalog")}
                className={`pb-1 px-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === "catalog"
                    ? "border-electric text-platinum"
                    : "border-transparent text-muted-foreground hover:text-platinum"
                }`}
              >
                Catálogo de API
              </button>
              <button
                onClick={() => setActiveTab("monetization")}
                className={`pb-1 px-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === "monetization"
                    ? "border-electric text-platinum"
                    : "border-transparent text-muted-foreground hover:text-platinum"
                }`}
              >
                Monetización
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "terminal" && (
              <>
                <span className="hidden font-mono text-[10px] tracking-[0.2em] text-muted-foreground sm:inline">
                  {isabella.preset.name.toUpperCase()}
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void isabella.openConversation(file).catch(() => {});
                  }}
                />
                <button
                  onClick={isabella.downloadConversation}
                  className="hidden rounded-lg border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-platinum sm:inline-block"
                >
                  Descargar
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="hidden rounded-lg border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-platinum sm:inline-block"
                >
                  Reabrir
                </button>
                <span
                  className={`size-2 rounded-full bg-electric ${isabella.isProcessing ? "animate-breathe" : ""}`}
                />
                <button
                  onClick={() => setPanel((p) => !p)}
                  className="rounded-lg border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:hidden"
                >
                  {panel ? "Cerrar" : "Telemetría"}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-8">
        {activeTab === "terminal" && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
            <section className="flex min-w-0 flex-col gap-5">
              <div className="glass min-h-[52vh] flex-1 overflow-y-auto rounded-3xl">
                <MessageStream
                  messages={isabella.messages}
                  onRetry={() => lastInput.current && send(lastInput.current)}
                />
              </div>
              <CommandLine
                onSend={send}
                onStop={isabella.stop}
                onReset={isabella.reset}
                isProcessing={isabella.isProcessing}
              />
            </section>

            <div className={panel ? "block" : "hidden lg:block"}>
              <TelemetryPanel
                presetId={isabella.presetId}
                setPresetId={isabella.setPresetId}
                decision={isabella.decision}
                tokens={isabella.tokens}
                turns={turns}
                isProcessing={isabella.isProcessing}
              />
            </div>
          </div>
        )}

        {activeTab === "cli" && (
          <div className="animate-fade-in">
            <TerminalView />
          </div>
        )}

        {activeTab === "catalog" && (
          <div className="animate-fade-in">
            <ApiCatalogExplorer />
          </div>
        )}

        {activeTab === "monetization" && (
          <div className="animate-fade-in">
            <MonetizationDashboard />
          </div>
        )}
      </main>
    </div>
  );
}
