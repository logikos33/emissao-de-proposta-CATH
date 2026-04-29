import { defineConfig } from 'vitest/config'

/** Vitest — aponta para módulos puros em src/lib/ (sem dependências de Next.js/React) */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/lib/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.test.ts'],
    },
  },
})
