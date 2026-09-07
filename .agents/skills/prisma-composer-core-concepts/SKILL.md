---
name: prisma-composer-mastery
metadata:
  library: "@prisma/composer"
  library_version: "0.17.0"
  version: 2026.9.1-v2
  difficulty: intermediate-to-advanced
  estimated_read_time: 25-35 minutes
  prerequisites:
    - TypeScript proficiency
    - Basic understanding of dependency injection
    - Familiarity with CLI workflows
  triggers:
    - "prisma composer"
    - "@prisma/composer"
    - "prisma app"
    - "prisma-composer CLI"
    - "compute()"
    - "module()"
    - "contract()"
    - "service.load()"
    - "mockService"
    - "bootstrapService"
    - "how do I deploy with prisma composer"
    - "prisma composer testing"
    - "prisma composer local development"
  related_skills:
    - prisma-orm-fundamentals
    - typescript-advanced-patterns
    - cloud-deployment-strategies
    - api-contract-design
description: >-
  Complete mastery guide for Prisma Composer: from first principles to production deployment.
  Covers architecture, wiring, testing, debugging, and real-world patterns with executable examples.
  Use for deploying, managing, testing, or troubleshooting Prisma Composer applications.
---

# Prisma Composer: Complete Mastery Guide

> **Quick Start**: New to Composer? Start with [Core Concepts](#core-concepts) → [Your First Service](#your-first-service) → [Deploy to Cloud](#deploy-to-cloud).
> Already building? Jump to [Testing Strategies](#testing-strategies) or [Troubleshooting](#troubleshooting).

## Executive Summary

Prisma Composer is a **declarative application framework** that assembles TypeScript services, resources, and modules into deployable applications. Unlike traditional frameworks, Composer:

- ✅ **Never bundles or transforms your code** — you control the build
- ✅ **Enforces type-safe wiring at compile time** — errors surface in `tsc`, not production
- ✅ **Isolates runtime from environment** — no `process.env`, all dependencies injected
- ✅ **Deploys identically everywhere** — stages are environment names, not code branches

This guide covers everything the official docs assume you'll discover through trial and error.

---

## Core Concepts

### The Three Node Types

Every Prisma App is a tree of **declarations** (plain data, no execution on import):

| Node Type | Declared With | Purpose | Runtime Behavior |
|-----------|---------------|---------|------------------|
| **Service** | `compute()` | A running unit of your code | Atomic; Composer sees only its ports |
| **Resource** | `rawPostgres()`, `bucket()` | Stateful managed dependency | Provisioned by the platform |
| **Module** | `module()` | Grouping boundary | Runs no code; exposes typed ports |

```typescript
// module.ts — Root module handed to CLI
import { module } from "@prisma/composer";
import { provision } from "./wiring";

export default module("store", ({ provision }) => {
  const catalog = provision(catalogModule);
  provision(storefrontService, { 
    deps: { catalog: catalog.rpc } 
  });
});
```

**Key Insight**: Ports are typed. The compiler verifies every wire before deploy.

### The Two Governing Principles

These are **binding constraints** (from `docs/design/01-principles/`):

1. **Your code never reads its environment**
   - Dependencies, config, credentials, port → all arrive through `service`
   - `process.env` is **never** the answer
   - Violation = deploy-time refusal

2. **Composer never bundles or transforms your code**
   - You build with your bundler (Bun, esbuild, Next.js, etc.)
   - Framework assembles built output deterministically
   - Violation = runtime failure (missing dependencies)

---

## Your First Service

### Step 1: Declare the Service

```typescript
// services/auth/service.ts
import { compute, node, rawPostgres } from "@prisma/composer-prisma-cloud";
import { authContract } from "./contract";

export default compute({
  name: "auth",
  deps: { 
    db: rawPostgres() // Declares need for Postgres
  },
  input: {
    // Optional: configuration schema
    jwtSecret: z.string().min(16),
    sessionTtl: z.number().default(3600)
  },
  build: node({ 
    module: import.meta.url, 
    entry: "../dist/server.mjs" 
  }),
  expose: { 
    rpc: authContract // Typed RPC interface
  },
});
```

### Step 2: Implement the Server

```typescript
// services/auth/server.ts
import { service, serve } from "@prisma/composer";
import { authContract } from "./contract";
import { SQL } from "bun";

const { db } = service.load(); // { url } — you construct client
const { jwtSecret, sessionTtl } = service.input();

const handler = serve(service, {
  rpc: {
    verify: async ({ token }) => {
      if (token.length === 0) return { ok: false, error: "Empty token" };
      // Your verification logic here
      return { ok: true, userId: "user_123" };
    },
    login: async ({ email, password }) => {
      // Use db.url to create your SQL client
      const sql = new SQL({ url: db.url });
      const user = await sql`SELECT * FROM users WHERE email = ${email}`;
      // ... authentication logic
      return { ok: true, token: "jwt_here" };
    }
  } satisfies typeof authContract // Compile-time exhaustive check
});

Bun.serve({ 
  port: service.port(), // Never process.env.PORT
  hostname: "0.0.0.0", 
  fetch: handler 
});
```

### Step 3: Wire It in a Module

```typescript
// modules/store/module.ts
import { module } from "@prisma/composer";
import { authModule } from "../auth";
import { storefrontService } from "./services/storefront";

export default module("store", ({ provision }) => {
  const auth = provision(authModule);
  
  provision(storefrontService, { 
    deps: { 
      auth: auth.rpc // Typed RPC client
    } 
  });
});
```

### Step 4: Consume the RPC

```typescript
// services/storefront/server.ts
const { auth } = service.load(); // { verify, login } — typed client

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

## Two Channels: Dependencies vs Input

Understanding this distinction is **critical** for correct architecture:

| Value Type | Declare With | Provide At | Read Via | Example |
|------------|--------------|------------|----------|---------|
| **Produced by another node** | `deps: { db: rawPostgres() }` | `provision()` wiring | `service.load()` | Database, RPC client, bucket |
| **Config or credential** | Field in `input` schema | `provision()` binding | `service.input()` | API keys, secrets, feature flags |

### Input Schema with Secrets

```typescript
import { z } from "zod";
import { secretString } from "@prisma/composer/arktype";

const inputSchema = z.object({
  // Regular config (arrives as string)
  apiVersion: z.string().default("v1"),
  
  // Credential (arrives as SecretString box)
  stripeKey: secretString(),
  
  // Conditional: secret only if billing enabled
  billingKey: z.union([secretString(), z.literal("disabled")])
});
```

### Binding at Provision

```typescript
import { envParam, envSecret } from "@prisma/composer-prisma-cloud";

provision(paymentService, {
  input: {
    apiVersion: "v2", // Literal
    stripeKey: envSecret("STRIPE_SECRET_KEY"), // Platform variable
    billingKey: envParam("BILLING_ENABLED") // Raw string from platform
  }
});
```

**Rules That Bite**:

1. **Secretness is enforced by validation** — literal where `SecretString` expected = deploy refusal
2. **`envParam` values arrive as raw strings** — bind to string fields only
3. **Absence is the schema's call** — unset env var = key omitted (legal only if schema allows)
4. **Reserved `port` is outside schema** — read via `service.port()`, never `process.env`
5. **Modules forward secrets without learning platform names** — declare `secrets: { key: secret() }` on boundary
6. **`input.apiKey.expose()` is the only way to a secret's value** — box redacts everywhere else

---

## Contracts and RPC

A **contract** is the typed interface through which services communicate:

```typescript
// services/auth/contract.ts
import { z } from "zod";

export const authContract = {
  verify: z.object({
    token: z.string()
  }).transform(async ({ token }) => {
    // This is just the type definition
    // Implementation is in serve()
    return { ok: true, userId: "user_123" };
  }),
  
  login: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }).transform(async ({ email, password }) => {
    return { ok: true, token: "jwt" };
  })
};
```

### Provider (Server)

```typescript
const handler = serve(service, {
  rpc: {
    verify: async ({ token }) => {
      // Exhaustive over contract methods at compile time
      return { ok: token.length > 0 };
    },
    login: async ({ email, password }) => {
      return { ok: true, token: "jwt" };
    }
  } satisfies typeof authContract // ← Compiler ensures all methods implemented
});
```

### Consumer (Client)

```typescript
const { auth } = service.load(); // { verify, login } — typed RPC client

