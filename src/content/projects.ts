export type ProjectStatus = 'Live' | 'Coming Soon'

export type GithubProject = {
  name: string
  description: string
  tags: string[]
  url: string
  status: ProjectStatus
}

export const githubProjects: GithubProject[] = [
  // ── Live ────────────────────────────────────────────────────────────────────
  {
    name: 'project-structures',
    description:
      'Production-ready project structures and boilerplates for Next.js, Nest.js, React Native and monorepo setups, used in real fintech products.',
    tags: ['reactjs', 'nextjs', 'react-native', 'expo', 'turborepo'],
    url: 'https://github.com/horusyeung/project-structures',
    status: 'Live',
  },
  {
    name: 'personal-portfolio-website',
    description:
      'The source for this site, built with Next.js 16, React 19 and MUI 9, with GSAP animations, dark mode and Playwright end-to-end tests.',
    tags: ['nextjs', 'reactjs', 'material-ui'],
    url: 'https://github.com/horusyeung/personal-portfolio-website',
    status: 'Live',
  },
  {
    name: 'react-native-starter',
    description:
      'A React Native starter with Expo, navigation, state management and common mobile patterns, ready for production apps.',
    tags: ['react-native', 'expo', 'redux-toolkit', 'react-navigation'],
    url: 'https://github.com/horusyeung/react-native-starter',
    status: 'Live',
  },
  {
    name: 'nextjs-nestjs-fullstack-starter',
    description:
      'A full-stack starter with a Next.js frontend and a Nest.js backend, including authentication, database setup, API integration and deployment config.',
    tags: ['nextjs', 'nestjs', 'postgresql', 'prisma', 'docker'],
    url: 'https://github.com/horusyeung/nextjs-nestjs-fullstack-starter',
    status: 'Live',
  },
  // ── Coming Soon ─────────────────────────────────────────────────────────────
  {
    name: 'ai-augmented-dev-workflow',
    description:
      'An AI-augmented development workflow built on agent orchestration, showing how AI agents work together on planning, coding, review and deployment.',
    tags: ['ai-agents', 'orchestration', 'devops'],
    url: 'https://github.com/horusyeung/ai-augmented-dev-workflow',
    status: 'Coming Soon',
  },
]
