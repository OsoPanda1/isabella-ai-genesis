import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { createRequestContext, withRequestContext } from "./lib/request-context";
import { redact } from "./lib/secret-redactor";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then((m) => (m.default ?? m) as ServerEntry);
  }
  return serverEntryPromise;
}

export async function handleRequest(request: Request, env: unknown = {}, ctx: unknown = {}): Promise<Response> {
  const url = new URL(request.url);
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const requestContext = createRequestContext({
    clientIp: forwarded || request.headers.get("x-real-ip") || undefined,
    method: request.method,
    path: url.pathname,
  });

  return withRequestContext(requestContext, async () => {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      const captured = consumeLastCapturedError();
      const err = captured ?? error;
      console.error(redact(err instanceof Error ? (err.stack ?? err.message) : String(err)));
      return withSecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
        }),
      );
    }
  });
}

export default { fetch: handleRequest };

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;
  const err = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  console.error(redact(err instanceof Error ? (err.stack ?? err.message) : String(err)));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  const setIfMissing = (name: string, value: string) => {
    if (!headers.has(name)) headers.set(name, value);
  };
  setIfMissing("X-Content-Type-Options", "nosniff");
  setIfMissing("X-Frame-Options", "DENY");
  setIfMissing("Referrer-Policy", "strict-origin-when-cross-origin");
  setIfMissing("X-XSS-Protection", "0");
  setIfMissing("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  setIfMissing("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  setIfMissing("Cross-Origin-Opener-Policy", "same-origin");
  setIfMissing("Cross-Origin-Resource-Policy", "same-origin");

  // Production contract: production = process.env.NODE_ENV === "production" (Vite-safe equivalent below).
  const production = import.meta.env.PROD;
  // Production enforces the policy. Development keeps the less restrictive
  // policy so local framework tooling can run without a framework nonce.
  const scriptSource = production ? "'self'" : "'self' 'unsafe-inline'";
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSource}`,
    "worker-src 'self' blob:",
  ].join("; ");
  setIfMissing("Content-Security-Policy", csp);
  const reportOnlyCsp = csp
    .replace(`script-src ${scriptSource}`, "script-src 'self' 'nonce-{REQUEST_NONCE}'")
    .replaceAll(" 'unsafe-inline'", "")
    .replaceAll("'unsafe-inline' ", "");
  setIfMissing("Content-Security-Policy-Report-Only", reportOnlyCsp);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
