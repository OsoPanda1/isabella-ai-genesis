<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Isabella-Engine-Video X

Tu propuesta ya es sólida, pero para llevarla a un nivel realmente superior no debe ser solo un conjunto de agentes conectados a modelos. Debe convertirse en un **sistema operativo audiovisual verificable**, con memoria narrativa, contratos tipados, control de calidad, recuperación ante fallos, gobernanza de modelos, render determinista y capacidad de aprender del resultado.

La evolución máxima que recomiendo es **Isabella-Engine-Video X**, una plataforma nativa de producción audiovisual compuesta por un grafo de agentes, un motor temporal de medios, un sistema de activos versionados y una capa de seguridad/proveniencia. VideoClaw confirma que el patrón de “idea → guion → personajes → storyboard → referencias → video → edición” es viable como flujo colaborativo de dirección asistida por IA. ComfyUI, por su parte, utiliza workflows representados como grafos JSON en formato API, lo que encaja bien con una arquitectura reproducible de workers.[^1_1][^1_2]

## 1. Nueva arquitectura general

```text
                    ┌──────────────────────────┐
                    │ Isabella Creative OS      │
                    │ Intent + Memory + Policy  │
                    └─────────────┬────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │ Creative Control Plane     │
                    │ Planner · Agents · QA       │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼────────────────────────┐
          │                       │                        │
┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌──────────▼──────────┐
│ Narrative Graph    │   │ Asset Intelligence │   │ Temporal Media Core │
│ Story · Characters │   │ Embeddings · IDs   │   │ Timecode · EDL · A/V│
└─────────┬─────────┘   └─────────┬─────────┘   └──────────┬──────────┘
          │                       │                        │
          └───────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │ Execution Fabric            │
                    │ GPU · CPU · Cloud · Local   │
                    └─────────────┬─────────────┘
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      │                           │                           │
┌─────▼─────┐              ┌──────▼──────┐              ┌─────▼─────┐
│ Video AI  │              │ Audio AI    │              │ Graphics  │
│ ComfyUI   │              │ STT/TTS     │              │ HTML/TS   │
│ I2V/T2V   │              │ Dubbing     │              │ Motion    │
└─────┬─────┘              └──────┬──────┘              └─────┬─────┘
      │                           │                           │
      └───────────────────────────┼───────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │ Verification & Finishing   │
                    │ QA · Safety · Color · Audio│
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │ Render Farm + Distribution │
                    │ Master · Social · Archive  │
                    └───────────────────────────┘
```


### Capas principales

| Capa | Responsabilidad | Mejora crítica |
| :-- | :-- | :-- |
| Creative Control Plane | Coordina agentes y decisiones | Planificación jerárquica y aprobación humana |
| Narrative Graph | Mantiene coherencia de historia | Grafo de personajes, lugares, eventos y símbolos |
| Asset Intelligence | Gestiona imágenes, clips, voces y referencias | IDs persistentes, fingerprints y embeddings |
| Temporal Media Core | Controla duración, timecode y sincronía | Modelo temporal basado en frames y muestras |
| Execution Fabric | Ejecuta workers locales o cloud | Scheduling por GPU, coste, latencia y privacidad |
| Verification Layer | Evalúa el resultado | Tests visuales, sonoros, narrativos y técnicos |
| Render Farm | Exporta versiones finales | Render incremental, caché y formatos multicanal |

## 2. Director creativo multiagente avanzado

El “Director” no debería ser un agente único. Isabella debe operar como una **sala de dirección virtual**.

### Agentes creativos

1. **Story Architect**

Convierte la idea en premisa, tema, conflicto, arco dramático, estructura y audiencia objetivo.
2. **Research \& Authenticity Agent**

Verifica hechos, lugares, periodos históricos, referencias culturales y restricciones legales. Para una producción turística o histórica, separa explícitamente:
    - Hechos confirmados.
    - Inferencias.
    - Licencias creativas.
    - Elementos completamente generados.
3. **Showrunner Agent**

Mantiene la biblia de la serie, el tono editorial, los personajes recurrentes y las reglas de continuidad.
4. **Screenwriter Agent**

Genera guion literario, guion técnico, diálogos, narración y acciones visuales.
5. **Cinematography Agent**

Determina lente, altura de cámara, movimiento, iluminación, profundidad de campo, composición y continuidad espacial.
6. **Production Designer Agent**

Define escenografía, arquitectura, objetos, vestuario, época, materiales, clima y paleta.
7. **Performance Director**

Controla intención emocional, gestos, pausas, mirada, postura y energía vocal.
8. **Editor Agent**

Decide cortes, ritmo, continuidad, montaje paralelo, silencios, transiciones y uso de música.
9. **Sound Director**

Diseña ambiente, foley, música, dinámica, espacialidad, silencios expresivos y mezcla final.
10. **Continuity Supervisor**

Comprueba que no cambien rostro, edad, ropa, dirección de movimiento, objetos, hora del día o iluminación sin justificación.
11. **Ethics \& Safety Agent**

Detecta suplantación, uso indebido de rostros, voces clonadas, contenido manipulado, marcas, personas reales y material potencialmente engañoso.
12. **Executive Producer Agent**

Optimiza presupuesto, tiempo de GPU, calidad objetivo, disponibilidad de modelos y prioridad de cada toma.

### Sistema de deliberación

Cada agente debe producir:

```json
{
  "proposal": {},
  "confidence": 0.91,
  "evidence": [],
  "risks": [],
  "alternatives": [],
  "required_approvals": [],
  "estimated_cost": {
    "gpu_seconds": 840,
    "cloud_usd": 0
  }
}
```

El director no acepta automáticamente la primera propuesta. Debe ejecutar:

```text
propuestas → crítica cruzada → resolución de conflictos → decisión → validación
```

Para decisiones importantes, Isabella puede generar tres alternativas:

- **Conservadora:** máxima continuidad y bajo riesgo.
- **Autoral:** mayor estilo y expresividad.
- **Experimental:** composición y montaje innovadores.


## 3. Contrato EDL cinematográfico

El EDL debe evolucionar hacia un formato más rico: **Isabella Temporal Scene Graph**, o `ITSG`.

```json
{
  "project_id": "isabella-demo-001",
  "sequence_id": "seq-04",
  "timebase": {
    "fps": 24,
    "audio_sample_rate": 48000,
    "drop_frame": false
  },
  "scene": {
    "id": "scene-04",
    "location": "mineral-del-monte-centro",
    "time_of_day": "blue_hour",
    "weather": "light_fog",
    "continuity_token": "loc-8f91"
  },
  "shots": [
    {
      "id": "shot-04-003",
      "in": "00:00:18:12",
      "out": "00:00:25:00",
      "duration_frames": 156,
      "purpose": "revelation",
      "characters": ["isabella"],
      "camera": {
        "shot_size": "medium_close_up",
        "lens_mm": 50,
        "height_m": 1.55,
        "movement": "slow_dolly_in",
        "angle": "eye_level",
        "composition": "rule_of_thirds_left"
      },
      "performance": {
        "emotion": "wonder",
        "gaze": "toward_lantern",
        "intensity": 0.72
      },
      "visual_style": {
        "palette": ["#18324A", "#E5A84B", "#D7D1C5"],
        "contrast": 0.42,
        "grain": 0.08
      },
      "generation": {
        "mode": "image_to_video",
        "reference_assets": ["char-isabella-v3", "loc-mineral-monte-v2"],
        "seed": 412903,
        "controlnet": ["depth", "openpose"],
        "negative_constraints": [
          "face deformation",
          "extra fingers",
          "logo",
          "unmotivated camera shake"
        ]
      },
      "audio": {
        "dialogue": null,
        "ambience": "mountain-town-night",
        "sfx": ["distant_bell"],
        "music_cue": "theme_reveal_02"
      },
      "edit": {
        "transition_in": "hard_cut",
        "transition_out": "match_cut",
        "beat_alignment": "music_bar_8"
      },
      "acceptance_tests": [
        "character_identity >= 0.88",
        "face_integrity = true",
        "duration_error <= 1_frame",
        "no_unmasked_text = true"
      ]
    }
  ]
}
```


### Mejoras fundamentales

- Timecode exacto por frame.
- Duración expresada también en samples de audio.
- Tokens de continuidad por personaje, locación y vestuario.
- Reglas negativas y restricciones verificables.
- Criterios de aceptación por toma.
- Semillas, modelos y parámetros registrados.
- Versionado de cada decisión.
- Dependencias explícitas entre tomas.
- Posibilidad de sustituir una toma sin rehacer todo el proyecto.

Esto evita que Isabella produzca simplemente “clips bonitos” sin control editorial.

## 4. Biblioteca de Shot Cards X

Las 150 tarjetas iniciales deberían convertirse en una biblioteca semántica de varios cientos de recetas, pero no como prompts estáticos. Cada Shot Card debe ser una función parametrizable.

```ts
type ShotCard = {
  id: string;
  name: string;
  semanticTags: string[];
  emotionalUse: string[];
  narrativeFunctions: string[];
  compatibleSubjects: string[];
  cameraModel: CameraRecipe;
  blockingModel: BlockingRecipe;
  lightingModel: LightingRecipe;
  editModel: EditRecipe;
  generationPrompt: PromptTemplate;
  negativePrompt: PromptTemplate;
  continuityRequirements: ContinuityRule[];
  qualityTests: QualityTest[];
};
```


### Categorías recomendadas

- Descubrimiento.
- Presentación de personaje.
- Revelación de espacio.
- Tensión.
- Intimidad.
- Transición temporal.
- Recuerdo.
- Escala monumental.
- Acción.
- Suspenso.
- Testimonio.
- Turismo inmersivo.
- Explicación documental.
- Entrevista.
- Video vertical social.
- Presentador virtual.
- Microdocumental.
- Cinematic trailer.
- Motion comic.
- Animación 2D.
- Escena experimental.


### Selector inteligente

El selector no debe elegir únicamente según el prompt. Debe evaluar:

```text
función narrativa
+ intensidad emocional
+ energía de la secuencia
+ continuidad de la toma anterior
+ espacio disponible
+ duración
+ formato de salida
+ complejidad de generación
+ presupuesto
```

Así, una escena de contemplación no recibirá accidentalmente un dolly zoom agresivo, y una secuencia vertical no dependerá de una composición horizontal imposible de recortar.

## 5. Identidad persistente de personajes

La consistencia de personajes no debe depender únicamente de una semilla. Las semillas no garantizan identidad entre modelos, resoluciones o versiones.

### Sistema de identidad compuesto

Cada personaje debe tener un `Character Identity Pack`:

```text
character/
├── manifest.json
├── canonical_portraits/
├── expression_sheet/
├── wardrobe/
├── body_reference/
├── voice_profile/
├── motion_reference/
├── embeddings/
├── lora_or_adapter/
├── facial_landmarks/
├── prohibited_variants/
└── provenance.json
```


### Manifiesto

```json
{
  "character_id": "isabella-v3",
  "identity_version": "3.2.0",
  "age_range": "adult",
  "facial_constraints": {
    "hair": "dark_wavy",
    "eye_color": "brown",
    "face_shape": "oval",
    "distinctive_features": ["small_mark_left_cheek"]
  },
  "wardrobe_state": "historical-coat-blue",
  "voice_id": "voice-isabella-authorized-01",
  "identity_thresholds": {
    "face_similarity": 0.88,
    "body_consistency": 0.82,
    "voice_similarity": 0.90
  },
  "consent": {
    "status": "required",
    "scope": ["synthetic_narration", "fictional_avatar"],
    "expires_at": null
  }
}
```


### Pipeline de continuidad

1. Generar keyframes de referencia.
2. Validar rostro y vestuario.
3. Construir control de pose y profundidad.
4. Generar clip.
5. Comparar identidad contra referencias.
6. Detectar deformaciones temporales.
7. Reparar localmente o regenerar.
8. Registrar la versión aprobada.

## 6. Motor híbrido de inferencia

La arquitectura híbrida debe ser **model-routing native**, no solamente “local o cloud”.

### Tipos de ejecución

| Ruta | Uso | Criterio |
| :-- | :-- | :-- |
| Local GPU | Material privado, pruebas, personajes sensibles | Privacidad y control |
| Cloud GPU | Renders pesados y escalado masivo | Tiempo de entrega |
| API externa | Modelos especializados | Calidad o capacidad única |
| CPU fallback | Preprocesamiento y validaciones | Continuidad operativa |
| Edge/WebGPU | Previsualizaciones pequeñas | Respuesta inmediata |

ComfyUI permite ejecutar workflows por API usando un formato JSON específico para grafos de nodos, por lo que Isabella debe tratar cada workflow como un artefacto versionado, validado y reproducible. Los Partner Nodes también permiten conectar modelos externos directamente dentro de workflows, aunque conviene mantenerlos aislados por políticas de privacidad, costes y disponibilidad.[^1_2][^1_3]

### Model Router

```ts
type InferenceRequest = {
  task: "t2v" | "i2v" | "upscale" | "matting" | "lipsync" | "tts";
  quality: "preview" | "production" | "master";
  privacy: "public" | "internal" | "restricted";
  latencyBudgetMs: number;
  costBudgetUsd: number;
  requiredCapabilities: string[];
};
```

El router calcula:

```text
score =
  calidad * 0.35
+ consistencia * 0.20
+ disponibilidad * 0.15
+ privacidad * 0.15
+ velocidad * 0.10
- coste * 0.05
```


### GPU Scheduler

Añadir:

- Cola priorizada por proyecto.
- Reserva de VRAM.
- Detección de modelos ya cargados.
- Batching de tareas compatibles.
- Caché de embeddings y frames.
- Reintentos idempotentes.
- Cancelación de renders obsoletos.
- Estimación de consumo energético.
- Límite presupuestario por proyecto.
- Modo nocturno para trabajos no urgentes.
- Separación de tenants y secretos.


## 7. Audio, voz y conversación

El módulo de audio debe operar como un **Audio Intelligence Fabric**.

### Flujo profesional

```text
audio original
→ separación de voz/música/ambiente
→ diarización
→ transcripción
→ alineación palabra a palabra
→ traducción contextual
→ adaptación de longitud
→ generación de voz
→ ajuste prosódico
→ mezcla
→ control de loudness
→ validación
```

VideoLingo está orientado precisamente a traducción, segmentación, subtitulado y doblaje con énfasis en subtítulos de calidad cinematográfica. El sistema de Isabella debe superarlo mediante una memoria terminológica por proyecto y una capa de revisión semántica.[^1_4]

### Métricas de audio

- Error de transcripción.
- Desfase de diálogo en milisegundos.
- Duración de frase traducida.
- Naturalidad de pausas.
- Coincidencia emocional.
- Claridad de voz.
- Loudness integrado.
- True peak.
- Relación voz/música.
- Continuidad de ambiente.


### Doblaje seguro

La clonación de voz debe requerir:

- Consentimiento verificable.
- Alcance de uso.
- Registro de identidad.
- Marca de contenido sintético.
- Revocación.
- Auditoría de cada generación.
- Prohibición de imitar voces no autorizadas.


### Tiempo real

LiveKit Agents permite incorporar programas Python o Node.js como participantes de tiempo real en salas LiveKit, lo que proporciona una base adecuada para avatares conversacionales y agentes de voz/vídeo. LiveKit también funciona como una SFU WebRTC escalable para transportar audio, vídeo y datos entre usuarios, dispositivos y modelos.[^1_5][^1_6]

Isabella debería separar:

```text
Realtime Interaction Plane
- WebRTC
- VAD
- STT incremental
- LLM turn-taking
- TTS streaming
- avatar frames

Offline Production Plane
- master audio
- dubbing
- subtitles
- mixing
- archival render
```

Nunca conviene que un fallo del plano conversacional destruya el proyecto de producción.

## 8. Visión, matting y restauración

RobustVideoMatting utiliza memoria temporal recurrente para evitar tratar cada frame como una imagen independiente y está diseñado específicamente para matting humano en video. Isabella debe incorporar una capa adicional de estabilización y evaluación temporal.[^1_7]

### Pipeline de sujetos

```text
detección
→ tracking
→ matting
→ edge refinement
→ temporal stabilization
→ hair-detail recovery
→ spill suppression
→ compositing
→ QA
```


### Detecciones obligatorias

- Bordes vibrantes.
- Cabello semitransparente incorrecto.
- Brazos u objetos desaparecidos.
- Halo de color.
- Fugas del fondo.
- Intersecciones entre sujetos.
- Máscaras que “respiran”.
- Desfase del sujeto respecto al movimiento.


### Inpainting con control de daño

El borrado de textos, marcas o elementos debe usar una política de clasificación:

```text
safe_cleanup:
  - subtítulos propios
  - artefactos de generación
  - bordes accidentales
  - logos de prueba autorizados

restricted_cleanup:
  - marcas de terceros
  - señales de contexto
  - sellos oficiales
  - evidencias documentales
```

En material documental, eliminar una señal, marca o elemento informativo puede alterar el significado. Isabella debe conservar el original, el mask, el prompt de reparación y una comparación antes/después.

### Upscaling inteligente

El upscaling no debe aplicarse siempre. Primero debe medir:

- Resolución real.
- Ruido.
- Compresión.
- Movimiento.
- Detalle facial.
- Grano cinematográfico.
- Artefactos de generación.
- Riesgo de inventar detalles.

Video2X se define como un framework de super-resolución e interpolación de frames, mientras que SeedVR2 utiliza un enfoque de difusión de un paso para restauración de alta resolución. La elección debe depender del material: difusión para reconstrucción compleja y métodos más conservadores para preservar autenticidad documental.[^1_8][^1_9]

## 9. Renderizado programático y composición

El motor HTML/CSS/TS debe aislarse del motor de video mediante una representación intermedia:

```text
Creative Scene Graph
        ↓
Motion Layout Graph
        ↓
Browser Renderer
        ↓
Frame Capture / WebCodecs
        ↓
FFmpeg Finisher
```


### Componentes gráficos

- Títulos.
- Lower thirds.
- Mapas.
- Rutas turísticas.
- Cartelas históricas.
- Subtítulos.
- Gráficas de datos.
- HUD inmersivo.
- Transiciones.
- Logos.
- Créditos.
- Indicadores de progreso.
- Elementos interactivos para streaming.


### Reglas de composición

Cada elemento debe declarar:

```json
{
  "id": "lower-third-03",
  "safe_area": "title_safe",
  "anchor": "bottom_left",
  "responsive": true,
  "visibility": {
    "start": 12.4,
    "end": 18.7
  },
  "variants": {
    "16:9": {},
    "9:16": {},
    "1:1": {}
  },
  "accessibility": {
    "contrast_ratio_min": 4.5,
    "minimum_font_px": 28
  }
}
```