// Calls travel as RPC over HTTP
const result = await auth.verify({ token: "abc123" });
```

### Built-In Behaviors (Do Not Reimplement)

1. **Service Keys**
   - Composer mints distinct unguessable key per consumer→provider binding
   - `serve()` returns `401` to anything else before handler runs
   - **Consequences**:
     - Don't build your own service-to-service auth
     - Don't `curl` deployed `/rpc/<method>` — unwired caller always gets `401`
     - Keys are per binding, service-scoped, rotated only by removing binding
     - Stored in deploy-owned `COMPOSER_*` variables (never hand-edit)

2. **Idempotency and Retries**
   - Every generated-client call carries `Idempotency-Key`
   - Dropped calls retry with backoff
   - `serve()` runs one call per key, replaying completed answer to late retries
   - **Every method is safely retryable** — no "is this idempotent" flag needed
   - Optional third argument: `(input, deps, ctx)` where `ctx.idempotencyKey: string | undefined`

---

## Builds Are Yours

**Critical**: You build, the framework assembles. Deploy copies your built output and never ships `node_modules`.

### Plain Server Process

```typescript
// service declaration
export default compute({
  name: "api",
  build: node({ 
    module: import.meta.url, 
    entry: "../dist/server.mjs" // Must be single self-contained ESM file
  })
});
```

**Rules**:

1. **Two services in one package = two separate builds** — single multi-entry build splits shared code into chunk neither output contains
2. **Directory build uses `dir` + `entry`** — `dir` relative to service module, `entry` file inside `dir`; `../` is error
3. **Tree must contain no symlinks** — packager rejects them, names the link, assembly fails
4. **Server must resolve siblings against `import.meta.url`**, not working directory

### Next.js Integration

```typescript
// prisma-composer.config.ts
import { prismaCloud, nextjsBuild } from "@prisma/composer-prisma-cloud";

