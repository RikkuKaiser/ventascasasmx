<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useInmueblesStore } from '~/stores/inmuebles'
import {
  TIPO_VIVIENDA_LABELS,
  type Inmueble,
  type PublicacionInmuebleDetalle,
  type TipoVivienda,
} from '~/types'
import { scrollToPublicarField } from '~/composables/useScrollToFormField'

useHead({ title: 'Publicar inmueble — LuxeInmuebles' })

const auth = useAuthStore()
const inmuebles = useInmueblesStore()
const router = useRouter()

const inputClass =
  'w-full rounded-lg border border-white/[0.08] bg-night-950/50 px-3 py-2 text-sm leading-snug text-white placeholder:text-slate-600 transition-[border-color,box-shadow] focus:border-royal-400/40 focus:outline-none focus:ring-1 focus:ring-royal-500/20'

/** Borde rojo cuando la validación del envío marca este campo. */
const inputInvalidClass =
  '!border-red-500/60 !ring-1 !ring-red-500/30 focus:!border-red-500/70 focus:!ring-red-500/40'

const labelClass =
  'mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500'

const titulo = ref('')
const descripcion = ref('')
const notas = ref('')
const precio = ref<number | ''>('')
const moneda = ref('MXN')
const ciudad = ref('')
const zona = ref('')
const calleNumero = ref('')
const estado = ref('')
const cp = ref('')
const pais = ref('México')
const lat = ref<number | ''>('')
const lng = ref<number | ''>('')
const m2Superficie = ref<number | ''>('')
const m2Construccion = ref<number | ''>('')
const habitaciones = ref<number | ''>('')
const banos = ref<number | ''>('')
const destacado = ref(false)
const etiquetasTexto = ref('')
const imagen = ref('')
const archivoPrincipal = ref<File | null>(null)
const archivosGaleria = ref<File[]>([])
const archivosVideos = ref<File[]>([])
const { previewPrincipalUrl, previewGaleria } = useLocalImagePreviews(
  archivoPrincipal,
  archivosGaleria,
)
const galeriaTexto = ref('')
const tipoVivienda = ref<TipoVivienda>('departamento')
const estacionamientos = ref<number | ''>('')
const pisosVivienda = ref<number | ''>('')
const pisoDepartamento = ref<number | ''>('')
const pisosEdificio = ref<number | ''>('')
const amenidadesTexto = ref('')
const cuotaMantenimiento = ref<number | ''>('')
const videoUrl = ref('')
const planosUrl = ref('')

const error = ref('')
const enviando = ref(false)
/** Id del control con error (p. ej. `pub-precio`) para borde rojo + scroll. */
const campoErrorId = ref<string | null>(null)

const tiposOrdenados = Object.entries(TIPO_VIVIENDA_LABELS) as [
  TipoVivienda,
  string,
][]

const monedaOptions = [
  { value: 'MXN', label: 'MXN' },
  { value: 'USD', label: 'USD' },
]

