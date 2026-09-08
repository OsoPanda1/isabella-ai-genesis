-- Additive correction for databases that already applied the original
-- kill-switch migration. The original seed omitted FALSE values in a two-column
-- INSERT, which is invalid PostgreSQL. Existing rows are preserved.

INSERT INTO public.kill_switch_state (capability, engaged)
VALUES
    ('inference', FALSE),
    ('tool-execution', FALSE),
    ('skill-execution', FALSE),
    ('payouts', FALSE),
    ('quantum-jobs', FALSE)
ON CONFLICT (capability) DO NOTHING;
