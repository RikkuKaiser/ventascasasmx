<script setup lang="ts">
import { useInmueblesStore } from '~/stores/inmuebles'

const route = useRoute()
const store = useInmueblesStore()
const id = computed(() => String(route.params.id))

const inmueble = computed(() => store.porId(id.value))

function refrescarDetalle() {
  if (import.meta.client) void store.refrescarInmuebleDesdeApi(id.value)
}

onMounted(refrescarDetalle)
watch(id, refrescarDetalle)

const fotosGaleria = computed(() => {
  const i = inmueble.value
  if (!i) return []
  const extra = i.galeria?.filter(Boolean) ?? []
  if (extra.length) return extra
  return [i.imagen]
})

useHead(() => ({
  title: inmueble.value
    ? `${inmueble.value.titulo} — Ventas Casas MX`
    : 'Inmueble — Ventas Casas MX',
}))
</script>

<template>
  <div
    v-if="inmueble"
    class="px-3 pb-[max(5.75rem,calc(4.25rem+env(safe-area-inset-bottom)))] pt-2 md:px-4 md:py-10 md:pb-10"
  >
    <div class="mx-auto max-w-5xl">
      <NuxtLink
        to="/inmuebles"
        class="inline-flex items-center gap-2 text-sm text-royal-300 hover:text-white"
      >
        ← Volver al catálogo
      </NuxtLink>

      <div class="mt-6 space-y-5">
        <InmuebleGaleria
          :key="inmueble.id"
          :fotos="fotosGaleria"
          :titulo="inmueble.titulo"
        />
        <InmuebleVideos :inmueble="inmueble" />
        <div class="rounded-2xl glass p-5 md:p-8">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in inmueble.etiquetas"
              :key="tag"
              class="rounded-lg bg-royal-950/50 px-3 py-1 text-xs font-medium text-royal-100 ring-1 ring-royal-500/25"
            >
              {{ tag }}
            </span>
          </div>
          <h1
            class="mt-4 font-display text-3xl font-semibold text-white md:text-4xl"
          >
            {{ inmueble.titulo }}
          </h1>
          <p class="mt-2 text-royal-200">
            {{ inmueble.ciudad }} · {{ inmueble.zona }}
          </p>
          <p class="mt-4 font-display text-2xl text-gradient-royal md:text-3xl">
            {{ store.formatearPrecio(inmueble) }}
          </p>
          <div class="mt-4 md:hidden">
            <CompartirInmueble :titulo="inmueble.titulo" compact />
          </div>
          <div
            class="mt-6 hidden gap-4 border-t border-white/10 pt-6 md:flex md:flex-row md:flex-wrap md:items-center md:justify-between"
          >
            <CompartirInmueble :titulo="inmueble.titulo" />
            <div class="flex flex-wrap items-center gap-3">
              <WhatsAppInmuebleCta variante="card" :inmueble="inmueble" />
              <FavoritoBoton :inmueble-id="inmueble.id" variante="inline" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
          <section class="rounded-2xl glass p-6 md:p-8">
            <h2 class="font-display text-xl font-semibold text-white">
              Descripción
            </h2>
            <p class="mt-4 leading-relaxed text-slate-300">
              {{ inmueble.descripcion }}
            </p>
          </section>
          <ComentariosPanel :inmueble-id="inmueble.id" />
        </div>
        <aside class="space-y-4">
          <InmuebleFichaTecnica :inmueble="inmueble" />
          <div
            class="rounded-2xl border border-royal-500/25 bg-royal-950/40 p-6 backdrop-blur-xl"
          >
            <WhatsAppInmuebleCta variante="aside" :inmueble="inmueble" />
            <p class="mt-4 text-sm text-royal-100">
              ¿Te interesa este inmueble? Los comentarios públicos ayudan a la
              comunidad; regístrate para participar.
            </p>
            <NuxtLink
              to="/registro"
              class="mt-4 inline-block rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 hover:bg-white/15"
            >
              Registrarme
            </NuxtLink>
            <NuxtLink
              to="#comentarios"
              class="mt-3 block w-full rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 py-2.5 text-center text-sm font-semibold text-white shadow-royal ring-1 ring-white/15"
            >
              Ver comentarios y opinar
            </NuxtLink>
          </div>
        </aside>
      </div>

      <div
        class="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-night-900/95 px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl md:hidden"
      >
        <div class="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <div class="flex items-center justify-center">
            <FavoritoBoton :inmueble-id="inmueble.id" variante="overlay" />
          </div>
          <div class="flex min-w-0 items-stretch">
            <WhatsAppInmuebleCta variante="bar" class="w-full" :inmueble="inmueble" />
          </div>
          <div class="flex min-w-0 items-stretch">
            <NuxtLink
              to="#comentarios"
              class="flex h-11 w-full min-w-0 items-center justify-center rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 px-1.5 text-center text-xs font-semibold leading-tight text-white shadow-royal sm:text-sm"
            >
              Comentarios
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="px-4 py-24 text-center">
    <div class="mx-auto max-w-md rounded-2xl glass p-10">
      <h1 class="font-display text-2xl text-white">Inmueble no encontrado</h1>
      <p class="mt-2 text-slate-400">El identificador no coincide con ninguna propiedad.</p>
      <NuxtLink
        to="/inmuebles"
        class="mt-6 inline-block rounded-xl bg-royal-700 px-5 py-2.5 text-sm font-medium text-white"
      >
        Ir al catálogo
      </NuxtLink>
    </div>
  </div>
</template>
