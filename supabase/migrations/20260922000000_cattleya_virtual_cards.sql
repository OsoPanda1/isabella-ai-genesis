-- CATTLEYA™ Virtual Cards — Stripe Issuing + Reputación Cívica 2000
-- v3.0-MASTER-EXTENDED Parte III M13
-- Estado: IMPLEMENTACIÓN — pendiente CERTIFICACIÓN con DB viva + Stripe Issuing live

CREATE TABLE IF NOT EXISTS virtual_cards (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    stripe_card_id VARCHAR(255) UNIQUE NOT NULL,
    card_holder_name VARCHAR(255) NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    brand VARCHAR(20) NOT NULL,
    exp_month INT NOT NULL CHECK (exp_month BETWEEN 1 AND 12),
    exp_year INT NOT NULL CHECK (exp_year >= 2024),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','canceled')),
    spending_limit_daily INT NOT NULL DEFAULT 50000 CHECK (spending_limit_daily >= 0), -- centavos $500
    spending_limit_monthly INT NOT NULL DEFAULT 200000 CHECK (spending_limit_monthly >= 0), -- $2000
    customization_tier INT NOT NULL DEFAULT 0 CHECK (customization_tier BETWEEN 0 AND 3),
    customization_price INT NOT NULL DEFAULT 0 CHECK (customization_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_virtual_cards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_virtual_cards_user_id ON virtual_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_cards_stripe_card_id ON virtual_cards(stripe_card_id);
CREATE INDEX IF NOT EXISTS idx_virtual_cards_status ON virtual_cards(status);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_virtual_cards_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_virtual_cards_updated_at ON virtual_cards;
CREATE TRIGGER trg_virtual_cards_updated_at BEFORE UPDATE ON virtual_cards FOR EACH ROW EXECUTE FUNCTION update_virtual_cards_updated_at();

-- RLS: aislamiento por tenant (user_id → tenant via users.tenant_id)
ALTER TABLE virtual_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "virtual_cards_tenant_isolation" ON virtual_cards;
CREATE POLICY "virtual_cards_tenant_isolation" ON virtual_cards
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE tenant_id = current_setting('app.tenant_id', true)::uuid))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE tenant_id = current_setting('app.tenant_id', true)::uuid));

COMMENT ON TABLE virtual_cards IS 'CATTLEYA™ — Stripe Issuing virtual cards con reputación ≥900, PCI DSS/CNBV: solo stripe_card_id/last4/brand, nunca PAN/CVC';
