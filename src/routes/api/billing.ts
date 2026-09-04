import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import * as nodeCrypto from "node:crypto";
import { SovereignDB } from "@/lib/sovereign-engine";
import { SecuritySystem } from "@/lib/security";
import { withSovereignAuth } from "@/lib/principal-context";
import { config } from "@/lib/config";
import Stripe from "stripe";

// Initialize Stripe gracefully
let stripeInstance: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!stripeInstance) {
    const key =
      (config() as unknown as Record<string, string>).STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY;
    if (key) {
      try {
        stripeInstance = new Stripe(key, {
          apiVersion: "2022-11-15" as Stripe.LatestApiVersion,
        });
      } catch (err) {
        console.error("Fallo al inicializar Stripe SDK:", err);
      }
    }
  }
  return stripeInstance;
}

// In-Memory Marketplace Listings and Purchases store linked to database/SovereignDB settings
interface MarketplaceListing {
  skillId: string;
  title: string;
  costCents: number;
  ownerId: string;
  description: string;
  createdAt: string;
}

const DEFAULT_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    skillId: "gis-cadastre",
    title: "Módulo GIS Catastral Real del Monte",
    costCents: 4500, // $45.00 USD
    ownerId: "usr_anubis_villasenor",
    description: "Sincronización cartográfica en caliente con el registro territorial local.",
    createdAt: new Date().toISOString(),
  },
  {
    skillId: "qec-syndrome-decoder",
    title: "Decodificador Cuántico Avanzado QEC",
    costCents: 12000, // $120.00 USD
    ownerId: "usr_sophia_researcher",
    description:
      "Decodificación correctora mediante estimaciones de grafos con peso mínimo de emparejamiento perfecto.",
    createdAt: new Date().toISOString(),
  },
];

