<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useComentariosStore } from '~/stores/comentarios'

const props = defineProps<{ inmuebleId: string }>()

const auth = useAuthStore()
const comentarios = useComentariosStore()
const texto = ref('')
const error = ref('')

const lista = computed(() => comentarios.porInmueble(props.inmuebleId))

function enviar() {
  error.value = ''
  if (!auth.sesion) {
    error.value = 'Inicia sesión para comentar.'
    return
  }
  const r = comentarios.agregar(
    props.inmuebleId,
    auth.sesion.id,
    auth.sesion.nombre,
    texto.value,
  )
  if (!r.ok) error.value = r.error
  else texto.value = ''
}

function fechaLegible(iso: string) {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}
</script>

<template>
  <section id="comentarios" class="scroll-mt-24 rounded-2xl glass p-6 md:p-8">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="font-display text-2xl font-semibold text-white">
          Comentarios
        </h2>
        <p class="mt-1 text-sm text-slate-400">
          Solo usuarios registrados pueden participar.
        </p>
      </div>
      <NuxtLink
        v-if="!auth.estaAutenticado"
        to="/registro"
        class="text-sm font-medium text-royal-300 hover:text-royal-100"
      >
        Registrarse para comentar →
      </NuxtLink>
    </div>

    <div v-if="auth.estaAutenticado" class="mt-6">
      <label class="sr-only" for="comentario">Tu comentario</label>
      <textarea
        id="comentario"
        v-model="texto"
        rows="3"
        placeholder="Comparte tu opinión sobre este inmueble…"
        class="w-full resize-y rounded-xl border border-white/10 bg-night-850/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/30"
      />
      <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
      <button
        type="button"
        class="mt-3 rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 px-5 py-2.5 text-sm font-semibold text-white shadow-royal ring-1 ring-white/15 transition hover:brightness-110"
        @click="enviar"
      >
        Publicar comentario
      </button>
    </div>
    <div
      v-else
      class="mt-6 rounded-xl border border-dashed border-white/15 bg-night-850/50 p-6 text-center text-sm text-slate-400"
    >
      <NuxtLink
        to="/login"
        class="font-medium text-royal-300 hover:text-royal-100"
        >Inicia sesión</NuxtLink
      >
      o
      <NuxtLink
        to="/registro"
        class="font-medium text-royal-300 hover:text-royal-100"
        >crea una cuenta</NuxtLink
      >
      para dejar un comentario.
    </div>

    <ul class="mt-8 space-y-4">
      <li
        v-for="c in lista"
        :key="c.id"
        class="rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-md"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="font-medium text-royal-100">{{ c.nombreUsuario }}</span>
          <time
            class="text-xs text-slate-500"
            :datetime="c.creadoEn"
          >{{ fechaLegible(c.creadoEn) }}</time>
        </div>
        <p class="mt-2 text-sm leading-relaxed text-slate-300">
          {{ c.texto }}
        </p>
      </li>
      <li
        v-if="lista.length === 0"
        class="rounded-xl border border-white/5 bg-transparent py-8 text-center text-sm text-slate-500"
      >
        Aún no hay comentarios. Sé el primero en opinar.
      </li>
    </ul>
  </section>
</template>
