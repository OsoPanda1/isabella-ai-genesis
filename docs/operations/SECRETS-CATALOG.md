# Claves y secretos de Isabella

Este documento separa las variables necesarias para operar Isabella de las variables opcionales de integraciones. Los nombres corresponden al contrato ejecutable de `src/lib/env-schema.ts`. **Nunca** se deben copiar valores reales al repositorio, README, logs o tickets.

## 1. Claves externas

Son credenciales, URLs o identificadores emitidos por un tercero. Solo son necesarias si se activa la capacidad correspondiente.

### Persistencia y servicios de infraestructura

| Variable | Servicio | Necesidad |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL/Neon/Supabase | Obligatoria para producción con persistencia SQL |
| `DATABASE_DIRECT_URL` | PostgreSQL directo | Opcional para migraciones y tareas administrativas |
| `SUPABASE_URL` | Supabase | Solo si se usa Supabase |
| `SUPABASE_ANON_KEY` | Supabase | Solo cliente Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Solo backend administrativo; nunca exponer al cliente |
| `SUPABASE_JWT_SECRET` | Supabase | Solo validación JWT propia de Supabase |
| `REDIS_URL` | Redis/Upstash | Opcional; rate limit/cache distribuido |
| `REDIS_TOKEN` | Redis/Upstash | Requerida junto con `REDIS_URL` cuando el proveedor exige token |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OpenTelemetry | Opcional; telemetría externa |

### Modelos e IA externa

| Variable | Servicio | Necesidad |
| --- | --- | --- |
| `GEMINI_API_KEY` | Google Gemini/Gateway configurado | Requerida para respuestas con Gemini |
| `GROQ_API_KEY` | Groq | Opcional |
| `XAI_API_KEY` | xAI | Opcional |
| `OPENAI_COMPATIBLE_BASE_URL` | Proveedor OpenAI-compatible | Opcional; debe ser HTTPS en producción |
| `OPENAI_COMPATIBLE_API_KEY` | Proveedor OpenAI-compatible | Requerida solo junto a ese endpoint si autentica |
| `OLLAMA_BASE_URL` | Ollama/autoservido | Opcional; no es un tercero gestionado por Isabella |
| `VOICE_API_URL` | Servicio de voz | Opcional |
| `FREE_AI_FEDERATION_ENDPOINTS` | Endpoints federados configurados por el operador | Opcional; solo HTTPS y opt-in |

### Pagos, media y otros

| Variable | Servicio | Necesidad |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Stripe | Solo pagos Stripe |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Solo webhooks Stripe |
| `MUX_INTRO_ASSET_ID` | Mux | Opcional; intro alojada en Mux |
| `MUX_PLAYBACK_ID` | Mux | Opcional; reproducción Mux |
| `TURSO_DATABASE_URL` | Turso | Solo si se selecciona Turso |
| `TURSO_AUTH_TOKEN` | Turso | Junto a `TURSO_DATABASE_URL` |
| `IGDS_TSA_URL` | Autoridad TSA externa | Opcional; sellado de tiempo |

## 2. Claves internas de Isabella

Son secretos generados y custodiados por el operador del proyecto. No dependen de una API externa. En producción deben generarse con un CSPRNG, almacenarse en Vercel/secret manager y rotarse con un procedimiento documentado.

### Mínimo obligatorio para producción

| Variable | Propósito | Requisito |
| --- | --- | --- |
| `ISABELLA_RUNTIME_MODE=production` | Selecciona política de producción | Obligatoria |
| `PUBLIC_URL` | URL canónica desplegada | Obligatoria; HTTPS |
| `ISABELLA_STORAGE_PROVIDER` | Proveedor de persistencia seleccionado | Obligatoria |
| `AUTH_JWT_SECRET` | Firma de identidad Bearer/JWT | Mínimo 32 bytes aleatorios |
| `ENCRYPTION_MASTER_KEY` | Cifrado de datos sensibles | Mínimo 32 bytes aleatorios |
| `CROWN_POLICY_SIGNING_KEY` | Firma de decisiones de CROWN | Clave privada/secreto gestionado |
| `AEGIS_AUDIT_SECRET` | Integridad de auditoría ARGUS | Mínimo 32 bytes aleatorios |
| `BOOKPI_SIGNING_KEY` | Firma de evidencias BookPI | Mínimo 32 bytes aleatorios |
| `PROVISION_OWNER_TOKEN` | Bootstrap único del owner | Generar una vez, rotar/revocar después |
| `API_KEY_HASH_SECRET` | Hash de API keys Isabella | Mínimo 32 bytes aleatorios si se emiten API keys |
| `SESSION_SECRET` | Firma de cookies de sesión | Mínimo 32 bytes aleatorios; recomendado |

### Internas opcionales según capacidad

| Variable | Capacidad |
| --- | --- |
| `IGDS_SIGNING_KEY` | Firma de identidad/procedencia IGDS |
| `BOOKPI_SIGNATURE_ALGORITHM` | Algoritmo declarado para BookPI |
| `CROWN_CONSTITUTION_VERSION` | Versión de constitución/policy |
| `API_KEY_PREFIX`, `API_KEY_DEFAULT_TTL`, `API_KEY_MAX_TTL`, `API_KEY_ROTATION_GRACE_SECONDS` | Ciclo de vida de API keys |
| `AUTH_AUDIENCE`, `AUTH_ISSUER`, `AUTH_ACCESS_TOKEN_TTL`, `AUTH_REFRESH_TOKEN_TTL`, `OIDC_JWKS_URL`, `JWKS_CACHE_TTL` | Validación avanzada de identidad/OIDC |
| `QUANTUM_BRIDGE_PATH`, `PYTHON_PATH` | Puente cuántico local |
| `ISABELLA_FEATURE_FLAGS` | Flags operativos |
| `OTEL_SERVICE_NAME` | Nombre interno de telemetría |

## Generación segura

Ejemplo para una clave interna de 32 bytes:

```bash
openssl rand -base64 32
```

Para una clave hexadecimal:

```bash
openssl rand -hex 32
```

No usar contraseñas humanas, UUID predecibles, valores de `.env.example`, `NEXT_PUBLIC_*` ni claves compartidas entre entornos. `AUTH_DEV_SESSION_ENABLED`, `ALLOW_GUEST_CHAT`, `DURABLE_JSON_ALLOWED`, `CROWN_ENFORCEMENT_MODE=dry-run` y cualquier bypass de desarrollo deben permanecer desactivados en staging/producción.

## Regla de realidad operativa

Tener una variable configurada no demuestra que el servicio esté conectado, autorizado o certificado. La verificación requiere ejecutar `pnpm production:preflight`, `pnpm security:scan`, pruebas de integración y una comprobación del proveedor en el entorno desplegado. Las variables opcionales no deben bloquear el arranque si su capacidad está desactivada; las claves internas críticas sí deben producir un fallo cerrado en producción.

Fuente canónica: `src/lib/env-schema.ts` y `ENV_VAR_CATALOG`.
