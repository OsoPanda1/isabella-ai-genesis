import { evaluateTripleLock } from "@/lib/isabella/triple-lock"
import { ledger } from "@/lib/isabella/audit"

export async function POST(req: Request) {
  const { text = "" }: { text?: string } = await req.json()
  const report = evaluateTripleLock(text)
  ledger.append({
    eventType: "SAFETY_EVALUATION",
    actorId: "TRIPLE_LOCK",
    verdict: report.verdict,
    summary: `Evaluación manual: ${report.flags.join(", ")}`,
    epistemicState: "E1",
  })
  return Response.json(report)
}
