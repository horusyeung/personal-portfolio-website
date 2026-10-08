import { expect, test, type Locator, type Page, type Route } from '@playwright/test'

async function pendingPage(page: Page, path: string) {
  await page.setViewportSize({ width: page.viewportSize()!.width, height: 480 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install({ time: new Date('2026-10-07T12:00:00Z') })
  await page.clock.pauseAt(new Date('2026-10-07T12:01:00Z'))
  await page.goto(path)
  await expect(page.getByRole('button', { name: /^Switch to (light|dark) theme$/ })).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.documentElement.classList.contains('intro-skip'))).toBe(
    false,
  )
  // Let the hero finish in virtual time while the lower entrance remains pending.
  await page.clock.runFor(2000)
}

async function earlyPointer(control: Locator, double = false) {
  const page = control.page()
  const owner = control.locator('xpath=ancestor::*[@data-intro][1]')
  expect(await owner.evaluate((node) => Number(getComputedStyle(node).opacity))).toBeLessThan(0.01)
  await control.evaluate((node) => {
    window.scrollTo({
      top: node.getBoundingClientRect().top + scrollY - innerHeight * 0.65,
      behavior: 'instant',
    })
  })
  // Do not wait for opacity/stability or use Locator.click's actionability retry: press and
  // release at one actual pointer position while the still-pending entrance can finish on focus.
  const before = (await control.boundingBox())!
  const point = { x: before.x + before.width / 2, y: before.y + before.height * 0.8 }
  expect(point.y).toBeGreaterThan(64)
  expect(point.y).toBeLessThan(480)
  await page.mouse.move(point.x, point.y)
  await page.mouse.down()
  const afterDown = await control.boundingBox()
  await page.mouse.up()
  if (double) {
    await page.mouse.down({ clickCount: 2 })
    await page.mouse.up({ clickCount: 2 })
  }
  await test.info().attach('early-pointer-geometry', {
    body: Buffer.from(JSON.stringify({ before, point, afterDown }, null, 2)),
    contentType: 'application/json',
  })
  await page.clock.resume()
  return { before, afterDown }
}

test('Home closing CTA activates with one pointer press during its pending reveal', async ({
  page,
}) => {
  await pendingPage(page, '/')
  const control = page.getByTestId('cta-section').getByRole('link', { name: /Get in touch/ })
  const geometry = await earlyPointer(control)
  await expect(page).toHaveURL(/\/contact$/)
  expectNoFocusSnap(geometry)
})

async function fillContact(page: Page) {
  await page.getByLabel(/^Name/).fill(' Ada ')
  await page.getByRole('textbox', { name: /^Email/ }).fill(' ada@example.com ')
  await page.getByLabel(/^Message/).fill(' Hello from an early pointer click. ')
}

function expectNoFocusSnap(geometry: Awaited<ReturnType<typeof earlyPointer>>) {
  // Preserve ordinary small CSS hover scaling; entrance completion must not move the target.
  expect(Math.abs(geometry.afterDown!.y - geometry.before.y)).toBeLessThan(2)
}

test('early Contact pointer click validates the empty form without a request', async ({ page }) => {
  let requests = 0
  await page.route('**/api/contact', (route) => {
    requests += 1
    return route.abort()
  })
  await pendingPage(page, '/contact')
  const geometry = await earlyPointer(page.getByTestId('submit-button'))
  await expect(page.getByText('Please enter your name.', { exact: true })).toBeVisible()
  await expect(page.getByText('Please enter your email address.', { exact: true })).toBeVisible()
  await expect(page.getByText('Please enter a message.', { exact: true })).toBeVisible()
  await expect(page.getByLabel(/^Name/)).toBeFocused()
  expect(requests).toBe(0)
  expectNoFocusSnap(geometry)
})

test('early Contact pointer double click sends one normalized payload and shows success', async ({
  page,
}) => {
  const requests: Route[] = []
  await page.route('**/api/contact', (route) => {
    requests.push(route)
  })
  await pendingPage(page, '/contact')
  await fillContact(page)
  const geometry = await earlyPointer(page.getByTestId('submit-button'), true)
  await expect.poll(() => requests.length).toBe(1)
  expect(requests[0].request().method()).toBe('POST')
  expect(requests[0].request().postDataJSON()).toEqual({
    name: 'Ada',
    email: 'ada@example.com',
    message: 'Hello from an early pointer click.',
    website: '',
  })
  await expect(page.getByRole('status')).toHaveText('Sending…')
  await expect(page.getByTestId('contact-form')).toHaveAttribute('aria-busy', 'true')
  await requests[0].fulfill({ json: { success: true } })
  await expect(page.getByRole('status')).toHaveText('Message sent. Horus will get back to you soon')
  await expect(page.getByLabel(/^Name/)).toHaveValue('')
  await expect(page.getByLabel(/^Message/)).toHaveValue('')
  expect(requests).toHaveLength(1)
  expectNoFocusSnap(geometry)
})

test('early Contact pointer click reports a failed request and retains the message', async ({
  page,
}) => {
  let requests = 0
  await page.route('**/api/contact', (route) => {
    requests += 1
    return route.fulfill({ status: 502, json: { error: 'Failed to send message.' } })
  })
  await pendingPage(page, '/contact')
  await fillContact(page)
  const geometry = await earlyPointer(page.getByTestId('submit-button'))
  await expect(page.getByRole('status')).toHaveText(
    'Failed to send message. Please try again or email me directly.',
  )
  await expect(page.getByTestId('contact-form')).toHaveAttribute('aria-busy', 'false')
  await expect(page.getByLabel(/^Message/)).toHaveValue(' Hello from an early pointer click. ')
  expect(requests).toBe(1)
  expectNoFocusSnap(geometry)
})
