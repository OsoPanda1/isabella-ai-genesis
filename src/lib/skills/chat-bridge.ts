/**
 * Chat-to-Skill Executor Bridge (src/lib/skills/chat-bridge.ts)
 * -----------------------------------------------------------------
 * Detecta invocaciones de habilidades soberanas (@skill:<nombre> o @<nombre>)
 * en el flujo de conversación de Isabella y las ejecuta a través del pipeline
 * endurecido runtime `runIsabellaSkill()`, asegurando:
 *  1. Autenticación explícita y contexto de identidad (actorId, tenantId, role).
 *  2. Evaluación de políticas de gobernanza CROWN (Zero Trust Gate).
 *  3. Ejecución del runtime soberano aislado.
 *  4. Registro y sellado de evidencia criptográfica inmutable en BookPI.
 *  5. Capacidad de streaming SSE compatible con OpenAI/Gemini para el chat stream.
 */

import { isabellaSkills, type IsabellaSkillId } from "./registry";
import { runIsabellaSkill } from "./run-skill";

export interface SkillInvocation {
  skillId: IsabellaSkillId;
  canonicalName: string;
  rawInput: string;
  parsedInput: Record<string, unknown>;
}

export interface BridgeContext {
  correlationId: string;
  traceId: string;
  userId: string;
  tenantId: string;
  role: string;
  scope?: string;
  ip?: string;
  userAgent?: string;
  authenticated?: boolean;
}

export interface ChatSkillExecutionResult {
  success: boolean;
  content: string;
  skillId: string;
  decisionId?: string | null;
  traceId?: string;
  code?: string;
  error?: string;
  bookpiLogged: boolean;
  rawResult?: unknown;
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
    // Patrón 2: @nombre (e.g. @hepta, @gaia, @sophia)
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

  // Extraer input: intentar JSON primero, o fallback a prompt de consulta
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

/**
 * Ejecuta una invocación de skill dentro del contexto del chat gateway,
 * canalizando toda la operación a través del runtime canónico `runIsabellaSkill()`.
 */
export async function executeChatSkillBridge(
  invocation: SkillInvocation,
  context: BridgeContext,
): Promise<ChatSkillExecutionResult> {
  const actorId = context.userId || "anonymous";
  const tenantId = context.tenantId || "nodo-cero";
  const role = context.role || "User";
  const authenticated = context.authenticated ?? (role !== "Guest");
  const requestId = context.correlationId || `req_${Date.now()}`;
  const ipAddress = context.ip || "127.0.0.1";

  try {
    const response = await runIsabellaSkill(invocation.skillId, invocation.parsedInput, {
      requestId,
      actorId,
      tenantId,
      role,
      authenticated,
      ipAddress,
      userAgent: context.userAgent,
      intent: invocation.rawInput || `Chat invocation of skill ${invocation.canonicalName}`,
    });

    const dataFormatted =
      typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2);

    const formattedContent = [
      `⚡ **Habilidad Soberana Ejecutada: \`${invocation.canonicalName}\`**`,
      `> **Gobernanza CROWN:** \`${response.meta.decision_id || "ALLOW"}\` | **Trace:** \`${response.meta.trace_id}\` | **Evidencia BookPI:** \`Asentada\``,
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
      bookpiLogged: true,
      rawResult: response.data,
    };
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Error desconocido en ejecución de skill.";
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : errorMsg.includes("denegado") || errorMsg.includes("CROWN")
          ? "CROWN_POLICY_DENY"
          : "SKILL_EXECUTION_ERROR";

    const formattedContent = [
      `⚠️ **Ejecución Bloqueada / Error en Habilidad Soberana: \`${invocation.canonicalName}\`**`,
      `> **Código:** \`${code}\``,
      `> **Motivo:** ${errorMsg}`,
      `> **Trazabilidad:** \`${context.traceId || requestId}\``,
    ].join("\n");

    return {
      success: false,
      content: formattedContent,
      skillId: invocation.canonicalName,
      code,
      error: errorMsg,
      bookpiLogged: false,
    };
  }
}

/**
 * Transforma un resultado de skill ejecutado en una respuesta de streaming SSE compatible
 * con el formato estándar de OpenAI / Gemini usado por el frontend de chat.
 */
export function streamChatSkillAsSse(
  result: ChatSkillExecutionResult,
  headers: Headers,
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      try {
        // Marco 1: metadatos de auditoría y proveedor
        const initMetadata = {
          provider: "isabella-skill-runtime",
          skillId: result.skillId,
          decisionId: result.decisionId ?? null,
          traceId: result.traceId ?? null,
          bookpiLogged: result.bookpiLogged,
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initMetadata)}\n\n`));

        // Marco 2: contenido incremental (delta)
        const chunk = {
          choices: [
            {
              delta: {
                content: result.content,
              },
            },
          ],
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));

        // Marco final: [DONE]
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, { status: 200, headers });
}

/**
 * Utilidad unificada de enlace: analiza el mensaje del chat stream, detecta invocaciones
 * a `@skill`, ejecuta `runIsabellaSkill()` con CROWN y BookPI, y produce directamente
 * la respuesta SSE del stream si corresponde. Si no es un skill, retorna null.
 */
export async function bindChatSkillStream(
  message: string,
  context: BridgeContext,
  sseHeadersFactory: (provider: string, model: string) => Headers,
): Promise<{ handled: boolean; response?: Response; error?: { code: string; message: string; status: number } }> {
  const invocation = detectSkillInvocation(message);
  if (!invocation) {
    return { handled: false };
  }

  const result = await executeChatSkillBridge(invocation, context);

  if (!result.success) {
    if (result.code === "CROWN_POLICY_DENY" || result.code === "IDENTITY_REQUIRED") {
      return {
        handled: true,
        error: {
          code: result.code,
          message: result.error || "Acceso denegado por política de gobernanza CROWN.",
          status: 403,
        },
      };
    }
  }

  const headers = sseHeadersFactory("isabella-skill-runtime", invocation.canonicalName);
  const response = streamChatSkillAsSse(result, headers);
  return { handled: true, response };
}
