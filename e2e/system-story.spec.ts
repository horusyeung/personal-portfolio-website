import { expect, test, type Locator, type Page } from '@playwright/test'

const title = 'Building products that scale.'
const copy =
  'Designed a microservice architecture from scratch. Lead a distributed team of 5 engineers while coding daily, managing cross-timezone sprints, coding standards and CI/CD pipelines. Use AI-augmented development workflows to speed up delivery and raise code quality.'
const brandColors: Record<string, string> = {
  'React.js': 'rgb(97, 218, 251)',
  'React Native': 'rgb(97, 218, 251)',
  'Node.js': 'rgb(95, 160, 78)',
  'Nest.js': 'rgb(224, 35, 78)',
  RabbitMQ: 'rgb(255, 102, 0)',
  PostgreSQL: 'rgb(65, 105, 225)',
  Redis: 'rgb(255, 68, 56)',
  TypeScript: 'rgb(49, 120, 198)',
  Vitest: 'rgb(110, 159, 24)',
  Docker: 'rgb(36, 150, 237)',
  Playwright: 'rgb(46, 173, 51)',
  'GitHub Actions': 'rgb(32, 136, 255)',
  AWS: 'rgb(255, 153, 0)',
  'Claude Code': 'rgb(217, 119, 87)',
  CodeRabbit: 'rgb(255, 87, 10)',
  Jira: 'rgb(0, 82, 204)',
  Grafana: 'rgb(244, 104, 0)',
  Kibana: 'rgb(0, 85, 113)',
  Slack: 'rgb(74, 21, 75)',
}
const darkBrandColors: Record<string, string> = { Slack: 'rgb(255, 255, 255)' }

const pipelineEdges = [
  'step1>step2:workflow',
  'step2>step3:workflow',
  'step3>step4:workflow',
  'step4>step5:workflow',
  'step5>step6:workflow',
] as const

// Independent acceptance examples: do not import the renderer's architecture model.
const scenarios = {
  web: {
    label: 'Web app',
    nodes: [
      { id: 'web', title: 'Web app', brands: ['React.js', 'Next.js'] },
      { id: 'api', title: 'API', brands: ['Nest.js', 'Node.js'] },
      { id: 'data', title: 'Database', brands: ['PostgreSQL'] },
      { id: 'cache', title: 'Cache', brands: ['Redis'] },
    ],
    edges: ['web>api:request', 'api>data:data', 'api>cache:cache'],
    flows: ['web>api:request', 'api>data:request', 'data>api:response', 'api>web:response'],
  },
  mobile: {
    label: 'Mobile app',
    nodes: [
      { id: 'mobile', title: 'Mobile app', brands: ['React Native'] },
      { id: 'api', title: 'API', brands: ['Nest.js', 'Node.js'] },
      { id: 'data', title: 'Database', brands: ['PostgreSQL'] },
      { id: 'cache', title: 'Cache', brands: ['Redis'] },
    ],
    edges: ['mobile>api:request', 'api>data:data', 'api>cache:cache'],
    flows: ['mobile>api:request', 'api>data:request', 'data>api:response', 'api>mobile:response'],
  },
  microservices: {
    label: 'Microservices',
    nodes: [
      { id: 'gateway', title: 'API gateway', brands: ['Nest.js'] },
      { id: 'orders', title: 'Orders service', brands: ['Nest.js'] },
      { id: 'catalog', title: 'Catalog service', brands: ['Node.js'] },
      { id: 'data', title: 'Orders data', brands: ['PostgreSQL'] },
      { id: 'queue', title: 'Message queue', brands: ['RabbitMQ'] },
      { id: 'notifications', title: 'Notifications', brands: ['Node.js'] },
    ],
    edges: [
      'gateway>orders:request',
      'gateway>catalog:request',
      'orders>data:data',
      'orders>queue:event',
      'queue>notifications:event',
    ],
    flows: [
      'gateway>orders:request',
      'gateway>catalog:request',
      'orders>data:request',
      'data>orders:response',
      'orders>gateway:response',
      'catalog>gateway:response',
      'orders>queue:event',
      'queue>notifications:event',
    ],
  },
  delivery: {
    label: 'CI/CD',
    nodes: [
      { id: 'step1', title: 'Local commit', brands: ['Husky'] },
      { id: 'step2', title: 'Pull request', brands: ['GitHub'] },
      { id: 'step3', title: 'CI checks', brands: ['GitHub Actions'] },
      { id: 'step4', title: 'Build & preview', brands: ['Docker'] },
      { id: 'step5', title: 'Smoke & E2E', brands: ['Playwright'] },
      { id: 'step6', title: 'Approve & deploy', brands: ['AWS'] },
    ],
    edges: pipelineEdges,
    flows: pipelineEdges,
  },
  'ai-dev': {
    label: 'AI development',
    nodes: [
      { id: 'step1', title: 'Slack intake', brands: ['Slack'] },
      { id: 'step2', title: 'Jira ticket', brands: ['Jira'] },
      { id: 'step3', title: 'AI review', brands: [] },
      { id: 'step4', title: 'Agentic work', brands: [] },
      { id: 'step5', title: 'Verify changes', brands: ['Vitest', 'Playwright'] },
      { id: 'step6', title: 'Create PR', brands: ['GitHub', 'CodeRabbit'] },
    ],
    edges: pipelineEdges,
    flows: pipelineEdges,
  },
  'ai-triage': {
    label: 'AI bug triage',
    nodes: [
      { id: 'step1', title: 'Slack bug', brands: ['Slack'] },
      { id: 'step2', title: 'Jira issue', brands: ['Jira'] },
      { id: 'step3', title: 'AI review', brands: [] },
      { id: 'step4', title: 'Agentic repair', brands: [] },
      { id: 'step5', title: 'Verify repair', brands: ['Vitest', 'Playwright'] },
      { id: 'step6', title: 'Create PR', brands: ['GitHub', 'CodeRabbit'] },
    ],
    edges: pipelineEdges,
    flows: pipelineEdges,
  },
} as const
type Scenario = keyof typeof scenarios
const scenarioOrder = ['microservices', 'web', 'mobile', 'delivery', 'ai-dev', 'ai-triage'] as const

