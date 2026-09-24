-- Isabella API key hardening.
-- Secret material remains outside the database; only a v7 KDF hash is stored.
-- Legacy `isa_*` credentials remain verifiable for controlled migration, while
-- newly issued credentials use `isk_<environment>_<identifier>_<secret>`.

ALTER TABLE public.api_keys
  DROP CONSTRAINT IF EXISTS api_keys_prefix_format;

ALTER TABLE public.api_keys
  ADD CONSTRAINT api_keys_prefix_format
  CHECK (prefix ~ '^(isk|isa)_(live|stage|test)_[A-Za-z0-9]+$');

ALTER TABLE public.api_keys
  DROP CONSTRAINT IF EXISTS api_keys_scopes_nonempty;

ALTER TABLE public.api_keys
  ADD CONSTRAINT api_keys_scopes_nonempty
  CHECK (cardinality(scopes) BETWEEN 1 AND 64);

CREATE INDEX IF NOT EXISTS idx_api_keys_tenant_status
  ON public.api_keys(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_api_keys_tenant_owner
  ON public.api_keys(tenant_id, owner_id);

COMMENT ON TABLE public.api_keys IS
  'Isabella-owned API credentials. Plaintext secrets are never persisted; only versioned KDF hashes are stored.';
