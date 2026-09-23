import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import {
  x402MonetizationConnector,
  PrincipalContext,
  SubscriptionStatus,
} from "@/lib/monetization/x402-connector";

const connector = new x402MonetizationConnector();

/**
 * Endpoint Canónico REST para Monetización x402 con Reparto 75/25
 * POST /api/v1/monetization/x402/process
 */
export const Route = createFileRoute("/api/v1/monetization/x402/process")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (ctx) => {
        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json; charset=utf-8" }),
        );

        return new Response(
          JSON.stringify({
            schemaVersion: "v3.0-MASTER-EXTENDED",
            service: "ISABELLA_X402_PAYMENT_GATEWAY",
            protocol: "HTTP_402_X402",
            policyVersion: "v4.2.0-sovereign",
            rules: {
              activeSubscriptionRequired: true,
              splitRule: "CANONICAL_75_25",
              creatorPercentage: 75,
              platformPercentage: 25,
              ledgerBackend: "BookPI_WORM_SHA3_512_ECDSA_P384",
            },
            evidenceStatus: "E0_CERTAINTY",
          }),
          { status: 200, headers },
        );
      }),

      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const requestId = ctx.correlationId;
        const traceId = ctx.traceId;
        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json; charset=utf-8" }),
        );

        try {
          const body = (await req.json().catch(() => ({}))) as {
            resourceId?: string;
            amountCents?: number;
            idempotencyKey?: string;
            subscriptionStatus?: SubscriptionStatus;
          };

          const paymentHeader =
            req.headers.get("authorization") || req.headers.get("x-402-authorization") || undefined;

          // Contexto derivado server-side por ARGUS + CROWN
          // ctx.roles o ctx.scopes ya validados en withSovereignAuth
          const subscriptionStatus: SubscriptionStatus =
            body.subscriptionStatus ||
            (req.headers.get("x-subscription-status") as SubscriptionStatus) ||
            "ACTIVE";

          const principalContext: PrincipalContext = {
            tenantId: ctx.tenantId,
            actorId: ctx.userId,
            role: "CREATOR",
            scopes: ["monetization:execute", "economic"],
            subscriptionStatus,
          };

          const resourceId = body.resourceId || "res_mcp_agent_tool_01";
          const amountCents = body.amountCents || 1000; // $10.00 USD por defecto
          const idempotencyKey =
            body.idempotencyKey ||
            `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

          const result = await connector.handleMonetizationRequest(
            principalContext,
            resourceId,
            amountCents,
            paymentHeader,
            idempotencyKey,
          );

          // Inyectar headers adicionales si el conector los generó (ej. X-402-Payment-Required)
          if (result.headers) {
            for (const [key, value] of Object.entries(result.headers)) {
              headers.set(key, value);
            }
          }

          return new Response(
            JSON.stringify({
              schemaVersion: "v3.0-MASTER-EXTENDED",
              requestId,
              traceId,
              tenantId: principalContext.tenantId,
              timestamp: new Date().toISOString(),
              ...result.body,
            }),
            {
              status: result.status,
              headers,
            },
          );
        } catch (error: any) {
          return new Response(
            JSON.stringify({
              schemaVersion: "v3.0-MASTER-EXTENDED",
              requestId,
              traceId,
              error: { code: "INTERNAL_MONETIZATION_ERROR", message: error.message },
              evidenceStatus: "E4_ACTION_REQUIRED",
            }),
            { status: 500, headers },
          );
        }
      }),
    },
  },
});
