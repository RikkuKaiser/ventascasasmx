<script setup lang="ts">
import { useSolicitudesAsesorStore } from '~/stores/solicitudesAsesor'

useHead({ title: 'Asesores — Ventas Casas MX' })

const solicitudes = useSolicitudesAsesorStore()

const nombreCompleto = ref('')
const email = ref('')
const telefono = ref('')
const ciudad = ref('')
const perfil = ref<'independiente' | 'inmobiliaria'>('independiente')
const nombreInmobiliaria = ref('')
const experiencia = ref('')
const mensaje = ref('')
const acepto = ref(false)

const error = ref('')
const enviado = ref(false)

onMounted(() => {
  solicitudes.cargar()
})

const inputClass =
  'w-full rounded-xl border border-white/10 bg-night-850/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-royal-500/50 focus:outline-none focus:ring-2 focus:ring-royal-500/30'

const perfilOptions = [
  { value: 'independiente', label: 'Asesor independiente' },
  { value: 'inmobiliaria', label: 'Inmobiliaria / equipo' },
]

const experienciaOptions = [
  { value: '', label: 'Prefiero no indicar' },
  { value: 'formacion', label: 'En formación / primer año' },
  { value: '1-2', label: '1 a 2 años' },
  { value: '3-5', label: '3 a 5 años' },
  { value: '5+', label: 'Más de 5 años' },
]

function resetCampos() {
  nombreCompleto.value = ''
  email.value = ''
  telefono.value = ''
  ciudad.value = ''
  perfil.value = 'independiente'
  nombreInmobiliaria.value = ''
  experiencia.value = ''
  mensaje.value = ''
  acepto.value = false
}

async function submit() {
  error.value = ''
  if (!acepto.value) {
    error.value
      = 'Debes aceptar el tratamiento de datos según el Aviso de privacidad y los Términos.'
    return
  }
  const r = await solicitudes.agregar({
    nombreCompleto: nombreCompleto.value,
    email: email.value,
    telefono: telefono.value,
    ciudad: ciudad.value,
    perfil: perfil.value,
    nombreInmobiliaria: nombreInmobiliaria.value,
    experiencia: experiencia.value,
    mensaje: mensaje.value,
  })
  if (!r.ok) {
    error.value = r.error
    return
  }
  enviado.value = true
  resetCampos()
}
</script>

<template>
  <div class="px-4 py-12 md:py-16">
    <div class="mx-auto max-w-xl">
      <p class="text-center text-xs font-semibold uppercase tracking-widest text-royal-300">
        Colaboración profesional
      </p>
      <h1 class="mt-2 text-center font-display text-3xl font-semibold text-white md:text-4xl">
        Asesores externos
      </h1>
      <p class="mx-auto mt-3 max-w-md text-center text-sm text-slate-400">
        Si eres agente o representas una inmobiliaria, déjanos tus datos y nos
        pondremos en contacto contigo.
      </p>
      <p class="mt-4 text-center">
        <NuxtLink
          to="/broker"
          class="text-sm font-medium text-royal-300 hover:text-white"
        >
          ← Conocer el programa para asesores
        </NuxtLink>
      </p>

      <div
        v-if="enviado"
        class="mt-10 rounded-2xl border border-emerald-500/25 bg-emerald-950/30 p-8 text-center backdrop-blur-md"
      >
        <p class="font-display text-lg font-semibold text-emerald-100">
          Solicitud enviada
        </p>
        <p class="mt-2 text-sm text-slate-400">
          Gracias. Revisaremos tu información y te contactaremos pronto.
        </p>
        <button
          type="button"
          class="mt-6 text-sm font-medium text-royal-300 hover:text-white"
          @click="enviado = false"
        >
          Enviar otra solicitud
        </button>
      </div>

      <form
        v-else
        id="agent-form"
        class="mt-10 scroll-mt-28 space-y-4 rounded-2xl glass-strong p-6 md:p-8"
        @submit.prevent="submit"
      >
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="as-nombre">
            Nombre completo
          </label>
          <input
            id="as-nombre"
            v-model="nombreCompleto"
            type="text"
            required
            autocomplete="name"
            :class="inputClass"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="as-email">
            Correo electrónico
          </label>
          <input
            id="as-email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            :class="inputClass"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="as-tel">
            Teléfono (WhatsApp preferible)
          </label>
          <input
            id="as-tel"
            v-model="telefono"
            type="tel"
            required
            autocomplete="tel"
            inputmode="tel"
            placeholder="Ej. 55 1234 5678"
            :class="inputClass"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="as-ciudad">
            Ciudad o zona donde operas
          </label>
          <input
            id="as-ciudad"
            v-model="ciudad"
            type="text"
            autocomplete="address-level2"
            placeholder="Opcional"
            :class="inputClass"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="as-perfil">
            Perfil
          </label>
          <GlassSelect
            id="as-perfil"
            v-model="perfil"
            :options="perfilOptions"
            comfortable
          />
        </div>
        <div v-if="perfil === 'inmobiliaria'">
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="as-inmo">
            Nombre de la inmobiliaria
          </label>
          <input
            id="as-inmo"
            v-model="nombreInmobiliaria"
            type="text"
            :class="inputClass"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="as-exp">
            Experiencia en el sector
          </label>
          <GlassSelect
            id="as-exp"
            v-model="experiencia"
            :options="experienciaOptions"
            comfortable
          />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400" for="as-msg">
            Mensaje
          </label>
          <textarea
            id="as-msg"
            v-model="mensaje"
            rows="4"
            class="min-h-[100px] resize-y"
            placeholder="Cuéntanos brevemente en qué te gustaría colaborar…"
            :class="inputClass"
          />
        </div>
        <label class="flex cursor-pointer items-start gap-3 text-sm text-slate-400">
          <input
            v-model="acepto"
            type="checkbox"
            required
            class="checkbox-glass"
          />
          <span>
            Acepto el tratamiento de mis datos conforme al
            <NuxtLink
              to="/aviso-privacidad"
              class="font-medium text-royal-300 hover:text-white"
              @click.stop
            >Aviso de privacidad</NuxtLink>
            y los
            <NuxtLink
              to="/terminos"
              class="font-medium text-royal-300 hover:text-white"
              @click.stop
            >Términos y condiciones</NuxtLink>, y que Ventas Casas MX me contacte
            respecto de mi solicitud.
          </span>
        </label>
        <p v-if="error" class="text-sm text-red-400">
          {{ error }}
        </p>
        <button
          type="submit"
          class="w-full rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 py-3 text-sm font-semibold text-white shadow-royal ring-1 ring-white/15 transition hover:brightness-110"
        >
          Enviar solicitud
        </button>
      </form>

      <p class="mt-8 text-center text-xs text-slate-600">
        ¿Buscas solo crear cuenta para comentar en fichas?
        <NuxtLink to="/registro" class="text-royal-400 hover:text-royal-200">
          Registro de usuario
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
