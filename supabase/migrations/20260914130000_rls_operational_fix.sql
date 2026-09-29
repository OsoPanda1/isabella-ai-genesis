-- ISABELLA AI GENESIS — RLS operational compatibility fix
-- Fecha: 2026-09-14
--
-- El backend productivo usa conexiones PostgreSQL de servidor para repositorios
-- tenant-scoped. Esas conexiones no son sesiones Supabase con JWT de usuario.
-- La migración anterior activó FORCE ROW LEVEL SECURITY y eso podía bloquear
-- rutas legítimamente autenticadas porque request.jwt.claims no existía.
--
-- Regla de cierre:
--   * RLS queda ENABLED como política de defensa y para clientes no privilegiados.
--   * FORCE RLS se retira de las tablas consultadas por el backend owner-scoped.
--   * El aislamiento productivo continúa imponiéndose por PrincipalContext +
--     autorización server-side + tenant_id en cada repositorio.
--   * Las políticas permanecen explícitas para futuras conexiones con JWT.
--
-- No contiene datos ni credenciales.
-- Nota: sin BEGIN/COMMIT — el runner envuelve todo en una sola transacción

ALTER TABLE public.memories NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bookpi_ledger NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.economic_events NO FORCE ROW LEVEL SECURITY;

-- BookPI: lectura/escritura tenant-scoped para conexiones que sí respeten RLS.
DROP POLICY IF EXISTS bookpi_select ON public.bookpi_ledger;
DROP POLICY IF EXISTS bookpi_insert ON public.bookpi_ledger;
DROP POLICY IF EXISTS bookpi_update ON public.bookpi_ledger;
DROP POLICY IF EXISTS bookpi_delete ON public.bookpi_ledger;
CREATE POLICY bookpi_select ON public.bookpi_ledger FOR SELECT
  USING (tenant_id = public.current_request_tenant_id());
CREATE POLICY bookpi_insert ON public.bookpi_ledger FOR INSERT
  WITH CHECK (tenant_id = public.current_request_tenant_id());
CREATE POLICY bookpi_update ON public.bookpi_ledger FOR UPDATE
  USING (tenant_id = public.current_request_tenant_id())
  WITH CHECK (tenant_id = public.current_request_tenant_id());
CREATE POLICY bookpi_delete ON public.bookpi_ledger FOR DELETE
  USING (tenant_id = public.current_request_tenant_id());

-- Audit: tenant boundary. No UPDATE/DELETE authority is granted by policy.
DROP POLICY IF EXISTS audit_events_select ON public.audit_events;
DROP POLICY IF EXISTS audit_events_insert ON public.audit_events;
DROP POLICY IF EXISTS audit_events_update ON public.audit_events;
DROP POLICY IF EXISTS audit_events_delete ON public.audit_events;
CREATE POLICY audit_events_select ON public.audit_events FOR SELECT
  USING (tenant_id = public.current_request_tenant_id());
CREATE POLICY audit_events_insert ON public.audit_events FOR INSERT
  WITH CHECK (tenant_id = public.current_request_tenant_id());
CREATE POLICY audit_events_update ON public.audit_events FOR UPDATE
  USING (false) WITH CHECK (false);
CREATE POLICY audit_events_delete ON public.audit_events FOR DELETE
  USING (false);

-- Webhooks/economic events: tenant-bound where the schema carries tenant_id.
DROP POLICY IF EXISTS webhook_events_select ON public.webhook_events;
DROP POLICY IF EXISTS webhook_events_insert ON public.webhook_events;
DROP POLICY IF EXISTS economic_events_select ON public.economic_events;
DROP POLICY IF EXISTS economic_events_insert ON public.economic_events;
CREATE POLICY webhook_events_select ON public.webhook_events FOR SELECT
  USING (provider_event_id IS NOT NULL);
CREATE POLICY webhook_events_insert ON public.webhook_events FOR INSERT
  WITH CHECK (provider_event_id IS NOT NULL);
CREATE POLICY economic_events_select ON public.economic_events FOR SELECT
  USING (tenant_id = public.current_request_tenant_id());
CREATE POLICY economic_events_insert ON public.economic_events FOR INSERT
  WITH CHECK (tenant_id = public.current_request_tenant_id());
