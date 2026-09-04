import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Volume2, VolumeX, SkipForward, Play, Activity } from "lucide-react";

const TARGET_FPS = 60;
const DURATION = 59; // Duración total en segundos

export interface TelemetryPayload {
  elapsed: number;
  progress: number;
  sceneStage: string;
  fps: number;
  droppedFrames: number;
}

interface CinematicIntroProps {
  onComplete: () => void;
  remoteAudioUrl?: string;
  onTelemetryUpdate?: (data: TelemetryPayload) => void;
}

// -----------------------------------------------------------------------------
// 1. MOTOR GRÁFICO WEBGL (Crystal World Engine)
// -----------------------------------------------------------------------------
function CrystalWorldEngine({ progress, masterClock }: { progress: number; masterClock: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Escena y Cámara
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020306");
    scene.fog = new THREE.FogExp2("#020306", 0.0018);

    const camera = new THREE.PerspectiveCamera(
      34,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1600,
    );
    camera.position.set(0, 0, 260);

    // Renderer Optimizado
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    // Geometrías Complejas
    const coreGeo = new THREE.IcosahedronGeometry(54, 4);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#d4af37"), // Elegant Gold Core
      emissive: new THREE.Color("#991b1b"), // Majestic Crimson Glow
      emissiveIntensity: 3.2,
      metalness: 0.9,
      roughness: 0.08,
      transmission: 0.25,
      transparent: true,
      opacity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    world.add(core);

    const shellGeo = new THREE.IcosahedronGeometry(78, 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#e11d48"), // Crimson Lattice
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    world.add(shell);

    const haloGeo = new THREE.TorusGeometry(95, 1.4, 16, 180);
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#f59e0b"), // Golden Ring
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2.6;
    world.add(halo);

    // Sistema de Partículas Volumétricas (Vortex de Energía)
    const particleCount = 3600;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 100 + Math.random() * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Gold to Crimson fire aesthetic
      const color = new THREE.Color();
      if (Math.random() > 0.4) {
        color.setHSL(0.08 + Math.random() * 0.06, 0.95, 0.5 + Math.random() * 0.3); // Gold/Orange
      } else {
        color.setHSL(0.98 + Math.random() * 0.03, 0.95, 0.5 + Math.random() * 0.2); // Red/Rose
      }
      colors.set([color.r, color.g, color.b], i * 3);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Iluminación Dinámica estilo Cinema
    scene.add(new THREE.AmbientLight("#450a0a", 1.5));
    const keyLight = new THREE.PointLight("#fbbf24", 350, 900); // Amber Flashlight
    keyLight.position.set(-200, 150, 250);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight("#e11d48", 380, 800); // Deep Rose rim
    rimLight.position.set(200, -120, 180);
    scene.add(rimLight);

    // Manejo de Redimensionamiento
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(mount);

    // Render Loop con velocidad de warp en la intro
    let animId: number;
    const renderFrame = () => {
      const t = masterClock;

      // Speed up rotation during trailer sequence
      const speedMultiplier = t < 12 ? 4.5 - t * 0.25 : 1.0;

      world.rotation.y = t * 0.25 * speedMultiplier + progress * Math.PI * 2;
      world.rotation.x = Math.sin(t * 0.3) * 0.15;
      shell.rotation.y = -t * 0.15 * speedMultiplier;
      halo.rotation.z = t * 0.2 * speedMultiplier;
      particles.rotation.y = -t * 0.05 * speedMultiplier;

      // Pulse emissive core with time
      coreMat.emissiveIntensity = 2.0 + Math.sin(t * 3) * 1.2;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);

    // Disposición de memoria GPU
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();

      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [progress, masterClock]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}

// SCHEMA SCHEMATICS FOR REPETITIVE CELLS FLICKERING
const SCHEMATIC_FRAGMENTS = [
  "CROWN_ROUTER_MODULE",
  "ISA_EMPATHY_CORE = 1",
  "SOPHIA_RIGOR_ACTIVE",
  "ARGUS_POLICY_VETO",
  "LATAM_AEGIS_X_FIREWALL",
  "SOVEREIGN_LEDGER_LEDG",
  "OIDC_HANDSHAKE_JWT",
  "NODO_CERO_REAL_DEL_MONTE",
  "COGNITION_S0 = READY",
  "SYS_CORES_COUNT = 24",
  "SYS_MODULES_COUNT = 12",
  "PENTACAPA_MEM_ACTIVE",
  "CRYPTO_SEED_GENERATOR",
  "HMAC_SHA256_VERIFIED",
  "ZERO_TRUST_WHITELIST",
  "BOOKPI_MUTATION_BLOCK",
  "AUDIT_RECORD_APPEND",
  "SOVEREIGNTY_GATE_OK",
];

// -----------------------------------------------------------------------------
// 2. COMPONENTE PRINCIPAL (Orquestador Cinematográfico Local)
// -----------------------------------------------------------------------------
export function CinematicIntroContent({
  onComplete,
  remoteAudioUrl = "/assets/background-audio.mp3",
  onTelemetryUpdate,
}: CinematicIntroProps) {
  const [showGate, setShowGate] = useState(true);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [bitrateTelemetry, setBitrateTelemetry] = useState({
    fps: TARGET_FPS,
    droppedFrames: 0,
  });

  // Flicker State for Marvel style panels
  const [flickerIndex, setFlickerIndex] = useState(0);
  const [flickerTrigger, setFlickerTrigger] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clockStartRef = useRef<number>(0);

  // Inicialización del pipeline Web Audio API
  const initAudioPipeline = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      void audioCtxRef.current.resume();
    }
  }, []);

  const enter = useCallback(() => {
    initAudioPipeline();
    setShowGate(false);
    clockStartRef.current = performance.now();

    if (!muted && audioRef.current) {
      audioRef.current.play().catch(() => setMuted(true));
    }
  }, [initAudioPipeline, muted]);

  // Loop principal de animación + Telemetría Federada + Flicker Loop
  useEffect(() => {
    if (showGate) return;

    let animFrame: number;
    let lastTime = performance.now();
    let lastFlicker = performance.now();
    let frameCounter = 0;

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      const currentElapsed = Math.min(DURATION, (now - clockStartRef.current) / 1000);

      setElapsed(currentElapsed);

      // 10Hz Comic cells flickers
      if (now - lastFlicker > 95) {
        setFlickerIndex((prev) => (prev + 1) % SCHEMATIC_FRAGMENTS.length);
        setFlickerTrigger((p) => !p);
        lastFlicker = now;
      }

      frameCounter++;
      if (delta >= 1.0) {
        const measuredFps = Math.round((frameCounter * 1000) / (now - lastTime));
        const dropped = Math.max(0, TARGET_FPS - measuredFps);

        const currentTelemetry = { fps: measuredFps, droppedFrames: dropped };
        setBitrateTelemetry(currentTelemetry);

        // Notificación de Telemetría externa (Callback + Bus de Eventos Federado)
        const progressVal = currentElapsed / DURATION;
        const currentStage =
          currentElapsed < 19
            ? "STAGE 01 · MARVEL THEATRICAL SEQUENCE"
            : currentElapsed < 39
              ? "STAGE 02 · COGNITIVE ARCHITECTURE S0"
              : "STAGE 03 · SOVEREIGN SOBERANÍA REVEAL";

        const payload: TelemetryPayload = {
          elapsed: currentElapsed,
          progress: progressVal,
          sceneStage: currentStage,
          fps: measuredFps,
          droppedFrames: dropped,
        };

        onTelemetryUpdate?.(payload);

        window.dispatchEvent(new CustomEvent("IsabellaTelemetryEvent", { detail: payload }));

        frameCounter = 0;
        lastTime = now;
      }

      if (currentElapsed >= DURATION) {
        onComplete();
      } else {
        animFrame = requestAnimationFrame(tick);
      }
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [showGate, onComplete, onTelemetryUpdate]);

  // Teclas de acceso rápido
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGate && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        enter();
      } else if (!showGate) {
        if (e.key === "Escape") onComplete();
        if (e.key === "m" || e.key === "M") setMuted((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enter, onComplete, showGate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const sceneStage =
    elapsed < 12
      ? "THEATRICAL CINEMATIC SEQUENCE (MARVEL-FLIP)"
      : elapsed < 30
        ? "STAGE 02 · COGNITIVE LANDSCAPE"
        : "STAGE 03 · SOVEREIGN CRYSTAL (REAL DEL MONTE)";

  const progress = elapsed / DURATION;

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#020306] text-platinum select-none font-sans">
      <CrystalWorldEngine progress={progress} masterClock={elapsed} />

      {/* Golden & Crimson Vignette Background Blends */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,3,6,0.35)_55%,rgba(2,3,6,0.95)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(225,29,72,0.06),transparent_50%,rgba(245,158,11,0.08))]" />

      {!showGate && (
        <>
          {/* Header de Telemetría */}
          <header className="absolute inset-x-6 top-6 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-platinum/70">
            <div className="flex items-center gap-3">
              <span className="inline-block size-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{sceneStage}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-3 text-platinum/40">
                <Activity className="size-3.5 text-rose-500" />
                <span>{bitrateTelemetry.fps} FPS</span>
                <span>·</span>
                <span>{bitrateTelemetry.droppedFrames} DROP</span>
              </div>

              <span>
                {Math.floor(elapsed).toString().padStart(2, "0")}:
                {Math.floor((elapsed % 1) * 100)
                  .toString()
                  .padStart(2, "0")}{" "}
                / {DURATION}:00
              </span>

              <button
                onClick={onComplete}
                className="pointer-events-auto flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-platinum hover:bg-white/20 transition-all border border-white/10"
              >
                <SkipForward className="size-3.5" />
                <span>Omitir (Esc)</span>
              </button>
            </div>
          </header>

          {/* ================================================================= */}
          {/* MARVEL INTRO TRAILER DYNAMIC TIMELINE REVEALS                    */}
          {/* ================================================================= */}

          {/* PHASE 1: Marvel Studio Comic Cell Grid Flicker (0s to 4s) */}
          {elapsed < 4 && (
            <div className="absolute inset-0 z-15 flex items-center justify-center bg-black/45 pointer-events-none">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 w-full h-full p-4 opacity-75">
                {Array.from({ length: 12 }).map((_, i) => {
                  const fragmentIndex = (flickerIndex + i) % SCHEMATIC_FRAGMENTS.length;
                  const fragment = SCHEMATIC_FRAGMENTS[fragmentIndex];
                  return (
                    <div
                      key={i}
                      className="border border-rose-500/15 rounded bg-[#110101]/25 p-3 flex flex-col justify-between font-mono text-[8px] text-rose-500 overflow-hidden"
                      style={{ opacity: (flickerTrigger ? 1 : 0.4) + Math.random() * 0.3 }}
                    >
                      <div>
                        <div className="text-[7px] text-amber-500 font-bold mb-1">
                          // CORE_SEC_LOG_M{i + 1}
                        </div>
                        <div className="text-white font-semibold">{fragment}</div>
                        <div className="text-rose-600/60 mt-1 truncate">
                          0x00A39C{fragmentIndex}F019BE24B
                        </div>
                      </div>
                      <div className="flex justify-between border-t border-rose-500/10 pt-1.5 mt-2">
                        <span className="text-[6.5px]">HS256_OK</span>
                        <span className="text-[6.5px] text-amber-400">98.1% ACC</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rhythmic giant center card */}
              <div className="absolute inset-x-4 py-8 bg-rose-600/90 border-y-4 border-amber-500 text-center flex flex-col items-center justify-center shadow-[0_0_80px_rgba(225,29,72,0.8)] animate-scale">
                <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-[0.18em] text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  TAMV NETWORK
                </h1>
                <p className="font-mono text-[10px] sm:text-[12px] uppercase tracking-[0.4em] text-amber-300 mt-2 font-bold">
                  Soberanía Tecnológica Territorial
                </p>
              </div>
            </div>
          )}

          {/* PHASE 2: Epic Cinematic Credits Fade-In (4s to 8s) */}
          {elapsed >= 4 && elapsed < 8 && (
            <div className="absolute inset-0 z-15 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-transparent via-[#020306]/85 to-transparent pointer-events-none animate-fade-in">
              <div className="space-y-4 max-w-2xl">
                <span className="font-mono text-[11px] font-extrabold uppercase tracking-[0.4em] text-rose-500 block">
                  PRESENTA UNA PRODUCCIÓN COGNITIVA S0
                </span>
                <h2 className="font-display text-4xl sm:text-6xl font-black tracking-wider text-pearl bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(245,158,11,0.2)]">
                  ARQUITECTURA MULTIHILO
                </h2>
                <p className="font-mono text-[11px] sm:text-[13px] leading-relaxed text-platinum/70 uppercase tracking-[0.25em] max-w-lg mx-auto">
                  Sincronización digital gobernada de 12 Módulos canónicos y 24 Núcleos de
                  procesamiento.
                </p>
              </div>
            </div>
          )}

          {/* PHASE 3: Isabella Theatrical Logo Reveal with cosmic lens flare (8s to 12s) */}
          {elapsed >= 8 && elapsed < 12 && (
            <div className="absolute inset-0 z-15 flex flex-col items-center justify-center p-6 text-center pointer-events-none animate-reveal">
              {/* Dynamic Lens Flare Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[450px] bg-[radial-gradient(circle,rgba(251,191,36,0.3)_0%,rgba(225,29,72,0.1)_40%,transparent_70%)] rounded-full blur-2xl animate-pulse" />

              <div className="space-y-3 z-10">
                <h1 className="font-display text-6xl sm:text-8xl md:text-9xl font-black tracking-widest text-white drop-shadow-[0_8px_30px_rgba(225,29,72,0.7)]">
                  ISABELLA
                </h1>
                <p className="font-mono text-[12px] sm:text-[14px] font-bold text-amber-400 uppercase tracking-[0.5em]">
                  V4.2.0 · GEMELO COGNITIVO
                </p>
                <div className="h-0.5 w-48 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4" />
                <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest pt-2">
                  Nodo Cero · Real del Monte, Hidalgo, México
                </p>
              </div>
            </div>
          )}

          {/* PHASE 4: Elegant Floating Cinematic Legends during regular show (12s to 30s) */}
          {elapsed >= 12 && elapsed < 35 && (
            <>
              {/* Left Side: General status */}
              <div className="absolute bottom-24 left-6 z-15 max-w-sm font-mono text-[10px] space-y-2 text-platinum/70 bg-black/45 p-5 rounded-2xl border border-rose-500/15 backdrop-blur-md pointer-events-none animate-fade-in shadow-[0_0_25px_rgba(225,29,72,0.1)]">
                <div className="flex items-center gap-2 text-amber-400 font-bold tracking-widest uppercase pb-1.5 border-b border-rose-500/10">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping mr-0.5" />
                  <span>MONITOR COGNITIVO ACTIVO</span>
                </div>
                <div className="space-y-1">
                  <p className="flex justify-between">
                    <span>[FIREWALL] LATAM AEGIS-X:</span>{" "}
                    <span className="text-emerald-400 font-semibold">ARMADO</span>
                  </p>
                  <p className="flex justify-between">
                    <span>[ENTROPY] C.R.O.W.N. SEED:</span>{" "}
                    <span className="text-amber-400 font-semibold font-mono">OK (NON-DET)</span>
                  </p>
                  <p className="flex justify-between">
                    <span>[PERSISTENCE] PENTACAPA SECURE:</span>{" "}
                    <span className="text-emerald-400 font-semibold">ACTIVE</span>
                  </p>
                  <p className="flex justify-between">
                    <span>[INTEGRITY] BOOKPI BLOCKS:</span>{" "}
                    <span className="text-emerald-400 font-semibold">VERIFIED</span>
                  </p>
                </div>
              </div>

              {/* Right Side: High-fidelity boot-up terminal overlay */}
              <div className="absolute top-24 right-6 bottom-24 z-15 w-80 font-mono text-[9px] flex flex-col justify-between bg-black/55 p-5 rounded-2xl border border-amber-500/15 backdrop-blur-md pointer-events-none animate-fade-in shadow-[0_0_25px_rgba(245,158,11,0.08)]">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider pb-2 border-b border-white/5">
                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Sovereign Boot Sequence</span>
                  </div>
                  <div className="space-y-1.5 pt-3 text-platinum/60">
                    <p className="text-amber-300 font-semibold">
                      &gt; Loading 24 execution cores...
                    </p>
                    <div className="grid grid-cols-6 gap-1 py-1">
                      {Array.from({ length: 24 }).map((_, i) => {
                        const state = Math.floor((elapsed * 3 + i) % 11);
                        const col =
                          state > 8 ? "bg-rose-500" : state > 7 ? "bg-amber-400" : "bg-emerald-500";
                        return (
                          <div
                            key={i}
                            className={`h-2 rounded-sm ${col} opacity-75 animate-pulse`}
                            style={{ animationDelay: `${i * 100}ms` }}
                            title={`Core ${i + 1}`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-muted-foreground flex justify-between">
                      <span>Cores ready:</span>{" "}
                      <span className="text-emerald-400 font-bold">24 / 24</span>
                    </p>
                    <div className="h-px bg-white/5 my-2" />
                    <p className="text-emerald-400 font-semibold">
                      &gt; Initializing CROWN policies...
                    </p>
                    <p className="truncate">Policy ID: CROWN-V2-GOV-ZERO-TRUST</p>
                    <p className="truncate">Provenance Anchor: CC BY 4.0 TAMV</p>
                    <p className="truncate">DOI: 10.5281/zenodo.isabella-rdm</p>
                    <p className="text-emerald-400 font-semibold">
                      &gt; Mounting Sovereign Handshake...
                    </p>
                    <p className="text-emerald-400 font-mono">[Handshake] OK: OIDC JWT</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 text-muted-foreground text-[8px] flex justify-between">
                  <span>SEC_LEVEL: LOCK_M3</span>
                  <span className="animate-pulse">RUNNING...</span>
                </div>
              </div>
            </>
          )}

          {/* Timeline progress line */}
          <footer className="absolute inset-x-6 bottom-6 z-20 space-y-2">
            <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 shadow-[0_0_15px_rgba(239,68,68,0.9)] transition-all duration-100 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </footer>
        </>
      )}

      {/* Fuente de Audio */}
      <audio ref={audioRef} src={remoteAudioUrl} loop preload="auto" className="hidden" />

      {/* Landing Gate */}
      {showGate && (
        <section className="absolute inset-0 z-30 flex items-center justify-center bg-[#020306]/95 p-6 backdrop-blur-xl">
          <div className="w-full max-w-[500px] rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-10">
            <div className="mx-auto mb-6 flex size-28 items-center justify-center rounded-2xl border border-white/20 bg-black/50 p-2 shadow-[0_0_60px_rgba(225,29,72,0.35)] animate-pulse">
              <img
                src="/assets/logo-isabella.jpeg"
                alt="Isabella Villaseñor Logo"
                className="size-full rounded-xl object-cover"
              />
            </div>

            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-pearl sm:text-4xl">
              Isabella <span className="text-amber-400 italic">Villaseñor</span>
            </h1>

            <p className="mx-auto mt-3 max-w-sm font-mono text-[11px] leading-relaxed text-muted-foreground">
              Trailer cinematográfico y visualizador de telemetría WebGL de alto rendimiento.
            </p>

            <button
              onClick={enter}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-pearl shadow-lg transition-all hover:scale-[1.02] hover:shadow-red-500/20 active:scale-[0.98] cursor-pointer"
            >
              <Play className="size-4 fill-pearl" />
              VER INTRO CINEMATOGRÁFICA
            </button>

            <div className="mt-4 flex items-center justify-center">
              <button
                onClick={() => setMuted((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:text-pearl transition-colors cursor-pointer"
              >
                {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
                {muted ? "Audio Desactivado" : "Audio Activado"}
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

// -----------------------------------------------------------------------------
// 3. EXPORTACIÓN DIRECTA Y ESTABLE
// -----------------------------------------------------------------------------
export default function CinematicIntro(props: CinematicIntroProps) {
  return <CinematicIntroContent {...props} />;
}
