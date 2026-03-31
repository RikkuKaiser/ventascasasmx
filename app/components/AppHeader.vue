<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFavoritosStore } from '~/stores/favoritos'

const auth = useAuthStore()
const favoritos = useFavoritosStore()
const route = useRoute()

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/inmuebles', label: 'Inmuebles' },
  { to: '/broker', label: 'Para asesores' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header
    class="sticky top-0 z-50 hidden border-b border-white/10 bg-night-900/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-night-900/30 md:block"
  >
    <div
      class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4"
    >
      <NuxtLink
        to="/"
        class="group flex min-w-0 items-center gap-2 font-display text-base font-semibold tracking-tight text-white sm:text-lg"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-royal-500 to-royal-800 shadow-royal ring-1 ring-white/20 transition group-hover:scale-105 sm:h-9 sm:w-9"
        >
          <span class="text-xs font-bold sm:text-sm">L</span>
        </span>
        <span class="truncate sm:whitespace-normal">LuxeInmuebles</span>
      </NuxtLink>

      <nav
        class="flex flex-1 items-center justify-center gap-1"
        aria-label="Principal"
      >
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4"
          :class="
            isActive(l.to)
              ? 'bg-white/10 text-white shadow-glass'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          "
        >
          {{ l.label }}
        </NuxtLink>
      </nav>

      <div class="flex shrink-0 items-center gap-1 sm:gap-2">
        <NuxtLink
          to="/favoritos"
          class="relative rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-rose-300"
          aria-label="Favoritos"
        >
          <span class="sr-only">Favoritos</span>
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3c1.538 0 2.98.806 3.742 2.154a4.25 4.25 0 013.742-2.154c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <span
            v-if="favoritos.cantidad > 0"
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-royal-600 px-1 text-[10px] font-bold text-white"
          >
            {{ favoritos.cantidad > 9 ? '9+' : favoritos.cantidad }}
          </span>
        </NuxtLink>

        <template v-if="auth.estaAutenticado && auth.sesion">
          <span
            class="hidden max-w-[140px] truncate text-sm text-slate-400 lg:inline"
          >
            {{ auth.sesion.nombre }}
          </span>
          <button
            type="button"
            class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            @click="auth.cerrarSesion()"
          >
            Salir
          </button>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="inline-flex items-center rounded-lg px-2 py-2 text-sm text-slate-300 hover:text-white sm:px-3"
          >
            Entrar
          </NuxtLink>
          <NuxtLink
            to="/registro"
            class="inline-flex items-center rounded-lg bg-gradient-to-r from-royal-600 to-royal-800 px-3 py-2 text-sm font-medium text-white shadow-royal ring-1 ring-white/20 transition hover:brightness-110 sm:px-4"
          >
            Registrarse
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>
