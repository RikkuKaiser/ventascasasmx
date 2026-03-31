import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Inmueble } from '~/types'

const demo: Inmueble[] = [
  {
    id: '1',
    titulo: 'Penthouse con vista panorámica',
    descripcion:
      'Terraza privada, acabados de lujo y domótica. Ubicación premium con luz natural todo el día.',
    precio: 12800000,
    moneda: 'MXN',
    ciudad: 'Ciudad de México',
    zona: 'Polanco',
    m2: 280,
    habitaciones: 3,
    banos: 3,
    destacado: true,
    etiquetas: ['Nuevo', 'Amueblado', 'Estacionamiento'],
    imagen:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80',
    ],
  },
  {
    id: '2',
    titulo: 'Residencia minimalista en bosque',
    descripcion:
      'Arquitectura contemporánea, amplios ventanales y jardín integrado. Ideal para quien busca calma.',
    precio: 8950000,
    moneda: 'MXN',
    ciudad: 'Monterrey',
    zona: 'Valle',
    m2: 320,
    habitaciones: 4,
    banos: 4,
    destacado: true,
    etiquetas: ['Jardín', 'Alberca'],
    imagen:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
      'https://images.unsplash.com/photo-1600585152915-c8a5b68f51b0?w=1600&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1600&q=80',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1600&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80',
    ],
  },
  {
    id: '3',
    titulo: 'Loft industrial reformado',
    descripcion:
      'Techos altos, acero y madera recuperada. Espacio diáfano perfecto para estudio o vivienda.',
    precio: 4250000,
    moneda: 'MXN',
    ciudad: 'Guadalajara',
    zona: 'Lafayette',
    m2: 95,
    habitaciones: 1,
    banos: 2,
    destacado: false,
    etiquetas: ['Loft', 'Pet friendly'],
    imagen:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',
    ],
  },
  {
    id: '4',
    titulo: 'Casa mediterránea frente al mar',
    descripcion:
      'Acceso a playa, alberca infinita y muelle privado. Experiencia resort en tu hogar.',
    precio: 24500000,
    moneda: 'MXN',
    ciudad: 'Los Cabos',
    zona: 'Costa',
    m2: 410,
    habitaciones: 5,
    banos: 5,
    destacado: true,
    etiquetas: ['Frente al mar', 'Lujo'],
    imagen:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80',
      'https://images.unsplash.com/photo-1613977256644-880a9c0d0b9f?w=1600&q=80',
      'https://images.unsplash.com/photo-1602343164077-7e9717d1aacc?w=1600&q=80',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80',
    ],
  },
  {
    id: '5',
    titulo: 'Departamento boutique en centro histórico',
    descripcion:
      'Fachada restaurada, interior contemporáneo. A pasos de cultura y gastronomía.',
    precio: 5100000,
    moneda: 'MXN',
    ciudad: 'Querétaro',
    zona: 'Centro',
    m2: 110,
    habitaciones: 2,
    banos: 2,
    destacado: false,
    etiquetas: ['Centro', 'Inversión'],
    imagen:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1600&q=80',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1600&q=80',
      'https://images.unsplash.com/photo-1556020685-ae41ab2f55b2?w=1600&q=80',
    ],
  },
  {
    id: '6',
    titulo: 'Villa con viñedo',
    descripcion:
      'Parcela amplia, bodega de vinos y vistas al valle. Para una vida sin prisas.',
    precio: 18700000,
    moneda: 'MXN',
    ciudad: 'Ensenada',
    zona: 'Valle de Guadalupe',
    m2: 520,
    habitaciones: 4,
    banos: 4,
    destacado: false,
    etiquetas: ['Campo', 'Viñedo'],
    imagen:
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=80',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=80',
    ],
  },
  {
    id: '7',
    titulo: 'Torre residencial con amenidades de hotel y vista urbana',
    descripcion:
      'Ubicación estratégica a minutos de corporativos y zona gastronómica. El desarrollo incluye lobby con doble altura, gimnasio equipado, spa seco, alberca infinity en azotea, coworking privado y estacionamiento techado con acceso controlado. El interior combina pisos de mármol en áreas sociales, carpintería oculta en closets, iluminación escénica LED y preparación para domótica. Ideal para quien busca invertir en renta premium o habitar con servicios tipo concierge sin renunciar a la privacidad de un hogar propio.',
    precio: 9200000,
    moneda: 'MXN',
    ciudad: 'Ciudad de México',
    zona: 'Santa Fe',
    m2: 145,
    habitaciones: 2,
    banos: 2,
    destacado: false,
    etiquetas: ['Amenidades', 'Inversión', 'Nuevo'],
    imagen:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80',
    ],
  },
]

export const useInmueblesStore = defineStore('inmuebles', () => {
  const lista = ref<Inmueble[]>([...demo])

  const destacados = computed(() => lista.value.filter((i) => i.destacado))

  function porId(id: string) {
    return lista.value.find((i) => i.id === id)
  }

  function formatearPrecio(i: Inmueble) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: i.moneda,
      maximumFractionDigits: 0,
    }).format(i.precio)
  }

  return { lista, destacados, porId, formatearPrecio }
})
