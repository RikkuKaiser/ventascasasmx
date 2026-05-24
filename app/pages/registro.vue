<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFavoritosStore } from '~/stores/favoritos'

useHead({ title: 'Registro — Ventas Casas MX' })

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const nombre = ref('')
const email = ref('')
const password = ref('')
const aceptoLegales = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!aceptoLegales.value) {
    error.value = 'Debes aceptar los Términos y el Aviso de privacidad.'
    return
  }
  const r = await auth.registrar(nombre.value, email.value, password.value)
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
        Crea tu cuenta
      </h1>
      <p class="mt-2 text-center text-sm text-slate-400">
        Los comentarios en fichas de inmuebles requieren registro.
      </p>
      <form class="mt-8 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="nombre">Nombre</label>
          <input
            id="nombre"
            v-model="nombre"
            type="text"
            required
            autocomplete="name"
            class="w-full rounded-xl border border-white/10 bg-night-850/80 px-4 py-3 text-sm text-white focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/30"
          />
        </div>
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
            minlength="4"
            autocomplete="new-password"
            class="w-full rounded-xl border border-white/10 bg-night-850/80 px-4 py-3 text-sm text-white focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/30"
          />
        </div>
        <label class="flex cursor-pointer items-start gap-3 text-sm text-slate-400">
          <input
            v-model="aceptoLegales"
            type="checkbox"
            required
            class="checkbox-glass"
          />
          <span>
            He leído y acepto los
            <NuxtLink
              to="/terminos"
              class="font-medium text-royal-300 hover:text-white"
              @click.stop
            >Términos y condiciones</NuxtLink>
            y el
            <NuxtLink
              to="/aviso-privacidad"
              class="font-medium text-royal-300 hover:text-white"
              @click.stop
            >Aviso de privacidad</NuxtLink>.
          </span>
        </label>
        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
        <button
          type="submit"
          class="w-full rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 py-3 text-sm font-semibold text-white shadow-royal ring-1 ring-white/15 transition hover:brightness-110"
        >
          Registrarme
        </button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?
        <NuxtLink
          :to="{ path: '/login', query: route.query }"
          class="font-medium text-royal-300 hover:text-white"
        >Entrar</NuxtLink>
      </p>
    </div>
  </div>
</template>
