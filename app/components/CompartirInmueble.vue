<script setup lang="ts">
const props = defineProps<{
  titulo: string
}>()

const route = useRoute()
const requestURL = useRequestURL()

const copiado = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const urlParaCompartir = computed(() => {
  if (import.meta.client && typeof window !== 'undefined')
    return window.location.href
  return `${requestURL.origin}${route.fullPath}`
})

const puedeWebShare = ref(false)
onMounted(() => {
  puedeWebShare.value =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'
})

async function copiar() {
  const u = urlParaCompartir.value
  if (!u) return
  try {
    await navigator.clipboard.writeText(u)
    copiado.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      copiado.value = false
    }, 2200)
  } catch {
    /* ignore */
  }
}

async function compartirNativo() {
  if (!puedeWebShare.value) {
    await copiar()
    return
  }
  try {
    await navigator.share({
      title: props.titulo,
      text: `Mira este inmueble: ${props.titulo}`,
      url: urlParaCompartir.value,
    })
  } catch {
    /* cancelado */
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
      @click="copiar"
    >
      {{ copiado ? '¡Enlace copiado!' : 'Copiar enlace' }}
    </button>
    <button
      v-if="puedeWebShare"
      type="button"
      class="rounded-xl border border-royal-500/35 bg-royal-950/40 px-4 py-2 text-sm font-medium text-royal-100 transition hover:border-royal-400/50 hover:bg-royal-900/50"
      @click="compartirNativo"
    >
      Compartir…
    </button>
  </div>
</template>
