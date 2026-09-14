-- ISABELLA AI GENESIS — production hardening contract (2026-09-14)
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.tenants') IS NOT NULL THEN
    UPDATE public.tenants SET tier = lower(tier) WHERE tier IS NOT NULL;
    ALTER TABLE public.tenants DROP CONSTRAINT IF EXISTS tenants_tier_check;
    ALTER TABLE public.tenants ADD CONSTRAINT tenants_tier_check CHECK (tier IN ('free', 'pro', 'enterprise', 'sovereign'));
  END IF;
END $$;

ALTER TABLE public.memories
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS consent_required BOOLEAN,
  ADD COLUMN IF NOT EXISTS previous_chain_hash TEXT,
  ADD COLUMN IF NOT EXISTS chain_hash TEXT;

UPDATE public.memories
SET source = COALESCE(source, 'system'),
    consent_required = COALESCE(consent_required, sensitivity IN ('medium', 'high', 'personal', 'restricted')),
    scope = lower(scope),
    sensitivity = CASE lower(sensitivity)
      WHEN 'low' THEN 'public' WHEN 'medium' THEN 'internal' WHEN 'high' THEN 'restricted'
      WHEN 'public' THEN 'public' WHEN 'internal' THEN 'internal'
      WHEN 'personal' THEN 'personal' WHEN 'restricted' THEN 'restricted' ELSE 'internal' END
WHERE source IS NULL OR consent_required IS NULL OR scope <> lower(scope) OR sensitivity IN ('low', 'medium', 'high');

ALTER TABLE public.memories DROP CONSTRAINT IF EXISTS memories_scope_check;
ALTER TABLE public.memories ADD CONSTRAINT memories_scope_check CHECK (scope IN ('turn', 'session', 'project', 'territorial', 'historical'));
ALTER TABLE public.memories DROP CONSTRAINT IF EXISTS memories_sensitivity_check;
ALTER TABLE public.memories ADD CONSTRAINT memories_sensitivity_check CHECK (sensitivity IN ('public', 'internal', 'personal', 'restricted'));
ALTER TABLE public.memories DROP CONSTRAINT IF EXISTS memories_source_check;
ALTER TABLE public.memories ADD CONSTRAINT memories_source_check CHECK (source IN ('user', 'system', 'tool', 'document'));

UPDATE public.memories SET content_hash = encode(digest(id::text || '|' || tenant_id::text || '|' || content || '|' || source || '|' || scope || '|' || sensitivity, 'sha256'), 'hex') WHERE content_hash IS NULL OR content_hash = '';

DO $$
DECLARE rec RECORD; current_tenant TEXT := NULL; prev_hash TEXT := repeat('0', 64); calculated TEXT;
BEGIN
  FOR rec IN SELECT id, tenant_id, content_hash, created_at FROM public.memories ORDER BY tenant_id, created_at, id LOOP
    IF current_tenant IS DISTINCT FROM rec.tenant_id::text THEN current_tenant := rec.tenant_id::text; prev_hash := repeat('0', 64); END IF;
    calculated := encode(digest(prev_hash || '|' || COALESCE(rec.content_hash, ''), 'sha256'), 'hex');
    UPDATE public.memories SET previous_chain_hash = prev_hash, chain_hash = calculated WHERE id = rec.id;
    prev_hash := calculated;
  END LOOP;
END $$;

