import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createAppTheme } from '@/lib/theme'
import ExperiencePage from '@/app/experience/page'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/experience',
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

const theme = createAppTheme('dark')

function renderWithTheme(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  })
}

describe('ExperiencePage', () => {
  it('renders "Experience" heading', () => {
    renderWithTheme(<ExperiencePage />)
    expect(screen.getByText('Experience')).toBeInTheDocument()
  })

  it('renders all 6 experience entries', () => {
    renderWithTheme(<ExperiencePage />)
    const junoMarkets = screen.getAllByText('Juno Markets')
    expect(junoMarkets).toHaveLength(3)
    expect(screen.getByText(/Beta Labs/)).toBeInTheDocument()
    expect(screen.getByText('The Hong Kong Jockey Club')).toBeInTheDocument()
    expect(screen.getByText('Pure Group')).toBeInTheDocument()
  })

  it('renders "Education" section', () => {
    renderWithTheme(<ExperiencePage />)
    expect(screen.getByText('Education')).toBeInTheDocument()
  })

  it('renders "BBA (Hons) Business Analysis"', () => {
    renderWithTheme(<ExperiencePage />)
    expect(screen.getByText('BBA (Hons) Business Analysis')).toBeInTheDocument()
  })

  it('renders second degree "Associate in Business, Hospitality Management (Distinction)"', () => {
    renderWithTheme(<ExperiencePage />)
    expect(
      screen.getByText('Associate in Business, Hospitality Management (Distinction)'),
    ).toBeInTheDocument()
  })

  it('renders "Certifications" section with all 3 certifications', () => {
    renderWithTheme(<ExperiencePage />)
    expect(screen.getByText('Certifications')).toBeInTheDocument()
    expect(screen.getByText('Meta React Native Specialization')).toBeInTheDocument()
    expect(screen.getByText('Automated Software Testing with Playwright')).toBeInTheDocument()
    expect(screen.getByText('Agile with Atlassian Jira')).toBeInTheDocument()
  })
})
