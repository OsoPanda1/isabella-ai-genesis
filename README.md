# Isabella Villaseñor AI

## Terminal cognitivo gobernado para TAMV ONLINE NETWORK

Isabella Villaseñor AI es una arquitectura cognitiva híbrida para coordinar interpretación, memoria, gobernanza, herramientas y trazabilidad dentro de un marco de soberanía humana. El proyecto no es una AGI, un chatbot autónomo ni un sustituto de la decisión humana: los módulos sugieren, verifican y ejecutan únicamente dentro de políticas explícitas.

> Estado del repositorio: prototipo operativo endurecido en evolución. Las integraciones productivas deben verificarse en cada entorno antes de autorizar usuarios, cobros o acciones sensibles.

## Principios

- **Soberanía humana:** ninguna acción de alto riesgo se ejecuta sin aprobación.
- **Zero Trust:** toda herramienta requiere identidad, tenant, alcance y política.
- **Soberanía territorial:** el contexto de Real del Monte y la comunidad no se trata como un dato genérico.
- **Trazabilidad:** las decisiones relevantes producen correlación, auditoría y evidencia.
- **Incertidumbre honesta:** los fallos de proveedores y modos degradados se comunican, no se disfrazan.

## Arquitectura

- **CROWN Gateway:** ruteo, arbitraje, estado y composición de la respuesta.
- **ISA:** presencia, tono y modulación contextual.
- **SOPHIA:** razonamiento, consistencia y síntesis.
- **ORION:** tareas técnicas, operativas y creativas.
- **ARGUS / AEGIS:** seguridad, evaluación de riesgo, filtros y veto.
- **BookPI:** registro de decisiones, consumo y evidencias.
- **QUP:** utilidades de optimización y procesamiento con contratos tipados.

El flujo canónico es:

```text
Perceive → Remember → Policy Gate → Decide → Act → Audit
```

## Interfaz

La aplicación usa TanStack Start, React, Vite y Tailwind CSS. La terminal ofrece:

- introducción cinemática accesible y recuperable;
- navegación cognitiva, gobernanza, catálogo, monetización, QUP y AEGIS;
- mensajes en streaming, adjuntos y reintentos;
- telemetría exportable y persistencia local limitada al navegador;
- paneles responsive para escritorio y pantallas estrechas;
- recuperación ante errores de renderizado sin exponer mensajes internos.

La interfaz es una superficie de operación y observación. La autoridad permanece en el servidor.

## Requisitos

- Node.js 22 o superior.
- pnpm 10.15.0 o compatible con el lockfile.
- Variables de entorno configuradas según el entorno.
- PostgreSQL/Neon, Stripe, Supabase u otros proveedores únicamente cuando sus integraciones estén conectadas y validadas.

## Instalación

```bash
pnpm install --frozen-lockfile
pnpm dev
```

La aplicación local queda disponible en `http://localhost:3000`.

## Validación

Ejecuta antes de publicar:

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm security:scan
pnpm build
```

Para comprobar el artefacto de Vercel:

```bash
test -d .vercel/output
```

## Variables y secretos

Nunca se deben incluir secretos en el repositorio, en `VITE_*`, en el cliente, en logs ni en URLs. Las claves de servidor se leen mediante el módulo de configuración y deben existir únicamente en el entorno de ejecución.

Variables habituales del proyecto incluyen:

- conexión PostgreSQL/Neon;
- claves de firma CROWN y BookPI;
- secretos OIDC/JWKS;
- claves y webhook secret de Stripe;
- configuración de voz y proveedores de IA;
- secretos de AEGIS y límites de seguridad.

Consulta `.env.example`, `src/lib/env-schema.ts` y la configuración del proyecto Vercel. Los valores reales nunca deben documentarse aquí.

## Seguridad operativa

Toda ruta sensible debe conservar:

1. autenticación y autorización mediante `withSovereignAuth`;
2. aislamiento por `tenantId` derivado de la identidad, nunca del cuerpo;
3. validación Zod y límites de tamaño;
4. rate limiting y cabeceras defensivas;
5. idempotencia para pagos, webhooks y mutaciones;
6. auditoría con `traceId` y `correlationId`;
7. respuesta genérica ante errores internos.

El acceso invitado y los atajos de desarrollo deben permanecer deshabilitados en producción. Un adapter determinista o fallback no debe presentarse como inferencia productiva.

## Economía y BookPI

Los créditos representan consumo prefinanciado. La recarga debe acreditarse únicamente después de confirmar el pago en Stripe, con deduplicación por `event.id` o `PaymentIntent`. Los débitos deben ser atómicos, impedir saldo negativo y quedar unidos a un registro BookPI verificable.

Antes de operar pagos reales deben comprobarse transacciones concurrentes, reintentos, chargebacks, idempotencia y reconciliación. Un endpoint de demostración no es una garantía financiera.

## Despliegue en Vercel

1. Conecta el repositorio y selecciona la rama que se desea publicar.
2. Configura las variables de entorno por entorno.
3. Ejecuta las validaciones anteriores.
4. Confirma que `vite.config.ts` usa el preset `vercel` de Nitro.
5. Publica y revisa logs de compilación y runtime.
6. Ejecuta smoke tests de inicio, autenticación, chat, error boundary y rutas críticas.

No se deben publicar ramas con fallos de build, secretos, datos de prueba con apariencia real o afirmaciones no verificadas de preparación productiva.

## Estructura principal

```text
src/
├── components/isabella/   Interfaz, terminal y paneles
├── lib/                   CROWN, seguridad, identidad, persistencia y contratos
├── routes/                Rutas de aplicación y API
├── styles.css             Tokens visuales y utilidades de cristal
└── generated/prisma/      Cliente generado; no editar manualmente

latam-aegis-x/             Motor auxiliar de evaluación AEGIS
prisma/                    Esquema y migraciones
supabase/                  Migraciones cuando aplique
scripts/                   Verificación, migración y seguridad
k8s/                       Referencias de despliegue restringido
```

## Contribución

Lee `AGENTS.md` antes de modificar el proyecto. Mantén TypeScript estricto, contratos runtime, cambios pequeños y reversibles, pruebas para cada invariantes de seguridad y documentación sincronizada. No uses `any` sin justificación, no sustituyas una integración real por datos simulados y no promociones inferencias a hechos.

## Limitaciones conocidas

La preparación productiva depende de la configuración real de cada integración. Interfaces de firma post-cuántica, adapters cognitivos, almacenamiento de auditoría, aprobaciones humanas y observabilidad deben verificarse contra servicios reales antes de confiarles operaciones sensibles.

## Licencia y autoría

Arquitectura de dominio público bajo CC BY 4.0, atribuida a Edwin Oswaldo Castillo Trejo (Anubis Villaseñor), dentro del ecosistema TAMV ONLINE NETWORK / RDM Digital Hub / Nodo Cero.

La licencia no elimina las obligaciones de privacidad, seguridad, protección de datos, pagos ni cumplimiento legal aplicables al despliegue.
