-- ============================================================================
-- POLICY AS CODE + LEDGER DE DECISIONES (2026-09-26)
-- Integración de piezas viables de nodo-cero-isabella (.git/objects, commit
-- 1f42716 "gobernanza real de Isabella - audit persistente firmado, policy gate
-- desde DB, decisiones en tabla, RLS y seed de politicas"), reescritas a las
-- convenciones de este repositorio.
--
-- Origen y alcance honesto:
--   * isabella_policies / isabella_decisions: tablas nuevas (antes no existían
--     en este esquema; S2/S3 de la auditoría ISA-500 marcaban ausencia de
--     policy-as-code).
--   * Seeds: adaptados de data/seed/006_policies.sql de nodo-cero, con
--     vocabulario propio (risk: low|medium|high|critical; category;
--     territorialBoundary; authenticated) y semántica fail-closed.
--   * RLS: se aplica el patrón server-only de 20260926020000 (ENABLE + REVOKE
--     a anon/authenticated) y NO se copian las políticas permisivas de
--     nodocero (lectura para todo usuario autenticado), porque aquí la
--     autoridad de lectura es server-side vía service role / owner-scoped.
--   * Integridad: se reutiliza public.prevent_bookpi_mutation() para que
--     isabella_decisions sea append-only.
--   * PENDIENTE de ambiente: aplicar la migración en el ambiente objetivo y
--     verificar RLS live (hoy EVIDENCE_GATED: sin DATABASE_URL local).
--
-- Nota: sin BEGIN/COMMIT — el runner db-migrate.mjs envuelve todo en una
-- sola transacción.
-- ============================================================================

-- 1) POLICY AS CODE: reglas versionadas operables desde la base de datos.
CREATE TABLE IF NOT EXISTS public.isabella_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_key TEXT NOT NULL UNIQUE,
    description TEXT,
    -- Arreglo de reglas {"when": {...}, "then": {"status", "reason"}}
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    version TEXT NOT NULL DEFAULT '1.0.0',
    -- Menor número = se evalúa primero (first-match determinista).
    priority INTEGER NOT NULL DEFAULT 100,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_isabella_policies_rules_is_array
        CHECK (jsonb_typeof(rules) = 'array'),
    CONSTRAINT chk_isabella_policies_status
        CHECK (
            rules <@ '[]'::jsonb
            OR NOT EXISTS (
                SELECT 1
                FROM jsonb_array_elements(rules) AS rule
                WHERE NOT (rule->'then'->>'status' IN ('allowed', 'denied', 'requires_approval'))
            )
        )
);

CREATE INDEX IF NOT EXISTS idx_isabella_policies_priority
    ON public.isabella_policies (priority, policy_key)
    WHERE enabled = TRUE;

-- 2) LEDGER DE DECISIONES: persistencia durable con cadena hash (append-only).
CREATE TABLE IF NOT EXISTS public.isabella_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    authority TEXT NOT NULL,
    capability TEXT NOT NULL,
    policy TEXT NOT NULL,
    risk TEXT NOT NULL,
    model_id TEXT,
    input_hash TEXT NOT NULL,
    output_hash TEXT NOT NULL,
    result TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    record_hash TEXT NOT NULL,
    evidence_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_isabella_decisions_result
        CHECK (result IN ('ALLOW', 'DENY', 'REVIEW')),
    CONSTRAINT chk_isabella_decisions_evidence_is_array
        CHECK (jsonb_typeof(evidence_ids) = 'array'),
    CONSTRAINT uq_isabella_decisions_record_hash
        UNIQUE (tenant_id, record_hash)
);

CREATE INDEX IF NOT EXISTS idx_isabella_decisions_tenant_chain
    ON public.isabella_decisions (tenant_id, created_at DESC, id DESC);

-- 3) RLS server-only (patrón 20260926020000): defensa para todo rol no
--    privilegiado; anon/authenticated quedan sin privilegio alguno.
ALTER TABLE public.isabella_policies ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.isabella_policies FROM anon, authenticated;

ALTER TABLE public.isabella_decisions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.isabella_decisions FROM anon, authenticated;

-- 4) Append-only del ledger de decisiones (misma violación soberana que
--    audit_events / BookPI).
DROP TRIGGER IF EXISTS trg_prevent_isabella_decisions_update ON public.isabella_decisions;
CREATE TRIGGER trg_prevent_isabella_decisions_update
BEFORE UPDATE ON public.isabella_decisions
FOR EACH ROW
EXECUTE FUNCTION public.prevent_bookpi_mutation();

DROP TRIGGER IF EXISTS trg_prevent_isabella_decisions_delete ON public.isabella_decisions;
CREATE TRIGGER trg_prevent_isabella_decisions_delete
BEFORE DELETE ON public.isabella_decisions
FOR EACH ROW
EXECUTE FUNCTION public.prevent_bookpi_mutation();

-- 5) SEEDS: políticas por defecto (policy-as-code). Semántica fail-closed:
--    la capa DB solo puede endurecer la decisión del motor ARGUS; nunca la
--    relaja. Se re-ejecuta sin duplicar filas.
INSERT INTO public.isabella_policies (policy_key, description, rules, version, priority)
VALUES
    (
        'p-critical-risk-blocked',
        'Riesgo critical: la ejecucion queda denegada por politica DB.',
        '[{"when":{"risk":"critical"},"then":{"status":"denied","reason":"riesgo_critico_bloqueado"}}]'::jsonb,
        '1.0.0',
        10
    ),
    (
        'p-territorial-boundary-blocked',
        'Herramientas con territorialBoundary=true jamas se ejecutan desde esta politica.',
        '[{"when":{"territorialBoundary":true},"then":{"status":"denied","reason":"frontera_territorial_bloqueada"}}]'::jsonb,
        '1.0.0',
        20
    ),
    (
        'p-high-risk-approval',
        'Riesgo high requiere aprobacion humana previa.',
        '[{"when":{"risk":"high"},"then":{"status":"requires_approval","reason":"riesgo_alto_requiere_aprobacion"}}]'::jsonb,
        '1.0.0',
        30
    ),
    (
        'p-unauthenticated-review',
        'Actores no autenticados no ejecutan herramientas sin revision humana.',
        '[{"when":{"authenticated":false},"then":{"status":"requires_approval","reason":"actor_no_autenticado_requiere_revision"}}]'::jsonb,
        '1.0.0',
        40
    ),
    (
        'p-identity-tools-approval',
        'Herramientas de identidad siempre pasan por aprobacion humana.',
        '[{"when":{"category":"identity"},"then":{"status":"requires_approval","reason":"herramienta_identidad_requiere_aprobacion"}}]'::jsonb,
        '1.0.0',
        50
    )
ON CONFLICT (policy_key) DO UPDATE SET
    description = EXCLUDED.description,
    rules = EXCLUDED.rules,
    version = EXCLUDED.version,
    priority = EXCLUDED.priority,
    enabled = TRUE,
    updated_at = NOW();
