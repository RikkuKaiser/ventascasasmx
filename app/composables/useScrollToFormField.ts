import { nextTick, type Ref } from 'vue'

/**
 * Cambia de pestaña (si aplica), hace scroll al control y le pasa el foco.
 */
export async function scrollToFormField(
  fieldId: string,
  tabActiva: Ref<number>,
  tabIndex: number,
  campoErrorId?: Ref<string | null>,
): Promise<void> {
  if (campoErrorId) campoErrorId.value = fieldId
  tabActiva.value = tabIndex
  await nextTick()
  await nextTick()
  requestAnimationFrame(() => {
    const el = document.getElementById(fieldId)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if ('focus' in el && typeof (el as HTMLElement).focus === 'function') {
      ;(el as HTMLElement).focus({ preventScroll: true })
    }
  })
}

/** Pestañas del formulario /publicar (0–3). */
export const PUBLICAR_TAB_BY_FIELD: Record<string, number> = {
  'pub-titulo': 0,
  'pub-desc': 0,
  'pub-notas': 0,
  'pub-precio': 0,
  'pub-moneda': 0,
  'pub-operacion': 0,
  'pub-tipo': 0,
  'pub-subtipo': 0,
  'pub-calle': 1,
  'pub-cp': 1,
  'pub-edo': 1,
  'pub-ciudad': 1,
  'pub-zona': 1,
  'pub-pais': 1,
  'pub-lat': 1,
  'pub-lng': 1,
  'pub-m2s': 2,
  'pub-m2c': 2,
  'pub-hab': 2,
  'pub-ban': 2,
  'pub-est': 2,
  'pub-cuota': 2,
  'pub-piso': 2,
  'pub-pisos-e': 2,
  'pub-pisos-v': 2,
  'pub-un-sup': 2,
  'pub-sup-terreno': 2,
  'pub-fondo': 2,
  'pub-frente': 2,
  'pub-riego': 2,
  'pub-uso': 2,
  'pub-manz': 2,
  'pub-lotep': 2,
  'pub-file-principal': 3,
  'pub-file-gal': 3,
  'pub-img': 3,
  'pub-gal': 3,
  'pub-vid': 3,
  'pub-plan': 3,
  'pub-vid-files': 3,
  'pub-eti': 3,
  'pub-amen': 3,
}

/** Pestañas del formulario /publicar-terrenos (0–3). */
export const TERRENO_TAB_BY_FIELD: Record<string, number> = {
  'tc-subtitulo': 0,
  'tc-calle': 0,
  'tc-lote': 0,
  'tc-cp': 0,
  'tc-edo': 0,
  'tc-mun': 0,
  'tc-col': 0,
  'tc-pais': 0,
  'tc-lat': 0,
  'tc-lng': 0,
  'tc-m2c': 1,
  'tc-un': 1,
  'tc-sup': 1,
  'tc-pre': 1,
  'tc-mon': 1,
  'tc-cuota': 1,
  'tc-tit': 1,
  'tc-desc': 1,
  'tc-notas': 1,
  'tc-fondo': 2,
  'tc-frente': 2,
  'tc-riego': 2,
  'tc-uso': 2,
  'tc-manz': 2,
  'tc-lotep': 2,
  'tc-eti': 2,
  'tc-fp': 3,
  'tc-fg': 3,
  'tc-img': 3,
  'tc-galtxt': 3,
  'tc-vid': 3,
  'tc-vid-files': 3,
  'tc-plan': 3,
}

export async function scrollToPublicarField(
  fieldId: string,
  tabActiva: Ref<number>,
  campoErrorId?: Ref<string | null>,
): Promise<void> {
  const tab = PUBLICAR_TAB_BY_FIELD[fieldId] ?? 0
  await scrollToFormField(fieldId, tabActiva, tab, campoErrorId)
}

export async function scrollToTerrenoField(
  fieldId: string,
  tabActiva: Ref<number>,
  campoErrorId?: Ref<string | null>,
): Promise<void> {
  const tab = TERRENO_TAB_BY_FIELD[fieldId] ?? 0
  await scrollToFormField(fieldId, tabActiva, tab, campoErrorId)
}
