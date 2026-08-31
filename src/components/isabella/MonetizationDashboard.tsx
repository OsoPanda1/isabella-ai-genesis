import { useState } from "react";
import {
  TrendingUp,
  Cpu,
  Key,
  Layers,
  Settings,
  RefreshCw,
  UserPlus,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { AccountOnboarding } from "./AccountOnboarding";
import { CreditLedger, type LedgerItem } from "./CreditLedger";
import { PlanSelector } from "./PlanSelector";
import { UsageDashboard } from "./UsageDashboard";

export function MonetizationDashboard() {
  // Onboarding modal visibility state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    email: string;
    telemetryConsent: boolean;
  } | null>(null);

  // Free/Freemium consent state
  const [hasFreeConsent, setHasFreeConsent] = useState(true);
  const [freeMessagesUsed, setFreeMessagesUsed] = useState(14);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active membership tier state
  const [activePlan, setActivePlan] = useState<string | null>("free");

  // Multi-tier limits calculation based on active plan
  const getLimitsAndUsage = () => {
    switch (activePlan) {
      case "personal":
        return {
          msgUsed: 145,
          msgLimit: 5000,
          tokensRemaining: 84320,
          tokenLimit: 100000,
        };
      case "pro":
        return {
          msgUsed: 412,
          msgLimit: 20000,
          tokensRemaining: 421900,
          tokenLimit: 500000,
        };
      case "enterprise":
        return {
          msgUsed: 1890,
          msgLimit: 100000,
          tokensRemaining: 1850400,
          tokenLimit: 2000000,
        };
      case "free":
      default:
        return {
          msgUsed: freeMessagesUsed,
          msgLimit: 50,
          tokensRemaining: 6850,
          tokenLimit: 10000,
        };
    }
  };

  const usageStats = getLimitsAndUsage();

  // Consumption credit ledger simulation
  const [creditBalance, setCreditBalance] = useState<string>("45.00");
  const [ledger, setLedger] = useState<LedgerItem[]>([
    {
      id: "tx_01",
      operation: "Análisis Territorial GIS (GEMET)",
      category: "skills",
      costDecimal: "1.50",
      timestamp: "Hace 12 mins",
      status: "settled",
      node: "node_zero",
    },
    {
      id: "tx_02",
      operation: "Síntesis de Audio de Alta Fidelidad (ISA Core)",
      category: "inference",
      costDecimal: "0.45",
      timestamp: "Hace 2 horas",
      status: "settled",
      node: "node_zero",
    },
    {
      id: "tx_03",
      operation: "Auditoría SAST Sandbox (PRAXIS)",
      category: "processing",
      costDecimal: "2.00",
      timestamp: "Hace 1 día",
      status: "settled",
      node: "node_zero",
    },
  ]);

  // API Developer credentials simulator
  const [generatedKeys, setGeneratedKeys] = useState<
    Array<{ key: string; name: string; scopes: string[] }>
  >([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["presentation:read"]);

  // Skills Marketplace state
  const [sastScanRunning, setSastScanRunning] = useState<string | null>(null);
  const [scannedSkills, setScannedSkills] = useState<Record<string, "passed" | "failed" | null>>({
    "gis-conector": "passed",
    "legal-doc-analyzer": null,
  });

  const [activeRoadmapStage, setActiveRoadmapStage] = useState<number>(1);

  // Inbound usage operations
  const handleSimulateCreditUsage = (
    operationName: string,
    category: LedgerItem["category"],
    costStr: string,
  ) => {
    const current = parseFloat(creditBalance);
    const cost = parseFloat(costStr);
    if (current < cost) {
      alert("Créditos de consumo insuficientes. Por favor recarga créditos.");
      return;
    }
    const nextBalance = (current - cost).toFixed(2);
    setCreditBalance(nextBalance);
    setLedger((prev) => [
      {
        id: `tx_${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        operation: operationName,
        category,
        costDecimal: costStr,
        timestamp: "Ahora",
        status: "settled",
        node: "node_zero",
      },
      ...prev,
    ]);
  };

  const handleRefundLedgerItem = (txId: string) => {
    const item = ledger.find((l) => l.id === txId);
    if (!item || item.status === "refunded") return;

    // Refund calculation
    const current = parseFloat(creditBalance);
    const refundValue = parseFloat(item.costDecimal);
    setCreditBalance((current + refundValue).toFixed(2));

    setLedger((prev) => prev.map((l) => (l.id === txId ? { ...l, status: "refunded" } : l)));
  };

  const handleSelectPlan = (planId: string) => {
    setActivePlan(planId);
  };

  const handleRefreshLimits = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Simulate slight usage changes or check active quotas
      if (activePlan === "free") {
        setFreeMessagesUsed((prev) => Math.min(prev + 1, 50));
      }
    }, 800);
  };

  const handleOnboardingComplete = (data: {
    username: string;
    email: string;
    telemetryConsent: boolean;
  }) => {
    setCurrentUser(data);
    setHasFreeConsent(data.telemetryConsent);
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
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Monetization Header & Welcome Banner */}
      <div className="glass rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-mono text-[20px] font-bold text-pearl flex items-center gap-2">
            <TrendingUp className="size-5.5 text-electric animate-pulse" />
            Consola Económica y Cuotas de Inferencia
          </h2>
          <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed max-w-3xl">
            Soberanía financiera sin intermediación extractiva. Administra tus límites del plan
            gratuito constitucional, compara suscripciones de infraestructura, adquiere créditos
            decimales exactos y genera claves de acceso para APIs locales.
          </p>
        </div>

        {/* Account state / Onboarding button */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          {currentUser ? (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3 flex flex-col items-end">
              <span className="font-mono text-[10.5px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                Operador Identificado
              </span>
              <span className="font-mono text-[11px] text-platinum mt-1">
                {currentUser.username}
              </span>
            </div>
          ) : (
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-4 py-3 bg-electric/20 hover:bg-electric/30 text-electric border border-electric/35 font-mono text-[11px] uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2"
            >
              <UserPlus className="size-4" />
              Configurar Cuenta S.H.
            </button>
          )}
        </div>
      </div>

      {/* Account Onboarding modal container */}
      <AccountOnboarding
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Sleek Usage Dashboard Component */}
      <UsageDashboard
        activePlanId={activePlan}
        messagesUsed={usageStats.msgUsed}
        messageLimit={usageStats.msgLimit}
        tokensRemaining={usageStats.tokensRemaining}
        tokenLimit={usageStats.tokenLimit}
        onRefresh={handleRefreshLimits}
        isRefreshing={isRefreshing}
      />

      {/* Interactive Plan Selector Comparison Component */}
      <div className="glass rounded-3xl p-6">
        <PlanSelector currentPlanId={activePlan} onSelectPlan={handleSelectPlan} />
      </div>

      {/* Credit balance simulation controls & Structured Ledger UI */}
      <div className="grid gap-6 md:grid-cols-[1fr_380px] items-stretch">
        <div className="flex flex-col gap-6">
          <CreditLedger ledger={ledger} onRefund={handleRefundLedgerItem} />
        </div>

        {/* Quick balance actions panel */}
        <div className="glass rounded-3xl p-5 border border-border/40 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Créditos Disponibles
                </span>
                <span className="font-mono text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Saldo: ${creditBalance}
                </span>
              </div>
              <h4 className="font-mono text-[13px] text-pearl font-semibold mt-2 flex items-center gap-2">
                <Cpu className="size-4 text-crown" />
                Simular Operaciones de Costo
              </h4>
              <p className="text-[11.5px] text-muted-foreground mt-1 leading-relaxed">
                Ejecuta operaciones para comprobar la deducción decimal exacta e inmediata
                registrada en el libro mayor.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() =>
                  handleSimulateCreditUsage("Inferencia de Agente Antigravity", "inference", "4.85")
                }
                className="w-full text-left p-3 rounded-xl border border-border/30 bg-secondary/15 hover:bg-secondary/35 transition-all font-mono text-[11px] flex items-center justify-between"
              >
                <div>
                  <span className="block text-platinum font-semibold">Agente Antigravity</span>
                  <span className="block text-[9.5px] text-muted-foreground mt-0.5">
                    Llamada a modelo interactivo
                  </span>
                </div>
                <span className="text-rose-400 font-bold">-$4.85</span>
              </button>

              <button
                onClick={() =>
                  handleSimulateCreditUsage("Consulta Espacial de Catastro", "skills", "1.25")
                }
                className="w-full text-left p-3 rounded-xl border border-border/30 bg-secondary/15 hover:bg-secondary/35 transition-all font-mono text-[11px] flex items-center justify-between"
              >
                <div>
                  <span className="block text-platinum font-semibold">Consulta GIS Espacial</span>
                  <span className="block text-[9.5px] text-muted-foreground mt-0.5">
                    Deducción de tokens GIS
                  </span>
                </div>
                <span className="text-rose-400 font-bold">-$1.25</span>
              </button>

              <button
                onClick={() => setCreditBalance((parseFloat(creditBalance) + 20.0).toFixed(2))}
                className="w-full text-center py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 rounded-xl font-mono text-[10px] uppercase tracking-wider transition-all"
              >
                Adquirir Crédito (+ $20.00)
              </button>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-border/20 text-[10.5px] text-muted-foreground font-mono">
            *Las transacciones con saldo insuficiente serán rechazadas automáticamente por el módulo
            del ledger.
          </div>
        </div>
      </div>

      {/* Multi-tier security & Malla CITEMESH */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* API Scopes Security */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
              <Key className="size-4.5 text-electric" />
              API & Claves de Acceso con Scopes
            </h3>
            <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
              Define credenciales para interactuar con los endpoints locales del Nodo Cero. Cada
              llave debe tener alcances restringidos.
            </p>

            <div className="mt-4 bg-secondary/15 border border-border/30 rounded-2xl p-3.5 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre de la llave (Ej. GIS Link)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 bg-secondary/30 border border-border/40 rounded-xl font-mono text-[11px] px-3 py-2 text-platinum focus:outline-none"
                />
                <button
                  onClick={handleGenerateApiKey}
                  className="bg-electric/20 hover:bg-electric/30 text-electric border border-electric/30 font-mono text-[11px] px-4 rounded-xl transition-all"
                >
                  Generar
                </button>
              </div>

              {/* Scopes Selection */}
              <div className="flex flex-wrap gap-1.5 pt-1">
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
                      className={`px-2.5 py-1 rounded-lg font-mono text-[9px] border transition-all ${
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
                <div className="mt-3.5 space-y-2 border-t border-border/20 pt-3">
                  {generatedKeys.map((k, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between font-mono text-[11px] bg-secondary/20 p-2.5 rounded-xl border border-border/20 animate-fade-in"
                    >
                      <div className="text-platinum font-semibold truncate max-w-[45%]">
                        {k.name}
                      </div>
                      <div className="text-electric font-mono text-[10.5px] select-all">
                        {k.key}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PRAXIS Skills Catalog Security */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
              <Layers className="size-4.5 text-crown" />
              Suscripción a Herramientas PRAXIS
            </h3>
            <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
              Verifica los complementos territoriales de Isabella mediante un riguroso sandboxing y
              análisis SAST antes de su habilitación.
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
                    className="bg-secondary/15 border border-border/30 rounded-2xl p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <span className="block font-mono text-[12px] text-platinum font-semibold">
                        {sk.label}
                      </span>
                      <span className="block font-mono text-[9.5px] text-muted-foreground mt-0.5">
                        {sk.hash} · {sk.desc}
                      </span>
                    </div>
                    <div>
                      {scanStatus === "passed" ? (
                        <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                          PASSED SAST
                        </span>
                      ) : isScanning ? (
                        <span className="text-[9.5px] font-mono text-electric flex items-center gap-1.5">
                          <RefreshCw className="size-3.5 animate-spin" /> Escaneando...
                        </span>
                      ) : (
                        <button
                          onClick={() => runSastSandboxScan(sk.id)}
                          className="bg-electric/10 text-electric border border-electric/30 font-mono text-[10px] px-3.5 py-1 rounded-lg hover:bg-electric/25 transition-all"
                        >
                          Escanear
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap phases block */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
          <Settings className="size-4.5 text-electric animate-spin-slow" />
          Plan y Hoja de Ruta de Expansión
        </h3>
        <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
          Navega por las fases previstas de distribución económica y modelos de coinversión
          territorial de Isabella Villaseñor AI.
        </p>

        {/* Stages Selector */}
        <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1 md:pb-0">
          {[1, 2, 3, 4, 5, 6].map((stg) => (
            <button
              key={stg}
              onClick={() => setActiveRoadmapStage(stg)}
              className={`flex-1 min-w-[50px] font-mono text-[11px] py-1.5 border rounded-xl transition-all ${
                activeRoadmapStage === stg
                  ? "bg-electric/25 text-platinum border-electric font-semibold"
                  : "border-border/30 text-muted-foreground hover:border-border/60"
              }`}
            >
              Etapa {stg}
            </button>
          ))}
        </div>

        {/* Stage content details */}
        <div className="mt-4 bg-secondary/15 rounded-2xl p-4 border border-border/30">
          {activeRoadmapStage === 1 && (
            <div>
              <span className="block font-mono text-[12px] font-semibold text-platinum mb-1">
                Etapa 1: Activación Freemium y Stripe
              </span>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Despliegue del plan gratuito constitucional, registro de usuarios con consentimiento
                y políticas transparentes de telemetría.
              </p>
            </div>
          )}
          {activeRoadmapStage === 2 && (
            <div>
              <span className="block font-mono text-[12px] font-semibold text-platinum mb-1">
                Etapa 2: Consumo y API de Integración
              </span>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Habilitación de créditos de consumo exacto en BookPI, generación dinámica de API
                keys con alcances estrictos de seguridad.
              </p>
            </div>
          )}
          {activeRoadmapStage === 3 && (
            <div>
              <span className="block font-mono text-[12px] font-semibold text-platinum mb-1">
                Etapa 3: Skills Marketplace y BookPI Ledger
              </span>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Venta y ejecución de Skills validadas mediante análisis estático SAST, modelo de
                distribución de ingresos para desarrolladores.
              </p>
            </div>
          )}
          {activeRoadmapStage === 4 && (
            <div>
              <span className="block font-mono text-[12px] font-semibold text-platinum mb-1">
                Etapa 4: Soluciones Enterprise y Gubernamentales
              </span>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Despliegue de mallas dedicadas CITEMESH, resguardo de datos soberanos de
                administraciones y simulación espacial GEMET.
              </p>
            </div>
          )}
          {activeRoadmapStage === 5 && (
            <div>
              <span className="block font-mono text-[12px] font-semibold text-platinum mb-1">
                Etapa 5: Formación y Ciencia Abierta
              </span>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Certificaciones técnicas especializadas en resguardo de datos, becas de
                investigación y datasets curados con autoría canónica.
              </p>
            </div>
          )}
          {activeRoadmapStage === 6 && (
            <div>
              <span className="block font-mono text-[12px] font-semibold text-platinum mb-1">
                Etapa 6: Tokenización Responsable
              </span>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Pilotos cerrados de participación financiera tras un exhaustivo análisis regulatorio
                y mitigación de riesgos de KYC/AML.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
