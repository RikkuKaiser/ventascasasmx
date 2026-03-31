<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  title: 'Términos y condiciones — LuxeInmuebles',
  meta: [
    {
      name: 'description',
      content:
        'Términos y condiciones de uso del sitio LuxeInmuebles.',
    },
  ],
})
</script>

<template>
  <LegalPageShell
    title="Términos y condiciones"
    descripcion="Condiciones generales de uso de la plataforma LuxeInmuebles."
  >
    <section>
      <h2>1. Identificación</h2>
      <p>
        El sitio web LuxeInmuebles (en adelante, el «Sitio») es operado con fines
        de exhibición de inmuebles y servicios relacionados. Al acceder o
        utilizar el Sitio, declaras haber leído y aceptado estos Términos y
        Condiciones, así como nuestro
        <NuxtLink to="/aviso-privacidad">Aviso de privacidad</NuxtLink>.
      </p>
    </section>
    <section>
      <h2>2. Objeto</h2>
      <p>
        El Sitio permite consultar información sobre propiedades, crear una
        cuenta de usuario, guardar favoritos, participar en comentarios donde
        esté habilitado y, en su caso, enviar solicitudes de colaboración como
        asesor. La información mostrada tiene carácter informativo; la
        disponibilidad, precio y condiciones definitivas de un inmueble deben
        confirmarse con quien ofrezca el bien o el servicio.
      </p>
    </section>
    <section>
      <h2>3. Uso adecuado</h2>
      <p>Te comprometes a:</p>
      <ul>
        <li>Utilizar el Sitio de forma lícita y respetuosa.</li>
        <li>No intentar acceder a sistemas, datos o áreas no autorizadas.</li>
        <li>
          No publicar contenidos ofensivos, falsos, ilegales o que infrinjan
          derechos de terceros en comentarios u otras funciones habilitadas.
        </li>
        <li>
          No usar el Sitio para spam, suplantación de identidad o actividades
          comerciales no autorizadas por LuxeInmuebles.
        </li>
      </ul>
    </section>
    <section>
      <h2>4. Cuenta de usuario</h2>
      <p>
        Si te registras, eres responsable de la veracidad de tus datos y de la
        confidencialidad de tu contraseña. LuxeInmuebles podrá suspender o
        cancelar cuentas que incumplan estos términos o el Aviso de privacidad.
      </p>
    </section>
    <section>
      <h2>5. Propiedad intelectual</h2>
      <p>
        Los diseños, marcas, textos, imágenes de interfaz y demás contenidos del
        Sitio (salvo contenidos de terceros) están protegidos. No se autoriza su
        reproducción o uso comercial sin consentimiento previo por escrito.
      </p>
    </section>
    <section>
      <h2>6. Limitación de responsabilidad</h2>
      <p>
        El Sitio y sus funciones se ofrecen «tal cual». LuxeInmuebles no garantiza
        la exactitud absoluta de cada dato de inmueble ni la continuidad
        ininterrumpida del servicio. En la medida en que lo permita la ley
        aplicable, no seremos responsables por daños indirectos o lucro cesante
        derivados del uso del Sitio.
      </p>
    </section>
    <section>
      <h2>7. Enlaces a terceros</h2>
      <p>
        El Sitio puede incluir enlaces a sitios o servicios de terceros (por
        ejemplo, mensajería). Esos sitios tienen sus propias políticas;
        LuxeInmuebles no controla ni responde por su contenido.
      </p>
    </section>
    <section>
      <h2>8. Modificaciones</h2>
      <p>
        Podemos actualizar estos Términos en cualquier momento. La fecha de
        «Última actualización» indicará el cambio más reciente. El uso continuado
        del Sitio tras la publicación implica la aceptación de las versiones
        vigentes.
      </p>
    </section>
    <section>
      <h2>9. Legislación aplicable</h2>
      <p>
        Para la interpretación de estos Términos se aplicarán las leyes de los
        Estados Unidos Mexicanos. Las partes se someten a la jurisdicción de los
        tribunales competentes de la República Mexicana, renunciando a cualquier
        otro fuero que pudiera corresponderles.
      </p>
    </section>
    <section>
      <h2>10. Contacto</h2>
      <p>
        Para dudas sobre estos Términos o el tratamiento de datos personales,
        escríbenos a
        <a
          :href="`mailto:${config.public.privacidadEmail}?subject=Consulta%20T%C3%A9rminos%20LuxeInmuebles`"
        >{{ config.public.privacidadEmail }}</a>.
        También puedes usar los canales habilitados en el Sitio (por ejemplo,
        WhatsApp), si están disponibles.
      </p>
      <p>
        <strong>Domicilio del responsable:</strong>
        {{ config.public.responsableDomicilio }}
      </p>
      <p class="text-xs text-slate-500">
        Este documento es una base general. Te recomendamos revisarlo con tu
        asesor legal para adaptarlo a tu operación y obligaciones fiscales o
        corporativas.
      </p>
    </section>
  </LegalPageShell>
</template>
