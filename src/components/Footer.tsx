'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/horusyeung',
    icon: <GitHubIcon />,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/horusyeung',
    icon: <LinkedInIcon />,
  },
  {
    label: 'Email',
    href: 'mailto:horusyeungg@gmail.com',
    icon: <EmailIcon />,
  },
];

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: (t) =>
          t.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.6)'
            : 'rgba(245, 245, 245, 0.8)',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          spacing={4}
        >
          {/* Brand section */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              component={Link}
              href="/"
              variant="h6"
              sx={{
                fontWeight: 700,
                textDecoration: 'none',
                color: 'text.primary',
                display: 'inline-block',
              }}
            >
              Horus Yeung
              <Box component="span" sx={{ color: '#A8DCAB' }}>
                .
              </Box>
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, color: 'text.secondary' }}
            >
              Senior Software Architect & Frontend Team Lead
            </Typography>
          </Box>

          {/* Quick links */}
          <Stack
            direction="row"
            spacing={3}
            sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
          >
            {quickLinks.map((link) => (
              <Typography
                key={link.href}
                component={Link}
                href={link.href}
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: 'text.secondary',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#A8DCAB' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Stack>

          {/* Social icons */}
          <Stack direction="row" spacing={1} alignItems="center">
            {socialLinks.map((link) => (
              <IconButton
                key={link.label}
                component="a"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                size="small"
                sx={{
                  color: 'text.secondary',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#A8DCAB' },
                }}
              >
                {link.icon}
              </IconButton>
            ))}
          </Stack>
        </Stack>

        {/* Bottom copyright line */}
        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            &copy; {new Date().getFullYear()} Horus Yeung. Built with Next.js &
            MUI.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
