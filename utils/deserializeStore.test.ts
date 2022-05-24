import { renderHook } from '@testing-library/react-hooks/pure'
import { useGameStore } from '../hooks/useGameStore'
import { PlayMode } from '../types'
import { deserializeStore } from './deserializeStore'

describe('deserializeStore', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('deserializeStore is 0 when no occupied', () => {
    const serialized = deserializeStore('0_0_0_0_0_0_0_0_0_0')
    expect(serialized.playMode).toBe(PlayMode.ModePvC)
    expect(serialized.playerNo).toBe(0)
    expect(serialized.p1Moves).toBe(0b000000000)
    expect(serialized.p2Moves).toBe(0b000000000)
    expect(serialized.pvcRecords?.[0]).toBe(0)
    expect(serialized.pvcRecords?.[1]).toBe(0)
    expect(serialized.pvcRecords?.[2]).toBe(0)
    expect(serialized.pvpRecords?.[0]).toBe(0)
    expect(serialized.pvpRecords?.[1]).toBe(0)
    expect(serialized.pvpRecords?.[2]).toBe(0)
  })
})
