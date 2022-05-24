import { act, renderHook } from '@testing-library/react-hooks/pure'
import {
  TestP1VictoryPatterns,
  TestP2VictoryPatterns,
  TestTiePatterns,
} from '../constants'
import { useGameStore } from '../hooks/useGameStore'
import { GameStatus } from '../types'
import { gameStatus } from './gameStatus'
import { move } from './move'

describe('gameStatus', () => {
  const { result: gameStore } = renderHook(() => useGameStore())

  test('new game gameStatus is InProgress', () => {
    expect(
      gameStatus(gameStore.current.p1Moves, gameStore.current.p2Moves)
    ).toBe(GameStatus.InProgress)
  })

  test('gameStatus should be P1Victory', () => {
    TestP1VictoryPatterns.forEach((p) =>
      act(() => move(gameStore.current.dispatch, p))
    )
    expect(
      gameStatus(gameStore.current.p1Moves, gameStore.current.p2Moves)
    ).toBe(GameStatus.P1Victory)
  })

  test('gameStatus should be P2Victory', () => {
    TestP2VictoryPatterns.forEach((p) =>
      act(() => move(gameStore.current.dispatch, p))
    )
    expect(
      gameStatus(gameStore.current.p1Moves, gameStore.current.p2Moves)
    ).toBe(GameStatus.P2Victory)
  })

  test('gameStatus should be Tie', () => {
    TestTiePatterns.forEach((p) =>
      act(() => move(gameStore.current.dispatch, p))
    )
    expect(
      gameStatus(gameStore.current.p1Moves, gameStore.current.p2Moves)
    ).toBe(GameStatus.Tie)
  })
})
