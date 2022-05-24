import { renderHook, act } from '@testing-library/react-hooks/pure'
import {
  TestP1VictoryPatterns,
  TestP2VictoryPatterns,
  TestTiePatterns,
} from '../constants'
import { PlayMode } from '../types'
import { move, load, setPlayMode } from '../utils/actions'
import { useGameStore } from './useGameStore'

describe('playMode', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game playMode is ModePvC', () => {
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvC)
  })
  test('setPlayMode should change playMode from ModePvC to ModePvP', () => {
    act(() => setPlayMode(gameStore.current.dispatch, PlayMode.ModePvP))
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvP)
  })
  test('setPlayMode should change playMode from ModePvP to ModePvC', () => {
    act(() => setPlayMode(gameStore.current.dispatch, PlayMode.ModePvP))
    act(() => setPlayMode(gameStore.current.dispatch, PlayMode.ModePvC))
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvC)
  })
})

describe('playerNo', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game playerNo is 0', () => {
    expect(gameStore.current.playerNo).toBe(0)
  })
  const positions = [
    0b100000000, // 1P
    0b010000000, // 2P
    0b000100000, // 1P
    0b000010000, // 2P
    0b000000010, // 1P
    0b000000100, // 2P
    0b001000000, // 1P
    0b000001000, // 2P
    0b000000001, // 1P
  ]
  for (let i = 0; i < positions.length; i++) {
    const expected = (i + 1) % 2
    test(`after move() x ${1 + i} playerNo should be ${expected}`, () => {
      for (let j = 0; j <= i; j++) {
        act(() => move(gameStore.current.dispatch, positions[j]))
      }
      expect(gameStore.current.playerNo).toBe(expected)
    })
  }
})

describe('p1Moves', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game p1Moves is 0b000000000', () => {
    expect(gameStore.current.p1Moves).toBe(0b000000000)
  })
  test('p1Moves is 0b100000000 after move 0b100000000', () => {
    act(() => move(gameStore.current.dispatch, 0b100000000)) // 1P
    expect(gameStore.current.p1Moves).toBe(0b100000000)
  })

  test('p1Moves is 0b110000000 after move 0b100000000 & 0b010000000', () => {
    act(() => move(gameStore.current.dispatch, 0b100000000)) // 1P
    act(() => move(gameStore.current.dispatch, 0b000000001)) // 2P
    act(() => move(gameStore.current.dispatch, 0b010000000)) // 1P
    expect(gameStore.current.p1Moves).toBe(0b110000000)
  })
  test('ignore if cell is occupied or invalid move', () => {
    act(() => move(gameStore.current.dispatch, 0b100000000)) // invalid
    act(() => move(gameStore.current.dispatch, 0b100000000)) // 1P
    act(() => move(gameStore.current.dispatch, 0b000000001)) // 2P
    act(() => move(gameStore.current.dispatch, 0b100000000)) // 1P
    expect(gameStore.current.p1Moves).toBe(0b100000000)
  })
})

describe('p2Moves', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game p2Moves is 0b000000000', () => {
    expect(gameStore.current.p2Moves).toBe(0b000000000)
  })
  test('p2Moves is 0b100000000 after move 0b100000000', () => {
    act(() => move(gameStore.current.dispatch, 0b000000001)) // 1P
    act(() => move(gameStore.current.dispatch, 0b100000000)) // 2P
    expect(gameStore.current.p2Moves).toBe(0b100000000)
  })

  test('p2Moves is 0b110000000 after move 0b100000000 & 0b010000000', () => {
    act(() => move(gameStore.current.dispatch, 0b000000001)) // 1P
    act(() => move(gameStore.current.dispatch, 0b100000000)) // 2P
    act(() => move(gameStore.current.dispatch, 0b000000010)) // 1P
    act(() => move(gameStore.current.dispatch, 0b010000000)) // 2P
    expect(gameStore.current.p2Moves).toBe(0b110000000)
  })
  test('ignore if cell is occupied or invalid move', () => {
    act(() => move(gameStore.current.dispatch, 0b100000000)) // 1P
    act(() => move(gameStore.current.dispatch, 0b100000000)) // invalid
    act(() => move(gameStore.current.dispatch, 0b100000000)) // invalid
    act(() => move(gameStore.current.dispatch, 0b010000000)) // 2P
    expect(gameStore.current.p2Moves).toBe(0b010000000)
  })
})

