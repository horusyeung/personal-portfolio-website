import { expect, test } from '@playwright/test'

const PAGES = ['/', '/experience', '/open-source', '/contact']
const isHome = (url: URL) => url.pathname === '/'

test.describe('Navigation', () => {
  test('navbar is visible on all pages', async ({ page }) => {
    await page.goto('/')
    for (const link of ['home', 'experience', 'open-source', 'contact']) {
      await expect(page.getByTestId(`nav-link-${link}`)).toBeVisible()
    }

    for (const path of PAGES) {
      await page.goto(path)
      await expect(page.getByTestId('navbar-logo')).toBeVisible()
    }
  })

  test('logo links to home page', async ({ page }) => {
    await page.goto('/experience')
    await page.getByTestId('navbar-logo').click()
    await expect(page).toHaveURL(isHome)
  })

  test('Home link navigates to home page', async ({ page }) => {
    await page.goto('/experience')
    await page.getByTestId('nav-link-home').click()
    await expect(page).toHaveURL(isHome)
  })

  test('navbar links navigate correctly', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('nav-link-experience').click()
    await expect(page).toHaveURL(/\/experience$/)

    await page.getByTestId('nav-link-open-source').click()
    await expect(page).toHaveURL(/\/open-source$/)

    await page.getByTestId('nav-link-contact').click()
    await expect(page).toHaveURL(/\/contact$/)
  })

  test('footer is visible on all pages', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path)
      const footer = page.getByTestId('footer')
      await footer.scrollIntoViewIfNeeded()
      await expect(footer).toBeVisible()
      await expect(footer).toContainText('Horus Yeung')
    }
  })

  test('/projects returns 404', async ({ request }) => {
    const response = await request.get('/projects')
    expect(response.status()).toBe(404)
  })
})
