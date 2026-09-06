

Perfecto. Aquí tienes la versión optimizada para Cursor IDE — enfocada en código accionable, snippets copiables y comandos listos para ejecutar mientras desarrollas:

text
---
name: prisma-composer-core-concepts
metadata:
  library: "@prisma/composer"
  library_version: "0.17.0"
  version: 2026.9.1-cursor
  agent: cursor
  difficulty: intermediate
  estimated_read_time: 10-15 minutes
  use_case: coding-assistant
  triggers:
    - "prisma composer"
    - "@prisma/composer"
    - "compute()"
    - "module()"
    - "service.load()"
    - "how do I create a service"
    - "prisma composer deploy"
    - "prisma composer test"
    - "prisma composer migration"
    - "prisma composer dev"
  related_skills:
    - prisma-orm-fundamentals
    - typescript-snippets
  last_updated: 2026-09-06
description: >-
  Code-first Prisma Composer guide for Cursor IDE. Optimized for real-time coding assistance
  with copy-paste snippets, CLI commands, and quick troubleshooting. Less theory, more action.
---

# Prisma Composer — Code-First Guide (Cursor)

> **💡 Quick Actions**: [Create Service](#create-service) | [Deploy](#deploy) | [Test](#test) | [Migrate DB](#migrate-database) | [Troubleshoot](#troubleshoot)

---

## Core Concepts (TL;DR)

**3 Node Types**:
- `compute()` → Service (running code)
- `rawPostgres()`, `bucket()` → Resource (managed dependency)
- `module()` → Module (grouping, no runtime)

**2 Golden Rules**:
1. ❌ Never use `process.env` → ✅ Use `service.load()`, `service.input()`, `service.port()`
2. ❌ Don't expect framework to build → ✅ You build, framework assembles

---

## Create Service

### Step 1: Service Declaration

```typescript
// services/auth/service.ts
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
```

### Step 2: Server Implementation

```typescript
// services/auth/server.ts
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
```

### Step 3: Wire in Module

```typescript
// modules/store/module.ts
import { module } from "@prisma/composer";
import { authModule } from "../auth";
import { storefrontService } from "./services/storefront";

export default module("store", ({ provision }) => {
  const auth = provision(authModule);
  
  provision(storefrontService, { 
    deps: { auth: auth.rpc } 
  });
});
```

### Step 4: Consume RPC

```typescript
// services/storefront/server.ts
const { auth } = service.load();

const handler = serve(service, {
  rpc: {
    getProtectedData: async ({ userId }) => {
      const verification = await auth.verify({ token: "..." });
      if (!verification.ok) throw new Error("Unauthorized");
      return { data: "protected" };
    }
  }
});
```

---

## Deploy

### Prerequisites

```bash
# Set environment variables
export PRISMA_SERVICE_TOKEN="pcs_..."
export PRISMA_WORKSPACE_ID="ws_..."
```

### Deploy Commands

```bash
# 1. Build first (REQUIRED)
bun build services/auth/server.ts --outdir dist --format esm

# 2. Deploy to stage
prisma-composer deploy staging
prisma-composer deploy production

# 3. Destroy stage (explicit target required)
prisma-composer destroy staging
prisma-composer destroy production
```

### Deploy Config

```typescript
// prisma-composer.config.ts
import { prismaCloud, nextjsBuild } from "@prisma/composer-prisma-cloud";

export default {
  targets: [prismaCloud()],
  builds: [nextjsBuild({ module: import.meta.url, appDir: "./app" })]
};
```

### Effect Pinning (Required)

```json
// package.json
{
  "overrides": {
    "effect": "3.10.0",
    "@effect/sql-d1": "0.15.0",
    "@effect/sql-pg": "0.15.0",
    "@effect/vitest": "0.15.0",
    "@effect/platform-bun": "0.15.0"
  }
}
```

---

## Test

### Unit Test (mockService)

```typescript
// services/auth/server.test.ts
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
```

### Integration Test (bootstrapService)

```typescript
// tests/auth.integration.test.ts
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
```

---

## Migrate Database

### Migration Workflow

```bash
# 1. Edit contract.prisma
# (make your schema changes)

# 2. Regenerate contract artifacts
prisma contract emit

# 3. Author migration
prisma migration plan --name add_users_table

# 4. Commit migrations
git add migrations/
git commit -m "Add users table migration"

# 5. Deploy (replays all migrations)
prisma-composer deploy production
```

### Local Iteration Only

```bash
# For local dev only (NOT for deploy)
prisma db update
```

---

## Local Development

### Dev Commands

```bash
# 1. Build first
bun build services/auth/server.ts --outdir dist --format esm

# 2. Run locally
prisma-composer dev

# 3. Follow logs (separate command)
prisma-composer log
```

### Dev vs Deploy

| Aspect | `dev` | `deploy` |
|--------|-------|----------|
| Build required | ✅ Yes | ✅ Yes |
| Cloud credentials | ❌ No | ✅ Yes |
| Watch mode | ✅ Yes | ❌ No |
| Logs | Separate `log` command | In deploy report |

---

## Troubleshoot

### Common Errors

| Error | Fix |
|-------|-----|
| **`effect` version conflict** | Pin `effect` constellation in `package.json` overrides (see above) |
| **`/rpc/<method>` returns 401** | Normal — service keys enforced. Debug through consumer or locally |
| **`MIGRATION_PATH_NOT_FOUND`** | Run `prisma migration plan --name <slug>` before deploy |
| **First timestamp read fails** | Add `import 'temporal-polyfill/global'` at server entry |
| **Service unreachable** | Bind to `0.0.0.0`, not `localhost` |
| **Name fails at load** | Use `[A-Za-z0-9]` only in names (no hyphens) |

### Connection Contract Refusal

```text
Connection input "auth.db" declares param "url", but its producer "db" did not
supply it — the producer's outputs carry [host].
```

**Fix**: Check producer exposes `url`, or mark param optional if truly optional.

### Drive Deploys from Code

```typescript
import { deploy, destroy, dev, log } from "@prisma/composer/control";

const result = await deploy({ stage: "production" });

if (!result.ok) {
  switch (result.failure.code) {
    case "ASSEMBLE.BUILD_FAILED":
      console.error("Build failed");
      break;
    case "DEPLOY.ENGINE_FAILED":
      console.error("Engine failed");
      break;
    case "DEPS.EFFECT_VERSION_CONFLICT":
      console.error("Effect version conflict");
      break;
  }
}
```

---

## Patterns

### Multi-Service Module

```typescript
// modules/ecommerce/module.ts
import { module } from "@prisma/composer";
import { postgres } from "@prisma/composer-prisma-cloud/orm";

export default module("ecommerce", ({ provision }) => {
  const db = provision(postgres("ecommerce", { /* ... */ }));
  
  const products = provision(productsService, { deps: { db } });
  const orders = provision(ordersService, { deps: { db, products: products.rpc } });
  const payments = provision(paymentsService, { deps: { db, orders: orders.rpc } });
  
  return { products, orders, payments };
});
```

### Secret Forwarding

```typescript
// modules/auth/module.ts
import { module, secret } from "@prisma/composer";

export default module("auth", ({ provision }) => {
  provision(authService, {
    input: { jwtSecret: secret() }
  });
  
  return { api: authService.rpc };
});

// Parent binds real source
provision(authModule, {
  input: { jwtSecret: envSecret("JWT_SECRET") }
});
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| `process.env.PORT` | `service.port()` |
| `curl` deployed `/rpc/<method>` | Debug through consumer |
| Skip `prisma migration plan` | Always author migrations first |
| Use hyphens in names (`my-db`) | Use `[A-Za-z0-9]` only |
| Bind to `localhost` | Bind to `0.0.0.0` |
| Build SSE/streaming | Use polling/webhooks |
| Edit `.prisma-composer/alchemy.run.ts` | It's generated, not config |

---

## Quick Reference

### Essential Commands

```bash
# Development
prisma-composer dev
prisma-composer log

# Deployment
prisma-composer deploy <stage>
prisma-composer destroy <stage>

# Database
prisma contract emit
prisma migration plan --name <slug>
prisma db update  # local only

# Help
prisma-composer <command> --help
```

### File Structure
my-app/
├── prisma-composer.config.ts
├── tsconfig.json
├── package.json
├── .prisma-composer/ # gitignored
│ └── alchemy.run.ts
├── modules/
│ └── store/
│ ├── module.ts
│ └── catalog/
│ ├── module.ts
│ ├── contract.prisma
│ ├── contract.json # generated
│ ├── contract.d.ts # generated
│ └── migrations/
├── services/
│ └── auth/
│ ├── service.ts
│ ├── server.ts
│ └── contract.ts
└── dist/
└── server.mjs

text

### Import Paths

```typescript
// Core
import { module, compute, node } from "@prisma/composer";

// Prisma Cloud
import { prismaCloud, rawPostgres, bucket, envSecret, envParam } 
  from "@prisma/composer-prisma-cloud";

// ORM
import { postgres, dataContract } 
  from "@prisma/composer-prisma-cloud/orm";

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

> **Remember**: Typecheck → Build → Deploy. Never use cloud to find wiring errors.
Características de esta versión para Cursor:
✅ Código primero — snippets copiables inmediatamente
✅ Comandos CLI listos — copy-paste para terminal
✅ Tablas de errores — troubleshooting rápido mientras codificas
✅ Patrones comunes — arquitecturas probadas
✅ Anti-patrones — qué evitar en tiempo real
✅ Import paths — referencia rápida de imports
✅ Sin teoría extensa — solo lo necesario para actuar
