import { describe, expect, it } from 'vitest'

import { SurfaceCard } from '@/components/ui/surface-card'
import { renderWithProviders } from '@/test/render'

describe('SurfaceCard', () => {
  it('renders panel variant by default', () => {
    const { getByTestId } = renderWithProviders(
      <SurfaceCard data-testid="surface-card">Panel</SurfaceCard>
    )

    const card = getByTestId('surface-card')
    expect(card).toHaveAttribute('data-variant', 'panel')
    expect(card.className).toContain('surface-card-panel')
  })

  it('renders inner variant when requested', () => {
    const { getByTestId } = renderWithProviders(
      <SurfaceCard data-testid="surface-card" variant="inner">
        Inner
      </SurfaceCard>
    )

    const card = getByTestId('surface-card')
    expect(card).toHaveAttribute('data-variant', 'inner')
    expect(card.className).toContain('surface-card-inner')
  })
})
