import { expect, test } from '@playwright/test'

const PROJECTS = [
  'project-structures',
  'personal-portfolio-website',
  'react-native-starter',
  'nextjs-nestjs-fullstack-starter',
  'ai-augmented-dev-workflow',
]

test.describe('Open Source Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/open-source')
  })

  test('displays the page title', async ({ page }) => {
    const hero = page.getByTestId('open-source-hero')
    await expect(hero).toBeVisible()
    await expect(hero).toContainText('Open Source')
  })

  test('shows all project cards', async ({ page }) => {
    for (const name of PROJECTS) {
      await expect(page.getByTestId(`project-${name}`)).toBeAttached()
    }
  })

  test('shows correct status badges', async ({ page }) => {
    const projects = page.getByTestId('projects-section')
    await expect(projects).toContainText('Live')
    await expect(projects).toContainText('Coming Soon')
  })

  test('project cards link to GitHub', async ({ page }) => {
    const links = page.locator('a[href*="github.com/horusyeung"]')
    await expect.poll(() => links.count()).toBeGreaterThanOrEqual(PROJECTS.length)
  })

  test('shows technology tags on projects', async ({ page }) => {
    const projects = page.getByTestId('projects-section')
    for (const tech of ['Next.js', 'React Native', 'Nest.js']) {
      await expect(projects).toContainText(tech)
    }
  })
})
