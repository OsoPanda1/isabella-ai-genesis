/**
 * Production Authority Engine (src/lib/production-authority.ts)
 * -------------------------------------------------------------
 * Runtime truth for the six declared production authorities.
 *
 * This module reports configuration/evidence state; it does not manufacture
 * readiness when a required credential, persistence layer, or signing key is
 * absent. Software cryptography is reported distinctly from external HSM/KMS.
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

function present(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function validBookpiAlgorithm(value: unknown): boolean {
  return value === "ECDSA-P384" || value === "RSA-SHA256";
}

export function evaluateProductionAuthorities(): ProductionAuditReport {
  const cfg = config();
  const production = isProductionLike(cfg.ISABELLA_RUNTIME_MODE);

  const identityConfigured = present(cfg.AUTH_JWT_SECRET) || present(cfg.SUPABASE_URL);
  const persistenceConfigured = present(cfg.DATABASE_URL);

  const evidenceConfigured =
    present(cfg.AEGIS_AUDIT_SECRET) &&
    present(cfg.BOOKPI_SIGNING_KEY) &&
    validBookpiAlgorithm(cfg.BOOKPI_SIGNATURE_ALGORITHM) &&
    present(cfg.CROWN_POLICY_SIGNING_KEY);

  const cryptoConfigured =
    present(cfg.ENCRYPTION_MASTER_KEY) &&
    present(cfg.CROWN_POLICY_SIGNING_KEY) &&
    present(cfg.BOOKPI_SIGNING_KEY) &&
    validBookpiAlgorithm(cfg.BOOKPI_SIGNATURE_ALGORITHM);

  const authorities: AuthorityStatus[] = [
    {
      name: "IDENTITY_AUTHORITY",
      configured: identityConfigured,
      status: identityConfigured || !production ? "ACTIVE" : "MISSING",
      requiredInProduction: true,
      details: "Identidad firmada mediante AUTH_JWT_SECRET y/o proveedor OIDC/Supabase configurado.",
    },
    {
      name: "POLICY_AUTHORITY",
      configured: true,
      status: "ACTIVE",
      requiredInProduction: true,
      details: "CROWN/ARGUS determinista; la aplicación valida política antes de ejecutar.",
    },
    {
      name: "PERSISTENCE_AUTHORITY",
      configured: persistenceConfigured,
      status: persistenceConfigured || !production ? "ACTIVE" : "MISSING",
      requiredInProduction: true,
      details: "PostgreSQL como autoridad durable única en staging/production.",
    },
    {
      name: "EVIDENCE_AUTHORITY",
      configured: evidenceConfigured,
      status: evidenceConfigured || !production ? "ACTIVE" : "MISSING",
      requiredInProduction: true,
      details:
        "BookPI/ledger requiere secreto de auditoría, clave de firma y algoritmo permitido; la integridad durable se verifica en PostgreSQL.",
    },
    {
      name: "ECONOMIC_AUTHORITY",
      configured: present(cfg.STRIPE_SECRET_KEY),
      status: present(cfg.STRIPE_SECRET_KEY) || !production ? "ACTIVE" : "DEGRADED",
      requiredInProduction: false,
      details: "Stripe/Cattleya es opcional para el núcleo conversacional.",
    },
    {
      name: "CRYPTOGRAPHIC_AUTHORITY",
      configured: cryptoConfigured,
      status: cryptoConfigured || !production ? "ACTIVE" : "MISSING",
      requiredInProduction: true,
      details:
        "Criptografía de aplicación (AES-256-GCM/HKDF + firmas BookPI/CROWN). No se afirma disponibilidad de HSM/KMS hardware sin evidencia externa.",
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
      `PRODUCTION_AUTHORITY_ABORT: System cannot start in production. Incomplete authorities: ${missingNames}`,
    );
  }
}

export default {
  evaluateProductionAuthorities,
  assertProductionReady,
};
