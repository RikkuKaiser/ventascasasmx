import { useAuthStore } from '~/stores/auth'
import { useComentariosStore } from '~/stores/comentarios'
import { useFavoritosStore } from '~/stores/favoritos'

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  const comentarios = useComentariosStore()
  const favoritos = useFavoritosStore()
  auth.cargarDesdeStorage()
  comentarios.cargar()
  favoritos.cargar()
})
