/**
 * Memory Repository (src/lib/repositories/memory-repository.ts)
 * -------------------------------------------------------------
 * Sovereign Hierarchical Memory Store with SHA3-512 Hash Chaining
 * and concurrency mutex protection.
 */
import { createHash } from "node:crypto";
import { canonicalize } from "../igds/canonical";

export type MemoryScope = "immediate" | "session" | "project" | "territorial" | "historical";

export interface MemoryRecord {
  id: string;
  tenant_id: string;
  content: Record<string, unknown> | string;
  scope: MemoryScope;
  sensitivity: "low" | "medium" | "high" | "restricted";
  purpose: string;
  consent_required: boolean;
  consent: boolean;
  provenance: string;
  content_hash: string;
  previous_chain_hash: string;
  chain_hash: string;
  expires_at?: string;
  source: string;
  created_at: string;
}

export interface MemoryRepository {
  append(input: {
    tenant_id: string;
    content: Record<string, unknown> | string;
    scope?: MemoryScope;
    sensitivity?: "low" | "medium" | "high" | "restricted";
    purpose?: string;
    provenance?: string;
    source?: string;
  }): Promise<MemoryRecord>;
  query(tenantId: string, scope?: MemoryScope, limit?: number): Promise<readonly MemoryRecord[]>;
  verifyChain(tenantId: string): Promise<{ valid: boolean; count: number; brokenAt?: string }>;
}

class InMemoryMemoryRepository implements MemoryRepository {
  private memories: MemoryRecord[] = [];
  private lastHashByTenant = new Map<string, string>();
  private mutexLocks = new Map<string, Promise<void>>();

  private async acquireMutex(tenantId: string): Promise<() => void> {
    while (this.mutexLocks.has(tenantId)) {
      await this.mutexLocks.get(tenantId);
    }
    let release: () => void;
    const lock = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.mutexLocks.set(tenantId, lock);
    return () => {
      this.mutexLocks.delete(tenantId);
      release();
    };
  }

  async append(input: {
    tenant_id: string;
    content: Record<string, unknown> | string;
    scope?: MemoryScope;
    sensitivity?: "low" | "medium" | "high" | "restricted";
    purpose?: string;
    provenance?: string;
    source?: string;
  }): Promise<MemoryRecord> {
    const release = await this.acquireMutex(input.tenant_id);
    try {
      const id = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const previous_chain_hash = this.lastHashByTenant.get(input.tenant_id) || "GENESIS";
      const contentStr = typeof input.content === "string" ? input.content : canonicalize(input.content);
      const content_hash = createHash("sha3-512").update(contentStr, "utf8").digest("hex");

      const chain_hash = createHash("sha3-512")
        .update(`${previous_chain_hash}:${content_hash}:${input.tenant_id}`, "utf8")
        .digest("hex");

      const record: MemoryRecord = {
        id,
        tenant_id: input.tenant_id,
        content: input.content,
        scope: input.scope || "session",
        sensitivity: input.sensitivity || "medium",
        purpose: input.purpose || "cognitive_context",
        consent_required: false,
        consent: true,
        provenance: input.provenance || "user_turn",
        content_hash,
        previous_chain_hash,
        chain_hash,
        source: input.source || "isabella_chat",
        created_at: new Date().toISOString(),
      };

      this.memories.push(record);
      this.lastHashByTenant.set(input.tenant_id, chain_hash);
      return record;
    } finally {
      release();
    }
  }

  async query(tenantId: string, scope?: MemoryScope, limit: number = 50): Promise<readonly MemoryRecord[]> {
    return this.memories
      .filter((m) => m.tenant_id === tenantId && (!scope || m.scope === scope))
      .slice(-limit);
  }

  async verifyChain(tenantId: string): Promise<{ valid: boolean; count: number; brokenAt?: string }> {
    const tenantMems = this.memories.filter((m) => m.tenant_id === tenantId);
    let previous = "GENESIS";

    for (const mem of tenantMems) {
      if (mem.previous_chain_hash !== previous) {
        return { valid: false, count: tenantMems.length, brokenAt: mem.id };
      }
      const expected = createHash("sha3-512")
        .update(`${previous}:${mem.content_hash}:${mem.tenant_id}`, "utf8")
        .digest("hex");

      if (mem.chain_hash !== expected) {
        return { valid: false, count: tenantMems.length, brokenAt: mem.id };
      }
      previous = mem.chain_hash;
    }

    return { valid: true, count: tenantMems.length };
  }
}

export const memoryRepository = new InMemoryMemoryRepository();
export default memoryRepository;
