import { expect, test, type Page } from '@playwright/test'

const VIEWPORTS = [
  { label: 'Mobile', width: 375, height: 812 },
  { label: 'Tablet', width: 768, height: 1024 },
  { label: 'Desktop', width: 1280, height: 800 },
]

const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.body.scrollWidth - window.innerWidth)

// Entrance animations may briefly move content; the settled layout must fit the viewport
const expectNoHorizontalOverflow = async (page: Page) => {
  await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(1)
}

test.describe('Responsive Design', () => {
  // Mobile projects already emulate real devices; fixed viewports run on the desktop engines
  test.skip(({ isMobile }) => isMobile, 'covered by the mobile device projects')

  for (const { label, width, height } of VIEWPORTS) {
    test.describe(`${label} ${width}x${height}`, () => {
      test.use({ viewport: { width, height } })

      test.beforeEach(async ({ page }) => {
        await page.goto('/')
      })

      test('renders the home page without horizontal overflow', async ({ page }) => {
        await expectNoHorizontalOverflow(page)
      })

      test('hero text is visible', async ({ page }) => {
        await expect(page.getByTestId('hero-name')).toBeVisible()
      })
    })
  }
})

test.describe('Responsive Design on device', () => {
  test.skip(({ isMobile }) => !isMobile, 'device emulation only')

  for (const path of ['/', '/experience', '/open-source', '/contact']) {
    test(`${path} has no horizontal overflow`, async ({ page }) => {
      await page.goto(path)
      await expectNoHorizontalOverflow(page)
    })
  }

  // The hero subtitle slides in from x: +30px; it must never widen the page (Android Chrome
  // would otherwise keep a widened layout viewport after the animation)
  test('home never overflows horizontally while the hero animates', async ({ page }) => {
    const { width } = page.viewportSize()!
    await page.goto('/')
    for (let elapsed = 0; elapsed <= 2000; elapsed += 100) {
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
      expect(await page.evaluate(() => window.innerWidth)).toBe(width)
      await page.waitForTimeout(100)
    }
  })
})
