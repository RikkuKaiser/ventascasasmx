<script setup lang="ts">
useHead({ title: 'Para asesores — LuxeInmuebles' })

const beneficios = [
  {
    titulo: 'Visibilidad premium',
    texto:
      'Tu trabajo encaja en una vitrina oscura y clara: fichas con fotos de calidad y datos ordenados.',
  },
  {
    titulo: 'Comunidad y confianza',
    texto:
      'Compartimos una visión de servicio serio: menos ruido, más transparencia con compradores y propietarios.',
  },
  {
    titulo: 'Acompañamiento cercano',
    texto:
      'Te escuchamos antes de sumarte: alineamos expectativas y forma de colaborar con LuxeInmuebles.',
  },
  {
    titulo: 'Herramientas digitales',
    texto:
      'Catálogo pensado para móvil, favoritos y compartir fichas en segundos con tus clientes.',
  },
  {
    titulo: 'Proceso ordenado',
    texto:
      'Desde la solicitud hasta el contacto, cada paso queda registrado para dar seguimiento sin perder detalles.',
  },
  {
    titulo: 'Enfoque en ventas',
    texto:
      'Menos fricción operativa en la vitrina: tú te concentras en visitas, negociación y cierre.',
  },
]

const pasos = [
  {
    n: '1',
    titulo: 'Solicitud',
    texto: 'Completa el formulario con tus datos y cómo te gustaría colaborar.',
  },
  {
    n: '2',
    titulo: 'Contacto',
    texto: 'Revisamos tu perfil y te escribimos o llamamos para conocerte mejor.',
  },
  {
    n: '3',
    titulo: 'Alineación',
    texto: 'Acordamos modalidad, zona y siguiente pasos con total claridad.',
  },
  {
    n: '4',
    titulo: 'A operar',
    texto: 'Integras tu operación con el estilo y los procesos de LuxeInmuebles.',
  },
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden px-4 pb-16 pt-12 md:pt-20">
      <div
        class="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-royal-600/15 blur-[100px]"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-6xl text-center lg:text-left">
        <div class="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <p
              class="inline-flex items-center gap-2 rounded-full border border-royal-500/30 bg-royal-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-royal-200"
            >
              Asesores inmobiliarios
            </p>
            <h1
              class="mt-6 font-display text-4xl font-semibold leading-tight text-white md:text-5xl"
            >
              Únete al
              <span class="text-gradient-royal">cambio</span>
              profesional
            </h1>
            <p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-400 lg:mx-0">
              Ser asesor exige disciplina, herramientas y respaldo. En
              LuxeInmuebles buscamos perfiles que quieran crecer con un catálogo
              cuidado y un trato transparente con clientes.
            </p>
            <div
              class="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <NuxtLink
                to="/asesores#agent-form"
                class="rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 px-8 py-3.5 text-center text-sm font-semibold text-white shadow-royal ring-1 ring-white/20 transition hover:brightness-110"
              >
                Registrarse como asesor
              </NuxtLink>
              <a
                href="#beneficios"
                class="rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                Ver beneficios
              </a>
            </div>
          </div>
          <div
            class="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md lg:mt-0"
          >
            <p class="font-display text-xl font-semibold text-white">
              Experiencia integral
            </p>
            <p class="mt-3 text-sm leading-relaxed text-slate-400">
              Pensamos en el asesor, sin perder de vista a quien compra y a quien
              vende: información clara, seguimiento por WhatsApp cuando aplica y
              fichas que generan confianza desde el primer vistazo.
            </p>
            <ul class="mt-6 space-y-3 text-sm text-slate-300">
              <li class="flex gap-2">
                <span class="text-royal-400">✓</span>
                Catálogo curado y diseño coherente con tu imagen profesional.
              </li>
              <li class="flex gap-2">
                <span class="text-royal-400">✓</span>
                Formulario de ingreso para conocerte y responderte con rapidez.
              </li>
              <li class="flex gap-2">
                <span class="text-royal-400">✓</span>
                Proceso por etapas: solicitud, contacto, alineación y operación.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section
      id="beneficios"
      class="border-y border-white/5 bg-night-850/25 px-4 py-16 backdrop-blur-sm"
    >
      <div class="mx-auto max-w-6xl">
        <h2 class="text-center font-display text-2xl font-semibold text-white md:text-3xl">
          Lo que encontrarás con nosotros
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-400">
          Herramientas y cultura para que dediques más tiempo a vender y menos a
          pelear con procesos desordenados.
        </p>
        <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(b, i) in beneficios"
            :key="i"
            class="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md"
          >
            <div
              class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-royal-900/50 text-sm font-bold text-royal-200 ring-1 ring-royal-500/30"
            >
              {{ i + 1 }}
            </div>
            <h3 class="font-display text-lg font-semibold text-white">
              {{ b.titulo }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-400">
              {{ b.texto }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="px-4 py-16 md:py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="text-center font-display text-2xl font-semibold text-white md:text-3xl">
          Tu camino con LuxeInmuebles
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-center text-sm text-slate-400">
          Cuatro pasos sencillos, siempre con comunicación clara.
        </p>
        <div
          class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div
            v-for="p in pasos"
            :key="p.n"
            class="relative rounded-2xl border border-royal-500/20 bg-royal-950/30 p-6 text-center backdrop-blur-md"
          >
            <span
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-royal-600 to-royal-900 text-lg font-bold text-white shadow-royal ring-1 ring-white/20"
            >{{ p.n }}</span>
            <h3 class="mt-4 font-display text-base font-semibold text-white">
              {{ p.titulo }}
            </h3>
            <p class="mt-2 text-sm text-slate-400">
              {{ p.texto }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="px-4 pb-20">
      <div
        class="mx-auto max-w-3xl rounded-3xl border border-royal-500/25 bg-gradient-to-b from-royal-950/50 to-night-900/80 px-6 py-12 text-center backdrop-blur-xl md:px-12"
      >
        <h2 class="font-display text-2xl font-semibold text-white md:text-3xl">
          ¿Listo para dar el siguiente paso?
        </h2>
        <p class="mt-3 text-sm text-slate-400">
          Regístrate como asesor externo: en minutos dejas tus datos y nosotros
          te contactamos.
        </p>
        <NuxtLink
          to="/asesores#agent-form"
          class="mt-8 inline-flex rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 px-10 py-3.5 text-sm font-semibold text-white shadow-royal ring-1 ring-white/20 transition hover:brightness-110"
        >
          Registrarse como asesor
        </NuxtLink>
        <p class="mt-6 text-xs text-slate-600">
          ¿Solo quieres comentar en fichas?
          <NuxtLink to="/registro" class="text-royal-400 hover:text-royal-200">
            Crea una cuenta de usuario
          </NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>
