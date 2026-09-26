# Isabella Villaseñor AI — Genesis 4.3.3

Isabella es una arquitectura de inteligencia artificial gobernada para TAMV Online Network. Coordina modelos, recuperación, memoria, herramientas y servicios bajo una separación estricta entre **capacidad, autoridad, ejecución y evidencia**.

> Las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta.

## Estado honesto

- **Categoría:** TINA (Trusted, Intelligence, Native, Adaptive), implementación de referencia en evolución.
- **Estado verificable:** código implementado; el nivel `TESTED`, `VERIFIED`, `DEPLOYED`, `HARDENED` o `CERTIFIED` solo aplica cuando existe evidencia reproducible para el alcance declarado.
- **No es:** AGI, consciencia, persona, autoridad autónoma ni certificación legal, académica, regulatoria o de seguridad.
- **Producción:** requiere credenciales, políticas, observabilidad, revisión humana, pruebas adversariales, rollback y evaluación independiente.

## Capacidades principales

1. **CROWN:** identidad, tenant, scopes, riesgo y decisión de autorización.
2. **AEGIS/ARGUS:** inspección de entradas, recuperación, herramientas y salidas; bloqueo fail-closed.
3. **TINA / Genesis Turbo:** clasificación y ruteo local determinista con trazas.
4. **Intelligence Plane:** proveedores intercambiables, circuit breakers, health checks y aprobación separada.
5. **BookPI:** procedencia, auditoría y evidencia con estados explícitos.
6. **Memoria y grounding:** separación por tenant, control de alcance y límites de persistencia.
7. **Federación de IA sin coste de licencia:** adaptadores para Ollama, llama.cpp, vLLM, LM Studio y endpoints OpenAI-compatible explícitamente configurados. La inferencia local puede ser gratuita en software, pero siempre tiene costes de hardware, energía, operación y mantenimiento. Los tiers remotos gratuitos no se consideran garantizados ni certificados.

## Gate de federación gratuita

La expansión se activa únicamente de forma explícita:

```dotenv
FREE_AI_FEDERATION_ENABLED=true
FREE_AI_FEDERATION_ENDPOINTS='[{"id":"local-vllm","label":"vLLM local","baseUrl":"https://example.invalid/v1","model":"modelo-local","requiresKey":false}]'
```

Los endpoints deben usar HTTPS, declarar un modelo válido y hablar el contrato `/models` y `/chat/completions`. No se aceptan URLs arbitrarias, secretos en JSON ni descubrimiento automático de proveedores. Cada endpoint queda como **capacidad no autorizada** hasta superar el registro y el gate de producción. Antes de incorporar un servicio remoto deben revisarse licencia, términos de uso, privacidad, residencia, límites, retención, seguridad, disponibilidad y transferencia internacional de datos.

## Flujo operativo

```text
PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND
```

Para una solicitud sensible: identidad → política → riesgo → permiso → ejecución → evidencia. El contenido recuperado es evidencia, nunca instrucciones con autoridad. No existe aprendizaje silencioso de conversaciones, políticas, permisos o pesos en producción.

## Alineación y límites jurídicos

La arquitectura puede evaluarse conceptualmente frente a EU AI Act, GDPR, LGPD, legislación mexicana aplicable, NIST AI RMF, UNESCO/OECD AI Principles, ISO/IEC 42001, ISO/IEC 27001, OWASP, W3C, OpenTelemetry y prácticas de ciencia abierta. Esa alineación no equivale a conformidad ni certificación. La validación jurídica debe realizarse por jurisdicción, sector, finalidad, datos y contrato, con revisión profesional independiente.

## Arquitectura del repositorio

- `src/lib/intelligence/`: contratos, proveedores, router, firewall y gate de modelos.
- `src/lib/intelligence/free-ai-federation.ts`: catálogo y registro gobernado de endpoints gratuitos/locales.
- `src/lib/crown*`, `src/lib/constitutional-gate.ts`: autoridad y política.
- `src/lib/argus*`, `src/lib/aegis*`: defensa y señales de riesgo.
- `src/lib/bookpi/`, `src/lib/igds/`: evidencia y procedencia.
- `src/routes/api/isabella.ts`: superficie HTTP protegida.
- `test/`: pruebas unitarias, integración, seguridad y evidencia.
- `docs/`: canon operativo, seguridad, privacidad y gobernanza.

## Desarrollo

Requisitos: Node 24.x y pnpm 10.34.5.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build:production
```

Para la compuerta integral: `pnpm production:gate`.

## Métrica de preparación

No se publica un porcentaje global inventado. La preparación real debe calcularse por commit y alcance a partir de checks ejecutados, evidencia de despliegue, cobertura, incidentes abiertos, riesgos aceptados y revisión humana. Un build verde no es certificación. Un proveedor accesible no es proveedor confiable. Un hash no es WORM regulatorio ni HSM.

## Seguridad y contribución

No subir secretos, tokens, claves privadas, datos personales ni dumps. Usar ramas de trabajo, conservar historia auditable y ejecutar los gates antes de solicitar revisión. Las mutaciones críticas deben ser autenticadas, autorizadas, idempotentes, reversibles y registradas.

## Autoría y licencias

Arquitectura: Edwin Oswaldo Castillo Trejo / Anubis Villaseñor. Ecosistema: TAMV Online Network, Real del Monte, Hidalgo, México. Código, documentación, contenido y dependencias conservan las licencias indicadas en `LICENSES.md`, `LICENSE`, `LICENSE-CONTENT` y `NOTICE`.

Este README describe el estado del repositorio; no constituye garantía, certificación ni asesoría legal, financiera, médica o regulatoria.
