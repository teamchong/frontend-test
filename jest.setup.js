// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import fetchMock from 'jest-fetch-mock'
import { act } from '@testing-library/react-hooks/pure'
import { serializeStore } from './utils/serializeStore'
import { useGameStore } from './hooks/useGameStore'
import { load } from './utils/load'

fetchMock.enableMocks()
const initialState = serializeStore(useGameStore.getState())

beforeEach(() => {
  jest.useFakeTimers()
  jest.spyOn(global, 'setTimeout')
})
afterEach(() => {
  act(() => load(useGameStore.getState().dispatch, initialState))
  jest.mocked(global.setTimeout).mockRestore()
  jest.useRealTimers()
})
