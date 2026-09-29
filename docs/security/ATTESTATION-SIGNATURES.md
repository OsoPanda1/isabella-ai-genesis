# Atestaciones Isabella — firmas RSA-2048 externas

**Clasificación:** control criptográfico de integridad/procedencia.
**Versión del contrato:** 1.0.0
**Algoritmo:** RSA-2048 · SHA-256 · PKCS#1 v1.5
**Estado actual:** `IMPLEMENTED / TESTED` (módulo + pruebas) · `EVIDENCE_GATED` en las ranuras 1–3 (falta clave pública y payload).

---

## 1. Qué es una atestación y qué no es

Una atestación es una firma producida fuera del repositorio que Isabella puede
**verificar localmente**. Tres piezas deben coincidir:

```
firma (base64, en el entorno)
  + clave pública (PEM SPKI, en disco local)
  + payload (bytes exactos firmados, en disco local)
  = VERIFIED
```

Lo que **no** es:

- No es una clave privada. Un blob de 256 bytes es la longitud de una firma
  RSA-2048, no material de clave.
- No es una prueba por sí sola. Sin clave pública y sin payload, una firma es
  bytes huérfanos.
- No es equivalente a un sello IGDS (Ed25519) ni a la firma de BookPI; son
  sistemas distintos con trust model distinto.

## 2. Contrato de configuración

| Variable | Visibilidad | Descripción |
| --- | --- | --- |
| `ISABELLA_ATTESTATION_DIR` | pública | Directorio local con `<slot>.pub.pem` y `<slot>.payload.txt`. Por defecto `secrets/attestations`. |
| `ISABELLA_ATTESTATION_1_SIGNATURE` | secreta | Firma en base64 de la ranura 1. |
| `ISABELLA_ATTESTATION_2_SIGNATURE` | secreta | Firma en base64 de la ranura 2. |
| `ISABELLA_ATTESTATION_3_SIGNATURE` | secreta | Firma en base64 de la ranura 3. |

Los valores reales viven **solo** en `.env` local (`gitignore: .env`, `secrets/`, `*.pem`).
`.env.example` documenta la clave con valor vacío (AGENTS.md §2.3).

## 3. Estados (fail-closed)

| Estado | Significado |
| --- | --- |
| `VERIFIED` | Firma, clave pública y payload coinciden. |
| `NOT_CONFIGURED` | No hay ninguna pieza. Ausencia de evidencia ≠ PASS. |
| `MISSING_SIGNATURE` | Hay material pero falta la firma en el entorno. |
| `MISSING_PUBLIC_KEY` | Hay firma pero no hay `<slot>.pub.pem`. |
| `MISSING_PAYLOAD` | Hay firma y clave pero no hay `<slot>.payload.txt`. |
| `INVALID_PUBLIC_KEY` | El PEM existe pero no es una clave pública parseable. |
| `SIGNATURE_MISMATCH` | Clave o payload distintos de los que se firmaron. |

`verifyIsabellaAttestations()` devuelve `verified: true` **solo** cuando todas las
ranuras configuradas están en `VERIFIED`. No existe ruta de *allow local*
(AGENTS.md §4.2). `assertIsabellaAttestationsVerified()` lanza `ATTESTATION_NOT_VERIFIED`
ante cualquier estado no verificado.

Los reportes solo contienen huellas `sha256:…` de 32 hex; nunca la firma, el
payload ni la clave.

## 4. Operación

```bash
# Generar par persistente + firmar un payload (escribe el material localmente)
pnpm attestation:keygen --slot 1 --payload "Mensaje confidencial o payload"

# Verificar las tres ranuras contra .env local
pnpm attestation:verify

# Desde código (server-side)
import { verifyIsabellaAttestations } from "@/lib/signatures/attestation.server";
const report = verifyIsabellaAttestations();
```

La clave privada se escribe en `secrets/attestations/<slot>.key.pem` con
permisos `0600` y **nunca** se lee desde `src/`.

## 5. Estado de las ranuras 1–3 (2026-09-28)

Las tres firmas fueron producidas con:

```powershell
$rsa = [System.Security.Cryptography.RSA]::Create(2048)
$bytesFirma = $rsa.SignData($bytesMensaje,
  [System.Security.Cryptography.HashAlgorithmName]::SHA256,
  [System.Security.Cryptography.RSASignaturePadding]::Pkcs1)
```

`RSA.Create(2048)` genera un par **efímero por sesión**. Ese guion no exporta ni
la clave pública ni la clave privada, por lo que al cerrar la sesión el par se
pierde. Consecuencia verificable:

| Ranura | Firma | Clave pública | Payload | Estado |
| --- | --- | --- | --- | --- |
| 1 | presente (256 B) | ausente | ausente | `MISSING_PUBLIC_KEY` |
| 2 | presente (256 B) | ausente | ausente | `MISSING_PUBLIC_KEY` |
| 3 | presente (256 B) | ausente | ausente | `MISSING_PUBLIC_KEY` |

**Ninguna ranura puede pasar a `VERIFIED` hasta recuperar o regenerar esos dos
elementos.** La ausencia no se convierte en PASS por inferencia.

### Opción A — si la sesión de PowerShell sigue abierta

```powershell
[System.IO.File]::WriteAllText(
  "C:\...\secrets\attestations\1.pub.pem",
  $rsa.ExportSubjectPublicKeyInfoPem())
```

Y registrar los bytes exactos firmados en `secrets/attestations/1.payload.txt`.

### Opción B — si la clave privada ya no existe (escenario esperado)

Generar un par nuevo persistente y volver a firmar:

```bash
pnpm attestation:keygen --slot 1 --payload "texto exacto"
pnpm attestation:verify
```

## 6. Rotación

`active → grace → deprecated → revoked`. Cada rotación exige un `slot`/`keyId`
nuevo, verificación con la clave nueva y verificación de históricos con la
anterior (AGENTS.md §8.5). Descriptor de rotación: `180d`.

## 7. Relación con el resto de la arquitectura

| Sistema | Clave | Alcance |
| --- | --- | --- |
| Atestación (este documento) | RSA-2048 externa | Evidencia externa verificable localmente |
| IGDS | Ed25519 PEM PKCS8 | Sello de documentos con procedencia |
| BookPI | ECDSA P-384 / declarada | Cadena hash del ledger económico |
| CROWN | simétrica ≥32 | Firmas de `PolicyDecision` |
| NATIVE JWT | Ed25519 | Firma de tokens internos |

Ninguno sustituye a otro y ninguno convierte una firma en verdad del contenido.

## 8. Referencias

- AGENTS.md §2.3 (secretos), §4.2 (fail-closed), §8 (triángulo criptográfico), §19 (gates).
- `docs/security/THREAT-MODEL-TINA-ISABELLA.md` — TINA-09 (tampering de evidencia).
- `test/unit/attestation-signature.test.ts` — 18 pruebas del contrato.
- RFC 8017 §8.1 — RSASSA-PKCS1-v1_5.
