#!/usr/bin/env node
/**
 * db:neon:preflight — READ-ONLY production database reconciliation gate.
 * Never creates, alters, drops or deletes anything.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const migrationsDir = resolve(root, "supabase/migrations");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("PREFLIGHT BLOCKED: DATABASE_URL is required.");
  process.exit(1);
}

function query(sql) {
  const result = spawnSync("psql", [databaseUrl, "-X", "-v", "ON_ERROR_STOP=1", "-tA", "-c", sql], { encoding: "utf8" });
  if (result.status !== 0) {
    console.error((result.stderr ?? "").trim());
    process.exit(1);
  }
  return (result.stdout ?? "").trim();
}

const migrations = readdirSync(migrationsDir).filter((f) => /^\d{14}_[a-z0-9_]+\.sql$/i.test(f)).sort();
const migrationChecksum = (file) => createHash("sha256").update(readFileSync(resolve(migrationsDir, file))).digest("hex");
const canonical = ["tenants", "profiles", "sessions", "memories", "audit_events", "bookpi_ledger"];
const tables = query(`select table_name from information_schema.tables where table_schema='public' and table_name = any(array['tenants','profiles','sessions','memories','audit_events','bookpi_ledger','isabella_learning_state','isabella_schema_migrations']) order by table_name;`).split("\n").filter(Boolean);
const missingCanonical = canonical.filter((name) => !tables.includes(name));
const historyExists = query("select exists(select 1 from information_schema.tables where table_schema='public' and table_name='isabella_schema_migrations');") === "t";
const applied = new Map();
if (historyExists) {
  const rows = query("select version || E'\\t' || filename || E'\\t' || checksum_sha256 from public.isabella_schema_migrations order by version;").split("\n").filter(Boolean);
  for (const row of rows) {
    const [version, filename, checksum] = row.split("\t");
    if (version && filename && checksum) applied.set(version, { filename, checksum });
  }
}

const drift = [];
for (const file of migrations) {
  const version = file.slice(0, 14);
  const entry = applied.get(version);
  if (entry && (entry.filename !== file || entry.checksum !== migrationChecksum(file))) drift.push(file);
}
const pending = migrations.filter((file) => !applied.has(file.slice(0, 14)));

const memoryColumns = query(`select column_name from information_schema.columns where table_schema='public' and table_name='memories' and column_name = any(array['tenant_id','user_id','sensitivity','purpose','consent','provenance','content_hash','expires_at']) order by column_name;`).split("\n").filter(Boolean);
const expectedMemoryColumns = ["tenant_id","user_id","sensitivity","purpose","consent","provenance","content_hash","expires_at"];
const missingMemoryColumns = expectedMemoryColumns.filter((c) => !memoryColumns.includes(c));

const functions = query(`select routine_name from information_schema.routines where routine_schema='public' and routine_name = any(array['current_tenant_id','current_user_role','current_user_id']) order by routine_name;`).split("\n").filter(Boolean);
const missingFunctions = ["current_tenant_id","current_user_role","current_user_id"].filter((f) => !functions.includes(f));

const policies = query(`select policyname from pg_policies where schemaname='public' and tablename='memories' order by policyname;`).split("\n").filter(Boolean);
const expectedPolicies = ["Memory tenant read boundary","Memory principal-bound insert","Memory principal-bound update","Memory principal-bound delete"];
const missingPolicies = expectedPolicies.filter((p) => !policies.includes(p));
const legacyPolicyPresent = policies.includes("Tenant multi-tenant isolation policy for memories");

const hardeningPending = pending.includes("20260909133000_hardening_rls_memory_capabilities.sql");
const memoryAlignmentPending = pending.includes("20260903140000_align_memories_sessions_rls.sql");
const issues = [];

if (drift.length) issues.push(`migration checksum/history drift: ${drift.join(", ")}`);
if (!historyExists && missingCanonical.length < canonical.length) issues.push("canonical schema exists but migration ledger is absent: baseline reconciliation required");
if (historyExists && applied.size === 0 && missingCanonical.length < canonical.length) issues.push("migration ledger is empty while canonical schema exists");
if (missingCanonical.length && !pending.includes("20260831122458_init_schema.sql")) issues.push(`missing canonical tables with no pending init migration: ${missingCanonical.join(", ")}`);
if (missingMemoryColumns.length && !memoryAlignmentPending) issues.push(`missing memories contract columns with no pending alignment migration: ${missingMemoryColumns.join(", ")}`);
if (missingFunctions.length && !hardeningPending) issues.push(`missing security helper functions with no pending hardening migration: ${missingFunctions.join(", ")}`);
if (missingPolicies.length && !hardeningPending) issues.push(`missing hardened memories policies with no pending hardening migration: ${missingPolicies.join(", ")}`);
if (legacyPolicyPresent && !hardeningPending) issues.push("legacy broad memories RLS policy is present without its hardening migration pending");

console.log("=== ISABELLA / NEON READ-ONLY PREFLIGHT ===");
console.log(`repository migrations: ${migrations.length}`);
console.log(`ledger: ${historyExists ? `${applied.size} applied` : "ABSENT"}`);
console.log(`pending: ${pending.length}`);
console.log(`canonical tables: ${canonical.length - missingCanonical.length}/${canonical.length}`);
console.log(`memory contract columns: ${expectedMemoryColumns.length - missingMemoryColumns.length}/${expectedMemoryColumns.length}`);
console.log(`security helper functions: ${3 - missingFunctions.length}/3`);
console.log(`hardened memory policies: ${expectedPolicies.length - missingPolicies.length}/${expectedPolicies.length}`);
console.log(`legacy broad memory policy: ${legacyPolicyPresent ? (hardeningPending ? "PRESENT — scheduled for transactional replacement" : "PRESENT — BLOCK") : "absent"}`);
if (pending.length) pending.forEach((file) => console.log(`PENDING ${file} sha256=${migrationChecksum(file)}`));

if (issues.length) {
  console.error("\nPREFLIGHT BLOCKED:");
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(2);
}

console.log("\nPREFLIGHT PASS: no detected reconciliation blocker.");
console.log("Next step: npm run db:migrate -- psql --plan");
