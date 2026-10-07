import { expect, test, type Locator, type Page, type Route } from '@playwright/test'
import { CONTACT_SEND_ERROR } from '../src/lib/contact'

const form = (page: Page) => page.getByTestId('contact-form')
const live = (page: Page) => page.getByRole('status')
const island = (page: Page) => page.getByTestId('contact-island')
const submit = (page: Page) => page.getByTestId('submit-button')
const message = (page: Page) => page.getByLabel(/^Message/)
const glow = (page: Page) => page.getByTestId('message-glow')

async function fillForm(page: Page) {
  await page.getByLabel(/^Name/).fill('Ada')
  await page.getByLabel(/^Email/).fill('ada@example.com')
  await message(page).fill('Hello')
}

async function keyboardSubmit(page: Page) {
  await submit(page).focus()
  await page.keyboard.press('Enter')
}

async function holdRequests(page: Page) {
  const requests: Route[] = []
  await page.route('**/api/contact', (route) => {
    requests.push(route)
  })
  return requests
}

async function expectSameRegion(page: Page, region: Awaited<ReturnType<Locator['elementHandle']>>) {
  expect(
    await region!.evaluate(
      (node) => node.isConnected && node === document.querySelector('[role="status"]'),
    ),
  ).toBe(true)
  await expect(live(page)).toHaveCount(1)
}

async function expectFocusedFieldClear(page: Page) {
  await expect(message(page)).toBeFocused()
  await expect
    .poll(() =>
      island(page).evaluate((node) => {
        const field = document.querySelector('textarea[name="message"]')!.getBoundingClientRect()
        const bounds = node.getBoundingClientRect()
        const nav = document.querySelector('[data-testid="navbar"]')!.getBoundingClientRect()
        const overlaps =
          bounds.left < field.right &&
          bounds.right > field.left &&
          bounds.top < field.bottom &&
          bounds.bottom > field.top
        return !overlaps && field.top >= nav.bottom - 1 && field.bottom <= innerHeight + 1
      }),
    )
    .toBe(true)
}

async function glowState(page: Page) {
  return glow(page).evaluate((node) => {
    const ring = getComputedStyle(node, '::before')
    return {
      opacity: Number(ring.opacity),
      display: ring.display,
      angle: ring.getPropertyValue('--contact-message-angle').trim(),
      animations: node
        .getAnimations({ subtree: true })
        .filter((animation) => animation instanceof CSSAnimation)
        .map((animation) => ({
          duration: animation.effect!.getComputedTiming().duration,
          iterations: animation.effect!.getComputedTiming().iterations,
          state: animation.playState,
        })),
    }
  })
}

