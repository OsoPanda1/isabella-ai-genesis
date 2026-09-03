import { useState, useRef, useEffect } from "react";
import { PRESETS, type PresetId, type RoutingDecision } from "@/lib/crown-ui";
import { skillGroups, type IsabellaSkill } from "@/lib/skill-registry";
import { CheckCircle2, FlaskConical, XCircle, Sparkles } from "lucide-react";
import { ModuleRail } from "./ModuleRail";

/**
 * RIGHT RAILS (src/components/isabella/RightRails.tsx)
 * -----------------------------------------------------------------
 * Dos rieles independientes retractiles en el lado derecho:
 *  1. Preset Cognitivo — selección de presets C.R.O.W.N.
 *  2. ARGUS Policy Gate — decisión de política, motivo y reglas.
 *
 * Cada riel es un acordeón funcional con estado, selección, accesibilidad
 * (ARIA) y navegación por teclado. En móvil se apilan horizontalmente;
 * en escritorio conviven apilados a la derecha del contenido.
 */

const POLICY_LABEL: Record<string, string> = {
  allowed: "AUTORIZADO",
  requires_approval: "RATIFICACIÓN HUMANA",
  denied: "DENEGADO",
};

const POLICY_COLOR: Record<string, string> = {
  allowed: "var(--argus)",
  requires_approval: "var(--orion)",
  denied: "var(--destructive)",
};

