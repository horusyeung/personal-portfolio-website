'use client'

import { useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { useEntranceAnimation } from '@/lib/motion'

/** Owns only the hero entrance; project interaction has a separate lifecycle. */
export default function OpenSourceIntro({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEntranceAnimation(() => {
    const title = rootRef.current?.querySelector('[data-os="title"]')
    const subtitle = rootRef.current?.querySelector('[data-os="subtitle"]')
    if (title) {
      gsap.fromTo(
        title,
        { clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%)', opacity: 0 },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          opacity: 1,
          duration: 0.9,
          ease: 'power3.inOut',
        },
      )
    }
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { filter: 'blur(8px)', y: 15, opacity: 0 },
        { filter: 'blur(0px)', y: 0, opacity: 1, duration: 0.8, delay: 0.9, ease: 'power2.out' },
      )
    }
  }, rootRef)

  return <div ref={rootRef}>{children}</div>
}
