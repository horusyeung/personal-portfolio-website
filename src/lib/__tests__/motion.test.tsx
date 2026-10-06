import { useRef } from 'react'
import { act, cleanup, render, renderHook } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { settleAfter, useIdle, useInView, usePrefersReducedTransparency } from '@/lib/motion'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('usePrefersReducedTransparency', () => {
  it('reads the preference, responds to changes, and removes its subscription', () => {
    const media = new EventTarget()
    const query = Object.assign(media, { matches: true })
    const remove = vi.spyOn(media, 'removeEventListener')
    const matchMedia = vi.fn(() => query)
    vi.stubGlobal('matchMedia', matchMedia)
    const { result, unmount } = renderHook(usePrefersReducedTransparency)
    expect(result.current).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-transparency: reduce)')

    act(() => {
      query.matches = false
      media.dispatchEvent(new Event('change'))
    })
    expect(result.current).toBe(false)
    unmount()
    expect(remove).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('has a safe server snapshot without reading browser preferences', () => {
    const matchMedia = vi.fn(() => {
      throw new Error('browser API during SSR')
    })
    vi.stubGlobal('matchMedia', matchMedia)
    function Preference() {
      return <span>{String(usePrefersReducedTransparency())}</span>
    }
    expect(renderToString(<Preference />)).toContain('false')
    expect(matchMedia).not.toHaveBeenCalled()
  })
})

describe('useInView', () => {
  it('pauses off screen and in a hidden tab, then resumes only when both are visible', () => {
    let notify: IntersectionObserverCallback
    const observe = vi.fn()
    const disconnect = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          notify = callback
        }
        observe = observe
        disconnect = disconnect
      },
    )
    let hidden = false
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden)
    function Probe() {
      const ref = useRef<HTMLDivElement>(null)
      const visible = useInView(ref)
      return <div ref={ref} data-visible={visible} />
    }
    const { container, unmount } = render(<Probe />)
    const element = container.firstElementChild!
    const intersect = (isIntersecting: boolean) =>
      act(() => {
        notify(
          [{ target: element, isIntersecting } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        )
      })
    const visibility = (value: boolean) =>
      act(() => {
        hidden = value
        document.dispatchEvent(new Event('visibilitychange'))
      })
    expect(observe).toHaveBeenCalledWith(element)
    expect(element).toHaveAttribute('data-visible', 'false')
    intersect(true)
    expect(element).toHaveAttribute('data-visible', 'true')
    visibility(true)
    expect(element).toHaveAttribute('data-visible', 'false')
    intersect(false)
    visibility(false)
    expect(element).toHaveAttribute('data-visible', 'false')
    intersect(true)
    expect(element).toHaveAttribute('data-visible', 'true')
    const remove = vi.spyOn(document, 'removeEventListener')
    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
    expect(remove).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
  })

  it('allows visible content when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
    const ref = { current: document.createElement('div') }
    const { result } = renderHook(() => useInView(ref))
    expect(result.current).toBe(true)
  })

  it('does not observe an absent element', () => {
    const observer = vi.fn()
    vi.stubGlobal('IntersectionObserver', observer)
    const { result } = renderHook(() => useInView({ current: null }))
    expect(result.current).toBe(false)
    expect(observer).not.toHaveBeenCalled()
  })
})

describe('useIdle', () => {
  it('waits for the idle callback and cancels pending work on unmount', () => {
    let complete: IdleRequestCallback
    const request = vi.fn((callback: IdleRequestCallback) => {
      complete = callback
      return 12
    })
    const cancel = vi.fn()
    vi.stubGlobal('requestIdleCallback', request)
    vi.stubGlobal('cancelIdleCallback', cancel)
    const { result, unmount } = renderHook(() => useIdle(800))
    expect(result.current).toBe(false)
    expect(request).toHaveBeenCalledWith(expect.any(Function), { timeout: 800 })
    act(() => complete({ didTimeout: false, timeRemaining: () => 20 }))
    expect(result.current).toBe(true)
    unmount()
    expect(cancel).toHaveBeenCalledWith(12)
  })

  it('uses a bounded timer fallback and clears it before unmount', () => {
    vi.useFakeTimers()
    vi.stubGlobal('requestIdleCallback', undefined)
    const { result, unmount } = renderHook(useIdle)
    act(() => vi.advanceTimersByTime(199))
    expect(result.current).toBe(false)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe(true)
    unmount()
    const pending = renderHook(useIdle)
    expect(vi.getTimerCount()).toBe(1)
    pending.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('settleAfter', () => {
  it.each([5000, 9000, Infinity, NaN])('caps %s at five seconds and stops once', (duration) => {
    vi.useFakeTimers()
    const stop = vi.fn()
    settleAfter(duration, stop)
    vi.advanceTimersByTime(4999)
    expect(stop).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(stop).toHaveBeenCalledOnce()
    vi.advanceTimersByTime(10000)
    expect(stop).toHaveBeenCalledOnce()
  })

  it('supports a shorter activation and cancellation', () => {
    vi.useFakeTimers()
    const stop = vi.fn()
    const cancel = settleAfter(300, stop)
    cancel()
    vi.advanceTimersByTime(5000)
    expect(stop).not.toHaveBeenCalled()
    settleAfter(300, stop)
    vi.advanceTimersByTime(300)
    expect(stop).toHaveBeenCalledOnce()
  })

  it('settles a negative duration immediately', () => {
    vi.useFakeTimers()
    const stop = vi.fn()
    settleAfter(-1, stop)
    vi.advanceTimersByTime(0)
    expect(stop).toHaveBeenCalledOnce()
  })
})
