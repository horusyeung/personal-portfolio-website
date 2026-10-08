export type StoryScenarioId =
  'web' | 'mobile' | 'microservices' | 'delivery' | 'ai-dev' | 'ai-triage'
export type StoryEdgeKind = 'request' | 'data' | 'cache' | 'event' | 'workflow'

export type StoryNode = {
  id: string
  title: string
  skills: string[]
  alternatives?: string[]
  note?: string
  desktop?: [column: number, row: number, span?: number]
  mobile?: [column: number, row: number, span?: number]
}

export type StoryEdge = {
  from: string
  to: string
  kind: StoryEdgeKind
  label: string
  desktop: { path: string; x: number; y: number }
  mobile: { path: string; x: number; y: number }
}

export type StoryScenario = {
  id: StoryScenarioId
  title: string
  description: string
  nodes: StoryNode[]
  edges: StoryEdge[]
  steps: { edges: string[]; direction: 'request' | 'response' | 'event' | 'workflow' }[]
  expanded?: boolean
  tools?: string[]
  testing?: { title: string; description: string }[]
}

const appEdges = (client: 'web' | 'mobile'): StoryEdge[] => [
  {
    from: client,
    to: 'api',
    kind: 'request',
    label: 'request',
    desktop: { path: 'M201.6 96 H259.2', x: 32, y: 82 },
    mobile: { path: 'M150 120 V160', x: 61, y: 140 },
  },
  {
    from: 'api',
    to: 'data',
    kind: 'data',
    label: 'query',
    desktop: { path: 'M460.8 96 H518.4', x: 68, y: 82 },
    mobile: { path: 'M150 280 V300 H66 V320', x: 32, y: 298 },
  },
  {
    from: 'api',
    to: 'cache',
    kind: 'cache',
    label: 'optional cache',
    desktop: { path: 'M360 160 V184 H619.2 V208', x: 68, y: 176 },
    mobile: { path: 'M150 280 V300 H234 V320', x: 68, y: 298 },
  },
]

const requestSteps = (client: 'web' | 'mobile'): StoryScenario['steps'] => [
  { edges: [`${client}-api`], direction: 'request' },
  { edges: ['api-data'], direction: 'request' },
  { edges: ['api-data'], direction: 'response' },
  { edges: [`${client}-api`], direction: 'response' },
]

const pipeline = (
  id: StoryScenarioId,
  title: string,
  description: string,
  nodes: Omit<StoryNode, 'id'>[],
  labels: string[],
  detail: Pick<StoryScenario, 'tools' | 'testing'> = {},
): StoryScenario => {
  const desktop: [number, number][] = [
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 2],
    [1, 2],
  ]
  const mobile: [number, number][] = [
    [1, 1],
    [2, 1],
    [2, 2],
    [1, 2],
    [1, 3],
    [2, 3],
  ]
  const routes = [
    {
      desktop: { path: 'M201.6 96 H259.2', x: 32, y: 82 },
      mobile: { path: 'M132 60 H168', x: 50, y: 46 },
    },
    {
      desktop: { path: 'M460.8 96 H518.4', x: 68, y: 82 },
      mobile: { path: 'M234 120 V160', x: 88, y: 140 },
    },
    {
      desktop: { path: 'M619.2 160 V208', x: 69, y: 184 },
      mobile: { path: 'M168 220 H132', x: 50, y: 206 },
    },
    {
      desktop: { path: 'M518.4 272 H460.8', x: 68, y: 258 },
      mobile: { path: 'M66 280 V320', x: 12, y: 300 },
    },
    {
      desktop: { path: 'M259.2 272 H201.6', x: 32, y: 258 },
      mobile: { path: 'M132 380 H168', x: 50, y: 366 },
    },
  ]
  return {
    id,
    title,
    description,
    nodes: nodes.map((node, index) => ({
      ...node,
      id: `step${index + 1}`,
      desktop: desktop[index],
      mobile: mobile[index],
    })),
    edges: routes.map((route, index) => ({
      ...route,
      from: `step${index + 1}`,
      to: `step${index + 2}`,
      kind: 'workflow',
      label: labels[index],
    })),
    steps: routes.map((_, index) => ({
      edges: [`step${index + 1}-step${index + 2}`],
      direction: 'workflow',
    })),
    ...detail,
  }
}