function panel(story: Locator, scenario: Scenario = 'microservices') {
  return story.locator(`[data-system-scenario=${scenario}]`)
}

function choice(story: Locator, scenario: Scenario) {
  return story
    .getByRole('group', { name: 'Architecture scenario', exact: true })
    .getByRole('radio', { name: scenarios[scenario].label, exact: true })
}

test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== origin || url.pathname === '/api/contact') return route.abort()
    return route.continue()
  })
})

async function paint(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}

function opacity(locator: Locator) {
  return locator.evaluate((node) => {
    let value = 1
    for (let element: Element | null = node; element; element = element.parentElement)
      value *= Number(getComputedStyle(element).opacity)
    return value
  })
}

async function readableAbout(page: Page) {
  const heading = page.getByRole('heading', { name: title, exact: true, level: 2 })
  await expect(heading).toHaveText(title)
  await expect(page.getByTestId('about-copy')).toHaveText(copy)
  expect(await opacity(heading)).toBeGreaterThan(0.99)
  for (const word of await heading.locator('[data-heading-word]').all())
    expect(await opacity(word)).toBeGreaterThan(0.99)
  expect(await opacity(page.getByTestId('about-copy'))).toBeGreaterThan(0.99)
}

async function completeStory(story: Locator, scenario: Scenario = 'microservices') {
  const active = panel(story, scenario)
  await expect(choice(story, scenario)).toBeChecked()
  await expect(active).toBeVisible()
  for (const other of Object.keys(scenarios) as Scenario[])
    if (other !== scenario) await expect(panel(story, other)).toBeHidden()
  await expect(active.locator('[data-system-group]')).toHaveCount(scenarios[scenario].nodes.length)
  for (const expected of scenarios[scenario].nodes) {
    const node = active.locator(`[data-system-group=${expected.id}]`)
    await expect(
      node.getByRole('heading', { name: expected.title, exact: true, level: 3 }),
    ).toBeVisible()
    for (const name of expected.brands)
      await expect(node.getByText(name, { exact: true })).toBeVisible()
  }
  if (scenario === 'mobile') {
    await expect(active).toContainText('SwiftUI')
    await expect(active).toContainText('Kotlin')
    await expect(active).toContainText(/alternatives/i)
  }
  if (scenario === 'microservices') {
    await expect(active.locator('[data-system-group=orders]')).toContainText(
      'Producer · owns orders',
    )
    await expect(active.locator('[data-system-group=catalog]')).toContainText('Owns catalog data')
    await expect(active.locator('[data-system-group=notifications]')).toContainText(
      'Consumer · sends updates',
    )
  }
  const description = active.locator(':scope > p')
  const workflow = scenario === 'delivery' || scenario === 'ai-dev' || scenario === 'ai-triage'
  if (workflow) {
    // These stages are the owner's ordered workflow, independent of layout/model IDs.
    await expect(active.locator('[data-system-group] h3')).toHaveText(
      scenarios[scenario].nodes.map((node) => node.title),
    )
    for (const expected of scenarios[scenario].nodes)
      await expect(
        active.locator(`[data-system-group=${expected.id}] [data-system-skill]`),
      ).toHaveCount(expected.brands.length)
    const checkpoints = active.getByRole('region', { name: 'Testing checkpoints', exact: true })
    await expect(checkpoints).toBeVisible()
    await expect(checkpoints.locator('dt')).toHaveText(['Integration', 'Regression', 'Smoke'])
    const definition = (term: string) =>
      checkpoints
        .locator('dt')
        .filter({ hasText: new RegExp(`^${term}$`) })
        .locator('..')
        .locator('dd')
    for (const term of ['Integration', 'Regression', 'Smoke'])
      await expect(definition(term)).toBeVisible()
    await expect(definition('Integration')).toContainText(/API/i)
    await expect(definition('Integration')).toContainText(/database/i)
    await expect(definition('Integration')).toContainText(/service.*boundar.*together/i)
    if (scenario === 'ai-triage') {
      await expect(definition('Regression')).toContainText(/before.*fix/i)
      await expect(definition('Regression')).toContainText(/test.*passes.*after/i)
    } else {
      await expect(definition('Regression')).toContainText(/rerun.*tests/i)
      await expect(definition('Regression')).toContainText(/broken behavior/i)
    }
    await expect(definition('Smoke')).toContainText(/critical journeys/i)
    await expect(definition('Smoke')).toContainText(/preview/i)
    if (scenario === 'delivery')
      await expect(definition('Smoke')).toContainText(/after deployment/i)
  }
  if (scenario === 'delivery') {
    await expect(description).toContainText(/failed checks block deployment/i)
    await expect(description).toContainText(/Husky runs local pre-commit checks/i)
    await expect(description).toContainText(/CI reruns/i)
    await expect(description).toContainText(/remote/i)
  }
  if (scenario === 'ai-dev' || scenario === 'ai-triage') {
    const tooling = active.getByRole('group', { name: 'Agent tooling', exact: true })
    await expect(tooling).toBeVisible()
    await expect(tooling.getByText('Agent tooling', { exact: true })).toBeVisible()
    await expect(tooling.locator('[data-system-skill]')).toHaveCount(3)
    for (const tool of ['Codex', 'Claude Code', 'Cursor'])
      await expect(tooling.getByText(tool, { exact: true })).toBeVisible()
    await expect(description).toContainText(/agent/i)
    await expect(description).toContainText(/iterat/i)
  }
  if (scenario === 'ai-dev') {
    await expect(description).toContainText(/engineer/i)
    await expect(description).toContainText(/review|verif/i)
  }
  if (scenario === 'ai-triage') {
    await expect(description).toContainText(/engineer/i)
    await expect(description).toContainText(/reproduc/i)
  }
  const rendered = await active.evaluate((node) => {
    const distance = (point: DOMPoint, rect: DOMRect) =>
      Math.hypot(
        Math.max(rect.left - point.x, 0, point.x - rect.right),
        Math.max(rect.top - point.y, 0, point.y - rect.bottom),
      )
    return [...node.querySelectorAll<SVGPathElement>('[data-system-edge]')]
      .filter((edge) => {
        const svg = edge.ownerSVGElement!
        const rect = svg.getBoundingClientRect()
        return getComputedStyle(svg).display !== 'none' && rect.width > 0 && rect.height > 0
      })
      .map((edge) => {
        const from = node
          .querySelector(`[data-system-group=${edge.dataset.from}]`)!
          .getBoundingClientRect()
        const to = node
          .querySelector(`[data-system-group=${edge.dataset.to}]`)!
          .getBoundingClientRect()
        const matrix = edge.getScreenCTM()!
        const first = edge.getPointAtLength(0).matrixTransform(matrix)
        const last = edge.getPointAtLength(edge.getTotalLength()).matrixTransform(matrix)
        return {
          key: `${edge.dataset.from}>${edge.dataset.to}:${edge.dataset.kind}`,
          length: edge.getTotalLength(),
          marker: getComputedStyle(edge).markerEnd,
          startsAtSource: distance(first, from) < distance(first, to),
          endsAtTarget: distance(last, to) < distance(last, from),
        }
      })
  })
  expect(rendered.map((edge) => edge.key).sort()).toEqual([...scenarios[scenario].edges].sort())
  for (const edge of rendered) {
    expect(edge.length).toBeGreaterThan(0)
    expect(edge.marker).not.toBe('none')
    expect(edge.startsAtSource, `${edge.key} starts at its source`).toBe(true)
    expect(edge.endsAtTarget, `${edge.key} points to its target`).toBe(true)
  }
  for (const group of await active.locator('[data-system-group]').all()) {
    expect(await opacity(group)).toBeGreaterThan(0.99)
    expect(await group.evaluate((node) => getComputedStyle(node).transform)).toBe('none')
  }
  await expect(story.locator('[data-system-packet]')).toHaveCount(0)
  expect(
    await story.evaluate(
      (node) =>
        node
          .getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length,
    ),
  ).toBe(0)
}

