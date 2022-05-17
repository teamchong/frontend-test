import { test, expect } from '@playwright/test'

test('play some games', async ({ page }) => {
  await page.goto('/#s=1_1_276_73_2_1_3_4_5_6')
  await expect(page).toHaveURL('/#s=1_1_276_73_2_1_3_4_5_6')

  // make sure data has been loaded correctly
  await expect(page.locator('button:has-text("reset") >> nth=-1')).toBeVisible()
  await expect(
    page.locator('button:has-text("Player vs Computer") >> nth=-1')
  ).toHaveClass(/\bbg-white\b/)
  await expect(
    page.locator('button:has-text("Player vs Player") >> nth=-1')
  ).toHaveClass(/\bbg-blue-700\b/)
  await expect(page.locator('button.text-7xl >> nth=0')).toHaveClass(
    /\btext-green-700\b/
  )
  await expect(page.locator('button.text-7xl >> nth=1')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=2')).toHaveClass(
    /\btext-red-700\b/
  )
  await expect(page.locator('button.text-7xl >> nth=3')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=4')).toHaveClass(
    /\btext-green-700\b/
  )
  await expect(page.locator('button.text-7xl >> nth=5')).toHaveClass(
    /\btext-red-700\b/
  )
  await expect(page.locator('button.text-7xl >> nth=6')).toHaveClass(
    /\btext-green-700\b/
  )
  await expect(page.locator('button.text-7xl >> nth=7')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=8')).toHaveClass(
    /\btext-red-700\b/
  )
  await expect(
    page.locator('div:has-text("click any cell to continue") >> nth--1')
  ).toBeDefined()
  await expect(
    page.locator('div.w-20.h-20:has-text("Player 1 (O)") >> nth=-1')
  ).toContainText(/[^\d]4\s*$/)
  await expect(
    page.locator('div.w-20.h-20:has-text("Tie") >> nth=-1')
  ).toContainText(/[^\d]6\s*$/)
  await expect(
    page.locator('div.w-20.h-20:has-text("Player 2 (X)") >> nth=-1')
  ).toContainText(/[^\d]5\s*$/)

  // switch to PvC mode
  await page.locator('button:has-text("Player vs Computer") >> nth=-1').click()

  await expect(page.locator('button.text-7xl >> nth=0')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=1')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=2')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=3')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=4')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=5')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=6')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=7')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=8')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )

  await expect(
    page.locator('div.w-20.h-20:has-text("Player 1 (O)") >> nth=-1')
  ).toContainText(/[^\d]2\s*$/)
  await expect(
    page.locator('div.w-20.h-20:has-text("Tie") >> nth=-1')
  ).toContainText(/[^\d]3\s*$/)
  await expect(
    page.locator('div.w-20.h-20:has-text("Computer (X)") >> nth=-1')
  ).toContainText(/[^\d]1\s*$/)

  // try reset button
  await page.locator('button:has-text("reset") >> nth=-1').click()

  await expect(page.locator('button.text-7xl >> nth=0')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=1')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=2')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=3')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=4')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=5')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=6')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=7')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )
  await expect(page.locator('button.text-7xl >> nth=8')).not.toHaveClass(
    /\b(?:text-green-700|text-red-700)\b/
  )

  await expect(
    page.locator('div.w-20.h-20:has-text("Player 1 (O)") >> nth=-1')
  ).toContainText(/[^\d]0\s*$/)
  await expect(
    page.locator('div.w-20.h-20:has-text("Tie") >> nth=-1')
  ).toContainText(/[^\d]0\s*$/)
  await expect(
    page.locator('div.w-20.h-20:has-text("Computer (X)") >> nth=-1')
  ).toContainText(/[^\d]0\s*$/)

  // switch to PvP mode
  await page.locator('button:has-text("Player vs Player") >> nth=-1').click()

  // p1 win
  await page.locator('button.text-7xl >> nth=0').click() // P1
  await page.locator('button.text-7xl >> nth=3').click() // P2
  await page.locator('button.text-7xl >> nth=1').click() // P1
  await page.locator('button.text-7xl >> nth=4').click() // P2
  await page.locator('button.text-7xl >> nth=2').click() // P1 Win
  await expect(
    page.locator('div.w-20.h-20:has-text("Player 1 (O)") >> nth=-1')
  ).toContainText(/[^\d]1\s*$/)
  await page.locator('button.text-7xl >> nth=0').click() // next game

  // p2 win
  await page.locator('button.text-7xl >> nth=8').click() // P1
  await page.locator('button.text-7xl >> nth=0').click() // P2
  await page.locator('button.text-7xl >> nth=7').click() // P1
  await page.locator('button.text-7xl >> nth=1').click() // P2
  await page.locator('button.text-7xl >> nth=3').click() // P1
  await page.locator('button.text-7xl >> nth=2').click() // P2 Win
  await expect(
    page.locator('div.w-20.h-20:has-text("Player 2 (X)") >> nth=-1')
  ).toContainText(/[^\d]1\s*$/)
  await page.locator('button.text-7xl >> nth=0').click() // next game

  // tie
  await page.locator('button.text-7xl >> nth=0').click() // P1
  await page.locator('button.text-7xl >> nth=1').click() // P2
  await page.locator('button.text-7xl >> nth=3').click() // P1
  await page.locator('button.text-7xl >> nth=4').click() // P2
  await page.locator('button.text-7xl >> nth=7').click() // P1
  await page.locator('button.text-7xl >> nth=6').click() // P2
  await page.locator('button.text-7xl >> nth=2').click() // P1
  await page.locator('button.text-7xl >> nth=5').click() // P2
  await page.locator('button.text-7xl >> nth=8').click() // P1 Tie
  await expect(
    page.locator('div.w-20.h-20:has-text("Tie") >> nth=-1')
  ).toContainText(/[^\d]1\s*$/)

  // switch to PvC mode
  await page.locator('button:has-text("Player vs Computer") >> nth=-1').click()
  await page.locator('button.text-7xl >> nth=0').click() // P1
  await page.waitForTimeout(1000)
  await expect(
    page.locator('div.w-20.h-20:has-text("Player 1 (O)") >> nth=-1')
  ).toHaveClass(/\bborder-dashed\b/)
})