export const CONTENT_GENERATOR_BRAND = {
  name: 'Anclora Content Generator AI',
  description: 'Motor editorial y de inteligencia de contenido para Anclora Private Estates.',
  logoPath: '/logo-content-generator-ai.png',
  faviconPath: '/contentgen_favicon.ico',
  favicon32Path: '/contentgen_favicon_32.png',
  favicon512Path: '/contentgen_favicon_512.png',
  internalAccent: '#E06848',
  internalSecondary: '#5A9A78',
  internalInterior: '#1A1410',
  internalTypography: 'Inter',
  iconBorder: 'plata-cromada',
} as const

// Backwards-compatible alias
export const CONTENT_GENERATOR_LOGO_SRC = CONTENT_GENERATOR_BRAND.logoPath
