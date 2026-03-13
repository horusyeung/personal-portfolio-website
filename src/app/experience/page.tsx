'use client';

import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { getGlassSx } from '@/lib/theme';

// ── Data ────────────────────────────────────────────────────────────────────

const experiences = [
  {
    title: 'Frontend Developer Team Lead',
    company: 'Juno Markets',
    location: 'Vancouver, BC (Remote)',
    period: 'Jan 2025 - Present',
    bullets: [
      'Led 5-7 person frontend team across 4 countries (Canada, HK, India, Malaysia)',
      'Maintained trading platform ecosystem serving 15 global markets',
      'Delivered 10 web platforms and 2 mobile apps',
      'Managed AWS infrastructure and CI/CD pipelines',
      'Introduced AI-augmented dev workflows (CodeRabbit, Claude Code, Cursor)',
    ],
  },
  {
    title: 'Frontend Developer Team Lead',
    company: 'Juno Markets',
    location: 'Hong Kong (Remote)',
    period: 'Jan 2024 - Dec 2024',
    bullets: [
      'Delivered complete platform revamp in 6 months (10 web + 2 mobile apps)',
      'Promoted from Senior Full Stack Developer to Team Lead in 6 months',
      'Established coding standards for Next.js, React Native, TypeScript',
      'Owned sprint planning for cross-functional team of 12+',
    ],
  },
  {
    title: 'Senior Full Stack Developer',
    company: 'Juno Markets',
    location: 'Hong Kong (Remote)',
    period: 'Jul 2023 - Dec 2023',
    bullets: [
      'Led complete revamp of trading platform from ground up',
      'Built with React.js, Next.js, Node.js, Nest.js, PostgreSQL, microservices',
      'Led technical hiring for frontend team',
    ],
  },
  {
    title: 'Full Stack Developer & QA Lead',
    company: 'Beta Labs (Lane Crawford Joyce Group)',
    location: 'Hong Kong',
    period: 'Jan 2022 - Jun 2023',
    bullets: [
      "Built e-commerce platforms for Lane Crawford (HK's largest luxury retailer)",
      'Promoted from QA Lead to Full Stack Developer',
      'Automated 80% test coverage with Playwright',
    ],
  },
  {
    title: 'SDET',
    company: 'The Hong Kong Jockey Club',
    location: 'Hong Kong',
    period: 'Mar 2021 - Dec 2021',
    bullets: [
      'Built automated test suites for enterprise trading/betting systems',
    ],
  },
  {
    title: 'SDET',
    company: 'Pure Group',
    location: 'Hong Kong',
    period: 'Jun 2020 - Mar 2021',
    bullets: [
      'Built automated regression tests with Python and Selenium',
    ],
  },
];

const certifications = [
  {
    name: 'Meta React Native Specialization',
    date: 'June 2023',
    icon: 'school' as const,
  },
  {
    name: 'Automated Software Testing with Playwright',
    date: 'June 2023',
    icon: 'verified' as const,
  },
  {
    name: 'Agile with Atlassian Jira',
    date: 'August 2022',
    icon: 'premium' as const,
  },
];

const certIconMap = {
  school: SchoolIcon,
  verified: VerifiedIcon,
  premium: WorkspacePremiumIcon,
} as const;

