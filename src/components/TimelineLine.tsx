'use client'

import { useRef } from 'react'
import { Box } from '@mui/material'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

interface TimelineLineProps {
  containerSelector: string
}

export default function TimelineLine({ containerSelector }: TimelineLineProps) {
  const lineRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !lineRef.current) return

      const container = document.querySelector(containerSelector)
      if (!container) return

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 0.5,
          },
        },
      )
    },
    { dependencies: [containerSelector] },
  )

  return (
    <Box
      ref={lineRef}
      sx={{
        position: 'absolute',
        left: { xs: '8px', md: '0px' },
        top: 0,
        bottom: 0,
        width: '2px',
        bgcolor: 'divider',
        transformOrigin: 'top center',
        transform: 'scaleY(0)',
        display: { xs: 'none', md: 'block' },
      }}
    />
  )
}
