---
name: prisma-composer-core-concepts
metadata:
  library: "@prisma/composer"
  library_version: "0.17.0"
  version: 2026.9.1-devin
  agent: devin
  difficulty: intermediate
  estimated_execution_time: varies by task
  use_case: autonomous-task-execution
  triggers:
    - "prisma composer"
    - "@prisma/composer"
    - "deploy prisma app"
    - "create service"
    - "setup prisma composer"
    - "migrate database"
    - "test prisma composer"
    - "debug prisma composer"
  related_skills:
    - prisma-orm-fundamentals
    - typescript-project-setup
    - ci-cd-deployment
  last_updated: 2026-09-06
description: >-
  Autonomous task execution guide for Devin using Prisma Composer. Optimized for complete
  task workflows: setup, create, deploy, test, debug. Includes verification steps and
  failure recovery procedures.
---

# Prisma Composer — Autonomous Execution Guide (Devin)

> **🤖 Task Modes**: [Setup Project](#setup-project) | [Create Service](#create-service-task) | [Deploy App](#deploy-task) | [Migrate DB](#migrate-database-task) | [Debug](#debug-task)

---

## Execution Principles

**Before starting any task**:

1. ✅ Verify `@prisma/composer` and `@prisma/composer-prisma-cloud` are installed
2. ✅ Check `prisma-composer.config.ts` exists
3. ✅ Confirm `effect` constellation is pinned in `package.json`
4. ✅ Validate environment variables set (for deploy): `PRISMA_SERVICE_TOKEN`, `PRISMA_WORKSPACE_ID`

**Golden Rules**:

1. ❌ Never use `process.env` → ✅ All config via `service.load()`, `service.input()`, `service.port()`
2. ❌ Never deploy without building → ✅ Always `build` before `deploy` or `dev`
3. ❌ Never skip migration plan → ✅ Always `prisma migration plan` before deploy

---

## Setup Project

### Task: Initialize Prisma Composer Project

**Steps**:

```bash
# 1. Install dependencies
npm install @prisma/composer @prisma/composer-prisma-cloud

# 2. Install effect constellation (pin versions)
npm install effect@3.10.0 @effect/sql-pg@0.15.0 @effect/vitest@0.15.0 @effect/platform-bun@0.15.0

# 3. Add overrides to package.json
cat >> package.json << 'EOF'
{
  "overrides": {
    "effect": "3.10.0",
    "@effect/sql-d1": "0.15.0",
    "@effect/sql-pg": "0.15.0",
    "@effect/vitest": "0.15.0",
    "@effect/platform-bun": "0.15.0"
  }
}
EOF

# 4. Create deploy config
cat > prisma-composer.config.ts << 'EOF'
import { prismaCloud } from "@prisma/composer-prisma-cloud";

export default {
  targets: [prismaCloud()],
};
EOF

# 5. Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true
  }
}
EOF
```

**Verification**:

```bash
# Check config is valid
prisma-composer --help

# Should show help without errors
```

---

## Create Service Task

### Task: Create New Service with RPC

**Input**: Service name, dependencies, contract methods

**Steps**:

```bash
# 1. Create directory structure
mkdir -p services/auth

# 2. Create contract
cat > services/auth/contract.ts << 'EOF'
import { z } from "zod";

export const authContract = {
  verify: z.object({
    token: z.string()
  }).transform(async ({ token }) => {
    return { ok: true, userId: "user_123" };
  }),

  login: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }).transform(async ({ email, password }) => {
    return { ok: true, token: "jwt_here" };
  })
};
EOF

# 3. Create service declaration
cat > services/auth/service.ts << 'EOF'
import { compute, node, rawPostgres } from "@prisma/composer-prisma-cloud";
import { authContract } from "./contract";
import { z } from "zod";

export default compute({
  name: "auth",
  deps: {
    db: rawPostgres()
  },
  input: {
    jwtSecret: z.string().min(16),
    sessionTtl: z.number().default(3600)
  },
  build: node({
    module: import.meta.url,
    entry: "../dist/server.mjs"
  }),
  expose: {
    rpc: authContract
  },
});
EOF

# 4. Create server implementation
cat > services/auth/server.ts << 'EOF'
import { service, serve } from "@prisma/composer";
import { authContract } from "./contract";
import { SQL } from "bun";

const { db } = service.load();
const { jwtSecret, sessionTtl } = service.input();

const handler = serve(service, {
  rpc: {
    verify: async ({ token }) => {
      if (token.length === 0) return { ok: false, error: "Empty token" };
      return { ok: true, userId: "user_123" };
    },
    login: async ({ email, password }) => {
      const sql = new SQL({ url: db.url });
      const user = await sql`SELECT * FROM users WHERE email = ${email}`;
      return { ok: true, token: "jwt_here" };
    }
  } satisfies typeof authContract
});

Bun.serve({
  port: service.port(),
  hostname: "0.0.0.0",
  fetch: handler
});
EOF

# 5. Wire in root module
cat > modules/store/module.ts << 'EOF'
import { module } from "@prisma/composer";
import { authModule } from "../auth";
import { storefrontService } from "./services/storefront";

export default module("store", ({ provision }) => {
  const auth = provision(authModule);

  provision(storefrontService, {
    deps: { auth: auth.rpc }
  });
});
EOF
```

**Verification**:

```bash
# Typecheck
npx tsc --noEmit

# Build
bun build services/auth/server.ts --outdir dist --format esm

# Should complete without errors
```

---

## Deploy Task

### Task: Deploy App to Stage

**Prerequisites Check**:

```bash
# 1. Verify env vars
echo "PRISMA_SERVICE_TOKEN: ${PRISMA_SERVICE_TOKEN:-(not set)}"
echo "PRISMA_WORKSPACE_ID: ${PRISMA_WORKSPACE_ID:-(not set)}"

# 2. Check effect pinning
cat package.json | grep -A 10 '"overrides"'

# 3. Verify config exists
ls -la prisma-composer.config.ts
```

**Steps**:

```bash
# 1. Build all services
bun build services/auth/server.ts --outdir dist --format esm

# 2. Deploy to stage
prisma-composer deploy staging

# 3. Verify deployment
# Check deploy report for:
# - Service URLs
# - Resource IDs
# - No errors
```

**Post-Deploy Verification**:

```bash
# Test RPC endpoint (through consumer, not direct curl)
# Direct curl will return 401 (expected - service keys enforced)

# Check logs
prisma-composer log --stage staging
```

**Failure Recovery**:

| Error                      | Recovery Action                                               |
| -------------------------- | ------------------------------------------------------------- |
| `effect` version conflict  | Reinstall with pinned versions (see Setup)                    |
| `MIGRATION_PATH_NOT_FOUND` | Run `prisma migration plan --name <slug>`                     |
| `DEPLOY.ENGINE_FAILED`     | Run `alchemy deploy .prisma-composer/alchemy.run.ts` directly |
| 401 on `/rpc/<method>`     | Normal — debug through consumer, not direct curl              |

---

## Migrate Database Task

### Task: Add Schema Migration

**Input**: Schema changes in `contract.prisma`

**Steps**:

```bash
# 1. Edit contract.prisma
# (make schema changes in editor)

# 2. Regenerate contract artifacts
prisma contract emit

# 3. Verify generated files
ls -la modules/catalog/contract.json
ls -la modules/catalog/contract.d.ts

# 4. Author migration
prisma migration plan --name add_users_table

# 5. Verify migration created
ls -la modules/catalog/migrations/

# 6. Commit migrations
git add modules/catalog/migrations/
git commit -m "Add users table migration"

# 7. Deploy (replays all migrations)
prisma-composer deploy production
```

**Verification**:

```bash
# Check migration was applied
prisma-composer log --stage production

# Should show migration applied successfully
```

**Failure Recovery**:

| Error                      | Recovery Action                                       |
| -------------------------- | ----------------------------------------------------- |
| `MIGRATION_PATH_NOT_FOUND` | Author missing migration with `prisma migration plan` |
| Migration fails on deploy  | Check `migrations/` directory committed, retry deploy |
| Local DB stale             | Run `prisma db update` for local iteration only       |

---

## Test Task

### Task: Create and Run Tests

**Steps**:

```bash
# 1. Create unit test
cat > services/auth/server.test.ts << 'EOF'
import { mockService } from "@prisma/composer/testing";
import { describe, it, expect } from "bun:test";
import authDeclaration from "./service";

describe("auth service", () => {
  it("verifies valid token", async () => {
    const mockDb = { url: "postgresql://mock:5432/test" };
    const service = mockService(authDeclaration, {
      deps: { db: mockDb },
      input: { jwtSecret: "test-secret-key-here" }
    });

    const { verify } = service.load().rpc;
    const result = await verify({ token: "valid-token" });

    expect(result.ok).toBe(true);
  });
});
EOF

# 2. Create integration test
cat > tests/auth.integration.test.ts << 'EOF'
import { bootstrapService } from "@prisma/composer-prisma-cloud/testing";
import { describe, it, expect, beforeEach } from "bun:test";

describe("auth integration", () => {
  let service: ReturnType<typeof bootstrapService>;

  beforeEach(() => {
    service = bootstrapService(authDeclaration, {
      deps: { db: { url: "postgresql://localhost:5432/test_db" } },
      input: { jwtSecret: "test-secret" }
    });
  });

  it("handles login request", async () => {
    const response = await fetch(`http://localhost:${service.port}/rpc/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "password123" })
    });

    expect(response.status).toBe(200);
  });
});
EOF

