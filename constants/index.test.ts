import { describe, expect, test } from 'vitest'
import { VICTORY_PATTERNS, TIE_PATTERN } from './index'

describe('constant values', () => {
  test('values VICTORY_PATTERNS is unique', () => {
    expect(new Set(VICTORY_PATTERNS).size).toBe(VICTORY_PATTERNS.length)
  })
  test('all VICTORY_PATTERNS filled = TIE_PATTERN', () => {
    expect(VICTORY_PATTERNS.reduce((r, f) => r | f, 0)).toBe(TIE_PATTERN)
  })
})
