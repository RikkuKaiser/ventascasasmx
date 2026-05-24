export function useWhatsApp() {
  const config = useRuntimeConfig()

  const phoneDigits = computed(() =>
    String(config.public.whatsappPhone ?? '').replace(/\D/g, ''),
  )

  const defaultMessage = computed(() =>
    String(
      config.public.whatsappDefaultMessage
      ?? 'Hola, me gustaría recibir más información sobre Ventas Casas MX.',
    ),
  )

  /** Enlace wa.me con texto; cadena vacía si no hay teléfono configurado */
  function waUrlForText(message: string) {
    if (!phoneDigits.value)
      return ''
    return `https://wa.me/${phoneDigits.value}?text=${encodeURIComponent(message)}`
  }

  return { phoneDigits, defaultMessage, waUrlForText }
}
