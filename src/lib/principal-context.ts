import { SecuritySystem, TokenClaims } from "./security";
import { authorize, type AuthorizationRequest } from "./authorization";
import { type Resource, type Action } from "./permission-matrix";
import { type Role } from "./rbac";
import { ApiKeyAuthenticator } from "./api-key-authenticator";
import { repositoryFactory } from "./persistence/repository-factory";

export class PrincipalContext {
  public readonly userId: string;
  public readonly username: string;
  public readonly tenantId: string;
  public readonly role: Role;
  public readonly scope: string;
  public readonly ip: string;
  public readonly traceId: string;
  public readonly correlationId: string;
  public readonly tenant: { id: string; slug: string; tier: string; quotaBalance: number };

  private constructor(
    claims: TokenClaims,
    tenant: { id: string; slug: string; tier: string; quotaBalance: number },
    username: string,
    ip: string,
    traceId: string,
    correlationId: string,
  ) {
    this.userId = claims.sub;
    this.username = username;
    this.tenantId = claims.tenantId;
    this.role = claims.role as Role;
    this.scope = claims.scope;
    this.ip = ip;
    this.traceId = traceId;
    this.correlationId = correlationId;
    this.tenant = tenant;
  }

  public static async authorize(
    request: Request,
    requiredScope?: string,
  ): Promise<{ success: true; context: PrincipalContext } | { success: false; response: Response }> {
    const ip = SecuritySystem.resolveClientIp(request);
    const telemetry = SecuritySystem.generateTelemetry(ip, "allowed");
    const headers = SecuritySystem.injectSecureHeaders(
      new Headers({ "content-type": "application/json" }),
    );

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

    const hasApiKey =
      request.headers.has("x-isabella-api-key") || request.headers.has("X-Isabella-API-Key");
    if (hasApiKey) {
      const authResult = await ApiKeyAuthenticator.authenticate(request);
      if (!authResult.success) {
        return {
          success: false,
          response: new Response(
            JSON.stringify({
              error: `Acceso Denegado API Key: Credencial inválida, expirada o revocada (${authResult.error}).`,
              traceId: telemetry.traceId,
            }),
            { status: 401, headers },
          ),
        };
      }

      const principal = authResult.principal;
      const tenantRecord = await repositoryFactory.getTenantRepository().read(principal.tenantId, principal.tenantId);
      const tenant = tenantRecord
        ? { id: tenantRecord.id, slug: tenantRecord.slug, tier: tenantRecord.tier, quotaBalance: tenantRecord.quotaBalance }
        : { id: principal.tenantId, slug: "", tier: "free", quotaBalance: 0 };

      if (!tenantRecord) {
        return {
          success: false,
          response: new Response(
            JSON.stringify({
              error: "Aislamiento de Tenant Violado: El Tenant asignado a la API Key no está registrado.",
              traceId: telemetry.traceId,
            }),
            { status: 403, headers },
          ),
        };
      }

      if (requiredScope && !principal.scopes.includes(requiredScope)) {
        return {
          success: false,
          response: new Response(
            JSON.stringify({
              error: `Privilegios Insuficientes: Ámbito '${requiredScope}' requerido para esta API Key.`,
              traceId: telemetry.traceId,
            }),
            { status: 403, headers },
          ),
        };
      }

      const expMillis = principal.expiresAt
        ? new Date(principal.expiresAt).getTime()
        : Date.now() + 24 * 60 * 60 * 1000;

      const claims: TokenClaims = {
        iss: "isabella.sovereign.api-keys",
        sub: principal.subject,
        aud: principal.tenantId,
        exp: Math.floor(expMillis / 1000),
        tenantId: principal.tenantId,
        role: principal.role,
        scope: principal.scopes.join(" "),
      };

      const context = new PrincipalContext(
        claims,
        tenant,
        "api_key_session",
        ip,
        telemetry.traceId,
        telemetry.correlationId,
      );

      return { success: true, context };
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({
            error:
              "No Autorizado OIDC: Falta la firma criptográfica Bearer en la cabecera o la cabecera X-Isabella-API-Key.",
            traceId: telemetry.traceId,
          }),
          { status: 401, headers },
        ),
      };
    }

    const token = authHeader.replace("Bearer ", "");
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

    const tenantRecord = await repositoryFactory.getTenantRepository().read(claims.tenantId, claims.tenantId);
    const tenant = tenantRecord
      ? { id: tenantRecord.id, slug: tenantRecord.slug, tier: tenantRecord.tier, quotaBalance: tenantRecord.quotaBalance }
      : { id: claims.tenantId, slug: "", tier: "free", quotaBalance: 0 };

    if (!tenantRecord) {
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

    const { items: sessions } = await repositoryFactory.getSessionRepository().list(claims.sub, { userId: claims.sub });
    const session = sessions.find((s: { id: string }) => s.id === token || (s as unknown as Record<string, unknown>).id === token);
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
      (session as unknown as Record<string, unknown>).username as string ?? "",
      ip,
      telemetry.traceId,
      telemetry.correlationId,
    );

    return { success: true, context };
  }
}

export function withSovereignAuth(
  resource: Resource,
  action: Action,
  handler: (context: PrincipalContext, request: Request, body?: unknown) => Promise<Response>,
) {
  return async ({ request }: { request: Request }): Promise<Response> => {
    const requiredScope = resource === "system" && action === "execute" ? "isabella:chat" : undefined;
    const authResult = await PrincipalContext.authorize(request, requiredScope);
    if (!authResult.success) {
      return authResult.response;
    }

    const { context } = authResult;

    const authReq: AuthorizationRequest = {
      identity: {
        subject: context.userId,
        username: context.username,
        tenantId: context.tenantId,
        role: context.role,
        scopes: context.scope ? context.scope.split(" ") : [],
        authenticated: true,
      },
      resource,
      action,
      tenant: {
        context: {
          subject: context.userId,
          username: context.username,
          tenantId: context.tenantId,
          resolvedBy: "bearer",
          authenticated: true,
          resolvedAt: new Date().toISOString(),
        },
        boundaryOk: true,
        reason: "ok",
      },
    };

    const decisionResult = authorize(authReq);
    if (decisionResult.decision === "denied") {
      const headers = SecuritySystem.injectSecureHeaders(
        new Headers({ "content-type": "application/json" }),
      );
      return new Response(
        JSON.stringify({
          error: `Acceso Denegado por Política Centralizada: Privilegios insuficientes para la operación (${resource}:${action}).`,
          reasons: decisionResult.reasons,
          traceId: context.traceId,
        }),
        { status: 403, headers },
      );
    }

    let body: unknown = null;
    if (request.method === "POST" || request.method === "PUT") {
      try {
        const cloned = request.clone();
        body = await cloned.json();
      } catch {
        // Ignore parsing error, handler can handle it
      }
    }

    return handler(context, request, body);
  };
}
