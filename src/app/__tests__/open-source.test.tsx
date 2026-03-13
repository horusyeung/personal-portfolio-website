import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createAppTheme } from '@/lib/theme'
import OpenSourcePage from '@/app/open-source/page'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/open-source',
}))

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

describe('OpenSourcePage', () => {
  it('renders "Open Source" heading', () => {
    renderWithTheme(<OpenSourcePage />)
    expect(screen.getByText('Open Source')).toBeInTheDocument()
  })

  it('renders all project names', () => {
    renderWithTheme(<OpenSourcePage />)
    expect(screen.getByText('ai-augmented-dev-workflow')).toBeInTheDocument()
    expect(screen.getByText('project-structures')).toBeInTheDocument()
    expect(screen.getByText('nextjs-nestjs-fullstack-starter')).toBeInTheDocument()
    expect(screen.getByText('react-native-starter')).toBeInTheDocument()
    expect(screen.getByText('personal-portfolio-website')).toBeInTheDocument()
  })

  it('shows "Live" status badges for completed projects', () => {
    renderWithTheme(<OpenSourcePage />)
    const live = screen.getAllByText('Live')
    expect(live.length).toBe(4)
  })

  it('shows "Coming Soon" status badge', () => {
    renderWithTheme(<OpenSourcePage />)
    const comingSoon = screen.getAllByText('Coming Soon')
    expect(comingSoon.length).toBe(1)
  })
})
