import { expect, test, type Locator, type Page } from '@playwright/test'

const affectedContent = {
  '/experience': [
    '[data-testid=education-section] h2',
    '[data-testid=education-section] h3',
    '[data-testid=certifications-section] h2',
    '[data-testid=certifications-section] p',
  ],
  '/contact': [
    '[data-testid=contact-info] > div',
    'h2',
    '[data-testid=contact-form] input[name=name]',
    '[data-testid=contact-form] input[name=email]',
    '[data-testid=contact-form] textarea[name=message]',
    '[data-testid=submit-button]',
  ],
  '/open-source': ['[data-project-card]'],
} as const

function effectiveOpacity(locator: Locator) {
  return locator.evaluate((node) => {
    let opacity = 1
    for (let element: Element | null = node; element; element = element.parentElement) {
      opacity *= Number(getComputedStyle(element).opacity)
    }
    return opacity
  })
}

async function afterPaint(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}

async function hydrated(page: Page, path: string) {
  await page.goto(path)
  await expect(page.getByRole('button', { name: /^Switch to (light|dark) theme$/ })).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
}

async function revealReady(page: Page, path: string, pendingContent: Locator) {
  // Keep cold browser startup from choosing the separately tested readable fallback.
  // Network and React hydration stay real; time resumes before any fade is sampled.
  await page.clock.install({ time: new Date('2026-10-07T12:00:00Z') })
  await page.clock.pauseAt(new Date('2026-10-07T12:01:00Z'))
  await hydrated(page, path)
  await expect(page.locator('html')).not.toHaveClass(/intro-skip/)
  await expect
    .poll(() =>
      pendingContent.evaluate((node) => {
        for (
          let element: HTMLElement | null = node as HTMLElement;
          element;
          element = element.parentElement
        ) {
          if (element.style.opacity === '0') return true
        }
        return false
      }),
    )
    .toBe(true)
  await page.clock.resume()
}

async function pendingBelowTrigger(locator: Locator) {
  await expect.poll(() => effectiveOpacity(locator)).toBeLessThan(0.01)
  await locator.evaluate((node) => {
    window.scrollTo({
      top: node.getBoundingClientRect().top + scrollY - innerHeight * 0.93,
      behavior: 'instant',
    })
  })
  await afterPaint(locator.page())
  expect(
    await locator.evaluate((node) => node.getBoundingClientRect().top / innerHeight),
  ).toBeGreaterThan(0.85)
  expect(await effectiveOpacity(locator)).toBeLessThan(0.01)
}

async function scrollFade(locator: Locator, viewportFraction = 0.65) {
  const frames = await locator.evaluate(
    (node, fraction) =>
      new Promise<{
        finished: boolean
        intermediate: boolean
        samples: number
      }>((resolve) => {
        let intermediate = false
        let samples = 0
        let frame = 0
        const deadline = window.setTimeout(() => {
          cancelAnimationFrame(frame)
          resolve({ finished: false, intermediate, samples })
        }, 3_000)
        const sample = () => {
          samples += 1
          let opacity = 1
          for (let element: Element | null = node; element; element = element.parentElement) {
            opacity *= Number(getComputedStyle(element).opacity)
          }
          if (opacity > 0 && opacity < 0.99) intermediate = true
          if (opacity >= 0.99) {
            window.clearTimeout(deadline)
            resolve({ finished: true, intermediate, samples })
          } else frame = requestAnimationFrame(sample)
        }
        window.scrollTo({
          top: node.getBoundingClientRect().top + scrollY - innerHeight * fraction,
          behavior: 'instant',
        })
        frame = requestAnimationFrame(sample)
      }),
    viewportFraction,
  )
  expect(frames.finished, 'the scrolled content completes its reveal').toBe(true)
  expect(
    frames.intermediate,
    'rendered frames include a fade rather than an instant appearance',
  ).toBe(true)
  expect(frames.samples).toBeGreaterThan(1)
  await expect.poll(() => effectiveOpacity(locator)).toBeGreaterThan(0.99)
}

async function remainsShownAfterRevisit(locator: Locator) {
  const page = locator.page()
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await afterPaint(page)
  expect(await effectiveOpacity(locator)).toBeGreaterThan(0.99)
  await locator.scrollIntoViewIfNeeded()
  await afterPaint(page)
  expect(await effectiveOpacity(locator)).toBeGreaterThan(0.99)
}

