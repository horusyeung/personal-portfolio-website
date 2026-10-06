'use client'

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

declare global {
  interface Window {
    __introTimer?: number
  }
}

const MOTION_ALLOWED = '(prefers-reduced-motion: no-preference)'

/** A mouse or trackpad: hover effects only make sense with a pointer that can hover */
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'

const REDUCED_TRANSPARENCY = '(prefers-reduced-transparency: reduce)'
const MAX_AMBIENT_DURATION = 5000

function subscribeTransparency(onChange: () => void) {
  const media = window.matchMedia(REDUCED_TRANSPARENCY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/** CSS keeps text-bearing glass opaque enough even when this preference is unavailable. */
export function usePrefersReducedTransparency() {
  return useSyncExternalStore(
    subscribeTransparency,
    () => window.matchMedia(REDUCED_TRANSPARENCY).matches,
    () => false,
  )
}

/** Tracks intersection and tab visibility, so decorative work can pause in either case. */
export function useInView(
  scope: RefObject<HTMLElement | null>,
  { root = null, rootMargin = '0px', threshold = 0 }: IntersectionObserverInit = {},
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = scope.current
    if (!element) return
    let intersects = false
    const update = () => setInView(intersects && !document.hidden)
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) => {
              const entry = entries.find(({ target }) => target === element)
              if (!entry) return
              intersects = entry.isIntersecting
              update()
            },
            { root, rootMargin, threshold },
          )

    setInView(false)
    if (observer) observer.observe(element)
    else {
      intersects = true
      update()
    }
    document.addEventListener('visibilitychange', update)
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [scope, root, rootMargin, threshold])

  return inView
}

/** Defers optional work until idle, with a bounded fallback in browsers without the API. */
export function useIdle(timeout = 1000) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setIdle(true), Math.min(timeout, 200))
    return () => window.clearTimeout(id)
  }, [timeout])

  return idle
}

/** Stops one activation of decorative motion within five seconds; returns its cleanup. */
export function settleAfter(ms: number, stop: () => void) {
  const duration = Number.isFinite(ms)
    ? Math.max(0, Math.min(ms, MAX_AMBIENT_DURATION))
    : MAX_AMBIENT_DURATION
  const timer = window.setTimeout(stop, duration)
  return () => window.clearTimeout(timer)
}

type ContextSafe = <T extends (...args: never[]) => unknown>(fn: T) => T
type MotionCallback = (contextSafe: ContextSafe) => void | (() => void)

/**
 * Entrance animations may run unless the inline fallback (src/lib/intro.ts) already revealed
 * the page because hydration was slow; content then stays exactly as rendered.
 */
function claimIntro(): boolean {
  window.clearTimeout(window.__introTimer)
  return !document.documentElement.classList.contains('intro-skip')
}

function useMotion(
  callback: MotionCallback,
  scope: RefObject<HTMLElement | null>,
  entrance: boolean,
  query?: string,
) {
  useGSAP(
    (_context, contextSafe) => {
      if (entrance && !claimIntro()) return
      // Reverted (content back to its visible state) when the user turns on reduced motion
      const mm = gsap.matchMedia()
      const condition = query ? `${MOTION_ALLOWED} and ${query}` : MOTION_ALLOWED
      mm.add(condition, () => callback(contextSafe as ContextSafe))
      return () => mm.revert()
    },
    { scope },
  )
}

/** Entrance animations: reveal `[data-intro]` content; skipped under reduced motion. */
export function useEntranceAnimation(
  callback: MotionCallback,
  scope: RefObject<HTMLElement | null>,
) {
  useMotion(callback, scope, true)
}

/** Hover and ambient effects: only run while the user allows motion and `query` matches. */
export function useMotionEffect(
  callback: MotionCallback,
  scope: RefObject<HTMLElement | null>,
  query?: string,
) {
  useMotion(callback, scope, false, query)
}
