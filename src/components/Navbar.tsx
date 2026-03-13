'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'

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
        sx={{
          background: 'rgba(255, 255, 255, 0.8)',
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

          {/* Nav links */}
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
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer for fixed nav */}
      <Toolbar sx={{ minHeight: '48px !important' }} />
    </>
  )
}
