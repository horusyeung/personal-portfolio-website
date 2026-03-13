'use client';

import { Box, Container, Typography, Button, Chip, Paper, Stack, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import WebIcon from '@mui/icons-material/Web';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import JavascriptIcon from '@mui/icons-material/Javascript';
import DnsIcon from '@mui/icons-material/Dns';
import ApiIcon from '@mui/icons-material/Api';
import HttpIcon from '@mui/icons-material/Http';
import HubIcon from '@mui/icons-material/Hub';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';
import FolderIcon from '@mui/icons-material/Folder';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import RouterIcon from '@mui/icons-material/Router';
import MemoryIcon from '@mui/icons-material/Memory';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import LoopIcon from '@mui/icons-material/Loop';
import GitHubIcon from '@mui/icons-material/GitHub';
import BuildIcon from '@mui/icons-material/Build';
import BugReportIcon from '@mui/icons-material/BugReport';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EditIcon from '@mui/icons-material/Edit';
import PetsIcon from '@mui/icons-material/Pets';

// ---------- Data ----------

const stats = [
  { value: '6+', label: 'Years Experience' },
  { value: '12+', label: 'Apps Delivered' },
  { value: '4', label: 'Countries' },
];

const skillCategories = [
  {
    title: 'Frontend',
    color: '#0EA5E9',
    skills: [
      { name: 'React.js', icon: CodeIcon },
      { name: 'Next.js', icon: WebIcon },
      { name: 'React Native', icon: PhoneIphoneIcon },
      { name: 'TypeScript', icon: CodeIcon },
      { name: 'JavaScript', icon: JavascriptIcon },
    ],
  },
  {
    title: 'Backend',
    color: '#6366F1',
    skills: [
      { name: 'Node.js', icon: DnsIcon },
      { name: 'Nest.js', icon: ApiIcon },
      { name: 'Express.js', icon: HttpIcon },
      { name: 'GraphQL', icon: HubIcon },
      { name: 'REST APIs', icon: CloudIcon },
    ],
  },
  {
    title: 'Database',
    color: '#10B981',
    skills: [
      { name: 'PostgreSQL', icon: StorageIcon },
      { name: 'MongoDB', icon: FolderIcon },
      { name: 'MySQL', icon: StorageIcon },
    ],
  },
  {
    title: 'Architecture',
    color: '#FF6B35',
    skills: [
      { name: 'Microservices', icon: AccountTreeIcon },
      { name: 'RabbitMQ', icon: SyncAltIcon },
      { name: 'API Gateway', icon: RouterIcon },
      { name: 'Redis', icon: MemoryIcon },
    ],
  },
  {
    title: 'Cloud & DevOps',
    color: '#0EA5E9',
    skills: [
      { name: 'AWS', icon: CloudQueueIcon },
      { name: 'Docker', icon: ViewInArIcon },
      { name: 'CI/CD', icon: LoopIcon },
      { name: 'GitHub Actions', icon: GitHubIcon },
      { name: 'Jenkins', icon: BuildIcon },
    ],
  },
  {
    title: 'Testing',
    color: '#6366F1',
    skills: [
      { name: 'Playwright', icon: BugReportIcon },
      { name: 'Cypress', icon: FactCheckIcon },
      { name: 'Selenium', icon: ScreenSearchDesktopIcon },
      { name: 'Postman', icon: SendIcon },
    ],
  },
  {
    title: 'AI & Tooling',
    color: '#FF6B35',
    skills: [
      { name: 'Claude Code', icon: SmartToyIcon },
      { name: 'Cursor', icon: EditIcon },
      { name: 'CodeRabbit', icon: PetsIcon },
      { name: 'n8n', icon: AccountTreeIcon },
    ],
  },
];

// ---------- Animation keyframes ----------

const fadeInUp = {
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

const animateFadeInUp = (delay: number = 0) => ({
  opacity: 0,
  animation: `fadeInUp 0.7s ease-out ${delay}s forwards`,
});

// ---------- Component ----------

export default function HomePage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const primaryColor = '#A8DCAB';
  const secondaryColor = '#6366F1';

  // Adaptive colors based on theme mode
  const bgMain = isDark ? '#0F172A' : '#FAFBFC';
  const bgCard = isDark
    ? 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.7) 100%)'
    : 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(248,250,252,0.9) 100%)';
  const borderCard = isDark ? 'rgba(51,65,85,0.3)' : 'rgba(203,213,225,0.5)';
  const textPrimary = isDark ? '#F1F5F9' : '#1E293B';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';
  const textMuted = isDark ? '#CBD5E1' : '#94A3B8';

  return (
    <Box sx={fadeInUp}>
      {/* ===== HERO SECTION ===== */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Ambient gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            left: '-10%',
            top: '10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}30 0%, transparent 70%)`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.4,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: '-5%',
            top: '40%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${secondaryColor}25 0%, transparent 70%)`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.3,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '5%',
            left: '30%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 70%)`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.3,
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: 10, textAlign: 'center' }}>
          {/* Overline chip */}
          <Box sx={{ ...animateFadeInUp(0), mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Chip
              label="Software Architect & Team Lead"
              variant="outlined"
              sx={{
                borderColor: `${primaryColor}40`,
                color: primaryColor,
                bgcolor: `${primaryColor}0D`,
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                px: 1,
              }}
            />
          </Box>

          {/* Name */}
          <Typography
            variant="h1"
            sx={{
              ...animateFadeInUp(0.1),
              fontSize: { xs: '3rem', sm: '3.75rem', md: '4.5rem' },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Horus Yeung
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              ...animateFadeInUp(0.2),
              mt: 3,
              mx: 'auto',
              maxWidth: 640,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              lineHeight: 1.7,
              color: textSecondary,
            }}
          >
            Senior Software Architect and Frontend Team Lead with 6+ years building
            high-performance fintech and trading platforms. Shipping full-stack products
            end-to-end, from system design to deployment.
          </Typography>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ ...animateFadeInUp(0.3), mt: 5 }}
          >
            <Button
              component={Link}
              href="/experience"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: primaryColor,
                color: '#1E293B',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '0.875rem',
                boxShadow: `0 8px 25px ${primaryColor}40`,
                '&:hover': {
                  bgcolor: '#90D093',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 35px ${primaryColor}50`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              View Experience
            </Button>
            <Button
              component={Link}
              href="/contact"
              variant="outlined"
              sx={{
                borderColor: borderCard,
                color: textPrimary,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '0.875rem',
                backdropFilter: 'blur(8px)',
                bgcolor: isDark ? 'rgba(30,41,59,0.3)' : 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: `${primaryColor}50`,
                  bgcolor: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.8)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get in Touch
            </Button>
          </Stack>

          {/* Stats Row */}
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ ...animateFadeInUp(0.4), mt: 8, maxWidth: 480, mx: 'auto' }}
          >
            {stats.map((stat) => (
              <Grid size={{ xs: 4 }} key={stat.label}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: primaryColor,
                    fontSize: { xs: '1.75rem', sm: '2rem' },
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: textMuted,
                    fontSize: '0.75rem',
                    mt: 0.5,
                    display: 'block',
                  }}
                >
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== TECH STACK SECTION ===== */}
      <Box component="section" sx={{ py: { xs: 10, md: 12 } }}>
        <Container maxWidth="lg">
          {/* Section header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="Technical Skills"
              variant="outlined"
              sx={{
                borderColor: `${secondaryColor}30`,
                color: secondaryColor,
                bgcolor: `${secondaryColor}0D`,
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                mb: 2,
                px: 1,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                fontSize: { xs: '1.875rem', sm: '2.25rem' },
                fontWeight: 700,
                letterSpacing: '-0.01em',
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Tech Stack
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                mx: 'auto',
                maxWidth: 520,
                color: textSecondary,
              }}
            >
              Technologies and tools I use to architect and deliver scalable products.
            </Typography>
          </Box>

          {/* Skill category cards */}
          <Grid container spacing={3}>
            {skillCategories.map((category) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={category.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: bgCard,
                    border: `1px solid ${borderCard}`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 40px ${category.color}15`,
                      borderColor: `${category.color}30`,
                    },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: category.color,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      mb: 2,
                    }}
                  >
                    {category.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {category.skills.map((skill) => {
                      const IconComponent = skill.icon;
                      return (
                        <Chip
                          key={skill.name}
                          icon={
                            <IconComponent
                              sx={{
                                fontSize: 16,
                                color: `${category.color} !important`,
                              }}
                            />
                          }
                          label={skill.name}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: `${category.color}33`,
                            color: category.color,
                            bgcolor: `${category.color}0D`,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            '& .MuiChip-icon': {
                              ml: '6px',
                            },
                          }}
                        />
                      );
                    })}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== CTA SECTION ===== */}
      <Box component="section" sx={{ position: 'relative', py: { xs: 10, md: 12 } }}>
        {/* Ambient orb behind CTA */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 70%)`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
            opacity: 0.4,
          }}
        />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.875rem', sm: '2.25rem' },
              fontWeight: 700,
              letterSpacing: '-0.01em',
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Let&apos;s Build Something Together
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              mx: 'auto',
              maxWidth: 520,
              color: textSecondary,
            }}
          >
            Currently leading frontend engineering at Juno Markets. Open to discussing
            architecture, collaboration, or new opportunities.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
          >
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              sx={{
                bgcolor: primaryColor,
                color: '#1E293B',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '0.875rem',
                boxShadow: `0 8px 25px ${primaryColor}40`,
                '&:hover': {
                  bgcolor: '#90D093',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 35px ${primaryColor}50`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Contact Me
            </Button>
            <Button
              component={Link}
              href="/projects"
              variant="outlined"
              sx={{
                borderColor: borderCard,
                color: textPrimary,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '0.875rem',
                backdropFilter: 'blur(8px)',
                bgcolor: isDark ? 'rgba(30,41,59,0.3)' : 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: `${primaryColor}50`,
                  bgcolor: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.8)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View Projects
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
