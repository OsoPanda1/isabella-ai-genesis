-- ============================================================================
-- KILL SWITCH — estado durable de parada de emergencia por capacidad
-- Target Platform: PostgreSQL (Supabase / Neon Compatible)
-- ============================================================================
-- §7.1 del Charter FGAIS: kill switch obligatorio en toda capacidad
-- autónoma. Una fila por capacidad; engaged=TRUE bloquea ejecución.
-- RLS deny-all (el runtime owner omite RLS).
-- ============================================================================

CREATE TABLE IF NOT EXISTS kill_switch_state (
    capability VARCHAR(64) PRIMARY KEY CHECK (capability ~ '^[a-z0-9-]+$'),
    engaged BOOLEAN NOT NULL DEFAULT FALSE,
    reason VARCHAR(500),
    actor_id VARCHAR(128),
    engaged_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE kill_switch_state ENABLE ROW LEVEL SECURITY;

-- Capacidades autónomas conocidas (apagadas por defecto = operativas).
INSERT INTO kill_switch_state (capability, engaged)
VALUES
    ('inference', FALSE),
    ('tool-execution', FALSE),
    ('skill-execution', FALSE),
    ('payouts', FALSE),
    ('quantum-jobs', FALSE)
ON CONFLICT (capability) DO NOTHING;
