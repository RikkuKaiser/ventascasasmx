<script setup lang="ts">
import type { Inmueble, TipoVivienda } from '~/types'
import { TIPO_VIVIENDA_LABELS } from '~/types'
import { useInmueblesStore } from '~/stores/inmuebles'

const props = defineProps<{ inmueble: Inmueble }>()
const store = useInmueblesStore()

/** Evita undefined/NaN si el objeto viene sin campos nuevos (caché, API vieja, etc.) */
function toFiniteNumber(v: unknown, fallback = 0): number {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : fallback
}

const ficha = computed(() => {
  const r = props.inmueble as Inmueble & { m2?: number }
  const sup = toFiniteNumber(r.m2Superficie ?? r.m2, 0)
  const cons = toFiniteNumber(
    r.m2Construccion ?? r.m2 ?? r.m2Superficie,
    0,
  )
  return {
    ...r,
    m2Superficie: sup,
    m2Construccion: cons,
    estacionamientos: toFiniteNumber(r.estacionamientos, 0),
    cuotaMantenimiento: toFiniteNumber(r.cuotaMantenimiento, 0),
    amenidades: Array.isArray(r.amenidades) ? r.amenidades : [],
    pisosVivienda:
      r.pisosVivienda != null ? toFiniteNumber(r.pisosVivienda, 0) : undefined,
    pisoDepartamento:
      r.pisoDepartamento != null
        ? toFiniteNumber(r.pisoDepartamento, 0)
        : undefined,
    pisosEdificio:
      r.pisosEdificio != null ? toFiniteNumber(r.pisosEdificio, 0) : undefined,
  }
})

const esTerreno = computed(() => ficha.value.tipoVivienda === 'terreno')

const tc = computed(() => ficha.value.terrenoCampestre)

const pi = computed(() => ficha.value.publicacionInmueble)

const etiquetaEstadoTerreno: Record<string, string> = {
  listo_construir: 'Listo para construir',
  obra_negra: 'Obra negra',
  venta_como_terreno: 'Venta como terreno',
}

const etiquetaForma: Record<string, string> = {
  regular: 'Regular',
  irregular: 'Irregular',
  plano: 'Plano',
}

const direccionExtendida = computed(() => {
  const d = tc.value
  if (!d) return null
  const partes = [
    d.calleNumero,
    d.loteCalle ? `Lote ${d.loteCalle}` : '',
    d.colonia,
    d.ciudadMunicipio,
    d.estado,
    d.cp,
    d.pais,
  ]
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean)
  return partes.length ? partes.join(', ') : null
})

const mapsPinUrl = computed(() => {
  const d = tc.value
  if (
    d?.lat != null
    && d?.lng != null
    && Number.isFinite(d.lat)
    && Number.isFinite(d.lng)
  )
    return `https://www.google.com/maps?q=${d.lat},${d.lng}`
  const p = pi.value
  if (
    p?.lat != null
    && p?.lng != null
    && Number.isFinite(p.lat)
    && Number.isFinite(p.lng)
  )
    return `https://www.google.com/maps?q=${p.lat},${p.lng}`
  return null
})

const direccionPublicacion = computed(() => {
  const p = pi.value
  if (!p) return null
  const partes = [
    p.calleNumero,
    ficha.value.zona,
    ficha.value.ciudad,
    p.estado,
    p.cp ? `C.P. ${p.cp}` : '',
    p.pais,
  ]
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean)
  return partes.length ? partes.join(', ') : null
})

const subtituloTerrenoLabels: Record<string, string> = {
  terreno_comercial: 'Terreno comercial',
  terreno_campestre: 'Terreno campestre',
  terreno_playa: 'Terreno de playa',
  terreno_industrial: 'Terreno industrial',
  terreno_residencial: 'Terreno residencial',
}

const tituloBloqueTerreno = computed(() => {
  const s = tc.value?.subtipo
  if (s && subtituloTerrenoLabels[s]) return subtituloTerrenoLabels[s]
  return 'Terreno'
})

const esDepartamento = computed(
  () => ficha.value.tipoVivienda === 'departamento',
)

const etiquetaTipo = computed(() => {
  const t = ficha.value.tipoVivienda as TipoVivienda | undefined
  if (t && t in TIPO_VIVIENDA_LABELS)
    return TIPO_VIVIENDA_LABELS[t]
  return 'No especificado'
})

const textoEstacionamiento = computed(() => {
  const n = ficha.value.estacionamientos
  if (n <= 0)
    return 'Sin espacios'
  return `${n} ${n === 1 ? 'lugar' : 'lugares'}`
})

const textoNivelesVivienda = computed(() => {
  if (esTerreno.value)
    return null
  const n = ficha.value.pisosVivienda
  if (n != null && n > 0)
    return `${n} ${n === 1 ? 'nivel' : 'niveles'}`
  return '—'
})

function fila(claseExtra = '') {
  return `flex justify-between gap-4 border-b border-white/5 py-2.5 last:border-b-0 ${claseExtra}`
}
</script>

