<script setup lang="ts">
definePageMeta({ middleware: 'publicador-interno' })

useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

import { useAuthStore } from '~/stores/auth'
import { useInmueblesStore } from '~/stores/inmuebles'
import {
  TIPO_VIVIENDA_LABELS,
  type Inmueble,
  type PublicacionInmuebleDetalle,
  type TerrenoCampestreDetalle,
  type TerrenoServiciosDetalle,
  type OperacionInmueble,
  type TipoVivienda,
} from '~/types'
import { scrollToPublicarField } from '~/composables/useScrollToFormField'

const auth = useAuthStore()
const inmuebles = useInmueblesStore()
const router = useRouter()
const route = useRoute()

const editId = computed(() => {
  const fromParam = route.params.id
  const raw = (Array.isArray(fromParam) ? fromParam[0] : fromParam) || route.query.id
  const s = Array.isArray(raw) ? raw[0] : raw
  if (s == null || !/^\d+$/.test(String(s))) return null
  return String(s)
})
const modoEdicion = computed(() => editId.value != null)
const cargandoEdicion = ref(false)

const inputClass =
  'w-full rounded-lg border border-white/[0.08] bg-night-950/50 px-3 py-2 text-sm leading-snug text-white placeholder:text-slate-600 transition-[border-color,box-shadow] focus:border-royal-400/40 focus:outline-none focus:ring-1 focus:ring-royal-500/20'

/** Estilo oscuro para `<input type="file">` (botón + texto del nombre). */
const fileInputClass =
  'block w-full cursor-pointer rounded-lg border border-white/[0.08] bg-night-950/50 px-3 py-2 text-xs text-slate-400 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-200 hover:file:bg-white/15'

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
const operacion = ref<OperacionInmueble>('venta')
const estacionamientos = ref<number | ''>('')
const pisosVivienda = ref<number | ''>('')
const pisoDepartamento = ref<number | ''>('')
const pisosEdificio = ref<number | ''>('')
const amenidadesTexto = ref('')
const complementosTexto = ref('')
const cuotaMantenimiento = ref<number | ''>('')
const condominio = ref('')
const mediosBanos = ref<number | ''>('')
const tipoCocina = ref('')
const estadoVivienda = ref<'nueva' | 'usada' | 'remodelada' | ''>('')
const videoUrl = ref('')
const planosUrl = ref('')

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
const loteCalle = ref('')
const unidadSuperficie = ref<'m2' | 'ha'>('m2')
const superficieTerreno = ref<number | ''>('')
const estadoTerreno = ref<
  'listo_construir' | 'obra_negra' | 'venta_como_terreno'
>('listo_construir')
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
const casetaGuardia = ref(false)
const seguridadPrivada = ref(false)
const formaTerreno = ref<'regular' | 'irregular' | 'plano'>('regular')
const metrosFondo = ref<number | ''>('')
const metrosFrente = ref<number | ''>('')
const tipoRiego = ref('')
const usoSuelo = ref('')
const manzana = ref('')
const lotePredial = ref('')

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
  tiposOrdenados.map(([valor, etiqueta]) => ({
    value: valor,
    label: etiqueta,
  })),
)

const esTerreno = computed(() => tipoVivienda.value === 'terreno')

const esCasa = computed(() =>
  ['casa', 'casa_residencial', 'duplex'].includes(tipoVivienda.value),
)

const esDepartamento = computed(() =>
  ['departamento', 'loft'].includes(tipoVivienda.value),
)

const amenidadViviendaFilas: { key: string; label: string }[] = [
  { key: 'alberca', label: 'Alberca' },
  { key: 'jardin', label: 'Jardín' },
  { key: 'terraza', label: 'Terraza' },
  { key: 'roofGarden', label: 'Roof garden' },
  { key: 'cuartoServicio', label: 'Cuarto de servicio' },
  { key: 'estudio', label: 'Estudio' },
  { key: 'bodega', label: 'Bodega' },
  { key: 'cisterna', label: 'Cisterna' },
  { key: 'tinaco', label: 'Tinaco' },
  { key: 'vigilancia', label: 'Vigilancia 24 h' },
  { key: 'gimnasio', label: 'Gimnasio' },
  { key: 'areaJuegos', label: 'Área de juegos' },
  { key: 'salonEventos', label: 'Salón de usos múltiples' },
  { key: 'cocheraTechada', label: 'Cochera techada' },
]