const tipoOptions = computed(() =>
  tiposOrdenados
    .filter(([valor]) => valor !== 'terreno')
    .map(([valor, etiqueta]) => ({
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
    panelTitle: '¿Dónde está el inmueble?',
    panelHint:
      'Dirección para ubicar en mapa y listados. El tipo de propiedad va en el siguiente paso.',
  },
  {
    id: 'medidas',
    label: 'Espacios',
    step: 3,
    panelTitle: 'Tipo y medidas',
    panelHint:
      'Tipo de vivienda, superficies, recámaras, baños y datos del edificio si aplica.',
  },
  {
    id: 'fotos',
    label: 'Multimedia',
    step: 4,
    panelTitle: 'Fotos y extras',
    panelHint: 'Portada, galería, video y enlaces opcionales; etiquetas y amenidades.',
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

function optNum(v: number | ''): number | undefined {
  if (v === '' || v == null) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function buildPublicacionInmueble(): PublicacionInmuebleDetalle | undefined {
  const o: PublicacionInmuebleDetalle = {}
  if (calleNumero.value.trim()) o.calleNumero = calleNumero.value.trim()
  if (estado.value.trim()) o.estado = estado.value.trim()
  if (cp.value.trim()) o.cp = cp.value.trim()
  if (pais.value.trim()) o.pais = pais.value.trim()
  const la = optNum(lat.value)
  const ln = optNum(lng.value)
  if (la != null) o.lat = la
  if (ln != null) o.lng = ln
  if (videoUrl.value.trim()) o.videoUrl = videoUrl.value.trim()
  if (planosUrl.value.trim()) o.planosUrl = planosUrl.value.trim()
  if (notas.value.trim()) o.notas = notas.value.trim()
  return Object.keys(o).length ? o : undefined
}

function mapsSearchUrl(): string {
  const parts = [
    calleNumero.value,
    zona.value,
    ciudad.value,
    estado.value,
    cp.value,
    pais.value,
  ]
    .map((x) => x.trim())
    .filter(Boolean)
  const q = encodeURIComponent(parts.join(', ') || 'México')
  return `https://www.google.com/maps/search/?api=1&query=${q}`
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

function onVideosFiles(e: Event) {
  const el = e.target as HTMLInputElement
  const list = el.files
  archivosVideos.value = list ? Array.from(list) : []
}

async function submit() {
  error.value = ''
  campoErrorId.value = null
  if (!auth.sesion) {
    error.value = 'Debes iniciar sesión para publicar.'
    await scrollToPublicarField('pub-titulo', tabActiva, campoErrorId)
    return
  }
  if (!titulo.value.trim() || !descripcion.value.trim()) {
    error.value = 'Título y descripción son obligatorios.'
    await scrollToPublicarField(
      !titulo.value.trim() ? 'pub-titulo' : 'pub-desc',
      tabActiva,
      campoErrorId,
    )
    return
  }
  if (!archivoPrincipal.value && !imagen.value.trim()) {
    error.value =
      'Sube una foto principal o indica la URL de la imagen principal.'
    await scrollToPublicarField('pub-file-principal', tabActiva, campoErrorId)
    return
  }
  const precioN = num(precio.value)
  if (precioN <= 0) {
    error.value = 'Indica un precio válido mayor a cero.'
    await scrollToPublicarField('pub-precio', tabActiva, campoErrorId)
    return
  }
  if (!ciudad.value.trim() || !zona.value.trim()) {
    error.value = 'Ciudad o municipio y colonia son obligatorios.'
    await scrollToPublicarField(
      !ciudad.value.trim() ? 'pub-ciudad' : 'pub-zona',
      tabActiva,
      campoErrorId,
    )
    return
  }
  if (!estado.value.trim()) {
    error.value = 'Indica el estado.'
    await scrollToPublicarField('pub-edo', tabActiva, campoErrorId)
    return
  }

  enviando.value = true
  try {
    const pi = buildPublicacionInmueble()
    const cuerpo: Omit<Inmueble, 'id'> = {
      titulo: titulo.value.trim(),
      descripcion: descripcion.value.trim(),
      precio: precioN,
      moneda: moneda.value.trim().toUpperCase().slice(0, 8) || 'MXN',
      ciudad: ciudad.value.trim(),
      zona: zona.value.trim(),
      m2Superficie: num(m2Superficie.value),
      m2Construccion: num(m2Construccion.value),
      habitaciones: Math.trunc(num(habitaciones.value)),
      banos: Math.trunc(num(banos.value)),
      destacado: destacado.value,
      etiquetas: parseLineas(etiquetasTexto.value),
      imagen: archivoPrincipal.value ? '' : imagen.value.trim(),
      tipoVivienda: tipoVivienda.value,
      estacionamientos: Math.trunc(num(estacionamientos.value)),
      amenidades: parseLineas(amenidadesTexto.value),
      cuotaMantenimiento: num(cuotaMantenimiento.value),
    }
    const gal = parseLineas(galeriaTexto.value)
    if (gal.length) cuerpo.galeria = gal
    const pv = optInt(pisosVivienda.value)
    if (pv != null) cuerpo.pisosVivienda = pv
    const pd = optInt(pisoDepartamento.value)
    if (pd != null) cuerpo.pisoDepartamento = pd
    const pe = optInt(pisosEdificio.value)
    if (pe != null) cuerpo.pisosEdificio = pe
    if (pi) cuerpo.publicacionInmueble = pi

    const r = await inmuebles.publicarInmueble(cuerpo, {
      principal: archivoPrincipal.value,
      galeria:
        archivosGaleria.value.length > 0 ? archivosGaleria.value : undefined,
      videos:
        archivosVideos.value.length > 0 ? archivosVideos.value : undefined,
    })
    if (!r.ok) {
      error.value = r.error
      await scrollToPublicarField('pub-titulo', tabActiva, campoErrorId)
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
            Cuatro pasos: anuncio, ubicación con mapa, medidas y fotos. Los terrenos van en su propio formulario.
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

        <div
          class="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-royal-500/25 bg-royal-950/20 px-3 py-2.5 sm:px-4"
        >
          <span
            class="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-royal-200"
            >Venta</span
          >
          <span class="text-slate-500">·</span>
          <span class="text-xs text-slate-300">Casa, depto., loft…</span>
          <span class="text-slate-500">·</span>
          <NuxtLink
            to="/publicar-terrenos"
            class="text-xs font-medium text-royal-300 underline-offset-2 hover:underline"
            >¿Solo terreno? → Terrenos</NuxtLink
          >
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
                      :class="[
                        inputClass,
                        campoErrorId === 'pub-titulo' ? inputInvalidClass : '',
                      ]"
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
                :class="[
                  inputClass,
                  campoErrorId === 'pub-desc' ? inputInvalidClass : '',
                ]"
                placeholder="Describe la propiedad, estado, entorno…"
              />
            </div>
                  <div>
                    <label :class="labelClass" for="pub-notas"
                      >Notas adicionales (opcional)</label
                    >
                    <textarea
                      id="pub-notas"
                      v-model="notas"
                      rows="2"
                      :class="inputClass"
                      placeholder="Detalles que quieras guardar en la ficha (también se envían al servidor)."
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
                        :class="[
                          inputClass,
                          campoErrorId === 'pub-precio' ? inputInvalidClass : '',
                        ]"
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
                  <div>
                    <label :class="labelClass" for="pub-calle"
                      >Calle y número</label
                    >
                    <input
                      id="pub-calle"
                      v-model="calleNumero"
                      type="text"
                      maxlength="500"
                      :class="[
                        inputClass,
                        campoErrorId === 'pub-calle' ? inputInvalidClass : '',
                      ]"
                      placeholder="Ej. Av. Insurgentes Sur 1647"
                    />
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="pub-cp">C.P.</label>
                      <input
                        id="pub-cp"
                        v-model="cp"
                        type="text"
                        maxlength="12"
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-edo"
                        >Estado <span class="text-rose-400">*</span></label
                      >
                      <input
                        id="pub-edo"
                        v-model="estado"
                        type="text"
                        required
                        maxlength="200"
                        :class="[
                          inputClass,
                          campoErrorId === 'pub-edo' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="pub-ciudad"
                        >Ciudad o municipio <span class="text-rose-400">*</span></label
                      >
                      <input
                        id="pub-ciudad"
                        v-model="ciudad"
                        type="text"
                        required
                        maxlength="200"
                        :class="[
                          inputClass,
                          campoErrorId === 'pub-ciudad' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-zona"
                        >Colonia <span class="text-rose-400">*</span></label
                      >
                      <input
                        id="pub-zona"
                        v-model="zona"
                        type="text"
                        required
                        maxlength="200"
                        :class="[
                          inputClass,
                          campoErrorId === 'pub-zona' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                  </div>
                  <div>
                    <label :class="labelClass" for="pub-pais">País</label>
                    <input
                      id="pub-pais"
                      v-model="pais"
                      type="text"
                      maxlength="120"
                      :class="inputClass"
                    />
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="pub-lat"
                        >Latitud (opcional)</label
                      >
                      <input
                        id="pub-lat"
                        v-model.number="lat"
                        type="number"
                        step="any"
                        :class="inputClass"
                        placeholder="Ej. 19.4326"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-lng"
                        >Longitud (opcional)</label
                      >
                      <input
                        id="pub-lng"
                        v-model.number="lng"
                        type="number"
                        step="any"
                        :class="inputClass"
                        placeholder="Ej. -99.1332"
                      />
                    </div>
                  </div>
                  <ClientOnly>
                    <TerrenoMapaPin
                      :lat="lat === '' ? undefined : lat"
                      :lng="lng === '' ? undefined : lng"
                      @update:lat="lat = $event ?? ''"
                      @update:lng="lng = $event ?? ''"
                    />
                  </ClientOnly>
                  <a
                    :href="mapsSearchUrl()"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex text-xs font-medium text-royal-300 underline-offset-2 hover:underline"
                    >Abrir búsqueda en Google Maps</a
                  >
                </div>
              </template>

              <template v-else-if="tabActiva === 2">
                <div class="space-y-3">
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
                    <div
                      class="rounded-lg p-0.5 transition-[box-shadow]"
                      :class="
                        campoErrorId === 'pub-file-principal'
                          ? 'ring-2 ring-red-500/50'
                          : ''
                      "
                    >
                      <input
                        id="pub-file-principal"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        class="block w-full cursor-pointer text-xs text-slate-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-slate-200 hover:file:bg-white/15"
                        @change="onPrincipalFile"
                      />
                    </div>
                    <PreviewPortadaArchivo :url="previewPrincipalUrl" />
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
                    <PreviewGaleriaArchivos :items="previewGaleria" />
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
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="pub-vid"
                        >Video (URL opcional)</label
                      >
                      <input
                        id="pub-vid"
                        v-model="videoUrl"
                        type="url"
                        :class="inputClass"
                        placeholder="https://…"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-plan"
                        >Planos (URL opcional)</label
                      >
                      <input
                        id="pub-plan"
                        v-model="planosUrl"
                        type="url"
                        :class="inputClass"
                        placeholder="PDF o imagen del plano"
                      />
                    </div>
                    <div class="sm:col-span-2">
                      <label :class="labelClass" for="pub-vid-files"
                        >Videos (archivos, opcional)</label
                      >
                      <input
                        id="pub-vid-files"
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/mpeg,video/x-msvideo"
                        multiple
                        :class="inputClass"
                        @change="onVideosFiles"
                      />
                      <p
                        v-if="archivosVideos.length"
                        class="mt-1 text-[11px] text-slate-500"
                      >
                        {{ archivosVideos.length }} archivo(s) seleccionado(s)
                      </p>
                    </div>
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
