<script setup lang="ts">
import type { Inmueble } from '~/types'
import { operacionInmueble } from '~/types'
import { useInmueblesStore } from '~/stores/inmuebles'

const props = defineProps<{ inmueble: Inmueble }>()
const store = useInmueblesStore()

const esTerreno = computed(() => props.inmueble.tipoVivienda === 'terreno')
const esRenta = computed(() => operacionInmueble(props.inmueble) === 'renta')

const rawM2 = computed(() => props.inmueble as Inmueble & { m2?: number })
const m2Sup = computed(
  () => rawM2.value.m2Superficie ?? rawM2.value.m2 ?? 0,
)
const m2Cons = computed(
  () => rawM2.value.m2Construccion ?? rawM2.value.m2 ?? m2Sup.value,
)

/** Textos cortos no muestran el toggle (~2 líneas en tarjeta) */
const umbralVerMas = 115
const mostrarVerMas = computed(
  () => props.inmueble.descripcion.length > umbralVerMas,
)

const descripcionExpandida = ref(false)

/** Sin duplicar el listón Venta/Renta en chips inferiores. */
const etiquetasVisibles = computed(() =>
  props.inmueble.etiquetas
    .filter((t) => !/^(venta|renta)$/i.test(t.trim()))
    .slice(0, 3),
)

watch(
  () => props.inmueble.id,
  () => {
    descripcionExpandida.value = false
  },
)
</script>

<template>
  <article
    class="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl glass transition duration-500 hover:border-royal-500/40 hover:shadow-royal"
  >
    <div class="relative aspect-[4/3] shrink-0 overflow-hidden">
      <img
        :src="inmueble.imagen"
        :alt="inmueble.titulo"
        class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/20 to-transparent"
      />
      <InmuebleOperacionListon :inmueble="inmueble" />
      <div class="absolute right-3 top-3 z-10">
        <FavoritoBoton :inmueble-id="inmueble.id" />
      </div>
      <div class="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
        <span
          v-for="tag in etiquetasVisibles"
          :key="tag"
          class="rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-medium text-slate-200 backdrop-blur-md"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="flex min-h-0 flex-1 flex-col p-5">
      <p
        class="shrink-0 truncate text-xs font-medium uppercase tracking-widest text-royal-300"
        :title="`${inmueble.ciudad} · ${inmueble.zona}`"
      >
        {{ inmueble.ciudad }} · {{ inmueble.zona }}
      </p>
      <h3
        class="mt-1 line-clamp-2 min-h-[3.25rem] font-display text-xl font-semibold leading-snug text-white transition group-hover:text-royal-100"
      >
        {{ inmueble.titulo }}
      </h3>
      <div class="mt-2 shrink-0">
        <p
          class="text-sm leading-relaxed text-slate-400"
          :class="
            descripcionExpandida
              ? ''
              : mostrarVerMas
                ? 'line-clamp-2 min-h-[3.25rem]'
                : 'min-h-[3.25rem]'
          "
        >
          {{ inmueble.descripcion }}
        </p>
        <button
          v-if="mostrarVerMas"
          type="button"
          class="mt-1.5 text-xs font-semibold text-royal-300 underline-offset-2 hover:text-royal-100 hover:underline"
          @click="descripcionExpandida = !descripcionExpandida"
        >
          {{ descripcionExpandida ? 'Ver menos' : 'Ver más' }}
        </button>
      </div>
      <div class="mt-auto shrink-0 border-t border-white/10 pt-4">
        <div
          class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400"
        >
          <span
            class="inline-flex items-center gap-1.5"
            :title="
              esTerreno
                ? `Superficie: ${m2Sup} m²`
                : m2Cons > 0 && m2Cons !== m2Sup
                  ? `Construcción: ${m2Cons} m² · Superficie: ${m2Sup} m²`
                  : `Superficie: ${m2Sup} m² · Construcción: ${m2Cons} m²`
            "
          >
            <svg
              class="h-4 w-4 shrink-0 text-royal-400/90"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z"
              />
            </svg>
            <span v-if="esTerreno">{{ m2Sup }} m²</span>
            <span v-else-if="m2Cons > 0 && m2Cons !== m2Sup">{{ m2Cons }} / {{ m2Sup }} m²</span>
            <span v-else>{{ m2Sup }} m²</span>
          </span>
          <span class="inline-flex items-center gap-1.5" title="Recámaras">
            <svg
              class="h-4 w-4 shrink-0 text-royal-400/90"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2 13.5h20v4.5a1 1 0 01-1 1H3a1 1 0 01-1-1v-4.5zm2-3V9a3 3 0 013-3h10a3 3 0 013 3v1.5"
              />
            </svg>
            <span>{{ esTerreno ? '—' : `${inmueble.habitaciones} rec.` }}</span>
          </span>
          <span class="inline-flex items-center gap-1.5" title="Baños">
            <svg
              class="h-4 w-4 shrink-0 text-royal-400/90"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 12h16v5a3 3 0 01-3 3H7a3 3 0 01-3-3v-5zm0 0V9a1 1 0 011-1h1.5M20 9a1 1 0 00-1-1h-1.5M8 8V6m8 2V6"
              />
            </svg>
            <span>{{ esTerreno ? '—' : `${inmueble.banos} baños` }}</span>
          </span>
        </div>
        <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p class="font-display text-lg font-semibold text-gradient-royal">
            {{ store.formatearPrecio(inmueble) }}<span
              v-if="esRenta"
              class="text-sm font-medium text-slate-400"
            >
              / mes</span
            >
          </p>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <WhatsAppInmuebleCta variante="card" :inmueble="inmueble" />
            <NuxtLink
              :to="`/inmuebles/${inmueble.id}`"
              class="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-gradient-to-r from-royal-600 to-royal-800 px-3 text-sm font-semibold text-white shadow-royal ring-1 ring-white/20 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-950"
            >
              Ver detalle
              <svg
                class="h-3.5 w-3.5 opacity-90"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
