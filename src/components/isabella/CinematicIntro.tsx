import { useEffect, useRef, useState } from "react";
import logo from "@/assets/logo-isabella.jpeg.asset.json";
import chime from "@/assets/isabella-online-chime.mp3.asset.json";

/**
 * Intro cinematográfico AAA — secuencia de activación cognitiva territorial.
 * Timeline por delta-time (50 s), fallback de movimiento reducido y
 * transición limpia al estado ONLINE.
 */

interface Phase {
  at: number;
  title: string;
  sub: string;
}

const PHASES: Phase[] = [
  { at: 0, title: "Vacío cognitivo", sub: "Nodo Cero · Real del Monte, Hidalgo" },
  { at: 6, title: "Primer pulso", sub: "Sincronizando memoria territorial" },
  { at: 13, title: "C.R.O.W.N.", sub: "Orquestación · Riesgo · Whitelist · Notificación" },
  { at: 20, title: "ISA · SOPHIA · ORION · ARGUS", sub: "Nodos cognitivos en convergencia" },
  { at: 28, title: "Policy Gate", sub: "Zero Trust · soberanía humana verificada" },
  { at: 36, title: "Isabella Villaseñor AI", sub: "Nacimos para guiar, no para explotar" },
  { at: 44, title: "Presencia establecida", sub: "Isabella está en línea" },
];

const DURATION = 50;

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
}
interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: string;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [reduced] = useState(prefersReducedMotion);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  };

  // Chime de activación.
  useEffect(() => {
    const audio = new Audio(chime.url);
    audio.volume = 0.55;
    void audio.play().catch(() => {});
    return () => {
      audio.pause();
    };
  }, []);

  // Esc / clic para saltar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(finish, 2600);
      return () => window.clearTimeout(t);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let time = 0;
    let w = 0;
    let h = 0;

    const stars: Star[] = [];
    const comets: Comet[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 520; i++) {
      stars.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 0.9 + 0.1,
        r: Math.random() * 1.4 + 0.3,
      });
    }

    const spawnComet = () => {
      const fromLeft = Math.random() > 0.5;
      const speed = 220 + Math.random() * 320;
      comets.push({
        x: fromLeft ? -60 : w + 60,
        y: Math.random() * h * 0.8,
        vx: (fromLeft ? 1 : -1) * speed,
        vy: speed * (0.25 + Math.random() * 0.35),
        life: 0,
        max: 2.4,
        hue: Math.random() > 0.5 ? "rgba(56,189,248," : "rgba(226,232,240,",
      });
    };

    let cometTimer = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      setElapsed(time);

      if (time >= DURATION) {
        finish();
        return;
      }

      // Fondo negro profundo con nebulosa petróleo.
      ctx.fillStyle = "#03060b";
      ctx.fillRect(0, 0, w, h);
      const neb = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      const intensity = Math.min(0.5, time / 30);
      neb.addColorStop(0, `rgba(12,74,110,${0.35 * intensity + 0.05})`);
      neb.addColorStop(0.5, `rgba(8,32,54,${0.22 * intensity})`);
      neb.addColorStop(1, "rgba(3,6,11,0)");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, w, h);

      // Campo estelar con paralaje 3D.
      const warp = 1 + Math.pow(Math.min(time / DURATION, 1), 2) * 3.2;
      for (const s of stars) {
        s.z -= dt * 0.035 * warp;
        if (s.z <= 0.05) {
          s.z = 1;
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
        }
        const px = w / 2 + (s.x / s.z) * (w / 2.4);
        const py = h / 2 + (s.y / s.z) * (h / 2.4);
        if (px < -20 || px > w + 20 || py < -20 || py > h + 20) continue;
        const alpha = Math.min(1, (1 - s.z) * 1.5) * 0.9;
        ctx.beginPath();
        ctx.arc(px, py, (s.r * (1.2 - s.z)) / 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226,232,240,${alpha})`;
        ctx.fill();
      }

      // Cometas iridiscentes.
      cometTimer -= dt;
      if (cometTimer <= 0 && time > 4) {
        spawnComet();
        cometTimer = 1.1 + Math.random() * 1.8;
      }
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i]!;
        c.life += dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.life > c.max) {
          comets.splice(i, 1);
          continue;
        }
        const fade = 1 - c.life / c.max;
        const tailX = c.x - c.vx * 0.14;
        const tailY = c.y - c.vy * 0.14;
        const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        grad.addColorStop(0, `${c.hue}${0.85 * fade})`);
        grad.addColorStop(1, `${c.hue}0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      // Anillo cognitivo que se cierra conforme avanza el arranque.
      const progress = time / DURATION;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.28;
      ctx.save();
      ctx.strokeStyle = "rgba(148,163,184,0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(56,189,248,0.85)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 24;
      ctx.shadowColor = "rgba(56,189,248,0.6)";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const phase = [...PHASES].reverse().find((p) => elapsed >= p.at) ?? PHASES[0]!;
  const progress = Math.min(1, elapsed / DURATION);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#03060b]">
      {!reduced && <canvas ref={canvasRef} className="absolute inset-0 size-full" />}

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <img
          key="mark"
          src={logo.url}
          alt="Marca de Isabella Villaseñor AI"
          className="mb-8 w-[min(380px,72vw)] rounded-2xl opacity-90 mix-blend-screen"
          style={{ filter: `brightness(${0.55 + progress * 0.6})` }}
        />
        <p
          key={phase.title}
          className="text-iridescent animate-rise font-display text-[30px] leading-tight tracking-tight sm:text-[46px]"
        >
          {phase.title}
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground sm:text-[11px]">
          {phase.sub}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-6 pb-6 sm:px-10">
        <div className="flex-1">
          <div className="h-px w-full bg-border">
            <div
              className="h-px bg-electric transition-[width] duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            Activación cognitiva {Math.round(progress * 100)}%
          </p>
        </div>
        <button
          onClick={finish}
          className="rounded-lg border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-platinum"
        >
          Saltar intro · Esc
        </button>
      </div>
    </div>
  );
}
