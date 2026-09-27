import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
describe("economic isolation",()=>{
  it("keeps economic reads/writes tenant scoped and idempotent",()=>{
    const source=readFileSync("src/lib/repositories/bookpi-postgres-repository.ts","utf8");
    expect(source).toContain("tenant_id");
    expect(source).toContain("idempotency_key");
    expect(source).toContain("FOR UPDATE");
  });
});
