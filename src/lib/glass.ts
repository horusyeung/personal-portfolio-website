import type { SystemStyleObject } from '@mui/system'
import type { Theme } from '@mui/material/styles'

// Values and preference fallbacks live in glass.module.css, mounted on <body> by the layout.
export const glassSx = {
  background: 'var(--glass-fill)',
  WebkitBackdropFilter:
    'var(--glass-backdrop, blur(var(--glass-blur)) saturate(var(--glass-saturate)))',
  backdropFilter: 'var(--glass-backdrop, blur(var(--glass-blur)) saturate(var(--glass-saturate)))',
  border: 'var(--glass-rim)',
  boxShadow: 'var(--glass-shadow)',
} satisfies SystemStyleObject<Theme>

export const decorativeGlassSx = {
  ...glassSx,
  background: 'var(--glass-decorative-fill)',
} satisfies SystemStyleObject<Theme>

export const glassEdgeSx = {
  background: 'var(--glass-edge-fill)',
  WebkitBackdropFilter: 'var(--glass-edge-backdrop, blur(var(--glass-edge-blur)))',
  backdropFilter: 'var(--glass-edge-backdrop, blur(var(--glass-edge-blur)))',
  pointerEvents: 'none',
  '@media (prefers-reduced-transparency: reduce), (forced-colors: active)': {
    maskImage: 'none',
  },
} satisfies SystemStyleObject<Theme>