async function home(page: Page, controlledEntrance = false) {
  await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'light' })
  if (controlledEntrance) {
    // Keep the existing slow-hydration fallback separate from actual entrance coverage.
    // Only cold startup is controlled; all sampled movement uses real browser frames.
    await page.clock.install({ time: new Date('2026-10-07T12:00:00Z') })
    await page.clock.pauseAt(new Date('2026-10-07T12:01:00Z'))
  }
  await page.goto('/')
  await expect(page.getByRole('button', { name: /^Switch to (light|dark) theme$/ })).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  if (controlledEntrance) {
    await expect(page.locator('html')).not.toHaveClass(/intro-skip/)
    await expect(page.getByTestId('about-heading')).toHaveAttribute('data-motion-phase', 'pending')
    await page.clock.resume()
  }
}

async function enter(locator: Locator, fraction = 0.25) {
  await locator.evaluate(
    (node, top) =>
      window.scrollTo({
        top: node.getBoundingClientRect().top + scrollY - innerHeight * top,
        behavior: 'instant',
      }),
    fraction,
  )
}

async function settled(story: Locator, count: number, scenario: Scenario = 'microservices') {
  await expect(story).toHaveAttribute('data-phase', 'settled', { timeout: 5_000 })
  await expect(story).toHaveAttribute('data-play-count', String(count))
  await completeStory(story, scenario)
}

