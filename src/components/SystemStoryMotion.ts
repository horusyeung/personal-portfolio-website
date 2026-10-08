import { storyScenarios } from './systemStoryModel'

export type SystemStoryController = { destroy: () => void }

/** Optional browser-only motion. The figure's resting CSS is always complete. */
export function createSystemStory(figure: HTMLElement): SystemStoryController {
  const replay = figure.querySelector<HTMLButtonElement>('[data-testid="system-story-replay"]')!
  const stages = [...figure.querySelectorAll<HTMLElement>('[data-system-stage]')]
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const animations = new Set<Animation>()
  const packets = new Set<HTMLElement>()
  const supported = typeof figure.animate === 'function'
  let destroyed = false
  let played = false
  let run = 0
  let timer = 0
  let count = 0

  const selected = () => {
    const id = figure.querySelector<HTMLInputElement>('[data-system-choice]:checked')!.value
    const scenario = storyScenarios.find((item) => item.id === id)!
    const panel = figure.querySelector<HTMLElement>(`[data-system-scenario="${id}"]`)!
    return { scenario, panel, stage: panel.querySelector<HTMLElement>('[data-system-stage]')! }
  }

  const inView = (stage: HTMLElement) => {
    const rect = stage.getBoundingClientRect()
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.top < innerHeight &&
      rect.right > 0 &&
      rect.left < innerWidth
    )
  }

  const settle = () => {
    run++
    window.clearTimeout(timer)
    timer = 0
    animations.forEach((animation) => animation.cancel())
    animations.clear()
    packets.forEach((packet) => packet.remove())
    packets.clear()
    figure.dataset.phase = 'settled'
  }

  const animate = (node: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = node.animate(frames, options)
    animations.add(animation)
    const finished = animation.finished.catch(() => {})
    void finished.finally(() => animations.delete(animation))
    return finished
  }

  const play = async () => {
    if (destroyed) return
    settle()
    const { scenario, panel, stage } = selected()
    if (media.matches || !supported || document.hidden || !inView(stage)) return
    played = true
    figure.dataset.playCount = String(++count)
    figure.dataset.phase = 'assembling'
    const currentRun = run
    timer = window.setTimeout(settle, 4800)
    const valid = () =>
      !destroyed && currentRun === run && !media.matches && !document.hidden && inView(stage)

    const groups = [...panel.querySelectorAll<HTMLElement>('[data-system-group]')]
    await Promise.all(
      groups.map((group, index) =>
        animate(
          group,
          [
            { transform: `translateY(${16 + index * 4}px) scale(.97)`, opacity: 0.76 },
            { transform: 'none', opacity: 1 },
          ],
          {
            duration: 500,
            delay: index * 65,
            easing: 'cubic-bezier(.22, 1, .36, 1)',
            fill: 'backwards',
          },
        ),
      ),
    )
    if (!valid()) return

    figure.dataset.phase = 'flowing'
    const svg = [...stage.querySelectorAll<SVGSVGElement>('[data-system-layout]')].find(
      (item) => item.getBoundingClientRect().width > 0,
    )!
    const accent = getComputedStyle(figure).getPropertyValue('--mui-palette-primary-main').trim()

    const pulse = (id: string) => {
      const group = panel.querySelector<HTMLElement>(`[data-system-group="${id}"]`)!
      const border = getComputedStyle(group).borderColor
      return animate(group, [{ borderColor: accent }, { borderColor: border }], {
        duration: 180,
        easing: 'ease-out',
        fill: 'none',
      })
    }

    const travel = async (
      id: string,
      reverse: boolean,
      direction: 'request' | 'response' | 'event' | 'workflow',
    ) => {
      if (!valid()) return
      const path = svg.querySelector<SVGPathElement>(`[data-system-edge="${id}"]`)!
      const from = path.dataset[reverse ? 'to' : 'from']!
      const to = path.dataset[reverse ? 'from' : 'to']!
      const packet = document.createElement('span')
      packet.dataset.systemPacket = id
      packet.dataset.from = from
      packet.dataset.to = to
      packet.dataset.kind = path.dataset.kind
      packet.dataset.direction = direction
      packet.setAttribute('aria-hidden', 'true')
      stage.append(packet)
      packets.add(packet)

      const origin = stage.getBoundingClientRect()
      const matrix = svg.getScreenCTM()!
      const length = path.getTotalLength()
      const frames = Array.from({ length: 25 }, (_, index) => {
        const offset = index / 24
        const point = path.getPointAtLength(length * (reverse ? 1 - offset : offset))
        const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix)
        return {
          offset,
          transform: `translate(${screen.x - origin.left - 3.5}px, ${screen.y - origin.top - 3.5}px)`,
          opacity: index === 0 || index === 24 ? 0 : 1,
        }
      })
      const duration = direction === 'event' ? 430 : 340
      const stroke = getComputedStyle(path).stroke
      await Promise.all([
        animate(packet, frames, { duration, easing: 'linear', fill: 'none' }),
        animate(path, [{ stroke: accent }, { stroke }], { duration, fill: 'none' }),
      ])
      packet.remove()
      packets.delete(packet)
      if (valid()) await pulse(to)
    }

    // Only API responses reverse a route. Events and delivery/AI workflows
    // advance one way, and parallel branches complete before the next step.
    for (const step of scenario.steps) {
      await Promise.all(
        step.edges.map((edge) => travel(edge, step.direction === 'response', step.direction)),
      )
      if (!valid()) return
    }
    if (valid()) settle()
  }

  const tryEntrance = () => {
    if (played || destroyed || media.matches || document.hidden || !supported) return
    const { stage } = selected()
    const rect = stage.getBoundingClientRect()
    const visible = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0)
    if (inView(stage) && visible >= rect.height * 0.4) void play()
  }

  const preference = () => {
    replay.disabled = media.matches || !supported
    if (media.matches) settle()
    else tryEntrance()
  }
  const visibility = () => {
    if (document.hidden) settle()
    else tryEntrance()
  }
  const resize = () => settle()
  const replayClick = () => void play()
  const selection = (event: Event) => {
    if (event.target instanceof HTMLInputElement && event.target.matches('[data-system-choice]')) {
      void play()
    }
  }
  const observer =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          (entries) => {
            const { stage } = selected()
            const entry = entries.find((item) => item.target === stage)
            if (!entry) return
            if (!entry.isIntersecting) settle()
            else tryEntrance()
          },
          { threshold: [0, 0.4] },
        )
  stages.forEach((stage) => observer?.observe(stage))
  media.addEventListener('change', preference)
  document.addEventListener('visibilitychange', visibility)
  window.addEventListener('resize', resize)
  window.addEventListener('pagehide', resize)
  replay.addEventListener('click', replayClick)
  figure.addEventListener('change', selection)
  figure.dataset.ready = 'true'
  preference()

  return {
    destroy: () => {
      if (destroyed) return
      settle()
      destroyed = true
      replay.disabled = true
      figure.dataset.ready = 'false'
      observer?.disconnect()
      media.removeEventListener('change', preference)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pagehide', resize)
      replay.removeEventListener('click', replayClick)
      figure.removeEventListener('change', selection)
    },
  }
}
