// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // Solo dígitos internacionales (ej. México celular: 521 + 10 dígitos). Ver NUXT_PUBLIC_WHATSAPP_PHONE
      whatsappPhone: process.env.NUXT_PUBLIC_WHATSAPP_PHONE || '',
      whatsappDefaultMessage:
        process.env.NUXT_PUBLIC_WHATSAPP_MESSAGE
        || 'Hola, me gustaría recibir más información sobre LuxeInmuebles.',
      /** Correo para ARCO, privacidad y consultas legales (páginas legales) */
      privacidadEmail:
        process.env.NUXT_PUBLIC_PRIVACIDAD_EMAIL || 'privacidad@luxeinmuebles.com',
      /** Domicilio para oír y recibir notificaciones del responsable */
      responsableDomicilio:
        process.env.NUXT_PUBLIC_RESPONSABLE_DOMICILIO
        || 'Calle Ejemplo 100, Col. Centro, Alcaldía Cuauhtémoc, Ciudad de México, CDMX, C.P. 06000, México',
      /** Razón social o nombre comercial del responsable (opcional) */
      responsableNombre:
        process.env.NUXT_PUBLIC_RESPONSABLE_NOMBRE || 'LuxeInmuebles',
    },
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },
  app: {
    head: {
      title: 'LuxeInmuebles — Anuncia con elegancia',
      htmlAttrs: { lang: 'es' },
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, viewport-fit=cover',
        },
        {
          name: 'description',
          content: 'Plataforma elegante para anunciar y descubrir inmuebles.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..1000;1,9..40,300..1000&family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&display=swap',
        },
      ],
    },
  },
})
