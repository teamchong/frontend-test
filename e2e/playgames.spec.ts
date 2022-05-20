import { test, expect } from '@playwright/test'

test('play some games', async ({ page }) => {
  await page.goto('/#s=1_0_276_73_2_1_3_4_5_6')
  await expect(page).toHaveURL('/#s=1_0_276_73_2_1_3_4_5_6')

  // make sure data has been loaded correctly
  await expect(
    page.locator('main > button:has-text("reset") >> nth=-1')
  ).toBeVisible()
  await expect(
    page.locator('nav > button:has-text("PvC") >> nth=-1')
  ).toHaveClass(/\bbg-white\b/)
  await expect(
    page.locator('nav > button:has-text("PvP") >> nth=-1')
  ).toHaveClass(/\bbg-blue-700\b/)
  await expect(page.locator('#board > button.text-7xl >> nth=0')).toHaveClass(
    /\btext-red-700\b/
  )
  await expect(
    page.locator('#board > button.text-7xl >> nth=1')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(page.locator('#board > button.text-7xl >> nth=2')).toHaveClass(
    /\btext-green-700\b/
  )
  await expect(
    page.locator('#board > button.text-7xl >> nth=3')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(page.locator('#board > button.text-7xl >> nth=4')).toHaveClass(
    /\btext-red-700\b/
  )
  await expect(page.locator('#board > button.text-7xl >> nth=5')).toHaveClass(
    /\btext-green-700\b/
  )
  await expect(page.locator('#board > button.text-7xl >> nth=6')).toHaveClass(
    /\btext-red-700\b/
  )
  await expect(
    page.locator('#board > button.text-7xl >> nth=7')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(page.locator('#board > button.text-7xl >> nth=8')).toHaveClass(
    /\btext-green-700\b/
  )
  await expect(
    page.locator('footer > div:has-text("click to continue") >> nth--1')
  ).toBeDefined()
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Player 1 (X)") >> nth=-1')
  ).toContainText(/[^\d]4\s*$/)
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Tie") >> nth=-1')
  ).toContainText(/[^\d]6\s*$/)
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Player 2 (O)") >> nth=-1')
  ).toContainText(/[^\d]5\s*$/)

  // switch to PvC mode
  await page.locator('nav > button:has-text("PvC") >> nth=-1').click()

  await expect(
    page.locator('#board > button.text-7xl >> nth=0')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=1')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=2')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=3')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=4')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=5')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=6')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=7')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=8')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)

  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Player 1 (X)") >> nth=-1')
  ).toContainText(/[^\d]2\s*$/)
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Tie") >> nth=-1')
  ).toContainText(/[^\d]3\s*$/)
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Computer (O)") >> nth=-1')
  ).toContainText(/[^\d]1\s*$/)

  // try reset button
  await page.locator('main > button:has-text("reset") >> nth=-1').click()

  await expect(
    page.locator('#board > button.text-7xl >> nth=0')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=1')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=2')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=3')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=4')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=5')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=6')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=7')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)
  await expect(
    page.locator('#board > button.text-7xl >> nth=8')
  ).not.toHaveClass(/\b(?:text-red-700|text-green-700)\b/)

  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Player 1 (X)") >> nth=-1')
  ).toContainText(/[^\d]0\s*$/)
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Tie") >> nth=-1')
  ).toContainText(/[^\d]0\s*$/)
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Computer (O)") >> nth=-1')
  ).toContainText(/[^\d]0\s*$/)

  // switch to PvP mode
  await page.locator('nav > button:has-text("PvP") >> nth=-1').click()

  // p1 win
  await page.locator('#board > button.text-7xl >> nth=0').click() // P1
  await page.locator('#board > button.text-7xl >> nth=3').click() // P2
  await page.locator('#board > button.text-7xl >> nth=1').click() // P1
  await page.locator('#board > button.text-7xl >> nth=4').click() // P2
  await page.locator('#board > button.text-7xl >> nth=2').click() // P1 Win
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Player 1 (X)") >> nth=-1')
  ).toContainText(/[^\d]1\s*$/)
  await page.locator('#board > button.text-7xl >> nth=0').click() // next game

  // p2 win
  await page.locator('#board > button.text-7xl >> nth=8').click() // P1
  await page.locator('#board > button.text-7xl >> nth=0').click() // P2
  await page.locator('#board > button.text-7xl >> nth=7').click() // P1
  await page.locator('#board > button.text-7xl >> nth=1').click() // P2
  await page.locator('#board > button.text-7xl >> nth=3').click() // P1
  await page.locator('#board > button.text-7xl >> nth=2').click() // P2 Win
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Player 2 (O)") >> nth=-1')
  ).toContainText(/[^\d]1\s*$/)
  await page.locator('button.text-7xl >> nth=0').click() // next game

  // tie
  await page.locator('#board > button.text-7xl >> nth=0').click() // P1
  await page.locator('#board > button.text-7xl >> nth=1').click() // P2
  await page.locator('#board > button.text-7xl >> nth=3').click() // P1
  await page.locator('#board > button.text-7xl >> nth=4').click() // P2
  await page.locator('#board > button.text-7xl >> nth=7').click() // P1
  await page.locator('#board > button.text-7xl >> nth=6').click() // P2
  await page.locator('#board > button.text-7xl >> nth=2').click() // P1
  await page.locator('#board > button.text-7xl >> nth=5').click() // P2
  await page.locator('#board > button.text-7xl >> nth=8').click() // P1 Tie
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Tie") >> nth=-1')
  ).toContainText(/[^\d]1\s*$/)

  // switch to PvC mode
  await page.locator('nav > button:has-text("PvC") >> nth=-1').click()
  await page.locator('#board > button.text-7xl >> nth=0').click() // P1
  await page.waitForTimeout(500)
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Player 1 (X)") >> nth=-1')
  ).toHaveClass(/\bborder\b/)

  // switch to CvP mode
  await page.locator('nav > button:has-text("CvP") >> nth=-1').click()
  await page.waitForTimeout(500)
  await expect(
    page.locator('footer > div.w-20.h-20:has-text("Player 2 (O)") >> nth=-1')
  ).toHaveClass(/\bborder\b/)
})
