<script setup lang="ts">
import { useInmueblesStore } from '~/stores/inmuebles'

const inmuebles = useInmueblesStore()
useHead({ title: 'Inicio — LuxeInmuebles' })
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
              Tarjetas en vidrio oscuro y acentos azul rey para que cada
              propiedad se sienta exclusiva.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <NuxtLink
              to="/publicar"
              class="text-sm font-medium text-slate-300 hover:text-white"
            >
              Publicar inmueble
            </NuxtLink>
            <NuxtLink
              to="/inmuebles"
              class="text-sm font-medium text-royal-300 hover:text-white"
            >
              Ver todos →
            </NuxtLink>
          </div>
        </div>
        <div
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
