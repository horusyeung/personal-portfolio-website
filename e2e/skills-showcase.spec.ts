import { expect, test, type Locator, type Page } from '@playwright/test'
import { skillCategories } from '../src/content/skills'

const skillNames = skillCategories.flatMap(({ skills }) => skills.map(({ name }) => name))
const cards = (showcase: Locator) => showcase.locator('[data-skill-category]')

async function expectInventory(showcase: Locator) {
  await expect(showcase).toHaveCount(1)
  await expect(cards(showcase)).toHaveCount(9)
  await expect(showcase.locator('li[data-skill-name]')).toHaveCount(47)
  expect(
    await showcase
      .locator('li[data-skill-name]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-skill-name'))),
  ).toEqual(skillNames)
  for (const category of skillCategories) {
    const card = showcase.locator(`[data-skill-category="${category.title}"]`)
    await expect(card).toHaveAccessibleName(category.title)
    await expect(
      card.getByRole('heading', { level: 3, name: category.title, exact: true }),
    ).toBeVisible()
    await expect(card.getByRole('list')).toHaveCount(1)
    await expect(card.locator('svg')).toHaveCount(category.skills.length)
    for (const skill of category.skills) {
      const name = card.getByText(skill.name, { exact: true })
      await expect(name).toHaveCount(1)
      await expect(name).toBeVisible()
    }
  }
  await expect(
    showcase.locator('button, a, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'),
  ).toHaveCount(0)
}

async function afterPaint(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      }),
  )
}

async function spotlight(card: Locator) {
  return card.evaluate((node) => {
    const style = (node as HTMLElement).style
    return { x: style.getPropertyValue('--spot-x'), y: style.getPropertyValue('--spot-y') }
  })
}

async function spotlightOpacity(card: Locator) {
  return card.evaluate((node) => {
    const style = getComputedStyle(node, '::before')
    // Mobile shelves do not generate the decorative pseudo-element at all.
    if (style.content === 'none' || style.content === 'normal' || style.display === 'none') return 0
    return Number(style.opacity)
  })
}

