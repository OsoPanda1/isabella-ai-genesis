# Isabella Villaseñor AI

Plataforma cognitiva soberana para TAMV / RDM Digital / Nodo Cero. El sistema coordina percepción, memoria, ARGUS, CROWN, ORION, evidencia BookPI y economía bajo una regla innegociable: las inteligencias sugieren; el humano decide, aprueba y ejecuta.

## Arquitectura operativa

`Perceive → Remember → Policy Gate (ARGUS) → Decide (CROWN) → Act (ORION) → Audit (BookPI)`

- **ARGUS/Aegis-X**: riesgo, veto, frontera territorial y autorización fail-closed.
- **CROWN**: orquestación y decisión constitucional.
- **ISA/SOPHIA/ORION**: presencia, síntesis y ejecución autorizada.
- **MNEMOS**: memoria inmediata, sesión, proyecto, territorial e histórica.
- **BookPI**: evidencia append-only y correlación de decisiones.

## Cambios de este hardening

- Catálogo API endurecido con `z.record` en lugar de `z.any`.
- Validación estricta de método y path contra el contrato registrado.
- Eliminadas respuestas de éxito simuladas y latencias aleatorias del endpoint de catálogo.
- La ejecución de catálogo ahora identifica explícitamente la delegación al handler registrado; no falsifica ejecución de herramientas.
- API keys con validación de tenant, propietario, nombre, scopes y TTL; los secretos nunca se almacenan en crudo.
- Revocación, expiración y rotación conservan hash, prefijo y trazabilidad.
- Integraciones Stripe y Supabase verificadas antes de tocar pagos o persistencia.
- README actualizado para distinguir capacidades operativas, experimentales y bloqueadas.

## Seguridad y producción

- No hay tokens fabricados en el cliente.
- ARGUS/CROWN deben permanecer fail-closed.
- Toda ruta sensible debe derivar tenant desde identidad verificada y validar scopes.
- Los webhooks de Stripe deben verificar firma, idempotencia y reconciliación antes de modificar ledger.
- Supabase debe usar RLS; PostgreSQL/Neon debe filtrar por `userId` y tenant en cada consulta.
- No utilizar JSON/localStorage como autoridad financiera o de identidad en producción.
- No almacenar API keys, JWT, PII ni payloads sensibles en logs.

## Desarrollo y validación

```bash
pnpm install
pnpm dev
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm test
pnpm run security:scan
pnpm run build:production
```

## Variables e integraciones

Usa las variables administradas por Vercel para Supabase, Stripe, Neon y Redis. Nunca comitees secretos. En producción se requieren un IdP real, claves criptográficas rotadas, persistencia administrada, rate limiting, observabilidad y webhooks verificados.

## Monetización

La monetización solo puede activarse después de identidad verificada, consentimiento, aceptación de términos, elegibilidad, controles antifraude/KYC cuando apliquen, ledger doble partida, conciliación y webhook confirmado. Ningún balance visual constituye dinero real.

## Estado honesto

Quantum, proveedores de inferencia externos y capacidades no verificadas permanecen experimentales o bloqueadas hasta existir adapter real, límites, auditoría y pruebas de producción. El catálogo no declara que un contrato se haya ejecutado si únicamente fue autorizado y delegado.

## Licencia

Consultar `AGENTS.md` y los avisos de cada dependencia. La documentación de dominio utiliza CC BY 4.0 cuando corresponde.