async function autoStory(page: Page) {
  const story = page.getByTestId('system-story')
  await enter(story, 0.2)
  await expect(story).toHaveAttribute('data-ready', 'true')
  await settled(story, 1)
  return story
}

function geometry(locator: Locator) {
  return locator.evaluate((node) => {
    const { x, y, width, height } = node.getBoundingClientRect()
    return { x, y, width, height }
  })
}

async function stable(locator: Locator, reference: Awaited<ReturnType<typeof geometry>>) {
  const actual = await geometry(locator)
  for (const key of ['x', 'y', 'width', 'height'] as const)
    expect(actual[key], `Replay ${key} remains stable`).toBeCloseTo(reference[key], 1)
}

async function keyboardFocus(page: Page, target: Locator, key: 'Tab' | 'Shift+Tab') {
  // Observe each native focus scroll separately. Reversing Tab while the first
  // smooth scroll is still running can leave the returned target offscreen.
  const probe = await target.evaluateHandle((node) => {
    let cancel = () => {}
    const ready = new Promise<{ settled: boolean; scrolls: number; ends: number }>((resolve) => {
      let frame = 0
      let finished = false
      let scrolling = false
      let scrolls = 0
      let ends = 0
      let stableFrames = 0
      let previous = ''
      const supportsEnd = 'onscrollend' in document
      const scroll = () => {
        scrolls++
        scrolling = true
      }
      const end = () => {
        ends++
        scrolling = false
      }
      const finish = (settled: boolean) => {
        if (finished) return
        finished = true
        clearTimeout(deadline)
        cancelAnimationFrame(frame)
        document.removeEventListener('scroll', scroll)
        document.removeEventListener('scrollend', end)
        resolve({ settled, scrolls, ends })
      }
      const deadline = setTimeout(() => finish(false), 5_000)
      const sample = () => {
        const rect = node.getBoundingClientRect()
        const current = [scrollY, rect.x, rect.y, rect.width, rect.height].join('|')
        stableFrames = current === previous ? stableFrames + 1 : 0
        previous = current
        const visible =
          rect.top >= 0 && rect.bottom <= innerHeight && rect.left >= 0 && rect.right <= innerWidth
        const ended = !supportsEnd || !scrolls || (!scrolling && ends > 0)
        if (document.activeElement === node && visible && stableFrames >= 4 && ended) finish(true)
        else frame = requestAnimationFrame(sample)
      }
      document.addEventListener('scroll', scroll, { passive: true })
      document.addEventListener('scrollend', end)
      frame = requestAnimationFrame(sample)
      cancel = () => finish(false)
    })
    return { ready, cancel: () => cancel() }
  })
  try {
    await page.keyboard.press(key)
    await expect(target).toBeFocused()
    const result = await probe.evaluate((value) => value.ready)
    expect(result.settled, `${key} native focus scrolling finishes before the next action`).toBe(
      true,
    )
    await expect(target).toBeInViewport({ ratio: 1 })
  } finally {
    await probe.evaluate((value) => value.cancel())
    await probe.dispose()
  }
}

test.describe('server-readable About story', () => {
  test.use({ javaScriptEnabled: false })

  test('exact About copy and complete technology flow are readable without JavaScript', async ({
    page,
  }) => {
    const response = await page.goto('/')
    expect(response?.ok()).toBe(true)
    await readableAbout(page)
    const story = page.getByTestId('system-story')
    await story.scrollIntoViewIfNeeded()
    await expect(story.locator('[data-system-scenario]')).toHaveCount(6)
    const radios = story
      .getByRole('group', { name: 'Architecture scenario', exact: true })
      .getByRole('radio')
    await expect(radios).toHaveCount(6)
    for (const [index, name] of [
      'Web app',
      'Mobile app',
      'Microservices',
      'CI/CD',
      'AI development',
      'AI bug triage',
    ].entries())
      await expect(radios.nth(index)).toHaveAccessibleName(name)
    await expect(choice(story, 'microservices')).toBeChecked()
    for (const scenario of scenarioOrder) {
      const radio = choice(story, scenario)
      // Center the actual control: centering a tall figure can leave its first
      // row underneath the fixed header in the no-JavaScript WebKit viewport.
      await enter(radio, 0.5)
      await expect(radio).toBeInViewport({ ratio: 1 })
      await expect
        .poll(() =>
          radio.evaluate((node) => {
            const rect = node.getBoundingClientRect()
            return (
              document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2) === node
            )
          }),
        )
        .toBe(true)
      await radio.check()
      await completeStory(story, scenario)
    }
    await expect(
      story.getByRole('button', { name: 'Replay system story', exact: true }),
    ).toBeDisabled()
    await expect(story).toHaveAttribute('data-play-count', '0')
    await expect(story).toHaveAttribute('data-ready', 'false')
  })
})

