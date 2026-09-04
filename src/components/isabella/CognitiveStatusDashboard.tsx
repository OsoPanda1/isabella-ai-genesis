/* eslint-disable security/detect-object-injection */
import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import {
  Activity,
  Terminal,
  Cpu,
  Layers,
  ShieldAlert,
  Compass,
  FileCode,
  HardDrive,
  Play,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import metadata from "@/../metadata.json";

interface CognitiveModule {
  id: string;
  name: string;
  status: "active" | "standby" | "maintenance";
  latency: number;
  cpu: number;
  memory: number;
  description: string;
  styleClass: string;
}

interface TerminalLine {
  text: string;
  type: "input" | "output" | "system" | "error" | "success" | "header" | "json";
}

export function CognitiveStatusDashboard() {
  const [activeTab, setActiveTab] = useState<"modules" | "metadata">("modules");
  const [commandInput, setCommandInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostProgress, setBoostProgress] = useState(0);

  // Diagnostic and custom log states
  const [diagnosticProgress, setDiagnosticProgress] = useState<Record<string, number>>({});
  const [diagnosticLatency, setDiagnosticLatency] = useState<Record<string, number>>({});
  const [isDiagnosing, setIsDiagnosing] = useState<Record<string, boolean>>({});
  const [selectedLogModule, setSelectedLogModule] = useState<string | null>(null);

  // Live status states for cognitive modules
  const [modules, setModules] = useState<CognitiveModule[]>([
    {
      id: "crown",
      name: "CROWN Gateway",
      status: "active",
      latency: 4,
      cpu: 18,
      memory: 24,
      description: "Orquestación, ruteo cognitivo de intenciones y arbitraje de estado.",
      styleClass: "crystal-3d-crown",
    },
    {
      id: "isa",
      name: "ISA Core",
      status: "active",
      latency: 12,
      cpu: 34,
      memory: 45,
      description: "Interacción empática, tono de voz de México y modulación expresiva.",
      styleClass: "crystal-3d-electric",
    },
    {
      id: "sophia",
      name: "SOPHIA Engine",
      status: "active",
      latency: 18,
      cpu: 28,
      memory: 52,
      description: "Análisis lógico-epistemológico, razonamiento profundo y síntesis territorial.",
      styleClass: "crystal-3d-emerald",
    },
    {
      id: "orion",
      name: "ORION Engine",
      status: "active",
      latency: 15,
      cpu: 40,
      memory: 60,
      description: "Ejecución técnica, transpilaciones cuánticas y soporte de herramientas.",
      styleClass: "crystal-3d-iris",
    },
    {
      id: "argus",
      name: "ARGUS Sentinel",
      status: "active",
      latency: 5,
      cpu: 12,
      memory: 18,
      description:
        "Gobernanza constitucional estricta, filtrado de amenazas y veto en tiempo real.",
      styleClass: "crystal-3d-argus",
    },
  ]);

  const [lines, setLines] = useState<TerminalLine[]>([
    { text: "ISABELLA ARCHITECTURE TERMINAL v" + metadata.operational.version, type: "header" },
    { text: "Licencia: Creative Commons Attribution 4.0 International", type: "system" },
    { text: "Conexión encriptada con Nodo Cero — Real del Monte, Hidalgo.", type: "success" },
    {
      text: 'Ingresa "help" para ver la lista de comandos cognitivos disponibles.',
      type: "system",
    },
    { text: "----------------------------------------------------------------", type: "system" },
  ]);

  const bufferEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    bufferEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Simulating live metric oscillations
  useEffect(() => {
    const interval = setInterval(() => {
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.status !== "active") return mod;
          const cpuOffset = Math.floor(Math.random() * 7) - 3;
          const memOffset = Math.floor(Math.random() * 5) - 2;
          const latOffset = Math.floor(Math.random() * 5) - 2;
          return {
            ...mod,
            cpu: Math.max(5, Math.min(95, mod.cpu + cpuOffset)),
            memory: Math.max(10, Math.min(90, mod.memory + memOffset)),
            latency: Math.max(2, Math.min(80, mod.latency + latOffset)),
          };
        }),
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulating core hyper-threading boost animation
  useEffect(() => {
    if (!isBoosting) return;
    const interval = setInterval(() => {
      setBoostProgress((prev) => {
        if (prev >= 100) {
          setIsBoosting(false);
          toast.success("¡Núcleos optimizados con éxito!");
          setLines((l) => [
            ...l,
            {
              text: "[SISTEMA]: Boost completado. Rendimiento de CPUs estabilizado al 120%.",
              type: "success",
            },
          ]);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [isBoosting]);

  const addLine = (text: string, type: TerminalLine["type"]) => {
    setLines((prev) => [...prev, { text, type }]);
  };

  const moduleLogs: Record<string, string[]> = {
    crown: [
      "[12:10:01] [CROWN] Inicializando orquestador de intenciones cognitivas...",
      "[12:10:05] [CROWN] Puerto seguro 9600 BAUD enlazado con éxito.",
      "[12:10:15] [CROWN] Petición entrante de usuario recibida.",
      "[12:10:16] [CROWN] Ruteando intención -> 'Consulta Histórica'.",
      "[12:10:20] [CROWN] Sincronización exitosa con SOPHIA y ARGUS Sentinel.",
      "[12:10:24] [CROWN] Estado de gobernanza C.R.O.W.N. validado correctamente.",
    ],
    isa: [
      "[12:10:02] [ISA] Cargando modelo de voz territorial (es-MX).",
      "[12:10:04] [ISA] Calibrando tono expresivo y empatía contextual.",
      "[12:10:16] [ISA] Analizando afecto y sensibilidad en la entrada de consulta.",
      "[12:10:25] [ISA] Respuesta generada con modulación suave y cercana.",
      "[12:10:26] [ISA] Transmisión de voz de salida completada hacia el cliente.",
    ],
    sophia: [
      "[12:10:02] [SOPHIA] Activando motor epistemológico y lógica analítica.",
      "[12:10:08] [SOPHIA] Recuperando scopes de memoria histórica territorial.",
      "[12:10:18] [SOPHIA] Realizando síntesis conceptual del patrimonio de Real del Monte.",
      "[12:10:22] [SOPHIA] Verificando consistencia interna y deducción lógica.",
      "[12:10:23] [SOPHIA] Lógica epistemológica y coherencia conceptual: VALIDADA.",
    ],
    orion: [
      "[12:10:03] [ORION] Inicializando el motor de ejecución técnica (qup-v3).",
      "[12:10:09] [ORION] Cargando firmas criptográficas en el ledger BookPI.",
      "[12:10:19] [ORION] Ejecutando análisis estático (SAST) en herramental PRAXIS.",
      "[12:10:25] [ORION] Bloque de transpilación cuántica completado sin advertencias.",
      "[12:10:26] [ORION] Transacción ledger BookPI comprometida con ID 0fa67379.",
    ],
    argus: [
      "[12:10:04] [ARGUS] Vigilante constitucional activado en modo Zero Trust.",
      "[12:10:10] [ARGUS] Cargando base de firmas de inyección y jailbreak.",
      "[12:10:17] [ARGUS] Evaluación de riesgos del Prompt Gate: Seguro (Bajo riesgo).",
      "[12:10:24] [ARGUS] Aplicando regla constitucional de privacidad territorial.",
      "[12:10:24] [ARGUS] Evaluación de salida completada: ALLOWED.",
    ],
  };

  const runDiagnostic = (modId: string) => {
    if (isDiagnosing[modId]) return;
    setIsDiagnosing((prev) => ({ ...prev, [modId]: true }));
    setDiagnosticProgress((prev) => ({ ...prev, [modId]: 0 }));

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setDiagnosticProgress((prev) => ({ ...prev, [modId]: current }));
      if (current >= 100) {
        clearInterval(interval);
        const finalLatency = Math.floor(Math.random() * 25) + 3;
        setDiagnosticLatency((prev) => ({ ...prev, [modId]: finalLatency }));
        setIsDiagnosing((prev) => ({ ...prev, [modId]: false }));
        toast.success(
          `Diagnóstico completado para ${modId.toUpperCase()}. Latencia: ${finalLatency}ms`,
        );
        setLines((l) => [
          ...l,
          {
            text: `[DIAGNÓSTICO] ${modId.toUpperCase()}: Prueba de latencia completada con éxito. Resultado: ${finalLatency}ms.`,
            type: "success",
          },
        ]);
      }
    }, 100);
  };

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);
    addLine(`operator@isabella-node-zero:~$ ${trimmed}`, "input");
    setCommandInput("");

    const args = trimmed.toLowerCase().split(" ");
    const command = args[0];

    switch (command) {
      case "help":
        addLine("Comandos de la Arquitectura Cognitiva:", "success");
        addLine("  help      - Muestra la ayuda de comandos de la consola.", "output");
        addLine(
          "  status    - Realiza un barrido en vivo de las métricas de hardware de los módulos.",
          "output",
        );
        addLine(
          "  metadata  - Despliega el contenido estructurado del archivo metadata.json.",
          "output",
        );
        addLine(
          "  logs      - Recupera las trazas operacionales recientes del ledger de control.",
          "output",
        );
        addLine(
          "  boost     - Inicia un proceso de hiper-aceleración de núcleos cognitivos.",
          "output",
        );
        addLine("  clear     - Limpia el búfer de comandos de la pantalla.", "output");
        break;

      case "clear":
        setLines([]);
        break;

      case "status":
        addLine("Iniciando barrido de salud de módulos...", "system");
        setTimeout(() => {
          modules.forEach((mod) => {
            addLine(
              `  [✓] ${mod.name} -> Latencia: ${mod.latency}ms | CPU: ${mod.cpu}% | RAM: ${mod.memory}%`,
              "output",
            );
          });
          addLine("Diagnóstico del canal: Conexión estable con el territorio.", "success");
        }, 400);
        break;

      case "metadata":
        addLine("Lectura de metadatos del sistema (metadata.json):", "success");
        addLine(JSON.stringify(metadata, null, 2), "json");
        break;

      case "logs":
        addLine("Recuperando registro auditado de ARGUS Sentinel:", "system");
        setTimeout(() => {
          addLine(
            `[2026-09-04 12:10:24] [CROWN] Orquestando petición -> Intención: "cultural"`,
            "output",
          );
          addLine(
            `[2026-09-04 12:10:24] [ARGUS] Filtro constitucional aplicado: ALLOWED`,
            "output",
          );
          addLine(
            `[2026-09-04 12:10:25] [ISA] Respuesta de voz generada con éxito (es-MX)`,
            "output",
          );
          addLine(
            `[2026-09-04 12:10:26] [ORION] Firma criptográfica inyectada en BookPI ledger`,
            "success",
          );
        }, 300);
        break;

      case "boost":
        if (isBoosting) {
          addLine("Aviso: El proceso de aceleración ya se encuentra activo.", "error");
        } else {
          setIsBoosting(true);
          setBoostProgress(0);
          addLine("Iniciando hyper-threading en núcleos de inferencia...", "system");
        }
        break;

      default:
        addLine(
          `Comando no reconocido: "${command}". Escribe "help" para ver comandos permitidos.`,
          "error",
        );
        break;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(commandInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setCommandInput(history[nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setCommandInput(history[nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput("");
      }
    }
  };

  return (
    <div
      id="cognitive-status-dashboard"
      className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-rise"
    >
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hairline pb-5">
        <div>
          <h2 className="text-display text-3xl font-bold tracking-tight text-pearl flex items-center gap-2">
            <Layers className="size-8 text-electric" />
            Consola de Gobernanza y Salud
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mt-1">
            Visualización interactiva y monitoreo criptográfico de los módulos cognitivos definidos
            en <span className="font-mono text-electric text-xs">metadata.json</span>.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-secondary/30 p-1 rounded-xl border border-border/40 shrink-0">
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              activeTab === "modules"
                ? "bg-electric text-background shadow-glow"
                : "text-muted-foreground hover:text-pearl"
            }`}
          >
            Módulos Cognitivos
          </button>
          <button
            onClick={() => setActiveTab("metadata")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              activeTab === "metadata"
                ? "bg-electric text-background shadow-glow"
                : "text-muted-foreground hover:text-pearl"
            }`}
          >
            Metadatos (.json)
          </button>
        </div>
      </div>

      {activeTab === "modules" ? (
        /* Modules Status Panel using the required crystal-3d styles */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`crystal-3d ${mod.styleClass} rounded-2xl p-5 cursor-default transition-all duration-500 ${
                  mod.status === "active" ? "animate-breathe" : ""
                }`}
              >
                {/* Badge & Icon Header */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    {mod.id === "crown" && <Activity className="size-5 text-crown animate-pulse" />}
                    {mod.id === "isa" && <Sparkles className="size-5 text-isa" />}
                    {mod.id === "sophia" && <Compass className="size-5 text-sophia" />}
                    {mod.id === "orion" && <FileCode className="size-5 text-orion" />}
                    {mod.id === "argus" && <ShieldAlert className="size-5 text-argus" />}
                    <h3 className="font-mono text-[12px] font-bold tracking-wider text-pearl uppercase">
                      {mod.name.split(" ")[0]}
                    </h3>
                  </div>

                  <span
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLogModule(selectedLogModule === mod.id ? null : mod.id);
                    }}
                    className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15 cursor-pointer hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all select-none"
                    title="Click para ver registros de operación"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {mod.status}
                  </span>
                </div>

                {/* Title & Description */}
                <h4 className="text-sm font-bold text-platinum/90">{mod.name}</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed h-8">
                  {mod.description}
                </p>

                {/* Real-time Oscillating Hardware Stats */}
                <div className="mt-4 space-y-2.5 pt-3 border-t border-border/20 font-mono text-[11px]">
                  {/* Latency */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">LATENCIA:</span>
                    <span className="text-pearl font-bold">{mod.latency} ms</span>
                  </div>

                  {/* CPU usage bar */}
                  <div>
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>CPU:</span>
                      <span className="text-pearl font-bold">{mod.cpu}%</span>
                    </div>
                    <div className="w-full bg-background/50 h-1.5 rounded-full overflow-hidden border border-border/10">
                      <div
                        className="bg-electric h-full transition-all duration-1000"
                        style={{ width: `${mod.cpu}%` }}
                      />
                    </div>
                  </div>

                  {/* Memory Usage */}
                  <div>
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>MEMORIA:</span>
                      <span className="text-pearl font-bold">{mod.memory}%</span>
                    </div>
                    <div className="w-full bg-background/50 h-1.5 rounded-full overflow-hidden border border-border/10">
                      <div
                        className="bg-iris h-full transition-all duration-1000"
                        style={{ width: `${mod.memory}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 'Run Diagnostic' section */}
                <div className="mt-4 pt-3 border-t border-border/15 space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      runDiagnostic(mod.id);
                    }}
                    disabled={isDiagnosing[mod.id]}
                    className="w-full bg-secondary/25 hover:bg-secondary/45 text-[10px] text-pearl py-1.5 px-3 rounded-lg border border-border/20 hover:border-electric/40 transition-all font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 select-none cursor-pointer"
                  >
                    {isDiagnosing[mod.id] ? "Analizando..." : "Iniciar Diagnóstico"}
                  </button>

                  {(isDiagnosing[mod.id] || diagnosticProgress[mod.id] !== undefined) && (
                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>TEST DE LATENCIA:</span>
                        <span>{diagnosticProgress[mod.id]}%</span>
                      </div>
                      <div className="w-full bg-background/50 h-1 rounded-full overflow-hidden border border-border/10">
                        <div
                          className="bg-electric h-full transition-all duration-300"
                          style={{ width: `${diagnosticProgress[mod.id]}%` }}
                        />
                      </div>
                      {diagnosticLatency[mod.id] !== undefined && !isDiagnosing[mod.id] && (
                        <div className="text-[9.5px] text-emerald-400 font-mono mt-1">
                          Test Latency:{" "}
                          <span className="font-bold">{diagnosticLatency[mod.id]} ms</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Scrollable log viewer with glass effect */}
          {selectedLogModule && (
            <div className="glass rounded-3xl p-5 border border-border/30 shadow-glass animate-rise">
              <div className="flex items-center justify-between border-b border-border/20 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-electric animate-ping" />
                  <h4 className="font-mono text-xs font-bold text-pearl uppercase">
                    REGISTRO DE OPERACIÓN: {modules.find((m) => m.id === selectedLogModule)?.name}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedLogModule(null)}
                  className="text-muted-foreground hover:text-pearl text-[10px] font-mono uppercase border border-border/20 px-2.5 py-1 rounded hover:bg-secondary/20 transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
              <div className="max-h-[160px] overflow-y-auto space-y-1.5 font-mono text-[11px] text-emerald-400 bg-background/60 p-4 rounded-xl border border-border/10 scrollbar">
                {moduleLogs[selectedLogModule]?.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap break-all leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Metadata Inspector Panel using glass style */
        <div className="glass rounded-3xl p-6 border border-border/40 shadow-glass">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Version */}
            <div className="bg-secondary/10 border border-border/20 rounded-2xl p-4 flex items-center gap-3">
              <Cpu className="size-8 text-electric shrink-0" />
              <div>
                <span className="block text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  Versión Operativa
                </span>
                <span className="text-lg font-bold text-pearl font-mono">
                  v{metadata.operational.version}
                </span>
              </div>
            </div>

            {/* Commit Hash */}
            <div className="bg-secondary/10 border border-border/20 rounded-2xl p-4 flex items-center gap-3">
              <HardDrive className="size-8 text-iris shrink-0" />
              <div>
                <span className="block text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  Commit Hash
                </span>
                <span className="text-sm font-bold text-pearl font-mono truncate max-w-[150px] block">
                  {metadata.operational.commit.slice(0, 8)}
                </span>
              </div>
            </div>

            {/* Frame Permissions */}
            <div className="bg-secondary/10 border border-border/20 rounded-2xl p-4 flex items-center gap-3">
              <Play className="size-8 text-isa shrink-0 animate-pulse" />
              <div>
                <span className="block text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  Permisos Activos
                </span>
                <span className="text-xs font-bold text-pearl font-mono">
                  {metadata.requestFramePermissions.join(", ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Active Capability */}
            <div className="bg-secondary/10 border border-border/20 rounded-2xl p-4 flex items-center gap-3">
              <Activity className="size-8 text-emerald-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  Capacidad Principal
                </span>
                <span className="text-[10px] font-bold text-emerald-400 font-mono truncate max-w-[180px] block">
                  {metadata.majorCapabilities[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Full Metadata JSON Explorer */}
          <div className="mt-6">
            <h3 className="text-xs font-mono font-bold uppercase text-platinum/80 mb-2 flex items-center gap-1.5">
              <FileCode className="size-4 text-electric" />
              Estructura Completa de Metadatos:
            </h3>
            <pre className="bg-background/80 rounded-2xl p-5 border border-border/20 overflow-x-auto text-[11px] font-mono leading-relaxed text-emerald-400">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Dynamic Terminal Console for Command Execution using glass style */}
      <div className="glass-strong rounded-3xl overflow-hidden border border-border/40 shadow-glass flex flex-col h-[50vh] font-mono text-[12px] leading-relaxed cursor-text">
        {/* Terminal Titlebar */}
        <div className="bg-secondary/20 border-b border-border/30 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="size-3 text-electric" />
              operator@isabella-shell:~
            </span>
          </div>

          {isBoosting && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-electric animate-pulse font-bold font-mono">
                BOOSTING CORES: {boostProgress}%
              </span>
              <div className="w-16 bg-background h-1.5 rounded-full overflow-hidden border border-border/10">
                <div className="bg-electric h-full" style={{ width: `${boostProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick Commands clickable list */}
        <div className="bg-secondary/15 border-b border-border/15 px-5 py-2.5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mr-1">
            Comandos Rápidos:
          </span>
          {["help", "status", "logs", "metadata", "boost"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setCommandInput(cmd);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              className="px-2.5 py-1 rounded-md bg-secondary/40 hover:bg-secondary/70 text-platinum text-[10px] font-mono border border-border/25 hover:border-electric/40 transition-all select-none cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Output Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2 select-text selection:bg-electric/20 scrollbar">
          {lines.map((l, index) => {
            let colorClass = "text-platinum/80";
            if (l.type === "header")
              colorClass = "text-iridescent text-[13px] font-bold tracking-wide";
            if (l.type === "system") colorClass = "text-muted-foreground";
            if (l.type === "error") colorClass = "text-rose-400 font-semibold";
            if (l.type === "success") colorClass = "text-emerald-400 font-semibold";
            if (l.type === "input") colorClass = "text-electric font-semibold";
            if (l.type === "json") colorClass = "text-emerald-500/90";

            return (
              <div key={index} className="whitespace-pre-wrap break-all">
                {l.type === "input" ? (
                  <span>{l.text}</span>
                ) : (
                  <span className={colorClass}>{l.text}</span>
                )}
              </div>
            );
          })}
          <div ref={bufferEndRef} />
        </div>

        {/* Console Command Input */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="bg-secondary/10 border-t border-border/20 px-5 py-3.5 flex items-center gap-2.5"
        >
          <span className="text-electric shrink-0 font-semibold">
            operator@isabella-node-zero:~$
          </span>
          <div className="flex-1 flex items-center relative">
            <input
              ref={inputRef}
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none text-platinum font-mono text-[12px] caret-transparent focus:ring-0 focus:outline-none"
              placeholder="Escribe un comando constitucional (ej. help, status, logs, metadata)..."
              autoFocus
            />
            {/* Blinking caret */}
            <span
              className="absolute pointer-events-none bg-electric h-[14px] w-[7px] animate-caret"
              style={{
                left: `${Math.min(commandInput.length * 7.2, inputRef.current?.offsetWidth || 0)}px`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
