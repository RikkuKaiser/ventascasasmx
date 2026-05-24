import {
  SITEMAP_STATIC_PATHS,
  absoluteUrl,
} from '../../app/constants/site'

type InmuebleSitemap = { id: number | string }

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://ventascasasmx.store')
  const apiBase = String(config.public.apiBase || '').replace(/\/$/, '')

  const paths = [...SITEMAP_STATIC_PATHS]

  if (apiBase) {
    try {
      const inmuebles = await $fetch<InmuebleSitemap[]>(`${apiBase}/inmuebles`)
      for (const item of inmuebles)
        paths.push(`/inmuebles/${item.id}`)
    } catch {
      /* catálogo vacío o API no disponible */
    }
  }

  const urls = paths
    .map(
      (path) => `  <url>
    <loc>${escapeXml(absoluteUrl(path, siteUrl))}</loc>
    <changefreq>${path === '/' ? 'daily' : path.startsWith('/inmuebles/') ? 'weekly' : 'monthly'}</changefreq>
  </url>`,
    )
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
