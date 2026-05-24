<script setup lang="ts">
/** Ruta anterior: redirige al formulario unificado con tipo terreno. */
const route = useRoute()
await navigateTo(
  { path: '/publicar', query: { ...route.query, tipo: 'terreno' } },
  { replace: true },
)
</script>

<template>
  <div class="min-h-[40vh]" />
</template>