test('320px reduced-motion light and dark layouts preserve brands and native touch scrolling', async ({
  page,
  isMobile,
}) => {
  test.setTimeout(60_000)
  await page.setViewportSize({ width: 320, height: 800 })
  for (const theme of ['light', 'dark'] as const) {
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme })
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /^Switch to (light|dark) theme$/ })
    await expect(toggle).toBeEnabled()
    await expect(toggle).toHaveAccessibleName(
      `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`,
    )
    await readableAbout(page)
    const story = page.getByTestId('system-story')
    await story.scrollIntoViewIfNeeded()
    await expect(story).toHaveAttribute('data-ready', 'false')
    await expect(story).toHaveAttribute('data-play-count', '0')
    const replay = story.getByRole('button', { name: 'Replay system story', exact: true })
    await expect(replay).toBeDisabled()
    const bounds = await geometry(replay)
    expect(bounds.width).toBeGreaterThanOrEqual(44)
    expect(bounds.height).toBeGreaterThanOrEqual(44)
    for (const scenario of scenarioOrder) {
      await choice(story, scenario).check()
      await completeStory(story, scenario)
      await expect(story).toHaveAttribute('data-play-count', '0')
      const hitArea = await choice(story, scenario).evaluate((node) => {
        const rect = ((node as HTMLInputElement).labels?.[0] ?? node).getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      })
      expect(hitArea.width).toBeGreaterThanOrEqual(44)
      expect(hitArea.height).toBeGreaterThanOrEqual(44)
      const active = panel(story, scenario)
      const layout = await active.evaluate((node) => {
        const groups = [...node.querySelectorAll('[data-system-group]')].map((group) =>
          group.getBoundingClientRect(),
        )
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          overlapping: groups.some((rect, index) =>
            groups
              .slice(index + 1)
              .some(
                (other) =>
                  rect.left < other.right - 1 &&
                  rect.right > other.left + 1 &&
                  rect.top < other.bottom - 1 &&
                  rect.bottom > other.top + 1,
              ),
          ),
          outside: groups.some((rect) => rect.left < -1 || rect.right > innerWidth + 1),
          clippedText: [
            ...node.querySelectorAll(
              '[data-system-group] h3, [data-system-group] [data-system-skill]',
            ),
          ]
            .filter((element) => {
              const card = element.closest('[data-system-group]')!.getBoundingClientRect()
              const range = document.createRange()
              range.selectNodeContents(element)
              const rect = range.getBoundingClientRect()
              return rect.left < card.left - 1 || rect.right > card.right + 1
            })
            .map((element) => element.textContent),
          coarse: matchMedia('(pointer: coarse)').matches,
          touchActions: [
            node,
            ...node.querySelectorAll('[data-system-stage], [data-system-group]'),
          ].map((element) => getComputedStyle(element).touchAction),
        }
      })
      expect(layout.overflow).toBeLessThanOrEqual(1)
      expect(layout.overlapping).toBe(false)
      expect(layout.outside).toBe(false)
      expect(layout.clippedText).toEqual([])
      expect(layout.coarse).toBe(isMobile)
      expect(layout.touchActions.every((action) => action === 'auto')).toBe(true)
      for (const expected of scenarios[scenario].nodes) {
        const card = active.locator(`[data-system-group=${expected.id}]`)
        for (const name of expected.brands) {
          const icon = card.locator('[data-system-skill]').filter({ hasText: name }).locator('svg')
          const color = await icon.evaluate((node) => getComputedStyle(node).color)
          const expectedColor =
            (theme === 'dark' ? darkBrandColors[name] : undefined) ?? brandColors[name]
          if (expectedColor) expect(color, `${theme} ${name} retains its brand`).toBe(expectedColor)
          else
            expect(color).toBe(
              await card
                .getByRole('heading', { name: expected.title, exact: true })
                .evaluate((node) => getComputedStyle(node).color),
            )
        }
      }
      if (scenario === 'ai-dev' || scenario === 'ai-triage') {
        const tooling = active.getByRole('group', { name: 'Agent tooling', exact: true })
        const semanticInk = await active
          .locator('[data-system-group] h3')
          .first()
          .evaluate((node) => getComputedStyle(node).color)
        for (const name of ['Codex', 'Claude Code', 'Cursor']) {
          const icon = tooling
            .locator('[data-system-skill]')
            .filter({ hasText: name })
            .locator('svg')
          const color = await icon.evaluate((node) => getComputedStyle(node).color)
          expect(color, `${theme} ${name} retains its tooling color`).toBe(
            brandColors[name] ?? semanticInk,
          )
        }
      }
    }
    // A constrained CSS layout catches the confirmed word-mask clipping regression.
    // This does not claim to emulate native browser or text zoom.
    await page.evaluate(() => {
      document.documentElement.style.zoom = '2'
    })
    try {
      const clippedWords = await page
        .getByTestId('about-heading')
        .evaluate((heading) =>
          [...heading.querySelectorAll('[data-heading-word]')]
            .filter(
              (word) =>
                word.getBoundingClientRect().width >
                word.parentElement!.getBoundingClientRect().width + 1,
            )
            .map((word) => word.textContent),
        )
      expect(clippedWords, 'constrained word masks preserve complete readable words').toEqual([])
    } finally {
      await page.evaluate(() => {
        document.documentElement.style.zoom = ''
      })
    }
  }
})

