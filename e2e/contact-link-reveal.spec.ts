import { expect, test, type Page } from '@playwright/test'

test('one left-edge pointer press opens the Website while its row is partially revealed', async ({
  page,
  context,
  baseURL,
}) => {
  const destination = 'https://www.horusyeung.com'
  const popups: Page[] = []
  const navigationRequests: string[] = []
  const blockedExternal: string[] = []
  context.on('page', (popup) => popups.push(popup))
  await context.route('**/*', (route) => {
    const request = route.request()
    const url = new URL(request.url())
    if (url.hostname === new URL(destination).hostname) {
      if (request.isNavigationRequest()) navigationRequests.push(request.url())
      return route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><title>Local Website fixture</title><p>Local Website destination fixture</p>',
      })
    }
    if (url.hostname === new URL(baseURL!).hostname) return route.continue()
    blockedExternal.push(request.url())
    return route.abort()
  })

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install({ time: new Date('2026-10-07T12:00:00Z') })
  await page.clock.pauseAt(new Date('2026-10-07T12:01:00Z'))
  await page.goto('/contact')
  await expect(page.getByRole('button', { name: /^Switch to (light|dark) theme$/ })).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('html')).not.toHaveClass(/intro-skip/)
  const row = page
    .getByTestId('contact-info')
    .locator(':scope > div')
    .filter({
      has: page.getByText('Website', { exact: true }),
    })
  const link = row.getByRole('link', { name: 'horusyeung.com', exact: true })
  await expect(link).toHaveAttribute('href', destination)
  await expect(link).toHaveAttribute('target', '_blank')
  await expect.poll(() => row.evaluate((node) => (node as HTMLElement).style.opacity)).toBe('0')
  await link.scrollIntoViewIfNeeded()
  let partialOpacity = 0
  await expect
    .poll(async () => {
      await page.clock.runFor(16)
      partialOpacity = await row.evaluate((node) => Number(getComputedStyle(node).opacity))
      return partialOpacity
    })
    .toBeGreaterThan(0)
  expect(partialOpacity, 'press during an early rendered fade, before it finishes').toBeLessThan(
    0.5,
  )
  const before = (await link.boundingBox())!
  // A translated mobile row can begin left of the viewport. Use its visible left edge,
  // which remains a valid part of the anchor and reproduces the same snap-out failure.
  const point = { x: Math.max(0, before.x) + 3, y: before.y + before.height / 2 }
  expect(point.x).toBeGreaterThan(0)
  expect(point.y).toBeGreaterThan(64)
  expect(point.y).toBeLessThan(page.viewportSize()!.height)
  expect(
    await link.evaluate(
      (node, pointer) => node.contains(document.elementFromPoint(pointer.x, pointer.y)),
      point,
    ),
    'the actual screen point hits the Website anchor before pointer-down',
  ).toBe(true)
  await page.mouse.move(point.x, point.y)
  await page.mouse.down()
  const afterDown = (await link.boundingBox())!
  await page.mouse.up()
  await page.clock.resume()
  try {
    // One real press/release must activate the preserved href. The destination is fulfilled
    // locally at the browser boundary; no real external network request is allowed through.
    await expect.poll(() => popups.length).toBe(1)
    await expect(popups[0]).toHaveURL(new URL(destination).href)
    await expect(
      popups[0].getByText('Local Website destination fixture', { exact: true }),
    ).toBeVisible()
    expect(navigationRequests).toEqual([new URL(destination).href])
    expect(
      Math.abs(afterDown.x - before.x),
      'focus completion keeps the anchor under the pointer',
    ).toBeLessThan(2)
    expect(Math.abs(afterDown.y - before.y)).toBeLessThan(2)
  } finally {
    await test.info().attach('contact-link-pointer-observation', {
      body: Buffer.from(
        JSON.stringify(
          {
            partialOpacity,
            before,
            point,
            afterDown,
            popupURLs: popups.map((popup) => popup.url()),
            navigationRequests,
            blockedExternal,
          },
          null,
          2,
        ),
      ),
      contentType: 'application/json',
    })
    await Promise.all(popups.map((popup) => popup.close()))
  }
})