export default {
  targets: [prismaCloud()],
  builds: [nextjsBuild({ module: import.meta.url, appDir: "./app" })]
};
```

```typescript
// Any page/action calling load() needs:
export const dynamic = 'force-dynamic';
// Runtime environment doesn't exist at build time
```

### Build Before Deploy

```bash
# ALWAYS do this first
bun build services/auth/server.ts --outdir dist --format esm

# Then deploy
prisma-composer deploy production
```

**Neither `deploy` nor `dev` builds for you.**

---

## Databases and Migrations

### Two Kinds of Postgres Dependency

| Type | Import From | Binding | Use Case |
|------|-------------|---------|----------|
| **`rawPostgres()`** | `@prisma/composer-prisma-cloud` | `{ url }` | You own the client |
| **`postgres()`** | `@prisma/composer-prisma-cloud/orm` | `{ url, client }` | Prisma ORM-typed database |

### Prisma ORM Flow

```typescript
// modules/catalog/module.ts
import { module } from "@prisma/composer";
import { postgres, dataContract } from "@prisma/composer-prisma-cloud/orm";
import { catalogData } from "./contract.prisma";

export default module("catalog", ({ provision }) => {
  const db = provision(postgres("catalog", {
    dataContract: dataContract(catalogData),
    prismaConfig: "./prisma.config.ts"
  }));
  
  provision(catalogService, {
    deps: { db } // { url, client } — compile-time checked queries
  });
});
```

### Migration Workflow (Deploys Are Replay-Only)

**Every schema change follows this loop**:

```bash
# 1. Edit contract.prisma
# 2. Regenerate contract artifacts
prisma contract emit

# 3. Author the migration (on empty graph = baseline)
prisma migration plan --name add_users_table

# 4. Commit migrations/ directory
git add migrations/

