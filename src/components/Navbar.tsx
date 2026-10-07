'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import ThemeToggle from '@/components/ThemeToggle'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: 'Experience' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href)

  return (
    <>
      <AppBar
        data-testid='navbar'
        position='fixed'
        elevation={0}
        sx={(theme) => ({
          // Its own view transition layer: the header stays still above the fading content
          viewTransitionName: 'site-header',
          background: 'rgba(255, 255, 255, 0.8)',
          ...theme.applyStyles('dark', { background: 'rgba(22, 22, 23, 0.8)' }),
          '@media (prefers-color-scheme: dark)': {
            'html:not(.light):not(.dark) &': { background: 'rgba(22, 22, 23, 0.8)' },
          },
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        })}
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
              '&:hover': { color: 'primary.text' },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            }}
          >
            HY
            <Box component='span' sx={{ color: 'primary.text' }}>
              .
            </Box>
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Nav links */}
          <Box
            component='nav'
            aria-label='Main'
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
                aria-current={isActive(link.href) ? 'page' : undefined}
                sx={{
                  position: 'relative',
                  fontSize: 12,
                  fontWeight: 400,
                  textDecoration: 'none',
                  color: isActive(link.href) ? 'primary.text' : 'text.secondary',
                  transition: 'color 0.3s',
                  borderRadius: '4px',
                  '&:hover': {
                    color: isActive(link.href) ? 'primary.text' : 'text.primary',
                  },
                  // A hit area at least 44px tall (WCAG 2.5.5) without moving anything: the invisible
                  // box reaches 14px above and below the 18px line, and 8px into the gaps between links
                  '&::after': { content: '""', position: 'absolute', inset: '-14px -8px' },
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
          </Box>
          <Box sx={{ ml: { xs: 1.5, sm: 2 }, display: 'flex' }}>
            <ThemeToggle />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer for fixed nav */}
      <Toolbar sx={{ minHeight: '48px !important' }} />
    </>
  )
}
