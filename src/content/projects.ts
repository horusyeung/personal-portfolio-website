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
      'Production-ready project structures and boilerplates for Next.js, NestJS, React Native, and monorepo architectures used in real-world fintech products.',
    tags: ['reactjs', 'nextjs', 'react-native', 'expo', 'turborepo'],
    url: 'https://github.com/horusyeung/project-structures',
    status: 'Live',
  },
  {
    name: 'personal-portfolio-website',
    description:
      'This portfolio site — built with Next.js 16, React 19, and MUI 7. Clean design with scroll animations, SEO optimized, and full test coverage.',
    tags: ['nextjs', 'reactjs', 'material-ui'],
    url: 'https://github.com/horusyeung/personal-portfolio-website',
    status: 'Live',
  },
  {
    name: 'react-native-starter',
    description:
      'React Native starter template with Expo, navigation, state management, and common mobile patterns. Ready for production mobile app development.',
    tags: ['react-native', 'expo', 'redux-toolkit', 'react-navigation'],
    url: 'https://github.com/horusyeung/react-native-starter',
    status: 'Live',
  },
  {
    name: 'nextjs-nestjs-fullstack-starter',
    description:
      'Full-stack starter template with Next.js frontend and NestJS backend. Includes authentication, database setup, API integration, and deployment configuration.',
    tags: ['nextjs', 'nestjs', 'postgresql', 'prisma', 'docker'],
    url: 'https://github.com/horusyeung/nextjs-nestjs-fullstack-starter',
    status: 'Live',
  },
  // ── Coming Soon ─────────────────────────────────────────────────────────────
  {
    name: 'ai-augmented-dev-workflow',
    description:
      'End-to-end AI-augmented development workflow using agent orchestration. Demonstrates how AI agents collaborate across planning, coding, reviewing, and deployment.',
    tags: ['ai-agents', 'orchestration', 'devops'],
    url: 'https://github.com/horusyeung/ai-augmented-dev-workflow',
    status: 'Coming Soon',
  },
]
