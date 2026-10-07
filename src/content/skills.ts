import type { SkillIconName } from '@/lib/skillIcons'

export type SkillItem = {
  name: string
  icon: SkillIconName
  brandColor?: string
  darkBrandColor?: string
}

export type SkillCategory = {
  title: string
  skills: SkillItem[]
}

// The categories and order follow the CV
export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'TypeScript', icon: 'typescript', brandColor: '#3178C6' },
      { name: 'JavaScript', icon: 'javascript', brandColor: '#F7DF1E' },
      { name: 'Python', icon: 'python', brandColor: '#3776AB' },
      { name: 'SQL', icon: 'sql' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'React.js', icon: 'react', brandColor: '#61DAFB' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'MUI', icon: 'mui', brandColor: '#007FFF' },
      { name: 'SEO', icon: 'seo', brandColor: '#458CF5' },
      { name: 'Google Analytics 4', icon: 'googleAnalytics', brandColor: '#E37400' },
    ],
  },
  {
    title: 'Mobile',
    skills: [
      { name: 'React Native', icon: 'react', brandColor: '#61DAFB' },
      { name: 'SwiftUI', icon: 'swift', brandColor: '#F05138' },
      { name: 'Kotlin', icon: 'kotlin', brandColor: '#7F52FF' },
      { name: 'Firebase', icon: 'firebase', brandColor: '#DD2C00' },
      { name: 'FCM', icon: 'firebase', brandColor: '#DD2C00' },
      { name: 'APNs', icon: 'apple' },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: 'nodejs', brandColor: '#5FA04E' },
      { name: 'Nest.js', icon: 'nestjs', brandColor: '#E0234E' },
      { name: 'GraphQL', icon: 'graphql', brandColor: '#E10098' },
      { name: 'REST APIs', icon: 'restApi' },
      { name: 'RabbitMQ', icon: 'rabbitmq', brandColor: '#FF6600' },
      { name: 'Redis', icon: 'redis', brandColor: '#FF4438' },
      { name: 'Microservices', icon: 'microservices' },
      { name: 'Multi-tenancy', icon: 'multiTenancy' },
    ],
  },
  {
    title: 'Database',
    skills: [
      { name: 'PostgreSQL', icon: 'postgresql', brandColor: '#4169E1' },
      { name: 'MongoDB', icon: 'mongodb', brandColor: '#47A248' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', icon: 'aws', brandColor: '#FF9900' },
      { name: 'Docker', icon: 'docker', brandColor: '#2496ED' },
      { name: 'CI/CD', icon: 'ciCd' },
      { name: 'GitHub Actions', icon: 'githubActions', brandColor: '#2088FF' },
      { name: 'Grafana', icon: 'grafana', brandColor: '#F46800' },
      { name: 'Kibana', icon: 'kibana', brandColor: '#005571' },
    ],
  },
  {
    title: 'Testing',
    skills: [
      { name: 'Jest', icon: 'jest', brandColor: '#C21325' },
      { name: 'Vitest', icon: 'vitest', brandColor: '#6E9F18' },
      { name: 'Playwright', icon: 'playwright', brandColor: '#2EAD33' },
      { name: 'Appium', icon: 'appium', brandColor: '#EE376D' },
      { name: 'XCUITest', icon: 'xcode', brandColor: '#147EFB' },
      { name: 'Selenium', icon: 'selenium', brandColor: '#43B02A' },
      {
        name: 'Tricentis Tosca',
        icon: 'tricentis',
        brandColor: '#12438C',
        darkBrandColor: 'color-mix(in srgb, #12438C 65%, white)',
      },
      { name: 'Postman', icon: 'postman', brandColor: '#FF6C37' },
    ],
  },
  {
    title: 'AI & Tooling',
    skills: [
      { name: 'Claude Code', icon: 'claude', brandColor: '#D97757' },
      { name: 'Codex', icon: 'codex' },
      { name: 'Cursor', icon: 'cursor' },
      { name: 'CodeRabbit', icon: 'coderabbit', brandColor: '#FF570A' },
      { name: 'n8n', icon: 'n8n', brandColor: '#EA4B71' },
    ],
  },
  {
    title: 'Process',
    skills: [
      { name: 'Agile', icon: 'agile' },
      { name: 'Scrum', icon: 'scrum' },
      { name: 'Jira', icon: 'jira', brandColor: '#0052CC' },
    ],
  },
]