# 5. Deploy (replays whole path from empty)
prisma-composer deploy production
```

**If no authored path reaches target contract**:
- Deploy refuses with `MIGRATION_PATH_NOT_FOUND`
- Error message lists two ways out:
  1. Author the missing migration
  2. For local iteration only: `prisma db update`

**Never skip step 3 before deploy.**

---

## Deploy Model: Converge, Don't Script

### How Deploy Works

Deploy compares declared topology against recorded state and applies only the difference:

- ✅ Re-deploy with nothing changed = no-op
- ✅ Removing a node = removes its deployed resource
- ✅ Identical graph deploys everywhere (stages are environment names, not code)

### Prisma Cloud Target Requirements

```bash
# Only two environment variables needed
export PRISMA_SERVICE_TOKEN="pcs_..."
export PRISMA_WORKSPACE_ID="ws_..."

# No interactive login
prisma-composer deploy production
```

### Stages

A **stage** is an environment name chosen at deploy time:

```bash
prisma-composer deploy staging    # Creates/updates "staging" branch
prisma-composer deploy production # Creates/updates "production" branch
prisma-composer deploy feature-x  # Creates/updates "feature-x" branch
```

- On Prisma Cloud: App = one Project, stage = one Branch
- Each stage has own running services, empty database, configuration
- Stage name must be valid git ref name (invalid = hard error)

### Destroy

```bash
# Always requires explicit target
prisma-composer destroy staging        # ✅ Deletes staging branch + resources
prisma-composer destroy production     # ✅ Removes resources, keeps branch
prisma-composer destroy                # ❌ Error: bare destroy
prisma-composer destroy staging production # ❌ Error: naming both
```

**Key behaviors**:
- Destroying production removes resources inside production Branch, never Branch itself
- Once Project is empty, it's deleted (takes production Branch with it)
- Project holding another stage's resources is kept
- Destroy never creates anything (destroying never-deployed stage fails)

### The Engine: Alchemy

Deploy/destroy write results to generated, gitignored stack file, then run alchemy CLI:

```bash
# Generated file (never edit)
.prisma-composer/alchemy.run.ts

# Reproduce failures directly
alchemy deploy .prisma-composer/alchemy.run.ts
```

**Why this matters**:
1. Failures are bisectable through that file
2. Engine failure = `DEPLOY.ENGINE_FAILED` with exit code + reproduce command
3. **App must be built before destroy** (evaluating stack packages assembled bundles)
4. Alchemy is why `effect` pin exists (hoisted newer `effect` halts every command)

---

## Local Development

### The `dev` Command

```bash
# Build first (exactly like deploy)
bun build services/auth/server.ts --outdir dist --format esm

# Then run locally
prisma-composer dev
```

**Concepts That Surprise**:

1. **Runs same pipeline as deploy** — build first, watches built output, restarts service on build change
2. **Ctrl-C stops processes, leaves data up** — next `dev` is warm start
3. **Clean start is explicit opt-in flag** — wipes local instances and data
4. **`dev` does not print service logs** — use separate `log` command (read-only, follows merged logs)
5. **Unset secret = placeholder + warning** — only code path that spends it fails at external service
6. **Windows not supported yet**

### Dev vs Deploy Comparison

| Aspect | `dev` | `deploy` |
|--------|-------|----------|
| **Build required** | ✅ Yes | ✅ Yes |
| **Cloud credentials** | ❌ No | ✅ Yes |
| **Data persistence** | ✅ Local emulators | ✅ Cloud resources |
| **Log output** | ❌ Separate `log` command | ✅ Included in deploy report |
| **Secret handling** | Placeholder if unset | Fails if missing |
| **Watch mode** | ✅ Yes | ❌ No |

---

## Testing Strategies

### Testing Is an Environment Seam

A test is just another environment where you decide what `load()` and `input()` return.

| Goal | Use | Import From |
|------|-----|-------------|
| Test page/action/handler in isolation | `mockService` | `@prisma/composer/testing` |
| Run real boot + request path against fake dependency | `bootstrapService` | `@prisma/composer-prisma-cloud/testing` |

### Mock Service (Unit Testing)

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

**Wiring module substitution** (Vitest example):

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    mockFactory: () => mockService(authDeclaration, {
      deps: { db: { url: "mock" } },
      input: { jwtSecret: "test" }
    })
  }
});
```

### Bootstrap Service (Integration Testing)

