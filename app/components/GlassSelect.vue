<script setup lang="ts">
export type GlassSelectOption = { value: string; label: string }

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: GlassSelectOption[]
    id?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    /** Padding vertical más amplio (formularios tipo /publicar) */
    comfortable?: boolean
  }>(),
  { placeholder: 'Selecciona…', comfortable: false },
)

const emit = defineEmits<{ 'update:modelValue': [v: string] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const listboxId = computed(() =>
  props.id ? `${props.id}-listbox` : undefined,
)

const selectedLabel = computed(() => {
  const hit = props.options.find((o) => o.value === props.modelValue)
  if (hit) return hit.label
  return props.placeholder
})

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function selectValue(v: string) {
  emit('update:modelValue', v)
  open.value = false
}

function onDocPointerDown(e: PointerEvent) {
  if (!open.value || !root.value) return
  const t = e.target as Node
  if (!root.value.contains(t)) open.value = false
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.key === 'Escape') {
    open.value = false
    return
  }
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    if (e.key !== 'ArrowDown' && open.value) return
    e.preventDefault()
    open.value = true
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown, true)
})
onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocPointerDown, true)
})

const triggerPad = computed(() => (props.comfortable ? 'py-3' : 'py-2.5'))
</script>

<template>
  <div ref="root" class="relative w-full">
    <!-- Validación HTML5 en formularios con `required` -->
    <input
      v-if="required"
      type="text"
      class="pointer-events-none absolute h-px w-px opacity-0"
      :value="modelValue"
      :required="required"
      tabindex="-1"
      aria-hidden="true"
      readonly
    >
    <button
      :id="id"
      type="button"
      class="glass-select-trigger flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 text-left text-sm text-white transition hover:border-white/15 focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      :class="[triggerPad, 'px-4']"
      :disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      @click.stop="toggle"
      @keydown="onTriggerKeydown"
    >
      <span class="min-w-0 flex-1 truncate">{{ selectedLabel }}</span>
      <svg
        class="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m6 9 6 6 6-6"
        />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-0.5"
    >
      <div
        v-show="open"
        :id="listboxId"
        role="listbox"
        class="glass-select-panel absolute left-0 right-0 top-full z-[240] mt-1.5 max-h-60 overflow-hidden rounded-xl border border-white/22 shadow-2xl shadow-black/70 ring-1 ring-white/[0.08]"
      >
        <!-- Velo extra: tapa lo que el blur no difumina (p. ej. algunos navegadores / capas padre) -->
        <div class="glass-select-scrim pointer-events-none absolute inset-0 rounded-xl" aria-hidden="true" />

        <!-- Degradado azul: halo suave + núcleo más visible abajo a la derecha -->
        <div
          class="glass-select-glow-wrap pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
          aria-hidden="true"
        >
          <div class="glass-select-glow-soft" />
          <div class="glass-select-glow-core" />
        </div>

        <ul
          class="relative z-20 max-h-60 overflow-y-auto py-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.35)_transparent]"
        >
          <li
            v-for="opt in options"
            :key="`${opt.value}-${opt.label}`"
            role="option"
            :aria-selected="modelValue === opt.value"
            class="cursor-pointer px-4 py-2.5 text-sm text-slate-100 transition-colors hover:bg-white/[0.08]"
            :class="
              modelValue === opt.value
                ? 'bg-royal-500/25 text-white'
                : 'text-slate-100'
            "
            @click.stop="selectValue(opt.value)"
          >
            {{ opt.label }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/*
 * Mismo tono que los inputs (night-850/80): evita el gris “claro” que parece disabled.
 * tailwind night-850 = #0d1424
 */
.glass-select-trigger {
  background: rgba(13, 20, 36, 0.8);
  -webkit-backdrop-filter: blur(10px) saturate(1.05);
  backdrop-filter: blur(10px) saturate(1.05);
}
.glass-select-trigger:hover:not(:disabled) {
  background: rgba(13, 20, 36, 0.9);
}
.glass-select-trigger:focus-visible:not(:disabled) {
  background: rgba(13, 20, 36, 0.92);
}

/* Panel: blur muy fuerte + fondo casi opaco (el texto de abajo no debe leerse) */
.glass-select-panel {
  isolation: isolate;
  transform: translateZ(0);
  /* Capa base oscura; el blur encima desvía lo que quede visible */
  background: rgba(4, 7, 18, 0.94);
  -webkit-backdrop-filter: blur(96px) saturate(1.5);
  backdrop-filter: blur(96px) saturate(1.5);
}

/* Tinte adicional sin quitar del todo el cristal */
.glass-select-scrim {
  z-index: 1;
  background: linear-gradient(
    165deg,
    rgba(8, 12, 28, 0.72) 0%,
    rgba(6, 10, 24, 0.82) 45%,
    rgba(5, 12, 32, 0.88) 100%
  );
}

.glass-select-glow-wrap {
  z-index: 2;
}

/* Halo ancho, muy difuminado */
.glass-select-glow-soft {
  position: absolute;
  bottom: -55%;
  right: -40%;
  width: 110%;
  height: 140%;
  border-radius: 50%;
  transform: translateZ(0);
  opacity: 0.85;
  background: radial-gradient(
    ellipse 72% 78% at 90% 98%,
    rgba(100, 145, 235, 0.38) 0%,
    rgba(55, 95, 195, 0.16) 42%,
    rgba(30, 55, 130, 0.05) 68%,
    transparent 88%
  );
  filter: blur(36px);
  -webkit-filter: blur(36px);
}

/* Núcleo azul rey más visible (menos blur que el halo para que se note el color) */
.glass-select-glow-core {
  position: absolute;
  bottom: -18%;
  right: -12%;
  width: 78%;
  height: 85%;
  border-radius: 50%;
  transform: translateZ(0);
  opacity: 0.92;
  background: radial-gradient(
    ellipse 58% 62% at 88% 94%,
    rgba(95, 140, 235, 0.62) 0%,
    rgba(55, 95, 200, 0.38) 32%,
    rgba(40, 74, 158, 0.18) 55%,
    rgba(25, 45, 110, 0.06) 75%,
    transparent 90%
  );
  filter: blur(18px);
  -webkit-filter: blur(18px);
}
</style>