test.describe('Skills showcase', () => {
  test('category cards fade in on their own scroll entry and stay revealed after leaving', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    const showcase = page.getByTestId('skills-showcase')
    const first = cards(showcase).first()
    const last = cards(showcase).last()
    await expect(first).not.toBeInViewport()
    await expect(first).toHaveCSS('opacity', '0')
    await expect(last).toHaveCSS('opacity', '0')

    // Sample rendered frames rather than sleeping through the fade: an instant
    // appearance or one animation on the entire grid must fail this regression.
    const fade = await first.evaluate(
      (node) =>
        new Promise<{ finished: boolean; intermediate: boolean }>((resolve) => {
          let intermediate = false
          let frame = 0
          const timeout = window.setTimeout(() => {
            cancelAnimationFrame(frame)
            resolve({ finished: false, intermediate })
          }, 3_000)
          const sample = () => {
            const opacity = Number(getComputedStyle(node).opacity)
            if (opacity > 0 && opacity < 0.99) intermediate = true
            if (opacity >= 0.99) {
              window.clearTimeout(timeout)
              resolve({ finished: true, intermediate })
            } else frame = requestAnimationFrame(sample)
          }
          window.scrollTo({
            top: node.getBoundingClientRect().top + scrollY - innerHeight * 0.65,
            behavior: 'instant',
          })
          frame = requestAnimationFrame(sample)
        }),
    )
    expect(fade).toEqual({ finished: true, intermediate: true })
    await expect(first).toHaveCSS('opacity', '1')
    await expect(last).not.toBeInViewport()
    await expect(last).toHaveCSS('opacity', '0')

    await last.scrollIntoViewIfNeeded()
    await expect(last).toHaveCSS('opacity', '1')
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await afterPaint(page)
    await expect(first).toHaveCSS('opacity', '1')
    await expect(last).toHaveCSS('opacity', '1')
    await first.scrollIntoViewIfNeeded()
    await afterPaint(page)
    await expect(first).toHaveCSS('opacity', '1')
  })

  test('requesting reduced motion during a card fade makes the full toolkit readable', async ({
    page,
  }) => {
    await page.clock.install({ time: new Date('2026-10-07T12:00:00Z') })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    const showcase = page.getByTestId('skills-showcase')
    const first = cards(showcase).first()
    // CSS also hides the card before hydration. Wait for animation ownership
    // before controlling time so the intro fallback cannot win this fixture.
    await expect.poll(() => first.evaluate((node) => (node as HTMLElement).style.opacity)).toBe('0')
    await page.clock.pauseAt(new Date('2026-10-07T12:01:00Z'))
    await expect(first).toHaveCSS('opacity', '0')
    await first.evaluate((node) => {
      window.scrollTo({
        top: node.getBoundingClientRect().top + scrollY - innerHeight * 0.65,
        behavior: 'instant',
      })
    })
    let intermediate = 0
    // Native scroll events can reach ScrollTrigger after the first virtual
    // frame. Advance one frame at a time until the fade actually starts.
    await expect
      .poll(async () => {
        await page.clock.runFor(16)
        intermediate = await first.evaluate((node) => Number(getComputedStyle(node).opacity))
        return intermediate
      })
      .toBeGreaterThan(0)
    expect(intermediate).toBeLessThan(0.99)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const card of await cards(showcase).all()) {
      await expect(card).toHaveCSS('opacity', '1')
    }
    await expectInventory(showcase)
  })

  test('renders one complete, labeled toolkit without fake controls', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expectInventory(page.getByTestId('skills-showcase'))
  })

  test('changes from category shelves to Bento without clipping any names at the responsive boundaries', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'fixed viewport boundaries run on desktop engines; device rendering has separate coverage',
    )
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const showcase = page.getByTestId('skills-showcase')
    for (const width of [320, 390, 899, 900, 1199, 1200]) {
      await page.setViewportSize({ width, height: 900 })
      // Engines differ in whether a native scrollbar contributes to media
      // query width. Calibrate the browser viewport to the exact CSS boundary.
      const viewport = await page.evaluate(() => ({
        exact: matchMedia(`(width: ${innerWidth}px)`).matches,
        gutter: innerWidth - document.documentElement.clientWidth,
      }))
      if (!viewport.exact) {
        expect(viewport.gutter).toBeGreaterThan(0)
        await page.setViewportSize({ width: width + viewport.gutter, height: 900 })
      }
      await expect
        .poll(() =>
          page.evaluate((targetWidth) => matchMedia(`(width: ${targetWidth}px)`).matches, width),
        )
        .toBe(true)
      await expect(showcase).toHaveCSS('display', 'grid')
      const columns = width < 900 ? 1 : width < 1200 ? 2 : 3
      await expect
        .poll(() =>
          showcase.evaluate((node) => {
            const bounds = [...node.querySelectorAll('[data-skill-category]')].map((card) =>
              card.getBoundingClientRect(),
            )
            return bounds.filter((card) => Math.abs(card.top - bounds[0].top) <= 1).length
          }),
        )
        .toBe(columns)
      const geometry = await showcase.evaluate((node) => {
        const categories = [...node.querySelectorAll<HTMLElement>('[data-skill-category]')]
        return {
          pageOverflow: document.documentElement.scrollWidth - innerWidth,
          cards: categories.map((category) => {
            const bounds = category.getBoundingClientRect()
            return {
              left: bounds.left,
              right: bounds.right,
              top: bounds.top,
              bottom: bounds.bottom,
            }
          }),
          clipped: categories.flatMap((category) => {
            const bounds = category.getBoundingClientRect()
            return [...category.querySelectorAll<HTMLElement>('li[data-skill-name]')]
              .filter((skill) => {
                const cell = skill.getBoundingClientRect()
                const range = document.createRange()
                range.selectNodeContents(skill)
                const content = range.getBoundingClientRect()
                return (
                  cell.left < bounds.left - 1 ||
                  cell.right > bounds.right + 1 ||
                  content.left < bounds.left - 1 ||
                  content.right > bounds.right + 1 ||
                  skill.scrollWidth > skill.clientWidth + 1
                )
              })
              .map((skill) => skill.dataset.skillName)
          }),
          viewportWidth: innerWidth,
        }
      })
      expect(geometry.pageOverflow, `page overflow at ${width}px`).toBeLessThanOrEqual(1)
      expect(geometry.clipped, `clipped skill content at ${width}px`).toEqual([])
      for (const card of geometry.cards) {
        expect(card.left).toBeGreaterThanOrEqual(-1)
        expect(card.right).toBeLessThanOrEqual(geometry.viewportWidth + 1)
      }
      if (columns === 1) {
        for (let index = 1; index < geometry.cards.length; index++) {
          expect(geometry.cards[index].top).toBeGreaterThanOrEqual(
            geometry.cards[index - 1].bottom - 1,
          )
          expect(geometry.cards[index].left).toBeCloseTo(geometry.cards[0].left, 0)
        }
      } else {
        expect(geometry.cards[1].top).toBeCloseTo(geometry.cards[0].top, 0)
        expect(geometry.cards[1].left).toBeGreaterThan(geometry.cards[0].right)
      }
    }
    await expectInventory(showcase)
  })

  test('fine-pointer spotlight follows the card and stops when reduced motion is requested', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'spotlight is reserved for fine-hover desktop pointers')
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    const card = cards(page.getByTestId('skills-showcase')).first()
    // A hover can otherwise land on server HTML before React handles pointers.
    await card.scrollIntoViewIfNeeded()
    await expect(card).toHaveCSS('opacity', '1')
    const bounds = (await card.boundingBox())!
    await card.hover({ position: { x: bounds.width * 0.25, y: bounds.height * 0.3 } })
    await expect.poll(() => spotlight(card)).not.toEqual({ x: '', y: '' })
    const first = await spotlight(card)
    await card.hover({ position: { x: bounds.width * 0.7, y: bounds.height * 0.6 } })
    await expect.poll(() => spotlight(card)).not.toEqual(first)
    await expect.poll(() => spotlightOpacity(card)).toBeGreaterThan(0)
    await expect(card).not.toHaveCSS('transform', 'none')
    await page.mouse.move(0, 0)
    await expect.poll(() => spotlightOpacity(card)).toBe(0)
    await expect(card).toHaveCSS('transform', 'none')

    await card.hover({ position: { x: 30, y: 30 } })
    await expect.poll(() => spotlight(card)).not.toEqual({ x: '', y: '' })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect.poll(() => spotlight(card)).toEqual({ x: '', y: '' })
    await expect(card).toHaveCSS('transform', 'none')
    await expect.poll(() => spotlightOpacity(card)).toBe(0)
    await card.hover({ position: { x: bounds.width * 0.65, y: bounds.height * 0.5 } })
    await afterPaint(page)
    expect(await spotlight(card)).toEqual({ x: '', y: '' })
    await expect(card).toHaveCSS('transform', 'none')
  })

  test('coarse pointers stay static and preserve native touch gestures', async ({
    page,
    isMobile,
    browserName,
  }) => {
    test.skip(!isMobile, 'coarse pointer device emulation')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    const showcase = page.getByTestId('skills-showcase')
    const card = cards(showcase).first()
    await card.evaluate((node) => node.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await expect(card).toBeInViewport({ ratio: 1 })
    expect(
      await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches),
    ).toBe(false)
    const bounds = (await card.boundingBox())!
    await page.mouse.move(bounds.x + 30, bounds.y + 30)
    await page.mouse.move(bounds.x + bounds.width - 30, bounds.y + bounds.height - 30)
    await afterPaint(page)
    expect(await spotlight(card)).toEqual({ x: '', y: '' })
    await expect.poll(() => spotlightOpacity(card)).toBe(0)
    await expect(card).toHaveCSS('transform', 'none')
    const actions = await card.evaluate((node) => {
      const values: string[] = []
      for (let ancestor: Element | null = node; ancestor; ancestor = ancestor.parentElement) {
        values.push(getComputedStyle(ancestor).touchAction)
      }
      return values
    })
    expect(actions.every((action) => action === 'auto' || action === 'manipulation')).toBe(true)
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
    expect(viewport).not.toMatch(/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:[,\s]|$)/)

    // Chromium CDP supplies real touch input. WebKit still verifies the coarse
    // fallback and CSS permissions above; it has no equivalent CDP gesture API.
    if (browserName !== 'chromium') return
    const session = await page.context().newCDPSession(page)
    try {
      const x = bounds.x + bounds.width / 2
      const y = bounds.y + bounds.height / 2
      const startScroll = await page.evaluate(() => scrollY)
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x, y }],
      })
      for (const distance of [15, 35, 60, 90]) {
        await session.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x, y: y - distance }],
        })
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(startScroll + 30)

      await card.evaluate((node) => node.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await expect(card).toBeInViewport({ ratio: 1 })
      const fresh = (await card.boundingBox())!
      const cx = fresh.x + fresh.width / 2
      const cy = fresh.y + fresh.height / 2
      const scale = await page.evaluate(() => visualViewport!.scale)
      const points = (distance: number) => [
        { x: cx - distance, y: cy, id: 1, radiusX: 8, radiusY: 8, force: 1 },
        { x: cx + distance, y: cy, id: 2, radiusX: 8, radiusY: 8, force: 1 },
      ]
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: points(35),
      })
      for (const distance of [45, 55, 65, 75, 85, 95, 105, 115]) {
        await session.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: points(distance),
        })
        await afterPaint(page)
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await expect
        .poll(() => page.evaluate(() => visualViewport!.scale))
        .toBeGreaterThan(scale + 0.1)
    } finally {
      await session.detach()
    }
  })

  test('server HTML keeps all skill names readable without JavaScript', async ({
    browser,
    baseURL,
    page,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      reducedMotion: 'no-preference',
      viewport: page.viewportSize(),
    })
    try {
      const plainPage = await context.newPage()
      await plainPage.goto('/')
      const showcase = plainPage.getByTestId('skills-showcase')
      await expectInventory(showcase)
      for (const card of await cards(showcase).all()) {
        await expect(card).toHaveCSS('opacity', '1')
      }
      expect(
        await showcase.evaluate((node) => {
          for (let ancestor: Element | null = node; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor)
            if (
              Number(style.opacity) === 0 ||
              style.visibility !== 'visible' ||
              style.display === 'none'
            )
              return false
          }
          return true
        }),
      ).toBe(true)
    } finally {
      await context.close()
    }
  })

  test('captures desktop Bento and phone shelves in both color schemes for review', async ({
    page,
  }, testInfo) => {
    test.skip(
      !['Desktop Chrome', 'Mobile Safari'].includes(testInfo.project.name),
      'four review attachments across one desktop and one phone',
    )
    const width = testInfo.project.name === 'Desktop Chrome' ? 1280 : 390
    await page.setViewportSize({ width, height: width === 1280 ? 900 : 844 })
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
      await page.goto('/')
      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${colorScheme}\\b`))
      await page.evaluate(() => document.fonts.ready)
      await expect(page.getByTestId('skills-showcase').locator('li[data-skill-name]')).toHaveCount(
        47,
      )
      const name = `skills-${width}-${colorScheme}.png`
      const path = testInfo.outputPath(name)
      const heading = page.getByTestId('skills-section').getByRole('heading', { level: 2 })
      await heading.click()
      await page.mouse.move(0, 0)
      await heading.evaluate((node) => {
        const top = node.getBoundingClientRect().top + scrollY - 80
        window.scrollTo({ top, behavior: 'instant' })
      })
      await expect(heading).toBeInViewport({ ratio: 1 })
      await afterPaint(page)
      // A real viewport preserves fixed navigation in its actual position;
      // tall element stitching can repeat it over the middle of the shelves.
      await page.screenshot({ path, animations: 'disabled' })
      await testInfo.attach(name, { path, contentType: 'image/png' })
    }
  })
})
