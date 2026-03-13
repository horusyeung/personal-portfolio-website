import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createAppTheme } from '@/lib/theme'
import HomePage from '@/app/page'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

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

const theme = createAppTheme()

function renderWithTheme(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  })
}

describe('HomePage', () => {
  it('renders "Horus Yeung" heading', () => {
    renderWithTheme(<HomePage />)
    expect(screen.getByText('Horus Yeung')).toBeInTheDocument()
  })

  it('renders "Software Architect & Team Lead" overline', () => {
    renderWithTheme(<HomePage />)
    expect(screen.getByText('Software Architect & Team Lead')).toBeInTheDocument()
  })

  it('contains "View Experience" button', () => {
    renderWithTheme(<HomePage />)
    expect(screen.getByText('View Experience')).toBeInTheDocument()
  })

  it('contains "Get in Touch" link', () => {
    renderWithTheme(<HomePage />)
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  })

  it('stats line includes "50K+ Users"', () => {
    renderWithTheme(<HomePage />)
    const statsText = screen.getByText(/50K\+ Users/)
    expect(statsText).toBeInTheDocument()
  })

  it('about section does NOT contain "Juno Markets"', () => {
    renderWithTheme(<HomePage />)
    expect(screen.queryByText('Juno Markets')).not.toBeInTheDocument()
  })

  it('renders "Technologies I work with." heading', () => {
    renderWithTheme(<HomePage />)
    expect(screen.getByText('Technologies I work with.')).toBeInTheDocument()
  })
})
