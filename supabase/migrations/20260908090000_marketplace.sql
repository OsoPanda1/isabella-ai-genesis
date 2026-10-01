-- ============================================================================
-- MARKETPLACE LISTINGS — fuente durable (P0: fuera de settings JSON)
-- Target Platform: PostgreSQL (Supabase / Neon Compatible)
-- ============================================================================
-- Los listados del marketplace son estado ECONÓMICO (compras con reparto
-- 85/15). Vivían en `sovereign_state.settings.marketplaceListings`
-- (blob JSON). Ahora son tabla canónica con idempotencia por skill_id.
-- Seed auditable de los 2 listados fundacionales (mismo contenido).
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_listings (
    skill_id VARCHAR(64) PRIMARY KEY CHECK (skill_id ~ '^[a-z0-9-]+$'),
    title VARCHAR(120) NOT NULL,
    cost_cents INTEGER NOT NULL CHECK (cost_cents > 0 AND cost_cents <= 100000),
    owner_id VARCHAR(128) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS defensiva deny-all (el runtime owner omite RLS; anon/authenticated denegados).
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Seed fundacional (idempotente por PK).
INSERT INTO marketplace_listings (skill_id, title, cost_cents, owner_id, description)
VALUES
    ('gis-cadastre', 'Módulo GIS Catastral Real del Monte', 4500, 'usr_anubis_villasenor',
     'Sincronización cartográfica en caliente con el registro territorial local.'),
    ('qec-syndrome-decoder', 'Decodificador Cuántico Avanzado QEC', 12000, 'usr_sophia_researcher',
     'Decodificación correctora mediante estimaciones de grafos con peso mínimo de emparejamiento perfecto.')
ON CONFLICT (skill_id) DO NOTHING;
