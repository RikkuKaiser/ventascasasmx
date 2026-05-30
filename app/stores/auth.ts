import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Usuario } from '~/types'
import { esEmailPublicador } from '~/constants/publishers'

const STORAGE_USERS = 'luxeinmuebles_users'
const STORAGE_SESSION = 'luxeinmuebles_session'

function simpleHash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return String(h)
}

export type SesionUsuario = Omit<Usuario, 'passwordHash'> & {
  accessToken?: string
}

export const useAuthStore = defineStore('auth', () => {
  const usuarios = ref<Usuario[]>([])
  const sesion = ref<SesionUsuario | null>(null)

  const estaAutenticado = computed(() => sesion.value !== null)

  /** Con API configurado, hace falta JWT; sin API basta la sesión local. */
  const sesionValidaParaApi = computed(() => {
    if (!sesion.value) return false
    const base = useApiBase()
    if (!base) return true
    return Boolean(sesion.value.accessToken?.trim())
  })

  const puedePublicarInmuebles = computed(() =>
    esEmailPublicador(sesion.value?.email),
  )

  function invalidarSesionSiApiRechaza(e: unknown): boolean {
    const code =
      typeof e === 'object' && e !== null && 'status' in e
        ? Number((e as { status: number }).status)
        : typeof e === 'object' && e !== null && 'statusCode' in e
          ? Number((e as { statusCode: number }).statusCode)
          : 0
    if (code === 401 || code === 403) {
      cerrarSesion()
      return true
    }
    return false
  }

  function cargarDesdeStorage() {
    if (import.meta.server) return
    try {
      const u = localStorage.getItem(STORAGE_USERS)
      if (u) usuarios.value = JSON.parse(u) as Usuario[]
      const s = localStorage.getItem(STORAGE_SESSION)
      if (s) sesion.value = JSON.parse(s) as SesionUsuario
    } catch {
      /* ignore */
    }
  }

  function guardarUsuarios() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE_USERS, JSON.stringify(usuarios.value))
  }

  function guardarSesion() {
    if (import.meta.server) return
    if (sesion.value)
      localStorage.setItem(STORAGE_SESSION, JSON.stringify(sesion.value))
    else localStorage.removeItem(STORAGE_SESSION)
  }

  async function registrar(nombre: string, email: string, password: string) {
    const base = useApiBase()
    const emailNorm = email.trim().toLowerCase()
    if (base) {
      try {
        const res = await $fetch<{
          accessToken: string
          user: { id: string; nombre: string; email: string }
        }>(`${base}/auth/register`, {
          method: 'POST',
          body: {
            nombre: nombre.trim(),
            email: emailNorm,
            password,
          },
        })
        sesion.value = {
          id: res.user.id,
          nombre: res.user.nombre,
          email: res.user.email,
          accessToken: res.accessToken,
        }
        guardarSesion()
        return { ok: true as const }
      } catch (e: unknown) {
        const status =
          typeof e === 'object' && e !== null && 'status' in e
            ? Number((e as { status: number }).status)
            : 0
        if (status === 409)
          return { ok: false as const, error: 'Ese correo ya está registrado.' }
        return {
          ok: false as const,
          error: extractApiMessage(e, 'No se pudo completar el registro.'),
        }
      }
    }
    if (usuarios.value.some((u) => u.email === emailNorm))
      return { ok: false as const, error: 'Ese correo ya está registrado.' }
    const user: Usuario = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      email: emailNorm,
      passwordHash: simpleHash(password),
    }
    usuarios.value.push(user)
    guardarUsuarios()
    sesion.value = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
    }
    guardarSesion()
    return { ok: true as const }
  }

  async function iniciarSesion(email: string, password: string) {
    const base = useApiBase()
    const emailNorm = email.trim().toLowerCase()
    if (base) {
      try {
        const res = await $fetch<{
          accessToken: string
          user: { id: string; nombre: string; email: string }
        }>(`${base}/auth/login`, {
          method: 'POST',
          body: { email: emailNorm, password },
        })
        sesion.value = {
          id: res.user.id,
          nombre: res.user.nombre,
          email: res.user.email,
          accessToken: res.accessToken,
        }
        guardarSesion()
        return { ok: true as const }
      } catch (e: unknown) {
        if (esErrorRedApi(e)) {
          return {
            ok: false as const,
            error:
              'No se pudo conectar con el servidor. Si estás en producción, revisa que el API permita CORS desde este dominio.',
          }
        }
        return { ok: false as const, error: 'Correo o contraseña incorrectos.' }
      }
    }
    const user = usuarios.value.find((u) => u.email === emailNorm)
    if (!user || user.passwordHash !== simpleHash(password))
      return { ok: false as const, error: 'Correo o contraseña incorrectos.' }
    sesion.value = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
    }
    guardarSesion()
    return { ok: true as const }
  }

  function cerrarSesion() {
    sesion.value = null
    guardarSesion()
  }

  return {
    sesion,
    estaAutenticado,
    sesionValidaParaApi,
    puedePublicarInmuebles,
    invalidarSesionSiApiRechaza,
    cargarDesdeStorage,
    registrar,
    iniciarSesion,
    cerrarSesion,
  }
})

function esErrorRedApi(e: unknown): boolean {
  if (!e || typeof e !== 'object') return false
  const msg = String(
    ('message' in e && (e as { message?: string }).message)
    || ('statusMessage' in e && (e as { statusMessage?: string }).statusMessage)
    || '',
  ).toLowerCase()
  if (msg.includes('failed to fetch') || msg.includes('networkerror'))
    return true
  const code = 'statusCode' in e ? Number((e as { statusCode: number }).statusCode) : 0
  const status = 'status' in e ? Number((e as { status: number }).status) : 0
  return code === 0 && status === 0
}

function extractApiMessage(e: unknown, fallback: string): string {
  if (e && typeof e === 'object' && 'data' in e) {
    const d = (e as { data?: { message?: string | string[] } }).data
    const m = d?.message
    if (Array.isArray(m)) return m.join(' ')
    if (typeof m === 'string') return m
  }
  return fallback
}
