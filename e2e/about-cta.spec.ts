import { expect, test, type Locator } from '@playwright/test'

const ABOUT_COPY =
  'Designed a microservice architecture from scratch. Lead a distributed team of 5 engineers while coding daily, managing cross-timezone sprints, coding standards and CI/CD pipelines. Use AI-augmented development workflows to speed up delivery and raise code quality.'

const closingLink = (section: Locator) => section.getByRole('link', { name: 'Get in touch' })

async function glowState(link: Locator) {
  return link.evaluate((node) => {
    const wrapper = node.parentElement!
    const ring = getComputedStyle(wrapper, '::before')
    return {
      opacity: Number(ring.opacity),
      display: ring.display,
      angle: ring.getPropertyValue('--cta-glow-angle').trim(),
      animations: wrapper
        .getAnimations({ subtree: true })
        .filter((animation) => animation instanceof CSSAnimation)
        .map((animation) => {
          const timing = animation.effect!.getComputedTiming()
          return {
            duration: timing.duration,
            iterations: timing.iterations,
            state: animation.playState,
            startTime: animation.startTime,
          }
        }),
    }
  })
}

async function colorDifference(
  paragraph: Locator,
  endpoint: 'secondary' | 'primary',
  word: 'first' | 'last',
) {
  return paragraph.evaluate(
    (node, { endpoint, word }) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 1
      const context = canvas.getContext('2d')!
      const pixel = (color: string) => {
        context.clearRect(0, 0, 1, 1)
        context.fillStyle = color
        context.fillRect(0, 0, 1, 1)
        return [...context.getImageData(0, 0, 1, 1).data]
      }
      const words = node.querySelectorAll('span')
      const selected = word === 'first' ? words[0] : words[words.length - 1]
      const expected =
        endpoint === 'secondary'
          ? getComputedStyle(node).color
          : getComputedStyle(node.closest('section')!.querySelector('h2')!).color
      const actual = pixel(getComputedStyle(selected).color)
      return Math.max(...pixel(expected).map((value, index) => Math.abs(value - actual[index])))
    },
    { endpoint, word },
  )
}

test('About keeps real paragraph semantics and scrubs readable token colors in both themes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const paragraph = page.getByTestId('about-copy')
  await paragraph.scrollIntoViewIfNeeded()
  await expect(paragraph.locator('span')).not.toHaveCount(0)
  await expect(paragraph).toHaveText(ABOUT_COPY)
  await expect(paragraph).not.toHaveAttribute('aria-label')
  await expect(paragraph.locator('[aria-hidden]')).toHaveCount(0)
  expect(await paragraph.evaluate((node) => node.closest('[data-intro]') === null)).toBe(true)
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    await paragraph.evaluate((node) => {
      window.scrollTo(0, node.getBoundingClientRect().top + scrollY - innerHeight * 0.84)
    })
    await expect
      .poll(() =>
        paragraph
          .locator('span')
          .first()
          .evaluate((node) =>
            Number.parseFloat((node as HTMLElement).style.getPropertyValue('--word-lit')),
          ),
      )
      .toBeLessThanOrEqual(1)
    await expect.poll(() => colorDifference(paragraph, 'secondary', 'first')).toBeLessThanOrEqual(1)
    await expect(paragraph.locator('span').first()).toHaveCSS('opacity', '1')
    await paragraph.evaluate((node) => {
      window.scrollTo(0, node.getBoundingClientRect().bottom + scrollY - innerHeight * 0.4)
    })
    await expect
      .poll(() =>
        paragraph
          .locator('span')
          .last()
          .evaluate((node) =>
            Number.parseFloat((node as HTMLElement).style.getPropertyValue('--word-lit')),
          ),
      )
      .toBeGreaterThanOrEqual(99)
    await expect.poll(() => colorDifference(paragraph, 'primary', 'last')).toBeLessThanOrEqual(1)
  }
})

