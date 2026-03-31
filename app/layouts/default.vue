<template>
  <div class="relative min-h-screen flex flex-col">
    <div
      class="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal-600/20 blur-[100px]"
      />
      <div
        class="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-royal-800/25 blur-[90px]"
      />
    </div>
    <AppHeader />
    <main class="relative z-10 flex-1">
      <slot />
    </main>
    <footer class="relative z-10 mt-16 border-t border-white/5 py-10">
      <div
        class="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500"
      >
        <p class="font-display text-slate-400">LuxeInmuebles</p>
        <p class="mt-1">Anuncia y descubre inmuebles con estilo.</p>
      </div>
    </footer>
    <WhatsAppBubble />
  </div>
</template>
