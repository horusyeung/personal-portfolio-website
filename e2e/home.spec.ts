import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays the hero section with name and role', async ({ page }) => {
    await expect(page.getByTestId('hero-name')).toHaveText('Horus Yeung')
    await expect(page.getByTestId('hero-name')).toBeVisible()
    await expect(
      page.getByText('Senior Full Stack Developer & Team Lead', { exact: true }),
    ).toBeVisible()
  })

  test('displays the professional summary without company names', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Currently leading')
    await expect(page.getByTestId('hero-section')).toContainText(
      'Senior Full Stack Developer and Team Lead',
    )
  })

  test('shows stats with key metrics', async ({ page }) => {
    await expect(page.getByTestId('hero-section')).toContainText('6+ Years')
    await expect(page.getByTestId('hero-section')).toContainText('Full Stack')
  })

  test('has working navigation to Experience page', async ({ page }) => {
    await page.getByTestId('cta-experience').click()
    await expect(page).toHaveURL(/\/experience$/)
    await expect(page.getByTestId('experience-hero')).toBeVisible()
  })

  test('has working navigation to Contact page', async ({ page }) => {
    await page.getByTestId('cta-contact').click()
    await expect(page).toHaveURL(/\/contact$/)
  })

  test('displays the about section', async ({ page }) => {
    await expect(page.getByTestId('about-section')).toContainText('Building products that scale.')
  })

  test('displays the technical skills section with all categories', async ({ page }) => {
    const skills = page.getByTestId('skills-section')
    await expect(skills).toContainText('Technologies I work with.')
    for (const category of [
      'Frontend',
      'Backend',
      'Database',
      'Mobile',
      'Cloud & DevOps',
      'Testing',
      'AI & Tooling',
      'Process',
    ]) {
      await expect(skills.getByText(category, { exact: true })).toBeAttached()
    }
  })

  test('displays the CTA section', async ({ page }) => {
    await expect(page.getByTestId('cta-section')).toContainText("Let's work together.")
  })
})