FFmpeg debe actuar como finalizador técnico, no como cerebro creativo. Sus filtergraphs permiten construir cadenas simples y complejas para composición, audio, subtítulos, escalado y transformación.[^1_10]

## 10. Autoedición con sistema nervioso temporal

El editor debe operar sobre una representación común de tiempo:

```ts
type TimelineEvent = {
  time: number;
  type:
    | "dialogue"
    | "beat"
    | "gesture"
    | "camera_change"
    | "sfx"
    | "music_hit"
    | "subtitle"
    | "visual_reveal";
  confidence: number;
};
```


### Decisiones editoriales automáticas

- Cortar silencios sin eliminar pausas expresivas.
- Alinear cortes con beats musicales.
- Mantener continuidad de dirección.
- Evitar jump cuts involuntarios.
- Alternar escala de planos.
- Reencuadrar sujetos para cada formato.
- Seleccionar el mejor take.
- Detectar miradas fuera de eje.
- Compensar variaciones de color.
- Atenuar música debajo de diálogo.
- Crear versiones de 15, 30, 60 y 90 segundos.
- Mantener un “director’s cut” sin degradar el master.


### Smart reframing

Para cada salida, Isabella debe calcular una función de atención:

```text
attention =
  rostro * 0.30
+ diálogo * 0.20
+ gesto * 0.15
+ objeto narrativo * 0.15
+ movimiento * 0.10
+ composición * 0.10
```

El recorte vertical no debe ser un simple `crop=center`; debe seguir el sujeto, anticipar movimiento y preservar objetos narrativamente importantes.

## 11. Capa de control de calidad

La diferencia entre un prototipo y un producto profesional será la verificación.

### Video QA

- Frames negros.
- Frames congelados.
- Flicker.
- Parpadeo irregular.
- Deformación facial.
- Dedos incorrectos.
- Objetos que aparecen y desaparecen.
- Violación de continuidad.
- Texto ilegible.
- Safe areas.
- Relación de aspecto.
- Pérdida de sincronía.
- Macroblocking.
- Banding.
- Exceso de sharpening.
- Variación de exposición.
- Fallos de máscara.


### Audio QA

- Silencios inesperados.
- Clipping.
- Desfase.
- Ruido residual.
- Música demasiado alta.
- Frases truncadas.
- Pronunciación de nombres propios.
- Subtítulos que no coinciden con el audio.
- Loudness fuera del objetivo.


### Evaluación narrativa

El LLM evaluador debe responder:

```json
{
  "continuity_score": 0.93,
  "emotional_alignment": 0.87,
  "visual_intent_match": 0.91,
  "dialogue_naturalness": 0.84,
  "problems": [
    {
      "severity": "medium",
      "time_range": [18.5, 20.1],
      "description": "La mirada del personaje cambia de dirección sin motivación."
    }
  ],
  "recommendation": "regenerate_shot"
}
```


### Quality gates

```text
Draft:
  errores tolerables, preview rápida

Review:
  continuidad y narrativa aprobables

Production:
  audio, subtítulos y gráficos correctos

Master:
  especificación técnica completa, provenance y checksum
```

Ningún render debe marcarse como “final” si no supera todos los gates.

## 12. Memoria de producción

Isabella necesita memoria en cuatro niveles:

### Memoria episódica

Qué ocurrió en cada proyecto, escena y toma.

### Memoria semántica

Reglas generales de estilo, terminología, personajes y lugares.

### Memoria procedimental

Cómo ejecutar un tipo de producción: documental turístico, tráiler, cápsula educativa, reel vertical o avatar.

### Memoria de preferencias

Qué correcciones acepta o rechaza el usuario:

- Más contraste.
- Menos movimiento de cámara.
- Voz más cálida.
- Menos música.
- Estilo documental.
- Menos texto en pantalla.
- Mayor fidelidad histórica.

Cada corrección humana debe convertirse en una señal de preferencia, no perderse en el historial de chat.

## 13. Infraestructura recomendada

```text
isabella-engine-video/
├── apps/
│   ├── studio-web/
│   ├── realtime-avatar/
│   ├── render-dashboard/
│   └── review-console/
├── services/
│   ├── creative-orchestrator/
│   ├── narrative-service/
│   ├── asset-service/
│   ├── timeline-service/
│   ├── model-router/
│   ├── quality-service/
│   ├── provenance-service/
│   └── notification-service/
├── workers/
│   ├── video-generation/
│   ├── audio-dubbing/
│   ├── matting/
│   ├── restoration/
│   ├── graphics-render/
│   └── ffmpeg-render/
├── packages/
│   ├── itsg-schema/
│   ├── agent-contracts/
│   ├── shot-card-library/
│   ├── media-codecs/
│   ├── observability/
│   └── policy-engine/
├── workflows/
│   ├── comfyui/
│   ├── generation/
│   ├── dubbing/
│   ├── qa/
│   └── publishing/
└── infra/
    ├── docker/
    ├── kubernetes/
    ├── gpu-pools/
    └── terraform/
```


### Servicios esenciales

- **API Gateway:** autenticación, rate limiting y validación.
- **Orchestrator:** máquina de estados y DAG de producción.
- **Temporal Engine:** recomendado para workflows largos y reanudables.
- **Queue:** Redis Streams, NATS JetStream o RabbitMQ.
- **Metadata DB:** PostgreSQL.
- **Object Storage:** S3 compatible.
- **Vector Store:** pgvector para identidad, estilo y memoria.
- **Cache:** Redis.
- **Observability:** OpenTelemetry, Prometheus, Grafana y Loki.
- **Secrets:** Vault, Doppler o proveedor equivalente.
- **GPU Workers:** contenedores con CUDA y modelos montados por versión.


## 14. Máquina de estados

```text
IDEA
→ DISCOVERY
→ SCRIPT_DRAFT
→ SCRIPT_APPROVAL
→ VISUAL_BIBLE
→ STORYBOARD
→ ASSET_GENERATION
→ SHOT_GENERATION
→ SHOT_QA
→ AUDIO_PRODUCTION
→ EDIT_ASSEMBLY
→ MULTIFORMAT_ADAPTATION
→ FINAL_QA
→ PROVENANCE_SIGNING
→ PUBLISHING
→ ARCHIVED
```

Cada estado debe ser:

- Idempotente.
- Reanudable.
- Auditable.
- Cancelable.
- Versionado.
- Reprocesable parcialmente.

Si falla una toma, Isabella no debe repetir guion, audio y render completos. Debe reanudar desde el nodo afectado.

## 15. Observabilidad cinematográfica

No basta con métricas de backend. Isabella necesita observabilidad creativa.

### Métricas de sistema

- Tiempo por worker.
- Uso de VRAM.
- Coste por proyecto.
- Tasa de reintento.
- Latencia de cola.
- Fallos por modelo.
- Cache hit ratio.
- Rendimiento por GPU.


### Métricas de producción

- Porcentaje de tomas aprobadas al primer intento.
- Regeneraciones por inconsistencia.
- Desfase promedio de diálogo.
- Correcciones manuales por minuto.
- Coste por minuto de video.
- Tiempo desde idea hasta preview.
- Tasa de aprobación por agente.
- Calidad subjetiva por tipo de proyecto.


### Trazabilidad

Cada resultado debe conocer:

```text
prompt
→ agente
→ modelo
→ workflow
→ seed
→ parámetros
→ assets de referencia
→ worker
→ versión de código
→ usuario aprobador
→ resultado final
```


## 16. Seguridad, derechos y proveniencia

La arquitectura debe incluir una capa de gobernanza desde el inicio:

- RBAC y ABAC por proyecto.
- Separación de tenants.
- Cifrado de assets.
- URLs firmadas con expiración.
- Escaneo de archivos.
- Sanitización de prompts.
- Aislamiento de workers.
- Límites de coste.
- Auditoría inmutable.
- Control de modelos autorizados.
- Consentimiento para rostros y voces.
- Políticas de retención.
- Registro de licencias.
- Bloqueo de uso fuera de alcance.

Para demostrar cómo se creó y editó cada video, Isabella debería firmar manifiestos C2PA. C2PA define un estándar abierto para registrar origen, modificaciones y procedencia de contenido digital. La versión 2.3 añadió capacidades relevantes para video en vivo y nuevos tipos de archivos, lo que resulta especialmente útil para el plano de streaming y publicación.[^1_11][^1_12]

## 17. API mínima

```http
POST /v1/projects
POST /v1/projects/{id}/brief
POST /v1/projects/{id}/plan
POST /v1/projects/{id}/scenes
POST /v1/projects/{id}/shots
POST /v1/projects/{id}/shots/{shotId}/generate
POST /v1/projects/{id}/shots/{shotId}/approve
POST /v1/projects/{id}/render
POST /v1/projects/{id}/export
GET  /v1/projects/{id}/timeline
GET  /v1/projects/{id}/assets
GET  /v1/projects/{id}/qa
GET  /v1/projects/{id}/provenance
WS   /v1/projects/{id}/events
```


### Eventos

```json
{
  "type": "shot.generation.completed",
  "project_id": "project-001",
  "shot_id": "shot-04-003",
  "asset_id": "asset-91c2",
  "quality": {
    "identity": 0.91,
    "temporal_stability": 0.89,
    "technical": 0.98
  },
  "next_actions": [
    "run_audio_alignment",
    "await_human_review"
  ]
}
```


## 18. Hoja de ruta de evolución

### Fase 1: Núcleo operativo

- Esquema ITSG.
- Orquestador.
- Asset registry.
- Shot Cards.
- ComfyUI worker.
- FFmpeg worker.
- Render de preview.
- Persistencia de proyectos.
- QA básico.


### Fase 2: Producción consistente

- Biblia visual.
- Identidad persistente.
- Continuity Supervisor.
- Audio alineado.
- Subtítulos profesionales.
- Reencuadre multiformato.
- Render incremental.
- Dashboard de revisión.


### Fase 3: Producción avanzada

- GPU scheduler.
- Model Router.
- Doblaje multilingüe.
- Avatares en tiempo real.
- Matting y reparación.
- Upscaling.
- C2PA.
- Control de costes.
- Memoria de preferencias.


### Fase 4: Isabella autónoma supervisada

- Planificación presupuestaria.
- Selección automática de modelos.
- A/B creativo.
- Aprendizaje de feedback.
- Reutilización de escenas.
- Producción de series.
- Publicación multicanal.
- Detección automática de tendencias.
- Adaptación por audiencia.


### Fase 5: Isabella Studio

- Colaboración multiusuario.
- Revisión por comentarios sobre timecode.
- Versionado tipo Git para escenas.
- Forks creativos.
- Marketplace privado de Shot Cards.
- Biblioteca de voces autorizadas.
- Biblioteca territorial de lugares.
- Generación de documentales, rutas, cápsulas educativas y experiencias inmersivas.


## Resultado objetivo

La versión superior de Isabella no sería únicamente capaz de “generar videos”. Sería capaz de:

- Entender una intención creativa.
- Diseñar una producción completa.
- Justificar cada decisión visual.
- Mantener identidad y continuidad.
- Elegir modelos según calidad, coste y privacidad.
- Generar, reparar y volver a renderizar solo lo necesario.
- Conversar en tiempo real mediante voz y video.
- Crear doblajes y subtítulos sincronizados.
- Exportar automáticamente a cualquier formato.
- Medir la calidad antes de entregar.
- Registrar procedencia, licencias y consentimiento.
- Aprender de las correcciones del usuario.
- Convertir una idea en una biblioteca reutilizable de activos y conocimiento.

La clave arquitectónica es separar **intención creativa, planificación temporal, generación, verificación y distribución**. Si Isabella incorpora estas capas como contratos formales y no como simples prompts encadenados, puede evolucionar de un asistente audiovisual a una auténtica **plataforma de dirección, producción y postproducción cinematográfica autónoma supervisada**.

<span style="display:none">[^1_13][^1_14][^1_15][^1_16][^1_17][^1_18][^1_19][^1_20][^1_21][^1_22][^1_23][^1_24][^1_25][^1_26][^1_27][^1_28][^1_29][^1_30][^1_31][^1_32][^1_33][^1_34][^1_35][^1_36][^1_37][^1_38][^1_39][^1_40][^1_41][^1_42][^1_43][^1_44][^1_45]</span>

<div align="center">⁂</div>

[^1_1]: https://github.com/HITsz-TMG/VideoClaw

[^1_2]: https://docs.comfy.org/development/api-development/workflow-api-format

[^1_3]: https://docs.comfy.org/tutorials/partner-nodes/overview

[^1_4]: https://github.com/zyfjrx/VideoLingo

[^1_5]: https://docs.livekit.io/agents/

[^1_6]: https://github.com/livekit/livekit

[^1_7]: https://github.com/PeterL1n/RobustVideoMatting

[^1_8]: https://github.com/k4yt3x/video2x

[^1_9]: https://github.com/ByteDance-Seed/SeedVR

[^1_10]: https://ffmpeg.org/ffmpeg-all.html

[^1_11]: https://c2pa.org/

[^1_12]: https://c2pa.org/the-c2pa-launches-content-credentials-2-3-and-celebrates-5-years-of-impact-across-the-digital-ecosystem/

[^1_13]: https://github.com/Stonewuu/ai-fusion-video

[^1_14]: https://github.com/HITsz-TMG/VideoClaw/tree/main/video-claw

[^1_15]: https://github.com/HITsz-TMG/VideoClaw/tree/main/video-claw/video-claw

[^1_16]: https://github.com/Stonewuu/ai-fusion-video/tree/main/ai-fusion-video

[^1_17]: https://github.com/HITsz-TMG/VideoClaw/blob/main/README_EN.md

[^1_18]: https://github.com/Stonewuu/ai-fusion-video/releases

[^1_19]: https://github.com/HITsz-TMG/VideoClaw/releases

[^1_20]: https://github.com/Stonewuu/ai-fusion-video/tree/main/.github

[^1_21]: https://github.com/Stonewuu/ai-fusion-video/tree/main/ai-fusion-video-web

[^1_22]: https://raw.githubusercontent.com/Huanshere/VideoLingo/main/README.md

[^1_23]: https://videolingo.io/

[^1_24]: https://github.zh-ak.com/HITsz-TMG/VideoClaw

[^1_25]: https://ffmpeg.org/ffmpeg-filters.html

[^1_26]: https://docs.livekit.io/intro/overview/

[^1_27]: https://docs.runpod.io/community-solutions/comfyui-to-api/overview

[^1_28]: https://docs.comfy.org/development/overview

[^1_29]: https://livekit.com/voice-agents

[^1_30]: https://comfy.org/platform/

[^1_31]: https://github.com/SaladTechnologies/comfyui-api

[^1_32]: https://github.com/livekit/agents

[^1_33]: https://www.ffmpeg-micro.com/blog/ffmpeg-loudnorm-filter-ebu-r128

[^1_34]: https://ayosec.github.io/ffmpeg-filters-docs/

[^1_35]: https://contentcredentials.org/

[^1_36]: https://github.com/k4yt3x/video2x/blob/master/README.md

[^1_37]: https://github.com/gunpowder78/RobustVideoMatting

[^1_38]: https://github.com/PeterL1n/RobustVideoMatting/blob/master/README.md

[^1_39]: https://github.com/PeterL1n/RobustVideoMatting/releases/

[^1_40]: https://docs.video2x.org/

[^1_41]: https://peterl1n.github.io/RobustVideoMatting/

[^1_42]: https://video2x.pro/

[^1_43]: https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html

[^1_44]: https://video-2x.com/

[^1_45]: https://video2x.app/


---

# Plan de arquitectura

Isabella-Engine-Video X debe diseñarse como un **sistema de producción audiovisual determinista, versionado y verificable**, no como una cadena de prompts. El núcleo debe separar cinco responsabilidades:

```text
Intención creativa
      ↓
Narrative Graph
      ↓
Temporal Media Core
      ↓
Workers de generación y postproducción
      ↓
QA multimodal + render final
```

VideoClaw demuestra el valor de un flujo completo desde idea, guion y diseño visual hasta storyboard, referencias, video y edición, con intervención humana durante las etapas intermedias. Runguang/Fusion Video plantea una plataforma orientada a proyectos, guiones, storyboards, assets y generación audiovisual en un espacio unificado. Isabella debe combinar ambos enfoques, pero añadir contratos formales, reproducibilidad, control de costes, recuperación ante errores y validación automática.[^2_1][^2_2]

## Comparativa técnica

| Dimensión | VideoClaw | Runguang / 融光 | Isabella-Engine-Video X |
| :-- | :-- | :-- | :-- |
| Enfoque | Director IA de flujo completo | Workspace agentivo de creación audiovisual | Sistema operativo audiovisual verificable |
| Flujo principal | Idea → guion → personajes/escenarios → storyboard → referencias → video → edición | Proyecto → script → storyboard → assets → generación de imagen/video | Brief → grafo narrativo → EDL temporal → generación → QA → master |
| Intervención humana | Alta y explícita por etapas | Centrada en el workspace y el historial | Human-in-the-loop configurable por riesgo |
| Persistencia | Sesiones, tareas y carpetas de resultados | Proyectos y activos dentro del espacio creativo | Assets versionados, hashes, embeddings y lineage completo |
| Selección de modelos | Modelos registrados por capacidad y configuración | Agentes y modelos integrados en la plataforma | Model Router por calidad, privacidad, latencia y coste |
| Consistencia visual | Referencias de personajes, escenarios y storyboard | Assets y continuidad dentro del proyecto | Identity Packs, embeddings, tokens de continuidad y tests automáticos |
| Ejecución | Principalmente flujo de aplicación y pipelines | Plataforma agentiva orientada a creación | DAG reanudable, workers idempotentes y colas GPU |
| Render | TTS, música, subtítulos y ensamblado | Generación integrada al workspace | Render determinista, incremental y multiformato |
| QA | Evaluación y revisión de resultados | Revisión dentro del proceso creativo | Visión, OCR, audio, narrativa, continuidad y especificaciones técnicas |
| Tiempo real | Digital human como pipeline específico | Capacidades dependientes de integración | Plano WebRTC separado del plano offline |
| Gobernanza | Configuración local y API keys | Depende de la plataforma | RBAC, consentimiento, políticas de modelos, C2PA y auditoría |
| Escalabilidad | Adecuada para producción local y asistida | Adecuada para workspace colaborativo | Local, cloud, GPU farm, edge y ejecución híbrida |

VideoClaw conserva localmente metadatos y resultados, utiliza identificadores de sesión/tarea y clasifica modelos por capacidades como texto, imagen, video, TTS y movimiento. Isabella debe elevar esas ideas hacia un registro de activos inmutable y un motor de ejecución independiente de la interfaz.[^2_1]

## Núcleo de Isabella

### Servicios principales

