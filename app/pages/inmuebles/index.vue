<script setup lang="ts">
import type { Inmueble } from '~/types'
import { useInmueblesStore } from '~/stores/inmuebles'

const inmuebles = useInmueblesStore()
useHead({ title: 'Inmuebles — LuxeInmuebles' })

const busqueda = ref('')
const ciudad = ref('')
const orden = ref<'reciente' | 'precio-asc' | 'precio-desc'>('reciente')

const ciudades = computed(() => {
  const set = new Set(inmuebles.lista.map((i) => i.ciudad))
  return [...set].sort((a, b) => a.localeCompare(b, 'es'))
})

const filtrados = computed(() => {
  let L: Inmueble[] = [...inmuebles.lista]
  const q = busqueda.value.trim().toLowerCase()
  if (q) {
    L = L.filter(
      (i) =>
        i.titulo.toLowerCase().includes(q)
        || i.ciudad.toLowerCase().includes(q)
        || i.zona.toLowerCase().includes(q)
        || i.descripcion.toLowerCase().includes(q),
    )
  }
  if (ciudad.value)
    L = L.filter((i) => i.ciudad === ciudad.value)

  if (orden.value === 'precio-asc')
    L = [...L].sort((a, b) => a.precio - b.precio)
  else if (orden.value === 'precio-desc')
    L = [...L].sort((a, b) => b.precio - a.precio)
  else
    L = [...L].sort((a, b) => Number(b.destacado) - Number(a.destacado))

  return L
})
</script>

<template>
  <div class="px-4 py-12">
    <div class="mx-auto max-w-6xl">
      <div class="max-w-2xl">
        <h1 class="font-display text-4xl font-semibold text-white">
          Catálogo de inmuebles
        </h1>
        <p class="mt-3 text-lg text-slate-400">
          Filtra por ciudad, busca por palabras clave u ordena por precio para
          acercarte a lo que buscas.
        </p>
      </div>

      <div
        class="mt-8 flex flex-col gap-4 rounded-2xl glass p-4 sm:flex-row sm:flex-wrap sm:items-end"
      >
        <div class="min-w-0 flex-1 sm:min-w-[200px]">
          <label class="mb-1.5 block text-xs font-medium text-slate-500" for="q">Buscar</label>
          <input
            id="q"
            v-model="busqueda"
            type="search"
            placeholder="Ej. penthouse, playa, Polanco…"
            class="w-full rounded-xl border border-white/10 bg-night-850/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/25"
          />
        </div>
        <div class="w-full sm:w-48">
          <label class="mb-1.5 block text-xs font-medium text-slate-500" for="ciudad">Ciudad</label>
          <select
            id="ciudad"
            v-model="ciudad"
            class="w-full rounded-xl border border-white/10 bg-night-850/80 px-4 py-2.5 text-sm text-white focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/25"
          >
            <option value="">
              Todas
            </option>
            <option v-for="c in ciudades" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </div>
        <div class="w-full sm:w-52">
          <label class="mb-1.5 block text-xs font-medium text-slate-500" for="orden">Orden</label>
          <select
            id="orden"
            v-model="orden"
            class="w-full rounded-xl border border-white/10 bg-night-850/80 px-4 py-2.5 text-sm text-white focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/25"
          >
            <option value="reciente">
              Destacados primero
            </option>
            <option value="precio-asc">
              Precio: menor a mayor
            </option>
            <option value="precio-desc">
              Precio: mayor a menor
            </option>
          </select>
        </div>
        <p class="w-full text-sm text-slate-500 sm:ml-auto sm:w-auto sm:self-center sm:pt-5">
          {{ filtrados.length }} resultado{{ filtrados.length === 1 ? '' : 's' }}
        </p>
      </div>

      <div
        v-if="filtrados.length === 0"
        class="mt-12 rounded-2xl border border-dashed border-white/15 py-16 text-center text-slate-400"
      >
        No hay inmuebles con esos criterios.
        <button
          type="button"
          class="mt-4 block w-full text-royal-300 hover:text-white sm:inline sm:w-auto"
          @click="busqueda = ''; ciudad = ''"
        >
          Limpiar filtros
        </button>
      </div>

      <div
        v-else
        class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <InmuebleCard
          v-for="item in filtrados"
          :key="item.id"
          :inmueble="item"
        />
      </div>
    </div>
  </div>
</template>
