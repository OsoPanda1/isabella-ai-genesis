import { SovereignDB } from "./sovereign-engine";
import { ApiKeyCrypto } from "./api-key-crypto";
import type { ApiKeyRecord } from "./credential-types";
import { config } from "./config";

/**
 * SERVICIO CENTRAL DE CICLO DE VIDA DE API KEYS
 * Responsabilidad: Crear, verificar, rotar, revocar y enlistar llaves API.
 */
export class ApiKeyService {
  /**
   * Crea una nueva API Key y la guarda de forma segura. Retorna la llave cruda UNA SOLA VEZ.
   */
  public static createApiKey(
    tenantId: string,
    ownerId: string,
    name: string,
    role: string,
    scopes: string[],
    expiresInSeconds?: number,
  ): {
    id: string;
    name: string;
    key: string;
    prefix: string;
    scopes: string[];
    expiresAt?: string;
  } {
    const id = crypto.randomUUID();
    const prefix = `${config().API_KEY_PREFIX || "isa_live"}_${ApiKeyCrypto.generatePrefix()}`;
    const secret = ApiKeyCrypto.generateSecret();
    const rawKey = `${prefix}_${secret}`;
    const keyHash = ApiKeyCrypto.hashSecret(rawKey);

    const ttl = expiresInSeconds !== undefined ? expiresInSeconds : config().API_KEY_DEFAULT_TTL;
    const expiresAt = ttl ? new Date(Date.now() + ttl * 1000).toISOString() : undefined;

    const record: ApiKeyRecord = {
      id,
      tenant_id: tenantId,
      owner_id: ownerId,
      name,
      prefix,
      key_hash: keyHash,
      role,
      scopes,
      status: "active",
      created_at: new Date().toISOString(),
      ...(expiresAt ? { expires_at: expiresAt } : {}),
    };

    const keys = SovereignDB.getApiKeys();
    keys.push(record);
    SovereignDB.saveApiKeys(keys);

    // Guardar evento de auditoría canónico
    SovereignDB.appendAuditLog(
      `trace_ak_${crypto.randomUUID().slice(0, 8)}`,
      `corr_ak_${crypto.randomUUID().slice(0, 8)}`,
      "127.0.0.1",
      "api_key.created",
      "S3",
      `API Key [${id}] con prefijo [${prefix}] creada por usuario [${ownerId}] para tenant [${tenantId}].`,
    );

    return {
      id,
      name,
      key: rawKey,
      prefix,
      scopes,
      ...(expiresAt ? { expiresAt } : {}),
    };
  }

  /**
   * Verifica la integridad y vigencia de una llave cruda en tiempo constante.
   */
  public static verifyApiKey(rawKey: string): {
    success: boolean;
    record?: ApiKeyRecord;
    error?: string;
  } {
    if (!rawKey) {
      return { success: false, error: "invalid_credential" };
    }

    // Extraer prefijo buscando la última parte
    const parts = rawKey.split("_");
    if (parts.length < 3) {
      return { success: false, error: "invalid_credential" };
    }

    // El prefijo es todo antes del último fragmento secreto
    const prefix = parts.slice(0, -1).join("_");

    const keys = SovereignDB.getApiKeys();
    const record = keys.find((k) => k.prefix === prefix);

    if (!record) {
      return { success: false, error: "invalid_credential" };
    }

    // Verificar firma constante
    const signatureMatch = ApiKeyCrypto.verifySecret(rawKey, record.key_hash);
    if (!signatureMatch) {
      return { success: false, error: "invalid_credential" };
    }

    // Verificar estatus
    if (record.status !== "active") {
      return { success: false, error: `credential_${record.status}` };
    }

    // Verificar vigencia temporal
    if (record.expires_at && new Date(record.expires_at).getTime() < Date.now()) {
      record.status = "expired";
      SovereignDB.saveApiKeys(keys);
      return { success: false, error: "credential_expired" };
    }

    // Touch last used timestamp
    record.last_used_at = new Date().toISOString();
    SovereignDB.saveApiKeys(keys);

    return { success: true, record };
  }

  /**
   * Revoca una API Key por completo.
   */
  public static revokeApiKey(id: string, tenantId: string): boolean {
    const keys = SovereignDB.getApiKeys();
    const record = keys.find((k) => k.id === id && k.tenant_id === tenantId);

    if (!record) return false;

    record.status = "revoked";
    record.revoked_at = new Date().toISOString();
    SovereignDB.saveApiKeys(keys);

    SovereignDB.appendAuditLog(
      `trace_ak_${crypto.randomUUID().slice(0, 8)}`,
      `corr_ak_${crypto.randomUUID().slice(0, 8)}`,
      "127.0.0.1",
      "api_key.revoked",
      "S2",
      `API Key [${id}] revocada exitosamente.`,
    );

    return true;
  }

  /**
   * Rota una llave API activa, revocando la anterior y creando una nueva con el mismo nivel de permisos.
   */
  public static rotateApiKey(
    id: string,
    tenantId: string,
  ): {
    success: boolean;
    newKey?: {
      id: string;
      name: string;
      key: string;
      prefix: string;
      scopes: string[];
      expiresAt?: string;
    };
    error?: string;
  } {
    const keys = SovereignDB.getApiKeys();
    const oldRecord = keys.find((k) => k.id === id && k.tenant_id === tenantId);

    if (!oldRecord) {
      return { success: false, error: "Llave no encontrada." };
    }

    // Revocar vieja
    oldRecord.status = "revoked";
    oldRecord.revoked_at = new Date().toISOString();
    SovereignDB.saveApiKeys(keys);

    // Crear nueva
    const newKey = this.createApiKey(
      tenantId,
      oldRecord.owner_id,
      oldRecord.name,
      oldRecord.role,
      oldRecord.scopes,
      oldRecord.expires_at
        ? Math.max(0, Math.floor((new Date(oldRecord.expires_at).getTime() - Date.now()) / 1000))
        : undefined,
    );

    // Marcar origen
    const updatedKeys = SovereignDB.getApiKeys();
    const newRecord = updatedKeys.find((k) => k.id === newKey.id);
    if (newRecord) {
      newRecord.rotated_from = id;
      SovereignDB.saveApiKeys(updatedKeys);
    }

    return { success: true, newKey };
  }

  /**
   * Enlista todas las API Keys registradas en un tenant (ocultando siempre los secretos).
   */
  public static listApiKeys(tenantId: string): ApiKeyRecord[] {
    const keys = SovereignDB.getApiKeys();
    return keys.filter((k) => k.tenant_id === tenantId);
  }
}