# 3. Run tests
bun test services/auth/server.test.ts
bun test tests/auth.integration.test.ts
```

**Verification**:

```bash
# All tests should pass
# Check test output for failures
```

---

## Debug Task

### Task: Debug Deployment Failure

**Diagnostic Steps**:

```bash
# 1. Check build status
bun build services/auth/server.ts --outdir dist --format esm
# If fails: fix build errors first

# 2. Check config
cat prisma-composer.config.ts
# Should have targets and builds defined

# 3. Check effect pinning
cat package.json | grep -A 10 '"overrides"'
# Should have all effect packages pinned

# 4. Run deploy with verbose output
prisma-composer deploy staging --verbose

# 5. If deploy fails, check alchemy stack file
cat .prisma-composer/alchemy.run.ts

# 6. Reproduce alchemy failure directly
alchemy deploy .prisma-composer/alchemy.run.ts

# 7. Check logs for deployed app
prisma-composer log --stage staging
```

**Common Issues & Fixes**:

| Issue                      | Diagnostic                                         | Fix                                                     |
| -------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| `effect` version conflict  | `Dependency conflict: alchemy resolves effect@...` | Pin effect constellation in `package.json` overrides    |
| 401 on `/rpc/<method>`     | Direct curl returns 401                            | Normal — service keys enforced. Debug through consumer  |
| `MIGRATION_PATH_NOT_FOUND` | Deploy refuses with this error                     | Run `prisma migration plan --name <slug>`               |
| Service unreachable        | Can't connect to deployed service                  | Check binding: should be `0.0.0.0`, not `localhost`     |
| Timestamp read fails       | First read of DateTime column crashes              | Add `import 'temporal-polyfill/global'` at server entry |

---

## Local Development Task

### Task: Run App Locally

**Steps**:

```bash
# 1. Build first
bun build services/auth/server.ts --outdir dist --format esm

