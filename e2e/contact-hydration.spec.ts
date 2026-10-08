import { expect, test } from '@playwright/test'

test('Contact hydrates safely with its server-rendered footer already in view', async ({
  page,
  baseURL,
}) => {
  // A compact viewport puts all six rows above the footer in both column layouts.
  await page.setViewportSize({ width: page.viewportSize()!.width, height: 320 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.stack ?? error.message))
  const origin = new URL(baseURL!).origin
  let heldScripts = 0
  let release!: () => void
  const scripts = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/*', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    if (
      url.origin !== origin ||
      !['GET', 'HEAD'].includes(request.method()) ||
      url.pathname.startsWith('/api/')
    ) {
      return route.abort()
    }
    if (request.resourceType() === 'script') {
      heldScripts += 1
      await scripts
    }
    return route.continue()
  })
  // Keep the queued timeline initialization pending through the restored-position mount.
  const epoch = new Date('2026-10-08T12:00:00Z')
  await page.clock.install({ time: epoch })
  await page.clock.pauseAt(epoch.getTime() + 60_000)
  const observations: unknown[] = []
  try {
    await page.goto('/contact', { waitUntil: 'commit' })
    await expect.poll(() => heldScripts).toBeGreaterThan(0)
    const footer = page.getByTestId('footer')
    await expect(footer).toBeAttached()
    await expect
      .poll(() =>
        page.evaluate(() => {
          const styles = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')]
          return styles.length > 0 && styles.every((link) => link.sheet !== null)
        }),
      )
      .toBe(true)
    // Enter before hydration; waiting for app readiness would erase the regression.
    await footer.evaluate((element) =>
      element.scrollIntoView({ block: 'end', behavior: 'instant' }),
    )
    const rows = page.locator('[data-testid="contact-info"] > *')
    await expect(rows).toHaveCount(6)
    const before = await rows.evaluateAll((elements) => ({
      bottoms: elements.map((element) => element.getBoundingClientRect().bottom),
      introSkipped: document.documentElement.classList.contains('intro-skip'),
      scrollY,
    }))
    observations.push(before)
    expect(before.introSkipped).toBe(false)
    expect(before.bottoms.every((bottom) => bottom < 0)).toBe(true)
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('Horus Yeung')

    release()
    await expect(page.getByRole('button', { name: /Switch to (light|dark) theme/ })).toBeEnabled()
    expect(errors).toEqual([])
    await expect(page.getByRole('heading', { name: 'Get in Touch', exact: true })).toBeAttached()
    await expect(page.getByTestId('contact-form')).toBeAttached()

    // Finish the existing entrances only after initialization; the 3s fallback cannot mask it.
    await page.clock.runFor(2000)
    expect(errors).toEqual([])
    await expect(page.getByRole('heading', { name: 'Get in Touch', exact: true })).toHaveCSS(
      'opacity',
      '1',
    )
    for (const row of await rows.all()) await expect(row).toHaveCSS('opacity', '1')
    await expect(page.getByRole('textbox', { name: /^Name/ })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /^Email/ })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /^Message/ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send Message', exact: true })).toBeEnabled()
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('Horus Yeung')
    expect(
      await page.evaluate(() => document.documentElement.classList.contains('intro-skip')),
    ).toBe(false)
  } finally {
    release()
    await test.info().attach('contact-footer-hydration', {
      body: JSON.stringify({ heldScripts, observations, errors }, null, 2),
      contentType: 'application/json',
    })
  }
})
