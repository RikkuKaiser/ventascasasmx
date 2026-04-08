<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useInmueblesStore } from '~/stores/inmuebles'
import {
  TIPO_VIVIENDA_LABELS,
  type Inmueble,
  type TipoVivienda,
} from '~/types'

useHead({ title: 'Publicar inmueble — LuxeInmuebles' })

const auth = useAuthStore()
const inmuebles = useInmueblesStore()
const router = useRouter()

const inputClass =
  'w-full rounded-lg border border-white/[0.08] bg-night-950/50 px-3 py-2 text-sm leading-snug text-white placeholder:text-slate-600 transition-[border-color,box-shadow] focus:border-royal-400/40 focus:outline-none focus:ring-1 focus:ring-royal-500/20'

const labelClass =
  'mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500'

const titulo = ref('')
const descripcion = ref('')
const precio = ref<number | ''>('')
const moneda = ref('MXN')
const ciudad = ref('')
const zona = ref('')
const m2Superficie = ref<number | ''>('')
const m2Construccion = ref<number | ''>('')
const habitaciones = ref<number | ''>('')
const banos = ref<number | ''>('')
const destacado = ref(false)
const etiquetasTexto = ref('')
const imagen = ref('')
const archivoPrincipal = ref<File | null>(null)
const archivosGaleria = ref<File[]>([])
const galeriaTexto = ref('')
const tipoVivienda = ref<TipoVivienda>('departamento')
const estacionamientos = ref<number | ''>('')
const pisosVivienda = ref<number | ''>('')
const pisoDepartamento = ref<number | ''>('')
const pisosEdificio = ref<number | ''>('')
const amenidadesTexto = ref('')
const cuotaMantenimiento = ref<number | ''>('')

const error = ref('')
const enviando = ref(false)

const tiposOrdenados = Object.entries(TIPO_VIVIENDA_LABELS) as [
  TipoVivienda,
  string,
][]

const monedaOptions = [
  { value: 'MXN', label: 'MXN' },
  { value: 'USD', label: 'USD' },
]

const tipoOptions = computed(() =>
  tiposOrdenados.map(([valor, etiqueta]) => ({
    value: valor,
    label: etiqueta,
  })),
)

const tabs = [
  {
    id: 'anuncio',
    label: 'Anuncio',
    step: 1,
    panelTitle: 'Datos principales',
    panelHint: 'Título, descripción y precio: lo primero que verán los compradores.',
  },
  {
    id: 'ubicacion',
    label: 'Ubicación',
    step: 2,
    panelTitle: 'Ubicación y tipo',
    panelHint: 'Ciudad, zona y categoría del inmueble.',
  },
  {
    id: 'medidas',
    label: 'Medidas',
    step: 3,
    panelTitle: 'Espacios',
    panelHint: 'Superficies, recámaras y datos opcionales del edificio.',
  },
  {
    id: 'fotos',
    label: 'Multimedia',
    step: 4,
    panelTitle: 'Fotos y detalles',
    panelHint: 'Imagen principal, galería, etiquetas y amenidades.',
  },
] as const

const tabActiva = ref(0)

const progresoPct = computed(
  () => ((tabActiva.value + 1) / tabs.length) * 100,
)

function tabRailClass(activa: boolean) {
  return activa
    ? 'bg-white/[0.1] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_6px_24px_-8px_rgba(0,0,0,0.45)] ring-1 ring-royal-400/35'
    : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
}

function tabIconWrapClass(activa: boolean) {
  return activa
    ? 'bg-royal-500/25 text-royal-100'
    : 'bg-white/[0.05] text-slate-500 group-hover:bg-white/[0.08] group-hover:text-slate-400'
}

function parseLineas(s: string): string[] {
  return s
    .split(/[\n,]+/)
    .map((x) => x.trim())
    .filter(Boolean)
}

