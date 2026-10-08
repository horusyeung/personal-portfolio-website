import { expect, test, type Locator, type Page } from '@playwright/test'
import { githubProjects } from '../src/content/projects'

const first = githubProjects[0]
const details = (page: Page, name = first.name) =>
  page.getByRole('button', { name: `Details for ${name}`, exact: true })
const sheet = (page: Page, name = first.name) => page.getByRole('dialog', { name, exact: true })
const selectedId = (url: URL) => url.searchParams.get('project')

async function expectGitHubAvailability(link: Locator, project: { status: string; url: string }) {
  if (project.status === 'Coming Soon') {
    await expect(link).toHaveAttribute('aria-disabled', 'true')
    await expect(link).toHaveAttribute('tabindex', '-1')
    await expect(link).not.toHaveAttribute('href')
  } else {
    await expect(link).toHaveAttribute('href', project.url)
    await expect(link).not.toHaveAttribute('aria-disabled', 'true')
  }
}

async function expectNoActivation(page: Page, link: Locator) {
  const url = page.url()
  const pages = page.context().pages().length
  await link.evaluate((node) => (node as HTMLAnchorElement).click())
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  await expect(page).toHaveURL(url)
  expect(page.context().pages().length).toBe(pages)
}

async function expectFocusedWithin(dialog: Locator) {
  await expect
    .poll(() => dialog.evaluate((node) => node.contains(document.activeElement)))
    .toBe(true)
}

async function expectClosed(page: Page) {
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveURL(
    (url) => url.pathname === '/open-source' && !url.searchParams.has('project'),
  )
}

async function openFirst(page: Page) {
  await expect(details(page)).toBeEnabled()
  await details(page).click()
  const dialog = sheet(page)
  await expect(dialog).toBeVisible()
  await expect(page).toHaveURL((url) => selectedId(url) === first.name)
  return dialog
}

type TransitionSample = {
  pseudos: string[]
  fading: string[]
  mainOpacity: string
  portalOutsideMain: boolean
  headerZIndex: string
  projectZIndex: string
}

declare global {
  interface Window {
    projectSheetFocusProbe?: {
      supported: boolean
      completed: number
      errors: string[]
    }
    projectSheetTransitionProbe?: {
      supported: boolean
      calls: number
      ready: TransitionSample[]
      errors: string[]
    }
  }
}

