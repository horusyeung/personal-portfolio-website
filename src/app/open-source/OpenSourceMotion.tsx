'use client'

import { useRef, type ReactNode } from 'react'
import { Box } from '@mui/material'
import { gsap } from '@/lib/gsap'
import { createTiltEffect } from '@/lib/animations'
import { useEntranceAnimation, useMotionEffect } from '@/lib/motion'

/**
 * Animates the server-rendered /open-source markup. Targets are found by `data-os`
 * attributes, so the page itself stays a Server Component.
 */
export default function OpenSourceMotion({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const select = (selector: string, root: ParentNode | null = containerRef.current) =>
    root?.querySelector<HTMLElement>(selector) ?? null
  const cards = () =>
    Array.from(containerRef.current?.querySelectorAll<HTMLElement>('[data-os="card"]') ?? [])

  // ── Entrance animations ───────────────────────────────────────────────
  useEntranceAnimation(() => {
    const title = select('[data-os="title"]')
    const subtitle = select('[data-os="subtitle"]')

    // ── #21: Page title — Diagonal clip-path wipe ───────────────────────
    if (title) {
      gsap.fromTo(
        title,
        {
          clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%)',
          opacity: 0,
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          opacity: 1,
          duration: 0.9,
          ease: 'power3.inOut',
        },
      )
    }

    // ── #22: Subtitle — Blur-to-focus fade-up after title ───────────────
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        {
          filter: 'blur(8px)',
          y: 15,
          opacity: 0,
        },
        {
          filter: 'blur(0px)',
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.9,
        },
      )
    }

    cards().forEach((card, index) => {
      const tagContainer = select('[data-os="tags"]', card)

      // ── #23: 3D perspective stagger on scroll ───────────────────────
      gsap.fromTo(
        card,
        {
          rotateY: 8,
          x: 30,
          opacity: 0,
          transformPerspective: 800,
        },
        {
          rotateY: 0,
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: index * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none none',
          },
        },
      )

      // ── #25: Staggered slide-right for tags after card enters ───────
      if (tagContainer) {
        const tags = tagContainer.querySelectorAll('.project-tag')
        if (tags.length > 0) {
          gsap.fromTo(
            tags,
            { x: -20, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
              delay: index * 0.15 + 0.3,
            },
          )
        }
      }
    })
  }, containerRef)

  // ── Hover and ambient effects ─────────────────────────────────────────
  useMotionEffect((contextSafe) => {
    const cleanups: (() => void)[] = []

    cards().forEach((card) => {
      const glow = select('[data-os="glow"]', card)
      const badge = select('[data-os="badge"]', card)

      // ── #24: Hover tilt + cursor glow ───────────────────────────────
      cleanups.push(createTiltEffect(card, 5, contextSafe))

      if (glow) {
        const handleMouseMove = contextSafe((e: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          gsap.to(glow, {
            left: x,
            top: y,
            opacity: 0.15,
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        const handleMouseLeave = contextSafe(() => {
          gsap.to(glow, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
          })
        })

        card.addEventListener('mousemove', handleMouseMove)
        card.addEventListener('mouseleave', handleMouseLeave)
        cleanups.push(() => {
          card.removeEventListener('mousemove', handleMouseMove)
          card.removeEventListener('mouseleave', handleMouseLeave)
        })
      }

      // ── #26: "Live" badge — two glow pulses, then still ─────────────
      // Automatic motion must stop within 5 s (WCAG 2.2.2): 4 × 1 s yoyo = 4 s
      if (badge && badge.dataset.status === 'Live') {
        gsap.to(badge, {
          boxShadow: '0 0 12px 4px rgba(52, 199, 89, 0.5)',
          duration: 1,
          repeat: 3,
          yoyo: true,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play pause resume pause',
          },
        })
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, containerRef)

  return <Box ref={containerRef}>{children}</Box>
}
