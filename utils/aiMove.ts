import { GameStatus, GameStore, PlayMode } from '../types'
import { cells } from './cells'
import { gameStatus } from './gameStatus'
import { move } from './move'
import { victoryPattern } from './victoryPattern'

export function aiMove(
  playMode: GameStore['playMode'],
  playerNo: GameStore['playerNo'],
  p1Moves: GameStore['p1Moves'],
  p2Moves: GameStore['p2Moves'],
  dispatch: GameStore['dispatch']
) {
  if (
    (playMode === PlayMode.ModePvC && playerNo !== 1) ||
    (playMode === PlayMode.ModeCvP && playerNo !== 0)
  ) {
    return
  }

  if (gameStatus(p1Moves, p2Moves) !== GameStatus.InProgress) {
    // game ended, let user click for next game
    dispatch({ type: 'NEXT_GAME' })
    return
  }

  // find all non-occupied positions
  const nonOccupied = cells().filter((p) => !((p1Moves | p2Moves) & p))
  const myMoves = playMode === PlayMode.ModePvC ? p2Moves : p1Moves
  const myVictoryMove = nonOccupied.find((p) => victoryPattern(myMoves | p))
  if (myVictoryMove) {
    // end the game with victory
    move(dispatch, myVictoryMove)
    return
  }

  const opponentMoves = playMode === PlayMode.ModePvC ? p1Moves : p2Moves
  const opponentVictoryMove = nonOccupied.find((p) =>
    victoryPattern(opponentMoves | p)
  )
  if (opponentVictoryMove) {
    // prevent lossing the game
    move(dispatch, opponentVictoryMove)
    return
  }

  // random move
  const nextMove = nonOccupied[~~(Math.random() * nonOccupied.length)]
  move(dispatch, nextMove)
}
