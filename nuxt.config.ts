// https://nuxt.com/docs/api/configuration/nuxt-config
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from './app/constants/site'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || SITE_URL

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      /** URL pública del front (SEO, canonical, sitemap). */
      siteUrl,
      /** Backend Nest: http://localhost:3001/api (vacío = solo datos locales) */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      /** Reservado por si en el futuro integras otra vista con Google Maps JS */
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_KEY || '',
      // Solo dígitos internacionales (ej. México celular: 521 + 10 dígitos). Ver NUXT_PUBLIC_WHATSAPP_PHONE
      whatsappPhone: process.env.NUXT_PUBLIC_WHATSAPP_PHONE || '',
      whatsappDefaultMessage:
        process.env.NUXT_PUBLIC_WHATSAPP_MESSAGE
        || 'Hola, me gustaría recibir más información sobre Ventas Casas MX.',
      /** Correo para ARCO, privacidad y consultas legales (páginas legales) */
      privacidadEmail:
        process.env.NUXT_PUBLIC_PRIVACIDAD_EMAIL || 'privacidad@ventascasasmx.com',
      /** Domicilio para oír y recibir notificaciones del responsable */
      responsableDomicilio:
        process.env.NUXT_PUBLIC_RESPONSABLE_DOMICILIO
        || 'Calle Ejemplo 100, Col. Centro, Alcaldía Cuauhtémoc, Ciudad de México, CDMX, C.P. 06000, México',
      /** Razón social o nombre comercial del responsable (opcional) */
      responsableNombre:
        process.env.NUXT_PUBLIC_RESPONSABLE_NOMBRE || 'Ventas Casas MX',
    },
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },

  /** PWA: manifest + service worker (Workbox). Iconos en /public/pwa-*.png */
  pwa: {
    registerType: 'autoUpdate',
    strategies: 'generateSW',
    manifest: {
      id: '/',
      name: 'Ventas Casas MX',
      short_name: 'Ventas Casas',
      description:
        'Anuncia y descubre casas, departamentos y terrenos en México. Funciona instalada como app.',
      lang: 'es-MX',
      dir: 'ltr',
      display: 'standalone',
      display_override: ['standalone', 'minimal-ui', 'browser', 'window-controls-overlay'],
      background_color: '#05080f',
      theme_color: '#0a0f1a',
      /** Tablet / escritorio: sin forzar solo retrato */
      orientation: 'any',
      start_url: '/',
      scope: '/',
      categories: ['business', 'lifestyle'],
      /** Enlaces del mismo sitio abren en la ventana de la PWA cuando está instalada (Chrome). */
      handle_links: 'preferred',
      shortcuts: [
        {
          name: 'Inicio',
          short_name: 'Inicio',
          url: '/',
          description: 'Portada y búsqueda rápida',
          icons: [{ src: 'pwa-192.png', sizes: '192x192', type: 'image/png' }],
        },
        {
          name: 'Inmuebles',
          short_name: 'Inmuebles',
          url: '/inmuebles',
          description: 'Catálogo de propiedades',
          icons: [{ src: 'pwa-192.png', sizes: '192x192', type: 'image/png' }],
        },
        {
          name: 'Favoritos',
          short_name: 'Favoritos',
          url: '/favoritos',
          description: 'Tus inmuebles guardados',
          icons: [{ src: 'pwa-192.png', sizes: '192x192', type: 'image/png' }],
        },
      ],
      icons: [
        {
          src: 'pwa-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: 'pwa-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: 'pwa-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: 'pwa-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
      ],
    },
    /** En desarrollo: `PWA_DEV=true` en `.env` para registrar SW y probar instalación */
    devOptions: {
      enabled: process.env.PWA_DEV === 'true',
      suppressWarnings: true,
      type: 'module',
    },
  },
  app: {
    head: {
      title: `${SITE_NAME} — Inmuebles en México`,
      titleTemplate: '%s',
      htmlAttrs: { lang: 'es-MX' },
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, viewport-fit=cover',
        },
        {
          name: 'description',
          content: SITE_DESCRIPTION,
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        ...(process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION
          ? [{
              name: 'google-site-verification',
              content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
            }]
          : []),
        { name: 'application-name', content: SITE_NAME },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: `${SITE_NAME} — Inmuebles en México` },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:url', content: siteUrl },
        { property: 'og:locale', content: 'es_MX' },
        { property: 'og:image', content: `${siteUrl.replace(/\/$/, '')}/pwa-512.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${SITE_NAME} — Inmuebles en México` },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'theme-color', content: '#0a0f1a' },
        { name: 'msapplication-TileColor', content: '#0a0f1a' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
        { name: 'apple-mobile-web-app-title', content: SITE_NAME },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          href: '/pwa-192.png',
          sizes: '180x180',
        },
        {
          rel: 'apple-touch-icon',
          href: '/pwa-192.png',
          sizes: '192x192',
        },
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
