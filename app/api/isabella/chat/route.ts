import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import { buildSystemPrompt } from "@/lib/isabella/persona"
import { evaluateTripleLock, CONTAINMENT_MESSAGE } from "@/lib/isabella/triple-lock"
import { ledger } from "@/lib/isabella/audit"
import type { CognitiveMode, SkillId } from "@/lib/isabella/types"

export const maxDuration = 60

const MODEL = "anthropic/claude-sonnet-5"

function lastUserText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === "user")
  if (!last) return ""
  return last.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join(" ")
}

function staticMessageStream(text: string) {
  return createUIMessageStream({
    execute: ({ writer }) => {
      const id = "msg-containment"
      writer.write({ type: "text-start", id })
      writer.write({ type: "text-delta", id, delta: text })
      writer.write({ type: "text-end", id })
    },
  })
}

export async function POST(req: Request) {
  const {
    messages,
    mode = "governance",
    skill = "LUMEN",
  }: { messages: UIMessage[]; mode?: CognitiveMode; skill?: SkillId } = await req.json()

  const userText = lastUserText(messages)

  // Constitutional gate: Triple-Lock runs before any generation.
  const safety = evaluateTripleLock(userText)
  ledger.append({
    eventType: "SAFETY_EVALUATION",
    actorId: "TRIPLE_LOCK",
    verdict: safety.verdict,
    summary: safety.isBlocked
      ? `Contención: ${safety.flags.join(", ")}`
      : "Evaluación limpia",
    epistemicState: "E1",
  })

  if (safety.isBlocked) {
    ledger.append({
      eventType: "BLOCK",
      actorId: "LUMEN",
      verdict: "DENY",
      skillId: "LUMEN",
      summary: `Solicitud contenida por ${safety.lockLevels.join(" + ")}`,
      epistemicState: "E1",
    })
    return createUIMessageStreamResponse({
      stream: staticMessageStream(CONTAINMENT_MESSAGE),
    })
  }

  ledger.append({
    eventType: "SKILL_INVOCATION",
    actorId: "LUMEN",
    verdict: "ALLOW",
    skillId: skill,
    summary: `Invocación de habilidad ${skill} en modo ${mode}`,
    epistemicState: "E1",
  })

  const result = streamText({
    model: MODEL,
    system: buildSystemPrompt(mode, skill),
    messages: await convertToModelMessages(messages),
    temperature: 0.6,
    onFinish: ({ text }) => {
      ledger.append({
        eventType: "CHAT_RESPONSE",
        actorId: "ISABELLA_VILLASENOR_AI",
        verdict: "ALLOW",
        skillId: skill,
        summary: `Respuesta emitida (${text.length} caracteres)`,
        epistemicState: "E2",
      })
    },
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
