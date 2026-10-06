import type { SkillIconName } from '@/lib/skillIcons'

export type SkillItem = {
  name: string
  icon: SkillIconName
  brandColor?: string
}

export type SkillCategory = {
  title: string
  skills: SkillItem[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'TypeScript', icon: 'typescript', brandColor: '#3178C6' },
      { name: 'JavaScript', icon: 'javascript', brandColor: '#F7DF1E' },
      { name: 'Python', icon: 'python', brandColor: '#3776AB' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'React.js', icon: 'react', brandColor: '#61DAFB' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'React Native', icon: 'react', brandColor: '#61DAFB' },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: 'nodejs', brandColor: '#5FA04E' },
      { name: 'Nest.js', icon: 'nestjs', brandColor: '#E0234E' },
      { name: 'Express.js', icon: 'express' },
      { name: 'GraphQL', icon: 'graphql', brandColor: '#E10098' },
      { name: 'REST APIs', icon: 'restApi' },
    ],
  },
  {
    title: 'Database',
    skills: [
      { name: 'PostgreSQL', icon: 'postgresql', brandColor: '#4169E1' },
      { name: 'MongoDB', icon: 'mongodb', brandColor: '#47A248' },
      { name: 'MySQL', icon: 'mysql', brandColor: '#4479A1' },
    ],
  },
  {
    title: 'Architecture',
    skills: [
      { name: 'Microservices', icon: 'microservices' },
      { name: 'RabbitMQ', icon: 'rabbitmq', brandColor: '#FF6600' },
      { name: 'API Gateway', icon: 'apiGateway' },
      { name: 'Redis', icon: 'redis', brandColor: '#FF4438' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', icon: 'aws', brandColor: '#FF9900' },
      { name: 'Docker', icon: 'docker', brandColor: '#2496ED' },
      { name: 'CI/CD', icon: 'ciCd' },
      { name: 'GitHub Actions', icon: 'githubActions', brandColor: '#2088FF' },
      { name: 'Jenkins', icon: 'jenkins', brandColor: '#D24939' },
    ],
  },
  {
    title: 'Testing',
    skills: [
      { name: 'Playwright', icon: 'playwright', brandColor: '#2EAD33' },
      { name: 'Cypress', icon: 'cypress', brandColor: '#69D3A7' },
      { name: 'Selenium', icon: 'selenium', brandColor: '#43B02A' },
      { name: 'Postman', icon: 'postman', brandColor: '#FF6C37' },
    ],
  },
  {
    title: 'AI & Tooling',
    skills: [
      { name: 'Claude Code', icon: 'claude', brandColor: '#D97757' },
      { name: 'Cursor', icon: 'cursor', brandColor: '#00B4D8' },
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
