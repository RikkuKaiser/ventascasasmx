<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

useHead({ title: 'Entrar — LuxeInmuebles' })

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

function submit() {
  error.value = ''
  const r = auth.iniciarSesion(email.value, password.value)
  if (!r.ok) {
    error.value = r.error
    return
  }
  router.push('/inmuebles')
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
        <NuxtLink to="/registro" class="font-medium text-royal-300 hover:text-white">Regístrate</NuxtLink>
      </p>
    </div>
  </div>
</template>
