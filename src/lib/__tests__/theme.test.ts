import { describe, it, expect } from 'vitest'
import { createAppTheme } from '@/lib/theme'

describe('createAppTheme', () => {
  it('returns a valid light theme with correct palette colors', () => {
    const theme = createAppTheme()
    expect(theme.palette.mode).toBe('light')
    expect(theme.palette.primary.main).toBe('#0071e3')
    expect(theme.palette.background.default).toBe('#ffffff')
    expect(theme.palette.background.paper).toBe('#f5f5f7')
    expect(theme.palette.text.primary).toBe('#1d1d1f')
    expect(theme.palette.text.secondary).toBe('#86868b')
  })

  it('has h1 fontSize of 80', () => {
    const theme = createAppTheme()
    expect(theme.typography.h1.fontSize).toBe(80)
  })
})
