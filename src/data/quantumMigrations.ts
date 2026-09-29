export const QUANTUM_SCHEMA_TABLES = [
  "quantum_devices",
  "quantum_jobs",
  "quantum_telemetry",
] as const;

export const QUANTUM_SQL_MIGRATION = `
create table if not exists quantum_devices (
  id text primary key,
  provider text not null,
  status text not null default 'unknown',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists quantum_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  device_id text references quantum_devices(id),
  status text not null,
  payload jsonb not null default '{}'::jsonb,
  result jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create table if not exists quantum_telemetry (
  id uuid primary key default gen_random_uuid(),
  device_id text references quantum_devices(id),
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);
`;

export const QUANTUM_SQL_INDEXES = `
create index if not exists quantum_jobs_tenant_created_idx
  on quantum_jobs (tenant_id, created_at desc);
create index if not exists quantum_telemetry_device_recorded_idx
  on quantum_telemetry (device_id, recorded_at desc);
`;
