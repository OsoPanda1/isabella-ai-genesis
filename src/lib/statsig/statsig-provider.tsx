import React, { createContext, useContext, useMemo } from "react";

export interface StatsigContextValue {
  userId: string;
  checkGate: (gateName: string) => boolean;
  getExperiment: (experimentName: string) => Record<string, unknown>;
  isInitialized: boolean;
}

const StatsigContext = createContext<StatsigContextValue>({
  userId: "anonymous",
  checkGate: () => false,
  getExperiment: () => ({}),
  isInitialized: true,
});

export interface StatsigProviderProps {
  userId?: string;
  children: React.ReactNode;
}

export function StatsigProvider({ userId = "anonymous", children }: StatsigProviderProps) {
  const value = useMemo<StatsigContextValue>(
    () => ({
      userId,
      checkGate: (_gateName: string) => true,
      getExperiment: (_experimentName: string) => ({}),
      isInitialized: true,
    }),
    [userId],
  );

  return <StatsigContext.Provider value={value}>{children}</StatsigContext.Provider>;
}

export function useStatsig(): StatsigContextValue {
  return useContext(StatsigContext);
}
