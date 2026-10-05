'use client'

import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

declare global {
  interface Window {
    __introTimer?: number
  }
}

const MOTION_ALLOWED = '(prefers-reduced-motion: no-preference)'

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
) {
  useGSAP(
    (_context, contextSafe) => {
      if (entrance && !claimIntro()) return
      // Reverted (content back to its visible state) when the user turns on reduced motion
      const mm = gsap.matchMedia()
      mm.add(MOTION_ALLOWED, () => callback(contextSafe as ContextSafe))
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

/** Hover and ambient effects: only run while the user allows motion. */
export function useMotionEffect(callback: MotionCallback, scope: RefObject<HTMLElement | null>) {
  useMotion(callback, scope, false)
}
