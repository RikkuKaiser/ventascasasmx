<script setup lang="ts">
const redes = [
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@Inmueblessinmetiras',
    label: 'YouTube — Inmuebles sin mentiras',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61563489190845&locale=es_LA',
    label: 'Facebook — VentaCasa MX',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/ventas_casamx/?hl=es',
    label: 'Instagram — @ventas_casamx',
  },
] as const
</script>

<template>
  <nav
    class="mt-6 flex items-center justify-center gap-3"
    aria-label="Redes sociales"
  >
    <a
      v-for="red in redes"
      :key="red.name"
      :href="red.href"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="red.label"
      class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-royal-500/40 hover:bg-white/[0.08] hover:text-royal-200"
    >
      <svg
        v-if="red.name === 'YouTube'"
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5L15.8 12l-6.2 3.5Z"
        />
      </svg>
      <svg
        v-else-if="red.name === 'Facebook'"
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.95v-8.45H7.08v-3.5h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.23 2.68.23v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.5h-2.79v8.45C19.61 23.1 24 18.1 24 12.07Z"
        />
      </svg>
      <svg
        v-else
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.9.25 2.3.42.6.22 1 .5 1.5.9.4.5.7 1 .9 1.5.17.4.36 1.1.42 2.3.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.9-.42 2.3-.22.6-.5 1-.9 1.5-.5.4-1 .7-1.5.9-.4.17-1.1.36-2.3.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.9-.25-2.3-.42-.6-.22-1-.5-1.5-.9a4 4 0 0 1-.9-1.5c-.17-.4-.36-1.1-.42-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.9.42-2.3.22-.6.5-1 .9-1.5.5-.4 1-.7 1.5-.9.4-.17 1.1-.36 2.3-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-1 .05-1.6.22-2 .37-.5.2-.9.43-1.3.8-.4.4-.6.8-.8 1.3-.15.4-.32 1-.37 2-.07 1.2-.07 1.6-.07 4.7s0 3.5.07 4.7c.05 1 .22 1.6.37 2 .2.5.43.9.8 1.3.4.4.8.6 1.3.8.4.15 1 .32 2 .37 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1-.05 1.6-.22 2-.37.5-.2.9-.43 1.3-.8.4-.4.6-.8.8-1.3.15-.4.32-1 .37-2 .07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.05-1-.22-1.6-.37-2-.2-.5-.43-.9-.8-1.3a3.5 3.5 0 0 0-1.3-.8c-.4-.15-1-.32-2-.37-1.2-.07-1.6-.07-4.7-.07ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.3-3.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"
        />
      </svg>
    </a>
  </nav>
</template>
