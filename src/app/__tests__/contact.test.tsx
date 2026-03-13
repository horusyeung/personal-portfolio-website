import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createAppTheme } from '@/lib/theme'
import ContactPage from '@/app/contact/page'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/contact',
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

describe('ContactPage', () => {
  it('renders "Get in Touch" heading', () => {
    renderWithTheme(<ContactPage />)
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  })

  it('renders "Send a Message" form title', () => {
    renderWithTheme(<ContactPage />)
    expect(screen.getByText('Send a Message')).toBeInTheDocument()
  })

  it('contains email link for horusyeungg@gmail.com', () => {
    renderWithTheme(<ContactPage />)
    const emailLink = screen.getByText('horusyeungg@gmail.com')
    expect(emailLink).toBeInTheDocument()
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:horusyeungg@gmail.com')
  })

  it('contains LinkedIn link', () => {
    renderWithTheme(<ContactPage />)
    const linkedInLink = screen.getByText('linkedin.com/in/horusyeung')
    expect(linkedInLink).toBeInTheDocument()
    expect(linkedInLink.closest('a')).toHaveAttribute('href', 'https://linkedin.com/in/horusyeung')
  })

  it('contains GitHub link', () => {
    renderWithTheme(<ContactPage />)
    const githubLink = screen.getByText('github.com/horusyeung')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink.closest('a')).toHaveAttribute('href', 'https://github.com/horusyeung')
  })

  it('contains Medium link', () => {
    renderWithTheme(<ContactPage />)
    const mediumLink = screen.getByText('medium.com/@horusyeung')
    expect(mediumLink).toBeInTheDocument()
    expect(mediumLink.closest('a')).toHaveAttribute('href', 'https://medium.com/@horusyeung')
  })

  it('does NOT contain a phone number', () => {
    renderWithTheme(<ContactPage />)
    expect(screen.queryByText(/Phone/i)).not.toBeInTheDocument()
  })

  it('form has Name, Email, Message fields', () => {
    renderWithTheme(<ContactPage />)
    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Message/)).toBeInTheDocument()
  })

  it('has "Send Message" button', () => {
    renderWithTheme(<ContactPage />)
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
  })
})
