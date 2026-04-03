<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFavoritosStore } from '~/stores/favoritos'

const auth = useAuthStore()
const favoritos = useFavoritosStore()

function salir() {
  favoritos.alCerrarSesion()
  auth.cerrarSesion()
}
</script>

<template>
  <div class="relative min-h-screen flex flex-col">
    <div
      class="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal-600/20 blur-[100px]"
      />
      <div
        class="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-royal-800/25 blur-[90px]"
      />
    </div>
    <AppHeader />
    <main
      class="relative z-10 flex-1 pt-[max(3.5rem,env(safe-area-inset-top)+2.75rem)] md:pt-0"
    >
      <slot />
    </main>
    <footer
      class="relative z-10 mt-12 border-t border-white/5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:mt-16 sm:py-10 sm:pb-[max(2.5rem,env(safe-area-inset-bottom))]"
    >
      <div
        class="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500"
      >
        <p class="font-display text-slate-400">LuxeInmuebles</p>
        <p class="mt-1">Anuncia y descubre inmuebles con estilo.</p>
        <p class="mt-4">
          <NuxtLink
            to="/broker"
            class="text-royal-400 transition hover:text-royal-200"
          >
            Colabora como asesor
          </NuxtLink>
        </p>

        <nav
          class="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/5 pt-6 text-xs text-slate-500 md:hidden"
          aria-label="Navegación"
        >
          <NuxtLink to="/" class="transition hover:text-royal-300">
            Inicio
          </NuxtLink>
          <span class="text-slate-700" aria-hidden="true">·</span>
          <NuxtLink to="/inmuebles" class="transition hover:text-royal-300">
            Inmuebles
          </NuxtLink>
          <span class="text-slate-700" aria-hidden="true">·</span>
          <NuxtLink to="/publicar" class="transition hover:text-royal-300">
            Publicar
          </NuxtLink>
          <span class="text-slate-700" aria-hidden="true">·</span>
          <NuxtLink to="/favoritos" class="transition hover:text-royal-300">
            Favoritos
            <template v-if="favoritos.cantidad > 0">
              ({{ favoritos.cantidad > 9 ? '9+' : favoritos.cantidad }})
            </template>
          </NuxtLink>
          <span class="text-slate-700" aria-hidden="true">·</span>
          <NuxtLink to="/asesores" class="transition hover:text-royal-300">
            Asesores
          </NuxtLink>
          <template v-if="auth.estaAutenticado">
            <span class="text-slate-700" aria-hidden="true">·</span>
            <button
              type="button"
              class="transition hover:text-royal-300"
              @click="salir()"
            >
              Salir
            </button>
          </template>
          <template v-else>
            <span class="text-slate-700" aria-hidden="true">·</span>
            <NuxtLink to="/login" class="transition hover:text-royal-300">
              Entrar
            </NuxtLink>
            <span class="text-slate-700" aria-hidden="true">·</span>
            <NuxtLink to="/registro" class="transition hover:text-royal-300">
              Registro
            </NuxtLink>
          </template>
        </nav>

        <nav
          class="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/5 pt-8 text-xs text-slate-600"
          aria-label="Legal"
        >
          <NuxtLink
            to="/terminos"
            class="text-slate-500 transition hover:text-royal-300"
          >
            Términos y condiciones
          </NuxtLink>
          <NuxtLink
            to="/aviso-privacidad"
            class="text-slate-500 transition hover:text-royal-300"
          >
            Aviso de privacidad
          </NuxtLink>
        </nav>
      </div>
    </footer>
    <WhatsAppBubble />
  </div>
</template>
