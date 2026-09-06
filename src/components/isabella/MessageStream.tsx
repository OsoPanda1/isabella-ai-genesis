import { useEffect, useRef, useState } from "react";
import { MODULES } from "@/lib/crown-ui";
import { speakIsabella, stopVoice } from "@/lib/voice";
import type { TerminalMessage } from "@/lib/useIsabella";
import thinkingAsset from "@/assets/isabella-thinking.jpeg.asset.json";
import smileAsset from "@/assets/isabella-smile.jpeg.asset.json";
import worriedAsset from "@/assets/isabella-worried.jpeg.asset.json";
import crownAsset from "@/assets/isabella-crown.png.asset.json";

/** Miniatura de identidad de Isabella junto al indicador de actividad. */
function IsabellaAvatar({
  state,
  color,
}: {
  state: "thinking" | "ready" | "error";
  color: string;
}) {
  const src =
    state === "thinking"
      ? thinkingAsset.url
      : state === "error"
        ? worriedAsset.url
        : smileAsset.url;
  return (
    <span
      className="relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border"
      style={{ borderColor: color, boxShadow: `0 0 22px -8px ${color}` }}
    >
      <img
        src={src}
        alt="Isabella Villaseñor"
        className={`size-full object-cover ${state === "thinking" ? "animate-breathe" : ""}`}
      />
    </span>
  );
}

function TypingDots({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5" role="status" aria-label="Isabella está generando una respuesta">
      <img src={crownAsset.url} alt="" aria-hidden className="size-4 animate-breathe rounded-sm object-contain" />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-breathe rounded-full"
          style={{ background: color, animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

function VoiceButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "playing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => stopVoice(), []);

  const toggle = async () => {
    if (state === "playing") {
      stopVoice();
      setState("idle");
      return;
    }
    setState("playing");
    setError(null);
    try {
      await speakIsabella(text);
      setState("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fallo de síntesis vocal.");
      setState("error");
    }
  };

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => void toggle()}
        aria-label={state === "playing" ? "Detener voz de Isabella" : "Escuchar voz de Isabella"}
        className="rounded-lg border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-platinum"
      >
        {state === "playing" ? "◼ Silenciar voz" : "▶ Voz de Isabella"}
      </button>
      {error && (
        <span role="status" className="font-mono text-[10px] text-destructive">
          {error}
        </span>
      )}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
      {label}
      <span className="text-platinum/90"> {value}</span>
    </span>
  );
}

export function MessageStream({
  messages,
  onRetry,
}: {
  messages: TerminalMessage[];
  onRetry: () => void;
}) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-6 px-5 py-7 sm:px-9">
      {messages.map((m) => {
        if (m.role === "system") {
          return (
            <div key={m.id} className="animate-rise flex justify-center">
              <p className="max-w-2xl text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-muted-foreground">
                {m.content}
              </p>
            </div>
          );
        }

        if (m.role === "user") {
          return (
            <div key={m.id} className="animate-rise flex justify-end">
              <div className="glass max-w-[86%] rounded-2xl rounded-br-sm px-5 py-4 sm:max-w-[70%]">
                <div className="mb-1.5 flex items-center justify-between gap-6">
                  <Meta label="OPERADOR" value="ANUBIS" />
                  <span className="font-mono text-[10px] text-muted-foreground">{m.timestamp}</span>
                </div>
                {m.content && (
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
                    {m.content}
                  </p>
                )}
                {m.attachments && m.attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.attachments.map((a) =>
                      a.kind === "image" ? (
                        <img
                          key={a.id}
                          src={a.dataUrl}
                          alt={a.name}
                          className="size-20 rounded-lg border border-border object-cover"
                        />
                      ) : (
                        <audio key={a.id} controls src={a.dataUrl} className="h-9 max-w-[220px]" />
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }

        const mod = m.decision ? MODULES[m.decision.primary] : MODULES.CROWN;
        return (
          <div key={m.id} className="animate-rise flex justify-start">
            <div
              className="glass-strong w-full max-w-[94%] rounded-2xl rounded-bl-sm px-5 py-5 sm:px-7 sm:py-6"
              style={{
                borderColor: m.error ? "var(--destructive)" : mod.color,
                boxShadow: `0 0 60px -30px ${m.error ? "var(--destructive)" : mod.color}`,
              }}
            >
              <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-b border-border/50 pb-3">
                <IsabellaAvatar
                  state={m.error ? "error" : m.streaming ? "thinking" : "ready"}
                  color={m.error ? "var(--destructive)" : mod.color}
                />
                <span
                  className="font-mono text-[11px] tracking-[0.3em]"
                  style={{ color: m.error ? "var(--destructive)" : mod.color }}
                >
                  ISABELLA · {mod.acronym}
                </span>
                {m.decision && (
                  <>
                    <Meta label="TRACE" value={m.decision.traceId} />
                    <Meta label="GATE" value={m.decision.policy.toUpperCase()} />
                    <Meta label="RIESGO" value={m.decision.risk.toUpperCase()} />
                    <Meta label="TONO" value={m.decision.emotionalTone} />
                  </>
                )}
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {m.timestamp}
                </span>
              </div>

              <p className="whitespace-pre-wrap text-[15.5px] leading-[1.75] text-foreground/95">
                {m.content}
                {m.streaming &&
                  (m.content ? (
                    <span className="animate-caret ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-electric" />
                  ) : (
                    <TypingDots color={mod.color} />
                  ))}
              </p>

              {m.decision && !m.error && (
                <p className="mt-4 border-t border-border/40 pt-3 text-[11px] italic leading-relaxed text-muted-foreground">
                  {m.decision.rationale} · {m.decision.policyReason}
                </p>
              )}

              {!m.error && !m.streaming && m.content.trim() && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <VoiceButton text={m.content} />
                </div>
              )}

              {m.error && (
                <button
                  onClick={onRetry}
                  className="mt-4 rounded-lg border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-platinum transition-colors hover:bg-secondary/60"
                >
                  Reintentar percepción
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
