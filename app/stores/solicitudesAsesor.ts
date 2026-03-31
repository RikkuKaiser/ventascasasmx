import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SolicitudAsesor } from '~/types'

const STORAGE = 'luxeinmuebles_solicitudes_asesor'

export const useSolicitudesAsesorStore = defineStore('solicitudesAsesor', () => {
  const items = ref<SolicitudAsesor[]>([])

  function cargar() {
    if (import.meta.server) return
    try {
      const raw = localStorage.getItem(STORAGE)
      if (raw) items.value = JSON.parse(raw) as SolicitudAsesor[]
    } catch {
      /* ignore */
    }
  }

  function guardar() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE, JSON.stringify(items.value))
  }

  function agregar(datos: {
    nombreCompleto: string
    email: string
    telefono: string
    ciudad: string
    perfil: 'independiente' | 'inmobiliaria'
    nombreInmobiliaria: string
    experiencia: string
    mensaje: string
  }) {
    const nombreCompleto = datos.nombreCompleto.trim()
    const email = datos.email.trim().toLowerCase()
    const telefono = datos.telefono.replace(/\s/g, '').trim()
    const ciudad = datos.ciudad.trim()
    const nombreInmobiliaria = datos.nombreInmobiliaria.trim()
    const mensaje = datos.mensaje.trim()

    if (!nombreCompleto)
      return { ok: false as const, error: 'Indica tu nombre completo.' }
    if (!email)
      return { ok: false as const, error: 'Indica un correo válido.' }
    if (!telefono || telefono.length < 10)
      return {
        ok: false as const,
        error: 'Indica un teléfono de contacto (mínimo 10 dígitos).',
      }
    if (datos.perfil === 'inmobiliaria' && !nombreInmobiliaria)
      return {
        ok: false as const,
        error: 'Indica el nombre de la inmobiliaria.',
      }

    const s: SolicitudAsesor = {
      id: crypto.randomUUID(),
      nombreCompleto,
      email,
      telefono,
      ciudad,
      perfil: datos.perfil,
      nombreInmobiliaria: datos.perfil === 'inmobiliaria' ? nombreInmobiliaria : '',
      experiencia: datos.experiencia,
      mensaje,
      creadoEn: new Date().toISOString(),
    }
    items.value.unshift(s)
    guardar()
    return { ok: true as const }
  }

  return { items, cargar, agregar }
})
