import { TIE_PATTERN } from '../constants'
import { GameStatus, PlayMode, Actions, GameStore } from '../types'
import { deserializeStore } from './deserializeStore'
import { gameStatus } from './gameStatus'

export const reducer = (state: GameStore, action: Actions): GameStore => {
  switch (action.type) {
    case 'SET_PLAY_MODE': {
      return {
        ...state,
        playerNo: 0,
        p1Moves: 0b0,
        p2Moves: 0b0,
        playMode: action.payload,
      }
    }

    case 'MOVE': {
      const { playMode, playerNo, p1Moves, p2Moves, pvcRecords, pvpRecords } =
        state
      const position = action.payload
      if (gameStatus(p1Moves!, p2Moves!) !== GameStatus.InProgress) {
        // game ended, reset for next game
        return {
          ...state,
          playerNo: 0,
          p1Moves: 0b0,
          p2Moves: 0b0,
        }
      }

      if (
        position & p1Moves ||
        position & p2Moves ||
        !(position & TIE_PATTERN) ||
        position & ~TIE_PATTERN
      ) {
        // ignore if cell is occupied or invalid move
        return state
      }

      // move and then wait for opponent
      const next: Partial<GameStore> = {
        playerNo: (playerNo + 1) % 2,
        p1Moves: playerNo === 0 ? p1Moves | position : p1Moves,
        p2Moves: playerNo === 1 ? p2Moves | position : p2Moves,
      }
      // if game eneded, added result to records
      const newGameStatus = gameStatus(next.p1Moves!, next.p2Moves!)
      if (newGameStatus !== GameStatus.InProgress) {
        const [p1Victory, p2Victory, tie] =
          playMode === PlayMode.ModePvC ? pvcRecords : pvpRecords
        const field =
          playMode === PlayMode.ModePvC ? 'pvcRecords' : 'pvpRecords'
        switch (newGameStatus) {
          case GameStatus.P1Victory:
            next[field] = [p1Victory + 1, p2Victory, tie]
            break

          case GameStatus.P2Victory:
            next[field] = [p1Victory, p2Victory + 1, tie]
            break

          case GameStatus.Tie:
            next[field] = [p1Victory, p2Victory, tie + 1]
            break
        }
      }
      return { ...state, ...next }
    }

    case 'NEXT_GAME': {
      return { ...state, playerNo: state.playMode === PlayMode.ModePvC ? 0 : 1 }
    }

    case 'LOAD': {
      return { ...state, ...deserializeStore(action.payload) }
    }
  }
}
