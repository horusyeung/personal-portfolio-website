import { describe, it, expect } from 'vitest'
import { createAppTheme } from '@/lib/theme'

describe('createAppTheme', () => {
  it('returns a valid light theme with correct palette colors', () => {
    const theme = createAppTheme('light')
    expect(theme.palette.mode).toBe('light')
    expect(theme.palette.primary.main).toBe('#0071e3')
    expect(theme.palette.background.default).toBe('#ffffff')
    expect(theme.palette.background.paper).toBe('#f5f5f7')
    expect(theme.palette.text.primary).toBe('#1d1d1f')
    expect(theme.palette.text.secondary).toBe('#86868b')
  })

  it('returns a valid dark theme with correct palette colors', () => {
    const theme = createAppTheme('dark')
    expect(theme.palette.mode).toBe('dark')
    expect(theme.palette.primary.main).toBe('#2997ff')
    expect(theme.palette.background.default).toBe('#000000')
    expect(theme.palette.background.paper).toBe('#1d1d1f')
    expect(theme.palette.text.primary).toBe('#f5f5f7')
    expect(theme.palette.text.secondary).toBe('#a1a1a6')
  })

  it('has different primary colors between light and dark modes', () => {
    const lightTheme = createAppTheme('light')
    const darkTheme = createAppTheme('dark')
    expect(lightTheme.palette.primary.main).toBe('#0071e3')
    expect(darkTheme.palette.primary.main).toBe('#2997ff')
    expect(lightTheme.palette.primary.main).not.toBe(darkTheme.palette.primary.main)
  })

  it('has correct background colors for each mode', () => {
    const lightTheme = createAppTheme('light')
    const darkTheme = createAppTheme('dark')
    expect(lightTheme.palette.background.default).toBe('#ffffff')
    expect(darkTheme.palette.background.default).toBe('#000000')
  })

  it('has h1 fontSize of 80', () => {
    const theme = createAppTheme('dark')
    expect(theme.typography.h1.fontSize).toBe(80)
  })
})
