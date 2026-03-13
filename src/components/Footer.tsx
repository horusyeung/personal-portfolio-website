'use client'

import Link from 'next/link'
import { Box, Typography, Divider } from '@mui/material'

const exploreLinks = [
  { href: '/experience', label: 'Experience' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/contact', label: 'Contact' },
]

const connectLinks = [
  { href: 'mailto:horusyeungg@gmail.com', label: 'Email', external: false },
  {
    href: 'https://linkedin.com/in/horusyeung',
    label: 'LinkedIn',
    external: true,
  },
  {
    href: 'https://github.com/horusyeung',
    label: 'GitHub',
    external: true,
  },
  {
    href: 'https://medium.com/@horusyeung',
    label: 'Medium',
    external: true,
  },
]

const columnHeaderSx = {
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: 'text.secondary',
  mb: '12px',
}

const linkSx = {
  fontSize: 12,
  fontWeight: 400,
  color: 'text.secondary',
  textDecoration: 'none',
  lineHeight: 2,
  display: 'block',
  transition: 'color 0.2s',
  borderRadius: '4px',
  '&:hover': { color: 'text.primary' },
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: 2,
  },
}

export default function Footer() {
  return (
    <Box
      data-testid='footer'
      component='footer'
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: '34px',
        pb: '20px',
      }}
    >
      <Box
        sx={{
          maxWidth: 980,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* 3-column section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: { xs: 3, sm: 4 },
          }}
        >
          {/* Column 1: Explore */}
          <Box data-testid='footer-explore'>
            <Typography sx={columnHeaderSx}>Explore</Typography>
            {exploreLinks.map((link) => (
              <Typography key={link.href} component={Link} href={link.href} sx={linkSx}>
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* Column 2: Connect */}
          <Box data-testid='footer-connect'>
            <Typography sx={columnHeaderSx}>Connect</Typography>
            {connectLinks.map((link) => (
              <Typography
                key={link.label}
                component='a'
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                sx={linkSx}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* Column 3: About */}
          <Box data-testid='footer-about'>
            <Typography sx={columnHeaderSx}>About</Typography>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                color: 'text.secondary',
                lineHeight: 1.8,
              }}
            >
              Senior Software Architect and Frontend Team Lead with 6+ years building
              high-performance fintech and trading platforms.
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                color: 'text.secondary',
                mt: 1,
              }}
            >
              Vancouver, BC
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 3 }} />

        {/* Copyright */}
        <Typography
          sx={{
            fontSize: 12,
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          &copy; 2026 Horus Yeung. Built with Next.js &amp; MUI.
        </Typography>
      </Box>
    </Box>
  )
}