test('About words reveal through actual intermediate frames once per route mount', async ({
  page,
}) => {
  await home(page, true)
  const heading = page.getByTestId('about-heading')
  await enter(heading, 0.93)
  await paint(page)
  await expect(heading).toHaveAttribute('data-play-count', '0')
  expect(await opacity(heading.locator('[data-heading-word]').first())).toBeLessThan(0.01)
  const frames = await heading.evaluate(
    (node) =>
      new Promise<{
        intermediate: boolean
        transformed: boolean
        complete: boolean
        samples: number
      }>((resolve) => {
        let intermediate = false
        let transformed = false
        let samples = 0
        let frame = 0
        const finish = (complete: boolean) => {
          clearTimeout(deadline)
          cancelAnimationFrame(frame)
          resolve({ intermediate, transformed, complete, samples })
        }
        const deadline = setTimeout(() => finish(false), 3_000)
        const sample = () => {
          samples++
          const words = [...node.querySelectorAll('[data-heading-word]')].map((word) =>
            getComputedStyle(word),
          )
          intermediate ||= words.some(
            (word) => Number(word.opacity) > 0 && Number(word.opacity) < 0.99,
          )
          transformed ||= words.some(
            (word) => word.transform !== 'none' && word.transform !== 'matrix(1, 0, 0, 1, 0, 0)',
          )
          if ((node as HTMLElement).dataset.motionPhase === 'complete') finish(true)
          else frame = requestAnimationFrame(sample)
        }
        window.scrollTo({
          top: node.getBoundingClientRect().top + scrollY - innerHeight * 0.65,
          behavior: 'instant',
        })
        frame = requestAnimationFrame(sample)
      }),
  )
  expect(frames).toMatchObject({ intermediate: true, transformed: true, complete: true })
  expect(frames.samples).toBeGreaterThan(2)
  await readableAbout(page)
  await expect(heading).toHaveAttribute('data-play-count', '1')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await paint(page)
  await enter(heading, 0.65)
  await paint(page)
  await readableAbout(page)
  await expect(heading).toHaveAttribute('data-play-count', '1')
})

test('each architecture and workflow shows exposed directed paths with finite playback', async ({
  page,
}) => {
  test.setTimeout(90_000)
  await home(page)
  const story = page.getByTestId('system-story')
  let count = 0
  for (const scenario of scenarioOrder) {
    count++
    const probe = await story.evaluateHandle((node, expectedCount) => {
      let cancel = () => {}
      const ready = new Promise<{
        assembly: boolean
        transforms: number
        complete: boolean
        elapsed: number
        flows: { key: string; positions: number; progress: number; kind: string | undefined }[]
      }>((resolve) => {
        let assembly = false
        let started = 0
        let frame = 0
        let done = false
        const transforms = new Set<string>()
        const flows = new Map<
          string,
          { positions: Set<string>; first: number; last: number; kind: string | undefined }
        >()
        const finish = (complete: boolean) => {
          if (done) return
          done = true
          clearTimeout(deadline)
          cancelAnimationFrame(frame)
          resolve({
            assembly,
            transforms: transforms.size,
            complete,
            elapsed: started ? performance.now() - started : 0,
            flows: [...flows].map(([key, value]) => ({
              key,
              positions: value.positions.size,
              progress: value.last - value.first,
              kind: value.kind,
            })),
          })
        }
        const deadline = setTimeout(() => finish(false), 6_000)
        const sample = () => {
          const figure = node as HTMLElement
          const active = [...node.querySelectorAll<HTMLElement>('[data-system-scenario]')].find(
            (item) => getComputedStyle(item).display !== 'none',
          )!
          if (figure.dataset.playCount === String(expectedCount)) {
            if (figure.dataset.phase === 'assembling') {
              started ||= performance.now()
              const groups = [...active.querySelectorAll('[data-system-group]')].map((group) =>
                getComputedStyle(group),
              )
              assembly ||= groups.some(
                (group) => Number(group.opacity) > 0 && Number(group.opacity) < 0.99,
              )
              transforms.add(groups.map((group) => group.transform).join('|'))
            }
            for (const packet of active.querySelectorAll<HTMLElement>('[data-system-packet]')) {
              const rect = packet.getBoundingClientRect()
              const x = rect.x + rect.width / 2
              const y = rect.y + rect.height / 2
              const exposed = document.elementFromPoint(x, y)
              if (
                Number(getComputedStyle(packet).opacity) <= 0.2 ||
                !exposed ||
                exposed.closest('[data-system-group]')
              )
                continue
              const from = active
                .querySelector(`[data-system-group=${packet.dataset.from}]`)!
                .getBoundingClientRect()
              const to = active
                .querySelector(`[data-system-group=${packet.dataset.to}]`)!
                .getBoundingClientRect()
              const dx = to.x + to.width / 2 - from.x - from.width / 2
              const dy = to.y + to.height / 2 - from.y - from.height / 2
              const progress =
                ((x - from.x - from.width / 2) * dx + (y - from.y - from.height / 2) * dy) /
                (dx * dx + dy * dy)
              const key = `${packet.dataset.from}>${packet.dataset.to}:${packet.dataset.direction}`
              const witness = flows.get(key) ?? {
                positions: new Set<string>(),
                first: progress,
                last: progress,
                kind: packet.dataset.kind,
              }
              witness.positions.add(`${x.toFixed(1)},${y.toFixed(1)}`)
              witness.last = progress
              flows.set(key, witness)
            }
            if (figure.dataset.phase === 'settled' && started) {
              finish(true)
              return
            }
          }
          frame = requestAnimationFrame(sample)
        }
        frame = requestAnimationFrame(sample)
        cancel = () => finish(false)
      })
      return { ready, cancel: () => cancel() }
    }, count)
    try {
      if (scenario === 'microservices') await enter(story, 0.08)
      else await choice(story, scenario).check()
      const frames = await probe.evaluate((value) => value.ready)
      expect(frames.assembly).toBe(true)
      expect(frames.transforms).toBeGreaterThan(2)
      expect(frames.complete).toBe(true)
      expect(frames.elapsed).toBeGreaterThan(0)
      expect(frames.elapsed).toBeLessThan(5_000)
      expect(frames.flows.map((flow) => flow.key).sort()).toEqual(
        [...scenarios[scenario].flows].sort(),
      )
      for (const flow of frames.flows) {
        expect(flow.positions, `${scenario} ${flow.key} is visibly moving`).toBeGreaterThan(2)
        expect(
          flow.progress,
          `${scenario} ${flow.key} moves toward its destination`,
        ).toBeGreaterThan(0.05)
        const [nodes] = flow.key.split(':')
        const [from, to] = nodes.split('>')
        const edge = scenarios[scenario].edges.find(
          (item) => item.startsWith(`${from}>${to}:`) || item.startsWith(`${to}>${from}:`),
        )!
        expect(flow.kind).toBe(edge.split(':')[1])
      }
      await settled(story, count, scenario)
      if (scenario === 'microservices') {
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
        await paint(page)
        await enter(story, 0.08)
        await paint(page)
        await settled(story, 1)
      }
    } finally {
      await probe.evaluate((value) => value.cancel())
      await probe.dispose()
    }
  }
})

