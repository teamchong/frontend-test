import { Actions, PlayMode } from '../types'

export function setPlayMode(
  dispatch: (action: Actions) => void,
  playMode: PlayMode
) {
  dispatch({ type: 'SET_PLAY_MODE', payload: playMode })
}
