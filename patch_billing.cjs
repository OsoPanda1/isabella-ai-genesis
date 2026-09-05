const fs = require('fs');
let code = fs.readFileSync('src/routes/api/billing.ts', 'utf8');

// Require Stripe
code = code.replace(
  'const stripe = getStripe();',
  'const stripe = getStripe();\n              if (!stripe) {\n                return new Response(JSON.stringify({ error: "Stripe no configurado en el servidor." }), { status: 500, headers });\n              }'
);

// Remove fallback block
code = code.replace(
  /\/\/ Fallback o simulador explícito\s+if \(\!checkoutUrl\) \{\s+checkoutUrl = [^;]+;\s+\}/,
  'if (!checkoutUrl) {\n                return new Response(JSON.stringify({ error: "Fallo al crear sesión de checkout." }), { status: 500, headers });\n              }'
);

// Remove 'simulated: !stripe,'
code = code.replace(
  'simulated: !stripe,',
  ''
);

// Remove fallback for webhook
code = code.replace(
  /\/\/ 2\. WEBHOOK \(REAL STRIPE \/ INTERNO DE VERIFICACIÓN\)/,
  '// 2. WEBHOOK (REAL STRIPE)'
);

code = code.replace(
  /if \(!signature\) \{[\s\S]*?return new Response\(JSON\.stringify\(\{ error: "Firma faltante\." \}\), \{ status: 400, headers \}\);[\s\S]*?\}/,
  ''
);

// Wait, the webhook code has a signature check:
// "Si Stripe está activo y recibimos firmas reales, verificamos"
// Let's replace the whole webhook block carefully.

fs.writeFileSync('src/routes/api/billing.ts', code);
