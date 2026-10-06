'use client'

import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

declare global {
  interface Window {
    __introTimer?: number
  }
}

const MOTION_ALLOWED = '(prefers-reduced-motion: no-preference)'

/** A mouse or trackpad: hover effects only make sense with a pointer that can hover */
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'

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
