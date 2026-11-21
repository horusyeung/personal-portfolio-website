'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import ThemeToggle from '@/components/ThemeToggle'
import styles from './Navbar.module.css'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: 'Experience' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const navigationRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState<boolean>()

  const closeMenu = () => navigationRef.current?.hidePopover?.()

  useEffect(() => {
    // A persistent layout must also close the menu after Back/Forward or other route changes.
    navigationRef.current?.hidePopover?.()
  }, [pathname])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 600px)')
    const closeOnHistory = () => navigationRef.current?.hidePopover?.()
    const closeOnDesktop = () => {
      if (desktop.matches) closeOnHistory()
    }
    desktop.addEventListener('change', closeOnDesktop)
    // Query-only traversal can restore a project modal without changing usePathname().
    window.addEventListener('popstate', closeOnHistory)
    return () => {
      desktop.removeEventListener('change', closeOnDesktop)
      window.removeEventListener('popstate', closeOnHistory)
    }
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href)

  return (
    <>
      <AppBar
        className={styles.header}
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
          '@media (prefers-reduced-transparency: reduce)': {
            background: 'var(--mui-palette-background-default)',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            // Match the system-dark fallback's specificity before theme initialization.
            'html:not(.light):not(.dark) &': {
              background: 'var(--mui-palette-background-default)',
            },
          },
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        })}
      >
        <Toolbar
          className={styles.toolbar}
          sx={{
            maxWidth: 980,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            minHeight: '48px !important',
          }}
        >
          {/* Logo */}
          <Box
            data-testid='navbar-logo'
            component={Link}
            href='/'
            aria-label='Horus Yeung home'
            onClick={closeMenu}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: 32,
              height: 44,
              textDecoration: 'none',
              color: 'text.primary',
              transition: 'color 0.2s',
              borderRadius: '4px',
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            }}
          >
            <Box
              component='svg'
              viewBox='0 0 64 64'
              width='32'
              height='32'
              aria-hidden='true'
              focusable='false'
              sx={{ display: 'block' }}
            >
              <path
                d='M12 15v32m0-13c0-14 16-14 16 0v13'
                fill='none'
                stroke='currentColor'
                strokeWidth='7'
                strokeLinecap='round'
              />
              <Box
                component='path'
                d='m37 26 9 16 9-16M46 42l-4 8c-2 4-6 5-10 3'
                fill='none'
                stroke='currentColor'
                strokeWidth='7'
                strokeLinecap='round'
                strokeLinejoin='round'
                sx={{ color: 'primary.link' }}
              />
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Nav links */}
          <Box
            component='nav'
            id='main-navigation'
            popover='auto'
            ref={navigationRef}
            onToggle={(event) => setMenuOpen(event.currentTarget.matches(':popover-open'))}
            aria-label='Main'
            className={styles.navigation}
          >
            {navLinks.map((link) => (
              <Typography
                data-testid={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
                key={link.href}
                component={Link}
                href={link.href}
                onClick={closeMenu}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={styles.link}
                sx={{
                  fontWeight: 400,
                  textDecoration: 'none',
                  color: isActive(link.href) ? 'primary.text' : 'text.secondary',
                  transition: 'color 0.3s',
                  borderRadius: '4px',
                  '&:hover': {
                    color: isActive(link.href) ? 'primary.text' : 'text.primary',
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
          <Box sx={{ ml: { xs: 1.5, sm: 2 }, display: 'flex' }}>
            <ThemeToggle />
          </Box>
          <button
            type='button'
            popoverTarget='main-navigation'
            aria-label='Main menu'
            aria-controls='main-navigation'
            aria-expanded={menuOpen}
            className={styles.menuButton}
          >
            <span>Menu</span>
            <svg viewBox='0 0 20 20' aria-hidden='true' focusable='false'>
              <path d='M3 10h14' />
              <path d='M3 10h14' />
            </svg>
          </button>
        </Toolbar>
      </AppBar>

      {/* Spacer for fixed nav */}
      <Toolbar className={styles.spacer} sx={{ minHeight: '48px !important' }} />
    </>
  )
}
