'use client'

import { useRef, useCallback } from 'react'
import { Box, Container, Typography, Chip } from '@mui/material'
import { SiGithub } from 'react-icons/si'
import gsap from 'gsap'
import { createTiltEffect } from '@/lib/animations'
import { useEntranceAnimation, useMotionEffect } from '@/lib/motion'
import MagneticElement from '@/components/MagneticElement'

// ── Data ────────────────────────────────────────────────────────────────────

const githubProjects = [
  // ── Live ────────────────────────────────────────────────────────────────────
  {
    name: 'project-structures',
    description:
      'Production-ready project structures and boilerplates for Next.js, NestJS, React Native, and monorepo architectures used in real-world fintech products.',
    tags: ['reactjs', 'nextjs', 'react-native', 'expo', 'turborepo'],
    url: 'https://github.com/horusyeung/project-structures',
    status: 'Live',
  },
  {
    name: 'personal-portfolio-website',
    description:
      'This portfolio site — built with Next.js 16, React 19, and MUI 7. Clean design with scroll animations, SEO optimized, and full test coverage.',
    tags: ['nextjs', 'reactjs', 'material-ui'],
    url: 'https://github.com/horusyeung/personal-portfolio-website',
    status: 'Live',
  },
  {
    name: 'react-native-starter',
    description:
      'React Native starter template with Expo, navigation, state management, and common mobile patterns. Ready for production mobile app development.',
    tags: ['react-native', 'expo', 'redux-toolkit', 'react-navigation'],
    url: 'https://github.com/horusyeung/react-native-starter',
    status: 'Live',
  },
  {
    name: 'nextjs-nestjs-fullstack-starter',
    description:
      'Full-stack starter template with Next.js frontend and NestJS backend. Includes authentication, database setup, API integration, and deployment configuration.',
    tags: ['nextjs', 'nestjs', 'postgresql', 'prisma', 'docker'],
    url: 'https://github.com/horusyeung/nextjs-nestjs-fullstack-starter',
    status: 'Live',
  },
  // ── Coming Soon ─────────────────────────────────────────────────────────────
  {
    name: 'ai-augmented-dev-workflow',
    description:
      'End-to-end AI-augmented development workflow using agent orchestration. Demonstrates how AI agents collaborate across planning, coding, reviewing, and deployment.',
    tags: ['ai-agents', 'orchestration', 'devops'],
    url: 'https://github.com/horusyeung/ai-augmented-dev-workflow',
    status: 'Coming Soon',
  },
]

// ── Component ───────────────────────────────────────────────────────────────

export default function OpenSourcePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const glowRefs = useRef<(HTMLDivElement | null)[]>([])
  const tagContainerRefs = useRef<(HTMLDivElement | null)[]>([])
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([])

  const setCardRef = useCallback(
    (index: number) => (el: HTMLAnchorElement | null) => {
      cardRefs.current[index] = el
    },
    [],
  )

  const setGlowRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      glowRefs.current[index] = el
    },
    [],
  )

  const setTagContainerRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      tagContainerRefs.current[index] = el
    },
    [],
  )

  const setBadgeRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      badgeRefs.current[index] = el
    },
    [],
  )

  // ── Entrance animations ───────────────────────────────────────────────
  useEntranceAnimation(() => {
    // ── #21: Page title — Diagonal clip-path wipe ───────────────────────
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
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
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
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

    githubProjects.forEach((_project, index) => {
      const card = cardRefs.current[index]
      const tagContainer = tagContainerRefs.current[index]
      if (!card) return

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

    githubProjects.forEach((project, index) => {
      const card = cardRefs.current[index]
      const glow = glowRefs.current[index]
      const badge = badgeRefs.current[index]
      if (!card) return

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
      if (badge && project.status === 'Live') {
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

  return (
    <Box ref={containerRef}>
      {/* ===== HERO SECTION ===== */}
      <Box
        data-testid='open-source-hero'
        component='section'
        sx={{
          bgcolor: 'background.default',
          pt: { xs: '80px', md: '120px' },
          pb: { xs: '40px', md: '60px' },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 680, textAlign: 'center' }}>
          <Typography
            ref={titleRef}
            data-intro
            variant='h1'
            sx={{
              fontSize: { xs: '48px', md: '80px' },
              fontWeight: 700,
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
              color: 'text.primary',
            }}
          >
            Open Source
          </Typography>
          <Typography
            ref={subtitleRef}
            data-intro
            sx={{
              mt: 2,
              mx: 'auto',
              maxWidth: 560,
              fontSize: '21px',
              fontWeight: 400,
              lineHeight: 1.47,
              color: 'text.secondary',
            }}
          >
            Sharing production-tested patterns, starter templates, and development workflows with
            the community.
          </Typography>
        </Container>
      </Box>

      {/* ===== PROJECTS SECTION ===== */}
      <Box
        data-testid='projects-section'
        component='section'
        sx={{
          bgcolor: 'background.default',
          pb: { xs: '80px', md: '120px' },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 780 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {githubProjects.map((project, index) => (
              <Box key={project.name} sx={{ perspective: '800px' }}>
                <Box
                  data-testid={`project-${project.name}`}
                  component='a'
                  href={project.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={project.name}
                  ref={setCardRef(index)}
                  data-intro
                  sx={{
                    display: 'block',
                    position: 'relative',
                    overflow: 'hidden',
                    p: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    transition: 'border-color 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                    },
                  }}
                >
                  {/* Cursor glow overlay (#24) */}
                  <Box
                    ref={setGlowRef(index)}
                    sx={{
                      position: 'absolute',
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      background:
                        'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
                      pointerEvents: 'none',
                      transform: 'translate(-50%, -50%)',
                      opacity: 0,
                      zIndex: 1,
                    }}
                  />

                  {/* Header row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5,
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      {/* #27: GitHub icon — Magnetic pull */}
                      <MagneticElement strength={0.3} radius={80}>
                        <Box sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                          <SiGithub size={20} />
                        </Box>
                      </MagneticElement>
                      <Typography
                        sx={{
                          fontSize: '17px',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {project.name}
                      </Typography>
                    </Box>
                    {/* #26: Status badge with ref */}
                    <Box
                      ref={setBadgeRef(index)}
                      sx={{ display: 'inline-flex', borderRadius: '12px' }}
                    >
                      <Chip
                        label={project.status}
                        size='small'
                        sx={{
                          fontSize: '11px',
                          fontWeight: 600,
                          height: '24px',
                          borderRadius: '12px',
                          bgcolor:
                            project.status === 'Live' ? 'rgba(52, 199, 89, 0.12)' : 'action.hover',
                          // #1d7a35 keeps the green at 4.9:1 on the chip (rgb(52, 199, 89) was 2.0:1)
                          color: project.status === 'Live' ? '#1d7a35' : 'text.secondary',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: 'text.secondary',
                      mb: 2,
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    {project.description}
                  </Typography>

                  {/* Tags (#25) */}
                  <Box
                    ref={setTagContainerRef(index)}
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    {project.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size='small'
                        variant='outlined'
                        className='project-tag'
                        data-intro
                        sx={{
                          fontSize: '12px',
                          fontWeight: 500,
                          height: '26px',
                          borderRadius: '13px',
                          borderColor: 'divider',
                          color: 'text.secondary',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
