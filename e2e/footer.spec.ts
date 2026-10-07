import { expect, test } from '@playwright/test'
import { BIO, EMAIL, LOCATION, SOCIAL_LINKS } from '../src/content/site'

const destinations = [
  ['Email', `mailto:${EMAIL}`],
  ['LinkedIn', SOCIAL_LINKS.linkedin.url],
  ['GitHub', SOCIAL_LINKS.github.url],
  ['Medium', SOCIAL_LINKS.medium.url],
] as const

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
    await expect(connect.getByRole('link')).toHaveCount(4)
    for (const [name, href] of destinations) {
      const link = connect.getByRole('link', { name, exact: true })
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute('href', href)
      const box = (await link.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
      if (name !== 'Email') {
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      }
    }
  })

  test('preserves the full About copy and location', async ({ page }) => {
    await expect(page.getByTestId('footer-about')).toContainText(BIO.summary)
    await expect(page.getByTestId('footer-about')).toContainText(LOCATION)
  })

  test('Tab reaches every destination and exposes its keyboard caption', async ({ page }) => {
    await page.getByTestId('footer-explore').getByRole('link', { name: 'Contact' }).focus()
    const connect = page.getByTestId('footer-connect')
    const heading = (await connect.getByText('Connect', { exact: true }).boundingBox())!
    for (const [name] of destinations) {
      await page.keyboard.press('Tab')
      const link = connect.getByRole('link', { name, exact: true })
      await expect(link).toBeFocused()
      await expect(link.locator('span').last()).toHaveCSS('opacity', '1')
      await expect(link).toHaveCSS('outline-style', 'solid')
      const caption = (await link.locator('span').last().boundingBox())!
      expect(caption.y).toBeGreaterThanOrEqual(heading.y + heading.height)
      const box = (await link.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth))
    }
  })

  test('fine pointer magnifies nearby icons without moving links or the footer layout', async ({
    page,
  }) => {
    test.skip(
      !(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)),
      'magnification is only for a hovering fine pointer',
    )
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    const dock = page.getByRole('list', { name: 'Connect' })
    const links = dock.getByRole('link')
    const icons = dock.locator('[data-dock-icon]')
    const restingWidths = await icons.evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().width),
    )
    const before = await links.evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().toJSON()),
    )
    const footerHeight = await page
      .getByTestId('footer')
      .evaluate((node) => node.getBoundingClientRect().height)
    const first = before[0]
    await expect
      .poll(async () => {
        await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2)
        await page.mouse.move(first.x + first.width / 2 + 0.2, first.y + first.height / 2)
        return (
          (await icons.first().evaluate((node) => node.getBoundingClientRect().width)) /
          restingWidths[0]
        )
      })
      .toBeGreaterThan(1.25)
    expect(
      await icons.nth(1).evaluate((node) => node.getBoundingClientRect().width),
    ).toBeGreaterThan(restingWidths[1])
    expect(await icons.last().evaluate((node) => node.getBoundingClientRect().width)).toBeCloseTo(
      restingWidths.at(-1)!,
      1,
    )
    expect(
      await links.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect().toJSON()),
      ),
    ).toEqual(before)
    expect(
      await page.getByTestId('footer').evaluate((node) => node.getBoundingClientRect().height),
    ).toBe(footerHeight)
    await page.mouse.move(5, 5)
    await expect
      .poll(() => icons.first().evaluate((node) => node.getBoundingClientRect().width))
      .toBeCloseTo(restingWidths[0], 1)
  })

  test('touch captions remain visible and icons stay still', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.use.hasTouch, 'touch-specific presentation')
    const links = page.getByTestId('footer-connect').getByRole('link')
    for (const link of await links.all()) {
      await expect(link.locator('span').last()).toHaveCSS('opacity', '1')
      await expect(link.locator('span').last()).toBeVisible()
      await expect(link.locator('[data-dock-icon]')).toHaveCSS(
        'transform',
        'matrix(1, 0, 0, 1, 0, 0)',
      )
    }
  })

  test('hybrid touch presentation keeps captions below icons with a fine primary pointer', async ({
    page,
  }) => {
    test.skip(
      !(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)),
      'hybrid fallback is tested alongside a fine primary pointer',
    )
    // Playwright has no hybrid device profile. Activate the shipped coarse-capable override
    // while retaining the real fine-pointer rules, rather than injecting a replacement style.
    const activated = await page.evaluate(() => {
      let activated = 0
      const inspect = (rules: CSSRuleList) => {
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSMediaRule && rule.conditionText.includes('any-pointer: coarse')) {
            rule.media.mediaText = 'all'
            activated++
          } else if ('cssRules' in rule) inspect((rule as CSSGroupingRule).cssRules)
        }
      }
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          inspect(sheet.cssRules)
        } catch {
          // Third-party stylesheets are not relevant to this local surface.
        }
      }
      return activated
    })
    expect(activated).toBeGreaterThan(0)
    for (const link of await page.getByTestId('footer-connect').getByRole('link').all()) {
      const caption = link.locator('span').last()
      await expect(caption).toHaveCSS('opacity', '1')
      await expect(caption).toHaveCSS('position', 'static')
      const iconBox = (await link.locator('[data-dock-icon]').boundingBox())!
      const captionBox = (await caption.boundingBox())!
      expect(captionBox.y).toBeGreaterThanOrEqual(iconBox.y + iconBox.height)
    }
  })

  test('reduced motion restores an active Dock and keeps keyboard access', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    const email = page
      .getByTestId('footer-connect')
      .getByRole('link', { name: 'Email', exact: true })
    const restingWidth = await email
      .locator('[data-dock-icon]')
      .evaluate((node) => node.getBoundingClientRect().width)
    await email.hover()
    if (await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)) {
      await expect
        .poll(async () => {
          await email.hover()
          const box = (await email.boundingBox())!
          await page.mouse.move(box.x + box.width / 2 + 0.2, box.y + box.height / 2)
          return (
            (await email
              .locator('[data-dock-icon]')
              .evaluate((node) => node.getBoundingClientRect().width)) / restingWidth
          )
        })
        .toBeGreaterThan(1.25)
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const icon of await page.getByTestId('footer-connect').locator('[data-dock-icon]').all()) {
      await expect(icon).toHaveCSS('transform', 'none')
      await expect(icon).toHaveCSS('transition-duration', '0s')
    }
    await page.getByTestId('footer-explore').getByRole('link', { name: 'Contact' }).focus()
    await page.keyboard.press('Tab')
    await expect(email).toBeFocused()
    await expect(email.locator('span').last()).toHaveCSS('opacity', '1')
  })

  for (const width of [320, 390, 768]) {
    test(`Dock fits ${width}px and keeps its hit areas`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.getByTestId('footer').scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      )
      for (const link of await page.getByTestId('footer-connect').getByRole('link').all()) {
        const box = (await link.boundingBox())!
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(width)
      }
    })
  }

  test('Dock links and existing footer copy work without JavaScript', async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 800 },
    })
    const page = await context.newPage()
    try {
      await page.goto(baseURL!)
      await page.getByTestId('footer').scrollIntoViewIfNeeded()
      for (const [name, href] of destinations) {
        const link = page.getByTestId('footer-connect').getByRole('link', { name, exact: true })
        await expect(link).toBeVisible()
        await expect(link).toHaveAttribute('href', href)
      }
      await expect(page.getByTestId('footer-about')).toContainText(BIO.summary)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        320,
      )
    } finally {
      await context.close()
    }
  })

  test('reduced transparency uses the shared solid Dock surface', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'preference emulated through Chromium CDP')
    const session = await page.context().newCDPSession(page)
    try {
      await session.send('Emulation.setEmulatedMedia', {
        features: [
          { name: 'prefers-color-scheme', value: 'light' },
          { name: 'prefers-reduced-transparency', value: 'reduce' },
        ],
      })
      const dock = page.getByRole('list', { name: 'Connect' })
      await expect(dock).toHaveCSS('background-color', 'rgb(255, 255, 255)')
      await expect(dock).toHaveCSS('backdrop-filter', 'none')
    } finally {
      await session.detach()
    }
  })

  test('forced colors preserves the Dock and visible keyboard focus', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' })
    test.skip(
      !(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)),
      'browser does not expose forced colors',
    )
    await expect(page.getByRole('list', { name: 'Connect' })).toHaveCSS('backdrop-filter', 'none')
    await page.getByTestId('footer-explore').getByRole('link', { name: 'Contact' }).focus()
    await page.keyboard.press('Tab')
    const email = page
      .getByTestId('footer-connect')
      .getByRole('link', { name: 'Email', exact: true })
    await expect(email).toBeFocused()
    await expect(email).toHaveCSS('outline-style', 'solid')
    await expect(email.locator('span').last()).toHaveCSS('opacity', '1')
  })

  test('displays copyright', async ({ page }) => {
    await expect(page.getByTestId('footer')).toContainText(/© \d{4} Horus Yeung/)
  })

  test('footer links navigate correctly', async ({ page }) => {
    await page.getByTestId('footer-explore').getByRole('link', { name: 'Experience' }).click()
    await expect(page).toHaveURL(/\/experience$/)
  })
})