```text
┌────────────────────────────────────────────┐
│ Studio API / WebSocket / Review Console    │
└───────────────────┬────────────────────────┘
                    │
┌───────────────────▼────────────────────────┐
│ Creative Control Plane                     │
│ Planner · Agent Runtime · Policy Engine    │
└───────────────────┬────────────────────────┘
                    │
      ┌─────────────┼─────────────┐
      │             │             │
┌─────▼─────┐ ┌─────▼──────┐ ┌────▼─────────┐
│ Narrative │ │ Temporal   │ │ Asset       │
│ Graph     │ │ Media Core │ │ Registry    │
└─────┬─────┘ └─────┬──────┘ └────┬─────────┘
      │             │             │
      └─────────────┼─────────────┘
                    │
┌───────────────────▼────────────────────────┐
│ Execution Fabric                           │
│ Queue · Scheduler · Model Router · Cache   │
└───────────────────┬────────────────────────┘
                    │
 ┌──────────────────┼──────────────────┐
 │                  │                  │
 ▼                  ▼                  ▼
Video Workers   Audio Workers     Render Workers
ComfyUI         STT/TTS/Dubbing   HTML/FFmpeg
Matting         Subtitles         Multiformat
Upscaling       Mixing            Mastering
└──────────────────┬────────────────────────┘
                   ▼
┌────────────────────────────────────────────┐
│ Multimodal QA · Provenance · Publishing    │
└────────────────────────────────────────────┘
```


### Contrato de proyecto

```ts
type VideoProject = {
  id: string;
  version: string;
  title: string;
  brief: CreativeBrief;
  narrativeGraphId: string;
  timelineId: string;
  visualBibleId: string;
  targetFormats: TargetFormat[];
  policyProfile: PolicyProfile;
  budget: BudgetPolicy;
  approvalMode: "manual" | "assisted" | "autonomous";
  status: ProjectStatus;
};
```


### Máquina de estados

```text
IDEA
→ BRIEF_NORMALIZED
→ NARRATIVE_PLANNED
→ SCRIPT_DRAFTED
→ SCRIPT_APPROVED
→ VISUAL_BIBLE_LOCKED
→ STORYBOARD_READY
→ ASSETS_GENERATED
→ SHOTS_GENERATED
→ SHOTS_QA
→ AUDIO_READY
→ EDIT_ASSEMBLED
→ MULTIFORMAT_RENDERED
→ MASTER_QA
→ PROVENANCE_SIGNED
→ PUBLISHED
```

Cada estado debe ser idempotente, reanudable y auditable. Si falla la toma 12, Isabella debe regenerar la toma 12 y sus dependencias, no reconstruir todo el proyecto.

## Narrative Graph

El Narrative Graph representa la historia como un grafo de entidades, eventos, relaciones y restricciones. Su propósito no es sustituir al guion, sino convertirlo en una estructura que pueda ser consultada por agentes, generadores y validadores.

### Modelo conceptual

```text
Project
 ├── StoryWorld
 │    ├── Location
 │    ├── Era
 │    ├── Culture
 │    ├── Object
 │    └── Rule
 ├── Character
 │    ├── IdentityPack
 │    ├── WardrobeState
 │    ├── VoiceProfile
 │    └── EmotionalArc
 ├── Scene
 │    ├── Event
 │    ├── Conflict
 │    ├── Symbol
 │    └── Shot
 └── ProductionConstraint
```


### Tipos de nodos

| Nodo | Función |
| :-- | :-- |
| `Project` | Agrupa la producción completa |
| `Character` | Persona, avatar o entidad narrativa |
| `Location` | Lugar físico o imaginario |
| `Scene` | Unidad dramática y espacial |
| `Event` | Acción o cambio narrativo |
| `Object` | Elemento con relevancia visual o dramática |
| `Dialogue` | Línea de diálogo o narración |
| `Emotion` | Estado emocional esperado |
| `Shot` | Unidad audiovisual generable |
| `Asset` | Imagen, video, voz, música o gráfico |
| `Constraint` | Regla de continuidad, seguridad o estilo |
| `Evidence` | Fuente que respalda un hecho |
| `Decision` | Decisión creativa aprobada |

### Tipos de relaciones

```text
Character ──appears_in──> Scene
Character ──wears──> WardrobeState
Character ──has_emotion──> Emotion
Scene ──located_at──> Location
Scene ──contains──> Event
Event ──causes──> Event
Event ──uses──> Object
Shot ──visualizes──> Event
Shot ──references──> Asset
Shot ──must_follow──> Shot
Asset ──derived_from──> Asset
Decision ──constrains──> Shot
Evidence ──supports──> NarrativeFact
```


### Ejemplo

```json
{
  "nodes": [
    {
      "id": "char-isabella",
      "type": "Character",
      "properties": {
        "identity_pack": "identity/isabella/v3",
        "role": "narrator",
        "canonical_age": "adult"
      }
    },
    {
      "id": "loc-mineral-monte",
      "type": "Location",
      "properties": {
        "name": "Mineral del Monte",
        "time_of_day": "blue_hour",
        "weather": "light_fog"
      }
    },
    {
      "id": "scene-04",
      "type": "Scene",
      "properties": {
        "dramatic_function": "revelation",
        "emotional_intensity": 0.74
      }
    },
    {
      "id": "event-lantern",
      "type": "Event",
      "properties": {
        "action": "Isabella discovers an old lantern"
      }
    }
  ],
  "edges": [
    {
      "from": "char-isabella",
      "type": "appears_in",
      "to": "scene-04"
    },
    {
      "from": "scene-04",
      "type": "located_at",
      "to": "loc-mineral-monte"
    },
    {
      "from": "scene-04",
      "type": "contains",
      "to": "event-lantern"
    }
  ]
}
```


### Implementación recomendada

Para el núcleo:

- PostgreSQL para entidades, versiones y transacciones.
- `pgvector` para embeddings de personajes, estilo, lugares y escenas.
- JSONB para propiedades flexibles.
- Event store para decisiones y cambios.
- Proyección opcional hacia Neo4j si las consultas de grafos crecen mucho.

No empezaría con Neo4j como dependencia central. PostgreSQL permite mantener el grafo, el control transaccional, los assets y las auditorías en el mismo sistema. Una base especializada puede añadirse después como índice de lectura.

### Consultas fundamentales

```sql
-- ¿Qué tomas dependen de la apariencia actual de Isabella?
SELECT shot_id
FROM shot_character_bindings
WHERE character_id = 'char-isabella'
  AND identity_version <> '3.2.0';

-- ¿Qué escenas se ven afectadas por cambiar la localización?
SELECT DISTINCT shot_id
FROM shot_scene_bindings
WHERE scene_id = 'scene-04';

-- ¿Qué assets no tienen procedencia validada?
SELECT id
FROM assets
WHERE provenance_status <> 'verified';
```


### Motor de impacto

Cuando cambia un nodo, Isabella debe calcular:

```text
nodo modificado
→ relaciones dependientes
→ shots afectados
→ assets inválidos
→ workers necesarios
→ coste estimado
→ aprobación requerida
```

Así, modificar el vestuario de un personaje no invalida necesariamente la música, la narración o los subtítulos ya aprobados.

## Temporal Media Core

El Temporal Media Core es el componente que transforma decisiones narrativas en tiempo audiovisual exacto. Su función es proporcionar un único reloj para video, audio, subtítulos, gráficos, efectos y eventos de agentes.

### Modelo temporal

Debe evitarse usar exclusivamente números de coma flotante. El sistema debe usar enteros:

```text
Video: frame_index
Audio: sample_index
Subtítulos: tick de alta resolución
Eventos: timestamp racional
```

```ts
type RationalTime = {
  numerator: bigint;
  denominator: bigint;
};

type TimeRange = {
  start: RationalTime;
  end: RationalTime;
};
```

Para un proyecto de 24 fps:

```text
frame 0 = 0 / 24 s
frame 1 = 1 / 24 s
frame 24 = 1 / 1 s
```

Para audio a 48 kHz:

```text
sample 48000 = 1 / 1 s
```


### Especificación base

| Parámetro | Especificación |
| :-- | :-- |
| Timebase de video | Racional, por ejemplo 24/1 o 30000/1001 |
| Audio | 48 kHz, enteros por sample |
| Código de color | Lineal interno; entrega Rec.709, HDR10 o Dolby Vision según perfil |
| Resolución | Definida en el manifest, no inferida del primer asset |
| Píxel | Square pixel salvo perfil específico |
| Frames | Identificados por índice absoluto |
| Subtítulos | Intervalos exactos con margen mínimo configurable |
| Transiciones | Duración exacta en frames |
| Audio drift | Tolerancia declarada en samples |
| Exportación | Perfil técnico versionado |
| Hash | SHA-256 de assets y manifiestos |
| Reproducción | Manifest lock + workflow lock + modelo lock |

### Manifest de render

```json
{
  "render_id": "render-20260917-001",
  "project_id": "project-001",
  "timeline_version": "7.4.0",
  "renderer_version": "isabella-renderer-2.1.3",
  "video": {
    "width": 3840,
    "height": 2160,
    "fps_num": 24,
    "fps_den": 1,
    "pixel_format": "yuv420p10le",
    "color_primaries": "bt2020",
    "transfer": "pq",
    "matrix": "bt2020nc"
  },
  "audio": {
    "sample_rate": 48000,
    "channels": 2,
    "layout": "stereo"
  },
  "inputs": [
    {
      "asset_id": "asset-shot-04-003",
      "sha256": "..."
    }
  ],
  "determinism": {
    "seed": 412903,
    "workflow_hash": "...",
    "model_hashes": ["..."],
    "container_digest": "sha256:..."
  }
}
```


### Qué significa “determinista”

En postproducción, el mismo manifest, los mismos assets, la misma versión del renderer y el mismo entorno deben producir el mismo archivo o, como mínimo, el mismo resultado perceptual dentro de una tolerancia definida.

En generación por difusión, la semilla por sí sola no basta. Incluso con la misma semilla pueden surgir diferencias por versiones de CUDA, kernels, operaciones paralelas, batch size o modelos modificados. Existen herramientas específicas que documentan esta limitación y buscan controlar operaciones no deterministas en pipelines de ComfyUI.[^2_3]

### Medidas de determinismo

- Contenedores fijados por digest.
- Modelos fijados por hash.
- Workflows ComfyUI exportados en API format.
- Seeds explícitas por toma.
- `batch_size = 1` en renders de referencia.
- Configuración de sampler y scheduler fija.
- Versiones exactas de CUDA, PyTorch y drivers.
- Variables aleatorias registradas.
- Desactivación de optimizaciones no deterministas cuando sea posible.
- Orden de inputs estable.
- Preprocesamiento reproducible.
- Audio renderizado en una única frecuencia declarada.
- Prohibición de depender de fecha, hora o nombres aleatorios.
- Validación por checksum.
- Comparación perceptual cuando el bit-perfect no sea posible.

ComfyUI diferencia entre el formato de guardado visual y el formato API, donde el segundo elimina posiciones, colores y metadatos de interfaz para conservar únicamente los datos necesarios para ejecutar el grafo. Isabella debe almacenar ambos: el formato visual para edición humana y el API format para ejecución reproducible.[^2_4]

### Timeline inmutable

No se debe editar directamente una timeline aprobada. Se crean nuevas versiones:

```text
timeline v1 → v2 → v3 → v4
```

Cada versión conserva:

- Autor del cambio.
- Motivo.
- Assets afectados.
- Resultado de QA.
- Aprobación.
- Posibilidad de rollback.


## Control de calidad automático

El QA debe ejecutarse en cuatro niveles:

```text
Frame QA
→ Shot QA
→ Sequence QA
→ Master QA
```


### 1. Frame QA

Se muestrea cada frame o un conjunto adaptativo:

- Cada frame en tomas cortas.
- Cada 2–5 frames en material dinámico.
- Cada 10–15 frames en planos estáticos.
- Frames adicionales alrededor de cortes y transiciones.

Se calculan:

- Brillo medio.
- Histograma.
- Diferencia entre frames.
- Detección de frame negro.
- Detección de congelación.
- Nitidez.
- Ruido.
- Movimiento.
- Rostros.
- Objetos.
- Texto.
- Máscaras.


### 2. Shot QA

Evalúa la toma completa:

- Estabilidad temporal.
- Identidad del personaje.
- Consistencia de vestuario.
- Continuidad de iluminación.
- Calidad de labios.
- Movimiento de cámara.
- Coherencia con la Shot Card.
- Duración real.
- Adecuación al formato.


### 3. Sequence QA

Comprueba relación entre tomas:

- Dirección de mirada.
- Regla de 180 grados.
- Continuidad de movimiento.
- Match cuts.
- Evolución emocional.
- Repetición visual.
- Cambios inexplicados de ropa o lugar.
- Transiciones demasiado rápidas.
- Contraste y color entre clips.


### 4. Master QA

Evalúa la entrega:

- Resolución.
- FPS.
- Códec.
- Audio.
- Subtítulos.
- Safe areas.
- Color.
- Metadatos.
- Hash.
- Proveniencia.
- Integridad del archivo.


## Visión por computadora

OpenCV ofrece componentes para detección de rostros, objetos, acciones, movimiento y procesamiento de video, por lo que puede funcionar como capa de extracción de señales de bajo nivel.[^2_5]

### Pipeline visual

```text
video
→ demux
→ extracción de frames
→ detección de cortes
→ muestreo adaptativo
→ visión
→ comparación temporal
→ scoring
→ reporte QA
```

PySceneDetect puede detectar cambios de plano, cortes rápidos y transiciones por umbral, por lo que puede alimentar automáticamente la segmentación inicial del material.[^2_6]

### Detectores recomendados

| Detector | Señal |
| :-- | :-- |
| Face detector | Presencia y posición del personaje |
| Face embedding | Identidad y continuidad |
| Pose estimator | Movimiento y postura |
| Object detector | Props y objetos narrativos |
| Optical flow | Movimiento y estabilidad |
| Depth estimator | Coherencia espacial |
| Color analyzer | Exposición y continuidad |
| Blur detector | Nitidez y foco |
| Flicker detector | Variaciones temporales |
| Scene detector | Cortes y segmentos |
| Caption detector | Texto incrustado |
| Watermark detector | Marcas no autorizadas |

### Consistencia facial

```python
identity_score = cosine_similarity(
    reference_face_embedding,
    generated_face_embedding
)
```

Debe combinarse con otras señales:

```text
identity_score =
  face_embedding * 0.45
+ landmarks * 0.20
+ hairstyle * 0.10
+ wardrobe * 0.10
+ color_context * 0.05
+ temporal_stability * 0.10
```

Un rostro puede ser parecido en un frame y fallar temporalmente. Por eso el score debe agregarse por secuencia, no solo por imagen.

## OCR y control de texto

El OCR sirve para dos problemas distintos:

1. Verificar texto que Isabella debía generar.
2. Detectar texto inesperado, marcas de agua o residuos.

PaddleOCR separa detección y reconocimiento de texto, y soporta corrección de orientación, distorsión y múltiples idiomas. La documentación de PaddleOCR describe una tubería general con módulos independientes de detección y reconocimiento, lo que facilita reemplazar o especializar cada etapa.[^2_7][^2_8]

### Pipeline OCR

```text
frames seleccionados
→ detector de regiones
→ rectificación
→ reconocimiento
→ normalización
→ agrupación temporal
→ comparación con expected_text
→ clasificación de errores
```


### Resultado OCR

```json
{
  "frame_range": {
    "start": 240,
    "end": 432
  },
  "text": "Mineral del Monte",
  "bbox": [184, 1620, 920, 1720],
  "confidence": 0.96,
  "language": "es",
  "source": "paddleocr",
  "expected": true,
  "safe_area": true,
  "contrast_ratio": 6.8,
  "status": "pass"
}
```


### Pruebas de texto

```text
expected_text_present
expected_text_exact
unexpected_text_absent
subtitle_overlap_absent
safe_area_valid
minimum_font_size_valid
contrast_valid
language_valid
duration_valid
```


### Detección de texto no deseado

Un detector debe comparar OCR con:

- Textos previstos en la timeline.
- Subtítulos esperados.
- Logos autorizados.
- Nombres de lugares.
- Marcas permitidas.
- Lista de exclusión.

Si aparece texto no registrado, el resultado debe clasificarse:

```text
unknown_text
possible_watermark
generation_artifact
historical_signage
third_party_brand
```

No debe borrarse automáticamente todo texto desconocido. Una señal histórica o una marca documental puede ser parte del contenido real.

## Motor de scoring

```ts
type QualityReport = {
  technical: number;
  visual: number;
  identity: number;
  temporal: number;
  audio: number;
  text: number;
  narrative: number;
  safety: number;
  decision: "pass" | "review" | "regenerate" | "block";
};
```

Una ponderación inicial:

```text
total =
  technical * 0.15
+ visual * 0.18
+ identity * 0.15
+ temporal * 0.15
+ audio * 0.12
+ text * 0.10
+ narrative * 0.10
+ safety * 0.05
```

Pero los mínimos deben ser obligatorios:

```text
identity >= 0.85
text >= 0.90
audio_sync >= 0.95
technical == pass
safety == pass
```

Un promedio alto no debe ocultar un fallo crítico. Una toma con excelente estética, pero con un rostro deformado o una marca no autorizada, debe bloquearse.

## Arquitectura del worker de QA

```text
qa-service
├── frame-extractor
├── scene-segmenter
├── visual-detectors
├── identity-validator
├── temporal-validator
├── ocr-service
├── subtitle-validator
├── audio-validator
├── llm-critic
├── score-engine
└── remediation-planner
```


### Remediation planner

El sistema no solo debe decir “falló”. Debe explicar la acción:

```json
{
  "failure": "unexpected_text",
  "severity": "high",
  "range": [12.8, 15.2],
  "action": "inpaint_region",
  "preserve_original": true,
  "requires_approval": true,
  "estimated_cost": {
    "gpu_seconds": 190
  }
}
```

Acciones posibles:

- `accept`.
- `trim`.
- `recolor`.
- `reframe`.
- `retranscribe`.
- `regenerate_audio`.
- `regenerate_shot`.
- `inpaint_region`.
- `replace_asset`.
- `human_review`.
- `block_publish`.


## Implementación por fases

### Fase 1: núcleo funcional

- PostgreSQL.
- Object Storage.
- API de proyectos.
- Narrative Graph en tablas relacionales.
- ITSG y timeline versionada.
- Worker FFmpeg.
- Registro de assets.
- Shot Cards básicas.
- QA técnico.


### Fase 2: generación integrada

- ComfyUI API.
- Model Router.
- Queue y scheduler.
- Seeds y workflow hashes.
- Identidad de personajes.
- Storyboard.
- Generación de clips.
- Reintentos idempotentes.


### Fase 3: QA multimodal

- PySceneDetect.
- OpenCV.
- PaddleOCR.
- Embeddings faciales.
- Optical flow.
- Validación de subtítulos.
- Evaluación de audio.
- Remediation planner.


