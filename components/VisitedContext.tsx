import React, { createContext, useContext, useMemo, useState, ReactNode, useCallback } from "react";

type VisitedContextValue = {
  visitedIds: string[];
  /** Increments on each full reset; use as `key` on embedded Video to restart playback. */
  mediaResetKey: number;
  markVisited: (id: string) => void;
  /** Clears all visited POI labels and bumps `mediaResetKey` for POI video resets. */
  resetExperience: () => void;
};

const VisitedContext = createContext<VisitedContextValue | undefined>(undefined);

type VisitedProviderProps = {
  children: ReactNode;
};

export function VisitedProvider({ children }: VisitedProviderProps) {
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [mediaResetKey, setMediaResetKey] = useState(0);

  const markVisited = useCallback((id: string) => {
    setVisitedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const resetExperience = useCallback(() => {
    setVisitedIds([]);
    setMediaResetKey((k) => k + 1);
  }, []);

  const value = useMemo(
    () => ({
      visitedIds,
      mediaResetKey,
      markVisited,
      resetExperience,
    }),
    [visitedIds, mediaResetKey, markVisited, resetExperience]
  );

  return <VisitedContext.Provider value={value}>{children}</VisitedContext.Provider>;
}

export function useVisited() {
  const ctx = useContext(VisitedContext);
  if (!ctx) {
    throw new Error("useVisited must be used within a VisitedProvider");
  }
  return ctx;
}

