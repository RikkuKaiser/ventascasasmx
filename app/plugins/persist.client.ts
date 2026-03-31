import { useAuthStore } from '~/stores/auth'
import { useComentariosStore } from '~/stores/comentarios'
import { useFavoritosStore } from '~/stores/favoritos'
import { useSolicitudesAsesorStore } from '~/stores/solicitudesAsesor'

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  const comentarios = useComentariosStore()
  const favoritos = useFavoritosStore()
  const solicitudesAsesor = useSolicitudesAsesorStore()
  auth.cargarDesdeStorage()
  comentarios.cargar()
  favoritos.cargar()
  solicitudesAsesor.cargar()
})
