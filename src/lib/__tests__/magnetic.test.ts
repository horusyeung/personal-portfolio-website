import { describe, it, expect, vi, afterEach } from 'vitest'
import { gsap } from '@/lib/gsap'
import { createMagneticEffect } from '@/lib/animations'

// A 20×20 element centred at (100, 100)
function makeElement() {
  const element = document.createElement('div')
  element.getBoundingClientRect = () =>
    ({ left: 90, top: 90, width: 20, height: 20, right: 110, bottom: 110 }) as DOMRect
  document.body.appendChild(element)
  return element
}

const move = (clientX: number, clientY: number) =>
  document.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY }))

describe('createMagneticEffect', () => {
  const cleanups: (() => void)[] = []

  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup())
    vi.restoreAllMocks()
  })

  it('shares one document listener between elements', () => {
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')

    const stopA = createMagneticEffect(makeElement())
    const stopB = createMagneticEffect(makeElement())
    expect(add.mock.calls.filter(([type]) => type === 'mousemove')).toHaveLength(1)

    stopA()
    expect(remove.mock.calls.filter(([type]) => type === 'mousemove')).toHaveLength(0)
    stopB()
    expect(remove.mock.calls.filter(([type]) => type === 'mousemove')).toHaveLength(1)
  })

  it('creates no tweens while the pointer stays outside the radius', () => {
    cleanups.push(createMagneticEffect(makeElement(), 0.3, 80))
    const to = vi.spyOn(gsap, 'to')

    move(400, 400)
    move(500, 300)
    expect(to).not.toHaveBeenCalled()
  })

  it('follows the pointer inside the radius and springs back once when it leaves', () => {
    const element = makeElement()
    cleanups.push(createMagneticEffect(element, 0.3, 80))
    const to = vi.spyOn(gsap, 'to')

    move(120, 100)
    move(130, 110)
    expect(to).not.toHaveBeenCalled() // quickTo retargets its own tween

    move(400, 400)
    move(500, 400)
    expect(to).toHaveBeenCalledTimes(1)
    expect(to).toHaveBeenCalledWith(
      element,
      expect.objectContaining({ x: 0, y: 0, ease: 'elastic.out(1, 0.3)' }),
    )
  })
})