# 2. Run dev
prisma-composer dev

# 3. Follow logs (separate terminal)
prisma-composer log

# 4. Stop dev (Ctrl-C)
# Local databases and data persist for warm start

# 5. Clean start (wipe local data)
prisma-composer dev --clean
```

**Verification**:

```bash
# Check services are running
prisma-composer log

# Should show service startup logs
```

---

## File Structure Reference

my-app/
├── prisma-composer.config.ts # Deploy config
├── tsconfig.json # TypeScript config
├── package.json # Dependencies + effect overrides
├── .prisma-composer/ # Generated (gitignored)
│ └── alchemy.run.ts # Stack file for deploy/destroy
├── modules/
│ └── store/
│ ├── module.ts # Root module
│ └── catalog/
│ ├── module.ts
│ ├── contract.prisma
│ ├── contract.json # Generated
│ ├── contract.d.ts # Generated
│ └── migrations/ # Committed migrations
├── services/
│ └── auth/
│ ├── service.ts # compute() declaration
│ ├── server.ts # Built entry
│ └── contract.ts # RPC contract
└── dist/
└── server.mjs # Built output

text

---

## Command Reference

```bash
# Development
prisma-composer dev              # Run locally
prisma-composer log              # Follow logs

# Deployment
prisma-composer deploy <stage>   # Deploy to stage
prisma-composer destroy <stage>  # Destroy stage (explicit target required)

# Database
prisma contract emit             # Regenerate contract artifacts
prisma migration plan --name <slug>  # Author migration
prisma db update                 # Update local DB (iteration only)

# Help
prisma-composer <command> --help # Show command help
```

---

## Import Reference

```typescript
// Core
import { module, compute, node } from "@prisma/composer";

// Prisma Cloud
import {
  prismaCloud,
  rawPostgres,
  bucket,
  envSecret,
  envParam,
} from "@prisma/composer-prisma-cloud";

// ORM
import { postgres, dataContract } from "@prisma/composer-prisma-cloud/orm";

// Modules
import { cron } from "@prisma/composer-prisma-cloud/cron";
import { storage } from "@prisma/composer-prisma-cloud/storage";
import { streams } from "@prisma/composer-prisma-cloud/streams";
import { auth } from "@prisma/composer-prisma-cloud/auth";
import { email } from "@prisma/composer-prisma-cloud/email";

// Testing
import { mockService } from "@prisma/composer/testing";
import { bootstrapService } from "@prisma/composer-prisma-cloud/testing";

// Control
import { deploy, destroy, dev, log } from "@prisma/composer/control";
```

---

## Resources

- **Docs**: <https://www.prisma.io/docs/composer>
- **Examples**: <https://github.com/prisma/composer/tree/main/examples>
- **Discord**: <https://pris.ly/discord>
- **npm**: <https://www.npmjs.com/package/@prisma/composer>

---

> **Execution Checklist**: Typecheck ✅ → Build ✅ → Deploy ✅ → Verify ✅
> Características de esta versión para Devin:
> ✅ Tasks autónomas — pasos completos ejecutables
> ✅ Verificación integrada — checks después de cada paso
> ✅ Recovery procedures — qué hacer cuando falla
> ✅ Comandos copy-paste — scripts listos para terminal
> ✅ Diagnóstico estructurado — tablas de issues & fixes
> ✅ File structure reference — para navegación autónoma
> ✅ Import reference — para generación de código
