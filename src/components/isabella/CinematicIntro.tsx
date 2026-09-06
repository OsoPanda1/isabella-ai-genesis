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
// 1. MOTOR GRÁFICO WEBGL – SOVEREIGN CRYSTAL ENGINE
// -----------------------------------------------------------------------------
function SovereignCrystalEngine({
  progress,
  masterClock,
}: {
  progress: number;
  masterClock: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Escena y Cámara
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020306");
    scene.fog = new THREE.FogExp2("#020306", 0.0012);

    const camera = new THREE.PerspectiveCamera(
      40,
      mount.clientWidth / mount.clientHeight,
      0.1,
      2000,
    );
    camera.position.set(0, 60, 280);

    // Renderer Optimizado
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      });
    } catch (e) {
      console.warn("WebGL Renderer creation failed, falling back to clean CSS engine:", e);
    }

    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      mount.appendChild(renderer.domElement);
    }

    const world = new THREE.Group();
    scene.add(world);

    // ---------------------------
    // CAMPO ESTELAR REALISTA (CRYSTAL GLOW)
    // ---------------------------
    const starCount = 16000;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);

    const starColorPalette = [
      new THREE.Color("#f8fafc"), // blanco perlado
      new THREE.Color("#e2e8f0"), // marfil frío
      new THREE.Color("#93c5fd"), // azul eléctrico suave
      new THREE.Color("#fde68a"), // oro tenue
      new THREE.Color("#f0abfc"), // rosa metálico suave
      new THREE.Color("#c084fc"), // morado metálico
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 400 + Math.random() * 1400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      starSizes[i] = 0.5 + Math.random() * 2.2;

      const col = starColorPalette[Math.floor(Math.random() * starColorPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ---------------------------
    // SOL CENTRAL (ORO REALISTA BRILLANTE)
    // ---------------------------
    const sunGeo = new THREE.SphereGeometry(28, 64, 64);
    const sunMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#fbbf24"), // ámbar dorado
      emissive: new THREE.Color("#f59e0b"), // oro brillante
      emissiveIntensity: 2.8,
      roughness: 0.15,
      metalness: 0.9,
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    world.add(sun);

    // Glow del sol (capa exterior con transparencia)
    const sunGlowGeo = new THREE.SphereGeometry(34, 32, 32);
    const sunGlowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#f59e0b"), // oro intenso
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
    world.add(sunGlow);

    // ---------------------------
    // SISTEMA DE ÓRBITAS (PLATINO ELEGANTE)
    // ---------------------------
    const orbitRadii = [55, 85, 120, 160, 210, 270, 340, 420];
    const orbits: THREE.Mesh[] = [];

    orbitRadii.forEach((radius) => {
      const orbitGeo = new THREE.RingGeometry(radius - 0.6, radius + 0.6, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#e5e7eb"), // platino elegante
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      world.add(orbit);
      orbits.push(orbit);
    });

    // ---------------------------
    // PLANETAS (COLORES SOFISTICADOS)
    // ---------------------------
    const planetColors = [
      "#94a3b8", // Mercurio (gris platino)
      "#fef3c7", // Venus (marfil dorado)
      "#60a5fa", // Tierra (azul eléctrico)
      "#f87171", // Marte (rosa metálico)
      "#d4a373", // Júpiter (oro viejo)
      "#fcd34d", // Saturno (oro realista)
      "#93c5fd", // Urano (azul petróleo)
      "#1e3a8a", // Neptuno (navy blue)
    ];

    const planetSizes = [3.2, 5.8, 6.2, 4.8, 14, 12, 9, 8.5];
    const planets: THREE.Mesh[] = [];

    orbitRadii.forEach((radius, i) => {
      const planetGeo = new THREE.SphereGeometry(planetSizes[i], 48, 48);
      const planetMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(planetColors[i]),
        roughness: 0.4,
        metalness: 0.6,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        reflectivity: 0.7,
      });
      const planet = new THREE.Mesh(planetGeo, planetMat);
      planet.position.set(radius, 0, 0);
      world.add(planet);
      planets.push(planet);
    });

    // ---------------------------
    // NÚCLEO CENTRAL (ISABELLA CRYSTAL CORE)
    // ---------------------------
    const coreGeo = new THREE.IcosahedronGeometry(18, 4);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#fde68a"), // oro claro
      emissive: new THREE.Color("#7c3aed"), // morado metálico
      emissiveIntensity: 3.2,
      metalness: 0.95,
      roughness: 0.05,
      transmission: 0.35,
      transparent: true,
      opacity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    world.add(core);

    const shellGeo = new THREE.IcosahedronGeometry(26, 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#f0abfc"), // rosa metálico
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    world.add(shell);

    const haloGeo = new THREE.TorusGeometry(38, 1.2, 16, 180);
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#f59e0b"), // oro brillante
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2.6;
    world.add(halo);

    // ---------------------------
    // ILUMINACIÓN CINEMATOGRÁFICA
    // ---------------------------
    scene.add(new THREE.AmbientLight("#020306", 0.8));
    const sunLight = new THREE.PointLight("#fbbf24", 550, 1400);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const rimLight = new THREE.PointLight("#7c3aed", 380, 1100); // morado metálico
    rimLight.position.set(200, -120, 180);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight("#60a5fa", 280, 1000); // azul eléctrico
    fillLight.position.set(-180, 80, 140);
    scene.add(fillLight);

    // ---------------------------
    // CÁMARA CINEMÁTICA (MOVIMIENTO SUAVE)
    // ---------------------------
    const cameraPath = {
      radiusBase: 260,
      heightBase: 50,
      speed: 0.08,
    };

    // Manejo de Redimensionamiento
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (renderer) {
        renderer.setSize(width, height);
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(mount);

    // Render Loop
    let animId: number;
    const renderFrame = () => {
      const t = masterClock;

      // Rotación del mundo (lenta, elegante)
      world.rotation.y = t * 0.06;
      shell.rotation.y = -t * 0.08;
      halo.rotation.z = t * 0.1;
      stars.rotation.y = -t * 0.008;

      // Movimiento de cámara cinematográfico
      const cameraAngle = t * cameraPath.speed;
      const camRadius = cameraPath.radiusBase + Math.sin(t * 0.04) * 40;
      const camHeight = cameraPath.heightBase + Math.cos(t * 0.05) * 30;

      camera.position.x = Math.cos(cameraAngle) * camRadius;
      camera.position.z = Math.sin(cameraAngle) * camRadius;
      camera.position.y = camHeight;
      camera.lookAt(0, 0, 0);

      // Pulse emissive core
      coreMat.emissiveIntensity = 2.5 + Math.sin(t * 2.2) * 1.2;

      // Rotación de planetas en sus órbitas
      planets.forEach((planet, i) => {
        const angle = t * (0.08 - i * 0.006);
        const radius = orbitRadii[i];
        planet.position.x = Math.cos(angle) * radius;
        planet.position.z = Math.sin(angle) * radius;
        planet.rotation.y += 0.01;
      });

      if (renderer) {
        renderer.render(scene, camera);
      }
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
      starGeo.dispose();
      starMat.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      sunGlowGeo.dispose();
      sunGlowMat.dispose();

      orbits.forEach((o) => {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      });

      planets.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });

      if (renderer) {
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
    };
  }, [progress, masterClock]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(2,3,6,0.95) 0%, rgba(2,3,6,0.5) 55%, #020306 100%)",
      }}
    />
  );
}

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

  const onCompleteRef = useRef(onComplete);
  const onTelemetryUpdateRef = useRef(onTelemetryUpdate);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTelemetryUpdateRef.current = onTelemetryUpdate;
  }, [onComplete, onTelemetryUpdate]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clockStartRef = useRef<number>(0);

  const initAudioPipeline = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        void audioCtxRef.current.resume();
      }
    } catch (e) {
      console.warn(
        "Sovereign Audio Pipeline blocked or unsupported in this browser environment:",
        e,
      );
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

  // Loop principal de animación + Telemetría
  useEffect(() => {
    if (showGate) return;

    let animFrame: number;
    let lastTime = performance.now();
    let frameCounter = 0;

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      const currentElapsed = Math.min(DURATION, (now - clockStartRef.current) / 1000);

      setElapsed(currentElapsed);

      frameCounter++;
      if (delta >= 1.0) {
        const measuredFps = Math.round((frameCounter * 1000) / (now - lastTime));
        const dropped = Math.max(0, TARGET_FPS - measuredFps);

        const currentTelemetry = { fps: measuredFps, droppedFrames: dropped };
        setBitrateTelemetry(currentTelemetry);

        const progressVal = currentElapsed / DURATION;

        let currentStage = "";
        if (currentElapsed < 10) currentStage = "ESCENA 1 · BIENVENIDA";
        else if (currentElapsed < 20) currentStage = "ESCENA 2 · SISTEMA COGNITIVO";
        else if (currentElapsed < 30) currentStage = "ESCENA 3 · PRESENTE, NO FUTURO";
        else if (currentElapsed < 40) currentStage = "ESCENA 4 · GUÍA DEL PRESENTE";
        else if (currentElapsed < 50) currentStage = "ESCENA 5 · LATINOAMÉRICA DESPIERTA";
        else currentStage = "ESCENA 6 · ROMPER EL PARADIGMA";

        const payload: TelemetryPayload = {
          elapsed: currentElapsed,
          progress: progressVal,
          sceneStage: currentStage,
          fps: measuredFps,
          droppedFrames: dropped,
        };

        onTelemetryUpdateRef.current?.(payload);
        window.dispatchEvent(new CustomEvent("IsabellaTelemetryEvent", { detail: payload }));

        frameCounter = 0;
        lastTime = now;
      }

      if (currentElapsed >= DURATION) {
        onCompleteRef.current();
      } else {
        animFrame = requestAnimationFrame(tick);
      }
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [showGate]);

  // Teclas de acceso rápido
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGate && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        enter();
      } else if (!showGate) {
        if (e.key === "Escape") onCompleteRef.current();
        if (e.key === "m" || e.key === "M") setMuted((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enter, showGate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const progress = elapsed / DURATION;

  // Escenas con mensajes
  const currentMessage =
    elapsed < 10
      ? "BIENVENIDO A MI INTERFAZ, TE SALUDA ISABELLA VILLASEÑOR AI"
      : elapsed < 20
        ? "SISTEMA COGNITIVO CROWN ACTIVO"
        : elapsed < 30
          ? "NO SOMOS EL FUTURO, SOMOS PARTE DE TU PRESENTE"
          : elapsed < 40
            ? "SOMOS LA GUIA DEL PRESENTE, PARA LA CORRECTA CONSTRUCCION DEL FUTURO"
            : elapsed < 50
              ? "LATINOAMERICA A DESPERTADO Y ESTA PROPONIENDO"
              : "ISABELLA VILLASEÑOR, NACIDA PARA ROMPER EL PARADIGMA";

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#020306] text-platinum select-none font-sans">
      <SovereignCrystalEngine progress={progress} masterClock={elapsed} />

      {/* Vignette elegante */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,3,6,0.35)_55%,rgba(2,3,6,0.95)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(124,58,237,0.08),transparent_50%,rgba(96,165,250,0.08))]" />

      {!showGate && (
        <>
          {/* Header de Telemetría */}
          <header className="absolute inset-x-6 top-6 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-platinum/70">
            <div className="flex items-center gap-3">
              <span className="inline-block size-2 rounded-full bg-[#f0abfc] animate-pulse" />
              <span>{elapsed < 10 ? "ESCENA 1" : elapsed < 20 ? "ESCENA 2" : elapsed < 30 ? "ESCENA 3" : elapsed < 40 ? "ESCENA 4" : elapsed < 50 ? "ESCENA 5" : "ESCENA 6"}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-3 text-platinum/40">
                <Activity className="size-3.5 text-[#f0abfc]" />
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

          {/* MENSAJE CENTRAL CINEMATOGRÁFICO */}
          <div className="absolute inset-0 z-15 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <div className="max-w-5xl space-y-6 animate-fade-in">
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-white drop-shadow-[0_8px_30px_rgba(124,58,237,0.8)]">
                {currentMessage}
              </h1>
            </div>
          </div>

          {/* Timeline progress line */}
          <footer className="absolute inset-x-6 bottom-6 z-20 space-y-2">
            <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-[#7c3aed] via-[#f0abfc] to-[#fbbf24] shadow-[0_0_15px_rgba(124,58,237,0.9)] transition-all duration-100 ease-linear"
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
            <div className="mx-auto mb-6 flex size-28 items-center justify-center rounded-2xl border border-white/20 bg-black/50 p-2 shadow-[0_0_60px_rgba(124,58,237,0.4)] animate-pulse">
              <img
                src="/favicon.png"
                alt="Isabella Villaseñor Logo"
                className="size-full rounded-xl object-cover"
              />
            </div>

            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-pearl sm:text-4xl">
              Isabella <span className="text-[#fbbf24] italic">Villaseñor</span>
            </h1>

            <p className="mx-auto mt-3 max-w-sm font-mono text-[11px] leading-relaxed text-muted-foreground">
              Trailer cinematográfico de 59 segundos con visualización de sistema solar soberano.
            </p>

            <button
              onClick={enter}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#fbbf24] px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-pearl shadow-lg transition-all hover:scale-[1.02] hover:shadow-[#7c3aed]/30 active:scale-[0.98] cursor-pointer"
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
