import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const STORAGE = 'luxeinmuebles_favoritos'

export const useFavoritosStore = defineStore('favoritos', () => {
  const ids = ref<string[]>([])

  function cargar() {
    if (import.meta.server) return
    try {
      const raw = localStorage.getItem(STORAGE)
      if (raw) ids.value = JSON.parse(raw) as string[]
    } catch {
      /* ignore */
    }
  }

  function guardar() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE, JSON.stringify(ids.value))
  }

  async function sincronizarDesdeApi() {
    const base = useApiBase()
    const auth = useAuthStore()
    if (!base || !auth.sesion?.accessToken) return
    try {
      const res = await $fetch<{ ids: string[] }>(`${base}/favoritos`, {
        headers: { Authorization: `Bearer ${auth.sesion.accessToken}` },
      })
      ids.value = res.ids
      guardar()
    } catch (e: unknown) {
      auth.invalidarSesionSiApiRechaza(e)
    }
  }

  async function alternar(id: string) {
    const base = useApiBase()
    const auth = useAuthStore()
    if (base && auth.sesion?.accessToken) {
      try {
        const res = await $fetch<{ ids: string[]; esFavorito: boolean }>(
          `${base}/favoritos/${id}/toggle`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${auth.sesion.accessToken}` },
          },
        )
        ids.value = res.ids
        guardar()
        return
      } catch {
        /* fallback local */
      }
    }
    const i = ids.value.indexOf(id)
    if (i >= 0) ids.value.splice(i, 1)
    else ids.value.push(id)
    guardar()
  }

  function tiene(id: string) {
    return ids.value.includes(id)
  }

  const cantidad = computed(() => ids.value.length)

  /** Con API, los favoritos son por usuario; al cerrar sesión no deben quedar en UI. */
  function alCerrarSesion() {
    if (!useApiBase()) return
    ids.value = []
    guardar()
  }

  return {
    ids,
    cantidad,
    cargar,
    guardar,
    sincronizarDesdeApi,
    alternar,
    tiene,
    alCerrarSesion,
  }
})
