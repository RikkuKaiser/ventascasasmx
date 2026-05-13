<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useInmueblesStore } from '~/stores/inmuebles'
import type { Inmueble, TerrenoCampestreDetalle, TerrenoServiciosDetalle } from '~/types'
import { scrollToTerrenoField } from '~/composables/useScrollToFormField'

useHead({ title: 'Terrenos — LuxeInmuebles' })

const auth = useAuthStore()
const inmuebles = useInmueblesStore()
const router = useRouter()

const inputClass =
  'w-full rounded-lg border border-white/[0.08] bg-night-950/50 px-3 py-2 text-sm leading-snug text-white placeholder:text-slate-600 transition-[border-color,box-shadow] focus:border-royal-400/40 focus:outline-none focus:ring-1 focus:ring-royal-500/20'

const inputInvalidClass =
  '!border-red-500/60 !ring-1 !ring-red-500/30 focus:!border-red-500/70 focus:!ring-red-500/40'

const labelClass =
  'mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500'

const tabs = [
  {
    id: 'ubicacion',
    label: 'Ubicación',
    step: 1,
    panelTitle: '¿Dónde está tu terreno?',
    panelHint:
      'Venta de terreno / lote. Elige el subtítulo del inmueble; luego calle, municipio y colonia; opcional afinar con el mapa.',
  },
  {
    id: 'caracteristicas',
    label: 'Características',
    step: 2,
    panelTitle: 'Superficie, precio y servicios',
    panelHint:
      'Sin recámaras ni estacionamiento: datos propios de terreno. Marca servicios en banqueta o en predio.',
  },
  {
    id: 'comodidades',
    label: 'Terreno',
    step: 3,
    panelTitle: 'Forma, frente, fondo y extras',
    panelHint:
      'Frente y fondo son obligatorios para terrenos. Opcional: riego, uso de suelo, manzana y lote.',
  },
  {
    id: 'fotos',
    label: 'Fotos',
    step: 4,
    panelTitle: 'Fotos y multimedia',
    panelHint: 'Elige foto portada; galería y enlaces opcionales.',
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

// —— Ubicación ——
const calleNumero = ref('')
const loteCalle = ref('')
const estado = ref('')
const ciudadMunicipio = ref('')
const colonia = ref('')
const cp = ref('')
const pais = ref('México')
const lat = ref<number | ''>('')
const lng = ref<number | ''>('')

type SubtipoTerreno =
  | 'terreno_comercial'
  | 'terreno_campestre'
  | 'terreno_playa'
  | 'terreno_industrial'
  | 'terreno_residencial'

const subtituloTerrenoOptions: { value: SubtipoTerreno; label: string }[] = [
  { value: 'terreno_comercial', label: 'Terreno comercial' },
  { value: 'terreno_campestre', label: 'Terreno campestre' },
  { value: 'terreno_playa', label: 'Terreno de playa' },
  { value: 'terreno_industrial', label: 'Terreno industrial' },
  { value: 'terreno_residencial', label: 'Terreno residencial' },
]

const subtipoTerreno = ref<SubtipoTerreno>('terreno_campestre')

function subtituloEtiqueta(): string {
  return (
    subtituloTerrenoOptions.find((o) => o.value === subtipoTerreno.value)
      ?.label ?? 'Terreno'
  )
}

// —— Características ——
const unidadSuperficie = ref<'m2' | 'ha'>('m2')
const m2Construccion = ref<number | ''>(0)
const superficieTerreno = ref<number | ''>('')
const estadoTerreno = ref<
  'listo_construir' | 'obra_negra' | 'venta_como_terreno'
>('listo_construir')
const titulo = ref('')
const descripcion = ref('')
const notas = ref('')
const precio = ref<number | ''>('')
const moneda = ref('MXN')
const cuotaMantenimiento = ref<number | ''>('')
const destacado = ref(false)
const aptoCredito = ref(false)

const servicios = reactive<TerrenoServiciosDetalle>({
  aguaPotable: false,
  drenaje: false,
  empedrado: false,
  luz: false,
  pavimentado: false,
  rural: false,
  planFinanciamiento: false,
})

// —— Comodidades ——
const casetaGuardia = ref(false)
const seguridadPrivada = ref(false)
const formaTerreno = ref<'regular' | 'irregular' | 'plano'>('regular')
const metrosFondo = ref<number | ''>('')
const metrosFrente = ref<number | ''>('')
const tipoRiego = ref('')
const usoSuelo = ref('')
const manzana = ref('')
const lotePredial = ref('')
const etiquetasTexto = ref('')

// —— Fotos ——
const archivoPrincipal = ref<File | null>(null)
const archivosGaleria = ref<File[]>([])
const archivosVideos = ref<File[]>([])
const { previewPrincipalUrl, previewGaleria } = useLocalImagePreviews(
  archivoPrincipal,
  archivosGaleria,
)
const imagen = ref('')
const galeriaTexto = ref('')
const videoUrl = ref('')
const planosUrl = ref('')

const error = ref('')
const campoErrorId = ref<string | null>(null)
const enviando = ref(false)

const monedaOptions = [
  { value: 'MXN', label: 'MXN' },
  { value: 'USD', label: 'USD' },
]

const unidadSuperficieOptions = [
  { value: 'm2', label: 'm²' },
  { value: 'ha', label: 'Hectáreas' },
]

const estadoTerrenoOptions = [
  { value: 'listo_construir', label: 'Listo para construir' },
  { value: 'obra_negra', label: 'Construcción en obra negra' },
  {
    value: 'venta_como_terreno',
    label: 'Construcción que se vende como terreno',
  },
]

const formaTerrenoOptions = [
  { value: 'regular', label: 'Regular' },
  { value: 'irregular', label: 'Irregular' },
  { value: 'plano', label: 'Plano' },
]

const servicioFilas: { key: keyof TerrenoServiciosDetalle; label: string }[] = [
  { key: 'aguaPotable', label: 'Agua potable' },
  { key: 'drenaje', label: 'Drenaje' },
  { key: 'empedrado', label: 'Empedrado' },
  { key: 'luz', label: 'Luz' },
  { key: 'pavimentado', label: 'Pavimentado' },
  { key: 'rural', label: 'Rural' },
  { key: 'planFinanciamiento', label: 'Plan de financiamiento' },
]

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

function optNum(v: number | ''): number | undefined {
  if (v === '' || v == null) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function superficieEnM2(): number {
  const v = num(superficieTerreno.value)
  if (v <= 0) return 0
  return unidadSuperficie.value === 'ha' ? v * 10000 : v
}

function buildAmenidades(): string[] {
  const out: string[] = []
  for (const { key, label } of servicioFilas) {
    if (servicios[key]) out.push(label)
  }
  if (casetaGuardia.value) out.push('Caseta de vigilancia')
  if (seguridadPrivada.value) out.push('Seguridad privada')
  if (aptoCredito.value) out.push('Apto para crédito')
  return out
}

function buildTerrenoCampestre(): TerrenoCampestreDetalle {
  const s: TerrenoServiciosDetalle = {}
  for (const { key } of servicioFilas) {
    if (servicios[key]) (s as Record<string, boolean>)[key] = true
  }
  const tc: TerrenoCampestreDetalle = {
    operacion: 'venta',
    subtipo: subtipoTerreno.value,
    calleNumero: calleNumero.value.trim() || undefined,
    loteCalle: loteCalle.value.trim() || undefined,
    estado: estado.value.trim() || undefined,
    ciudadMunicipio: ciudadMunicipio.value.trim() || undefined,
    colonia: colonia.value.trim() || undefined,
    cp: cp.value.trim() || undefined,
    pais: pais.value.trim() || undefined,
    lat: optNum(lat.value),
    lng: optNum(lng.value),
    unidadSuperficie: unidadSuperficie.value,
    manzana: manzana.value.trim() || undefined,
    lotePredial: lotePredial.value.trim() || undefined,
    estadoTerreno: estadoTerreno.value,
    notas: notas.value.trim() || undefined,
    videoUrl: videoUrl.value.trim() || undefined,
    planosUrl: planosUrl.value.trim() || undefined,
    metrosFondo: num(metrosFondo.value),
    metrosFrente: num(metrosFrente.value),
    tipoRiego: tipoRiego.value.trim() || undefined,
    usoSuelo: usoSuelo.value.trim() || undefined,
    formaTerreno: formaTerreno.value,
    casetaGuardia: casetaGuardia.value || undefined,
    seguridadPrivada: seguridadPrivada.value || undefined,
    aptoCredito: aptoCredito.value || undefined,
  }
  if (Object.keys(s).length) tc.servicios = s
  return tc
}

function mapsSearchUrl(): string {
  const parts = [
    calleNumero.value,
    colonia.value,
    ciudadMunicipio.value,
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
    await scrollToTerrenoField('tc-tit', tabActiva, campoErrorId)
    return
  }
  if (!titulo.value.trim() || !descripcion.value.trim()) {
    error.value = 'Título y descripción general son obligatorios.'
    await scrollToTerrenoField(
      !titulo.value.trim() ? 'tc-tit' : 'tc-desc',
      tabActiva,
      campoErrorId,
    )
    return
  }
  if (!archivoPrincipal.value && !imagen.value.trim()) {
    error.value =
      'Sube una foto principal o indica la URL de la imagen principal.'
    await scrollToTerrenoField('tc-fp', tabActiva, campoErrorId)
    return
  }
  const precioN = num(precio.value)
  if (precioN <= 0) {
    error.value = 'Indica un precio válido mayor a cero.'
    await scrollToTerrenoField('tc-pre', tabActiva, campoErrorId)
    return
  }
  if (!ciudadMunicipio.value.trim() || !colonia.value.trim()) {
    error.value = 'Ciudad o municipio y colonia son obligatorios.'
    await scrollToTerrenoField(
      !ciudadMunicipio.value.trim() ? 'tc-mun' : 'tc-col',
      tabActiva,
      campoErrorId,
    )
    return
  }
  if (!calleNumero.value.trim()) {
    error.value = 'Indica calle y número (o referencia de ubicación).'
    await scrollToTerrenoField('tc-calle', tabActiva, campoErrorId)
    return
  }
  if (!estado.value.trim()) {
    error.value = 'Indica el estado.'
    await scrollToTerrenoField('tc-edo', tabActiva, campoErrorId)
    return
  }
  const m2s = superficieEnM2()
  if (m2s <= 0) {
    error.value = 'Indica la superficie del terreno en m² o hectáreas.'
    await scrollToTerrenoField('tc-sup', tabActiva, campoErrorId)
    return
  }
  const mf = num(metrosFondo.value)
  const mfr = num(metrosFrente.value)
  if (mf <= 0 || mfr <= 0) {
    error.value = 'Metros de fondo y metros de frente son obligatorios.'
    await scrollToTerrenoField(
      mf <= 0 ? 'tc-fondo' : 'tc-frente',
      tabActiva,
      campoErrorId,
    )
    return
  }

  enviando.value = true
  try {
    const terrenoCampestre = buildTerrenoCampestre()
    const etiquetas = [
      subtituloEtiqueta(),
      ...parseLineas(etiquetasTexto.value),
    ]
    const cuerpo: Omit<Inmueble, 'id'> = {
      titulo: titulo.value.trim(),
      descripcion: descripcion.value.trim(),
      precio: precioN,
      moneda: moneda.value.trim().toUpperCase().slice(0, 8) || 'MXN',
      ciudad: ciudadMunicipio.value.trim(),
      zona: colonia.value.trim(),
      m2Superficie: m2s,
      m2Construccion: num(m2Construccion.value),
      habitaciones: 0,
      banos: 0,
      destacado: destacado.value,
      etiquetas,
      imagen: archivoPrincipal.value ? '' : imagen.value.trim(),
      tipoVivienda: 'terreno',
      estacionamientos: 0,
      amenidades: buildAmenidades(),
      cuotaMantenimiento: num(cuotaMantenimiento.value),
      terrenoCampestre,
    }
    const gal = parseLineas(galeriaTexto.value)
    if (gal.length) cuerpo.galeria = gal

    const r = await inmuebles.publicarInmueble(cuerpo, {
      principal: archivoPrincipal.value,
      galeria:
        archivosGaleria.value.length > 0 ? archivosGaleria.value : undefined,
      videos:
        archivosVideos.value.length > 0 ? archivosVideos.value : undefined,
    })
    if (!r.ok) {
      error.value = r.error
      await scrollToTerrenoField('tc-tit', tabActiva, campoErrorId)
      return
    }
    await router.push(`/inmuebles/${r.id}`)
  }
  finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="px-4 py-4 sm:px-6 md:py-6 lg:px-10">
    <div class="mx-auto w-full max-w-6xl 2xl:max-w-7xl">
      <header
        class="flex flex-col items-stretch border-b border-white/[0.06] pb-3 md:flex-row md:items-start md:justify-between md:gap-6 md:pb-3"
      >
        <div class="min-w-0 text-center md:text-left">
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.22em] text-royal-400/90"
          >
            Terrenos
          </p>
          <h1
            class="mt-0.5 font-display text-xl font-medium tracking-tight text-white sm:text-2xl md:mt-0 lg:text-[1.65rem]"
          >
            Publicar terreno
          </h1>
          <p
            class="mx-auto mt-1 max-w-xl text-xs leading-snug text-slate-500 md:mx-0 sm:text-sm"
          >
            Venta de terreno / lote. Elige el subtítulo del inmueble. Sin recámaras ni estacionamiento.
          </p>
        </div>
        <div
          class="mt-2 flex flex-wrap items-center justify-center gap-2 md:mt-0 md:justify-end"
        >
          <NuxtLink
            to="/publicar"
            class="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-royal-300"
          >
            <span aria-hidden="true" class="text-slate-600">←</span>
            Otros inmuebles
          </NuxtLink>
          <NuxtLink
            to="/inmuebles"
            class="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-royal-300"
          >
            Catálogo
          </NuxtLink>
        </div>
      </header>

      <div
        v-if="!auth.estaAutenticado"
        class="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 text-center shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-8"
      >
        <p class="font-display text-lg font-medium text-white">
          Inicia sesión para continuar
        </p>
        <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          La publicación se asocia a tu cuenta.
        </p>
        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <NuxtLink
            :to="{
              path: '/login',
              query: { redirect: '/publicar-terrenos' },
            }"
            class="rounded-lg bg-gradient-to-r from-royal-600 to-royal-800 px-6 py-2.5 text-sm font-semibold text-white shadow-royal ring-1 ring-white/10 transition hover:brightness-110"
          >
            Entrar
          </NuxtLink>
          <NuxtLink
            :to="{
              path: '/registro',
              query: { redirect: '/publicar-terrenos' },
            }"
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

        <!-- Operación fija + subtítulo de inmueble (select) -->
        <div
          class="mb-4 space-y-3 rounded-xl border border-royal-500/25 bg-royal-950/20 px-3 py-3 sm:px-4"
        >
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-royal-200"
              >Venta</span
            >
            <span class="text-slate-500">·</span>
            <span class="text-xs text-slate-300">Terreno / lote</span>
          </div>
          <div>
            <label :class="labelClass" for="tc-subtitulo"
              >Subtítulo de inmueble</label
            >
            <GlassSelect
              id="tc-subtitulo"
              v-model="subtipoTerreno"
              :options="subtituloTerrenoOptions"
              required
              comfortable
            />
          </div>
        </div>

        <div
          class="relative rounded-lg border border-white/[0.06] bg-night-950/30 p-px sm:p-0.5"
          role="tablist"
          aria-label="Secciones del formulario"
        >
          <div class="grid grid-cols-2 gap-0.5 sm:grid-cols-4 sm:gap-1">
            <button
              v-for="(t, i) in tabs"
              :id="`ttab-${t.id}`"
              :key="t.id"
              type="button"
              role="tab"
              :aria-selected="tabActiva === i"
              :aria-controls="`tpanel-${t.id}`"
              :tabindex="tabActiva === i ? 0 : -1"
              class="group relative flex flex-col items-center gap-0.5 rounded-md px-0.5 py-1.5 text-center transition-all duration-300 ease-out sm:rounded-lg sm:py-2"
              :class="tabRailClass(tabActiva === i)"
              @click="tabActiva = i"
            >
              <span
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-300 sm:h-7 sm:w-7"
                :class="tabIconWrapClass(tabActiva === i)"
              >
                <span
                  class="text-[11px] font-semibold tabular-nums"
                  :class="
                    tabActiva === i ? 'text-royal-200' : 'text-slate-600'
                  "
                  >{{ t.step }}</span
                >
              </span>
              <span
                class="max-w-[5.5rem] text-[10px] font-medium leading-tight sm:max-w-none sm:text-[11px]"
                >{{ t.label }}</span
              >
            </button>
          </div>
        </div>

        <div class="mt-4 min-h-[6rem]">
          <Transition name="pub-panel" mode="out-in">
            <div
              :key="tabActiva"
              :id="`tpanel-${tabs[tabActiva].id}`"
              role="tabpanel"
              :aria-labelledby="`ttab-${tabs[tabActiva].id}`"
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

              <!-- Paso 1: Ubicación -->
              <template v-if="tabActiva === 0">
                <div class="space-y-3">
                  <div>
                    <label :class="labelClass" for="tc-calle"
                      >Calle y número</label
                    >
                    <input
                      id="tc-calle"
                      v-model="calleNumero"
                      type="text"
                      required
                      maxlength="500"
                      :class="[
                        inputClass,
                        campoErrorId === 'tc-calle' ? inputInvalidClass : '',
                      ]"
                      placeholder="Ej. Camino Real km 3.5"
                    />
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="tc-lote"
                        >Lote (opcional)</label
                      >
                      <input
                        id="tc-lote"
                        v-model="loteCalle"
                        type="text"
                        maxlength="120"
                        :class="inputClass"
                        placeholder="Si aplica junto a la vialidad"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-cp">C.P.</label>
                      <input
                        id="tc-cp"
                        v-model="cp"
                        type="text"
                        maxlength="12"
                        :class="inputClass"
                      />
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="tc-edo">Estado</label>
                      <input
                        id="tc-edo"
                        v-model="estado"
                        type="text"
                        required
                        maxlength="200"
                        :class="[
                          inputClass,
                          campoErrorId === 'tc-edo' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-mun"
                        >Ciudad o municipio</label
                      >
                      <input
                        id="tc-mun"
                        v-model="ciudadMunicipio"
                        type="text"
                        required
                        maxlength="200"
                        :class="[
                          inputClass,
                          campoErrorId === 'tc-mun' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="tc-col">Colonia</label>
                      <input
                        id="tc-col"
                        v-model="colonia"
                        type="text"
                        required
                        maxlength="200"
                        :class="[
                          inputClass,
                          campoErrorId === 'tc-col' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-pais">País</label>
                      <input
                        id="tc-pais"
                        v-model="pais"
                        type="text"
                        maxlength="120"
                        :class="inputClass"
                      />
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label :class="labelClass" for="tc-lat"
                        >Latitud (opcional)</label
                      >
                      <input
                        id="tc-lat"
                        v-model.number="lat"
                        type="number"
                        step="any"
                        :class="inputClass"
                        placeholder="Ej. 22.7483"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-lng"
                        >Longitud (opcional)</label
                      >
                      <input
                        id="tc-lng"
                        v-model.number="lng"
                        type="number"
                        step="any"
                        :class="inputClass"
                        placeholder="Ej. -102.5184"
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

              <!-- Paso 2: Características -->
              <template v-else-if="tabActiva === 1">
                <div class="grid gap-6 lg:grid-cols-[1fr_minmax(200px,280px)]">
                  <div class="space-y-3">
                    <p
                      class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600"
                    >
                      Superficie
                    </p>
                    <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      <div>
                        <label :class="labelClass" for="tc-m2c"
                          >Superficie construida (m²)</label
                        >
                        <input
                          id="tc-m2c"
                          v-model.number="m2Construccion"
                          type="number"
                          min="0"
                          step="1"
                          :class="inputClass"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="tc-un"
                          >Unidad (terreno)</label
                        >
                        <GlassSelect
                          id="tc-un"
                          v-model="unidadSuperficie"
                          :options="unidadSuperficieOptions"
                          comfortable
                        />
                      </div>
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-sup"
                        >Superficie del terreno</label
                      >
                      <input
                        id="tc-sup"
                        v-model.number="superficieTerreno"
                        type="number"
                        min="1"
                        step="any"
                        required
                        :class="[
                          inputClass,
                          campoErrorId === 'tc-sup' ? inputInvalidClass : '',
                        ]"
                        :placeholder="
                          unidadSuperficie === 'ha' ? 'Ej. 0.5' : 'Ej. 160'
                        "
                      />
                    </div>
                    <fieldset class="space-y-2">
                      <legend :class="labelClass + ' mb-2'">
                        Antigüedad / estado del predio
                      </legend>
                      <label
                        v-for="opt in estadoTerrenoOptions"
                        :key="opt.value"
                        class="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-300 transition hover:border-white/[0.1]"
                      >
                        <input
                          v-model="estadoTerreno"
                          type="radio"
                          name="estado-terreno"
                          :value="opt.value"
                          class="text-royal-500"
                        />
                        {{ opt.label }}
                      </label>
                    </fieldset>
                    <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      <div>
                        <label :class="labelClass" for="tc-pre">Precio</label>
                        <input
                          id="tc-pre"
                          v-model.number="precio"
                          type="number"
                          min="1"
                          step="1"
                          required
                          :class="[
                            inputClass,
                            campoErrorId === 'tc-pre' ? inputInvalidClass : '',
                          ]"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="tc-mon">Moneda</label>
                        <GlassSelect
                          id="tc-mon"
                          v-model="moneda"
                          :options="monedaOptions"
                          comfortable
                        />
                      </div>
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-cuota"
                        >Mantenimiento / mes (opcional)</label
                      >
                      <input
                        id="tc-cuota"
                        v-model.number="cuotaMantenimiento"
                        type="number"
                        min="0"
                        step="1"
                        :class="inputClass"
                        placeholder="0 si no aplica"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-tit">Título</label>
                      <input
                        id="tc-tit"
                        v-model="titulo"
                        type="text"
                        required
                        maxlength="500"
                        :class="[
                          inputClass,
                          campoErrorId === 'tc-tit' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-desc"
                        >Descripción general</label
                      >
                      <textarea
                        id="tc-desc"
                        v-model="descripcion"
                        required
                        rows="4"
                        :class="[
                          inputClass,
                          campoErrorId === 'tc-desc' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-notas"
                        >Panel de notas (opcional)</label
                      >
                      <textarea
                        id="tc-notas"
                        v-model="notas"
                        rows="3"
                        :class="inputClass"
                        placeholder="Detalles adicionales para compradores…"
                      />
                    </div>
                    <label
                      class="flex cursor-pointer items-start gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 transition hover:border-white/[0.1]"
                    >
                      <input
                        v-model="destacado"
                        type="checkbox"
                        class="checkbox-glass"
                      />
                      <span
                        class="text-xs leading-snug text-slate-400 sm:text-sm"
                        >Destacar en inicio</span
                      >
                    </label>
                  </div>
                  <div
                    class="space-y-3 rounded-xl border border-white/[0.06] bg-night-950/25 p-4"
                  >
                    <h3
                      class="text-[10px] font-semibold uppercase tracking-[0.18em] text-royal-400/90"
                    >
                      Servicios
                    </h3>
                    <label
                      v-for="row in servicioFilas"
                      :key="row.key"
                      class="flex cursor-pointer items-center gap-2 text-sm text-slate-300"
                    >
                      <input
                        v-model="servicios[row.key]"
                        type="checkbox"
                        class="checkbox-glass"
                      />
                      {{ row.label }}
                    </label>
                    <label
                      class="mt-2 flex cursor-pointer items-center gap-2 border-t border-white/[0.06] pt-3 text-sm text-slate-300"
                    >
                      <input
                        v-model="aptoCredito"
                        type="checkbox"
                        class="checkbox-glass"
                      />
                      Apto para crédito
                    </label>
                  </div>
                </div>
              </template>

              <!-- Paso 3: Comodidades terreno -->
              <template v-else-if="tabActiva === 2">
                <div class="space-y-4">
                  <p class="text-xs text-slate-500">
                    Estos campos mejoran el posicionamiento del anuncio.
                  </p>
                  <div class="flex flex-wrap gap-4">
                    <label
                      class="flex cursor-pointer items-center gap-2 text-sm text-slate-300"
                    >
                      <input
                        v-model="casetaGuardia"
                        type="checkbox"
                        class="checkbox-glass"
                      />
                      Caseta / caseta de vigilancia
                    </label>
                    <label
                      class="flex cursor-pointer items-center gap-2 text-sm text-slate-300"
                    >
                      <input
                        v-model="seguridadPrivada"
                        type="checkbox"
                        class="checkbox-glass"
                      />
                      Seguridad privada
                    </label>
                  </div>
                  <fieldset>
                    <legend :class="labelClass + ' mb-2'">
                      Forma del terreno
                    </legend>
                    <div class="flex flex-wrap gap-2">
                      <label
                        v-for="opt in formaTerrenoOptions"
                        :key="opt.value"
                        class="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-300"
                      >
                        <input
                          v-model="formaTerreno"
                          type="radio"
                          name="forma-terreno"
                          :value="opt.value"
                        />
                        {{ opt.label }}
                      </label>
                    </div>
                  </fieldset>
                  <div
                    class="grid gap-3 sm:grid-cols-2 sm:gap-4"
                  >
                    <div>
                      <label :class="labelClass" for="tc-fondo"
                        >Metros de fondo <span class="text-rose-400">*</span></label
                      >
                      <input
                        id="tc-fondo"
                        v-model.number="metrosFondo"
                        type="number"
                        min="0"
                        step="any"
                        required
                        :class="[
                          inputClass,
                          campoErrorId === 'tc-fondo' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-frente"
                        >Metros de frente <span class="text-rose-400">*</span></label
                      >
                      <input
                        id="tc-frente"
                        v-model.number="metrosFrente"
                        type="number"
                        min="0"
                        step="any"
                        required
                        :class="[
                          inputClass,
                          campoErrorId === 'tc-frente' ? inputInvalidClass : '',
                        ]"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-riego"
                        >Tipo de riego</label
                      >
                      <input
                        id="tc-riego"
                        v-model="tipoRiego"
                        type="text"
                        maxlength="200"
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-uso"
                        >Uso de suelo</label
                      >
                      <input
                        id="tc-uso"
                        v-model="usoSuelo"
                        type="text"
                        maxlength="200"
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-manz"
                        ># Manzana</label
                      >
                      <input
                        id="tc-manz"
                        v-model="manzana"
                        type="text"
                        maxlength="60"
                        :class="inputClass"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="tc-lotep"
                        >Lote (predio)</label
                      >
                      <input
                        id="tc-lotep"
                        v-model="lotePredial"
                        type="text"
                        maxlength="60"
                        :class="inputClass"
                      />
                    </div>
                  </div>
                  <div>
                    <label :class="labelClass" for="tc-eti"
                      >Etiquetas extra (coma o línea)</label
                    >
                    <input
                      id="tc-eti"
                      v-model="etiquetasTexto"
                      type="text"
                      :class="inputClass"
                      placeholder="Ej. Esquina, Vista montaña"
                    />
                  </div>
                </div>
              </template>

              <!-- Paso 4: Fotos -->
              <template v-else>
                <div class="space-y-3">
                  <div>
                    <label :class="labelClass" for="tc-fp"
                      >Foto principal (archivo) <span class="text-rose-400">*</span></label
                    >
                    <div
                      class="rounded-lg p-0.5 transition-[box-shadow]"
                      :class="
                        campoErrorId === 'tc-fp' ? 'ring-2 ring-red-500/50' : ''
                      "
                    >
                      <input
                        id="tc-fp"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        class="block w-full cursor-pointer text-xs text-slate-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-slate-200 hover:file:bg-white/15"
                        @change="onPrincipalFile"
                      />
                    </div>
                    <PreviewPortadaArchivo :url="previewPrincipalUrl" />
                  </div>
                  <div>
                    <label :class="labelClass" for="tc-fg">Galería (archivos)</label>
                    <input
                      id="tc-fg"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      class="block w-full cursor-pointer text-xs text-slate-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-slate-200 hover:file:bg-white/15"
                      @change="onGaleriaFiles"
                    />
                    <PreviewGaleriaArchivos :items="previewGaleria" />
                  </div>
                  <div>
                    <label :class="labelClass" for="tc-img"
                      >O URL imagen principal</label
                    >
                    <input
                      id="tc-img"
                      v-model="imagen"
                      type="url"
                      :required="!archivoPrincipal"
                      :class="inputClass"
                      placeholder="https://…"
                    />
                  </div>
                  <div>
                    <label :class="labelClass" for="tc-galtxt"
                      >Galería (URLs, una por línea)</label
                    >
                    <textarea
                      id="tc-galtxt"
                      v-model="galeriaTexto"
                      rows="2"
                      :class="inputClass"
                    />
                  </div>
                  <div>
                    <label :class="labelClass" for="tc-vid"
                      >Video (URL opcional)</label
                    >
                    <input
                      id="tc-vid"
                      v-model="videoUrl"
                      type="url"
                      :class="inputClass"
                      placeholder="https://…"
                    />
                  </div>
                  <div>
                    <label :class="labelClass" for="tc-vid-files"
                      >Videos (archivos, opcional)</label
                    >
                    <input
                      id="tc-vid-files"
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
                  <div>
                    <label :class="labelClass" for="tc-plan"
                      >Planos (URL opcional)</label
                    >
                    <input
                      id="tc-plan"
                      v-model="planosUrl"
                      type="url"
                      :class="inputClass"
                      placeholder="Enlace a PDF o imagen del plano"
                    />
                  </div>
                </div>
              </template>
            </div>
          </Transition>
        </div>

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
          <div
            class="flex flex-wrap items-center justify-center gap-2 sm:justify-end"
          >
            <button
              v-if="tabActiva > 0"
              type="button"
              class="group inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200"
              @click="tabActiva--"
            >
              Anterior
            </button>
            <button
              v-if="tabActiva < tabs.length - 1"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.08] px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/[0.12]"
              @click="tabActiva++"
            >
              Siguiente
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
          {{ enviando ? 'Publicando…' : 'Publicar terreno' }}
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
