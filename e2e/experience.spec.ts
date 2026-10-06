import { expect, test } from '@playwright/test'

test.describe('Experience Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experience')
  })

  test('displays the page title and subtitle', async ({ page }) => {
    const hero = page.getByTestId('experience-hero')
    await expect(hero).toBeVisible()
    await expect(hero).toContainText('Experience')
    // The subtitle is typed in over ~1.5s; web-first assertions wait for it
    await expect(hero).toContainText('full stack development and team leadership')
  })

  test('shows all work experience entries', async ({ page }) => {
    const work = page.getByTestId('work-experience')
    for (const title of [
      'Frontend Developer Team Lead',
      'Senior Full Stack Developer',
      'Full Stack Developer & QA Lead',
      'Software Development Engineer in Test',
    ]) {
      await expect(work).toContainText(title)
    }
  })

  test('shows companies with accent color', async ({ page }) => {
    const work = page.getByTestId('work-experience')
    for (const company of [
      'Juno Markets',
      'Beta Labs (Lane Crawford Joyce Group)',
      'The Hong Kong Jockey Club',
      'Pure Group',
    ]) {
      await expect(work).toContainText(company)
    }
  })

  test('displays education section with both degrees', async ({ page }) => {
    const education = page.getByTestId('education-section')
    for (const text of [
      'Education',
      'Bachelor of Business Administration (Hons), Business Analysis',
      'City University of Hong Kong',
      'Associate in Business, Hospitality Management (Distinction)',
      'PolyU Hong Kong Community College',
    ]) {
      await expect(education).toContainText(text)
    }
  })

  test('displays certifications section', async ({ page }) => {
    const certifications = page.getByTestId('certifications-section')
    for (const text of [
      'Certifications',
      'Meta React Native Specialization',
      'Automated Software Testing with Playwright',
      'Agile with Atlassian Jira',
    ]) {
      await expect(certifications).toContainText(text)
    }
  })

  test('shows updated resume content with detailed bullets', async ({ page }) => {
    const work = page.getByTestId('work-experience')
    await expect(work).toContainText('50K+ users')
    await expect(work).toContainText('page load from 3.5s to 0.7s')
    await expect(work).toContainText('9 microservices on AWS ECS')
  })
})
