import { expect, test, type Page } from '@playwright/test'

// Content that entrance animations reveal, per page. Playwright's toBeVisible() ignores opacity,
// so these tests measure the effective opacity (including ancestors) instead.
const CONTENT: Record<string, string[]> = {
  '/': [
    '[data-testid=hero-name]',
    '[data-testid=cta-experience]',
    '.home-hero-subtitle',
    '[data-skill-category]',
    '[data-testid=about-section] h2',
    '[data-testid=skills-section] h2',
    '[data-testid=cta-section] h2',
  ],
  '/experience': [
    '[data-testid=experience-hero] h1',
    '[data-testid=experience-hero] h1 + div',
    '[data-testid=work-experience] h2',
    '[data-testid=education-section] h3',
    '[data-testid=certifications-section] p',
  ],
  '/open-source': [
    '[data-testid=open-source-hero] h1',
    '[data-testid=open-source-hero] p',
    '[data-testid^=project-]',
    '.project-tag',
  ],
  '/contact': [
    '[data-testid=contact-hero] h1',
    '[data-testid=contact-hero] p',
    '[data-testid=contact-info] > div',
    '[data-testid=contact-form] input[name=name]',
    '[data-testid=contact-form] input[name=email]',
    '[data-testid=contact-form] textarea[name=message]',
  ],
}

/** Lowest effective opacity among all elements matching the selector (0 if none match). */
const minOpacity = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const values = [...document.querySelectorAll(sel)].map((el) => {
      let opacity = 1
      for (let node: Element | null = el; node; node = node.parentElement) {
        opacity *= parseFloat(getComputedStyle(node).opacity)
      }
      return opacity
    })
    return values.length ? Math.min(...values) : 0
  }, selector)

const expectAllShown = async (page: Page, path: string, timeout?: number) => {
  for (const selector of CONTENT[path]) {
    await expect
      .poll(() => minOpacity(page, selector), { message: `${path} ${selector}`, timeout })
      .toBeGreaterThan(0.99)
  }
}

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  for (const path of Object.keys(CONTENT)) {
    test(`${path} shows all content without animating`, async ({ page }) => {
      await page.goto(path)
      await expectAllShown(page, path, 1_000)
    })
  }
})

test('turning on reduced motion mid-animation reveals everything', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(300)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expectAllShown(page, '/', 1_000)
})

// Scripts only: the stylesheet with the intro rules must still load for these to mean anything
const APP_SCRIPTS = /\/_next\/static\/chunks\/.*\.js$/

test('content still appears when JavaScript never loads', async ({ page }) => {
  await page.route(APP_SCRIPTS, (route) => route.abort())
  await page.goto('/')
  await expectAllShown(page, '/', 5_000)
  await expect(page.locator('html')).toHaveClass(/intro-skip/)
})

test('slow hydration never hides content that is already showing', async ({ page }) => {
  await page.route(APP_SCRIPTS, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 5_000))
    await route.continue()
  })
  await page.goto('/', { waitUntil: 'commit' })
  await expectAllShown(page, '/', 4_500)

  // Once the app hydrates, entrance animations are skipped instead of re-hiding the page
  await page.waitForLoadState('load')
  await page.waitForTimeout(500)
  for (const selector of CONTENT['/']) {
    expect(await minOpacity(page, selector), selector).toBeGreaterThan(0.99)
  }
})

test('revisiting pages does not duplicate animated text', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-link-experience').click()
  await expect(page).toHaveURL(/\/experience$/)
  await page.getByTestId('nav-link-home').click()
  await expect(page).toHaveURL((url) => url.pathname === '/')

  const name = page.getByTestId('hero-name')
  await expect(name).toHaveText('Horus Yeung')
  // One span per character at most (11), never a second split nested inside the first
  expect(await name.locator('span span').count()).toBe(0)
  expect(await name.locator('span').count()).toBeLessThanOrEqual('Horus Yeung'.length)
  for (const selector of ['[data-testid=hero-name]', '[data-testid=cta-experience]']) {
    await expect.poll(() => minOpacity(page, selector), { message: selector }).toBeGreaterThan(0.99)
  }

  // Scroll reveals still fire after a revisit
  const about = '[data-testid=about-section] h2'
  await page.locator(about).scrollIntoViewIfNeeded()
  await expect.poll(() => minOpacity(page, about), { message: about }).toBeGreaterThan(0.99)

  const footer = page.getByTestId('footer')
  await footer.scrollIntoViewIfNeeded()
  await expect(footer).toBeInViewport()
})
