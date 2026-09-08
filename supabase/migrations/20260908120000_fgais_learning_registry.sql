-- FGAIS learning/model registry. Durable, tenant-scoped, auditable.
CREATE TABLE IF NOT EXISTS public.fgais_datasets (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  version TEXT NOT NULL,
  territory_id TEXT NOT NULL,
  source TEXT NOT NULL,
  license TEXT NOT NULL,
  schema_hash TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PROPOSED','VALIDATED','REJECTED','REVOKED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id, version)
);
CREATE INDEX IF NOT EXISTS idx_fgais_datasets_tenant ON public.fgais_datasets(tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.fgais_models (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  version TEXT NOT NULL,
  territory_id TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  task TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  dataset_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  model_hash TEXT NOT NULL,
  approval_status TEXT NOT NULL CHECK (approval_status IN ('PENDING_REVIEW','APPROVED','REJECTED','REVOKED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id, version)
);
CREATE INDEX IF NOT EXISTS idx_fgais_models_tenant ON public.fgais_models(tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.fgais_training_runs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  dataset_ids JSONB NOT NULL,
  base_model_id TEXT,
  algorithm TEXT NOT NULL,
  hyperparameters JSONB NOT NULL,
  seed INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('QUEUED','RUNNING','SUCCEEDED','FAILED','CANCELLED')),
  source_commit TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  output_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_fgais_training_tenant ON public.fgais_training_runs(tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.fgais_evaluations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  dataset_id TEXT NOT NULL,
  protocol_hash TEXT NOT NULL,
  metrics JSONB NOT NULL,
  baseline JSONB NOT NULL,
  artifact_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('RUNNING','PASSED','FAILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fgais_evaluations_model ON public.fgais_evaluations(tenant_id, model_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.fgais_model_releases (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  version TEXT NOT NULL,
  artifact_hash TEXT NOT NULL,
  manifest_hash TEXT NOT NULL,
  evidence_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('CANDIDATE','APPROVED','REVOKED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, model_id, version)
);
CREATE INDEX IF NOT EXISTS idx_fgais_releases_tenant ON public.fgais_model_releases(tenant_id, created_at DESC);

ALTER TABLE public.fgais_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fgais_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fgais_training_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fgais_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fgais_model_releases ENABLE ROW LEVEL SECURITY;