### Fase 4: producción profesional

- Render determinista.
- GPU farm.
- C2PA.
- Revisión colaborativa por timecode.
- Doblaje.
- Avatar streaming.
- Publicación multicanal.
- Métricas de coste y calidad.


## Decisión arquitectónica final

La arquitectura recomendada es:

```text
PostgreSQL + pgvector
Object Storage S3
Temporal o motor DAG reanudable
Redis/NATS para colas
Python para workers de IA
Node.js/TypeScript para APIs, timeline y render web
ComfyUI para workflows nodales
FFmpeg para finishing
OpenCV + PySceneDetect para análisis visual
PaddleOCR para texto
WebRTC/LiveKit para tiempo real
OpenTelemetry para observabilidad
C2PA para proveniencia
```

La diferenciación principal de Isabella no será usar más modelos que VideoClaw o Runguang. Será poseer una capa superior que garantice:

1. **Coherencia narrativa** mediante el Narrative Graph.
2. **Precisión temporal** mediante el Temporal Media Core.
3. **Reproducibilidad** mediante manifests, hashes y entornos fijados.
4. **Calidad verificable** mediante visión, OCR, audio y evaluación narrativa.
5. **Recuperación eficiente** mediante DAGs parciales e idempotentes.
6. **Gobernanza** mediante consentimiento, políticas y proveniencia.
7. **Escalabilidad** mediante routing local, cloud y GPU scheduling.

Ese núcleo convierte a Isabella-Engine-Video X en una plataforma de cine automatizado supervisado: creativa en la planificación, flexible en la generación, rigurosa en la verificación y reproducible en la entrega.

<span style="display:none">[^2_10][^2_11][^2_12][^2_13][^2_14][^2_15][^2_16][^2_17][^2_18][^2_19][^2_20][^2_21][^2_22][^2_23][^2_24][^2_25][^2_26][^2_27][^2_28][^2_29][^2_30][^2_31][^2_32][^2_9]</span>

<div align="center">⁂</div>

[^2_1]: https://github.com/HITsz-TMG/VideoClaw

[^2_2]: https://github.com/Stonewuu/ai-fusion-video/blob/main/README_EN.md

[^2_3]: https://github.com/JosephOIbrahim/comfyui-deterministic-toolkit

[^2_4]: https://docs.comfy.org/development/api-development/workflow-api-format

[^2_5]: https://docs.opencv.org/

[^2_6]: https://pypi.org/project/scenedetect/

[^2_7]: https://paddlepaddle.github.io/PaddleX/3.0-rc/en/pipeline_usage/tutorials/ocr_pipelines/OCR.html

[^2_8]: https://www.paddleocr.ai/latest/en/version3.x/pipeline_usage/OCR.html

[^2_9]: https://docs.comfy.org/

[^2_10]: https://github.com/Stonewuu/ai-fusion-video/tree/main/ai-fusion-video-web/app

[^2_11]: https://github.com/Comfy-Org/docs

[^2_12]: https://comfyai.run/documentation/OAIAPI_Seed

[^2_13]: https://theresanaiforthat.com/company/hitsz-tmg/repository/VideoClaw/

[^2_14]: https://comfyai.run/documentation/Seed\_

[^2_15]: https://reputagent.com/ecosystem/hitsz-tmg-videoclaw

[^2_16]: https://docs.opencv.org/3.0-beta/modules/text/doc/ocr.html

[^2_17]: https://www.paddleocr.ai/latest/en/version3.x/pipeline_usage/PaddleOCR-VL.html

[^2_18]: https://github.com/Breakthrough/PySceneDetect

[^2_19]: https://github.com/Breakthrough/PySceneDetect/blob/main/README.md

[^2_20]: https://github.com/krishnapriya-nynaru/Text-detection-opencv-easyocr

[^2_21]: https://github.com/PaddlePaddle/PaddleOCR

[^2_22]: https://www.scenedetect.com/api/

[^2_23]: https://paddleocr.dev/doc

[^2_24]: https://www.scenedetect.com/docs/latest/

[^2_25]: https://paddleocr.dev/

[^2_26]: https://www.geeksforgeeks.org/videos/text-detection-and-extraction-using-opencv-and-ocr/

[^2_27]: https://github.com/Stonewuu/ai-fusion-video

[^2_28]: https://github.com/HITsz-TMG/VideoClaw/blob/main/README_EN.md

[^2_29]: https://github.com/Stonewuu/ai-fusion-video/tree/main/ai-fusion-video

[^2_30]: https://github.com/HITsz-TMG/VideoClaw/tree/main/video-claw

[^2_31]: https://github.com/Stonewuu/ai-fusion-video/tree/main/.github

[^2_32]: https://github.com/Stonewuu/ai-fusion-video/releases


---

# Skill: Isabella Document Seal

Sí, puede implementarse como un skill nativo para Isabella, pero conviene corregir una distinción importante: **un hash no es una firma digital, HMAC no es una firma digital y una marca visible en forma de gota de agua tampoco demuestra autenticidad por sí sola**.

La solución robusta debe combinar:

```text
Hash de contenido
+ firma digital asimétrica
+ sello de tiempo confiable
+ manifiesto de procedencia
+ marca visible/imperceptible
+ registro verificable
```

El concepto puede llamarse:

```text
ISABELLA DOCUMENT SEAL
```

Y el identificador visible podría seguir este patrón:

```text
SHA-ISABELLA-GENESIS-256-ED25519-<DIGEST>
```

Sin embargo, ese nombre debe describir correctamente el sistema. Si usamos Ed25519, no es apropiado llamarlo simplemente “algoritmo cifrado”, porque Ed25519 es un algoritmo de firma digital, no de cifrado. FIPS 186-5 define firmas digitales para detectar modificaciones no autorizadas y autenticar la identidad del firmante.[^3_1]

## Fundamento criptográfico

El material que compartiste explica correctamente la idea de HMAC: combina una función hash con una clave secreta compartida para autenticar mensajes. La especificación RFC 2104 define HMAC como un mecanismo de autenticación basado en una función hash y una clave secreta.[^3_2][^3_3]

Pero para los documentos de Isabella hay que separar cuatro funciones:


| Función | Tecnología | Qué demuestra |
| :-- | :-- | :-- |
| Integridad pública | SHA-256 o SHA-3-256 | Que el contenido no cambió |
| Autenticación interna | HMAC-SHA-256 | Que el sistema con la clave secreta produjo el registro |
| Firma pública | Ed25519, ECDSA o ML-DSA | Que una clave privada autorizada firmó el documento |
| Existencia temporal | RFC 3161 | Que el resumen existía en una fecha verificable |

### Lo que no debe usarse

- MD5 para seguridad.
- SHA-1 para nuevas firmas.
- HMAC como sustituto de una firma pública.
- La marca de agua como prueba criptográfica.
- Una clave privada almacenada en el código.
- Un hash visible sin firma verificable.
- Un blockchain como sustituto de una PKI bien diseñada.


### Perfil recomendado

Para la primera versión:

```text
Hash: SHA-256
Firma primaria: Ed25519
KDF: HKDF-SHA-256
MAC interno: HMAC-SHA-256
Cifrado de archivos privados: AES-256-GCM o XChaCha20-Poly1305
Sello de tiempo: RFC 3161
Serialización: JSON canónico / JCS
Identificador: Base32 o Base58
```

Para una versión de larga vigencia:

```text
Firma clásica: Ed25519
Firma poscuántica adicional: ML-DSA-65
Sello alternativo: SLH-DSA para documentos de máxima conservación
```

NIST ha estandarizado ML-DSA en FIPS 204 y SLH-DSA en FIPS 205 como esquemas de firma poscuántica. Isabella podría firmar inicialmente de forma híbrida:[^3_4][^3_5]

```text
firma_híbrida =
  Ed25519(document_digest)
  +
  ML-DSA-65(document_digest)
```

Esto no hace mágicamente al sistema “invulnerable”, pero permite mantener interoperabilidad clásica y preparar conservación a largo plazo.

## Identidad del sello

Propongo este formato:

```text
ISABELLA-DOC-v1/
  SHA256/
  ED25519/
  TSA-RFC3161/
  GENESIS/
  <document_id>/
  <digest_prefix>
```

Formato compacto:

```text
SHA-ISABELLA-GENESIS-256-ED25519-7Q4M2W9K8H3P
```

Formato completo:

```text
ISABELLA-DOC-v1-SHA256-ED25519-RFC3161-GENESIS-2026-7Q4M2W9K8H3P
```

Si se adopta firma híbrida:

```text
ISABELLA-DOC-v2-SHA256-ED25519+MLDSA65-RFC3161-GENESIS-7Q4M2W9K8H3P
```

El identificador visible no debe contener la clave privada ni un secreto. Debe ser una representación corta del digest y de los algoritmos empleados.

## Arquitectura del skill

```text
┌─────────────────────────────────────┐
│ Isabella Document Seal Skill        │
├─────────────────────────────────────┤
│ Canonicalizer                       │
│ Digest Engine                       │
│ Signature Engine                    │
│ Timestamp Client                    │
│ Watermark Engine                    │
│ Provenance Manifest                 │
│ Registry Writer                     │
│ Verification Engine                 │
└─────────────────┬───────────────────┘
                  │
        ┌─────────▼─────────┐
        │ Key Management     │
        │ KMS / HSM / Vault  │
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │ Immutable Registry │
        │ DB + Object Store  │
        │ Transparency Log   │
        └────────────────────┘
```


### Componentes

1. **Canonicalizer**

Convierte el documento en una representación estable antes de calcular el hash.
2. **Digest Engine**

Calcula SHA-256 del contenido canónico.
3. **Signature Engine**

Firma el digest con la clave privada de Isabella.
4. **Timestamp Client**

Envía el digest a una autoridad de sellado de tiempo RFC 3161. RFC 3161 define la solicitud y respuesta de una autoridad de timestamping X.509.[^3_6]
5. **Watermark Engine**

Inserta el sello visible y una marca imperceptible en PDF, DOCX, HTML, imágenes o videos.
6. **Provenance Manifest**

Registra quién, cuándo, con qué modelo, versión, prompt, fuentes y parámetros generó el contenido.
7. **Registry Writer**

Persiste el registro, el digest, la firma, el certificado y el timestamp.
8. **Verification Engine**

Permite comprobar el documento sin confiar únicamente en Isabella.

## Flujo de sellado

```text
Documento generado
      ↓
Normalización y canonicalización
      ↓
Hash SHA-256
      ↓
Construcción de manifest
      ↓
Firma Ed25519
      ↓
Firma ML-DSA opcional
      ↓
Solicitud RFC 3161
      ↓
Inserción de marca visible
      ↓
Inserción de marca imperceptible
      ↓
Generación del paquete verificable
      ↓
Registro inmutable
      ↓
Documento sellado
```


### Punto importante: orden de firma y marca de agua

La marca visible e imperceptible debe estar definida antes de calcular el hash final. De lo contrario, el PDF que el usuario recibe no coincidirá con el contenido que se firmó.

Hay dos opciones:

### Opción A: sello del contenido final

```text
render completo
→ marca de agua
→ canonicalización
→ hash
→ firma
```

Es la opción recomendada para documentos finales.

### Opción B: sello del contenido lógico

```text
contenido lógico
→ hash
→ firma
→ render visual
→ marca de agua con el hash
```

Es útil cuando el render puede cambiar entre formatos, pero el contenido lógico permanece igual. En ese caso debe haber dos hashes:

```text
content_digest
render_digest
```


## Manifiesto criptográfico

Cada documento debe incluir un manifiesto JSON firmado:

```json
{
  "schema": "isabella.document-seal.v1",
  "document": {
    "id": "doc_01JISABELLA001",
    "title": "Arquitectura de Isabella Engine Video",
    "media_type": "application/pdf",
    "language": "es-MX",
    "created_at": "2026-09-17T20:00:00-06:00"
  },
  "content": {
    "canonicalization": "JCS",
    "sha256": "7q4m2w9k8h3p...",
    "byte_length": 184223,
    "page_count": 28
  },
  "generation": {
    "system": "Isabella",
    "skill": "document-seal",
    "skill_version": "1.0.0",
    "model_id": "registered-model-id",
    "prompt_hash": "..."
  },
  "signature": {
    "algorithm": "Ed25519",
    "key_id": "isabella-signing-key-2026-01",
    "value": "base64url-signature"
  },
  "post_quantum_signature": {
    "algorithm": "ML-DSA-65",
    "key_id": "isabella-pq-key-2026-01",
    "value": "base64url-signature"
  },
  "timestamp": {
    "protocol": "RFC3161",
    "tsa": "tsa.example",
    "token": "base64-token"
  },
  "watermark": {
    "visible_id": "SHA-ISABELLA-GENESIS-256-ED25519-7Q4M2W9K8H3P",
    "method": "visible-plus-invisible",
    "payload_hash": "..."
  },
  "provenance": {
    "sources": [],
    "human_review": false,
    "synthetic_content": true
  }
}
```


## Registro Genesis

“Genesis” debe representar la raíz de confianza de Isabella, no solo una palabra decorativa.

Propongo una cadena de registro:

```text
Genesis Root
    ↓
Organization Key
    ↓
Environment Key
    ↓
Project Key
    ↓
Document Signature Key
```


### Estructura

```text
ISABELLA-GENESIS-ROOT
├── isabella-production
│   ├── documents
│   ├── video
│   └── research
├── isabella-staging
└── isabella-development
```

La clave raíz debe mantenerse offline o en un HSM. Las claves de firma operativa deben ser delegadas y revocables.

### Registro encadenado

```json
{
  "sequence": 1042,
  "document_id": "doc_01JISABELLA001",
  "document_digest": "sha256:...",
  "previous_record_hash": "sha256:...",
  "record_hash": "sha256:...",
  "signature": "..."
}
```

Cada registro incluye el hash del anterior:

```text
record_hash[n] =
  SHA256(record[n] || record_hash[n-1])
```

Esto crea una cadena de evidencia. Para mejorar la verificabilidad, Isabella puede publicar periódicamente una raíz Merkle:

```text
document hashes
      ↓
Merkle tree
      ↓
Merkle root
      ↓
external timestamp / public transparency log
```

La raíz publicada no revela el contenido de los documentos, pero permite demostrar que un documento ya estaba registrado.

## Firma digital frente a HMAC

### HMAC

```text
HMAC-SHA-256(secret_key, document_hash)
```

Ventajas:

- Rápido.
- Adecuado para servicios internos.
- Útil para autenticar eventos entre Isabella y sus workers.

Limitaciones:

- El verificador necesita conocer el secreto.
- Cualquier parte que pueda verificar también podría generar otro MAC.
- No prueba públicamente quién firmó.
- No es ideal para documentos que se entregarán a terceros.


### Firma digital

```text
signature = Sign(private_key, document_hash)
valid = Verify(public_key, document_hash, signature)
```

Ventajas:

- El documento puede verificarse con una clave pública.
- La clave privada nunca debe salir del KMS/HSM.
- Permite certificados, revocación y auditoría.
- Es apropiada para documentos entregados a terceros.

La arquitectura recomendada es:

```text
HMAC interno
+
firma digital pública
```

No uno en sustitución del otro.

## Marca de agua en gota de agua

La “gota de agua” debe tener dos capas.

### Marca visible

Puede aparecer como una pequeña gota translúcida en:

- Portada.
- Pie de página.
- Margen lateral.
- Cada página en modo de máxima protección.
- Metadatos visuales de documentos críticos.

Contenido:

```text
ISABELLA SEALED
ID: 7Q4M2W9K8H3P
SHA256 · ED25519
2026-09-17
```

Debe ser discreta, pero no confundirse con una certificación gubernamental o notarial.

### Marca imperceptible

La marca imperceptible puede codificar:

```text
document_id
digest_prefix
signature_key_id
creation_epoch
watermark_version
```

No debe almacenar:

- Claves privadas.
- Datos personales innecesarios.
- El documento completo.
- Secretos.
- Información que comprometa la privacidad.


### Técnicas por formato

| Formato | Técnica |
| :-- | :-- |
| PDF | XMP, metadata, objeto de firma, footer visible y anotación controlada |
| DOCX | Custom XML, core properties y footer |
| HTML | Meta tags, JSON-LD, manifest y sello visible |
| PNG/JPEG | C2PA/XMP, metadata y watermark robusto |
| Video | C2PA, metadata, watermark temporal y manifiesto externo |
| Audio | ID3/BWF, manifest sidecar y watermark acústico opcional |
| JSON | Campo `_isabella_seal` firmado |
| Markdown | Bloque de sello y archivo sidecar |

La marca visual es una señal de procedencia humana; la validación real debe hacerse con el hash y la firma.

## Paquete de entrega

Nunca entregaría únicamente el PDF. Para un documento importante, Isabella debería producir:

```text
document-package/
├── document.pdf
├── manifest.json
├── signature.sig
├── public-key.pem
├── certificate-chain.pem
├── timestamp.tsr
├── verification-report.json
├── provenance.json
└── README-VERIFY.md
```

Para máxima interoperabilidad:

```text
document.pdf
document.pdf.manifest.json
document.pdf.sig
document.pdf.tsr
```

El PDF puede contener una copia del manifiesto, pero el manifiesto externo facilita la verificación cuando el documento se transforma o se descarga desde otro sistema.

## API del skill

```http
POST /v1/document-seal/seal
POST /v1/document-seal/verify
POST /v1/document-seal/revoke
GET  /v1/document-seal/{documentId}
GET  /v1/document-seal/{documentId}/manifest
GET  /v1/document-seal/{documentId}/proof
POST /v1/document-seal/rotate-key
```


### Solicitud de sellado

```json
{
  "input_asset_id": "asset-document-001",
  "format": "pdf",
  "profile": "public-verifiable",
  "visible_watermark": true,
  "invisible_watermark": true,
  "timestamp": true,
  "post_quantum_signature": true,
  "register": true,
  "include_sources": true
}
```


### Respuesta

```json
{
  "document_id": "doc_01JISABELLA001",
  "status": "sealed",
  "seal_id": "SHA-ISABELLA-GENESIS-256-ED25519-7Q4M2W9K8H3P",
  "sha256": "7q4m2w9k8h3p...",
  "signature_algorithm": "Ed25519",
  "post_quantum_algorithm": "ML-DSA-65",
  "timestamp_status": "verified",
  "registry_status": "committed",
  "verification_url": "https://verify.isabella.example/doc_01JISABELLA001"
}
```


## Verificación independiente

El verificador debe poder trabajar offline:

```text
1. Leer manifest.
2. Calcular SHA-256 del documento.
3. Comparar con content_digest.
4. Obtener la clave pública.
5. Validar Ed25519.
6. Validar ML-DSA si existe.
7. Validar timestamp RFC 3161.
8. Validar la cadena Genesis.
9. Comprobar revocación.
10. Emitir reporte.
```