for (const section of ['Education', 'Certifications'] as const) {
  test(`${section} heading and body each fade on scroll entry once`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    const container = page.getByTestId(`${section.toLowerCase()}-section`)
    const heading = container.getByRole('heading', {
      name: section,
      exact: true,
    })
    const body =
      section === 'Education'
        ? container.getByRole('heading', { level: 3 }).first()
        : container.getByText('Meta React Native Specialization', {
            exact: true,
          })
    await revealReady(page, '/experience', heading)
    await pendingBelowTrigger(heading)
    await scrollFade(heading, 0.8)
    // The body is still below its own entry point when the shorter heading has entered.
    expect(
      await body.evaluate((node) => node.getBoundingClientRect().top / innerHeight),
    ).toBeGreaterThan(0.85)
    expect(await effectiveOpacity(body)).toBeLessThan(0.01)
    await scrollFade(body)
    await remainsShownAfterRevisit(heading)
    await remainsShownAfterRevisit(body)
  })
}

test('later mobile Contact rows wait for their own entry instead of the first row', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'the stacked mobile layout exposes the reported later-row gap')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const rows = page.getByTestId('contact-info').locator(':scope > div')
  const last = rows.filter({ has: page.getByText('Website', { exact: true }) })
  await revealReady(page, '/contact', last)
  await expect.poll(() => effectiveOpacity(rows.first())).toBeGreaterThan(0.99)
  await pendingBelowTrigger(last)
  await scrollFade(last)
  await remainsShownAfterRevisit(last)
})

test('mobile Contact form heading, later fields and submit have independent scroll reveals', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'independent stacked rows are the mobile regression boundary')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const heading = page.getByRole('heading', {
    name: 'Send a Message',
    exact: true,
  })
  const form = page.getByTestId('contact-form')
  const fields = [form.getByLabel(/^Name/), form.getByLabel(/^Email/), form.getByLabel(/^Message/)]
  const submit = page.getByTestId('submit-button')
  await revealReady(page, '/contact', heading)
  await pendingBelowTrigger(heading)
  await scrollFade(heading, 0.8)
  for (const field of fields) {
    await pendingBelowTrigger(field)
    await scrollFade(field, 0.8)
  }
  await pendingBelowTrigger(submit)
  await scrollFade(submit)
  await remainsShownAfterRevisit(submit)
  for (const field of fields) expect(await effectiveOpacity(field)).toBeGreaterThan(0.99)
})

