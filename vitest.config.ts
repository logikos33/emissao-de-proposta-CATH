import { defineConfig } from 'vitest/config'

/** Vitest — aponta para módulos puros em src/lib/ (sem dependências de Next.js/React) */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/lib/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/pricing/**/*.ts'],
      exclude: ['src/lib/pricing/**/*.test.ts', 'src/lib/pricing/__tests__/**'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
