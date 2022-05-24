import { Mutate, StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand'
import { GameStore } from '../types'
import { deserializeStore } from './deserializeStore'
import { serializeStore } from './serializeStore'

declare type PersistHash = <
  Mps extends [StoreMutatorIdentifier, unknown][],
  Mcs extends [StoreMutatorIdentifier, unknown][]
>(
  initializer: StateCreator<GameStore, Mps, Mcs, GameStore>
) => StateCreator<GameStore, Mps, Mcs, GameStore>

export const persistHash: PersistHash = (config) => {
  const output: typeof config = (set, get, api, $$storeMutations) => {
    type MutateSetState = typeof config extends StateCreator<
      GameStore,
      infer Mps,
      infer _Mcs,
      GameStore
    >
      ? Mutate<StoreApi<GameStore>, Mps>
      : undefined
    type GetMutateSetState = 'setState' extends keyof MutateSetState
      ? MutateSetState['setState']
      : undefined
    const setState: GetMutateSetState = (...args) => {
      set!(...args)
      const params = new URLSearchParams(location.hash.replace(/^#/, ''))
      params.set('s', serializeStore(get!()))
      location.hash = '#' + params.toString()
    }
    const configResult = config(setState, get, api, $$storeMutations)

    let stateFromHash: Partial<GameStore> = {}
    try {
      const s = new URLSearchParams(location.hash.replace(/^#/, '')).get('s')
      if (!!s) {
        stateFromHash = deserializeStore(s)
      }
    } catch (error) {
      // prevent error if the location is not defined (e.g. when server side rendering a page)
    }
    return { ...configResult, ...stateFromHash }
  }
  return output
}
