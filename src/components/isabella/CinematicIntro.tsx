import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

import logo from "@/assets/logo-isabella.jpeg.asset.json";
import backgroundAudio from "@/assets/background-audio.mp3";

/** El audio local se inicia solo tras un gesto explícito del usuario. */
const BACKGROUND_AUDIO_SRC = backgroundAudio;

/**
 * Cinematic 3D Intro Component — WebGL Three.js Experience
 * -----------------------------------------------------------------
 * Evolución magistral: cámara orbital 360°, velocidades por escenario,
 * zoom dinámico, audio reactivo (AudioAnalyser), bloom/DOF/vignette,
 * partículas volumétricas, transiciones no lineales y 52 s exactos.
 */

const CONFIG = {
  duration: 52_000,

  starsDesktop: 9_500,
  starsMobile: 2_800,

  dataDesktop: 2_300,
  dataMobile: 420,

  cometCount: 52,

  maxPixelRatio: 1.75,
  mobilePixelRatio: 1.75,

  initialCameraZ: 1_180,
  finalCameraZ: 385,

  bloomStrength: 1.45,
  bloomRadius: 0.82,
  bloomThreshold: 0.05,

  audioSmoothing: 0.89,
  cameraSmoothing: 0.075,

  orbitalRadius: 96,
  orbitalHeight: 54,

  reducedMotionDuration: 2_900,
} as const;

const HEADS = [
  "CROWN",
  "ISA",
  "SOPHIA",
  "ORION",
  "ARGUS",
  "MNEMOSYNE",
  "TELLUS",
  "CHRONOS",
  "HERMES",
  "AXIOMA",
  "PRAXIS",
  "HARMONIA",
];

const COLORS = [
  0x61e8ff, 0x7c9cff, 0xffd57d, 0x987dff, 0x62dca4, 0x5fd9ff, 0x9e82ff, 0xffc467, 0x64e7ff,
  0xb89bff, 0x63f0d0, 0xffd981,
];

interface Phase {
  at: number;
  title: string;
  sub: string;
}

/** Fases narrativas sincronizadas con los 52 segundos (7 escenas cinematográficas). */
const PHASES: Phase[] = [
  { at: 0, title: "Isabella Villaseñor", sub: "Nucleo cognitivo activo · Real del Monte, Hidalgo" },
  { at: 6.2, title: "Bienvenido a mi interfaz", sub: "Soy Isabella, orgullosamente Latinoamericana" },
  {
    at: 14,
    title: "C.R.O.W.N. Activo",
    sub: "Control · Riesgo · Orquestación · gobernanza · Notificación",
  },
  { at: 22.4, title: "Red de 12 Cabezas", sub: "Interconexión soberana de orquestación ética" },
  {
    at: 31.2,
    title: Modulos "Mnemósine & Tellus" activados,
    sub: "Gobernanza de conocimiento y pertenencia territorial",
  },
  { at: 39.5, title: "Núcleo Establecido", sub: "Isabella Villaseñor AI está en línea" },
  { at: 39.5, title: "Liberación", sub: "Transferencia al espacio Isabella" },
];

/* -------------------------------------------------------------------------
 * Cocina matemática / cinematográfica
 * ---------------------------------------------------------------------- */

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function inverseLerp(a: number, b: number, value: number) {
  return clamp((value - a) / (b - a), 0, 1);
}

