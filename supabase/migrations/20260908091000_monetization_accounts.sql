-- ============================================================================
-- MONETIZATION ACCOUNTS — tabla canónica (el schema la omitía y el
-- cliente generado commiteado la traía de un schema no versionado).
-- Ceros reales por defecto; RLS deny-all.
-- ============================================================================

CREATE TABLE IF NOT EXISTS monetization_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) NOT NULL UNIQUE,
    earned_balance_cents INTEGER NOT NULL DEFAULT 0 CHECK (earned_balance_cents >= 0),
    qualified_uses INTEGER NOT NULL DEFAULT 0,
    approved_contributions INTEGER NOT NULL DEFAULT 0,
    training_completed BOOLEAN NOT NULL DEFAULT FALSE,
    identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
    payment_account_verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
    sanctioned BOOLEAN NOT NULL DEFAULT FALSE,
    under_fraud_review BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE monetization_accounts ENABLE ROW LEVEL SECURITY;
