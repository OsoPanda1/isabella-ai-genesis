-- P1-04: BookPI and audit immutability at the DB level.
-- Both tables are append-only. Audit data is stored in audit_events (the
-- canonical schema), not the retired audit_logs name.

CREATE OR REPLACE FUNCTION public.prevent_bookpi_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'ISABELLA CROWN VIOLATION: The % table is append-only. Modifying or deleting records is strictly forbidden by Sovereign DB rules.', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_bookpi_update ON public.bookpi_ledger;
CREATE TRIGGER trg_prevent_bookpi_update
BEFORE UPDATE ON public.bookpi_ledger
FOR EACH ROW
EXECUTE FUNCTION public.prevent_bookpi_mutation();

DROP TRIGGER IF EXISTS trg_prevent_bookpi_delete ON public.bookpi_ledger;
CREATE TRIGGER trg_prevent_bookpi_delete
BEFORE DELETE ON public.bookpi_ledger
FOR EACH ROW
EXECUTE FUNCTION public.prevent_bookpi_mutation();

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
