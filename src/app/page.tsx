'use client'

import { useState, useEffect } from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import Link from 'next/link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ScrollReveal from '@/components/ScrollReveal'
import { skillCategories } from '@/lib/skillIcons'

export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setHeroVisible(true)
      return
    }
    const timeout = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  // Staggered animation helper
  const stagger = (index: number) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${index * 0.12}s, transform 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${index * 0.12}s`,
  })

  return (
    <Box>
      {/* ===== HERO SECTION ===== */}
      <Box
        data-testid='hero-section'
        component='section'
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 780,
            textAlign: 'center',
            py: { xs: 8, md: 10 },
          }}
        >
          {/* Overline */}
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'text.secondary',
              mb: 2,
              ...stagger(0),
            }}
          >
            Software Architect & Team Lead
          </Typography>

          {/* Name */}
          <Typography
            data-testid='hero-name'
            variant='h1'
            sx={{
              fontSize: { xs: '48px', sm: '56px', md: '80px' },
              fontWeight: 700,
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
              color: 'text.primary',
              ...stagger(1),
            }}
          >
            Horus Yeung
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              mt: 3,
              mx: 'auto',
              maxWidth: 600,
              fontSize: { xs: '19px', md: '21px' },
              fontWeight: 400,
              lineHeight: 1.47,
              color: 'text.secondary',
              ...stagger(2),
            }}
          >
            Senior Software Architect and Team Lead with 6+ years building high-performance fintech
            and trading platforms. Architect and ship full-stack products end-to-end, from system
            design to deployment.
          </Typography>

          {/* CTAs */}
          <Box
            sx={{
              mt: 5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 2, sm: 3 },
              ...stagger(3),
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
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.03)',
                },
                '&:active': {
                  transform: 'scale(0.97)',
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
                '&:hover': {
                  gap: 1,
                },
                '&:hover .arrow': {
                  transform: 'translateX(4px)',
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
          <Typography
            sx={{
              mt: 5,
              fontSize: '14px',
              color: 'text.secondary',
              ...stagger(4),
            }}
          >
            6+ Years &middot; 50K+ Users &middot; 12+ Apps &middot; 4 Countries
          </Typography>
        </Container>
      </Box>

      {/* ===== ABOUT SECTION ===== */}
      <Box
        data-testid='about-section'
        component='section'
        sx={{
          bgcolor: 'background.paper',
          py: { xs: '80px', md: '120px' },
        }}
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
        sx={{
          bgcolor: 'background.default',
          py: { xs: '80px', md: '120px' },
        }}
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
                  {/* Category title */}
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

                  {/* Skills */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                    }}
                  >
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
                            transition: 'color 0.3s ease',
                            '&:hover': {
                              color: 'text.primary',
                            },
                          }}
                        >
                          <IconComponent
                            size={20}
                            style={{
                              color: skill.brandColor || 'inherit',
                            }}
                          />
                          <Typography
                            component='span'
                            sx={{
                              fontSize: '14px',
                              fontWeight: 400,
                              color: 'inherit',
                            }}
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
        sx={{
          bgcolor: 'background.paper',
          py: { xs: '80px', md: '120px' },
        }}
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
                '&:hover': {
                  gap: 1,
                },
                '&:hover .arrow': {
                  transform: 'translateX(4px)',
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
