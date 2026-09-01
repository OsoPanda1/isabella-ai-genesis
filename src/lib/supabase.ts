/**
 * CLIENTE SUPABASE (src/lib/supabase.ts)
 * -----------------------------------------------------------------
 * Crea el cliente de Supabase a partir de la configuración validada
 * (`config()`), NUNCA de `process.env` directo.
 *
 * En desarrollo, si no hay credenciales, el cliente no se instancia y
 * se reporta `configured: false` con un motivo claro — no se usan
 * valores de relleno falsos (prohibido el mockdata). En producción,
 * `runtime-integrity` ya exige estas variables antes de arrancar.
 */

import { config } from "./config";

/** Cliente guardado tras la primera construcción. */
let cachedClient: SupabaseState | null = null;

/**
 * Crea el cliente Supabase subyacente. Se importa de forma perezosa
 * para no cargar el SDK en entornos sin red ni credenciales.
 */
function createClientInternal() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createClient;
}

export interface SupabaseState {
  client: unknown;
  configured: boolean;
  reason: string;
}

function buildState(): SupabaseState {
  const cfg = config();
  const url = cfg.SUPABASE_URL;
  const anonKey = cfg.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return {
      client: null,
      configured: false,
      reason: "SUPABASE_URL o SUPABASE_ANON_KEY no configurados (modo sin base de datos).",
    };
  }

  try {
    const create = createClientInternal();
    const client = create(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
    return { client, configured: true, reason: "Cliente Supabase configurado." };
  } catch (error) {
    return {
      client: null,
      configured: false,
      reason: error instanceof Error ? `No se pudo construir el cliente: ${error.message}` : "Error desconocido.",
    };
  }
}

/** Devuelve el cliente Supabase si está configurado; si no, `null`. */
export function getSupabaseClient(): { client: unknown; configured: boolean } {
  if (!cachedClient) cachedClient = buildState();
  return { client: cachedClient.client, configured: cachedClient.configured };
}

/** Estado de configuración para telemetría. */
export function supabaseState(): SupabaseState {
  if (!cachedClient) cachedClient = buildState();
  return cachedClient;
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const state = supabaseState();
  if (!state.configured) {
    return { success: false, message: state.reason };
  }
  const client = state.client as { from: (table: string) => { select: (q: string) => Promise<{ data: unknown; error: { message: string } | null }> } };
  try {
    const { error } = await client.from("tenants").select("count");
    if (error) {
      return { success: false, message: `Error en la base de datos: ${error.message}` };
    }
    return { success: true, message: "Conexión exitosa con Supabase." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Fallo de conexión de red: ${msg}` };
  }
}