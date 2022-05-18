import { renderHook, act } from '@testing-library/react-hooks/pure'
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

describe('cells', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game cells should be unique', () => {
    expect(new Set(gameStore.current.cells()).size).toBe(
      gameStore.current.cells().length
    )
  })
})

describe('victoryPattern', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('victoryPattern is 0 when no occupied', () => {
    expect(gameStore.current.victoryPattern(0)).toBe(0)
  })
  for (const pattern of VICTORY_PATTERNS) {
    test(
      `victoryPattern is ${pattern.toString(2)} when ` +
        `${pattern.toString(2)} is occupied `,
      () => {
        expect(gameStore.current.victoryPattern(pattern)).toBe(pattern)
      }
    )
  }
})

describe('playMode', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game playMode is ModePvC', () => {
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvC)
  })
  test('setPlayMode should change playMode from ModePvC to ModePvP', () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvP)
  })
  test('setPlayMode should change playMode from ModePvP to ModePvC', () => {
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
    act(() => gameStore.current.setPlayMode(PlayMode.ModePvC))
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
        act(() => gameStore.current.move(positions[j]))
      }
      expect(gameStore.current.playerNo).toBe(expected)
    })
  }
})

describe('gameStatus', () => {
  const { result: gameStore } = renderHook(() => useGameStore())

  test('new game gameStatus is InProgress', () => {
    expect(
      gameStore.current.gameStatus(
        gameStore.current.p1Moves,
        gameStore.current.p2Moves
      )
    ).toBe(GameStatus.InProgress)
  })

  test('gameStatus should be P1Victory', () => {
    p1VictoryPatterns.forEach((p) => act(() => gameStore.current.move(p)))
    expect(
      gameStore.current.gameStatus(
        gameStore.current.p1Moves,
        gameStore.current.p2Moves
      )
    ).toBe(GameStatus.P1Victory)
  })

  test('gameStatus should be P2Victory', () => {
    p2VictoryPatterns.forEach((p) => act(() => gameStore.current.move(p)))
    expect(
      gameStore.current.gameStatus(
        gameStore.current.p1Moves,
        gameStore.current.p2Moves
      )
    ).toBe(GameStatus.P2Victory)
  })

  test('gameStatus should be Tie', () => {
    tiePatterns.forEach((p) => act(() => gameStore.current.move(p)))
    expect(
      gameStore.current.gameStatus(
        gameStore.current.p1Moves,
        gameStore.current.p2Moves
      )
    ).toBe(GameStatus.Tie)
  })
})

describe('p1Moves', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game p1Moves is 0b000000000', () => {
    expect(gameStore.current.p1Moves).toBe(0b000000000)
  })
  test('p1Moves is 0b100000000 after move 0b100000000', () => {
    act(() => gameStore.current.move(0b100000000)) // 1P
    expect(gameStore.current.p1Moves).toBe(0b100000000)
  })

  test('p1Moves is 0b110000000 after move 0b100000000 & 0b010000000', () => {
    act(() => gameStore.current.move(0b100000000)) // 1P
    act(() => gameStore.current.move(0b000000001)) // 2P
    act(() => gameStore.current.move(0b010000000)) // 1P
    expect(gameStore.current.p1Moves).toBe(0b110000000)
  })
  test('ignore if cell is occupied or invalid move', () => {
    act(() => gameStore.current.move(0b1000000000)) // invalid
    act(() => gameStore.current.move(0b100000000)) // 1P
    act(() => gameStore.current.move(0b000000001)) // 2P
    act(() => gameStore.current.move(0b100000000)) // 1P
    expect(gameStore.current.p1Moves).toBe(0b100000000)
  })
})

