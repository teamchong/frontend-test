import { renderHook, act } from '@testing-library/react-hooks/pure'
import { PlayMode, useGameStore } from './useGameStore'
import {
  gameStateSubscription,
  getRemoteState,
  createNewRoom,
  polling,
  setRemoteState,
  useRoom,
} from './useRoom'
import fetchMock from 'jest-fetch-mock'

const initialState = useGameStore.getState().serialize()

beforeEach(() => {
  jest.useFakeTimers()
  jest.spyOn(global, 'setTimeout')
})
afterEach(() => {
  act(() => useGameStore.getState().load(initialState))
  jest.mocked(global.setTimeout).mockRestore()
  jest.useRealTimers()
})

describe('useRoom("room-id")', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  beforeEach(() => (room.current.version.current = 0))
  test('try load an room "room-id"', () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    expect(room.current.room.current).toBe('room-id')
  })
})

describe('createNewRoom()', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom())
  beforeEach(() => (room.current.version.current = 0))
  test('createNewRoom fail', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async () => {
      throw 'createNewRoom fail error'
    })
    await act(
      createNewRoom(
        room.current.room,
        room.current.version,
        room.current.isExited
      )
    )
    expect(room.current.room.current).toBe('')
  })
  test('createNewRoom success', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async (req) => {
      if (/\/GetAppKey$/.test(req.url)) return JSON.stringify('room-id')
      if (/\/UpdateValue\//.test(req.url)) return JSON.stringify('true')
      throw 'unknown ' + req.url
    })
    await act(
      createNewRoom(
        room.current.room,
        room.current.version,
        room.current.isExited
      )
    )
    expect(room.current.room.current).toBe('room-id')
  })
})

describe('getRemoteState()', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  beforeEach(() => (room.current.version.current = 0))
  test('getRemoteState success', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async (req) => {
      if (/\/GetAppKey$/.test(req.url)) return JSON.stringify('room-id')
      if (/\/GetValue\//.test(req.url))
        return JSON.stringify('2_1_1_0_0_0_0_0_0_0')
      throw 'unknown ' + req.url
    })
    const stateValue = await getRemoteState('room-id')
    expect(stateValue?.version).toBe(2)
    expect(stateValue?.state).toBe('1_1_0_0_0_0_0_0_0')
  })
  test('getRemoteState success alt', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async (req) => {
      if (/\/GetAppKey$/.test(req.url)) return JSON.stringify('room-id')
      if (/\/GetValue\//.test(req.url)) {
        if (/0$/.test(req.url)) return JSON.stringify('8_1_1_0_0_0_0_0_0_0')
        else return JSON.stringify('9_1_1_0_0_0_0_0_0_0')
      }
      throw 'unknown ' + req.url
    })
    const stateValue = await getRemoteState('room-id')
    expect(stateValue?.version).toBe(9)
    expect(stateValue?.state).toBe('1_1_0_0_0_0_0_0_0')
  })
  test('getRemoteState fail', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async (req) => {
      if (/\/GetAppKey$/.test(req.url)) return JSON.stringify('room-id')
      if (/\/GetValue\//.test(req.url)) return JSON.stringify('INVALID')
      throw 'unknown ' + req.url
    })
    const stateValue = await getRemoteState('room-id')
    expect(stateValue?.version ?? null).toBe(null)
    expect(stateValue?.state ?? null).toBe(null)
  })
})

describe('setRemoteState()', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  beforeEach(() => (room.current.version.current = 0))
  test('setRemoteState success', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async (req) => {
      if (/\/UpdateValue\//.test(req.url)) return JSON.stringify(true)
      throw 'unknown ' + req.url
    })
    const result = await setRemoteState('room-id', 1, true, '1_0_0_0_0_0_0_0_0')
    expect(result).toBe(true)
  })
  test('setRemoteState fail', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async (req) => {
      if (/\/UpdateValue\//.test(req.url)) return JSON.stringify(false)
      throw 'unknown ' + req.url
    })
    const result = await setRemoteState('room-id', 1, true, '1_0_0_0_0_0_0_0_0')
    expect(result).toBe(false)
  })
})

describe('gameStateSubscription()', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  beforeEach(() => (room.current.version.current = 0))
  test('not PvP', async () => {
    fetchMock.mockResponse(async () => {
      throw 'gameStateSubscription'
    })
    await act(
      async () =>
        await gameStateSubscription(
          room.current.room,
          room.current.version,
          room.current.isHost
        )(gameStore.current.serialize(), '0_0_0_0_0_0_0_0_0_0')
    )
    expect(room.current.version.current).toBe(0)
  })
  test('no change', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async (req) => {
      if (/\/GetAppKey$/.test(req.url)) return JSON.stringify('room-id')
      if (/\/GetValue\//.test(req.url))
        return JSON.stringify('0_1_0_0_0_0_0_0_0_0')
      if (/\/UpdateValue\//.test(req.url)) return JSON.stringify('true')
      throw 'unknown ' + req.url
    })
    await act(
      async () =>
        await gameStateSubscription(
          room.current.room,
          room.current.version,
          room.current.isHost
        )(gameStore.current.serialize(), '1_0_0_0_0_0_0_0_0_0')
    )
    expect(room.current.version.current).toBe(0)
  })
  test('remote version <= local', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    room.current.version.current = 9
    fetchMock.mockResponse(async (req) => {
      if (/\/GetAppKey$/.test(req.url)) return JSON.stringify('room-id')
      if (/\/GetValue\//.test(req.url))
        return JSON.stringify('0_1_0_0_0_0_0_0_0_0')
      if (/\/UpdateValue\//.test(req.url)) return JSON.stringify('true')
      throw 'unknown ' + req.url
    })
    await act(
      async () =>
        await gameStateSubscription(
          room.current.room,
          room.current.version,
          room.current.isHost
        )(gameStore.current.serialize(), '1_1_0_0_0_0_0_0_0_0')
    )
    expect(room.current.version.current).toBe(10)
  })
  test('remote version > local', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async (req) => {
      if (/\/GetAppKey$/.test(req.url)) return JSON.stringify('room-id')
      if (/\/GetValue\//.test(req.url))
        return JSON.stringify('2_1_0_0_0_0_0_0_0_0')
      if (/\/UpdateValue\//.test(req.url)) return JSON.stringify('true')
      throw 'unknown ' + req.url
    })
    await act(
      async () =>
        await gameStateSubscription(
          room.current.room,
          room.current.version,
          room.current.isHost
        )(gameStore.current.serialize(), '1_1_0_0_0_0_0_0_0_0')
    )
    expect(room.current.version.current).toBe(1)
  })
})

describe('polling()', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  beforeEach(() => (room.current.version.current = 0))
  test('polling success', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async (req) => {
      if (/\/GetValue\//.test(req.url))
        return JSON.stringify('2_1_0_0_0_0_0_0_0_0')
      throw 'unknown ' + req.url
    })
    await act(
      polling(room.current.room, room.current.version, room.current.isExited)
    )
    expect(room.current.version.current).toBe(2)
  })
  test('polling fail', async () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse(async () => {
      throw 'polling fail error'
    })
    await act(
      polling(room.current.room, room.current.version, room.current.isExited)
    )
    expect(room.current.version.current).toBe(0)
  })
})
