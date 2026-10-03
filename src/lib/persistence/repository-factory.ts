/**
 * Repository Factory (src/lib/persistence/repository-factory.ts)
 * -------------------------------------------------------------
 * Enforces explicit storage provider selection (ISABELLA_STORAGE_PROVIDER).
 * Production safety rule: JSON persistence is forbidden in production runtime.
 * Unsupported adapters are not implemented for production (fail-closed).
 */
import { auditRepository } from "../repositories/audit-repository";
import { memoryRepository } from "../repositories/memory-repository";
import { bookpiPostgresRepository } from "../repositories/bookpi-postgres-repository";
import { apiKeyRepository } from "../repositories/api-key-repository";
import { approvalRepository } from "../repositories/approval-repository";
import { marketplaceRepository } from "../repositories/marketplace-repository";
import { policyRepository } from "../repositories/policy-repository";
import { decisionRepository } from "../repositories/decision-repository";
import { isProductionLike } from "../runtime-mode";

export function getRepositoryFactory() {
  const provider = process.env.ISABELLA_STORAGE_PROVIDER || "postgres";

  if (isProductionLike()) {
    if (provider === "json" || provider === "memory") {
      throw new Error("FAIL_CLOSED: JSON persistence is forbidden in production runtime.");
    }
    if (provider !== "postgres" && provider !== "neon" && provider !== "supabase") {
      throw new Error(`FAIL_CLOSED: Storage provider '${provider}' is not implemented for production.`);
    }
  }

  return {
    getAuditRepository: () => auditRepository,
    getMemoryRepository: () => memoryRepository,
    getBookPiRepository: () => bookpiPostgresRepository,
    getApiKeyRepository: () => apiKeyRepository,
    getApprovalRepository: () => approvalRepository,
    getMarketplaceRepository: () => marketplaceRepository,
    getPolicyRepository: () => policyRepository,
    getDecisionRepository: () => decisionRepository,
  };
}

export const repositoryFactory = getRepositoryFactory();
export default repositoryFactory;
