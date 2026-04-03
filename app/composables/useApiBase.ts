/** Base URL del API Nest (ej. http://localhost:3001/api). Sin barra final. */
export function useApiBase(): string {
  const config = useRuntimeConfig()
  const raw = (config.public as { apiBase?: string }).apiBase ?? ''
  return String(raw).replace(/\/$/, '')
}
