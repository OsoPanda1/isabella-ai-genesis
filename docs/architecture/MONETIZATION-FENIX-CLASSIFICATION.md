# Isabella — Clasificación de Monetización Fénix y Capacidades ML

## Regla de integración

Este documento convierte el material de diseño en requisitos trazables. Una propuesta no se considera una capacidad productiva sólo por estar descrita.

Estados válidos: `DESIGNED`, `IMPLEMENTED`, `TESTED`, `VERIFIED`, `PRODUCTION_VERIFIED`, `BLOCKED`.

Principio transversal: **Capability does not imply authority.**

## 1. Monetización

M-01..M-20 están catalogadas en `src/lib/monetization/revenue-catalog.ts` como `DESIGNED`. Los precios, márgenes y volúmenes indicados en material conceptual no se consideran métricas verificadas.

### Clasificación

- Suscripciones: M-01, M-02, M-07.
- Marketplace/transaccional: M-03, M-12.
- Tarjetas/servicios financieros: M-04, M-05, M-06.
- Microtransacciones/eventos: M-08, M-09, M-10, M-11.
- Enterprise/licencias: M-13, M-17.
- Infraestructura/compute: M-14, M-15.
- Servicios profesionales/formación: M-16, M-20.
- Commerce/hardware: M-18.
- Grants/cofinanciación: M-19.

Las vías financieras requieren proveedor, controles antifraude, idempotencia, conciliación, refunds/disputes y revisión regulatoria antes de cualquier movimiento real.

## 2. Fórmula Fénix

Se implementa como función contable pura en `src/lib/monetization/phoenix-allocation.ts` con la distribución propuesta sobre utilidad neta verificada:

- 20% Fondo Fénix.
- 30% infraestructura.
- 50% creador/socios.

Esto no constituye garantía de rentabilidad, liquidez ni disponibilidad de fondos. La dispersión real debe ocurrir exclusivamente dentro del ledger transaccional canónico y mediante un flujo autorizado.

## 3. ClawHub / ClawScan

`src/lib/skills/clawscan.ts` establece una primera barrera estática para manifiestos.

Detecta actualmente:

- ejecución dinámica (`eval`, `Function`);
- acceso potencial a secretos;
- licencias que requieren revisión;
- patrones de ejecución/mutación privilegiada.

No se debe interpretar como sandbox, firma criptográfica, SCA completa, análisis AST completo ni garantía de seguridad de supply chain. Es una **gate estática inicial**.

## 4. Capacidades ML derivadas

El material describe activación selectiva, eficiencia energética, análisis emocional, memoria persistente, XAI, HDC/VSA, aprendizaje federado, DP, secure aggregation, modelos generativos y Genesis-4.

Clasificación:

- Activación selectiva: `DESIGNED`; necesita benchmark reproducible antes de afirmar ahorros.
- Predictor energético: `DESIGNED`; necesita telemetría real y medición por workload.
- Análisis emocional: capacidad de inferencia sensible; requiere evaluación de precisión, falsos positivos/negativos y límites de uso. No debe diagnosticar estados clínicos.
- HDC/VSA 4096D: experimental hasta benchmark reproducible.
- Memoria/forgetting: requiere política de retención, borrado verificable y métricas.
- XAI: SHAP/LIME/feature importance son herramientas a integrar donde el modelo sea compatible; no garantizan explicabilidad total.
- Federated Learning: requiere secure aggregation, autenticación de nodos, replay/poisoning detection, privacidad diferencial y auditoría.
- Generative Plane: modelos externos son proveedores/modelos, no la arquitectura soberana.
- Genesis-4: objetivo de I+D; requiere infraestructura GPU reproducible, datasets con licencia/provenance, tokenizer, checkpoints, evaluación y release gates.

## 5. Afirmaciones que NO se convierten automáticamente en hechos

No se certifican por texto fuente: "soberanía absoluta", "conciencia", "entidad viva", "ética emergente", "100% transparencia", "100% innovación", "cero sesgo", ahorro energético concreto, CO₂ concreto, latencias concretas o superioridad estadística.

Para cada afirmación científica se requiere:

1. definición operacional;
2. dataset y licencia;
3. protocolo reproducible;
4. baseline comparable;
5. métricas y error bars;
6. artefactos/hashes;
7. ejecución registrada;
8. evidencia GEAE;
9. revisión independiente cuando corresponda.

## 6. Prioridad de implementación

P0: dataset registry/provenance/validation, training runs, model registry, evaluation, release gates, CROWN/AEGIS hooks, durable evidence, canonical DB.

P1: multimodal providers, router, benchmark suite, XAI, monitoring/drift, federation security.

P2: HDC/VSA experimental, 4D rendering, advanced memory, AutoML y selective execution benchmarks.

P3: GENESIS-1/2/3.

P4: GENESIS-4 foundation model.