export const Route = createFileRoute("/api/billing")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action") || "credits";

        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json" }),
        );

        // 1. OBTENER INFORMACIÓN DE CRÉDITOS / PLAN
        if (action === "credits") {
          return withSovereignAuth("system", "read", async (context) => {
            const tenant = SovereignDB.getTenant(context.tenantId);
            const monetizationAccount = SovereignDB.getMonetizationAccount(context.userId);
            const ledger = SovereignDB.getLedger(context.tenantId);

            return new Response(
              JSON.stringify({
                success: true,
                tenantId: context.tenantId,
                quotaBalance: tenant?.quotaBalance ?? 0,
                tier: tenant?.tier ?? "Free",
                monetizationAccount,
                recentTransactions: ledger.slice(-5).reverse(),
              }),
              { headers },
            );
          })({ request });
        }

        // 2. DETALLE DE TRANSACCIÓN / INVOICE METADATA
        if (action === "invoice") {
          const invoiceId = url.searchParams.get("invoiceId");
          if (!invoiceId) {
            return new Response(JSON.stringify({ error: "Parámetro invoiceId requerido." }), {
              status: 400,
              headers,
            });
          }

          return withSovereignAuth("system", "read", async () => {
            const fullLedger = SovereignDB.getFullLedger();
            // Buscar por index o por coincidencia en el operation
            const block = fullLedger.find(
              (b) =>
                b.index === parseInt(invoiceId, 10) ||
                b.blockHash.startsWith(invoiceId) ||
                b.operation.includes(invoiceId),
            );

            if (!block) {
              return new Response(JSON.stringify({ error: "Invoice/Transacción no encontrada." }), {
                status: 404,
                headers,
              });
            }

            const costAmount = parseFloat(block.costDecimal);
            const taxCents = Math.round(Math.abs(costAmount * 16)); // 16% IVA simulado

            return new Response(
              JSON.stringify({
                success: true,
                invoiceId: `INV-${block.index}-${block.timestamp.split("T")[0].replace(/-/g, "")}`,
                ledgerIndex: block.index,
                timestamp: block.timestamp,
                tenantId: block.tenantId,
                userId: block.userId,
                description: block.operation,
                category: block.category,
                subtotalUSD: costAmount,
                taxUSD: taxCents / 100,
                totalUSD: costAmount,
                hashChain: {
                  blockHash: block.blockHash,
                  previousHash: block.previousHash,
                  signatureAlgorithm: block.signatureAlgorithm,
                },
                status: block.status,
                reconciliationLedger: "BookPI-Ledger-V3",
              }),
              { headers },
            );
          })({ request });
        }

        // 3. CONSULTAR LISTADOS DEL MARKETPLACE
        if (action === "marketplace-listings") {
          return withSovereignAuth("system", "read", async () => {
            const db = SovereignDB.load();
            const customListings = (db.settings.marketplaceListings as MarketplaceListing[]) || [];
            const allListings = [...DEFAULT_MARKETPLACE_LISTINGS, ...customListings];

            return new Response(
              JSON.stringify({
                success: true,
                listings: allListings,
              }),
              { headers },
            );
          })({ request });
        }

        // 4. VERIFICAR BLOQUE DEL LEDGER COMPLETO
        if (action === "audit-block") {
          const blockIndex = url.searchParams.get("index");
          if (!blockIndex) {
            return new Response(JSON.stringify({ error: "Índice de bloque requerido." }), {
              status: 400,
              headers,
            });
          }

          return withSovereignAuth("audit", "read", async () => {
            const indexInt = parseInt(blockIndex, 10);
            const fullLedger = SovereignDB.getFullLedger();
            const block = fullLedger.find((b) => b.index === indexInt);

            if (!block) {
              return new Response(JSON.stringify({ error: "Bloque de auditoría no encontrado." }), {
                status: 404,
                headers,
              });
            }

            // Recalcular para corroborar
            const blockContent = `${block.index}-${block.timestamp}-${block.tenantId}-${block.userId}-${block.operation}-${block.category}-${block.costDecimal}-${block.tokensConsumed}-${block.previousHash}`;
            const recalculatedHash = nodeCrypto
              .createHash("sha256")
              .update(blockContent)
              .digest("hex");
            const isChainValid = block.blockHash === recalculatedHash;

            return new Response(
              JSON.stringify({
                success: true,
                block,
                validation: {
                  recalculatedHash,
                  isChainValid,
                  pqcVerified: false,
                  nodeSignature: "SHA256-RDM-NODECERO",
                },
              }),
              { headers },
            );
          })({ request });
        }

        return new Response(JSON.stringify({ error: "Acción GET desconocida." }), {
          status: 400,
          headers,
        });
      },

      POST: async ({ request }) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action");

        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json" }),
        );

        if (!action) {
          return new Response(JSON.stringify({ error: "Parámetro action requerido en POST." }), {
            status: 400,
            headers,
          });
        }

        try {
          const bodyText = await request.text();
          const body = bodyText ? JSON.parse(bodyText) : {};

          // 1. CHECKOUT CREATION (STRIPE / SIMULATED)
          if (action === "checkout") {
            return withSovereignAuth("system", "write", async (context) => {
              const { planId } = body as { planId?: string };
              if (!planId) {
                return new Response(JSON.stringify({ error: "planId requerido." }), {
                  status: 400,
                  headers,
                });
              }

              const stripe = getStripe();
              const sessionId = `sess_${nodeCrypto.randomUUID().slice(0, 12)}`;
              let checkoutUrl = "";

              if (stripe) {
                try {
                  const stripeSession = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: [
                      {
                        price_data: {
                          currency: "usd",
                          product_data: {
                            name: `Isabella AI - Suscripción ${planId.toUpperCase()}`,
                            description: `Acceso Premium al orquestador cognitivo de Isabella (${planId}).`,
                          },
                          unit_amount: planId === "pro" ? 2900 : 9900, // $29 o $99 USD
                          recurring: { interval: "month" },
                        },
                        quantity: 1,
                      },
                    ],
                    mode: "subscription",
                    success_url: `${url.origin}/billing-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${url.origin}/billing-cancel`,
                    client_reference_id: context.userId,
                    metadata: {
                      tenantId: context.tenantId,
                      planId,
                    },
                  });
                  checkoutUrl = stripeSession.url ?? "";
                } catch (stripeError) {
                  console.error("Fallo Stripe checkout, procediendo a simulador:", stripeError);
                }
              }

              // Fallback o simulador explícito
              if (!checkoutUrl) {
                checkoutUrl = `/billing-success?session_id=${sessionId}&simulated=true&planId=${planId}&userId=${context.userId}&tenantId=${context.tenantId}`;
              }

              SovereignDB.appendAuditLog(
                `trc_checkout_${sessionId}`,
                context.correlationId,
                context.ip,
                "Intención de Suscripción Creada",
                "S3",
                `Checkout iniciado para plan: ${planId}. Dirección de checkout: ${checkoutUrl}`,
              );

              return new Response(
                JSON.stringify({
                  success: true,
                  sessionId,
                  checkoutUrl,
                  simulated: !stripe,
                }),
                { headers },
              );
            })({ request });
          }

          // 2. WEBHOOK (REAL STRIPE / INTERNO DE VERIFICACIÓN)
          if (action === "webhook") {
            const stripe = getStripe();
            let eventType = body?.type || "checkout.session.completed";
            let metadata = body?.metadata || {};
            let clientReferenceId = body?.client_reference_id || "";

            // Si Stripe está activo y recibimos firmas reales, verificamos
            const signature = request.headers.get("stripe-signature");
            if (stripe && signature) {
              try {
                const endpointSecret =
                  (config() as unknown as Record<string, string>).STRIPE_WEBHOOK_SECRET || "";
                const verifiedEvent = stripe.webhooks.constructEvent(
                  bodyText,
                  signature,
                  endpointSecret,
                );
                eventType = verifiedEvent.type;
                const sessionObject = verifiedEvent.data.object as unknown as Record<
                  string,
                  unknown
                >;
                metadata = (sessionObject.metadata as Record<string, string>) || {};
                clientReferenceId = (sessionObject.client_reference_id as string) || "";
              } catch (verificationError: unknown) {
                const errorMsg =
                  verificationError instanceof Error
                    ? verificationError.message
                    : String(verificationError);
                console.error("Firma Webhook Stripe inválida:", errorMsg);
                return new Response(JSON.stringify({ error: "Fallo de validación de firma." }), {
                  status: 400,
                  headers,
                });
              }
            }

            // Procesar el evento
            if (
              eventType === "checkout.session.completed" ||
              eventType === "invoice.payment_succeeded"
            ) {
              const planId = metadata?.planId || body?.planId || "pro";
              const targetTenantId = metadata?.tenantId || body?.tenantId;
              const targetUserId = clientReferenceId || body?.userId;

              if (targetTenantId) {
                const db = SovereignDB.load();
                const tenant = db.tenants.find((t) => t.id === targetTenantId);
                if (tenant) {
                  tenant.tier = planId === "enterprise" ? "Enterprise" : "Sovereign";
                  // Cargar 100 créditos de bono al suscribirse
                  tenant.quotaBalance += 100.0;
                  SovereignDB.upsertTenant(tenant);

                  // Actualizar también la cuenta de monetización
                  if (targetUserId) {
                    SovereignDB.updateMonetizationAccount(targetUserId, {
                      subscriptionActive: true,
                    });
                  }

                  const block = SovereignDB.appendLedgerBlock(
                    targetTenantId,
                    targetUserId || "system",
                    `ACTIVATE_SUBSCRIPTION: Plan ${planId.toUpperCase()} activado exitosamente (Créditos de bono: +$100.00 USD)`,
                    "other",
                    0, // no deduction for subscriptions
                    0,
                  );

                  SovereignDB.appendAuditLog(
                    `trc_webhook_${block.index}`,
                    `corr_web_${nodeCrypto.randomUUID().slice(0, 8)}`,
                    "127.0.0.1",
                    "Webhook de Suscripción Confirmado",
                    "S3",
                    `Suscripción de plan ${planId} aplicada a tenant ${targetTenantId}.`,
                  );
                }
              }
            }

            return new Response(JSON.stringify({ success: true, processed: true }), { headers });
          }

          // 3. REGISTRAR CONSUMO REAL POR QUANTUM JOB / INFERENCIA (SERVER-TO-SERVER)
          if (action === "charge-usage") {
            return withSovereignAuth("system", "write", async (context) => {
              const chargeSchema = z.object({
                jobId: z.string().min(1),
                shots: z.number().nonnegative().default(0),
                qpu_seconds: z.number().nonnegative().default(0),
                operation: z.string().optional(),
              });

              const parsed = chargeSchema.safeParse(body);
              if (!parsed.success) {
                return new Response(
                  JSON.stringify({
                    error: "Parámetros de consumo inválidos.",
                    details: parsed.error.format(),
                  }),
                  { status: 400, headers },
                );
              }

              // Calculate exact cost
              const costUSD = parsed.data.shots * 0.1 + parsed.data.qpu_seconds * 1.0;
              const opText =
                parsed.data.operation ||
                `QUANTUM_JOB: ${parsed.data.jobId} (Shots: ${parsed.data.shots}, Segundos QPU: ${parsed.data.qpu_seconds})`;

              // P6: Use PostgreSQL canonical ledger instead of JSON
              const { createBookpiPostgresRepository } = await import("@/lib/repositories/bookpi-postgres-repository");
              const bookpiRepo = createBookpiPostgresRepository();
              const blockResult = await bookpiRepo.append({
                tenantId: context.tenantId,
                userId: context.userId,
                operation: opText,
                category: "processing",
                cost: costUSD,
                tokens: parsed.data.shots
              });

              if (!blockResult.success) {
                return new Response(JSON.stringify({ error: blockResult.error }), {
                  status: 500,
                  headers,
                });
              }
              const block = blockResult.block;

              SovereignDB.appendAuditLog(
                `trc_charge_${block.index}`,
                context.correlationId,
                context.ip,
                "Consumo de Hardware Dedicado Acreditado",
                "S3",
                `Transacción #${block.index} cargada por valor de $${costUSD.toFixed(2)} USD a ${context.tenantId}`,
              );

              return new Response(
                JSON.stringify({
                  success: true,
                  blockIndex: block.index,
                  costUSD,
                  quotaBalanceRemaining: SovereignDB.getTenant(context.tenantId)?.quotaBalance ?? 0,
                }),
                { headers },
              );
            })({ request });
          }

          // 4. TOPUP: ADMINISTRAR CARGA DIRECTA DE CRÉDITOS
          if (action === "topup") {
            return withSovereignAuth("system", "write", async (context) => {
              const topupSchema = z.object({
                amountUSD: z.number().positive().max(5000),
              });

              const parsed = topupSchema.safeParse(body);
              if (!parsed.success) {
                return new Response(JSON.stringify({ error: "Monto de recarga inválido." }), {
                  status: 400,
                  headers,
                });
              }

              const db = SovereignDB.load();
              const tenant = db.tenants.find((t) => t.id === context.tenantId);
              if (!tenant) {
                return new Response(JSON.stringify({ error: "Organización no encontrada." }), {
                  status: 404,
                  headers,
                });
              }

              tenant.quotaBalance += parsed.data.amountUSD;
              SovereignDB.upsertTenant(tenant);

              const block = SovereignDB.appendLedgerBlock(
                context.tenantId,
                context.userId,
                `QUOTA_TOPUP: Recarga manual de saldo comercial (+$${parsed.data.amountUSD.toFixed(2)} USD)`,
                "other",
                0, // no deduction
                0,
              );

              SovereignDB.appendAuditLog(
                `trc_topup_${block.index}`,
                context.correlationId,
                context.ip,
                "Recarga de Saldo Procesada",
                "S3",
                `Monto de $${parsed.data.amountUSD.toFixed(2)} USD recargado a ${context.tenantId}.`,
              );

              return new Response(
                JSON.stringify({
                  success: true,
                  amountUSD: parsed.data.amountUSD,
                  newQuotaBalance: tenant.quotaBalance,
                  blockIndex: block.index,
                }),
                { headers },
              );
            })({ request });
          }

          // 5. PREAUTORIZACIÓN ANTES DE EJECUTAR UN SKILL O COMPUTACIÓN CUÁNTICA (PRE-RUN GATE)
          if (action === "authorize-run") {
            return withSovereignAuth("system", "write", async (context) => {
              const runSchema = z.object({
                skillId: z.string().min(1),
                estimatedCostUSD: z.number().nonnegative().default(0),
              });

              const parsed = runSchema.safeParse(body);
              if (!parsed.success) {
                return new Response(
                  JSON.stringify({ error: "Parámetros de preautorización corruptos." }),
                  {
                    status: 400,
                    headers,
                  },
                );
              }

              const tenant = SovereignDB.getTenant(context.tenantId);
              const currentBalance = tenant?.quotaBalance ?? 0;

              // REGLA DE SEGURIDAD LUMEN / BUDGET LIMITS
              if (currentBalance < parsed.data.estimatedCostUSD) {
                SovereignDB.appendAuditLog(
                  `trc_auth_fail_${context.userId}`,
                  context.correlationId,
                  context.ip,
                  "Ejecución de Skill Bloqueada por Insuficiencia",
                  "S1",
                  `Usuario ${context.userId} intentó ejecutar ${parsed.data.skillId} pero posee saldo insuficiente ($${currentBalance.toFixed(2)} < $${parsed.data.estimatedCostUSD.toFixed(2)})`,
                );

                return new Response(
                  JSON.stringify({
                    allowed: false,
                    reason: "INSUFFICIENT_CREDITS",
                    balance: currentBalance,
                    estimatedCost: parsed.data.estimatedCostUSD,
                  }),
                  { headers },
                );
              }

              // Elegibilidad de Monetización
              const monAcc = SovereignDB.getMonetizationAccount(context.userId);
              if (monAcc.sanctioned) {
                return new Response(
                  JSON.stringify({
                    allowed: false,
                    reason: "ACCOUNT_SANCTIONED",
                  }),
                  { headers },
                );
              }

              const authToken = nodeCrypto.randomBytes(16).toString("hex");

              return new Response(
                JSON.stringify({
                  allowed: true,
                  reason: "SUCCESS",
                  estimatedCost: parsed.data.estimatedCostUSD,
                  currentBalance,
                  authToken,
                }),
                { headers },
              );
            })({ request });
          }

          // 6. INICIAR REEMBOLSO (ADMINISTRATOR DE LA TRANSACCIÓN)
          if (action === "refund") {
            return withSovereignAuth("system", "write", async (context) => {
              const refundSchema = z.object({
                ledgerIndex: z.number().int().nonnegative(),
              });

              const parsed = refundSchema.safeParse(body);
              if (!parsed.success) {
                return new Response(
                  JSON.stringify({ error: "Índice de Ledger inválido para reembolso." }),
                  {
                    status: 400,
                    headers,
                  },
                );
              }

              const { createBookpiPostgresRepository } = await import("@/lib/repositories/bookpi-postgres-repository");
              const bookpiRepo = createBookpiPostgresRepository();
              
              const result = await bookpiRepo.refund(String(parsed.data.ledgerIndex), { tenantId: context.tenantId, userId: context.userId }, "Reembolso de sistema");

              if (result.success) {
                SovereignDB.appendAuditLog(
                  `trc_refund_ok_${parsed.data.ledgerIndex}`,
                  context.correlationId,
                  context.ip,
                  "Reembolso de Transacción Procesado",
                  "S3",
                  `La transacción #${parsed.data.ledgerIndex} fue revertida y su costo reembolsado al tenant ${context.tenantId}`,
                );

                return new Response(
                  JSON.stringify({ success: true, index: parsed.data.ledgerIndex }),
                  { headers },
                );
              } else {
                return new Response(JSON.stringify({ success: false, error: result.error }), {
                  status: 400,
                  headers,
                });
              }
            })({ request });
          }

          // 7. PUBLICAR UN NUEVO ADDON / LISTING EN EL MARKETPLACE (OWNER DE LA COMUNIDAD)
          if (action === "marketplace-listing") {
            return withSovereignAuth("system", "write", async (context) => {
              const listingSchema = z.object({
                skillId: z.string().min(3),
                title: z.string().min(3),
                costCents: z.number().positive().int(),
                description: z.string().min(10),
              });

              const parsed = listingSchema.safeParse(body);
              if (!parsed.success) {
                return new Response(JSON.stringify({ error: "Datos del listing inválidos." }), {
                  status: 400,
                  headers,
                });
              }

              const db = SovereignDB.load();
              const currentListings =
                (db.settings?.marketplaceListings as MarketplaceListing[]) || [];

              const newListing: MarketplaceListing = {
                skillId: parsed.data.skillId,
                title: parsed.data.title,
                costCents: parsed.data.costCents,
                description: parsed.data.description,
                ownerId: context.userId,
                createdAt: new Date().toISOString(),
              };

              currentListings.push(newListing);
              SovereignDB.saveMarketplaceListings(currentListings);

              SovereignDB.appendAuditLog(
                `trc_market_list_${parsed.data.skillId}`,
                context.correlationId,
                context.ip,
                "Anuncio en Marketplace Publicado",
                "S3",
                `Habilidad premium '${parsed.data.title}' listada para monetización por $${(parsed.data.costCents / 100).toFixed(2)} USD`,
              );

              return new Response(JSON.stringify({ success: true, listing: newListing }), {
                headers,
              });
            })({ request });
          }

          // 8. COMPRAR ADDON / HABILIDAD PREMIUM (REPARTO ECONÓMICO 85% PROVEEDOR / 15% PLATAFORMA)
          if (action === "marketplace-purchase") {
            return withSovereignAuth("system", "write", async (context) => {
              const purchaseSchema = z.object({
                skillId: z.string().min(1),
              });

              const parsed = purchaseSchema.safeParse(body);
              if (!parsed.success) {
                return new Response(JSON.stringify({ error: "Parámetros de compra inválidos." }), {
                  status: 400,
                  headers,
                });
              }

              const db = SovereignDB.load();
              const customListings =
                (db.settings.marketplaceListings as MarketplaceListing[]) || [];
              const allListings = [...DEFAULT_MARKETPLACE_LISTINGS, ...customListings];
              const listing = allListings.find((l) => l.skillId === parsed.data.skillId);

              if (!listing) {
                return new Response(
                  JSON.stringify({ error: "Anuncio de marketplace no encontrado." }),
                  {
                    status: 404,
                    headers,
                  },
                );
              }

              const tenant = SovereignDB.getTenant(context.tenantId);
              const costUSD = listing.costCents / 100;

              if (!tenant || tenant.quotaBalance < costUSD) {
                return new Response(
                  JSON.stringify({
                    error: "Saldo insuficiente.",
                    quotaBalance: tenant?.quotaBalance ?? 0,
                    required: costUSD,
                  }),
                  { status: 400, headers },
                );
              }

              // REPARTO DE INGRESOS (85% para el owner del skill, 15% para la plataforma de infraestructura)
              const platformFeeCents = Math.round(listing.costCents * 0.15);
              const userNetCents = listing.costCents - platformFeeCents;

              // Descontar saldo al comprador
              tenant.quotaBalance -= costUSD;
              SovereignDB.upsertTenant(tenant);

              // Acreditar saldo madurado al vendedor (owner del skill)
              const ownerAccount = SovereignDB.getMonetizationAccount(listing.ownerId);
              SovereignDB.updateMonetizationAccount(listing.ownerId, {
                earnedBalanceCents: ownerAccount.earnedBalanceCents + userNetCents,
                approvedContributions: ownerAccount.approvedContributions + 1,
              });

              // Registrar transacción en el Ledger (BookPI)
              const block = SovereignDB.appendLedgerBlock(
                context.tenantId,
                context.userId,
                `MARKETPLACE_PURCHASE: Compra del skill '${listing.title}' por $${costUSD.toFixed(2)} USD (Reparto: Vendedor +$${(userNetCents / 100).toFixed(2)}, Plataforma +$${(platformFeeCents / 100).toFixed(2)})`,
                "skills",
                costUSD,
                0,
              );

              SovereignDB.appendAuditLog(
                `trc_market_pur_${block.index}`,
                context.correlationId,
                context.ip,
                "Compra en Marketplace Consumada",
                "S3",
                `El usuario ${context.userId} adquirió '${listing.title}'. El vendedor ${listing.ownerId} recibió un crédito de $${(userNetCents / 100).toFixed(2)} USD`,
              );

              return new Response(
                JSON.stringify({
                  success: true,
                  blockIndex: block.index,
                  costUSD,
                  sellerEarnedBalanceCents: userNetCents,
                  buyerRemainingCredits: tenant.quotaBalance,
                }),
                { headers },
              );
            })({ request });
          }

          return new Response(
            JSON.stringify({ error: "Acción POST de facturación desconocida." }),
            {
              status: 400,
              headers,
            },
          );
        } catch (e: unknown) {
          const internalId = nodeCrypto.randomUUID().slice(0, 8);
          console.error(`[api/billing:${internalId}]`, e);
          return new Response(
            JSON.stringify({
              error: "internal_error",
              traceId: `trc_${internalId}`,
              message:
                e instanceof Error ? e.message : "Error desconocido de backend de facturación.",
            }),
            { status: 500, headers },
          );
        }
      },
    },
  },
});
