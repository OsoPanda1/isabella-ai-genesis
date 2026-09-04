import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Volume2, VolumeX } from "lucide-react";

const ISABELLA_VERSION = "4.2.0";
interface CinematicIntroProps {
  onComplete: () => void;
}

/**
 * Secuencia cinematográfica autónoma de Isabella — 59 segundos.
 * -----------------------------------------------------------------
 * Tres escenas canvas ligeras se reproducen por tiempo, con transiciones
 * suaves, parallax procedural, audio iniciado por gesto y fallback accesible.
 * No depende de scroll, assets de video pesados ni APIs de GPU frágiles.
 */

const CINEMATIC_DURATION_SECONDS = 59;
function useAnimatedCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  drawFrame: (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => void,
  progress: number,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(ctx, progress, canvas.clientWidth, canvas.clientHeight);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef, drawFrame, progress]);
}

// Procedural Higgsfield-style hero: medallion 360° spin with studio lighting
function drawHeroSpin(ctx: CanvasRenderingContext2D, p: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const t = p * Math.PI * 2; // 360° over the timed scene
  const scale = 1 + Math.sin(p * Math.PI) * 0.08;
  ctx.fillStyle = "#020208";
  ctx.fillRect(0, 0, w, h);
  // Studio gradient
  const g = ctx.createRadialGradient(cx, cy - h * 0.1, 0, cx, cy, w * 0.9);
  g.addColorStop(0, `rgba(224,187,93,${0.18 + Math.sin(p * Math.PI) * 0.06})`);
  g.addColorStop(0.35, `rgba(56,189,248,${0.14})`);
  g.addColorStop(1, "rgba(2,2,8,1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // Medallion orbit
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.rotate(t);
  // Outer ring
  ctx.strokeStyle = "rgba(224,187,93,0.55)";
  ctx.lineWidth = Math.max(1, w * 0.002);
  ctx.beginPath();
  ctx.arc(0, 0, Math.min(w, h) * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  // Inner medallion (simulated with gradient)
  const rg = ctx.createRadialGradient(-20, -20, 10, 0, 0, Math.min(w, h) * 0.14);
  rg.addColorStop(0, "#fff8e1");
  rg.addColorStop(0.5, "#e0bb5d");
  rg.addColorStop(1, "#8c6a1a");
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.arc(0, 0, Math.min(w, h) * 0.13, 0, Math.PI * 2);
  ctx.fill();
  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.ellipse(-Math.min(w, h) * 0.05, -Math.min(w, h) * 0.06, Math.min(w, h) * 0.04, Math.min(w, h) * 0.025, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Floating particles
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + t * 0.3;
    const r = Math.min(w, h) * (0.22 + (i % 3) * 0.06);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.7 + Math.sin(p * Math.PI * 2 + i) * 8;
    ctx.fillStyle = `rgba(224,187,93,${0.18 + Math.sin(p * 6 + i) * 0.08})`;
    ctx.beginPath();
    ctx.arc(x, y, 1.2 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }
}

// Territorial fly-through: Real del Monte mountains + fog
function drawTerritorialFly(ctx: CanvasRenderingContext2D, p: number, w: number, h: number) {
  const cx = w / 2;
  ctx.fillStyle = "#04060c";
  ctx.fillRect(0, 0, w, h);
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  sky.addColorStop(0, "#0a1220");
  sky.addColorStop(0.5, "#152236");
  sky.addColorStop(1, "#1e3a4a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.68);
  // Mountains parallax (fly-through)
  const layers = [
    { y: h * 0.62, amp: 28, freq: 0.003, alpha: 0.32, color: "#0e1a2e" },
    { y: h * 0.67, amp: 42, freq: 0.002, alpha: 0.55, color: "#12243a" },
    { y: h * 0.73, amp: 58, freq: 0.0015, alpha: 0.9, color: "#1a3450" },
  ];
  const offset = p * w * 0.45; // fly-through
  layers.forEach((layer) => {
    ctx.fillStyle = layer.color;
    ctx.globalAlpha = layer.alpha;
    ctx.beginPath();
    ctx.moveTo(-offset % (w * 0.5), layer.y);
    for (let x = -w * 0.2; x <= w * 1.2; x += 18) {
      const y = layer.y + Math.sin((x + offset) * layer.freq + p) * layer.amp + Math.cos((x + offset) * layer.freq * 1.7) * layer.amp * 0.5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w * 1.2, h);
    ctx.lineTo(-w * 0.2, h);
    ctx.closePath();
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  // Fog
  ctx.fillStyle = `rgba(224,187,93,${0.06 + Math.sin(p * Math.PI) * 0.03})`;
  ctx.fillRect(0, h * 0.58, w, h * 0.18);
  // Coordinates
  ctx.fillStyle = "rgba(224,187,93,0.9)";
  ctx.font = `${Math.max(9, w * 0.011)}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(`20.1406° N �� 98.6719° W · 2,700 msnm — ${(p * 100).toFixed(0)}%`, cx, h * 0.88);
}

// Crystal explode: shards assembling
function drawCrystalExplode(ctx: CanvasRenderingContext2D, p: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h * 0.42;
  ctx.fillStyle = "#020208";
  ctx.fillRect(0, 0, w, h);
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.8);
  bg.addColorStop(0, `rgba(56,189,248,${0.16})`);
  bg.addColorStop(0.5, `rgba(224,187,93,${0.08})`);
  bg.addColorStop(1, "rgba(2,2,8,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  // Shards
  const shardCount = 14;
  for (let i = 0; i < shardCount; i++) {
    const angle = (i / shardCount) * Math.PI * 2 + p * 0.8;
    const dist = (1 - p) * Math.min(w, h) * 0.32 + p * Math.min(w, h) * 0.04;
    const x = cx + Math.cos(angle) * dist + Math.sin(p * 4 + i) * 6;
    const y = cy + Math.sin(angle) * dist * 0.9 + Math.cos(p * 3 + i) * 6;
    const size = Math.min(w, h) * (0.018 + (i % 3) * 0.008);
    const rot = angle + p * Math.PI;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = `rgba(${224 + (i % 3) * 10},${187 + (i % 2) * 20},${80 + i * 4},${0.72 + Math.sin(p * Math.PI) * 0.18})`;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.7, size * 0.6);
    ctx.lineTo(-size * 0.7, size * 0.6);
    ctx.closePath();
    ctx.fill();
    // Glow
    ctx.fillStyle = `rgba(56,189,248,${0.12})`;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Center core
  ctx.fillStyle = `rgba(224,187,93,${0.9 + Math.sin(p * 6) * 0.08})`;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(w, h) * (0.045 + p * 0.012), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(cx - 4, cy - 4, 2, 0, Math.PI * 2);
  ctx.fill();
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const heroRef = useRef<HTMLCanvasElement | null>(null);
  const flyRef = useRef<HTMLCanvasElement | null>(null);
  const explodeRef = useRef<HTMLCanvasElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [showGate, setShowGate] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (showGate) return;
    startedAtRef.current = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(CINEMATIC_DURATION_SECONDS, (now - (startedAtRef.current ?? now)) / 1000);
      setElapsed(next);
      if (next >= CINEMATIC_DURATION_SECONDS) onComplete();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [showGate, onComplete]);

  const phaseProgress = (start: number, end: number) => Math.min(1, Math.max(0, (elapsed - start) / (end - start)));
  useAnimatedCanvas(heroRef, drawHeroSpin, phaseProgress(0, 19));
  useAnimatedCanvas(flyRef, drawTerritorialFly, phaseProgress(19, 39));
  useAnimatedCanvas(explodeRef, drawCrystalExplode, phaseProgress(39, 59));

  const handleEnter = useCallback(() => {
    setShowGate(false);
    // Try autoplay after gesture
    if (audioRef.current && !muted) {
      audioRef.current.play().catch(() => {});
    }
  }, [muted]);

  // Allow Enter/Space to enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && showGate) {
        e.preventDefault();
        handleEnter();
      }
      if (e.key === "Escape" && !showGate) onComplete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showGate, handleEnter, onComplete]);

  return (
    <div className="relative h-dvh overflow-hidden bg-[#020208] text-[#fffefa] selection:bg-[rgba(224,187,93,0.32)]">
      {/* Audio gate — required for autoplay */}
      {showGate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020208]/92 backdrop-blur-[2px] p-6">
          <div className="w-full max-w-[560px] rounded-[24px] border border-[rgba(224,187,93,0.22)] bg-[rgba(14,19,28,0.88)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="mx-auto mb-5 flex size-28 items-center justify-center rounded-[2rem] border border-[#e0bb5d]/35 bg-black/55 p-3 shadow-[0_0_70px_rgba(56,189,248,0.2),inset_0_0_30px_rgba(224,187,93,0.12)] backdrop-blur-xl">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-isabella-lNlesUwDIVsIyjREmgDp8lwcbQ03sg.jpeg" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/assets/logo-isabella.jpeg"; }} alt="Logotipo oficial de Isabella Villaseñor AI" className="size-full rounded-[1.35rem] object-cover" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Nodo Cero — listo</p>
            </div>
            <h1 className="mt-4 font-display text-[28px] font-bold tracking-[-0.02em] text-platinum">
              Isabella <span className="font-serif italic font-normal text-[#e0bb5d]">Villaseñor</span>
            </h1>
            <p className="mt-3 font-mono text-[11px] leading-[1.7] text-muted-foreground">
              Inmersión cinematográfica de 59 segundos — un recorrido visual por la identidad territorial y cognitiva de Isabella Villaseñor AI. Al presionar el botón aceptas los permisos de audio y video inmersivos.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleEnter}
                className="rounded-full bg-[#e0bb5d] px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-[#efd58a] transition"
              >
                INICIAR INMERSIÓN
              </button>
              <button
                onClick={() => setMuted((m) => !m)}
                className="rounded-full border border-border/40 bg-secondary/20 px-4 py-2.5 font-mono text-[11px] text-muted-foreground hover:text-platinum flex items-center gap-1.5"
              >
                {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />} {muted ? "Silenciado" : "Audio sí"}
              </button>
              <span className="font-mono text-[10px] text-muted-foreground">v{ISABELLA_VERSION} · immersive sequence</span>
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element — local bg-audio.mp3, plays only after gesture */}
      <audio ref={audioRef} src="/assets/background-audio.mp3" loop preload="auto" className="hidden" />

      {/* Timeline: 59 seconds of autonomous cinematic immersion. */}
      {!showGate && <div className="pointer-events-none fixed left-6 right-6 top-5 z-30" aria-label={`Intro ${Math.floor(elapsed)} de ${CINEMATIC_DURATION_SECONDS} segundos`}>
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-white/55"><span>Isabella cinematic sequence</span><span>{Math.floor(elapsed).toString().padStart(2, "0")} / {CINEMATIC_DURATION_SECONDS}s</span></div>
        <div className="mt-2 h-px overflow-hidden bg-white/15"><div className="h-full bg-[#e0bb5d] transition-[width] duration-200" style={{ width: `${(elapsed / CINEMATIC_DURATION_SECONDS) * 100}%` }} /></div>
      </div>}

      {/* ========== SECTION 1 — HERO 360° SPIN ========== */}
      <section id="hero" className="absolute inset-0 bg-[#020208] transition-opacity duration-1000" style={{ opacity: elapsed < 19 ? 1 : 0 }}>
        <div className="relative h-full w-full overflow-hidden">
          <canvas ref={heroRef} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <p className="reveal-line font-mono text-[10px] uppercase tracking-[0.38em] text-[#e0bb5d]" data-in="0.12" data-out="0.32">
              Real del Monte · 20.1406° N · 98.6719° W · 2,700 msnm
            </p>
            <h2 className="reveal-line mt-4 font-display text-[42px] font-bold tracking-[-0.03em] text-white sm:text-[64px]" data-in="0.18" data-out="0.38">
              Isabella <span className="font-serif italic font-normal text-[#e0bb5d]">Villaseñor</span>
            </h2>
            <p className="reveal-line mt-3 max-w-[560px] font-mono text-[11px] leading-[1.7] text-white/70" data-in="0.24" data-out="0.44">
              Infraestructura cognitiva territorial — una secuencia visual de precisión, memoria y soberanía.
            </p>
            <div className="reveal-line mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur" data-in="0.32" data-out="0.52">
              <Sparkles className="size-3 text-[#e0bb5d]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">Génesis Soberana · Secuencia automática</span>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-white/40">
            <span>01 / 03 · HERO SPIN</span>
            <span>19 segundos · render procedural</span>
          </div>
        </div>
      </section>

      {/* ========== SECTION 2 — TERRITORIAL FLY-THROUGH ========== */}
      <section id="territorial" className="absolute inset-0 bg-[#04060c] transition-opacity duration-1000" style={{ opacity: elapsed >= 19 && elapsed < 39 ? 1 : 0 }}>
        <div className="relative h-full w-full overflow-hidden">
          <canvas ref={flyRef} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <p className="reveal-line font-mono text-[10px] uppercase tracking-[0.32em] text-[#38bdf8]" data-in="0.14" data-out="0.36">
              Territorio · Vuelo rasante
            </p>
            <h2 className="reveal-line mt-3 font-display text-[34px] font-bold tracking-[-0.02em] text-white sm:text-[52px]" data-in="0.20" data-out="0.42">
              Vuela sobre <span className="text-[#38bdf8]">Real del Monte</span>
            </h2>
            <p className="reveal-line mt-3 max-w-[560px] font-mono text-[11px] leading-[1.7] text-white/70" data-in="0.26" data-out="0.48">
              Un vuelo territorial en tres capas de profundidad, diseñado para una reproducción fluida y autónoma.
            </p>
            <div className="reveal-line mt-6 grid grid-cols-3 gap-3 max-w-[520px] w-full" data-in="0.34" data-out="0.58">
              {[
                { k: "Nodo", v: "Cero" },
                { k: "Altitud", v: "2,700m" },
                { k: "Latencia", v: "<50ms" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">{s.k}</p>
                  <p className="font-mono text-[13px] font-bold text-white">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-white/40">
            <span>02 / 03 · FLY-THROUGH</span>
            <span>ffmpeg extract 180 · compress q88</span>
          </div>
        </div>
      </section>

      {/* ========== SECTION 3 — CRYSTAL EXPLODE ========== */}
      <section id="crystal" className="absolute inset-0 bg-[#020208] transition-opacity duration-1000" style={{ opacity: elapsed >= 39 ? 1 : 0 }}>
        <div className="relative h-full w-full overflow-hidden">
          <canvas ref={explodeRef} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <p className="reveal-line font-mono text-[10px] uppercase tracking-[0.32em] text-[#e0bb5d]" data-in="0.16" data-out="0.38">
              Soberanía · Cristal
            </p>
            <h2 className="reveal-line mt-3 font-display text-[34px] font-bold tracking-[-0.02em] text-white sm:text-[52px]" data-in="0.22" data-out="0.44">
              El cristal <span className="font-serif italic font-normal text-[#e0bb5d]">explota y se ensambla</span>
            </h2>
            <p className="reveal-line mt-3 max-w-[560px] font-mono text-[11px] leading-[1.7] text-white/70" data-in="0.28" data-out="0.50">
              El cristal se dispersa y vuelve a ensamblarse: una metáfora visual de coordinación, trazabilidad y soberanía.
            </p>
            <button
              onClick={onComplete}
              className="reveal-line pointer-events-auto mt-7 rounded-full bg-[#e0bb5d] px-7 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-[#efd58a] transition shadow-[0_8px_24px_rgba(224,187,93,0.28)]"
              data-in="0.42"
              data-out="0.72"
            >
              Entrar a Isabella — Nodo Cero
            </button>
            <p className="reveal-line mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40" data-in="0.48" data-out="0.78">
              ESC para omitir · la inmersión se reproduce automáticamente
            </p>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-white/40">
            <span>03 / 03 · CRYSTAL EXPLODE</span>
            <span>v{ISABELLA_VERSION} · Higgsfield MCP</span>
          </div>
        </div>
      </section>

    </div>
  );
}
