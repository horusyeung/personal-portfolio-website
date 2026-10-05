import { expect, test } from '@playwright/test'

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
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

  test('form validation prevents empty submission', async ({ page }) => {
    await page.getByRole('button', { name: 'Send Message' }).click()
    await expect(page).toHaveURL(/\/contact$/)
  })
})
