import { renderHook } from '@testing-library/react-hooks/pure'
import { useGameStore } from '../hooks/useGameStore'
import { serializeStore } from './serializeStore'

describe('serializeStore', () => {
  const { result: gameStore } = renderHook(() => useGameStore())
  test('serializeStore is 0 when no occupied', () => {
    const serialized = serializeStore(gameStore.current)
    expect(serialized).toBe('0_0_0_0_0_0_0_0_0_0')
  })
})
