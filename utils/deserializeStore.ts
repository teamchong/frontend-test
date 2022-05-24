import { GameStore } from '../types'

export function deserializeStore(str: string | undefined): Partial<GameStore> {
  if (!str) {
    return {}
  }
  const params = str
    .split('_')
    .map((l) => parseInt(l))
    .filter((l) => !isNaN(l))
  if (params.length !== 10) {
    return {}
  }
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
