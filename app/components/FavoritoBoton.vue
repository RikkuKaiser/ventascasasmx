<script setup lang="ts">
import { useFavoritosStore } from '~/stores/favoritos'

const props = withDefaults(
  defineProps<{
    inmuebleId: string
    /** Sobre imagen (sombra) o inline claro */
    variante?: 'overlay' | 'inline'
  }>(),
  { variante: 'overlay' },
)

const favoritos = useFavoritosStore()

const activo = computed(() => favoritos.tiene(props.inmuebleId))

async function click(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  await favoritos.alternar(props.inmuebleId)
}
</script>

<template>
  <button
    type="button"
    class="flex items-center justify-center rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-400"
    :class="
      variante === 'overlay'
        ? 'h-10 w-10 border border-white/20 bg-night-950/55 text-white backdrop-blur-md hover:border-royal-400/40 hover:bg-royal-950/50'
        : 'gap-2 border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10'
    "
    :aria-pressed="activo"
    :aria-label="activo ? 'Quitar de favoritos' : 'Guardar en favoritos'"
    @click="click"
  >
    <svg
      class="h-5 w-5 shrink-0 transition-all duration-300"
      :class="activo ? 'scale-110 text-rose-400' : 'text-white/70'"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3c1.538 0 2.98.806 3.742 2.154a4.25 4.25 0 013.742-2.154c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
        :opacity="activo ? 1 : 0.55"
      />
    </svg>
    <span v-if="variante === 'inline'" class="font-medium">{{
      activo ? 'Guardado' : 'Favorito'
    }}</span>
  </button>
</template>
