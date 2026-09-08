-- Durable replay protection for federated learning updates.
CREATE TABLE IF NOT EXISTS public.fgais_federation_replay (
  nonce TEXT PRIMARY KEY,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fgais_federation_replay_first_seen
  ON public.fgais_federation_replay(first_seen_at);

-- Retention is intentionally bounded; callers reject stale updates before the claim.
CREATE OR REPLACE FUNCTION public.fgais_federation_replay_prune(retention INTERVAL DEFAULT INTERVAL '24 hours')
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE deleted_count INTEGER;
BEGIN
  DELETE FROM public.fgais_federation_replay WHERE first_seen_at < now() - retention;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
