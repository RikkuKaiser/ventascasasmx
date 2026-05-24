/** Debe coincidir con `api/src/database/demo-users.ts`. */
export const PUBLISHER_EMAILS = [
  'cristobal@ventascasasmx.com',
  'cynthia@ventascasasmx.com',
] as const

export function esEmailPublicador(email: string | undefined | null): boolean {
  if (!email) return false
  const norm = email.trim().toLowerCase()
  return (PUBLISHER_EMAILS as readonly string[]).includes(norm)
}
