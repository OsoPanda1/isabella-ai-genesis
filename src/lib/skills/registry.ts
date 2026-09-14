import { ORION, SOPHIA, ARGUS, HERMES, ATLAS, ANUBIS, GEMET } from "./core-pack";
import { AURORA, GAIA, NODO_CERO, PHAROS } from "./territorial-pack";
import { CITEMESH, HEPHAESTUS } from "./infrastructure-pack";
import { MNEMOSYNE, CHRONOS, PROMETEO } from "./archive-pack";
import { VIGIA, LYRA, EIRENE } from "./ethics-pack";
import { THEMIS, SENTINEL } from "./sovereignty-pack";
import { HELIOS, KAIROS } from "./economy-pack";
import { UTAMV } from "./education-pack";
import { HEPTA } from "./hepta.skill";
import { evolvedSkillsPack } from "./evolved-skills-pack";

export const isabellaSkills = {
  ORION,
  SOPHIA,
  ARGUS,
  HERMES,
  ATLAS,
  ANUBIS,
  GEMET,
  AURORA,
  CITEMESH,
  MNEMOSYNE,
  HELIOS,
  GAIA,
  NODO_CERO,
  CHRONOS,
  VIGIA,
  LYRA,
  PROMETEO,
  THEMIS,
  PHAROS,
  KAIROS,
  HEPHAESTUS,
  EIRENE,
  SENTINEL,
  UTAMV,
  HEPTA,
  // 733-754: Evolved Skills Pack
  ...evolvedSkillsPack,
  // Direct kebab-case alias registrations for canonical URL and command matching
  "firecrawl-market-research": evolvedSkillsPack.FIRECRAWL_MARKET_RESEARCH,
  "firecrawl-monitor": evolvedSkillsPack.FIRECRAWL_MONITOR,
  "ckm-brand": evolvedSkillsPack.CKM_BRAND,
  "ckm:brand": evolvedSkillsPack.CKM_BRAND,
  "ckm-banner-design": evolvedSkillsPack.CKM_BANNER_DESIGN,
  "ckm:banner-design": evolvedSkillsPack.CKM_BANNER_DESIGN,
  "tavily-search": evolvedSkillsPack.TAVILY_SEARCH,
  "ckm-slides": evolvedSkillsPack.CKM_SLIDES,
  "ckm:slides": evolvedSkillsPack.CKM_SLIDES,
  "flutter-add-widget-test": evolvedSkillsPack.FLUTTER_ADD_WIDGET_TEST,
  "browser-testing-with-devtools": evolvedSkillsPack.BROWSER_TESTING_WITH_DEVTOOLS,
  "firecrawl-seo-audit": evolvedSkillsPack.FIRECRAWL_SEO_AUDIT,
  "baoyu-infographic": evolvedSkillsPack.BAOYU_INFOGRAPHIC,
  "firecrawl-knowledge-base": evolvedSkillsPack.FIRECRAWL_KNOWLEDGE_BASE,
  "ci-cd-and-automation": evolvedSkillsPack.CI_CD_AND_AUTOMATION,
  "firecrawl-workflows": evolvedSkillsPack.FIRECRAWL_WORKFLOWS,
  "baoyu-markdown-to-html": evolvedSkillsPack.BAOYU_MARKDOWN_TO_HTML,
  "firecrawl-dashboard-reporting": evolvedSkillsPack.FIRECRAWL_DASHBOARD_REPORTING,
  "swiftui-expert-skill": evolvedSkillsPack.SWIFTUI_EXPERT_SKILL,
  "source-driven-development": evolvedSkillsPack.SOURCE_DRIVEN_DEVELOPMENT,
  "firecrawl-lead-gen": evolvedSkillsPack.FIRECRAWL_LEAD_GEN,
  "shipping-and-launch": evolvedSkillsPack.SHIPPING_AND_LAUNCH,
  "firecrawl-lead-research": evolvedSkillsPack.FIRECRAWL_LEAD_RESEARCH,
  "flutter-add-integration-test": evolvedSkillsPack.FLUTTER_ADD_INTEGRATION_TEST,
  "firecrawl-competitive-intel": evolvedSkillsPack.FIRECRAWL_COMPETITIVE_INTEL,
} as const;

export type IsabellaSkillId = keyof typeof isabellaSkills;

export function getIsabellaSkill(id: IsabellaSkillId) {
  return isabellaSkills[id];
}

export function listIsabellaSkills() {
  const seen = new Set<string>();
  const unique: Array<{
    id: string;
    name: string;
    version: string;
    federation: import("./contracts").FederationId;
    risk: import("./contracts").SkillRisk;
    description: string;
  }> = [];
  for (const skill of Object.values(isabellaSkills)) {
    if (!seen.has(skill.id)) {
      seen.add(skill.id);
      unique.push({
        id: skill.id,
        name: skill.name,
        version: skill.version,
        federation: skill.federation,
        risk: skill.risk,
        description: skill.description,
      });
    }
  }
  return unique;
}

export type RuntimeSkill = {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly federation: import("./contracts").FederationId;
  readonly risk: import("./contracts").SkillRisk;
  readonly description: string;
  canRun(input: Record<string, unknown>, context: import("./contracts").SkillContext): boolean;
  run(
    input: Record<string, unknown>,
    context: import("./contracts").SkillContext,
  ): Promise<import("./contracts").SkillResult<unknown>>;
};

export const getRuntimeSkill = (id: IsabellaSkillId): RuntimeSkill =>
  isabellaSkills[id] as unknown as RuntimeSkill;
