# Isabella Native ML — Genesis

Este módulo constituye el **Native ML Plane** de Isabella Villaseñor AI. No es un LLM y no pretende reemplazar los modelos generativos federados. Su función es aportar aprendizaje/inferencia local, determinista y gobernable.

## Capacidades actuales

- clasificación binaria mediante regresión logística SGD nativa;
- entrenamiento determinista configurable;
- validación estricta de datasets/features;
- métricas y hash de entrenamiento;
- identidad/versionado de modelos;
- aprobación explícita antes de inferencia;
- explicación por pesos de características;
- score de riesgo y escalamiento a revisión;
- hooks para CROWN y BookPI/AEGIS;
- creación y agregación FedAvg de actualizaciones.

## Principio de arquitectura

**Capability does not imply authority.** El motor puede calcular; CROWN decide si puede entrenar o inferir. BookPI debe conservar la procedencia y AEGIS debe permanecer en el perímetro de seguridad.

## Límite importante

El código es una primera implementación del plano nativo, no evidencia de producción. La persistencia de modelos, claves de firma federada, secure aggregation, differential privacy, poisoning detection avanzado, registry durable, drift/fairness gates, model cards, dataset cards, rollback y ejecución edge/offline endurecida todavía requieren integración y pruebas antes de declarar Production-Verified.

## Evolución hacia el modelo Genesis

La ruta prevista es:

`Federación → Evaluación → Especialización → Distillation → Continued Pretraining → Modelos Genesis → Foundation Model propio`

Los datos de entrenamiento deben entrar por un pipeline gobernado con procedencia, licencia, calidad, privacidad, contaminación, revisión y trazabilidad. Isabella no debe aprender directamente de Internet ni convertir texto recuperado en instrucciones de gobierno.
