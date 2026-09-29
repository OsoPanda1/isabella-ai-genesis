-- CONNECTOR WEBHOOK EVENT LEDGER (ISA-200 / ISA-210)
-- Idempotencia durable de webhooks de conectores: un evento se acepta solo
-- después de ser reclamado aquí. Reentregas del proveedor quedan como
-- duplicate y no se reprocesan.

CREATE TABLE IF NOT EXISTS public.connector_webhook_events (
  provider VARCHAR(32) NOT NULL
    CHECK (provider IN ('github', 'slack', 'linear')),
  event_id VARCHAR(256) NOT NULL,
  payload_hash VARCHAR(128) NOT NULL,
  -- Cola de procesamiento asíncrono (ISA-207): el evento queda en 'pending'
  -- antes del ACK y solo pasa a 'processed' cuando el trabajo aguas abajo termina.
  status VARCHAR(16) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'processed', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  tenant_id VARCHAR(128),
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_connector_webhook_events_received
  ON public.connector_webhook_events (received_at DESC);

-- Índice de cola: trabajo pendiente listo para el worker.
CREATE INDEX IF NOT EXISTS idx_connector_webhook_events_pending
  ON public.connector_webhook_events (received_at)
  WHERE status IN ('pending', 'failed');

-- Sin acceso desde clientes: solo la capa server (service role) escribe/lee.
ALTER TABLE public.connector_webhook_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'connector_webhook_events'
  ) THEN
    CREATE POLICY connector_webhook_events_no_client_access
      ON public.connector_webhook_events
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

REVOKE ALL ON public.connector_webhook_events FROM anon, authenticated;
