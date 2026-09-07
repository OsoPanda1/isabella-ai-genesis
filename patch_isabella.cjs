const fs = require('fs');
let code = fs.readFileSync('src/routes/api/isabella.ts', 'utf8');

code = code.replace(
  'gemini-3-flash',
  'gemini-1.5-flash'
);

fs.writeFileSync('src/routes/api/isabella.ts', code);
