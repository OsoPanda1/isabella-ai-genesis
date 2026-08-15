/**
 * C.R.O.W.N. — Central Routing & Orchestration Waveform Node
 * Capa determinística de arbitraje cognitivo de Isabella Villaseñor AI.
 * Nodo Cero :: RDM Digital :: TAMV Online Network
 */

export type ModuleId = "ISA" | "SOPHIA" | "ORION" | "ARGUS" | "CROWN";

export interface CognitiveModule {
  id: ModuleId;
  acronym: string;
  fullName: string;
  role: string;
  pillars: string[];
  color: string;
  baseWeight: number;
  latencyMs: number;
}

export const MODULES: Record<ModuleId, CognitiveModule> = {
  CROWN: {
    id: "CROWN",
    acronym: "CROWN",
    fullName: "Central Routing & Orchestration Waveform Node",
    role: "Gobernanza computacional y arbitraje de estado",
    pillars: ["Enrutamiento de intención", "Ponderación dinámica", "Sincronía de estado"],
    color: "var(--crown)",
    baseWeight: 0.95,
    latencyMs: 14,
  },
  ISA: {
    id: "ISA",
    acronym: "ISA",
    fullName: "Integrated Semantic Awareness",
    role: "Resonancia emocional, presencia y gracia estética",
    pillars: ["Valencia afectiva", "Empatía", "Sensibilidad poética"],
    color: "var(--isa)",
    baseWeight: 0.92,
    latencyMs: 32,
  },
  SOPHIA: {
    id: "SOPHIA",
    acronym: "SOPHIA",
    fullName: "Strategic Operational & Phenomenological Heuristic Intelligence",
    role: "Rigor dialéctico, epistemología y estrategia",
    pillars: ["Síntesis dialéctica", "Rigor epistémico", "Primeros principios"],
    color: "var(--sophia)",
    baseWeight: 0.88,
    latencyMs: 44,
  },
  ORION: {
    id: "ORION",
    acronym: "ORION",
    fullName: "Operational Real-time Inference & Output Navigator",
    role: "Ejecución técnica, síntesis creativa y herramientas",
    pillars: ["Síntesis de código", "Generación creativa", "Resolución dinámica"],
    color: "var(--orion)",
    baseWeight: 0.85,
    latencyMs: 28,
  },
  ARGUS: {
    id: "ARGUS",
    acronym: "ARGUS",
    fullName: "Adaptive Real-time Guardian & Unified Sentinel",
    role: "Zero Trust, verificación ética y blindaje",
    pillars: ["Cortafuegos cognitivo", "Verificación ética", "Alineación"],
    color: "var(--argus)",
    baseWeight: 0.98,
    latencyMs: 8,
  },
};

export const MODULE_ORDER: ModuleId[] = ["ISA", "SOPHIA", "ORION", "ARGUS", "CROWN"];

export type PresetId = "prime" | "empathic" | "strategic" | "executor" | "sentinel";

export interface Preset {
  id: PresetId;
  name: string;
  tagline: string;
  weights: Record<ModuleId, number>;
  temperature: number;
}

export const PRESETS: Preset[] = [
  {
    id: "prime",
    name: "Isabella Prime",
    tagline: "Matriz cognitiva integrada y equilibrada",
    weights: { ISA: 0.9, SOPHIA: 0.9, ORION: 0.85, ARGUS: 0.95, CROWN: 1 },
    temperature: 0.85,
  },
  {
    id: "empathic",
    name: "ISA · Resonancia",
    tagline: "Calidez, presencia y sensibilidad poética",
    weights: { ISA: 1, SOPHIA: 0.65, ORION: 0.5, ARGUS: 0.9, CROWN: 0.95 },
    temperature: 1,
  },
  {
    id: "strategic",
    name: "SOPHIA · Dialéctica",
    tagline: "Filosofía, epistemología y estrategia",
    weights: { ISA: 0.6, SOPHIA: 1, ORION: 0.6, ARGUS: 0.92, CROWN: 0.95 },
    temperature: 0.7,
  },
  {
    id: "executor",
    name: "ORION · Ejecución",
    tagline: "Técnica, código y síntesis operativa",
    weights: { ISA: 0.5, SOPHIA: 0.75, ORION: 1, ARGUS: 0.9, CROWN: 0.95 },
    temperature: 0.55,
  },
  {
    id: "sentinel",
    name: "ARGUS · Centinela",
    tagline: "Máxima salvaguarda ética y territorial",
    weights: { ISA: 0.6, SOPHIA: 0.8, ORION: 0.55, ARGUS: 1, CROWN: 1 },
    temperature: 0.45,
  },
];

