import { expect, test } from '@playwright/test'

/*
 * Full-page visual snapshots: the "no visual change" guard for refactors. They are rendered with
 * reduced motion (no animations, so every element is in its final state) inside the official
 * Playwright Docker image, which CI also uses, so fonts and rendering match exactly.
 *
 * Update after an intended visual change:
 *   yarn build && yarn start            # serve the production build on :3000
 *   yarn test:visual:update             # re-render the snapshots in Docker
 */
test.use({ reducedMotion: 'reduce' })

test.describe('Visual snapshots', () => {
  test.skip(
    process.platform !== 'linux',
    'snapshots are rendered in the Playwright Docker image (Linux)',
  )
  // Desktop Chrome and Mobile Safari: one desktop and one mobile engine is enough
  test.skip(
    ({ browserName, isMobile }) => (browserName === 'chromium') === isMobile,
    'covered by Desktop Chrome and Mobile Safari',
  )

  for (const [name, path] of [
    ['home', '/'],
    ['experience', '/experience'],
    ['open-source', '/open-source'],
    ['contact', '/contact'],
  ]) {
    // Light keeps the original snapshot names; dark mode follows the system setting
    for (const scheme of ['light', 'dark'] as const) {
      test(`${name} page (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme })
        await page.goto(path)
        await page.evaluate(() => document.fonts.ready)
        const file = scheme === 'light' ? `${name}.png` : `${name}-dark.png`
        await expect(page).toHaveScreenshot(file, { fullPage: true })
      })
    }
  }
})
