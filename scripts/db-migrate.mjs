#!/usr/bin/env node
/**
 * db:migrate — Safe PostgreSQL migration runner for Neon/production.
 *
 * Guarantees:
 * - Never blindly replays the whole migration directory.
 * - Uses a version + SHA-256 ledger.
 * - Applies all pending migrations in ONE PostgreSQL transaction.
 * - Uses a transaction-scoped advisory lock.
 * - Refuses checksum drift.
 * - Refuses to guess the history of an existing production schema.
 * - No DROP/TRUNCATE/DELETE migration is accepted by the production runner.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const MIGRATIONS_DIR = resolve(ROOT, "supabase/migrations");
const databaseUrl = process.env.DATABASE_URL;
const mode = process.argv[2] ?? "push";
const planOnly = process.argv.includes("--plan");

const HISTORY_TABLE = "public.isabella_schema_migrations";
const LOCK_KEY = "isabella-schema-migrations-v2";
const CANONICAL_TABLES = ["tenants", "profiles", "sessions", "memories", "audit_events", "bookpi_ledger"];

function listMigrations() {
  return readdirSync(MIGRATIONS_DIR)
    .filter((file) => /^\d{14}_[a-z0-9_]+\.sql$/i.test(file))
    .sort();
}

function sha256File(file) {
  return createHash("sha256").update(readFileSync(resolve(MIGRATIONS_DIR, file))).digest("hex");
}

function psql(args, options = {}) {
  return spawnSync("psql", [databaseUrl, "-v", "ON_ERROR_STOP=1", "-X", ...args], {
    encoding: "utf8",
    ...options,
  });
}

function fail(message) {
  console.error(`MIGRATION BLOCKED: ${message}`);
  process.exit(1);
}

if (mode === "local") {
  const res = spawnSync("supabase", ["db", "reset"], { stdio: "inherit", cwd: ROOT });
  process.exit(res.status ?? 1);
}

if (mode !== "psql" || !databaseUrl) {
  console.error("Producción/Neon: DATABASE_URL=... npm run db:migrate -- psql [--plan]");
  process.exit(1);
}

const migrations = listMigrations();
if (!migrations.length) fail("no SQL migrations found");

// Conservative production safety gate. DROP POLICY is intentionally allowed;
// destructive table/data operations are not part of the automatic migration path.
const destructive = /\b(drop\s+(table|schema|database)|truncate\s+(table\s+)?|delete\s+from)\b/i;
for (const file of migrations) {
  if (destructive.test(readFileSync(resolve(MIGRATIONS_DIR, file), "utf8"))) {
    fail(`destructive SQL detected in ${file}; automatic production migration is forbidden`);
  }
}

// Read state without creating or changing anything.
const state = psql(["-tAc", `select
  exists(select 1 from information_schema.tables where table_schema='public' and table_name='isabella_schema_migrations') as history_exists,
  (select count(*) from information_schema.tables where table_schema='public' and table_name = any(array['tenants','profiles','sessions','memories','audit_events','bookpi_ledger'])) as canonical_count;`]);
if (state.status !== 0) fail(`cannot inspect database: ${(state.stderr ?? "").trim()}`);

const [historyExistsRaw, canonicalCountRaw] = (state.stdout ?? "").trim().split(/\s*\|\s*/);
const historyExists = String(historyExistsRaw).trim() === "t";
const canonicalCount = Number(String(canonicalCountRaw).trim());

if (!historyExists && canonicalCount > 0) {
  fail(
    `existing schema detected (${canonicalCount}/${CANONICAL_TABLES.length} canonical tables) but migration history is absent. ` +
    "Automatic baseline is disabled to prevent collateral changes. Run an explicit schema reconciliation/baseline audit first.",
  );
}

if (!historyExists) {
  console.log("No migration ledger and no canonical production schema detected: initial controlled migration is eligible.");
}

// Obtain the ledger only when it exists.
const applied = new Map();
if (historyExists) {
  const ledger = psql(["-tAc", `select version || E'\\t' || filename || E'\\t' || checksum_sha256 from ${HISTORY_TABLE} order by version;`]);
  if (ledger.status !== 0) fail(`cannot read migration ledger: ${(ledger.stderr ?? "").trim()}`);
  for (const line of (ledger.stdout ?? "").split("\n")) {
    const [version, filename, checksum] = line.trim().split("\t");
    if (version && filename && checksum) applied.set(version, { filename, checksum });
  }
  if (applied.size === 0 && canonicalCount > 0) {
    fail("migration ledger exists but is empty while the canonical schema exists; refusing to infer history");
  }
}

for (const file of migrations) {
  const version = file.slice(0, 14);
  const checksum = sha256File(file);
  const existing = applied.get(version);
  if (existing && (existing.filename !== file || existing.checksum !== checksum)) {
    fail(`checksum/history drift for ${file}; recorded=${existing.filename}:${existing.checksum} current=${checksum}`);
  }
}

const pending = migrations.filter((file) => !applied.has(file.slice(0, 14)));
console.log(`Ledger: ${applied.size} applied / ${migrations.length} repository migrations / ${pending.length} pending.`);

if (planOnly) {
  if (!pending.length) console.log("PLAN: database schema is aligned with the repository ledger.");
  else pending.forEach((file) => console.log(`PLAN: pending ${file} sha256=${sha256File(file)}`));
  process.exit(0);
}

if (!pending.length) {
  console.log("No hay migraciones pendientes. No se modifica el esquema.");
  process.exit(0);
}

// Build ONE transaction. The advisory lock is transaction-scoped, so it cannot
// be accidentally lost between Node/psql processes.
const workDir = mkdtempSync(resolve(tmpdir(), "isabella-migrate-"));
const transactionFile = resolve(workDir, "migration-batch.sql");
const chunks = [
  "select pg_advisory_xact_lock(hashtextextended('isabella-schema-migrations-v2', 0));",
  `create table if not exists ${HISTORY_TABLE} (\n` +
    "version varchar(14) primary key,\n" +
    "filename text not null unique,\n" +
    "checksum_sha256 char(64) not null,\n" +
    "applied_at timestamptz not null default now()\n" +
    ");",
  `create index if not exists idx_isabella_schema_migrations_applied_at on ${HISTORY_TABLE}(applied_at desc);`,
];

for (const file of pending) {
  const version = file.slice(0, 14);
  const checksum = sha256File(file);
  chunks.push(readFileSync(resolve(MIGRATIONS_DIR, file), "utf8"));
  chunks.push(
    `insert into ${HISTORY_TABLE}(version, filename, checksum_sha256) values ` +
      `('${version}', '${file.replaceAll("'", "''")}', '${checksum}');`,
  );
}

writeFileSync(transactionFile, `${chunks.join("\n\n")}\n`, "utf8");
console.log(`Aplicando ${pending.length} migración(es) en una sola transacción PostgreSQL...`);

try {
  const result = psql(["--single-transaction", "-f", transactionFile], { stdio: "inherit" });
  if (result.status !== 0) fail("transaction failed; PostgreSQL rolled back the complete migration batch");
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

console.log("Migración completada: esquema y ledger quedaron confirmados en la misma transacción.");