// ── Component ───────────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const glassSx = getGlassSx(isDark ? 'dark' : 'light', 'standard');

  const gradientText = {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  // Timeline positioning constants
  const timelineLeft = isMobile ? 20 : '50%';
  const dotSize = 16;

  return (
    <Box>
      {/* ===== HERO SECTION ===== */}
      <Box
        component="section"
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
            left: '-10%',
            top: '10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `${theme.palette.primary.main}33`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.3,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: '-5%',
            bottom: '10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `${theme.palette.secondary.main}26`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.3,
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Chip
            label="Career Journey"
            size="small"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.palette.primary.main,
              backgroundColor: `${theme.palette.primary.main}14`,
              border: `1px solid ${theme.palette.primary.main}33`,
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.25rem', sm: '3rem' },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              ...gradientText,
            }}
          >
            Experience
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              maxWidth: 560,
              mx: 'auto',
              color: 'text.secondary',
              lineHeight: 1.7,
            }}
          >
            From quality assurance to software architecture — a trajectory of
            continuous growth and technical leadership.
          </Typography>
        </Container>
      </Box>

      {/* ===== TIMELINE SECTION ===== */}
      <Box component="section" sx={{ py: { xs: 4, md: 6 }, pb: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative' }}>
            {/* Vertical line */}
            <Box
              sx={{
                position: 'absolute',
                left: timelineLeft,
                transform: isMobile ? 'none' : 'translateX(-50%)',
                width: 2,
                height: '100%',
                background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.secondary.main}1A)`,
                zIndex: 0,
              }}
            />

            {/* Timeline entries */}
            {experiences.map((exp, i) => {
              const isLeft = !isMobile && i % 2 === 0;
              const isRight = isMobile || i % 2 !== 0;

              return (
                <Box
                  key={i}
                  sx={{
                    position: 'relative',
                    mb: { xs: 5, md: 6 },
                    '&:last-child': { mb: 0 },
                  }}
                >
                  {/* Timeline dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: timelineLeft,
                      transform: isMobile
                        ? `translateX(-${dotSize / 2}px)`
                        : `translateX(-${dotSize / 2}px)`,
                      top: '2rem',
                      width: dotSize,
                      height: dotSize,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      border: `3px solid ${theme.palette.background.default}`,
                      boxShadow: `0 0 0 3px ${theme.palette.primary.main}33`,
                      zIndex: 10,
                    }}
                  />

                  {/* Card container */}
                  <Box
                    sx={{
                      position: 'relative',
                      // Mobile: always right of the line
                      ...(isMobile && {
                        pl: `${20 + dotSize + 16}px`,
                      }),
                      // Desktop: alternate
                      ...(!isMobile && isLeft && {
                        width: 'calc(50% - 2rem)',
                        mr: 'auto',
                        pr: 6,
                        textAlign: 'right',
                      }),
                      ...(!isMobile && isRight && {
                        width: 'calc(50% - 2rem)',
                        ml: 'auto',
                        pl: 6,
                        textAlign: 'left',
                      }),
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        ...glassSx,
                        borderRadius: 4,
                        p: { xs: 2.5, md: 3 },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 40px ${theme.palette.primary.main}12`,
                          borderColor: `${theme.palette.primary.main}40`,
                        },
                      }}
                    >
                      {/* Period chip */}
                      <Chip
                        label={exp.period}
                        size="small"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          color: theme.palette.primary.main,
                          backgroundColor: `${theme.palette.primary.main}14`,
                          border: `1px solid ${theme.palette.primary.main}33`,
                        }}
                      />

                      {/* Title */}
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          color: 'text.primary',
                        }}
                      >
                        {exp.title}
                      </Typography>

                      {/* Company */}
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          fontWeight: 600,
                          color: theme.palette.secondary.main,
                        }}
                      >
                        {exp.company}
                      </Typography>

                      {/* Location */}
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.25,
                          fontSize: '0.75rem',
                          color: 'text.secondary',
                          opacity: 0.7,
                        }}
                      >
                        {exp.location}
                      </Typography>

                      {/* Bullet points */}
                      <Box
                        component="ul"
                        sx={{
                          mt: 2,
                          listStyle: 'none',
                          p: 0,
                          m: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          ...(!isMobile && isLeft && { alignItems: 'flex-end' }),
                        }}
                      >
                        {exp.bullets.map((bullet, j) => (
                          <Box
                            component="li"
                            key={j}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1,
                              textAlign: 'left',
                              ...(!isMobile && isLeft && {
                                flexDirection: 'row-reverse',
                                textAlign: 'right',
                              }),
                            }}
                          >
                            <Box
                              sx={{
                                mt: '7px',
                                width: 6,
                                height: 6,
                                minWidth: 6,
                                borderRadius: '50%',
                                backgroundColor: `${theme.palette.primary.main}99`,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.8125rem',
                                color: 'text.secondary',
                                lineHeight: 1.6,
                              }}
                            >
                              {bullet}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ===== EDUCATION SECTION ===== */}
      <Box component="section" sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          {/* Section header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Education"
              size="small"
              sx={{
                mb: 3,
                fontWeight: 600,
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: theme.palette.success.main,
                backgroundColor: `${theme.palette.success.main}14`,
                border: `1px solid ${theme.palette.success.main}33`,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                fontWeight: 800,
                letterSpacing: '-0.02em',
                ...gradientText,
              }}
            >
              Academic Background
            </Typography>
          </Box>

          {/* Education card */}
          <Paper
            elevation={0}
            sx={{
              ...glassSx,
              borderRadius: 4,
              p: { xs: 4, md: 5 },
              textAlign: 'center',
              maxWidth: 480,
              mx: 'auto',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${theme.palette.primary.main}12`,
                borderColor: `${theme.palette.primary.main}40`,
              },
            }}
          >
            <SchoolIcon
              sx={{
                fontSize: 40,
                color: theme.palette.primary.main,
                mb: 2,
                opacity: 0.8,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                color: 'text.primary',
              }}
            >
              BBA (Hons) Business Analysis
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontWeight: 600,
                color: theme.palette.secondary.main,
              }}
            >
              City University of Hong Kong
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                fontSize: '0.8125rem',
                color: 'text.secondary',
              }}
            >
              2018 - 2020
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* ===== CERTIFICATIONS SECTION ===== */}
      <Box component="section" sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          {/* Section header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Certifications"
              size="small"
              sx={{
                mb: 3,
                fontWeight: 600,
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: theme.palette.warning.main,
                backgroundColor: `${theme.palette.warning.main}14`,
                border: `1px solid ${theme.palette.warning.main}33`,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                fontWeight: 800,
                letterSpacing: '-0.02em',
                ...gradientText,
              }}
            >
              Professional Certifications
            </Typography>
          </Box>

          {/* Certification cards */}
          <Grid container spacing={3}>
            {certifications.map((cert) => {
              const IconComponent = certIconMap[cert.icon];
              return (
                <Grid size={{ xs: 12, sm: 4 }} key={cert.name}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...glassSx,
                      borderRadius: 4,
                      p: { xs: 3, md: 3.5 },
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 40px ${theme.palette.primary.main}12`,
                        borderColor: `${theme.palette.primary.main}40`,
                      },
                    }}
                  >
                    <IconComponent
                      sx={{
                        fontSize: 32,
                        color: theme.palette.primary.main,
                        mb: 2,
                        opacity: 0.8,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.8125rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {cert.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                      }}
                    >
                      {cert.date}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
