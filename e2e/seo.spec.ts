import { expect, test } from '@playwright/test'

// Vercel serves www.horusyeung.com and redirects the bare domain to it, so every URL the
// site tells search engines about must use this origin (see src/content/site.ts)
const SITE = 'https://www.horusyeung.com'
const PAGES = ['/', '/experience', '/open-source', '/contact']
const canonicalFor = (path: string) => (path === '/' ? SITE : `${SITE}${path}`)
const structuredDataFrom = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1]),
  )

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
    const data = structuredDataFrom(html).find((block) => block['@graph'])
    expect(data).toBeDefined()
    const person = data['@graph'].find((node: { '@type': string }) => node['@type'] === 'Person')
    expect(person.sameAs).toContain('https://medium.com/@horusyeung')
    expect(person.description).toContain('Senior Full Stack Developer')
    expect(person.alternateName).toBe('horusyeung')
  })

  test('structured data uses the www origin', async ({ page }) => {
    await page.goto('/')
    const jsonLd = page.locator('script[type="application/ld+json"]')
    await expect(jsonLd).toHaveCount(2)
    const data = (await jsonLd.allTextContents()).map((content) => JSON.parse(content))
    const urls = JSON.stringify(data).match(/https?:\/\/[^"]*horusyeung\.com[^"]*/g) ?? []
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) expect(url.startsWith(SITE)).toBe(true)
  })

  test('only Home declares a profile, linked to the same person and website', async ({
    request,
  }) => {
    for (const path of PAGES) {
      const response = await request.get(path)
      expect(response.status()).toBe(200)
      const blocks = structuredDataFrom(await response.text())
      const profiles = blocks.filter((block) => block['@type'] === 'ProfilePage')
      expect(profiles).toHaveLength(path === '/' ? 1 : 0)
      if (path === '/') {
        const profile = profiles[0]
        expect(profile.url).toBe(SITE)
        expect(profile.mainEntity).toMatchObject({
          '@type': 'Person',
          '@id': `${SITE}/#person`,
          name: 'Horus Yeung',
        })
        expect(profile.isPartOf).toEqual({ '@id': `${SITE}/#website` })
      }
    }
  })

  test('each page serves unique search snippets and its heading without JavaScript', async ({
    request,
  }) => {
    const titles = new Set<string>()
    const descriptions = new Set<string>()
    for (const path of PAGES) {
      const response = await request.get(path)
      expect(response.status()).toBe(200)
      const html = await response.text()
      const title = html.match(/<title>(.*?)<\/title>/)?.[1]
      const description = html.match(/<meta name="description" content="([^"]+)"/g) ?? []
      expect(title).toContain('Horus Yeung')
      expect(description).toHaveLength(1)
      expect(description[0]).toContain('Horus Yeung')
      expect(html).toMatch(/<h1[^>]*>[^]*?<\/h1>/)
      expect(html).not.toMatch(/<meta name="robots" content="[^"]*noindex/)
      titles.add(title!)
      descriptions.add(description[0]!)
    }
    expect(titles.size).toBe(PAGES.length)
    expect(descriptions.size).toBe(PAGES.length)
  })

  test('project and campaign query variants retain the clean canonical', async ({ request }) => {
    for (const path of ['/?utm_source=linkedin', '/open-source?project=project-structures']) {
      const response = await request.get(path)
      expect(response.status()).toBe(200)
      const html = await response.text()
      const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)]
      expect(canonicals).toHaveLength(1)
      expect(canonicals[0][1]).toBe(canonicalFor(path.split('?')[0]))
    }
  })

  test('an unknown page returns a non-indexable 404', async ({ request }) => {
    const response = await request.get('/does-not-exist-seo-check')
    expect(response.status()).toBe(404)
    expect(await response.text()).toMatch(/<meta name="robots" content="[^"]*noindex/)
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
