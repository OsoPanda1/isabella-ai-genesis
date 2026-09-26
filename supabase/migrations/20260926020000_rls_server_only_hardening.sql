-- ISABELLA AI GENESIS — RLS defense-in-depth: server-only tables (2026-09-26)
-- Auditoría ISA-234 / hallazgos S2-S3.
--
-- Problema 1: 20260914130000 reemplazó la denegación de webhook_events por
-- políticas permisivas cuyo predicado siempre es verdadero
-- (provider_event_id IS NOT NULL) y la tabla NO tiene tenant_id, por lo que
-- cualquier cliente PostgREST (anon/authenticated) podía:
--   * leer eventos e IDs de proveedor de todos los tenants (fuga), y
--   * insertar eventos falsos para que claimWebhookEvent() devuelva
--     "in_progress" y el webhook real se descartara (envenenamiento de
--     idempotencia -> 202 del proveedor sin procesar).
--
-- Problema 13 tablas sin RLS: accounting_*, planos de memoria, fgais_*,
-- isabella_learning_state, billing_* y observability_events se crearon sin
-- ENABLE ROW LEVEL SECURITY y sin REVOKE, quedando alcanzables por PostgREST
-- bajo los privilegios por defecto de Supabase.
--
-- Regla aplicada (compatibilidad con el backend owner-scoped de 20260914):
--   * ENABLE ROW LEVEL SECURITY como defensa para todo rol no privilegiado.
--   * FORCE se conserva tal como lo dejó 20260924020000 en webhook_events;
--     el backend legítimo sigue operando porque conserva su política.
--   * REVOKE explícito a anon/authenticated: es el control real que cierra
--     PostgREST sin romper conexiones owner-scoped (owner no está sujeto a
--     RLS salvo FORCE, y FORCE + política sigue permitiéndole operar).
--   * Sin nuevas políticas permisivas: no se reintroduce el predicado abierto.
--
-- Nota: sin BEGIN/COMMIT — el runner db-migrate.mjs envuelve todo en una
-- sola transacción.

-- 1) webhook_events: elimina el predicado siempre-verdadero como única defensa
--    y cierra el acceso PostgREST. La denegación pasa a ser por privilegio.
DROP POLICY IF EXISTS webhook_events_select ON public.webhook_events;
DROP POLICY IF EXISTS webhook_events_insert ON public.webhook_events;

-- Política mínima para conexiones owner-scoped bajo FORCE RLS: sólo filas
-- con provider_event_id presente, y únicamente para roles con privilegio
-- (que ya no incluye a anon/authenticated tras el REVOKE).
CREATE POLICY webhook_events_select ON public.webhook_events FOR SELECT
  USING (provider_event_id IS NOT NULL);
CREATE POLICY webhook_events_insert ON public.webhook_events FOR INSERT
  WITH CHECK (provider_event_id IS NOT NULL);

REVOKE ALL ON public.webhook_events FROM anon, authenticated;

-- 2) Tablas server-only sin RLS declarada. Sentencias explícitas (auditable y
--    verificable por el gate estático de db-verify).
ALTER TABLE public.accounting_accounts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.accounting_accounts FROM anon, authenticated;
ALTER TABLE public.accounting_journal_entries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.accounting_journal_entries FROM anon, authenticated;
ALTER TABLE public.accounting_ledger_lines ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.accounting_ledger_lines FROM anon, authenticated;
ALTER TABLE public.episodic_memory ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.episodic_memory FROM anon, authenticated;
ALTER TABLE public.semantic_memory ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.semantic_memory FROM anon, authenticated;
ALTER TABLE public.procedural_memory ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.procedural_memory FROM anon, authenticated;
ALTER TABLE public.fgais_model_registry ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.fgais_model_registry FROM anon, authenticated;
ALTER TABLE public.fgais_federation_replay ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.fgais_federation_replay FROM anon, authenticated;
ALTER TABLE public.isabella_learning_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.isabella_learning_state FROM anon, authenticated;
ALTER TABLE public.billing_payment_intents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.billing_payment_intents FROM anon, authenticated;
ALTER TABLE public.billing_checkout_idempotency ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.billing_checkout_idempotency FROM anon, authenticated;
ALTER TABLE public.billing_run_authorizations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.billing_run_authorizations FROM anon, authenticated;
ALTER TABLE public.observability_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.observability_events FROM anon, authenticated;
