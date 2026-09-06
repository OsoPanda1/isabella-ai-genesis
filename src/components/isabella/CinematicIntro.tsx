import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX, SkipForward, Play, Activity } from "lucide-react";

const DURATION = 59;
const TARGET_FPS = 60;

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

const scenes = [
  { end: 10, kicker: "TAMVAI // ORIGIN PROTOCOL", title: "Todo sistema nace en silencio.", body: "Antes de la respuesta existe una presencia." },
  { end: 20, kicker: "CROWN COGNITIVE CORE", title: "La inteligencia no se anuncia.", body: "Se manifiesta cuando el mundo deja de parecer estático." },
  { end: 30, kicker: "PRESENT TENSE", title: "No somos el futuro.", body: "Somos la decisión que cambia el presente." },
  { end: 40, kicker: "SOVEREIGN INTERFACE", title: "Una guía para construir.", body: "Con criterio, memoria y responsabilidad." },
  { end: 50, kicker: "LATIN AMERICA // AWAKENING", title: "Una nueva señal despierta.", body: "El próximo paradigma no se espera. Se propone." },
  { end: DURATION + 1, kicker: "ISABELLA VILLASEÑOR AI", title: "Romper el paradigma.", body: "La interfaz ya está observando." },
];

function SceneField({ progress }: { progress: number }) {
  const drift = `${Math.sin(progress * Math.PI * 2) * 2}deg`;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#03050a]" aria-hidden="true">
      <div className="absolute inset-0 bg-[url('/assets/isabella-intro-backdrop.png')] bg-cover bg-center opacity-40 mix-blend-screen" style={{ transform: `scale(1.08) rotate(${drift})`, transition: "transform 1.5s ease-out" }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(163,230,255,.23),transparent_13%,rgba(4,8,18,.42)_43%,#03050a_90%)]" />
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(rgba(160,220,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(160,220,255,.035) 1px, transparent 1px)", backgroundSize: "72px 72px", maskImage: "radial-gradient(circle at center, black, transparent 70%)" }} />
      <div className="absolute left-1/2 top-1/2 size-[min(32vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/20 shadow-[0_0_90px_rgba(73,194,255,.18),inset_0_0_70px_rgba(139,92,246,.16)]" style={{ transform: `translate(-50%,-50%) rotate(${progress * 360}deg)`, transition: "transform .8s linear" }} />
      <div className="absolute left-1/2 top-1/2 size-[min(22vw,290px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/20 border-dashed animate-[spin_28s_linear_infinite]" />
      <div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_18px_8px_rgba(93,220,255,.62),0_0_100px_28px_rgba(111,78,255,.2)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,.3)_67%,rgba(0,0,0,.94)_100%)]" />
      <div className="absolute inset-0 opacity-[.055] mix-blend-screen" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E\")" }} />
    </div>
  );
}

