import { MutableRefObject, useEffect, useRef } from 'react'
import { PlayMode } from '../types'
import { load } from '../utils/load'
import { serializeStore } from '../utils/serializeStore'
import { useGameStore } from './useGameStore'

export type VersionState = {
  version: number
  state: string
}

export const ROOM_API_BASE_URL = 'https://keyvalue.immanuel.co/api/KeyVal'

export async function createRoom(): Promise<string> {
  const payload = await fetch(`${ROOM_API_BASE_URL}/GetAppKey`)
    .then((r) => r.json())
    .catch(() => Promise.resolve(''))
  return `${payload}`
}

// create a new room and initialize state
export function createNewRoom(
  room: MutableRefObject<string>,
  version: MutableRefObject<number>,
  isExited: MutableRefObject<boolean>
) {
  return async function () {
    const newRoom = await createRoom()
    const isCreated = setRemoteState(
      newRoom,
      version.current,
      true,
      serializeStore(useGameStore.getState())
    )
    if (newRoom && isCreated) {
      localStorage.setItem('roomHosted', newRoom)
      room.current = newRoom
      const params = new URLSearchParams(location.hash.replace(/^#/, ''))
      params.set('r', newRoom)
      location.hash = '#' + params.toString()
    }
    setTimeout(polling(room, version, isExited), 300)
  }
}

export async function getRemoteState(
  room: string
): Promise<VersionState | null> {
  const response = await Promise.all([
    fetch(`${ROOM_API_BASE_URL}/GetValue/${room}/0`)
      .then((r) => r.json())
      .catch(() => Promise.resolve('')),
    fetch(`${ROOM_API_BASE_URL}/GetValue/${room}/1`)
      .then((r) => r.json())
      .catch(() => Promise.resolve('')),
  ])
  const payload = response.map((v) => parseVersionState(v))
  if ((payload[0]?.version ?? 0) < (payload[1]?.version ?? 0)) {
    return payload[1]
  } else {
    return payload[0]
  }
}

export function parseVersionState(str: string): VersionState | null {
  const result = /^(\d+)_(.+)$/.exec(str)
  if (!result) {
    return null
  }
  return {
    version: parseInt(result[1]),
    state: result[2],
  }
}

export async function setRemoteState(
  room: string,
  version: number,
  isHost: boolean,
  gameState: string
): Promise<boolean> {
  const payload = await fetch(
    `${ROOM_API_BASE_URL}/UpdateValue/${room}/${
      isHost ? 0 : 1
    }/${encodeURIComponent(version + '_' + gameState)}`,
    { method: 'POST' }
  )
    .then((r) => r.json())
    .catch(() => Promise.resolve(false))
  return !!payload
}

export function gameStateSubscription(
  room: MutableRefObject<string>,
  version: MutableRefObject<number>,
  isHost: MutableRefObject<boolean>
) {
  return async (data: string, prevData?: string): Promise<void> => {
    if (data === prevData) {
      return
    }
    if (!prevData || !/^1_/.test(prevData) || !/^1_/.test(data)) {
      return
    }
    version.current++
    await setRemoteState(room.current, version.current, isHost.current, data)
  }
}

// retrieve latest state from server, override if version is the same or higher
export function polling(
  room: MutableRefObject<string>,
  version: MutableRefObject<number>,
  isExited: MutableRefObject<boolean>
) {
  async function internal() {
    if (isExited.current) return
    const state = useGameStore.getState()
    if (room.current && state.playMode === PlayMode.ModePvP) {
      const versionState = await getRemoteState(room.current)
      if (versionState !== null && versionState.version > version.current) {
        if (versionState.state !== serializeStore(state)) {
          load(state.dispatch, versionState.state)
        }
        version.current = versionState.version
      }
    }
    setTimeout(() => internal(), 300)
  }
  return internal
}

export function useRoom(initial?: string): {
  room: MutableRefObject<string>
  version: MutableRefObject<number>
  isHost: MutableRefObject<boolean>
  isExited: MutableRefObject<boolean>
} {
  const room = useRef('')
  const version = useRef(0)
  const isHost = useRef(true)
  const isExited = useRef(false)
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    // subscibe to local state change, and push state to server
    useGameStore.subscribe(
      (state) => serializeStore(state),
      gameStateSubscription(room, version, isHost),
      { fireImmediately: true }
    )

    // initialization, run once
    const roomInHash =
      initial ?? new URLSearchParams(location.hash.replace(/^#/, '')).get('r')
    if (roomInHash) {
      isHost.current = roomInHash === localStorage.getItem('roomHosted')
      room.current = roomInHash
      setTimeout(polling(room, version, isExited), 300)
    } else {
      setTimeout(createNewRoom(room, version, isExited), 0)
    }
    return () => void (isExited.current = true)
  }, [initial])
  return { room, version, isHost, isExited }
}