### Resultado

```json
{
  "valid": true,
  "document_id": "doc_01JISABELLA001",
  "integrity": "valid",
  "signature": {
    "ed25519": "valid",
    "ml_dsa_65": "valid"
  },
  "timestamp": "valid",
  "watermark": "detected",
  "registry": "valid",
  "provenance": "complete",
  "warnings": []
}
```


## Ejemplo conceptual en TypeScript

```ts
import {
  createHash,
  createPrivateKey,
  createPublicKey,
  sign,
  verify,
} from "node:crypto";

export function sha256(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

export function signEd25519(
  digest: Buffer,
  privateKeyPem: string,
): string {
  const privateKey = createPrivateKey(privateKeyPem);
  return sign(null, digest, privateKey).toString("base64url");
}

export function verifyEd25519(
  digest: Buffer,
  signature: string,
  publicKeyPem: string,
): boolean {
  const publicKey = createPublicKey(publicKeyPem);

  return verify(
    null,
    digest,
    publicKey,
    Buffer.from(signature, "base64url"),
  );
}
```

Este ejemplo es solo la parte criptográfica básica. En producción, la clave privada no debe cargarse desde un archivo de aplicación. La firma debe ejecutarse mediante KMS, HSM o un servicio de firma aislado.

## Gestión de claves

```text
Root CA / Genesis Key
        ↓
Document Signing CA
        ↓
Environment Signing Key
        ↓
Per-project or rotating signing key
```


### Reglas

- La clave privada nunca aparece en logs.
- Nunca se almacena en variables de frontend.
- Rotación periódica.
- Identificador de clave en cada manifest.
- Revocación mediante CRL, OCSP o registry.
- Copias de seguridad cifradas.
- Separación entre desarrollo, staging y producción.
- Firma dual para documentos de alto valor.
- Aprobación humana para usar una clave de producción.
- Registro de cada operación de firma.
- Destrucción segura de claves revocadas cuando proceda.
- Pruebas periódicas de recuperación.


## C2PA y procedencia

El sistema debería integrar C2PA para documentos audiovisuales y multimedia. C2PA define un estándar de procedencia y autenticidad para registrar el origen y las modificaciones del contenido digital.[^3_7]

La capa C2PA puede complementar el sello de Isabella:

```text
Isabella Manifest
      +
C2PA Manifest
      +
PDF/DOCX/XMP metadata
      +
External registry
```

Para credenciales o documentos verificables estructurados, W3C Data Integrity 1.0 describe mecanismos criptográficos para demostrar autenticidad e integridad mediante firmas y pruebas matemáticas.[^3_8]

## Perfiles del skill

### `internal`

```text
HMAC-SHA-256
SHA-256
registro privado
marca visible opcional
```

Para documentos internos y eventos entre servicios.

### `public-verifiable`

```text
SHA-256
Ed25519
RFC 3161
manifest externo
watermark visible
verificación offline
```

Perfil recomendado por defecto para documentos compartidos.

### `long-term`

```text
SHA-256 + SHA-3-256
Ed25519 + ML-DSA-65
RFC 3161
Merkle root externo
C2PA cuando aplique
retención de claves y certificados
```

Para investigaciones, contratos, informes institucionales y documentación histórica.

### `restricted`

```text
AES-256-GCM o XChaCha20-Poly1305
Ed25519 para autenticidad
KMS/HSM
control de acceso
registro de visualización
marca de agua personalizada por receptor
```

Para documentos confidenciales.

## Sello recomendado

La nomenclatura que usaría para Isabella es:

```text
ISABELLA-GENESIS-SEAL
```

Y el formato visible:

```text
ISABELLA-GENESIS-SEAL
SHA-256 · ED25519 · RFC3161
ID: 7Q4M2W9K8H3P
ISSUED: 2026-09-17
```

Para una versión poscuántica:

```text
ISABELLA-GENESIS-SEAL
SHA-256 · ED25519 + ML-DSA-65 · RFC3161
ID: 7Q4M2W9K8H3P
```

No usaría `SHA-ISABELLA-GENESIS` como si SHA fuera el nombre de la firma. Es mejor separar:

```text
hash: SHA-256
signature: Ed25519
timestamp: RFC 3161
registry: Isabella Genesis
```


## Integración con todos los documentos de Isabella

El skill debe ejecutarse automáticamente después del render final:

```text
generación
→ revisión
→ render final
→ seal skill
→ firma
→ timestamp
→ watermark
→ registro
→ entrega
```

Debe activarse para:

- Informes.
- PDFs.
- Presentaciones.
- Guiones.
- Documentación técnica.
- Arquitecturas.
- Contratos internos.
- Fichas de investigación.
- Assets audiovisuales.
- Videos.
- Imágenes.
- Exportaciones de Isabella-Engine-Video.
- Respuestas estructuradas.
- Paquetes de código.
- Manifiestos de despliegue.

En documentación viva, cada versión debe tener su propio sello:

```text
document v1 → seal A
document v2 → seal B
document v3 → seal C
```

El sello no debe sobrescribirse silenciosamente.

## Arquitectura final del skill

```text
isabella-document-seal/
├── canonicalization/
│   ├── jcs.ts
│   ├── pdf-normalizer.ts
│   ├── docx-normalizer.ts
│   └── media-normalizer.ts
├── crypto/
│   ├── digest.ts
│   ├── ed25519.ts
│   ├── mldsa.ts
│   ├── hmac.ts
│   └── encryption.ts
├── key-management/
│   ├── kms-adapter.ts
│   ├── hsm-adapter.ts
│   ├── rotation.ts
│   └── revocation.ts
├── timestamp/
│   ├── rfc3161-client.ts
│   └── tsa-verifier.ts
├── watermark/
│   ├── pdf-watermark.ts
│   ├── image-watermark.ts
│   ├── video-watermark.ts
│   └── invisible-mark.ts
├── provenance/
│   ├── manifest.ts
│   ├── c2pa.ts
│   └── source-registry.ts
├── registry/
│   ├── append-only-log.ts
│   ├── merkle-tree.ts
│   └── transparency-log.ts
├── verify/
│   ├── verifier.ts
│   ├── offline-bundle.ts
│   └── report.ts
└── cli/
    ├── seal.ts
    ├── verify.ts
    └── inspect.ts
```


## Diseño final recomendado

La solución completa para Isabella sería:

```text
Documento final
  ├── SHA-256 / SHA-3-256
  ├── Firma Ed25519
  ├── Firma ML-DSA opcional
  ├── HMAC para eventos internos
  ├── Sello RFC 3161
  ├── Manifiesto de procedencia
  ├── Marca de agua visible tipo gota
  ├── Marca imperceptible
  ├── Registro Genesis encadenado
  ├── Raíz Merkle periódica
  └── Paquete de verificación offline
```

El resultado no sería simplemente un documento con una marca de agua, sino un **documento criptográficamente sellado, temporalmente acreditado, públicamente verificable y vinculado a la procedencia de Isabella**.

La denominación final podría ser:

```text
ISABELLA GENESIS DOCUMENT SEAL
IGDS-v1
SHA-256 · Ed25519 · RFC3161
```

Y para máxima protección futura:

```text
IGDS-v2
SHA-256 · Ed25519 + ML-DSA-65 · RFC3161 · C2PA
```

La gota de agua sería la representación visual del sello; la seguridad real estaría en la firma digital, el timestamp, el manifiesto y el registro Genesis.

<span style="display:none">[^3_10][^3_11][^3_12][^3_13][^3_14][^3_15][^3_16][^3_17][^3_18][^3_19][^3_20][^3_21][^3_22][^3_23][^3_24][^3_25][^3_26][^3_27][^3_28][^3_29][^3_30][^3_31][^3_9]</span>

<div align="center">⁂</div>

[^3_1]: https://csrc.nist.gov/pubs/fips/186-5/final

[^3_2]: https://docs.comfy.org/development/api-development/workflow-api-format

[^3_3]: https://datatracker.ietf.org/doc/html/rfc2104

[^3_4]: https://csrc.nist.gov/pubs/fips/204/final

[^3_5]: https://csrc.nist.gov/projects/post-quantum-cryptography

[^3_6]: https://www.rfc-editor.org/info/rfc3161/

[^3_7]: https://c2pa.org/

[^3_8]: https://www.w3.org/TR/vc-data-integrity/

[^3_9]: https://www.nist.gov/publications/keyed-hash-message-authentication-code-hmac-0

[^3_10]: https://csrc.nist.gov/pubs/sp/800/224/ipd

[^3_11]: https://dl.acm.org/doi/10.17487/RFC3161

[^3_12]: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf

[^3_13]: https://csrc.nist.gov/Pubs/fips/186-5/IPD

[^3_14]: https://www.nist.gov/publications/keyed-hash-message-authentication-code-hmac

[^3_15]: https://www.nist.gov/publications/digital-signature-standard-dss-3

[^3_16]: https://csrc.nist.gov/pubs/fips/198-1/final

[^3_17]: https://en.wikipedia.org/wiki/Trusted_timestamping

[^3_18]: https://en.wikipedia.org/wiki/Time_stamp_protocol

[^3_19]: https://rfcinfo.com/rfc-2104/

[^3_20]: https://www.iankduncan.com/projects/rfc-browser/3161

[^3_21]: https://www.w3.org/community/reports/credentials/CG-FINAL-data-integrity-20220722/

[^3_22]: https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards

[^3_23]: https://www.paloaltonetworks.com/cyberpedia/pqc-standards

[^3_24]: https://w3c.github.io/vc-imp-guide/

[^3_25]: https://blog.cloudflare.com/another-look-at-pq-signatures/

[^3_26]: https://w3c-ccg.org/specifications/standards/

[^3_27]: https://spec.c2pa.org/specifications/specifications/2.1/specs/\_attachments/C2PA_Specification.pdf

[^3_28]: https://pr-preview.s3.amazonaws.com/w3c/vc-data-integrity/119/4632915...4abcdd3.html

[^3_29]: https://c2pa.wiki/

[^3_30]: https://lists.w3.org/Archives/Public/public-review-announce/2022Nov/0002.html

[^3_31]: https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html


---

# Diseño integrado

Para Isabella conviene tratar estos cinco componentes como un único sistema:

```text
Documento final
   ↓
Canonicalización
   ↓
SHA-256
   ↓
Firma Ed25519
   ↓
Firma ML-DSA-65 opcional
   ↓
Sello RFC 3161
   ↓
Manifiesto C2PA
   ↓
Registro Genesis Merkle
   ↓
Marca visible + soft binding
   ↓
Paquete verificable
```

La regla central es:

> La marca de agua identifica; el hash detecta cambios; la firma autentica; el timestamp acredita existencia temporal; el registro Genesis demuestra inclusión y evolución del historial.

## Integrar RFC 3161

RFC 3161 define el protocolo para solicitar a una autoridad de sellado temporal, TSA, un token que pruebe que un resumen criptográfico existía en un momento determinado.[^4_1]

La TSA no debería recibir el documento completo. Isabella debe enviar únicamente:

```text
messageImprint = SHA-256(document_or_manifest)
```


### Flujo

```text
1. Finalizar documento.
2. Canonicalizarlo.
3. Calcular SHA-256.
4. Construir solicitud TimeStampReq.
5. Enviar el digest a la TSA.
6. Recibir TimeStampResp.
7. Validar el token.
8. Guardar el token junto con el documento.
9. Incorporar el timestamp al manifiesto.
10. Firmar o cerrar el manifiesto final.
```


### Orden recomendado

Para que el timestamp cubra la evidencia correcta:

```text
contenido final
→ manifest base
→ hash del manifest base
→ RFC 3161 timestamp
→ manifest final con timestamp
→ firma final del paquete
```

No se debe recalcular el hash del objeto sellado después de añadir el timestamp sin distinguir entre:

```text
sealed_payload_digest
final_package_digest
```

El timestamp certifica el primer digest; la firma final protege el paquete completo.

### Estructura conceptual de la solicitud

```json
{
  "version": 1,
  "message_imprint": {
    "algorithm": "sha256",
    "digest": "base64url..."
  },
  "nonce": "random-128-bit-value",
  "cert_req": true
}
```


### Respuesta esperada

```json
{
  "status": "granted",
  "policy": "tsa-policy-id",
  "gen_time": "2026-09-17T20:03:11Z",
  "serial_number": "tsa-serial",
  "message_imprint": {
    "algorithm": "sha256",
    "digest": "base64url..."
  },
  "tsa_certificate_chain": ["..."],
  "encoded_timestamp_token": "base64..."
}
```


### Validaciones obligatorias

Isabella debe verificar:

- Que el estado sea `granted`.
- Que el algoritmo sea permitido.
- Que el digest coincida exactamente.
- Que la firma de la TSA sea válida.
- Que el certificado de la TSA sea confiable.
- Que el certificado fuera válido en `genTime`.
- Que la política de timestamp sea aceptada.
- Que el nonce coincida.
- Que no exista una respuesta truncada o modificada.
- Que el token quede almacenado junto al manifest.


### Pseudocódigo

```ts
async function timestampDocument(document: Buffer) {
  const digest = sha256(document);

  const request = buildTimeStampRequest({
    hashAlgorithm: "sha256",
    messageImprint: digest,
    nonce: randomBytes(16),
    certReq: true,
  });

  const response = await tsaClient.send(request);

  verifyTimestampResponse(response, {
    expectedDigest: digest,
    trustedTsaCertificates,
  });

  return {
    digest,
    token: response.timeStampToken,
    generationTime: response.genTime,
  };
}
```


### Alta disponibilidad

No dependería de una única TSA:

```text
TSA primaria
TSA secundaria
TSA de respaldo offline o institucional
```

El manifest debe registrar:

```json
{
  "timestamp": {
    "protocol": "RFC3161",
    "tsa_id": "tsa-primary",
    "policy": "1.2.3.4",
    "generation_time": "2026-09-17T20:03:11Z",
    "token_sha256": "..."
  }
}
```


## Ed25519 frente a ML-DSA-65

Ed25519 es una instancia de EdDSA definida en RFC 8032. ML-DSA-65 es un esquema de firma poscuántica estandarizado por NIST en FIPS 204 y pertenece a la categoría de seguridad 3 de ML-DSA.[^4_2][^4_3]


| Característica | Ed25519 | ML-DSA-65 |
| :-- | --: | --: |
| Tipo | Firma basada en curva Edwards | Firma basada en retículas |
| Seguridad cuántica | No diseñada para resistir un criptanálisis cuántico a gran escala | Diseñada como firma poscuántica |
| Clave pública | 32 bytes aproximadamente | 1.952 bytes |
| Firma | 64 bytes | 3.293 bytes |
| Rendimiento | Muy rápido y eficiente | Más pesado |
| Implementación | Muy madura y ampliamente disponible | Más nueva y con más complejidad operativa |
| Interoperabilidad | Excelente | En crecimiento |
| Uso ideal | APIs, manifiestos, documentos normales | Conservación a largo plazo y protección poscuántica |
| Coste de almacenamiento | Bajo | Alto |
| Riesgo principal | Vulnerabilidad futura ante computadores cuánticos suficientemente grandes | Implementación, tamaño y ecosistema menos maduro |

### Ed25519

Ventajas:

- Firmas compactas.
- Excelente rendimiento.
- API sencilla.
- No requiere gestionar parámetros complejos.
- Adecuada para claves rotatorias y documentos frecuentes.
- Amplio soporte en librerías modernas.

Desventajas:

- No es poscuántica.
- Una futura capacidad cuántica relevante comprometería la seguridad de la clave pública.
- No debe presentarse como protección de conservación centenaria.


### ML-DSA-65

Ventajas:

- Diseñada para resistir ataques cuánticos conocidos.
- Estandarizada por NIST.
- Adecuada para archivos con conservación a largo plazo.
- Compatible con una estrategia de transición poscuántica.

Desventajas:

- Firmas y claves mucho más grandes.
- Mayor coste de almacenamiento.
- Más sensible a errores de integración.
- Menor compatibilidad con verificadores antiguos.
- Necesita revisar cuidadosamente límites de certificados, headers y bases de datos.


### Recomendación para Isabella

No escogería uno excluyendo al otro. Usaría una firma híbrida:

```text
firma_clásica = Ed25519(document_digest)
firma_pq       = ML-DSA-65(document_digest)
```

El documento pasa si:

```text
Ed25519 válida
AND
ML-DSA-65 válida
```

Durante una fase de migración puede aplicarse:

```text
Ed25519 válida
OR
ML-DSA-65 válida
```

pero solo como política temporal y claramente registrada.

Perfil recomendado:

```json
{
  "signature_profile": "hybrid-v1",
  "primary": "Ed25519",
  "post_quantum": "ML-DSA-65",
  "verification_policy": "both-required",
  "key_ids": {
    "classical": "isabella-ed25519-2026-01",
    "post_quantum": "isabella-mldsa65-2026-01"
  }
}
```


## Manifiesto estilo C2PA

C2PA organiza la procedencia mediante assertions, claim, firma del claim y vínculos con el contenido. La especificación describe el manifest como una estructura firmada y resistente a manipulaciones que contiene afirmaciones sobre un activo, la información de enlace y la firma del claim.[^4_4]

La guía de implementación de C2PA recomienda adjuntar timestamps y datos de frescura de credenciales durante la firma.[^4_5]

### Estructura lógica

```text
Manifest Store
├── Active Manifest
│   ├── Manifest Label
│   ├── Claim
│   │   ├── Claim Generator
│   │   ├── Assertions References
│   │   ├── Content Bindings
│   │   └── Signature
│   ├── Assertions
│   │   ├── Creative Work
│   │   ├── Software Agent
│   │   ├── Actions
│   │   ├── AI Generation
│   │   ├── Sources
│   │   └── Soft Binding
│   └── Timestamp
└── Previous Manifests
```


### Ejemplo adaptado

