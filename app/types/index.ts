export interface Inmueble {
  id: string
  titulo: string
  descripcion: string
  precio: number
  moneda: string
  ciudad: string
  zona: string
  m2: number
  habitaciones: number
  banos: number
  destacado: boolean
  etiquetas: string[]
  /** Imagen principal (listados, tarjetas) */
  imagen: string
  /** Fotos adicionales para la ficha; si falta, en detalle solo se usa `imagen` */
  galeria?: string[]
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