describe('p2Moves', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game p2Moves is 0b000000000', () => {
    expect(gameStore.current.p2Moves).toBe(0b000000000)
  })
  test('p2Moves is 0b100000000 after move 0b100000000', () => {
    act(() => gameStore.current.move(0b000000001)) // 1P
    act(() => gameStore.current.move(0b100000000)) // 2P
    expect(gameStore.current.p2Moves).toBe(0b100000000)
  })

  test('p2Moves is 0b110000000 after move 0b100000000 & 0b010000000', () => {
    act(() => gameStore.current.move(0b000000001)) // 1P
    act(() => gameStore.current.move(0b100000000)) // 2P
    act(() => gameStore.current.move(0b000000010)) // 1P
    act(() => gameStore.current.move(0b010000000)) // 2P
    expect(gameStore.current.p2Moves).toBe(0b110000000)
  })
  test('ignore if cell is occupied or invalid move', () => {
    act(() => gameStore.current.move(0b100000000)) // 1P
    act(() => gameStore.current.move(0b1000000000)) // invalid
    act(() => gameStore.current.move(0b100000000)) // invalid
    act(() => gameStore.current.move(0b010000000)) // 2P
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
        p1VictoryPatterns.forEach((p) => act(() => gameStore.current.move(p)))
        act(() => gameStore.current.move(0b100000000)) // next
      }
      expect(gameStore.current.pvcRecords).toEqual([i, 0, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`p2Victory is ${i} after p2 winning ${i} times`, () => {
      for (let j = 0; j < i; j++) {
        p2VictoryPatterns.forEach((p) => act(() => gameStore.current.move(p)))
        act(() => gameStore.current.move(0b100000000)) // next
      }
      expect(gameStore.current.pvcRecords).toEqual([0, i, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`tie is ${i} after tie ${i} times`, () => {
      for (let j = 0; j < i; j++) {
        tiePatterns.forEach((p) => act(() => gameStore.current.move(p)))
        act(() => gameStore.current.move(0b100000000)) // next
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
      act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
      for (let j = 0; j < i; j++) {
        p1VictoryPatterns.forEach((p) => act(() => gameStore.current.move(p)))
        act(() => gameStore.current.move(0b100000000)) // next
      }
      expect(gameStore.current.pvpRecords).toEqual([i, 0, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`p2Victory is ${i} after p2 winning ${i} times`, () => {
      act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
      for (let j = 0; j < i; j++) {
        p2VictoryPatterns.forEach((p) => act(() => gameStore.current.move(p)))
        act(() => gameStore.current.move(0b100000000)) // next
      }
      expect(gameStore.current.pvpRecords).toEqual([0, i, 0])
    })
  }

  for (let i = 0; i <= 3; i++) {
    test(`tie is ${i} after tie ${i} times`, () => {
      act(() => gameStore.current.setPlayMode(PlayMode.ModePvP))
      for (let j = 0; j < i; j++) {
        tiePatterns.forEach((p) => act(() => gameStore.current.move(p)))
        act(() => gameStore.current.move(0b100000000)) // next
      }
      expect(gameStore.current.pvpRecords).toEqual([0, 0, i])
    })
  }
})

describe('aiMove', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('aiMove move second on PvC', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    act(() => gameStore.current.aiMove()) // 1P
    expect(gameStore.current.p1Moves).toBe(0b000000000)
  })
  test('aiMove move first on CvP', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModeCvP }))
    act(() => gameStore.current.aiMove()) // 1P
    expect(gameStore.current.p1Moves).not.toBe(0b000000000)
  })
  test('aiMove after 1P', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    act(() => gameStore.current.move(0b100000000)) // 1P
    act(() => gameStore.current.aiMove()) // 2P
    expect(gameStore.current.p1Moves).toBe(0b100000000)
    expect(gameStore.current.p2Moves).not.toBe(0b000000000)
  })
  test('aiMove almost win', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvP }))
    for (let i = 0; i < p2VictoryPatterns.length - 1; i++) {
      act(() => gameStore.current.move(p2VictoryPatterns[i]))
    }
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    act(() => gameStore.current.aiMove()) // 2P
    expect(
      gameStore.current.gameStatus(
        gameStore.current.p1Moves,
        gameStore.current.p2Moves
      )
    ).toBe(GameStatus.P2Victory)
  })
  test('aiMove prevent loss', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvP }))
    for (let i = 0; i < p1VictoryPatterns.length - 2; i++) {
      act(() => gameStore.current.move(p1VictoryPatterns[i]))
    }
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    act(() => gameStore.current.aiMove()) // 2P
    expect(
      gameStore.current.gameStatus(
        gameStore.current.p1Moves,
        gameStore.current.p2Moves
      )
    ).not.toBe(GameStatus.P1Victory)
  })
  test('game ended, let user click for next game', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvP }))
    for (let i = 0; i < tiePatterns.length; i++) {
      act(() => gameStore.current.move(tiePatterns[i]))
    }
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    const lastP2Move = gameStore.current.p2Moves
    act(() => gameStore.current.aiMove()) // 2P
    expect(gameStore.current.p2Moves).toBe(lastP2Move)
    expect(gameStore.current.playerNo).toBe(0)
    act(() =>
      useGameStore.setState({ playMode: PlayMode.ModeCvP, playerNo: 0 })
    )
    const lastP1Move = gameStore.current.p1Moves
    act(() => gameStore.current.aiMove()) // 1P
    expect(gameStore.current.p1Moves).toBe(lastP1Move)
    expect(gameStore.current.playerNo).toBe(1)
  })
})

describe('load', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('new game localStorage is 0_0_0_0_0_0_0_0_0_0', () => {
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvC)
    expect(gameStore.current.playerNo).toBe(0)
    expect(gameStore.current.p1Moves).toBe(0b000000000)
    expect(gameStore.current.p2Moves).toBe(0b000000000)
    expect(gameStore.current.pvcRecords).toEqual([0, 0, 0])
    expect(gameStore.current.pvpRecords).toEqual([0, 0, 0])
  })
  test('localStorage is invalid', () => {
    act(() => gameStore.current.load())
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvC)
    expect(gameStore.current.playerNo).toBe(0)
    expect(gameStore.current.p1Moves).toBe(0b000000000)
    expect(gameStore.current.p2Moves).toBe(0b000000000)
    expect(gameStore.current.pvcRecords).toEqual([0, 0, 0])
    expect(gameStore.current.pvpRecords).toEqual([0, 0, 0])
  })
  test('load is 1_1_1_2_3_4_5_6_7_8', () => {
    act(() => gameStore.current.load('1_1_1_2_3_4_5_6_7_8'))
    expect(gameStore.current.playMode).toBe(PlayMode.ModePvP)
    expect(gameStore.current.playerNo).toBe(1)
    expect(gameStore.current.p1Moves).toBe(0b000000001)
    expect(gameStore.current.p2Moves).toBe(0b000000010)
    expect(gameStore.current.pvcRecords).toEqual([3, 4, 5])
    expect(gameStore.current.pvpRecords).toEqual([6, 7, 8])
  })
})
