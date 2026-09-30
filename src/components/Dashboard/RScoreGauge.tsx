import React from "react";
import { Activity } from "lucide-react";

export const RScoreGauge: React.FC = () => {
  const mode = "UNVERIFIED (sin telemetría)";
  const color = "text-slate-400";
  const strokeColor = "#64748b";
  const bgGradient = "from-slate-900/40";

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference;

  return (
    <div
      className={`p-4 rounded-xl border border-slate-800/60 bg-gradient-to-br ${bgGradient} to-transparent relative overflow-hidden group`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xs font-bold font-mono text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            Tensión Cognitiva (Score R)
          </h4>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            R = 0.25C + 0.25S + 0.20F + 0.15P + 0.15U
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6">
        {/* Radial Gauge */}
        <div className="relative flex flex-col items-center justify-center w-28 h-28 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-slate-800 fill-none"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="fill-none transition-all duration-1000 ease-out"
              stroke={strokeColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold font-mono ${color}`}>—</span>
          </div>
        </div>

        {/* Dynamic Parameters */}
        <div className="flex-1 grid grid-cols-2 gap-2 text-[10px] font-mono">
          {[
            { label: "C (Certeza)", w: "25%" },
            { label: "S (Severidad)", w: "25%" },
            { label: "F (Fricción)", w: "20%" },
            { label: "P (Política)", w: "15%" },
            { label: "U (Incertidumbre)", w: "15%" },
          ].map((p) => (
            <div
              key={p.label}
              className="bg-slate-900/50 p-1.5 rounded border border-slate-800/50 flex justify-between"
            >
              <span className="text-slate-500">{p.label}</span>
              <span className="text-slate-300 font-bold">— · sin evidencia</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center">
        <span className="text-[10px] text-slate-500 font-mono">ESTADO OPERACIONAL:</span>
        <span
          className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded border ${color} border-current/20 bg-current/10`}
        >
          {mode}
        </span>
      </div>
    </div>
  );
};
