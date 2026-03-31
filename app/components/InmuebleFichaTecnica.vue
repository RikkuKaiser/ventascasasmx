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
