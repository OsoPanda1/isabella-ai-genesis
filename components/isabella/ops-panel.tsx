"use client"

import useSWR from "swr"
import { useState } from "react"
import type { AuditEvent, Federation, KernelState, PolicyVerdict } from "@/lib/isabella/types"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type KernelResponse = KernelState & { ledger: { chainValid: boolean; lastHash: string } }
type AuditResponse = { chainValid: boolean; lastHash: string; events: AuditEvent[] }

type Tab = "kernel" | "ledger" | "safeguards"

const VERDICT_STYLE: Record<PolicyVerdict, string> = {
  ALLOW: "text-jade border-jade/40 bg-jade/10",
  REVIEW: "text-gold border-gold/40 bg-gold/10",
  DENY: "text-destructive border-destructive/40 bg-destructive/10",
}

const HEALTH_STYLE: Record<Federation["health"], string> = {
  HEALTHY: "bg-jade",
  DEGRADED: "bg-gold",
  DOWN: "bg-destructive",
}

export function OpsPanel({ refreshSignal }: { refreshSignal: number }) {
  const [tab, setTab] = useState<Tab>("kernel")
  const { data: kernel } = useSWR<KernelResponse>("/api/isabella/kernel", fetcher, {
    refreshInterval: 15000,
  })
  const { data: audit } = useSWR<AuditResponse>(
    ["/api/isabella/audit", refreshSignal],
    () => fetcher("/api/isabella/audit?limit=40"),
    { refreshInterval: 12000 },
  )

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40">
      <div className="flex items-center gap-1 border-b border-border/60 p-1.5">
        {(
          [
            ["kernel", "Kernel"],
            ["ledger", "Ledger"],
            ["safeguards", "Salvaguardas"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              tab === id ? "bg-gold/15 text-gold" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === "kernel" && kernel && (
          <div className="space-y-4 text-sm">
            <div className="rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-jade" />
                </span>
                <span className="text-xs font-medium text-jade">KERNEL EN LÍNEA · {kernel.epistemicState}</span>
              </div>
              <dl className="mt-2 grid grid-cols-1 gap-1 text-xs">
                <Row k="Nodo" v={kernel.identity.node} />
                <Row k="Versión" v={kernel.identity.version} />
                <Row k="Origen" v={kernel.identity.origin} />
                <Row k="Cadena de evidencia" v={kernel.ledger.chainValid ? "Íntegra ✓" : "Comprometida ✗"} />
              </dl>
            </div>

            <div>
              <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Heptafederación
              </p>
              <ul className="space-y-1.5">
                {kernel.federations.map((f) => (
                  <li
                    key={f.code}
                    className="flex items-center gap-2 rounded-md border border-border/50 bg-background/30 px-2.5 py-1.5"
                  >
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", HEALTH_STYLE[f.health])} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{f.name}</p>
                      <p className="truncate text-[0.68rem] text-muted-foreground">{f.responsibilities}</p>
                    </div>
                    <span className="text-[0.68rem] tabular-nums text-muted-foreground">
                      {Math.round(f.load * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "ledger" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
              <span>Ledger append-only (MSR)</span>
              <span className={audit?.chainValid ? "text-jade" : "text-destructive"}>
                {audit?.chainValid ? "cadena íntegra" : "cadena rota"}
              </span>
            </div>
            {!audit?.events?.length && (
              <p className="rounded-md border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                Sin eventos aún. Inicia una conversación para poblar el ledger.
              </p>
            )}
            <ul className="space-y-1.5">
              {audit?.events?.map((e) => (
                <li key={e.eventId} className="rounded-md border border-border/50 bg-background/30 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.66rem] text-muted-foreground">{e.eventType}</span>
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[0.6rem] font-semibold",
                        VERDICT_STYLE[e.verdict],
                      )}
                    >
                      {e.verdict}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-snug">{e.summary}</p>
                  <p className="mt-1 font-mono text-[0.62rem] text-muted-foreground/70">
                    #{e.payloadHash.slice(0, 10)} ← {e.previousHash.slice(0, 6)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "safeguards" && kernel && (
          <div className="space-y-2">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Candado triple · inviolable
            </p>
            <ul className="space-y-2">
              {kernel.safeguards.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-2 rounded-md border border-border/50 bg-background/30 p-2.5 text-xs leading-snug"
                >
                  <span className="font-display text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="truncate text-right font-medium">{v}</dd>
    </div>
  )
}
