import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
    pool: 'forks',
    isolate: false,
    fileParallelism: false,
    maxWorkers: 1,
    execArgv: ['--max-old-space-size=4096'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'vitest.config.ts',
        'vitest.setup.ts',
        'playwright.config.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        'src/app/layout.tsx',
        'src/app/page.tsx',
        'src/middleware.ts',
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
