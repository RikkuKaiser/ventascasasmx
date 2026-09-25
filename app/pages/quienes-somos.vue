<script setup lang="ts">
useHead({
  title: 'Quiénes somos — Ventas Casa MX',
  meta: [
    {
      name: 'description',
      content:
        'Ventas Casa MX es un servicio de asesoría, intermediación y comercialización de bienes inmuebles en México, operado por Cynthia Anacaren Ruiz Cobián.',
    },
  ],
})

const servicios = [
  {
    titulo: 'Asesoría e intermediación',
    texto:
      'Acompañamos la compra, venta, renta o traspaso de casas, departamentos y terrenos, con información clara antes de firmar.',
  },
  {
    titulo: 'Promoción de propiedades',
    texto:
      'Publicamos fichas con fotos, datos y documentación para que compradores y propietarios comparen con certeza.',
  },
  {
    titulo: 'Acompañamiento jurídico',
    texto:
      'Orientamos en contratos, promesas de compraventa y el seguimiento ante notaría cuando el proceso lo requiere.',
  },
]
</script>

<template>
  <div class="px-3 py-8 sm:px-4 sm:py-12 md:py-16">
    <article class="mx-auto max-w-3xl">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-royal-300">
        Ventas Casa MX
      </p>
      <h1 class="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
        Quiénes somos
      </h1>
      <p class="mt-4 text-base leading-relaxed text-slate-300">
        Ventas Casa MX es un servicio inmobiliario en México dedicado a la asesoría, intermediación, promoción y comercialización de bienes inmuebles. Lo opera Cynthia Anacaren Ruiz Cobián.
      </p>
      <p class="mt-4 text-sm leading-relaxed text-slate-400">
        Trabajamos con casas, departamentos y terrenos en venta y renta. La idea es simple: que quien compra, vende o renta sepa qué está firmando, con fichas claras y respaldo en el proceso.
      </p>

      <section class="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <div
          v-for="item in servicios"
          :key="item.titulo"
          class="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        >
          <h2 class="font-display text-lg font-semibold text-white">
            {{ item.titulo }}
          </h2>
          <p class="mt-2 text-sm leading-relaxed text-slate-400">
            {{ item.texto }}
          </p>
        </div>
      </section>

      <section class="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-8">
        <h2 class="font-display text-xl font-semibold text-white">
          Datos de contacto
        </h2>
        <dl class="mt-4 space-y-3 text-sm text-slate-300">
          <div>
            <dt class="text-xs uppercase tracking-wider text-slate-500">Responsable</dt>
            <dd class="mt-1">Ventas Casa MX (Cynthia Anacaren Ruiz Cobián)</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wider text-slate-500">Sitio web</dt>
            <dd class="mt-1">
              <a
                class="text-royal-300 underline-offset-2 hover:text-white hover:underline"
                href="https://www.ventascasasmx.store"
              >www.ventascasasmx.store</a>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wider text-slate-500">Correo</dt>
            <dd class="mt-1">
              <a
                class="text-royal-300 underline-offset-2 hover:text-white hover:underline"
                href="mailto:contacto@ventascasasmx.store"
              >contacto@ventascasasmx.store</a>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wider text-slate-500">Domicilio</dt>
            <dd class="mt-1">México</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wider text-slate-500">WhatsApp</dt>
            <dd class="mt-1">Disponible en este sitio, en el botón de contacto.</dd>
          </div>
        </dl>
      </section>

      <section class="mt-8 text-sm leading-relaxed text-slate-400">
        <p>
          Si nos escribes desde un anuncio de Facebook o Instagram (formulario de clientes potenciales), usamos tus datos solo para dar seguimiento a esa solicitud, conforme al
          <NuxtLink
            class="text-royal-300 underline-offset-2 hover:text-white hover:underline"
            to="/aviso-privacidad"
          >Aviso de privacidad</NuxtLink>.
        </p>
        <p class="mt-4 text-slate-500">
          «Transparencia en cada paso»
        </p>
      </section>
    </article>
  </div>
</template>
