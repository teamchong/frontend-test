import { Actions } from '../types'

export function load(
  dispatch: (action: Actions) => void,
  setting?: string | undefined
) {
  dispatch({ type: 'LOAD', payload: setting })
}
