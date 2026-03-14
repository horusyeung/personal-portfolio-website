'use client'

import { useRef, type ReactNode } from 'react'
import { Box, type SxProps, type Theme } from '@mui/material'
import { useGSAP } from '@gsap/react'
import { createMagneticEffect, prefersReducedMotion } from '@/lib/animations'

interface MagneticElementProps {
  children: ReactNode
  strength?: number
  radius?: number
  sx?: SxProps<Theme>
}

export default function MagneticElement({
  children,
  strength = 0.3,
  radius = 80,
  sx,
}: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      const cleanup = createMagneticEffect(ref.current, strength, radius)
      return cleanup
    },
    { scope: ref },
  )

  return (
    <Box ref={ref} sx={{ display: 'inline-block', ...sx }}>
      {children}
    </Box>
  )
}
