const fs = require('fs');
let code = fs.readFileSync('src/lib/env-schema.ts', 'utf8');
code = code.replace(
  /ALLOW_GUEST_CHAT: z\s*\.preprocess\(\s*\(val\) => \{\s*if \(typeof val !== "string"\) return undefined;\s*const t = val\.trim\(\)\.toLowerCase\(\);\s*if \(t === "" \|\| t === "undefined" \|\| t === "null"\) return undefined;\s*return t;\s*\},\s*z\.enum\(\["true", "false"\]\)\.default\("false"\),\s*\)/g,
  `ALLOW_GUEST_CHAT: z
    .preprocess(
      (val) => {
        if (typeof val !== "string") return undefined;
        const t = val.trim().toLowerCase();
        if (t === "" || t === "undefined" || t === "null") return undefined;
        return t;
      },
      z.enum(["true", "false"]).default("true"),
    )`
);
fs.writeFileSync('src/lib/env-schema.ts', code);
