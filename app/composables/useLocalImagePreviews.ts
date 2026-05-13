import type { Ref } from 'vue'

function revoke(u: string | null | undefined) {
  if (u) URL.revokeObjectURL(u)
}

/**
 * Miniaturas locales (object URLs) para archivos de imagen elegidos en inputs.
 * Libera URLs al cambiar selección o al desmontar el componente.
 */
export function useLocalImagePreviews(
  archivoPrincipal: Ref<File | null>,
  archivosGaleria: Ref<File[]>,
) {
  const previewPrincipalUrl = ref<string | null>(null)
  const previewGaleria = ref<{ url: string; name: string }[]>([])

  watch(archivoPrincipal, (file) => {
    revoke(previewPrincipalUrl.value)
    previewPrincipalUrl.value =
      file && file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null
  })

  watch(
    archivosGaleria,
    (files) => {
      for (const p of previewGaleria.value) revoke(p.url)
      previewGaleria.value = files
        .filter((f) => f.type.startsWith('image/'))
        .map((f) => ({ url: URL.createObjectURL(f), name: f.name }))
    },
    { deep: true },
  )

  onUnmounted(() => {
    revoke(previewPrincipalUrl.value)
    for (const p of previewGaleria.value) revoke(p.url)
  })

  return { previewPrincipalUrl, previewGaleria }
}