```typescript
// tests/auth.integration.test.ts
import { bootstrapService } from "@prisma/composer-prisma-cloud/testing";
import { describe, it, expect, beforeEach, afterEach } from "bun:test";

describe("auth integration", () => {
  let service: ReturnType<typeof bootstrapService>;
  
  beforeEach(() => {
    service = bootstrapService(authDeclaration, {
      deps: { 
        db: { url: "postgresql://localhost:5432/test_db" } 
      },
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

**Gotchas**:

1. **`service.port` must be concrete** — entry self-listens, no OS-assigned port reported back
2. **No `close()`** — run each integration-test file in own process (bun test does)
3. **Next.js services take third argument** — boot thunk, resolved with `standaloneServerPath`
4. **Service with input schema takes `input` in config** — binding exactly like `provision()`, run through real serialize/read path

### Shipping Fakes

```typescript
// packages/database/fake.ts — outside src/
import { dataContract } from "@prisma/composer-prisma-cloud/orm";
import { catalogData } from "./contract.prisma";

export const fakeCatalogDb = {
  url: "postgresql://fake:5432/test",
  client: {
    // In-memory implementation sharing same contract
    query: async (sql: string) => []
  }
};
```

---

## Building Blocks and Extensions

### First-Party Modules

All import from `@prisma/composer-prisma-cloud` subpaths:

| Import | Path | Provisions | Exposes |
|--------|------|------------|---------|
| **Cron** | `/cron` | Always-on scheduler firing your schedule at runner service | nothing |
| **Storage** | `/storage` | S3-backed blob store (own Postgres + minted credentials) | `store` |
| **Streams** | `/streams` | Durable append-only event streams over a `store` | `streams` |
| **Auth** | `/auth` | Signup, login, sessions, JWT verification (Better Auth, own database) | `api`, `session`, `admin` |
| **Email** | `/email` | Transactional email with stored outbox (own service + database) | `send`, `outbox` |

### Raw Bucket

```typescript
import { bucket } from "@prisma/composer-prisma-cloud";

// Dependency end receives:
// { url, bucket, accessKeyId, secretAccessKey }
// Shape-compatible with /storage's s3() dependency
```

### Extensions Ecosystem

- Published on npm as `prisma-composer-*`
- Ecosystem is new: verify package exists on npm before reaching for it
- Today: blocks above + your own Modules = whole set

---

## Troubleshooting

### Failure Modes Quick Reference

| Symptom | Cause | Solution |
|---------|-------|----------|
| **Every command halts on `effect` version conflict** | Another dependency floated newer `effect`, package manager hoisted it | Pin whole `effect` constellation in `package.json` `overrides` (see below) |
| **Deployed `/rpc/<method>` returns `401`** | Not a broken deploy — service keys enforced | Debug through consumer, or locally where nothing enforced |
| **Scale-to-zero closes idle DB connections** | Persistent client crashes into 502 restart loop | Use small, reconnect-friendly pool: `new SQL({ url, max: 1, idleTimeout: 10 })`; log `uncaughtException`/`unhandledRejection` |
| **Cold starts reset service-to-service connections** | Call into scaled-to-zero service gets `ECONNRESET` | Retry the call |
| **Service unreachable from outside** | Bound to loopback instead of `0.0.0.0` | Bind `0.0.0.0` — platform routes external HTTP to VM |
| **SSE tail delivers nothing, times out at 60s** | Ingress buffers streaming responses | Don't build on streamed HTTP responses |
| **Name passes `tsc`, fails at load** | Provision ids/names must be ASCII letters+digits only (`[A-Za-z0-9]`) | No hyphens in names; root module's name exempt; provision id ≥3 chars; service name ≠ enclosing Module name (or give explicit `id`) |
| **`MIGRATION_PATH_NOT_FOUND`** | No authored migration path reaches target contract | Author missing migration; never skip `prisma migration plan` step |
| **First timestamp read fails** | Date/time columns hand back `Temporal.*` values; Bun/stock Node ship no global `Temporal` | Provide global at server entry: `import 'temporal-polyfill/global'` or use string column types |

### Pinning `effect` Constellation

```json
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

(Use `resolutions` for yarn, `pnpm.overrides` for pnpm)

