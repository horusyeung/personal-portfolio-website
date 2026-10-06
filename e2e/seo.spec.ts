import { expect, test } from '@playwright/test'

// Vercel serves www.horusyeung.com and redirects the bare domain to it, so every URL the
// site tells search engines about must use this origin (see src/content/site.ts)
const SITE = 'https://www.horusyeung.com'
const PAGES = ['/', '/experience', '/open-source', '/contact']
const canonicalFor = (path: string) => (path === '/' ? SITE : `${SITE}${path}`)

test.describe('SEO URLs', () => {
  // Server output, so one engine is enough
  test.skip(
    ({ browserName, isMobile }) => browserName !== 'chromium' || isMobile,
    'engine-independent',
  )

  for (const path of PAGES) {
    test(`${path} declares the www canonical`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        canonicalFor(path),
      )
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        'content',
        canonicalFor(path),
      )
    })
  }

  test('structured data uses the www origin', async ({ page }) => {
    await page.goto('/')
    const jsonLd = page.locator('script[type="application/ld+json"]')
    await expect(jsonLd).toHaveCount(1)
    const data = JSON.parse((await jsonLd.textContent()) ?? '{}')
    const urls = JSON.stringify(data).match(/https?:\/\/[^"]*horusyeung\.com[^"]*/g) ?? []
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) expect(url.startsWith(SITE)).toBe(true)
  })

  test('sitemap lists only www URLs', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    expect(locs).toEqual(PAGES.map(canonicalFor))
  })

  test('robots.txt points at the www sitemap', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`)
  })
})
