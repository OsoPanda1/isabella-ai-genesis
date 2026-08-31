import { useState } from "react";
import { Shield, Sparkles, User, Mail, CheckCircle2, AlertTriangle } from "lucide-react";

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { username: string; email: string; telemetryConsent: boolean }) => void;
}

export function AccountOnboarding({ isOpen, onClose, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telemetryConsent, setTelemetryConsent] = useState(true);
  const [isAgreed, setIsAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!username.trim() || !email.trim()) {
        setError("Por favor completa todos los campos obligatorios.");
        return;
      }
      if (!email.includes("@")) {
        setError("Ingresa una dirección de correo electrónico válida.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!isAgreed) {
        setError("Debes aceptar los Términos Constitucionales y Políticas de Privacidad.");
        return;
      }
      onComplete({ username, email, telemetryConsent });
      setStep(3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-4">
      <div className="glass-strong rounded-3xl w-full max-w-lg border border-border/50 shadow-glass overflow-hidden animate-fade-in flex flex-col">
        {/* Title bar */}
        <div className="bg-secondary/15 px-6 py-4.5 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-electric" />
            <h3 className="font-mono text-[12px] uppercase tracking-[0.22em] text-platinum font-semibold">
              Registro Canónico de Usuario
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-platinum transition-colors font-mono text-[11px]"
          >
            [Cerrar]
          </button>
        </div>

        {/* Progress header */}
        <div className="px-6 pt-4 flex gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                s <= step ? "bg-electric" : "bg-secondary/35"
              }`}
            />
          ))}
        </div>

        {/* Main Body */}
        <div className="p-6 flex-1 flex flex-col gap-4">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <User className="size-6 text-electric" />
                <div>
                  <h4 className="font-display text-[20px] text-pearl font-semibold">
                    Bienvenido al Nodo Cero
                  </h4>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed mt-0.5">
                    Crea una cuenta local y configura tu identidad soberana para interactuar con
                    Isabella.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl font-mono text-[11px]">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    Nombre de operador
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. anubisvillasenor"
                    className="w-full bg-secondary/35 border border-border/40 rounded-xl px-4 py-2.5 font-mono text-[12px] text-platinum focus:outline-none focus:border-electric/50"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. anubisvillasenor1@gmail.com"
                    className="w-full bg-secondary/35 border border-border/40 rounded-xl px-4 py-2.5 font-mono text-[12px] text-platinum focus:outline-none focus:border-electric/50"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <Shield className="size-6 text-crown" />
                <div>
                  <h4 className="font-display text-[20px] text-pearl font-semibold">
                    Gobernanza y Privacidad Ética
                  </h4>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed mt-0.5">
                    Isabella protege tus datos. Revisa nuestras políticas constitucionales para
                    habilitar la telemetría territorial.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl font-mono text-[11px]">
                  {error}
                </div>
              )}

              <div className="bg-secondary/20 rounded-2xl p-4 border border-border/30 max-h-[15vh] overflow-y-auto space-y-2">
                <p className="font-mono text-[10.5px] text-muted-foreground leading-relaxed">
                  <strong>Principios de Soberanía Humana:</strong> El procesamiento de datos
                  personales se limita a lo estrictamente solicitado y nunca se venderá a terceros
                  ni se empleará para entrenar modelos sin consentimiento explícito.
                </p>
                <p className="font-mono text-[10.5px] text-muted-foreground leading-relaxed">
                  <strong>Derecho al Olvido:</strong> En cualquier momento puedes purgar por
                  completo tu historial de conversaciones e índices de memoria persistente de forma
                  irreversible.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={telemetryConsent}
                    onChange={(e) => setTelemetryConsent(e.target.checked)}
                    className="mt-1 rounded border-border/40 bg-secondary/35 text-electric focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-mono text-[11.5px] text-platinum font-semibold">
                      Habilitar Telemetría Territorial
                    </span>
                    <span className="text-[10.5px] text-muted-foreground leading-relaxed mt-0.5">
                      Permite que Isabella analice respuestas de forma agregada para perfeccionar el
                      conocimiento local de Real del Monte.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-1 rounded border-border/40 bg-secondary/35 text-electric focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-mono text-[11.5px] text-platinum font-semibold">
                      Acepto los términos y políticas constitucionales
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 py-4 text-center animate-fade-in flex flex-col items-center">
              <CheckCircle2 className="size-12 text-emerald-400" />
              <div>
                <h4 className="font-display text-[22px] text-pearl font-semibold">
                  Registro Completado
                </h4>
                <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">
                  Tu identidad en el Nodo Cero ha sido registrada de forma segura. Bienvenido a
                  Isabella Villaseñor AI.
                </p>
              </div>
              <div className="bg-secondary/15 rounded-2xl p-4 border border-border/30 w-full font-mono text-[11px] text-left space-y-1">
                <div>
                  <span className="text-muted-foreground">Operador:</span>{" "}
                  <span className="text-platinum font-semibold">{username}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ID Cripto:</span>{" "}
                  <span className="text-electric font-semibold">
                    usr_node_0_{username.slice(0, 5)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Telemetría:</span>{" "}
                  <span className={telemetryConsent ? "text-emerald-400" : "text-rose-400"}>
                    {telemetryConsent ? "ACTIVA" : "INACTIVA"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="bg-secondary/15 border-t border-border/20 px-6 py-4 flex justify-between gap-3">
          {step < 3 ? (
            <>
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="px-4 py-2 border border-border/30 text-muted-foreground hover:text-platinum font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all disabled:opacity-30"
              >
                Atrás
              </button>
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-electric/25 hover:bg-electric/35 text-electric border border-electric/35 font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all"
              >
                Siguiente
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 font-mono text-[11px] uppercase tracking-[0.2em] rounded-xl transition-all"
            >
              Comenzar Exploración
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
