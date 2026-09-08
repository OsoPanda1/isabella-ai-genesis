-- P0 corrective migration: the canonical audit table is audit_events.
-- This migration is additive so already-migrated databases receive the same
-- append-only protection without rewriting migration history.

CREATE OR REPLACE FUNCTION public.prevent_bookpi_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'ISABELLA CROWN VIOLATION: The % table is append-only. Modifying or deleting records is strictly forbidden by Sovereign DB rules.', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_update ON public.audit_events;
CREATE TRIGGER trg_prevent_audit_update
BEFORE UPDATE ON public.audit_events
FOR EACH ROW
EXECUTE FUNCTION public.prevent_bookpi_mutation();

DROP TRIGGER IF EXISTS trg_prevent_audit_delete ON public.audit_events;
CREATE TRIGGER trg_prevent_audit_delete
BEFORE DELETE ON public.audit_events
FOR EACH ROW
EXECUTE FUNCTION public.prevent_bookpi_mutation();
