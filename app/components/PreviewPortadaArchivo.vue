<script setup lang="ts">
defineProps<{
  url: string | null
}>()
</script>

<template>
  <div
    v-if="url"
    class="mt-3 overflow-hidden rounded-xl border border-white/[0.09] bg-gradient-to-b from-night-850/90 to-night-950/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-white/[0.04]"
  >
    <div
      class="flex items-center justify-between gap-2 border-b border-white/[0.06] px-3 py-2"
    >
      <span
        class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"
        >Portada</span
      >
      <span
        class="rounded-md bg-emerald-500/12 px-2 py-0.5 text-[10px] font-medium text-emerald-200/90 ring-1 ring-emerald-400/20"
        >Principal</span
      >
    </div>
    <div class="flex justify-center p-3 sm:p-4">
      <img
        :src="url"
        alt=""
        class="max-h-48 w-auto max-w-full rounded-lg object-contain shadow-lg ring-1 ring-black/20"
      />
    </div>
  </div>
</template>
