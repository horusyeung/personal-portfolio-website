import { expect, test } from '@playwright/test'

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('footer').scrollIntoViewIfNeeded()
  })

  test('displays explore links', async ({ page }) => {
    const explore = page.getByTestId('footer-explore')
    for (const name of ['Experience', 'Open Source', 'Contact']) {
      await expect(explore.getByRole('link', { name })).toBeVisible()
    }
  })

  test('displays connect links', async ({ page }) => {
    const connect = page.getByTestId('footer-connect')
    for (const name of ['Email', 'LinkedIn', 'GitHub', 'Medium']) {
      await expect(connect.getByRole('link', { name })).toBeVisible()
    }
  })

  test('displays copyright', async ({ page }) => {
    await expect(page.getByTestId('footer')).toContainText(/© \d{4} Horus Yeung/)
  })

  test('footer links navigate correctly', async ({ page }) => {
    await page.getByTestId('footer-explore').getByRole('link', { name: 'Experience' }).click()
    await expect(page).toHaveURL(/\/experience$/)
  })
})
