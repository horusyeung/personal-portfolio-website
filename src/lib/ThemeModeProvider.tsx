'use client'

import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import { createAppTheme } from './theme'

type Mode = 'system' | 'light' | 'dark'

interface ThemeModeContextValue {
  mode: Mode
  resolvedMode: 'light' | 'dark'
  setMode: (mode: Mode) => void
}

const STORAGE_KEY = 'portfolio-theme-mode'

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'system',
  resolvedMode: 'dark',
  setMode: () => {},
})

export function useThemeMode() {
  return useContext(ThemeModeContext)
}

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setModeState] = useState<Mode>('system')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Mode | null
    if (saved && ['system', 'light', 'dark'].includes(saved)) {
      setModeState(saved)
    }
  }, [])

  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
  }, [])

  const resolvedMode: 'light' | 'dark' = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode

  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode])

  const contextValue = useMemo<ThemeModeContextValue>(
    () => ({ mode, resolvedMode, setMode }),
    [mode, resolvedMode, setMode],
  )

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
