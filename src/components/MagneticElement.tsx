'use client'

import { useRef, type ReactNode } from 'react'
import { Box, type SxProps, type Theme } from '@mui/material'
import { createMagneticEffect } from '@/lib/animations'
import { FINE_POINTER, useMotionEffect } from '@/lib/motion'

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

  useMotionEffect(
    (contextSafe) => {
      if (!ref.current) return
      return createMagneticEffect(ref.current, strength, radius, contextSafe)
    },
    ref,
    FINE_POINTER,
  )

  return (
    <Box ref={ref} sx={{ display: 'inline-block', ...sx }}>
      {children}
    </Box>
  )
}
