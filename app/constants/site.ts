/** URL pública del sitio (Google, Open Graph, sitemap). */
export const SITE_URL = 'https://ventascasasmx.store'

export const SITE_NAME = 'Ventas Casas MX'

export const SITE_DESCRIPTION =
  'Casas, departamentos y terrenos en venta y renta en México. Catálogo con fichas claras y documentación verificada.'

export const SOCIAL_URLS = [
  'https://www.youtube.com/@Inmueblessinmetiras',
  'https://www.facebook.com/profile.php?id=61563489190845',
  'https://www.instagram.com/ventas_casamx/',
] as const

/** Rutas públicas indexables (sin área interna ni formularios ocultos). */
export const SITEMAP_STATIC_PATHS = [
  '/',
  '/inmuebles',
  '/login',
  '/registro',
  '/favoritos',
  '/terminos',
  '/aviso-privacidad',
  '/quienes-somos',
] as const

export function absoluteUrl(path: string, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, '')
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
