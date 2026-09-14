-- ============================================================================
-- BILLING SECURITY CONTRACT — P0
-- Binds Stripe payment instruments and pre-run capabilities to sovereign
-- identity, tenant and immutable request context.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.billing_payment_intents (
    id BIGSERIAL PRIMARY KEY,
    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    purpose VARCHAR(64) NOT NULL CHECK (purpose IN ('quota_topup')),
    currency VARCHAR(8) NOT NULL CHECK (currency = 'usd'),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    consumed_at TIMESTAMPTZ,
    UNIQUE (tenant_id, stripe_payment_intent_id)
);
CREATE INDEX IF NOT EXISTS idx_billing_pi_tenant ON public.billing_payment_intents(tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.billing_checkout_idempotency (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    operation VARCHAR(64) NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    stripe_session_id VARCHAR(255),
    checkout_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, operation, idempotency_key),
    UNIQUE (stripe_session_id)
);

CREATE TABLE IF NOT EXISTS public.billing_run_authorizations (
    id BIGSERIAL PRIMARY KEY,
    capability_hash VARCHAR(64) NOT NULL UNIQUE,
    tenant_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    skill_id VARCHAR(128) NOT NULL,
    estimated_cost_minor BIGINT NOT NULL CHECK (estimated_cost_minor >= 0),
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_billing_run_auth_lookup
    ON public.billing_run_authorizations(tenant_id, user_id, skill_id, expires_at);
