import { act, renderHook } from '@testing-library/react-hooks/pure'
import {
  TestP1VictoryPatterns,
  TestP2VictoryPatterns,
  TestTiePatterns,
} from '../constants'
import { useGameStore } from '../hooks/useGameStore'
import { GameStatus, PlayMode } from '../types'
import { aiMove } from './aiMove'
import { gameStatus } from './gameStatus'
import { move } from './move'

describe('aiMove', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('aiMove move second on PvC', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    act(() =>
      aiMove(
        gameStore.current.playMode,
        gameStore.current.playerNo,
        gameStore.current.p1Moves,
        gameStore.current.p2Moves,
        gameStore.current.dispatch
      )
    ) // 1P
    expect(gameStore.current.p1Moves).toBe(0b000000000)
  })
  test('aiMove move first on CvP', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModeCvP }))
    act(() =>
      aiMove(
        gameStore.current.playMode,
        gameStore.current.playerNo,
        gameStore.current.p1Moves,
        gameStore.current.p2Moves,
        gameStore.current.dispatch
      )
    ) // 1P
    expect(gameStore.current.p1Moves).not.toBe(0b000000000)
  })
  test('aiMove after 1P', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    act(() => move(gameStore.current.dispatch, 0b100000000)) // 1P
    act(() =>
      aiMove(
        gameStore.current.playMode,
        gameStore.current.playerNo,
        gameStore.current.p1Moves,
        gameStore.current.p2Moves,
        gameStore.current.dispatch
      )
    ) // 2P
    expect(gameStore.current.p1Moves).toBe(0b100000000)
    expect(gameStore.current.p2Moves).not.toBe(0b000000000)
  })
  test('aiMove almost win', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvP }))
    for (let i = 0; i < TestP2VictoryPatterns.length - 1; i++) {
      act(() => move(gameStore.current.dispatch, TestP2VictoryPatterns[i]))
    }
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    act(() =>
      aiMove(
        gameStore.current.playMode,
        gameStore.current.playerNo,
        gameStore.current.p1Moves,
        gameStore.current.p2Moves,
        gameStore.current.dispatch
      )
    ) // 2P
    expect(
      gameStatus(gameStore.current.p1Moves, gameStore.current.p2Moves)
    ).toBe(GameStatus.P2Victory)
  })
  test('aiMove prevent loss', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvP }))
    for (let i = 0; i < TestP1VictoryPatterns.length - 2; i++) {
      act(() => move(gameStore.current.dispatch, TestP1VictoryPatterns[i]))
    }
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    act(() =>
      aiMove(
        gameStore.current.playMode,
        gameStore.current.playerNo,
        gameStore.current.p1Moves,
        gameStore.current.p2Moves,
        gameStore.current.dispatch
      )
    ) // 2P
    expect(
      gameStatus(gameStore.current.p1Moves, gameStore.current.p2Moves)
    ).not.toBe(GameStatus.P1Victory)
  })
  test('game ended, let user click for next game', () => {
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvP }))
    for (let i = 0; i < TestTiePatterns.length; i++) {
      act(() => move(gameStore.current.dispatch, TestTiePatterns[i]))
    }
    act(() => useGameStore.setState({ playMode: PlayMode.ModePvC }))
    const lastP2Move = gameStore.current.p2Moves
    act(() =>
      aiMove(
        gameStore.current.playMode,
        gameStore.current.playerNo,
        gameStore.current.p1Moves,
        gameStore.current.p2Moves,
        gameStore.current.dispatch
      )
    ) // 2P
    expect(gameStore.current.p2Moves).toBe(lastP2Move)
    expect(gameStore.current.playerNo).toBe(0)
    act(() =>
      useGameStore.setState({ playMode: PlayMode.ModeCvP, playerNo: 0 })
    )
    const lastP1Move = gameStore.current.p1Moves
    act(() =>
      aiMove(
        gameStore.current.playMode,
        gameStore.current.playerNo,
        gameStore.current.p1Moves,
        gameStore.current.p2Moves,
        gameStore.current.dispatch
      )
    ) // 1P
    expect(gameStore.current.p1Moves).toBe(lastP1Move)
    expect(gameStore.current.playerNo).toBe(1)
  })
})