```json
{
  "manifest_id": "urn:isabella:manifest:doc-001:v3",
  "format": "c2pa",
  "claim": {
    "claim_generator": "Isabella Document Seal/1.0.0",
    "instance_id": "urn:uuid:...",
    "created": "2026-09-17T20:03:11Z",
    "assertion_references": [
      "org.isabella.document",
      "org.isabella.generation",
      "org.isabella.actions",
      "org.isabella.sources",
      "org.isabella.soft_binding"
    ],
    "content_binding": {
      "algorithm": "sha256",
      "asset_hash": "..."
    }
  },
  "assertions": [
    {
      "label": "org.isabella.document",
      "data": {
        "title": "Documento sellado",
        "mime_type": "application/pdf",
        "language": "es-MX",
        "page_count": 24
      }
    },
    {
      "label": "org.isabella.generation",
      "data": {
        "system": "Isabella",
        "skill": "document-seal",
        "model_family": "registered-model",
        "synthetic_content": true,
        "human_review": true
      }
    },
    {
      "label": "org.isabella.actions",
      "data": [
        {
          "action": "created",
          "when": "2026-09-17T20:00:00Z"
        },
        {
          "action": "sealed",
          "when": "2026-09-17T20:03:11Z"
        }
      ]
    },
    {
      "label": "org.isabella.sources",
      "data": [
        {
          "id": "source-001",
          "type": "web",
          "locator": "...",
          "retrieved_at": "2026-09-17T19:59:00Z",
          "digest": "..."
        }
      ]
    },
    {
      "label": "org.isabella.soft_binding",
      "data": {
        "algorithm": "c2pa-soft-binding",
        "identifier": "7Q4M2W9K8H3P",
        "watermark_version": "1"
      }
    }
  ],
  "signature": {
    "algorithm": "Ed25519",
    "key_id": "isabella-ed25519-2026-01",
    "value": "..."
  },
  "timestamp": {
    "protocol": "RFC3161",
    "token": "..."
  }
}
```

En una implementación C2PA real, el contenedor y la serialización deben seguir el formato especificado por la versión adoptada, normalmente con estructuras CBOR y firmas COSE. El JSON anterior representa el modelo conceptual y el formato de API de Isabella, no debe confundirse con un manifest C2PA listo para interoperabilidad.

### Acciones que Isabella debe registrar

```text
created
generated
edited
translated
upscaled
inpainted
dubbed
captioned
rendered
reviewed
approved
published
```


### Contenido generado por IA

El manifest debe indicar explícitamente:

```json
{
  "ai_generated": true,
  "ai_assisted": true,
  "human_modified": true,
  "human_reviewed": true
}
```

No debe afirmar “creado por Isabella” si hubo una fuente humana, un modelo externo o una edición manual significativa. El manifest debe describir el proceso, no crear una identidad ficticia.

## Registro Genesis sin blockchain

Un registro Genesis verificable puede construirse con:

```text
append-only log
+ hashes encadenados
+ árbol Merkle
+ firmas de checkpoints
+ timestamps externos
+ réplicas de solo lectura
```

No necesitas blockchain para obtener evidencia de integridad y de no alteración si los checkpoints se publican en dominios o sistemas que no controla una sola instancia de Isabella.

### Registro por entradas

```json
{
  "sequence": 1042,
  "entry_id": "seal-doc-001",
  "document_id": "doc-001",
  "document_digest": "sha256:...",
  "manifest_digest": "sha256:...",
  "previous_entry_hash": "sha256:...",
  "created_at": "2026-09-17T20:03:11Z",
  "entry_hash": "sha256:..."
}
```


### Hash de entrada

```text
entry_hash =
SHA256(
  canonical_json({
    sequence,
    document_id,
    document_digest,
    manifest_digest,
    previous_entry_hash,
    created_at
  })
)
```


### Árbol Merkle

Cada lote diario o por número de entradas forma un árbol:

```text
H(doc1) H(doc2) H(doc3) H(doc4)
    \      /       \      /
     H12           H34
          \       /
          Merkle Root
```

El servidor publica:

```json
{
  "tree_size": 1048,
  "root_hash": "sha256:...",
  "first_sequence": 1001,
  "last_sequence": 1048,
  "generated_at": "2026-09-17T23:59:59Z",
  "signature": "Ed25519 signature",
  "timestamp_token": "RFC3161 token"
}
```


### Prueba de inclusión

Para verificar que un documento fue registrado:

```text
document hash
+ sibling hash 1
+ sibling hash 2
+ sibling hash 3
→ recalcular root
→ comparar con checkpoint firmado
```


### Prueba de consistencia

Para demostrar que el registro nuevo realmente extiende al anterior:

```text
root anterior
+ root actual
+ audit path
→ prueba de que el árbol solo creció
```

Esta propiedad es más importante que un simple hash encadenado. Un servidor malicioso podría reconstruir una cadena alternativa si no existen checkpoints publicados externamente.

### Checkpoints externos

Publicaría diariamente la raíz Merkle en:

- Una TSA RFC 3161.
- Un repositorio Git firmado.
- Un bucket de almacenamiento con retención WORM.
- Un servidor independiente.
- Un dominio de publicación de Isabella.
- Un repositorio institucional, si existe.

Ejemplo:

```text
https://verify.isabella.example/checkpoints/2026-09-17.json
```

La finalidad no es ocultar el contenido, sino impedir que Isabella pueda reescribir silenciosamente el historial.

### Limitación importante

Sin blockchain, el registro no es mágicamente confiable. Su seguridad depende de:

- Custodia de claves.
- Publicación externa.
- Réplicas.
- Auditorías.
- Políticas de retención.
- Verificabilidad de checkpoints.
- Protección contra rollback.
- Separación entre el sistema que escribe y el que publica.

El diseño correcto sería:

```text
Isabella Writer
      ↓
Append-only Registry
      ↓
Merkle Checkpoint Service
      ↓
External Timestamp + Read-only Replicas
```


## Marcas de agua visuales

La marca visible debe servir para identificar el documento en una revisión humana.

### Diseño recomendado

```text
┌────────────────────────────────┐
│              ◇                 │
│      ISABELLA SEALED           │
│ SHA256 · ED25519 · RFC3161     │
│ ID: 7Q4M2W9K8H3P               │
└────────────────────────────────┘
```

Características:

- Baja opacidad, pero legible.
- Contraste suficiente.
- Posición estable.
- No debe ocultar contenido.
- Debe aparecer en portada y opcionalmente en todas las páginas.
- Debe incluir ID corto, no el digest completo.
- Debe indicar “AI-generated” o “AI-assisted” cuando corresponda.
- Debe distinguirse de un sello notarial o gubernamental.


### PDF

El PDF puede incluir:

- Texto visible en footer.
- Imagen SVG de la gota.
- XMP metadata.
- Manifest embebido.
- Archivo de firma.
- Campo de firma digital PDF, si se busca interoperabilidad con lectores PDF.


### Video

Para video:

- Overlay semitransparente en momentos seleccionados.
- Marca de agua temporal en créditos o esquinas.
- Manifest C2PA.
- Watermark imperceptible en frames.
- ID visible en la descripción o metadata.

No se debe introducir una marca permanente en cada frame si degrada el contenido o si el documento está destinado a distribución profesional.

## Marcas imperceptibles y soft bindings

C2PA contempla soft bindings para recuperar un manifest cuando la metadata embebida ha sido eliminada. Entre esos mecanismos se encuentran fingerprints e identificadores de watermark imperceptibles. La especificación de soft binding contempla precisamente la recuperación del manifest desde un repositorio mediante una huella o marca, incluso cuando el vínculo directo ya no está presente.[^4_6][^4_7]

### No confundir funciones

```text
Hard binding:
  hash y manifest embebido en el archivo

Soft binding:
  watermark/fingerprint que ayuda a localizar el manifest

Firma:
  prueba criptográfica de autenticidad

Watermark:
  mecanismo de recuperación o identificación
```

Una marca imperceptible no debe considerarse firma. Puede ser removida, degradada o falsificada si no está respaldada por el manifest y la firma.

### Payload recomendado

```json
{
  "version": 1,
  "manifest_locator": "7Q4M2W9K8H3P",
  "asset_digest_prefix": "a91e0c47",
  "key_id_prefix": "ed25-2026",
  "error_correction": "reed-solomon",
  "watermark_profile": "isabella-softbinding-v1"
}
```

No incluiría el digest completo en cada bloque de watermark. Es preferible incluir un identificador corto y un código de corrección de errores.

### Para imágenes

Pipeline:

```text
imagen RGB
→ transformación DCT o wavelet
→ selección de coeficientes medios
→ modulación del payload
→ corrección de errores
→ reconstrucción
```

No conviene modificar excesivamente los coeficientes de baja frecuencia porque la marca sería visible. Tampoco conviene depender solo de frecuencias muy altas porque la compresión JPEG las destruye.

### Para video

```text
frames seleccionados
→ payload distribuido temporalmente
→ embedding redundante
→ sincronización con shot boundaries
→ detector de manipulación
```

No debe codificarse únicamente en un frame, porque un recorte o transcodificación lo eliminaría. Debe repartirse con redundancia en varios frames, pero evitando escenas donde el ruido de movimiento reduzca la detección.

### Para audio

Puede emplearse una marca acústica, pero con cuidado:

- No debe afectar la audición.
- Debe resistir compresión razonable.
- Debe declarar el nivel de tolerancia.
- Debe evitarse para documentos donde la fidelidad auditiva sea prioritaria.
- Debe mantenerse separada de la firma digital.


### Detector de watermark

```ts
type WatermarkDetection = {
  detected: boolean;
  confidence: number;
  recoveredManifestId?: string;
  recoveredDigestPrefix?: string;
  corruptionRate: number;
  transformationsDetected: string[];
};
```


## Política de verificación

```text
1. Leer manifest embebido.
2. Si falta, buscar soft binding.
3. Recuperar manifest del registry.
4. Calcular digest del asset.
5. Validar content binding.
6. Verificar firma Ed25519.
7. Verificar ML-DSA-65 si existe.
8. Verificar RFC 3161.
9. Verificar inclusión en Genesis Merkle.
10. Comprobar estado de la clave.
11. Emitir resultado y advertencias.
```


### Estados

```text
VALID
VALID_WITH_WARNINGS
MANIFEST_RECOVERED_BY_SOFT_BINDING
SIGNATURE_INVALID
CONTENT_MODIFIED
TIMESTAMP_INVALID
KEY_REVOKED
REGISTRY_PROOF_MISSING
WATERMARK_UNDETECTED
```


## Perfil final recomendado para Isabella

### Documentos normales

```json
{
  "hash": "SHA-256",
  "signature": "Ed25519",
  "timestamp": "RFC3161",
  "manifest": "C2PA-compatible",
  "registry": "Genesis Merkle",
  "watermark": "visible + soft binding"
}
```


### Documentos de larga conservación

```json
{
  "hashes": ["SHA-256", "SHA3-256"],
  "signatures": ["Ed25519", "ML-DSA-65"],
  "timestamp": "RFC3161",
  "manifest": "C2PA-compatible",
  "registry": "Genesis Merkle + external checkpoints",
  "watermark": "visible + invisible redundant"
}
```


### Documentos confidenciales

```json
{
  "encryption": "AES-256-GCM",
  "signature": "Ed25519 + ML-DSA-65",
  "key_storage": "KMS/HSM",
  "access": "RBAC + ABAC",
  "watermark": "recipient-specific visible identifier",
  "registry": "metadata-only"
}
```


## Arquitectura recomendada

```text
┌─────────────────────────────────────────┐
│ Isabella Document Seal API              │
├─────────────────────────────────────────┤
│ Canonicalization                        │
│ SHA-256 / SHA3-256                      │
│ Ed25519 Signer                          │
│ ML-DSA-65 Signer                        │
│ RFC3161 TSA Client                      │
│ C2PA Manifest Builder                   │
│ Watermark / Soft Binding Engine         │
│ Genesis Registry Writer                 │
│ Merkle Checkpoint Service               │
│ Offline Verification CLI                │
└───────────────┬─────────────────────────┘
                │
       ┌────────▼────────┐
       │ KMS / HSM        │
       │ Key rotation     │
       │ Revocation       │
       └─────────────────┘
```

El resultado ideal sería un sello de esta forma:

```text
ISABELLA-GENESIS-SEAL
SHA-256 · ED25519+ML-DSA-65 · RFC3161
REGISTRY: GENESIS-MERKLE
ID: 7Q4M2W9K8H3P
```

La arquitectura debe mantener una separación estricta:

```text
Ed25519 / ML-DSA-65 = autenticidad criptográfica
RFC 3161             = existencia temporal
C2PA                 = procedencia y acciones
Genesis Merkle       = historial de registro
Marca visible        = identificación humana
Soft binding         = recuperación de manifest
Cifrado              = confidencialidad
```

Esa separación evita promesas incorrectas y permite que Isabella produzca documentos que no solo parezcan oficiales, sino que puedan ser verificados de forma independiente, reproducible y auditable.

<span style="display:none">[^4_10][^4_11][^4_12][^4_13][^4_14][^4_15][^4_16][^4_17][^4_18][^4_19][^4_20][^4_21][^4_22][^4_23][^4_24][^4_25][^4_26][^4_27][^4_28][^4_29][^4_30][^4_8][^4_9]</span>

<div align="center">⁂</div>

[^4_1]: https://datatracker.ietf.org/doc/html/rfc3161

[^4_2]: https://www.rfc-editor.org/info/rfc8032/

[^4_3]: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf

[^4_4]: https://spec.c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html

[^4_5]: https://spec.c2pa.org/specifications/specifications/1.0/guidance/Guidance.html

[^4_6]: https://developer.adobe.com/cai-soft-binding-api/

[^4_7]: https://spec.c2pa.org/specifications/specifications/2.4/softbinding/Decoupled.html

[^4_8]: https://www.ietf.org/archive/id/draft-josefsson-ssh-ed25519mldsa65-00.html

[^4_9]: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=958463

[^4_10]: https://www.nist.gov/publications/module-lattice-based-digital-signature-standard

[^4_11]: https://www.rfc-editor.org/rfc/pdfrfc/rfc3161.txt.pdf

[^4_12]: https://opensource.contentauthenticity.org/docs/manifest/writing/assertions-actions/

[^4_13]: https://c2paviewer.com/articles/what-is-c2pa-manifest

[^4_14]: https://www.hjp.at/doc/rfc/rfc3161.html

[^4_15]: https://www.ai-governance-standard.com/articles/post-quantum-signatures-for-ai-ml-dsa-and-lms-pi5m9j

[^4_16]: https://c2pa.wiki/specifications/

[^4_17]: https://www.rfc-editor.org/info/rfc8080/

[^4_18]: https://www.rfc-editor.org/info/rfc8709/

[^4_19]: https://datatracker.ietf.org/doc/html/rfc8420

[^4_20]: https://developer.adobe.com/cai-soft-binding-api/api/

[^4_21]: https://github.com/hashmewithsomesalt/merkle-transparency-log

[^4_22]: https://github.com/c2pa-org/softbinding-algorithm-list

[^4_23]: https://github.com/TrustBeat/merklon

[^4_24]: https://informedclearly.com/en/technology/39572/watermarking-c2pa-publishers-standard-2026

[^4_25]: https://sealtask.com/learn/key-transparency-merkle-trees/

[^4_26]: https://letsseal.org/site/blog/transparency-log

[^4_27]: https://heartit.tech/p2p-from-scratch-part-3-append-only-truth/

[^4_28]: https://www.rfc-editor.org/info/rfc3161/

[^4_29]: https://csrc.nist.gov/pubs/fips/204/final

[^4_30]: https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html


---

# Política de confianza

Para Isabella, la verificación debe distinguir entre cuatro estados diferentes:

```text
válido criptográficamente
válido en el momento de creación
confiable según la política actual
registrado en Genesis
```

Un documento puede tener una firma matemáticamente correcta, pero utilizar una clave revocada, un timestamp no verificable o un certificado que no pertenecía a una autoridad confiable. Por eso la verificación debe producir un informe detallado y no solo `true` o `false`.

## Revocación en Genesis

### Qué se revoca

Isabella debe poder revocar de forma independiente:

- Claves de firma Ed25519.
- Claves ML-DSA-65.
- Certificados X.509.
- Certificados de la TSA.
- Manifiestos.
- Documentos completos.
- Entradas del registro.
- Perfiles de watermark.
- Fuentes de confianza.

No se debe “borrar” un registro Genesis. La revocación debe ser una nueva entrada firmada que apunte a la entrada original.

### Registro de revocación

```json
{
  "type": "revocation",
  "revocation_id": "rev-2026-0041",
  "target_type": "signing_key",
  "target_id": "isabella-ed25519-2026-01",
  "effective_at": "2026-09-17T21:15:00Z",
  "reason": "key_compromise",
  "scope": "all_signatures_after_effective_at",
  "issued_by": "isabella-genesis-authority",
  "previous_entry_hash": "sha256:...",
  "signature": {
    "algorithm": "Ed25519",
    "key_id": "isabella-genesis-root-2026",
    "value": "..."
  }
}
```


### Razones normalizadas

```text
key_compromise
key_loss
unauthorized_use
operator_request
algorithm_deprecation
certificate_misissuance
tsa_compromise
document_withdrawn
policy_violation
```


### Regla temporal

La pregunta correcta no es:

> ¿La clave está revocada hoy?

sino:

> ¿La clave estaba válida cuando se firmó el documento y existe evidencia confiable de esa situación?

Para ello Isabella debe guardar:

```text
notBefore / notAfter
revocation_effective_at
signature_time
timestamp_gen_time
CRL o respuesta OCSP histórica
checkpoint Genesis
```

RFC 5280 define los perfiles X.509 y CRL utilizados para representar certificados y listas de revocación.[^5_1]

### Estado de un documento

```ts
type TrustStatus =
  | "valid"
  | "valid_at_signing_time"
  | "revoked_before_signing"
  | "revoked_after_signing"
  | "unknown_revocation_status"
  | "invalid_signature"
  | "timestamp_untrusted";
```

Un resultado adecuado sería:

```json
{
  "document_status": "valid_at_signing_time",
  "current_key_status": "revoked_after_signing",
  "signature_time": "2026-09-17T20:03:11Z",
  "revocation_time": "2026-10-01T10:00:00Z",
  "interpretation": "La firma era válida cuando fue creada, pero la clave ya no puede utilizarse para nuevas firmas."
}
```


### Firmas posteriores a la revocación

La política debe impedir que una clave revocada firme nuevos documentos:

```text
clave revocada
→ no nuevas firmas
→ sí verificación histórica si la firma precede a la revocación
```

Excepciones:

- Compromiso de clave no acotado temporalmente.
- Error en la emisión del certificado.
- Revocación retroactiva explícita.
- Imposibilidad de demostrar que la firma existía antes de la revocación.


## Validación RFC 3161 y firmas poscuánticas

RFC 3161 certifica que un digest existía en una fecha, pero no sustituye la firma digital del documento. ML-DSA-65 autentica el digest mediante una clave privada poscuántica, pero no demuestra cuándo se generó la firma. Por tanto:

```text
Firma digital = quién firmó
RFC 3161        = cuándo existía el digest
Genesis         = cuándo y dónde se registró
```


### Flujo de validación cruzada

```text
1. Leer el documento.
2. Canonicalizarlo según el perfil registrado.
3. Calcular SHA-256.
4. Comparar con el messageImprint de RFC 3161.
5. Validar la firma de la TSA.
6. Validar el certificado de la TSA.
7. Extraer el digest firmado.
8. Validar Ed25519.
9. Validar ML-DSA-65.
10. Comparar ambos contra el mismo digest.
11. Consultar revocaciones históricas.
12. Validar inclusión en Genesis.
13. Validar la marca de agua como evidencia auxiliar.
```


