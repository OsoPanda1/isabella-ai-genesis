const fs = require('fs');
let code = fs.readFileSync('src/lib/repositories/bookpi-postgres-repository.ts', 'utf8');

// 1. Remove getPool mock fallback
code = code.replace(
  /function getPool\(url: string\) \{\s+if \(\!pool\) \{\s+try \{\s+pool = new Pool\(\{ connectionString: url \}\);\s+\} catch \{\s+console\.warn\('\[AI Studio\] DB not connected — mock active'\);\s+pool = \{[\s\S]*?\} as unknown as Pool;\s+\}\s+\}\s+return pool;\s+\}/,
  `function getPool(url: string) {
  if (!pool) {
    if (!url) {
      throw new Error("CRITICAL: DATABASE_URL is missing. BookPI Ledger requires a valid PostgreSQL connection.");
    }
    pool = new Pool({ connectionString: url });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle BookPI database client', err);
      process.exit(-1);
    });
  }
  return pool;
}`
);

// 2. Make signing strict
code = code.replace(
  /const signKey = \(cfg as unknown as Record<string,string>\)\.BOOKPI_SIGNING_KEY;\s+if \(signKey\) \{\s+try \{\s+\/\/ In a real post-quantum scenario[\s\S]*?\} catch\(e\) \{\s+console\.warn\("Fallo al firmar BookPI \(llave incorrecta\?\), continuando sin firma real\."\);\s+\}\s+\}/,
  `const signKey = (cfg as unknown as Record<string,string>).BOOKPI_SIGNING_KEY;
        if (!signKey) {
          throw new Error("CRITICAL_SECURITY_ERROR: BOOKPI_SIGNING_KEY is missing. The Sovereign BookPI Ledger requires a valid signing key to ensure integrity.");
        }
        try {
           const signer = require("node:crypto").createSign("SHA256");
           signer.update(blockHash);
           signer.end();
           (base as any).pqcSignature = signer.sign(signKey, "base64");
           base.signatureAlgorithm = "RSA-SHA256";
        } catch(e) {
           throw new Error("CRITICAL_SECURITY_ERROR: Failed to sign BookPI block. Execution aborted to prevent unverified ledger entries.");
        }`
);

fs.writeFileSync('src/lib/repositories/bookpi-postgres-repository.ts', code);
