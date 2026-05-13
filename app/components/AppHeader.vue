<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFavoritosStore } from '~/stores/favoritos'
/** Import por Vite: URL estable en dev/prod (evita fallos con `public/` o `baseURL`). */
import logoSrc from '~/assets/logo.png'

const auth = useAuthStore()
const favoritos = useFavoritosStore()
const route = useRoute()

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/inmuebles', label: 'Inmuebles' },
  { to: '/publicar', label: 'Publicar' },
  { to: '/publicar-terrenos', label: 'Terrenos' },
  { to: '/broker', label: 'Para asesores' },
]

const menuMovilAbierto = ref(false)

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  /** Evita que "Publicar" quede activo en `/publicar-terrenos`. */
  if (path === '/publicar') return route.path === '/publicar'
  return route.path.startsWith(path)
}

function salir() {
  favoritos.alCerrarSesion()
  auth.cerrarSesion()
  menuMovilAbierto.value = false
}

function cerrarMenuMovil() {
  menuMovilAbierto.value = false
}

function toggleMenuMovil() {
  menuMovilAbierto.value = !menuMovilAbierto.value
}

watch(menuMovilAbierto, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(
  () => route.fullPath,
  () => {
    menuMovilAbierto.value = false
  },
)

onUnmounted(() => {
  if (typeof document !== 'undefined')
    document.body.style.overflow = ''
})
</script>

<template>
  <header
    class="sticky top-0 z-50 overflow-visible border-b border-white/10 bg-night-900/40 pt-[env(safe-area-inset-top)] backdrop-blur-2xl supports-[backdrop-filter]:bg-night-900/30"
  >
    <!-- Móvil: logo + favoritos + menú -->
    <div
      class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 overflow-visible px-3 md:hidden"
    >
      <NuxtLink
        to="/"
        class="group relative z-[1] flex min-w-0 shrink-0 items-center gap-2 py-0"
        @click="cerrarMenuMovil"
      >
        <span class="inline-flex shrink-0 pt-2">
          <img
            :src="logoSrc"
            alt="Ventas Casa Mx"
            class="relative z-[1] h-20 w-auto max-w-[min(100%,28rem)] shrink-0 object-contain object-left transition-opacity group-hover:opacity-95"
            width="600"
            height="300"
            loading="eager"
            decoding="async"
          />
        </span>
      </NuxtLink>

      <div class="flex shrink-0 items-center gap-0.5">
        <NuxtLink
          to="/favoritos"
          class="relative z-[2] rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-rose-300"
          aria-label="Favoritos"
          @click="cerrarMenuMovil"
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

        <button
          id="menu-movil-abrir"
          type="button"
          class="relative z-[2] rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          :aria-expanded="menuMovilAbierto"
          aria-controls="menu-movil-panel"
          aria-label="Abrir menú de navegación"
          @click="toggleMenuMovil"
        >
          <!-- Hamburguesa / cerrar -->
          <svg
            v-if="!menuMovilAbierto"
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.75"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <svg
            v-else
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.75"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Escritorio -->
    <div
      class="mx-auto hidden h-14 max-w-6xl items-center justify-between gap-2 overflow-visible px-3 sm:h-16 sm:gap-4 sm:px-4 md:flex"
    >
      <NuxtLink
        to="/"
        class="group relative z-[1] flex min-w-0 shrink-0 items-center gap-2 py-0"
      >
        <span class="inline-flex shrink-0 pt-2 sm:pt-2.5">
          <img
            :src="logoSrc"
            alt="Ventas Casa Mx"
            class="relative z-[1] h-20 w-auto max-w-[min(100%,28rem)] shrink-0 object-contain object-left transition-opacity group-hover:opacity-95 sm:h-24 sm:max-w-[min(100%,34rem)]"
            width="600"
            height="300"
            loading="eager"
            decoding="async"
          />
        </span>
      </NuxtLink>

      <nav
        class="relative z-[2] flex flex-1 items-center justify-center gap-1"
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

      <div class="relative z-[2] flex shrink-0 items-center gap-1 sm:gap-2">
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
            @click="salir()"
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

    <!-- Panel menú móvil: drawer desde la derecha -->
    <Teleport to="body">
      <div
        v-if="menuMovilAbierto"
        class="fixed inset-0 z-[200] md:hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-movil-titulo"
      >
        <button
          type="button"
          class="absolute inset-0 bg-black/65 backdrop-blur-sm"
          aria-label="Cerrar menú"
          @click="cerrarMenuMovil"
        />
        <nav
          id="menu-movil-panel"
          class="animate-menu-drawer absolute right-0 top-0 flex h-full w-[min(100vw-2.5rem,20rem)] flex-col border-l border-white/10 bg-night-900/98 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] shadow-2xl shadow-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-night-900/92"
          aria-label="Menú principal"
          @click.stop
        >
          <div class="flex items-center justify-between border-b border-white/10 px-4 pb-3">
            <p
              id="menu-movil-titulo"
              class="text-xs font-semibold uppercase tracking-[0.2em] text-royal-400/90"
            >
              Menú
            </p>
            <button
              type="button"
              class="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar menú"
              @click="cerrarMenuMovil"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul class="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
            <li v-for="l in links" :key="l.to">
              <NuxtLink
                :to="l.to"
                class="block rounded-xl px-4 py-3 text-base font-medium transition"
                :class="
                  isActive(l.to)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                "
                @click="cerrarMenuMovil"
              >
                {{ l.label }}
              </NuxtLink>
            </li>
          </ul>

          <div class="border-t border-white/10 px-4 pt-3">
            <template v-if="auth.estaAutenticado && auth.sesion">
              <p class="mb-2 truncate text-sm text-slate-500">
                {{ auth.sesion.nombre }}
              </p>
              <button
                type="button"
                class="w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                @click="salir()"
              >
                Salir
              </button>
            </template>
            <template v-else>
              <div class="flex flex-col gap-2">
                <NuxtLink
                  to="/login"
                  class="block w-full rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-slate-200 transition hover:bg-white/5"
                  @click="cerrarMenuMovil"
                >
                  Entrar
                </NuxtLink>
                <NuxtLink
                  to="/registro"
                  class="block w-full rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 py-3 text-center text-sm font-semibold text-white shadow-royal ring-1 ring-white/15"
                  @click="cerrarMenuMovil"
                >
                  Registrarse
                </NuxtLink>
              </div>
            </template>
          </div>
        </nav>
      </div>
    </Teleport>
  </header>
</template>

<style scoped>
@keyframes menu-drawer-in {
  from {
    transform: translateX(100%);
    opacity: 0.92;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-menu-drawer {
  animation: menu-drawer-in 0.22s ease-out both;
}
</style>
