export const SCHEMA_TABLES = [
  {
    name: "isabella_memories",
    scope: "tenant/session",
    purpose: "Tenant-scoped hierarchical memory.",
  },
  {
    name: "isabella_audit_logs",
    scope: "tenant",
    purpose: "Append-only governance and audit events.",
  },
  { name: "isabella_decisions", scope: "tenant", purpose: "Policy and decision records." },
  { name: "isabella_tool_runs", scope: "tenant", purpose: "Authorized tool execution outcomes." },
] as const;

export const ISABELLA_SQL_MIGRATION = `
create table if not exists isabella_memories (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  scope text not null default 'session',
  content jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists isabella_memories_tenant_scope_idx
  on isabella_memories (tenant_id, scope, created_at desc);

create table if not exists isabella_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists isabella_audit_logs_tenant_created_idx
  on isabella_audit_logs (tenant_id, created_at desc);

create table if not exists isabella_decisions (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  decision jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists isabella_tool_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  tool_name text not null,
  status text not null,
  result jsonb,
  created_at timestamptz not null default now()
);
`;