test('reduced motion restores the plain About paragraph and a static CTA ring', async ({
  page,
}) => {
  await page.goto('/')
  const paragraph = page.getByTestId('about-copy')
  await paragraph.scrollIntoViewIfNeeded()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(paragraph.locator('span')).toHaveCount(0)
  await expect(paragraph).toHaveText(ABOUT_COPY)
  const link = closingLink(page.getByTestId('cta-section'))
  await page.keyboard.press('Tab')
  await link.focus()
  await expect.poll(() => glowState(link)).toMatchObject({ opacity: 1, animations: [] })
  await expect(link).toHaveCSS('outline-style', 'solid')
  await expect(link).toHaveAttribute('href', '/contact')
})

test('CTA glow starts only on interaction and each activation ends in a static ring within five seconds', async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const link = closingLink(page.getByTestId('cta-section'))
  await expect.poll(() => glowState(link)).toMatchObject({ opacity: 0, animations: [] })
  if (!isMobile) await link.hover()
  else await link.focus()
  await expect.poll(async () => (await glowState(link)).opacity).toBe(1)
  const active = await glowState(link)
  expect(active.animations).toHaveLength(2)
  for (const animation of active.animations) {
    expect(Number(animation.duration)).toBeLessThanOrEqual(5000)
    expect(animation.iterations).toBe(1)
  }
  if (!isMobile) {
    await link.focus()
    expect((await glowState(link)).animations.map(({ startTime }) => startTime)).toEqual(
      active.animations.map(({ startTime }) => startTime),
    )
  }
  await link.evaluate((node) =>
    node
      .parentElement!.getAnimations({ subtree: true })
      .filter((animation) => animation instanceof CSSAnimation)
      .forEach((animation) => animation.finish()),
  )
  await expect.poll(() => glowState(link)).toMatchObject({ opacity: 1 })
  expect((await glowState(link)).animations.every(({ state }) => state === 'finished')).toBe(true)
  expect(Number.parseFloat((await glowState(link)).angle)).toBe(405)
  await link.click()
  await expect(page).toHaveURL(/\/contact$/)
})

test('forced colors suppresses decorative CTA glow while leaving the link usable', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  await page.goto('/')
  const link = closingLink(page.getByTestId('cta-section'))
  await page.keyboard.press('Tab')
  await link.focus()
  await expect.poll(() => glowState(link)).toMatchObject({ display: 'none', animations: [] })
  await expect(link).toBeFocused()
  await expect(link).toHaveCSS('outline-style', 'solid')
})

test('navigation away and back never duplicates the About words', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const paragraph = page.getByTestId('about-copy')
  await paragraph.scrollIntoViewIfNeeded()
  await expect(paragraph.locator('span')).not.toHaveCount(0)
  const count = await paragraph.locator('span').count()
  await page.getByTestId('nav-link-experience').click()
  await expect(page).toHaveURL(/\/experience$/)
  await page.getByTestId('nav-link-home').click()
  await expect(page).toHaveURL((url) => url.pathname === '/')
  await paragraph.scrollIntoViewIfNeeded()
  await expect(paragraph.locator('span')).toHaveCount(count)
  await expect(paragraph.locator('span span')).toHaveCount(0)
  await expect(paragraph).toHaveText(ABOUT_COPY)
})

test('no JavaScript keeps About copy plain and visible in server HTML', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  try {
    await page.goto('/')
    const paragraph = page.getByTestId('about-copy')
    await expect(paragraph).toHaveText(ABOUT_COPY)
    await expect(paragraph.locator('span')).toHaveCount(0)
    await expect(paragraph).toHaveCSS('opacity', '1')
    expect(await paragraph.evaluate((node) => node.closest('[data-intro]') === null)).toBe(true)
    await expect(closingLink(page.getByTestId('cta-section'))).toHaveAttribute('href', '/contact')
  } finally {
    await context.close()
  }
})
