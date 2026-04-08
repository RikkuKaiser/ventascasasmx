import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Comentario } from '~/types'
import { useAuthStore } from '~/stores/auth'

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

  async function cargarInmueble(inmuebleId: string | number) {
    const base = useApiBase()
    if (!base) return
    try {
      const list = await $fetch<Comentario[]>(
        `${base}/inmuebles/${String(inmuebleId)}/comentarios`,
      )
      items.value = items.value.filter(
        (c) => String(c.inmuebleId) !== String(inmuebleId),
      )
      items.value.push(...list)
    } catch {
      /* ignore */
    }
  }

  function porInmueble(inmuebleId: string | number) {
    return items.value
      .filter((c) => String(c.inmuebleId) === String(inmuebleId))
      .sort(
        (a, b) =>
          new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
      )
  }

  async function agregar(
    inmuebleId: string | number,
    userId: string,
    nombreUsuario: string,
    texto: string,
  ) {
    const t = texto.trim()
    if (!t) return { ok: false as const, error: 'Escribe un comentario.' }
    const base = useApiBase()
    const auth = useAuthStore()
    if (base && auth.sesion?.accessToken) {
      try {
        const c = await $fetch<Comentario>(
          `${base}/inmuebles/${String(inmuebleId)}/comentarios`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${auth.sesion.accessToken}`,
            },
            body: { texto: t },
          },
        )
        items.value = items.value.filter((x) => x.id !== c.id)
        items.value.unshift(c)
        return { ok: true as const }
      } catch {
        return { ok: false as const, error: 'No se pudo publicar el comentario.' }
      }
    }
    const c: Comentario = {
      id: crypto.randomUUID(),
      inmuebleId: Number(inmuebleId),
      userId,
      nombreUsuario,
      texto: t,
      creadoEn: new Date().toISOString(),
    }
    items.value.unshift(c)
    guardar()
    return { ok: true as const }
  }

  return { items, cargar, cargarInmueble, porInmueble, agregar }
})
