import { renderHook, act } from '@testing-library/react-hooks/pure'
import { PlayMode, useGameStore } from './useGameStore'
import { ROOM_API_BASE_URL, useRoom } from './useRoom'

beforeEach(() => {
  act(() =>
    useGameStore.setState({
      playMode: PlayMode.ModePvC,
      playerNo: 0,
      p1Moves: 0b0,
      p2Moves: 0b0,
      pvcRecords: [0, 0, 0],
      pvpRecords: [0, 0, 0],
    })
  )
})
beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))

describe('cells', () => {
  const { result } = renderHook(() => useGameStore())
  test('try load an room 0ferh8l', async () => {
    const spyFetch = jest.fn(() =>
      Promise.resolve<any>({
        json: () => Promise.resolve('1_0_1_0_0_0_0_0_0_0'),
      })
    )
    global.fetch = spyFetch
    act(() => result.current.setPlayMode(PlayMode.ModePvP))
    const { result: room } = renderHook(() => useRoom('e0ferh8l'))
    await act(() => new Promise((r) => setTimeout(r, 2000)))
    expect(room.current).toBe('e0ferh8l')
    spyFetch.mockRestore()
  })
  test('polling failed', async () => {
    const spyFetch = jest.fn(() =>
      Promise.resolve<any>({
        json: () => Promise.reject('error'),
      })
    )
    global.fetch = spyFetch
    act(() => result.current.setPlayMode(PlayMode.ModePvP))
    const { result: room } = renderHook(() => useRoom('e0ferh8l'))
    await act(() => new Promise((r) => setTimeout(r, 2000)))
    expect(room.current).toBe('e0ferh8l')
    spyFetch.mockRestore()
  })
  test('loadNewRoom success', async () => {
    const spyFetch = jest.fn(() =>
      Promise.resolve<any>({
        json: () => Promise.resolve('1_0_1_0_0_0_0_0_0_0'),
      })
    )
    global.fetch = spyFetch
    act(() => result.current.setPlayMode(PlayMode.ModePvP))
    const { result: room } = renderHook(() => useRoom())
    await act(() => new Promise((r) => setTimeout(r, 2000)))
    expect(room.current).not.toBe('')
    spyFetch.mockRestore()
  })
})
