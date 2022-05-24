import { GameStore } from '../types'

export function move(dispatch: GameStore['dispatch'], position: number): void {
  dispatch({ type: 'MOVE', payload: position })
}
