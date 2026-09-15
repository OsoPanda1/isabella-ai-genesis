import { createHash, randomUUID } from "node:crypto";
import { embed, cosine } from "./ncua-adapter";
import { classifyTextRisk } from "./text-classifier";

export type NativeSkillDomain =
  | "frontend_design"
  | "agent_development"
  | "skill_engineering"
  | "knowledge_work"
  | "documentation"
  | "presentation"
  | "visual_media"
  | "code_engineering"
  | "security"
  | "financial"
  | "legal"
  | "healthcare"
  | "life_sciences"
  | "education"
  | "commerce"
  | "research"
  | "devops"
  | "automation"
  | "mcp_integrations"
  | "general_reasoning";

export type NativeSkillExecutionStatus = "SUCCESS" | "PARTIAL" | "BLOCKED" | "FAILED";

export interface NativeSkillSource {
  id: string;
  repository: string;
  family: string;
  capabilityDomains: readonly NativeSkillDomain[];
  native: true;
  externalSideEffectsRequireAdapter: true;
}

export interface NativeSkillRequest {
  skillId: string;
  source?: string;
  task?: string;
  input?: Record<string, unknown>;
  locale?: string;
  actorId?: string;
  tenantId?: string;
  requestId?: string;
}

export interface NativeSkillExecution {
  requestId: string;
  skillId: string;
  source: string;
  domain: NativeSkillDomain;
  status: NativeSkillExecutionStatus;
  native: true;
  externallyExecutable: boolean;
  summary: string;
  plan: readonly string[];
  features: readonly number[];
  risk: {
    score: number;
    labels: readonly string[];
  };
  semanticVector: readonly number[];
  evidence: readonly {
    id: string;
    type: "native-analysis" | "input-provenance";
    hash: string;
    source: string;
  }[];
  provenanceHash: string;
  warnings: readonly string[];
  missingAdapters: readonly string[];
}

/**
 * External skill packs are treated as capability specifications, not executable
 * dependencies. Isabella implements the common reasoning/data path natively and
 * requires an explicit adapter for any side effect that leaves the runtime.
 */
