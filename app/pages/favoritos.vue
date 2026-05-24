<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Inmueble } from '~/types'
import { useFavoritosStore } from '~/stores/favoritos'
import { useInmueblesStore } from '~/stores/inmuebles'

useHead({ title: 'Favoritos — Ventas Casas MX' })

const favoritos = useFavoritosStore()
const { ids } = storeToRefs(favoritos)
const inmuebles = useInmueblesStore()

const guardados = computed(() =>
  ids.value
    .map((id) => inmuebles.porId(id))
    .filter((x): x is Inmueble => x != null),
)
</script>

<template>
  <div class="px-4 py-12">
    <div class="mx-auto max-w-6xl">
      <h1 class="font-display text-4xl font-semibold text-white">
        Tus favoritos
      </h1>
      <p class="mt-2 max-w-xl text-slate-400">
        Los inmuebles que marques con el corazón aparecerán aquí en este
        dispositivo.
      </p>

      <div
        v-if="guardados.length === 0"
        class="mt-14 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center"
      >
        <p class="text-slate-400">
          Aún no guardas ningún inmueble.
        </p>
        <NuxtLink
          to="/inmuebles"
          class="mt-6 inline-block rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 px-6 py-3 text-sm font-semibold text-white shadow-royal"
        >
          Explorar catálogo
        </NuxtLink>
      </div>

      <div
        v-else
        class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <InmuebleCard
          v-for="item in guardados"
          :key="item.id"
          :inmueble="item"
        />
      </div>
    </div>
  </div>
</template>
