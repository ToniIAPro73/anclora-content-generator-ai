import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LoginPage from '../page'
import { renderWithProviders } from '@/test/render'

const authMocks = vi.hoisted(() => ({
  signInEmail: vi.fn(),
  signUpEmail: vi.fn(),
}))

vi.mock('@/lib/auth/better-auth-client', () => ({
  betterAuthClient: {
    signIn: {
      email: authMocks.signInEmail,
    },
    signUp: {
      email: authMocks.signUpEmail,
    },
  },
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Anclora branding and auth tabs', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getAllByText('Anclora Content Generator AI').length).toBeGreaterThan(0)
    expect(screen.getAllByText('by Anclora Group').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument()
  })

  it('switches to sign up mode', () => {
    renderWithProviders(<LoginPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(screen.getByText('Empieza gratis')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
  })

  it('shows auth errors returned by Better Auth', async () => {
    authMocks.signInEmail.mockResolvedValueOnce({
      error: { message: 'Credenciales inválidas' },
    })

    renderWithProviders(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'founder@anclora.es' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'bad-password' } })
    fireEvent.submit(screen.getByRole('button', { name: 'Entrar al Studio' }).closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument()
    })
  })
})
