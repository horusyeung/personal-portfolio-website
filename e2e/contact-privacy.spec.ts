import { expect, test, type Page, type Request } from '@playwright/test'

const message = {
  name: ' Ada ',
  email: ' ada@example.com ',
  message: ' Private hydration regression fixture. ',
}

async function protectRequests(page: Page, baseURL: string) {
  const origin = new URL(baseURL).origin
  const attempts: Request[] = []
  let mockSubmission = false
  await page.route('**/*', (route) => {
    const request = route.request()
    const url = new URL(request.url())
    if (
      url.pathname === '/api/contact' ||
      (request.isNavigationRequest() &&
        ['name', 'email', 'message'].some((key) => url.searchParams.has(key)))
    ) {
      attempts.push(request)
      if (
        mockSubmission &&
        url.origin === origin &&
        url.pathname === '/api/contact' &&
        request.method() === 'POST'
      ) {
        return route.fulfill({ json: { success: true } })
      }
      return route.abort()
    }
    if (url.origin !== origin || !['GET', 'HEAD'].includes(request.method())) {
      return route.abort()
    }
    return route.continue()
  })
  return {
    attempts,
    allowMockSubmission: () => {
      mockSubmission = true
    },
  }
}

async function fillMessage(page: Page) {
  await page.getByLabel(/^Name/).fill(message.name)
  await page.getByRole('textbox', { name: /^Email/ }).fill(message.email)
  await page.getByLabel(/^Message/).fill(message.message)
}

async function tryNativeSubmission(page: Page) {
  // Real mouse/keyboard input tests the browser's native form behavior before React is ready.
  const send = page.getByRole('button', { name: 'Send Message', exact: true })
  await expect(send).toBeDisabled()
  await send.scrollIntoViewIfNeeded()
  const bounds = (await send.boundingBox())!
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
  await page.getByRole('textbox', { name: /^Email/ }).press('Enter')
  // The deliberately held scripts prevent load; inspect the URL without waiting for that event.
  await expect
    .poll(() => {
      const url = new URL(page.url())
      return { pathname: url.pathname, search: url.search }
    })
    .toEqual({ pathname: '/contact', search: '' })
  await expect(send).toBeDisabled()
}

test.describe('Contact privacy without JavaScript', () => {
  test.use({ javaScriptEnabled: false, reducedMotion: 'reduce' })

  test('native click and Enter cannot put a message into navigation or an API request', async ({
    page,
    baseURL,
  }) => {
    const guard = await protectRequests(page, baseURL!)
    await page.goto('/contact')
    await fillMessage(page)
    await tryNativeSubmission(page)
    expect(guard.attempts).toHaveLength(0)
    await expect(
      page.getByTestId('contact-info').getByRole('link', { name: 'horusyeungg@gmail.com' }),
    ).toHaveAttribute('href', 'mailto:horusyeungg@gmail.com')
    // Playwright's text engine skips NOSCRIPT; assert its actual rendered paragraph directly.
    const fallback = page.locator('noscript p')
    await expect(fallback).toHaveText(
      'JavaScript is required to send this form. Use the email link alongside it instead.',
    )
    await expect(fallback).toBeVisible()
  })
})

test('delayed hydration blocks native submission, then sends the preserved message once as mocked JSON', async ({
  page,
  baseURL,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const guard = await protectRequests(page, baseURL!)
  let releaseScripts!: () => void
  const scriptsReady = new Promise<void>((resolve) => {
    releaseScripts = resolve
  })
  let heldScripts = 0
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'script') {
      heldScripts++
      await scriptsReady
    }
    await route.fallback()
  })
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  try {
    await page.goto('/contact', { waitUntil: 'commit' })
    await expect.poll(() => heldScripts).toBeGreaterThan(0)
    await fillMessage(page)
    await tryNativeSubmission(page)
    expect(guard.attempts).toHaveLength(0)

    guard.allowMockSubmission()
    releaseScripts()
    const send = page.getByRole('button', { name: 'Send Message', exact: true })
    await expect(send).toBeEnabled()
    await expect(page.getByLabel(/^Name/)).toHaveValue(message.name)
    await expect(page.getByLabel(/^Message/)).toHaveValue(message.message)
    await send.click()
    await expect(page.getByRole('status')).toContainText('Message sent')
    await expect.poll(() => guard.attempts.length).toBe(1)
    const request = guard.attempts[0]
    expect(new URL(request.url()).pathname).toBe('/api/contact')
    expect(request.method()).toBe('POST')
    expect(request.headers()['content-type']).toBe('application/json')
    expect(request.postDataJSON()).toEqual({
      name: message.name.trim(),
      email: message.email.trim(),
      message: message.message.trim(),
      website: '',
    })
    await expect(page).toHaveURL((url) => url.pathname === '/contact' && url.search === '')
    expect(guard.attempts).toHaveLength(1)
    expect(pageErrors).toEqual([])
  } finally {
    releaseScripts()
  }
})