test.describe('Project sheet', () => {
  test('cards provide distinct Details and GitHub actions without nested interactive elements', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/open-source')
    await expect(page.getByTestId('project-gallery').locator('article')).toHaveCount(5)
    await expect(page.getByRole('dialog')).toHaveCount(0)
    for (const project of githubProjects) {
      const card = page.getByTestId(`project-${project.name}`)
      await expect(
        card.getByRole('heading', { name: project.name, exact: true, level: 2 }),
      ).toBeVisible()
      const action = card.getByRole('button', { name: `Details for ${project.name}`, exact: true })
      await expect(action).toContainText('Details')
      await expect(action).toBeEnabled()
      const github = card.getByRole('link', {
        name: `GitHub repository for ${project.name}`,
        exact: true,
      })
      await expectGitHubAvailability(github, project)
      if (project.status === 'Coming Soon') {
        await expectNoActivation(page, github)
        await expect(page.getByRole('dialog')).toHaveCount(0)
      } else {
        await expect(github).toHaveAttribute('target', '_blank')
        await expect(github).toHaveAttribute('rel', /noopener/)
      }
      await expect(card.locator('a a, a button, button a, button button')).toHaveCount(0)
      expect(await card.evaluate((node) => node.tagName)).toBe('ARTICLE')
    }
  })

  for (const project of githubProjects) {
    test(`${project.name} exact query opens its labeled sheet and direct Close preserves the URL context`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/open-source?view=all&project=${project.name}#projects`)
      const dialog = sheet(page, project.name)
      await expect(dialog).toBeVisible()
      await expect(dialog).toHaveAttribute('aria-modal', 'true')
      await expect(dialog.getByRole('heading', { name: project.name, exact: true })).toHaveCount(1)
      await expect(dialog).toContainText(project.description)
      await expect(dialog).toContainText(project.status)
      const github = dialog.getByRole('link', { name: 'View on GitHub', exact: true })
      await expectGitHubAvailability(github, project)
      expect(await dialog.evaluate((node) => node.closest('main') === null)).toBe(true)
      await expectFocusedWithin(dialog)
      const close = dialog.getByRole('button', { name: 'Close', exact: true })
      if (project.status === 'Coming Soon') {
        await expectNoActivation(page, github)
        await expect(dialog).toBeVisible()
        await close.focus()
        await page.keyboard.press('Tab')
        await expect(close).toBeFocused()
        await page.keyboard.press('Shift+Tab')
        await expect(close).toBeFocused()
        await expect(github).not.toBeFocused()
      }
      await close.click()
      await expectClosed(page)
      await expect(page).toHaveURL(
        (url) => url.searchParams.get('view') === 'all' && url.hash === '#projects',
      )
      await expect(details(page, project.name)).toBeFocused()
    })
  }

  test('keyboard focus stays in the portal and Escape and Close restore the current Details control', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/open-source')
    await details(page).focus()
    await page.keyboard.press('Enter')
    const dialog = sheet(page)
    await expect(dialog).toBeVisible()
    await expectFocusedWithin(dialog)
    for (const key of ['Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
      await page.keyboard.press(key)
      await expectFocusedWithin(dialog)
    }
    await page.keyboard.press('Escape')
    await expectClosed(page)
    await expect(details(page)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Close', exact: true }).click()
    await expectClosed(page)
    await expect(details(page)).toBeFocused()
  })

  test('invalid and repeated queries are replaced without losing unrelated search or hash values', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const value of [
      'project=',
      'project=not-a-project',
      `project=${first.name}&project=${githubProjects[1].name}`,
    ]) {
      await page.goto(`/open-source?sort=recent&${value}&tag=nextjs#projects`)
      await expectClosed(page)
      await expect(page).toHaveURL(
        (url) =>
          url.searchParams.get('sort') === 'recent' &&
          url.searchParams.get('tag') === 'nextjs' &&
          url.hash === '#projects',
      )
      await expect(page.getByTestId('project-gallery').locator('article')).toHaveCount(5)
    }
    await page.goto('/open-source?sort=recent#projects')
    await expectClosed(page)
    await expect(page).toHaveURL(
      (url) => url.searchParams.get('sort') === 'recent' && url.hash === '#projects',
    )
  })

  test('Back and Forward restore sheet state while direct-entry Close replaces rather than leaving the page', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/experience')
    await page.getByTestId('nav-link-open-source').click()
    await openFirst(page)
    await page.goBack()
    await expectClosed(page)
    await expect(details(page)).toBeFocused()
    await page.goForward()
    await expect(sheet(page)).toBeVisible()
    await sheet(page).getByRole('button', { name: 'Close', exact: true }).click()
    await expectClosed(page)
    await page.goBack()
    await expect(page).toHaveURL(/\/experience$/)
    await expect(page.getByRole('dialog')).toHaveCount(0)

    await page.goto(`/open-source?project=${first.name}`)
    await expect(sheet(page)).toBeVisible()
    await sheet(page).getByRole('button', { name: 'Close', exact: true }).click()
    await expectClosed(page)
    await expect(details(page)).toBeFocused()
    await page.goBack()
    await expect(page).toHaveURL(/\/experience$/)
  })

  test('rapid activation and close/reopen/navigation during motion leave no duplicate history or modal state', async ({
    page,
  }, testInfo) => {
    const pageErrors: string[] = []
    const consoleErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/experience')
    await page.getByTestId('nav-link-open-source').click()
    await expect(details(page)).toBeEnabled()
    await details(page).evaluate((node) => {
      ;(node as HTMLButtonElement).click()
      ;(node as HTMLButtonElement).click()
    })
    await expect(sheet(page)).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(1)
    expect(new URL(page.url()).searchParams.getAll('project')).toEqual([first.name])
    await sheet(page)
      .getByRole('button', { name: 'Close', exact: true })
      .evaluate((node) => {
        ;(node as HTMLButtonElement).click()
        ;(node as HTMLButtonElement).click()
      })
    await expectClosed(page)
    // Reopen as soon as the closing route is committed, without waiting for the morph to finish.
    await details(page).evaluate((node) => (node as HTMLButtonElement).click())
    await expect(sheet(page)).toBeVisible()
    // A route change can also supersede an opening morph (for example, browser navigation).
    await page
      .getByTestId('nav-link-experience')
      .evaluate((node) => (node as HTMLAnchorElement).click())
    await expect(page).toHaveURL(/\/experience$/)
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.locator('main')).not.toHaveAttribute('aria-hidden', 'true')
    expect(await page.locator('body').evaluate((node) => getComputedStyle(node).overflow)).not.toBe(
      'hidden',
    )
    await page.goBack()
    await expect(sheet(page)).toBeVisible()
    await sheet(page).getByRole('button', { name: 'Close', exact: true }).click()
    await expectClosed(page)
    await page.goBack()
    await expect(page).toHaveURL(/\/experience$/)
    await testInfo.attach('project-sheet-runtime-errors', {
      body: JSON.stringify({ pageErrors, consoleErrors }, null, 2),
      contentType: 'application/json',
    })
    expect(pageErrors).toEqual([])
  })

  test('reduced motion and coarse touch keep the card static and the sheet Close target usable', async ({
    page,
    isMobile,
  }) => {
    if (isMobile) {
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.goto('/open-source')
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true)
      const card = page.getByTestId(`project-${first.name}`)
      await card.scrollIntoViewIfNeeded()
      await card.dispatchEvent('pointermove', {
        pointerType: 'touch',
        clientX: 10,
        clientY: 10,
        buttons: 0,
      })
      await expect(card).toHaveCSS('transform', 'none')
      await expect(card.locator('[data-card-glare]')).toHaveCSS('opacity', '0')
      for (const layer of ['art', 'text', 'tags']) {
        await expect(card.locator(`[data-card-${layer}]`)).toHaveCSS('transform', 'none')
      }
      await details(page).tap()
      await expect(sheet(page)).toBeVisible()
      await sheet(page).getByRole('button', { name: 'Close', exact: true }).tap()
      await expectClosed(page)
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/open-source')
    const dialog = await openFirst(page)
    await expect
      .poll(() =>
        dialog.evaluate(
          (node) =>
            node
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === 'running').length,
        ),
      )
      .toBe(0)
    const close = dialog.getByRole('button', { name: 'Close', exact: true })
    const bounds = (await close.boundingBox())!
    expect(bounds.width).toBeGreaterThanOrEqual(44)
    expect(bounds.height).toBeGreaterThanOrEqual(44)
    const overflow = await dialog.evaluate((node) => {
      const bounds = node.getBoundingClientRect()
      return Math.max(-bounds.left, bounds.right - innerWidth)
    })
    expect(overflow).toBeLessThanOrEqual(1)
    if (isMobile) await close.tap()
    else await close.click()
    await expectClosed(page)
    await expect(details(page)).toBeFocused()
    expect(await page.locator('body').evaluate((node) => getComputedStyle(node).overflow)).not.toBe(
      'hidden',
    )
  })

  test('natural opening keeps the focused Close and keyboard actions fully visible in a short viewport', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 480 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.addInitScript(() => {
      const native = document.startViewTransition?.bind(document)
      const probe = (window.projectSheetFocusProbe = {
        supported: Boolean(native),
        completed: 0,
        errors: [] as string[],
      })
      if (!native) return
      document.startViewTransition = (options) => {
        const transition = native(options)
        transition.finished
          .then(async () => {
            await new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            )
            if (document.querySelector('[data-testid="project-sheet"]')) probe.completed++
          })
          .catch((error: unknown) => probe.errors.push(String(error)))
        return transition
      }
    })
    await page.goto('/open-source')
    const dialog = await openFirst(page)
    if (await page.evaluate(() => window.projectSheetFocusProbe!.supported)) {
      await expect
        .poll(() => page.evaluate(() => window.projectSheetFocusProbe!.completed))
        .toBeGreaterThan(0)
    } else {
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      )
    }
    expect(await page.evaluate(() => window.projectSheetFocusProbe!.errors)).toEqual([])
    const expectFocusedAndUnclipped = async (control: Locator) => {
      await expect(control).toBeFocused()
      await expect
        .poll(() =>
          control.evaluate((node) => {
            const bounds = node.getBoundingClientRect()
            return (
              bounds.top >= -1 &&
              bounds.bottom <= innerHeight + 1 &&
              bounds.left >= -1 &&
              bounds.right <= innerWidth + 1
            )
          }),
        )
        .toBe(true)
    }
    const close = dialog.getByRole('button', { name: 'Close', exact: true })
    await expectFocusedAndUnclipped(close)
    await page.keyboard.press('Shift+Tab')
    await expectFocusedAndUnclipped(
      dialog.getByRole('link', { name: 'View on GitHub', exact: true }),
    )
    await page.keyboard.press('Tab')
    await expectFocusedAndUnclipped(close)
    await page.keyboard.press('Escape')
    await expectClosed(page)
    await expect(details(page)).toBeFocused()
  })

  test('reduced transparency makes the sheet surround opaque without losing readable content or Close', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== 'chromium',
      'Chromium CDP emulates prefers-reduced-transparency; the other runtimes cannot emulate this preference',
    )
    const session = await page.context().newCDPSession(page)
    try {
      for (const colorScheme of ['light', 'dark'] as const) {
        await session.send('Emulation.setEmulatedMedia', {
          features: [
            { name: 'prefers-color-scheme', value: colorScheme },
            { name: 'prefers-reduced-transparency', value: 'reduce' },
            { name: 'prefers-reduced-motion', value: 'reduce' },
          ],
        })
        await page.goto('/open-source')
        expect(
          await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches),
        ).toBe(true)
        const dialog = await openFirst(page)
        const appearance = await dialog.evaluate((node) => {
          const modal = node.closest('.MuiModal-root')!
          const modalStyle = getComputedStyle(modal)
          const contentStyle = getComputedStyle(node.querySelector('p')!)
          const sheetStyle = getComputedStyle(node)
          const luminance = (color: string) => {
            const channels = color
              .match(/[\d.]+/g)!
              .slice(0, 3)
              .map(Number)
              .map((channel) => {
                const value = channel / 255
                return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
              })
            return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
          }
          const text = luminance(contentStyle.color)
          const fill = luminance(sheetStyle.backgroundColor)
          return {
            background: modalStyle.backgroundColor,
            image: modalStyle.backgroundImage,
            opacity: modalStyle.opacity,
            blur: modalStyle.backdropFilter,
            webkitBlur: modalStyle.getPropertyValue('-webkit-backdrop-filter'),
            contrast: (Math.max(text, fill) + 0.05) / (Math.min(text, fill) + 0.05),
          }
        })
        expect(appearance.background).toMatch(/^rgb\(/)
        expect(appearance.image).toBe('none')
        expect(appearance.opacity).toBe('1')
        expect(appearance.blur).toBe('none')
        if (appearance.webkitBlur) expect(appearance.webkitBlur).toBe('none')
        expect(appearance.contrast).toBeGreaterThanOrEqual(4.5)
        await expect(dialog.getByRole('heading', { name: first.name, exact: true })).toBeVisible()
        await expect(dialog).toContainText(first.description)
        const close = dialog.getByRole('button', { name: 'Close', exact: true })
        await expect(close).toBeEnabled()
        await close.click()
        await expectClosed(page)
        await expect(details(page)).toBeFocused()
      }
    } finally {
      await session.detach()
    }
  })

  test('server HTML preserves project content and status-aware GitHub actions without JavaScript', async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      reducedMotion: 'reduce',
    })
    try {
      const page = await context.newPage()
      await page.goto(`/open-source?project=${first.name}`)
      for (const project of githubProjects) {
        const card = page.getByTestId(`project-${project.name}`)
        await expect(card.getByRole('heading', { name: project.name, exact: true })).toBeVisible()
        await expect(card).toContainText(project.description)
        await expect(card).toContainText(project.status)
        await expectGitHubAvailability(
          card.getByRole('link', { name: `GitHub repository for ${project.name}`, exact: true }),
          project,
        )
        expect(
          await card.evaluate((node) => {
            for (let ancestor: Element | null = node; ancestor; ancestor = ancestor.parentElement) {
              const style = getComputedStyle(ancestor)
              if (
                Number(style.opacity) === 0 ||
                style.display === 'none' ||
                style.visibility === 'hidden'
              )
                return false
            }
            return true
          }),
        ).toBe(true)
      }
    } finally {
      await context.close()
    }
  })

  test('the real native View Transition morphs the selected project without fading the page', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const native = document.startViewTransition?.bind(document)
      const probe = (window.projectSheetTransitionProbe = {
        supported: Boolean(native),
        calls: 0,
        ready: [] as TransitionSample[],
        errors: [] as string[],
      })
      if (!native) return
      document.startViewTransition = (options) => {
        probe.calls++
        const transition = native(options)
        transition.ready
          .then(() => {
            const animations = document.getAnimations().flatMap((animation) => {
              const effect = animation.effect
              if (
                !(effect instanceof KeyframeEffect) ||
                !effect.pseudoElement?.startsWith('::view-transition')
              )
                return []
              const opacity = effect
                .getKeyframes()
                .flatMap((frame) => (frame.opacity === undefined ? [] : [String(frame.opacity)]))
              return [{ pseudo: effect.pseudoElement, fades: new Set(opacity).size > 1 }]
            })
            probe.ready.push({
              pseudos: animations.map(({ pseudo }) => pseudo),
              fading: animations
                .filter(({ pseudo, fades }) => fades && !pseudo.includes('today-'))
                .map(({ pseudo }) => pseudo),
              mainOpacity: getComputedStyle(document.querySelector('main')!).opacity,
              portalOutsideMain:
                document.querySelector('[role="dialog"]')?.closest('main') === null,
              headerZIndex: getComputedStyle(
                document.documentElement,
                '::view-transition-group(site-header)',
              ).zIndex,
              projectZIndex: getComputedStyle(
                document.documentElement,
                '::view-transition-group(today-project-structures)',
              ).zIndex,
            })
          })
          .catch((error: unknown) => probe.errors.push(String(error)))
        return transition
      }
    })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/open-source')
    test.skip(
      !(await page.evaluate(() => window.projectSheetTransitionProbe?.supported)),
      'runtime has no native View Transition API; other journeys cover the static fallback',
    )
    await openFirst(page)
    await expect
      .poll(() =>
        page.evaluate(
          (name) =>
            window.projectSheetTransitionProbe!.ready.filter((sample) =>
              sample.pseudos.some((pseudo) => pseudo.includes(`today-${name}`)),
            ).length,
          first.name,
        ),
      )
      .toBeGreaterThan(0)
    const probe = await page.evaluate(() => window.projectSheetTransitionProbe!)
    expect(probe.calls).toBeGreaterThan(0)
    expect(probe.errors).toEqual([])
    for (const sample of probe.ready) {
      expect(sample.fading).toEqual([])
      expect(sample.mainOpacity).toBe('1')
      expect(sample.portalOutsideMain).toBe(true)
      const headerLayer = sample.headerZIndex === 'auto' ? 0 : Number(sample.headerZIndex)
      const projectLayer = sample.projectZIndex === 'auto' ? 0 : Number(sample.projectZIndex)
      expect(projectLayer).toBeGreaterThan(headerLayer)
    }
    await sheet(page).getByRole('button', { name: 'Close', exact: true }).click()
    await expectClosed(page)
    await expect(details(page)).toBeFocused()
  })

  test('captures the project sheet at desktop and phone sizes in both schemes for review', async ({
    page,
  }, testInfo) => {
    test.skip(
      !['Desktop Chrome', 'Mobile Safari'].includes(testInfo.project.name),
      'four ordinary viewport attachments; stored snapshots stay unchanged',
    )
    const width = testInfo.project.name === 'Desktop Chrome' ? 1280 : 390
    await page.setViewportSize({ width, height: width === 1280 ? 900 : 844 })
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
      await page.goto('/open-source')
      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${colorScheme}\\b`))
      await openFirst(page)
      await page.evaluate(() => document.fonts.ready)
      const name = `project-sheet-${width}-${colorScheme}.png`
      const path = testInfo.outputPath(name)
      await page.screenshot({ path, animations: 'disabled' })
      await testInfo.attach(name, { path, contentType: 'image/png' })
      await sheet(page).getByRole('button', { name: 'Close', exact: true }).click()
      await expectClosed(page)
    }
  })
})
