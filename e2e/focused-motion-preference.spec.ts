import { expect, test, type Locator, type Page } from '@playwright/test'

function effectiveOpacity(locator: Locator) {
  return locator.evaluate((node) => {
    let opacity = 1
    for (let element: Element | null = node; element; element = element.parentElement) {
      opacity *= Number(getComputedStyle(element).opacity)
    }
    return opacity
  })
}

async function staysReadableAndFocused(control: Locator) {
  const samples = await control.evaluate(
    (node) =>
      new Promise<{ minimum: number; focused: boolean; connected: boolean }>((resolve) => {
        let frames = 0
        let minimum = 1
        let focused = true
        let connected = true
        const sample = () => {
          let opacity = 1
          for (let element: Element | null = node; element; element = element.parentElement) {
            opacity *= Number(getComputedStyle(element).opacity)
          }
          minimum = Math.min(minimum, opacity)
          focused &&= document.activeElement === node
          connected &&= node.isConnected
          frames += 1
          if (frames === 4) resolve({ minimum, focused, connected })
          else requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
      }),
  )
  expect(samples.connected, 'the focused control is retained').toBe(true)
  expect(samples.focused, 'media changes do not move keyboard focus').toBe(true)
  expect(
    samples.minimum,
    'the focused control remains readable in every sampled paint',
  ).toBeGreaterThan(0.99)
  await expect(control).toBeFocused()
}

function watchFocusedPaints(control: Locator) {
  return control.evaluateHandle((node) => {
    const samples = {
      minimum: 1,
      focused: true,
      connected: true,
      frames: 0,
      timeline: [] as {
        time: number
        phase: string
        reducedMotion: boolean
        effectiveOpacity: number
        inlineOpacity: string
        focused: boolean
        connected: boolean
      }[],
    }
    let phase = 'focused reduced-motion baseline'
    let frame = 0
    const sample = () => {
      let opacity = 1
      for (let element: Element | null = node; element; element = element.parentElement) {
        opacity *= Number(getComputedStyle(element).opacity)
      }
      samples.minimum = Math.min(samples.minimum, opacity)
      samples.focused &&= document.activeElement === node
      samples.connected &&= node.isConnected
      samples.frames += 1
      samples.timeline.push({
        time: performance.now(),
        phase,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        effectiveOpacity: opacity,
        inlineOpacity: (node.closest('[data-intro]') as HTMLElement | null)?.style.opacity ?? '',
        focused: document.activeElement === node,
        connected: node.isConnected,
      })
      frame = requestAnimationFrame(sample)
    }
    frame = requestAnimationFrame(sample)
    return {
      setPhase(value: string) {
        phase = value
      },
      stop() {
        cancelAnimationFrame(frame)
        return samples
      },
    }
  })
}

async function hydrated(page: Page, path: string) {
  // Hold only the blank page's clock while the real browser loads and hydrates. This keeps
  // the intentional three-second fallback from replacing the normal entrance path under
  // test-machine CPU contention, without changing any product timer or DOM state.
  await page.clock.install({ time: new Date('2026-10-07T12:00:00Z') })
  await page.clock.pauseAt(new Date('2026-10-07T12:01:00Z'))
  await page.goto(path)
  await expect(page.getByRole('button', { name: /^Switch to (light|dark) theme$/ })).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  expect(
    await page.evaluate(() => document.documentElement.classList.contains('intro-skip')),
    'exercise live entrances rather than the intentional slow-hydration fallback',
  ).toBe(false)
  await page.clock.resume()
}

for (const surface of ['project card', 'closing CTA', 'Contact Name', 'Contact Message'] as const) {
  test(`already focused ${surface} stays readable when motion is re-enabled and reduced again`, async ({
    page,
  }) => {
    // A shorter viewport puts every selected target below its entry threshold while preserving
    // each configured browser, device width, touch capability and pixel density.
    await page.setViewportSize({
      width: page.viewportSize()!.width,
      height: 480,
    })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await hydrated(
      page,
      surface === 'project card' ? '/open-source' : surface === 'closing CTA' ? '/' : '/contact',
    )

    let control: Locator
    let content: Locator
    let unfocusedPending: Locator
    if (surface === 'project card') {
      const gallery = page.getByTestId('project-gallery')
      content = gallery.locator('[data-project-card]').last()
      control = content.getByRole('button', { name: /^Details for / })
      unfocusedPending = gallery.locator('[data-project-card]').nth(3)
    } else if (surface === 'closing CTA') {
      content = page.getByTestId('cta-section').getByRole('heading')
      control = page.getByTestId('cta-section').getByRole('link', { name: /Get in touch/ })
      unfocusedPending = page
        .getByTestId('skills-section')
        .getByRole('heading', { name: 'Technologies I work with.', exact: true })
    } else {
      const form = page.getByTestId('contact-form')
      control = form.getByLabel(surface === 'Contact Name' ? /^Name/ : /^Message/)
      content = control
      unfocusedPending = form.getByLabel(/^Email/)
    }

    const owner = content.locator('xpath=ancestor-or-self::*[@data-intro][1]')
    const unfocusedOwner = unfocusedPending.locator('xpath=ancestor-or-self::*[@data-intro][1]')
    expect(
      await owner.evaluate((node) => node.getBoundingClientRect().top / innerHeight),
    ).toBeGreaterThan(0.85)
    expect(
      await unfocusedPending.evaluate((node) => node.getBoundingClientRect().top / innerHeight),
    ).toBeGreaterThan(0.85)
    expect(await effectiveOpacity(control)).toBeGreaterThan(0.99)
    await control.evaluate((node) => (node as HTMLElement).focus({ preventScroll: true }))
    await staysReadableAndFocused(control)

    // A separate, unfocused target proves the live media owner actually starts and reverts its
    // pending reveal. The selected control must remain visible without a new focus event.
    const paintWatch = await watchFocusedPaints(control)
    try {
      let change = 0
      for (const reducedMotion of ['no-preference', 'reduce', 'no-preference', 'reduce'] as const) {
        expect(
          await owner.evaluate((node) => node.getBoundingClientRect().top / innerHeight),
        ).toBeGreaterThan(0.85)
        change += 1
        await paintWatch.evaluate(
          (monitor, value) => monitor.setPhase(value),
          `change${change}: ${reducedMotion}`,
        )
        await page.emulateMedia({ reducedMotion })
        // CSS media queries can update before the queued native change callback. An inline
        // owner state proves the GSAP context has handled the preference, while the monitor
        // below observes every paint throughout that handoff rather than waiting away a flash.
        await expect
          .poll(() => unfocusedOwner.evaluate((node) => (node as HTMLElement).style.opacity))
          .toBe(reducedMotion === 'no-preference' ? '0' : '')
        if (reducedMotion === 'no-preference') {
          expect(await effectiveOpacity(unfocusedPending)).toBeLessThan(0.01)
        } else {
          expect(await effectiveOpacity(unfocusedPending)).toBeGreaterThan(0.99)
        }
        expect(await effectiveOpacity(content)).toBeGreaterThan(0.99)
        await staysReadableAndFocused(control)
      }
    } finally {
      const samples = await paintWatch.evaluate((monitor) => monitor.stop())
      await paintWatch.dispose()
      await test.info().attach('focused-motion-frame-timeline', {
        body: Buffer.from(JSON.stringify(samples, null, 2)),
        contentType: 'application/json',
      })
      expect(
        samples.frames,
        'the continuous monitor observes the preference handoffs',
      ).toBeGreaterThan(4)
      expect(samples.connected, 'the focused control stays connected throughout').toBe(true)
      expect(samples.focused, 'focus stays on the same control throughout').toBe(true)
      expect(
        samples.minimum,
        'no preference-change paint hides the focused control',
      ).toBeGreaterThan(0.99)
    }
  })
}
