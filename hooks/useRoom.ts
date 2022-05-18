import { MutableRefObject, useEffect, useRef, useState } from 'react'
import shallow from 'zustand/shallow'
import { GameStore, getParams, PlayMode, useGameStore } from './useGameStore'

export const ROOM_API_BASE_URL = 'https://keyvalue.immanuel.co/api/KeyVal'

export async function createRoom(): Promise<string> {
  const response = await fetch(`${ROOM_API_BASE_URL}/GetAppKey`)
  const payload = await response.json()
  return `${payload}`
}

// create a new room and initialize state
export function loadNewRoom(
  room: MutableRefObject<string>,
  version: MutableRefObject<number>
) {
  return async function () {
    try {
      const newRoom = await createRoom()
      const isCreated = setRemoteState(
        newRoom,
        version.current,
        useGameStore.getState().serialize()
      )
      if (newRoom && isCreated) {
        room.current = newRoom
        const params = getParams()
        params.set('r', newRoom)
        location.hash = '#' + params.toString()
      }
    } catch (error) {
      console.error(error)
    }
    setTimeout(polling(room, version), 100)
  }
}

export async function getRemoteState(
  room: string
): Promise<[number | null, string | null]> {
  const response = await fetch(`${ROOM_API_BASE_URL}/GetValue/${room}/g`)
  const payload = await response.json()
  const result = /^(\d+)_(.+)$/.exec(payload)
  if (result) {
    const newVersion = parseInt(result[1])
    return [newVersion, result[2]]
  }
  return [null, null]
}

export async function setRemoteState(
  room: string,
  version: number,
  gameState: string
): Promise<boolean> {
  const payload = await fetch(
    `${ROOM_API_BASE_URL}/UpdateValue/${room}/g/${encodeURIComponent(
      version + '_' + gameState
    )}`,
    { method: 'POST' }
  )
  return !!(await payload.json())
}

export function gameStateSubscription(
  room: MutableRefObject<string>,
  version: MutableRefObject<number>
) {
  return async (state: GameStore, prevState?: GameStore): Promise<void> => {
    if (shallow(state, prevState)) {
      return
    }
    if (state.playMode !== PlayMode.ModePvP) {
      return
    }
    try {
      const [remoteVersion] = await getRemoteState(room.current)
      if (remoteVersion !== null && remoteVersion > version.current) {
        return
      }
      version.current++
      await setRemoteState(room.current, version.current, state.serialize())
    } catch (error) {
      console.error(error)
    }
  }
}

// retrieve latest state from server, override if version is the same or higher
export function polling(
  room: MutableRefObject<string>,
  version: MutableRefObject<number>
) {
  async function internal() {
    try {
      if (room && useGameStore.getState().playMode === PlayMode.ModePvP) {
        const [remoteVersion, remoteGameState] = await getRemoteState(
          room.current
        )
        if (
          remoteVersion !== null &&
          remoteVersion > version.current &&
          remoteGameState !== null &&
          remoteGameState !== useGameStore.getState().serialize()
        ) {
          const unsub = useGameStore.subscribe(
            (s) => s,
            () => {
              version.current = remoteVersion
              unsub()
            },
            { fireImmediately: true }
          )
          useGameStore.getState().load(remoteGameState)
        }
      }
    } catch (error) {
      console.error(error)
    }
    setTimeout(() => internal(), 100)
  }
  return internal
}

export function useRoom(
  initial?: string
): [MutableRefObject<string>, MutableRefObject<number>] {
  const room = useRef('')
  const version = useRef(0)
  useEffect(() => {
    // subscibe to local state change, and push state to server
    useGameStore.subscribe(gameStateSubscription(room, version))

    // initialization, run once
    const roomInHash = initial ?? getParams().get('r')
    if (roomInHash) {
      room.current = roomInHash
      setTimeout(polling(room, version), 0)
    } else {
      setTimeout(loadNewRoom(room, version), 0)
    }
  }, [])
  return [room, version]
}