describe('pvcRecords', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game pvcRecords is [0, 0, 0]', () => {
    expect(gameStore.current.pvcRecords).toEqual([0, 0, 0])
  })
  for (let i = 0; i <= 3; i++) {
    test(`p1Victory is ${i} after p1 winning ${i} times`, () => {
      for (let j = 0; j < i; j++) {
        TestP1VictoryPatterns.forEach((p) =>
          act(() => move(gameStore.current.dispatch, p))
        )
        act(() => move(gameStore.current.dispatch, 0b100000000)) // next
      }
      expect(gameStore.current.pvcRecords).toEqual([i, 0, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`p2Victory is ${i} after p2 winning ${i} times`, () => {
      for (let j = 0; j < i; j++) {
        TestP2VictoryPatterns.forEach((p) =>
          act(() => move(gameStore.current.dispatch, p))
        )
        act(() => move(gameStore.current.dispatch, 0b100000000)) // next
      }
      expect(gameStore.current.pvcRecords).toEqual([0, i, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`tie is ${i} after tie ${i} times`, () => {
      for (let j = 0; j < i; j++) {
        TestTiePatterns.forEach((p) =>
          act(() => move(gameStore.current.dispatch, p))
        )
        act(() => move(gameStore.current.dispatch, 0b100000000)) // next
      }
      expect(gameStore.current.pvcRecords).toEqual([0, 0, i])
    })
  }
})

describe('pvpRecords', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game pvpRecords is [0, 0, 0]', () => {
    expect(gameStore.current.pvpRecords).toEqual([0, 0, 0])
  })
  for (let i = 0; i <= 3; i++) {
    test(`p1Victory is ${i} after p1 winning ${i} times`, () => {
      act(() => setPlayMode(gameStore.current.dispatch, PlayMode.ModePvP))
      for (let j = 0; j < i; j++) {
        TestP1VictoryPatterns.forEach((p) =>
          act(() => move(gameStore.current.dispatch, p))
        )
        act(() => move(gameStore.current.dispatch, 0b100000000)) // next
      }
      expect(gameStore.current.pvpRecords).toEqual([i, 0, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`p2Victory is ${i} after p2 winning ${i} times`, () => {
      act(() => setPlayMode(gameStore.current.dispatch, PlayMode.ModePvP))
      for (let j = 0; j < i; j++) {
        TestP2VictoryPatterns.forEach((p) =>
          act(() => move(gameStore.current.dispatch, p))
        )
        act(() => move(gameStore.current.dispatch, 0b100000000)) // next
      }
      expect(gameStore.current.pvpRecords).toEqual([0, i, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`tie is ${i} after tie ${i} times`, () => {
      act(() => setPlayMode(gameStore.current.dispatch, PlayMode.ModePvP))
      for (let j = 0; j < i; j++) {
        TestTiePatterns.forEach((p) =>
          act(() => move(gameStore.current.dispatch, p))
        )
        act(() => move(gameStore.current.dispatch, 0b100000000)) // next
      }
      expect(gameStore.current.pvpRecords).toEqual([0, 0, i])
    })
  }
})

describe('load', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('laod 0_0_0_0_0_0_0_0_0_0', () => {
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvC)
    expect(gameStore.current.playerNo).toBe(0)
    expect(gameStore.current.p1Moves).toBe(0b000000000)
    expect(gameStore.current.p2Moves).toBe(0b000000000)
    expect(gameStore.current.pvcRecords).toEqual([0, 0, 0])
    expect(gameStore.current.pvpRecords).toEqual([0, 0, 0])
  })
  test('load invalid', () => {
    act(() => load(gameStore.current.dispatch))
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvC)
    expect(gameStore.current.playerNo).toBe(0)
    expect(gameStore.current.p1Moves).toBe(0b000000000)
    expect(gameStore.current.p2Moves).toBe(0b000000000)
    expect(gameStore.current.pvcRecords).toEqual([0, 0, 0])
    expect(gameStore.current.pvpRecords).toEqual([0, 0, 0])
  })
  test('load 1_1_1_2_3_4_5_6_7_8', () => {
    act(() => load(gameStore.current.dispatch, '1_1_1_2_3_4_5_6_7_8'))
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvP)
    expect(gameStore.current.playerNo).toBe(1)
    expect(gameStore.current.p1Moves).toBe(0b000000001)
    expect(gameStore.current.p2Moves).toBe(0b000000010)
    expect(gameStore.current.pvcRecords).toEqual([3, 4, 5])
    expect(gameStore.current.pvpRecords).toEqual([6, 7, 8])
  })
})