ALTER TABLE public.memories ALTER COLUMN source SET DEFAULT 'system';
ALTER TABLE public.memories ALTER COLUMN consent_required SET DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_memories_tenant_scope_created ON public.memories(tenant_id, scope, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_tenant_owner ON public.memories(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_memories_expires_at ON public.memories(expires_at) WHERE expires_at IS NOT NULL;

ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS key_prefix TEXT, ADD COLUMN IF NOT EXISTS secret_hint TEXT, ADD COLUMN IF NOT EXISTS rotated_at TIMESTAMPTZ;
UPDATE public.api_keys SET key_prefix = COALESCE(key_prefix, prefix) WHERE key_prefix IS NULL;
CREATE OR REPLACE FUNCTION public.sync_api_key_prefix() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.key_prefix IS NULL AND NEW.prefix IS NOT NULL THEN NEW.key_prefix := NEW.prefix;
  ELSIF NEW.prefix IS NULL AND NEW.key_prefix IS NOT NULL THEN NEW.prefix := NEW.key_prefix;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_sync_api_key_prefix ON public.api_keys;
CREATE TRIGGER trg_sync_api_key_prefix BEFORE INSERT OR UPDATE OF prefix, key_prefix ON public.api_keys FOR EACH ROW EXECUTE FUNCTION public.sync_api_key_prefix();
ALTER TABLE public.api_keys ALTER COLUMN key_prefix SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_api_keys_key_prefix ON public.api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant_owner_status ON public.api_keys(tenant_id, owner_id, status);

ALTER TABLE public.audit_events ADD COLUMN IF NOT EXISTS actor TEXT, ADD COLUMN IF NOT EXISTS resource TEXT, ADD COLUMN IF NOT EXISTS action TEXT, ADD COLUMN IF NOT EXISTS result TEXT;
UPDATE public.audit_events SET action = COALESCE(action, event, 'unknown'), resource = COALESCE(resource, ''), actor = COALESCE(actor, ''), result = COALESCE(result, CASE WHEN event ILIKE '%denied%' THEN 'denied' ELSE 'success' END) WHERE action IS NULL OR resource IS NULL OR actor IS NULL OR result IS NULL;
ALTER TABLE public.audit_events DROP CONSTRAINT IF EXISTS audit_events_result_check;
ALTER TABLE public.audit_events ADD CONSTRAINT audit_events_result_check CHECK (result IN ('success', 'failure', 'denied'));
CREATE INDEX IF NOT EXISTS idx_audit_events_tenant_time ON public.audit_events(tenant_id, timestamp DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_trace ON public.audit_events(trace_id);

CREATE OR REPLACE FUNCTION public.current_request_tenant_id() RETURNS TEXT LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'tenant_id';
$$;

DROP POLICY IF EXISTS api_keys_select ON public.api_keys;
DROP POLICY IF EXISTS api_keys_insert ON public.api_keys;
DROP POLICY IF EXISTS api_keys_update ON public.api_keys;
DROP POLICY IF EXISTS api_keys_delete ON public.api_keys;
CREATE POLICY api_keys_select ON public.api_keys FOR SELECT USING (tenant_id = public.current_request_tenant_id());
CREATE POLICY api_keys_insert ON public.api_keys FOR INSERT WITH CHECK (tenant_id = public.current_request_tenant_id());
CREATE POLICY api_keys_update ON public.api_keys FOR UPDATE USING (tenant_id = public.current_request_tenant_id()) WITH CHECK (tenant_id = public.current_request_tenant_id());
CREATE POLICY api_keys_delete ON public.api_keys FOR DELETE USING (tenant_id = public.current_request_tenant_id());

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS memories_select ON public.memories;
DROP POLICY IF EXISTS memories_insert ON public.memories;
DROP POLICY IF EXISTS memories_update ON public.memories;
DROP POLICY IF EXISTS memories_delete ON public.memories;
CREATE POLICY memories_select ON public.memories FOR SELECT USING (
  tenant_id = public.current_request_tenant_id() AND (
    sensitivity IN ('public', 'internal')
    OR user_id::text = current_setting('request.jwt.claims', true)::jsonb ->> 'sub'
    OR (jsonb_typeof(current_setting('request.jwt.claims', true)::jsonb -> 'roles') = 'array' AND current_setting('request.jwt.claims', true)::jsonb -> 'roles' @> '["SovereignOwner"]'::jsonb)
    OR (jsonb_typeof(current_setting('request.jwt.claims', true)::jsonb -> 'roles') = 'array' AND current_setting('request.jwt.claims', true)::jsonb -> 'roles' @> '["Auditor"]'::jsonb)
  )
);
CREATE POLICY memories_insert ON public.memories FOR INSERT WITH CHECK (tenant_id = public.current_request_tenant_id());
CREATE POLICY memories_update ON public.memories FOR UPDATE USING (tenant_id = public.current_request_tenant_id()) WITH CHECK (tenant_id = public.current_request_tenant_id());
CREATE POLICY memories_delete ON public.memories FOR DELETE USING (tenant_id = public.current_request_tenant_id());

ALTER TABLE public.bookpi_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economic_events ENABLE ROW LEVEL SECURITY;

-- Defense in depth: application-owned table owners also obey RLS.
ALTER TABLE public.memories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bookpi_ledger FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events FORCE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events FORCE ROW LEVEL SECURITY;
ALTER TABLE public.economic_events FORCE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_bookpi_tenant_index ON public.bookpi_ledger(tenant_id, index DESC);

DO $$
BEGIN
  IF to_regclass('public.memories') IS NULL THEN RAISE EXCEPTION 'CRITICAL_SCHEMA_ERROR: memories table is missing'; END IF;
  IF to_regclass('public.audit_events') IS NULL THEN RAISE EXCEPTION 'CRITICAL_SCHEMA_ERROR: audit_events table is missing'; END IF;
  IF to_regclass('public.bookpi_ledger') IS NULL THEN RAISE EXCEPTION 'CRITICAL_SCHEMA_ERROR: bookpi_ledger table is missing'; END IF;
  IF to_regclass('public.api_keys') IS NULL THEN RAISE EXCEPTION 'CRITICAL_SCHEMA_ERROR: api_keys table is missing'; END IF;
END $$;

COMMIT;
