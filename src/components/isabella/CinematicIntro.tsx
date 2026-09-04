import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Volume2, VolumeX } from "lucide-react";

const DURATION = 59;

interface CinematicIntroProps {
  onComplete: () => void;
}

function CrystalWorld({ progress }: { progress: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080b12");
    scene.fog = new THREE.FogExp2("#080b12", 0.0018);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 1600);
    camera.position.set(0, 0, 260);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(54, 4),
      new THREE.MeshPhysicalMaterial({ color: "#b7c6dc", emissive: "#284a78", emissiveIntensity: 1.7, metalness: 0.72, roughness: 0.18, transmission: 0.22, transparent: true, opacity: 0.92 })
    );
    world.add(core);
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(76, 2),
      new THREE.MeshBasicMaterial({ color: "#6fbcff", wireframe: true, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending })
    );
    world.add(shell);
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(92, 0.9, 12, 160),
      new THREE.MeshBasicMaterial({ color: "#b9a6ff", transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending })
    );
    halo.rotation.x = Math.PI / 2.8;
    world.add(halo);

    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 110 + Math.random() * 470;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      const color = new THREE.Color().setHSL(0.58 + Math.random() * 0.16, 0.65, 0.63 + Math.random() * 0.25);
      colors.set([color.r, color.g, color.b], i * 3);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ size: 1.8, vertexColors: true, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
    scene.add(particles);

    scene.add(new THREE.AmbientLight("#9bb9dc", 1.4));
    const key = new THREE.PointLight("#8ac8ff", 170, 700); key.position.set(-180, 130, 220); scene.add(key);
    const rim = new THREE.PointLight("#aa9aff", 190, 600); rim.position.set(180, -100, 160); scene.add(rim);
    const warm = new THREE.PointLight("#d5e4ff", 90, 500); warm.position.set(0, 160, -100); scene.add(warm);

    const resize = () => { const width = mount.clientWidth; const height = mount.clientHeight; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); };
    const observer = new ResizeObserver(resize); observer.observe(mount);
    let frame = 0;
    const animate = (time: number) => { world.rotation.y = time * 0.00012 + progress * Math.PI * 1.7; world.rotation.x = Math.sin(time * 0.00018) * 0.12; shell.rotation.y = -time * 0.00008; halo.rotation.z = time * 0.00016; particles.rotation.y = -time * 0.000025; renderer.render(scene, camera); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); renderer.dispose(); particleGeometry.dispose(); mount.removeChild(renderer.domElement); };
  }, [progress]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [showGate, setShowGate] = useState(true);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const enter = useCallback(() => {
    setShowGate(false);
    if (!muted) void audioRef.current?.play().catch(() => undefined);
  }, [muted]);

  useEffect(() => {
    if (showGate) return;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => { const value = Math.min(DURATION, (now - started) / 1000); setElapsed(value); if (value >= DURATION) onComplete(); else frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [showGate, onComplete]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (showGate && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); enter(); } if (!showGate && event.key === "Escape") onComplete(); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [enter, onComplete, showGate]);

  const scene = elapsed < 19 ? "ORIGIN FIELD" : elapsed < 39 ? "TERRITORIAL MEMORY" : "SOVEREIGN CRYSTAL";
  const progress = elapsed / DURATION;
  return (
    <main className="relative h-dvh overflow-hidden bg-[#080b12] text-platinum">
      <CrystalWorld progress={progress} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,11,18,0.2)_42%,rgba(8,11,18,0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(111,188,255,0.06),transparent_38%,rgba(170,154,255,0.07))]" />
      {!showGate && <div className="absolute inset-x-6 top-6 z-20 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.26em] text-platinum/60"><span>Isabella Villaseñor AI · {scene}</span><span>{Math.floor(elapsed).toString().padStart(2, "0")} / 59</span></div>}
      {!showGate && <div className="absolute inset-x-6 bottom-6 z-20"><div className="h-px bg-platinum/20"><div className="h-full bg-electric shadow-[0_0_14px_rgba(111,188,255,0.9)] transition-[width] duration-200" style={{ width: `${progress * 100}%` }} /></div></div>}
      <audio ref={audioRef} src="/assets/background-audio.mp3" loop preload="auto" className="hidden" />
      {showGate && <section className="absolute inset-0 z-30 flex items-center justify-center bg-[#080b12]/88 p-6 backdrop-blur-md" aria-label="Iniciar inmersión">
        <div className="crystal-3d crystal-3d-electric w-full max-w-[520px] rounded-[2rem] p-8 text-center shadow-[0_0_80px_rgba(111,188,255,0.16)] sm:p-10">
          <div className="mx-auto mb-7 flex size-32 items-center justify-center rounded-[2rem] border border-platinum/20 bg-[#080b12]/70 p-3 shadow-[0_0_45px_rgba(111,188,255,0.34),0_0_90px_rgba(170,154,255,0.14)]"><img src="/assets/logo-isabella.jpeg" alt="Logotipo oficial de Isabella Villaseñor AI" className="size-full rounded-[1.35rem] object-cover" /></div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-electric">Nodo Cero · sistema listo</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-pearl sm:text-5xl">Isabella <span className="text-iridescent italic">Villaseñor</span></h1>
          <p className="mx-auto mt-4 max-w-md font-mono text-[11px] leading-6 text-muted-foreground">Una inmersión audiovisual de 59 segundos en una inteligencia soberana, territorial y humana.</p>
          <button onClick={enter} className="crystal-3d crystal-3d-electric mt-8 w-full rounded-2xl px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-pearl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric">INICIAR INMERSIÓN</button>
          <div className="mt-4 flex items-center justify-center gap-3"><button onClick={() => setMuted((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-border/40 px-3 py-2 font-mono text-[10px] text-muted-foreground hover:text-pearl">{muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}{muted ? "Audio silenciado" : "Audio activo"}</button></div>
          <p className="mt-5 font-mono text-[9px] leading-5 text-muted-foreground/80">Al presionar el botón aceptas los permisos de audio y video inmersivos.</p>
        </div>
      </section>}
    </main>
  );
}
