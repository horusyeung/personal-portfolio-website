'use client'

import { useRef } from 'react'
import { Box, Typography } from '@mui/material'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

interface StatItem {
  value: number
  suffix: string
  label: string
}

const stats: StatItem[] = [
  { value: 6, suffix: '+', label: 'Years' },
  { value: 50, suffix: 'K+', label: 'Users' },
  { value: 12, suffix: '+', label: 'Apps' },
  { value: 4, suffix: '', label: 'Countries' },
]

export default function CountUp() {
  const containerRef = useRef<HTMLDivElement>(null)
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const numbers = numberRefs.current.filter(Boolean) as HTMLSpanElement[]
      if (numbers.length === 0) return

      numbers.forEach((el, i) => {
        const stat = stats[i]
        const obj = { value: 0 }

        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              value: stat.value,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(obj.value) + stat.suffix
              },
            })
          },
        })
      })
    },
    { scope: containerRef },
  )

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 1.5, sm: 2 },
        flexWrap: 'wrap',
      }}
    >
      {stats.map((stat, i) => (
        <Box
          key={stat.label}
          sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}
        >
          <Typography component='span' sx={{ fontSize: '14px', color: 'text.secondary' }}>
            <Box
              component='span'
              ref={(el: HTMLSpanElement | null) => {
                numberRefs.current[i] = el
              }}
            >
              {stat.value + stat.suffix}
            </Box>{' '}
            {stat.label}
          </Typography>
          {i < stats.length - 1 && (
            <Typography component='span' sx={{ fontSize: '14px', color: 'text.secondary' }}>
              &middot;
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  )
}
