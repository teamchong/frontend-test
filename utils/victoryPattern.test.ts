import { VICTORY_PATTERNS } from '../constants'
import { victoryPattern } from './victoryPattern'

describe('victoryPattern', () => {
  test('victoryPattern is 0 when no occupied', () => {
    expect(victoryPattern(0)).toBe(0)
  })
  for (const pattern of VICTORY_PATTERNS) {
    test(
      `victoryPattern is ${pattern.toString(2)} when ` +
        `${pattern.toString(2)} is occupied `,
      () => {
        expect(victoryPattern(pattern)).toBe(pattern)
      }
    )
  }
})
