-- Durable runtime model authority. The in-memory registry is only a cache.
CREATE TABLE IF NOT EXISTS public.fgais_model_registry (
  tenant_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  version TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  territory_id TEXT NOT NULL,
  modalities JSONB NOT NULL DEFAULT '[]'::jsonb,
  capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  production_approved BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('PROPOSED','EVALUATED','APPROVED','DEPLOYED','REVOKED')),
  artifact_hash TEXT NOT NULL,
  license TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, model_id, version)
);

CREATE INDEX IF NOT EXISTS idx_fgais_model_registry_lookup
  ON public.fgais_model_registry(tenant_id, model_id, enabled, production_approved, updated_at DESC);

CREATE OR REPLACE FUNCTION public.fgais_model_registry_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_fgais_model_registry_updated_at ON public.fgais_model_registry;
CREATE TRIGGER trg_fgais_model_registry_updated_at
BEFORE UPDATE ON public.fgais_model_registry
FOR EACH ROW EXECUTE FUNCTION public.fgais_model_registry_touch_updated_at();