const agentTools = ['Codex', 'Claude Code', 'Cursor']
const testingCheckpoints = [
  { title: 'Integration', description: 'Check API, database and service boundaries together.' },
  { title: 'Regression', description: 'Rerun relevant tests to catch broken behavior.' },
  { title: 'Smoke', description: 'Quickly verify critical journeys on the preview build.' },
]

/** Illustrative roles, not a claim about any employer's deployed architecture. */
export const storyScenarios: StoryScenario[] = [
  {
    id: 'web',
    title: 'Web app',
    description:
      'A web request reaches the API, queries PostgreSQL and returns a response. Redis is an optional cache.',
    nodes: [
      { id: 'web', title: 'Web app', skills: ['React.js', 'Next.js'] },
      { id: 'api', title: 'API', skills: ['Nest.js', 'Node.js'] },
      { id: 'data', title: 'Database', skills: ['PostgreSQL'] },
      { id: 'cache', title: 'Cache', skills: ['Redis'] },
    ],
    edges: appEdges('web'),
    steps: requestSteps('web'),
  },
  {
    id: 'mobile',
    title: 'Mobile app',
    description:
      'A mobile client calls the API and receives stored data. SwiftUI and Kotlin are native alternatives; Redis is an optional cache.',
    nodes: [
      {
        id: 'mobile',
        title: 'Mobile app',
        skills: ['React Native'],
        alternatives: ['SwiftUI', 'Kotlin'],
      },
      { id: 'api', title: 'API', skills: ['Nest.js', 'Node.js'] },
      { id: 'data', title: 'Database', skills: ['PostgreSQL'] },
      { id: 'cache', title: 'Cache', skills: ['Redis'] },
    ],
    edges: appEdges('mobile'),
    steps: requestSteps('mobile'),
  },
  {
    id: 'microservices',
    title: 'Microservices',
    expanded: true,
    description:
      'An example order flow: the gateway routes to independent Orders and Catalog services. Orders owns its database and publishes an event to RabbitMQ; a Notifications consumer processes it asynchronously. Catalog storage is omitted for clarity.',
    nodes: [
      {
        id: 'gateway',
        title: 'API gateway',
        skills: ['Nest.js'],
        note: 'Routes client requests',
        desktop: [2, 1],
        mobile: [1, 1, 2],
      },
      {
        id: 'orders',
        title: 'Orders service',
        skills: ['Nest.js'],
        note: 'Producer · owns orders',
        desktop: [1, 2],
        mobile: [1, 2],
      },
      {
        id: 'catalog',
        title: 'Catalog service',
        skills: ['Node.js'],
        note: 'Owns catalog data',
        desktop: [3, 2],
        mobile: [2, 2],
      },
      { id: 'data', title: 'Orders data', skills: ['PostgreSQL'], desktop: [1, 3], mobile: [1, 3] },
      {
        id: 'queue',
        title: 'Message queue',
        skills: ['RabbitMQ'],
        note: 'Order-created event',
        desktop: [2, 3],
        mobile: [2, 3],
      },
      {
        id: 'notifications',
        title: 'Notifications',
        skills: ['Node.js'],
        note: 'Consumer · sends updates',
        desktop: [3, 3],
        mobile: [1, 4, 2],
      },
    ],
    edges: [
      {
        from: 'gateway',
        to: 'orders',
        kind: 'request',
        label: 'request',
        desktop: { path: 'M360 144 V168 H100.8 V192', x: 32, y: 168 },
        mobile: { path: 'M150 100 V120 H66 V140', x: 33, y: 120 },
      },
      {
        from: 'gateway',
        to: 'catalog',
        kind: 'request',
        label: 'request',
        desktop: { path: 'M360 144 V168 H619.2 V192', x: 68, y: 168 },
        mobile: { path: 'M150 100 V120 H234 V140', x: 67, y: 120 },
      },
      {
        from: 'orders',
        to: 'data',
        kind: 'data',
        label: 'query',
        desktop: { path: 'M100.8 304 V352', x: 8, y: 328 },
        mobile: { path: 'M66 240 V280', x: 12, y: 260 },
      },
      {
        from: 'orders',
        to: 'queue',
        kind: 'event',
        label: 'publish',
        desktop: { path: 'M201.6 248 H360 V352', x: 40, y: 234 },
        mobile: { path: 'M132 190 H150 V260 H234 V280', x: 62, y: 260 },
      },
      {
        from: 'queue',
        to: 'notifications',
        kind: 'event',
        label: 'consume',
        desktop: { path: 'M460.8 408 H518.4', x: 68, y: 394 },
        mobile: { path: 'M234 380 V400 H150 V420', x: 66, y: 400 },
      },
    ],
    steps: [
      { edges: ['gateway-orders', 'gateway-catalog'], direction: 'request' },
      { edges: ['orders-data'], direction: 'request' },
      { edges: ['orders-data'], direction: 'response' },
      { edges: ['gateway-orders', 'gateway-catalog'], direction: 'response' },
      { edges: ['orders-queue'], direction: 'event' },
      { edges: ['queue-notifications'], direction: 'event' },
    ],
  },
  pipeline(
    'delivery',
    'CI/CD',
    'Husky runs local pre-commit checks for lint, formatting and unit tests. After a push and pull request, remote CI reruns required checks, builds a preview and runs integration, smoke and end-to-end regression tests. Green checks and engineer approval gate release; failed checks block deployment.',
    [
      { title: 'Local commit', skills: ['Husky'], note: 'Pre-commit: lint · format · unit' },
      { title: 'Pull request', skills: ['GitHub'], note: 'Push branch · open PR' },
      { title: 'CI checks', skills: ['GitHub Actions'], note: 'Lint · types · unit/integration' },
      { title: 'Build & preview', skills: ['Docker'], note: 'Versioned artifact · preview' },
      { title: 'Smoke & E2E', skills: ['Playwright'], note: 'Critical journeys · regression' },
      { title: 'Approve & deploy', skills: ['AWS'], note: 'Green checks · approval · smoke' },
    ],
    ['push', 'trigger', 'pass', 'verify', 'approve'],
    {
      testing: testingCheckpoints.map((checkpoint) =>
        checkpoint.title === 'Smoke'
          ? {
              ...checkpoint,
              description: 'Check critical journeys in preview and after deployment.',
            }
          : checkpoint,
      ),
    },
  ),
  pipeline(
    'ai-dev',
    'AI development',
    'In an agent-first workflow, a Slack request becomes a Jira ticket with scope and acceptance criteria. AI reviews the repository and plans the work; agents implement, run tests and iterate on failures. Verified changes become a linked pull request with test evidence for engineer review, then enter CI/CD.',
    [
      { title: 'Slack intake', skills: ['Slack'], note: 'Request · thread context' },
      { title: 'Jira ticket', skills: ['Jira'], note: 'Scope · acceptance criteria' },
      { title: 'AI review', skills: [], note: 'Inspect repo · plan changes' },
      { title: 'Agentic work', skills: [], note: 'Implement · test · iterate' },
      {
        title: 'Verify changes',
        skills: ['Vitest', 'Playwright'],
        note: 'Integration · regression · smoke',
      },
      {
        title: 'Create PR',
        skills: ['GitHub', 'CodeRabbit'],
        note: 'Linked ticket · diff · test evidence',
      },
    ],
    ['capture', 'assess', 'plan', 'verify', 'handoff'],
    { tools: agentTools, testing: testingCheckpoints },
  ),
  pipeline(
    'ai-triage',
    'AI bug triage',
    'A Slack bug report becomes a Jira issue with reproduction steps and evidence. AI reviews the issue and code to form root-cause hypotheses; an agent reproduces the failure, fixes it and iterates until verification passes. The resulting pull request includes regression evidence for engineer review before CI/CD and release.',
    [
      { title: 'Slack bug', skills: ['Slack'], note: 'Symptoms · thread context' },
      { title: 'Jira issue', skills: ['Jira'], note: 'Repro steps · logs · severity' },
      { title: 'AI review', skills: [], note: 'Evidence · cause hypotheses' },
      { title: 'Agentic repair', skills: [], note: 'Reproduce · fix · iterate' },
      {
        title: 'Verify repair',
        skills: ['Vitest', 'Playwright'],
        note: 'Regression · integration · smoke',
      },
      {
        title: 'Create PR',
        skills: ['GitHub', 'CodeRabbit'],
        note: 'Linked issue · fix · test evidence',
      },
    ],
    ['capture', 'triage', 'plan', 'verify', 'handoff'],
    {
      tools: agentTools,
      testing: testingCheckpoints.map((checkpoint) =>
        checkpoint.title === 'Regression'
          ? {
              ...checkpoint,
              description: 'Reproduce the bug before the fix; keep a test that passes after it.',
            }
          : checkpoint,
      ),
    },
  ),
]
