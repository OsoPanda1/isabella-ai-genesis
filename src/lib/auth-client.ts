/**
 * CLIENTE DE AUTENTICACIÓN SOBERANA (src/lib/auth-client.ts)
 * -----------------------------------------------------------------
 * Única vía para que la UI conozca la identidad del nodo y su token de
 * sesión. Este módulo NUNCA acuña tokens por su cuenta: el servidor solo
 * entrega tokens mediante flujos autorizados (OAuth manual en desarrollo
 * o IDP OIDC/Supabase en producción).
 */

const SESSION_TOKEN_KEY = "isabella_session_token";
const SOVEREIGN_USER_ID_KEY = "isabella.sovereign.userId";

/** Devuelve el token de sesión vigente (si existe). No acuña nada. */
export function getSessionToken(): string {
  try {
    return window.sessionStorage.getItem(SESSION_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

/** Persiste un token de sesión emitido por el servidor. */
export function setSessionToken(token: string): void {
  try {
    window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch {
    // Almacenamiento no disponible: el token se mantendrá solo en memoria.
  }
}

/** Identidad de nodo configurada localmente (provisioning/dev). */
export function getStoredSovereignUserId(): string {
  try {
    return window.localStorage.getItem(SOVEREIGN_USER_ID_KEY) || "";
  } catch {
    return "";
  }
}

export function setStoredSovereignUserId(userId: string): void {
  try {
    window.localStorage.setItem(SOVEREIGN_USER_ID_KEY, userId);
  } catch {
    // Almacenamiento no disponible.
  }
}

/**
 * Valida un evento postMessage de OAuth contra el origen EXACTO de la app.
 * Nunca se aceptan orígenes parcialmente coincidentes (`*.run.app`), evitando
 * el robo de tokens mediante cross-origin messaging.
 */
export function isTrustedOAuthEvent(event: MessageEvent): boolean {
  return event.origin === window.location.origin;
}