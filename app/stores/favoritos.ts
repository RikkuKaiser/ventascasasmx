import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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

  function alternar(id: string) {
    const i = ids.value.indexOf(id)
    if (i >= 0) ids.value.splice(i, 1)
    else ids.value.push(id)
    guardar()
  }

  function tiene(id: string) {
    return ids.value.includes(id)
  }

  const cantidad = computed(() => ids.value.length)

  return { ids, cantidad, cargar, guardar, alternar, tiene }
})
