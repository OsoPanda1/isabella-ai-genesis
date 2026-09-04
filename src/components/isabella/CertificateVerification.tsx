import { useState } from "react";
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  RotateCcw,
  HelpCircle,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface VerificationStep {
  label: string;
  status: "idle" | "loading" | "success" | "error";
}

export function CertificateVerification() {
  const [jobId, setJobId] = useState("qup-job-a81d-e087");
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

  const [steps, setSteps] = useState<VerificationStep[]>([
    { label: "Validando sintaxis e identificación del Job en el Nodo Cero", status: "idle" },
    { label: "Buscando raíz Merkle SHA3-512 en el ledger BookPI inmutable", status: "idle" },
    {
      label: "Verificando consistencia del Leaf Path Merkle contra el bloque raíz",
      status: "idle",
    },
    {
      label: "Descifrando y validando firma digital post-cuántica ML-DSA (FIPS 204)",
      status: "idle",
    },
    {
      label: "Verificando firma esférica resistente SLH-DSA (FIPS 205) de respaldo",
      status: "idle",
    },
    {
      label: "Validando veto de gobernanza ética y estado del Policy Gate de VIGIA",
      status: "idle",
    },
  ]);

  const handleVerify = () => {
    if (!jobId.trim()) {
      toast.error("Por favor ingrese un ID de Trabajo para comenzar la verificación.");
      return;
    }

    setIsVerifying(true);
    setShowCertificate(false);
    setCurrentStep(0);

    // Reset steps
    setSteps((prev) => prev.map((s) => ({ ...s, status: "idle" })));

    // Progress through steps simulation
    const runStep = (idx: number) => {
      if (idx >= steps.length) {
        setIsVerifying(false);
        setShowCertificate(true);
        toast.success("Certificado cuántico verificado correctamente por el cibersistema.");
        return;
      }

      setSteps((prev) =>
        prev.map((s, i) => {
          if (i === idx) return { ...s, status: "loading" };
          return s;
        }),
      );

      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => {
            if (i === idx) return { ...s, status: "success" };
            return s;
          }),
        );
        runStep(idx + 1);
      }, 700);
    };

    runStep(0);
  };

  return (
    <div
      className="p-5 rounded-2xl bg-[#13151f] border border-border/10 space-y-4 text-muted-foreground text-xs"
      id="cert-verification-module"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-border/5">
        <ShieldCheck className="size-4 text-purple-400" />
        <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
          Verificador de Certificados Criptográficos PQC
        </h3>
      </div>

      <p className="text-[11px] leading-relaxed">
        Verifique la autenticidad, integridad Merkle y firmas post-cuánticas de cualquier
        experimento procesado en la infraestructura qup v3.0 contra el Libro Mayor inmutable BookPI
        del Nodo Cero.
      </p>

      {/* INPUT CONTROL */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="Ingrese ID del Job cuántico..."
            className="w-full bg-[#181a26] border border-border/15 rounded-xl p-2.5 pl-3 text-xs font-mono text-white outline-none focus:border-purple-400"
          />
        </div>
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying}
          className="px-4 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 font-mono font-bold uppercase text-[11px] flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/15 disabled:opacity-55"
        >
          {isVerifying ? <RotateCcw className="size-3.5 animate-spin" /> : <span>Verificar</span>}
        </button>
      </div>

      {/* VERIFICATION TRACKER */}
      <div className="p-3.5 bg-black/20 border border-border/5 rounded-xl space-y-2 font-mono text-[11px]">
        <div className="text-white font-bold uppercase pb-1 border-b border-border/5 flex justify-between">
          <span>Proceso de Auditoría Criptográfica:</span>
          {isVerifying && <span className="text-purple-400 animate-pulse">Analizando...</span>}
        </div>

        <div className="space-y-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <span
                className={`text-left ${
                  step.status === "success"
                    ? "text-emerald-400"
                    : step.status === "loading"
                      ? "text-purple-400"
                      : "text-muted-foreground"
                }`}
              >
                {idx + 1}. {step.label}
              </span>
              <span className="font-bold uppercase text-[9.5px]">
                {step.status === "idle" && <span className="text-muted-foreground/50">Espera</span>}
                {step.status === "loading" && (
                  <span className="text-purple-400 animate-pulse">Cargando</span>
                )}
                {step.status === "success" && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="size-3" /> OK
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CERTIFICATE PAYLOAD WATERMARK */}
      {showCertificate && (
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-3 animate-rise font-mono text-[11.5px]">
          <div className="flex justify-between items-center pb-2 border-b border-purple-500/15">
            <span className="text-white font-bold uppercase flex items-center gap-1">
              <Fingerprint className="size-4 text-purple-400" /> Certificado de Autenticidad
              Cuántica
            </span>
            <span className="text-emerald-400 font-extrabold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              🟢 AUTÉNTICO
            </span>
          </div>

          <div className="space-y-2 leading-relaxed">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID del Job verificado:</span>
              <strong className="text-white font-semibold">{jobId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Algoritmo de Firma Primario:</span>
              <strong className="text-purple-400">ML-DSA-87 (FIPS 204 Compliant)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Esquema de Respaldo Esférico:</span>
              <strong className="text-blue-400">SLH-DSA-SHA2-256s (FIPS 205 Compliant)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Raíz Merkle SHA3-512 Certificada:</span>
              <span
                className="text-white truncate max-w-[200px] hover:text-clip"
                title="sha3_512_merkle_root_a8bc894cf9e31d"
              >
                sha3_512_merkle_root_a8bc894cf9e31d...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ledger Block index BookPI:</span>
              <strong className="text-white">Bloque Registrado #142</strong>
            </div>
          </div>

          <div className="p-2.5 bg-black/45 rounded-lg border border-border/5 text-[10.5px] text-muted-foreground flex items-start gap-1.5 leading-tight">
            <Lock className="size-3.5 shrink-0 text-purple-400" />
            <div>
              Firmado por la clave privada HSM del Nodo Cero en Real del Monte, Hidalgo. Firma
              verificada mediante claves públicas pre-compartidas ML-DSA/SLH-DSA.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
