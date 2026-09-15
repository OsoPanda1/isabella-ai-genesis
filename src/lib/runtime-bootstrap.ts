/**
 * Runtime bootstrap mínimo antes de cargar módulos que consumen config().
 *
 * Vercel puede entregar DATABASE_URL sin el alias ISABELLA_STORAGE_PROVIDER.
 * En ese caso el único backend durable permitido por el runtime es PostgreSQL;
 * se deriva explícitamente ese proveedor antes de importar el router. Nunca se
 * habilitan JSON, memoria ni Supabase como autoridad de persistencia.
 */
const databaseUrl = process.env.DATABASE_URL?.trim();
const configuredProvider = process.env.ISABELLA_STORAGE_PROVIDER?.trim();

if (!configuredProvider && databaseUrl) {
  process.env.ISABELLA_STORAGE_PROVIDER = "postgres";
}
