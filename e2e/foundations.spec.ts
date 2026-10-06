import { expect, test, type Page } from '@playwright/test'
import { decorativeGlassSx, glassEdgeSx, glassSx } from '../src/lib/glass'

// Mount temporary probes using the shipped CSS classes and sx values; no demo route ships.
async function glassProbes(page: Page) {
  return page.evaluate(
    (helpers) => {
      const rules: CSSStyleRule[] = []
      const collect = (list: CSSRuleList) => {
        for (const rule of Array.from(list)) {
          if (rule instanceof CSSStyleRule) rules.push(rule)
          else if ('cssRules' in rule) collect((rule as CSSGroupingRule).cssRules)
        }
      }
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          collect(sheet.cssRules)
        } catch {
          /* Ignore third-party sheets. */
        }
      }
      const base = rules.find((rule) => rule.style.background === 'var(--glass-fill)')!
      const decorative = rules.find(
        (rule) => rule.style.background === 'var(--glass-decorative-fill)',
      )!
      const edge = rules.find((rule) => rule.style.background === 'var(--glass-edge-fill)')!
      const selectors = [
        base.selectorText.split(',')[0],
        decorative.selectorText,
        edge.selectorText,
      ]
      return [...selectors, ...helpers].map((style) => {
        const probe = document.createElement('div')
        // Layers override their own blur without bypassing a reduced-transparency fallback.
        probe.style.setProperty('--glass-edge-blur', '2px')
        if (typeof style === 'string') probe.className = style.trim().slice(1)
        else Object.assign(probe.style, style)
        document.body.append(probe)
        const computed = getComputedStyle(probe)
        const result = {
          fill: computed.backgroundColor,
          backdrop: computed.backdropFilter,
          webkitBackdrop: computed.getPropertyValue('-webkit-backdrop-filter'),
        }
        probe.remove()
        return result
      })
    },
    [glassSx, decorativeGlassSx, glassEdgeSx],
  )
}

test.describe('Foundations', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`glass tokens and sx helpers share ${scheme} values`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto('/')
      const values = await glassProbes(page)
      expect(values.slice(0, 3)).toEqual(values.slice(3))
      expect(values[0].fill).toBe(
        scheme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(29, 29, 31, 0.8)',
      )
      expect(values[0].backdrop).toContain('blur(20px)')
      expect(values[2].backdrop).toBe('blur(2px)')
      // WebKit exposes the prefixed declaration; Chromium and Firefox may canonicalize it.
      if (values[0].webkitBackdrop) expect(values[0].webkitBackdrop).toBe(values[0].backdrop)
    })

    test(`reduced transparency makes every ${scheme} glass surface and edge solid`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== 'chromium', 'preference emulated through Chromium CDP')
      await page.emulateMedia({ colorScheme: scheme })
      const session = await page.context().newCDPSession(page)
      await session.send('Emulation.setEmulatedMedia', {
        features: [
          { name: 'prefers-color-scheme', value: scheme },
          { name: 'prefers-reduced-transparency', value: 'reduce' },
        ],
      })
      await page.goto('/')
      expect(
        await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches),
      ).toBe(true)
      for (const value of await glassProbes(page)) {
        expect(value.fill).toBe(scheme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(29, 29, 31)')
        expect(value.backdrop).toBe('none')
        if (value.webkitBackdrop) expect(value.webkitBackdrop).toBe('none')
      }
      await session.detach()
    })
  }

  for (const [path, heading] of [
    ['/', 'Horus Yeung'],
    ['/experience', 'Experience'],
    ['/open-source', 'Open Source'],
    ['/contact', 'Get in Touch'],
  ]) {
    test(`${path} preserves readable copy with JavaScript disabled`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false })
      const page = await context.newPage()
      try {
        await page.goto(`${baseURL}${path}`)
        await expect(
          page.getByRole('heading', { level: 1, name: heading, exact: true }),
        ).toBeVisible()
        await expect(page.locator('[data-intro]').first()).toHaveCSS('opacity', '1')
        await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()
        await expect(page.getByRole('contentinfo')).toBeVisible()
      } finally {
        await context.close()
      }
    })
  }

  test('the skip link, nav and dialog layers follow the shared scale', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.skip-link')).toHaveCSS('z-index', '2000')
    await expect(page.getByTestId('navbar')).toHaveCSS('z-index', '1100')
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--site-z-dialog').trim(),
      ),
    ).toBe('1300')
  })

  test('/lab stays outside production', async ({ request }) => {
    expect((await request.get('/lab')).status()).toBe(404)
  })
})
