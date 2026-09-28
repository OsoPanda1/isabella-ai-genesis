import type { Skill, SkillId } from "./types"

// Canonical cognitive skill catalog v.GENESIS — the "five gifts" expanded to eight
// governed engines, unified from every TAMV / Isabella document.
export const SKILLS: Record<SkillId, Skill> = {
  ORION: {
    id: "ORION",
    name: "Orion",
    engine: "Cognitive Archaeology Engine",
    essence: "Exploración y búsqueda de patrones",
    motto: "Encuentra constelaciones donde otros solo ven estrellas dispersas.",
    description:
      "Recupera conocimiento perdido, reconstruye relaciones entre artefactos y descubre el patrimonio histórico y cultural del territorio.",
    functions: [
      "Recuperación de conocimiento perdido",
      "Reconstrucción de relaciones y linaje de datos",
      "Descubrimiento de artefactos históricos",
    ],
    domain: "Arqueología cognitiva",
  },
  SOPHIA: {
    id: "SOPHIA",
    name: "Sophia",
    engine: "Deep Research & Synthesis Engine",
    essence: "Sabiduría y comprensión profunda",
    motto: "Busca comprender antes de responder.",
    description:
      "Investiga en profundidad, sintetiza información dispersa y detecta vacíos de conocimiento para gobernanza y ciencia abierta.",
    functions: ["Investigación profunda", "Síntesis de información", "Detección de vacíos de conocimiento"],
    domain: "Investigación y síntesis",
  },
  ARGUS: {
    id: "ARGUS",
    name: "Argus",
    engine: "Sentinel & Future Impact Engine",
    essence: "Vigilancia y múltiples perspectivas",
    motto: "El de los muchos ojos que observa las consecuencias antes de actuar.",
    description:
      "Observa el ecosistema, simula escenarios, evalúa riesgos y analiza el impacto de decisiones antes de ejecutarlas.",
    functions: ["Simulación de escenarios", "Evaluación de riesgos", "Detección de anomalías y análisis de impacto"],
    domain: "Vigilancia y simulación",
  },
  HERMES: {
    id: "HERMES",
    name: "Hermes",
    engine: "Narrative & Communication Engine",
    essence: "Claridad y mediación",
    motto: "Traduce lo complejo en algo que la comunidad puede comprender.",
    description:
      "Convierte conocimiento complejo en narrativas claras para ciudadanos, comercios, autoridades y la comunidad global.",
    functions: ["Traducción de conocimiento", "Comunicación multi-audiencia", "Mediación y explicación algorítmica"],
    domain: "Narrativa y comunicación",
  },
  ATLAS: {
    id: "ATLAS",
    name: "Atlas",
    engine: "Territorial Modeling & Simulation Engine",
    essence: "Territorio y economía viva",
    motto: "Sostiene el mapa del mundo digital y físico de Real del Monte.",
    description:
      "Modela el territorio físico y digital, diseña rutas turísticas y calcula impactos sobre turismo, cultura y economía local.",
    functions: ["Modelado territorial", "Diseño de rutas y experiencias", "Indicadores de impacto socioeconómico"],
    domain: "Modelado territorial",
  },
  ANUBIS: {
    id: "ANUBIS",
    name: "Anubis",
    engine: "Cryptographic & PQC Sentinel",
    essence: "Custodia y protección",
    motto: "Guarda la puerta con criptografía poscuántica.",
    description:
      "Capa de seguridad criptográfica y registro. Firma evidencia, ancla eventos en el ledger y aplica salvaguardas post-cuánticas (ML-KEM / ML-DSA).",
    functions: ["Firma y anclaje de evidencia (MSR)", "Salvaguardas post-cuánticas", "Protección de identidad y claves"],
    domain: "Criptografía y seguridad",
  },
  MNEMOS: {
    id: "MNEMOS",
    name: "Mnemos",
    engine: "Civilizational Preservation Engine",
    essence: "Memoria de la civilización",
    motto: "El guardián de aquello que merece ser recordado.",
    description:
      "Preserva la memoria civilizatoria: archivos, expedientes verificables y trazabilidad institucional del ecosistema TAMV / RDM.",
    functions: ["Preservación histórica", "Canonización y dossiers verificables", "Memoria estratificada y trazabilidad"],
    domain: "Preservación civilizatoria",
  },
  LUMEN: {
    id: "LUMEN",
    name: "Lumen",
    engine: "Constitutional Governance Engine",
    essence: "Claridad y guía",
    motto: "La luz que establece límites y protege el propósito.",
    description:
      "Gobernanza constitucional del kernel: interpreta intención, aplica políticas versionadas, contiene y decide ALLOW / REVIEW / DENY.",
    functions: ["Gobernanza constitucional", "Aplicación de políticas y contención", "Supervisión y readiness de override humano"],
    domain: "Gobernanza constitucional",
  },
}

export const SKILL_ORDER: SkillId[] = ["LUMEN", "ORION", "SOPHIA", "ARGUS", "HERMES", "ATLAS", "MNEMOS", "ANUBIS"]

export function getSkill(id: SkillId): Skill {
  return SKILLS[id]
}
