'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type SigFigMode = 'auto' | 'fixed' | 'disabled';

export interface SigFigSettings {
  mode: SigFigMode;
  fixedCount: number;
  highlightUncertain: boolean;
}

interface SigFigContextType {
  settings: SigFigSettings;
  setMode: (mode: SigFigMode) => void;
  setFixedCount: (count: number) => void;
  toggleHighlightUncertain: () => void;
  resolveSigFigs: (detectedSigFigs: number) => number;
}

const SigFigContext = createContext<SigFigContextType | undefined>(undefined);

const STORAGE_KEY = 'chemtoolkit-sigfig-settings';

const defaultSettings: SigFigSettings = {
  mode: 'auto',
  fixedCount: 3,
  highlightUncertain: true,
};

export const SigFigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SigFigSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
      } catch { /* ignore */ }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setMode = useCallback((mode: SigFigMode) => {
    setSettings(prev => ({ ...prev, mode }));
  }, []);

  const setFixedCount = useCallback((count: number) => {
    setSettings(prev => ({ ...prev, fixedCount: Math.max(1, Math.min(15, count)) }));
  }, []);

  const toggleHighlightUncertain = useCallback(() => {
    setSettings(prev => ({ ...prev, highlightUncertain: !prev.highlightUncertain }));
  }, []);

  const resolveSigFigs = useCallback((detectedSigFigs: number): number => {
    if (settings.mode === 'disabled') return 4;
    if (settings.mode === 'fixed') return settings.fixedCount;
    return detectedSigFigs > 0 ? detectedSigFigs : 3;
  }, [settings.mode, settings.fixedCount]);

  return (
    <SigFigContext.Provider value={{ settings, setMode, setFixedCount, toggleHighlightUncertain, resolveSigFigs }}>
      {children}
    </SigFigContext.Provider>
  );
};

export const useSigFigs = (): SigFigContextType => {
  const context = useContext(SigFigContext);
  if (!context) {
    throw new Error('useSigFigs must be used within a SigFigProvider');
  }
  return context;
};
