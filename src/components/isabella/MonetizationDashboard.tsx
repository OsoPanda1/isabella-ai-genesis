import { useState } from "react";
import {
  Shield,
  CreditCard,
  Cpu,
  Key,
  Layers,
  Sparkles,
  Award,
  TrendingUp,
  FileText,
  DollarSign,
  Briefcase,
  Globe,
  Settings,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface LedgerEntry {
  id: string;
  operation: string;
  costDecimal: string;
  timestamp: string;
}

export function MonetizationDashboard() {
  // Free plan state
  const [hasFreeConsent, setHasFreeConsent] = useState(true);
  const [freeMessagesUsed, setFreeMessagesUsed] = useState(12);
  const FREE_LIMIT = 50;

  // Membership states
  const [activePlan, setActivePlan] = useState<string | null>(null);

  // Consumption credits state (Decimal absolute values to prevent floating issues)
  const [creditBalance, setCreditBalance] = useState<string>("25.00");
  const [ledger, setLedger] = useState<LedgerEntry[]>([
    {
      id: "tx_01",
      operation: "Análisis de Documento GIS",
      costDecimal: "1.50",
      timestamp: "Hace 10 mins",
    },
    {
      id: "tx_02",
      operation: "Síntesis Vocal ISA Core",
      costDecimal: "0.45",
      timestamp: "Hace 2 horas",
    },
    {
      id: "tx_03",
      operation: "Ejecución de Skill Código",
      costDecimal: "2.00",
      timestamp: "Hace 1 día",
    },
  ]);

  // API Developer states
  const [generatedKeys, setGeneratedKeys] = useState<
    Array<{ key: string; name: string; scopes: string[] }>
  >([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["presentation:read"]);

  // Skills Marketplace states
  const [sastScanRunning, setSastScanRunning] = useState<string | null>(null);
  const [scannedSkills, setScannedSkills] = useState<Record<string, "passed" | "failed" | null>>({
    "gis-conector": "passed",
    "legal-doc-analyzer": null,
  });

  // Target Revenue share forecast (Stage 1-6 model state)
  const [activeRoadmapStage, setActiveRoadmapStage] = useState<number>(1);

  // Credit cost calculation simulation
  const handleSimulateCreditUsage = (operationName: string, costStr: string) => {
    const current = parseFloat(creditBalance);
    const cost = parseFloat(costStr);
    if (current < cost) {
      alert("Créditos insuficientes. Adquiere créditos para realizar esta acción.");
      return;
    }
    const nextBalance = (current - cost).toFixed(2);
    setCreditBalance(nextBalance);
    setLedger((prev) => [
      {
        id: `tx_${Math.random().toString(36).slice(2, 6)}`,
        operation: operationName,
        costDecimal: costStr,
        timestamp: "Ahora",
      },
      ...prev,
    ]);
  };

  const handleRefundCreditUsage = (txId: string) => {
    const target = ledger.find((l) => l.id === txId);
    if (!target) return;
    const current = parseFloat(creditBalance);
    const refund = parseFloat(target.costDecimal);
    setCreditBalance((current + refund).toFixed(2));
    setLedger((prev) => prev.filter((l) => l.id !== txId));
  };

  const handleGenerateApiKey = () => {
    if (!newKeyName.trim()) return;
    const truncated = `isa_live_` + Math.random().toString(36).slice(2, 10) + `_key`;
    setGeneratedKeys((prev) => [
      { key: truncated, name: newKeyName, scopes: [...selectedScopes] },
      ...prev,
    ]);
    setNewKeyName("");
  };

  const handleToggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  const runSastSandboxScan = (skillName: string) => {
    setSastScanRunning(skillName);
    setTimeout(() => {
      setScannedSkills((prev) => ({ ...prev, [skillName]: "passed" }));
      setSastScanRunning(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Monetization Intro */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-mono text-[20px] font-bold text-pearl flex items-center gap-2">
          <TrendingUp className="size-5.5 text-electric" />
          Monetización Diversificada y Soberanía Económica
        </h2>
        <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
          Isabella evita la dependencia de una única fuente de ingresos especulativa o extractiva.
          Su modelo se inspira en el marco de la economía de creadores, alianzas institucionales,
          ciencia abierta y servicios verificables mediante <strong>BookPI</strong>, garantizando
          que la privacidad básica sea siempre gratuita.
        </p>
      </div>

      {/* Grid: 4 Bento Columns */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Row 1: Plan Gratuito & Membresías */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
                <Globe className="size-4.5 text-teal-400" />
                1. Plan Gratuito (Freemium)
              </h3>
              <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-0.5 rounded-full uppercase font-mono">
                Activo por Defecto
              </span>
            </div>
            <p className="mt-2.5 text-[12px] text-muted-foreground leading-relaxed">
              Accede a funciones generales de ISA y SOPHIA con memoria temporal sin costo. El plan
              garantiza transparencia y respeto a tus datos, evitando la extracción oculta con fines
              comerciales.
            </p>

            <div className="mt-4 bg-secondary/15 rounded-2xl p-4 border border-border/30">
              <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                <span className="text-muted-foreground">Consumo de cuota de mensajes:</span>
                <span className="text-platinum font-semibold">
                  {freeMessagesUsed} / {FREE_LIMIT}
                </span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-400 h-full transition-all duration-500"
                  style={{ width: `${(freeMessagesUsed / FREE_LIMIT) * 100}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-3.5">
                <div className="flex flex-col">
                  <span className="font-mono text-[10.5px] text-pearl font-semibold">
                    Consentimiento de Telemetría
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Requerido para la mejora del modelo territorial.
                  </span>
                </div>
                <button
                  onClick={() => setHasFreeConsent(!hasFreeConsent)}
                  className={`px-3 py-1 rounded-lg font-mono text-[10px] transition-all ${
                    hasFreeConsent
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                  }`}
                >
                  {hasFreeConsent ? "Otorgado" : "Denegado"}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-border/20">
            <span className="font-mono text-[10.5px] text-muted-foreground">
              *Las exportaciones avanzadas y ejecución de Skills requieren una membresía.
            </span>
          </div>
        </div>

        {/* Membresías de Usuario */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
              <CreditCard className="size-4.5 text-electric" />
              2. Membresías Personales y Pro
            </h3>
            <p className="mt-2.5 text-[12px] text-muted-foreground leading-relaxed">
              Financia directamente la infraestructura soberana de Isabella. Obtén memoria
              persistente, voz HD ilimitada y capacidad de procesamiento elevado.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { id: "personal", name: "Isabella Personal", price: "$9.99/mes" },
                { id: "pro", name: "Isabella Creator", price: "$19.99/mes" },
                { id: "research", name: "Isabella Research", price: "$49.99/mes" },
                { id: "enterprise", name: "Isabella Enterprise", price: "Custom" },
              ].map((p) => {
                const isActive = activePlan === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePlan(isActive ? null : p.id)}
                    className={`p-3 rounded-xl border font-mono text-left transition-all ${
                      isActive
                        ? "bg-electric/15 border-electric text-platinum shadow-[0_0_15px_-5px_var(--electric)]"
                        : "bg-secondary/15 border-border/40 text-muted-foreground hover:border-border/60 hover:text-platinum"
                    }`}
                  >
                    <span className="block text-[11px] font-semibold">{p.name}</span>
                    <span className="block text-[10px] opacity-75 mt-0.5">{p.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
            <span className="font-mono text-[10.5px] text-muted-foreground">
              {activePlan
                ? `Suscripción activa: ${activePlan.toUpperCase()}`
                : "Ninguna suscripción activa."}
            </span>
            {activePlan && (
              <button
                onClick={() => setActivePlan(null)}
                className="text-rose-400 font-mono text-[10px] hover:underline"
              >
                Cancelar Suscripción
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Row 2: Créditos de Consumo (Exact Decimal Ledger) */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
                <Cpu className="size-4.5 text-crown" />
                3. Créditos de Consumo Decimal
              </h3>
              <div className="font-mono text-[12px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Saldo: <span className="font-bold">${creditBalance}</span>
              </div>
            </div>
            <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
              Compra créditos exactos para tareas costosas y evita saldos negativos. Si una
              operación falla, BookPI gestiona el reembolso garantizado en unidades enteras.
            </p>

            {/* Test consumption actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleSimulateCreditUsage("Ejecución de IA Epic Mode", "3.50")}
                className="px-2.5 py-1.5 rounded-lg border border-border/40 bg-secondary/15 font-mono text-[10px] text-platinum hover:bg-secondary/35 transition-all"
              >
                Invocación Epic Mode (-$3.50)
              </button>
              <button
                onClick={() => handleSimulateCreditUsage("Generación de Imagen GEMET", "1.20")}
                className="px-2.5 py-1.5 rounded-lg border border-border/40 bg-secondary/15 font-mono text-[10px] text-platinum hover:bg-secondary/35 transition-all"
              >
                Generar Imagen GEMET (-$1.20)
              </button>
            </div>

            {/* Live Ledger stream */}
            <div className="mt-4">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">
                Libro de Transacciones Activo (Ledger)
              </span>
              <div className="space-y-1.5 max-h-[16vh] overflow-y-auto bg-secondary/10 rounded-xl p-3 border border-border/30">
                {ledger.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between font-mono text-[10.5px]"
                  >
                    <div className="flex items-center gap-1.5 text-platinum">
                      <span className="text-[9px] text-muted-foreground">{l.id}</span>
                      <span>{l.operation}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-rose-400 font-semibold">-${l.costDecimal}</span>
                      <button
                        onClick={() => handleRefundCreditUsage(l.id)}
                        className="text-[9px] text-emerald-400 hover:underline"
                        title="Reembolsar esta transacción si falló"
                      >
                        Reembolsar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* API de Desarrolladores */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
              <Key className="size-4.5 text-electric" />
              4. API & Scopes para Desarrolladores
            </h3>
            <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
              Consonancia con la malla del Node Cero. Los endpoints nativos exigen alcances
              estrictos de seguridad.
            </p>

            <div className="mt-4 bg-secondary/15 border border-border/30 rounded-xl p-3">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Nombre de la llave (Ej. GIS Link)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 bg-secondary/30 border border-border/40 rounded-lg font-mono text-[10px] px-2.5 py-1.5 text-platinum focus:outline-none"
                />
                <button
                  onClick={handleGenerateApiKey}
                  className="bg-electric/20 hover:bg-electric/30 text-electric border border-electric/30 font-mono text-[10px] px-3.5 rounded-lg transition-all"
                >
                  Generar Key
                </button>
              </div>

              {/* Scopes Toggles */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "presentation:read",
                  "evidence:read",
                  "memory:write",
                  "bookpi:append",
                  "skills:execute",
                  "integrity:verify",
                ].map((sc) => {
                  const isChecked = selectedScopes.includes(sc);
                  const isReinforced = [
                    "bookpi:append",
                    "skills:execute",
                    "integrity:verify",
                  ].includes(sc);
                  return (
                    <button
                      key={sc}
                      onClick={() => handleToggleScope(sc)}
                      className={`px-2 py-1 rounded font-mono text-[9px] border transition-all ${
                        isChecked
                          ? isReinforced
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-electric/10 text-electric border-electric/20"
                          : "border-border/30 text-muted-foreground"
                      }`}
                    >
                      {sc} {isReinforced && "⚠️"}
                    </button>
                  );
                })}
              </div>

              {/* Generated Keys Stream */}
              {generatedKeys.length > 0 && (
                <div className="mt-3.5 space-y-1.5 border-t border-border/20 pt-2.5">
                  {generatedKeys.map((k, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between font-mono text-[10px]"
                    >
                      <div className="text-platinum font-semibold truncate max-w-[50%]">
                        {k.name}
                      </div>
                      <div className="text-electric font-mono">{k.key}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Skills Marketplace SAST Sandboxing & Roadmap Stages */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Skills Marketplace (PRAXIS) */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
              <Layers className="size-4.5 text-crown" />
              5. PRAXIS Skills Marketplace
            </h3>
            <p className="mt-2.5 text-[12px] text-muted-foreground leading-relaxed">
              Los desarrolladores publican herramientas verificadas. Para habilitarse en el
              marketplace, cada Skill se somete a un riguroso análisis SAST y sandbox de seguridad
              en la malla.
            </p>

            <div className="mt-4 space-y-3">
              {[
                {
                  id: "gis-conector",
                  label: "Conector GIS Municipal",
                  hash: "sha256-a19f...d49",
                  desc: "Análisis territorial",
                },
                {
                  id: "legal-doc-analyzer",
                  label: "Analizador Legal de Contratos",
                  hash: "sha256-f8d2...883",
                  desc: "Cumplimiento legislativo",
                },
              ].map((sk) => {
                const scanStatus = scannedSkills[sk.id];
                const isScanning = sastScanRunning === sk.id;
                return (
                  <div
                    key={sk.id}
                    className="bg-secondary/15 border border-border/30 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <span className="block font-mono text-[11px] text-platinum font-semibold">
                        {sk.label}
                      </span>
                      <span className="block font-mono text-[9px] text-muted-foreground mt-0.5">
                        {sk.hash} · {sk.desc}
                      </span>
                    </div>
                    <div>
                      {scanStatus === "passed" ? (
                        <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          PASSED SAST
                        </span>
                      ) : isScanning ? (
                        <span className="text-[9.5px] font-mono text-electric flex items-center gap-1.5">
                          <RefreshCw className="size-3.5 animate-spin" /> Escaneando...
                        </span>
                      ) : (
                        <button
                          onClick={() => runSastSandboxScan(sk.id)}
                          className="bg-electric/10 text-electric border border-electric/30 font-mono text-[10px] px-3 py-1 rounded hover:bg-electric/25 transition-all"
                        >
                          Escanear Sandbox
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Roadmap Roadmap Phases */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
              <Settings className="size-4.5 text-electric" />
              Etapas y Modelo de Distribución de Ingresos
            </h3>
            <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
              Visualización económica predictiva basada en los estadios de maduración de la
              arquitectura cognitiva.
            </p>

            {/* Stages Selector */}
            <div className="flex gap-1.5 mt-4">
              {[1, 2, 3, 4, 5, 6].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setActiveRoadmapStage(stg)}
                  className={`flex-1 font-mono text-[11px] py-1 border rounded transition-all ${
                    activeRoadmapStage === stg
                      ? "bg-electric/25 text-platinum border-electric"
                      : "border-border/30 text-muted-foreground hover:border-border/60"
                  }`}
                >
                  E{stg}
                </button>
              ))}
            </div>

            {/* Stage content details */}
            <div className="mt-4 bg-secondary/15 rounded-xl p-4 border border-border/30">
              {activeRoadmapStage === 1 && (
                <div>
                  <span className="block font-mono text-[11px] font-semibold text-platinum mb-1">
                    Fase 1: Activación Freemium y Stripe
                  </span>
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                    Habilitación del plan gratuito constitucional, membresías personales y de
                    creador, entitlements directos en Stripe y controles estrictos de cuotas.
                  </p>
                </div>
              )}
              {activeRoadmapStage === 2 && (
                <div>
                  <span className="block font-mono text-[11px] font-semibold text-platinum mb-1">
                    Fase 2: Consumo y API de Integración
                  </span>
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                    Soporte a créditos de consumo exacto en BookPI, generación dinámica de API keys
                    con scopes limitados y despliegue del catálogo de endpoints.
                  </p>
                </div>
              )}
              {activeRoadmapStage === 3 && (
                <div>
                  <span className="block font-mono text-[11px] font-semibold text-platinum mb-1">
                    Fase 3: Skills Marketplace y BookPI Ledger
                  </span>
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                    Venta de Skills validadas mediante SAST, modelo de revenue share para
                    desarrolladores y BookPI como servicio de trazabilidad externa.
                  </p>
                </div>
              )}
              {activeRoadmapStage === 4 && (
                <div>
                  <span className="block font-mono text-[11px] font-semibold text-platinum mb-1">
                    Fase 4: Soluciones Enterprise y Gubernamentales
                  </span>
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                    Despliegue de nodos locales CITEMESH, resguardo soberano de datos de
                    administraciones públicas, y simulación ambiental con el Gemelo Digital GEMET.
                  </p>
                </div>
              )}
              {activeRoadmapStage === 5 && (
                <div>
                  <span className="block font-mono text-[11px] font-semibold text-platinum mb-1">
                    Fase 5: Formación y Ciencia Abierta
                  </span>
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                    Certificaciones de especialización técnica PQC/BookPI, becas de investigación y
                    datasets curados con reconocimiento estricto de autoría.
                  </p>
                </div>
              )}
              {activeRoadmapStage === 6 && (
                <div>
                  <span className="block font-mono text-[11px] font-semibold text-platinum mb-1">
                    Fase 6: Tokenización Responsable
                  </span>
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                    Pilotos cerrados para participación comunitaria tras una evaluación estricta de
                    regulaciones financieras y mitigación de riesgos de KYC/AML.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
