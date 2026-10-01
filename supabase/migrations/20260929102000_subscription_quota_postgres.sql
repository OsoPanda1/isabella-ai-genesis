-- Durable quota authority for production/staging.
CREATE TABLE IF NOT EXISTS public.subscription_usage (
  user_id TEXT NOT NULL,
  day_key TEXT NOT NULL,
  messages BIGINT NOT NULL DEFAULT 0 CHECK (messages >= 0),
  images BIGINT NOT NULL DEFAULT 0 CHECK (images >= 0),
  voice_seconds BIGINT NOT NULL DEFAULT 0 CHECK (voice_seconds >= 0),
  agent_sessions BIGINT NOT NULL DEFAULT 0 CHECK (agent_sessions >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, day_key)
);

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  user_id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL DEFAULT 'free'
    CHECK (plan_id IN ('free','plus','premium','vip','enterprise','custom')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.subscription_usage FROM anon, authenticated;
REVOKE ALL ON public.subscription_plans FROM anon, authenticated;
