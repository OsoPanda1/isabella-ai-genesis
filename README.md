# Isabella Villaseñor AI — Genesis

Isabella es una interfaz cognitiva gobernada para el ecosistema TAMV Online Network. El proyecto coordina conversación, categorización TINA, ruteo CROWN, evidencia BookPI, controles ARGUS y módulos de herramientas bajo la regla: **las inteligencias sugieren, calculan y evalúan; el humano decide, aprueba y ejecuta**.

Isabella no es AGI, persona, consciencia artificial ni autoridad autónoma. Las capacidades marcadas como simuladas, degradadas o no certificadas no deben presentarse como equivalentes a producción.

## Estado actual verificable

- Versión declarada: `4.3.3` (`package.json`).
- Runtime de desarrollo: Vite 8 + TanStack Start/Router + Nitro.
- UI: React 19.2, Tailwind CSS 4 y Lucide React.
- Persistencia de sesión de interfaz: `sessionStorage`/`localStorage` únicamente para continuidad local; no sustituye una base de datos de producción.
- Datos y servicios opcionales: Postgres/Neon, Supabase, Upstash, Stripe y Vercel AI Gateway según la ruta y las variables configuradas.
- Autenticación: el proyecto contiene un guard soberano y soporte OIDC/API key. No existe una pantalla de login/signup de usuarios en la interfaz actual.
- Preview local: el chat invitado de privilegio mínimo se habilita solo cuando `NODE_ENV=development`, `ISABELLA_RUNTIME_MODE=development` y `ALLOW_GUEST_CHAT=true`.
- Producción: requiere credencial Bearer/API key válida y no debe activar chat invitado.
- El motor Genesis Turbo es un router local gobernado para TINA; no es un runtime GPU MoE, vLLM, cuantización INT4/FP8 ni speculative decoding real.

## Arranque

Requisitos: Node 24.x y pnpm 10.34.5.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

La aplicación se sirve en `http://localhost:3000` cuando el puerto está disponible. El script de desarrollo ejecuta primero el validador de entorno; las advertencias opcionales no sustituyen la configuración requerida para producción.

## Variables de entorno

El archivo `.env.example` documenta el contrato completo. No se deben copiar secretos históricos ni publicar `.env`, `.env.local` o `.env.development.local`.

Variables mínimas para que el chat funcione en preview local:

```dotenv
NODE_ENV=development
ISABELLA_RUNTIME_MODE=development
ALLOW_GUEST_CHAT=true
PUBLIC_URL=http://localhost:3000
```

`ALLOW_GUEST_CHAT` solo tiene efecto junto con los dos valores de desarrollo anteriores. En producción debe permanecer desactivado y el endpoint debe recibir autenticación real. Las claves de modelos, base de datos, Supabase, Stripe, Redis y OIDC son opcionales por módulo, pero cada módulo debe degradar de forma explícita y auditable cuando falten.

## Uso de la interfaz

- **Terminal**: escribe un mensaje y pulsa `ENVIAR`; el stream de `/api/isabella` responde con la síntesis disponible o un error visible y reintentable.
- **Detener**: cancela el stream activo mediante `AbortController`.
- **Restablecer conversación**: purga la memoria inmediata de la sesión y conserva la telemetría local.
- **Reabrir / Descargar**: importa o exporta conversaciones JSON validadas.
- **Navegación lateral**: cambia entre terminal, consola, gobernanza, catálogo, economía, quantum, interfaces, AEGIS y ranking.
- **Preset, policy gate, skills y monetización**: son paneles operativos con estados explícitos; sus acciones no deben interpretarse como autorización financiera o legal.
- **Foto, Dictar, Web y Tools**: requieren capacidades del navegador, permisos o servicios configurados. Cuando no están disponibles, la interfaz informa la degradación en lugar de ocultarla.

## Arquitectura

```text
PERCEIVE → REMEMBER → POLICY GATE → DECIDE → ACT → AUDIT → RESPOND
```

- `src/routes/index.tsx`: entrada de la interfaz.
- `src/components/isabella/`: cockpit, navegación, terminal, rails y paneles.
- `src/lib/useIsabella.ts`: estado de conversación, streaming, abortado, reintento y exportación.
- `src/routes/api/isabella.ts`: endpoint HTTP protegido.
- `src/lib/isabella-chat-gateway.ts`: validación, gobierno, proveedor y fallback.
- `src/lib/principal-context.ts`: resolución de identidad, tenant y autorización.
- `src/lib/tina/`: categorización Trusted Intelligence, Native & Adaptive.
- `src/lib/native-ml/genesis-turbo.ts`: router Top-K local, determinista y auditable.
- `src/lib/crown*` y `src/lib/argus*`: decisión y defensa.
- `src/lib/bookpi/` e `src/lib/igds/`: evidencia y auditoría.
- `test/`: pruebas unitarias, integración, seguridad y BookPI.

## Genesis Turbo / TINA

Genesis Turbo selecciona expertos locales por señales semánticas, aplica Top-K y emite una traza con cabezas activas, scores, decisión y hash. Las decisiones posibles son `ALLOW`, `REVIEW` y `BLOCK`; los casos de manipulación, privacidad, seguridad o riesgo se elevan a revisión humana. El motor se integra mediante `classifyAndRouteTina()` y conserva los gates canónicos existentes.

Esta implementación es una optimización de categorización/ruteo en TypeScript. Un MoE neuronal entrenado, inferencia GPU, KV-cache, cuantización o distillation requerirían artefactos, benchmarks y un runtime separado; no se simulan en este repositorio.

## Calidad y seguridad

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:security
pnpm build:production
pnpm security:scan
pnpm audit:repository
pnpm capabilities
pnpm audit:routes
pnpm verify:lock
```

Para la cadena completa:

```bash
pnpm production:gate
```

No se deben subir secretos, tokens, dumps, credenciales, claves privadas ni datos personales. Cualquier valor histórico comprometido, incluida una clave de firma, debe permanecer **REDACTED** y rotarse fuera del repositorio. Toda mutación crítica debe conservar identidad, policy decision, capability check y evidencia. No se permite reescritura de historia publicada con `push --force`.

## Limitaciones conocidas

- No hay login/signup de usuarios en la UI; la identidad de producción se resuelve por OIDC/API key.
- El chat invitado local es intencionalmente limitado y no constituye autenticación.
- La disponibilidad del proveedor de inferencia depende de las variables y credenciales del entorno.
- Los estados `SIMULATED`, `DEGRADED`, `EVIDENCE_GATED` y `BLOCKED` deben conservarse en cualquier reporte.
- La sesión de navegador no es almacenamiento multiusuario ni garantía de persistencia productiva.

## Contribución

Usa una rama de trabajo, conserva cambios auditables y ejecuta typecheck, lint, tests y build antes de solicitar revisión. El código, dependencias y documentación mantienen sus licencias originales; revisa `AGENTS.md`, `SECURITY.md`, `LICENSES.md` y `docs/` antes de modificar límites de autoridad.

## Autoría y licencia

Arquitectura: Edwin Oswaldo Castillo Trejo / Anubis Villaseñor. Ecosistema: TAMV Online Network, Nodo Cero, Real del Monte, Hidalgo, México. La documentación y contenido siguen la licencia indicada en el repositorio; el código y sus dependencias conservan sus licencias específicas.

La documentación canónica de operación y gobernanza se encuentra en `AGENTS.md` y en los documentos vigentes de `docs/`. Este README resume el estado verificable del código y no constituye certificación jurídica, financiera, regulatoria ni de seguridad.
