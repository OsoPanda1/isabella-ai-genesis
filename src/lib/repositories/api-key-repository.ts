/**
 * API Key Repository (src/lib/repositories/api-key-repository.ts)
 */
export interface ApiKeyRecord {
  id: string;
  tenant_id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string;
  prefix: string;
  name?: string;
  status: "ACTIVE" | "SUSPENDED" | "REVOKED" | "EXPIRED";
  scopes: string[];
  expires_at?: string;
  revoked_at?: string;
  rotated_at?: string;
  last_used_at?: string;
  created_at: string;
}

class InMemoryApiKeyRepository {
  private keys = new Map<string, ApiKeyRecord>();

  async create(record: ApiKeyRecord): Promise<ApiKeyRecord> {
    this.keys.set(record.id, { ...record });
    return record;
  }

  async findById(id: string): Promise<ApiKeyRecord | null> {
    return this.keys.get(id) || null;
  }

  async findByHash(hash: string): Promise<ApiKeyRecord | null> {
    for (const key of this.keys.values()) {
      if (key.key_hash === hash) return key;
    }
    return null;
  }

  async listByTenant(tenantId: string): Promise<readonly ApiKeyRecord[]> {
    return Array.from(this.keys.values()).filter((k) => k.tenant_id === tenantId);
  }

  async update(id: string, updates: Partial<ApiKeyRecord>): Promise<ApiKeyRecord | null> {
    const existing = this.keys.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.keys.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.keys.delete(id);
  }
}

export const apiKeyRepository = new InMemoryApiKeyRepository();
export default apiKeyRepository;
