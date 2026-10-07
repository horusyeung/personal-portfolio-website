import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AboutScrollText from '@/components/AboutScrollText'

const mocks = vi.hoisted(() => ({
  load: vi.fn(),
  create: vi.fn(),
  animate: vi.fn(),
  revert: vi.fn(),
  kill: vi.fn(),
  killTrigger: vi.fn(),
  disconnect: vi.fn(),
}))
vi.mock('@/lib/gsap', () => ({
  loadSplitText: mocks.load,
  gsap: { fromTo: mocks.animate },
}))

const copy = 'Designed a microservice architecture from scratch.'
let enter: () => void
let reduced: boolean
let preferenceListeners: Set<() => void>

beforeEach(() => {
  vi.clearAllMocks()
  reduced = false
  preferenceListeners = new Set()
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reduced
    },
    addEventListener: (_event: string, listener: () => void) => preferenceListeners.add(listener),
    removeEventListener: (_event: string, listener: () => void) =>
      preferenceListeners.delete(listener),
  }))
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        enter = () =>
          this.callback(
            [{ target, isIntersecting: true } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          )
      }
      disconnect = mocks.disconnect
    },
  )
  mocks.load.mockResolvedValue({ create: mocks.create })
  mocks.create.mockImplementation((paragraph: HTMLElement) => {
    const original = paragraph.innerHTML
    const word = document.createElement('span')
    word.textContent = paragraph.textContent
    paragraph.replaceChildren(word)
    mocks.revert.mockImplementation(() => {
      paragraph.innerHTML = original
    })
    return { words: [word], revert: mocks.revert }
  })
  mocks.animate.mockReturnValue({ kill: mocks.kill, scrollTrigger: { kill: mocks.killTrigger } })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

async function changeMotion(value: boolean) {
  await act(async () => {
    reduced = value
    preferenceListeners.forEach((listener) => listener())
  })
}

describe('About scroll-lit text', () => {
  it('keeps plain visible copy until it approaches the viewport, then splits with native semantics', async () => {
    render(<AboutScrollText>{copy}</AboutScrollText>)
    const paragraph = screen.getByText(copy)
    expect(paragraph.tagName).toBe('P')
    expect(paragraph.closest('[data-intro]')).toBeNull()
    expect(mocks.load).not.toHaveBeenCalled()
    await act(async () => enter())
    expect(mocks.load).toHaveBeenCalledOnce()
    expect(mocks.create).toHaveBeenCalledWith(
      paragraph,
      expect.objectContaining({ type: 'words', tag: 'span', aria: 'none' }),
    )
    expect(paragraph.textContent).toBe(copy)
    expect(paragraph).not.toHaveAttribute('aria-label')
    expect(paragraph.querySelector('[aria-hidden]')).toBeNull()
    expect(mocks.animate).toHaveBeenCalledWith(
      expect.any(Array),
      { '--word-lit': '0%' },
      expect.objectContaining({
        '--word-lit': '100%',
        scrollTrigger: expect.objectContaining({ scrub: true }),
      }),
    )
  })

  it('does not load or split with reduced motion, and responds when that preference changes', async () => {
    reduced = true
    render(<AboutScrollText>{copy}</AboutScrollText>)
    await act(async () => enter())
    expect(mocks.load).not.toHaveBeenCalled()
    expect(screen.getByText(copy).children).toHaveLength(0)
    await changeMotion(false)
    expect(mocks.create).toHaveBeenCalledOnce()
  })

  it('kills the scroll animation and restores plain copy when reduced motion is enabled', async () => {
    render(<AboutScrollText>{copy}</AboutScrollText>)
    await act(async () => enter())
    await changeMotion(true)
    expect(mocks.killTrigger).toHaveBeenCalledOnce()
    expect(mocks.kill).toHaveBeenCalledOnce()
    expect(mocks.revert).toHaveBeenCalledOnce()
    expect(screen.getByText(copy).children).toHaveLength(0)
    await changeMotion(false)
    expect(mocks.create).toHaveBeenCalledTimes(2)
    expect(screen.getByTestId('about-copy').querySelector('span span')).toBeNull()
  })

  it('ignores a lazy plugin that resolves after unmount', async () => {
    let resolve!: (plugin: { create: typeof mocks.create }) => void
    mocks.load.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done
        }),
    )
    const { unmount } = render(<AboutScrollText>{copy}</AboutScrollText>)
    await act(async () => enter())
    unmount()
    await act(async () => resolve({ create: mocks.create }))
    expect(mocks.create).not.toHaveBeenCalled()
    expect(preferenceListeners.size).toBe(0)
  })

  it('keeps the original paragraph if the optional plugin cannot load', async () => {
    mocks.load.mockRejectedValue(new Error('chunk unavailable'))
    render(<AboutScrollText>{copy}</AboutScrollText>)
    await act(async () => enter())
    expect(screen.getByText(copy).children).toHaveLength(0)
    expect(mocks.animate).not.toHaveBeenCalled()
  })

  it('reverts the split and removes listeners on unmount', async () => {
    const { unmount } = render(<AboutScrollText>{copy}</AboutScrollText>)
    await act(async () => enter())
    unmount()
    expect(mocks.killTrigger).toHaveBeenCalledOnce()
    expect(mocks.kill).toHaveBeenCalledOnce()
    expect(mocks.revert).toHaveBeenCalledOnce()
    expect(mocks.disconnect).toHaveBeenCalled()
    expect(preferenceListeners.size).toBe(0)
  })
})
