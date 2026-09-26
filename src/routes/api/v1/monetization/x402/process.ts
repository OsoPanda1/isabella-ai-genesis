import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import { z } from "zod";
import { x402MonetizationConnector } from "@/lib/monetization/x402-connector";
import {
  economyCapabilityGate,
  resolveSubscriptionStatus,
  validateMonetizationAmount,
} from "@/lib/monetization/economic-authority";
import { randomUUID } from "node:crypto";

const connector = new x402MonetizationConnector();

/**
 * Contrato de entrada del cuerpo x402. NO incluye subscriptionStatus:
 * el estado de suscripción nunca se acepta del cliente (auditoría P0-02).
 */
const x402ProcessSchema = z.object({
  resourceId: z.string().min(1).max(200).optional(),
  amountCents: z.number().int().optional(),
  currency: z.literal("USDC").optional(),
  idempotencyKey: z
    .string()
    .min(8)
    .max(200)
    .regex(/^[A-Za-z0-9_:.-]+$/, "idempotencyKey con formato inválido")
    .optional(),
});

/**
 * Endpoint Canónico REST para Monetización x402 con Reparto 75/25
 * POST /api/v1/monetization/x402/process
 *
 * Fase 0 (auditoría): capability economy.ledger no certificada ⇒ 503
 * CAPABILITY_NOT_CERTIFIED en staging/production. Suscripción derivada
 * server-side. Importes validados por validateMonetizationAmount.
 */
export const Route = createFileRoute("/api/v1/monetization/x402/process")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async () => {
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
              paymentVerification:
                "ECDSA-P384 (secp384r1/SHA-384/IEEE-P1363) + amount/resource/tenant binding + timestamp + nonce anti-replay",
              subscriptionSource: "server-side durable (never client-supplied)",
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

        const respond = (status: number, body: unknown) =>
          new Response(JSON.stringify(body), { status, headers });

        // Fase 0: capability no certificada bloquea el runtime (no el desarrollador).
        const gate = economyCapabilityGate();
        if (gate.blocked) {
          return respond(503, {
            schemaVersion: "v3.0-MASTER-EXTENDED",
            requestId,
            traceId,
            error: gate.error,
            capability: gate.capability,
            notes: gate.notes,
            evidenceStatus: "E4_ACTION_REQUIRED",
          });
        }

        try {
          const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

          const parsedBody = x402ProcessSchema.safeParse(body);
          if (!parsedBody.success) {
            return respond(400, {
              schemaVersion: "v3.0-MASTER-EXTENDED",
              requestId,
              traceId,
              error: "INVALID_REQUEST_BODY",
              details: parsedBody.error.issues,
              evidenceStatus: "E4_ACTION_REQUIRED",
            });
          }

          const paymentHeader =
            req.headers.get("authorization") || req.headers.get("x-402-authorization") || undefined;

          // Contexto derivado server-side por ARGUS + CROWN.
          // subscriptionStatus NUNCA proviene del body ni de headers del cliente.
          const subscription = resolveSubscriptionStatus(ctx.tenantId, ctx.userId);

          const principalContext = {
            tenantId: ctx.tenantId,
            actorId: ctx.userId,
            role: "CREATOR",
            scopes: ["monetization:execute", "economic"],
            subscriptionStatus: subscription.status,
          };

          const resourceId = parsedBody.data.resourceId ?? "res_mcp_agent_tool_01";

          // amountCents: contrato económico fuerte; sin default silencioso.
          if (parsedBody.data.amountCents === undefined) {
            return respond(400, {
              schemaVersion: "v3.0-MASTER-EXTENDED",
              requestId,
              traceId,
              error: "INVALID_AMOUNT",
              details: ["amountCents es obligatorio (sin default)"],
              evidenceStatus: "E4_ACTION_REQUIRED",
            });
          }
          const amountValidation = validateMonetizationAmount(parsedBody.data.amountCents);
          if (!amountValidation.ok) {
            return respond(400, {
              schemaVersion: "v3.0-MASTER-EXTENDED",
              requestId,
              traceId,
              error: "INVALID_AMOUNT",
              details: [amountValidation.error],
              evidenceStatus: "E4_ACTION_REQUIRED",
            });
          }

          if (parsedBody.data.currency && parsedBody.data.currency !== "USDC") {
            return respond(400, {
              schemaVersion: "v3.0-MASTER-EXTENDED",
              requestId,
              traceId,
              error: "INVALID_CURRENCY",
              details: ["currency debe ser USDC"],
              evidenceStatus: "E4_ACTION_REQUIRED",
            });
          }

          const idempotencyKey = parsedBody.data.idempotencyKey ?? `idemp_${randomUUID()}`;

          const result = await connector.handleMonetizationRequest(
            principalContext,
            resourceId,
            amountValidation.amountCents,
            paymentHeader,
            idempotencyKey,
          );

          // Inyectar headers adicionales si el conector los generó (ej. X-402-Payment-Required)
          if (result.headers) {
            for (const [key, value] of Object.entries(result.headers)) {
              headers.set(key, value);
            }
          }

          return respond(result.status, {
            schemaVersion: "v3.0-MASTER-EXTENDED",
            requestId,
            traceId,
            tenantId: principalContext.tenantId,
            subscriptionSource: subscription.source,
            timestamp: new Date().toISOString(),
            ...result.body,
          });
        } catch (error: unknown) {
          // Sin volcado del error interno al cliente (ISA-239 / §16).
          console.error(
            `[x402:process:${requestId}]`,
            error instanceof Error ? error.message : String(error),
          );
          return respond(500, {
            schemaVersion: "v3.0-MASTER-EXTENDED",
            requestId,
            traceId,
            error: { code: "INTERNAL_MONETIZATION_ERROR", message: "internal_error" },
            evidenceStatus: "E4_ACTION_REQUIRED",
          });
        }
      }),
    },
  },
});
