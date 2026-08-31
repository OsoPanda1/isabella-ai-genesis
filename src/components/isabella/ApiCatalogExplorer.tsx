import { useState, useMemo, useEffect } from "react";
import { DOMAINS, CATALOG_ENTRIES, type CatalogEntry } from "@/lib/api-catalog";
import {
  Search,
  Filter,
  Terminal,
  Cpu,
  Shield,
  Layers,
  Database,
  Play,
  CheckCircle,
  X,
  Code,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  POST: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PATCH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DELETE: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  PUT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

interface SimulationResult {
  traceId: string;
  contractId: string;
  method: string;
  path: string;
  governanceScore: number;
  decisionStatus: string;
  riskLevel: string;
  allowedTools: string[];
  latencyMs: number;
  auditTrail: Array<{ eventType: string; message: string; timestamp: string }>;
  responsePayload: Record<string, unknown>;
}

export function ApiCatalogExplorer() {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEntry, setActiveEntry] = useState<CatalogEntry | null>(null);
  const [simulateParams, setSimulateParams] = useState<string>(
    '{\n  "tenantId": "tamv-node-zero",\n  "actorId": "usr-anubis",\n  "clientId": "isabella-cli-v4"\n}',
  );
  const [isSimulating, setIsProcessing] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Set first entry as default active details
  useEffect(() => {
    if (CATALOG_ENTRIES.length > 0 && !activeEntry) {
      setActiveEntry(CATALOG_ENTRIES[0] || null);
    }
  }, [activeEntry]);

  // Filter entries based on domain, method, and query
  const filteredEntries = useMemo(() => {
    return CATALOG_ENTRIES.filter((entry) => {
      const matchDomain = selectedDomain === "all" || entry.domain === selectedDomain;
      const matchMethod = selectedMethod === "all" || entry.method === selectedMethod;
      const matchQuery =
        searchQuery === "" ||
        entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDomain && matchMethod && matchQuery;
    });
  }, [selectedDomain, selectedMethod, searchQuery]);

  const runSimulation = async (entry: CatalogEntry) => {
    setIsProcessing(true);
    setSimulationResult(null);
    setErrorNotice(null);

    let parsedParams = {};
    try {
      parsedParams = JSON.parse(simulateParams);
    } catch (e) {
      setErrorNotice("Parámetros JSON de simulación inválidos.");
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: entry.id,
          method: entry.method,
          path: entry.path,
          params: parsedParams,
        }),
      });

      if (!res.ok) {
        throw new Error("La simulación del contrato nativo falló.");
      }

      const result = (await res.json()) as SimulationResult;
      setSimulationResult(result);
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Error desconocido en simulación.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      {/* Left rail - Filters & List */}
      <div className="flex flex-col gap-4">
        {/* Domain Filters */}
        <div className="glass rounded-2xl p-4">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-3 flex items-center gap-2">
            <Layers className="size-3.5 text-crown" />
            Dominios cognitivos
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedDomain("all")}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-mono transition-colors ${
                selectedDomain === "all"
                  ? "bg-secondary/60 text-platinum"
                  : "text-muted-foreground hover:text-platinum hover:bg-secondary/20"
              }`}
            >
              Todos los dominios ({CATALOG_ENTRIES.length})
            </button>
            {DOMAINS.map((dom) => {
              const count = CATALOG_ENTRIES.filter((e) => e.domain === dom.id).length;
              return (
                <button
                  key={dom.id}
                  onClick={() => setSelectedDomain(dom.id)}
                  className={`w-full flex items-center justify-between text-left px-3 py-1.5 rounded-lg text-[12px] font-mono transition-colors ${
                    selectedDomain === dom.id
                      ? "bg-secondary/60 text-platinum"
                      : "text-muted-foreground hover:text-platinum hover:bg-secondary/20"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full" style={{ background: dom.color }} />
                    {dom.name}
                  </span>
                  <span className="text-[10px] opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Method Filters */}
        <div className="glass rounded-2xl p-4">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-3 flex items-center gap-2">
            <Terminal className="size-3.5 text-electric" />
            Métodos HTTP
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {["all", "GET", "POST", "PATCH", "DELETE"].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono border transition-all ${
                  selectedMethod === m
                    ? "bg-primary/20 text-platinum border-primary/40"
                    : "border-border/30 text-muted-foreground hover:text-platinum hover:border-border/60"
                }`}
              >
                {m === "all" ? "Todos" : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex flex-col gap-5 min-w-0">
        {/* Top bar with Search */}
        <div className="glass rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar contrato o path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/35 border border-border/40 rounded-xl font-mono text-[12px] text-foreground focus:outline-none focus:border-electric/50"
            />
          </div>
          <div className="font-mono text-[11px] text-muted-foreground text-right w-full md:w-auto">
            Mostrando <span className="text-electric">{filteredEntries.length}</span> de{" "}
            {CATALOG_ENTRIES.length} contratos nativos
          </div>
        </div>

        {/* Grid: Left - Search Results, Right - Details & Simulator */}
        <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
          {/* Contracts List */}
          <div className="glass rounded-2xl overflow-hidden flex flex-col max-h-[64vh]">
            <div className="p-4 border-b border-border/40 bg-secondary/10">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Lista de contratos
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/30">
              {filteredEntries.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground font-mono text-[11px]">
                  Ningún contrato coincide con los filtros.
                </div>
              ) : (
                filteredEntries.map((entry) => {
                  const isActive = activeEntry?.id === entry.id;
                  const dom = DOMAINS.find((d) => d.id === entry.domain);
                  return (
                    <button
                      key={entry.id}
                      onClick={() => {
                        setActiveEntry(entry);
                        setSimulationResult(null);
                        setErrorNotice(null);
                      }}
                      className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1.5 ${
                        isActive ? "bg-secondary/40" : "hover:bg-secondary/15"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[9.5px] font-mono border ${METHOD_COLORS[entry.method]}`}
                        >
                          {entry.method}
                        </span>
                        <span
                          className="size-2 rounded-full"
                          style={{ background: dom?.color || "var(--border)" }}
                          title={dom?.name}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-platinum truncate break-all">
                        {entry.path}
                      </span>
                      <span className="text-[11px] text-muted-foreground line-clamp-1">
                        {entry.description}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Details & Live Simulator */}
          <div className="flex flex-col gap-4 min-w-0">
            {activeEntry ? (
              <div className="glass rounded-2xl p-5 flex flex-col gap-5">
                {/* Contract Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10.5px] font-mono border ${METHOD_COLORS[activeEntry.method]}`}
                      >
                        {activeEntry.method}
                      </span>
                      <span className="font-mono text-[11px] text-electric uppercase tracking-wider">
                        {activeEntry.id}
                      </span>
                    </div>
                    <h2 className="mt-2 font-mono text-[16px] text-pearl break-all font-semibold">
                      {activeEntry.path}
                    </h2>
                    <p className="mt-1.5 text-[12.5px] text-muted-foreground leading-relaxed">
                      {activeEntry.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full border border-argus/20 bg-argus/5 text-argus font-mono text-[9px] uppercase tracking-wider">
                      {activeEntry.auth}
                    </span>
                    <div className="flex gap-2">
                      {activeEntry.idempotency && (
                        <span className="text-[9.5px] font-mono text-muted-foreground/80 bg-secondary/40 px-1.5 py-0.5 rounded">
                          IDEMPOTENTE
                        </span>
                      )}
                      {activeEntry.audit && (
                        <span className="text-[9.5px] font-mono text-muted-foreground/80 bg-secondary/40 px-1.5 py-0.5 rounded">
                          AUDITABLE
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tab layout inside Explorer: Schema vs Simulator */}
                <div className="grid gap-5 lg:grid-cols-2">
                  {/* Left: Code Schemas */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Code className="size-3 text-electric" />
                        Esquema de respuesta
                      </h4>
                      <pre className="bg-secondary/25 border border-border/40 rounded-xl p-3.5 font-mono text-[10.5px] text-platinum overflow-x-auto max-h-[30vh]">
                        {activeEntry.responseSchema || '{\n  "status": "success"\n}'}
                      </pre>
                    </div>
                    {activeEntry.requestSchema && (
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Code className="size-3 text-electric" />
                          Esquema de solicitud
                        </h4>
                        <pre className="bg-secondary/25 border border-border/40 rounded-xl p-3.5 font-mono text-[10.5px] text-platinum overflow-x-auto max-h-[20vh]">
                          {activeEntry.requestSchema}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Right: Simulator Console */}
                  <div className="flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border/30 pt-4 lg:pt-0 lg:pl-5">
                    <h3 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-2">
                      <Sparkles className="size-3.5 text-crown" />
                      Consola de simulación nativa
                    </h3>

                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground mb-1.5">
                        Parámetros JSON de prueba
                      </label>
                      <textarea
                        value={simulateParams}
                        onChange={(e) => setSimulateParams(e.target.value)}
                        className="w-full h-24 bg-secondary/35 border border-border/40 rounded-xl font-mono text-[11px] p-3 text-platinum focus:outline-none focus:border-electric/50"
                      />
                    </div>

                    <button
                      onClick={() => runSimulation(activeEntry)}
                      disabled={isSimulating}
                      className="w-full flex items-center justify-center gap-2 bg-electric/15 hover:bg-electric/25 border border-electric/30 hover:border-electric/50 text-electric font-mono text-[11.5px] uppercase tracking-[0.2em] py-2.5 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Play className="size-3.5 fill-electric" />
                      {isSimulating ? "Ejecutando..." : "Ejecutar prueba de contrato"}
                    </button>

                    {errorNotice && (
                      <div className="p-3 rounded-xl border border-destructive/25 bg-destructive/10 text-destructive text-[11.5px] font-mono">
                        {errorNotice}
                      </div>
                    )}

                    {simulationResult && (
                      <div className="flex flex-col gap-3 mt-1.5">
                        {/* Status indicators */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-secondary/20 border border-border/30 rounded-lg p-2.5">
                            <span className="block font-mono text-[8px] tracking-wider text-muted-foreground uppercase">
                              Gobernanza CROWN
                            </span>
                            <span className="font-mono text-[12px] text-pearl font-semibold uppercase flex items-center gap-1.5">
                              {simulationResult.decisionStatus === "allowed" ||
                              simulationResult.decisionStatus === "allowed_read_only" ? (
                                <CheckCircle className="size-3.5 text-emerald-400" />
                              ) : (
                                <Shield className="size-3.5 text-amber-400" />
                              )}
                              {simulationResult.decisionStatus}
                            </span>
                          </div>
                          <div className="bg-secondary/20 border border-border/30 rounded-lg p-2.5">
                            <span className="block font-mono text-[8px] tracking-wider text-muted-foreground uppercase">
                              Latencia gRPC
                            </span>
                            <span className="font-mono text-[12px] text-pearl font-semibold flex items-center gap-1.5">
                              <Clock className="size-3.5 text-teal-400" />
                              {simulationResult.latencyMs} ms
                            </span>
                          </div>
                        </div>

                        {/* Audit Trail list */}
                        <div>
                          <span className="block font-mono text-[8px] tracking-wider text-muted-foreground uppercase mb-1">
                            Historial de auditoría C.R.O.W.N.
                          </span>
                          <div className="space-y-1 bg-secondary/15 rounded-xl p-2.5 border border-border/30 max-h-[14vh] overflow-y-auto">
                            {simulationResult.auditTrail.map((ev, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-1.5 font-mono text-[9px] text-muted-foreground leading-relaxed"
                              >
                                <ArrowRight className="size-2.5 text-electric shrink-0 mt-0.5" />
                                <span className="text-platinum break-all">{ev.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Live JSON payload response */}
                        <div>
                          <span className="block font-mono text-[8px] tracking-wider text-muted-foreground uppercase mb-1">
                            Payload de respuesta simulado
                          </span>
                          <pre className="bg-secondary/35 border border-border/40 rounded-xl p-3 font-mono text-[10px] text-teal-300 overflow-x-auto max-h-[18vh]">
                            {JSON.stringify(simulationResult.responsePayload, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center text-muted-foreground font-mono text-[12px]">
                Selecciona un contrato de la lista para ver su esquema y ejecutar pruebas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
