import { getKernelState } from "@/lib/isabella/kernel"
import { ledger } from "@/lib/isabella/audit"

export async function GET() {
  return Response.json({
    ...getKernelState(),
    ledger: { chainValid: ledger.verifyChain(), lastHash: ledger.lastHash },
  })
}
