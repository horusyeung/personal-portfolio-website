'use client'

import { Box, Container, Typography, Chip } from '@mui/material'
import { SiGithub } from 'react-icons/si'
import ScrollReveal from '@/components/ScrollReveal'

// ── Data ────────────────────────────────────────────────────────────────────

const githubProjects = [
  // ── Live ────────────────────────────────────────────────────────────────────
  {
    name: 'project-structures',
    description:
      'Production-ready project structures and boilerplates for Next.js, NestJS, React Native, and monorepo architectures used in real-world fintech products.',
    tags: ['React.js', 'Next.js', 'React Native', 'Expo', 'Turborepo'],
    url: 'https://github.com/horusyeung/project-structures',
    status: 'Live',
    iconColor: '#FF9500',
  },
  {
    name: 'personal-portfolio-website',
    description:
      'This portfolio site — built with Next.js 16, React 19, and MUI 7. Clean design with scroll animations, dark/light mode, and full test coverage.',
    tags: ['Next.js', 'React.js', 'MUI'],
    url: 'https://github.com/horusyeung/personal-portfolio-website',
    status: 'Live',
    iconColor: '#34C759',
  },
  {
    name: 'react-native-starter',
    description:
      'React Native starter template with Expo, navigation, state management, and common mobile patterns. Ready for production mobile app development.',
    tags: ['React Native', 'Expo', 'Redux Toolkit', 'React Navigation'],
    url: 'https://github.com/horusyeung/react-native-starter',
    status: 'Live',
    iconColor: '#5AC8FA',
  },
  {
    name: 'nextjs-nestjs-fullstack-starter',
    description:
      'Full-stack starter template with Next.js frontend and NestJS backend. Includes authentication, database setup, API integration, and deployment configuration.',
    tags: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Docker'],
    url: 'https://github.com/horusyeung/nextjs-nestjs-fullstack-starter',
    status: 'Live',
    iconColor: '#007AFF',
  },
  // ── Coming Soon ─────────────────────────────────────────────────────────────
  {
    name: 'ai-augmented-dev-workflow',
    description:
      'End-to-end AI-augmented development workflow using agent orchestration. Demonstrates how AI agents collaborate across planning, coding, reviewing, and deployment.',
    tags: ['AI Agents', 'Orchestration', 'DevOps'],
    url: 'https://github.com/horusyeung/ai-augmented-dev-workflow',
    status: 'Coming Soon',
    iconColor: '#AF52DE',
  },
]

// ── Component ───────────────────────────────────────────────────────────────

export default function OpenSourcePage() {
  return (
    <Box>
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
          <ScrollReveal>
            <Typography
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
          </ScrollReveal>
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
              <ScrollReveal key={project.name} delay={index * 0.1}>
                <Box
                  data-testid={`project-${project.name}`}
                  component='a'
                  href={project.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={project.name}
                  sx={{
                    display: 'block',
                    p: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    transition: 'border-color 0.3s ease, transform 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                    },
                  }}
                >
                  {/* Header row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <SiGithub size={20} style={{ color: project.iconColor }} />
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
                        color: project.status === 'Live' ? 'rgb(52, 199, 89)' : 'text.secondary',
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: 'text.secondary',
                      mb: 2,
                    }}
                  >
                    {project.description}
                  </Typography>

                  {/* Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size='small'
                        variant='outlined'
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
              </ScrollReveal>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
