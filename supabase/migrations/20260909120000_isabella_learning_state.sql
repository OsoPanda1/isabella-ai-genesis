-- Isabella durable learning state
-- One versioned snapshot per tenant. The snapshot is derived from the canonical
-- learning engine and is never shared across tenants.

CREATE TABLE IF NOT EXISTS public.isabella_learning_state (
  tenant_id VARCHAR(255) PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 1,
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  snapshot_hash VARCHAR(128) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_isabella_learning_state_updated
  ON public.isabella_learning_state(updated_at DESC);

COMMENT ON TABLE public.isabella_learning_state IS
  'Tenant-scoped versioned Isabella learning snapshots; authoritative durable learning state.';
