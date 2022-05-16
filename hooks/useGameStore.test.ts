import { describe, expect, test } from 'vitest'
import { PlayMode, useGameStore } from './useGameStore'

describe('keyboardLetterState', () => {
  test('new game playMode', () => {
    expect(useGameStore.getState().playMode).toEqual(PlayMode.Mode1P)
  })
  test('new game playerNo', () => {
    expect(useGameStore.getState().playerNo).toEqual(1)
  })
  test('new game p1Moves', () => {
    expect(useGameStore.getState().p1Moves).toEqual(0)
  })
  test('new game p2Moves', () => {
    expect(useGameStore.getState().p2Moves).toEqual(0)
  })
  test('new game pvcRecords', () => {
    expect(useGameStore.getState().pvcRecords).toEqual([0, 0, 0])
  })
  test('new game pvpRecords', () => {
    expect(useGameStore.getState().pvpRecords).toEqual([0, 0, 0])
  })
})
