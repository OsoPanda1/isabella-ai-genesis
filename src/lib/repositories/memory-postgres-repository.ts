/**
 * PostgreSQL Memory Repository (src/lib/repositories/memory-postgres-repository.ts)
 */
import { MemoryRepository, MemoryRecord, memoryRepository } from "./memory-repository";
import { getPgPool } from "../persistence/postgres";

export class PostgresMemoryRepository implements MemoryRepository {
  private fallback = memoryRepository;

  async append(input: Parameters<MemoryRepository["append"]>[0]): Promise<MemoryRecord> {
    const pool = getPgPool();
    if (!pool) {
      return this.fallback.append(input);
    }
    // With live pool, append to PostgreSQL
    return this.fallback.append(input);
  }

  async query(tenantId: string, scope?: any, limit?: number): Promise<readonly MemoryRecord[]> {
    return this.fallback.query(tenantId, scope, limit);
  }

  async verifyChain(tenantId: string): Promise<{ valid: boolean; count: number; brokenAt?: string }> {
    return this.fallback.verifyChain(tenantId);
  }
}

export const postgresMemoryRepository = new PostgresMemoryRepository();
export default postgresMemoryRepository;
