/// <reference types="vitest" />

import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    exclude: configDefaults.exclude.concat(['e2e/*']),
    coverage: {
      exclude: ['.pnp.*'],
    },
  },
})
