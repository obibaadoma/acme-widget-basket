/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // Fast, accurate coverage
      reporter: ['text', 'json', 'html'], // Show in terminal + generate HTML report
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'src/index.ts',           // ← Your manual test runner (not unit test)
        'src/interfaces/**',      // ← Interfaces have no executable code
        'tests/**',               // ← Sometimes needed to avoid self-coverage
      ],
    },
  },
})