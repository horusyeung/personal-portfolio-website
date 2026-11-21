import { expect, test } from '@playwright/test'

test.describe('Mobile navigation', () => {
  test.use({ reducedMotion: 'reduce' })

  for (const width of [320, 375, 430, 599]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`${width}px ${colorScheme}: the compact bar and expanded links fit without collisions`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 740 })
        await page.emulateMedia({ colorScheme })
        await page.goto('/experience')
        const menu = page.getByRole('button', { name: 'Main menu' })
        const navigation = page.getByRole('navigation', { name: 'Main', includeHidden: true })
        await expect(menu).toBeVisible()
        await expect(navigation).toBeHidden()
        const bar = await page.getByTestId('navbar').boundingBox()
        expect(bar!.height).toBeLessThanOrEqual(50)
        const controls = [
          page.getByTestId('navbar-logo'),
          page.getByRole('button', { name: /Switch to .* theme/ }),
          menu,
        ]
        let previousRight = 0
        for (const control of controls) {
          const box = await control.boundingBox()
          expect(box!.x).toBeGreaterThanOrEqual(previousRight)
          expect(box!.x + box!.width).toBeLessThanOrEqual(width)
          expect(box!.height).toBeGreaterThanOrEqual(44)
          previousRight = box!.x + box!.width
        }
        await menu.click()
        await expect(navigation).toBeVisible()
        await expect(menu).toHaveAttribute('aria-expanded', 'true')
        await expect(navigation.getByRole('link')).toHaveCount(4)
        await expect(navigation.getByRole('link', { name: 'Experience' })).toHaveAttribute(
          'aria-current',
          'page',
        )
        let previousBottom = bar!.height
        for (const link of await navigation.getByRole('link').all()) {
          const box = await link.boundingBox()
          expect(box!.height).toBeGreaterThanOrEqual(44)
          expect(box!.y).toBeGreaterThanOrEqual(previousBottom)
          expect(box!.x).toBeGreaterThanOrEqual(0)
          expect(box!.x + box!.width).toBeLessThanOrEqual(width)
          previousBottom = box!.y + box!.height
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          ),
        ).toBeLessThanOrEqual(1)
        await navigation.getByRole('link', { name: 'Contact', exact: true }).click()
        await expect(page).toHaveURL(/\/contact$/)
        await expect(navigation).toBeHidden()
        await expect(menu).toHaveAttribute('aria-expanded', 'false')
      })
    }
  }

  test('keyboard, Escape and outside clicks operate the menu without trapping focus', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'consistent link Tab behavior in Chromium')
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/experience')
    const menu = page.getByRole('button', { name: 'Main menu' })
    const navigation = page.getByRole('navigation', { name: 'Main', includeHidden: true })
    await menu.focus()
    await menu.press('Enter')
    await expect(navigation).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(navigation.getByRole('link', { name: 'Home', exact: true })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(navigation).toBeHidden()
    await expect(menu).toBeFocused()
    await menu.click()
    await page.locator('main').click({ position: { x: 8, y: 350 } })
    await expect(navigation).toBeHidden()
  })

  test('desktop resizing closes the popover and preserves the inline menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/experience')
    const menu = page.getByRole('button', { name: 'Main menu' })
    const navigation = page.getByRole('navigation', { name: 'Main', includeHidden: true })
    await menu.click()
    await page.setViewportSize({ width: 768, height: 812 })
    await expect(menu).toBeHidden()
    await expect(navigation).toBeVisible()
    await expect(navigation).not.toHaveCSS('position', 'fixed')
    await expect(page.locator(':popover-open')).toHaveCount(0)
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(navigation).toBeHidden()
  })

  test('browser Forward closes the menu before restoring a project sheet on the same page', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/open-source')
    await page
      .getByRole('button', { name: /^Details for / })
      .first()
      .click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.goBack()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.getByRole('button', { name: 'Main menu' }).click()
    const navigation = page.getByRole('navigation', { name: 'Main', includeHidden: true })
    await expect(navigation).toBeVisible()
    await page.goForward()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(navigation).toBeHidden()
  })

  test('200% text and a short landscape viewport keep every link reachable', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 280 })
    await page.goto('/experience')
    await page.addStyleTag({
      content:
        '[data-testid="navbar"] a { font-size: 34px !important; } [data-testid="navbar"] button { font-size: 24px !important; }',
    })
    await page.getByRole('button', { name: 'Main menu' }).click()
    const navigation = page.getByRole('navigation', { name: 'Main' })
    const contact = navigation.getByRole('link', { name: 'Contact', exact: true })
    await contact.scrollIntoViewIfNeeded()
    await expect(contact).toBeInViewport()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1)
    await contact.click()
    await expect(page).toHaveURL(/\/contact$/)
  })

  test('the native menu also navigates without JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      baseURL,
      viewport: { width: 320, height: 740 },
      javaScriptEnabled: false,
    })
    try {
      const page = await context.newPage()
      await page.goto('/experience')
      await page.getByRole('button', { name: 'Main menu' }).click()
      const navigation = page.getByRole('navigation', { name: 'Main' })
      await expect(navigation.getByRole('link')).toHaveCount(4)
      await navigation.getByRole('link', { name: 'Contact', exact: true }).click()
      await expect(page).toHaveURL(/\/contact$/)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Get in Touch')
    } finally {
      await context.close()
    }
  })
})
