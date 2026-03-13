'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useThemeMode } from '@/lib/ThemeModeProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

const modeOrder = ['light', 'dark', 'system'] as const;
type ThemeMode = (typeof modeOrder)[number];

function getNextMode(current: ThemeMode): ThemeMode {
  const idx = modeOrder.indexOf(current);
  return modeOrder[(idx + 1) % modeOrder.length];
}

function getModeIcon(mode: ThemeMode) {
  switch (mode) {
    case 'light':
      return <Brightness7Icon />;
    case 'dark':
      return <Brightness4Icon />;
    case 'system':
      return <SettingsBrightnessIcon />;
  }
}

function getModeTooltip(mode: ThemeMode): string {
  switch (mode) {
    case 'light':
      return 'Light mode';
    case 'dark':
      return 'Dark mode';
    case 'system':
      return 'System mode';
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentMode = (mode ?? 'system') as ThemeMode;

  const handleToggleMode = () => {
    setMode(getNextMode(currentMode));
  };

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: (t) =>
            t.palette.mode === 'dark'
              ? 'rgba(15, 23, 42, 0.75)'
              : 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(16px) saturate(160%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar
          sx={{
            maxWidth: '1152px',
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Logo */}
          <Typography
            component={Link}
            href="/"
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.025em',
              textDecoration: 'none',
              color: 'text.primary',
              transition: 'color 0.2s',
              '&:hover': { color: '#A8DCAB' },
            }}
          >
            HY
            <Box component="span" sx={{ color: '#A8DCAB' }}>
              .
            </Box>
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {navLinks.map((link) => (
                <Typography
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive(link.href)
                      ? '#A8DCAB'
                      : 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: isActive(link.href)
                        ? '#A8DCAB'
                        : 'text.primary',
                    },
                  }}
                >
                  {link.label}
                </Typography>
              ))}

              {/* Theme toggle - Desktop */}
              <Tooltip title={getModeTooltip(currentMode)} arrow>
                <IconButton
                  onClick={handleToggleMode}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: '#A8DCAB' },
                  }}
                >
                  {getModeIcon(currentMode)}
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <>
              <Tooltip title={getModeTooltip(currentMode)} arrow>
                <IconButton
                  onClick={handleToggleMode}
                  size="small"
                  sx={{
                    mr: 1,
                    color: 'text.secondary',
                    '&:hover': { color: '#A8DCAB' },
                  }}
                >
                  {getModeIcon(currentMode)}
                </IconButton>
              </Tooltip>
              <IconButton
                onClick={handleDrawerToggle}
                aria-label="Toggle navigation menu"
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            background: (t) =>
              t.palette.mode === 'dark'
                ? 'rgba(15, 23, 42, 0.92)'
                : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px) saturate(160%)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: '-0.025em' }}
          >
            HY
            <Box component="span" sx={{ color: '#A8DCAB' }}>
              .
            </Box>
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 1, py: 2 }}>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.href}
              component={Link}
              href={link.href}
              onClick={handleDrawerToggle}
              selected={isActive(link.href)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(168, 220, 171, 0.12)',
                  color: '#A8DCAB',
                  '&:hover': {
                    backgroundColor: 'rgba(168, 220, 171, 0.18)',
                  },
                },
                '&:hover': {
                  backgroundColor: (t) =>
                    t.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>

        {/* Theme toggle inside drawer */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 'auto',
          }}
        >
          <Tooltip title={getModeTooltip(currentMode)} arrow placement="top">
            <IconButton
              onClick={handleToggleMode}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: '#A8DCAB' },
              }}
            >
              {getModeIcon(currentMode)}
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>

      {/* Toolbar spacer to push content below the fixed AppBar */}
      <Toolbar />
    </>
  );
}
