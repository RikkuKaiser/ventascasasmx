<script setup lang="ts">
import { useInmueblesStore } from '~/stores/inmuebles'

const inmuebles = useInmueblesStore()
useHead({ title: 'Inicio — Ventas Casas MX' })
</script>

<template>
  <div>
    <HeroLuxe />
    <SeccionValor />
    <section class="px-4 pb-20">
      <div class="mx-auto max-w-6xl">
        <div
          class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 class="font-display text-3xl font-semibold text-white">
              Colección destacada
            </h2>
            <p class="mt-2 max-w-xl text-slate-400">
              Propiedades en venta y renta, con fichas claras y fotos de calidad.
            </p>
          </div>
          <NuxtLink
            to="/inmuebles"
            class="text-sm font-medium text-royal-300 hover:text-white"
          >
            Ver todos →
          </NuxtLink>
        </div>
        <div
          v-if="inmuebles.destacados.length === 0"
          class="mt-10 rounded-2xl border border-dashed border-white/15 py-12 text-center text-slate-400"
        >
          Aún no hay propiedades destacadas en el catálogo.
        </div>
        <div
          v-else
          class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <InmuebleCard
            v-for="item in inmuebles.destacados"
            :key="item.id"
            :inmueble="item"
          />
        </div>
      </div>
    </section>
  </div>
</template>
