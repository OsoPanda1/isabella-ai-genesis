#!/usr/bin/env node
const input = process.argv[2] ?? process.env.PRODUCTION_SMOKE_URL;
if (!input) { console.error("Uso: node scripts/production-smoke.mjs <https://host> o PRODUCTION_SMOKE_URL."); process.exit(2); }
const base = new URL(input);
const checks = [{ path: "/", expected: "2xx" }, { path: "/api/health/ready", expected: "2xx" }];
const results = [];
for (const check of checks) {
  const url = new URL(check.path, base);
  const started = performance.now();
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow", headers: { accept: "application/json,text/html;q=0.9,*/*;q=0.8", "cache-control": "no-cache", "x-isabella-production-smoke": "1" }, signal: AbortSignal.timeout(20000) });
    const elapsedMs = Number((performance.now() - started).toFixed(1));
    const body = await response.text();
    let parsed = null; try { parsed = JSON.parse(body); } catch {}
    const pass = response.status >= 200 && response.status < 300;
    results.push({ path: check.path, status: response.status, elapsedMs, pass, body: parsed ?? body.slice(0, 300) });
    if (!pass) { console.error(JSON.stringify(results.at(-1), null, 2)); process.exit(1); }
  } catch (error) {
    results.push({ path: check.path, pass: false, error: error instanceof Error ? error.message : String(error) });
    console.error(JSON.stringify(results.at(-1), null, 2)); process.exit(1);
  }
}
console.log(JSON.stringify({ schema: "isabella.production-smoke.v1", baseUrl: base.origin, completedAt: new Date().toISOString(), status: "PASS", checks: results }, null, 2));