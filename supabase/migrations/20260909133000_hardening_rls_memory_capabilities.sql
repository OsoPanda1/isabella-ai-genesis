-- HARDENING: memory rows are bound to the authenticated principal, not
-- merely to a client-supplied tenant claim. Service-role operations remain
-- server-side and bypass RLS by design.

create or replace function public.current_user_id()
returns varchar
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true)::jsonb->>'userId', ''),
    nullif(current_setting('request.jwt.claims', true)::jsonb->>'user_id', ''),
    nullif(current_setting('request.jwt.claims', true)::jsonb->>'sub', '')
  )::varchar;
$$;

drop policy if exists "Tenant multi-tenant isolation policy for memories" on public.memories;

a-- Read: same tenant; sensitive rows additionally require owner or elevated role.
create policy "Memory tenant read boundary" on public.memories
  for select using (
    tenant_id = public.current_tenant_id()
    and (
      sensitivity in ('low', 'medium')
      or user_id = public.current_user_id()
      or public.current_user_role() in ('SovereignOwner', 'Auditor')
    )
  );

-- Insert: tenant and principal are both derived from authenticated claims.
create policy "Memory principal-bound insert" on public.memories
  for insert with check (
    tenant_id = public.current_tenant_id()
    and user_id = public.current_user_id()
  );

-- Update/delete: owner or explicitly elevated role, never cross-tenant.
create policy "Memory principal-bound update" on public.memories
  for update using (
    tenant_id = public.current_tenant_id()
    and (user_id = public.current_user_id() or public.current_user_role() = 'SovereignOwner')
  ) with check (
    tenant_id = public.current_tenant_id()
    and user_id = public.current_user_id()
  );

create policy "Memory principal-bound delete" on public.memories
  for delete using (
    tenant_id = public.current_tenant_id()
    and (user_id = public.current_user_id() or public.current_user_role() = 'SovereignOwner')
  );

create index if not exists idx_memories_tenant_user_created
  on public.memories(tenant_id, user_id, created_at desc);