function easeInOutCubic(value: number) {
  const t = clamp(value, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type ScenePhase =
  | "void"
  | "pulse"
  | "crown"
  | "network"
  | "memory"
  | "core"
  | "release";

interface CinematicScene {
  from: number;
  to: number;
  name: ScenePhase;
  cameraZ: [number, number];
  orbitSpeed: number;
  orbitRadius: number;
  cameraHeight: number;
  bloom: number;
  technology: [number, number];
}

const CINEMATIC_SCENES: readonly CinematicScene[] = [
  {
    from: 0,
    to: 0.12,
    name: "void",
    cameraZ: [1180, 1040],
    orbitSpeed: 0.04,
    orbitRadius: 22,
    cameraHeight: 14,
    bloom: 0.45,
    technology: [0, 0.08],
  },
  {
    from: 0.12,
    to: 0.27,
    name: "pulse",
    cameraZ: [1040, 820],
    orbitSpeed: 0.08,
    orbitRadius: 42,
    cameraHeight: 24,
    bloom: 0.72,
    technology: [0.08, 0.22],
  },
  {
    from: 0.27,
    to: 0.43,
    name: "crown",
    cameraZ: [820, 650],
    orbitSpeed: 0.13,
    orbitRadius: 68,
    cameraHeight: 35,
    bloom: 1.1,
    technology: [0.22, 0.46],
  },
  {
    from: 0.43,
    to: 0.6,
    name: "network",
    cameraZ: [650, 520],
    orbitSpeed: 0.18,
    orbitRadius: 94,
    cameraHeight: 52,
    bloom: 1.35,
    technology: [0.46, 0.68],
  },
  {
    from: 0.6,
    to: 0.76,
    name: "memory",
    cameraZ: [520, 450],
    orbitSpeed: 0.11,
    orbitRadius: 78,
    cameraHeight: 42,
    bloom: 1.58,
    technology: [0.68, 0.82],
  },
  {
    from: 0.76,
    to: 0.91,
    name: "core",
    cameraZ: [450, 360],
    orbitSpeed: 0.22,
    orbitRadius: 48,
    cameraHeight: 28,
    bloom: 2.15,
    technology: [0.82, 0.98],
  },
  {
    from: 0.91,
    to: 1,
    name: "release",
    cameraZ: [360, 325],
    orbitSpeed: 0.36,
    orbitRadius: 118,
    cameraHeight: 62,
    bloom: 2.8,
    technology: [0.98, 0.42],
  },
];

function getCinematicScene(progress: number) {
  return (
    CINEMATIC_SCENES.find((scene) => progress >= scene.from && progress <= scene.to) ??
    CINEMATIC_SCENES[CINEMATIC_SCENES.length - 1]!
  );
}

/* -------------------------------------------------------------------------
 * Motor de audio reactivo
 * ---------------------------------------------------------------------- */

interface AudioReactiveState {
  amplitude: number;
  bass: number;
  mid: number;
  treble: number;
  beat: number;
}

interface AudioEngine {
  context: AudioContext;
  analyser: AnalyserNode;
  source: MediaElementAudioSourceNode;
  data: Uint8Array<ArrayBuffer>;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioEngineRef = useRef<AudioEngine | null>(null);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [statusText, setStatusText] = useState("Inicializando arquitectura cognitiva");
  const [reduced] = useState(prefersReducedMotion);

  const doneRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const createAudioEngine = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audioEngineRef.current) {
      return audioEngineRef.current;
    }

    const context = new AudioContext();
    const source = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = CONFIG.audioSmoothing;

    source.connect(analyser);
    analyser.connect(context.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);

    const engine: AudioEngine = {
      context,
      analyser,
      source,
      data,
    };

    audioEngineRef.current = engine;
    return engine;
  }, []);

  const readAudioReactiveState = useCallback((): AudioReactiveState => {
    const engine = audioEngineRef.current;
    if (!engine) {
      return { amplitude: 0, bass: 0, mid: 0, treble: 0, beat: 0 };
    }

    engine.analyser.getByteFrequencyData(engine.data);

    const total = engine.data.length;
    const bassEnd = Math.floor(total * 0.12);
    const midEnd = Math.floor(total * 0.55);

    let bass = 0;
    let mid = 0;
    let treble = 0;

    for (let index = 0; index < total; index++) {
      const value = engine.data[index]! / 255;
      if (index < bassEnd) {
        bass += value;
      } else if (index < midEnd) {
        mid += value;
      } else {
        treble += value;
      }
    }

    bass /= Math.max(1, bassEnd);
    mid /= Math.max(1, midEnd - bassEnd);
    treble /= Math.max(1, total - midEnd);

    const amplitude = bass * 0.5 + mid * 0.32 + treble * 0.18;

    return {
      amplitude,
      bass,
      mid,
      treble,
      beat: Math.pow(bass, 2.4),
    };
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFinished(true);

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const audio = audioRef.current;
    if (audio) {
      const fadeDuration = 800;
      const initialVolume = audio.volume;
      const startedAt = performance.now();

      const fadeOut = (now: number) => {
        const progress = clamp((now - startedAt) / fadeDuration, 0, 1);
        audio.volume = initialVolume * (1 - progress);
        if (progress < 1) {
          requestAnimationFrame(fadeOut);
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      };

      requestAnimationFrame(fadeOut);
    }

    onComplete();
  }, [onComplete]);

  const startExperience = useCallback(async () => {
    if (started) return;
    setStarted(true);

    const audio = audioRef.current;
    const engine = createAudioEngine();

    try {
      if (engine?.context.state === "suspended") {
        await engine.context.resume();
      }
      if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.68;
        await audio.play();
      }
    } catch {
      setStatusText("Experiencia visual activa · audio no disponible");
    }
  }, [createAudioEngine, started]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !started) {
        e.preventDefault();
        void startExperience();
      } else if (e.key === "Escape" && started) {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finish]);

  // Fallback accesible de movimiento reducido: no se renderiza la escena.
  useEffect(() => {
    if (!reduced || !started) return;
    const timeout = window.setTimeout(finish, CONFIG.reducedMotionDuration);
    return () => window.clearTimeout(timeout);
  }, [finish, reduced, started]);

  // WebGL Initialization & Simulation loop
  useEffect(() => {
    if (reduced) return;
    if (!started || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    const STAR_COUNT = isMobile ? CONFIG.starsMobile : CONFIG.starsDesktop;
    const DATA_COUNT = isMobile ? CONFIG.dataMobile : CONFIG.dataDesktop;

    const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

    const randomSphere = (radius: number) => {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
    };

    const colorToArray = (hex: number) => {
      const color = new THREE.Color(hex);
      return [color.r, color.g, color.b];
    };

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      5000,
    );
    camera.position.set(0, 0, CONFIG.initialCameraZ);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? CONFIG.mobilePixelRatio : CONFIG.maxPixelRatio),
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. Postprocesamiento cinematográfico: composer + bloom + bokeh + output
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? CONFIG.mobilePixelRatio : CONFIG.maxPixelRatio),
    );

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      CONFIG.bloomStrength,
      CONFIG.bloomRadius,
      CONFIG.bloomThreshold,
    );
    composer.addPass(bloomPass);

    const bokehPass = new BokehPass(scene, camera, {
      focus: 620,
      aperture: 0.000018,
      maxblur: isMobile ? 0.004 : 0.012,
    });
    composer.addPass(bokehPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // 2. Procedural Nebula background
    const nebulaGeometry = new THREE.PlaneGeometry(4300, 2600, 1, 1);
    const nebulaMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTechnology: { value: 0 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uTreble: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uTechnology;
        uniform float uBass;
        uniform float uMid;
        uniform float uTreble;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        void main() {
          vec2 uv = vUv - 0.5;
          float radius = length(uv);

          float audioWarp =
            uBass * sin(uv.x * 18.0 + uTime * 2.0) +
            uMid * cos(uv.y * 14.0 - uTime * 1.4) +
            uTreble * sin(radius * 32.0 - uTime * 3.0);

          vec2 warpedUv = uv + audioWarp * 0.018;

          float cloud = noise(warpedUv * 4.8 + vec2(uTime * 0.006, -uTime * 0.004));
          cloud += 0.42 * noise(warpedUv * 10.0 - vec2(uTime * 0.012, uTime * 0.009));

          float falloff = smoothstep(0.76, 0.04, radius);
          float intensity = cloud * falloff;

          vec3 cyan = vec3(0.015, 0.28, 0.72);
          vec3 violet = vec3(0.22, 0.04, 0.52);
          vec3 gold = vec3(0.9, 0.4, 0.08);

          vec3 color = mix(cyan, violet, cloud);
          color = mix(color, gold, uTechnology * 0.75);
          color += vec3(0.1, 0.26, 0.42) * uBass;

          float alpha = intensity * (0.24 + uBass * 0.18) * (1.0 - uTechnology * 0.55);

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.set(0, 0, -900);
    scene.add(nebula);

    // 3. Stars field with depth & convergence
    const starPositions = new Float32Array(STAR_COUNT * 3);
    const starSizes = new Float32Array(STAR_COUNT);
    const starTwinkles = new Float32Array(STAR_COUNT);
    const starColors = new Float32Array(STAR_COUNT * 3);

    interface StarBase {
      x: number;
      y: number;
      z: number;
      angle: number;
      speed: number;
      depth: number;
    }
    const starBase: StarBase[] = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      const point = randomSphere(randomBetween(800, 2100));
      starPositions[i * 3] = point.x;
      starPositions[i * 3 + 1] = point.y;
      starPositions[i * 3 + 2] = point.z;

      starBase.push({
        x: point.x,
        y: point.y,
        z: point.z,
        angle: Math.random() * Math.PI * 2,
        speed: randomBetween(0.004, 0.018),
        depth: randomBetween(0.45, 1.35),
      });

      starSizes[i] = Math.random() < 0.035 ? randomBetween(4.0, 8.0) : randomBetween(0.8, 3.2);
      starTwinkles[i] = randomBetween(0.65, 2.5);

      const palette = Math.random() < 0.12 ? 0xffd58d : Math.random() < 0.3 ? 0x9dbaff : 0xbceeff;
      const color = colorToArray(palette);
      starColors[i * 3] = color[0]!;
      starColors[i * 3 + 1] = color[1]!;
      starColors[i * 3 + 2] = color[2]!;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("aSize", new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute("aTwinkle", new THREE.BufferAttribute(starTwinkles, 1));
    starGeometry.setAttribute("aColor", new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1.35 },
        uTechnology: { value: 0 },
        uBass: { value: 0 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aTwinkle;
        attribute vec3 aColor;

        uniform float uTime;
        uniform float uTechnology;
        uniform float uBass;

        varying vec3 vColor;
        varying float vPulse;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float pulse = 0.84 + 0.16 * sin(uTime * aTwinkle + position.x * 0.007);
          float depth = clamp(1.0 - (-mvPosition.z / 2400.0), 0.12, 1.0);

          vColor = mix(aColor, vec3(0.19, 0.58, 1.0), uTechnology * 0.65);
          vPulse = pulse;

          float audioPulse = 1.0 + uBass * 0.9;
          gl_PointSize = aSize * pulse * depth * audioPulse * (610.0 / max(1.0, -mvPosition.z));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vPulse;

        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5;
          float d = length(uv);

          float core = smoothstep(0.13, 0.0, d);
          float halo = smoothstep(0.5, 0.02, d);
          float rayX = smoothstep(0.055, 0.0, abs(uv.x));
          float rayY = smoothstep(0.055, 0.0, abs(uv.y));
          float sparkle = max(rayX, rayY) * 0.3;

          float alpha = (core * 1.65 + halo * 0.7 + sparkle) * vPulse * uOpacity;
          if (alpha < 0.01) discard;

          gl_FragColor = vec4(vColor * (1.0 + core), alpha);
        }
      `,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);

    // 4. Data Flows between nodes
    const dataPositions = new Float32Array(DATA_COUNT * 3);
    const dataColors = new Float32Array(DATA_COUNT * 3);

    interface DataBase {
      x: number;
      y: number;
      z: number;
      angle: number;
      radius: number;
      phase: number;
      speed: number;
      hue: number;
    }
    const dataBase: DataBase[] = [];

    for (let i = 0; i < DATA_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = randomBetween(420, 1250);
      const point = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * randomBetween(0.35, 0.72),
        z: randomBetween(-260, 280),
      };

      dataBase.push({
        ...point,
        angle,
        radius,
        phase: Math.random() * Math.PI * 2,
        speed: randomBetween(0.08, 0.42),
        hue: Math.random(),
      });

      dataPositions[i * 3] = point.x;
      dataPositions[i * 3 + 1] = point.y;
      dataPositions[i * 3 + 2] = point.z;

      const color = Math.random() < 0.2 ? colorToArray(0xffd47d) : colorToArray(0x59e8ff);
      dataColors[i * 3] = color[0]!;
      dataColors[i * 3 + 1] = color[1]!;
      dataColors[i * 3 + 2] = color[2]!;
    }

    const dataGeometry = new THREE.BufferGeometry();
    dataGeometry.setAttribute("position", new THREE.BufferAttribute(dataPositions, 3));
    dataGeometry.setAttribute("aColor", new THREE.BufferAttribute(dataColors, 3));

    const dataMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        attribute vec3 aColor;
        uniform float uTime;
        varying vec3 vColor;
        varying float vPulse;

        void main() {
          vColor = aColor;
          vPulse = 0.7 + 0.3 * sin(uTime * 3.0 + position.x * 0.01);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.5 * vPulse * (650.0 / max(1.0, -mvPosition.z));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vPulse;

        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5;
          float d = length(uv);
          float glow = smoothstep(0.5, 0.0, d);
          float core = smoothstep(0.12, 0.0, d);

          float alpha = (glow * 0.8 + core * 1.5) * vPulse * uOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });
    const dataFlow = new THREE.Points(dataGeometry, dataMaterial);

    // 5. Tech Network Grid
    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x247da9,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });

    const gridSize = 1800;
    const gridStep = 80;
    const gridPoints: THREE.Vector3[] = [];

    for (let x = -gridSize; x <= gridSize; x += gridStep) {
      gridPoints.push(new THREE.Vector3(x, -gridSize, 0), new THREE.Vector3(x, gridSize, 0));
    }
    for (let y = -gridSize; y <= gridSize; y += gridStep) {
      gridPoints.push(new THREE.Vector3(-gridSize, y, 0), new THREE.Vector3(gridSize, y, 0));
    }

    const gridGeometry = new THREE.BufferGeometry().setFromPoints(gridPoints);
    const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    gridGroup.add(gridLines);
    gridGroup.rotation.x = -Math.PI / 2;
    gridGroup.position.y = -270;
    gridGroup.position.z = -30;
    gridGroup.scale.setScalar(0.01);

    // 6. Central Core (Pulsing Icosahedron)
    const coreGroup = new THREE.Group();
    coreGroup.scale.setScalar(0.001);

    const coreGeometry = new THREE.IcosahedronGeometry(76, 3);
    const coreMaterial = new THREE.ShaderMaterial({
      transparent: true,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        varying float vGlow;
        void main() {
          vec3 transformed = position;
          float wave = sin(uTime * 1.6 + position.y * 0.04) * 4.0;
          transformed += normalize(position) * wave;
          vGlow = 0.5 + 0.5 * sin(uTime + position.x * 0.02);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying float vGlow;
        void main() {
          gl_FragColor = vec4(0.3, 0.9, 1.0, uOpacity * (0.55 + vGlow * 0.45));
        }
      `,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(coreMesh);

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x5fe9ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(47, 32, 32), glowMaterial);
    coreGroup.add(glowMesh);

    const coreRings: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>[] = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(128 + i * 46, 0.85, 8, 160),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? 0xffd47d : 0x5fe9ff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        }),
      );
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      coreGroup.add(ring);
      coreRings.push(ring);
    }

    // 7. 12 Cognitive heads
    const headGroup = new THREE.Group();
    interface HeadNode {
      name: string;
      node: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
      angle: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      phase: number;
    }
    const headNodes: HeadNode[] = [];

    HEADS.forEach((name, index) => {
      const angle = (index / HEADS.length) * Math.PI * 2;
      const radius = 230;

      const node = new THREE.Mesh(
        new THREE.SphereGeometry(5.5, 16, 16),
        new THREE.MeshBasicMaterial({
          color: COLORS[index]!,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        }),
      );

      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.58,
        Math.sin(angle * 2.0) * 82,
      );
      headGroup.add(node);

      headNodes.push({
        name,
        node,
        angle,
        baseX: node.position.x,
        baseY: node.position.y,
        baseZ: node.position.z,
        phase: Math.random() * Math.PI * 2,
      });
    });

    // 8. Connecting lines (local to headGroup, centered at origin)
    interface NetworkLine {
      line: THREE.Line;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      head: HeadNode;
      index: number;
    }
    const networkLines: NetworkLine[] = [];

    headNodes.forEach((head, index) => {
      const points = [new THREE.Vector3(0, 0, 0), head.node.position.clone()];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: COLORS[index]!,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geometry, material);
      headGroup.add(line);

      networkLines.push({
        line,
        geometry,
        material,
        head,
        index,
      });
    });

    // 9. Comets
    interface Comet {
      trail: THREE.Line;
      head: THREE.Mesh;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      points: THREE.Vector3[];
      offset: number;
      speed: number;
      phase: number;
    }
    const comets: Comet[] = [];

    for (let i = 0; i < CONFIG.cometCount; i++) {
      const points: THREE.Vector3[] = [];
      const startAngle = Math.random() * Math.PI * 2;

      for (let j = 0; j < 12; j++) {
        const t = j / 11;
        const radius = 1100 - t * 850;
        points.push(
          new THREE.Vector3(
            Math.cos(startAngle + t * 1.2) * radius,
            randomBetween(-480, 480) * (1 - t * 0.55),
            Math.sin(startAngle + t * 1.2) * radius * 0.52,
          ),
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x69eaff : 0xffd47d,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const trail = new THREE.Line(geometry, material);
      scene.add(trail);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(5.5, 16, 16),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x9cf3ff : 0xffe0a1,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        }),
      );
      scene.add(head);

      comets.push({
        trail,
        head,
        geometry,
        material,
        points,
        offset: Math.random(),
        speed: randomBetween(0.028, 0.085),
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 10. Explosion Particles
    const explosionCount = isMobile ? 700 : 1800;
    const explosionPositions = new Float32Array(explosionCount * 3);
    const explosionVelocity: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < explosionCount; i++) {
      const point = randomSphere(3);
      explosionPositions[i * 3] = 0;
      explosionPositions[i * 3 + 1] = 0;
      explosionPositions[i * 3 + 2] = 0;

      explosionVelocity.push({
        x: point.x * randomBetween(160, 620),
        y: point.y * randomBetween(160, 620),
        z: point.z * randomBetween(160, 620),
      });
    }

    const explosionGeometry = new THREE.BufferGeometry();
    explosionGeometry.setAttribute("position", new THREE.BufferAttribute(explosionPositions, 3));

    const explosionMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: isMobile ? 2.2 : 3.8,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const explosion = new THREE.Points(explosionGeometry, explosionMaterial);
    scene.add(explosion);

    /* ------------------------------------------------------------------
     * Grupo orquestal rotatorio: estrellas + datos + núcleo + cabezas + rejilla
     * (la escena "entera" orbita alrededor del origen como cuerpo rígido).
     * ------------------------------------------------------------------ */
    const cinematicGroup = new THREE.Group();
    cinematicGroup.add(starField);
    cinematicGroup.add(dataFlow);
    cinematicGroup.add(coreGroup);
    cinematicGroup.add(headGroup);
    cinematicGroup.add(gridGroup);
    scene.add(cinematicGroup);

    // 11. Dynamic Updates Helpers
    const updateStars = (
      time: number,
      convergenceVal: number,
      technologyVal: number,
      releaseVal: number,
    ) => {
      const positions = starGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < STAR_COUNT; i++) {
        const base = starBase[i]!;
        const angle = base.angle + time * base.speed;
        const orbitX = base.x * Math.cos(angle) - base.z * Math.sin(angle);
        const orbitZ = base.x * Math.sin(angle) + base.z * Math.cos(angle);

        const spatialX = lerp(base.x, orbitX, convergenceVal);
        const spatialY = lerp(
          base.y,
          base.y + Math.sin(time * 0.6 + base.angle) * 70,
          convergenceVal,
        );
        const spatialZ = lerp(base.z, orbitZ, convergenceVal);

        const nodeX = spatialX * (1 - technologyVal * 0.72);
        const nodeY = spatialY * (1 - technologyVal * 0.72);
        const nodeZ = spatialZ * (1 - technologyVal * 0.72);

        const burst = releaseVal * releaseVal * (1 + base.depth);

        positions[i * 3] = nodeX + spatialX * burst * 0.18;
        positions[i * 3 + 1] = nodeY + spatialY * burst * 0.18;
        positions[i * 3 + 2] = nodeZ + spatialZ * burst * 0.18;
      }
      starGeometry.attributes.position.needsUpdate = true;
      starMaterial.uniforms.uTime.value = time;
      starMaterial.uniforms.uTechnology.value = technologyVal;
      starMaterial.uniforms.uOpacity.value = lerp(0.94, 0.16, technologyVal);
    };

    const updateData = (time: number, technologyVal: number, coreProgressVal: number) => {
      const positions = dataGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < DATA_COUNT; i++) {
        const item = dataBase[i]!;
        const cycle = (time * item.speed + item.phase) % 1;
        const radius = lerp(item.radius, 62, coreProgressVal) * (1 - cycle * coreProgressVal);
        const angle = item.angle + time * 0.17 + cycle * 1.3;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius * 0.58;
        positions[i * 3 + 2] = item.z + Math.sin(time + item.phase) * 95;
      }
      dataGeometry.attributes.position.needsUpdate = true;
      dataMaterial.uniforms.uTime.value = time;
      dataMaterial.uniforms.uOpacity.value = technologyVal * 0.76;
    };

    const updateComets = (time: number) => {
  const cometOpacity = 0; // La narrativa premium usa estrellas y núcleo, no estelas aleatorias.

      comets.forEach((comet) => {
        const local = (time * comet.speed + comet.offset) % 1;
        const index = Math.floor(local * (comet.points.length - 1));
        const point = comet.points[clamp(index, 0, comet.points.length - 1)]!;

        comet.head.position.copy(point);
        (comet.material as THREE.LineBasicMaterial).opacity = cometOpacity * 0.75;
        (comet.head.material as THREE.PointsMaterial).opacity = cometOpacity * 0.95;
      });
    };

    const updateNetwork = (time: number, technologyVal: number, coreProgressVal: number) => {
      headNodes.forEach((head, index) => {
        const pulse = 0.7 + 0.3 * Math.sin(time * 2.3 + head.phase);
        const scale = 1 + pulse * coreProgressVal * 0.42;

        head.node.scale.setScalar(scale);
        head.node.material.opacity = technologyVal * coreProgressVal * (0.58 + pulse * 0.4);
        head.node.position.z = head.baseZ + Math.sin(time * 0.7 + head.phase) * 18;

        const lineData = networkLines[index]!;
        const array = lineData.geometry.attributes.position.array as Float32Array;

        array[0] = 0;
        array[1] = 0;
        array[2] = 0;
        array[3] = head.node.position.x;
        array[4] = head.node.position.y;
        array[5] = head.node.position.z;

        lineData.geometry.attributes.position.needsUpdate = true;
        lineData.material.opacity = 0;
      });
    };

    const updateCore = (
      time: number,
      coreProgressVal: number,
      releaseVal: number,
      worldDelta: number,
    ) => {
      coreMaterial.uniforms.uTime.value = time;
      coreMaterial.uniforms.uOpacity.value = coreProgressVal * (0.5 + releaseVal * 2.1);
      glowMaterial.opacity = coreProgressVal * (0.12 + releaseVal * 0.5);

      coreMesh.rotation.x += worldDelta * 0.75;
      coreMesh.rotation.y += worldDelta;

      coreRings.forEach((ring, index) => {
        ring.material.opacity = coreProgressVal * (0.22 + releaseVal * 0.8);
        ring.rotation.x += worldDelta * (0.08 + index * 0.04);
        ring.rotation.y += worldDelta * (0.12 + index * 0.04);
      });
    };

    const updateExplosion = (releaseVal: number) => {
      const positions = explosionGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < explosionCount; i++) {
        const velocity = explosionVelocity[i]!;
        positions[i * 3] = velocity.x * releaseVal;
        positions[i * 3 + 1] = velocity.y * releaseVal;
        positions[i * 3 + 2] = velocity.z * releaseVal;
      }
      explosionGeometry.attributes.position.needsUpdate = true;
      explosionMaterial.opacity = releaseVal * (1 - releaseVal * 0.35);
    };

    // 12. Main Simulation & Animation Loop
    let startTimestamp: number | null = null;
    const clock = new THREE.Clock();
    clockRef.current = clock;

    const loop = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp;

      const elapsedMs = timestamp - startTimestamp;
      const progressVal = clamp(elapsedMs / CONFIG.duration, 0, 1);
      const time = clock.getElapsedTime();
      const reactive = readAudioReactiveState();
      const cinematicScene = getCinematicScene(progressVal);

      setElapsed(elapsedMs);

      // Hitos narrativos (delta con el ciclo de 52 s)
      const convergenceVal = smoothstep(0.12, 0.43, progressVal);
      const technologyVal = smoothstep(0.35, 0.68, progressVal);
      const coreProgressVal = smoothstep(0.62, 0.84, progressVal);
      const releaseVal = smoothstep(0.86, 0.98, progressVal);

      nebulaMaterial.uniforms.uTime.value = time;
      nebulaMaterial.uniforms.uTechnology.value = technologyVal;
      nebulaMaterial.uniforms.uBass.value = reactive.bass;
      nebulaMaterial.uniforms.uMid.value = reactive.mid;
      nebulaMaterial.uniforms.uTreble.value = reactive.treble;

      starMaterial.uniforms.uBass.value = reactive.bass;

      updateStars(time, convergenceVal, technologyVal, releaseVal);
      updateData(time, technologyVal, coreProgressVal);
      updateComets(time);
      updateNetwork(time, technologyVal, coreProgressVal);

      // Velocidad independiente por escenario (ritmo propio) + world delta
      const sceneSpeed = cinematicScene.orbitSpeed * (1 + reactive.bass * 0.42);
      const worldDelta = clock.getDelta() * sceneSpeed;

      gridGroup.rotation.z += worldDelta * 0.12;
      headGroup.rotation.z += worldDelta * 0.35;

      updateCore(time, coreProgressVal, releaseVal, worldDelta);
      updateExplosion(releaseVal);

      // Rejilla tecnológica
      const targetGridScale = lerp(0.01, 1.0, technologyVal);
      gridGroup.scale.setScalar(THREE.MathUtils.lerp(gridGroup.scale.x, targetGridScale, 0.06));
      gridGroup.position.y = lerp(-500, -270, technologyVal);
      gridMaterial.opacity = THREE.MathUtils.lerp(
        gridMaterial.opacity,
        technologyVal * 0.34 + reactive.mid * 0.12,
        0.08,
      );

      // Escala del núcleo (audiovisual + narrativa)
      const desiredCoreScale =
        lerp(0.001, 1.0, coreProgressVal) *
        (1 + releaseVal * 4.5) *
        (1 + reactive.beat * 0.18);
      coreGroup.scale.setScalar(THREE.MathUtils.lerp(coreGroup.scale.x, desiredCoreScale, 0.08));

      // Rotación y escala del mundo orbital
      const bassScale = 1 + reactive.bass * 0.09;
      cinematicGroup.rotation.y = THREE.MathUtils.lerp(
        cinematicGroup.rotation.y,
        time * cinematicScene.orbitSpeed + progressVal * Math.PI * 2,
        0.025,
      );
      cinematicGroup.rotation.x = THREE.MathUtils.lerp(
        cinematicGroup.rotation.x,
        Math.sin(time * 0.12) * 0.08 + reactive.mid * 0.035,
        0.025,
      );
      cinematicGroup.scale.setScalar(
        THREE.MathUtils.lerp(cinematicGroup.scale.x, bassScale, 0.035),
      );

      // Cámara orbital 360° por escenario
      const sceneLocalProgress = easeInOutCubic(
        inverseLerp(cinematicScene.from, cinematicScene.to, progressVal),
      );
      const sceneCameraZ = lerp(
        cinematicScene.cameraZ[0],
        cinematicScene.cameraZ[1],
        sceneLocalProgress,
      );

      const orbitRadius =
        cinematicScene.orbitRadius + reactive.bass * 22 + reactive.beat * 18;
      const orbitAngle = time * cinematicScene.orbitSpeed + progressVal * Math.PI * 4;

      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        Math.sin(orbitAngle) * orbitRadius,
        CONFIG.cameraSmoothing,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        Math.cos(orbitAngle * 0.72) * cinematicScene.cameraHeight,
        CONFIG.cameraSmoothing,
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        sceneCameraZ + reactive.beat * 16,
        CONFIG.cameraSmoothing,
      );

      // Vibración contenida reactiva al audio
      camera.position.x += Math.sin(time * 18.0) * reactive.bass * 3.5;
      camera.position.y += Math.cos(time * 21.0) * reactive.treble * 1.2;

      camera.lookAt(
        Math.sin(time * 0.18) * 28,
        Math.cos(time * 0.13) * 18,
        Math.cos(time * 0.09) * 8,
      );

      // Bloom dinámico por escenario + audio + clímax
      const releaseBloom = smoothstep(0.86, 0.98, progressVal);
      bloomPass.strength = THREE.MathUtils.lerp(
        bloomPass.strength,
        cinematicScene.bloom + reactive.bass * 0.8 + releaseBloom * 1.35,
        0.08,
      );
      bloomPass.radius = THREE.MathUtils.lerp(
        bloomPass.radius,
        0.72 + reactive.treble * 0.24 + releaseBloom * 0.4,
        0.08,
      );

      // UI status por fases
      if (progressVal < 0.12) {
        setStatusText("Cartografiando campo estelar...");
      } else if (progressVal < 0.27) {
        setStatusText("Primer pulso · sincronizando memoria...");
      } else if (progressVal < 0.43) {
        setStatusText("Construyendo plano tecnológico...");
      } else if (progressVal < 0.6) {
        setStatusText("Sincronizando 12 cabezas cognitivas...");
      } else if (progressVal < 0.76) {
        setStatusText("Consolidando Mnemósine y Tellus...");
      } else if (progressVal < 0.91) {
        setStatusText("Activando núcleo Isabella...");
      } else {
        setStatusText("Transferencia al espacio Isabella...");
      }

      composer.render();

      if (progressVal >= 1.0) {
        finish();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // Resizing boundary (actualiza también el composer)
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);

      const pixelRatio = isMobile ? CONFIG.mobilePixelRatio : CONFIG.maxPixelRatio;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio));
      composer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio));
    };
    window.addEventListener("resize", handleResize);

    // Limpieza de audio WebGL, GPU y contexto
    return () => {
      window.removeEventListener("resize", handleResize);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const audioEngine = audioEngineRef.current;
      if (audioEngine) {
        audioEngine.source.disconnect();
        audioEngine.analyser.disconnect();
        void audioEngine.context.close();
        audioEngineRef.current = null;
      }

      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points ||
          object instanceof THREE.Line
        ) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      composer.dispose();
      renderer.dispose();

      sceneRef.current = null;
      rendererRef.current = null;
      clockRef.current = null;
    };
  }, [started, reduced, finish, readAudioReactiveState]);

  const progress = Math.min(1, elapsed / CONFIG.duration);
  const phase = [...PHASES].reverse().find((p) => elapsed >= p.at * 1000) ?? PHASES[0]!;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden bg-[#01030a] select-none">
      {/* Background Audio */}
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous">
        <source src={BACKGROUND_AUDIO_SRC} type="audio/mpeg" />
      </audio>

      {/* Start screen interaction card */}
      {!started && (
        <div className="absolute inset-0 z-[100] grid place-items-center overflow-hidden bg-[#03060d] p-6">
          <img src="/assets/isabella-intro-backdrop.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-cover opacity-70" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,226,164,0.16),transparent_22%),linear-gradient(180deg,rgba(3,6,13,0.12),rgba(3,6,13,0.82))]" />
          <div className="relative z-10 w-[min(620px,100%)] p-7 text-center border border-white/20 rounded-[30px] bg-slate-950/75 backdrop-blur-2xl shadow-[0_24px_100px_-25px_rgba(125,211,252,0.65)] animate-rise">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-cyan-400/35 bg-sky-950/60 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-[0.18em]">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              Nodo Cero · Inicialización
            </div>
            <img src="/assets/logo-isabella.jpeg" alt="Isabella Villaseñor AI" className="mx-auto mt-5 mb-5 w-[min(440px,92%)] rounded-2xl opacity-100 shadow-[0_0_40px_rgba(255,255,255,0.22)]" />
            <h1 className="mt-3 text-balance text-[32px] sm:text-[46px] font-black text-white leading-none tracking-tight drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]">
              Isabella Villaseñor AI
            </h1>
            <p className="mt-3.5 max-w-[410px] mx-auto text-muted-foreground text-sm leading-relaxed">
              Nacimos para guiar, no para explotar. Una presencia cognitiva soberana para proponer, corregir y evolucionar contigo.
            </p>
            <button
              onClick={() => void startExperience()}
              className="mt-6 appearance-none border-0 rounded-2xl px-7 py-3.5 text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 shadow-lg shadow-cyan-400/20 font-bold text-xs tracking-wider uppercase cursor-pointer hover:translate-y-[-2px] hover:shadow-cyan-400/50 transition-all"
            >
              Iniciar experiencia
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas rendering */}
      {started && !reduced && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      )}

      {/* Cinematic Phase Layout */}
      {started && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <img
            src={logo.url}
            alt="Marca de Isabella Villaseñor"
            className="mb-8 w-[min(380px,72vw)] rounded-2xl opacity-100 mix-blend-screen drop-shadow-[0_0_34px_rgba(255,255,255,0.35)] transition-all"
            style={{ filter: `brightness(${1.05 + progress * 0.25}) contrast(1.08)` }}
          />
          <h2 className="text-iridescent animate-rise font-display text-[28px] sm:text-[42px] leading-tight font-black tracking-tight text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]">
            {phase.title}
          </h2>
          <p className="mt-3 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.32em] text-white/90 max-w-[500px] leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {phase.sub}
          </p>
        </div>
      )}

      {/* UI Controls Footer */}
      {started && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pb-6 sm:px-10">
          <div className="flex-1 max-w-sm">
            <div className="h-[2px] w-full bg-border/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-[width] duration-200"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
              Activación cognitiva {Math.round(progress * 100)}% · {statusText}
            </p>
          </div>
          <button
            onClick={finish}
            className="rounded-xl border border-border/45 bg-slate-950/60 hover:bg-slate-900/80 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground hover:text-pearl transition-all cursor-pointer w-fit self-end sm:self-auto"
          >
            Omitir Intro · Esc
          </button>
        </div>
      )}

      {/* Shading, vignette & whiteout overlays */}
      <div className="absolute inset-0 pointer-events-none vignette z-8 bg-radial-vignette opacity-55" />
      <div className="absolute inset-0 pointer-events-none color-grade z-9 bg-linear-colorgrade opacity-35" />
      <div
        id="whiteout"
        className={`absolute inset-0 z-50 bg-white pointer-events-none transition-opacity duration-[1350ms] ${
          finished ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
