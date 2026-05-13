/**
 * Marca el documento cuando la app corre como PWA instalada (standalone / iOS).
 * Útil para estilos o analytics sin depender solo de user-agent.
 */
export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const mq = window.matchMedia('(display-mode: standalone)')

  function apply() {
    const standalone =
      mq.matches
      || (window.navigator as Navigator & { standalone?: boolean }).standalone
        === true
    document.documentElement.classList.toggle('pwa-standalone', standalone)
  }

  apply()
  mq.addEventListener('change', apply)
})
