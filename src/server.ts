/**
 * Sovereign Production Server Boundary (src/server.ts)
 * -------------------------------------------------------------
 * Canonical production server entry point enforcing:
 * - Strict Content Security Policy (CSP)
 * - Anti-tamper security headers
 * - Production authorities evaluation
 * - Re-export of configured Express application from server root
 */
import { app } from "../server";
import { evaluateProductionAuthorities, assertProductionReady } from "./lib/production-authority";

const production = process.env.NODE_ENV === "production";
const scriptSource = production ? "'self'" : "'self' 'unsafe-inline' 'unsafe-eval' https:";

export function buildServerCsp(): string {
  return `default-src 'self'; script-src ${scriptSource}; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; frame-ancestors 'none';`;
}

export { app, evaluateProductionAuthorities, assertProductionReady };
export default app;