test.describe('Contact status', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contact', (route) => route.abort())
  })

  test('one persistent live region announces sending and success outside the busy form without moving focus', async ({
    page,
  }, testInfo) => {
    const capture = ['Desktop Chrome', 'Mobile Safari'].includes(testInfo.project.name)
    const width = testInfo.project.name === 'Desktop Chrome' ? 1280 : 390
    if (capture) await page.setViewportSize({ width, height: width === 1280 ? 900 : 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const requests = await holdRequests(page)
    await page.goto('/contact')
    await expect(live(page)).toHaveCount(1)
    await expect(live(page)).toBeEmpty()
    await expect(live(page)).toHaveAttribute('aria-live', 'polite')
    await expect(live(page)).toHaveAttribute('aria-atomic', 'true')
    expect(await live(page).evaluate((node) => node.closest('form, [aria-busy]') === null)).toBe(
      true,
    )
    const region = await live(page).elementHandle()
    await fillForm(page)
    await keyboardSubmit(page)
    await expect(live(page)).toHaveText('Sending…')
    await expect(form(page)).toHaveAttribute('aria-busy', 'true')
    await expect(submit(page)).toHaveAttribute('aria-disabled', 'true')
    await expect(submit(page)).not.toHaveAttribute('disabled')
    await expect(submit(page)).toBeFocused()
    await expect.poll(() => requests.length).toBe(1)
    await message(page).focus()
    await requests[0].fulfill({ json: { success: true } })
    await expect(live(page)).toHaveText('Message sent. Horus will get back to you soon')
    await expect(message(page)).toBeFocused()
    await expect(form(page)).toHaveAttribute('aria-busy', 'false')
    await expect(submit(page)).not.toHaveAttribute('aria-disabled', 'true')
    const mirror = island(page).getByText('Message sent', { exact: true })
    expect(await mirror.evaluate((node) => node.closest('[aria-hidden="true"]') !== null)).toBe(
      true,
    )
    await expect(island(page).getByRole('button', { name: 'Close', exact: true })).toBeEnabled()
    await expectSameRegion(page, region)
    if (capture) {
      for (const colorScheme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme })
        await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${colorScheme}\\b`))
        await page.evaluate(() => document.fonts.ready)
        const name = `contact-feedback-${width}-${colorScheme}.png`
        const path = testInfo.outputPath(name)
        await page.screenshot({ path, animations: 'disabled' })
        await testInfo.attach(name, { path, contentType: 'image/png' })
      }
    }
  })

  test('success and error persist and the same outcome reappears after dismissal and another submission', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.clock.install()
    const requests = await holdRequests(page)
    await page.goto('/contact')
    const region = await live(page).elementHandle()
    let count = 0
    for (const status of [200, 502]) {
      for (let attempt = 0; attempt < 2; attempt++) {
        await fillForm(page)
        await keyboardSubmit(page)
        await expect(live(page)).toHaveText('Sending…')
        await expect(island(page)).toHaveAttribute('data-visible', 'true')
        await expect.poll(() => requests.length).toBe(++count)
        await requests[count - 1].fulfill({
          status,
          json: status === 200 ? { success: true } : { error: 'Failed' },
        })
        const text =
          status === 200 ? 'Message sent. Horus will get back to you soon' : CONTACT_SEND_ERROR
        await expect(live(page)).toHaveText(text)
        await page.clock.fastForward(10_000)
        await expect(live(page)).toHaveText(text)
        await expect(island(page)).toHaveAttribute('data-visible', 'true')
        await expectSameRegion(page, region)
        if (attempt === 0) {
          const close = island(page).getByRole('button', { name: 'Close', exact: true })
          await close.focus()
          await page.keyboard.press('Enter')
          await expect(live(page)).toBeEmpty()
          await expect(island(page)).toHaveAttribute('data-visible', 'false')
          await expectSameRegion(page, region)
        }
      }
    }
    expect(requests).toHaveLength(4)
  })

  test('a long error wraps at 320 by 480 while the island stays clear of the navbar and focused message field', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 480 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const requests = await holdRequests(page)
    await page.goto('/contact')
    await fillForm(page)
    await keyboardSubmit(page)
    await expect(live(page)).toHaveText('Sending…')
    await message(page).focus()
    await expectFocusedFieldClear(page)
    const sendingHeight = (await island(page).boundingBox())!.height
    await expect.poll(() => requests.length).toBe(1)
    await requests[0].fulfill({ status: 502, json: { error: 'Failed' } })
    await expect(live(page)).toHaveText(CONTACT_SEND_ERROR)
    await expectFocusedFieldClear(page)
    const error = island(page).getByText(CONTACT_SEND_ERROR, { exact: true })
    await expect(error).toBeVisible()
    const wrapping = await error.evaluate((node) => ({
      height: node.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(getComputedStyle(node).lineHeight),
      clipped: node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1,
    }))
    expect(wrapping.height).toBeGreaterThan(wrapping.lineHeight * 1.5)
    expect(wrapping.clipped).toBe(false)
    expect((await island(page).boundingBox())!.height).toBeGreaterThan(sendingHeight)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
    const close = island(page).getByRole('button', { name: 'Close', exact: true })
    const closeBounds = (await close.boundingBox())!
    expect(closeBounds.width).toBeGreaterThanOrEqual(44)
    expect(closeBounds.height).toBeGreaterThanOrEqual(44)
  })

  test('message-only glow settles within five seconds and respects reduced motion and forced colors', async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    const requests = await holdRequests(page)
    await page.goto('/contact')
    await expect.poll(() => glowState(page)).toMatchObject({ opacity: 0, animations: [] })
    await page.getByLabel(/^Name/).focus()
    await expect.poll(() => glowState(page)).toMatchObject({ opacity: 0, animations: [] })
    await page.getByLabel(/^Email/).focus()
    await expect.poll(() => glowState(page)).toMatchObject({ opacity: 0, animations: [] })
    await fillForm(page)
    await expect.poll(async () => (await glowState(page)).opacity).toBe(1)
    await glow(page).evaluate(async (node) => {
      await Promise.all(
        node
          .getAnimations({ subtree: true })
          .filter((animation) => animation instanceof CSSAnimation)
          .map((animation) => animation.ready),
      )
    })
    const activated = await glowState(page)
    expect(activated.animations).toHaveLength(2)
    for (const animation of activated.animations) {
      expect(Number(animation.duration)).toBeLessThanOrEqual(5000)
      expect(animation.iterations).toBe(1)
    }
    await keyboardSubmit(page)
    await expect(live(page)).toHaveText('Sending…')
    await expect(glow(page)).toHaveAttribute('data-sending', 'true')
    await expect(submit(page)).toBeFocused()
    await glow(page).evaluate(async (node) => {
      const animations = node
        .getAnimations({ subtree: true })
        .filter((animation) => animation instanceof CSSAnimation)
      await Promise.all(animations.map((animation) => animation.ready))
      animations.forEach((animation) => animation.finish())
    })
    await expect.poll(async () => (await glowState(page)).opacity).toBe(1)
    expect((await glowState(page)).animations.every(({ state }) => state === 'finished')).toBe(true)
    expect(Number.parseFloat((await glowState(page)).angle)).toBe(405)
    await expect(live(page)).toHaveText('Sending…')
    await expect.poll(() => requests.length).toBe(1)
    await requests[0].fulfill({ status: 502, json: { error: 'Failed' } })
    await expect(live(page)).toHaveText(CONTACT_SEND_ERROR)
    await expect(glow(page)).toHaveAttribute('data-sending', 'false')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await message(page).focus()
    await expect.poll(() => glowState(page)).toMatchObject({ opacity: 1, animations: [] })
    await expect(island(page)).toHaveCSS('transition-property', 'opacity')
    await page.emulateMedia({ forcedColors: 'active' })
    if (await page.evaluate(() => matchMedia('(forced-colors: active)').matches)) {
      await expect.poll(() => glowState(page)).toMatchObject({ display: 'none', animations: [] })
      await expect(island(page)).toHaveCSS('background-image', 'none')
      await expect(island(page)).toHaveCSS('backdrop-filter', 'none')
      const close = island(page).getByRole('button', { name: 'Close', exact: true })
      await close.focus()
      await expect(close).toHaveCSS('outline-style', 'solid')
      await page.keyboard.press('Enter')
      await expect(live(page)).toBeEmpty()
    } else {
      testInfo.annotations.push({
        type: 'note',
        description:
          'runtime cannot emulate forced colors; normal and reduced-motion behavior verified',
      })
    }
  })

  test('reduced transparency uses a solid island in both color schemes', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'Chromium CDP emulates reduced transparency')
    const session = await page.context().newCDPSession(page)
    try {
      await page.route('**/api/contact', (route) =>
        route.fulfill({ status: 502, json: { error: 'Failed' } }),
      )
      for (const colorScheme of ['light', 'dark'] as const) {
        await session.send('Emulation.setEmulatedMedia', {
          features: [
            { name: 'prefers-color-scheme', value: colorScheme },
            { name: 'prefers-reduced-motion', value: 'reduce' },
            { name: 'prefers-reduced-transparency', value: 'reduce' },
          ],
        })
        await page.goto('/contact')
        expect(
          await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches),
        ).toBe(true)
        await fillForm(page)
        await keyboardSubmit(page)
        await expect(live(page)).toHaveText(CONTACT_SEND_ERROR)
        const styles = await island(page).evaluate((node) => {
          const style = getComputedStyle(node)
          return {
            fill: style.backgroundColor,
            blur: style.backdropFilter,
            webkitBlur: style.getPropertyValue('-webkit-backdrop-filter'),
          }
        })
        expect(styles.fill).toMatch(/^rgb\(/)
        expect(styles.blur).toBe('none')
        if (styles.webkitBlur) expect(styles.webkitBlur).toBe('none')
        await expect(island(page).getByRole('button', { name: 'Close', exact: true })).toBeEnabled()
      }
    } finally {
      await session.detach()
    }
  })
})
