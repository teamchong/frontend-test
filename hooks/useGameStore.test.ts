import { describe, expect, test, beforeEach, beforeAll, afterAll } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import { VICTORY_PATTERNS } from '../constants'
import { GameStatus, PlayMode, useGameStore } from './useGameStore'

const p1VictoryPatterns = [
  0b100000000, // 1P
  0b000000001, // 2P
  0b010000000, // 1P
  0b000000010, // 2P
  0b001000000, // 1P
]

const p2VictoryPatterns = [
  0b000000001, // 1P
  0b100000000, // 2P
  0b000000010, // 1P
  0b010000000, // 2P
  0b000001000, // 1P
  0b001000000, // 2P
]

const tiePatterns = [
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

beforeEach(() => {
  useGameStore.setState({
    playMode: PlayMode.Mode1P,
    playerNo: 1,
    p1Moves: 0b0,
    p2Moves: 0b0,
    pvcRecords: [0, 0, 0],
    pvpRecords: [0, 0, 0],
  })
})

describe('cells', () => {
  const { result } = renderHook(() => useGameStore())
  test('new game cells should be unique', () => {
    expect(new Set(result.current.cells()).size).toBe(
      result.current.cells().length
    )
  })
})

describe('victoryPattern', () => {
  const { result } = renderHook(() => useGameStore())
  test('victoryPattern is 0 when no occupied', () => {
    expect(result.current.victoryPattern(0)).toBe(0)
  })
  for (const pattern of VICTORY_PATTERNS) {
    test(
      `victoryPattern is ${pattern.toString(2)} when ` +
        `${pattern.toString(2)} is occupied `,
      () => {
        expect(result.current.victoryPattern(pattern)).toBe(pattern)
      }
    )
  }
})

describe('playMode', () => {
  const { result } = renderHook(() => useGameStore())
  test('new game playMode is Mode1P', () => {
    expect(result.current.playMode).toBe(PlayMode.Mode1P)
  })
  test('setPlayMode should change playMode from Mode1P to Mode2P', () => {
    act(() => result.current.setPlayMode(PlayMode.Mode2P))
    expect(result.current.playMode).toBe(PlayMode.Mode2P)
  })
  test('setPlayMode should change playMode from Mode2P to Mode1P', () => {
    act(() => result.current.setPlayMode(PlayMode.Mode2P))
    act(() => result.current.setPlayMode(PlayMode.Mode1P))
    expect(result.current.playMode).toBe(PlayMode.Mode1P)
  })
})

describe('playerNo', () => {
  const { result } = renderHook(() => useGameStore())
  test('new game playerNo is 1', () => {
    expect(result.current.playerNo).toBe(1)
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
    const expected = i % 2 === 0 ? 2 : 1
    test(`after move() x ${1 + i} playerNo should be ${expected}`, () => {
      for (let j = 0; j <= i; j++) {
        act(() => result.current.move(positions[j]))
      }
      expect(result.current.playerNo).toBe(expected)
    })
  }
})

describe('gameStatus', () => {
  const { result } = renderHook(() => useGameStore())

  test('new game gameStatus is InProgress', () => {
    expect(
      result.current.gameStatus(result.current.p1Moves, result.current.p2Moves)
    ).toBe(GameStatus.InProgress)
  })

  test('gameStatus should be P1Victory', () => {
    p1VictoryPatterns.forEach((p) => act(() => result.current.move(p)))
    expect(
      result.current.gameStatus(result.current.p1Moves, result.current.p2Moves)
    ).toBe(GameStatus.P1Victory)
  })

  test('gameStatus should be P2Victory', () => {
    p2VictoryPatterns.forEach((p) => act(() => result.current.move(p)))
    expect(
      result.current.gameStatus(result.current.p1Moves, result.current.p2Moves)
    ).toBe(GameStatus.P2Victory)
  })

  test('gameStatus should be Tie', () => {
    tiePatterns.forEach((p) => act(() => result.current.move(p)))
    expect(
      result.current.gameStatus(result.current.p1Moves, result.current.p2Moves)
    ).toBe(GameStatus.Tie)
  })
})

describe('p1Moves', () => {
  const { result } = renderHook(() => useGameStore())
  test('new game p1Moves is 0b000000000', () => {
    expect(result.current.p1Moves).toBe(0b000000000)
  })
  test('p1Moves is 0b100000000 after move 0b100000000', () => {
    act(() => result.current.move(0b100000000)) // 1P
    expect(result.current.p1Moves).toBe(0b100000000)
  })

  test('p1Moves is 0b110000000 after move 0b100000000 & 0b010000000', () => {
    act(() => result.current.move(0b100000000)) // 1P
    act(() => result.current.move(0b000000001)) // 2P
    act(() => result.current.move(0b010000000)) // 1P
    expect(result.current.p1Moves).toBe(0b110000000)
  })
  test('ignore if cell is occupied or invalid move', () => {
    act(() => result.current.move(0b1000000000)) // invalid
    act(() => result.current.move(0b100000000)) // 1P
    act(() => result.current.move(0b000000001)) // 2P
    act(() => result.current.move(0b100000000)) // 1P
    expect(result.current.p1Moves).toBe(0b100000000)
  })
})

describe('p2Moves', () => {
  const { result } = renderHook(() => useGameStore())
  test('new game p2Moves is 0b000000000', () => {
    expect(result.current.p2Moves).toBe(0b000000000)
  })
  test('p2Moves is 0b100000000 after move 0b100000000', () => {
    act(() => result.current.move(0b000000001)) // 1P
    act(() => result.current.move(0b100000000)) // 2P
    expect(result.current.p2Moves).toBe(0b100000000)
  })

  test('p2Moves is 0b110000000 after move 0b100000000 & 0b010000000', () => {
    act(() => result.current.move(0b000000001)) // 1P
    act(() => result.current.move(0b100000000)) // 2P
    act(() => result.current.move(0b000000010)) // 1P
    act(() => result.current.move(0b010000000)) // 2P
    expect(result.current.p2Moves).toBe(0b110000000)
  })
  test('ignore if cell is occupied or invalid move', () => {
    act(() => result.current.move(0b100000000)) // 1P
    act(() => result.current.move(0b1000000000)) // invalid
    act(() => result.current.move(0b100000000)) // invalid
    act(() => result.current.move(0b010000000)) // 2P
    expect(result.current.p2Moves).toBe(0b010000000)
  })
})

describe('pvcRecords', () => {
  const { result } = renderHook(() => useGameStore())
  test('new game pvcRecords is [0, 0, 0]', () => {
    expect(result.current.pvcRecords).toEqual([0, 0, 0])
  })
  for (let i = 0; i <= 3; i++) {
    test(`p1Victory is ${i} after p1 winning ${i} times`, () => {
      for (let j = 0; j < i; j++) {
        p1VictoryPatterns.forEach((p) => act(() => result.current.move(p)))
        act(() => result.current.move(0b100000000)) // next
      }
      expect(result.current.pvcRecords).toEqual([i, 0, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`p2Victory is ${i} after p2 winning ${i} times`, () => {
      for (let j = 0; j < i; j++) {
        p2VictoryPatterns.forEach((p) => act(() => result.current.move(p)))
        act(() => result.current.move(0b100000000)) // next
      }
      expect(result.current.pvcRecords).toEqual([0, i, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`tie is ${i} after tie ${i} times`, () => {
      for (let j = 0; j < i; j++) {
        tiePatterns.forEach((p) => act(() => result.current.move(p)))
        act(() => result.current.move(0b100000000)) // next
      }
      expect(result.current.pvcRecords).toEqual([0, 0, i])
    })
  }
})

describe('pvpRecords', () => {
  const { result } = renderHook(() => useGameStore())
  test('new game pvpRecords is [0, 0, 0]', () => {
    expect(result.current.pvpRecords).toEqual([0, 0, 0])
  })
  for (let i = 0; i <= 3; i++) {
    test(`p1Victory is ${i} after p1 winning ${i} times`, () => {
      act(() => result.current.setPlayMode(PlayMode.Mode2P))
      for (let j = 0; j < i; j++) {
        p1VictoryPatterns.forEach((p) => act(() => result.current.move(p)))
        act(() => result.current.move(0b100000000)) // next
      }
      expect(result.current.pvpRecords).toEqual([i, 0, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`p2Victory is ${i} after p2 winning ${i} times`, () => {
      act(() => result.current.setPlayMode(PlayMode.Mode2P))
      for (let j = 0; j < i; j++) {
        p2VictoryPatterns.forEach((p) => act(() => result.current.move(p)))
        act(() => result.current.move(0b100000000)) // next
      }
      expect(result.current.pvpRecords).toEqual([0, i, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`tie is ${i} after tie ${i} times`, () => {
      act(() => result.current.setPlayMode(PlayMode.Mode2P))
      for (let j = 0; j < i; j++) {
        tiePatterns.forEach((p) => act(() => result.current.move(p)))
        act(() => result.current.move(0b100000000)) // next
      }
      expect(result.current.pvpRecords).toEqual([0, 0, i])
    })
  }
})

describe('aiMove', () => {
  const { result } = renderHook(() => useGameStore())
  test('aiMove first', () => {
    act(() => result.current.aiMove()) // 1P
    expect(result.current.p1Moves).toBe(0b000000000)
  })
  test('aiMove after 1P', () => {
    act(() => result.current.move(0b100000000)) // 1P
    act(() => result.current.aiMove()) // 2P
    expect(result.current.p1Moves).toBe(0b100000000)
    expect(result.current.p2Moves).not.toBe(0b000000000)
  })
  test('aiMove almost win', () => {
    for (let i = 0; i < p2VictoryPatterns.length - 1; i++) {
      act(() => result.current.move(p2VictoryPatterns[i]))
    }
    act(() => result.current.aiMove()) // 2P
    expect(
      result.current.gameStatus(result.current.p1Moves, result.current.p2Moves)
    ).toBe(GameStatus.P2Victory)
  })
  test('aiMove prevent loss', () => {
    for (let i = 0; i < p1VictoryPatterns.length - 2; i++) {
      act(() => result.current.move(p1VictoryPatterns[i]))
    }
    act(() => result.current.aiMove()) // 2P
    expect(
      result.current.gameStatus(result.current.p1Moves, result.current.p2Moves)
    ).not.toBe(GameStatus.P1Victory)
  })
  test('game ended, let user click for next game', () => {
    for (let i = 0; i < tiePatterns.length; i++) {
      act(() => result.current.move(tiePatterns[i]))
    }
    const lastMove = result.current.p2Moves
    act(() => result.current.aiMove()) // 2P
    expect(result.current.p2Moves).toBe(lastMove)
    expect(result.current.playerNo).toBe(1)
  })
})

describe('load', () => {
  const { result } = renderHook(() => useGameStore())
  test('new game localStorage is 0_1_0_0_0_0_0_0_0_0', () => {
    expect(result.current.playMode).toBe(PlayMode.Mode1P)
    expect(result.current.playerNo).toBe(1)
    expect(result.current.p1Moves).toBe(0b000000000)
    expect(result.current.p2Moves).toBe(0b000000000)
    expect(result.current.pvcRecords).toEqual([0, 0, 0])
    expect(result.current.pvpRecords).toEqual([0, 0, 0])
  })
  test('localStorage is invalid', () => {
    act(() => result.current.load())
    expect(result.current.playMode).toBe(PlayMode.Mode1P)
    expect(result.current.playerNo).toBe(1)
    expect(result.current.p1Moves).toBe(0b000000000)
    expect(result.current.p2Moves).toBe(0b000000000)
    expect(result.current.pvcRecords).toEqual([0, 0, 0])
    expect(result.current.pvpRecords).toEqual([0, 0, 0])
  })
  test('localStorage is 1_2_1_2_3_4_5_6_7_8', () => {
    act(() => result.current.load('1_2_1_2_3_4_5_6_7_8'))
    expect(result.current.playMode).toBe(PlayMode.Mode2P)
    expect(result.current.playerNo).toBe(2)
    expect(result.current.p1Moves).toBe(0b000000001)
    expect(result.current.p2Moves).toBe(0b000000010)
    expect(result.current.pvcRecords).toEqual([3, 4, 5])
    expect(result.current.pvpRecords).toEqual([6, 7, 8])
  })
})
