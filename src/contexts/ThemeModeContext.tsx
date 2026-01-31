import React, { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'light' | 'dark';

const STORAGE_KEY = 'pop-ledger.theme';

interface ThemeModeContextValue {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  setMode: () => {},
  toggle: () => {},
});

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'light' || v === 'dark') return v;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      // ignore
    }
  }, [mode]);

  const setMode = (m: Mode) => setModeState(m);
  const toggle = () => setModeState((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeModeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
