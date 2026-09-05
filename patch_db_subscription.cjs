const fs = require('fs');
let code = fs.readFileSync('src/routes/api/db.ts', 'utf8');

// The file might use context.tenantId or context.userId. Let's find where subscriptionActive is.
// It's inside evaluateEligibility.
// Let's replace 'subscriptionActive: true' with a check.
// In the first occurrence (around line 294), we can load the tenant.
const regex1 = /const { evaluateEligibility } = await import\("@\/lib\/monetization\/eligibility"\);\s*const eligibility = evaluateEligibility\(\{[\s]*subscriptionActive: true,/g;

// Instead of regex, I will just dynamically replace it. We know `context.tenantId` is available in these routes.
// We can use SovereignDB to check if the tier is NOT free.

code = code.replace(
  /subscriptionActive: true/g,
  `subscriptionActive: (() => {
                      const dbInst = SovereignDB.load();
                      const tenant = dbInst.tenants.find(t => t.id === (context.tenantId || ""));
                      return tenant ? (tenant.tier === "Sovereign" || tenant.tier === "Enterprise") : false;
                    })()`
);

fs.writeFileSync('src/routes/api/db.ts', code);