function num(v: number | ''): number {
  if (v === '' || v == null) return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function optInt(v: number | ''): number | undefined {
  if (v === '' || v == null) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : undefined
}

function onPrincipalFile(e: Event) {
  const el = e.target as HTMLInputElement
  archivoPrincipal.value = el.files?.[0] ?? null
}

function onGaleriaFiles(e: Event) {
  const el = e.target as HTMLInputElement
  const list = el.files
  archivosGaleria.value = list ? Array.from(list) : []
}

async function submit() {
  error.value = ''
  if (!auth.sesion) {
    error.value = 'Debes iniciar sesión para publicar.'
    return
  }
  if (!titulo.value.trim() || !descripcion.value.trim()) {
    error.value = 'Título y descripción son obligatorios.'
    return
  }
  if (!archivoPrincipal.value && !imagen.value.trim()) {
    error.value =
      'Sube una foto principal o indica la URL de la imagen principal.'
    return
  }
  const precioN = num(precio)
  if (precioN <= 0) {
    error.value = 'Indica un precio válido mayor a cero.'
    return
  }

  enviando.value = true
  try {
    const cuerpo: Omit<Inmueble, 'id'> = {
      titulo: titulo.value.trim(),
      descripcion: descripcion.value.trim(),
      precio: precioN,
      moneda: moneda.value.trim().toUpperCase().slice(0, 8) || 'MXN',
      ciudad: ciudad.value.trim(),
      zona: zona.value.trim(),
      m2Superficie: num(m2Superficie),
      m2Construccion: num(m2Construccion),
      habitaciones: Math.trunc(num(habitaciones)),
      banos: Math.trunc(num(banos)),
      destacado: destacado.value,
      etiquetas: parseLineas(etiquetasTexto.value),
      imagen: archivoPrincipal.value ? '' : imagen.value.trim(),
      tipoVivienda: tipoVivienda.value,
      estacionamientos: Math.trunc(num(estacionamientos)),
      amenidades: parseLineas(amenidadesTexto.value),
      cuotaMantenimiento: num(cuotaMantenimiento),
    }
    const gal = parseLineas(galeriaTexto.value)
    if (gal.length) cuerpo.galeria = gal
    const pv = optInt(pisosVivienda)
    if (pv != null) cuerpo.pisosVivienda = pv
    const pd = optInt(pisoDepartamento)
    if (pd != null) cuerpo.pisoDepartamento = pd
    const pe = optInt(pisosEdificio)
    if (pe != null) cuerpo.pisosEdificio = pe

    const r = await inmuebles.publicarInmueble(cuerpo, {
      principal: archivoPrincipal.value,
      galeria:
        archivosGaleria.value.length > 0 ? archivosGaleria.value : undefined,
    })
    if (!r.ok) {
      error.value = r.error
      return
    }
    await router.push(`/inmuebles/${r.id}`)
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="px-4 py-4 sm:px-6 md:py-6 lg:px-10">
    <div class="mx-auto w-full max-w-6xl 2xl:max-w-7xl">
      <!-- Encabezado compacto: usa el ancho; en lg título + enlace en una fila -->
      <header
        class="flex flex-col items-stretch border-b border-white/[0.06] pb-3 md:flex-row md:items-start md:justify-between md:gap-6 md:pb-3"
      >
        <div class="min-w-0 text-center md:text-left">
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.22em] text-royal-400/90"
          >
            Alta de propiedad
          </p>
          <h1
            class="mt-0.5 font-display text-xl font-medium tracking-tight text-white sm:text-2xl md:mt-0 lg:text-[1.65rem]"
          >
            Publicar inmueble
          </h1>
          <p
            class="mx-auto mt-1 max-w-xl text-xs leading-snug text-slate-500 md:mx-0 sm:text-sm"
          >
            Cuatro pasos breves; al enviar, tu anuncio entra al catálogo.
          </p>
          <NuxtLink
            to="/publicar-terrenos"
            class="mt-2 inline-flex text-xs font-medium text-royal-300 underline-offset-2 hover:underline md:mt-2"
          >
            ¿Vendes terreno? Formulario Terrenos →
          </NuxtLink>
        </div>
        <NuxtLink
          to="/inmuebles"
          class="mt-2 inline-flex shrink-0 items-center justify-center gap-1 self-center text-xs font-medium text-slate-500 transition hover:text-royal-300 md:mt-0 md:self-start md:justify-end"
        >
          <span aria-hidden="true" class="text-slate-600">←</span>
          Ver catálogo
        </NuxtLink>
      </header>

      <div
        v-if="!auth.estaAutenticado"
        class="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 text-center shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-8"
      >
        <p class="font-display text-lg font-medium text-white">
          Inicia sesión para continuar
        </p>
        <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Asociamos la publicación a tu cuenta y la guardamos en el servidor.
        </p>
        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <NuxtLink
            :to="{ path: '/login', query: { redirect: '/publicar' } }"
            class="rounded-lg bg-gradient-to-r from-royal-600 to-royal-800 px-6 py-2.5 text-sm font-semibold text-white shadow-royal ring-1 ring-white/10 transition hover:brightness-110"
          >
            Entrar
          </NuxtLink>
          <NuxtLink
            :to="{ path: '/registro', query: { redirect: '/publicar' } }"
            class="rounded-lg border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
          >
            Crear cuenta
          </NuxtLink>
        </div>
      </div>

      <form
        v-else
        class="mt-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 shadow-[0_32px_80px_-28px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-5 md:mt-5 lg:p-6"
        @submit.prevent="submit"
      >
        <!-- Progreso -->
        <div class="mb-3">
          <div
            class="flex items-center justify-between gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500"
          >
            <span>Progreso</span>
            <span class="tabular-nums text-slate-400"
              >{{ tabActiva + 1 }} / {{ tabs.length }}</span
            >
          </div>
          <div
            class="mt-1.5 h-[2px] overflow-hidden rounded-full bg-white/[0.06]"
            aria-hidden="true"
          >
            <div
              class="h-full rounded-full bg-gradient-to-r from-royal-500/90 via-royal-400/80 to-royal-300/70 transition-[width] duration-500 ease-out"
              :style="{ width: `${progresoPct}%` }"
            />
          </div>
        </div>

        <!-- Stepper / tabs -->
        <div
          class="relative rounded-lg border border-white/[0.06] bg-night-950/30 p-px sm:p-0.5"
          role="tablist"
          aria-label="Secciones del formulario"
        >
          <div class="grid grid-cols-2 gap-0.5 sm:grid-cols-4 sm:gap-1">
            <button
              v-for="(t, i) in tabs"
              :id="`tab-${t.id}`"
              :key="t.id"
              type="button"
              role="tab"
              :aria-selected="tabActiva === i"
              :aria-controls="`panel-${t.id}`"
              :tabindex="tabActiva === i ? 0 : -1"
              class="group relative flex flex-col items-center gap-0.5 rounded-md px-0.5 py-1.5 text-center transition-all duration-300 ease-out sm:rounded-lg sm:py-2"
              :class="tabRailClass(tabActiva === i)"
              @click="tabActiva = i"
            >
              <div
                class="flex items-center justify-center gap-1"
              >
                <span
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-300 sm:h-7 sm:w-7"
                  :class="tabIconWrapClass(tabActiva === i)"
                >
                <!-- anuncio -->
                <svg
                  v-if="t.id === 'anuncio'"
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v7.5m2.25-6.466a9.016 9.016 0 0 0-3.461-.203 5.25 5.25 0 0 0-2.39 1.57m3.6 0h.008v.008h-.008V15Zm0 3h.007v.007h-.007V18Z"
                  />
                </svg>
                <!-- ubicacion -->
                <svg
                  v-else-if="t.id === 'ubicacion'"
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.125-7.5 11.25-7.5 11.25S4.5 17.625 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <!-- medidas -->
                <svg
                  v-else-if="t.id === 'medidas'"
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                  />
                </svg>
                <!-- fotos -->
                <svg
                  v-else
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-11.25 2.121 2.121m0 0 2.121-2.121M18 10.5h.008v.008H18V10.5Zm-6 0h.008v.008H12V10.5Zm6 3h.008v.008H18V13.5Zm-3 3h.008v.008H15V16.5Z"
                  />
                </svg>
                </span>
                <span
                  class="min-w-[0.5rem] text-center text-[11px] font-semibold tabular-nums leading-none"
                  :class="
                    tabActiva === i ? 'text-royal-200' : 'text-slate-600'
                  "
                  >{{ t.step }}</span
                >
              </div>
              <span
                class="max-w-[5rem] text-[10px] font-medium leading-tight sm:max-w-none sm:text-[11px]"
                >{{ t.label }}</span
              >
            </button>
          </div>
        </div>

        <!-- Paneles -->
        <div class="mt-4 min-h-[6rem]">
          <Transition name="pub-panel" mode="out-in">
            <div
              :key="tabActiva"
              :id="`panel-${tabs[tabActiva].id}`"
              role="tabpanel"
              :aria-labelledby="`tab-${tabs[tabActiva].id}`"
              class="space-y-3"
            >
              <header
                class="border-b border-white/[0.06] pb-3 md:flex md:items-start md:justify-between md:gap-6 md:pb-3"
              >
                <div class="min-w-0">
                  <p
                    class="text-[9px] font-semibold uppercase tracking-[0.2em] text-royal-400/90"
                  >
                    Paso {{ tabs[tabActiva].step }}
                  </p>
                  <h2
                    class="mt-0.5 font-display text-base font-medium tracking-tight text-white md:text-lg"
                  >
                    {{ tabs[tabActiva].panelTitle }}
                  </h2>
                  <p
                    class="mt-1 max-w-2xl text-xs leading-snug text-slate-500 sm:text-sm lg:max-w-none"
                  >
                    {{ tabs[tabActiva].panelHint }}
                  </p>
                </div>
              </header>

              <template v-if="tabActiva === 0">
                <div class="space-y-3">
                  <div>
                    <label :class="labelClass" for="pub-titulo"
                      >Título del anuncio</label
                    >
                    <input
                      id="pub-titulo"
                      v-model="titulo"
                      type="text"
                      required
                      maxlength="500"
                      :class="inputClass"
                      placeholder="Ej. Departamento luminoso en zona tranquila"
                    />
                  </div>
                  <div>
                    <label :class="labelClass" for="pub-desc">Descripción</label>
                    <textarea
                      id="pub-desc"
                      v-model="descripcion"
                required
                rows="4"
                :class="inputClass"
                placeholder="Describe la propiedad, estado, entorno…"
              />
            </div>
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="pub-precio">Precio</label>
                      <input
                        id="pub-precio"
                        v-model.number="precio"
                        type="number"
                        min="1"
                        step="1"
                        required
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-moneda">Moneda</label>
                      <GlassSelect
                        id="pub-moneda"
                        v-model="moneda"
                        :options="monedaOptions"
                        comfortable
                      />
                    </div>
                  </div>
                  <label
                    class="flex cursor-pointer items-start gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 transition hover:border-white/[0.1]"
                  >
                    <input
                      v-model="destacado"
                      type="checkbox"
                      class="checkbox-glass"
                    />
                    <span class="text-xs leading-snug text-slate-400 sm:text-sm">
                      Marcar como
                      <span class="text-slate-300">destacado</span>
                      — aparece en la página de inicio.
                    </span>
                  </label>
                </div>
              </template>

              <template v-else-if="tabActiva === 1">
                <div class="space-y-3">
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="pub-ciudad">Ciudad</label>
                      <input
                        id="pub-ciudad"
                        v-model="ciudad"
                        type="text"
                        required
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-zona"
                        >Zona / colonia</label
                      >
                      <input
                        id="pub-zona"
                        v-model="zona"
                        type="text"
                        required
                        :class="inputClass"
                      />
                    </div>
                  </div>
                  <div>
                    <label :class="labelClass" for="pub-tipo"
                      >Tipo de vivienda</label
                    >
                    <GlassSelect
                      id="pub-tipo"
                      v-model="tipoVivienda"
                      :options="tipoOptions"
                      required
                      comfortable
                    />
                  </div>
                </div>
              </template>

              <template v-else-if="tabActiva === 2">
                <div class="space-y-3">
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="pub-m2s"
                        >m² superficie / terreno</label
                      >
                      <input
                        id="pub-m2s"
                        v-model.number="m2Superficie"
                        type="number"
                        min="0"
                        step="1"
                        required
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-m2c"
                        >m² construcción</label
                      >
                      <input
                        id="pub-m2c"
                        v-model.number="m2Construccion"
                        type="number"
                        min="0"
                        step="1"
                        required
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-hab"
                        >Habitaciones</label
                      >
                      <input
                        id="pub-hab"
                        v-model.number="habitaciones"
                        type="number"
                        min="0"
                        step="1"
                        required
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-ban">Baños</label>
                      <input
                        id="pub-ban"
                        v-model.number="banos"
                        type="number"
                        min="0"
                        step="1"
                        required
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-est"
                        >Estacionamientos</label
                      >
                      <input
                        id="pub-est"
                        v-model.number="estacionamientos"
                        type="number"
                        min="0"
                        step="1"
                        required
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-cuota"
                        >Cuota mantenimiento / mes</label
                      >
                      <input
                        id="pub-cuota"
                        v-model.number="cuotaMantenimiento"
                        type="number"
                        min="0"
                        step="1"
                        :class="inputClass"
                        placeholder="0 si no aplica"
                      />
                    </div>
                  </div>
                  <div class="space-y-3 border-t border-white/[0.05] pt-4">
                    <p
                      class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600"
                    >
                      Opcional — departamento o edificio
                    </p>
                    <div class="grid gap-3 sm:grid-cols-3 sm:gap-4">
                      <div>
                        <label :class="labelClass" for="pub-piso"
                          >Piso del depto.</label
                        >
                        <input
                          id="pub-piso"
                          v-model.number="pisoDepartamento"
                          type="number"
                          min="0"
                          step="1"
                          :class="inputClass"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="pub-pisos-e"
                          >Niveles del edificio</label
                        >
                        <input
                          id="pub-pisos-e"
                          v-model.number="pisosEdificio"
                          type="number"
                          min="0"
                          step="1"
                          :class="inputClass"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="pub-pisos-v"
                          >Niveles de la vivienda</label
                        >
                        <input
                          id="pub-pisos-v"
                          v-model.number="pisosVivienda"
                          type="number"
                          min="0"
                          step="1"
                          :class="inputClass"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="space-y-3">
                  <div>
                    <label :class="labelClass" for="pub-file-principal"
                      >Foto principal (archivo)</label
                    >
                    <input
                      id="pub-file-principal"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      class="block w-full cursor-pointer text-xs text-slate-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-slate-200 hover:file:bg-white/15"
                      @change="onPrincipalFile"
                    />
                    <p class="mt-1 text-[10px] text-slate-600">
                      Con API y GCS configurado, se guarda en
                      <code class="text-slate-500">inmuebles/&lt;id&gt;/principal…</code>
                    </p>
                  </div>
                  <div>
                    <label :class="labelClass" for="pub-file-gal"
                      >Galería (archivos)</label
                    >
                    <input
                      id="pub-file-gal"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      class="block w-full cursor-pointer text-xs text-slate-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-slate-200 hover:file:bg-white/15"
                      @change="onGaleriaFiles"
                    />
                  </div>
                  <div>
                    <label :class="labelClass" for="pub-img"
                      >O URL imagen principal</label
                    >
                    <input
                      id="pub-img"
                      v-model="imagen"
                      type="url"
                      :required="!archivoPrincipal"
                      :class="inputClass"
                      placeholder="https://… (si no subes archivo)"
                    />
                  </div>
                  <div>
                    <label :class="labelClass" for="pub-gal"
                      >Galería (URLs, una por línea)</label
                    >
                    <textarea
                      id="pub-gal"
              v-model="galeriaTexto"
              rows="3"
              :class="inputClass"
                      placeholder="https://…"
                    />
                  </div>
                  <div>
                    <label :class="labelClass" for="pub-eti"
                      >Etiquetas (coma o línea nueva)</label
                    >
                    <input
                      id="pub-eti"
                      v-model="etiquetasTexto"
                      type="text"
                      :class="inputClass"
                      placeholder="Nuevo, Amueblado, …"
                    />
                  </div>
                  <div>
                    <label :class="labelClass" for="pub-amen"
                      >Amenidades (coma o línea nueva)</label
                    >
                    <textarea
                      id="pub-amen"
              v-model="amenidadesTexto"
              rows="2"
              :class="inputClass"
                      placeholder="Alberca, Gimnasio, …"
                    />
                  </div>
                </div>
              </template>
            </div>
          </Transition>
        </div>

        <!-- Navegación inferior -->
        <div
          class="mt-5 flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center justify-center gap-1.5 sm:justify-start">
            <span
              v-for="i in tabs.length"
              :key="i"
              class="h-1 rounded-full transition-all duration-300"
              :class="
                tabActiva === i - 1
                  ? 'w-6 bg-royal-400/80'
                  : 'w-1 bg-white/15'
              "
              aria-hidden="true"
            />
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <button
              v-if="tabActiva > 0"
              type="button"
              class="group inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200"
              @click="tabActiva--"
            >
              <svg
                class="h-4 w-4 transition group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
              Anterior
            </button>
            <button
              v-if="tabActiva < tabs.length - 1"
              type="button"
              class="group inline-flex items-center gap-1.5 rounded-lg bg-white/[0.08] px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/[0.12]"
              @click="tabActiva++"
            >
              Siguiente
              <svg
                class="h-4 w-4 transition group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>

        <p
          v-if="error"
          class="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-300/95"
        >
          {{ error }}
        </p>
        <button
          type="submit"
          :disabled="enviando"
          class="mt-4 w-full rounded-lg bg-gradient-to-r from-royal-600 to-royal-800 py-3 text-sm font-semibold tracking-wide text-white shadow-royal ring-1 ring-white/10 transition hover:brightness-110 disabled:opacity-50"
        >
          {{ enviando ? 'Publicando…' : 'Publicar en el catálogo' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.pub-panel-enter-active,
.pub-panel-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}
.pub-panel-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.pub-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
