import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SovereignDB, COGNITIVE_HEADS, UserRole } from "@/lib/sovereign-engine";
import { SecuritySystem } from "@/lib/security";
import { PrincipalContext } from "@/lib/principal-context";
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

        const headers = SecuritySystem.injectSecureHeaders(
          new Headers({ "content-type": "application/json" }),
        );

        // 1. Authorize via secure PrincipalContext middleware
        const authResult = PrincipalContext.authorize(request);
        if (!authResult.success) {
          return authResult.response;
        }

        const { context } = authResult;

        // 2. Route secure requests
        if (action === "session") {
          // Return verified principal details from PrincipalContext, ensuring zero headers spoofing!
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
        }

        if (action === "ledger") {
          // RBAC: Guest role cannot read ledger directly
          if (context.role === "Guest") {
            return new Response(
              JSON.stringify({
                error: "Privilegios insuficientes (RBAC) para ver el Libro Mayor.",
              }),
              { status: 403, headers },
            );
          }

          // Strict Tenant Isolation: Query ledger derived strictly from verified context
          const ledger = SovereignDB.getLedger(context.tenantId);
          return new Response(JSON.stringify({ ledger }), { headers });
        }

        if (action === "verify-ledger") {
          // RBAC: Only SovereignOwner and Auditor can run forensic audits
          if (context.role !== "SovereignOwner" && context.role !== "Auditor") {
            return new Response(
              JSON.stringify({
                error:
                  "Privilegios insuficientes (RBAC) para realizar auditoría forense del Ledger.",
              }),
              { status: 403, headers },
            );
          }

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
        }

        if (action === "verify-audit-chain") {
          // RBAC: Only SovereignOwner and Auditor can verify audit chain
          if (context.role !== "SovereignOwner" && context.role !== "Auditor") {
            return new Response(
              JSON.stringify({
                error: "Privilegios insuficientes (RBAC) para verificar la cadena de auditoría.",
              }),
              { status: 403, headers },
            );
          }

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
        }

        if (action === "test") {
          // RBAC: Only SovereignOwner and Auditor can trigger system testing
          if (context.role !== "SovereignOwner" && context.role !== "Auditor") {
            return new Response(
              JSON.stringify({
                error:
                  "Privilegios insuficientes (RBAC) para ejecutar pruebas automatizadas del sistema.",
              }),
              { status: 403, headers },
            );
          }

          const { runSecurityTestSuite } = await import("../../tests/security.test");
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
        }

        if (action === "audit") {
          // RBAC: Only SovereignOwner and Auditor can inspect audit logs
          if (context.role !== "SovereignOwner" && context.role !== "Auditor") {
            return new Response(
              JSON.stringify({
                error: "Privilegios insuficientes (RBAC) para leer registros de auditoría.",
              }),
              { status: 403, headers },
            );
          }
          const auditLogs = SovereignDB.getAuditLogs();
          return new Response(JSON.stringify({ auditLogs }), { headers });
        }

        if (action === "heads") {
          return new Response(JSON.stringify({ heads: COGNITIVE_HEADS }), { headers });
        }

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
          const body = await request.json();

          // 1. OIDC Identity Exchange Handshake (Requires NO Token)
          if (action === "authenticate") {
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

          // 2. For all other write endpoints, strictly require verified PrincipalContext middleware
          const authResult = PrincipalContext.authorize(request);
          if (!authResult.success) {
            return authResult.response;
          }

          const { context } = authResult;

          if (action === "ledger-add") {
            // RBAC: Only SovereignOwner and Operator roles can write to the ledger
            if (context.role === "Guest" || context.role === "Auditor") {
              return new Response(
                JSON.stringify({
                  error: "Denegado por RBAC: Sin permisos de escritura en Libro Mayor.",
                }),
                { status: 403, headers },
              );
            }

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
          }

          if (action === "ledger-refund") {
            // RBAC: Only SovereignOwner can refund ledger costs
            if (context.role !== "SovereignOwner") {
              return new Response(
                JSON.stringify({
                  error: "Denegado por RBAC: Reembolsos exclusivos del Sovereign Owner.",
                }),
                { status: 403, headers },
              );
            }

            const { index } = body;
            if (typeof index !== "number") {
              return new Response(JSON.stringify({ error: "Índice del bloque requerido." }), {
                status: 400,
                headers,
              });
            }

            const res = SovereignDB.refundLedgerBlock(index, context.tenantId);
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
          }

          if (action === "execute-tool") {
            // Sandbox Execution
            if (context.role === "Guest") {
              return new Response(
                JSON.stringify({
                  error: "Denegado por RBAC: Invitados no pueden ejecutar herramientas.",
                }),
                { status: 403, headers },
              );
            }

            const val = executeToolSchema.safeParse(body);
            if (!val.success) {
              return new Response(
                JSON.stringify({ error: "Fórmula matemática o parámetros corruptos." }),
                { status: 400, headers },
              );
            }

            let result;
            if (val.data.useWasmSim) {
              // Standard secure sandbox task execution via containerized / WASM Service
              const sandbox = new SovereignSandboxService(context.traceId);
              await sandbox.provisionInstance(context.traceId);
              result = await sandbox.executeTask(
                ["wasm-process", "math-expr"],
                { TENANT_ID: context.tenantId },
                JSON.stringify({ formula: val.data.expression, vars: val.data.variables || {} }),
              );
              await sandbox.deprovisionInstance();
            } else {
              // Evaluate lexically whitelisted math expression
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