test('Replay has a stable target for real pointer and keyboard activation', async ({
  page,
  isMobile,
}) => {
  await home(page)
  const story = await autoStory(page)
  const replay = story.getByRole('button', { name: 'Replay system story', exact: true })
  await replay.scrollIntoViewIfNeeded()
  await expect(replay).toBeEnabled()
  const reference = await geometry(replay)
  expect(reference.width).toBeGreaterThanOrEqual(44)
  expect(reference.height).toBeGreaterThanOrEqual(44)
  const x = reference.x + reference.width / 2
  const y = reference.y + reference.height / 2
  if (isMobile) await page.touchscreen.tap(x, y)
  else await page.mouse.click(x, y)
  await expect(story).toHaveAttribute('data-phase', 'assembling')
  await stable(replay, reference)
  await expect(replay).toHaveAccessibleName('Replay system story')
  await settled(story, 2)
  await stable(replay, reference)
  // Native Tab traversal establishes keyboard modality; programmatic focus on
  // the pointer-focused button intentionally does not do that in Firefox.
  await keyboardFocus(
    page,
    page.getByTestId('cta-section').getByRole('link', { name: 'Get in touch', exact: true }),
    'Tab',
  )
  await keyboardFocus(page, replay, 'Shift+Tab')
  // Explicit Replay accepts an intersecting stage; 40% is the autoplay gate.
  // Native focus scrolling still leaves a complete service card visible.
  await expect(panel(story).locator('[data-system-stage]')).toBeInViewport()
  await expect(panel(story).locator('[data-system-group=notifications]')).toBeInViewport({
    ratio: 1,
  })
  // Focus traversal may scroll to keep the control visible. Its next animation
  // must preserve this new position, independently of the pointer reference.
  const keyboardReference = await geometry(replay)
  await page.keyboard.press('Enter')
  await expect(story).toHaveAttribute('data-phase', 'assembling')
  await expect(replay).toBeFocused()
  await stable(replay, keyboardReference)
  await expect
    .poll(() => replay.evaluate((node) => getComputedStyle(node).outlineStyle))
    .toBe('solid')
  await settled(story, 3)
  await expect(replay).toBeFocused()
  await stable(replay, keyboardReference)
})

