const fs = require('fs');

// 1. Fix bookpi repo
let bp = fs.readFileSync('src/lib/repositories/bookpi-postgres-repository.ts', 'utf8');
bp = bp.replace(
  'base.blockHash = blockHash;',
  ''
);
bp = bp.replace(
  '(cfg as Record<string,string>).BOOKPI_SIGNING_KEY',
  '(cfg as unknown as Record<string,string>).BOOKPI_SIGNING_KEY'
);
bp = bp.replace(
  'base.pqcSignature = signer.sign(signKey, "base64");',
  '(base as any).pqcSignature = signer.sign(signKey, "base64");'
);
fs.writeFileSync('src/lib/repositories/bookpi-postgres-repository.ts', bp);

// 2. Fix billing webhook
let bil = fs.readFileSync('src/routes/api/billing.ts', 'utf8');
bil = bil.replace(
  'let metadata = {};',
  'let metadata: Record<string, string> = {};'
);
fs.writeFileSync('src/routes/api/billing.ts', bil);
