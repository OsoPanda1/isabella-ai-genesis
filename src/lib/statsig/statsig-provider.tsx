import React, { createContext, useContext, ReactNode } from "react";

interface StatsigContextType {
  userId: string;
}

const StatsigContext = createContext<StatsigContextType>({ userId: "anonymous" });

export function StatsigProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  return (
    <StatsigContext.Provider value={{ userId }}>
      {children}
    </StatsigContext.Provider>
  );
}

export function useStatsig() {
  return useContext(StatsigContext);
}
