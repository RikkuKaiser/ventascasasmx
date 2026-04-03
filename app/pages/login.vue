<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFavoritosStore } from '~/stores/favoritos'

useHead({ title: 'Entrar — LuxeInmuebles' })

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const sinApi = computed(() => !useApiBase())

async function submit() {
  error.value = ''
  const r = await auth.iniciarSesion(email.value, password.value)
  if (!r.ok) {
    error.value = r.error
    return
  }
  const favoritos = useFavoritosStore()
  await favoritos.sincronizarDesdeApi()
  const redir = route.query.redirect
  if (
    typeof redir === 'string'
    && redir.startsWith('/')
    && !redir.startsWith('//')
  ) {
    await router.push(redir)
    return
  }
  await router.push('/inmuebles')
}
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center px-4 py-16">
    <div class="w-full max-w-md rounded-2xl glass-strong p-8 md:p-10">
      <h1 class="text-center font-display text-2xl font-semibold text-white">
        Bienvenido de nuevo
      </h1>
      <p class="mt-2 text-center text-sm text-slate-400">
        Accede para comentar y seguir tus inmuebles favoritos.
      </p>
      <p
        v-if="sinApi"
        class="mt-4 rounded-xl border border-amber-500/35 bg-amber-950/35 px-4 py-3 text-center text-xs text-amber-100/95"
      >
        No hay API configurada: el login solo usa cuentas creadas en este
        navegador. Para entrar con usuarios de la base de datos, define
        <code class="rounded bg-night-900/80 px-1 py-0.5 text-[10px] text-amber-50">NUXT_PUBLIC_API_BASE</code>
        (ej. <code class="text-[10px]">http://localhost:3001/api</code>) en
        <code class="text-[10px]">.env</code> y reinicia <code class="text-[10px]">nuxt dev</code>.
      </p>
      <form class="mt-8 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="email">Correo</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-xl border border-white/10 bg-night-850/80 px-4 py-3 text-sm text-white focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/30"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="pass">Contraseña</label>
          <input
            id="pass"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-xl border border-white/10 bg-night-850/80 px-4 py-3 text-sm text-white focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/30"
          />
        </div>
        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
        <button
          type="submit"
          class="w-full rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 py-3 text-sm font-semibold text-white shadow-royal ring-1 ring-white/15 transition hover:brightness-110"
        >
          Entrar
        </button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-500">
        ¿No tienes cuenta?
        <NuxtLink
          :to="{ path: '/registro', query: route.query }"
          class="font-medium text-royal-300 hover:text-white"
        >Regístrate</NuxtLink>
      </p>
    </div>
  </div>
</template>
