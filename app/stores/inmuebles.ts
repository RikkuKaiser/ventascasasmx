import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Inmueble } from '~/types'
import { useAuthStore } from '~/stores/auth'

/** Texto útil para el usuario cuando falla publicar o editar un inmueble. */
function mensajeErrorInmuebleApi(
  e: unknown,
  accion: 'publicar' | 'guardar',
): string {
  const gen = accion === 'guardar'
    ? 'No se pudieron guardar los cambios. Revisa los datos o tu conexión.'
    : 'No se pudo publicar. Revisa los datos o tu conexión.'
  if (!e || typeof e !== 'object')
    return gen
  const x = e as {
    statusCode?: number
    status?: number
    data?: unknown
    message?: string
  }
  const code = x.statusCode ?? x.status
  const d = x.data
  if (typeof d === 'string' && d.trim())
    return d.length > 500 ? `${d.slice(0, 500)}…` : d
  if (d && typeof d === 'object') {
    const o = d as { message?: unknown; error?: string }
    if (Array.isArray(o.message))
      return o.message.map(String).join('. ')
    if (typeof o.message === 'string' && o.message.trim())
      return o.message
    if (typeof o.error === 'string' && o.error.trim())
      return o.error
  }
  if (code === 401 || code === 403)
    return 'Sesión inválida o sin permiso. Vuelve a iniciar sesión.'
  if (code === 413)
    return 'Uno de los archivos es demasiado grande para el servidor.'
  if (code === 400 && typeof x.message === 'string' && x.message !== 'Bad Request')
    return x.message
  if (typeof code === 'number')
    return `${gen} (HTTP ${code})`
  return gen
}

