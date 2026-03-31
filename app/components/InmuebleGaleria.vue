<script setup lang="ts">
const props = defineProps<{
  fotos: string[]
  titulo: string
}>()

const activa = ref(0)
const ampliada = ref(false)

const total = computed(() => props.fotos.length)

watch(
  () => props.fotos,
  () => {
    activa.value = 0
  },
  { deep: true },
)

function irA(i: number) {
  if (total.value === 0) return
  activa.value = ((i % total.value) + total.value) % total.value
}

function anterior() {
  irA(activa.value - 1)
}

function siguiente() {
  irA(activa.value + 1)
}

function onKey(e: KeyboardEvent) {
  if (!ampliada.value) return
  if (e.key === 'Escape') ampliada.value = false
  if (e.key === 'ArrowLeft') anterior()
  if (e.key === 'ArrowRight') siguiente()
}

onMounted(() => {
  if (import.meta.client) window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  if (import.meta.client) window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div v-if="total > 0" class="space-y-4">
    <div
      class="relative overflow-hidden rounded-3xl glass-strong ring-1 ring-white/10"
    >
      <div class="relative aspect-[16/10] min-h-[200px] md:aspect-[21/9] md:min-h-[280px]">
        <img
          :src="fotos[activa]"
          :alt="`${titulo} — foto ${activa + 1} de ${total}`"
          class="h-full w-full cursor-zoom-in object-cover transition duration-500"
          loading="eager"
          @click="ampliada = true"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-950/90 via-night-950/25 to-transparent md:from-night-950/80"
        />

        <button
          v-if="total > 1"
          type="button"
          class="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-night-950/50 text-white backdrop-blur-md transition hover:border-royal-400/50 hover:bg-royal-950/60"
          aria-label="Foto anterior"
          @click.stop="anterior"
        >
          <span class="text-lg leading-none" aria-hidden="true">‹</span>
        </button>
        <button
          v-if="total > 1"
          type="button"
          class="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-night-950/50 text-white backdrop-blur-md transition hover:border-royal-400/50 hover:bg-royal-950/60"
          aria-label="Foto siguiente"
          @click.stop="siguiente"
        >
          <span class="text-lg leading-none" aria-hidden="true">›</span>
        </button>

        <div
          class="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full border border-white/10 bg-night-950/40 px-3 py-1.5 backdrop-blur-md"
        >
          <span class="text-xs font-medium text-slate-300">
            {{ activa + 1 }} / {{ total }}
          </span>
        </div>

        <button
          type="button"
          class="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:border-royal-400/40 hover:bg-royal-900/40"
          aria-label="Pantalla completa"
          @click.stop="ampliada = true"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="total > 1"
      class="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <button
        v-for="(url, i) in fotos"
        :key="`${url}-${i}`"
        type="button"
        class="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition md:h-20 md:w-32"
        :class="
          i === activa
            ? 'border-royal-400 shadow-royal ring-2 ring-royal-500/30'
            : 'border-white/10 opacity-80 hover:border-white/25 hover:opacity-100'
        "
        :aria-label="`Ver foto ${i + 1}`"
        :aria-current="i === activa ? 'true' : undefined"
        @click="activa = i"
      >
        <img
          :src="url"
          :alt="''"
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </button>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="ampliada"
          class="fixed inset-0 z-[100] flex flex-col bg-night-950/92 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Galería ampliada"
          @click.self="ampliada = false"
        >
          <div
            class="flex items-center justify-between border-b border-white/10 px-4 py-3"
          >
            <p class="text-sm text-slate-400">
              {{ titulo }}
              <span class="text-slate-500"> · {{ activa + 1 }}/{{ total }}</span>
            </p>
            <button
              type="button"
              class="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/10"
              @click="ampliada = false"
            >
              Cerrar
            </button>
          </div>
          <div class="relative flex flex-1 items-center justify-center p-4">
            <img
              :src="fotos[activa]"
              :alt="titulo"
              class="max-h-[calc(100vh-8rem)] max-w-full rounded-lg object-contain shadow-glass-lg ring-1 ring-white/10"
            />
            <button
              v-if="total > 1"
              type="button"
              class="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-night-900/80 text-2xl text-white backdrop-blur-md hover:border-royal-400/50 md:left-6"
              aria-label="Anterior"
              @click="anterior"
            >
              ‹
            </button>
            <button
              v-if="total > 1"
              type="button"
              class="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-night-900/80 text-2xl text-white backdrop-blur-md hover:border-royal-400/50 md:right-6"
              aria-label="Siguiente"
              @click="siguiente"
            >
              ›
            </button>
          </div>
          <div
            v-if="total > 1"
            class="flex justify-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-3"
          >
            <button
              v-for="(url, i) in fotos"
              :key="`fs-${url}-${i}`"
              type="button"
              class="h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition"
              :class="
                i === activa
                  ? 'border-royal-400'
                  : 'border-transparent opacity-60 hover:opacity-100'
              "
              @click="activa = i"
            >
              <img :src="url" alt="" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