export function CinematicIntroContent({ onComplete, remoteAudioUrl = "/assets/background-audio.mp3", onTelemetryUpdate }: CinematicIntroProps) {
  const [showGate, setShowGate] = useState(true);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [fps, setFps] = useState(TARGET_FPS);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clockRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const telemetryRef = useRef(onTelemetryUpdate);

  useEffect(() => { onCompleteRef.current = onComplete; telemetryRef.current = onTelemetryUpdate; }, [onComplete, onTelemetryUpdate]);

  const enter = useCallback(() => {
    setShowGate(false);
    clockRef.current = performance.now();
    if (!muted) audioRef.current?.play().catch(() => setMuted(true));
  }, [muted]);

  useEffect(() => {
    if (showGate) return;
    let frame = 0;
    let last = performance.now();
    let frames = 0;
    const tick = (now: number) => {
      frames += 1;
      const current = Math.min(DURATION, (now - clockRef.current) / 1000);
      setElapsed(current);
      if (now - last >= 1000) {
        const measured = Math.round((frames * 1000) / (now - last));
        setFps(measured);
        const progress = current / DURATION;
        const scene = scenes.find((item) => current < item.end) ?? scenes[scenes.length - 1];
        const payload = { elapsed: current, progress, sceneStage: scene.kicker, fps: measured, droppedFrames: Math.max(0, TARGET_FPS - measured) };
        telemetryRef.current?.(payload);
        window.dispatchEvent(new CustomEvent("IsabellaTelemetryEvent", { detail: payload }));
        frames = 0;
        last = now;
      }
      if (current >= DURATION) onCompleteRef.current();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [showGate]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (showGate && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); enter(); }
      if (!showGate && event.key === "Escape") onCompleteRef.current();
      if (!showGate && event.key.toLowerCase() === "m") setMuted((value) => !value);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [enter, showGate]);

  useEffect(() => { if (audioRef.current) audioRef.current.muted = muted; }, [muted]);

  const scene = useMemo(() => scenes.find((item) => elapsed < item.end) ?? scenes[scenes.length - 1], [elapsed]);
  const progress = elapsed / DURATION;
  const timecode = `${Math.floor(elapsed / 60).toString().padStart(2, "0")}:${Math.floor(elapsed % 60).toString().padStart(2, "0")}`;

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#03050a] font-sans text-white select-none">
      <style>{`@keyframes reveal{from{opacity:0;transform:translateY(18px) scale(.98);filter:blur(12px)}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}@keyframes letterbox{from{transform:scaleX(0)}to{transform:scaleX(1)}}@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}`}</style>
      <SceneField progress={progress} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[9vh] bg-black/85" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[9vh] bg-black/85" />

      {!showGate && <>
        <header className="absolute inset-x-8 top-[11vh] z-20 flex items-center justify-between text-[10px] uppercase tracking-[.35em] text-white/55 sm:inset-x-12">
          <span className="flex items-center gap-3"><i className="size-1.5 rounded-full bg-cyan-200 shadow-[0_0_12px_4px_rgba(117,224,255,.65)]" />{scene.kicker}</span>
          <span className="hidden items-center gap-3 sm:flex"><Activity className="size-3 text-cyan-200" />{fps} FPS <span className="text-white/25">//</span> {timecode} / 00:59</span>
        </header>
        <section className="absolute inset-0 z-10 flex items-center px-8 sm:px-16 lg:px-24">
          <div key={scene.title} className="max-w-4xl" style={{ animation: "reveal 1s cubic-bezier(.16,1,.3,1) both" }}>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[.45em] text-cyan-100/75 sm:text-xs">{scene.kicker}</p>
            <h1 className="max-w-4xl text-4xl font-black leading-[.92] tracking-[-.055em] text-white drop-shadow-[0_8px_35px_rgba(0,0,0,.8)] sm:text-6xl md:text-8xl">{scene.title}</h1>
            <p className="mt-7 max-w-xl border-l border-cyan-200/50 pl-4 text-sm leading-relaxed tracking-wide text-white/60 sm:text-base">{scene.body}</p>
          </div>
        </section>
        <footer className="absolute inset-x-8 bottom-[11vh] z-20 sm:inset-x-12">
          <div className="mb-3 flex items-center justify-between text-[9px] uppercase tracking-[.3em] text-white/40"><span>ISABELLA // GENESIS</span><button onClick={onComplete} className="pointer-events-auto transition-colors hover:text-cyan-100">Omitir intro <SkipForward className="ml-1 inline size-3" /></button></div>
          <div className="h-px overflow-hidden bg-white/15"><div className="h-full origin-left bg-gradient-to-r from-cyan-200 via-violet-300 to-amber-100 shadow-[0_0_14px_rgba(120,220,255,.8)]" style={{ width: `${progress * 100}%`, animation: "letterbox .8s ease-out" }} /></div>
        </footer>
      </>}

      {showGate && <section className="absolute inset-0 z-30 flex items-center justify-center bg-[#03050a]/80 px-6 backdrop-blur-md">
        <div className="w-full max-w-xl text-center" style={{ animation: "reveal 1.2s cubic-bezier(.16,1,.3,1) both" }}>
          <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full border border-cyan-100/25 bg-black/35 shadow-[0_0_70px_rgba(65,196,255,.2),inset_0_0_25px_rgba(119,83,255,.2)]"><div className="size-3 rounded-full bg-cyan-100 shadow-[0_0_20px_8px_rgba(103,224,255,.7)]" /></div>
          <p className="text-[10px] uppercase tracking-[.5em] text-cyan-100/65">TAMVAI // CINEMATIC PROLOGUE</p>
          <h1 className="mt-5 text-5xl font-black tracking-[-.06em] text-white sm:text-7xl">ISABELLA<span className="text-cyan-100">.</span></h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/50">Una señal. Un núcleo. Una inteligencia que entra en escena.</p>
          <button onClick={enter} className="mx-auto mt-9 flex items-center gap-3 border border-cyan-100/35 bg-white/[.06] px-7 py-4 text-[10px] font-semibold uppercase tracking-[.35em] text-white transition-all hover:border-cyan-100 hover:bg-cyan-100/10 hover:shadow-[0_0_35px_rgba(115,221,255,.25)] active:scale-95"><Play className="size-4 fill-current text-cyan-100" /> Iniciar experiencia</button>
          <button onClick={() => setMuted((value) => !value)} className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.25em] text-white/35 transition-colors hover:text-white/75">{muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}{muted ? "Audio desactivado" : "Audio activado"}</button>
        </div>
      </section>}
      <audio ref={audioRef} src={remoteAudioUrl} loop preload="auto" className="hidden" />
    </main>
  );
}

export default function CinematicIntro(props: CinematicIntroProps) {
  return <CinematicIntroContent {...props} />;
}
