import { createClient } from "@supabase/supabase-js";

// Safe, fallback values for the sandbox preview or production environment
const supabaseUrl = process.env.SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNTk4Nzg0MDAwLCJleHAiOjE5MTQzNjAwMDB9.your-key-here";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Validates connection with Supabase backend, reporting issues gracefully in preview
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from("tenants").select("count").limit(1);
    if (error) {
      return { success: false, message: `Error en la base de datos: ${error.message}` };
    }
    return { success: true, message: "Conexión exitosa con Supabase." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Fallo de conexión de red: ${msg}` };
  }
}
