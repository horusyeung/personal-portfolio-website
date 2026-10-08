import { expect, test, type Page } from '@playwright/test'

async function changePreference(page: Page, reducedMotion: 'reduce' | 'no-preference') {
  const notification = await page.evaluateHandle(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    return {
      changed: new Promise<void>((resolve) => {
        media.addEventListener(
          'change',
          () => requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          { once: true },
        )
      }),
    }
  })
  await page.emulateMedia({ reducedMotion })
  await notification.evaluate(async ({ changed }) => changed)
  await notification.dispose()
}

test('motion preference changes preserve the workflow viewport and allow playback', async ({
  page,
  baseURL,
}) => {
  const origin = new URL(baseURL!).origin
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== origin || url.pathname === '/api/contact') return route.abort()
    return route.continue()
  })
  await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'light' })
  await page.clock.install({ time: new Date('2026-10-07T12:00:00Z') })
  await page.clock.pauseAt(new Date('2026-10-07T12:01:00Z'))
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('html')).not.toHaveClass(/intro-skip/)
  await page.clock.resume()

  const story = page.getByTestId('system-story')
  await story.evaluate((node) => {
    window.scrollTo({
      top: node.getBoundingClientRect().top + scrollY - innerHeight * 0.2,
      behavior: 'instant',
    })
  })
  await expect(story).toHaveAttribute('data-ready', 'true')
  await expect(story).toHaveAttribute('data-phase', 'flowing')
  const replay = story.getByRole('button', { name: 'Replay system story', exact: true })
  // Let native input bring its target into view before measuring preference-driven movement.
  await replay.scrollIntoViewIfNeeded()
  const reference = await page.evaluate(() => scrollY)
  expect(reference).toBeGreaterThan(0)

  await changePreference(page, 'reduce')
  await expect(story).toHaveAttribute('data-phase', 'settled')
  await expect(replay).toBeDisabled()
  expect(await page.evaluate(() => scrollY)).toBe(reference)

  await changePreference(page, 'no-preference')
  await expect(replay).toBeEnabled()
  expect(await page.evaluate(() => scrollY)).toBe(reference)
  await replay.click()
  await expect(story).toHaveAttribute('data-phase', 'flowing')
  await expect(
    story.locator('[data-system-scenario="microservices"] [data-system-stage]'),
  ).toBeInViewport()
  expect(await page.evaluate(() => scrollY)).toBe(reference)
})
