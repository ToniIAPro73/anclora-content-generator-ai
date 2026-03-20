import '@testing-library/jest-dom'
import { beforeAll, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { createElement } from 'react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables
beforeAll(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test'
})

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next/image', () => ({
  default: ({
    alt,
    src,
    fill,
    priority,
    ...props
  }: { alt?: string; src?: string; fill?: boolean; priority?: boolean } & Record<string, unknown>) => {
    void fill
    void priority
    return createElement('img', { alt: alt ?? '', src: src ?? '', ...props })
  },
}))

// Mock Supabase client
vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
  }),
}))
