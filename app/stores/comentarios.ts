import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Comentario } from '~/types'

const STORAGE = 'luxeinmuebles_comentarios'

export const useComentariosStore = defineStore('comentarios', () => {
  const items = ref<Comentario[]>([])

  function cargar() {
    if (import.meta.server) return
    try {
      const raw = localStorage.getItem(STORAGE)
      if (raw) items.value = JSON.parse(raw) as Comentario[]
    } catch {
      /* ignore */
    }
  }

  function guardar() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE, JSON.stringify(items.value))
  }

  function porInmueble(inmuebleId: string) {
    return items.value
      .filter((c) => c.inmuebleId === inmuebleId)
      .sort(
        (a, b) =>
          new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
      )
  }

  function agregar(
    inmuebleId: string,
    userId: string,
    nombreUsuario: string,
    texto: string,
  ) {
    const t = texto.trim()
    if (!t) return { ok: false as const, error: 'Escribe un comentario.' }
    const c: Comentario = {
      id: crypto.randomUUID(),
      inmuebleId,
      userId,
      nombreUsuario,
      texto: t,
      creadoEn: new Date().toISOString(),
    }
    items.value.unshift(c)
    guardar()
    return { ok: true as const }
  }

  return { items, cargar, porInmueble, agregar }
})
