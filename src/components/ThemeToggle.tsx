'use client'

import { IconButton } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlined from '@mui/icons-material/LightModeOutlined'

/**
 * Switches between light and dark. Choosing the scheme the system already uses goes back to
 * following the system. The icon shows the current scheme (sun in light, moon in dark). CSS picks
 * it from the class on <html>, so the server markup never depends on the mode and nothing flashes
 * before hydration.
 */
export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme()

  const toggle = () => {
    // MUI only reports the system scheme while following it, so ask the browser directly
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const current = mode === 'system' || !mode ? system : mode
    const next = current === 'dark' ? 'light' : 'dark'
    setMode(next === system ? 'system' : next)
  }

  return (
    <IconButton
      data-testid='theme-toggle'
      aria-label='Toggle dark mode'
      onClick={toggle}
      size='small'
      sx={{
        color: 'text.secondary',
        '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        // 28px button, 44px hit area
        '&::after': { content: '""', position: 'absolute', inset: -8 },
      }}
    >
      {/* applyStyles, not a ':where(.dark) &' key, which Emotion attaches to the icon itself */}
      <LightModeOutlined
        data-testid='theme-icon-light'
        sx={(theme) => ({ fontSize: 18, ...theme.applyStyles('dark', { display: 'none' }) })}
      />
      <DarkModeOutlined
        data-testid='theme-icon-dark'
        sx={(theme) => ({
          fontSize: 18,
          display: 'none',
          ...theme.applyStyles('dark', { display: 'inline-block' }),
        })}
      />
    </IconButton>
  )
}
