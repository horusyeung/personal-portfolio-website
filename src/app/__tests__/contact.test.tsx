import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('ContactPage form', () => {
  const jsonResponse = (status: number, body: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function fillForm(values: { name: string; email: string; message: string }) {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Name/), values.name)
    await user.type(screen.getByLabelText(/^Email/), values.email)
    await user.type(screen.getByLabelText(/^Message/), values.message)
  }

  it('shows a field error, focuses it and sends nothing for an invalid email', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderWithTheme(<ContactPage />)

    await fillForm({ name: 'Ada', email: 'not-an-email', message: 'Hello' })
    fireEvent.submit(screen.getByTestId('contact-form'))

    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/^Email/)).toHaveFocus()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends trimmed values once even when submitted twice', async () => {
    let respond: (value: unknown) => void = () => {}
    const fetchMock = vi.fn(() => new Promise((resolve) => (respond = resolve)))
    vi.stubGlobal('fetch', fetchMock)
    renderWithTheme(<ContactPage />)

    await fillForm({ name: ' Ada ', email: ' ada@example.com ', message: ' Hello ' })
    const form = screen.getByTestId('contact-form')
    fireEvent.submit(form)
    fireEvent.submit(form)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(JSON.parse(init.body as string)).toEqual({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hello',
      website: '',
    })
    expect(screen.getByRole('button', { name: 'Sending...' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )

    respond(jsonResponse(200, { success: true }))
    expect(await screen.findByText(/Message sent successfully/)).toBeInTheDocument()
  })

  it('shows field errors returned by the server', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(400, { fields: { email: 'Please enter a valid email address.' } }),
      ),
    )
    renderWithTheme(<ContactPage />)

    await fillForm({ name: 'Ada', email: 'ada@example.com', message: 'Hello' })
    fireEvent.submit(screen.getByTestId('contact-form'))

    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument()
    expect(screen.queryByText(/Failed to send message/)).not.toBeInTheDocument()
  })

  it('shows the generic error when sending fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(502, { error: 'Failed' })),
    )
    renderWithTheme(<ContactPage />)

    await fillForm({ name: 'Ada', email: 'ada@example.com', message: 'Hello' })
    fireEvent.submit(screen.getByTestId('contact-form'))

    expect(await screen.findByText(/Failed to send message/)).toBeInTheDocument()
  })
})
