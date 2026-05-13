<script setup lang="ts">
const props = defineProps<{
  items: { url: string; name: string }[]
}>()

const muchas = computed(() => props.items.length > 10)
</script>

<template>
  <div
    v-if="items.length"
    class="relative mt-3 overflow-hidden rounded-xl border border-white/[0.09] bg-gradient-to-b from-night-850/90 to-night-950/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-white/[0.04]"
  >
    <!-- Difuminado azul (esquina inferior derecha) -->
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      aria-hidden="true"
    >
      <div
        class="absolute -bottom-14 -right-10 h-[min(14rem,55%)] w-[min(16rem,65%)] rounded-full bg-gradient-to-br from-royal-400/[0.22] via-blue-600/[0.18] to-transparent blur-[52px] sm:-bottom-16 sm:-right-12 sm:blur-[64px]"
      />
      <div
        class="absolute bottom-0 right-0 h-32 w-36 bg-[radial-gradient(ellipse_110%_100%_at_100%_100%,rgba(99,140,230,0.28)_0%,rgba(59,99,196,0.08)_42%,transparent_68%)] sm:h-40 sm:w-44"
      />
    </div>

    <div
      class="relative z-[1] flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-3 py-2"
    >
      <span
        class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"
        >Vista previa galería</span
      >
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="rounded-md bg-royal-500/15 px-2 py-0.5 text-[10px] font-medium tabular-nums text-royal-100 ring-1 ring-royal-400/25"
        >
          {{ items.length }}
          {{ items.length === 1 ? 'foto' : 'fotos' }}
        </span>
        <span
          v-if="muchas"
          class="hidden text-[10px] text-slate-500 sm:inline"
          >Usa el scroll del recuadro</span
        >
      </div>
    </div>

    <div
      class="preview-galeria-scroll relative z-[1] max-h-[min(17.5rem,45vh)] overflow-y-auto overscroll-y-contain px-2.5 pb-2.5 pt-2.5 sm:px-3 sm:pb-3 sm:pt-3"
    >
      <div
        class="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2 sm:min-w-0 sm:grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] sm:gap-2.5"
      >
        <figure
          v-for="(item, idx) in items"
          :key="`${item.url}-${idx}`"
          class="group relative aspect-square overflow-hidden rounded-lg border border-white/[0.08] bg-night-950/60 ring-1 ring-white/[0.04] transition-[border-color,box-shadow] hover:border-royal-400/25 hover:shadow-md hover:shadow-royal-950/40"
        >
          <span
            class="absolute left-1 top-1 z-[1] flex h-5 min-w-[1.25rem] items-center justify-center rounded bg-black/55 px-1 text-[9px] font-semibold tabular-nums text-white ring-1 ring-white/10 backdrop-blur-sm"
            >{{ idx + 1 }}</span
          >
          <img
            :src="item.url"
            :alt="item.name"
            :title="item.name"
            class="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </figure>
      </div>
    </div>

    <p
      v-if="muchas"
      class="relative z-[1] border-t border-white/[0.05] px-3 py-2 text-[10px] leading-snug text-slate-500"
    >
      Tienes más de 10 imágenes: el área de arriba tiene scroll para no alargar el formulario.
      Revisa el orden (1, 2, 3…) antes de publicar.
    </p>
  </div>
</template>
