import { useAuthStore } from '~/stores/auth'
import { useComentariosStore } from '~/stores/comentarios'
import { useFavoritosStore } from '~/stores/favoritos'
import { useInmueblesStore } from '~/stores/inmuebles'
import { useSolicitudesAsesorStore } from '~/stores/solicitudesAsesor'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  const comentarios = useComentariosStore()
  const favoritos = useFavoritosStore()
  const solicitudesAsesor = useSolicitudesAsesorStore()
  auth.cargarDesdeStorage()
  comentarios.cargar()
  favoritos.cargar()
  solicitudesAsesor.cargar()

  const base = useApiBase()
  if (!base) return

  const inmuebles = useInmueblesStore()
  await inmuebles.sincronizarDesdeApi()
  if (auth.sesion?.accessToken)
    await favoritos.sincronizarDesdeApi()
})
