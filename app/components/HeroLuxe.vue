<script setup lang="ts">
import { useInmueblesStore } from '~/stores/inmuebles'

const inmuebles = useInmueblesStore()
const featured = computed(() => inmuebles.destacados[0])
</script>

<template>
  <section class="relative px-4 pb-12 pt-8 sm:pb-16 sm:pt-10 md:pt-16">
    <div class="mx-auto max-w-6xl">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div class="animate-fade-up">
          <p
            class="inline-flex items-center gap-2 rounded-full border border-royal-500/30 bg-royal-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-royal-200"
          >
            <span
              class="h-1.5 w-1.5 animate-shimmer rounded-full bg-royal-400"
            />
            Anuncia tu propiedad
          </p>
          <h1
            class="mt-5 font-display text-3xl font-semibold leading-tight text-white sm:mt-6 sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            Inmuebles que
            <span class="text-gradient-royal">brillan</span>
            en vidrio y azul rey
          </h1>
          <p class="mt-4 max-w-xl text-base leading-relaxed text-slate-400 sm:mt-5 sm:text-lg">
            Presenta cada espacio con una estética oscura, cristalina y
            premium. Los visitantes exploran, se enamoran y dejan su voz —
            solo si están registrados.
          </p>
          <div class="mt-6 flex w-full max-w-md flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap">
            <NuxtLink
              to="/inmuebles"
              class="flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-royal-600 to-royal-900 px-6 py-3 text-center text-sm font-semibold text-white shadow-royal ring-1 ring-white/20 transition hover:brightness-110 sm:inline-flex sm:w-auto"
            >
              Ver catálogo
            </NuxtLink>
            <NuxtLink
              to="/registro"
              class="flex min-h-[44px] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10 sm:inline-flex sm:w-auto"
            >
              Crear cuenta
            </NuxtLink>
          </div>
        </div>

        <div
          v-if="featured"
          class="relative animate-fade-up lg:justify-self-end"
          style="animation-delay: 0.12s"
        >
          <div
            class="absolute -inset-4 rounded-3xl bg-gradient-to-br from-royal-600/30 to-transparent blur-2xl"
          />
          <div
            class="relative overflow-hidden rounded-3xl glass-strong ring-1 ring-royal-500/20"
          >
            <div class="relative aspect-[4/3]">
              <img
                :src="featured.imagen"
                :alt="featured.titulo"
                class="h-full w-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-night-950 via-transparent to-night-950/30"
              />
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <p class="text-[10px] uppercase tracking-widest text-royal-200 sm:text-xs">
                Propiedad destacada
              </p>
              <p class="mt-1 line-clamp-2 font-display text-lg font-semibold text-white sm:text-2xl">
                {{ featured.titulo }}
              </p>
              <p class="mt-2 text-xs text-slate-300 sm:text-sm">
                {{ featured.ciudad }} — {{ inmuebles.formatearPrecio(featured) }}
              </p>
              <NuxtLink
                :to="`/inmuebles/${featured.id}`"
                class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-royal-200 hover:text-white"
              >
                Explorar ficha
                <span aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
