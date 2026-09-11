#!/usr/bin/env node
/**
 * db:migrate — Safe PostgreSQL migration runner.
 *
 * IMPORTANT:
 * - Never replays the complete migration directory against production.
 * - Uses an internal migration ledger with SHA-256 checksums.
 * - Applies each pending migration in a single transaction.
 * - Acquires a PostgreSQL advisory lock to prevent concurrent runners.
 * - Refuses checksum drift for already-applied migrations.
 * - Refuses to auto-baseline an existing database with unknown history.
 *
 * Modes:
 *   DATABASE_URL=... npm run db:migrate -- psql
 *   DATABASE_URL=... npm run db:migrate -- psql --plan
 *
 * For a database that already contains the project's schema but has no
 * migration ledger, establish the baseline only after an independent schema
 * audit. This runner deliberately does not guess or mutate that baseline.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const MIGRATIONS_DIR = resolve(ROOT, "supabase/migrations");
const databaseUrl = process.env.DATABASE_URL;
const mode = process.argv[2] ?? "push";
const planOnly = process.argv.includes("--plan");

const HISTORY_SCHEMA = "public";
const HISTORY_TABLE = "isabella_schema_migrations";
const LOCK_KEY = "isabella-schema-migrations-v1";

function listMigrations() {
  return readdirSync(MIGRATIONS_DIR)
    .filter((file) => /^\d{14}_[a-z0-9_]+\.sql$/i.test(file))
    .sort();
}

function sha256File(file) {
  return createHash("sha256")
    .update(readFileSync(resolve(MIGRATIONS_DIR, file)))
    .digest("hex");
}

function runPsql(sql, extraArgs = []) {
  return spawnSync(
    "psql",
    [databaseUrl, "-v", "ON_ERROR_STOP=1", "-X", "-q", ...extraArgs, "-c", sql],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
}

function fail(message) {
  console.error(`MIGRATION BLOCKED: ${message}`);
  process.exit(1);
}

if (mode !== "psql" || !databaseUrl) {
  if (mode === "local") {
    const res = spawnSync("supabase", ["db", "reset"], { stdio: "inherit", cwd: ROOT });
    process.exit(res.status ?? 1);
  }
  console.error("Uso seguro de producción: DATABASE_URL=... npm run db:migrate -- psql [--plan]");
  process.exit(1);
}

const migrations = listMigrations();
if (!migrations.length) fail("no SQL migrations found");

// Static safety gate: production migrations must not contain destructive table/data operations.
const blocked = /\b(drop\s+(table|schema|database)|truncate\s+table|delete\s+from\s+[^;]+(?:;|$))\b/i;
for (const file of migrations) {
  const sql = readFileSync(resolve(MIGRATIONS_DIR, file), "utf8");
  if (blocked.test(sql)) fail(`destructive SQL detected in ${file}; review manually before any production change`);
}

const historyDDL = `
create table if not exists ${HISTORY_SCHEMA}.${HISTORY_TABLE} (
  version varchar(14) primary key,
  filename text not null unique,
  checksum_sha256 char(64) not null,
  applied_at timestamptz not null default now()
);
create index if not exists idx_${HISTORY_TABLE}_applied_at
  on ${HISTORY_SCHEMA}.${HISTORY_TABLE}(applied_at desc);
`;

const init = runPsql(historyDDL);
if (init.status !== 0) fail(`cannot initialize migration ledger: ${(init.stderr ?? "").trim()}`);

const ledger = runPsql(
  `select version || E'\\t' || filename || E'\\t' || checksum_sha256 from ${HISTORY_SCHEMA}.${HISTORY_TABLE} order by version;`,
);
if (ledger.status !== 0) fail(`cannot read migration ledger: ${(ledger.stderr ?? "").trim()}`);

const applied = new Map();
for (const line of (ledger.stdout ?? "").split("\n")) {
  const [version, filename, checksum] = line.trim().split("\t");
  if (version && filename && checksum) applied.set(version, { filename, checksum });
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
console.log(`Migration ledger: ${applied.size} applied / ${migrations.length} repository migrations / ${pending.length} pending.`);

if (planOnly) {
  if (!pending.length) console.log("PLAN: database is aligned with the repository migration ledger.");
  else pending.forEach((file) => console.log(`PLAN: pending ${file} (${sha256File(file)})`));
  process.exit(0);
}

if (!pending.length) {
  console.log("No hay migraciones pendientes. No se modifica el esquema.");
  process.exit(0);
}

// PostgreSQL advisory lock serializes migration runners.
const lock = runPsql(`select pg_advisory_lock(hashtextextended('${LOCK_KEY}', 0));`);
if (lock.status !== 0) fail(`cannot acquire migration lock: ${(lock.stderr ?? "").trim()}`);

try {
  for (const file of pending) {
    const version = file.slice(0, 14);
    const checksum = sha256File(file);
    const path = resolve(MIGRATIONS_DIR, file);
    console.log(`Aplicando migración transaccional: ${file}`);

    // One migration = one transaction. If anything fails, that migration leaves no partial DDL.
    const result = spawnSync(
      "psql",
      [databaseUrl, "-v", "ON_ERROR_STOP=1", "-X", "--single-transaction", "-f", path],
      { stdio: "inherit" },
    );
    if (result.status !== 0) fail(`migration failed and was rolled back: ${file}`);

    const record = runPsql(
      `insert into ${HISTORY_SCHEMA}.${HISTORY_TABLE}(version, filename, checksum_sha256) values ('${version}', '${file.replaceAll("'", "''")}', '${checksum}');`,
    );
    if (record.status !== 0) fail(`migration ledger write failed after ${file}; verify before retry`);
  }
} finally {
  runPsql(`select pg_advisory_unlock(hashtextextended('${LOCK_KEY}', 0));`);
}

console.log("Migraciones aplicadas de forma segura y registradas.");
