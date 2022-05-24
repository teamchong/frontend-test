import create, { StateCreator, StoreMutatorIdentifier } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { Actions, GameStore, PlayMode } from '../types'
import { reducer } from '../utils/reducer'
import { persist } from 'zustand/middleware'
import { persistHash } from '../utils/persistHash'
import { serializeStore } from '../utils/serializeStore'
import { deserializeStore } from '../utils/deserializeStore'

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
const persisted = persist(
  initialState as unknown as StateCreator<
    GameStore,
    [[StoreMutatorIdentifier, unknown]]
  >,
  {
    name: 'gameState',
    serialize: (state) => serializeStore(state.state),
    deserialize: (str) => ({ state: deserializeStore(str) }),
  }
)
const persistedWithSelector = subscribeWithSelector(
  persistHash(persisted) as unknown as StateCreator<
    GameStore,
    [[StoreMutatorIdentifier, unknown]]
  >
)
export const useGameStore = create(persistedWithSelector)
