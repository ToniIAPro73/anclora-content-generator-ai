import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import HomePage from '@/app/page'
import LoginPage from '@/app/login/page'
import { Sidebar } from '@/components/layout/Sidebar'
import { CONTENT_GENERATOR_BRAND } from '@/lib/brand'
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

describe('content-generator branding contract', () => {
  it('stays aligned with internal branding contract', () => {
    expect(CONTENT_GENERATOR_BRAND.name).toBe('Anclora Content Generator AI')
    expect(CONTENT_GENERATOR_BRAND.logoPath).toBe('/logo-content-generator-ai.png')
    expect(CONTENT_GENERATOR_BRAND.faviconPath).toBe('/contentgen_favicon.ico')
    expect(CONTENT_GENERATOR_BRAND.favicon32Path).toBe('/contentgen_favicon_32.png')
    expect(CONTENT_GENERATOR_BRAND.internalAccent).toBe('#E06848')
    expect(CONTENT_GENERATOR_BRAND.internalSecondary).toBe('#5A9A78')
    expect(CONTENT_GENERATOR_BRAND.internalInterior).toBe('#1A1410')
    expect(CONTENT_GENERATOR_BRAND.internalTypography).toBe('Inter')
    expect(CONTENT_GENERATOR_BRAND.iconBorder).toBe('plata-cromada')
  })
})
