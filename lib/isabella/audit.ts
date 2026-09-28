import type { AuditEvent } from "./types"
import { shortHash } from "./triple-lock"

// Append-only, hash-chained governance ledger (in-memory reference implementation
// of the MSR / evidence layer described in the master documents).
// In production this is anchored by ANUBIS to a durable store.

const GENESIS_HASH = "0".repeat(16)

class AuditLedger {
  private events: AuditEvent[] = []

  get lastHash(): string {
    return this.events.length ? this.events[this.events.length - 1].payloadHash : GENESIS_HASH
  }

  append(event: Omit<AuditEvent, "eventId" | "payloadHash" | "previousHash" | "committedAt">): AuditEvent {
    const previousHash = this.lastHash
    const committedAt = new Date().toISOString()
    const payloadHash = shortHash(
      previousHash + event.eventType + event.verdict + event.summary + committedAt,
    ).padEnd(16, "0")

    const full: AuditEvent = {
      ...event,
      eventId: `evt_${shortHash(committedAt + event.summary)}`,
      previousHash,
      payloadHash,
      committedAt,
    }
    this.events.push(full)
    if (this.events.length > 200) this.events = this.events.slice(-200)
    return full
  }

  list(limit = 50): AuditEvent[] {
    return this.events.slice(-limit).reverse()
  }

  verifyChain(): boolean {
    let prev = GENESIS_HASH
    for (const e of this.events) {
      if (e.previousHash !== prev) return false
      prev = e.payloadHash
    }
    return true
  }
}

// Reuse across hot reloads / route invocations within the same server process.
const globalForLedger = globalThis as unknown as { __isabellaLedger?: AuditLedger }
export const ledger = globalForLedger.__isabellaLedger ?? new AuditLedger()
if (!globalForLedger.__isabellaLedger) globalForLedger.__isabellaLedger = ledger
