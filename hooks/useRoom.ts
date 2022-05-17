import { useEffect, useRef, useState } from 'react'
import { PlayMode, useGameStore } from './useGameStore'

export const ROOM_API_BASE_URL = 'https://keyvalue.immanuel.co/api/KeyVal'

export function useRoom(init?: string): string {
  const [room, setRoom] = useState('')
  const version = useRef(0)
  useEffect(() => {
    async function polling() {
      try {
        if (room && useGameStore.getState().playMode !== PlayMode.ModePvC) {
          const data = await (
            await fetch(`${ROOM_API_BASE_URL}/GetValue/${room}/g`)
          ).json()
          const result = /^(\d+)_(.+)$/.exec(data)
          if (result) {
            const newVersion = parseInt(result[1])
            if (version.current <= newVersion) {
              version.current = newVersion
              const gameState = result[2]
              if (
                useGameStore.getState().playMode === PlayMode.ModePvP &&
                useGameStore.getState().state() !== gameState
              ) {
                useGameStore.getState().load(gameState)
              }
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
      setTimeout(() => polling(), 500)
    }
    useGameStore.subscribe((state, prevState) => {
      if (state.playMode !== prevState.playMode) {
        version.current = 0
      }
      if (room && state.playMode === PlayMode.ModePvP) {
        version.current++
        return fetch(
          `${ROOM_API_BASE_URL}/UpdateValue/${room}/g/${encodeURIComponent(
            version.current + '_' + state.state()
          )}`,
          { method: 'POST' }
        )
      }
    })
    async function loadNewRoom() {
      try {
        const newRoom = await (
          await fetch(`${ROOM_API_BASE_URL}/GetAppKey`)
        ).json()
        const isCreated = await (
          await fetch(
            `${ROOM_API_BASE_URL}/UpdateValue/${room}/g/${encodeURIComponent(
              version.current + '_' + useGameStore.getState().state()
            )}`,
            { method: 'POST' }
          )
        ).json()
        if (newRoom && isCreated) {
          setRoom(newRoom)
          const params = new URLSearchParams(location.hash.replace(/^#/, ''))
          params.set('r', newRoom)
          location.hash = '#' + params.toString()
        }
      } catch (error) {
        console.error(error)
      }
      setTimeout(polling, 0)
    }
    const room =
      init ?? new URLSearchParams(location.hash.replace(/^#/, '')).get('r')
    if (room) {
      setRoom(room)
      setTimeout(polling, 0)
    } else {
      setTimeout(loadNewRoom, 0)
    }
  }, [])
  return room
}
