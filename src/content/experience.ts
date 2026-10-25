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
    location: 'Vancouver, BC and Hong Kong',
    period: 'Jan 2024 – Present',
    bullets: [
      'Lead a 5-person frontend team (sprints, code review, mentoring) and code daily on the admin portals and the mobile apps',
      'With the team, maintain 10 web apps (trading portals, internal portals, CRM, CMS) and 2 mobile apps used by 50K+ users in 15 markets, and own every App Store and Google Play release',
      'Moved Phrase translations from runtime requests to build-time bundles for 12 languages, cutting page load from 3.5s to 0.7s and the Phrase bill from $500/month to $0',
      'Merged 4 admin portals into one Turborepo monorepo with shared packages, cutting duplicated code from about 60% to 15% and onboarding from 1.5 weeks to 3–4 days',
      'Built and ran the AWS deploy pipeline (GitHub Actions, ECR, EC2, ECS, Amplify, CloudWatch alarms to Slack)',
      'Introduced AI-augmented development and bug-triage workflows with Claude Code, Codex and CodeRabbit, turning feature requests and bugs from Slack into Jira tickets and agent-drafted PRs',
      "Built ai-structures, a private Claude Code and Codex plugin used on the team's repos for feature work, unit and UI tests, and code review, with guardrail hooks that block destructive commands and secret file reads",
      'Established coding standards for React.js, Next.js, React Native and TypeScript across the frontend codebase, including naming conventions, file structure and type safety',
      'Owned sprint planning and delivery for a cross-functional team of 20+ (product, design, backend, frontend)',
    ],
  },
  {
    title: 'Senior Full Stack Developer',
    company: 'Juno Markets',
    location: 'Hong Kong',
    period: 'Jul 2023 – Dec 2023',
    bullets: [
      'Hired for mobile development, then moved onto the platform rebuild when the company dropped its third-party vendor. The rebuild covered the trading portals, internal portals, CRM and CMS',
      'Designed the architecture: 9 microservices on AWS ECS, talking over RabbitMQ behind AWS API Gateway, with PostgreSQL on RDS',
      'Built one of the Nest.js services, and the core trading flows shipped in 6 months',
      'Led technical hiring as the frontend team grew from 2 to 5 during the platform rebuild',
    ],
  },
  {
    title: 'Full Stack Developer & QA Engineer',
    company: 'Beta Labs (Lane Crawford Joyce Group)',
    location: 'Hong Kong',
    period: 'Jan 2022 – Sep 2024',
    bullets: [
      "Built e-commerce platforms for Lane Crawford (Hong Kong's largest luxury retailer) with React.js, Next.js, Nest.js, PostgreSQL, MongoDB and GraphQL, including multi-tenant microservices",
      'Rebuilt a native app in React Native while maintaining two native apps (SwiftUI, Kotlin)',
      'Promoted from QA Engineer to Full Stack Developer in April 2023 based on demonstrated full-stack capability',
      'Set up the QA workflow from scratch with Jira, Xray, Playwright (BDD) and Appium test suites, automating about 80% of the manual test cases and running them in CI/CD (GitHub Actions, Jenkins, Tekton) on Microsoft Azure',
      'Hired 2 QA engineers in Taiwan and led test strategy across 5+ concurrent projects',
    ],
  },
  {
    title: 'Software Development Engineer in Test',
    company: 'The Hong Kong Jockey Club',
    location: 'Hong Kong',
    period: 'Mar 2021 – Dec 2021',
    bullets: [
      'Employed by Pactera (HK) Limited and assigned to The Hong Kong Jockey Club.',
      'Built automated test suites in Tricentis Tosca and Python (Selenium, pytest) for enterprise-scale trading and betting systems',
      'Added the automated tests to CI/CD pipelines to raise release quality across teams, and trained teammates on Python and Selenium',
    ],
  },
  {
    title: 'Software Development Engineer in Test',
    company: 'Pure Group',
    location: 'Hong Kong',
    period: 'Jun 2020 – Mar 2021',
    bullets: [
      'Built automated regression tests with Python and Selenium for internal membership and rewards systems',
      'Worked with developers and project managers on test plans covering the membership and rewards platforms',
    ],
  },
]

export const education: Education[] = [
  {
    degree: 'Bachelor of Business Administration (Hons), Business Analysis',
    school: 'City University of Hong Kong',
    period: '2018 – 2020',
  },
  {
    degree: 'Associate in Business, Hospitality Management (Distinction)',
    school: 'PolyU Hong Kong Community College',
    period: '2016 – 2018',
  },
]

export const certifications: Certification[] = [
  { name: 'Meta React Native Specialization', issuer: 'Meta', date: 'June 2023' },
  { name: 'Automated Software Testing with Playwright', issuer: 'Udemy', date: 'June 2023' },
  { name: 'Agile with Atlassian Jira', issuer: 'Atlassian', date: 'August 2022' },
]
