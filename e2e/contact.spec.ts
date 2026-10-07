import { expect, test, type Route } from '@playwright/test'
import { CONTACT_SEND_ERROR } from '../src/lib/contact'

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contact', (route) => route.abort())
    await page.goto('/contact')
  })

  test('displays the page title', async ({ page }) => {
    const hero = page.getByTestId('contact-hero')
    await expect(hero).toBeVisible()
    await expect(hero).toContainText('Get in Touch')
  })

  test('shows contact information', async ({ page }) => {
    const info = page.getByTestId('contact-info')
    for (const text of [
      'horusyeungg@gmail.com',
      'linkedin.com/in/horusyeung',
      'github.com/horusyeung',
      'medium.com/@horusyeung',
      'Vancouver, BC, Canada',
      'horusyeung.com',
    ]) {
      await expect(info).toContainText(text)
    }
  })

  test('does not show a phone number', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)
  })

  test('has a contact form with required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Send a Message' })).toBeAttached()
    const form = page.getByTestId('contact-form')
    await expect(form.locator('input[name="name"]')).toBeAttached()
    await expect(form.locator('input[name="email"]')).toBeAttached()
    await expect(form.locator('textarea[name="message"]')).toBeAttached()
    await expect(page.getByTestId('submit-button')).toBeAttached()
  })

  test('shows send message button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeAttached()
  })

  test('form fields have required attribute', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toHaveAttribute('required')
    await expect(page.locator('input[name="email"]')).toHaveAttribute('required')
    await expect(page.locator('textarea[name="message"]')).toHaveAttribute('required')
  })

  test('invalid input shows field errors and sends nothing', async ({ page }) => {
    let requests = 0
    page.on('request', (request) => {
      if (request.url().endsWith('/api/contact')) requests++
    })

    // The subtitle's entrance changes wrapping above the form. Wait for it to settle before
    // clicking the initially empty form, which otherwise races that movement in Safari.
    await expect(page.getByTestId('contact-hero').locator('p').first()).toHaveCSS('opacity', '1')
    await page.getByRole('button', { name: 'Send Message' }).click()
    await expect(page.getByText('Please enter your name.')).toBeVisible()
    await expect(page.getByText('Please enter your email address.')).toBeVisible()
    await expect(page.getByText('Please enter a message.')).toBeVisible()
    await expect(page.getByLabel(/^Name/)).toBeFocused()

    await page.getByLabel(/^Name/).fill('Ada')
    await page.getByRole('textbox', { name: /^Email/ }).fill('not-an-email')
    await page.getByLabel(/^Message/).fill('Hello')
    await page.getByRole('button', { name: 'Send Message' }).click()
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible()
    await expect(page.getByRole('textbox', { name: /^Email/ })).toHaveAttribute(
      'aria-invalid',
      'true',
    )

    expect(requests).toBe(0)
  })

  test('a double-click submits once and shows the confirmation', async ({ page }) => {
    const requests: Route[] = []
    await page.route('**/api/contact', (route) => {
      requests.push(route)
    })

    await page.getByLabel(/^Name/).fill('Ada')
    await page.getByRole('textbox', { name: /^Email/ }).fill('ada@example.com')
    await page.getByLabel(/^Message/).fill('Hello')
    await page.getByRole('button', { name: 'Send Message' }).dblclick()

    await expect(page.getByRole('status')).toHaveText('Sending…')
    expect(requests).toHaveLength(1)
    await requests[0].fulfill({ json: { success: true } })
    await expect(page.getByRole('status')).toContainText('Message sent')
    await expect(page.getByRole('status')).toContainText('Horus will get back to you soon')
    expect(requests).toHaveLength(1)
  })

  test('shows the error message when sending fails', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 502, json: { error: 'Failed to send message.' } }),
    )

    await page.getByLabel(/^Name/).fill('Ada')
    await page.getByRole('textbox', { name: /^Email/ }).fill('ada@example.com')
    await page.getByLabel(/^Message/).fill('Hello')
    await page.getByRole('button', { name: 'Send Message' }).click()

    await expect(page.getByRole('status')).toHaveText(CONTACT_SEND_ERROR)
  })
})