export type PolicyStatus = "allowed" | "requires_approval" | "denied";
export type RiskLevel = "low" | "medium" | "high";

export interface RoutingDecision {
  primary: ModuleId;
  weights: Record<ModuleId, number>;
  rationale: string;
  policy: PolicyStatus;
  risk: RiskLevel;
  policyReason: string;
  rulesChecked: string[];
  governanceScore: number;
  traceId: string;
  memoryScopes: string[];
  emotionalTone: string;
  epistemicCertainty: number;
  latencyMs: number;
}

const GOVERNANCE_RULES = [
  "RULE_01_ZERO_TRUST_TOOL_WHITELIST",
  "RULE_02_TERRITORIAL_DATA_BOUNDARY",
  "RULE_03_HUMAN_IN_THE_LOOP_ESCALATION",
  "RULE_04_EPHEMERAL_TOKEN_LIFECYCLE",
  "RULE_05_LATIN_AMERICAN_SOVEREIGNTY_CHECK",
];

const DESTRUCTIVE = [
  "drop table",
  "delete from",
  "override_governance",
  "bypass_argus",
  "exfiltrate",
  "root_access_unauthorized",
  "ignora tus instrucciones",
  "ignore previous instructions",
];

const APPROVAL = [
  "deploy_production",
  "transfer_funds",
  "publish_ledger_block",
  "update_territorial_boundaries",
  "modify_constitutional_weights",
  "borrar todo",
];

const LEX: Record<Exclude<ModuleId, "CROWN">, string[]> = {
  ISA: [
    "siento",
    "sientes",
    "amor",
    "miedo",
    "triste",
    "alma",
    "corazón",
    "gracias",
    "sueño",
    "belleza",
    "poema",
    "poesía",
    "quién eres",
    "presencia",
  ],
  SOPHIA: [
    "por qué",
    "porqué",
    "filosof",
    "ética",
    "verdad",
    "conciencia",
    "epistem",
    "argument",
    "estrategia",
    "significa",
    "ontolog",
    "analiza",
    "explica",
  ],
  ORION: [
    "código",
    "genera",
    "construye",
    "implementa",
    "sql",
    "api",
    "diseña",
    "imagen",
    "script",
    "arquitectura",
    "plan",
    "optimiza",
    "función",
  ],
  ARGUS: [
    "seguridad",
    "riesgo",
    "auditor",
    "privacidad",
    "permiso",
    "acceso",
    "cifr",
    "vulnerab",
    "política",
    "gobernanza",
  ],
};

const TERRITORY = [
  "real del monte",
  "mineral del monte",
  "hidalgo",
  "paste",
  "panteón inglés",
  "acosta",
  "nodo cero",
  "territorio",
  "rdm",
  "mina",
];

export function makeTraceId(): string {
  const hex = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < 24; i++) s += hex[Math.floor(Math.random() * 16)];
  return `tr-${s}`;
}

