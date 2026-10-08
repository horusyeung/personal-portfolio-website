'use client'

import { useRef } from 'react'
import { Box } from '@mui/material'
import { gsap } from '@/lib/gsap'
import { useEntranceAnimation } from '@/lib/motion'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  distance?: number
  duration?: number
}

export default function ScrollReveal({
  children,
  delay = 0,
  distance = 30,
  duration = 0.6,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const animation = useRef<gsap.core.Tween | null>(null)
  const finishReveal = () => {
    const reveal = animation.current
    reveal?.scrollTrigger?.kill(false, true)
    reveal?.progress(1).pause()
  }

  useEntranceAnimation(() => {
    if (!ref.current) return

    animation.current = gsap.fromTo(
      ref.current,
      { opacity: 0, y: distance },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      },
    )
    if (ref.current.contains(document.activeElement)) finishReveal()
    return () => {
      animation.current = null
    }
  }, ref)

  return (
    <Box ref={ref} data-intro onFocusCapture={finishReveal}>
      {children}
    </Box>
  )
}
