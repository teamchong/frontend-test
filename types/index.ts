export enum PlayMode {
  ModePvC,
  ModePvP,
  ModeCvP,
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
  dispatch(action: Actions): void
}

export type Actions =
  | { type: 'SET_PLAY_MODE'; payload: PlayMode }
  | { type: 'MOVE'; payload: number }
  | { type: 'NEXT_GAME' }
  | { type: 'LOAD'; payload: string | undefined }
