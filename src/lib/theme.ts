'use client';

import { createTheme, type Theme } from '@mui/material/styles';

// ── Brand Colors ─────────────────────────────────────────────────────────────
const systemColors = {
  primary: '#A8DCAB',       // sage green
  primaryLight: '#C8ECC9',
  primaryDark: '#7BC17F',
  secondary: '#6366F1',     // indigo accent
  error: '#F43F5E',         // rose
  warning: '#F59E0B',       // amber
  success: '#10B981',       // emerald
  info: '#0EA5E9',          // sky
} as const;

// ── Dark Palette (Slate-based) ───────────────────────────────────────────────
const darkPalette = {
  background: '#0F172A',
  backgroundElevated: '#1E293B',

  text: '#F1F5F9',
  textSecondary: 'rgba(148, 163, 184, 1)',

  separator: 'rgba(51, 65, 85, 0.80)',

  fillTertiary: 'rgba(148, 163, 184, 0.12)',
  glassBorder: 'rgba(148, 163, 184, 0.10)',
} as const;

// ── Light Palette ────────────────────────────────────────────────────────────
const lightPalette = {
  background: '#F8FAFB',
  backgroundElevated: '#FFFFFF',

  text: '#0F172A',
  textSecondary: 'rgba(71, 85, 105, 1)',

  separator: 'rgba(226, 232, 240, 1)',

  fillTertiary: 'rgba(100, 116, 139, 0.06)',
  glassBorder: 'rgba(226, 232, 240, 0.60)',
} as const;

// ── Typography ───────────────────────────────────────────────────────────────
const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Helvetica", "Arial", sans-serif';

const typography = {
  largeTitle: { fontSize: 34, fontWeight: 700, lineHeight: 1.18, letterSpacing: 0.37 },
  title1: { fontSize: 28, fontWeight: 700, lineHeight: 1.21, letterSpacing: 0.36 },
  title2: { fontSize: 22, fontWeight: 700, lineHeight: 1.27, letterSpacing: 0.35 },
  title3: { fontSize: 20, fontWeight: 600, lineHeight: 1.25, letterSpacing: 0.38 },
  headline: { fontSize: 17, fontWeight: 600, lineHeight: 1.29, letterSpacing: -0.41 },
  body: { fontSize: 17, fontWeight: 400, lineHeight: 1.29, letterSpacing: -0.41 },
  subheadline: { fontSize: 15, fontWeight: 400, lineHeight: 1.33, letterSpacing: -0.24 },
} as const;

// ── Radii ────────────────────────────────────────────────────────────────────
const radii = {
  card: 16,
  buttonPill: 9999,
  input: 10,
  chip: 8,
} as const;

// ── Theme Factory ────────────────────────────────────────────────────────────
export function createAppTheme(mode: 'light' | 'dark'): Theme {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: systemColors.primary,
        light: systemColors.primaryLight,
        dark: systemColors.primaryDark,
        contrastText: '#0F172A',
      },
      secondary: {
        main: systemColors.secondary,
        light: '#818CF8',
        dark: '#4F46E5',
        contrastText: '#FFFFFF',
      },
      error: {
        main: systemColors.error,
      },
      warning: {
        main: systemColors.warning,
      },
      success: {
        main: systemColors.success,
      },
      info: {
        main: systemColors.info,
      },
      background: {
        default: palette.background,
        paper: palette.backgroundElevated,
      },
      text: {
        primary: palette.text,
        secondary: palette.textSecondary,
      },
      divider: palette.separator,
    },
    typography: {
      fontFamily: fontStack,
      h1: {
        fontSize: typography.largeTitle.fontSize,
        fontWeight: typography.largeTitle.fontWeight,
        lineHeight: typography.largeTitle.lineHeight,
      },
      h2: {
        fontSize: typography.title1.fontSize,
        fontWeight: typography.title1.fontWeight,
        lineHeight: typography.title1.lineHeight,
      },
      h3: {
        fontSize: typography.title2.fontSize,
        fontWeight: typography.title2.fontWeight,
        lineHeight: typography.title2.lineHeight,
      },
      h4: {
        fontSize: typography.title3.fontSize,
        fontWeight: typography.title3.fontWeight,
        lineHeight: typography.title3.lineHeight,
      },
      h5: {
        fontSize: typography.headline.fontSize,
        fontWeight: typography.headline.fontWeight,
        lineHeight: typography.headline.lineHeight,
      },
      h6: {
        fontSize: typography.subheadline.fontSize,
        fontWeight: 600,
        lineHeight: typography.subheadline.lineHeight,
      },
      body1: {
        fontSize: typography.body.fontSize,
        lineHeight: typography.body.lineHeight,
      },
      body2: {
        fontSize: typography.subheadline.fontSize,
        lineHeight: typography.subheadline.lineHeight,
      },
      button: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            scrollBehavior: 'smooth',
          },
          body: {
            fontFamily: fontStack,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none' as const,
            borderRadius: radii.buttonPill,
            fontWeight: 600,
            padding: '12px 24px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radii.card,
            backgroundImage: 'none',
            border: `0.5px solid ${palette.glassBorder}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: radii.input,
              backgroundColor: palette.fillTertiary,
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: systemColors.primary,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radii.chip,
          },
        },
      },
    },
  });
}

// Default dark theme for backwards compatibility
const theme = createAppTheme('dark');
export default theme;

// ── Glassmorphic Presets ─────────────────────────────────────────────────────

export const glassPresets = {
  subtle: {
    blur: 12,
    saturation: 150,
    dark: { background: 'rgba(15, 23, 42, 0.55)', border: 'rgba(148, 163, 184, 0.08)' },
    light: { background: 'rgba(255, 255, 255, 0.60)', border: 'rgba(226, 232, 240, 0.40)' },
  },
  standard: {
    blur: 16,
    saturation: 160,
    dark: { background: 'rgba(15, 23, 42, 0.68)', border: 'rgba(148, 163, 184, 0.10)' },
    light: { background: 'rgba(255, 255, 255, 0.72)', border: 'rgba(226, 232, 240, 0.50)' },
  },
  prominent: {
    blur: 24,
    saturation: 180,
    dark: { background: 'rgba(15, 23, 42, 0.82)', border: 'rgba(148, 163, 184, 0.12)' },
    light: { background: 'rgba(255, 255, 255, 0.85)', border: 'rgba(226, 232, 240, 0.60)' },
  },
} as const;

export type GlassIntensity = keyof typeof glassPresets;

/**
 * Returns an MUI-compatible `sx` object for glassmorphic surfaces.
 *
 * Usage:
 * ```tsx
 * <Box sx={getGlassSx('dark', 'standard')} />
 * ```
 */
export function getGlassSx(
  mode: 'light' | 'dark',
  intensity: GlassIntensity = 'standard',
) {
  const preset = glassPresets[intensity];
  const colors = mode === 'dark' ? preset.dark : preset.light;
  return {
    background: colors.background,
    backdropFilter: `blur(${preset.blur}px) saturate(${preset.saturation}%)`,
    WebkitBackdropFilter: `blur(${preset.blur}px) saturate(${preset.saturation}%)`,
    border: `0.5px solid ${colors.border}`,
  };
}