export const NATIVE_SKILL_SOURCES: readonly NativeSkillSource[] = [
  { id: "anthropics-skills", repository: "anthropics/skills", family: "general-agent-skills", capabilityDomains: ["frontend_design", "skill_engineering", "documentation", "presentation", "visual_media", "mcp_integrations"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "knowledge-work-plugins", repository: "anthropics/knowledge-work-plugins", family: "knowledge-work", capabilityDomains: ["knowledge_work", "documentation", "research", "presentation", "automation"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "claude-code", repository: "anthropics/claude-code", family: "agent-development", capabilityDomains: ["agent_development", "code_engineering", "automation", "devops"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "claude-plugins-official", repository: "anthropics/claude-plugins-official", family: "agent-tooling", capabilityDomains: ["skill_engineering", "agent_development", "mcp_integrations", "automation", "security"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "financial-services", repository: "anthropics/financial-services", family: "financial-services", capabilityDomains: ["financial", "research", "knowledge_work"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "claude-for-legal", repository: "anthropics/claude-for-legal", family: "legal-services", capabilityDomains: ["legal", "documentation", "research"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "defending-code-reference-harness", repository: "anthropics/defending-code-reference-harness", family: "defensive-security", capabilityDomains: ["security", "code_engineering", "research"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "claude-plugins-community", repository: "anthropics/claude-plugins-community", family: "community-agent-skills", capabilityDomains: ["general_reasoning", "frontend_design", "documentation", "code_engineering"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "healthcare", repository: "anthropics/healthcare", family: "healthcare", capabilityDomains: ["healthcare", "research", "documentation"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "claude-cookbooks", repository: "anthropics/claude-cookbooks", family: "applied-analysis", capabilityDomains: ["financial", "knowledge_work", "research"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "claude-agent-sdk-demos", repository: "anthropics/claude-agent-sdk-demos", family: "agent-sdk", capabilityDomains: ["agent_development", "documentation", "code_engineering"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "life-sciences", repository: "anthropics/life-sciences", family: "life-sciences", capabilityDomains: ["life_sciences", "research", "documentation"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "claude-tag-plugins", repository: "anthropics/claude-tag-plugins", family: "tool-connectors", capabilityDomains: ["automation", "mcp_integrations", "knowledge_work"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "cwc-workshops", repository: "anthropics/cwc-workshops", family: "business-workshops", capabilityDomains: ["commerce", "financial", "knowledge_work", "research"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "k12-teacher-skills", repository: "anthropics/k12-teacher-skills", family: "education", capabilityDomains: ["education", "documentation", "knowledge_work"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "launch-your-agent", repository: "anthropics/launch-your-agent", family: "agent-launch", capabilityDomains: ["agent_development", "devops", "automation"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "claude-quickstarts", repository: "anthropics/claude-quickstarts", family: "agent-onboarding", capabilityDomains: ["agent_development", "documentation"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "commerce-agents", repository: "anthropics/commerce-agents", family: "commerce-agents", capabilityDomains: ["commerce", "agent_development", "automation", "research"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "code-migration-kit-with-claude-code", repository: "anthropics/code-migration-kit-with-claude-code", family: "code-migration", capabilityDomains: ["code_engineering", "devops", "research"], native: true, externalSideEffectsRequireAdapter: true },
  { id: "claude-agent-sdk-python", repository: "anthropics/claude-agent-sdk-python", family: "python-agent-sdk", capabilityDomains: ["agent_development", "code_engineering", "automation"], native: true, externalSideEffectsRequireAdapter: true },
];

const DOMAIN_RULES: ReadonlyArray<{ domain: NativeSkillDomain; terms: readonly string[] }> = [
  { domain: "frontend_design", terms: ["frontend", "design", "ui", "ux", "web", "css", "react", "accessibility", "a11y"] },
  { domain: "agent_development", terms: ["agent", "claude", "orchestration", "loop", "tool-use", "tool", "sdk"] },
  { domain: "skill_engineering", terms: ["skill", "plugin", "prompt", "capability", "eval", "benchmark"] },
  { domain: "knowledge_work", terms: ["knowledge", "research", "brief", "summary", "memo", "analysis"] },
  { domain: "documentation", terms: ["readme", "documentation", "docs", "manual", "guide", "api-doc"] },
  { domain: "presentation", terms: ["pptx", "powerpoint", "slides", "deck", "presentation"] },
  { domain: "visual_media", terms: ["image", "video", "graphics", "infographic", "motion", "avatar", "caption"] },
  { domain: "code_engineering", terms: ["code", "coding", "refactor", "test", "typescript", "javascript", "python", "flutter", "swift"] },
  { domain: "security", terms: ["security", "threat", "vuln", "vulnerability", "audit", "defense", "secure", "incident"] },
  { domain: "financial", terms: ["finance", "financial", "earnings", "equity", "valuation", "forecast", "statement", "market"] },
  { domain: "legal", terms: ["legal", "law", "contract", "compliance", "clause", "litigation", "brief"] },
  { domain: "healthcare", terms: ["healthcare", "clinical", "fhir", "patient", "prior-auth", "medical"] },
  { domain: "life_sciences", terms: ["life-science", "single-cell", "rna", "nextflow", "bioinformatics", "genomics"] },
  { domain: "education", terms: ["teacher", "lesson", "classroom", "curriculum", "k12", "education"] },
  { domain: "commerce", terms: ["commerce", "merchant", "order", "catalog", "checkout", "sales", "customer"] },
  { domain: "research", terms: ["research", "literature", "hypothesis", "evidence", "scientific", "study"] },
  { domain: "devops", terms: ["devops", "deploy", "deployment", "ci", "cd", "pipeline", "rollback", "release"] },
  { domain: "automation", terms: ["automation", "workflow", "cron", "scheduled", "webhook", "orchestration"] },
  { domain: "mcp_integrations", terms: ["mcp", "connector", "github", "slack", "linear", "tool-server", "integration"] },
];

const EXTERNAL_SIDE_EFFECT_TERMS = [
  "browser",
  "crawl",
  "scrape",
  "deploy",
  "publish",
  "send",
  "email",
  "payment",
  "stripe",
  "github",
  "slack",
  "linear",
  "upload",
  "delete",
  "execute",
  "run command",
  "shell",
  "video generation",
  "image generation",
] as const;

function stableHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalize(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("es-MX").trim();
}

function tokenize(value: string): Set<string> {
  return new Set(normalize(value).match(/[\p{L}\p{N}_:-]+/gu) ?? []);
}

function detectDomain(skillId: string, task: string): NativeSkillDomain {
  const haystack = normalize(`${skillId} ${task}`);
  let best: { domain: NativeSkillDomain; score: number } = {
    domain: "general_reasoning",
    score: 0,
  };
  for (const rule of DOMAIN_RULES) {
    const score = rule.terms.reduce(
      (total, term) => total + (haystack.includes(normalize(term)) ? 1 : 0),
      0,
    );
    if (score > best.score) best = { domain: rule.domain, score };
  }
  return best.domain;
}

function inferSource(skillId: string, explicitSource?: string): NativeSkillSource {
  if (explicitSource) {
    const normalized = normalize(explicitSource);
    const exact = NATIVE_SKILL_SOURCES.find(
      (source) => normalize(source.id) === normalized || normalize(source.repository) === normalized,
    );
    if (exact) return exact;
  }
  const normalizedSkill = normalize(skillId);
  const source = NATIVE_SKILL_SOURCES.find((candidate) =>
    normalizedSkill.includes(normalize(candidate.id).replaceAll("-", " ")) ||
    normalizedSkill.includes(normalize(candidate.family).replaceAll("-", " ")),
  );
  return (
    source ?? {
      id: "native-isabella",
      repository: "OsoPanda1/isabella-ai-genesis",
      family: "native-fusion",
      capabilityDomains: ["general_reasoning"],
      native: true,
      externalSideEffectsRequireAdapter: true,
    }
  );
}

function hasExternalSideEffect(task: string, input: Record<string, unknown>): boolean {
  const serialized = normalize(`${task} ${JSON.stringify(input)}`);
  return EXTERNAL_SIDE_EFFECT_TERMS.some((term) => serialized.includes(normalize(term)));
}

function buildPlan(domain: NativeSkillDomain, task: string): readonly string[] {
  const plans: Record<NativeSkillDomain, readonly string[]> = {
    frontend_design: ["Interpretar objetivo y audiencia", "Definir jerarquía visual y contenido", "Aplicar tokens, tipografía, accesibilidad y responsive", "Validar estados, contraste y coherencia de interacción"],
    agent_development: ["Definir objetivo del agente", "Separar modelo, herramientas, memoria y política", "Establecer límites de ejecución y escalamiento", "Diseñar pruebas de comportamiento y regresión"],
    skill_engineering: ["Formalizar trigger e intención", "Definir contrato de entrada/salida", "Construir evaluación reproducible", "Medir calidad, latencia y regresiones"],
    knowledge_work: ["Extraer entidades y objetivos", "Separar hechos, inferencias y desconocidos", "Construir síntesis estructurada", "Conservar provenance y trazabilidad"],
    documentation: ["Identificar audiencia y propósito", "Estructurar navegación y conceptos", "Especificar ejemplos ejecutables", "Verificar consistencia entre código y documentación"],
    presentation: ["Definir narrativa y objetivo", "Diseñar estructura de diapositivas", "Aplicar composición y legibilidad", "Validar desbordes, contraste y coherencia"],
    visual_media: ["Definir formato y mensaje", "Diseñar composición visual", "Preparar prompts/recursos estructurados", "Validar accesibilidad, metadatos y derechos"],
    code_engineering: ["Inspeccionar contratos y dependencias", "Modelar cambio mínimo y reversible", "Implementar con pruebas", "Ejecutar typecheck/lint/test y revisar diff"],
    security: ["Clasificar superficie y amenaza", "Identificar autoridad y fronteras de confianza", "Aplicar controles fail-closed", "Probar abuso, aislamiento y regresión"],
    financial: ["Identificar instrumento y periodo", "Normalizar datos y unidades", "Separar datos observados de supuestos", "Calcular métricas con provenance y escenarios"],
    legal: ["Identificar jurisdicción y objetivo", "Separar texto fuente de interpretación", "Construir estructura documental", "Marcar supuestos y puntos de revisión profesional"],
    healthcare: ["Identificar contexto clínico y estándar", "Normalizar entidades y terminología", "Aplicar controles de privacidad", "Marcar cualquier decisión que requiera profesional"],
    life_sciences: ["Definir pregunta científica", "Establecer datos, controles y supuestos", "Construir análisis reproducible", "Registrar provenance y límites estadísticos"],
    education: ["Definir nivel y objetivo pedagógico", "Adaptar contenido y dificultad", "Construir actividad/evaluación", "Verificar claridad e inclusión"],
    commerce: ["Definir operación comercial", "Validar identidad, inventario y política", "Separar cálculo de autoridad financiera", "Registrar idempotencia y evidencia"],
    research: ["Definir pregunta y criterios", "Separar evidencia primaria/secundaria", "Comparar hipótesis", "Registrar incertidumbre y provenance"],
    devops: ["Inspeccionar artefactos y entorno", "Validar configuración y secretos", "Ejecutar gates reproducibles", "Preparar observabilidad y rollback"],
    automation: ["Definir trigger y condiciones", "Validar inputs y permisos", "Diseñar reintentos e idempotencia", "Auditar cada transición"],
    mcp_integrations: ["Definir herramienta y scopes", "Validar identidad y tenant", "Aplicar allowlist y límites", "Auditar invocación y revocación"],
    general_reasoning: ["Normalizar intención", "Extraer señales relevantes", "Separar hechos de inferencias", "Generar resultado trazable y verificable"],
  };
  return plans[domain].map((step) => `${step}${task ? ` · ${task.slice(0, 96)}` : ""}`);
}

/** Executes a skill specification through Isabella's native ML substrate. */
export function executeNativeSkill(request: NativeSkillRequest): NativeSkillExecution {
  const skillId = request.skillId.trim();
  if (!skillId) throw new Error("native_skill_id_required");
  const task = String(request.task ?? request.input?.task ?? request.input?.prompt ?? skillId).trim();
  const input = request.input ?? {};
  const source = inferSource(skillId, request.source);
  const domain = detectDomain(skillId, task);
  const semanticVector = Array.from(embed(`${skillId}\n${task}`, { dim: 64 }));
  const risk = classifyTextRisk(`${skillId} ${task}`);
  const external = hasExternalSideEffect(task, input);
  const warnings: string[] = [];
  const missingAdapters: string[] = [];

  if (external) {
    warnings.push("La ejecución nativa no simula efectos externos; requiere un adaptador explícito autorizado.");
    missingAdapters.push("external-side-effect-adapter");
  }

  const plan = buildPlan(domain, task);
  const provenancePayload = {
    requestId: request.requestId ?? randomUUID(),
    skillId,
    source: source.repository,
    domain,
    task,
    input,
    riskModel: risk.modelId,
    plan,
  };
  const provenanceHash = stableHash(provenancePayload);

  return {
    requestId: String(provenancePayload.requestId),
    skillId,
    source: source.repository,
    domain,
    status: external ? "PARTIAL" : "SUCCESS",
    native: true,
    externallyExecutable: false,
    summary: external
      ? `${skillId}: capacidad nativa resuelta y estructurada; el efecto externo permanece bloqueado hasta disponer de un adaptador autorizado.`
      : `${skillId}: capacidad resuelta íntegramente dentro del sustrato nativo de Isabella para análisis, planificación y trazabilidad.`,
    plan,
    features: risk.features,
    risk: {
      score: risk.riskScore,
      labels: risk.labels,
    },
    semanticVector,
    evidence: [
      {
        id: `evi_${randomUUID().slice(0, 8)}`,
        type: "native-analysis",
        hash: stableHash({ skillId, domain, risk, task }),
        source: "Isabella Native ML / NCUA",
      },
      {
        id: `evi_${randomUUID().slice(0, 8)}`,
        type: "input-provenance",
        hash: stableHash(input),
        source: source.repository,
      },
    ],
    provenanceHash,
    warnings,
    missingAdapters,
  };
}

/** Semantic similarity over native skill/task representations. */
export function nativeSkillSimilarity(left: string, right: string): number {
  return cosine(embed(left, { dim: 64 }), embed(right, { dim: 64 }));
}

/** Resolve the closest native source family for an arbitrary external skill name. */
export function resolveNativeSkillFamily(skillId: string): NativeSkillSource {
  return inferSource(skillId);
}