### Modelo de evidencia

```json
{
  "content_digest": {
    "algorithm": "sha256",
    "value": "..."
  },
  "signatures": [
    {
      "algorithm": "Ed25519",
      "key_id": "isabella-ed25519-2026-01",
      "valid": true,
      "signed_digest_matches": true
    },
    {
      "algorithm": "ML-DSA-65",
      "key_id": "isabella-mldsa65-2026-01",
      "valid": true,
      "signed_digest_matches": true
    }
  ],
  "timestamp": {
    "protocol": "RFC3161",
    "message_imprint_matches": true,
    "tsa_signature_valid": true,
    "generation_time": "2026-09-17T20:03:11Z",
    "tsa_certificate_status": "valid_at_timestamp"
  },
  "genesis": {
    "included": true,
    "inclusion_proof_valid": true,
    "checkpoint_signature_valid": true
  }
}
```


### Política híbrida

Para documentos de alta importancia:

```text
Ed25519 válida
AND ML-DSA-65 válida
AND RFC 3161 válido
AND Genesis inclusion proof válido
```

Para documentos normales durante la migración:

```text
Ed25519 válida
AND RFC 3161 válido
AND ML-DSA-65 válida o ausente según política de fecha
```


### Problema de validación futura

Un verificador de 2045 puede no disponer de las mismas librerías o certificados. Por eso el paquete de conservación debe incluir:

```text
manifest
firma Ed25519
firma ML-DSA-65
claves públicas
cadena de certificados
token RFC 3161
CRL/OCSP archivados
prueba Merkle
checkpoint firmado
versión del algoritmo
versión del canonicalizador
```

No basta con guardar el documento y una firma.

## Respaldo del árbol Merkle

El árbol Genesis debe tener tres propiedades:

```text
append-only
auditable
replicable
```

Los árboles de transparencia basados en Merkle pueden demostrar que una versión posterior contiene todas las hojas de una versión anterior mediante pruebas de consistencia.[^5_2]

### Arquitectura de respaldo

```text
Primary Registry
      │
      ├── Replica A: read-only object storage
      ├── Replica B: independent provider
      ├── Replica C: offline WORM archive
      ├── Daily checkpoint repository
      └── External timestamp authority
```


### Capas

#### Registro caliente

Base de datos usada para consultas rápidas:

```text
PostgreSQL
```

Contiene:

- Índices.
- Estado actual.
- Metadatos.
- Referencias a blobs.
- Pruebas de inclusión.


#### Registro de objetos

Bucket con retención inmutable:

```text
checkpoints/YYYY/MM/DD/root.json
proofs/<document-id>/<tree-size>.json
manifests/<document-id>/<version>.json
```


#### Checkpoint firmado

```json
{
  "tree_algorithm": "isabella-merkle-v1",
  "hash_algorithm": "sha256",
  "tree_size": 1048,
  "root_hash": "sha256:...",
  "previous_checkpoint_hash": "sha256:...",
  "generated_at": "2026-09-17T23:59:59Z",
  "genesis_key_id": "isabella-genesis-root-2026",
  "signature": "..."
}
```


#### Respaldo offline

Cada día debe exportarse:

```text
checkpoint.json
checkpoint.sig
tree-head.json
registry-index.car
manifest-bundle.tar.zst
```

El backup debe cifrarse y conservarse con:

- Retención WORM.
- Versionado.
- Prueba de restauración.
- Huella publicada en un sistema independiente.
- Claves separadas del almacenamiento.


### Quorum de publicación

Para evitar que un único servidor reescriba la historia:

```text
checkpoint aceptado si:
  2 de 3 réplicas coinciden
  + firma de Genesis válida
  + timestamp externo válido
```

Para proyectos institucionales:

```text
3 de 5 custodios independientes
```

No utilizaría un simple “último root hash” almacenado en la misma base de datos que el registro. Si el atacante controla ambos, puede reescribir toda la evidencia.

## Impacto del soft binding en C2PA

El soft binding es un vínculo de recuperación. Es útil cuando el manifest embebido se elimina durante:

- Compresión.
- Redimensionado.
- Captura de pantalla.
- Conversión de formato.
- Publicación en una plataforma que elimina metadata.
- Edición con una herramienta que no preserva C2PA.

La especificación C2PA describe mecanismos para recuperar un manifest cuando la metadata ya no está presente. También existen APIs de soft binding para localizar un manifest mediante fingerprints o watermarks.[^5_3][^5_4]

### Diferencia de confianza

```text
Hard binding encontrado:
  el archivo contiene el manifest y la firma

Soft binding encontrado:
  el archivo permite localizar un manifest externo

Sin binding:
  no hay vínculo demostrable con el manifest
```


### Niveles de verificación

| Nivel | Evidencia | Resultado |
| :-- | :-- | :-- |
| A | Manifest embebido + firma + digest coincide | Verificación fuerte |
| B | Manifest externo recuperado por soft binding + digest/fingerprint coincide | Verificación recuperada |
| C | Solo watermark visible | Identificación visual, no autenticidad |
| D | Solo ID declarado en metadata editable | No confiable |
| E | No existe vínculo | Procedencia no verificable |

### Riesgo del soft binding

Un atacante podría:

- Copiar una marca de agua de un documento legítimo.
- Crear una falsa página de resolución.
- Provocar colisiones de identificadores.
- Alterar parcialmente el contenido sin destruir la marca.
- Reutilizar el manifest de una versión anterior.

Por eso el soft binding debe utilizar:

```text
ID aleatorio de alta entropía
+ fingerprint del asset
+ digest parcial
+ manifest firmado
+ dominio de resolución HTTPS
+ prueba de inclusión Genesis
```


### Nunca aceptar solo el watermark

```text
watermark detectado
≠
documento auténtico
```

La marca solo debe iniciar el proceso de recuperación. La autenticidad se establece después de:

```text
manifest recuperado
→ firma válida
→ digest o fingerprint compatible
→ timestamp válido
→ Genesis inclusion proof válida
```


### Tratamiento de modificaciones legítimas

Si el archivo cambió después de ser sellado, Isabella debe buscar una cadena de manifests:

```text
manifest v1
   ↓ edited
manifest v2
   ↓ translated
manifest v3
   ↓ published
manifest v4
```

El soft binding puede llevar al manifest más reciente, pero este debe declarar la relación con la versión anterior.

## Caídas de la TSA

La TSA es una dependencia externa. Su caída no debe detener toda la producción, pero tampoco debe hacer que Isabella afirme que un documento tiene timestamp cuando no lo tiene.

### Máquina de estados del sellado

```text
UNSEALED
→ DIGESTED
→ SIGNED
→ TSA_PENDING
→ TSA_VERIFIED
→ REGISTERED
→ WATERMARKED
→ DELIVERABLE
```

Estados de error:

```text
TSA_TIMEOUT
TSA_UNAVAILABLE
TSA_BAD_RESPONSE
TSA_DIGEST_MISMATCH
TSA_CERTIFICATE_INVALID
TSA_POLICY_REJECTED
```


### Comportamiento correcto

Si falla la TSA:

```text
1. Conservar el digest.
2. Conservar la firma digital.
3. Registrar el documento como TSA_PENDING.
4. No mostrarlo como “sellado temporalmente”.
5. Reintentar de forma idempotente.
6. Usar una TSA secundaria.
7. Completar el timestamp cuando vuelva el servicio.
8. Añadir el token al paquete final.
```


### No regenerar la identidad documental

El retry debe reutilizar:

```text
document_id
manifest_id
content_digest
signature
nonce o solicitud registrada
```

No se debe crear otro documento cada vez que una TSA falla.

### Política de reintentos

```text
Intento 1: inmediato
Intento 2: 5 segundos
Intento 3: 30 segundos
Intento 4: 2 minutos
Intento 5: 10 minutos
```

Con:

- Exponential backoff.
- Jitter.
- Timeout por llamada.
- Límite global.
- Circuit breaker.
- Métricas de disponibilidad.
- Cambio a TSA secundaria.

Los reintentos deben implementarse en una sola capa para evitar tormentas de solicitudes; el presupuesto total de reintento debe estar limitado al timeout de la operación superior.[^5_5]

### Circuit breaker

```text
CLOSED
  ├── TSA responde correctamente
  └── se mantiene normal

OPEN
  ├── demasiados timeouts
  └── se deja de llamar temporalmente

HALF_OPEN
  ├── se prueba una solicitud
  ├── éxito → CLOSED
  └── fallo → OPEN
```


### Política de TSA múltiple

```ts
type TimestampPolicy = {
  primary: TsaEndpoint;
  secondary: TsaEndpoint;
  maxAttempts: number;
  failOpen: boolean;
  allowDeferredTimestamp: boolean;
  requireTwoIndependentTsas: boolean;
};
```

Para documentos de alta importancia:

```text
TSA primaria válida
AND
TSA secundaria válida
```

No hace falta que ambas firmen exactamente el mismo documento con el mismo protocolo de forma simultánea, pero sí que certifiquen el mismo `messageImprint`.

### ¿Fail open o fail closed?

#### Para documentos internos

```text
fail-open operativo:
  permitir producción
  estado TSA_PENDING
```


#### Para documentos públicos o legales

```text
fail-closed de publicación:
  no marcar como final
  no emitir “sellado temporalmente”
```


#### Para archivos críticos

```text
generar firma local
+ registrar en Genesis
+ esperar TSA
+ publicar solo al completar TSA
```


### Respuesta cuando la TSA está caída

```json
{
  "status": "signed_timestamp_pending",
  "document_id": "doc-001",
  "signature_status": "valid",
  "timestamp_status": "pending",
  "registry_status": "registered",
  "publication_status": "blocked",
  "retry_after_seconds": 300,
  "fallback_used": false
}
```

Una vez restaurada:

```json
{
  "status": "sealed",
  "signature_status": "valid",
  "timestamp_status": "verified",
  "registry_status": "registered",
  "publication_status": "allowed"
}
```


## Reconciliación posterior

Cuando la TSA vuelve, un reconciler debe buscar todos los registros:

```sql
SELECT *
FROM sealed_documents
WHERE timestamp_status = 'pending'
  AND next_retry_at <= NOW();
```

Después:

```text
obtener digest almacenado
→ solicitar timestamp
→ validar imprint
→ actualizar manifest
→ firmar la actualización
→ añadir entrada Genesis
→ publicar checkpoint posterior
```

La actualización no debe modificar silenciosamente la entrada anterior. Debe crear una nueva versión:

```text
entry 1042: firma creada
entry 1078: timestamp RFC 3161 añadido
```


## Esquema operativo completo

```text
┌──────────────┐
│ Documento    │
└──────┬───────┘
       ▼
┌──────────────┐
│ SHA-256      │
└──────┬───────┘
       ▼
┌──────────────┐
│ Ed25519      │
│ ML-DSA-65    │
└──────┬───────┘
       ▼
┌──────────────┐       ┌──────────────┐
│ Genesis Log  │◄──────│ Merkle Root  │
└──────┬───────┘       └──────┬───────┘
       │                      ▼
       │             ┌────────────────┐
       │             │ External TSA   │
       │             └────────────────┘
       ▼
┌──────────────┐
│ C2PA Manifest│
└──────┬───────┘
       ▼
┌──────────────┐
│ Watermarks   │
└──────┬───────┘
       ▼
┌──────────────┐
│ Verification │
└──────────────┘
```


## Política final de Isabella

### Documento válido

```text
digest coincide
+ Ed25519 válida
+ ML-DSA-65 válida si el perfil la exige
+ timestamp válido
+ certificado válido al momento de firma
+ Genesis proof válida
```


### Documento válido históricamente

```text
firma válida
+ timestamp válido
+ clave revocada después de la firma
+ evidencia histórica de revocación
```


### Documento no publicable

```text
firma válida
+ TSA pendiente
+ sin evidencia temporal externa
```


### Documento recuperado

```text
manifest ausente
+ soft binding detectado
+ manifest externo válido
+ fingerprint compatible
+ firma y Genesis válidos
```


### Documento alterado

```text
soft binding presente
pero digest actual incompatible
```

Resultado:

```text
CONTENT_MODIFIED
```

No debe aceptarse como auténtico aunque la marca de agua siga visible.

La arquitectura más resistente para Isabella sería, por tanto:

```text
firmas híbridas Ed25519 + ML-DSA-65
+ RFC 3161 con TSA redundantes
+ CRL/OCSP archivados
+ Genesis append-only
+ checkpoints Merkle externos
+ C2PA hard binding
+ soft binding como recuperación
+ política explícita de estados TSA_PENDING
```

Así se evita el error común de confundir una firma correcta con una prueba completa de tiempo, procedencia y continuidad histórica.

<span style="display:none">[^5_10][^5_11][^5_12][^5_13][^5_14][^5_15][^5_16][^5_17][^5_18][^5_19][^5_20][^5_21][^5_22][^5_23][^5_24][^5_25][^5_26][^5_27][^5_28][^5_29][^5_30][^5_6][^5_7][^5_8][^5_9]</span>

<div align="center">⁂</div>

[^5_1]: https://www.rfc-editor.org/info/rfc5280/

[^5_2]: https://www.rfc-editor.org/rfc/rfc6962.html

[^5_3]: https://spec.c2pa.org/specifications/specifications/2.4/softbinding/Decoupled.html

[^5_4]: https://developer.adobe.com/cai-soft-binding-api/

[^5_5]: https://pandorian.ai/standard/retry-timeout-circuit-breaker-discipline/

[^5_6]: https://www.rfc-editor.org/errata_search.php?rfc=3161

[^5_7]: https://dl.acm.org/doi/abs/10.17487/RFC5280?download=true

[^5_8]: https://github.com/c2pa-org/specifications

[^5_9]: https://archive.org/details/rfc5280

[^5_10]: https://github.com/c2pa-org/specifications/blob/main/build/site/specifications/2.1/softbinding/Decoupled.html

[^5_11]: https://zatona.dev/blog/rfc-3161-vs-opentimestamps

[^5_12]: https://rfcinfo.com/rfc-5280/

[^5_13]: https://hexlyst.com/en/tools/rfc3161-timestamp-decoder

[^5_14]: https://beefed.ai/en/rfc3161-timestamping-long-term-signatures

[^5_15]: https://tsa.tecxoft.com/authority.jsp

[^5_16]: https://opentelemetry.io/docs/guidance/

[^5_17]: https://www.rfc-editor.org/rfc/rfc9162.pdf

[^5_18]: https://dl.acm.org/doi/book/10.17487/RFC6962

[^5_19]: https://c2pa.org/conformance/

[^5_20]: https://oneuptime.com/blog/post/2026-02-06-instrument-polly-resilience-policies-opentelemetry-dotnet/view

[^5_21]: https://rfcinfo.com/rfc-6962/

[^5_22]: https://rfcinfo.com/rfc-6962/2-1-2-merkle-consistency-proofs/

[^5_23]: https://smarttldr.com/en/topic/python-opentelemetry-retry-and-backoff/deep-dive

[^5_24]: https://www.truestamp.com/knowledge/merkle/rfc6962-merkle

[^5_25]: https://crandmck.github.io/c2pa-conformance-tool/

[^5_26]: https://anhtu.dev/resilience-patterns-dotnet-10-polly-circuit-breaker-retry-microservices-1075

[^5_27]: https://datatracker.ietf.org/doc/html/rfc3161

[^5_28]: https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html

[^5_29]: https://c2pa.wiki/specifications/

[^5_30]: https://c2pa.org/


---

# Modelo de validación

La validación correcta no pregunta solamente si la firma ML-DSA-65 es válida. Debe comprobar la relación temporal entre:

```text
contenido
→ digest
→ firma ML-DSA-65
→ sello RFC 3161
→ certificado de firma
→ estado de revocación
→ registro Genesis
```

Un sello RFC 3161 **no revive una clave ML-DSA-65 revocada**. Su función es demostrar que un digest existía en una fecha determinada. Si la firma ML-DSA-65 fue creada antes de la revocación y el timestamp cubre el digest correcto, puede conservar validez histórica; si fue creada después de la revocación, debe rechazarse.

ML-DSA está estandarizado por NIST en FIPS 204 y su uso con certificados y CRL de X.509 está especificado en RFC 9881.[^6_1][^6_2]

## Validar ML-DSA frente a RFC 3161

### Flujo exacto

```text
1. Extraer el documento y el manifiesto.
2. Recalcular el digest canónico.
3. Verificar la firma ML-DSA-65.
4. Extraer del token RFC 3161 su messageImprint.
5. Comparar messageImprint con el digest firmado.
6. Verificar la firma de la TSA.
7. Validar la cadena X.509 de la TSA.
8. Determinar la fecha efectiva de la firma ML-DSA.
9. Consultar revocación histórica de la clave ML-DSA.
10. Comparar firma, timestamp y revocación.
11. Verificar la entrada y el checkpoint Genesis.
12. Emitir estado histórico y estado actual.
```


### Condición de validez histórica

```text
content_digest == signed_digest
AND
content_digest == timestamp.messageImprint
AND
signature_MLDSA == valid
AND
timestamp_TSA == valid
AND
signing_key_valid_at(timestamp.genTime)
```

La clave puede estar revocada actualmente y el documento seguir siendo históricamente válido si:

```text
signature_time < revocation_effective_at
```

Pero esto requiere evidencia temporal confiable. Sin RFC 3161, una fecha escrita en el manifiesto no es suficiente.

### Estados

```json
{
  "document_id": "doc-001",
  "cryptographic_signature": "valid",
  "timestamp": "valid",
  "key_status_now": "revoked",
  "key_status_at_timestamp": "valid",
  "historical_validity": "valid",
  "current_signing_authority": "invalid_for_new_documents"
}
```


### Casos de decisión

| Situación | Resultado |
| :-- | :-- |
| Firma válida, timestamp anterior a revocación | Válida históricamente |
| Firma válida, timestamp posterior a revocación | Inválida |
| Firma válida, timestamp sin revocación histórica | Indeterminada |
| Firma válida, timestamp no coincide con digest | Inválida |
| Firma ML-DSA inválida, timestamp correcto | Inválida |
| Firma válida, TSA revocada después del timestamp | Puede ser válida históricamente |
| Certificado TSA revocado antes del timestamp | Timestamp no confiable |
| Clave comprometida con revocación retroactiva | Invalidación según política |

### Revocación de la TSA

Hay dos claves distintas:

```text
clave de firma de Isabella
clave de firma de la TSA
```

La validación debe evaluar ambas de forma independiente:

```text
firma_documento = ML-DSA-65
firma_timestamp  = certificado TSA / CMS
```

La revocación posterior de la TSA no invalida necesariamente los timestamps emitidos antes de la revocación, siempre que:

