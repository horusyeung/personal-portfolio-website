'use client'

import { useRef } from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import Link from 'next/link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { gsap } from '@/lib/gsap'
import ScrollReveal from '@/components/ScrollReveal'
import AboutScrollText from '@/components/AboutScrollText'
import AboutHeading from '@/components/AboutHeading'
import SystemStory from '@/components/SystemStory'
import CtaGlow from '@/components/CtaGlow'
import SkillsShowcase from '@/components/SkillsShowcase'
import { BIO, JOB_TITLE } from '@/content/site'
import { useEntranceAnimation } from '@/lib/motion'

const heroSentenceBreak = BIO.hero.indexOf('. ') + 1

export default function HomeContent() {
  const heroRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const overlineRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEntranceAnimation(() => {
    const tl = gsap.timeline({ delay: 0.2 })
    if (nameRef.current) {
      tl.fromTo(nameRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0)
    }

    // #2 — Overline entrance
    if (overlineRef.current) {
      tl.fromTo(
        overlineRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4',
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
  }, heroRef)

  return (
    <Box>
      {/* ===== HERO SECTION ===== */}
      <Box
        data-testid='hero-section'
        className='home-hero'
        component='section'
        ref={heroRef}
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          willChange: 'transform, opacity',
          // Keep entrance motion within the viewport
          overflowX: 'clip',
        }}
      >
        <div data-testid='hero-background' className='home-hero-background' aria-hidden='true' />
        <Container
          maxWidth={false}
          className='home-hero-content'
          sx={{ maxWidth: 780, textAlign: 'center', py: { xs: 8, md: 10 } }}
        >
          {/* Overline */}
          <Typography
            ref={overlineRef}
            data-intro
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'text.primary',
              mb: 2,
            }}
          >
            {JOB_TITLE}
          </Typography>

          {/* The name stays unframed in the initial HTML. */}
          <Typography
            data-testid='hero-name'
            ref={nameRef}
            data-intro
            variant='h1'
            sx={{
              display: 'inline-block',
              fontSize: { xs: '48px', sm: '56px', md: '80px' },
              fontWeight: 700,
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
              color: 'text.primary',
            }}
          >
            Horus Yeung
          </Typography>

          {/* Keep both sentences visible from the first server render. */}
          <Typography
            className='home-hero-subtitle'
            sx={{
              mt: 3,
              mx: 'auto',
              maxWidth: 600,
              color: 'text.primary',
            }}
          >
            <Box
              component='span'
              sx={{
                display: 'block',
                fontSize: { xs: '19px', md: '21px' },
                fontWeight: 500,
                lineHeight: 1.5,
                textWrap: 'balance',
              }}
            >
              {BIO.hero.slice(0, heroSentenceBreak)}
            </Box>{' '}
            <Box
              component='span'
              sx={{
                display: 'block',
                mt: 1.5,
                mx: 'auto',
                maxWidth: 500,
                fontSize: { xs: '16px', md: '17px' },
                fontWeight: 400,
                lineHeight: 1.6,
                textWrap: 'balance',
              }}
            >
              {BIO.hero.slice(heroSentenceBreak + 1)}
            </Box>
          </Typography>

          {/* CTAs */}
          <Box
            ref={ctaRef}
            data-intro
            sx={{
              mt: 5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 2, sm: 3 },
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
                '&:hover': { bgcolor: 'primary.dark' },
                '@media (prefers-reduced-motion: no-preference)': {
                  transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                  '&:hover': { transform: 'scale(1.03)' },
                  '&:active': { transform: 'scale(0.97)' },
                },
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
              className='home-hero-readable'
              data-testid='cta-contact'
              component={Link}
              href='/contact'
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '17px',
                fontWeight: 400,
                color: 'primary.text',
                textDecoration: 'none',
                borderRadius: '4px',
                '@media (prefers-reduced-motion: no-preference)': {
                  transition: 'gap 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  '&:hover': { gap: 1 },
                  '&:hover .arrow': { transform: 'translateX(4px)' },
                },
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
                aria-hidden
                sx={{
                  display: 'inline-block',
                  '@media (prefers-reduced-motion: no-preference)': {
                    transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  },
                }}
              >
                &rarr;
              </Box>
            </Box>
          </Box>

          {/* Stats */}
          <Box ref={statsRef} data-intro sx={{ mt: 5 }}>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'text.primary',
                letterSpacing: '0.02em',
              }}
            >
              6+ Years &middot; Full Stack
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
          <AboutHeading />
          <AboutScrollText>
            Designed a microservice architecture from scratch. Lead a distributed team of 5
            engineers while coding daily, managing cross-timezone sprints, coding standards and
            CI/CD pipelines. Use AI-augmented development workflows to speed up delivery and raise
            code quality.
          </AboutScrollText>
          <SystemStory />
        </Container>
      </Box>

      {/* ===== TECHNICAL SKILLS SECTION ===== */}
      <Box
        data-testid='skills-section'
        component='section'
        sx={{ bgcolor: 'background.default', py: { xs: '80px', md: '120px' } }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1200 }}>
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

          <SkillsShowcase />
        </Container>
      </Box>

      {/* ===== CTA SECTION ===== */}
      <Box
        data-testid='cta-section'
        component='section'
        sx={{ bgcolor: 'background.paper', py: { xs: '80px', md: '120px' } }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 600, textAlign: 'center' }}>
          <ScrollReveal distance={0}>
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
            <CtaGlow>
              <Box
                component={Link}
                href='/contact'
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '21px',
                  fontWeight: 400,
                  color: 'primary.text',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  '@media (prefers-reduced-motion: no-preference)': {
                    transition: 'gap 0.3s ease',
                    '&:hover': { gap: 1 },
                    '&:hover .arrow': { transform: 'translateX(4px)' },
                  },
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
                  aria-hidden
                  sx={{
                    display: 'inline-block',
                    '@media (prefers-reduced-motion: no-preference)': {
                      transition: 'transform 0.3s ease',
                    },
                  }}
                >
                  &rarr;
                </Box>
              </Box>
            </CtaGlow>
          </ScrollReveal>
        </Container>
      </Box>
    </Box>
  )
}
