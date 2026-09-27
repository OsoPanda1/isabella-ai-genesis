-- Erasure contract: mutable data is deleted; immutable evidence is retained.
-- This preserves BookPI/audit hash-chain invariants. The erasure request itself
-- is recorded separately and is the authority for downstream privacy filtering.

CREATE TABLE IF NOT EXISTS public.isabella_erasure_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL,
  user_id text,
  erasure_token text NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz NOT NULL DEFAULT now(),
  deleted_memories bigint NOT NULL DEFAULT 0,
  deleted_economic_events bigint NOT NULL DEFAULT 0,
  deleted_sessions bigint NOT NULL DEFAULT 0,
  deleted_api_keys bigint NOT NULL DEFAULT 0,
  deleted_approval_grants bigint NOT NULL DEFAULT 0,
  immutable_audit_events_retained bigint NOT NULL DEFAULT 0,
  immutable_bookpi_rows_retained bigint NOT NULL DEFAULT 0
);

ALTER TABLE public.isabella_erasure_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_erasure_requests FORCE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.erase_subject_data(p_tenant_id text, p_user_id text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text := 'erased:' || encode(sha256((p_tenant_id || ':' || coalesce(p_user_id, '*'))::bytea), 'hex');
  v_memories bigint := 0;
  v_economic bigint := 0;
  v_sessions bigint := 0;
  v_api_keys bigint := 0;
  v_approvals bigint := 0;
  v_audit bigint := 0;
  v_bookpi bigint := 0;
BEGIN
  IF p_tenant_id IS NULL OR length(trim(p_tenant_id)) = 0 THEN RAISE EXCEPTION 'tenant_id_required'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('isabella-erasure:' || p_tenant_id, 0));

  DELETE FROM public.memories WHERE tenant_id = p_tenant_id AND (p_user_id IS NULL OR user_id = p_user_id);
  GET DIAGNOSTICS v_memories = ROW_COUNT;
  DELETE FROM public.economic_events WHERE tenant_id = p_tenant_id AND (p_user_id IS NULL OR actor_id = p_user_id);
  GET DIAGNOSTICS v_economic = ROW_COUNT;
  DELETE FROM public.sessions WHERE tenant_id = p_tenant_id AND (p_user_id IS NULL OR user_id = p_user_id);
  GET DIAGNOSTICS v_sessions = ROW_COUNT;
  DELETE FROM public.api_keys WHERE tenant_id = p_tenant_id AND (p_user_id IS NULL OR owner_id = p_user_id);
  GET DIAGNOSTICS v_api_keys = ROW_COUNT;
  DELETE FROM public.approval_grants WHERE tenant_id = p_tenant_id AND (p_user_id IS NULL OR user_id = p_user_id);
  GET DIAGNOSTICS v_approvals = ROW_COUNT;

  SELECT count(*) INTO v_audit FROM public.audit_events WHERE tenant_id = p_tenant_id AND (p_user_id IS NULL OR actor = p_user_id);
  SELECT count(*) INTO v_bookpi FROM public.bookpi_ledger WHERE tenant_id = p_tenant_id AND (p_user_id IS NULL OR user_id = p_user_id);

  INSERT INTO public.isabella_erasure_requests
    (tenant_id,user_id,erasure_token,deleted_memories,deleted_economic_events,deleted_sessions,deleted_api_keys,deleted_approval_grants,immutable_audit_events_retained,immutable_bookpi_rows_retained)
  VALUES
    (p_tenant_id,p_user_id,v_token,v_memories,v_economic,v_sessions,v_api_keys,v_approvals,v_audit,v_bookpi);

  RETURN jsonb_build_object(
    'tenant_id',p_tenant_id,'user_id',p_user_id,'erasure_token',v_token,
    'deleted',jsonb_build_object('memories',v_memories,'economic_events',v_economic,'sessions',v_sessions,'api_keys',v_api_keys,'approval_grants',v_approvals),
    'immutable_evidence_retained',jsonb_build_object('audit_events',v_audit,'bookpi_ledger',v_bookpi)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.erase_subject_data(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.erase_subject_data(text,text) TO service_role;
