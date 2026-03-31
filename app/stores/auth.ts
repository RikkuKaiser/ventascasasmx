import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Usuario } from '~/types'

const STORAGE_USERS = 'luxeinmuebles_users'
const STORAGE_SESSION = 'luxeinmuebles_session'

function simpleHash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return String(h)
}

export type SesionUsuario = Omit<Usuario, 'passwordHash'>

export const useAuthStore = defineStore('auth', () => {
  const usuarios = ref<Usuario[]>([])
  const sesion = ref<SesionUsuario | null>(null)

  const estaAutenticado = computed(() => sesion.value !== null)

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

  function registrar(nombre: string, email: string, password: string) {
    const emailNorm = email.trim().toLowerCase()
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

  function iniciarSesion(email: string, password: string) {
    const emailNorm = email.trim().toLowerCase()
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
    cargarDesdeStorage,
    registrar,
    iniciarSesion,
    cerrarSesion,
  }
})
