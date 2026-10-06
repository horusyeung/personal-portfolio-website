'use client'

import { createTheme, type Theme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface PaletteColor {
    /** Same hue as `main`, dark enough for text on `background.paper` (WCAG AA) */
    text?: string
    /** Links and accent text on the page background (WCAG AA in both color schemes) */
    link?: string
  }
  interface SimplePaletteColorOptions {
    text?: string
    link?: string
  }
  interface Palette {
    /** The "Live" status chip on /open-source */
    live: { background: string; text: string }
  }
  interface PaletteOptions {
    live?: { background: string; text: string }
  }
}

const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Helvetica", "Arial", sans-serif'

export function createAppTheme(): Theme {
  return createTheme({
    // Light is the original palette; dark follows the system or the navbar toggle
    cssVariables: { colorSchemeSelector: 'class' },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#0071e3',
            light: '#2997ff',
            dark: '#005bba',
            contrastText: '#ffffff',
            // #0071e3 is 4.3:1 on #f5f5f7; this is 5.1:1 (4.5:1 needed)
            text: '#0066cc',
            link: '#0071e3',
          },
          background: {
            default: '#ffffff',
            paper: '#f5f5f7',
          },
          text: {
            primary: '#1d1d1f',
            // 5.1:1 on white, 4.7:1 on #f5f5f7 (was #86868b: 3.6:1 / 3.3:1)
            secondary: '#6e6e73',
          },
          divider: '#d2d2d7',
          // #1d7a35 keeps the green at 4.9:1 on the chip (rgb(52, 199, 89) was 2.0:1)
          live: { background: 'rgba(52, 199, 89, 0.12)', text: '#1d7a35' },
        },
      },
      dark: {
        palette: {
          primary: {
            // Buttons and focus rings keep the light blue: white text on it is 4.6:1
            main: '#0071e3',
            light: '#2997ff',
            dark: '#005bba',
            contrastText: '#ffffff',
            // 5.6:1 on #1d1d1f, 7.0:1 on black (#0071e3 text would be 4.4:1 on black)
            text: '#2997ff',
            link: '#2997ff',
          },
          background: {
            default: '#000000',
            paper: '#1d1d1f',
          },
          text: {
            primary: '#f5f5f7',
            // 8.7:1 on black, 6.5:1 on #1d1d1f
            secondary: '#a1a1a6',
          },
          divider: '#424245',
          // 8.4:1 on the chip
          live: { background: 'rgba(48, 209, 88, 0.16)', text: '#30d158' },
        },
      },
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
        styleOverrides: (theme) => ({
          '@media (prefers-reduced-motion: no-preference)': {
            html: { scrollBehavior: 'smooth' },
          },
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
            background: 'rgba(0, 0, 0, 0.15)',
            borderRadius: 4,
            ...theme.applyStyles('dark', { background: 'rgba(255, 255, 255, 0.2)' }),
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0, 0, 0, 0.3)',
            ...theme.applyStyles('dark', { background: 'rgba(255, 255, 255, 0.35)' }),
          },
        }),
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
                borderColor: '#0071e3',
              },
            },
          },
        },
      },
    },
  })
}
