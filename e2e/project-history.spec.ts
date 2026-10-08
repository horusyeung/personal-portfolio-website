import { expect, test, type Page } from '@playwright/test'
import { githubProjects } from '../src/content/projects'

const project = githubProjects[0]
const details = (page: Page) =>
  page.getByRole('button', { name: `Details for ${project.name}`, exact: true })
const sheet = (page: Page) => page.getByRole('dialog', { name: project.name, exact: true })
const nextMarkerKeys = ['__NA', '__PRIVATE_NEXTJS_INTERNALS_TREE']

declare global {
  interface Window {
    projectNativeHistoryProbe?: {
      nativePush: History['pushState']
      bypassedPushes: number
      events: unknown[]
    }
  }
}

async function expectClosedWithContext(page: Page) {
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveURL(
    (url) =>
      url.pathname === '/open-source' && url.search === '?view=all' && url.hash === '#projects',
  )
  await expect(details(page)).toBeFocused()
  await expect(page.locator('main')).not.toHaveAttribute('aria-hidden', 'true')
  expect(await page.locator('body').evaluate((node) => getComputedStyle(node).overflow)).not.toBe(
    'hidden',
  )
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const probe = (window.projectNativeHistoryProbe = {
      nativePush: window.history.pushState,
      bypassedPushes: 0,
      events: [] as unknown[],
    })
    const sample = (event: Event) => {
      const target = event.target instanceof HTMLElement ? event.target : null
      probe.events.push({
        utc: new Date().toISOString(),
        at: performance.now(),
        type: event.type,
        url: location.pathname + location.search + location.hash,
        dialogCount: document.querySelectorAll('[role="dialog"]').length,
        historyKeys: Object.keys(history.state || {}),
        owner: history.state?.['portfolio-project-sheet'] ?? null,
        target: target?.textContent?.trim().slice(0, 80),
        connected: target?.isConnected,
        active: document.activeElement?.textContent?.trim().slice(0, 80),
        bodyOverflow: document.body ? getComputedStyle(document.body).overflow : null,
      })
    }
    window.addEventListener('popstate', sample)
    document.addEventListener('click', sample, true)
    document.addEventListener('focusin', sample, true)
  })
})

test.afterEach(async ({ page }, testInfo) => {
  const observation = await page.evaluate(() => ({
    utc: new Date().toISOString(),
    url: location.href,
    dialogCount: document.querySelectorAll('[role="dialog"]').length,
    historyKeys: Object.keys(history.state || {}),
    active: document.activeElement?.textContent?.trim().slice(0, 80),
    bodyOverflow: getComputedStyle(document.body).overflow,
    bypassedPushes: window.projectNativeHistoryProbe?.bypassedPushes,
    events: window.projectNativeHistoryProbe?.events,
  }))
  await testInfo.attach('native-push-history-observations', {
    body: JSON.stringify(observation, null, 2),
    contentType: 'application/json',
  })
})

test('Close synchronizes a project opened before Next native-history integration observes its push', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/open-source?view=all#projects')
  // Establish the controlled fixture before bypassing integration for one activation.
  await expect
    .poll(() =>
      page.evaluate(() => history.pushState !== window.projectNativeHistoryProbe!.nativePush),
    )
    .toBe(true)
  await details(page).click()
  await expect(sheet(page)).toBeVisible()
  expect(await page.evaluate(() => Object.keys(history.state || {}))).toEqual(
    expect.arrayContaining(nextMarkerKeys),
  )
  await sheet(page).getByRole('button', { name: 'Close', exact: true }).click()
  await expectClosedWithContext(page)

  await details(page).evaluate((node) => {
    const patchedPush = history.pushState
    const probe = window.projectNativeHistoryProbe!
    history.pushState = function (data, unused, url) {
      probe.bypassedPushes++
      return probe.nativePush.call(history, data, unused, url)
    }
    try {
      ;(node as HTMLButtonElement).click()
    } finally {
      history.pushState = patchedPush
    }
  })
  await expect(sheet(page)).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(1)
  await expect(page).toHaveURL(
    (url) =>
      url.pathname === '/open-source' &&
      url.search === `?view=all&project=${project.name}` &&
      url.hash === '#projects',
  )
  const bypass = await page.evaluate(() => ({
    pushes: window.projectNativeHistoryProbe!.bypassedPushes,
    keys: Object.keys(history.state || {}),
    owner: history.state?.['portfolio-project-sheet'],
  }))
  expect(bypass.pushes).toBe(1)
  expect(bypass.keys).toEqual(['portfolio-project-sheet'])
  expect(bypass.owner).toEqual(expect.any(String))

  await sheet(page).getByRole('button', { name: 'Close', exact: true }).click()
  await expectClosedWithContext(page)

  // A subsequent normal open proves the Close latch cleared and Next markers pass through.
  await details(page).click()
  await expect(sheet(page)).toBeVisible()
  expect(await page.evaluate(() => Object.keys(history.state || {}))).toEqual(
    expect.arrayContaining([...nextMarkerKeys, 'portfolio-project-sheet']),
  )
  await sheet(page).getByRole('button', { name: 'Close', exact: true }).click()
  await expectClosedWithContext(page)
  expect(await page.evaluate(() => window.projectNativeHistoryProbe!.bypassedPushes)).toBe(1)
})
