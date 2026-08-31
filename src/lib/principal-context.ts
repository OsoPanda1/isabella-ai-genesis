import { SecuritySystem, TokenClaims } from "./security";
import { SovereignDB, UserRole, Tenant } from "./sovereign-engine";

export class PrincipalContext {
  public readonly userId: string;
  public readonly username: string;
  public readonly tenantId: string;
  public readonly role: UserRole;
  public readonly scope: string;
  public readonly ip: string;
  public readonly traceId: string;
  public readonly correlationId: string;
  public readonly tenant: Tenant;

  private constructor(
    claims: TokenClaims,
    tenant: Tenant,
    username: string,
    ip: string,
    traceId: string,
    correlationId: string,
  ) {
    this.userId = claims.sub;
    this.username = username;
    this.tenantId = claims.tenantId;
    this.role = claims.role as UserRole;
    this.scope = claims.scope;
    this.ip = ip;
    this.traceId = traceId;
    this.correlationId = correlationId;
    this.tenant = tenant;
  }

  /**
   * Safe middleware gate. Extracts and validates OIDC token strictly.
   * Leverages 7-layer security system to construct an authorized context.
   */
  public static authorize(
    request: Request,
    requiredScope?: string,
  ): { success: true; context: PrincipalContext } | { success: false; response: Response } {
    const ip = SecuritySystem.resolveClientIp(request);
    const telemetry = SecuritySystem.generateTelemetry(ip, "allowed");
    const headers = SecuritySystem.injectSecureHeaders(
      new Headers({ "content-type": "application/json" }),
    );

    // Rate Limiting Gate
    const limitCheck = SecuritySystem.checkRateLimit(ip);
    if (!limitCheck.allowed) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({
            error: "SovereignGate Rate-Limit: Demasiadas solicitudes desde esta IP de origen.",
            traceId: telemetry.traceId,
          }),
          { status: 429, headers },
        ),
      };
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({
            error: "No Autorizado OIDC: Falta la firma criptográfica Bearer en la cabecera.",
            traceId: telemetry.traceId,
          }),
          { status: 401, headers },
        ),
      };
    }

    const token = authHeader.replace("Bearer ", "");

    // JWT signature validation (Strict verification against server-side keys)
    const verification = SecuritySystem.verifyToken(token);
    if (!verification.success || !verification.claims) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({
            error: `Acceso Denegado: Credencial corrupta o adulterada. ${verification.error || ""}`,
            traceId: telemetry.traceId,
          }),
          { status: 401, headers },
        ),
      };
    }

    const claims = verification.claims;

    // Strict Scope verification if specified
    if (requiredScope) {
      const scopeCheck = SecuritySystem.verifyApiScope(token, requiredScope);
      if (!scopeCheck.allowed) {
        return {
          success: false,
          response: new Response(
            JSON.stringify({
              error: `Privilegios Insuficientes: Ámbito '${requiredScope}' requerido en el OIDC token.`,
              traceId: telemetry.traceId,
            }),
            { status: 403, headers },
          ),
        };
      }
    }

    // Load matching tenant, enforcing strict Isolation boundary
    const tenant = SovereignDB.getTenant(claims.tenantId);
    if (!tenant) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({
            error: "Aislamiento de Tenant Violado: El Tenant asignado al token no está registrado.",
            traceId: telemetry.traceId,
          }),
          { status: 403, headers },
        ),
      };
    }

    // Verify session still exists on the server memory pool
    const session = SovereignDB.getSessionByToken(token);
    if (!session) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({
            error:
              "Acceso Denegado: La sesión asociada al token ya no se encuentra activa en el nodo.",
            traceId: telemetry.traceId,
          }),
          { status: 401, headers },
        ),
      };
    }

    const context = new PrincipalContext(
      claims,
      tenant,
      session.username,
      ip,
      telemetry.traceId,
      telemetry.correlationId,
    );

    return { success: true, context };
  }
}
