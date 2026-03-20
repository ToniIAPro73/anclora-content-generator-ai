import { expect, test } from '@playwright/test'

test.describe('Auth smoke', () => {
  test('home redirects to login', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('**/login')

    await expect(page).toHaveURL(/\/login$/)
  })

  test('login renders premium branding and auth modes', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Crear cuenta' })).toBeVisible()
    await expect(page.locator('text=by Anclora Group').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible()

    await page.getByRole('button', { name: 'Crear cuenta' }).click()
    await expect(page.getByText('Empieza gratis')).toBeVisible()
    await expect(page.getByLabel('Nombre completo')).toBeVisible()
  })
})
