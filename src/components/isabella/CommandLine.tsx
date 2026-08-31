import { useEffect, useRef, useState } from "react";
import { Waveform } from "./Waveform";
import { fileToDataUrl, humanSize, MAX_ATTACHMENT_BYTES, type Attachment } from "@/lib/attachments";

const uid = () => Math.random().toString(36).slice(2, 11);

export function CommandLine({
  onSend,
  onStop,
  onReset,
  isProcessing,
}: {
  onSend: (value: string, attachments: Attachment[]) => void;
  onStop: () => void;
  onReset: () => void;
  isProcessing: boolean;
}) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const photoRef = useRef<HTMLInputElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  // Cronómetro de grabación.
  useEffect(() => {
    if (!recording) return;
    const t = window.setInterval(() => setRecSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [recording]);

  // Esc detiene la síntesis en curso.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isProcessing) onStop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isProcessing, onStop]);

  const submit = () => {
    const text = value.trim();
    if ((!text && attachments.length === 0) || isProcessing) return;
    onSend(text, attachments);
    setValue("");
    setAttachments([]);
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const next: Attachment[] = [];
    for (const file of Array.from(files).slice(0, 4)) {
      if (file.size > MAX_ATTACHMENT_BYTES) {
        setNotice(`«${file.name}» excede 8 MB y fue descartada.`);
        continue;
      }
      next.push({
        id: uid(),
        kind: "image",
        dataUrl: await fileToDataUrl(file),
        mime: file.type || "image/jpeg",
        name: file.name,
        size: file.size,
      });
    }
    if (next.length) setAttachments((prev) => [...prev, ...next].slice(0, 6));
  };

  const startRecording = async () => {
    setNotice(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        if (blob.size > MAX_ATTACHMENT_BYTES) {
          setNotice("La grabación excede 8 MB.");
          return;
        }
        const dataUrl = await fileToDataUrl(blob);
        setAttachments((prev) =>
          [
            ...prev,
            {
              id: uid(),
              kind: "audio" as const,
              dataUrl,
              mime: recorder.mimeType || "audio/webm",
              name: `nota-de-voz-${new Date().toISOString().slice(11, 19)}`,
              size: blob.size,
            },
          ].slice(0, 6),
        );
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecSeconds(0);
      setRecording(true);
    } catch {
      setNotice("No se pudo acceder al micrófono. Revisa los permisos del navegador.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  };

  const remove = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="glass-strong rounded-3xl px-5 py-4 sm:px-7 sm:py-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Canal de percepción · Nodo Cero
        </span>
        <span
          className={`font-mono text-[10px] tracking-[0.2em] ${isProcessing ? "text-electric" : "text-muted-foreground"}`}
        >
          {isProcessing ? "SINTETIZANDO" : recording ? "GRABANDO" : "EN ESCUCHA"}
        </span>
      </div>

      <Waveform active={isProcessing || recording} height={44} />

      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={1}
        aria-label="Mensaje para Isabella"
        placeholder="Habla con Isabella… (Enter para enviar · Shift+Enter para nueva línea · Esc para detener)"
        className="mt-2 w-full resize-none bg-transparent text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
      />

      {attachments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {attachments.map((a) => (
            <div key={a.id} className="glass relative flex items-center gap-3 rounded-xl px-3 py-2">
              {a.kind === "image" ? (
                <img
                  src={a.dataUrl}
                  alt={`Adjunto ${a.name}`}
                  className="size-12 rounded-lg object-cover"
                />
              ) : (
                <audio controls src={a.dataUrl} className="h-9 max-w-[190px]" />
              )}
              <div className="max-w-[140px]">
                <p className="truncate font-mono text-[10px] text-platinum">{a.name}</p>
                <p className="font-mono text-[9px] text-muted-foreground">
                  {a.kind === "image" ? "IMAGEN" : "AUDIO"} · {humanSize(a.size)}
                  {isProcessing ? " · transmitiendo" : ""}
                </p>
              </div>
              <button
                onClick={() => remove(a.id)}
                aria-label={`Quitar adjunto ${a.name}`}
                className="ml-1 rounded-md border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-destructive"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {notice && (
        <p role="status" className="mt-2 font-mono text-[10px] text-destructive">
          {notice}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
        <div className="flex flex-wrap gap-2">
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              void addPhotos(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => photoRef.current?.click()}
            className="rounded-lg border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-platinum"
          >
            ⬚ Foto
          </button>
          <button
            onClick={() => (recording ? stopRecording() : void startRecording())}
            className={`rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
              recording
                ? "border-destructive/60 text-destructive"
                : "border-border text-muted-foreground hover:text-platinum"
            }`}
          >
            {recording
              ? `◼ Detener ${String(Math.floor(recSeconds / 60)).padStart(2, "0")}:${String(recSeconds % 60).padStart(2, "0")}`
              : "● Audio"}
          </button>
          <button
            onClick={onReset}
            className="rounded-lg border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-platinum"
          >
            Purgar memoria
          </button>
          {isProcessing && (
            <button
              onClick={onStop}
              className="rounded-lg border border-destructive/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-destructive transition-colors hover:bg-destructive/10"
            >
              Detener
            </button>
          )}
        </div>
        <button
          onClick={submit}
          disabled={isProcessing || (!value.trim() && attachments.length === 0)}
          className="glow-ring rounded-xl bg-primary px-6 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity disabled:opacity-35"
        >
          Transmitir
        </button>
      </div>

      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/70">
        Purga: mensajes, adjuntos y memoria inmediata de esta sesión · la telemetría auditable se
        conserva
      </p>
    </div>
  );
}
