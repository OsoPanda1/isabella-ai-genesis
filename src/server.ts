import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { createRequestContext, withRequestContext, getRequestContext } from "./lib/request-context";
import { redact } from "./lib/secret-redactor";
import { assertBodyWithinLimits, LimitError } from "./lib/input-limits";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;
const publicDemoRate = new Map<string, { started: number; count: number }>();

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function publicHeaders(contentType = "text/html; charset=utf-8"): Headers {
  return new Headers({
    "content-type": contentType,
    "cache-control": "no-store",
    "x-isabella-public-gateway": "active",
  });
}

function publicShellHtml(): string {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Isabella — FGAIS</title><meta name="description" content="Isabella Villaseñor AI — interfaz cognitiva federada y gobernada"><style>
  :root{color-scheme:dark;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#05060b;color:#f5f7ff}body:before{content:"";position:fixed;inset:0;background:radial-gradient(circle at 50% 10%,rgba(123,88,255,.20),transparent 32%),radial-gradient(circle at 10% 90%,rgba(28,197,255,.10),transparent 28%);pointer-events:none}.wrap{position:relative;min-height:100vh;max-width:1180px;margin:auto;padding:28px}.top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}.brand{display:flex;align-items:center;gap:13px}.orb{width:44px;height:44px;border-radius:15px;background:radial-gradient(circle at 35% 25%,#fff,#b8a6ff 24%,#5a3bb8 50%,#0b0d18 75%);box-shadow:0 0 42px rgba(119,89,255,.4)}.eyebrow{font:10px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.22em;text-transform:uppercase;color:#8d96aa}.title{font-size:20px;font-weight:700}.status{display:flex;align-items:center;gap:8px;font:10px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase;color:#94a3b8}.dot{width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 16px #34d399}.grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:18px}.card{border:1px solid rgba(148,163,184,.16);background:rgba(255,255,255,.035);backdrop-filter:blur(18px);border-radius:24px;box-shadow:0 24px 80px rgba(0,0,0,.25)}.hero{padding:30px}.hero h1{font-size:clamp(42px,8vw,78px);line-height:.95;margin:0 0 14px;letter-spacing:-.05em}.hero p{color:#9ba5b8;line-height:1.7;max-width:720px}.pillbar{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}.pill{padding:8px 11px;border-radius:999px;border:1px solid rgba(148,163,184,.14);color:#aeb7c8;font:10px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase}.chat{display:flex;flex-direction:column;min-height:580px;overflow:hidden}.messages{flex:1;min-height:390px;max-height:600px;overflow:auto;padding:22px}.msg{max-width:82%;padding:13px 15px;border-radius:16px;margin:0 0 12px;white-space:pre-wrap;line-height:1.55;font-size:14px}.msg.sys{margin:0 auto 18px;max-width:100%;font:10px ui-monospace,SFMono-Regular,Menlo,monospace;color:#7f8a9e;border:1px solid rgba(148,163,184,.10);background:rgba(255,255,255,.02)}.msg.user{margin-left:auto;background:linear-gradient(135deg,#6549d9,#43319b);color:white}.msg.ai{margin-right:auto;background:rgba(255,255,255,.055);border:1px solid rgba(148,163,184,.12);color:#dbe4f3}.composer{display:flex;gap:10px;padding:15px;border-top:1px solid rgba(148,163,184,.12)}textarea{flex:1;resize:none;min-height:52px;max-height:140px;padding:14px;border-radius:15px;border:1px solid rgba(148,163,184,.18);background:#080a11;color:#f5f7ff;outline:none}button{border:0;border-radius:15px;padding:0 20px;background:linear-gradient(135deg,#7c5cff,#4d36a8);color:#fff;font-weight:700;cursor:pointer}button:disabled{opacity:.55;cursor:wait}.side{padding:22px}.side h2{margin:0 0 14px;font-size:13px}.check{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(148,163,184,.08);font:10px ui-monospace,SFMono-Regular,Menlo,monospace;color:#98a3b7}.ok{color:#34d399}.warn{color:#fbbf24}.trace{margin-top:18px;padding:12px;border-radius:14px;background:rgba(0,0,0,.22);font:9px ui-monospace,SFMono-Regular,Menlo,monospace;color:#718096;word-break:break-all}@media(max-width:850px){.grid{grid-template-columns:1fr}.side{display:none}.hero{padding:22px}.wrap{padding:16px}.chat{min-height:520px}}
</style></head><body><div class="wrap"><header class="top"><div class="brand"><div class="orb"></div><div><div class="eyebrow">Nodo Cero · Real del Monte · Hidalgo</div><div class="title">Isabella Villaseñor AI</div></div></div><div class="status"><span class="dot"></span> Gateway operativo</div></header><div class="grid"><section><div class="card hero"><div class="eyebrow">Federated Governed Artificial Intelligence System</div><h1>Isabella</h1><p>Esta interfaz pública está aislada de dependencias frágiles de SSR. Puedes comprobar aquí mismo que el nodo renderiza, recibe mensajes y devuelve una respuesta cognitiva declarada. La inferencia generativa usa Gemini cuando existe una clave de servidor; sin ella, se activa un clasificador Native ML explícitamente marcado como modo degradado.</p><div class="pillbar"><span class="pill">C.R.O.W.N.</span><span class="pill">AEGIS</span><span class="pill">Native ML</span><span class="pill">Audit-ready</span></div></div><div class="card chat" style="margin-top:18px"><div id="messages" class="messages"><div class="msg sys">BOOT · Isabella pública inicializada · capacidad no implica autoridad · esperando percepción.</div></div><form id="form" class="composer"><textarea id="input" maxlength="12000" placeholder="Escribe un mensaje para Isabella…" required></textarea><button id="send" type="submit">Enviar</button></form></div></section><aside class="card side"><h2>Estado verificable</h2><div class="check"><span>Presentación</span><span class="ok">ONLINE</span></div><div class="check"><span>Gateway público</span><span class="ok">ONLINE</span></div><div class="check"><span>Inferencia</span><span id="infer" class="warn">PENDING</span></div><div class="check"><span>Gobernanza</span><span class="ok">ACTIVE</span></div><div class="check"><span>Persistencia</span><span class="warn">NO REQUERIDA</span></div><div id="trace" class="trace">Trace: —</div><p style="font-size:11px;line-height:1.6;color:#778298;margin-top:18px">Esta consola pública no concede capacidades de acción. Sirve como prueba visual y funcional del canal cognitivo.</p></aside></div></div><script>
const messages=document.getElementById('messages'),form=document.getElementById('form'),input=document.getElementById('input'),send=document.getElementById('send'),infer=document.getElementById('infer'),trace=document.getElementById('trace');
function add(role,text){const el=document.createElement('div');el.className='msg '+role;el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;return el}
form.addEventListener('submit',async e=>{e.preventDefault();const text=input.value.trim();if(!text||send.disabled)return;add('user',text);input.value='';send.disabled=true;infer.textContent='PROCESSING';infer.className='warn';const pending=add('ai','Isabella está procesando…');try{const r=await fetch('/api/public-chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:text})});const d=await r.json();if(!r.ok)throw new Error(d.message||d.error||'No fue posible procesar la percepción.');pending.textContent=d.reply||'Sin síntesis.';infer.textContent=d.provider==='gemini'?'GEMINI ONLINE':'NATIVE ML';infer.className=d.provider==='gemini'?'ok':'warn';trace.textContent='Trace: '+(d.traceId||'n/a')+' · Provider: '+(d.provider||'unknown')+(d.degraded?' · degraded':'');}catch(err){pending.textContent='ARGUS :: '+(err instanceof Error?err.message:'Interrupción del núcleo.');pending.style.borderColor='rgba(248,113,113,.35)';infer.textContent='ERROR';infer.className='warn'}finally{send.disabled=false;input.focus()}});
</script></body></html>`;
}

async function publicDemoChat(request: Request): Promise<Response> {
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: publicHeaders("application/json; charset=utf-8") });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const current = publicDemoRate.get(ip);
  if (!current || now - current.started > 60_000) publicDemoRate.set(ip, { started: now, count: 1 });
  else if (current.count >= 20) return new Response(JSON.stringify({ error: "rate_limited", message: "Límite público temporal alcanzado. Intenta nuevamente en un minuto." }), { status: 429, headers: publicHeaders("application/json; charset=utf-8") });
  else current.count += 1;

  let payload: unknown;
  try { payload = await request.json(); } catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers: publicHeaders("application/json; charset=utf-8") }); }
  const message = typeof (payload as { message?: unknown })?.message === "string" ? (payload as { message: string }).message.trim() : "";
  if (!message || message.length > 12_000) return new Response(JSON.stringify({ error: "invalid_message" }), { status: 400, headers: publicHeaders("application/json; charset=utf-8") });

  const traceId = crypto.randomUUID();
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "";
  if (apiKey) {
    try {
      const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Eres Isabella Villaseñor AI, interfaz cognitiva gobernada del Nodo Cero. Responde en español latinoamericano, útil y clara. No ejecutes acciones ni afirmes capacidades no verificadas. Declara incertidumbre cuando corresponda." }, { text: message }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 1200 } }),
      });
      if (upstream.ok) {
        const data = await upstream.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
        const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
        if (reply) return new Response(JSON.stringify({ reply, provider: "gemini", degraded: false, traceId }), { status: 200, headers: publicHeaders("application/json; charset=utf-8") });
      }
    } catch (error) { console.error(redact(`[public-chat:${traceId}] ${error instanceof Error ? error.message : String(error)}`)); }
  }

  try {
    const { nativeInference } = await import("./lib/isabella-native-ml");
    const native = nativeInference({ text: message, locale: "es-MX", tenantId: "public-demo", history: [{ role: "user", content: message }] });
    return new Response(JSON.stringify({ reply: native.text, provider: "native-ml", degraded: true, intent: native.intent, confidence: native.confidence, traceId }), { status: 200, headers: publicHeaders("application/json; charset=utf-8") });
  } catch {
    const lower = message.toLowerCase();
    const reply = lower.includes("hola") || lower.includes("hello")
      ? "Hola. Soy Isabella, núcleo cognitivo público del Nodo Cero. El canal de percepción está funcionando y puedo recibir mensajes."
      : `He recibido tu percepción: “${message.slice(0, 500)}”. El canal público está operativo; la síntesis generativa requiere un proveedor configurado y, mientras tanto, el modo Native ML permanece explícitamente degradado.`;
    return new Response(JSON.stringify({ reply, provider: "native-minimal", degraded: true, traceId }), { status: 200, headers: publicHeaders("application/json; charset=utf-8") });
  }
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;
  const err = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  console.error(redact(err instanceof Error ? (err.stack ?? err.message) : String(err)));
  return new Response(renderErrorPage(), { status: 500, headers: { "content-type": "text/html; charset=utf-8" } });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try { const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown }; return payload.unhandled === true && payload.message === "HTTPError"; } catch { return false; }
}

export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  const setIfMissing = (name: string, value: string) => { if (!headers.has(name)) headers.set(name, value); };
  setIfMissing("X-Content-Type-Options", "nosniff"); setIfMissing("X-Frame-Options", "DENY"); setIfMissing("Referrer-Policy", "strict-origin-when-cross-origin"); setIfMissing("X-XSS-Protection", "0"); setIfMissing("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"); setIfMissing("Permissions-Policy", "camera=(), microphone=(), geolocation=()"); setIfMissing("Cross-Origin-Opener-Policy", "same-origin"); setIfMissing("Cross-Origin-Resource-Policy", "same-origin");
  setIfMissing("Content-Security-Policy", ["default-src 'self'","img-src 'self' data: blob:","style-src 'self' 'unsafe-inline'","script-src 'self' 'unsafe-inline'","connect-src 'self' https://generativelanguage.googleapis.com https://*.supabase.co https://*.neon.tech","object-src 'none'","base-uri 'self'","frame-ancestors 'none'","form-action 'self'","upgrade-insecure-requests"].join("; "));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function fetchWithRequestChain(request: Request, env: unknown, ctx: unknown): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === "GET" && url.pathname === "/") return withSecurityHeaders(new Response(publicShellHtml(), { status: 200, headers: publicHeaders() }));
  if (url.pathname === "/api/public-chat") return withSecurityHeaders(await publicDemoChat(request));
  if (request.method === "GET" && url.pathname === "/api/health/live") return withSecurityHeaders(new Response(JSON.stringify({ status: "alive", service: "isabella-ai-genesis", gateway: "public", timestamp: new Date().toISOString() }), { status: 200, headers: publicHeaders("application/json; charset=utf-8") }));

  const requestContext = createRequestContext({ method: request.method, path: url.pathname, clientIp: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown" });
  return withRequestContext(requestContext, async () => {
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const contentLength = Number(request.headers.get("content-length") ?? "0");
      try { if (contentLength > 0) assertBodyWithinLimits(contentLength); } catch (error) { if (error instanceof LimitError) return new Response(JSON.stringify({ error: { code: error.code, message: error.message } }), { status: 413, headers: { "content-type": "application/json" } }); throw error; }
    }
    const handler = await getServerEntry();
    const response = await handler.fetch(request, env, ctx);
    return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response));
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try { return await fetchWithRequestChain(request, env, ctx); }
    catch (error) {
      const traceId = getRequestContext()?.traceId ?? "no-trace";
      console.error(redact(`[${traceId}] ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`));
      if (error instanceof Error && "code" in error && (error as { code?: string }).code === "SOVEREIGN_STATE_UNAVAILABLE") return withSecurityHeaders(new Response(JSON.stringify({ error: "service_unavailable", code: "SOVEREIGN_STATE_UNAVAILABLE", traceId }), { status: 503, headers: { "content-type": "application/json; charset=utf-8" } }));
      return withSecurityHeaders(new Response(renderErrorPage(), { status: 500, headers: { "content-type": "text/html; charset=utf-8" } }));
    }
  },
};