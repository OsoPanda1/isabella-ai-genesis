import { describe, it, expect } from "vitest";
import {
  GovernanceMonetizationGuard,
  BookPILedgerService,
  x402MonetizationConnector,
  PrincipalContext,
} from "../../src/lib/monetization/x402-connector";
import {
  CrownSmartPaywallEngine,
  SmartPaywallEvaluationRequest,
} from "../../src/lib/crown-smart-paywall";
import {
  ISMF_25_MONETIZATION_METHODS,
  validateIsmfAccess,
  calculateIsmfSplit,
} from "../../src/lib/monetization/ismf-catalog";

describe("ISABELLA SOVEREIGN MONETIZATION & x402 PROTOCOL SUITE", () => {
  const activeContext: PrincipalContext = {
    tenantId: "tenant_rdm_01",
    actorId: "usr_anubis_01",
    role: "CREATOR",
    scopes: ["monetization:execute", "economic"],
    subscriptionStatus: "ACTIVE",
  };

  const inactiveContext: PrincipalContext = {
    tenantId: "tenant_rdm_02",
    actorId: "usr_guest_02",
    role: "CREATOR",
    scopes: ["monetization:execute"],
    subscriptionStatus: "INACTIVE",
  };

  describe("1. GovernanceMonetizationGuard (CROWN & ARGUS Policy Gate)", () => {
    const guard = new GovernanceMonetizationGuard();

    it("rechaza peticiones si falta tenantId o actorId (ARGUS)", () => {
      const invalid = { ...activeContext, tenantId: "" };
      const res = guard.evaluateAccess(invalid);
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain("ARGUS_AUTH_FAILED");
    });

    it("bloquea monetización si el usuario no tiene suscripción activa (CROWN)", () => {
      const res = guard.evaluateAccess(inactiveContext);
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain("CROWN_POLICY_DENY: Active monthly subscription required");
    });

    it("autoriza la monetización cuando la suscripción mensual está ACTIVE", () => {
      const res = guard.evaluateAccess(activeContext);
      expect(res.allowed).toBe(true);
      expect(res.reason).toBeUndefined();
    });
  });

  describe("2. BookPILedgerService (WORM Immutability & 75/25 Split)", () => {
    const ledger = new BookPILedgerService();

    it("calcula hash SHA3-512 y firma criptográfica ECDSA P-384", () => {
      const hash = ledger.calculateSHA3_512("test-payload");
      expect(hash).toMatch(/^sha3-512:[a-f0-9]{128}$/);

      const sig = ledger.signPayloadECDSAP384(hash);
      expect(sig).toMatch(/^ecdsa-p384-sig:[a-f0-9]{96}$/);
    });

    it("aplica el reparto estricto 75% Creador / 25% Plataforma en centavos", async () => {
      const grossCents = 10000; // $100.00 USD
      const event = await ledger.recordMonetizationTransaction(
        activeContext,
        "idemp_test_7525",
        grossCents,
        "v4.2.0-sovereign",
      );

      expect(event.grossAmountCents).toBe(10000);
      expect(event.creatorCreditCents).toBe(7500); // 75%
      expect(event.platformFeeCents).toBe(2500); // 25%
      expect(event.creatorCreditCents + event.platformFeeCents).toBe(grossCents);
      expect(event.currentHash).toMatch(/^sha3-512:/);
      expect(event.signature).toMatch(/^ecdsa-p384-sig:/);
    });
  });

  describe("3. x402MonetizationConnector (HTTP 402 Challenge & Settlement)", () => {
    const connector = new x402MonetizationConnector();

    it("devuelve 403 Forbidden con CROWN_POLICY_DENY para usuarios sin suscripción mensual", async () => {
      const res = await connector.handleMonetizationRequest(
        inactiveContext,
        "mcp_weather_tool",
        500,
      );

      expect(res.status).toBe(403);
      expect(res.body.error).toContain("Active monthly subscription required");
    });

    it("devuelve desafío HTTP 402 con términos si no se incluye encabezado de pago", async () => {
      const res = await connector.handleMonetizationRequest(activeContext, "mcp_weather_tool", 500);

      expect(res.status).toBe(402);
      expect(res.headers["X-402-Payment-Required"]).toBe("true");
      expect(res.headers["X-402-Price-Cents"]).toBe("500");
      expect(res.body.terms).toBeDefined();
      expect(res.body.terms.priceCentsUSD).toBe(500);
      expect(res.body.terms.currency).toBe("USDC");
    });

    it("devuelve 400 si la firma de pago x402 es inválida", async () => {
      const res = await connector.handleMonetizationRequest(
        activeContext,
        "mcp_weather_tool",
        500,
        "bad_sig",
      );

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INVALID_X402_PAYMENT_SIGNATURE");
    });

    it("liquida exitosamente con 200 OK y reparto 75/25 con firma válida", async () => {
      const res = await connector.handleMonetizationRequest(
        activeContext,
        "mcp_weather_tool",
        2000, // $20.00 USD
        "x402_sig_valid_cryptographic_payload_a2a_token_123456",
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.distribution.totalGrossUSD).toBe(20.0);
      expect(res.body.distribution.creator75PercentUSD).toBe(15.0); // 75%
      expect(res.body.distribution.platform25PercentUSD).toBe(5.0); // 25%
      expect(res.body.bookPIEntry.currentHash).toMatch(/^sha3-512:/);
    });
  });

  describe("4. CrownSmartPaywallEngine (5-Step Dynamic Smart Paywall)", () => {
    const paywall = new CrownSmartPaywallEngine();

    it("bloquea con DENY (403) si la suscripción no está ACTIVE", () => {
      const req: SmartPaywallEvaluationRequest = {
        traceId: "tr_01",
        requestId: "rq_01",
        context: inactiveContext,
        resourceId: "doc_territorial_01",
        resourceType: "PREMIUM_CONTENT",
        epistemicComplexity: "E1",
        currentQuotaUsed: 5,
        maxQuotaAllowed: 100,
      };

      const decision = paywall.evaluate(req);
      expect(decision.decision).toBe("DENY");
      expect(decision.httpStatusCode).toBe(403);
      expect(decision.allowed).toBe(false);
    });

    it("concede ALLOW (200) para usuario con suscripción dentro de cuota", () => {
      const req: SmartPaywallEvaluationRequest = {
        traceId: "tr_02",
        requestId: "rq_02",
        context: activeContext,
        resourceId: "doc_territorial_01",
        resourceType: "PREMIUM_CONTENT",
        epistemicComplexity: "E1",
        currentQuotaUsed: 5,
        maxQuotaAllowed: 100,
      };

      const decision = paywall.evaluate(req);
      expect(decision.decision).toBe("ALLOW");
      expect(decision.httpStatusCode).toBe(200);
      expect(decision.allowed).toBe(true);
    });

    it("emite X402_CHALLENGE (402) para llamadas A2A / API cuando la cuota fue excedida", () => {
      const req: SmartPaywallEvaluationRequest = {
        traceId: "tr_03",
        requestId: "rq_03",
        context: activeContext,
        resourceId: "api_inference_01",
        resourceType: "API_INFERENCE",
        epistemicComplexity: "E2",
        currentQuotaUsed: 1000,
        maxQuotaAllowed: 1000,
        requestedPriceCents: 250,
      };

      const decision = paywall.evaluate(req);
      expect(decision.decision).toBe("X402_CHALLENGE");
      expect(decision.httpStatusCode).toBe(402);
      expect(decision.x402Terms?.priceCentsUSD).toBe(250);
      expect(decision.x402Terms?.currency).toBe("USDC");
    });
  });

  describe("5. ISMF 25 Native Monetization Methods Catalog", () => {
    it("incluye los 25 métodos de monetización canónicos", () => {
      const methods = Object.values(ISMF_25_MONETIZATION_METHODS);
      expect(methods.length).toBe(25);
    });

    it("todos los 25 métodos exigen suscripción mensual ACTIVE para monetizar", () => {
      for (const method of Object.values(ISMF_25_MONETIZATION_METHODS)) {
        expect(method.minimumSubscriptionRequired).toBe("ACTIVE");
        expect(method.creatorSplitPct).toBe(75);
        expect(method.platformSplitPct).toBe(25);
      }
    });

    it("rechaza acceso a cualquier método ISMF si la suscripción está inactiva", () => {
      const test = validateIsmfAccess("method-01-api-mcp", inactiveContext);
      expect(test.allowed).toBe(false);
      expect(test.reason).toContain("CROWN_POLICY_DENY");
    });

    it("permite acceso a métodos ISMF cuando la suscripción mensual está activa", () => {
      const test = validateIsmfAccess("method-01-api-mcp", activeContext);
      expect(test.allowed).toBe(true);
      expect(test.method?.id).toBe("method-01-api-mcp");
    });

    it("calcula correctamente el split 75/25 en dólares con calculateIsmfSplit", () => {
      const split = calculateIsmfSplit(100.0);
      expect(split.creatorPct).toBe(75);
      expect(split.creatorUsd).toBe(75.0);
      expect(split.platformPct).toBe(25);
      expect(split.platformUsd).toBe(25.0);
    });
  });
});
