import { test, expect } from '@playwright/test'

test('should display ', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/#s=0_1_0_0_1_4_1_6_2_1')
  await expect(page).toHaveURL('/')
  // The new page should contain an h1 with "About Page"
  await expect(page.locator('h3')).toContainText('Hello world!')
})
