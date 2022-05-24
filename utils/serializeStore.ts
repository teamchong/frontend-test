import { GameStore } from '../types'

export function serializeStore(state: GameStore): string {
  return [
    state.playMode,
    state.playerNo,
    state.p1Moves,
    state.p2Moves,
    ...state.pvcRecords,
    ...state.pvpRecords,
  ].join('_')
}
