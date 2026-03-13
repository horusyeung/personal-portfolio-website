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

  it('has initial hidden state with opacity 0', () => {
    renderWithTheme(
      <ScrollReveal>
        <span>Hidden Content</span>
      </ScrollReveal>,
    )
    const element = screen.getByText('Hidden Content').parentElement
    expect(element).toHaveStyle({ opacity: '0' })
  })
})