const complementoFilas: { key: string; label: string }[] = [
  { key: 'closets', label: 'Closets' },
  { key: 'cocinaEquipada', label: 'Cocina equipada' },
  { key: 'aireAcondicionado', label: 'Aire acondicionado' },
  { key: 'calefaccion', label: 'Calefacción' },
  { key: 'chimenea', label: 'Chimenea' },
  { key: 'calentadorSolar', label: 'Calentador solar' },
  { key: 'panelesSolares', label: 'Paneles solares' },
  { key: 'canceleria', label: 'Cancelería de aluminio' },
  { key: 'portonElectrico', label: 'Portón eléctrico' },
  { key: 'patio', label: 'Patio' },
  { key: 'cuartoTv', label: 'Cuarto de TV' },
  { key: 'walkInCloset', label: 'Walk-in closet' },
  { key: 'jacuzzi', label: 'Jacuzzi' },
  { key: 'elevador', label: 'Elevador' },
]

const amenidadesCasa = reactive<Record<string, boolean>>(
  Object.fromEntries(amenidadViviendaFilas.map((r) => [r.key, false])),
)

const complementosCasa = reactive<Record<string, boolean>>(
  Object.fromEntries(complementoFilas.map((r) => [r.key, false])),
)

const tipoCocinaOptions = [
  { value: '', label: 'Selecciona…' },
  { value: 'integral', label: 'Integral' },
  { value: 'semi_integral', label: 'Semi integral' },
  { value: 'basica', label: 'Básica' },
  { value: 'americana', label: 'Americana' },
  { value: 'abierta', label: 'Abierta / concepto abierto' },
  { value: 'exterior', label: 'Exterior / patio de servicio' },
  { value: 'no_aplica', label: 'No aplica' },
]

const estadoViviendaOptions = [
  { value: 'nueva', label: 'Nueva' },
  { value: 'usada', label: 'Usada' },
  { value: 'remodelada', label: 'Remodelada' },
] as const

const operacionLabel = computed(() =>
  operacion.value === 'renta' ? 'Renta' : 'Venta',
)

const precioLabel = computed(() =>
  operacion.value === 'renta' ? 'Precio (renta mensual)' : 'Precio',
)

useHead({
  title: computed(() => {
    if (modoEdicion.value) return 'Editar inmueble (interno) — Ventas Casas MX'
    return esTerreno.value
      ? 'Publicar terreno (interno) — Ventas Casas MX'
      : 'Publicar inmueble (interno) — Ventas Casas MX'
  }),
})

if (route.query.tipo === 'terreno' && !editId.value) {
  tipoVivienda.value = 'terreno'
}

watch(
  () => route.query.tipo,
  (t) => {
    if (t === 'terreno' && !editId.value) tipoVivienda.value = 'terreno'
  },
)

const tabsInmueble = [
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
      'Tipo de vivienda, superficies, recámaras, baños, niveles, cocina, amenidades y complementos.',
  },
  {
    id: 'fotos',
    label: 'Multimedia',
    step: 4,
    panelTitle: 'Fotos y extras',
    panelHint: 'Portada, galería, video y enlaces opcionales; etiquetas y amenidades.',
  },
] as const

const tabsTerreno = [
  {
    id: 'anuncio',
    label: 'Anuncio',
    step: 1,
    panelTitle: 'Datos principales',
    panelHint:
      'Elige el tipo terreno y su subtítulo. Título, descripción y precio para el anuncio.',
  },
  {
    id: 'ubicacion',
    label: 'Ubicación',
    step: 2,
    panelTitle: '¿Dónde está tu terreno?',
    panelHint:
      'Calle, municipio y colonia; opcional afinar con el mapa.',
  },
  {
    id: 'medidas',
    label: 'Terreno',
    step: 3,
    panelTitle: 'Superficie, servicios y forma',
    panelHint:
      'Superficie del lote, servicios, frente y fondo. Sin recámaras ni estacionamiento.',
  },
  {
    id: 'fotos',
    label: 'Fotos',
    step: 4,
    panelTitle: 'Fotos y multimedia',
    panelHint: 'Elige foto portada; galería y enlaces opcionales.',
  },
] as const

const tabs = computed(() =>
  esTerreno.value ? [...tabsTerreno] : [...tabsInmueble],
)

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

function subtituloEtiqueta(): string {
  return (
    subtituloTerrenoOptions.find((o) => o.value === subtipoTerreno.value)
      ?.label ?? 'Terreno'
  )
}

function superficieEnM2(): number {
  const v = num(superficieTerreno.value)
  if (v <= 0) return 0
  return unidadSuperficie.value === 'ha' ? v * 10000 : v
}

function buildAmenidadesTerreno(): string[] {
  const out: string[] = []
  for (const { key, label } of servicioFilas) {
    if (servicios[key]) out.push(label)
  }
  if (casetaGuardia.value) out.push('Caseta de vigilancia')
  if (seguridadPrivada.value) out.push('Seguridad privada')
  if (aptoCredito.value) out.push('Apto para crédito')
  return out
}

function buildAmenidadesVivienda(): string[] {
  const out: string[] = []
  for (const { key, label } of amenidadViviendaFilas) {
    if (amenidadesCasa[key]) out.push(label)
  }
  out.push(...parseLineas(amenidadesTexto.value))
  return [...new Set(out)]
}

