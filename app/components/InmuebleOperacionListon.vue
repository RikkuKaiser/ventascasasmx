<script setup lang="ts">
import type { Inmueble } from '~/types'
import { operacionInmueble } from '~/types'

const props = defineProps<{ inmueble: Inmueble }>()

const esRenta = computed(() => operacionInmueble(props.inmueble) === 'renta')

const estiloBadge = computed(() =>
  esRenta.value
    ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_4px_14px_-4px_rgba(245,158,11,0.55)] ring-amber-200/30'
    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-[0_4px_14px_-4px_rgba(16,185,129,0.5)] ring-emerald-200/30',
)
</script>

<template>
  <div
    class="pointer-events-none absolute left-3 top-3 z-10"
    role="img"
    :aria-label="esRenta ? 'En renta' : 'En venta'"
  >
    <span
      class="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md ring-1"
      :class="estiloBadge"
    >
      {{ esRenta ? 'Renta' : 'Venta' }}
    </span>
  </div>
</template>