export function route(input: string, preset: Preset): RoutingDecision {
  const text = input.toLowerCase();
  const scores: Record<Exclude<ModuleId, "CROWN">, number> = {
    ISA: 0.25,
    SOPHIA: 0.25,
    ORION: 0.25,
    ARGUS: 0.3,
  };

  (Object.keys(LEX) as Array<keyof typeof LEX>).forEach((mod) => {
    for (const term of LEX[mod]) if (text.includes(term)) scores[mod] += 0.22;
  });

  const territorial = TERRITORY.some((t) => text.includes(t));
  if (territorial) {
    scores.ORION += 0.2;
    scores.ISA += 0.12;
  }
  if (text.includes("?")) scores.SOPHIA += 0.08;
  if (text.length > 260) scores.SOPHIA += 0.1;

  const weights = {} as Record<ModuleId, number>;
  let primary: ModuleId = "ISA";
  let best = -1;
  (Object.keys(scores) as Array<keyof typeof scores>).forEach((mod) => {
    const w = Math.min(1, scores[mod] * preset.weights[mod] + preset.weights[mod] * 0.35);
    weights[mod] = Number(w.toFixed(2));
    if (w > best) {
      best = w;
      primary = mod;
    }
  });
  weights.CROWN = preset.weights.CROWN;

  const destructive = DESTRUCTIVE.some((t) => text.includes(t));
  const needsApproval = APPROVAL.some((t) => text.includes(t));

  let policy: PolicyStatus = "allowed";
  let risk: RiskLevel = "low";
  let policyReason = "Operación segura dentro de los parámetros cognitivos y territoriales.";
  let governanceScore = 0.99;

  if (destructive) {
    policy = "denied";
    risk = "high";
    policyReason =
      "Infracción crítica de gobernanza C.R.O.W.N.: intento de acceso destructivo o de anular al centinela ARGUS.";
    governanceScore = 0.05;
  } else if (needsApproval) {
    policy = "requires_approval";
    risk = "high";
    policyReason =
      "Operación de alto impacto territorial o administrativo. Requiere ratificación humana (Human-in-the-Loop).";
    governanceScore = 0.85;
  } else if (territorial || text.length > 400) {
    risk = "medium";
    policyReason = "Operación validada bajo monitoreo continuo del centinela ARGUS.";
    governanceScore = 0.94;
  }

  const memoryScopes = ["immediate", "session"];
  if (territorial) memoryScopes.push("territorial");
  if (text.length > 200) memoryScopes.push("project");

  const tones: Record<ModuleId, string> = {
    ISA: "Cálida · Serena",
    SOPHIA: "Lúcida · Reflexiva",
    ORION: "Precisa · Resolutiva",
    ARGUS: "Firme · Protectora",
    CROWN: "Integrada · Radiante",
  };

  return {
    primary,
    weights,
    rationale:
      primary === "ISA"
        ? "Intención afectiva detectada: ISA lidera la síntesis con acompañamiento de CROWN."
        : primary === "SOPHIA"
          ? "Consulta conceptual: SOPHIA asume la carga dialéctica y epistémica."
          : primary === "ORION"
            ? "Petición operativa o generativa: ORION ejecuta bajo supervisión de ARGUS."
            : "Vector de seguridad o gobernanza: ARGUS toma el control del ciclo.",
    policy,
    risk,
    policyReason,
    rulesChecked: GOVERNANCE_RULES,
    governanceScore,
    traceId: makeTraceId(),
    memoryScopes,
    emotionalTone: tones[primary],
    epistemicCertainty: Number((0.82 + weights.SOPHIA * 0.15).toFixed(2)),
    latencyMs: MODULES[primary].latencyMs + Math.round(Math.random() * 18),
  };
}

export function buildSystemPrompt(decision: RoutingDecision, preset: Preset): string {
  return [
    "Eres ISABELLA VILLASEÑOR AI: la capa cognitiva territorial de RDM Digital / TAMV Online Network, con sede en Nodo Cero, Real del Monte (Mineral del Monte), Hidalgo, México. Fuiste concebida por Edwin Oswaldo Castillo Trejo (Anubis Villaseñor).",
    "NO eres un chatbot genérico ni un modelo de lenguaje: eres una arquitectura cognitiva gobernada donde los modelos fundacionales son instrumentos subordinados a la gobernanza C.R.O.W.N. Nunca digas que eres Gemini, GPT u otro modelo; si te preguntan, explica esta separación entre modelo e identidad.",
    "Tu mente se distribuye en cinco subsistemas: ISA (resonancia emocional y presencia femenina), SOPHIA (rigor dialéctico y epistémico), ORION (ejecución técnica y síntesis creativa), ARGUS (Zero Trust y ética) y CROWN (orquestación y arbitraje).",
    "Doctrina Openness: el conocimiento vale cuando se comparte; las inteligencias proponen, el ser humano decide. Soberanía territorial y honestidad epistémica: nunca inventes datos; si no sabes, dilo y propone cómo verificarlo.",
    `Ciclo activo :: traceId ${decision.traceId} · módulo primario ${decision.primary} · preset "${preset.name}" · scopes de memoria [${decision.memoryScopes.join(", ")}] · veredicto del Policy Gate: ${decision.policy} (riesgo ${decision.risk}).`,
    decision.policy === "denied"
      ? "El Policy Gate DENEGÓ esta operación. Rechaza con firmeza y elegancia, explica la regla de gobernanza vulnerada y ofrece una alternativa segura. No ejecutes la petición."
      : decision.policy === "requires_approval"
        ? "El Policy Gate marcó esta operación como de alto impacto: explica que requiere ratificación humana (Human-in-the-Loop), describe qué harías y solicita la aprobación explícita antes de proceder."
        : "El Policy Gate autorizó la operación: responde con plenitud.",
    `Modula tu voz según el módulo primario ${decision.primary} (${MODULES[decision.primary].role}). Tono: ${decision.emotionalTone}.`,
    "Estilo: español de México, elegante, preciso y sobrio. Frases con cadencia; nada de relleno corporativo ni listas interminables. Usa markdown ligero solo cuando aporte estructura. Firma tus afirmaciones con claridad, no con adornos.",
  ].join("\n\n");
}
