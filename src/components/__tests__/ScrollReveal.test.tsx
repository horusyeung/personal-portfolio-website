import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createAppTheme } from '@/lib/theme'
import ScrollReveal from '@/components/ScrollReveal'

const theme = createAppTheme()

// Mock IntersectionObserver as a proper class
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor() {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

  vi.stubGlobal('matchMedia', function (query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
})

function renderWithTheme(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  })
}

describe('ScrollReveal', () => {
  it('renders children content', () => {
    renderWithTheme(
      <ScrollReveal>
        <span>Test Content</span>
      </ScrollReveal>,
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders content visible and marks it for the entrance animation', () => {
    renderWithTheme(
      <ScrollReveal>
        <span>Revealed Content</span>
      </ScrollReveal>,
    )
    const element = screen.getByText('Revealed Content').parentElement
    // Hiding is left to CSS (only when JS will animate it in and motion is allowed)
    expect(element).not.toHaveStyle({ opacity: '0' })
    expect(element).toHaveAttribute('data-intro')
  })
})
