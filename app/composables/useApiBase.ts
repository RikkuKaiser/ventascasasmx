/**
 * Base URL del API Nest (ej. http://localhost:3001/api). Sin barra final.
 * Si falta https:// o http://, el navegador trata el valor como ruta relativa al sitio
 * (p. ej. Railway front + API en otro host → 404 en el propio dominio del front).
 */
export function useApiBase(): string {
  const config = useRuntimeConfig()
  let s = String((config.public as { apiBase?: string }).apiBase ?? '').trim()
  s = s.replace(/\/$/, '')
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith('/')) return s
  const host = s.split('/')[0] ?? ''
  if (/^localhost|^127\.\d+\.\d+\.\d+/i.test(host))
    return `http://${s}`
  if (/\./.test(host)) return `https://${s}`
  return s
}
