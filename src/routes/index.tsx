import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Terminal as TerminalIcon,
  MessageSquare,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  Activity,
  TrendingUp,
  ShieldAlert,
  Sliders,
  LogOut,
  FolderLock,
  Download,
  FolderOpen,
  RefreshCw,
} from "lucide-react";
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

  // Sidebar State for 3-part retractable accordions
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [upperOpen, setUpperOpen] = useState(true);
  const [middleOpen, setMiddleOpen] = useState(true);
  const [lowerOpen, setLowerOpen] = useState(true);

  const lastInput = useRef("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const send = (text: string) => {
    lastInput.current = text;
    void isabella.send(text);
  };

  const turns = isabella.messages.filter((m) => m.role === "user").length;

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-all duration-300">
      {/* ==============================================================
          CANONICAL 3-PART RETRACTABLE LEFT SIDEBAR WITH CRYSTAL GLOWS
         ============================================================== */}
      <aside
        id="isabella-sidebar"
        className={`glass h-screen sticky top-0 z-30 flex flex-col justify-between border-r border-border/20 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-[310px]" : "w-[75px]"
        }`}
      >
        <div className="flex flex-col overflow-y-auto overflow-x-hidden flex-1 select-none">
          {/* Logo & Brand block */}
          <div className="p-4 border-b border-border/15 flex flex-col items-center justify-center shrink-0">
            <div className="relative group">
              {/* Outer logo glowing ring */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-electric via-iris to-pearl opacity-40 blur-md group-hover:opacity-75 transition-all duration-500" />
              <img
                src="/src/assets/logo-isabella.jpeg"
                alt="Isabella Logo"
                className={`relative rounded-xl border border-border/40 object-cover transition-all duration-300 ${
                  isSidebarOpen ? "size-18" : "size-10"
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
            {isSidebarOpen && (
              <div className="mt-3 text-center animate-rise">
                <h2 className="text-iridescent font-display text-[16px] font-bold tracking-wide">
                  Isabella Villaseñor AI
                </h2>
                <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-muted-foreground mt-0.5">
                  Nacimos para guiar, no para explotar
                </p>
              </div>
            )}
          </div>

          {/* Accordion List Container */}
          <div className="p-2 space-y-4 flex-1">
            {/* 1. UPPER NAVBAR BLOCK: COGNICIÓN E INTERFACES */}
            <div className="space-y-1">
              {isSidebarOpen ? (
                <button
                  onClick={() => setUpperOpen(!upperOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-muted-foreground hover:text-platinum font-mono text-[10px] uppercase tracking-wider transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-electric animate-pulse" />
                    Cognición & Flujos
                  </span>
                  {upperOpen ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </button>
              ) : (
                <div className="w-full flex justify-center py-1">
                  <Sparkles className="size-4.5 text-electric animate-pulse" />
                </div>
              )}

              {(!isSidebarOpen || upperOpen) && (
                <div className="space-y-1 animate-rise">
                  <button
                    onClick={() => setActiveTab("terminal")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-[11.5px] transition-all crystal-glow-electric ${
                      activeTab === "terminal"
                        ? "bg-electric/15 text-electric border border-electric/30 font-semibold shadow-[0_0_15px_-4px_rgba(112,102,249,0.3)]"
                        : "text-muted-foreground hover:bg-secondary/20 hover:text-platinum border border-transparent"
                    }`}
                  >
                    <MessageSquare className="size-4 shrink-0" />
                    {isSidebarOpen && <span className="truncate">Terminal Cognitivo</span>}
                  </button>

                  <button
                    onClick={() => setActiveTab("cli")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-[11.5px] transition-all crystal-glow-electric ${
                      activeTab === "cli"
                        ? "bg-electric/15 text-electric border border-electric/30 font-semibold shadow-[0_0_15px_-4px_rgba(112,102,249,0.3)]"
                        : "text-muted-foreground hover:bg-secondary/20 hover:text-platinum border border-transparent"
                    }`}
                  >
                    <TerminalIcon className="size-4 shrink-0" />
                    {isSidebarOpen && <span className="truncate">Consola Retro CLI</span>}
                  </button>
                </div>
              )}
            </div>

            {/* 2. MIDDLE NAVBAR BLOCK: CONTRATOS & SERVICIOS */}
            <div className="space-y-1">
              {isSidebarOpen ? (
                <button
                  onClick={() => setMiddleOpen(!middleOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-muted-foreground hover:text-platinum font-mono text-[10px] uppercase tracking-wider transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="size-3.5 text-crown" />
                    Catálogo & Contratos
                  </span>
                  {middleOpen ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </button>
              ) : (
                <div className="w-full flex justify-center py-1">
                  <Layers className="size-4.5 text-crown" />
                </div>
              )}

              {(!isSidebarOpen || middleOpen) && (
                <div className="space-y-1 animate-rise">
                  <button
                    onClick={() => setActiveTab("catalog")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-[11.5px] transition-all crystal-glow-crown ${
                      activeTab === "catalog"
                        ? "bg-crown/15 text-crown border border-crown/30 font-semibold shadow-[0_0_15px_-4px_rgba(180,112,249,0.3)]"
                        : "text-muted-foreground hover:bg-secondary/20 hover:text-platinum border border-transparent"
                    }`}
                  >
                    <BookOpen className="size-4 shrink-0" />
                    {isSidebarOpen && <span className="truncate">Catálogo de APIs</span>}
                  </button>

                  {isSidebarOpen && (
                    <div className="px-3 py-2 mt-1 mx-1 rounded-xl bg-secondary/15 border border-border/20 text-[10px] text-muted-foreground font-mono">
                      <div className="flex items-center justify-between mb-1">
                        <span>Filtro SAST:</span>
                        <span className="text-emerald-400 font-bold">ACTIVO</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Gateway:</span>
                        <span className="text-electric font-semibold">C.R.O.W.N.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. LOWER NAVBAR BLOCK: SOBERANÍA & FINANZAS */}
            <div className="space-y-1">
              {isSidebarOpen ? (
                <button
                  onClick={() => setLowerOpen(!lowerOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-muted-foreground hover:text-platinum font-mono text-[10px] uppercase tracking-wider transition-all"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="size-3.5 text-emerald-400" />
                    Soberanía & Cuotas
                  </span>
                  {lowerOpen ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </button>
              ) : (
                <div className="w-full flex justify-center py-1">
                  <TrendingUp className="size-4.5 text-emerald-400" />
                </div>
              )}

              {(!isSidebarOpen || lowerOpen) && (
                <div className="space-y-1 animate-rise">
                  <button
                    onClick={() => setActiveTab("monetization")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-[11.5px] transition-all crystal-glow-emerald ${
                      activeTab === "monetization"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-[0_0_15px_-4px_rgba(52,211,153,0.3)]"
                        : "text-muted-foreground hover:bg-secondary/20 hover:text-platinum border border-transparent"
                    }`}
                  >
                    <TrendingUp className="size-4 shrink-0" />
                    {isSidebarOpen && <span className="truncate">Suscripción y Cuotas</span>}
                  </button>

                  {isSidebarOpen && (
                    <div className="p-3 mx-1 mt-1.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center crystal-glow-emerald">
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-semibold">
                        Límite Constitucional
                      </span>
                      <span className="block font-mono text-[11.5px] font-bold text-platinum mt-0.5">
                        Activo: Plan Gratuito
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer & Toggle Collapse controller */}
        <div className="p-3 border-t border-border/15 shrink-0 flex flex-col gap-2">
          {isSidebarOpen && (
            <div className="flex flex-col gap-1.5 p-2 bg-secondary/15 rounded-2xl border border-border/20 text-[10.5px] font-mono animate-rise">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Operador:</span>
                <span className="text-platinum truncate max-w-[120px] font-semibold">Soberano</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Región:</span>
                <span className="text-platinum font-semibold">Nodo 0 (Hgo)</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-xl bg-secondary/25 hover:bg-secondary/45 text-muted-foreground hover:text-platinum transition-all border border-border/30 crystal-glow-electric"
          >
            {isSidebarOpen ? (
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                <ChevronLeft className="size-4" /> Contraer Panel
              </span>
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        </div>
      </aside>

      {/* ==============================================================
          MAIN CONTENT VIEWPORT
         ============================================================== */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Modern compact Header bar */}
        <header className="hairline bg-background/40 backdrop-blur-xl shrink-0 z-20">
          <div className="flex items-center justify-between gap-4 px-6 py-3.5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h1 className="text-platinum font-mono text-[13px] font-bold uppercase tracking-wider leading-none">
                  Isabella C.R.O.W.N. Terminal
                </h1>
                <p className="text-[9.5px] text-muted-foreground font-mono mt-0.5 uppercase tracking-widest">
                  {activeTab === "terminal" && `Conexión Activa: ${isabella.preset.name}`}
                  {activeTab === "cli" && "Consola Retro Directa"}
                  {activeTab === "catalog" && "Gobernanza de APIs e Invocaciones"}
                  {activeTab === "monetization" && "Tablero de Consumo Soberano"}
                </p>
              </div>
            </div>

            {/* Conversation actions (Rendered only on terminal tab) */}
            <div className="flex items-center gap-2">
              {activeTab === "terminal" && (
                <>
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
                    className="rounded-xl border border-border/30 bg-secondary/15 hover:bg-secondary/35 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground transition-all hover:text-platinum flex items-center gap-1.5 crystal-glow-electric"
                  >
                    <Download className="size-3" /> Descargar
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="rounded-xl border border-border/30 bg-secondary/15 hover:bg-secondary/35 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground transition-all hover:text-platinum flex items-center gap-1.5 crystal-glow-electric"
                  >
                    <FolderOpen className="size-3" /> Reabrir
                  </button>
                  <button
                    onClick={() => setPanel((p) => !p)}
                    className="rounded-xl border border-border/30 bg-secondary/15 hover:bg-secondary/35 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground transition-all hover:text-platinum lg:hidden crystal-glow-electric"
                  >
                    {panel ? "Cerrar" : "Telemetría"}
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Body Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === "terminal" && (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px] items-stretch h-full max-w-[1450px] mx-auto">
              <section className="flex min-w-0 flex-col gap-4">
                <div className="glass min-h-[56vh] flex-1 overflow-y-auto rounded-3xl p-1 crystal-glow-electric">
                  <MessageStream
                    messages={isabella.messages}
                    onRetry={() => lastInput.current && send(lastInput.current)}
                  />
                </div>
                <div className="crystal-glow-electric rounded-2xl">
                  <CommandLine
                    onSend={send}
                    onStop={isabella.stop}
                    onReset={isabella.reset}
                    isProcessing={isabella.isProcessing}
                  />
                </div>
              </section>

              <div
                className={`${panel ? "block animate-rise" : "hidden lg:block"} crystal-glow-electric rounded-3xl overflow-hidden`}
              >
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
            <div className="animate-rise max-w-[1300px] mx-auto crystal-glow-electric rounded-3xl overflow-hidden">
              <TerminalView />
            </div>
          )}

          {activeTab === "catalog" && (
            <div className="animate-rise max-w-[1300px] mx-auto crystal-glow-crown rounded-3xl overflow-hidden">
              <ApiCatalogExplorer />
            </div>
          )}

          {activeTab === "monetization" && (
            <div className="animate-rise max-w-[1300px] mx-auto crystal-glow-emerald rounded-3xl overflow-hidden">
              <MonetizationDashboard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