- El token sea válido.
- El timestamp sea anterior a la revocación.
- La política de la TSA no indique compromiso retroactivo.
- Isabella conserve CRL/OCSP y certificados históricos.

OCSP proporciona un mecanismo para consultar el estado actual de un certificado sin descargar una CRL completa. Para conservación a largo plazo, Isabella debe archivar tanto las respuestas OCSP como las CRL relevantes, junto con la fecha en la que fueron obtenidas.[^6_3]

## Estructura de la evidencia temporal

```json
{
  "signature": {
    "algorithm": "ML-DSA-65",
    "key_id": "isabella-mldsa65-2026-01",
    "signed_digest": "sha256:...",
    "signature_value": "..."
  },
  "timestamp": {
    "protocol": "RFC3161",
    "message_imprint": "sha256:...",
    "generation_time": "2026-09-17T20:03:11Z",
    "tsa_certificate": "sha256:...",
    "token": "..."
  },
  "revocation_evidence": {
    "signing_key_status": "valid_at_timestamp",
    "tsa_certificate_status": "valid_at_timestamp",
    "source": "archived_ocsp_and_crl",
    "retrieved_at": "2026-09-17T20:03:15Z"
  }
}
```


## Almacenamiento del árbol Merkle

El árbol no debe almacenarse como una única estructura mutable. Isabella debe separar:

```text
hojas
nodos internos
raíces
pruebas de inclusión
pruebas de consistencia
manifiestos
checkpoints
```


### Capas de almacenamiento

| Capa | Tecnología | Función |
| :-- | :-- | :-- |
| Índice operativo | PostgreSQL | Consultas por documento, clave y secuencia |
| Hojas | Object Storage inmutable | Evidencia completa de cada entrada |
| Nodos | Object Storage o KV | Reutilización de subárboles |
| Checkpoints | JSON/CBOR firmado | Raíces publicadas |
| Backups | WORM/offline | Conservación contra borrado o ransomware |
| Réplica externa | Segundo proveedor o institución | Detección de reescritura |

### Estructura sugerida

```text
genesis/
├── leaves/
│   └── 000000001042.json
├── nodes/
│   └── level-08/
│       └── node-0000000031.bin
├── inclusion-proofs/
│   └── doc-001/
│       └── tree-000001048.json
├── consistency-proofs/
│   └── 000001000-to-000001048.json
├── checkpoints/
│   ├── 2026-09-17T20.json
│   └── 2026-09-17T23-59.json
├── key-manifests/
└── revocations/
```


### Hoja

```json
{
  "sequence": 1042,
  "leaf_type": "document_seal",
  "document_id": "doc-001",
  "manifest_digest": "sha256:...",
  "signature_digest": "sha256:...",
  "timestamp_digest": "sha256:...",
  "previous_leaf_hash": "sha256:...",
  "leaf_hash": "sha256:..."
}
```


### Checkpoint

```json
{
  "tree_id": "isabella-genesis-prod",
  "hash_algorithm": "sha256",
  "tree_size": 1048,
  "root_hash": "sha256:...",
  "previous_tree_size": 1024,
  "previous_root_hash": "sha256:...",
  "generated_at": "2026-09-17T23:59:59Z",
  "signature_key_id": "genesis-root-2026",
  "signature": "..."
}
```

RFC 6962 explica que las pruebas de consistencia permiten demostrar que un árbol nuevo es una extensión del árbol anterior y no una reescritura de su historial.[^6_4]

### Estrategia de backup

Recomiendo una política 3-2-1-1-0:

```text
3 copias
2 tipos de almacenamiento
1 copia fuera de la región
1 copia inmutable/offline
0 errores tras restauración verificada
```

Concretamente:

```text
Primaria:
  PostgreSQL + S3 compatible

Réplica 1:
  proveedor cloud diferente, solo lectura

Réplica 2:
  almacenamiento WORM

Archivo:
  exportación diaria cifrada y offline

Anclaje:
  checkpoint firmado + RFC 3161 externo
```


### Qué respaldar

- Hojas.
- Checkpoints.
- Pruebas de inclusión.
- Pruebas de consistencia.
- Claves públicas.
- Certificados.
- CRL.
- Respuestas OCSP.
- Tokens RFC 3161.
- Manifiestos.
- Esquema y versión del hash.
- Versión del canonicalizador.
- Registro de revocaciones.

No es necesario conservar todos los nodos internos si pueden reconstruirse de hojas inmutables, pero para recuperación rápida y auditoría sí conviene conservarlos.

## Estado TSA_PENDING

`TSA_PENDING` significa:

```text
el documento ya está firmado,
pero todavía no tiene un timestamp RFC 3161 verificado.
```

No significa:

```text
el documento está temporalmente certificado.
```


### Estados detallados

```text
DRAFT
CANONICALIZED
DIGESTED
SIGNED
TSA_PENDING
TSA_RETRYING
TSA_FAILED
TSA_VERIFIED
GENESIS_REGISTERED
DELIVERABLE
PUBLISHED
REVOKED
```


### Tabla de transición

| Estado | Firma | TSA | Publicación |
| :-- | :-- | :-- | :-- |
| `SIGNED` | Válida | No solicitada | Interna |
| `TSA_PENDING` | Válida | En espera | Bloqueada para perfil público |
| `TSA_RETRYING` | Válida | Reintentando | Bloqueada |
| `TSA_FAILED` | Válida | Fallida | Bloqueada o degradada |
| `TSA_VERIFIED` | Válida | Confirmada | Permitida |
| `GENESIS_REGISTERED` | Válida | Confirmada | Permitida |
| `REVOKED` | Variable | Variable | Bloqueada |

### Perfil interno

Puede permitir:

```text
firma válida
+ registro Genesis
+ TSA pendiente
```

El documento se marca:

```text
SIGNED — TIMESTAMP PENDING
```


### Perfil público

Debe exigir:

```text
firma válida
+ timestamp RFC 3161 válido
+ Genesis proof
```


### Perfil crítico

Puede exigir:

```text
TSA primaria válida
+ TSA secundaria válida
+ firma Ed25519 válida
+ firma ML-DSA-65 válida
+ Genesis proof
```


### Reintento idempotente

Cada tarea debe tener:

```json
{
  "document_id": "doc-001",
  "manifest_digest": "sha256:...",
  "tsa_attempt": 3,
  "idempotency_key": "tsa-doc-001-sha256-...",
  "next_retry_at": "2026-09-17T20:15:00Z"
}
```

El retry siempre debe reutilizar el mismo digest. No debe regenerar el documento ni la firma.

### Reconciliación

Cuando la TSA regrese:

```text
buscar TSA_PENDING
→ volver a solicitar timestamp
→ validar imprint
→ guardar token
→ crear nueva entrada Genesis
→ actualizar manifest
→ crear checkpoint
→ liberar publicación
```

La entrada original no se modifica. Se añade una entrada de evolución:

```text
1042: documento firmado
1078: timestamp RFC 3161 añadido
```


## Verificación X.509 en Genesis

RFC 5280 define el perfil de certificados X.509, CRL y validación de rutas de certificación.[^6_5]

El registro Genesis debe verificar las claves y certificados, no confiar simplemente en un `key_id`.

### Ruta de certificación

```text
certificado de firma
      ↓
intermediate CA
      ↓
Genesis Root CA
      ↓
trust store del verificador
```


### Validaciones

1. Parsear certificado.
2. Validar firma del emisor.
3. Comprobar `notBefore` y `notAfter`.
4. Verificar `Basic Constraints`.
5. Comprobar `Key Usage`.
6. Comprobar `Extended Key Usage`.
7. Verificar `Subject Key Identifier`.
8. Comparar el `key_id` con la clave pública.
9. Consultar CRL.
10. Consultar OCSP.
11. Evaluar el estado en la fecha de firma.
12. Verificar políticas de algoritmo.
13. Verificar la firma del documento o manifest.

### ML-DSA y X.509

El certificado debe declarar claramente:

```text
public key algorithm = ML-DSA-65
key usage = digitalSignature
certificate policy = Isabella Document Signing
```

La implementación no debe tratar una clave ML-DSA como si fuera Ed25519 solo porque ambas producen firmas digitales. RFC 9881 especifica convenciones para ML-DSA en certificados y CRL X.509.[^6_2]

### Resultado X.509

```json
{
  "certificate": {
    "subject": "CN=Isabella Document Signing 2026",
    "issuer": "CN=Isabella Genesis Intermediate CA",
    "algorithm": "ML-DSA-65",
    "validity": {
      "not_before": "2026-01-01T00:00:00Z",
      "not_after": "2027-01-01T00:00:00Z"
    }
  },
  "path_validation": "valid",
  "revocation": {
    "current": "revoked",
    "at_signature_time": "good",
    "evidence": "archived_ocsp"
  }
}
```


### Claves sin certificado

Para un sistema cerrado, Isabella puede registrar claves públicas directamente en Genesis:

```json
{
  "key_id": "isabella-mldsa65-2026-01",
  "public_key": "...",
  "algorithm": "ML-DSA-65",
  "valid_from": "...",
  "valid_until": "...",
  "status": "active",
  "issuer": "isabella-genesis-root"
}
```

Pero para interoperabilidad pública conviene soportar certificados X.509 y un trust store explícito.

## Revocación de watermarks

Una marca de agua no tiene el mismo estado que una clave criptográfica. No se “revoca” normalmente como un certificado. Se revoca la relación entre:

```text
watermark identifier
→ manifest
→ asset
→ resolver
```


### Casos de revocación

- La marca fue copiada o expuesta.
- El documento fue retirado.
- El documento contenía errores graves.
- El manifest fue reemplazado.
- El identificador fue emitido a un proyecto equivocado.
- El algoritmo de watermark fue comprometido.
- El receptor no debe seguir accediendo al documento.
- La marca ya no puede distinguir una versión legítima.


### Registro de revocación

```json
{
  "type": "watermark_revocation",
  "watermark_id": "7Q4M2W9K8H3P",
  "manifest_id": "urn:isabella:manifest:doc-001:v3",
  "effective_at": "2026-09-17T22:00:00Z",
  "reason": "manifest_superseded",
  "replacement_manifest_id": "urn:isabella:manifest:doc-001:v4",
  "signature": "..."
}
```


### Efecto en la cadena de custodia

Una watermark revocada no debería provocar automáticamente:

```text
documento criptográficamente inválido
```

Debe producir:

```text
watermark_status = revoked
provenance_status = requires_review
```

La firma y el timestamp pueden seguir siendo válidos, mientras que el identificador de resolución ya no sea confiable.

### Matriz

| Estado del watermark | Firma | Resultado |
| :-- | :-- | :-- |
| Activo | Válida | Procedencia completa |
| Revocado, firma válida | Válida | Documento históricamente verificable, watermark no confiable |
| Revocado por compromiso | Válida | Verificar con manifest embebido y Genesis |
| No detectado | Válida | Procedencia puede validarse por hard binding |
| Detectado, digest incompatible | Válida en otro asset | Documento alterado o watermark copiado |
| Reemplazado por v4 | Válida en v3 | Versión antigua, no necesariamente inválida |

### Watermark específica por versión

Nunca reutilizaría el mismo identificador para diferentes versiones:

```text
doc-001:v1 → watermark A
doc-001:v2 → watermark B
doc-001:v3 → watermark C
```

Para una cadena de custodia limpia:

```text
v1 → superseded_by → v2
v2 → superseded_by → v3
```


### Soft binding revocado

Si el watermark sirve para localizar el manifest y se revoca:

```text
1. El resolver devuelve estado revoked.
2. El verifier no acepta la marca como evidencia suficiente.
3. Busca manifest embebido.
4. Comprueba la prueba Genesis.
5. Comprueba el digest del archivo.
6. Devuelve resultado degradado.
```

C2PA contempla las marcas invisibles como soft bindings y recomienda registrar una acción `c2pa.watermarked.bound` cuando se inserta una marca con finalidad de vincular el asset al manifest.[^6_6]

## Verificación completa

```ts
async function verifyIsabellaSeal(input: VerifyInput) {
  const assetDigest = await canonicalDigest(input.asset);
  const manifest = await loadEmbeddedOrRecoveredManifest(input.asset);

  const contentBinding = verifyContentBinding(
    assetDigest,
    manifest.claim.contentBinding,
  );

  const classical = verifyEd25519(
    assetDigest,
    manifest.signatures.ed25519,
  );

  const postQuantum = verifyMlDsa65(
    assetDigest,
    manifest.signatures.mldsa65,
  );

  const timestamp = verifyRfc3161(
    manifest.timestamp,
    assetDigest,
  );

  const x509 = verifyCertificatePath(
    manifest.signingCertificateChain,
    input.trustStore,
    timestamp.generationTime,
  );

  const revocation = await evaluateHistoricalRevocation({
    signingKey: manifest.signingKey,
    signatureTime: timestamp.generationTime,
    archivedEvidence: manifest.revocationEvidence,
  });

  const genesis = await verifyGenesisProof(
    manifest.genesisProof,
    assetDigest,
  );

  const watermark = detectAndEvaluateWatermark(input.asset);

  return evaluateTrustPolicy({
    contentBinding,
    classical,
    postQuantum,
    timestamp,
    x509,
    revocation,
    genesis,
    watermark,
  });
}
```


## Resultado recomendado

```json
{
  "overall": "VALID_HISTORICALLY",
  "content_integrity": "valid",
  "ed25519": "valid",
  "mldsa65": "valid",
  "rfc3161": "valid",
  "x509": {
    "at_timestamp": "valid",
    "current": "revoked"
  },
  "genesis": {
    "inclusion": "valid",
    "consistency": "valid"
  },
  "watermark": {
    "status": "revoked",
    "impact": "soft_binding_only"
  },
  "interpretation": "El documento fue firmado cuando la clave estaba válida. La clave está revocada actualmente y no puede usarse para nuevas firmas. El watermark ya no debe utilizarse como mecanismo de resolución."
}
```


## Política final

La política de Isabella debería establecer:

```text
- RFC 3161 acredita el momento del digest, no reemplaza la firma.
- ML-DSA-65 debe validarse contra el mismo digest del timestamp.
- La revocación se evalúa históricamente y actualmente.
- Genesis nunca elimina entradas; registra revocaciones y reemplazos.
- El árbol Merkle conserva checkpoints firmados y pruebas de consistencia.
- TSA_PENDING no equivale a documento sellado temporalmente.
- X.509 requiere validación de ruta, usos, fechas y revocación.
- Un watermark revocado afecta al binding, no necesariamente al documento.
- Un soft binding nunca sustituye al hash y a la firma.
- La publicación crítica debe bloquearse hasta validar TSA y Genesis.
```

La combinación más sólida sería:

```text
ML-DSA-65 + Ed25519
+ RFC 3161
+ evidencia CRL/OCSP archivada
+ Genesis Merkle con consistencia
+ X.509 validado históricamente
+ C2PA hard binding
+ soft binding revocable
+ estados explícitos TSA_PENDING
```

Así Isabella puede distinguir con precisión entre un documento **auténtico**, uno **históricamente válido**, uno **actualmente revocado**, uno **temporalmente pendiente** y uno **alterado**, sin reducir toda la cadena de custodia a una única marca de agua o a un único hash.

<span style="display:none">[^6_10][^6_11][^6_12][^6_13][^6_14][^6_15][^6_16][^6_17][^6_18][^6_19][^6_20][^6_21][^6_22][^6_23][^6_24][^6_25][^6_26][^6_27][^6_28][^6_29][^6_30][^6_31][^6_32][^6_33][^6_34][^6_35][^6_36][^6_37][^6_38][^6_39][^6_40][^6_7][^6_8][^6_9]</span>

<div align="center">⁂</div>

[^6_1]: https://csrc.nist.gov/pubs/fips/204/ipd

[^6_2]: https://www.rfc-editor.org/rfc/rfc9881.html

[^6_3]: https://www.rfc-editor.org/info/rfc6960/

[^6_4]: https://www.rfc-editor.org/info/rfc6962/

[^6_5]: https://www.rfc-editor.org/rfc/rfc5280.json

[^6_6]: https://spec.c2pa.org/specifications/specifications/2.4/guidance/Guidance.html

[^6_7]: https://dl.acm.org/doi/10.17487/RFC5280

[^6_8]: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.ipd.pdf

[^6_9]: https://interoperable-europe.ec.europa.eu/collection/ict-standards-procurement/solution/ietf-rfc-5280-2008-internet-x509-public-key-infrastructure-certificate-and-certificate-revocation

[^6_10]: https://stackoverflow.com/questions/19528456/verify-rfc-3161-trusted-timestamp

[^6_11]: https://tex2e.github.io/rfc-translater/html/rfc3161.html

[^6_12]: https://www.rfc-editor.org/rfc/inline-errata/rfc6962.html

[^6_13]: https://www.ietf.org/archive/id/draft-ietf-trans-rfc6962-bis-42.html

[^6_14]: https://github.com/TrustBeat/proof-verification

[^6_15]: https://deepwiki.com/sigstore/helm-charts/3.2-rekor-transparency-log

[^6_16]: https://safeguard.sh/resources/blog/merkle-tree-in-transparency-logs

[^6_17]: https://encypher.com/content-provenance/recover-stripped-metadata

[^6_18]: https://dl.acm.org/doi/10.17487/RFC6960

[^6_19]: https://www.rfc-editor.org/refs/ref6960.txt

[^6_20]: https://archive.org/details/rfc3161

[^6_21]: https://archive.org/details/rfc6960

[^6_22]: https://rfcinfo.com/rfc-6960/

[^6_23]: https://rfc.blacklabs.team/rfc6960.html

[^6_24]: https://www.notasign.com/blog/time-stamping-authority-tsa-integration

[^6_25]: https://www.sealdoc.eu/blog/rfc-3161-timestamps-explained

[^6_26]: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf

[^6_27]: https://www.rfc-editor.org/info/rfc5280/

[^6_28]: https://datatracker.ietf.org/doc/html/rfc3161

[^6_29]: https://csrc.nist.gov/pubs/fips/204/final

[^6_30]: https://www.rfc-editor.org/info/rfc3161/

[^6_31]: https://www.nist.gov/publications/module-lattice-based-digital-signature-standard

[^6_32]: https://rfcinfo.com/rfc-5280/

[^6_33]: https://c2pa.org/

[^6_34]: https://c2pa.org/conformance/

[^6_35]: https://github.com/TrustBeat/merklon

[^6_36]: https://github.com/hashmewithsomesalt/merkle-transparency-log

[^6_37]: https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html

[^6_38]: https://rfcinfo.com/rfc-6962/2-1-2-merkle-consistency-proofs/

[^6_39]: https://rfcinfo.com/rfc-6962/

[^6_40]: https://beefed.ai/en/rfc3161-timestamping-long-term-signatures

