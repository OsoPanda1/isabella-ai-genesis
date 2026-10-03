/**
 * Production Authority Engine (src/lib/production-authority.ts)
 * -------------------------------------------------------------
 * Enforces the 6 Sovereign Production Authorities.
 */
import { config } from "./config";
import { isProductionLike } from "./runtime-mode";

export interface AuthorityStatus {
  name: string;
  configured: boolean;
  status: "ACTIVE" | "DEGRADED" | "MISSING";
  requiredInProduction: boolean;
  details?: string;
}

export interface ProductionAuditReport {
  ready: boolean;
  environment: string;
  authorities: AuthorityStatus[];
  missingCount: number;
}

export function evaluateProductionAuthorities(): ProductionAuditReport {
  const cfg = config();
  const production = isProductionLike(cfg.ISABELLA_RUNTIME_MODE);

  const identityConfigured = Boolean(cfg.AUTH_JWT_SECRET || cfg.SUPABASE_URL);
  const policyConfigured = Boolean(cfg.CROWN_POLICY_SIGNING_KEY && cfg.AEGIS_AUDIT_SECRET);
  const persistenceConfigured = Boolean(cfg.DATABASE_URL);
  const evidenceConfigured = Boolean(cfg.AEGIS_AUDIT_SECRET && cfg.BOOKPI_SIGNING_KEY);
  const economicConfigured = Boolean(cfg.STRIPE_SECRET_KEY);
  const cryptoConfigured = Boolean(
    cfg.ENCRYPTION_MASTER_KEY &&
      cfg.CROWN_POLICY_SIGNING_KEY &&
      cfg.BOOKPI_SIGNING_KEY,
  );

  const authorities: AuthorityStatus[] = [
    {
      name: "IDENTITY_AUTHORITY",
      configured: identityConfigured,
      status: identityConfigured ? "ACTIVE" : production ? "MISSING" : "ACTIVE",
      requiredInProduction: true,
      details: "Supabase OIDC / Native JWT verified identity provider.",
    },
    {
      name: "POLICY_AUTHORITY",
      configured: policyConfigured,
      status: policyConfigured ? "ACTIVE" : production ? "MISSING" : "ACTIVE",
      requiredInProduction: true,
      details: "CROWN / ARGUS PDP deterministic policy evaluation.",
    },
    {
      name: "PERSISTENCE_AUTHORITY",
      configured: persistenceConfigured,
      status: persistenceConfigured ? "ACTIVE" : production ? "MISSING" : "ACTIVE",
      requiredInProduction: true,
      details: "PostgreSQL SoR and schema contracts.",
    },
    {
      name: "EVIDENCE_AUTHORITY",
      configured: evidenceConfigured,
      status: evidenceConfigured ? "ACTIVE" : production ? "MISSING" : "ACTIVE",
      requiredInProduction: true,
      details: "BookPI append-only cryptographic audit chain.",
    },
    {
      name: "ECONOMIC_AUTHORITY",
      configured: economicConfigured,
      status: economicConfigured ? "ACTIVE" : production ? "DEGRADED" : "ACTIVE",
      requiredInProduction: false,
      details: "Stripe and double-entry Cattleya accounting.",
    },
    {
      name: "CRYPTOGRAPHIC_AUTHORITY",
      configured: cryptoConfigured,
      status: cryptoConfigured ? "ACTIVE" : production ? "MISSING" : "ACTIVE",
      requiredInProduction: true,
      details: "Application cryptography is configured; external HSM/KMS custody is not implied by this status.",
    },
  ];

  const missing = authorities.filter((a) => a.requiredInProduction && a.status === "MISSING");

  return {
    ready: missing.length === 0,
    environment: cfg.ISABELLA_RUNTIME_MODE,
    authorities,
    missingCount: missing.length,
  };
}

export function assertProductionReady(): void {
  if (!isProductionLike(config().ISABELLA_RUNTIME_MODE)) return;
  const report = evaluateProductionAuthorities();
  if (!report.ready) {
    const missingNames = report.authorities
      .filter((a) => a.requiredInProduction && a.status === "MISSING")
      .map((a) => a.name)
      .join(", ");
    throw new Error(
      "PRODUCTION_AUTHORITY_ABORT: System cannot start in production. Incomplete authorities: " +
        missingNames,
    );
  }
}

export default {
  evaluateProductionAuthorities,
  assertProductionReady,
};