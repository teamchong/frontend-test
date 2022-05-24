import { VICTORY_PATTERNS } from '../constants'

export function victoryPattern(moves: number) {
  return VICTORY_PATTERNS.find((p) => (p & moves) === p) ?? 0
}
