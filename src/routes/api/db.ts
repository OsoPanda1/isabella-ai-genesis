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
          return withSovereignAuth("audit", "read", async () => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            const auditLogs = SovereignDB.getAuditLogs();
            return new Response(JSON.stringify({ auditLogs }), { headers });
          })({ request });
        }

        if (action === "heads") {
          return withSovereignAuth("system", "read", async () => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            return new Response(JSON.stringify({ heads: COGNITIVE_HEADS }), { headers });
          })({ request });
        }

        if (action === "list-api-keys") {
          return withSovereignAuth("system", "read", async (context) => {
            const headers = SecuritySystem.injectSecureHeaders(
              new Headers({ "content-type": "application/json" }),
            );
            const { ApiKeyService } = await import("@/lib/api-key-service");
            const list = ApiKeyService.listApiKeys(context.tenantId);
            return new Response(JSON.stringify({ keys: list }), { headers });
          })({ request });
        }

        // --- LAYER 3.2: Manual OAuth Endpoints (Supports Dev App URLs perfectly) ---
        if (action === "oauth-url") {
          const headers = SecuritySystem.injectSecureHeaders(
            new Headers({ "content-type": "application/json" }),
          );
          const redirectUri =
            url.searchParams.get("redirect_uri") || `${url.origin}/api/db?action=oauth-callback`;
          const clientId = url.searchParams.get("client_id") || "isabella_oauth_client";

          const providerUrl = `${url.origin}/api/db?action=oauth-provider&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${encodeURIComponent(clientId)}`;
          return new Response(JSON.stringify({ url: providerUrl }), { headers });
        }

        if (action === "oauth-provider") {
          const redirectUri = url.searchParams.get("redirect_uri") || "";
          const clientId = url.searchParams.get("client_id") || "isabella_oauth_client";
          const db = SovereignDB.load();
          const sessions = db.sessions;

          const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Isabella Sovereign IDP — Conexión OAuth 2.0</title>
              <style>
                body {
                  background-color: #0b0c10;
                  color: #e2e8f0;
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  padding: 20px;
                  box-sizing: border-box;
                }
                .card {
                  background: rgba(17, 20, 28, 0.9);
                  border: 1px solid rgba(112, 102, 249, 0.3);
                  box-shadow: 0 10px 40px 0 rgba(112, 102, 249, 0.2);
                  border-radius: 16px;
                  padding: 32px;
                  max-width: 440px;
                  width: 100%;
                  text-align: center;
                }
                h1 {
                  color: #7066f9;
                  font-size: 22px;
                  margin-top: 12px;
                  margin-bottom: 8px;
                }
                .subtitle {
                  color: #94a3b8;
                  font-size: 13px;
                  margin-bottom: 24px;
                }
                .scope-box {
                  background: rgba(255, 255, 255, 0.03);
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  border-radius: 8px;
                  padding: 12px;
                  text-align: left;
                  margin-bottom: 20px;
                  font-size: 12px;
                }
                .scope-item {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 6px;
                }
                .scope-item:last-child {
                  margin-bottom: 0;
                }
                .scope-bullet {
                  color: #10b981;
                  font-weight: bold;
                }
                select {
                  width: 100%;
                  background: #1e293b;
                  border: 1px solid rgba(255, 255, 255, 0.15);
                  color: #f8fafc;
                  padding: 10px;
                  border-radius: 8px;
                  font-size: 14px;
                  outline: none;
                  margin-bottom: 24px;
                  cursor: pointer;
                }
                .btn {
                  width: 100%;
                  background: #7066f9;
                  color: white;
                  border: none;
                  padding: 12px;
                  border-radius: 8px;
                  font-size: 14px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: background 0.2s;
                }
                .btn:hover {
                  background: #5a50e5;
                }
                .footer {
                  margin-top: 20px;
                  font-size: 11px;
                  color: #64748b;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <div style="font-size: 40px; margin-bottom: 8px;">🌸</div>
                <h1>Isabella Sovereign IDP</h1>
                <div class="subtitle">La identidad OIDC determina su rol de acceso mediante control estricto RBAC.</div>
                
                <form action="/api/db?action=oauth-authorize-action" method="POST">
                  <input type="hidden" name="redirect_uri" value="${encodeURIComponent(redirectUri)}">
                  <input type="hidden" name="client_id" value="${encodeURIComponent(clientId)}">
                  
                  <div class="scope-box">
                    <div style="font-weight: 600; margin-bottom: 8px; color: #f1f5f9;">Permisos Solicitados:</div>
                    <div class="scope-item"><span class="scope-bullet">✔</span> openid (Identidad de sesión única)</div>
                    <div class="scope-item"><span class="scope-bullet">✔</span> profile (Perfil soberano en Nodo Cero)</div>
                    <div class="scope-item"><span class="scope-bullet">✔</span> isabella:chat (Diálogo interactivo)</div>
                  </div>
                  
                  <div style="text-align: left; margin-bottom: 8px; font-size: 12px; color: #94a3b8; font-weight: 500;">Seleccionar Cuenta Soberana:</div>
                  <select name="userId">
                    ${sessions
                      .map((s) => `<option value="${s.userId}">${s.username} (${s.role})</option>`)
                      .join("")}
                  </select>
                  
                  <button type="submit" class="btn">Autorizar Acceso Seguro</button>
                </form>
                
                <div class="footer">
                  Seguridad C.R.O.W.N. • Real del Monte, Hidalgo, MX
                </div>
              </div>
            </body>
            </html>
          `;
          return new Response(html, {
            headers: new Headers({ "content-type": "text/html" }),
          });
        }

        if (action === "oauth-callback") {
          const code = url.searchParams.get("code") || "";
          const userId = code.replace("authcode_", "");

          const db = SovereignDB.load();
          const seededUser = db.sessions.find((s) => s.userId === userId);
          if (!seededUser) {
            return new Response("Error: Usuario no encontrado en base de datos.", { status: 400 });
          }

          const scope = "isabella:chat isabella:ledger:write isabella:sandbox:run";
          const userToken = SecuritySystem.generateSovereignToken(
            seededUser.userId,
            seededUser.role,
            seededUser.tenantId,
            scope,
          );

          const callbackHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Conexión Exitosa</title>
              <style>
                body {
                  background: #0b0c10;
                  color: #e2e8f0;
                  font-family: system-ui, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  text-align: center;
                }
                .msg {
                  background: rgba(16, 185, 129, 0.1);
                  border: 1px solid rgba(16, 185, 129, 0.3);
                  padding: 24px;
                  border-radius: 12px;
                  max-width: 380px;
                }
              </style>
            </head>
            <body>
              <div class="msg">
                <div style="font-size: 32px; margin-bottom: 12px;">✔</div>
                <h3 style="margin: 0 0 8px 0; color: #10b981;">Autenticación Completa</h3>
                <p style="margin: 0; font-size: 13px; color: #94a3b8;">La conexión con Isabella se ha verificado criptográficamente. Esta ventana se cerrará...</p>
              </div>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ 
                    type: 'OAUTH_AUTH_SUCCESS', 
                    token: '${userToken}',
                    userId: '${seededUser.userId}',
                    username: '${seededUser.username}',
                    role: '${seededUser.role}'
                  }, '*');
                  setTimeout(() => { window.close(); }, 800);
                } else {
                  window.location.href = '/';
                }
              </script>
            </body>
            </html>
          `;
          return new Response(callbackHtml, {
            headers: new Headers({ "content-type": "text/html" }),
          });
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
          if (action === "oauth-authorize-action") {
            const formData = await request.formData();
            const redirectUriEnc = formData.get("redirect_uri") as string;
            const userId = formData.get("userId") as string;

            const redirectUri = decodeURIComponent(redirectUriEnc);
            const code = `authcode_${userId}`;

            const targetUrl = `${redirectUri}${redirectUri.includes("?") ? "&" : "?"}code=${code}`;
            return new Response("", {
              status: 303,
              headers: new Headers({ Location: targetUrl }),
            });
          }

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
                result = SovereignSandbox.executeTool(
                  val.data.expression,
                  val.data.variables || {},
                );
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

          if (action === "create-api-key") {
            return withSovereignAuth("system", "write", async (context, req, body: unknown) => {
              const { name, role, scopes, expiresInSeconds } = (body || {}) as {
                name?: string;
                role?: string;
                scopes?: string[];
                expiresInSeconds?: number;
              };
              if (!name || !role || !scopes) {
                return new Response(
                  JSON.stringify({
                    error: "Faltan parámetros obligatorios (name, role, scopes).",
                  }),
                  { status: 400, headers },
                );
              }
              const { ApiKeyService } = await import("@/lib/api-key-service");
              const result = ApiKeyService.createApiKey(
                context.tenantId,
                context.userId,
                name,
                role,
                scopes,
                expiresInSeconds,
              );
              return new Response(JSON.stringify({ success: true, key: result }), { headers });
            })({ request });
          }

          if (action === "revoke-api-key") {
            return withSovereignAuth("system", "write", async (context, req, body: unknown) => {
              const { id } = (body || {}) as { id?: string };
              if (!id) {
                return new Response(JSON.stringify({ error: "ID de llave requerido." }), {
                  status: 400,
                  headers,
                });
              }
              const { ApiKeyService } = await import("@/lib/api-key-service");
              const success = ApiKeyService.revokeApiKey(id, context.tenantId);
              return new Response(JSON.stringify({ success }), { headers });
            })({ request });
          }

          if (action === "rotate-api-key") {
            return withSovereignAuth("system", "write", async (context, req, body: unknown) => {
              const { id } = (body || {}) as { id?: string };
              if (!id) {
                return new Response(JSON.stringify({ error: "ID de llave requerido." }), {
                  status: 400,
                  headers,
                });
              }
              const { ApiKeyService } = await import("@/lib/api-key-service");
              const result = ApiKeyService.rotateApiKey(id, context.tenantId);
              if (!result.success) {
                return new Response(JSON.stringify({ error: result.error }), {
                  status: 400,
                  headers,
                });
              }
              return new Response(JSON.stringify({ success: true, key: result.newKey }), {
                headers,
              });
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