### Connection Contract Refusals

```text
Connection input "auth.db" declares param "url", but its producer "db" did not
supply it — the producer's outputs carry [host].
```

**This is deploy-time refusal, not broken deploy**. Fix whichever end is wrong; don't mark param `optional` unless absent really is legal.

### Driving Deploys from Code

```typescript
import { deploy, destroy, dev, log } from "@prisma/composer/control";

const result = await deploy({ stage: "production" });

if (!result.ok) {
  switch (result.failure.code) {
    case "ASSEMBLE.BUILD_FAILED":
      // Handle build failure
      break;
    case "DEPLOY.ENGINE_FAILED":
      // Handle engine failure
      break;
    case "DEPS.EFFECT_VERSION_CONFLICT":
      // Handle effect conflict
      break;
  }
}
```

Failures come back as `{ ok: false, failure }` with dotted `failure.code` from closed registry. Branch on code, not message.

---

## Common Patterns

### Pattern 1: Multi-Service Module

```typescript
// modules/ecommerce/module.ts
import { module } from "@prisma/composer";
import { postgres } from "@prisma/composer-prisma-cloud/orm";

export default module("ecommerce", ({ provision }) => {
  const db = provision(postgres("ecommerce", { /* ... */ }));
  
  const products = provision(productsService, {
    deps: { db }
  });
  
  const orders = provision(ordersService, {
    deps: { db, products: products.rpc }
  });
  
  const payments = provision(paymentsService, {
    deps: { db, orders: orders.rpc }
  });
  
  return { products, orders, payments };
});
```

### Pattern 2: Secret Forwarding

```typescript
// modules/auth/module.ts
import { module, secret } from "@prisma/composer";

export default module("auth", ({ provision }) => {
  provision(authService, {
    input: {
      jwtSecret: secret() // Forwarded without learning platform name
    }
  });
  
  return { api: authService.rpc };
});

// Parent binds real source
provision(authModule, {
  input: {
    jwtSecret: envSecret("JWT_SECRET")
  }
});
```

### Pattern 3: Conditional Dependencies

```typescript
// services/analytics/service.ts
export default compute({
  name: "analytics",
  deps: {
    // Optional: only wired if analytics enabled
    clickhouse: rawPostgres().optional()
  },
  input: {
    analyticsEnabled: z.boolean()
  }
});

// server.ts
const { clickhouse } = service.load();
const { analyticsEnabled } = service.input();

if (analyticsEnabled && clickhouse) {
  // Use clickhouse.url
}
```

### Pattern 4: Shared Contract Library

```typescript
// packages/contracts/src/auth.ts
import { z } from "zod";

export const authContract = {
  verify: z.object({ token: z.string() }),
  login: z.object({ email: z.string().email(), password: z.string() })
};

// services/auth/contract.ts — re-export
export { authContract } from "@myorg/contracts/auth";

// services/storefront/consumer.ts — same import
import { authContract } from "@myorg/contracts/auth";
```

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| Read `process.env` anywhere | Use `service.input()` for all config |
| Build your own service-to-service auth | Rely on Composer's service keys |
| `curl` deployed `/rpc/<method>` directly | Debug through consumer or locally |
| Skip `prisma migration plan` before deploy | Always author migrations, then deploy |
| Use hyphens in service/module names | Use `[A-Za-z0-9]` only |
| Bind to `localhost` or `127.0.0.1` | Bind to `0.0.0.0` |
| Build SSE/streaming responses | Use polling or webhooks instead |
| Create persistent DB clients without reconnection logic | Use small pool + `uncaughtException` logging |
| Import `@prisma/composer` in app code (except entry points) | Keep imports to service declarations only |
| Edit `.prisma-composer/alchemy.run.ts` | It's generated output, not configuration |

---

## What Composer Doesn't Do Yet

Name the gap instead of inventing an API:

1. **No interactive auth in CLI** — deploys authenticate only via static `PRISMA_SERVICE_TOKEN`; no `login` flow
2. **No in-memory contract bindings** — dependency can't be wired to co-located handler without HTTP; use `bootstrapService` with loopback fake
3. **RPC over HTTP is only contract kind** — no gRPC, WebSocket, or streaming contracts

