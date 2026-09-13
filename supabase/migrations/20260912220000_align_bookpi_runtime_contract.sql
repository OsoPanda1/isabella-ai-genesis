-- ============================================================================
-- BOOKPI RUNTIME CONTRACT ALIGNMENT (P0)
-- ============================================================================
-- The production BookPI repository persists `nonce` and uses `id` as a
-- compatibility lookup key. The original schema only declared the composite
-- primary key (index, tenant_id), which made production append/refund paths
-- fail against a freshly migrated database.
--
-- This migration is additive and preserves the composite primary key and the
-- append-only status constraint already established by the canonical schema.
-- ============================================================================

ALTER TABLE public.bookpi_ledger
  ADD COLUMN IF NOT EXISTS id varchar(128),
  ADD COLUMN IF NOT EXISTS nonce varchar(128);

-- Deterministic backfill for legacy rows. New runtime rows use random UUIDs.
UPDATE public.bookpi_ledger
SET id = tenant_id || ':' || index
WHERE id IS NULL;

UPDATE public.bookpi_ledger
SET nonce = tenant_id || ':' || index
WHERE nonce IS NULL;

ALTER TABLE public.bookpi_ledger
  ALTER COLUMN id SET NOT NULL,
  ALTER COLUMN nonce SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_bookpi_ledger_id
  ON public.bookpi_ledger(id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_bookpi_ledger_tenant_nonce
  ON public.bookpi_ledger(tenant_id, nonce);
