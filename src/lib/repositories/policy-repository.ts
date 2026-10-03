/**
 * Policy Repository (src/lib/repositories/policy-repository.ts)
 */
export interface PolicyRecord {
  id: string;
  policyKey: string;
  version: string;
  description: string;
  rules: Record<string, unknown>[];
  active: boolean;
}

class InMemoryPolicyRepository {
  private policies = new Map<string, PolicyRecord>();

  constructor() {
    this.policies.set("policy:core:v1", {
      id: "pol_core_1",
      policyKey: "policy:core:v1",
      version: "1.0.0",
      description: "Default sovereign governance policy",
      rules: [{ effect: "allow", action: "*", resource: "*" }],
      active: true,
    });
  }

  async getPolicy(key: string): Promise<PolicyRecord | null> {
    return this.policies.get(key) || null;
  }

  async setPolicy(policy: PolicyRecord): Promise<void> {
    this.policies.set(policy.policyKey, policy);
  }

  async listActive(): Promise<readonly PolicyRecord[]> {
    return Array.from(this.policies.values()).filter((p) => p.active);
  }
}

export const policyRepository = new InMemoryPolicyRepository();
export default policyRepository;