**For anything else missing**:
- Check `examples/` in prisma/composer repo
- Review `docs/design/10-domains/` and `docs/design/90-decisions/`
- File an issue rather than guessing

---

## Quick Reference

### Essential Commands

```bash
# Development
prisma-composer dev              # Run locally with emulators
prisma-composer log              # Follow merged logs (read-only)

# Deployment
prisma-composer deploy <stage>   # Deploy to stage (creates/updates branch)
prisma-composer destroy <stage>  # Destroy stage (explicit target required)

# Database
prisma contract emit             # Regenerate contract.json + contract.d.ts
prisma migration plan --name <slug>  # Author migration
prisma db update                 # Update local DB (iteration only, not for deploy)

# Help
prisma-composer <command> --help # Discover flags and options
```

### File Structure
my-app/
├── prisma-composer.config.ts # Deploy config (extensions, builds, state backend)
├── tsconfig.json # TypeScript config (allowImportingTsExtensions: true)
├── package.json # Dependencies + effect overrides
├── .prisma-composer/ # Generated (gitignored)
│ └── alchemy.run.ts # Stack file for deploy/destroy
├── modules/
│ └── store/
│ ├── module.ts # Root module handed to CLI
│ └── catalog/
│ ├── module.ts
│ ├── contract.prisma
│ ├── contract.json # Generated by contract emit
│ ├── contract.d.ts # Generated by contract emit
│ └── migrations/ # Committed migrations
├── services/
│ └── auth/
│ ├── service.ts # compute() declaration
│ ├── server.ts # Built entry (Bun.serve, etc.)
│ └── contract.ts # RPC contract definition
└── dist/ # Built output (your bundler's responsibility)
└── server.mjs

text

### Import Paths

```typescript
// Core authoring (no platform coupling)
import { module, compute, node } from "@prisma/composer";

// Prisma Cloud target + resources
import { 
  prismaCloud, 
  rawPostgres, 
  bucket, 
  envSecret, 
  envParam 
} from "@prisma/composer-prisma-cloud";

// ORM vocabulary (separate subpath)
import { 
  postgres, 
  dataContract 
} from "@prisma/composer-prisma-cloud/orm";

// Shared modules (cron, storage, streams, auth, email)
import { cron } from "@prisma/composer-prisma-cloud/cron";
import { storage } from "@prisma/composer-prisma-cloud/storage";
import { streams } from "@prisma/composer-prisma-cloud/streams";
import { auth } from "@prisma/composer-prisma-cloud/auth";
import { email } from "@prisma/composer-prisma-cloud/email";

// Testing
import { mockService } from "@prisma/composer/testing";
import { bootstrapService } from "@prisma/composer-prisma-cloud/testing";

// Programmatic control
import { deploy, destroy, dev, log } from "@prisma/composer/control";
```

---

## Next Steps

1. **Build your first service** — follow [Your First Service](#your-first-service)
2. **Explore examples** — `examples/` in prisma/composer repo has complete patterns
3. **Join the community** — Prisma Discord, GitHub discussions
4. **Report issues** — File bugs/feature requests in prisma/composer repo
5. **Stay updated** — Watch releases at <https://github.com/prisma/composer>

---

## Version Notes

**This skill targets `@prisma/composer` v0.17.0**. Breaking changes in future versions:

- Check `CHANGELOG.md` in prisma/composer repo
- Update `effect` constellation pins together
- Test migrations on staging before production

**Last updated**: September 6, 2026

---

## Support & Resources

| Resource | URL |
|----------|-----|
| Official Docs | <https://www.prisma.io/docs/composer> |
| GitHub Repo | <https://github.com/prisma/composer> |
| Examples | <https://github.com/prisma/composer/tree/main/examples> |
| Design Docs | <https://github.com/prisma/composer/tree/main/docs/design> |
| Discord Community | <https://pris.ly/discord> |
| npm Package | <https://www.npmjs.com/package/@prisma/composer> |

---

> **Remember**: Typecheck → Build → Deploy. Don't use the cloud to find out whether the wiring is correct.
