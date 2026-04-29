import path from 'node:path'
import { defineConfig } from 'vitest/config'

/** Vitest — aponta para módulos puros em src/lib/ (sem dependências de Next.js/React) */
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['src/__tests__/setup.ts'],
    include: ['src/lib/**/*.test.ts', 'src/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/pricing/**/*.ts',
        'src/lib/extraction/**/*.ts',
        'src/lib/utils/currency.ts',
        'src/lib/stores/proposta.store.ts',
        'src/lib/api/extract-client.ts',
        'src/lib/schemas/proposta-form.ts',
      ],
      exclude: [
        'src/lib/pricing/**/*.test.ts',
        'src/lib/pricing/__tests__/**',
        'src/lib/extraction/**/*.test.ts',
        'src/lib/extraction/__tests__/**',
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
})
