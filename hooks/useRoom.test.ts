import { renderHook, act } from '@testing-library/react-hooks/pure'
import { PlayMode, useGameStore } from './useGameStore'
import {
  gameStateSubscription,
  getRemoteState,
  loadNewRoom,
  polling,
  setRemoteState,
  useRoom,
} from './useRoom'
import fetchMock from 'jest-fetch-mock'

const initialState = useGameStore.getState().serialize()

beforeEach(() => {
  jest.useFakeTimers()
  jest.spyOn(global, 'setTimeout')
  jest.spyOn(global.console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  fetchMock.mockReset()
  act(() => useGameStore.getState().load(initialState))
  jest.mocked(global.console.error).mockRestore()
  jest.mocked(global.setTimeout).mockRestore()
  jest.useRealTimers()
})

describe('useRoom("room-id")', () => {
  const { result: gameState } = renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  test('try load an room "room-id"', () => {
    gameState.current.setPlayMode(PlayMode.ModePvP)
    expect(room.current[0].current).toBe('room-id')
  })
})

describe('loadNewRoom()', () => {
  renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom())
  test('loadNewRoom success', async () => {
    fetchMock.mockResponse(() => Promise.reject())
    await act(async () => await loadNewRoom(room.current[0], room.current[1])())
    expect(room.current[0].current).toBe('')
  })
  test('loadNewRoom fail', async () => {
    fetchMock.mockResponse((req) =>
      /\/GetAppKey$/.test(req.url)
        ? Promise.resolve(JSON.stringify('room-id'))
        : /\/UpdateValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('true'))
        : Promise.reject('unknown ' + req.url)
    )
    await act(async () => await loadNewRoom(room.current[0], room.current[1])())
    expect(room.current[0].current).toBe('room-id')
  })
})

describe('getRemoteState()', () => {
  renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  test('getRemoteState success', async () => {
    fetchMock.mockResponse((req) =>
      /\/GetAppKey$/.test(req.url)
        ? Promise.resolve(JSON.stringify('room-id'))
        : /\/GetValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('2_1_0_0_0_0_0_0_0_0'))
        : Promise.reject('unknown ' + req.url)
    )
    const [version, state] = await getRemoteState('room-id')
    expect(version).toBe(2)
    expect(state).toBe('1_0_0_0_0_0_0_0_0')
  })
  test('getRemoteState fail', async () => {
    fetchMock.mockResponse((req) =>
      /\/GetAppKey$/.test(req.url)
        ? Promise.resolve(JSON.stringify('room-id'))
        : /\/GetValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('INVALID'))
        : Promise.reject('unknown ' + req.url)
    )
    const [version, state] = await getRemoteState('room-id')
    expect(version).toBe(null)
    expect(state).toBe(null)
  })
})

describe('setRemoteState()', () => {
  renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  test('setRemoteState success', async () => {
    fetchMock.mockResponse((req) =>
      /\/UpdateValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify(true))
        : Promise.reject('unknown ' + req.url)
    )
    const result = await setRemoteState('room-id', 1, '1_0_0_0_0_0_0_0_0')
    expect(result).toBe(true)
  })
  test('setRemoteState fail', async () => {
    fetchMock.mockResponse((req) =>
      /\/UpdateValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify(false))
        : Promise.reject('unknown ' + req.url)
    )
    const result = await setRemoteState('room-id', 1, '1_0_0_0_0_0_0_0_0')
    expect(result).toBe(false)
  })
})

describe('gameStateSubscription()', () => {
  const { result: gameState } = renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  test('not PvP', async () => {
    room.current[1].current = 0
    fetchMock.mockResponse(() => Promise.reject())
    await act(
      async () =>
        await gameStateSubscription(
          room.current[0],
          room.current[1]
        )(gameState.current)
    )
    expect(room.current[1].current).toBe(0)
  })
  test('no change', async () => {
    room.current[1].current = 0
    gameState.current.setPlayMode(PlayMode.ModePvP)
    fetchMock.mockResponse((req) =>
      /\/GetAppKey$/.test(req.url)
        ? Promise.resolve(JSON.stringify('room-id'))
        : /\/GetValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('0_1_0_0_0_0_0_0_0_0'))
        : /\/UpdateValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('true'))
        : Promise.reject('unknown ' + req.url)
    )
    await act(
      async () =>
        await gameStateSubscription(room.current[0], room.current[1])(
          gameState.current,
          gameState.current
        )
    )
    expect(room.current[1].current).toBe(0)
  })
  test('remote version <= local', async () => {
    room.current[1].current = 0
    gameState.current.setPlayMode(PlayMode.ModePvP)
    fetchMock.mockResponse((req) =>
      /\/GetAppKey$/.test(req.url)
        ? Promise.resolve(JSON.stringify('room-id'))
        : /\/GetValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('0_1_0_0_0_0_0_0_0_0'))
        : /\/UpdateValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('true'))
        : Promise.reject('unknown ' + req.url)
    )
    await act(
      async () =>
        await gameStateSubscription(
          room.current[0],
          room.current[1]
        )(gameState.current)
    )
    expect(room.current[1].current).toBe(1)
  })
  test('remote version > local', async () => {
    room.current[1].current = 0
    act(() => gameState.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse((req) =>
      /\/GetAppKey$/.test(req.url)
        ? Promise.resolve(JSON.stringify('room-id'))
        : /\/GetValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('2_1_0_0_0_0_0_0_0_0'))
        : /\/UpdateValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('true'))
        : Promise.reject('unknown ' + req.url)
    )
    await act(
      async () =>
        await gameStateSubscription(
          room.current[0],
          room.current[1]
        )(gameState.current)
    )
    expect(room.current[1].current).toBe(0)
  })
})

describe('polling()', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  const { result: room } = renderHook(() => useRoom('room-id'))
  test('polling success', async () => {
    room.current[1].current = 0
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse((req) =>
      /\/GetValue\//.test(req.url)
        ? Promise.resolve(JSON.stringify('2_1_0_0_0_0_0_0_0_0'))
        : Promise.reject('unknown ' + req.url)
    )
    await act(async () => await polling(room.current[0], room.current[1])())
    expect(room.current[1].current).toBe(2)
  })
  test('polling fail', async () => {
    room.current[1].current = 0
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    fetchMock.mockResponse((req) => Promise.reject('unknown ' + req.url))
    await act(async () => await polling(room.current[0], room.current[1])())
    expect(room.current[1].current).toBe(0)
  })
})
