import { describe, it, expect } from 'vitest'
import { createAppTheme } from '@/lib/theme'
import { siteLayers } from '@/lib/layers'

describe('createAppTheme', () => {
  it('returns a valid light theme with correct palette colors', () => {
    const theme = createAppTheme()
    expect(theme.palette.mode).toBe('light')
    expect(theme.palette.primary.main).toBe('#0071e3')
    expect(theme.palette.background.default).toBe('#ffffff')
    expect(theme.palette.background.paper).toBe('#f5f5f7')
    expect(theme.palette.text.primary).toBe('#1d1d1f')
    expect(theme.palette.text.secondary).toBe('#6e6e73')
    expect(theme.palette.primary.text).toBe('#0066cc')
  })

  it('has h1 fontSize of 80', () => {
    const theme = createAppTheme()
    expect(theme.typography.h1.fontSize).toBe(80)
  })

  it('keeps feedback above the nav, dialogs above feedback, and the skip link above dialogs', () => {
    const theme = createAppTheme()
    expect(theme.zIndex.appBar).toBe(siteLayers.nav)
    expect(theme.zIndex.modal).toBe(siteLayers.dialog)
    expect(siteLayers.island).toBeGreaterThan(theme.zIndex.appBar)
    expect(theme.zIndex.modal).toBeGreaterThan(siteLayers.island)
    expect(siteLayers.skipLink).toBeGreaterThan(theme.zIndex.modal)
  })
})
