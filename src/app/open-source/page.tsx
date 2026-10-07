import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/metadata'
import { Box, Container, Typography } from '@mui/material'
import { githubProjects } from '@/content/projects'
import OpenSourceIntro from './OpenSourceIntro'
import ProjectGallery from './ProjectGallery'

export const metadata: Metadata = {
  title: 'Open Source',
  description:
    'Open source projects by Horus Yeung on GitHub: project structures, starter templates and development workflows.',
  alternates: { canonical: '/open-source' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Open Source | Horus Yeung',
    description:
      'Open source projects by Horus Yeung: project structures, starter templates and development workflows.',
    url: '/open-source',
  },
}

// Server Component: the markup renders on the server and OpenSourceIntro animates it

export default function OpenSourcePage() {
  return (
    <OpenSourceIntro>
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
            Sharing production-tested patterns, starter templates and development workflows with the
            community.
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
          <ProjectGallery projects={githubProjects} />
        </Container>
      </Box>
    </OpenSourceIntro>
  )
}
