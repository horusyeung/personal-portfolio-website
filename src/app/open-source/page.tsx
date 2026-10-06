import type { Metadata } from 'next'
import { Box, Container, Typography, Chip } from '@mui/material'
import { SiGithub } from 'react-icons/si'
import MagneticElement from '@/components/MagneticElement'
import { githubProjects } from '@/content/projects'
import OpenSourceMotion from './OpenSourceMotion'

export const metadata: Metadata = {
  title: 'Open Source',
  description:
    'Open source projects and contributions by Horus Yeung — project structures, trading tools, and developer utilities on GitHub.',
  alternates: { canonical: '/open-source' },
  openGraph: {
    title: 'Open Source | Horus Yeung',
    description:
      'Open source projects and contributions by Horus Yeung — project structures, trading tools, and developer utilities.',
    url: '/open-source',
  },
}

// Server Component: the markup renders on the server and OpenSourceMotion animates it

export default function OpenSourcePage() {
  return (
    <OpenSourceMotion>
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
            data-os='title'
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
            data-os='subtitle'
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
            {githubProjects.map((project) => (
              <Box key={project.name} sx={{ perspective: '800px' }}>
                <Box
                  data-testid={`project-${project.name}`}
                  component='a'
                  href={project.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={project.name}
                  data-os='card'
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
                    data-os='glow'
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
                    {/* #26: Status badge */}
                    <Box
                      data-os='badge'
                      data-status={project.status}
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
                    data-os='tags'
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
    </OpenSourceMotion>
  )
}
