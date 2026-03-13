'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from '@mui/material'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { useThemeMode } from '@/lib/ThemeModeProvider'

const navLinks = [
  { href: '/experience', label: 'Experience' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/contact', label: 'Contact' },
]

const modeOrder = ['light', 'dark', 'system'] as const
type ThemeMode = (typeof modeOrder)[number]

function getNextMode(current: ThemeMode): ThemeMode {
  const idx = modeOrder.indexOf(current)
  return modeOrder[(idx + 1) % modeOrder.length]
}

function getModeIcon(mode: ThemeMode) {
  switch (mode) {
    case 'light':
      return <Brightness7Icon sx={{ fontSize: 18 }} />
    case 'dark':
      return <Brightness4Icon sx={{ fontSize: 18 }} />
    case 'system':
      return <SettingsBrightnessIcon sx={{ fontSize: 18 }} />
  }
}

function getModeTooltip(mode: ThemeMode): string {
  switch (mode) {
    case 'light':
      return 'Light mode'
    case 'dark':
      return 'Dark mode'
    case 'system':
      return 'System mode'
  }
}

export default function Navbar() {
  const pathname = usePathname()
  const { mode, setMode } = useThemeMode()

  const currentMode = (mode ?? 'system') as ThemeMode

  const handleToggleMode = () => {
    setMode(getNextMode(currentMode))
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      <AppBar
        data-testid='navbar'
        position='fixed'
        elevation={0}
        sx={{
          background: (t) =>
            t.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 980,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            minHeight: '48px !important',
          }}
        >
          {/* Logo */}
          <Typography
            data-testid='navbar-logo'
            component={Link}
            href='/'
            sx={{
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: '-0.02em',
              textDecoration: 'none',
              color: 'text.primary',
              transition: 'color 0.2s',
              borderRadius: '4px',
              '&:hover': { color: 'primary.main' },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            }}
          >
            HY
            <Box component='span' sx={{ color: 'primary.main' }}>
              .
            </Box>
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Nav links + theme toggle */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
            }}
          >
            {navLinks.map((link) => (
              <Typography
                data-testid={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  textDecoration: 'none',
                  color: isActive(link.href) ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.3s',
                  borderRadius: '4px',
                  '&:hover': {
                    color: isActive(link.href) ? 'primary.main' : 'text.primary',
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}

            <Tooltip title={getModeTooltip(currentMode)} arrow>
              <IconButton
                data-testid='theme-toggle'
                onClick={handleToggleMode}
                size='small'
                aria-label={`Switch to ${getModeTooltip(getNextMode(currentMode))}`}
                sx={{
                  color: 'text.secondary',
                  p: 0.5,
                  '&:hover': { color: 'primary.main' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                  },
                }}
              >
                {getModeIcon(currentMode)}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer for fixed nav */}
      <Toolbar sx={{ minHeight: '48px !important' }} />
    </>
  )
}
