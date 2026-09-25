<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  descripcion?: string
  actualizacion?: string
}>(), {
  actualizacion: '30 de marzo de 2026',
})
</script>

<template>
  <div class="px-3 py-8 sm:px-4 sm:py-12 md:py-16">
    <article
      class="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-glass backdrop-blur-md sm:p-8 md:p-10"
    >
      <h1 class="font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
        {{ title }}
      </h1>
      <p v-if="descripcion" class="mt-2 text-sm text-slate-500">
        {{ descripcion }}
      </p>
      <p class="mt-2 text-xs text-slate-600">
        Última actualización: {{ actualizacion }}
      </p>
      <div
        class="mt-8 space-y-8 text-sm leading-relaxed text-slate-300 [&_a]:text-royal-300 [&_a]:underline-offset-2 hover:[&_a]:text-white [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_h3]:font-medium [&_h3]:text-white [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_section]:scroll-mt-24 [&_section]:space-y-3 [&_table]:w-full [&_table]:min-w-[36rem] [&_table]:border-collapse [&_table]:text-left [&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_th]:border [&_th]:border-white/10 [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:pt-1"
      >
        <slot />
      </div>
    </article>
  </div>
</template>
