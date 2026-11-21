import type { Page } from '@playwright/test'

export async function openMainNavigation(page: Page) {
  const navigation = page.getByRole('navigation', { name: 'Main', includeHidden: true })
  const menu = page.getByRole('button', { name: 'Main menu' })
  if ((await menu.isVisible()) && !(await navigation.isVisible())) await menu.click()
  return navigation
}

export async function clickNavLink(page: Page, link: string) {
  await openMainNavigation(page)
  await page.getByTestId(`nav-link-${link}`).click()
}
