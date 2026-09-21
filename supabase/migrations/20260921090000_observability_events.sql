-- REAL OBSERVABILITY EVENT STORE
-- Durable runtime telemetry for inference, NCUA evidence and production dashboards.
CREATE TABLE IF NOT EXISTS public.observability_events (
  id BIGSERIAL PRIMARY KEY,
  trace_id VARCHAR(128) NOT NULL,
  event_type VARCHAR(128) NOT NULL,
  source VARCHAR(128) NOT NULL,
  duration_ms DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (duration_ms >= 0),
  severity VARCHAR(16) NOT NULL DEFAULT 'info'
    CHECK (severity IN ('debug','info','warning','error','critical')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_observability_events_created
  ON public.observability_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_observability_events_source_created
  ON public.observability_events(source, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_observability_events_trace
  ON public.observability_events(trace_id);
