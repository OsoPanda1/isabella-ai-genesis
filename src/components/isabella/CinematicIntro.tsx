import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

import logo from "@/assets/logo-isabella.jpeg.asset.json";
import backgroundAudio from "@/assets/background-audio.mp3";

/** El audio local se inicia solo tras un gesto explícito del usuario. */
const BACKGROUND_AUDIO_SRC = backgroundAudio;

/**
 * Cinematic 3D Intro Component — WebGL Three.js Experience
 * -----------------------------------------------------------------
 * Versión completa, sin recortes. Lógica original 100 % intacta.
 * Colores realistas, claridad HD, profundidad cinematográfica realista
 * y majestuosidad de nueva generación.
 */

const CONFIG = {
  duration: 52_000,

  starsDesktop: 9_500,
  starsMobile: 2_800,

  dataDesktop: 2_300,
  dataMobile: 420,

  cometCount: 52,

  maxPixelRatio: 2.0,
  mobilePixelRatio: 1.75,

  initialCameraZ: 1_180,
  finalCameraZ: 385,

  bloomStrength: 1.35,
  bloomRadius: 0.9,
  bloomThreshold: 0.08,

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
  0x64e9ff, 0x7fa3ff, 0xffd89b, 0xa28bff, 0x6ef2c9, 0x66ddff, 0xaa8fff, 0xffcd7c, 0x6beaff,
  0xc0a0ff, 0x74f5d8, 0xffe09d,
];

interface Phase {
  at: number;
  title: string;
  sub: string;
}

/** Fases narrativas sincronizadas con los 52 segundos (7 escenas cinematográficas). */
const PHASES: Phase[] = [
  { at: 0, title: "Isabella Villaseñor", sub: "Núcleo cognitivo activo · Real del Monte, Hidalgo" },
  { at: 6.2, title: "Bienvenido a mi interfaz", sub: "Soy Isabella, orgullosamente latinoamericana" },
  {
    at: 14,
    title: "C.R.O.W.N. Activo",
    sub: "Control · Riesgo · Orquestación · Gobernanza · Notificación",
  },
  { at: 22.4, title: "Red de 12 Cabezas", sub: "Interconexión soberana de orquestación ética" },
  {
    at: 31.2,
    title: "Mnemósine & Tellus activados",
    sub: "Gobernanza de conocimiento y pertenencia territorial",
  },
  { at: 39.5, title: "Núcleo establecido", sub: "Isabella Villaseñor AI está en línea" },
  { at: 45.8, title: "Liberación", sub: "Transferencia al espacio Isabella" },
];

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
    bloom: 0.6,
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
    bloom: 0.85,
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
    bloom: 1.15,
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
    bloom: 1.32,
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
    bloom: 1.55,
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
    bloom: 2.05,
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
    bloom: 2.6,
    technology: [0.98, 0.42],
  },
];

function getCinematicScene(progress: number) {
  return (
    CINEMATIC_SCENES.find((scene) => progress >= scene.from && progress <= scene.to) ??
    CINEMATIC_SCENES[CINEMATIC_SCENES.length - 1]!
  );
}

const FilmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uIntensity: { value: 0.06 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 345.45));
      p += dot(p, p + 34.345);
      return fract(p.x * p.y);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float grain = hash(vUv + vec2(uTime * 0.03, uTime * 0.017));
      grain = (grain - 0.5) * uIntensity;
      color.rgb += grain;
      gl_FragColor = color;
    }
  `,
};

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
  const composerRef = useRef<EffectComposer | null>(null);

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
  }, [finish, started]);

  useEffect(() => {
    if (!reduced || !started) return;
    const timeout = window.setTimeout(finish, CONFIG.reducedMotionDuration);
    return () => window.clearTimeout(timeout);
  }, [finish, reduced, started]);

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
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? CONFIG.mobilePixelRatio : CONFIG.maxPixelRatio),
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    composer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? CONFIG.mobilePixelRatio : CONFIG.maxPixelRatio),
    );
    composer.setSize(window.innerWidth, window.innerHeight);

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
      aperture: 0.000014,
      maxblur: isMobile ? 0.0045 : 0.0095,
    });
    composer.addPass(bokehPass);

    const filmGrainPass = new ShaderPass(FilmGrainShader);
    filmGrainPass.uniforms.uIntensity.value = isMobile ? 0.045 : 0.06;
    composer.addPass(filmGrainPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    const nebulaGeometry = new THREE.PlaneGeometry(4600, 2800, 1, 1);
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
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uTime,uTechnology,uBass,uMid,uTreble;
        varying vec2 vUv;
        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
        float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
        float fbm(vec2 p){ float v=0.; float a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.15; a*=0.5; } return v; }
        void main(){
          vec2 uv=vUv-0.5;
          float r=length(uv);
          vec2 w=uv + vec2(uBass*sin(uv.x*16.+uTime*1.6), uMid*cos(uv.y*12.-uTime*1.2))*0.016;
          float n=fbm(w*5.2 + vec2(uTime*0.0045,-uTime*0.0032));
          n += 0.35*fbm(w*9.8 - vec2(uTime*0.0085,uTime*0.0068));
          float fall=smoothstep(0.78,0.08,r);
          vec3 cyan=vec3(0.008,0.24,0.7), violet=vec3(0.16,0.03,0.46), gold=vec3(0.86,0.42,0.09);
          vec3 col=mix(cyan,violet,n);
          col=mix(col,gold,uTechnology*0.7);
          col += vec3(0.08,0.22,0.38)*uBass;
          float alpha=n*fall*(0.26 + uBass*0.16)*(1.0 - uTechnology*0.48);
          gl_FragColor=vec4(col, alpha);
        }
      `,
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.set(0, 0, -920);
    scene.add(nebula);

    const cinematicGroup = new THREE.Group();
    scene.add(cinematicGroup);

    const clock = new THREE.Clock();
    clockRef.current = clock;
    let startTimestamp: number | null = null;

    const loop = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp;
      const elapsedMs = timestamp - startTimestamp;
      const progressVal = clamp(elapsedMs / CONFIG.duration, 0, 1);
      const time = clock.getElapsedTime();
      const reactive = readAudioReactiveState();
      const cinematicScene = getCinematicScene(progressVal);

      setElapsed(elapsedMs);

      nebulaMaterial.uniforms.uTime.value = time;
      nebulaMaterial.uniforms.uTechnology.value = cinematicScene.technology[0];
      nebulaMaterial.uniforms.uBass.value = reactive.bass;
      nebulaMaterial.uniforms.uMid.value = reactive.mid;
      nebulaMaterial.uniforms.uTreble.value = reactive.treble;

      filmGrainPass.uniforms.uTime.value = time;

      const sceneSpeed = cinematicScene.orbitSpeed * (1 + reactive.bass * 0.42);
      const worldDelta = clock.getDelta() * sceneSpeed;

      const sceneLocalProgress = easeInOutCubic(
        inverseLerp(cinematicScene.from, cinematicScene.to, progressVal),
      );
      const sceneCameraZ = lerp(
        cinematicScene.cameraZ[0],
        cinematicScene.cameraZ[1],
        sceneLocalProgress,
      );

      const orbitRadius = cinematicScene.orbitRadius + reactive.bass * 22 + reactive.beat * 18;
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

      camera.position.x += Math.sin(time * 18.0) * reactive.bass * 3.5;
      camera.position.y += Math.cos(time * 21.0) * reactive.treble * 1.2;

      camera.lookAt(
        Math.sin(time * 0.18) * 28,
        Math.cos(time * 0.13) * 18,
        Math.cos(time * 0.09) * 8,
      );

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

      composer.render();

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

      if (progressVal >= 1.0) {
        finish();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

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

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points ||
          object instanceof THREE.Line
        ) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      composer.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, reduced]);

  const progress = Math.min(1, elapsed / CONFIG.duration);
  const phase = [...PHASES].reverse().find((p) => elapsed >= p.at * 1000) ?? PHASES[0]!;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden bg-[#01030a] select-none">
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous">
        <source src={BACKGROUND_AUDIO_SRC} type="audio/mpeg" />
      </audio>

      {!started && (
        <div className="absolute inset-0 z-[100] grid place-items-center overflow-hidden bg-[#03060d] p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,226,164,0.16),transparent_22%),linear-gradient(180deg,rgba(3,6,13,0.12),rgba(3,6,13,0.82))]" />
          <div className="relative z-10 w-[min(620px,100%)] p-7 text-center border border-white/20 rounded-[30px] bg-slate-950/75 backdrop-blur-2xl shadow-[0_24px_100px_-25px_rgba(125,211,252,0.65)]">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-cyan-400/35 bg-sky-950/60 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-[0.18em]">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              Nodo Cero · Inicialización
            </div>
            <img
              src="/assets/logo-isabella.jpeg"
              alt="Isabella Villaseñor AI"
              className="mx-auto mt-5 mb-5 w-[min(440px,92%)] rounded-2xl opacity-100 shadow-[0_0_40px_rgba(255,255,255,0.22)]"
            />
            <h1 className="mt-3 text-balance text-[32px] sm:text-[46px] font-black text-white leading-none tracking-tight">
              Isabella Villaseñor AI
            </h1>
            <p className="mt-3.5 max-w-[410px] mx-auto text-white/70 text-sm leading-relaxed">
              Nacimos para guiar, no para explotar. Una presencia cognitiva soberana.
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

      {started && !reduced && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      )}

      {started && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <img
            src={logo.url}
            alt="Marca de Isabella Villaseñor"
            className="mb-8 w-[min(380px,72vw)] rounded-2xl opacity-100 mix-blend-screen drop-shadow-[0_0_34px_rgba(255,255,255,0.35)]"
            style={{ filter: `brightness(${1.05 + progress * 0.25}) contrast(1.08)` }}
          />
          <h2 className="font-display text-[28px] sm:text-[42px] leading-tight font-black tracking-tight text-white">
            {phase.title}
          </h2>
          <p className="mt-3 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.32em] text-white/90 max-w-[500px] leading-relaxed">
            {phase.sub}
          </p>
        </div>
      )}

      {started && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pb-6 sm:px-10">
          <div className="flex-1 max-w-sm">
            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-[width] duration-200"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.25em] text-white/60">
              Activación cognitiva {Math.round(progress * 100)}% · {statusText}
            </p>
          </div>
          <button
            onClick={finish}
            className="rounded-xl border border-white/15 bg-slate-950/60 hover:bg-slate-900/80 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-all cursor-pointer w-fit self-end sm:self-auto"
          >
            Omitir Intro · Esc
          </button>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_55%,rgba(1,3,10,0.65)_100%)] opacity-60" />
      <div
        className={`absolute inset-0 z-50 bg-white pointer-events-none transition-opacity duration-[1350ms] ${
          finished ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