function buildComplementosVivienda(): string[] {
  const out: string[] = []
  for (const { key, label } of complementoFilas) {
    if (complementosCasa[key]) out.push(label)
  }
  out.push(...parseLineas(complementosTexto.value))
  return [...new Set(out)]
}

function buildTerrenoCampestre(): TerrenoCampestreDetalle {
  const s: TerrenoServiciosDetalle = {}
  for (const { key } of servicioFilas) {
    if (servicios[key]) (s as Record<string, boolean>)[key] = true
  }
  const tc: TerrenoCampestreDetalle = {
    operacion: operacion.value,
    subtipo: subtipoTerreno.value,
    calleNumero: calleNumero.value.trim() || undefined,
    loteCalle: loteCalle.value.trim() || undefined,
    estado: estado.value.trim() || undefined,
    ciudadMunicipio: ciudad.value.trim() || undefined,
    colonia: zona.value.trim() || undefined,
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

function buildPublicacionInmueble(): PublicacionInmuebleDetalle {
  const o: PublicacionInmuebleDetalle = { operacion: operacion.value }
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
  if (!esTerreno.value && notas.value.trim()) o.notas = notas.value.trim()
  if (condominio.value.trim()) o.condominio = condominio.value.trim()
  const mb = optNum(mediosBanos.value)
  if (mb != null && mb > 0) o.mediosBanos = mb
  if (tipoCocina.value) o.tipoCocina = tipoCocina.value
  if (estadoVivienda.value) o.estadoVivienda = estadoVivienda.value
  const comps = buildComplementosVivienda()
  if (comps.length) o.complementos = comps
  return o
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

function numOrBlank(n: number | null | undefined): number | '' {
  if (n == null || !Number.isFinite(Number(n))) return ''
  return Number(n)
}

function marcarPorEtiqueta(
  destino: Record<string, boolean>,
  filas: { key: string; label: string }[],
  valores: string[],
): string[] {
  const porLabel = new Map(filas.map((f) => [f.label, f.key]))
  for (const key of Object.keys(destino)) destino[key] = false
  const extras: string[] = []
  for (const valor of valores) {
    const key = porLabel.get(valor)
    if (key) destino[key] = true
    else if (valor.trim()) extras.push(valor.trim())
  }
  return extras
}

function aplicarInmueble(i: Inmueble) {
  titulo.value = i.titulo
  descripcion.value = i.descripcion
  precio.value = numOrBlank(i.precio)
  moneda.value = (i.moneda || 'MXN').toUpperCase()
  ciudad.value = i.ciudad
  zona.value = i.zona
  m2Superficie.value = numOrBlank(i.m2Superficie)
  m2Construccion.value = numOrBlank(i.m2Construccion)
  habitaciones.value = numOrBlank(i.habitaciones)
  banos.value = numOrBlank(i.banos)
  destacado.value = Boolean(i.destacado)
  imagen.value = i.imagen || ''
  tipoVivienda.value = i.tipoVivienda
  operacion.value = i.operacion === 'renta' ? 'renta' : 'venta'
  estacionamientos.value = numOrBlank(i.estacionamientos)
  pisosVivienda.value = numOrBlank(i.pisosVivienda)
  pisoDepartamento.value = numOrBlank(i.pisoDepartamento)
  pisosEdificio.value = numOrBlank(i.pisosEdificio)
  cuotaMantenimiento.value = numOrBlank(i.cuotaMantenimiento)
  archivoPrincipal.value = null
  archivosGaleria.value = []
  archivosVideos.value = []

  const tc = i.terrenoCampestre
  const pi = i.publicacionInmueble
  const fuente = i.tipoVivienda === 'terreno' ? tc : pi

  calleNumero.value = fuente?.calleNumero ?? ''
  estado.value = fuente?.estado ?? ''
  cp.value = fuente?.cp ?? ''
  pais.value = fuente?.pais || 'México'
  lat.value = numOrBlank(fuente?.lat)
  lng.value = numOrBlank(fuente?.lng)
  notas.value = fuente?.notas ?? ''
  videoUrl.value = fuente?.videoUrl ?? ''
  planosUrl.value = fuente?.planosUrl ?? ''

  if (i.tipoVivienda === 'terreno' && tc) {
    const subtipos = new Set(subtituloTerrenoOptions.map((o) => o.value))
    subtipoTerreno.value = subtipos.has(tc.subtipo as SubtipoTerreno)
      ? (tc.subtipo as SubtipoTerreno)
      : 'terreno_campestre'
    loteCalle.value = tc.loteCalle ?? ''
    unidadSuperficie.value = tc.unidadSuperficie === 'ha' ? 'ha' : 'm2'
    superficieTerreno.value = unidadSuperficie.value === 'ha'
      ? numOrBlank(i.m2Superficie / 10000)
      : numOrBlank(i.m2Superficie)
    const estados = new Set(estadoTerrenoOptions.map((o) => o.value))
    estadoTerreno.value = estados.has(tc.estadoTerreno as typeof estadoTerreno.value)
      ? (tc.estadoTerreno as typeof estadoTerreno.value)
      : 'listo_construir'
    const formas = new Set(formaTerrenoOptions.map((o) => o.value))
    formaTerreno.value = formas.has(tc.formaTerreno as typeof formaTerreno.value)
      ? (tc.formaTerreno as typeof formaTerreno.value)
      : 'regular'
    metrosFondo.value = numOrBlank(tc.metrosFondo)
    metrosFrente.value = numOrBlank(tc.metrosFrente)
    tipoRiego.value = tc.tipoRiego ?? ''
    usoSuelo.value = tc.usoSuelo ?? ''
    manzana.value = tc.manzana ?? ''
    lotePredial.value = tc.lotePredial ?? ''
    casetaGuardia.value = Boolean(tc.casetaGuardia)
    seguridadPrivada.value = Boolean(tc.seguridadPrivada)
    aptoCredito.value = Boolean(tc.aptoCredito)
    for (const { key } of servicioFilas) servicios[key] = Boolean(tc.servicios?.[key])
    amenidadesTexto.value = ''
    complementosTexto.value = ''
  }
  else {
    condominio.value = pi?.condominio ?? ''
    mediosBanos.value = numOrBlank(pi?.mediosBanos)
    tipoCocina.value = pi?.tipoCocina && tipoCocinaOptions.some((o) => o.value === pi.tipoCocina)
      ? pi.tipoCocina
      : ''
    estadoVivienda.value = pi?.estadoVivienda && estadoViviendaOptions.some((o) => o.value === pi.estadoVivienda)
      ? pi.estadoVivienda
      : ''
    amenidadesTexto.value = marcarPorEtiqueta(
      amenidadesCasa,
      amenidadViviendaFilas,
      i.amenidades ?? [],
    ).join(', ')
    complementosTexto.value = marcarPorEtiqueta(
      complementosCasa,
      complementoFilas,
      pi?.complementos ?? [],
    ).join(', ')
  }

  const ignorar = new Set([
    'venta',
    'renta',
    subtituloEtiqueta().toLowerCase(),
  ])
  etiquetasTexto.value = (i.etiquetas ?? [])
    .filter((t) => !ignorar.has(t.trim().toLowerCase()))
    .join(', ')
  galeriaTexto.value = ''
}

async function cargarEdicion() {
  if (!editId.value) return
  cargandoEdicion.value = true
  error.value = ''
  try {
    await inmuebles.refrescarInmuebleDesdeApi(editId.value)
    const item = inmuebles.porId(editId.value)
    if (!item) {
      error.value = 'No encontramos ese inmueble para editarlo.'
      return
    }
    aplicarInmueble(item)
  }
  finally {
    cargandoEdicion.value = false
  }
}

onMounted(() => {
  void cargarEdicion()
})

watch(editId, () => {
  void cargarEdicion()
})

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
  if (tabActiva.value < tabs.value.length - 1) {
    tabActiva.value++
    return
  }
  error.value = ''
  campoErrorId.value = null
  if (!auth.sesion) {
    error.value = modoEdicion.value
      ? 'Debes iniciar sesión para editar.'
      : 'Debes iniciar sesión para publicar.'
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
  if (esCasa.value && (!pisosVivienda.value || num(pisosVivienda.value) < 1)) {
    error.value = 'Indica cuántos niveles tiene la casa.'
    tabActiva.value = 2
    await scrollToPublicarField('pub-pisos-v', tabActiva, campoErrorId)
    return
  }
  if (!esTerreno.value && !estadoVivienda.value) {
    error.value = 'Indica el estado de la vivienda: nueva, usada o remodelada.'
    tabActiva.value = 2
    await scrollToPublicarField('pub-estado-vivienda', tabActiva, campoErrorId)
    return
  }
  if (esTerreno.value) {
    if (!calleNumero.value.trim()) {
      error.value = 'Indica calle y número (o referencia de ubicación).'
      await scrollToPublicarField('pub-calle', tabActiva, campoErrorId)
      return
    }
    const m2s = superficieEnM2()
    if (m2s <= 0) {
      error.value = 'Indica la superficie del terreno en m² o hectáreas.'
      await scrollToPublicarField('pub-sup-terreno', tabActiva, campoErrorId)
      return
    }
    const mf = num(metrosFondo.value)
    const mfr = num(metrosFrente.value)
    if (mf <= 0 || mfr <= 0) {
      error.value = 'Metros de fondo y metros de frente son obligatorios.'
      await scrollToPublicarField(
        mf <= 0 ? 'pub-fondo' : 'pub-frente',
        tabActiva,
        campoErrorId,
      )
      return
    }
  }

  enviando.value = true
  try {
    if (esTerreno.value) {
      const terrenoCampestre = buildTerrenoCampestre()
      const m2s = superficieEnM2()
      const etiquetas = [
        operacionLabel.value,
        subtituloEtiqueta(),
        ...parseLineas(etiquetasTexto.value),
      ]
      const cuerpo: Omit<Inmueble, 'id'> = {
        titulo: titulo.value.trim(),
        descripcion: descripcion.value.trim(),
        precio: precioN,
        moneda: moneda.value.trim().toUpperCase().slice(0, 8) || 'MXN',
        ciudad: ciudad.value.trim(),
        zona: zona.value.trim(),
        m2Superficie: m2s,
        m2Construccion: num(m2Construccion.value),
        habitaciones: 0,
        banos: 0,
        destacado: destacado.value,
        etiquetas,
        imagen: archivoPrincipal.value ? '' : imagen.value.trim(),
        tipoVivienda: 'terreno',
        estacionamientos: 0,
        amenidades: buildAmenidadesTerreno(),
        cuotaMantenimiento: num(cuotaMantenimiento.value),
        operacion: operacion.value,
        terrenoCampestre,
      }
      const gal = parseLineas(galeriaTexto.value)
      if (gal.length) cuerpo.galeria = gal

      const archivos = {
        principal: archivoPrincipal.value,
        galeria:
          archivosGaleria.value.length > 0 ? archivosGaleria.value : undefined,
        videos:
          archivosVideos.value.length > 0 ? archivosVideos.value : undefined,
      }
      const r = modoEdicion.value && editId.value
        ? await inmuebles.actualizarInmueble(editId.value, cuerpo, archivos)
        : await inmuebles.publicarInmueble(cuerpo, archivos)
      if (!r.ok) {
        error.value = r.error
        await scrollToPublicarField('pub-titulo', tabActiva, campoErrorId)
        return
      }
      await router.push(`/inmuebles/${r.id}`)
      return
    }

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
      etiquetas: [operacionLabel.value, ...parseLineas(etiquetasTexto.value)],
      imagen: archivoPrincipal.value ? '' : imagen.value.trim(),
      tipoVivienda: tipoVivienda.value,
      estacionamientos: Math.trunc(num(estacionamientos.value)),
      amenidades: buildAmenidadesVivienda(),
      cuotaMantenimiento: num(cuotaMantenimiento.value),
      operacion: operacion.value,
    }
    const gal = parseLineas(galeriaTexto.value)
    if (gal.length) cuerpo.galeria = gal
    const pv = optInt(pisosVivienda.value)
    if (pv != null) cuerpo.pisosVivienda = pv
    const pd = optInt(pisoDepartamento.value)
    if (pd != null) cuerpo.pisoDepartamento = pd
    const pe = optInt(pisosEdificio.value)
    if (pe != null) cuerpo.pisosEdificio = pe
    cuerpo.publicacionInmueble = pi

    const archivos = {
      principal: archivoPrincipal.value,
      galeria:
        archivosGaleria.value.length > 0 ? archivosGaleria.value : undefined,
      videos:
        archivosVideos.value.length > 0 ? archivosVideos.value : undefined,
    }
    const r = modoEdicion.value && editId.value
      ? await inmuebles.actualizarInmueble(editId.value, cuerpo, archivos)
      : await inmuebles.publicarInmueble(cuerpo, archivos)
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
        class="border-b border-white/[0.06] pb-3 md:pb-3"
      >
        <div class="min-w-0 text-center md:text-left">
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.22em] text-royal-400/90"
          >
            {{ modoEdicion ? 'Edición de propiedad' : 'Alta de propiedad' }}
          </p>
          <h1
            class="mt-0.5 font-display text-xl font-medium tracking-tight text-white sm:text-2xl md:mt-0 lg:text-[1.65rem]"
          >
            {{ modoEdicion ? 'Editar inmueble' : 'Publicar inmueble' }}
          </h1>
          <p
            class="mx-auto mt-1 max-w-xl text-xs leading-snug text-slate-500 md:mx-0 sm:text-sm"
          >
            {{
              modoEdicion
                ? 'Corrige título, precio, ubicación, medidas y fotos. Lo que no cambies se conserva, incluidas las fotos actuales.'
                : 'Un solo formulario para casas, departamentos, lofts y terrenos. Cuatro pasos: anuncio, ubicación, medidas y fotos.'
            }}
          </p>
          <p v-if="cargandoEdicion" class="mt-2 text-xs text-royal-300">
            Cargando la información del inmueble…
          </p>
        </div>
      </header>

      <div
        v-if="!auth.sesionValidaParaApi"
        class="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 text-center shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-8"
      >
        <p class="font-display text-lg font-medium text-white">
          Inicia sesión para continuar
        </p>
        <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Asociamos la publicación a tu cuenta y la guardamos en el servidor.
          <span
            v-if="auth.estaAutenticado && !auth.sesionValidaParaApi"
            class="mt-2 block text-amber-400/90"
          >
            Tu sesión expiró o no es válida para el servidor. Vuelve a entrar.
          </span>
        </p>
        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <NuxtLink
            :to="{ path: '/login', query: { redirect: '/interno/publicar' } }"
            class="rounded-lg bg-gradient-to-r from-royal-600 to-royal-800 px-6 py-2.5 text-sm font-semibold text-white shadow-royal ring-1 ring-white/10 transition hover:brightness-110"
          >
            Entrar
          </NuxtLink>
          <NuxtLink
            :to="{ path: '/registro', query: { redirect: '/interno/publicar' } }"
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
          class="mb-4 space-y-3 rounded-xl border border-royal-500/25 bg-royal-950/20 px-3 py-3 sm:px-4"
        >
          <div>
            <p :class="labelClass">Tipo de operación</p>
            <div
              id="pub-operacion"
              class="mt-1.5 inline-flex rounded-lg border border-white/[0.08] bg-night-950/40 p-0.5"
              role="group"
              aria-label="Venta o renta"
            >
              <button
                type="button"
                class="rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider transition"
                :class="
                  operacion === 'venta'
                    ? 'bg-white/10 text-royal-100 shadow-sm ring-1 ring-royal-400/30'
                    : 'text-slate-500 hover:text-slate-300'
                "
                @click="operacion = 'venta'"
              >
                Venta
              </button>
              <button
                type="button"
                class="rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider transition"
                :class="
                  operacion === 'renta'
                    ? 'bg-white/10 text-royal-100 shadow-sm ring-1 ring-royal-400/30'
                    : 'text-slate-500 hover:text-slate-300'
                "
                @click="operacion = 'renta'"
              >
                Renta
              </button>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span
              class="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-royal-200"
              >{{ operacionLabel }}</span
            >
            <span class="text-slate-500">·</span>
            <span>
              {{ esTerreno ? 'Terreno / lote' : 'Casa, depto., loft…' }}
            </span>
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
                    <label :class="labelClass" for="pub-tipo"
                      >Tipo de inmueble</label
                    >
                    <GlassSelect
                      id="pub-tipo"
                      v-model="tipoVivienda"
                      :options="tipoOptions"
                      required
                      comfortable
                    />
                  </div>
                  <div v-if="esTerreno">
                    <label :class="labelClass" for="pub-subtipo"
                      >Subtítulo de inmueble</label
                    >
                    <GlassSelect
                      id="pub-subtipo"
                      v-model="subtipoTerreno"
                      :options="subtituloTerrenoOptions"
                      required
                      comfortable
                    />
                  </div>
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
                      <label :class="labelClass" for="pub-precio">{{ precioLabel }}</label>
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
                      <span class="text-slate-300">Destacar en inicio</span>
                      — uso interno; no se muestra en la tarjeta del catálogo.
                    </span>
                  </label>
                </div>
              </template>

              <template v-else-if="tabActiva === 1">
                <div class="space-y-3">
                  <div>
                    <label :class="labelClass" for="pub-calle"
                      >Calle y número
                      <span v-if="esTerreno" class="text-rose-400">*</span></label
                    >
                    <input
                      id="pub-calle"
                      v-model="calleNumero"
                      type="text"
                      :required="esTerreno"
                      maxlength="500"
                      :class="[
                        inputClass,
                        campoErrorId === 'pub-calle' ? inputInvalidClass : '',
                      ]"
                      :placeholder="
                        esTerreno
                          ? 'Ej. Camino Real km 3.5'
                          : 'Ej. Av. Insurgentes Sur 1647'
                      "
                    />
                  </div>
                  <div
                    v-if="esTerreno"
                    class="grid gap-3 sm:grid-cols-2 sm:gap-4"
                  >
                    <div>
                      <label :class="labelClass" for="pub-lote"
                        >Lote (opcional)</label
                      >
                      <input
                        id="pub-lote"
                        v-model="loteCalle"
                        type="text"
                        maxlength="120"
                        :class="inputClass"
                        placeholder="Si aplica junto a la vialidad"
                      />
                    </div>
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
                  </div>
                  <div
                    v-if="!esTerreno"
                    class="grid gap-3 sm:grid-cols-2 sm:gap-4"
                  >
                    <div v-if="esCasa" class="sm:col-span-2">
                      <label :class="labelClass" for="pub-condominio"
                        >Condominio / fraccionamiento</label
                      >
                      <input
                        id="pub-condominio"
                        v-model="condominio"
                        type="text"
                        maxlength="300"
                        :class="inputClass"
                        placeholder="Ej. Residencial Las Palmas, Condominio Vista Hermosa"
                      />
                    </div>
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
                  <div v-if="esTerreno">
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
                <div v-if="esTerreno" class="grid gap-6 lg:grid-cols-[1fr_minmax(200px,280px)]">
                  <div class="space-y-4">
                    <p
                      class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600"
                    >
                      Superficie
                    </p>
                    <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      <div>
                        <label :class="labelClass" for="pub-m2c"
                          >Superficie construida (m²)</label
                        >
                        <input
                          id="pub-m2c"
                          v-model.number="m2Construccion"
                          type="number"
                          min="0"
                          step="1"
                          :class="inputClass"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="pub-un-sup"
                          >Unidad (terreno)</label
                        >
                        <GlassSelect
                          id="pub-un-sup"
                          v-model="unidadSuperficie"
                          :options="unidadSuperficieOptions"
                          comfortable
                        />
                      </div>
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-sup-terreno"
                        >Superficie del terreno
                        <span class="text-rose-400">*</span></label
                      >
                      <input
                        id="pub-sup-terreno"
                        v-model.number="superficieTerreno"
                        type="number"
                        min="1"
                        step="any"
                        required
                        :class="[
                          inputClass,
                          campoErrorId === 'pub-sup-terreno'
                            ? inputInvalidClass
                            : '',
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
                    <div>
                      <label :class="labelClass" for="pub-cuota"
                        >Mantenimiento / mes (opcional)</label
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
                    <div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      <div>
                        <label :class="labelClass" for="pub-fondo"
                          >Metros de fondo
                          <span class="text-rose-400">*</span></label
                        >
                        <input
                          id="pub-fondo"
                          v-model.number="metrosFondo"
                          type="number"
                          min="0"
                          step="any"
                          required
                          :class="[
                            inputClass,
                            campoErrorId === 'pub-fondo'
                              ? inputInvalidClass
                              : '',
                          ]"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="pub-frente"
                          >Metros de frente
                          <span class="text-rose-400">*</span></label
                        >
                        <input
                          id="pub-frente"
                          v-model.number="metrosFrente"
                          type="number"
                          min="0"
                          step="any"
                          required
                          :class="[
                            inputClass,
                            campoErrorId === 'pub-frente'
                              ? inputInvalidClass
                              : '',
                          ]"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="pub-riego"
                          >Tipo de riego</label
                        >
                        <input
                          id="pub-riego"
                          v-model="tipoRiego"
                          type="text"
                          maxlength="200"
                          :class="inputClass"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="pub-uso"
                          >Uso de suelo</label
                        >
                        <input
                          id="pub-uso"
                          v-model="usoSuelo"
                          type="text"
                          maxlength="200"
                          :class="inputClass"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="pub-manz"
                          ># Manzana</label
                        >
                        <input
                          id="pub-manz"
                          v-model="manzana"
                          type="text"
                          maxlength="60"
                          :class="inputClass"
                        />
                      </div>
                      <div>
                        <label :class="labelClass" for="pub-lotep"
                          >Lote (predio)</label
                        >
                        <input
                          id="pub-lotep"
                          v-model="lotePredial"
                          type="text"
                          maxlength="60"
                          :class="inputClass"
                        />
                      </div>
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-eti"
                        >Etiquetas extra (coma o línea)</label
                      >
                      <input
                        id="pub-eti"
                        v-model="etiquetasTexto"
                        type="text"
                        :class="inputClass"
                        placeholder="Ej. Esquina, Vista montaña"
                      />
                    </div>
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
                <div v-else class="space-y-5">
                  <fieldset id="pub-estado-vivienda" class="space-y-2">
                    <legend :class="labelClass + ' mb-2'">
                      Estado de la vivienda
                      <span class="text-rose-400">*</span>
                    </legend>
                    <div class="flex flex-wrap gap-2">
                      <label
                        v-for="opt in estadoViviendaOptions"
                        :key="opt.value"
                        class="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-300 transition hover:border-white/[0.1]"
                        :class="
                          estadoVivienda === opt.value
                            ? 'border-royal-400/40 bg-royal-950/30 text-white'
                            : ''
                        "
                      >
                        <input
                          v-model="estadoVivienda"
                          type="radio"
                          name="estado-vivienda"
                          :value="opt.value"
                          class="text-royal-500"
                          required
                        />
                        {{ opt.label }}
                      </label>
                    </div>
                  </fieldset>
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
                        >Recámaras</label
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
                      <label :class="labelClass" for="pub-ban">Baños completos</label>
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
                      <label :class="labelClass" for="pub-medios-ban"
                        >Medios baños</label
                      >
                      <input
                        id="pub-medios-ban"
                        v-model.number="mediosBanos"
                        type="number"
                        min="0"
                        step="0.5"
                        :class="inputClass"
                        placeholder="0, 0.5, 1, 1.5…"
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
                    <div v-if="esCasa">
                      <label :class="labelClass" for="pub-pisos-v"
                        >Niveles de la casa <span class="text-rose-400">*</span></label
                      >
                      <input
                        id="pub-pisos-v"
                        v-model.number="pisosVivienda"
                        type="number"
                        min="1"
                        step="1"
                        :required="esCasa"
                        :class="inputClass"
                        placeholder="Ej. 2"
                      />
                    </div>
                    <div>
                      <label :class="labelClass" for="pub-tipo-cocina"
                        >Tipo de cocina</label
                      >
                      <GlassSelect
                        id="pub-tipo-cocina"
                        v-model="tipoCocina"
                        :options="tipoCocinaOptions"
                        comfortable
                      />
                    </div>
                  </div>

                  <div
                    v-if="esDepartamento"
                    class="space-y-3 border-t border-white/[0.05] pt-4"
                  >
                    <p
                      class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600"
                    >
                      Departamento o edificio
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
                        <label :class="labelClass" for="pub-pisos-v-depto"
                          >Niveles de la vivienda</label
                        >
                        <input
                          id="pub-pisos-v-depto"
                          v-model.number="pisosVivienda"
                          type="number"
                          min="0"
                          step="1"
                          :class="inputClass"
                        />
                      </div>
                    </div>
                  </div>

                  <fieldset class="space-y-2 border-t border-white/[0.05] pt-4">
                    <legend :class="labelClass + ' mb-2'">
                      Amenidades
                    </legend>
                    <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      <label
                        v-for="row in amenidadViviendaFilas"
                        :key="row.key"
                        class="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-300"
                      >
                        <input
                          v-model="amenidadesCasa[row.key]"
                          type="checkbox"
                          class="checkbox-glass"
                        />
                        {{ row.label }}
                      </label>
                    </div>
                    <div class="pt-2">
                      <label :class="labelClass" for="pub-amen-extra"
                        >Otras amenidades (opcional)</label
                      >
                      <input
                        id="pub-amen-extra"
                        v-model="amenidadesTexto"
                        type="text"
                        :class="inputClass"
                        placeholder="Ej. Asador, Cancha de tenis…"
                      />
                    </div>
                  </fieldset>

                  <fieldset class="space-y-2 border-t border-white/[0.05] pt-4">
                    <legend :class="labelClass + ' mb-2'">
                      Complementos de la casa
                    </legend>
                    <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      <label
                        v-for="row in complementoFilas"
                        :key="row.key"
                        class="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-300"
                      >
                        <input
                          v-model="complementosCasa[row.key]"
                          type="checkbox"
                          class="checkbox-glass"
                        />
                        {{ row.label }}
                      </label>
                    </div>
                    <div class="pt-2">
                      <label :class="labelClass" for="pub-comp-extra"
                        >Otros complementos (opcional)</label
                      >
                      <input
                        id="pub-comp-extra"
                        v-model="complementosTexto"
                        type="text"
                        :class="inputClass"
                        placeholder="Ej. Persianas, domótica…"
                      />
                    </div>
                  </fieldset>
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
                        :class="fileInputClass"
                        @change="onPrincipalFile"
                      />
                    </div>
                    <PreviewPortadaArchivo
                      :url="previewPrincipalUrl || (modoEdicion ? imagen : null)"
                    />
                    <p
                      v-if="modoEdicion"
                      class="mt-1 text-[10px] text-slate-500"
                    >
                      Si no eliges otro archivo, se conserva la foto principal actual. Las fotos nuevas de galería se agregan.
                    </p>
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
                      :class="fileInputClass"
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
                        :class="fileInputClass"
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
                  <div v-if="!esTerreno">
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
        <template v-if="tabActiva === tabs.length - 1">
          <button
            type="submit"
            :disabled="enviando"
            class="mt-4 w-full rounded-lg bg-gradient-to-r from-royal-600 to-royal-800 py-3 text-sm font-semibold tracking-wide text-white shadow-royal ring-1 ring-white/10 transition hover:brightness-110 disabled:opacity-50"
          >
            {{
              enviando
                ? (modoEdicion ? 'Guardando…' : 'Publicando…')
                : (modoEdicion ? 'Guardar cambios' : 'Publicar en el catálogo')
            }}
          </button>
          <div class="mt-3 text-center">
            <NuxtLink
              to="/inmuebles"
              class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
            >
              <svg
                class="h-4 w-4 text-slate-500"
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
              Ver inmuebles
            </NuxtLink>
          </div>
        </template>
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
