export type OperacionInmueble = 'venta' | 'renta'

export type TipoVivienda =
  | 'casa'
  | 'casa_residencial'
  | 'departamento'
  | 'duplex'
  | 'terreno'
  | 'loft'

export const TIPO_VIVIENDA_LABELS: Record<TipoVivienda, string> = {
  casa: 'Casa',
  casa_residencial: 'Casa residencial',
  departamento: 'Departamento',
  duplex: 'Dúplex',
  terreno: 'Terreno',
  loft: 'Loft',
}

/** Servicios / infra en terreno campestre (JSON `terrenoCampestre.servicios`). */
export interface TerrenoServiciosDetalle {
  aguaPotable?: boolean
  drenaje?: boolean
  empedrado?: boolean
  luz?: boolean
  pavimentado?: boolean
  rural?: boolean
  planFinanciamiento?: boolean
}

/** Datos extendidos guardados en `terreno_campestre` (columna JSON en API). */
export interface TerrenoCampestreDetalle {
  operacion?: OperacionInmueble | 'proyecto'
  /** Código del select "Subtítulo de inmueble" en /publicar-terrenos */
  subtipo?:
    | 'terreno_comercial'
    | 'terreno_campestre'
    | 'terreno_playa'
    | 'terreno_industrial'
    | 'terreno_residencial'
    | string
  calleNumero?: string
  loteCalle?: string
  estado?: string
  ciudadMunicipio?: string
  colonia?: string
  cp?: string
  pais?: string
  lat?: number
  lng?: number
  unidadSuperficie?: 'm2' | 'ha' | 'na'
  manzana?: string
  lotePredial?: string
  estadoTerreno?: 'listo_construir' | 'obra_negra' | 'venta_como_terreno'
  notas?: string
  videoUrl?: string
  /** URLs de archivos de video subidos a GCS (`{id}/videos/`) */
  videos?: string[]
  planosUrl?: string
  metrosFondo?: number
  metrosFrente?: number
  tipoRiego?: string
  usoSuelo?: string
  formaTerreno?: 'regular' | 'irregular' | 'plano'
  casetaGuardia?: boolean
  seguridadPrivada?: boolean
  aptoCredito?: boolean
  servicios?: TerrenoServiciosDetalle
}

/** Fila de `inmueble_archivos` (API). */
export interface InmuebleArchivoItem {
  id: number
  tipo: 'principal' | 'galeria' | 'video'
  url: string
  objectPath: string | null
  sortOrder: number
}

export interface Inmueble {
  id: number
  titulo: string
  descripcion: string
  precio: number
  moneda: string
  ciudad: string
  zona: string
  /** Metros de superficie (terreno, lote o superficie total del predio) */
  m2Superficie: number
  /** Metros de construcción; 0 en terreno sin obra o sin registro */
  m2Construccion: number
  habitaciones: number
  banos: number
  destacado: boolean
  etiquetas: string[]
  /** Imagen principal (listados, tarjetas) */
  imagen: string
  /** Fotos adicionales para la ficha; si falta, en detalle solo se usa `imagen` */
  galeria?: string[]

  tipoVivienda: TipoVivienda
  /** Cajones / lugares de estacionamiento */
  estacionamientos: number
  /** Niveles que ocupa la vivienda (casa, dúplex, loft, etc.) */
  pisosVivienda?: number
  /** Piso en el que se ubica el departamento */
  pisoDepartamento?: number
  /** Total de niveles del edificio (departamentos) */
  pisosEdificio?: number
  /** Lista de amenidades o características destacadas */
  amenidades: string[]
  /** Cuota de mantenimiento mensual en la moneda del inmueble; 0 si no aplica */
  cuotaMantenimiento: number
  /** venta | renta — columna API; null histórico → venta */
  operacion?: OperacionInmueble
  /** Presente si se publicó con el formulario de terreno campestre (u otro terreno extendido). */
  terrenoCampestre?: TerrenoCampestreDetalle
  /** Dirección ampliada / mapa / video (formulario publicar inmueble). */
  publicacionInmueble?: PublicacionInmuebleDetalle
  /** Metadatos de archivos (BD); en `GET /inmuebles/:id` si el API los incluye. */
  archivos?: InmuebleArchivoItem[]
}

/** JSON `publicacion_inmueble` en API. */
export type EstadoVivienda = 'nueva' | 'usada' | 'remodelada'

export interface PublicacionInmuebleDetalle {
  operacion?: OperacionInmueble
  calleNumero?: string
  estado?: string
  cp?: string
  pais?: string
  lat?: number
  lng?: number
  videoUrl?: string
  /** URLs de archivos de video subidos a GCS (`{id}/videos/`) */
  videos?: string[]
  planosUrl?: string
  notas?: string
  /** Fraccionamiento, condominio o desarrollo (casas). */
  condominio?: string
  /** Medios baños (0.5, 1, 1.5…). */
  mediosBanos?: number
  /** integral | semi_integral | basica | americana | abierta | exterior | no_aplica */
  tipoCocina?: string
  /** Complementos: closets, cocina equipada, aire acondicionado, etc. */
  complementos?: string[]
  /** nueva | usada | remodelada */
  estadoVivienda?: EstadoVivienda
}

export const ESTADO_VIVIENDA_LABELS: Record<EstadoVivienda, string> = {
  nueva: 'Nueva',
  usada: 'Usada',
  remodelada: 'Remodelada',
}

export const TIPO_COCINA_LABELS: Record<string, string> = {
  integral: 'Integral',
  semi_integral: 'Semi integral',
  basica: 'Básica',
  americana: 'Americana',
  abierta: 'Abierta / concepto abierto',
  exterior: 'Exterior / patio de servicio',
  no_aplica: 'No aplica',
}

/** Venta o renta según columna API, JSON extendido o etiquetas del anuncio. */
export function operacionInmueble(i: Inmueble): OperacionInmueble {
  if (i.operacion === 'renta') return 'renta'
  if (i.operacion === 'venta') return 'venta'
  const op = i.terrenoCampestre?.operacion ?? i.publicacionInmueble?.operacion
  if (op === 'renta') return 'renta'
  if (op === 'venta') return 'venta'
  const tags = i.etiquetas.map((t) => t.trim().toLowerCase())
  if (tags.includes('renta')) return 'renta'
  if (tags.includes('venta')) return 'venta'
  return 'venta'
}

export interface Comentario {
  id: string
  inmuebleId: number
  userId: string
  nombreUsuario: string
  texto: string
  creadoEn: string
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  passwordHash: string
}

/** Solicitud de colaboración como asesor externo (formulario /asesores) */
export interface SolicitudAsesor {
  id: string
  nombreCompleto: string
  email: string
  telefono: string
  ciudad: string
  perfil: 'independiente' | 'inmobiliaria'
  nombreInmobiliaria: string
  experiencia: string
  mensaje: string
  creadoEn: string
}