test('project cards fade independently and keep their revealed owner through sheet Close', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const gallery = page.getByTestId('project-gallery')
  const card = gallery.locator('[data-project-card]').last()
  const owner = gallery.locator(':scope > div').last()
  await revealReady(page, '/open-source', card)
  await expect
    .poll(() => effectiveOpacity(gallery.locator('[data-project-card]').first()))
    .toBeGreaterThan(0.99)
  await pendingBelowTrigger(card)
  await scrollFade(card)
  const retainedOwner = await owner.elementHandle()
  expect(retainedOwner).not.toBeNull()
  await owner.evaluate((node) => {
    const probe = { minimum: 1, samples: 0, connected: true, running: true }
    ;(window as unknown as { __h1OpacityProbe: typeof probe }).__h1OpacityProbe = probe
    const sample = () => {
      probe.connected &&= node.isConnected
      probe.minimum = Math.min(probe.minimum, Number(getComputedStyle(node).opacity))
      probe.samples += 1
      if (probe.running) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
  try {
    await card.getByRole('button', { name: /^Details for / }).click()
    await expect(page.getByTestId('project-sheet')).toBeVisible()
    await page.getByRole('button', { name: 'Close', exact: true }).click()
    await expect(page.getByTestId('project-sheet')).toHaveCount(0)
    await expect(card.getByRole('button', { name: /^Details for / })).toBeFocused()
    await afterPaint(page)
    expect(await retainedOwner!.evaluate((node) => node.isConnected)).toBe(true)
    expect(await effectiveOpacity(card)).toBeGreaterThan(0.99)
  } finally {
    const probe = await page.evaluate(() => {
      const value = (
        window as unknown as {
          __h1OpacityProbe: {
            minimum: number
            samples: number
            connected: boolean
            running: boolean
          }
        }
      ).__h1OpacityProbe
      value.running = false
      return value
    })
    expect(probe.samples).toBeGreaterThan(2)
    expect(probe.connected).toBe(true)
    expect(probe.minimum).toBeGreaterThan(0.99)
    await retainedOwner?.dispose()
  }
  await remainsShownAfterRevisit(card)
})

for (const surface of ['project card', 'closing CTA'] as const) {
  test(`keyboard focus makes a pending ${surface} immediately readable`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    const content =
      surface === 'project card'
        ? page.getByTestId('project-gallery').locator('[data-project-card]').last()
        : page.getByTestId('cta-section').getByRole('heading')
    const control =
      surface === 'project card'
        ? content.getByRole('button', { name: /^Details for / })
        : page.getByTestId('cta-section').getByRole('link')
    await revealReady(page, surface === 'project card' ? '/open-source' : '/', content)
    await expect.poll(() => effectiveOpacity(content)).toBeLessThan(0.01)
    // A focused offscreen control must complete its reveal without requiring a scroll trigger.
    await control.evaluate((node) => (node as HTMLElement).focus({ preventScroll: true }))
    await expect(control).toBeFocused()
    await afterPaint(page)
    expect(await effectiveOpacity(content)).toBeGreaterThan(0.99)
    expect(await effectiveOpacity(control)).toBeGreaterThan(0.99)
  })
}

function geometry(locator: Locator) {
  return locator.evaluate((node) => {
    const { x, y, width, height } = node.getBoundingClientRect()
    return { x, y, width, height }
  })
}

async function expectStationary(locator: Locator, reference: Awaited<ReturnType<typeof geometry>>) {
  await afterPaint(locator.page())
  const actual = await geometry(locator)
  for (const key of ['x', 'y', 'width', 'height'] as const)
    expect(actual[key], key).toBeCloseTo(reference[key], 1)
}

for (const theme of ['light', 'dark'] as const) {
  test(`reduced-motion ${theme} card shell stays stationary on hover, focus and press`, async ({
    page,
  }, testInfo) => {
    test.skip(
      theme === 'dark' && !['Desktop Chrome', 'Mobile Safari'].includes(testInfo.project.name),
      'dark coverage is focused on one fine and one coarse pointer profile',
    )
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme })
    await hydrated(page, '/open-source')
    const card = page.getByTestId('project-gallery').locator('[data-project-card]').first()
    const shell = card.locator('..')
    await card.scrollIntoViewIfNeeded()
    await page.mouse.move(0, 0)
    const reference = await geometry(shell)
    await card.hover()
    await expectStationary(shell, reference)
    await card.getByRole('button', { name: /^Details for / }).focus()
    await expectStationary(shell, reference)
    const bounds = await card.boundingBox()
    expect(bounds).not.toBeNull()
    await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + 35)
    await page.mouse.down()
    try {
      await expectStationary(shell, reference)
    } finally {
      await page.mouse.up()
    }
  })

  test(`reduced-motion ${theme} Contact submit stays stationary on hover, focus and press`, async ({
    page,
  }, testInfo) => {
    test.skip(
      theme === 'dark' && !['Desktop Chrome', 'Mobile Safari'].includes(testInfo.project.name),
      'dark coverage is focused on one fine and one coarse pointer profile',
    )
    await page.route('**/api/contact', (route) => route.abort())
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme })
    await hydrated(page, '/contact')
    const submit = page.getByTestId('submit-button')
    await submit.scrollIntoViewIfNeeded()
    await page.mouse.move(0, 0)
    const reference = await geometry(submit)
    await submit.hover()
    await expectStationary(submit, reference)
    await submit.focus()
    await expectStationary(submit, reference)
    const bounds = await submit.boundingBox()
    await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
    await page.mouse.down()
    try {
      await expectStationary(submit, reference)
    } finally {
      await page.mouse.up()
    }
  })
}

test('reduced-motion Home CTAs and their arrows stay stationary during hover and focus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await hydrated(page, '/')
  for (const control of [
    page.getByTestId('cta-experience'),
    page.getByTestId('cta-contact'),
    page.getByTestId('cta-section').getByRole('link'),
  ]) {
    await control.scrollIntoViewIfNeeded()
    await page.mouse.move(0, 0)
    const reference = await geometry(control)
    const arrow = control.locator('.arrow, svg').first()
    const arrowReference = await geometry(arrow)
    await control.hover()
    await expectStationary(control, reference)
    await expectStationary(arrow, arrowReference)
    await control.focus()
    await expectStationary(control, reference)
    await expectStationary(arrow, arrowReference)
  }
})

