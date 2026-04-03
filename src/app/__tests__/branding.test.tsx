import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import HomePage from '@/app/page'
import LoginPage from '@/app/login/page'
import { Sidebar } from '@/components/layout/Sidebar'
import { renderWithProviders } from '@/test/render'

describe('Anclora branding assets', () => {
  it('uses the canonical logo asset across home, login, and dashboard shell', () => {
    const { rerender } = renderWithProviders(<HomePage />)

    expect(screen.getAllByAltText('Anclora Content Generator AI')[0]).toHaveAttribute(
      'src',
      '/logo-content-generator-ai.png',
    )

    rerender(<LoginPage />)
    expect(screen.getAllByAltText('Anclora Content Generator AI logo')[0]).toHaveAttribute(
      'src',
      '/logo-content-generator-ai.png',
    )

    rerender(<Sidebar isCollapsed={false} onToggle={() => undefined} />)
    expect(screen.getByAltText('Anclora Content Generator AI logo')).toHaveAttribute(
      'src',
      '/logo-content-generator-ai.png',
    )
  })
})
