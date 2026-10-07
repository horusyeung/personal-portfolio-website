import { expect, test, type Page } from '@playwright/test'

const POSTERS = {
  light:
    'radial-gradient(ellipse at 18% 35%, #e6efff, transparent 64%), ' +
    'radial-gradient(ellipse at 85% 18%, #f0e8ff, transparent 62%), ' +
    'radial-gradient(ellipse at 80% 90%, #fff0e6, transparent 62%), #ffffff',
  dark:
    'radial-gradient(ellipse at 18% 35%, #101a30, transparent 64%), ' +
    'radial-gradient(ellipse at 85% 18%, #1a102c, transparent 62%), ' +
    'radial-gradient(ellipse at 80% 90%, #241711, transparent 62%), #050609',
}

async function expectHeroCopy(page: Page) {
  const hero = page.getByTestId('hero-section')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Horus Yeung', exact: true }),
  ).toBeVisible()
  await expect(hero).toContainText('Senior Full Stack Developer & Team Lead')
  await expect(hero).toContainText(
    'Senior Full Stack Developer and Team Lead with 6+ years in software. Architect and build full-stack web and mobile products from system design to deployment.',
  )
  await expect(hero).toContainText('6+ Years')
  for (const [id, href] of [
    ['cta-experience', '/experience'],
    ['cta-contact', '/contact'],
  ]) {
    const link = page.getByTestId(id)
    await expect(link).toHaveAttribute('href', href)
    expect(await link.evaluate((element) => element.tagName)).toBe('A')
    await expect
      .poll(() =>
        link.evaluate((element) => {
          let opacity = 1
          for (let node: Element | null = element; node; node = node.parentElement) {
            opacity *= Number.parseFloat(getComputedStyle(node).opacity)
          }
          return opacity
        }),
      )
      .toBeGreaterThan(0.99)
  }
  await expect(page.getByTestId('hero-name')).toHaveCSS('opacity', '1')
}

async function expectPoster(page: Page, scheme: keyof typeof POSTERS) {
  const background = page.getByTestId('hero-background')
  await expect(background).toBeVisible()
  await expect(background).toHaveAttribute('aria-hidden', 'true')
  // Normalize the approved CSS in this browser, so serialization differences
  // between engines do not weaken the exact colour and gradient-stop contract.
  const expected = await page.evaluate((value) => {
    const probe = document.createElement('div')
    probe.style.cssText = 'position:fixed;width:0;height:0;visibility:hidden'
    probe.style.background = value
    document.body.append(probe)
    const computed = getComputedStyle(probe)
    const result = { image: computed.backgroundImage, colour: computed.backgroundColor }
    probe.remove()
    return result
  }, POSTERS[scheme])
  await expect(background).toHaveCSS('background-image', expected.image)
  await expect(background).toHaveCSS('background-color', expected.colour)
  await expect(background).toHaveCSS('animation-name', 'none')
  await expect(background).toHaveCSS('pointer-events', 'none')
  return background
}

async function expectPlainHeading(page: Page) {
  await expect(page.getByTestId('hero-section').locator('canvas')).toHaveCount(0)
  const generatedFrames = await page.getByTestId('hero-name').evaluate((heading) => {
    const hero = heading.closest('[data-testid="hero-section"]')
    const generated: string[] = []
    // Catch a pill on either the heading or a wrapper around it. The hero's
    // separate background remains free to use its own decoration.
    for (let node: Element | null = heading; node && node !== hero; node = node.parentElement) {
      for (const pseudo of ['::before', '::after']) {
        const content = getComputedStyle(node, pseudo).content
        if (content !== 'none' && content !== 'normal') generated.push(`${node.tagName}${pseudo}`)
      }
    }
    return generated
  })
  expect(generatedFrames).toEqual([])
}

