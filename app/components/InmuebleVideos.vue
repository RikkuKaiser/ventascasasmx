<script setup lang="ts">
import type { Inmueble } from '~/types'

const props = defineProps<{
  inmueble: Inmueble
}>()

function pushStrings(out: string[], seen: Set<string>, raw: unknown) {
  if (!Array.isArray(raw)) return
  for (const x of raw) {
    if (typeof x !== 'string') continue
    const t = x.trim()
    if (!t || seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }
}

const urlsVideo = computed(() => {
  const out: string[] = []
  const seen = new Set<string>()
  const i = props.inmueble

  for (const row of i.archivos ?? []) {
    if (row.tipo !== 'video') continue
    const t = row.url?.trim()
    if (!t || seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }

  const pi = i.publicacionInmueble
  pushStrings(out, seen, pi?.videos)
  if (pi?.videoUrl) {
    const t = pi.videoUrl.trim()
    if (t && !seen.has(t)) {
      seen.add(t)
      out.push(t)
    }
  }

  const tc = i.terrenoCampestre
  pushStrings(out, seen, tc?.videos)
  if (tc?.videoUrl) {
    const t = tc.videoUrl.trim()
    if (t && !seen.has(t)) {
      seen.add(t)
      out.push(t)
    }
  }

  return out
})

function esReproductorNativo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|mpeg|avi)(\?|#|$)/i.test(url)
}

function esYoutube(url: string): boolean {
  return /(?:youtube\.com\/|youtu\.be\/)/i.test(url)
}
</script>

<template>
  <section
    v-if="urlsVideo.length"
    class="rounded-2xl border border-white/[0.08] bg-night-950/40 p-5 ring-1 ring-white/[0.06] md:p-7"
  >
    <h2
      class="font-display text-lg font-semibold tracking-tight text-white md:text-xl"
    >
      Videos
    </h2>
    <p class="mt-1 text-xs text-slate-500 md:text-sm">
      Recorridos y material subido con el anuncio. Si no se reproduce en el
      navegador, usa el enlace para abrirlo en una pestaña nueva.
    </p>
    <ul class="mt-5 space-y-6">
      <li v-for="(url, idx) in urlsVideo" :key="url">
        <p class="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Video {{ idx + 1 }}
        </p>
        <video
          v-if="esReproductorNativo(url)"
          class="aspect-video w-full max-h-[min(70vh,520px)] rounded-xl border border-white/10 bg-black object-contain shadow-lg ring-1 ring-white/10"
          controls
          playsinline
          preload="metadata"
          :src="url"
        >
          Tu navegador no reproduce este formato.
          <a
            class="text-royal-300 underline"
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            >Abrir archivo</a
          >
        </video>
        <div
          v-else-if="esYoutube(url)"
          class="rounded-xl border border-white/10 bg-night-900/60 p-4"
        >
          <a
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-sm font-medium text-royal-200 underline-offset-4 hover:text-white hover:underline"
          >
            Ver en YouTube
            <span class="text-slate-500" aria-hidden="true">↗</span>
          </a>
        </div>
        <div v-else class="rounded-xl border border-white/10 bg-night-900/60 p-4">
          <a
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="break-all text-sm font-medium text-royal-200 underline-offset-4 hover:text-white hover:underline"
          >
            Abrir enlace de video
          </a>
        </div>
      </li>
    </ul>
  </section>
</template>