export function RightRails({
  presetId,
  setPresetId,
  decision,
  isProcessing,
}: {
  presetId: PresetId;
  setPresetId: (id: PresetId) => void;
  decision: RoutingDecision | null;
  isProcessing: boolean;
}) {
  const [presetOpen, setPresetOpen] = useState(true);
  const [argusOpen, setArgusOpen] = useState(true);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ Orquestación: true });
  const presetRef = useRef<HTMLDivElement | null>(null);
  const argusRef = useRef<HTMLDivElement | null>(null);
  const presetHeaderRef = useRef<HTMLButtonElement | null>(null);
  const argusHeaderRef = useRef<HTMLButtonElement | null>(null);
  const [presetFocusIndex, setPresetFocusIndex] = useState(-1);

  const policy = decision?.policy ?? "allowed";

  // Lista de presets para navegación por teclado (fila de radio-buttons).
  const presetIds = PRESETS.map((p) => p.id);

  // Colapsar el rail opuesto al abrir uno (como acordeón de dos paneles).
  const togglePreset = () => {
    setPresetOpen((o) => !o);
    setArgusOpen(false);
  };
  const toggleArgus = () => {
    setArgusOpen((o) => !o);
    setPresetOpen(false);
  };

  const handlePresetKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") {
      return;
    }
    e.preventDefault();
    let next = index;
    if (e.key === "ArrowDown") next = (index + 1) % presetIds.length;
    else if (e.key === "ArrowUp") next = (index - 1 + presetIds.length) % presetIds.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = presetIds.length - 1;
    setPresetFocusIndex(next);
    const buttons = presetRef.current?.querySelectorAll<HTMLButtonElement>("[data-preset-btn]");
    buttons?.[next]?.focus();
  };

  // Al abrir un panel, mover el foco al contenido y anunciar su estado.
  useEffect(() => {
    if (presetOpen && presetFocusIndex >= 0) {
      presetRef.current?.querySelectorAll<HTMLButtonElement>("[data-preset-btn]")[presetFocusIndex]?.focus();
    }
  }, [presetFocusIndex, presetOpen]);

  return (
    <div className="flex flex-col gap-3" aria-label="Rieles laterales: Preset y Policy Gate">
      {/* ===================== RAIL 1: PRESET COGNITIVO ===================== */}
      <section className="crystal-3d crystal-3d-argus rounded-2xl">
        <button
          ref={presetHeaderRef}
          type="button"
          onClick={togglePreset}
          aria-expanded={presetOpen}
          aria-controls="rail-preset-panel"
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2">
            <span
              className="size-1.5 rounded-full animate-breathe"
              style={{ background: "var(--sophia)" }}
            />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Preset cognitivo
            </h2>
          </span>
          <Chevron className={presetOpen ? "rotate-180" : ""} />
        </button>

        {presetOpen && (
          <div
            ref={presetRef}
            id="rail-preset-panel"
            role="group"
            aria-label="Selección de preset cognitivo"
            className="px-3 pb-3 space-y-1.5 animate-rise"
          >
            {PRESETS.map((p, index) => {
              const on = p.id === presetId;
              return (
                <button
                  key={p.id}
                  data-preset-btn
                  type="button"
                  onClick={() => {
                    setPresetId(p.id);
                    setPresetFocusIndex(index);
                  }}
                  onKeyDown={(e) => handlePresetKey(e, index)}
                  aria-pressed={on}
                  tabIndex={index === presetFocusIndex ? 0 : -1}
                  className={`crystal-touch w-full rounded-xl border px-3 py-2 text-left transition-all duration-300 ${
                    on ? "glow-ring border-primary/60 bg-secondary/50" : "border-border/50 hover:bg-secondary/25"
                  }`}
                >
                  <span className={`block text-[12.5px] ${on ? "text-platinum" : "text-foreground/80"}`}>
                    {p.name}
                  </span>
                  <span className="block text-[10.5px] leading-snug text-muted-foreground">
                    {p.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ===================== RAIL 2: ARGUS POLICY GATE ===================== */}
      <section className="crystal-3d crystal-3d-argus rounded-2xl">
        <button
          ref={argusHeaderRef}
          type="button"
          onClick={toggleArgus}
          aria-expanded={argusOpen}
          aria-controls="rail-argus-panel"
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2">
            <span
              className="size-1.5 rounded-full"
              style={{ background: "var(--argus)" }}
            />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Policy Gate · ARGUS
            </h2>
          </span>
          <Chevron className={argusOpen ? "rotate-180" : ""} />
        </button>

        {argusOpen && (
          <div
            ref={argusRef}
            id="rail-argus-panel"
            className="px-4 pb-4 space-y-3 animate-rise"
            aria-live="polite"
          >
            <p
              className="font-mono text-[12px] tracking-[0.16em]"
              style={{ color: POLICY_COLOR[policy] }}
            >
              {POLICY_LABEL[policy]}
            </p>
            <p className="text-[11px] leading-snug text-muted-foreground">
              {decision?.policyReason ?? "Sin ciclo evaluado en esta sesión."}
            </p>
            <div className="space-y-1">
              {(decision?.rulesChecked ?? []).map((r) => (
                <p
                  key={r}
                  className="font-mono text-[9.5px] tracking-[0.08em] text-muted-foreground/80"
                >
                  ✓ {r}
                </p>
              ))}
            </div>
            <div className="border-t border-border/20 pt-3">
              <ModuleRail decision={decision} active={isProcessing} />
            </div>
          </div>
        )}
      </section>

      <section className="crystal-3d crystal-3d-argus rounded-2xl">
        <button type="button" onClick={() => setSkillsOpen((value) => !value)} aria-expanded={skillsOpen} aria-controls="rail-skills-panel" className="w-full flex items-center justify-between px-4 py-3 text-left">
          <span className="flex items-center gap-2"><Sparkles className="size-3.5 text-cyan-200" /><span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/80">Skills de Isabella</span></span>
          <Chevron className={skillsOpen ? "rotate-180" : ""} />
        </button>
        {skillsOpen && <div id="rail-skills-panel" className="space-y-2 px-3 pb-3 animate-rise" aria-label="Registro de skills funcionales">
          {skillGroups().map((group) => <div key={group.folder} className="rounded-xl border border-border/50 bg-background/20">
            <button type="button" className="flex w-full items-center justify-between px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-cyan-100" aria-expanded={openFolders[group.folder] ?? false} onClick={() => setOpenFolders((value) => ({ ...value, [group.folder]: !(value[group.folder] ?? false) }))}><span>{group.folder}</span><Chevron className={openFolders[group.folder] ? "rotate-180" : ""} /></button>
            {openFolders[group.folder] && <div className="space-y-1 px-2 pb-2">{group.items.map((skill) => <SkillRow key={skill.id} skill={skill} />)}</div>}
          </div>)}
        </div>}
      </section>
    </div>
  );
}

function SkillRow({ skill }: { skill: IsabellaSkill }) {
  const Icon = skill.status === "verified" || skill.status === "implemented" ? CheckCircle2 : skill.status === "experimental" ? FlaskConical : XCircle;
  return <div className="crystal-touch rounded-lg border border-border/40 px-2.5 py-2" title={`Invoca con @${skill.id}`}><div className="flex items-center gap-2"><Icon className="size-3.5 text-cyan-200" /><span className="font-mono text-[10px] text-foreground/90">@{skill.id}</span></div><p className="mt-1 text-[10px] leading-snug text-muted-foreground">{skill.description}</p></div>;
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-muted-foreground transition-transform duration-300 ${className}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