test.describe('Home background', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`the approved ${scheme} poster remains permanent after the intro and deferred window`, async ({
      page,
    }) => {
      // Install before hydration so a reintroduced deferred renderer cannot hide
      // behind a real timer. Advancing virtual time replaces an arbitrary sleep.
      await page.clock.install()
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto('/')
      const background = await expectPoster(page, scheme)
      await page.evaluate(async () => {
        await document.fonts.ready
      })
      await expectHeroCopy(page)
      await expectPlainHeading(page)
      const initial = await background.evaluate((element) => ({
        image: getComputedStyle(element).backgroundImage,
        colour: getComputedStyle(element).backgroundColor,
      }))
      await page.clock.fastForward(10_000)
      await expectHeroCopy(page)
      await expectPlainHeading(page)
      await expect(background).toHaveCSS('background-image', initial.image)
      await expect(background).toHaveCSS('background-color', initial.colour)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      ).toBeLessThanOrEqual(1)
      const next = scheme === 'light' ? 'dark' : 'light'
      const inactiveInk = await page
        .getByTestId('nav-link-experience')
        .evaluate((element) => getComputedStyle(element).color)
      await expect(page.getByRole('button', { name: `Switch to ${next} theme` })).toHaveCSS(
        'color',
        inactiveInk,
      )
    })

    test(`server HTML preserves the ${scheme} poster, plain name and native CTA destinations`, async ({
      browser,
      baseURL,
      page,
    }) => {
      const context = await browser.newContext({
        baseURL,
        viewport: page.viewportSize(),
        javaScriptEnabled: false,
        colorScheme: scheme,
      })
      try {
        const staticPage = await context.newPage()
        await staticPage.goto('/')
        await expectPoster(staticPage, scheme)
        await expectHeroCopy(staticPage)
        await expectPlainHeading(staticPage)
        await staticPage.getByTestId('cta-experience').click()
        await expect(staticPage).toHaveURL(/\/experience$/)
        await staticPage.goto('/')
        await staticPage.getByTestId('cta-contact').click()
        await expect(staticPage).toHaveURL(/\/contact$/)
      } finally {
        await context.close()
      }
    })

    test(`reduced transparency gives the ${scheme} hero a solid fallback`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== 'chromium', 'Chromium CDP emulates reduced transparency')
      const session = await page.context().newCDPSession(page)
      try {
        await session.send('Emulation.setEmulatedMedia', {
          features: [
            { name: 'prefers-color-scheme', value: scheme },
            { name: 'prefers-reduced-transparency', value: 'reduce' },
            { name: 'prefers-reduced-motion', value: 'reduce' },
          ],
        })
        await page.goto('/')
        expect(
          await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches),
        ).toBe(true)
        const background = page.getByTestId('hero-background')
        await expect(background).toHaveCSS('background-image', 'none')
        await expect(background).toHaveCSS(
          'background-color',
          scheme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
        )
        await expectHeroCopy(page)
        await expectPlainHeading(page)
      } finally {
        await session.detach()
      }
    })
  }

  test('theme changes update the CSS poster without introducing a canvas or name frame', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
    await page.goto('/')
    await expectPoster(page, 'light')
    await page.getByRole('button', { name: 'Switch to dark theme' }).click()
    await expectPoster(page, 'dark')
    await expectHeroCopy(page)
    await expectPlainHeading(page)
    await page.getByRole('button', { name: 'Switch to light theme' }).click()
    await expectPoster(page, 'light')
  })

  test('forced colours use a solid system surface and retain readable hero links', async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
    await page.goto('/')
    test.skip(
      !(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)),
      'This browser runtime does not emulate forced colours',
    )
    const background = page.getByTestId('hero-background')
    await expect(background).toHaveCSS('background-image', 'none')
    const fill = await background.evaluate((element) => getComputedStyle(element).backgroundColor)
    expect(fill).toMatch(/^rgb\(/)
    await expectHeroCopy(page)
    await expectPlainHeading(page)
  })
})
