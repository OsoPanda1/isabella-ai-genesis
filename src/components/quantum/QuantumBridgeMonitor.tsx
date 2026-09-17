import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity, Zap, Server, Shield } from "lucide-react";

interface QuantumMetrics {
  timestamp: string;
  coherence: number;
  fidelity: number;
  entanglement: number;
  errorRate: number;
}

export function QuantumBridgeMonitor() {
  const [data, setData] = useState<QuantumMetrics[]>([]);
  const [status, setStatus] = useState<"ACTIVE" | "STABILIZING" | "OFFLINE">("ACTIVE");

  useEffect(() => {
    // Simulate real-time quantum telemetry
    const interval = setInterval(() => {
      setData((prev) => {
        const now = new Date();
        const newPoint = {
          timestamp: now.toLocaleTimeString([], { hour12: false, second: "2-digit" }),
          coherence: 95 + Math.random() * 4 - 2,
          fidelity: 98 + Math.random() * 2 - 1,
          entanglement: 85 + Math.random() * 10 - 5,
          errorRate: 0.5 + Math.random() * 0.5,
        };
        const nextData = [...prev, newPoint];
        return nextData.slice(-15); // Keep last 15 points
      });

      // Randomly fluctuate status for realism
      if (Math.random() > 0.95) setStatus("STABILIZING");
      else setStatus("ACTIVE");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
              PennyLane Bridge
            </h2>
            <h3 className="text-xl font-semibold">Quantum Telemetry</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                status === "ACTIVE" ? "bg-green-400" : "bg-amber-400"
              }`}
            ></span>
            <span
              className={`relative inline-flex h-3 w-3 rounded-full ${
                status === "ACTIVE" ? "bg-green-500" : "bg-amber-500"
              }`}
            ></span>
          </span>
          <span className="font-mono text-xs font-bold tracking-widest">{status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Real-time stats */}
        <div className="flex flex-col justify-center space-y-4 rounded-xl bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Coherence (T2)</span>
              <span className="font-mono text-lg font-bold">
                {data.length ? data[data.length - 1].coherence.toFixed(1) : "--"}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Gate Fidelity</span>
              <span className="font-mono text-lg font-bold">
                {data.length ? data[data.length - 1].fidelity.toFixed(2) : "--"}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Server className="h-4 w-4 text-rose-500" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Qubit Error Rate</span>
              <span className="font-mono text-lg font-bold">
                {data.length ? data[data.length - 1].errorRate.toFixed(3) : "--"}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 lg:col-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="timestamp"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[80, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="coherence"
                name="Coherence"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="fidelity"
                name="Fidelity"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="entanglement"
                name="Entanglement"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
