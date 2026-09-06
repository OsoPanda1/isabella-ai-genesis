const fs = require('fs');
let code = fs.readFileSync('src/routes/api/isabella.ts', 'utf8');

code = code.replace(
  'authenticated: true // Guest users have an issued Guest session,',
  'authenticated: true, // Guest users have an issued Guest session'
);

fs.writeFileSync('src/routes/api/isabella.ts', code);
