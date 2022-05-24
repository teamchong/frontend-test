import { TIE_PATTERN } from '../constants'
import { GameStatus } from '../types'
import { victoryPattern } from './victoryPattern'

export function gameStatus(p1Moves: number, p2Moves: number): GameStatus {
  const p1VictoryPattern = victoryPattern(p1Moves)
  if (p1VictoryPattern) {
    return GameStatus.P1Victory
  }
  const p2VictoryPattern = victoryPattern(p2Moves)
  if (p2VictoryPattern) {
    return GameStatus.P2Victory
  }
  if (((p1Moves | p2Moves) & TIE_PATTERN) === TIE_PATTERN) {
    return GameStatus.Tie
  }
  return GameStatus.InProgress
}
