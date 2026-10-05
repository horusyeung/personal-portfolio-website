import { expect, test } from '@playwright/test'

test.describe('Theme', () => {
  test('uses light theme', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  })
})
