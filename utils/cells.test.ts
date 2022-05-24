import { cells } from './cells'

describe('cells', () => {
  test('new game cells should be unique', () => {
    expect(new Set(cells()).size).toBe(cells().length)
  })
})
