import create, { StateCreator, StoreMutatorIdentifier } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { Actions, GameStore, PlayMode } from '../types'
import { reducer } from '../utils/reducer'

const initialState: StateCreator<
  GameStore,
  [[StoreMutatorIdentifier, unknown]],
  [[StoreMutatorIdentifier, unknown]]
> = (set, get) => {
  const dispatch = (action: Actions) =>
    set((state: GameStore) => reducer(state, action))
  return {
    playMode: PlayMode.ModePvC,
    playerNo: 0,
    p1Moves: 0b0,
    p2Moves: 0b0,
    pvcRecords: [0, 0, 0],
    pvpRecords: [0, 0, 0],
    dispatch,
  }
}
export const useGameStore = create(subscribeWithSelector(initialState))