<template>
  <div class="rounded-2xl glass p-6">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-royal-300">
      Ficha técnica
    </h3>

    <div
      class="mt-4 rounded-xl border border-royal-500/20 bg-royal-950/30 px-3 py-2 text-center"
    >
      <p class="text-[10px] font-medium uppercase tracking-widest text-slate-500">
        Tipo de vivienda
      </p>
      <p class="mt-0.5 font-display text-lg font-semibold text-white">
        {{ etiquetaTipo }}
      </p>
    </div>

    <dl class="mt-4 text-sm">
      <div :class="fila()">
        <dt class="max-w-[55%] shrink-0 text-slate-500">
          <span class="block">Superficie</span>
          <span class="mt-0.5 block text-[10px] font-normal normal-case tracking-normal text-slate-600">
            Terreno, lote o predio
          </span>
        </dt>
        <dd class="text-right font-medium text-white">
          {{ ficha.m2Superficie }} m²
        </dd>
      </div>
      <div :class="fila()">
        <dt class="max-w-[55%] shrink-0 text-slate-500">
          <span class="block">Construcción</span>
          <span class="mt-0.5 block text-[10px] font-normal normal-case tracking-normal text-slate-600">
            Metros construidos
          </span>
        </dt>
        <dd class="text-right font-medium text-white">
          <template v-if="esTerreno || ficha.m2Construccion <= 0">
            Sin construcción
          </template>
          <template v-else>
            {{ ficha.m2Construccion }} m²
          </template>
        </dd>
      </div>

      <template v-if="!esTerreno">
        <div :class="fila()">
          <dt class="shrink-0 text-slate-500">Recámaras</dt>
          <dd class="text-right font-medium text-white">
            {{ ficha.habitaciones }}
          </dd>
        </div>
        <div :class="fila()">
          <dt class="shrink-0 text-slate-500">Baños</dt>
          <dd class="text-right font-medium text-white">
            {{ ficha.banos }}
          </dd>
        </div>
        <div :class="fila()">
          <dt class="shrink-0 text-slate-500">Estacionamiento</dt>
          <dd class="text-right font-medium text-white">
            {{ textoEstacionamiento }}
          </dd>
        </div>
      </template>

      <div v-else :class="fila()">
        <dt class="shrink-0 text-slate-500">Construcción</dt>
        <dd class="text-right font-medium text-slate-400">
          Terreno sin construcción
        </dd>
      </div>

      <template v-if="tc">
        <div
          class="mt-4 rounded-xl border border-royal-500/20 bg-royal-950/25 px-3 py-2"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-widest text-royal-300/90"
          >
            {{ tituloBloqueTerreno }}
          </p>
          <p
            v-if="tc.estadoTerreno"
            class="mt-1 text-xs text-slate-400"
          >
            {{
              etiquetaEstadoTerreno[tc.estadoTerreno] ?? tc.estadoTerreno
            }}
          </p>
        </div>
        <div v-if="direccionExtendida" :class="fila()">
          <dt class="max-w-[55%] shrink-0 text-slate-500">Ubicación detallada</dt>
          <dd class="text-right text-sm font-medium text-white">
            {{ direccionExtendida }}
          </dd>
        </div>
        <div
          v-if="tc.manzana || tc.lotePredial"
          :class="fila()"
        >
          <dt class="shrink-0 text-slate-500">Manzana / lote</dt>
          <dd class="text-right font-medium text-white">
            <template v-if="tc.manzana">Mz. {{ tc.manzana }}</template>
            <template v-if="tc.manzana && tc.lotePredial"> · </template>
            <template v-if="tc.lotePredial">Lt. {{ tc.lotePredial }}</template>
          </dd>
        </div>
        <div
          v-if="tc.metrosFrente != null || tc.metrosFondo != null"
          :class="fila()"
        >
          <dt class="shrink-0 text-slate-500">Frente / fondo</dt>
          <dd class="text-right font-medium text-white">
            <template v-if="tc.metrosFrente != null"
              >{{ tc.metrosFrente }} m frente</template
            >
            <template
              v-if="tc.metrosFrente != null && tc.metrosFondo != null"
              > · </template
            >
            <template v-if="tc.metrosFondo != null"
              >{{ tc.metrosFondo }} m fondo</template
            >
          </dd>
        </div>
        <div v-if="tc.formaTerreno" :class="fila()">
          <dt class="shrink-0 text-slate-500">Forma</dt>
          <dd class="text-right font-medium text-white">
            {{ etiquetaForma[tc.formaTerreno] ?? tc.formaTerreno }}
          </dd>
        </div>
        <div v-if="tc.tipoRiego" :class="fila()">
          <dt class="shrink-0 text-slate-500">Riego</dt>
          <dd class="text-right font-medium text-white">
            {{ tc.tipoRiego }}
          </dd>
        </div>
        <div v-if="tc.usoSuelo" :class="fila()">
          <dt class="shrink-0 text-slate-500">Uso de suelo</dt>
          <dd class="text-right font-medium text-white">
            {{ tc.usoSuelo }}
          </dd>
        </div>
        <div
          v-if="mapsPinUrl"
          class="mt-2 border-t border-white/5 pt-3"
        >
          <a
            :href="mapsPinUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-medium text-royal-300 underline-offset-2 hover:underline"
            >Ver en Google Maps</a
          >
        </div>
        <div
          v-if="tc.notas"
          class="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
          >
            Notas
          </p>
          <p class="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-slate-300">
            {{ tc.notas }}
          </p>
        </div>
        <div
          v-if="tc.videoUrl || tc.planosUrl || (tc.videos && tc.videos.length)"
          class="mt-2 flex flex-wrap gap-3 text-xs"
        >
          <a
            v-if="tc.videoUrl"
            :href="tc.videoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-royal-300 underline-offset-2 hover:underline"
            >Video</a
          >
          <a
            v-for="(u, i) in tc.videos || []"
            :key="`tc-v-${i}`"
            :href="u"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-royal-300 underline-offset-2 hover:underline"
            >Video archivo {{ i + 1 }}</a
          >
          <a
            v-if="tc.planosUrl"
            :href="tc.planosUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-royal-300 underline-offset-2 hover:underline"
            >Planos</a
          >
        </div>
      </template>

      <template v-if="pi && !esTerreno">
        <div
          v-if="direccionPublicacion"
          :class="fila()"
        >
          <dt class="max-w-[55%] shrink-0 text-slate-500">Dirección completa</dt>
          <dd class="text-right text-sm font-medium text-white">
            {{ direccionPublicacion }}
          </dd>
        </div>
        <div
          v-if="mapsPinUrl && pi"
          class="mt-2 border-t border-white/5 pt-3"
        >
          <a
            :href="mapsPinUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-medium text-royal-300 underline-offset-2 hover:underline"
            >Ver en Google Maps</a
          >
        </div>
        <div
          v-if="pi.notas"
          class="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
          >
            Notas
          </p>
          <p class="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-slate-300">
            {{ pi.notas }}
          </p>
        </div>
        <div
          v-if="pi.videoUrl || pi.planosUrl || (pi.videos && pi.videos.length)"
          class="mt-2 flex flex-wrap gap-3 border-t border-white/5 pt-3 text-xs"
        >
          <a
            v-if="pi.videoUrl"
            :href="pi.videoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-royal-300 underline-offset-2 hover:underline"
            >Video</a
          >
          <a
            v-for="(u, i) in pi.videos || []"
            :key="`pi-v-${i}`"
            :href="u"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-royal-300 underline-offset-2 hover:underline"
            >Video archivo {{ i + 1 }}</a
          >
          <a
            v-if="pi.planosUrl"
            :href="pi.planosUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-royal-300 underline-offset-2 hover:underline"
            >Planos</a
          >
        </div>
      </template>

      <div v-if="!esTerreno && textoNivelesVivienda" :class="fila()">
        <dt class="shrink-0 text-slate-500">Niveles de la vivienda</dt>
        <dd class="text-right font-medium text-white">
          {{ textoNivelesVivienda }}
        </dd>
      </div>

      <template v-if="esDepartamento">
        <div :class="fila()">
          <dt class="shrink-0 text-slate-500">Piso del departamento</dt>
          <dd class="text-right font-medium text-white">
            {{
              ficha.pisoDepartamento != null
                ? ficha.pisoDepartamento
                : '—'
            }}
          </dd>
        </div>
        <div :class="fila()">
          <dt class="shrink-0 text-slate-500">Niveles del edificio</dt>
          <dd class="text-right font-medium text-white">
            {{
              ficha.pisosEdificio != null && ficha.pisosEdificio > 0
                ? ficha.pisosEdificio
                : '—'
            }}
          </dd>
        </div>
      </template>

      <div :class="fila()">
        <dt class="max-w-[55%] shrink-0 text-slate-500">
          <span class="block">Cuota de mantenimiento</span>
          <span class="mt-0.5 block text-[10px] font-normal normal-case tracking-normal text-slate-600">
            Costo de beneficio (mensual)
          </span>
        </dt>
        <dd class="text-right font-medium text-white">
          {{ store.formatearCuotaMantenimiento(ficha) }}
        </dd>
      </div>

      <div :class="fila()">
        <dt class="shrink-0 text-slate-500">Moneda</dt>
        <dd class="text-right font-medium text-white">
          {{ ficha.moneda }}
        </dd>
      </div>
    </dl>

    <div class="mt-6 border-t border-white/10 pt-5">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-royal-300">
        Amenidades
      </h4>
      <ul
        v-if="ficha.amenidades.length"
        class="mt-3 flex flex-wrap gap-2"
      >
        <li
          v-for="a in ficha.amenidades"
          :key="a"
          class="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/10"
        >
          {{ a }}
        </li>
      </ul>
      <p
        v-else
        class="mt-3 text-xs italic text-slate-500"
      >
        Sin amenidades registradas.
      </p>
    </div>
  </div>
</template>
