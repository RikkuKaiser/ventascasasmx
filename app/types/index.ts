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

export interface Inmueble {
  id: string
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
}

export interface Comentario {
  id: string
  inmuebleId: string
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
