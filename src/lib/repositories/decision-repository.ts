/**
 * Decision Repository (src/lib/repositories/decision-repository.ts)
 * -------------------------------------------------------------
 * Append-only immutable store for PDP authorization decisions.
 */
import { createHash } from "node:crypto";
import { canonicalize } from "../igds/canonical";

export interface DecisionRecord {
  decisionId: string;
  tenantId: string;
  subjectId: string;
  action: string;
  resource: string;
  allow: boolean;
  policyVersion: string;
  previous_hash: string;
  record_hash: string;
  signature?: string;
  timestamp: string;
}

class InMemoryDecisionRepository {
  private decisions: DecisionRecord[] = [];
  private lastHashByTenant = new Map<string, string>();

  async append(decision: Omit<DecisionRecord, "previous_hash" | "record_hash">): Promise<DecisionRecord> {
    const previous_hash = this.lastHashByTenant.get(decision.tenantId) || "GENESIS";
    const payload = {
      ...decision,
      previous_hash,
    };

    const record_hash = createHash("sha3-512")
      .update(canonicalize(payload), "utf8")
      .digest("hex");

    const record: DecisionRecord = {
      ...payload,
      record_hash,
    };

    this.decisions.push(record);
    this.lastHashByTenant.set(decision.tenantId, record_hash);
    return record;
  }

  async getLatestHash(tenantId: string): Promise<string> {
    return this.lastHashByTenant.get(tenantId) || "GENESIS";
  }

  async verifyChain(tenantId: string): Promise<{ valid: boolean; count: number; brokenAt?: string }> {
    const records = this.decisions.filter((d) => d.tenantId === tenantId);
    let previous = "GENESIS";

    for (const d of records) {
      if (d.previous_hash !== previous) {
        return { valid: false, count: records.length, brokenAt: d.decisionId };
      }
      previous = d.record_hash;
    }

    return { valid: true, count: records.length };
  }
}

export const decisionRepository = new InMemoryDecisionRepository();
export default decisionRepository;
