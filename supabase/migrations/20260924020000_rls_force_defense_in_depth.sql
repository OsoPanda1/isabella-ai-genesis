-- ISABELLA AI GENESIS — RLS defense-in-depth: FORCE RLS (2026-09-24)
-- Restaura FORCE ROW LEVEL SECURITY como defensa en profundidad.
-- La migración 20260914130000_rls_operational_fix retiró FORCE para compatibilidad
-- con conexiones owner-scoped sin JWT. Este parche lo reinstaura de forma
-- idempotente: las conexiones privilegiadas deben fijar request.jwt.claims o usar
-- SET LOCAL ROLE / bypass según política; anon/authenticated sin tenant quedan denegados.
-- Nota: sin BEGIN/COMMIT — el runner db-migrate.mjs envuelve todo en una sola transacción

-- Asegura RLS habilitado y forzado en tablas críticas de tenant
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories FORCE ROW LEVEL SECURITY;

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys FORCE ROW LEVEL SECURITY;

ALTER TABLE public.bookpi_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookpi_ledger FORCE ROW LEVEL SECURITY;

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events FORCE ROW LEVEL SECURITY;

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events FORCE ROW LEVEL SECURITY;

ALTER TABLE public.economic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economic_events FORCE ROW LEVEL SECURITY;

-- Tablas de identidad también con FORCE para cerrar bypass por owner
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants FORCE ROW LEVEL SECURITY;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions FORCE ROW LEVEL SECURITY;

-- Tablas adicionales con RLS defensivo
DO $$
BEGIN
  IF to_regclass('public.sovereign_state') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.sovereign_state ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.sovereign_state FORCE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.approval_grants') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.approval_grants ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.approval_grants FORCE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.monetization_accounts') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.monetization_accounts ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.monetization_accounts FORCE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.kill_switch_state') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.kill_switch_state ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.kill_switch_state FORCE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.marketplace_listings') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.marketplace_listings FORCE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.virtual_cards') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.virtual_cards FORCE ROW LEVEL SECURITY';
  END IF;
END $$;
