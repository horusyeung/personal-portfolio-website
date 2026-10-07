import { expect, test } from '@playwright/test'
import { BIO } from '../src/content/site'

test('hero summary keeps its original copy readable and stationary while the intro runs', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const summary = page.getByTestId('hero-section').locator('.home-hero-subtitle')
  await expect(summary).toHaveText(BIO.hero)
  expect(await summary.evaluate((node) => node.tagName)).toBe('P')
  await expect(summary).toHaveCSS('opacity', '1')
  await expect(summary).toHaveCSS('transform', 'none')
  await expect(summary.locator('[aria-hidden=true]')).toHaveCount(0)
  const sentences = summary.locator(':scope > span')
  await expect(sentences).toHaveCount(2)
  const typography = await sentences.evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node)
      return { size: Number.parseFloat(style.fontSize), weight: Number(style.fontWeight) }
    }),
  )
  expect(typography[0].size).toBeGreaterThan(typography[1].size)
  expect(typography[0].weight).toBeGreaterThan(typography[1].weight)
})

test('hero summary remains readable and inside the viewport without application JavaScript', async ({
  browser,
  baseURL,
  page,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: page.viewportSize(),
    javaScriptEnabled: false,
    reducedMotion: 'no-preference',
  })
  try {
    const plainPage = await context.newPage()
    await plainPage.goto('/')
    const summary = plainPage.getByTestId('hero-section').locator('.home-hero-subtitle')
    await expect(summary).toHaveText(BIO.hero)
    await expect(summary).toHaveCSS('opacity', '1')
    await expect(summary).toHaveCSS('transform', 'none')
    const geometry = await summary.evaluate((node) => {
      const bounds = node.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(node)
      const content = range.getBoundingClientRect()
      return {
        left: content.left,
        right: content.right,
        top: content.top,
        bottom: content.bottom,
        paragraphTop: bounds.top,
        paragraphBottom: bounds.bottom,
        viewportWidth: innerWidth,
        overflow: document.documentElement.scrollWidth - innerWidth,
      }
    })
    expect(geometry.left).toBeGreaterThanOrEqual(0)
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth)
    expect(geometry.top).toBeGreaterThanOrEqual(geometry.paragraphTop - 1)
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.paragraphBottom + 1)
    expect(geometry.overflow).toBeLessThanOrEqual(1)
  } finally {
    await context.close()
  }
})
