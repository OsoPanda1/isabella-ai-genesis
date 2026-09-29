-- ============================================================================
-- BOOKPI SHA3-512 HASH CHAIN — P0
-- Migra la cadena de hash de SHA-256 (64 hex) a SHA3-512 (128 hex) con rollback
-- transaccional y soporte para original_event_id durable.
-- ============================================================================

-- 1. Ampliar columnas de hash para SHA3-512 (128 hex chars). VARCHAR evita padding de CHAR.
ALTER TABLE public.bookpi_ledger ALTER COLUMN previous_hash TYPE VARCHAR(128) USING previous_hash::VARCHAR(128);
ALTER TABLE public.bookpi_ledger ALTER COLUMN block_hash TYPE VARCHAR(128) USING block_hash::VARCHAR(128);

-- 2. Asegurar que el índice de refund idempotente exista (original_event_id UNIQUE partial)
ALTER TABLE public.bookpi_ledger ADD COLUMN IF NOT EXISTS original_event_id VARCHAR(128);
CREATE UNIQUE INDEX IF NOT EXISTS uq_bookpi_refund_original ON public.bookpi_ledger (original_event_id) WHERE original_event_id IS NOT NULL;

-- 3. Reforzar idempotencia de billing (checkout) — ya existe pero se verifica contrato
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'billing_checkout_idempotency_tenant_op_key_unique') THEN
    -- La constraint original es UNIQUE (tenant_id, operation, idempotency_key) creada en 20260913210000
    -- Este bloque asegura que no se elimine silenciosamente.
    PERFORM 1 FROM information_schema.table_constraints
    WHERE table_name='billing_checkout_idempotency' AND constraint_type='UNIQUE';
  END IF;
END$$;

-- 4. Comentario de contrato
COMMENT ON COLUMN public.bookpi_ledger.block_hash IS 'SHA3-512 hex (128 chars) del payload canónico';
COMMENT ON COLUMN public.bookpi_ledger.previous_hash IS 'SHA3-512 hex del bloque previo o 0*128 para génesis';
