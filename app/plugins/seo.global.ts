import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIAL_URLS,
  absoluteUrl,
} from '~/constants/site'

export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://ventascasasmx.store')

  const canonicalUrl = computed(() =>
    absoluteUrl(route.path, siteUrl),
  )

  const ogImage = computed(() => absoluteUrl('/pwa-512.png', siteUrl))

  useHead({
    link: computed(() => [{ rel: 'canonical', href: canonicalUrl.value }]),
    meta: computed(() => [
      { property: 'og:url', content: canonicalUrl.value },
      { property: 'og:image', content: ogImage.value },
      { name: 'twitter:image', content: ogImage.value },
    ]),
    script: computed(() => [
      {
        type: 'application/ld+json',
        key: 'site-jsonld',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': `${absoluteUrl('/', siteUrl)}#website`,
              name: SITE_NAME,
              url: absoluteUrl('/', siteUrl),
              description: SITE_DESCRIPTION,
              inLanguage: 'es-MX',
            },
            {
              '@type': 'Organization',
              '@id': `${absoluteUrl('/', siteUrl)}#organization`,
              name: SITE_NAME,
              url: absoluteUrl('/', siteUrl),
              logo: ogImage.value,
              sameAs: [...SOCIAL_URLS],
            },
          ],
        }),
      },
    ]),
  })
})
