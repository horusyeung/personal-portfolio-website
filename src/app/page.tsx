'use client'

import { useRef } from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import Link from 'next/link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import ScrollReveal from '@/components/ScrollReveal'
import { skillCategories } from '@/lib/skillIcons'
import { splitTextIntoChars, prefersReducedMotion } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const overlineRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(
        [
          nameRef.current,
          overlineRef.current,
          subtitleRef.current,
          ctaRef.current,
          statsRef.current,
        ],
        { opacity: 1, y: 0 },
      )
      return
    }

    const tl = gsap.timeline({ delay: 0.2 })

    // #1 — Name char-by-char stagger
    if (nameRef.current) {
      const chars = splitTextIntoChars(nameRef.current)
      gsap.set(chars, { opacity: 0, y: 24, rotation: 3 })
      gsap.set(nameRef.current, { opacity: 1 })
      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power3.out',
      })
    }

    // #2 — Overline from left, subtitle from right
    if (overlineRef.current) {
      tl.fromTo(
        overlineRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4',
      )
    }
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6',
      )
    }

    // #3 — CTA buttons scale-spring
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' },
        '-=0.4',
      )
    }

    // #4 — Stats fade in
    if (statsRef.current) {
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3',
      )
    }

    // #5 — Hero parallax fade-out on scroll
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        opacity: 0,
        scale: 0.95,
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }
  })

  return (
    <Box>
      {/* ===== HERO SECTION ===== */}
      <Box
        data-testid='hero-section'
        component='section'
        ref={heroRef}
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          willChange: 'transform, opacity',
        }}
      >
        <Container
          maxWidth={false}
          sx={{ maxWidth: 780, textAlign: 'center', py: { xs: 8, md: 10 } }}
        >
          {/* Overline */}
          <Typography
            ref={overlineRef}
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'text.secondary',
              mb: 2,
              opacity: 0,
            }}
          >
            Software Architect & Team Lead
          </Typography>

          {/* Name */}
          <Typography
            data-testid='hero-name'
            ref={nameRef}
            variant='h1'
            sx={{
              fontSize: { xs: '48px', sm: '56px', md: '80px' },
              fontWeight: 700,
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
              color: 'text.primary',
              opacity: 0,
            }}
          >
            Horus Yeung
          </Typography>

          {/* Subtitle */}
          <Typography
            ref={subtitleRef}
            sx={{
              mt: 3,
              mx: 'auto',
              maxWidth: 600,
              fontSize: { xs: '19px', md: '21px' },
              fontWeight: 400,
              lineHeight: 1.47,
              color: 'text.secondary',
              opacity: 0,
            }}
          >
            Senior Software Architect and Team Lead with 6+ years building high-performance fintech
            and trading platforms. Architect and ship full-stack products end-to-end, from system
            design to deployment.
          </Typography>

          {/* CTAs */}
          <Box
            ref={ctaRef}
            sx={{
              mt: 5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 2, sm: 3 },
              opacity: 0,
            }}
          >
            <Button
              data-testid='cta-experience'
              component={Link}
              href='/experience'
              variant='contained'
              disableElevation
              endIcon={<ArrowForwardIcon sx={{ fontSize: '18px !important' }} />}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 600,
                fontSize: '17px',
                textTransform: 'none',
                borderRadius: '980px',
                px: 4,
                py: 1.5,
                transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.03)' },
                '&:active': { transform: 'scale(0.97)' },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                },
              }}
            >
              View Experience
            </Button>
            <Box
              data-testid='cta-contact'
              component={Link}
              href='/contact'
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '17px',
                fontWeight: 400,
                color: 'primary.main',
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'gap 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                '&:hover': { gap: 1 },
                '&:hover .arrow': { transform: 'translateX(4px)' },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                },
              }}
            >
              Get in Touch
              <Box
                component='span'
                className='arrow'
                sx={{
                  transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  display: 'inline-block',
                }}
              >
                &rarr;
              </Box>
            </Box>
          </Box>

          {/* Stats */}
          <Box ref={statsRef} sx={{ mt: 5, opacity: 0 }}>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'text.secondary',
                letterSpacing: '0.02em',
              }}
            >
              6+ Years &middot; Full-Stack
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ===== ABOUT SECTION ===== */}
      <Box
        data-testid='about-section'
        component='section'
        sx={{ bgcolor: 'background.paper', py: { xs: '80px', md: '120px' } }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 780 }}>
          <ScrollReveal>
            <Typography
              variant='h2'
              sx={{
                fontSize: { xs: '40px', md: '56px' },
                fontWeight: 700,
                letterSpacing: '-0.015em',
                lineHeight: 1.07,
                color: 'text.primary',
              }}
            >
              Building products that scale.
            </Typography>
            <Typography
              sx={{
                mt: 3,
                maxWidth: 640,
                fontSize: '21px',
                fontWeight: 400,
                lineHeight: 1.47,
                color: 'text.secondary',
              }}
            >
              Lead distributed engineering teams of 5–7 across 4 countries, managing cross-timezone
              sprints, coding standards, and CI/CD pipelines. Leverage AI-augmented development
              workflows to accelerate delivery velocity and code quality.
            </Typography>
          </ScrollReveal>
        </Container>
      </Box>

      {/* ===== TECHNICAL SKILLS SECTION ===== */}
      <Box
        data-testid='skills-section'
        component='section'
        sx={{ bgcolor: 'background.default', py: { xs: '80px', md: '120px' } }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 780 }}>
          <ScrollReveal>
            <Typography
              variant='h2'
              sx={{
                fontSize: { xs: '40px', md: '56px' },
                fontWeight: 700,
                letterSpacing: '-0.015em',
                lineHeight: 1.07,
                color: 'text.primary',
                textAlign: 'center',
                mb: { xs: 6, md: 8 },
              }}
            >
              Technologies I work with.
            </Typography>
          </ScrollReveal>

          <Box>
            {skillCategories.map((category, index) => (
              <ScrollReveal key={category.title} delay={index * 0.1}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '180px 1fr' },
                    gap: { xs: 1, md: 4 },
                    py: '20px',
                    borderBottom: index < skillCategories.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'text.secondary',
                      pt: { md: '2px' },
                    }}
                  >
                    {category.title}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {category.skills.map((skill) => {
                      const IconComponent = skill.icon
                      return (
                        <Box
                          key={skill.name}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            mr: '20px',
                            mb: '8px',
                            color: 'text.secondary',
                            cursor: 'default',
                            transition: 'color 0.3s ease',
                            '&:hover': { color: 'text.primary' },
                          }}
                        >
                          <IconComponent
                            size={20}
                            style={{ color: skill.brandColor || 'inherit' }}
                          />
                          <Typography
                            component='span'
                            sx={{ fontSize: '14px', fontWeight: 400, color: 'inherit' }}
                          >
                            {skill.name}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </ScrollReveal>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ===== CTA SECTION ===== */}
      <Box
        data-testid='cta-section'
        component='section'
        sx={{ bgcolor: 'background.paper', py: { xs: '80px', md: '120px' } }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 600, textAlign: 'center' }}>
          <ScrollReveal>
            <Typography
              variant='h2'
              sx={{
                fontSize: { xs: '40px', md: '56px' },
                fontWeight: 700,
                letterSpacing: '-0.015em',
                lineHeight: 1.07,
                color: 'text.primary',
              }}
            >
              Let&apos;s work together.
            </Typography>
            <Typography
              sx={{
                mt: 2,
                fontSize: '21px',
                fontWeight: 400,
                lineHeight: 1.47,
                color: 'text.secondary',
              }}
            >
              Have a project in mind or want to discuss architecture? I&apos;d love to hear from
              you.
            </Typography>
            <Box
              component={Link}
              href='/contact'
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 3,
                fontSize: '21px',
                fontWeight: 400,
                color: 'primary.main',
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'gap 0.3s ease',
                '&:hover': { gap: 1 },
                '&:hover .arrow': { transform: 'translateX(4px)' },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                },
              }}
            >
              Get in touch
              <Box
                component='span'
                className='arrow'
                sx={{ transition: 'transform 0.3s ease', display: 'inline-block' }}
              >
                &rarr;
              </Box>
            </Box>
          </ScrollReveal>
        </Container>
      </Box>
    </Box>
  )
}
