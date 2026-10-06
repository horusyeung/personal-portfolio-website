export type Experience = {
  title: string
  company: string
  location: string
  period: string
  bullets: string[]
}

export type Education = {
  degree: string
  school: string
  period: string
}

export type Certification = {
  name: string
  issuer: string
  date: string
}

export const experiences: Experience[] = [
  {
    title: 'Frontend Developer Team Lead',
    company: 'Juno Markets',
    location: 'Vancouver, BC',
    period: 'Jan 2025 — Present',
    bullets: [
      'Led a 5–7 person frontend team across 4 countries (Canada, Hong Kong, India, Malaysia), managing cross-timezone sprints, code reviews, and mentoring',
      'Maintained and scaled trading platform ecosystem serving 50K+ users across 15 global markets',
      'Delivered 10 web platforms and 2 mobile apps including trading portals, admin systems, partner management, and CMS',
      'Managed AWS infrastructure (Amplify, ECS, EC2, RDS, S3, Secrets Manager) and established CI/CD deployment pipelines',
      'Introduced AI-augmented workflows (CodeRabbit, Claude Code, Cursor), achieving 80% automated code review coverage and reducing developer costs by 50%',
    ],
  },
  {
    title: 'Frontend Developer Team Lead',
    company: 'Juno Markets',
    location: 'Hong Kong',
    period: 'Jan 2024 — Dec 2024',
    bullets: [
      'Delivered complete platform revamp to production in 6 months, spanning 10 web platforms and 2 mobile apps from architecture to deployment',
      'Promoted from Senior Full Stack Developer to Team Lead within 6 months based on technical ownership and delivery',
      'Cut Phase integration to i18n, reducing page load time by 80% across all client-facing platforms',
      'Consolidated similar admin portals into a monorepo architecture, reducing management overhead and streamlining deployments',
      'Established coding standards for Next.js, React Native, and TypeScript across all frontend teams',
      'Owned sprint planning and delivery for cross-functional team of 12+ with Scrum ceremonies and CI/CD pipelines',
    ],
  },
  {
    title: 'Senior Full Stack Developer',
    company: 'Juno Markets',
    location: 'Hong Kong',
    period: 'Jul 2023 — Dec 2023',
    bullets: [
      'Joined to lead the complete revamp of the Juno Markets trading platform, architecting web app, admin portal, and microservices from the ground up',
      'Built full-stack using React.js, Next.js, Node.js, Nest.js, and PostgreSQL with microservices architecture, REST APIs, RabbitMQ, and API Gateway',
      'Led technical hiring for the frontend team during the platform rebuild phase',
    ],
  },
  {
    title: 'Full Stack Developer & QA Lead',
    company: 'Beta Labs (Lane Crawford Joyce Group)',
    location: 'Hong Kong',
    period: 'Jan 2022 — Jun 2023',
    bullets: [
      "Built e-commerce platforms for Lane Crawford (Hong Kong's largest luxury retailer) using React.js, Next.js, React Native, Nest.js, PostgreSQL, MongoDB, and GraphQL",
      'Promoted from QA Lead to Full Stack Developer based on demonstrated full-stack capability',
      'Automated 80% of test coverage using Playwright, integrating directly into CI/CD pipelines (GitHub Actions, Jenkins, Tekton) on Azure',
      'Led QA team hiring and test strategy across 5+ concurrent projects',
    ],
  },
  {
    title: 'Software Development Engineer in Test',
    company: 'The Hong Kong Jockey Club',
    location: 'Hong Kong',
    period: 'Mar 2021 — Dec 2021',
    bullets: [
      'Built automated test suites (Tosca, Selenium) for enterprise-scale trading and betting systems',
      'Integrated automation into CI/CD pipelines, improving release quality across cross-team deliveries',
    ],
  },
  {
    title: 'Software Development Engineer in Test',
    company: 'Pure Group',
    location: 'Hong Kong',
    period: 'Jun 2020 — Mar 2021',
    bullets: [
      'Built automated regression tests using Python and Selenium for internal membership and rewards systems',
      'Collaborated with developers and project managers to design test plans ensuring coverage across platforms',
    ],
  },
]

export const education: Education[] = [
  {
    degree: 'BBA (Hons) Business Analysis',
    school: 'City University of Hong Kong',
    period: '2018 — 2020',
  },
  {
    degree: 'Associate in Business, Hospitality Management (Distinction)',
    school: 'PolyU Hong Kong Community College',
    period: '2016 — 2018',
  },
]

export const certifications: Certification[] = [
  { name: 'Meta React Native Specialization', issuer: 'Meta', date: 'June 2023' },
  { name: 'Automated Software Testing with Playwright', issuer: 'Udemy', date: 'June 2023' },
  { name: 'Agile with Atlassian Jira', issuer: 'Atlassian', date: 'August 2022' },
]
