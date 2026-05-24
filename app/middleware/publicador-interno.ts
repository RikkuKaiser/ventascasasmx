import { esEmailPublicador } from '~/constants/publishers'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (!auth.estaAutenticado || !auth.sesionValidaParaApi) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (!esEmailPublicador(auth.sesion?.email)) {
    return navigateTo('/')
  }
})
