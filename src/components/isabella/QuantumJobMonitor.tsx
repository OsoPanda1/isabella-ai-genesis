import { useState, useEffect } from "react";
import { Cpu, RotateCcw, Play, CheckCircle2, ListCollapse, Clock, Percent } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { toast } from "sonner";

interface QuantumJob {
  id: string;
  objective: string;
  backend: string;
  status: "Queued" | "Transpiling" | "Executing" | "Completed" | "Failed";
  qubits: number;
  fidelity: number;
  durationMs: number;
  timestamp: string;
}

export function QuantumJobMonitor() {
  const [jobs, setJobs] = useState<QuantumJob[]>([
    {
      id: "qup-job-a3b1",
      objective: "Clasificación QML Híbrido",
      backend: "aer_simulator_local",
      status: "Completed",
      qubits: 4,
      fidelity: 96.8,
      durationMs: 820,
      timestamp: "Hace 2 mins",
    },
    {
      id: "qup-job-e58f",
      objective: "Cálculo Hamiltonian VQE",
      backend: "ibm_sherbrooke_qpu",
      status: "Completed",
      qubits: 8,
      fidelity: 94.1,
      durationMs: 1420,
      timestamp: "Hace 5 mins",
    },
    {
      id: "qup-job-f9e2",
      objective: "Simulación de Espines QEC",
      backend: "aws_braket_dm1",
      status: "Executing",
      qubits: 6,
      fidelity: 0,
      durationMs: 0,
      timestamp: "En proceso...",
    },
    {
      id: "qup-job-908a",
      objective: "Estado GHZ (5 Qubits)",
      backend: "aer_simulator_local",
      status: "Queued",
      qubits: 5,
      fidelity: 0,
      durationMs: 0,
      timestamp: "En cola...",
    },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);

  // Background interval simulation to slowly transition the queued/executing jobs to completed
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prevJobs) => {
        let stateChanged = false;
        const next = prevJobs.map((job) => {
          if (job.status === "Executing") {
            stateChanged = true;
            return {
              ...job,
              status: "Completed" as const,
              fidelity: parseFloat((93 + Math.random() * 5.8).toFixed(1)),
              durationMs: Math.floor(600 + Math.random() * 900),
              timestamp: "Hace unos instantes",
            };
          }
          if (job.status === "Queued" && !stateChanged) {
            stateChanged = true;
            return {
              ...job,
              status: "Transpiling" as const,
              timestamp: "Transpilando...",
            };
          }
          if (job.status === "Transpiling") {
            stateChanged = true;
            return {
              ...job,
              status: "Executing" as const,
              timestamp: "Ejecutando QPU...",
            };
          }
          return job;
        });

        if (stateChanged) {
          // Send occasional status notification toast to simulate active queues
          const completedJob = next.find((j, idx) => j.status === "Completed" && prevJobs[idx].status !== "Completed");
          if (completedJob) {
            toast.success(`Trabajo cuántico ${completedJob.id} completado con fidelidad: ${completedJob.fidelity}%`);
          }
        }
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleSimulateNewJob = () => {
    setIsSimulating(true);
    const newId = `qup-job-${Math.random().toString(36).substring(2, 6)}`;
    const randomObjectives = [
      "Clasificación QML Híbrido",
      "Cálculo Hamiltonian VQE",
      "Estado Bell (2 Qubits)",
      "Ansatz QAOA de Espín",
    ];
    const randomBackends = ["aer_simulator_local", "aws_braket_dm1", "ibm_sherbrooke_qpu"];
    const randomObjective = randomObjectives[Math.floor(Math.random() * randomObjectives.length)];
    const randomBackend = randomBackends[Math.floor(Math.random() * randomBackends.length)];
    const randomQubit = Math.floor(Math.random() * 10) + 2;

    const newJob: QuantumJob = {
      id: newId,
      objective: randomObjective,
      backend: randomBackend,
      status: "Queued",
      qubits: randomQubit,
      fidelity: 0,
      durationMs: 0,
      timestamp: "Recién adicionado",
    };

    setJobs((prev) => [newJob, ...prev]);
    toast.info(`Trabajo ${newId} enviado a la cola del transpilador QUP.`);
    
    setTimeout(() => {
      setIsSimulating(false);
    }, 1000);
  };

  // Compile data for Recharts chart
  const completedJobsData = jobs
    .filter((j) => j.status === "Completed")
    .map((j) => ({
      name: j.id,
      fidelity: j.fidelity,
      duration: j.durationMs,
    }))
    .reverse();

  return (
    <div className="p-5 rounded-2xl bg-[#13151f] border border-border/10 space-y-4 text-muted-foreground text-xs" id="quantum-job-monitor-module">
      <div className="flex items-center justify-between pb-2 border-b border-border/5">
        <div className="flex items-center gap-2">
          <Cpu className="size-4 text-emerald-400" />
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            Monitor de Trabajos y Colas de Ejecución (QUP Monitor)
          </h3>
        </div>
        <button
          type="button"
          onClick={handleSimulateNewJob}
          disabled={isSimulating}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase flex items-center gap-1 transition-all"
        >
          <Play className="size-3" /> Inyectar Job a Cola
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* JOBS LIST TABLE */}
        <div className="lg:col-span-7 space-y-2.5">
          <span className="block text-[10px] uppercase font-bold text-white font-mono flex items-center gap-1">
            <ListCollapse className="size-3.5 text-crown" /> Estado de la Cola en QPU:
          </span>
          <div className="border border-border/10 rounded-xl overflow-hidden bg-black/15">
            <div className="grid grid-cols-12 gap-2 p-2 bg-black/40 text-[9.5px] font-bold text-white border-b border-border/5 uppercase font-mono">
              <div className="col-span-3">Job ID</div>
              <div className="col-span-4">Algoritmo/Ansatz</div>
              <div className="col-span-3">Estado</div>
              <div className="col-span-2 text-right">Fidelidad</div>
            </div>
            <div className="divide-y divide-border/5 max-h-[190px] overflow-auto">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="grid grid-cols-12 gap-2 p-2.5 items-center font-mono text-[10.5px] hover:bg-black/10 transition-colors"
                >
                  <div className="col-span-3 text-white font-bold truncate" title={job.id}>
                    {job.id}
                  </div>
                  <div className="col-span-4 text-muted-foreground truncate" title={job.objective}>
                    {job.objective} <span className="text-[9px] text-crown font-semibold block">({job.qubits} qubits)</span>
                  </div>
                  <div className="col-span-3 flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${
                      job.status === "Completed" ? "bg-emerald-400" : job.status === "Executing" ? "bg-purple-400 animate-pulse" : job.status === "Transpiling" ? "bg-amber-400 animate-spin" : "bg-blue-400 animate-pulse"
                    }`} />
                    <span className={`capitalize font-bold text-[9px] ${
                      job.status === "Completed" ? "text-emerald-400" : job.status === "Executing" ? "text-purple-400" : job.status === "Transpiling" ? "text-amber-400" : "text-blue-400"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-extrabold text-white">
                    {job.fidelity > 0 ? `${job.fidelity}%` : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METRICS CHARTS PANEL */}
        <div className="lg:col-span-5 p-3.5 bg-black/25 border border-border/5 rounded-xl flex flex-col justify-between">
          <div className="space-y-2">
            <span className="block text-[10px] uppercase font-bold text-white font-mono flex items-center gap-1">
              <Percent className="size-3.5 text-emerald-400" /> Fidelidad Histórica:
            </span>
            <div className="h-[120px] w-full">
              {completedJobsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={completedJobsData}
                    margin={{ top: 5, right: 5, left: -32, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#232635" />
                    <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 8.5 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 8.5 }} domain={[90, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#13151f", borderColor: "#2d2f3d" }}
                    />
                    <Bar dataKey="fidelity" fill="#10b981" radius={[3, 3, 0, 0]} name="Fidelidad (%)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center italic text-muted-foreground text-[11px]">
                  Esperando trabajos completados para graficar...
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-border/5 flex items-center justify-between text-[9.5px] font-mono">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3 text-purple-400" /> Latencia Promedio:
            </span>
            <strong className="text-white font-bold">1.12 seg / Corrida</strong>
          </div>
        </div>

      </div>
    </div>
  );
}
