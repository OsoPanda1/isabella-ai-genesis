import { useState, useEffect, useCallback } from "react";
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
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  Shield,
  Activity,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { AccountOnboarding } from "./AccountOnboarding";
import { CreditLedger, type LedgerItem } from "./CreditLedger";
import { PlanSelector } from "./PlanSelector";
import { UsageDashboard } from "./UsageDashboard";

interface Tenant {
  id: string;
  name: string;
  region: string;
  quotaBalance: number;
  tier: "Free" | "Enterprise" | "Sovereign";
}

interface UserSession {
  userId: string;
  username: string;
  tenantId: string;
  role: string;
  oidcSub: string;
  activeToken: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  traceId: string;
  correlationId: string;
  actorIp: string;
  event: string;
  severity: "S0" | "S1" | "S2" | "S3";
  details: string;
  remediated: boolean;
}

interface LedgerBlock {
  index: number;
  operation: string;
  category: "inference" | "processing" | "apis" | "skills" | "other";
  costDecimal: string;
  timestamp: string;
  status: "settled" | "pending" | "refunded";
  pqcSignature: string;
}

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
  const [activePlan, setActivePlan] = useState<string | null>("enterprise");

  // OIDC and Multi-tenancy live state
  const [sessionToken, setSessionToken] = useState(
    "oidc_sovereign_session_token_tamv_hidalgo_secure_channel",
  );
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);
  const [activeUser, setActiveUser] = useState<UserSession | null>(null);
  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeRole, setActiveRole] = useState<string>("SovereignOwner");

  // Sandbox Sandbox state
  const [sandboxCode, setSandboxCode] = useState(
    "Math.sin(PI / 2) * ACTIVE_COGNITIVE_HEADS + MAX_INF_LIMIT",
  );
  const [sandboxOutput, setSandboxOutput] = useState<unknown>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);

  // API Developer credentials simulator
  const [generatedKeys, setGeneratedKeys] = useState<
    Array<{ key: string; name: string; scopes: string[] }>
  >([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "presentation:read",
    "bookpi:append",
  ]);

  // Skills Marketplace state
  const [sastScanRunning, setSastScanRunning] = useState<string | null>(null);
  const [scannedSkills, setScannedSkills] = useState<Record<string, "passed" | "failed" | null>>({
    "gis-conector": "passed",
    "legal-doc-analyzer": null,
  });

  const [activeRoadmapStage, setActiveRoadmapStage] = useState<number>(1);

  // Sync session and records on mount and activeRole / token changes
  const fetchDbState = useCallback(async () => {
    try {
      // 1. Fetch Session
      const sessRes = await fetch(`/api/db?action=session`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      if (sessRes.ok) {
        const data = await sessRes.json();
        setActiveTenant(data.tenant);
        setActiveUser(data.session);
        setActiveRole(data.session.role);

        // Re-align plan representation based on tenant tier
        if (data.tenant.tier === "Sovereign") setActivePlan("enterprise");
        else if (data.tenant.tier === "Enterprise") setActivePlan("pro");
        else setActivePlan("free");

        // Sync local current user
        setCurrentUser({
          username: data.session.username,
          email: `${data.session.username.toLowerCase().replace(" ", "")}@tamv.network`,
          telemetryConsent: true,
        });

        // 2. Fetch Ledger
        const ledgerRes = await fetch(`/api/db?action=ledger&tenantId=${data.tenant.id}`, {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
        if (ledgerRes.ok) {
          const lData = await ledgerRes.json();
          // Map to LedgerItem layout
          const mapped: LedgerItem[] = lData.ledger.map((block: LedgerBlock) => ({
            id: `tx_block_${block.index}`,
            operation: block.operation,
            category: block.category,
            costDecimal: block.costDecimal,
            timestamp: new Date(block.timestamp).toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            status: block.status,
            node: block.pqcSignature.includes("genesis") ? "Nodo Cero (Hgo)" : "Malla CITEMESH",
          }));
          setLedger(mapped);
        }

        // 3. Fetch Audit Logs if authorized
        if (data.session.role === "SovereignOwner" || data.session.role === "Auditor") {
          const auditRes = await fetch(`/api/db?action=audit`, {
            headers: { Authorization: `Bearer ${sessionToken}` },
          });
          if (auditRes.ok) {
            const aData = await auditRes.json();
            setAuditLogs(aData.auditLogs);
          }
        } else {
          setAuditLogs([]);
        }
      }
    } catch (err) {
      console.error("No se pudo conectar a la API soberana:", err);
    }
  }, [sessionToken]);

  useEffect(() => {
    fetchDbState();
  }, [fetchDbState]);

  // Inbound usage operations
  const handleSimulateCreditUsage = async (
    operationName: string,
    category: LedgerItem["category"],
    costStr: string,
  ) => {
    const cost = parseFloat(costStr);
    try {
      const res = await fetch(`/api/db?action=ledger-add`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          operation: operationName,
          category,
          cost,
          tokens: Math.floor(cost * 1200),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(`Denegado por RBAC / Límites: ${data.error}`);
        return;
      }

      toast.success("Transacción registrada y firmada con PQC en el Ledger!");
      fetchDbState();
    } catch (err) {
      toast.error("Error al debitar créditos del ledger.");
    }
  };

  const handleRefundLedgerItem = async (txId: string) => {
    const blockIndex = parseInt(txId.replace("tx_block_", ""));
    if (isNaN(blockIndex)) return;

    try {
      const res = await fetch(`/api/db?action=ledger-refund`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ index: blockIndex }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(`Error de reembolso: ${data.error}`);
        return;
      }

      toast.success("Reembolso procesado. Crédito retornado con éxito!");
      fetchDbState();
    } catch (err) {
      toast.error("Fallo al reembolsar la transacción.");
    }
  };

  const handleSwitchRole = async (role: string) => {
    try {
      const res = await fetch(`/api/db?action=switch-role`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(`Error al cambiar rol: ${data.error}`);
        return;
      }

      setActiveRole(role);
      toast.success(`Identidad OIDC actualizada. Rol activo: ${role}`);
      fetchDbState();
    } catch (err) {
      toast.error("Error al actualizar rol OIDC.");
    }
  };

  const handleExecuteSandbox = async () => {
    setIsSandboxRunning(true);
    setSandboxOutput(null);
    setSandboxError(null);

    try {
      const res = await fetch(`/api/db?action=execute-tool`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          expression: sandboxCode,
          variables: {
            PI: Math.PI,
            MAX_INF_LIMIT: 24,
            ACTIVE_COGNITIVE_HEADS: 12,
            currentTime: Date.now(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSandboxError(data.error || "Fallo de ejecución.");
        toast.error("Ejecución en Sandbox Fallida.");
      } else {
        if (data.success) {
          setSandboxOutput(data.output);
          toast.success("Script ejecutado exitosamente en el Sandbox del servidor!");
        } else {
          setSandboxError(data.error);
          toast.error("Script rechazado por el Sandbox de seguridad.");
        }
      }
    } catch (err) {
      setSandboxError("Error al enviar script al sandbox.");
    } finally {
      setIsSandboxRunning(false);
      fetchDbState(); // Sync logs
    }
  };

  const handleSelectPlan = (planId: string) => {
    setActivePlan(planId);
  };

  const handleRefreshLimits = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      fetchDbState();
      toast.success("Cuotas de inferencia sincronizadas.");
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
    toast.success(`Clave API empresarial '${newKeyName}' generada con éxito.`);
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
      toast.success(`Verificación de código estático SAST aprobada para '${skillName}'`);
    }, 1200);
  };

  const usageStats = {
    msgUsed:
      activePlan === "personal"
        ? 145
        : activePlan === "pro"
          ? 412
          : activePlan === "enterprise"
            ? 1890
            : 14,
    msgLimit:
      activePlan === "personal"
        ? 5000
        : activePlan === "pro"
          ? 20000
          : activePlan === "enterprise"
            ? 100000
            : 50,
    tokensRemaining:
      activePlan === "personal"
        ? 84320
        : activePlan === "pro"
          ? 421900
          : activePlan === "enterprise"
            ? 1850400
            : 6850,
    tokenLimit:
      activePlan === "personal"
        ? 100000
        : activePlan === "pro"
          ? 500000
          : activePlan === "enterprise"
            ? 2000000
            : 100000,
  };

  const creditBalance = activeTenant ? activeTenant.quotaBalance.toFixed(2) : "0.00";

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* OIDC Multi-Tenancy & Identity Hub */}
      <div className="glass rounded-3xl p-6 border border-border/30 bg-gradient-to-br from-background via-secondary/15 to-secondary/30">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[9px] uppercase tracking-wider bg-electric/10 text-electric border border-electric/20 px-2 py-0.5 rounded-md font-semibold">
                OIDC Provider Sincronizado
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
                Multi-Tenancy Activo
              </span>
            </div>
            <h2 className="font-mono text-[20px] font-bold text-pearl flex items-center gap-2">
              <Shield className="size-5.5 text-electric animate-pulse" />
              Portal de Identidades y Gobernanza (OIDC / RBAC)
            </h2>
            <p className="mt-2 text-[12.5px] text-muted-foreground leading-relaxed max-w-3xl">
              Panel de control de acceso soberano. Simula cambios de tenencia e identidades OIDC en
              caliente para ver cómo se aplican las restricciones de aislamiento del Libro Mayor
              (BookPI) y del Sandbox.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:self-center">
            {/* OIDC User Profiles Select Toggles */}
            <div className="bg-secondary/40 border border-border/40 rounded-2xl p-2 flex items-center gap-2">
              <span className="font-mono text-[10.5px] text-muted-foreground uppercase pl-2">
                Simular Rol OIDC:
              </span>
              <div className="flex gap-1">
                {["SovereignOwner", "Auditor", "Operator", "Guest"].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleSwitchRole(role)}
                    className={`px-3 py-1 rounded-xl font-mono text-[10px] border transition-all ${
                      activeRole === role
                        ? "bg-electric text-platinum border-electric font-semibold shadow-[0_0_10px_rgba(112,102,249,0.3)]"
                        : "border-border/30 text-muted-foreground hover:text-platinum hover:bg-secondary/30"
                    }`}
                  >
                    {role === "SovereignOwner"
                      ? "Owner"
                      : role === "Auditor"
                        ? "Auditor"
                        : role === "Operator"
                          ? "Operator"
                          : "Guest"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sync Profile State Indicators */}
        {activeUser && activeTenant && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-border/20">
            <div className="bg-secondary/20 border border-border/20 p-3 rounded-2xl">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                Tenant / Tenencia
              </span>
              <span className="block font-mono text-[12px] font-semibold text-platinum mt-1">
                {activeTenant.name}
              </span>
              <span className="block font-mono text-[9.5px] text-muted-foreground mt-0.5">
                ID: {activeTenant.id} · {activeTenant.region}
              </span>
            </div>
            <div className="bg-secondary/20 border border-border/20 p-3 rounded-2xl">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                Usuario Conectado (OIDC Sub)
              </span>
              <span className="block font-mono text-[12px] font-semibold text-platinum mt-1">
                {activeUser.username}
              </span>
              <span className="block font-mono text-[9.5px] text-muted-foreground mt-0.5">
                Sub: {activeUser.oidcSub}
              </span>
            </div>
            <div className="bg-secondary/20 border border-border/20 p-3 rounded-2xl">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                Privilegio RBAC
              </span>
              <span className="inline-block font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded mt-1.5 uppercase">
                {activeUser.role}
              </span>
            </div>
            <div className="bg-secondary/20 border border-border/20 p-3 rounded-2xl">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                Créditos de Consumo Decimal
              </span>
              <span className="block font-mono text-[14px] font-bold text-rose-400 mt-1">
                ${creditBalance} USD
              </span>
              <span className="block font-mono text-[9.5px] text-muted-foreground mt-0.5">
                Suscripción: {activeTenant.tier}
              </span>
            </div>
          </div>
        )}
      </div>

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
      <div className="grid gap-6 md:grid-cols-[1fr_380px] items-start">
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
                <span className="font-mono text-[11px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Saldo: ${creditBalance}
                </span>
              </div>
              <h4 className="font-mono text-[13px] text-pearl font-semibold mt-2 flex items-center gap-2">
                <Cpu className="size-4 text-crown" />
                Simular Operaciones de Costo
              </h4>
              <p className="text-[11.5px] text-muted-foreground mt-1 leading-relaxed">
                Ejecuta operaciones para comprobar la deducción decimal exacta e inmediata
                registrada en el libro mayor persistente.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() =>
                  handleSimulateCreditUsage(
                    "Inferencia de Agente Antigravity",
                    "inference",
                    "4.85000",
                  )
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
                  handleSimulateCreditUsage("Consulta Espacial de Catastro", "skills", "1.25000")
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
                onClick={async () => {
                  try {
                    // Refill credits by simulated payment on DB
                    const res = await fetch(`/api/db?action=ledger-add`, {
                      method: "POST",
                      headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${sessionToken}`,
                      },
                      body: JSON.stringify({
                        operation: "Recarga de Fondos Empresariales Stripe",
                        category: "other",
                        cost: -25.0,
                        tokens: 0,
                      }),
                    });
                    if (res.ok) {
                      toast.success("Saldo recargado exitosamente! (+$25.00 USD)");
                      fetchDbState();
                    }
                  } catch (e) {
                    toast.error("Error al recargar saldo.");
                  }
                }}
                className="w-full text-center py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 rounded-xl font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Adquirir Crédito (+ $25.00)
              </button>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-border/20 text-[10.5px] text-muted-foreground font-mono">
            *Las transacciones con saldo insuficiente serán rechazadas automáticamente por el módulo
            del ledger.
          </div>
        </div>
      </div>

      {/* Real Server Sandbox Execution & API Scopes */}
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

        {/* Real Server Sandbox Executor */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
              <Terminal className="size-4.5 text-crown animate-pulse" />
              Ejecución Real en Sandbox Segura (NodeVM Server Sandbox)
            </h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Ejecuta código JavaScript de forma segura en un entorno aislado del servidor. El
              script se audita, filtra palabras prohibidas (fs, process, require) y calcula fórmulas
              en caliente con variables locales inyectadas.
            </p>

            <div className="bg-secondary/20 rounded-2xl border border-border/30 p-3 flex flex-col gap-2.5">
              <span className="font-mono text-[10px] text-muted-foreground">
                Variables disponibles: PI, MAX_INF_LIMIT, ACTIVE_COGNITIVE_HEADS, currentTime
              </span>

              <textarea
                value={sandboxCode}
                onChange={(e) => setSandboxCode(e.target.value)}
                className="w-full h-20 bg-black/40 border border-border/40 rounded-xl p-3 font-mono text-[11px] text-emerald-400 focus:outline-none"
                placeholder="Escribe tu fórmula matemática o expresión JS..."
              />

              <button
                onClick={handleExecuteSandbox}
                disabled={isSandboxRunning || !sandboxCode}
                className="w-full py-2 bg-crown/20 hover:bg-crown/30 text-crown border border-crown/35 font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSandboxRunning ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" /> Procesando VM...
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" /> Ejecutar Expresión S.S.
                  </>
                )}
              </button>

              {/* Sandbox Outputs */}
              {sandboxOutput !== null && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl font-mono text-[11px] text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>
                    Resultado VM: <strong>{JSON.stringify(sandboxOutput)}</strong>
                  </span>
                </div>
              )}

              {sandboxError && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl font-mono text-[11px] text-rose-400 flex items-center gap-2">
                  <XCircle className="size-4 shrink-0" />
                  <span>Error: {sandboxError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Security Audit Observability Stream */}
      {auditLogs.length > 0 && (
        <div className="glass rounded-3xl p-6 border border-border/30">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-mono text-[14px] text-pearl font-semibold flex items-center gap-2">
                <Activity className="size-4.5 text-rose-400 animate-pulse" />
                Flujo de Auditoría de Seguridad Real-Time (ARGUS Telemetry)
              </h3>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">
                Eventos auditables de seguridad, telemetría y bloqueos capturados del pipeline
                transaccional.
              </p>
            </div>
            <span className="font-mono text-[9.5px] uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">
              Auditoría en Caliente
            </span>
          </div>

          <div className="max-h-52 overflow-y-auto space-y-2 border border-border/20 rounded-2xl p-3 bg-secondary/10">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border border-border/20 bg-secondary/15 hover:bg-secondary/25 transition-all font-mono text-[11px]"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                        log.severity === "S3"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : log.severity === "S2"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {log.severity}
                    </span>
                    <span className="text-platinum font-semibold">{log.event}</span>
                    <span className="text-[10px] text-muted-foreground">Trace: {log.traceId}</span>
                  </div>
                  <span className="text-muted-foreground text-[10.5px]">{log.details}</span>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString("es-MX")}
                  </span>
                  {log.remediated && (
                    <span className="text-[9px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-1.5 rounded border border-emerald-500/20">
                      Remediado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                Pilotos cerrados de participación financiera tras un vasto análisis regulatorio y
                mitigación de riesgos de KYC/AML.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
