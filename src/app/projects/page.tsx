'use client';

import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const projects = [
  {
    title: 'SnowVault',
    accent: '#0EA5E9',
    subtitle: 'AI-Powered Snowboarding Highlight Generator',
    description:
      'A social sharing platform that uses AI to automatically generate snowboarding highlight reels from raw footage. Full-stack monorepo architecture with web, mobile, and admin portals sharing a unified backend.',
    tags: ['Next.js', 'React Native', 'NestJS', 'PostgreSQL', 'Prisma', 'Supabase', 'FFmpeg'],
    features: [
      'AI-powered video processing pipeline',
      'Cross-platform mobile & web experience',
      'Real-time social sharing features',
      'Admin dashboard for content moderation',
    ],
  },
  {
    title: 'Juno Markets Trading Platform',
    accent: '#6366F1',
    subtitle: 'Multi-Platform Fintech Ecosystem',
    description:
      'A comprehensive trading platform ecosystem serving 15 global markets. Includes 10 web platforms and 2 mobile applications with real-time market data, account management, and regulatory compliance across multiple jurisdictions.',
    tags: ['React.js', 'Next.js', 'React Native', 'Node.js', 'AWS', 'Microservices', 'RabbitMQ'],
    features: [
      '10 web platforms + 2 mobile apps',
      'Serving 15 global markets',
      'Real-time trading data integration',
      'Multi-jurisdiction regulatory compliance',
    ],
  },
  {
    title: 'Lane Crawford E-Commerce',
    accent: '#FF6B35',
    subtitle: 'Luxury Retail Digital Platform',
    description:
      "Digital commerce platform for Hong Kong's largest luxury retailer. Built high-performance storefronts with seamless shopping experiences, integrated payment systems, and automated testing pipelines achieving 80% coverage.",
    tags: ['React.js', 'Next.js', 'React Native', 'NestJS', 'GraphQL', 'Playwright'],
    features: [
      'High-performance luxury retail storefront',
      'Integrated payment & checkout flows',
      '80% automated test coverage',
      'Cross-platform mobile experience',
    ],
  },
];

const glassmorphicCard = (mode: 'light' | 'dark') =>
  mode === 'dark'
    ? {
        background: 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.7) 100%)',
        border: '1px solid rgba(51,65,85,0.3)',
        backdropFilter: 'blur(12px)',
      }
    : {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(248,250,252,0.8) 100%)',
        border: '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(12px)',
      };

export default function ProjectsPage() {
  return (
    <Box>
      {/* ===== HERO SECTION ===== */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 10, md: 14 },
        }}
      >
        {/* Ambient orbs */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.25,
            left: '60%',
            top: '20%',
            bgcolor: 'rgba(168,220,171,0.3)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: '50%',
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.2,
            left: '-5%',
            top: '50%',
            bgcolor: 'rgba(99,102,241,0.25)',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Chip
            label="Portfolio"
            sx={{
              mb: 3,
              px: 2,
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(168,220,171,0.08)' : 'rgba(168,220,171,0.15)',
              color: '#A8DCAB',
              border: '1px solid rgba(168,220,171,0.25)',
            }}
          />

          <Typography
            variant="h2"
            sx={{
              mt: 2,
              fontWeight: 800,
              fontSize: { xs: '2.25rem', sm: '3rem' },
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #A8DCAB 0%, #6366F1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Projects
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 560,
              mx: 'auto',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.8)' : 'text.secondary',
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}
          >
            A selection of products I&apos;ve architected and shipped — from AI-powered platforms to
            enterprise trading ecosystems.
          </Typography>
        </Container>
      </Box>

      {/* ===== PROJECT CARDS ===== */}
      <Box sx={{ pb: { xs: 8, md: 12 }, pt: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          <Stack spacing={5}>
            {projects.map((project) => (
              <Paper
                key={project.title}
                elevation={0}
                sx={(theme) => ({
                  ...glassmorphicCard(theme.palette.mode),
                  borderRadius: '16px',
                  p: { xs: 3, sm: 4, md: 5 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 60px -15px ${project.accent}22, 0 8px 24px -8px ${project.accent}18`,
                    borderColor: `${project.accent}40`,
                  },
                })}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    gap: { xs: 4, lg: 5 },
                  }}
                >
                  {/* Left content */}
                  <Box sx={{ flex: 1 }}>
                    {/* Title with dot */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: project.accent,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: (theme) =>
                            theme.palette.mode === 'dark' ? '#F1F5F9' : 'text.primary',
                          fontSize: { xs: '1.35rem', sm: '1.5rem' },
                        }}
                      >
                        {project.title}
                      </Typography>
                    </Box>

                    {/* Subtitle */}
                    <Typography
                      sx={{
                        mt: 0.5,
                        ml: 3.5,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: (theme) =>
                          theme.palette.mode === 'dark' ? '#CBD5E1' : 'text.secondary',
                      }}
                    >
                      {project.subtitle}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        mt: 2.5,
                        lineHeight: 1.75,
                        color: (theme) =>
                          theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.8)' : 'text.secondary',
                        fontSize: '0.95rem',
                      }}
                    >
                      {project.description}
                    </Typography>

                    {/* Tags */}
                    <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {project.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            bgcolor: `${project.accent}0D`,
                            color: project.accent,
                            border: `1px solid ${project.accent}30`,
                            borderRadius: '9999px',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Right - features */}
                  <Box sx={{ width: { lg: 280 }, flexShrink: 0 }}>
                    <Typography
                      sx={{
                        mb: 2,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        color: (theme) =>
                          theme.palette.mode === 'dark' ? '#CBD5E1' : 'text.secondary',
                      }}
                    >
                      Key Features
                    </Typography>

                    <Stack spacing={1.5}>
                      {project.features.map((feature) => (
                        <Box
                          key={feature}
                          sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
                        >
                          <CheckCircleIcon
                            sx={{
                              fontSize: 18,
                              mt: '2px',
                              color: project.accent,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              lineHeight: 1.5,
                              color: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'rgba(148,163,184,0.8)'
                                  : 'text.secondary',
                            }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
