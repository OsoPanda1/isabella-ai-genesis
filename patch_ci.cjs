const fs = require('fs');
let code = fs.readFileSync('.github/workflows/ci.yml', 'utf8');

code = code.replace(
  /name: build-artifacts\s+path: \.next\//g,
  `name: build-artifacts
          path: .output/`
);

fs.writeFileSync('.github/workflows/ci.yml', code);
