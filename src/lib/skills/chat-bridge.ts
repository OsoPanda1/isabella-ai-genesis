/**
 * Chat-to-Skill Executor Bridge (src/lib/skills/chat-bridge.ts)
 * -----------------------------------------------------------------
 * Detecta invocaciones automáticas de habilidades soberanas (@skill:<nombre> o @<nombre>)
 * en el flujo de conversación de Isabella y las ejecuta a través del pipeline
 * endurecido (runIsabellaSkill), asegurando gobernanza CROWN, validación de esquemas
 * y sellado inmutable en BookPI.
 */

import { isabellaSkills, type IsabellaSkillId } from "./registry";
import { runIsabellaSkill } from "./run-skill";

export interface SkillInvocation {
  skillId: IsabellaSkillId;
  canonicalName: string;
  rawInput: string;
  parsedInput: Record<string, unknown>;
}

// Mapa de búsqueda normalizado (minúsculas y sin prefijos) para resolución rápida
const skillLookupMap = new Map<string, IsabellaSkillId>();

for (const key of Object.keys(isabellaSkills) as IsabellaSkillId[]) {
  const normKey = key.toLowerCase();
  skillLookupMap.set(normKey, key);
  skillLookupMap.set(normKey.replace(/-/g, "_"), key);
  skillLookupMap.set(normKey.replace(/_/g, "-"), key);
  const skillObj = isabellaSkills[key];
  if (skillObj && typeof skillObj === "object" && "name" in skillObj) {
    const nameLower = (skillObj.name as string).toLowerCase();
    skillLookupMap.set(nameLower, key);
  }
}

/**
 * Detecta si un mensaje del usuario contiene una invocación a un skill.
 * Formatos soportados:
 *  - `@skill:<nombre> [json|texto]`
 *  - `@skill <nombre> [json|texto]`
 *  - `@<nombre> [json|texto]`
 */
export function detectSkillInvocation(text: string): SkillInvocation | null {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();

  // Patrón 1: @skill:nombre o @skill nombre
  const skillPrefixMatch = trimmed.match(/^@skill[:\s]+([a-zA-Z0-9_\-:]+)([\s\S]*)$/i);
  let targetSkillName = "";
  let remainder = "";

  if (skillPrefixMatch) {
    targetSkillName = skillPrefixMatch[1].trim();
    remainder = skillPrefixMatch[2]?.trim() ?? "";
  } else {
    // Patrón 2: @nombre (e.g. @hepta, @orion, @gaia)
    const directMatch = trimmed.match(/^@([a-zA-Z0-9_\-:]+)([\s\S]*)$/);
    if (directMatch) {
      const candidate = directMatch[1].trim();
      const norm = candidate.toLowerCase();
      if (skillLookupMap.has(norm)) {
        targetSkillName = candidate;
        remainder = directMatch[2]?.trim() ?? "";
      }
    }
  }

  if (!targetSkillName) return null;

  const matchedSkillId =
    skillLookupMap.get(targetSkillName.toLowerCase()) ||
    skillLookupMap.get(targetSkillName.toLowerCase().replace(/-/g, "_")) ||
    skillLookupMap.get(targetSkillName.toLowerCase().replace(/_/g, "-"));

  if (!matchedSkillId) return null;

  // Extraer input: intentar JSON primero, o fallback a objeto de consulta
  let parsedInput: Record<string, unknown> = {};
  if (remainder) {
    const jsonMatch = remainder.match(/^\{[\s\S]*\}$/);
    if (jsonMatch) {
      try {
        parsedInput = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      } catch {
        parsedInput = { query: remainder, prompt: remainder, intent: remainder };
      }
    } else {
      parsedInput = { query: remainder, prompt: remainder, intent: remainder };
    }
  } else {
    parsedInput = { query: "Ejecución invocada desde chat", intent: "chat_skill_invocation" };
  }

  return {
    skillId: matchedSkillId,
    canonicalName: String(matchedSkillId),
    rawInput: remainder,
    parsedInput,
  };
}

export interface ChatSkillExecutionResult {
  success: boolean;
  content: string;
  skillId: string;
  decisionId?: string | null;
  traceId?: string;
  error?: string;
  rawResult?: unknown;
}

/**
 * Ejecuta una invocación de skill dentro del contexto del chat gateway.
 */
export async function executeChatSkillBridge(
  invocation: SkillInvocation,
  context: {
    correlationId: string;
    traceId: string;
    userId: string;
    tenantId: string;
    role: string;
    ip: string;
  },
): Promise<ChatSkillExecutionResult> {
  try {
    const response = await runIsabellaSkill(invocation.skillId, invocation.parsedInput, {
      requestId: context.correlationId,
      actorId: context.userId,
      tenantId: context.tenantId,
      role: context.role,
      authenticated: context.role !== "Guest",
      ipAddress: context.ip,
      intent: invocation.rawInput || `Chat invocation of skill ${invocation.canonicalName}`,
    });

    const dataFormatted =
      typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2);

    const formattedContent = [
      `⚡ **Habilidad Soberana Ejecutada: \`${invocation.canonicalName}\`**`,
      `> **Decisión CROWN:** \`${response.meta.decision_id || "ALLOW"}\` | **Trace:** \`${response.meta.trace_id}\``,
      "",
      "```json",
      dataFormatted,
      "```",
    ].join("\n");

    return {
      success: true,
      content: formattedContent,
      skillId: invocation.canonicalName,
      decisionId: response.meta.decision_id,
      traceId: response.meta.trace_id,
      rawResult: response.data,
    };
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Error desconocido en ejecución de skill.";
    const formattedContent = [
      `⚠️ **Error al ejecutar habilidad soberana: \`${invocation.canonicalName}\`**`,
      `> Motivo: ${errorMsg}`,
      `> Trazabilidad: \`${context.traceId}\``,
    ].join("\n");

    return {
      success: false,
      content: formattedContent,
      skillId: invocation.canonicalName,
      error: errorMsg,
    };
  }
}
