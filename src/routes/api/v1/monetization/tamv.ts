import { createFileRoute } from "@tanstack/react-router";
import { withSovereignAuth } from "@/lib/principal-context";
import { SecuritySystem } from "@/lib/security";
import {
  TamvSovereignMonetizationEngine,
  SettleCommerceSchema,
  SettleInferenceSchema,
  ProofOfPreservationSchema,
} from "@/lib/monetization/tamv-monetization";
import { CATTLEYA_SPLIT_PERCENTAGES } from "@/lib/monetization/cattleya";
import { z } from "zod";

const ActionRequestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("settle_commerce"),
    payload: SettleCommerceSchema.omit({ tenantId: true }),
  }),
  z.object({
    action: z.literal("settle_cattleya"),
    payload: z.object({
      amountUsd: z.number().positive(),
    }),
  }),
  z.object({
    action: z.literal("settle_inference"),
    payload: SettleInferenceSchema.omit({ tenantId: true, userId: true }),
  }),
  z.object({
    action: z.literal("proof_of_preservation"),
    payload: ProofOfPreservationSchema.omit({ tenantId: true, contributorId: true }),
  }),
  z.object({
    action: z.literal("issue_card"),
    payload: z.object({
      cardholderName: z.string().min(2),
      spendingLimitDaily: z.number().positive().optional(),
      reputationScore: z.number().int().min(0).max(2000).optional(),
      loyaltyTier: z.string().optional(),
    }),
  }),
]);

export const Route = createFileRoute("/api/v1/monetization/tamv")({
  server: {
    handlers: {
      GET: withSovereignAuth("system", "read", async (ctx) => {
        const plans = TamvSovereignMonetizationEngine.listPlans();
        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json; charset=utf-8" }),
        );
        return new Response(
          JSON.stringify({
            schemaVersion: "v1",
            requestId: ctx.correlationId,
            traceId: ctx.traceId,
            tenantId: ctx.tenantId,
            timestamp: new Date().toISOString(),
            plans,
            cattleyaSplit: {
              creatorPct: CATTLEYA_SPLIT_PERCENTAGES.creator, // 70% Creador
              platformPct: CATTLEYA_SPLIT_PERCENTAGES.platform, // 20% Plataforma
              backupFundPct: CATTLEYA_SPLIT_PERCENTAGES.backupFund, // 5% Fondo de Respaldo
              communityFundPct: CATTLEYA_SPLIT_PERCENTAGES.communityFund, // 5% Fondo Comunitario
            },
            nonCustodialProtection: {
              fundsGuaranteed: true,
              arbitraryBlockingForbidden: true,
              regulatoryCompliance: "LEY_FINANCIERA_NO_RETENCION_INDEBIDA",
            },
          }),
          { status: 200, headers },
        );
      }),

      POST: withSovereignAuth("system", "execute", async (ctx, req) => {
        const rawBody = (await req.json().catch(() => ({}))) as unknown;
        const parseResult = ActionRequestSchema.safeParse(rawBody);

        if (!parseResult.success) {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json; charset=utf-8" }),
          );
          return new Response(
            JSON.stringify({
              schemaVersion: "v1",
              requestId: ctx.correlationId,
              traceId: ctx.traceId,
              tenantId: ctx.tenantId,
              timestamp: new Date().toISOString(),
              error: {
                code: "INVALID_MONETIZATION_ACTION",
                message: "Acción o payload de monetización TAMV no válido.",
                details: parseResult.error.flatten(),
              },
            }),
            { status: 400, headers },
          );
        }

        const data = parseResult.data;
        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json; charset=utf-8" }),
        );

        if (data.action === "settle_commerce") {
          const result = TamvSovereignMonetizationEngine.calculateCommerceSettlement({
            ...data.payload,
            tenantId: ctx.tenantId,
          });
          return new Response(
            JSON.stringify({
              schemaVersion: "v1",
              requestId: ctx.correlationId,
              traceId: ctx.traceId,
              tenantId: ctx.tenantId,
              timestamp: new Date().toISOString(),
              action: data.action,
              settlement: result,
            }),
            { status: 200, headers },
          );
        }

        if (data.action === "settle_cattleya") {
          const result = TamvSovereignMonetizationEngine.calculateCattleyaSettlement(
            data.payload.amountUsd,
          );
          return new Response(
            JSON.stringify({
              schemaVersion: "v1",
              requestId: ctx.correlationId,
              traceId: ctx.traceId,
              tenantId: ctx.tenantId,
              timestamp: new Date().toISOString(),
              action: data.action,
              cattleyaBreakdown: result,
            }),
            { status: 200, headers },
          );
        }

        if (data.action === "settle_inference") {
          const result = await TamvSovereignMonetizationEngine.recordInferenceSettlement({
            ...data.payload,
            tenantId: ctx.tenantId,
            userId: ctx.userId,
          });
          return new Response(
            JSON.stringify({
              schemaVersion: "v1",
              requestId: ctx.correlationId,
              traceId: ctx.traceId,
              tenantId: ctx.tenantId,
              timestamp: new Date().toISOString(),
              action: data.action,
              record: result,
            }),
            { status: 200, headers },
          );
        }

        if (data.action === "proof_of_preservation") {
          const result = await TamvSovereignMonetizationEngine.awardProofOfPreservation({
            ...data.payload,
            tenantId: ctx.tenantId,
            contributorId: ctx.userId,
          });
          return new Response(
            JSON.stringify({
              schemaVersion: "v1",
              requestId: ctx.correlationId,
              traceId: ctx.traceId,
              tenantId: ctx.tenantId,
              timestamp: new Date().toISOString(),
              action: data.action,
              award: result,
            }),
            { status: 200, headers },
          );
        }

        if (data.action === "issue_card") {
          const result = await TamvSovereignMonetizationEngine.issueCattleyaCard({
            userId: ctx.userId,
            tenantId: ctx.tenantId,
            cardholderName: data.payload.cardholderName,
            spendingLimitDaily: data.payload.spendingLimitDaily,
            reputationScore: data.payload.reputationScore,
            loyaltyTier: data.payload.loyaltyTier,
          });
          const statusCode = result.ok
            ? 200
            : (result as any).reason === "stripe_issuing_unconfigured"
              ? 503
              : 400;
          return new Response(
            JSON.stringify({
              schemaVersion: "v1",
              requestId: ctx.correlationId,
              traceId: ctx.traceId,
              tenantId: ctx.tenantId,
              timestamp: new Date().toISOString(),
              action: data.action,
              cardResult: result,
            }),
            { status: statusCode, headers },
          );
        }

        return new Response(JSON.stringify({ error: "UNSUPPORTED_ACTION" }), {
          status: 400,
          headers,
        });
      }),
    },
  },
});
