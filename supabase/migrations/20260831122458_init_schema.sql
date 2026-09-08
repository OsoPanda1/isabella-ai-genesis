-- ============================================================================
-- ISABELLA SOVEREIGN HUB - CANONICAL DATABASE MIGRATION v4.2.0
-- Target Platform: PostgreSQL (Supabase Compatible)
-- ============================================================================

create schema if not exists extensions;
create extension if not exists "uuid-ossp";
create extension if not exists vector schema extensions;

-- Immutable baseline: never reference a table before creating it. Re-runs are
-- governed by Supabase migration history rather than destructive DROP calls.

create table tenants (
    id varchar(64) primary key,
    name varchar(255) not null,
    region varchar(100) not null default 'Mexico-Hidalgo-01',
    quota_balance numeric(12, 5) not null default 10.00000 check (quota_balance >= 0.0),
    tier varchar(50) not null default 'Free' check (tier in ('Free', 'Enterprise', 'Sovereign')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table profiles (
    id varchar(64) primary key,
    username varchar(150) not null unique,
    tenant_id varchar(64) not null references tenants(id) on delete cascade,
    role varchar(50) not null default 'Guest' check (role in ('SovereignOwner', 'Auditor', 'Operator', 'Guest')),
    oidc_sub varchar(255) unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id varchar(64) not null references profiles(id) on delete cascade,
    tenant_id varchar(64) not null references tenants(id) on delete cascade,
    token_jti uuid not null unique,
    ip_address varchar(45) not null,
    user_agent text,
    is_active boolean not null default true,
    expires_at timestamptz not null,
    created_at timestamptz not null default now()
);

create table memories (
    id uuid primary key default uuid_generate_v4(),
    tenant_id varchar(64) not null references tenants(id) on delete cascade,
    user_id varchar(64) not null references profiles(id) on delete cascade,
    content text not null,
    embedding extensions.vector(1536),
    scope varchar(50) not null default 'Session' check (scope in ('Immediate', 'Session', 'Project', 'Territorial', 'Historical')),
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create table audit_events (
    id varchar(64) primary key,
    timestamp timestamptz not null default now(),
    trace_id varchar(100) not null,
    correlation_id varchar(100) not null,
    actor_ip varchar(45) not null,
    event varchar(255) not null,
    severity varchar(10) not null check (severity in ('S0', 'S1', 'S2', 'S3')),
    details text not null,
    remediated boolean not null default false,
    verification_hash char(64) not null,
    previous_log_hash char(64) not null,
    tenant_id varchar(64) references tenants(id) on delete set null
);

create table bookpi_ledger (
    index bigint not null,
    tenant_id varchar(64) not null references tenants(id) on delete cascade,
    user_id varchar(64) not null references profiles(id) on delete cascade,
    timestamp timestamptz not null default now(),
    operation varchar(255) not null,
    category varchar(50) not null check (category in ('inference', 'processing', 'apis', 'skills', 'other')),
    cost_decimal numeric(10, 5) not null check (cost_decimal >= 0.0),
    tokens_consumed integer not null default 0 check (tokens_consumed >= 0),
    previous_hash char(64) not null,
    block_hash char(64) not null,
    pqc_signature text,
    signature_algorithm varchar(50) not null default 'NOT_IMPLEMENTED',
    status varchar(30) not null default 'settled' check (status in ('settled', 'refunded')),
    primary key (index, tenant_id)
);

create index idx_profiles_tenant_id on profiles(tenant_id);
create index idx_sessions_user_tenant on sessions(user_id, tenant_id);
create index idx_memories_tenant_scope on memories(tenant_id, scope);
create index idx_audit_events_trace_correlation on audit_events(trace_id, correlation_id);
create index idx_ledger_tenant_status on bookpi_ledger(tenant_id, status);

create or replace function public.update_modified_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_tenants_modtime
    before update on tenants
    for each row execute function public.update_modified_column();

create trigger update_profiles_modtime
    before update on profiles
    for each row execute function public.update_modified_column();

alter table tenants enable row level security;
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table memories enable row level security;
alter table audit_events enable row level security;
alter table bookpi_ledger enable row level security;

-- Supabase owns the auth schema. Application helper functions therefore live
-- in public and are referenced explicitly by RLS policies.
create or replace function public.current_tenant_id()
returns varchar
language sql
stable
security invoker
set search_path = public
as $$
    select coalesce(
        nullif(current_setting('request.jwt.claims', true)::jsonb->>'tenantId', ''),
        nullif(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id', '')
    )::varchar;
$$;

create or replace function public.current_user_role()
returns varchar
language sql
stable
security invoker
set search_path = public
as $$
    select coalesce(
        nullif(current_setting('request.jwt.claims', true)::jsonb->>'role', ''),
        nullif(current_setting('request.jwt.claims', true)::jsonb->>'user_role', '')
    )::varchar;
$$;

create policy "Tenants can only see their own tenant profile" on tenants
    for select using (id = public.current_tenant_id());
create policy "SovereignOwner can update their tenant parameters" on tenants
    for update using (id = public.current_tenant_id() and public.current_user_role() = 'SovereignOwner');

create policy "Users can see profiles of their same tenant" on profiles
    for select using (tenant_id = public.current_tenant_id());
create policy "SovereignOwner can manage profiles within their tenant" on profiles
    for all using (tenant_id = public.current_tenant_id() and public.current_user_role() = 'SovereignOwner');

create policy "Users can inspect active sessions under their tenant" on sessions
    for select using (tenant_id = public.current_tenant_id());

create policy "Tenant multi-tenant isolation policy for memories" on memories
    for all using (tenant_id = public.current_tenant_id());

create policy "Auditor and Owner can view tenant security logs" on audit_events
    for select using (
        tenant_id = public.current_tenant_id()
        and public.current_user_role() in ('SovereignOwner', 'Auditor')
    );

create policy "Authorized roles can read ledger blocks" on bookpi_ledger
    for select using (
        tenant_id = public.current_tenant_id()
        and public.current_user_role() in ('SovereignOwner', 'Auditor', 'Operator')
    );
create policy "Owners and Operators can append ledger blocks" on bookpi_ledger
    for insert with check (
        tenant_id = public.current_tenant_id()
        and public.current_user_role() in ('SovereignOwner', 'Operator')
    );
create policy "Only SovereignOwner can process refund updates" on bookpi_ledger
    for update using (
        tenant_id = public.current_tenant_id()
        and public.current_user_role() = 'SovereignOwner'
    );
