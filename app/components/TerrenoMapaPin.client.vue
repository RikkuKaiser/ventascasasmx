<script setup lang="ts">
/**
 * Mapa siempre visible: Leaflet + OpenStreetMap/Carto (sin API key).
 * Clic o arrastre del pin actualiza lat/lng; si ya vienen coordenadas, el pin arranca ahí.
 */
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  lat?: number | null
  lng?: number | null
}>()

const emit = defineEmits<{
  'update:lat': [v: number | undefined]
  'update:lng': [v: number | undefined]
}>()

const rootEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

const DEFAULT_LAT = 22.7709
const DEFAULT_LNG = -102.5833

function hasCoords(
  lat: number | null | undefined,
  lng: number | null | undefined,
): boolean {
  return (
    typeof lat === 'number'
    && typeof lng === 'number'
    && Number.isFinite(lat)
    && Number.isFinite(lng)
  )
}

function startLatLng(): L.LatLng {
  if (hasCoords(props.lat, props.lng)) return L.latLng(props.lat, props.lng!)
  return L.latLng(DEFAULT_LAT, DEFAULT_LNG)
}

function emitFromLatLng(ll: L.LatLng) {
  emit('update:lat', ll.lat)
  emit('update:lng', ll.lng)
}

function pinIcon() {
  return L.divIcon({
    className: 'terreno-leaflet-pin-wrap',
    html: '<div class="terreno-leaflet-pin-dot" aria-hidden="true"></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -26],
  })
}

function scheduleInvalidateSize() {
  nextTick(() => {
    requestAnimationFrame(() => {
      map?.invalidateSize()
    })
    window.setTimeout(() => map?.invalidateSize(), 200)
  })
}

onMounted(() => {
  if (!rootEl.value) return

  const start = startLatLng()
  map = L.map(rootEl.value, {
    center: start,
    zoom: hasCoords(props.lat, props.lng) ? 16 : 6,
    scrollWheelZoom: true,
  })

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    },
  ).addTo(map)

  marker = L.marker(start, { draggable: true, icon: pinIcon() }).addTo(map)

  if (hasCoords(props.lat, props.lng)) emitFromLatLng(start)

  marker.on('dragend', () => {
    if (!marker) return
    emitFromLatLng(marker.getLatLng())
  })

  map.on('click', (e: L.LeafletMouseEvent) => {
    if (!marker) return
    marker.setLatLng(e.latlng)
    emitFromLatLng(e.latlng)
  })

  scheduleInvalidateSize()
})

watch(
  () => [props.lat, props.lng] as const,
  ([lat, lng]) => {
    if (!marker || !map) return
    if (!hasCoords(lat, lng)) return
    const cur = marker.getLatLng()
    if (
      Math.abs(cur.lat - lat) < 1e-7
      && Math.abs(cur.lng - lng) < 1e-7
    )
      return
    const next = L.latLng(lat, lng)
    marker.setLatLng(next)
    map.setView(next, Math.max(map.getZoom(), 14), { animate: true })
  },
)

onUnmounted(() => {
  map?.remove()
  map = null
  marker = null
})
</script>

<template>
  <div class="space-y-2">
    <p class="text-[10px] text-slate-500">
      Mapa interactivo: haz clic para colocar el pin o arrástralo para afinar la
      ubicación. Los datos salen de
      <a
        class="text-royal-400/90 underline-offset-2 hover:underline"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        >OpenStreetMap</a
      >.
    </p>
    <div
      ref="rootEl"
      class="terreno-leaflet-root h-56 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-night-950/50 sm:h-80"
      role="application"
      aria-label="Mapa para ubicar el terreno"
    />
  </div>
</template>

<style scoped>
.terreno-leaflet-root :deep(.leaflet-container) {
  z-index: 1;
  height: 100%;
  width: 100%;
  background: #0d1424;
  font-family: inherit;
}

.terreno-leaflet-root :deep(.leaflet-control-attribution) {
  max-width: 100%;
  box-sizing: border-box;
  font-size: 9px;
  line-height: 1.3;
  background: rgba(13, 20, 36, 0.88);
  color: #94a3b8;
  border-radius: 6px 0 0 0;
}

.terreno-leaflet-root :deep(.leaflet-control-attribution a) {
  color: #a5b4fc;
}

:deep(.terreno-leaflet-pin-wrap) {
  background: transparent !important;
  border: none !important;
}

:deep(.terreno-leaflet-pin-dot) {
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  margin: 0 auto;
  background: linear-gradient(145deg, #6d8eeb, #3d5cb8);
  border: 2px solid rgba(255, 255, 255, 0.95);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(99, 102, 241, 0.35);
}
</style>
