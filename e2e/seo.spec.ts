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

  for (const path of PAGES) {
    test(`${path} shares the Open Graph image and site details`, async ({ page }) => {
      await page.goto(path)
      for (const property of ['og:image', 'og:site_name', 'og:locale', 'og:type']) {
        await expect(page.locator(`meta[property="${property}"]`)).toHaveCount(1)
      }
      // Next fills the Twitter tags from each page's own Open Graph tags; the home title must not
      // leak to subpages
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', ogTitle!)
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image',
      )
    })
  }

  test('structured data is in the server HTML', async ({ request }) => {
    const html = await (await request.get('/')).text()
    const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)
    expect(match).not.toBeNull()
    const data = JSON.parse(match![1])
    const person = data['@graph'].find((node: { '@type': string }) => node['@type'] === 'Person')
    expect(person.sameAs).toContain('https://medium.com/@horusyeung')
  })

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

  test('sitemap dates are content dates, not the build time', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    const dates = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1])
    expect(dates).toHaveLength(PAGES.length)
    for (const date of dates) expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('robots.txt points at the www sitemap', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`)
  })
})