function particleFrames(submit: Locator, kind: 'ripple' | 'confetti') {
  return submit.evaluate((button, particleKind) => {
    const container = particleKind === 'ripple' ? button : button.parentElement!
    return [...container.children]
      .filter(
        (node) =>
          node instanceof HTMLElement &&
          node.tagName === 'DIV' &&
          node.style.position === 'absolute',
      )
      .map((node) => ({
        transform: getComputedStyle(node).transform,
        opacity: getComputedStyle(node).opacity,
      }))
  }, kind)
}

async function particleCount(submit: Locator, kind: 'ripple' | 'confetti') {
  return (await particleFrames(submit, kind)).length
}

for (const kind of ['ripple', 'confetti'] as const) {
  test(`live reduced motion removes an already spawned Contact ${kind}`, async ({ page }) => {
    await page.clock.install({ time: new Date('2026-10-07T12:00:00Z') })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      }),
    )
    await hydrated(page, '/contact')
    const submit = page.getByTestId('submit-button')
    if (kind === 'confetti') {
      const form = page.getByTestId('contact-form')
      await form.getByLabel(/^Name/).fill('Animation regression')
      await form.getByLabel(/^Email/).fill('animation@example.com')
      await form.getByLabel(/^Message/).fill('Checking local decorative effect cleanup.')
    }
    await submit.scrollIntoViewIfNeeded()
    await expect.poll(() => effectiveOpacity(submit)).toBeGreaterThan(0.99)
    await page.clock.pauseAt(new Date('2026-10-07T12:01:00Z'))
    await submit.click()
    await expect.poll(() => particleCount(submit, kind)).toBeGreaterThan(0)
    await page.clock.runFor(32)
    const before = await particleFrames(submit, kind)
    await page.clock.runFor(32)
    expect(
      await particleFrames(submit, kind),
      'rendered decoration is moving before reduction',
    ).not.toEqual(before)
    expect(
      await particleCount(submit, kind),
      'the effect is still alive before the media change',
    ).toBeGreaterThan(0)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.clock.runFor(32)
    await expect
      .poll(() => particleCount(submit, kind), {
        message: 'active decorative nodes are removed before their ordinary animation ends',
      })
      .toBe(0)
    await expect(submit).toBeVisible()
  })
}

async function expectAffectedReadable(page: Page, path: keyof typeof affectedContent) {
  for (const selector of affectedContent[path]) {
    const elements = page.locator(selector)
    expect(await elements.count(), `${path} ${selector} exists`).toBeGreaterThan(0)
    for (const element of await elements.all())
      await expect
        .poll(() => effectiveOpacity(element), {
          message: `${path} ${selector} is readable`,
        })
        .toBeGreaterThan(0.99)
  }
}

test.describe('server-readable animation surfaces', () => {
  test.use({ javaScriptEnabled: false })
  test('Experience, Contact and project cards remain readable with JavaScript disabled', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    for (const path of Object.keys(affectedContent) as (keyof typeof affectedContent)[]) {
      await page.goto(path)
      await expectAffectedReadable(page, path)
    }
  })
})

test('deferred application hydration cannot re-hide already readable affected content', async ({
  page,
}) => {
  test.setTimeout(60_000)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const path of Object.keys(affectedContent) as (keyof typeof affectedContent)[]) {
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const scripts = /\/_next\/static\/chunks\/.*\.js$/
    const hold = async (route: import('@playwright/test').Route) => {
      await gate
      await route.continue()
    }
    await page.route(scripts, hold)
    try {
      await page.goto(path, { waitUntil: 'commit' })
      await expect(page.locator('html')).toHaveClass(/intro-skip/)
      await expectAffectedReadable(page, path)
    } finally {
      release()
    }
    await expect(page.getByRole('button', { name: /^Switch to (light|dark) theme$/ })).toBeEnabled()
    await page.waitForLoadState('load')
    await afterPaint(page)
    await expectAffectedReadable(page, path)
    await page.unroute(scripts, hold)
  }
})
