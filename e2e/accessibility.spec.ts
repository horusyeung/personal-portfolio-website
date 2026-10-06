import { expect, test } from '@playwright/test'

const PAGES = ['/', '/experience', '/open-source', '/contact']

test.describe('Accessibility', () => {
  test('the skip link is the first Tab stop and moves focus to the main content', async ({
    page,
    browserName,
    isMobile,
  }) => {
    // Safari only tabs to links with "Press Tab to highlight each item" turned on
    test.skip(browserName !== 'chromium' || isMobile, 'keyboard Tab order')
    await page.goto('/')
    const skipLink = page.getByRole('link', { name: 'Skip to content' })
    await expect(skipLink).not.toBeInViewport()

    await page.keyboard.press('Tab')
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toBeInViewport()

    await page.keyboard.press('Enter')
    await expect(page.locator('main')).toBeFocused()
  })

  test('the navigation is a labelled landmark that marks the current page', async ({ page }) => {
    await page.goto('/experience')
    const nav = page.getByRole('navigation', { name: 'Main' })
    await expect(nav.getByRole('link')).toHaveCount(4)
    await expect(nav.getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(nav.locator('[aria-current]')).toHaveCount(1)
  })

  test('nav links have a hit area at least 44px tall', async ({ page }) => {
    await page.goto('/')
    const links = page.getByRole('navigation', { name: 'Main' }).getByRole('link')
    for (const link of await links.all()) {
      // The ::after hit area belongs to the link, so points 21px above and below its centre
      // (a 42px span, inside a 44px box) must still land on it
      const hits = await link.evaluate((el) => {
        const r = el.getBoundingClientRect()
        const x = r.left + r.width / 2
        const y = r.top + r.height / 2
        return [y - 21, y + 21].map((py) => document.elementFromPoint(x, py)?.closest('a') === el)
      })
      expect(hits).toEqual([true, true])
    }
  })

  for (const path of PAGES) {
    test(`${path} has one h1 and no skipped heading levels`, async ({ page }) => {
      await page.goto(path)
      const levels = await page
        .locator('main :is(h1, h2, h3, h4, h5, h6)')
        .evaluateAll((els) => els.map((el) => Number(el.tagName[1])))
      expect(levels.filter((level) => level === 1)).toHaveLength(1)
      levels.forEach((level, i) => {
        if (i > 0) expect(level).toBeLessThanOrEqual(levels[i - 1] + 1)
      })
    })

    test(`${path} hides decorative icons from screen readers`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('svg:not([aria-hidden="true"])')).toHaveCount(0)
    })
  }

  test('project cards are named by their content, not just the project name', async ({ page }) => {
    await page.goto('/open-source')
    await expect(
      page.getByRole('link', { name: /project-structures.*Production-ready project structures/ }),
    ).toHaveCount(1)
    await expect(page.getByRole('heading', { name: 'project-structures', level: 2 })).toHaveCount(1)
  })

  test('experience bullets are drawn by CSS, not typed into the text', async ({ page }) => {
    await page.goto('/experience')
    const first = page.getByRole('listitem').first()
    await expect(first).not.toContainText('·')
    const marker = await first
      .locator('p')
      .evaluate((el) => getComputedStyle(el, '::before').content)
    expect(marker).toContain('·')
  })
})
