'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createAppTheme } from './theme';

// ── Types ────────────────────────────────────────────────────────────────────
type Mode = 'system' | 'light' | 'dark';

interface ThemeModeContextValue {
  mode: Mode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: Mode) => void;
}

// ── Context ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'portfolio-theme-mode';

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'system',
  resolvedMode: 'dark',
  setMode: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

// ── Global Keyframe Animations ───────────────────────────────────────────────
const globalKeyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes glowPulse {
    0%, 100% {
      box-shadow: 0 0 8px rgba(168, 220, 171, 0.3);
    }
    50% {
      box-shadow: 0 0 20px rgba(168, 220, 171, 0.6);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    @keyframes fadeInUp {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideInLeft {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideInRight {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes glowPulse {
      0%, 100% { box-shadow: none; }
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

// ── Provider ─────────────────────────────────────────────────────────────────
export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setModeState] = useState<Mode>('system');

  // Read saved mode after hydration to avoid SSR mismatch
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (saved && ['system', 'light', 'dark'].includes(saved)) {
      setModeState(saved);
    }
  }, []);

  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  const resolvedMode: 'light' | 'dark' =
    mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;

  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);

  const contextValue = useMemo<ThemeModeContextValue>(
    () => ({ mode, resolvedMode, setMode }),
    [mode, resolvedMode, setMode],
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalKeyframes} />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
