#!/usr/bin/env node
/**
 * db:neon-preflight — READ-ONLY production database reconciliation gate.
 * It never creates, alters, drops or deletes anything.
 */
import { spawnSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("PREFLIGHT BLOCKED: DATABASE_URL is required.");
  process.exit(1);
}

function query(sql) {
  const result = spawnSync(
    "psql",
    [databaseUrl, "-X", "-v", "ON_ERROR_STOP=1", "-tA", "-c", sql],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    console.error((result.stderr ?? "").trim());
    process.exit(1);
  }
  return (result.stdout ?? "").trim();
}

const requiredTables = ["tenants", "profiles", "sessions", "memories", "audit_events", "bookpi_ledger"];
const tables = query(`select table_name from information_schema.tables where table_schema='public' and table_name = any(array['tenants','profiles','sessions','memories','audit_events','bookpi_ledger','isabella_learning_state','isabella_schema_migrations']) order by table_name;`).split("\n").filter(Boolean);
const missingCanonical = requiredTables.filter((name) => !tables.includes(name));

const history = query(`select exists(select 1 from information_schema.tables where table_schema='public' and table_name='isabella_schema_migrations');`);
const historyExists = history === "t";
const historyRows = historyExists ? Number(query("select count(*) from public.isabella_schema_migrations;")) : 0;

const columns = query(`select table_name || '.' || column_name from information_schema.columns where table_schema='public' and table_name='memories' and column_name = any(array['tenant_id','user_id','sensitivity','purpose','consent','provenance','content_hash','expires_at']) order by column_name;`).split("\n").filter(Boolean);
const requiredMemoryColumns = ["tenant_id","user_id","sensitivity","purpose","consent","provenance","content_hash","expires_at"].map((c) => `memories.${c}`);
const missingMemoryColumns = requiredMemoryColumns.filter((c) => !columns.includes(c));

const functions = query(`select routine_name from information_schema.routines where routine_schema='public' and routine_name = any(array['current_tenant_id','current_user_role','current_user_id']) order by routine_name;`).split("\n").filter(Boolean);
const missingFunctions = ["current_tenant_id","current_user_role","current_user_id"].filter((f) => !functions.includes(f));

const policies = query(`select policyname from pg_policies where schemaname='public' and tablename='memories' order by policyname;`).split("\n").filter(Boolean);
const expectedPolicies = ["Memory tenant read boundary","Memory principal-bound insert","Memory principal-bound update","Memory principal-bound delete"];
const missingPolicies = expectedPolicies.filter((p) => !policies.includes(p));
const legacyPolicyPresent = policies.includes("Tenant multi-tenant isolation policy for memories");

const issues = [];
if (missingCanonical.length) issues.push(`missing canonical tables: ${missingCanonical.join(", ")}`);
if (missingMemoryColumns.length) issues.push(`missing memory columns: ${missingMemoryColumns.join(", ")}`);
if (missingFunctions.length) issues.push(`missing helper functions: ${missingFunctions.join(", ")}`);
if (missingPolicies.length) issues.push(`missing memory policies: ${missingPolicies.join(", ")}`);
if (legacyPolicyPresent) issues.push("legacy broad memories RLS policy is still present");
if (historyExists && historyRows === 0 && tables.some((t) => requiredTables.includes(t))) issues.push("migration ledger is empty while canonical schema exists");

console.log("=== ISABELLA / NEON READ-ONLY PREFLIGHT ===");
console.log(`canonical tables: ${requiredTables.length - missingCanonical.length}/${requiredTables.length}`);
console.log(`memories contract columns: ${requiredMemoryColumns.length - missingMemoryColumns.length}/${requiredMemoryColumns.length}`);
console.log(`security helper functions: ${3 - missingFunctions.length}/3`);
console.log(`memory RLS policies: ${expectedPolicies.length - missingPolicies.length}/${expectedPolicies.length}`);
console.log(`migration ledger: ${historyExists ? `present (${historyRows} rows)` : "ABSENT"}`);
console.log(`legacy broad memory policy: ${legacyPolicyPresent ? "PRESENT — BLOCK" : "absent"}`);

if (issues.length) {
  console.error("\nPREFLIGHT BLOCKED:");
  issues.forEach((issue) => console.error(`- ${issue}`));
  console.error("\nNo production migration should be authorized until these conditions are reconciled.");
  process.exit(2);
}

console.log("\nPREFLIGHT PASS: no detected schema/RLS/history blocker.");
console.log("Next safe step: npm run db:migrate -- psql --plan");