export const useInmueblesStore = defineStore('inmuebles', () => {
  const lista = ref<Inmueble[]>([])

  const destacados = computed(() => lista.value.filter((i) => i.destacado))

  async function sincronizarDesdeApi() {
    const base = useApiBase()
    if (!base) return
    try {
      const data = await $fetch<Inmueble[]>(`${base}/inmuebles`)
      lista.value = data
    } catch {
      lista.value = []
    }
  }

  function porId(id: string | number) {
    const s = String(id)
    return lista.value.find((i) => String(i.id) === s)
  }

  /** Sustituye el ítem en `lista` con la respuesta de `GET /inmuebles/:id` (incluye `archivos`). */
  async function refrescarInmuebleDesdeApi(id: string | number) {
    const base = useApiBase()
    if (!base) return
    const s = String(id)
    try {
      const fresh = await $fetch<Inmueble>(`${base}/inmuebles/${encodeURIComponent(s)}`)
      const idx = lista.value.findIndex((i) => String(i.id) === s)
      if (idx >= 0) lista.value[idx] = fresh
      else lista.value = [fresh, ...lista.value]
    } catch {
      /* 404 u offline: se conserva lo que ya hubiera en lista */
    }
  }

  function formatearPrecio(i: Inmueble) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: i.moneda,
      maximumFractionDigits: 0,
    }).format(i.precio)
  }

  function formatearCuotaMantenimiento(i: Inmueble) {
    const c = Number(i.cuotaMantenimiento)
    if (!Number.isFinite(c) || c <= 0)
      return 'No aplica'
    const moneda
      = i.moneda && i.moneda.length === 3 ? i.moneda : 'MXN'
    return `${new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: moneda,
      maximumFractionDigits: 0,
    }).format(c)} / mes`
  }

  /** Cuerpo sin `id`, alineado con el API y el tipo `Inmueble`. */
  async function publicarInmueble(
    cuerpo: Omit<Inmueble, 'id'>,
    archivos?: { principal?: File | null; galeria?: File[]; videos?: File[] },
  ): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
    const auth = useAuthStore()
    if (!auth.sesion)
      return { ok: false, error: 'Inicia sesión para publicar un inmueble.' }
    const base = useApiBase()
    if (base) {
      if (!auth.sesion.accessToken) {
        return {
          ok: false,
          error: 'Tu sesión no es válida para el servidor. Vuelve a entrar.',
        }
      }
      const useMultipart = !!(
        archivos?.principal
        || (archivos?.galeria && archivos.galeria.length > 0)
        || (archivos?.videos && archivos.videos.length > 0)
      )
      try {
        let created: Inmueble
        if (useMultipart) {
          const fd = new FormData()
          const payload = { ...cuerpo } as Record<string, unknown>
          if (archivos?.principal)
            delete payload.imagen
          fd.append('data', JSON.stringify(payload))
          if (archivos?.principal)
            fd.append('principal', archivos.principal)
          archivos?.galeria?.forEach((f) => fd.append('galeria', f))
          archivos?.videos?.forEach((f) => fd.append('videos', f))
          created = await $fetch<Inmueble>(`${base}/inmuebles/con-fotos`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${auth.sesion.accessToken}` },
            body: fd,
          })
        }
        else {
          created = await $fetch<Inmueble>(`${base}/inmuebles`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${auth.sesion.accessToken}` },
            body: cuerpo,
          })
        }
        await sincronizarDesdeApi()
        return { ok: true, id: String(created.id) }
      } catch (e: unknown) {
        if (import.meta.dev)
          console.error('[publicarInmueble]', e)
        auth.invalidarSesionSiApiRechaza(e)
        return { ok: false, error: mensajeErrorInmuebleApi(e, 'publicar') }
      }
    }
    const nextId
      = lista.value.reduce((m, i) => Math.max(m, Number(i.id) || 0), 0) + 1
    lista.value = [{ ...cuerpo, id: nextId }, ...lista.value]
    return { ok: true, id: String(nextId) }
  }

  async function actualizarInmueble(
    id: string | number,
    cuerpo: Omit<Inmueble, 'id'>,
    archivos?: { principal?: File | null; galeria?: File[]; videos?: File[] },
  ): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
    const auth = useAuthStore()
    if (!auth.sesion)
      return { ok: false, error: 'Inicia sesión para editar un inmueble.' }
    const sid = String(id)
    const base = useApiBase()
    if (base) {
      if (!auth.sesion.accessToken) {
        return {
          ok: false,
          error: 'Tu sesión no es válida para el servidor. Vuelve a entrar.',
        }
      }
      const useMultipart = !!(
        archivos?.principal
        || (archivos?.galeria && archivos.galeria.length > 0)
        || (archivos?.videos && archivos.videos.length > 0)
      )
      try {
        if (useMultipart) {
          const fd = new FormData()
          const payload = { ...cuerpo } as Record<string, unknown>
          if (archivos?.principal)
            delete payload.imagen
          fd.append('data', JSON.stringify(payload))
          if (archivos?.principal)
            fd.append('principal', archivos.principal)
          archivos?.galeria?.forEach((f) => fd.append('galeria', f))
          archivos?.videos?.forEach((f) => fd.append('videos', f))
          await $fetch<Inmueble>(`${base}/inmuebles/${encodeURIComponent(sid)}/con-fotos`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${auth.sesion.accessToken}` },
            body: fd,
          })
        }
        else {
          await $fetch<Inmueble>(`${base}/inmuebles/${encodeURIComponent(sid)}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${auth.sesion.accessToken}` },
            body: cuerpo,
          })
        }
        await sincronizarDesdeApi()
        await refrescarInmuebleDesdeApi(sid)
        return { ok: true, id: sid }
      } catch (e: unknown) {
        if (import.meta.dev)
          console.error('[actualizarInmueble]', e)
        auth.invalidarSesionSiApiRechaza(e)
        return { ok: false, error: mensajeErrorInmuebleApi(e, 'guardar') }
      }
    }
    const idx = lista.value.findIndex((i) => String(i.id) === sid)
    if (idx < 0)
      return { ok: false, error: 'No encontramos ese inmueble.' }
    const idNum = Number(sid)
    lista.value[idx] = { ...cuerpo, id: Number.isFinite(idNum) ? idNum : lista.value[idx].id }
    return { ok: true, id: sid }
  }

  return {
    lista,
    destacados,
    sincronizarDesdeApi,
    publicarInmueble,
    actualizarInmueble,
    porId,
    refrescarInmuebleDesdeApi,
    formatearPrecio,
    formatearCuotaMantenimiento,
  }
})
