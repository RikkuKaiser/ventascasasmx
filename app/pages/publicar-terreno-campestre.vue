<script setup lang="ts">
/** Ruta anterior: redirige a Terrenos. */
const route = useRoute()
await navigateTo(
  { path: '/publicar-terrenos', query: route.query },
  { replace: true },
)
</script>

<template>
  <div class="min-h-[40vh]" />
</template>
