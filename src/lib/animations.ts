'use client'

import { gsap } from '@/lib/gsap'

type Wrap = <T extends (...args: never[]) => unknown>(fn: T) => T
const noWrap: Wrap = (fn) => fn

/**
 * Split text into individual character spans for animation. Screen readers keep reading the
 * whole text via aria-label; `revert` restores the original text node.
 */
export function splitTextIntoChars(element: HTMLElement) {
  const text = element.textContent || ''
  element.textContent = ''
  element.setAttribute('aria-label', text)
  const chars: HTMLSpanElement[] = []

  for (const char of text) {
    const span = document.createElement('span')
    span.textContent = char === ' ' ? '\u00A0' : char
    span.setAttribute('aria-hidden', 'true')
    span.style.display = 'inline-block'
    span.style.willChange = 'transform, opacity'
    element.appendChild(span)
    chars.push(span)
  }

  const revert = () => {
    element.textContent = text
    element.removeAttribute('aria-label')
  }

  return { chars, revert }
}

/**
 * Create a count-up animation for a number element.
 */
export function animateCountUp(
  element: HTMLElement,
  endValue: number,
  duration: number = 1.5,
  suffix: string = '',
) {
  const obj = { value: 0 }
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value) + suffix
    },
  })
}

// ── Magnetic pull ───────────────────────────────────────────────────────────
// All magnetic elements share one document listener, and nothing is tweened while the pointer
// is outside an element's radius: it follows the pointer inside, then springs back once.

type Magnet = {
  element: HTMLElement
  strength: number
  radius: number
  active: boolean
  pull: (x: number, y: number) => void
  release: () => void
}

const magnets = new Set<Magnet>()

function handleMagnetMove(e: MouseEvent) {
  for (const magnet of magnets) {
    const rect = magnet.element.getBoundingClientRect()
    const deltaX = e.clientX - (rect.left + rect.width / 2)
    const deltaY = e.clientY - (rect.top + rect.height / 2)

    if (Math.hypot(deltaX, deltaY) < magnet.radius) {
      magnet.pull(deltaX * magnet.strength, deltaY * magnet.strength)
    } else if (magnet.active) {
      magnet.release()
    }
  }
}

function handleMagnetExit() {
  for (const magnet of magnets) if (magnet.active) magnet.release()
}

/**
 * Pull an element towards the cursor while it is within `radius`. Pass `wrap` (GSAP's
 * contextSafe) so tweens created by the handlers are reverted with their context.
 */
export function createMagneticEffect(
  element: HTMLElement,
  strength: number = 0.3,
  radius: number = 80,
  wrap: Wrap = noWrap,
) {
  const xTo = gsap.quickTo(element, 'x', { duration: 0.3, ease: 'power2.out' })
  const yTo = gsap.quickTo(element, 'y', { duration: 0.3, ease: 'power2.out' })
  let springBack: gsap.core.Tween | undefined

  const magnet: Magnet = {
    element,
    strength,
    radius,
    active: false,
    pull: (x, y) => {
      if (!magnet.active) {
        // Start from where the spring-back left it, not where quickTo last aimed
        magnet.active = true
        springBack?.kill()
        xTo(x, gsap.getProperty(element, 'x') as number)
        yTo(y, gsap.getProperty(element, 'y') as number)
        return
      }
      xTo(x)
      yTo(y)
    },
    release: wrap(() => {
      magnet.active = false
      xTo.tween.pause()
      yTo.tween.pause()
      springBack = gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
    }),
  }

  if (magnets.size === 0) {
    document.addEventListener('mousemove', handleMagnetMove)
    document.documentElement.addEventListener('mouseleave', handleMagnetExit)
  }
  magnets.add(magnet)

  return () => {
    magnets.delete(magnet)
    if (magnets.size === 0) {
      document.removeEventListener('mousemove', handleMagnetMove)
      document.documentElement.removeEventListener('mouseleave', handleMagnetExit)
    }
  }
}

/**
 * Create a 3D tilt effect that follows the cursor on hover.
 */
export function createTiltEffect(element: HTMLElement, maxDeg: number = 5, wrap: Wrap = noWrap) {
  const handleMouseMove = wrap((e: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(element, {
      rotateY: x * maxDeg * 2,
      rotateX: -y * maxDeg * 2,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  })

  const handleMouseLeave = wrap(() => {
    gsap.to(element, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out',
    })
  })

  element.addEventListener('mousemove', handleMouseMove)
  element.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    element.removeEventListener('mousemove', handleMouseMove)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * Check if user prefers reduced motion at this moment. For one-off effects in event handlers;
 * hooks use useEntranceAnimation / useMotionEffect, which also react to live changes.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
