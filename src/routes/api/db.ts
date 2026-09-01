import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SovereignDB, COGNITIVE_HEADS } from "@/lib/sovereign-engine";
import { SecuritySystem } from "@/lib/security";
import { withSovereignAuth } from "@/lib/principal-context";
import { SovereignSandboxService } from "@/lib/sovereign-sandbox";

const addLedgerSchema = z.object({
  operation: z.string().min(1).max(200),
  category: z.enum(["inference", "processing", "apis", "skills", "other"]),
  cost: z.number().min(0).max(1000),
  tokens: z.number().nonnegative().default(0),
});

const executeToolSchema = z.object({
  expression: z.string().min(1).max(1000),
  variables: z.record(z.unknown()).optional(),
  useWasmSim: z.boolean().optional().default(false),
});

export const Route = createFileRoute("/api/db")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action") || "session";

        if (action === "session") {
          return withSovereignAuth("system", "read", async (context) => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            return new Response(
              JSON.stringify({
                session: {
                  userId: context.userId,
                  username: context.username,
                  tenantId: context.tenantId,
                  role: context.role,
                  oidcSub: `sub_oidc_${context.userId}`,
                },
                tenant: context.tenant,
              }),
              { headers },
            );
          })({ request });
        }

        if (action === "ledger") {
          return withSovereignAuth("ledger", "read", async (context) => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            const ledger = SovereignDB.getLedger(context.tenantId);
            return new Response(JSON.stringify({ ledger }), { headers });
          })({ request });
        }

        if (action === "verify-ledger") {
          return withSovereignAuth("ledger", "verify", async (context) => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            const result = SovereignDB.verifyLedgerIntegrity();
            if (result.success) {
              SovereignDB.appendAuditLog(
                context.traceId,
                context.correlationId,
                context.ip,
                "Auditoría Forense del Ledger Exitosa",
                "S3",
                "Integridad del libro de transacciones validada con éxito.",
              );
            } else {
              SovereignDB.appendAuditLog(
                `trc_ledger_corrupt_${result.corruptedIndex}`,
                context.correlationId,
                context.ip,
                "¡BRECHA DE SEGURIDAD DETECTADA EN LEDGER!",
                "S0",
                `Fallo de integridad en Ledger: ${result.error}`,
              );
            }
            return new Response(JSON.stringify(result), { headers });
          })({ request });
        }

        if (action === "verify-audit-chain") {
          return withSovereignAuth("audit", "verify", async (context) => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            const result = SovereignDB.verifyAuditChain();
            if (result.success) {
              SovereignDB.appendAuditLog(
                context.traceId,
                context.correlationId,
                context.ip,
                "Verificación de Cadena de Auditoría Exitosa",
                "S3",
                "La integridad criptográfica de la cadena de logs de auditoría (SHA-256) está intacta.",
              );
            } else {
              SovereignDB.appendAuditLog(
                `trc_audit_corrupt_${result.corruptedId || "unknown"}`,
                context.correlationId,
                context.ip,
                "¡INTEGRIDAD DE REGISTROS DE AUDITORÍA VIOLADA!",
                "S0",
                `Fallo en validación de cadena: ${result.error}`,
              );
            }
            return new Response(JSON.stringify(result), { headers });
          })({ request });
        }

        if (action === "test") {
          return withSovereignAuth("system", "execute", async (context) => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            const { runSecurityTestSuite } = await import("../../../test/security/security-runner");
            const testResults = runSecurityTestSuite();

            if (testResults.success) {
              SovereignDB.appendAuditLog(
                context.traceId,
                context.correlationId,
                context.ip,
                "Auditoría de Sistemas Automatizada Exitosa",
                "S3",
                `Paso exitoso de todas las pruebas automatizadas del criptosistema (${testResults.results.length} de ${testResults.results.length} aprobadas).`,
              );
            } else {
              SovereignDB.appendAuditLog(
                context.traceId,
                context.correlationId,
                context.ip,
                "CRITICAL: Fallo en Auditoría de Sistemas",
                "S0",
                "Las pruebas del criptosistema de seguridad han fallado.",
              );
            }

            return new Response(JSON.stringify(testResults), { headers });
          })({ request });
        }

        if (action === "audit") {
          return withSovereignAuth("audit", "read", async (context) => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            const auditLogs = SovereignDB.getAuditLogs();
            return new Response(JSON.stringify({ auditLogs }), { headers });
          })({ request });
        }

        if (action === "heads") {
          return withSovereignAuth("system", "read", async (context) => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            return new Response(JSON.stringify({ heads: COGNITIVE_HEADS }), { headers });
          })({ request });
        }

        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json" }),
        );
        return new Response(JSON.stringify({ error: "Acción desconocida." }), {
          status: 400,
          headers,
        });
      },

      POST: async ({ request }) => {
        const ip = SecuritySystem.resolveClientIp(request);
        const url = new URL(request.url);
        const action = url.searchParams.get("action");
        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json" }),
        );

        try {
          // 1. OIDC Identity Exchange Handshake (Requires NO Token)
          if (action === "authenticate") {
            const body = await request.json();
            const { userId } = body;
            const db = SovereignDB.load();
            const seededUser = db.sessions.find((s) => s.userId === userId);
            if (!seededUser) {
              return new Response(
                JSON.stringify({
                  error: "Identidad OIDC no registrada en la whitelist de Isabella.",
                }),
                { status: 404, headers },
              );
            }

            const scope = "isabella:chat isabella:ledger:write isabella:sandbox:run";
            const userToken = SecuritySystem.generateSovereignToken(
              seededUser.userId,
              seededUser.role,
              seededUser.tenantId,
              scope,
            );

            SovereignDB.appendAuditLog(
              "trc_oidc_auth",
              "cor_oidc_auth",
              ip,
              "Autenticación OIDC Exitosa",
              "S3",
              `Emitido token criptográfico seguro para el usuario ${seededUser.username} (${seededUser.role})`,
            );

            return new Response(JSON.stringify({ success: true, token: userToken }), { headers });
          }

          // 2. Enforce verified centralized Authorization Wrapper for ledger & tool execution actions
          if (action === "ledger-add") {
            return withSovereignAuth("ledger", "write", async (context, req, body) => {
              const val = addLedgerSchema.safeParse(body);
              if (!val.success) {
                return new Response(
                  JSON.stringify({ error: "Esquema inválido para transacciones." }),
                  { status: 400, headers },
                );
              }

              const block = SovereignDB.appendLedgerBlock(
                context.tenantId,
                context.userId,
                val.data.operation,
                val.data.category,
                val.data.cost,
                val.data.tokens,
              );

              SovereignDB.appendAuditLog(
                `trc_tx_${block.index}`,
                context.correlationId,
                context.ip,
                "Transacción Ledger Registrada",
                "S3",
                `Costo: $${block.costDecimal} debitado para el tenant aislado ${context.tenantId}`,
              );

              return new Response(JSON.stringify({ success: true, block }), { headers });
            })({ request });
          }

          if (action === "ledger-refund") {
            return withSovereignAuth("ledger", "admin", async (context, req, body) => {
              const { index } = body || {};
              if (typeof index !== "number") {
                return new Response(JSON.stringify({ error: "Índice del bloque requerido." }), {
                  status: 400,
                  headers,
                });
              }

              const res = SovereignDB.appendRefundEvent(index, context.tenantId);
              if (!res.success) {
                return new Response(JSON.stringify({ error: res.error }), { status: 400, headers });
              }

              SovereignDB.appendAuditLog(
                `trc_rf_${index}`,
                context.correlationId,
                context.ip,
                "Reembolso Ledger Procesado",
                "S2",
                `Transacción index ${index} reembolsada para ${context.tenantId}`,
              );

              return new Response(JSON.stringify({ success: true }), { headers });
            })({ request });
          }

          if (action === "execute-tool") {
            return withSovereignAuth("sandbox", "execute", async (context, req, body) => {
              const val = executeToolSchema.safeParse(body);
              if (!val.success) {
                return new Response(
                  JSON.stringify({ error: "Fórmula matemática o parámetros corruptos." }),
                  { status: 400, headers },
                );
              }

              let result;
              if (val.data.useWasmSim) {
                const sandbox = new SovereignSandboxService(context.traceId);
                await sandbox.provisionInstance(context.traceId);
                result = await sandbox.executeTask(
                  ["wasm-process", "math-expr"],
                  { TENANT_ID: context.tenantId },
                  JSON.stringify({ formula: val.data.expression, vars: val.data.variables || {} }),
                );
                await sandbox.deprovisionInstance();
              } else {
                const { SovereignSandbox } = await import("@/lib/sovereign-engine");
                result = SovereignSandbox.executeTool(val.data.expression, val.data.variables || {});
              }

              SovereignDB.appendAuditLog(
                context.traceId,
                context.correlationId,
                context.ip,
                "Herramienta Ejecutada en Sandbox",
                result.success ? "S3" : "S1",
                `Fórmula: [${val.data.expression}]. Simulación WASM: ${val.data.useWasmSim ? "Habilitada" : "Deshabilitada"}.`,
              );

              return new Response(JSON.stringify(result), { headers });
            })({ request });
          }

          return new Response(JSON.stringify({ error: "Acción de escritura desconocida." }), {
            status: 400,
            headers,
          });
        } catch (e: unknown) {
          const errMessage =
            e instanceof Error ? e.message : "Error en el pipeline transaccional de base de datos.";
          return new Response(JSON.stringify({ error: errMessage }), { status: 500, headers });
        }
      },
    },
  },
});
