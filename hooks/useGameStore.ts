import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { VICTORY_PATTERNS, TIE_PATTERN } from '../constants'

export enum PlayMode {
  Mode1P,
  Mode2P,
}

export enum GameStatus {
  InProgress,
  P1Victory,
  P2Victory,
  Tie,
}

export type GameRecord = [p1Victory: number, p2Victory: number, tie: number]

export type GameStore = {
  playMode: PlayMode
  playerNo: number
  p1Moves: number
  p2Moves: number
  pvcRecords: GameRecord
  pvpRecords: GameRecord
  cells(): number[]
  victoryPattern(moves: number): number
  gameStatus(p1Moves: number, p2Moves: number): GameStatus
  togglePvC(): void
  move(position: number): void
  aiMove(): void
  load(): void
  // debug(pMoves: number, p2Moves: number): string
}

const defaultState = {
  playerNo: 1,
  p1Moves: 0b0,
  p2Moves: 0b0,
}

export const useGameStore = create(
  subscribeWithSelector<GameStore>((set, get) => ({
    playMode: PlayMode.Mode1P,
    ...defaultState,
    pvcRecords: [0, 0, 0],
    pvpRecords: [0, 0, 0],
    cells: () =>
      Array(9)
        .fill(0)
        .map((_, i) => 1 << (8 - i)),
    victoryPattern: (moves) =>
      VICTORY_PATTERNS.find((p) => (p & moves) === p) ?? 0,
    gameStatus: (p1Moves, p2Moves) => {
      const p1VictoryPattern = get().victoryPattern(p1Moves)
      if (p1VictoryPattern) {
        return GameStatus.P1Victory
      }
      const p2VictoryPattern = get().victoryPattern(p2Moves)
      if (p2VictoryPattern) {
        return GameStatus.P2Victory
      }
      if (((p1Moves | p2Moves) & TIE_PATTERN) === TIE_PATTERN) {
        return GameStatus.Tie
      }
      return GameStatus.InProgress
    },
    togglePvC: () =>
      set(({ playMode }) => ({
        ...defaultState,
        playMode:
          playMode === PlayMode.Mode1P ? PlayMode.Mode2P : PlayMode.Mode1P,
      })),
    move: (position) =>
      set(
        ({ playMode, playerNo, p1Moves, p2Moves, pvcRecords, pvpRecords }) => {
          if (get().gameStatus(p1Moves!, p2Moves!) !== GameStatus.InProgress) {
            // game ended, reset for next game
            return defaultState
          } else if (position & p1Moves || position & p2Moves) {
            // ignore if cell is occupied
            return {}
          } else {
            // move and opponent turn
            const next: Partial<GameStore> = {
              playerNo: 1 + (playerNo % 2),
              p1Moves: playerNo === 1 ? p1Moves | position : p1Moves,
              p2Moves: playerNo === 2 ? p2Moves | position : p2Moves,
            }
            // if game eneded, added result to records
            const newGameStatus = get().gameStatus(next.p1Moves!, next.p2Moves!)
            if (newGameStatus !== GameStatus.InProgress) {
              const [p1Victory, p2Victory, tie] =
                playMode === PlayMode.Mode1P ? pvcRecords : pvpRecords
              const field =
                playMode === PlayMode.Mode1P ? 'pvcRecords' : 'pvpRecords'
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
            return next
          }
        }
      ),
    aiMove: () => {
      const {
        playMode,
        playerNo,
        cells,
        p1Moves,
        p2Moves,
        gameStatus,
        victoryPattern,
        move,
      } = get()
      if (playMode === PlayMode.Mode1P && playerNo !== 1) {
        if (gameStatus(p1Moves, p2Moves) !== GameStatus.InProgress) {
          // game ended, let user click for next game
          set({ playerNo: 1 })
        } else {
          // find all non-occupied positions
          const nonOccupied = cells().filter((p) => !((p1Moves | p2Moves) & p))
          const p2VictoryMove = nonOccupied.find((p) =>
            victoryPattern(p2Moves | p)
          )
          if (p2VictoryMove) {
            // end the game with victory
            move(p2VictoryMove)
          } else {
            const p1VictoryMove = nonOccupied.find((p) =>
              victoryPattern(p1Moves | p)
            )
            if (p1VictoryMove) {
              // prevent lossing the game
              move(p1VictoryMove)
            } else {
              // random move
              const nextMove =
                nonOccupied[~~(Math.random() * nonOccupied.length)]
              move(nextMove)
            }
          }
        }
      }
    },
    load: () =>
      set(() => {
        const parseData = (data: string | null) => {
          try {
            const params = data?.split('!').map((l) => parseInt(l))
            if (params?.length === 10) {
              const [
                playMode,
                playerNo,
                p1Moves,
                p2Moves,
                p1VictoryPvC,
                p2VictoryPvC,
                tiePvC,
                p1VictoryPvP,
                p2VictoryPvP,
                tiePvP,
              ] = params
              return {
                playMode,
                playerNo,
                p1Moves,
                p2Moves,
                pvcRecords: [p1VictoryPvC, p2VictoryPvC, tiePvC],
                pvpRecords: [p1VictoryPvP, p2VictoryPvP, tiePvP],
              }
            }
            return null
          } catch (error) {
            console.error(error)
          }
        }
        return (
          parseData(
            new URLSearchParams(location.hash.replace(/^#/, '')).get('s')
          ) ??
          parseData(localStorage.getItem('gameState')) ??
          {}
        )
      }),
    /* debug: (p1Moves, p2Moves) => {
    return (
      `|${0b100000000 & p1Moves ? 'O' : 0b100000000 & p2Moves ? 'X' : ' '}` +
      `|${0b010000000 & p1Moves ? 'O' : 0b010000000 & p2Moves ? 'X' : ' '}` +
      `|${0b001000000 & p1Moves ? 'O' : 0b001000000 & p2Moves ? 'X' : ' '}
` +
      `|${0b000100000 & p1Moves ? 'O' : 0b000100000 & p2Moves ? 'X' : ' '}` +
      `|${0b000010000 & p1Moves ? 'O' : 0b000010000 & p2Moves ? 'X' : ' '}` +
      `|${0b000001000 & p1Moves ? 'O' : 0b000001000 & p2Moves ? 'X' : ' '}
` +
      `|${0b000000100 & p1Moves ? 'O' : 0b000000100 & p2Moves ? 'X' : ' '}` +
      `|${0b000000010 & p1Moves ? 'O' : 0b000000010 & p2Moves ? 'X' : ' '}` +
      `|${0b000000001 & p1Moves ? 'O' : 0b000000001 & p2Moves ? 'X' : ' '}` +
      '|'
    )
  },*/
  }))
)

useGameStore.subscribe((state) => {
  const data = [
    state.playMode,
    state.playerNo,
    state.p1Moves,
    state.p2Moves,
    ...state.pvcRecords,
    ...state.pvpRecords,
  ].join('!')
  localStorage.setItem('gameState', data)
  const params = new URLSearchParams(location.hash.replace(/^#/, ''))
  params.set('s', data)
  location.hash = '#' + params.toString()
})
