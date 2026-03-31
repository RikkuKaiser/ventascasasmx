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

const menuAbierto = ref(false)

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function cerrarMenu() {
  menuAbierto.value = false
}

watch(
  () => route.fullPath,
  () => {
    cerrarMenu()
  },
)

watch(menuAbierto, (abierto) => {
  if (!import.meta.client)
    return
  document.documentElement.classList.toggle('overflow-hidden', abierto)
})

onUnmounted(() => {
  if (import.meta.client)
    document.documentElement.classList.remove('overflow-hidden')
})
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-white/10 bg-night-900/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-night-900/30"
  >
    <div
      class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4"
    >
      <NuxtLink
        to="/"
        class="group flex min-w-0 items-center gap-2 font-display text-base font-semibold tracking-tight text-white sm:text-lg"
        @click="cerrarMenu"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-royal-500 to-royal-800 shadow-royal ring-1 ring-white/20 transition group-hover:scale-105 sm:h-9 sm:w-9"
        >
          <span class="text-xs font-bold sm:text-sm">L</span>
        </span>
        <span class="truncate sm:whitespace-normal">LuxeInmuebles</span>
      </NuxtLink>

      <nav
        class="hidden flex-1 items-center justify-center gap-0.5 sm:flex sm:gap-1"
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
            class="hidden max-w-[140px] truncate text-sm text-slate-400 md:inline"
          >
            {{ auth.sesion.nombre }}
          </span>
          <button
            type="button"
            class="hidden rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 sm:inline-flex"
            @click="auth.cerrarSesion()"
          >
            Salir
          </button>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="hidden rounded-lg px-2 py-2 text-sm text-slate-300 hover:text-white sm:inline-flex sm:px-3"
          >
            Entrar
          </NuxtLink>
          <NuxtLink
            to="/registro"
            class="hidden rounded-lg bg-gradient-to-r from-royal-600 to-royal-800 px-3 py-2 text-sm font-medium text-white shadow-royal ring-1 ring-white/20 transition hover:brightness-110 sm:inline-flex sm:px-4"
          >
            Registrarse
          </NuxtLink>
        </template>

        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-400 sm:hidden"
          :aria-expanded="menuAbierto"
          aria-controls="menu-movil"
          aria-label="Abrir menú"
          @click="menuAbierto = true"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-show="menuAbierto"
        id="menu-movil"
        class="fixed inset-0 z-[70] sm:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <button
          type="button"
          class="absolute inset-0 bg-night-950/80 backdrop-blur-sm"
          aria-label="Cerrar menú"
          @click="cerrarMenu"
        />
        <nav
          class="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-white/10 bg-night-900/98 shadow-2xl backdrop-blur-xl"
          @click.stop
        >
          <div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span class="text-sm font-semibold text-white">Menú</span>
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-400"
              aria-label="Cerrar"
              @click="cerrarMenu"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto px-2 py-4">
            <NuxtLink
              v-for="l in links"
              :key="l.to"
              :to="l.to"
              class="block rounded-xl px-4 py-3.5 text-base font-medium transition active:bg-white/10"
              :class="
                isActive(l.to)
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              "
              @click="cerrarMenu"
            >
              {{ l.label }}
            </NuxtLink>
            <NuxtLink
              to="/favoritos"
              class="mt-1 block rounded-xl px-4 py-3.5 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              @click="cerrarMenu"
            >
              Favoritos
              <span v-if="favoritos.cantidad > 0" class="ml-2 text-royal-300">({{ favoritos.cantidad }})</span>
            </NuxtLink>
            <NuxtLink
              to="/asesores"
              class="mt-1 block rounded-xl px-4 py-3.5 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              @click="cerrarMenu"
            >
              Formulario de asesores
            </NuxtLink>
          </div>
          <div class="border-t border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <template v-if="auth.estaAutenticado && auth.sesion">
              <p class="truncate px-2 text-sm text-slate-500">
                {{ auth.sesion.nombre }}
              </p>
              <button
                type="button"
                class="mt-3 w-full rounded-xl border border-white/15 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
                @click="auth.cerrarSesion(); cerrarMenu()"
              >
                Cerrar sesión
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="block w-full rounded-xl border border-white/15 py-3 text-center text-sm font-medium text-white hover:bg-white/5"
                @click="cerrarMenu"
              >
                Entrar
              </NuxtLink>
              <NuxtLink
                to="/registro"
                class="mt-2 block w-full rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 py-3 text-center text-sm font-semibold text-white shadow-royal"
                @click="cerrarMenu"
              >
                Registrarse
              </NuxtLink>
            </template>
          </div>
        </nav>
      </div>
    </Teleport>
  </header>
</template>
