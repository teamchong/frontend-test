import { GameStore } from '../types'

export function move(dispatch: GameStore['dispatch'], position: number): void {
  dispatch({ type: 'MOVE', payload: position })
}

export function setPlayMode(
  dispatch: GameStore['dispatch'],
  playMode: GameStore['playMode']
) {
  dispatch({ type: 'SET_PLAY_MODE', payload: playMode })
}

export function load(
  dispatch: GameStore['dispatch'],
  setting?: string | undefined
) {
  dispatch({ type: 'LOAD', payload: setting })
}
