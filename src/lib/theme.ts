'use client'

import { createTheme, type Theme } from '@mui/material/styles'

const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Helvetica", "Arial", sans-serif'

export function createAppTheme(mode: 'light' | 'dark'): Theme {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#2997ff' : '#0071e3',
        light: isDark ? '#6cb8ff' : '#2997ff',
        dark: isDark ? '#0077ed' : '#005bba',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#000000' : '#ffffff',
        paper: isDark ? '#1d1d1f' : '#f5f5f7',
      },
      text: {
        primary: isDark ? '#f5f5f7' : '#1d1d1f',
        secondary: isDark ? '#a1a1a6' : '#86868b',
      },
      divider: isDark ? '#424245' : '#d2d2d7',
    },
    typography: {
      fontFamily: fontStack,
      h1: {
        fontSize: 80,
        fontWeight: 700,
        lineHeight: 1.05,
        letterSpacing: '-0.015em',
      },
      h2: {
        fontSize: 56,
        fontWeight: 700,
        lineHeight: 1.07,
        letterSpacing: '-0.012em',
      },
      h3: {
        fontSize: 40,
        fontWeight: 600,
        lineHeight: 1.1,
        letterSpacing: '-0.008em',
      },
      h4: {
        fontSize: 28,
        fontWeight: 600,
        lineHeight: 1.14,
        letterSpacing: '-0.005em',
      },
      h5: {
        fontSize: 21,
        fontWeight: 600,
        lineHeight: 1.24,
      },
      h6: {
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.33,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
      },
      body1: {
        fontSize: 17,
        lineHeight: 1.47,
      },
      body2: {
        fontSize: 14,
        lineHeight: 1.43,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none' as const,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { scrollBehavior: 'smooth' },
          body: {
            fontFamily: fontStack,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          '::-webkit-scrollbar': {
            width: 8,
          },
          '::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '::-webkit-scrollbar-thumb': {
            background: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            borderRadius: 4,
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none' as const,
            borderRadius: 9999,
            fontWeight: 600,
            padding: '12px 24px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              '&.Mui-focused fieldset': {
                borderColor: isDark ? '#2997ff' : '#0071e3',
              },
            },
          },
        },
      },
    },
  })
}
