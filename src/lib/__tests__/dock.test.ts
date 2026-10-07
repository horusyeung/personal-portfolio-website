import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDockEffect, dockFalloff } from '@/lib/dock'

describe('Dock falloff', () => {
  it('peaks at the pointer and returns to rest at and beyond the radius', () => {
    expect(dockFalloff(0)).toBe(1)
    expect(dockFalloff(46)).toBeCloseTo(0.5)
    expect(dockFalloff(92)).toBe(0)
    expect(dockFalloff(500)).toBe(0)
  })

  it('is symmetric and decreases smoothly between neighbours', () => {
    expect(dockFalloff(-32)).toBe(dockFalloff(32))
    const values = [0, 10, 30, 60, 90].map((distance) => dockFalloff(distance))
    expect(values.every((value, index) => index === 0 || value < values[index - 1])).toBe(true)
  })

  it('keeps invalid measurements from producing invalid transforms', () => {
    for (const distance of [NaN, Infinity, -Infinity]) expect(dockFalloff(distance)).toBe(0)
    for (const radius of [0, -1, Infinity]) expect(dockFalloff(10, radius)).toBe(0)
  })
})

describe('Dock pointer effect', () => {
  const cleanups: (() => void)[] = []

  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup())
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  function fixture() {
    const dock = document.createElement('ul')
    dock.innerHTML = '<li><a data-dock-item><span data-dock-icon></span></a></li>'
    document.body.append(dock)
    const link = dock.querySelector('a')!
    const icon = dock.querySelector<HTMLElement>('span')!
    const measure = vi.spyOn(link, 'getBoundingClientRect').mockReturnValue({
      left: 73,
      width: 54,
    } as DOMRect)
    let nextFrame: FrameRequestCallback | undefined
    const request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      nextFrame = callback
      return 123
    })
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    const stop = createDockEffect(dock)
    cleanups.push(stop)
    const move = (clientX: number, pointerType = 'mouse') => {
      const event = new MouseEvent('pointermove', { clientX })
      Object.defineProperty(event, 'pointerType', { value: pointerType })
      dock.dispatchEvent(event)
    }
    return { dock, icon, measure, request, cancel, move, stop, tick: () => nextFrame?.(0) }
  }

  it('batches pointer events and measures the stable hit area before writing the icon', () => {
    const { icon, measure, request, move, tick } = fixture()
    move(80)
    move(100)
    expect(request).toHaveBeenCalledTimes(1)
    expect(measure).not.toHaveBeenCalled()
    expect(icon.style.getPropertyValue('--dock-scale')).toBe('')
    tick()
    expect(measure).toHaveBeenCalledTimes(1)
    expect(icon.style.getPropertyValue('--dock-scale')).toBe('1.32')
    expect(icon.style.getPropertyValue('--dock-lift')).toBe('-4')
  })

  it('ignores touch and restores rest after leaving or losing the window', () => {
    const { dock, icon, request, move, tick } = fixture()
    move(100, 'touch')
    expect(request).not.toHaveBeenCalled()
    move(100)
    tick()
    dock.dispatchEvent(new Event('pointerleave'))
    tick()
    expect(icon.style.getPropertyValue('--dock-scale')).toBe('1')
    move(100)
    tick()
    window.dispatchEvent(new Event('blur'))
    tick()
    expect(icon.style.getPropertyValue('--dock-lift')).toBe('0')
  })

  it('cancels pending work and removes its styles and listeners on cleanup', () => {
    const { icon, request, cancel, move, stop, tick } = fixture()
    move(100)
    tick()
    move(110)
    stop()
    expect(cancel).toHaveBeenCalledWith(123)
    expect(icon.style.getPropertyValue('--dock-scale')).toBe('')
    expect(icon.style.getPropertyValue('--dock-lift')).toBe('')
    request.mockClear()
    move(100)
    expect(request).not.toHaveBeenCalled()
  })
})
