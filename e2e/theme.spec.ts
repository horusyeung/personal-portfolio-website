import { expect, test } from '@playwright/test'

const WHITE = 'rgb(255, 255, 255)'
const BLACK = 'rgb(0, 0, 0)'

test.describe('Theme', () => {
  test('follows a light system setting', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await expect(page.locator('body')).toHaveCSS('background-color', WHITE)
  })

  test('follows a dark system setting from the first paint', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect(page.locator('body')).toHaveCSS('background-color', BLACK)
  })

  test('the toggle switches, persists, and goes back to following the system', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Toggle dark mode' })

    await toggle.click()
    await expect(page.locator('body')).toHaveCSS('background-color', BLACK)

    await page.reload()
    await expect(page.locator('body')).toHaveCSS('background-color', BLACK)

    // Switching back to the system's own scheme means "follow the system" again
    await page.getByRole('button', { name: 'Toggle dark mode' }).click()
    await expect(page.locator('body')).toHaveCSS('background-color', WHITE)
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page.locator('body')).toHaveCSS('background-color', BLACK)
  })
})
