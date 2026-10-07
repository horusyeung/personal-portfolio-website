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

  test('the button names the next theme and works with the keyboard', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Switch to dark theme' })
    await expect(toggle).toBeEnabled()
    await expect(toggle).toHaveText('Dark')
    await expect(toggle).toHaveAttribute('title', 'Switch to dark theme')
    await toggle.press('Space')
    const lightAction = page.getByRole('button', { name: 'Switch to light theme' })
    await expect(lightAction).toHaveText('Light')
    await expect(lightAction).toHaveAttribute('title', 'Switch to light theme')
    await expect(lightAction).toBeFocused()
    await expect(page.locator('body')).toHaveCSS('background-color', BLACK)
    await lightAction.press('Enter')
    await expect(toggle).toHaveText('Dark')
    await expect(toggle).toBeFocused()
    await expect(page.locator('body')).toHaveCSS('background-color', WHITE)
  })

  test('the toggle switches, persists, and goes back to following the system', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Switch to dark theme' })

    await toggle.click()
    await expect(page.locator('body')).toHaveCSS('background-color', BLACK)

    await page.reload()
    await expect(page.locator('body')).toHaveCSS('background-color', BLACK)

    // Switching back to the system's own scheme means "follow the system" again
    await page.getByRole('button', { name: 'Switch to light theme' }).click()
    await expect(page.locator('body')).toHaveCSS('background-color', WHITE)
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page.locator('body')).toHaveCSS('background-color', BLACK)
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toHaveText('Light')
  })

  for (const scheme of ['light', 'dark'] as const) {
    test(`the ${scheme} theme action matches the menu typography`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto('/')
      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${scheme}\\b`))
      const next = scheme === 'dark' ? 'light' : 'dark'
      const toggle = page.getByRole('button', { name: `Switch to ${next} theme` })
      const menu = page.getByTestId('nav-link-experience')
      const typography = await menu.evaluate((element) => {
        const style = getComputedStyle(element)
        return { color: style.color, weight: style.fontWeight, family: style.fontFamily }
      })
      await expect(toggle).toHaveCSS('color', typography.color)
      await expect(toggle).toHaveCSS('font-weight', typography.weight)
      await expect(toggle).toHaveCSS('font-family', typography.family)
    })

    test(`without JavaScript the button is inert and follows the ${scheme} system scheme`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({
        baseURL,
        javaScriptEnabled: false,
        colorScheme: scheme,
      })
      try {
        const page = await context.newPage()
        await page.goto('/')
        const next = scheme === 'dark' ? 'light' : 'dark'
        const toggle = page.getByRole('button', { name: `Switch to ${next} theme` })
        await expect(toggle).toHaveCount(1)
        await expect(toggle).toBeDisabled()
        await expect(toggle).toHaveAttribute('aria-disabled', 'true')
        await expect(toggle).toHaveText(next === 'dark' ? 'Dark' : 'Light')
        await expect(page.locator('body')).toHaveCSS(
          'background-color',
          scheme === 'dark' ? BLACK : WHITE,
        )
        await expect(page.getByRole('heading', { name: 'Horus Yeung', level: 1 })).toBeVisible()
      } finally {
        await context.close()
      }
    })
  }
})