test('normal scenario selection cancels stale flows and live reduced motion settles the chosen stack', async ({
  page,
}) => {
  await home(page, true)
  const heading = page.getByTestId('about-heading')
  await enter(heading, 0.8)
  await expect(heading).toHaveAttribute('data-motion-phase', 'playing')
  await expect
    .poll(() => opacity(heading.locator('[data-heading-word]').first()))
    .toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect
    .poll(() => opacity(heading.locator('[data-heading-word]').last()))
    .toBeGreaterThan(0.99)
  await readableAbout(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect
    .poll(() => page.evaluate(() => matchMedia('(prefers-reduced-motion: no-preference)').matches))
    .toBe(true)
  const story = page.getByTestId('system-story')
  await enter(story, 0.2)
  await expect(story).toHaveAttribute('data-phase', 'flowing')
  await expect.poll(() => panel(story).locator('[data-system-packet]').count()).toBeGreaterThan(0)
  const stale = await panel(story).evaluateHandle((node) => node.getAnimations({ subtree: true }))
  expect(await stale.evaluate((animations) => animations.length)).toBeGreaterThan(0)
  await choice(story, 'microservices').focus()
  // Select an adjacent native radio with a real key across all browser profiles;
  // this also avoids relying on WebKit wrapping at a group's boundary.
  await page.keyboard.press('ArrowLeft')
  await expect(choice(story, 'mobile')).toBeChecked()
  await expect(choice(story, 'mobile')).toBeFocused()
  await expect(panel(story)).toBeHidden()
  await expect(panel(story).locator('[data-system-packet]')).toHaveCount(0)
  expect(
    await stale.evaluate((animations) =>
      animations.every((animation) => animation.playState !== 'running'),
    ),
  ).toBe(true)
  await stale.dispose()
  await expect(story).toHaveAttribute('data-play-count', '2')
  await expect(story).toHaveAttribute('data-phase', 'flowing')
  await expect
    .poll(() => panel(story, 'mobile').locator('[data-system-packet]').count())
    .toBeGreaterThan(0)
  const active = await story.evaluateHandle((node) => node.getAnimations({ subtree: true }))
  expect(await active.evaluate((animations) => animations.length)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(
    story.getByRole('button', { name: 'Replay system story', exact: true }),
  ).toBeDisabled()
  await settled(story, 2, 'mobile')
  expect(
    await active.evaluate((animations) =>
      animations.every((animation) => animation.playState !== 'running'),
    ),
  ).toBe(true)
  await active.dispose()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(
    story.getByRole('button', { name: 'Replay system story', exact: true }),
  ).toBeEnabled()
  await paint(page)
  await settled(story, 2, 'mobile')
  await expect(heading).toHaveAttribute('data-play-count', '1')
})

test('offscreen and client route unmount remove active request work', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await home(page)
  const story = await autoStory(page)
  const replay = story.getByRole('button', { name: 'Replay system story', exact: true })
  await replay.click()
  await expect(story).toHaveAttribute('data-phase', 'flowing')
  const offscreenAnimations = await story.evaluateHandle((node) =>
    node.getAnimations({ subtree: true }),
  )
  expect(await offscreenAnimations.evaluate((animations) => animations.length)).toBeGreaterThan(0)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await settled(story, 2)
  expect(
    await offscreenAnimations.evaluate((animations) =>
      animations.every((animation) => animation.playState !== 'running'),
    ),
  ).toBe(true)
  await offscreenAnimations.dispose()
  await enter(story, 0.2)
  await paint(page)
  await settled(story, 2)
  await replay.click()
  await expect(story).toHaveAttribute('data-phase', 'flowing')
  const retained = await story.elementHandle()
  const routeAnimations = await story.evaluateHandle((node) =>
    node.getAnimations({ subtree: true }),
  )
  expect(await routeAnimations.evaluate((animations) => animations.length)).toBeGreaterThan(0)
  await page.getByTestId('nav-link-experience').click()
  await expect(page).toHaveURL(/\/experience$/)
  await expect(page.getByTestId('system-story')).toHaveCount(0)
  expect(await retained!.evaluate((node) => node.isConnected)).toBe(false)
  expect(
    await retained!.evaluate((node) => node.querySelectorAll('[data-system-packet]').length),
  ).toBe(0)
  expect(
    await routeAnimations.evaluate((animations) =>
      animations.every((animation) => animation.playState !== 'running'),
    ),
  ).toBe(true)
  await routeAnimations.dispose()
  await retained!.dispose()
  await page.getByTestId('nav-link-home').click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByTestId('system-story')).toHaveAttribute('data-play-count', '0')
  await autoStory(page)
  expect(errors).toEqual([])
})

test('slow application hydration preserves the readable About first frame', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  const chunks = /\/_next\/static\/chunks\/.*\.js$/
  const hold = async (route: import('@playwright/test').Route) => {
    await gate
    await route.continue()
  }
  await page.route(chunks, hold)
  try {
    await page.goto('/', { waitUntil: 'commit' })
    await expect(page.locator('html')).toHaveClass(/intro-skip/)
    await readableAbout(page)
    await completeStory(page.getByTestId('system-story'))
  } finally {
    release()
  }
  await expect(page.getByRole('button', { name: /^Switch to (light|dark) theme$/ })).toBeEnabled()
  await page.waitForLoadState('load')
  await paint(page)
  await readableAbout(page)
  await completeStory(page.getByTestId('system-story'))
  await expect(page.getByTestId('about-heading')).toHaveAttribute('data-play-count', '0')
  await page.unroute(chunks, hold)
})
