<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  title: 'Aviso de privacidad — Ventas Casas MX',
  meta: [
    {
      name: 'description',
      content:
        'Aviso de privacidad integral de Ventas Casas MX conforme a la LFPDPPP.',
    },
  ],
})
</script>

<template>
  <LegalPageShell
    title="Aviso de privacidad"
    descripcion="Información sobre el tratamiento de datos personales en Ventas Casas MX."
  >
    <section>
      <h2>1. Responsable del tratamiento</h2>
      <p>
        Ventas Casas MX, en su carácter de responsable del Sitio, trata datos
        personales conforme a la Ley Federal de Protección de Datos Personales en
        Posesión de los Particulares (LFPDPPP) y demás normativa aplicable en
        México.
      </p>
    </section>
    <section>
      <h2>2. Datos personales que podemos recabar</h2>
      <p>Según las funciones que utilices, podemos tratar, entre otros:</p>
      <ul>
        <li>
          <strong>Registro de usuario:</strong> nombre, correo electrónico y
          datos necesarios para crear y mantener tu cuenta.
        </li>
        <li>
          <strong>Comentarios:</strong> el contenido que publiques asociado a tu
          identidad de usuario.
        </li>
        <li>
          <strong>Favoritos:</strong> identificadores de inmuebles que marques,
          vinculados a tu cuenta o dispositivo según la implementación del Sitio.
        </li>
        <li>
          <strong>Solicitud de asesores:</strong> nombre completo, correo,
          teléfono, ciudad, perfil profesional, datos de inmobiliaria (si
          aplica), experiencia y mensajes que nos envíes.
        </li>
        <li>
          <strong>Navegación:</strong> datos técnicos habituales (dirección IP,
          tipo de navegador, páginas visitadas) cuando resulte necesario para
          seguridad, estadísticas o mejora del servicio.
        </li>
      </ul>
    </section>
    <section>
      <h2>3. Finalidades del tratamiento</h2>
      <p>Tratamos tus datos para:</p>
      <ul>
        <li>Permitir el registro, acceso y administración de tu cuenta.</li>
        <li>Mostrar y gestionar favoritos y comentarios en el Sitio.</li>
        <li>
          Dar seguimiento a solicitudes de colaboración de asesores externos.
        </li>
        <li>
          Contactarte por los medios que nos proporciones cuando lo solicites o
          sea necesario para el servicio (por ejemplo, WhatsApp si activas un
          enlace hacia ese servicio).
        </li>
        <li>Cumplir obligaciones legales y resolver controversias.</li>
        <li>Mejorar la seguridad, el rendimiento y la experiencia del Sitio.</li>
      </ul>
    </section>
    <section>
      <h2>4. Transferencias</h2>
      <p>
        No vendemos tus datos personales. Podremos compartirlos con proveedores
        de servicios que nos auxilien (por ejemplo, hospedaje o analítica) bajo
        acuerdos de confidencialidad, o cuando una autoridad competente lo
        exija. Las transferencias que requieran tu consentimiento se realizarán
        solo con tu autorización, salvo excepciones previstas en la ley.
      </p>
    </section>
    <section>
      <h2>5. Derechos ARCO y revocación del consentimiento</h2>
      <p>
        Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento
        de tus datos (derechos ARCO), así como a revocar el consentimiento donde
        proceda. Para ejercerlos, envía tu solicitud al correo
        <a
          :href="`mailto:${config.public.privacidadEmail}?subject=Ejercicio%20de%20derechos%20ARCO`"
        >{{ config.public.privacidadEmail }}</a>, indicando tu nombre completo,
        copia simple de identificación oficial (cuando proceda), un medio para
        responderte y una descripción clara del derecho que deseas ejercer.
      </p>
    </section>
    <section>
      <h2>6. Conservación</h2>
      <p>
        Conservamos los datos el tiempo necesario para cumplir las finalidades
        descritas y las obligaciones legales. Posteriormente podrán ser
        bloqueados y eliminados conforme a la normativa.
      </p>
    </section>
    <section>
      <h2>7. Medidas de seguridad</h2>
      <p>
        Implementamos medidas administrativas, técnicas y físicas razonables
        para proteger tus datos. Ningún sistema es infalible; te invitamos a
        usar contraseñas seguras y a no compartir tu acceso.
      </p>
    </section>
    <section>
      <h2>8. Cookies y tecnologías similares</h2>
      <p>
        El Sitio puede usar cookies o almacenamiento local del navegador para
        mantener tu sesión, preferencias o funciones esenciales. Puedes
        configurar tu navegador para limitar cookies; algunas funciones podrían
        dejar de operar correctamente.
      </p>
    </section>
    <section>
      <h2>9. Menores de edad</h2>
      <p>
        El Sitio no está dirigido a menores de edad. Si detectamos datos de
        menores sin el consentimiento adecuado, tomaremos medidas para eliminarlos.
      </p>
    </section>
    <section>
      <h2>10. Cambios al aviso</h2>
      <p>
        Podemos actualizar este Aviso de privacidad. Publicaremos la versión
        vigente en el Sitio con su fecha de actualización. Te recomendamos
        revisarlo periódicamente.
      </p>
    </section>
    <section>
      <h2>11. Aceptación</h2>
      <p>
        Al usar el Sitio, enviar formularios o crear una cuenta, manifiestas
        haber leído este Aviso y, en su caso, aceptas el tratamiento de tus datos
        conforme a lo aquí descrito y a los
        <NuxtLink to="/terminos">Términos y condiciones</NuxtLink>.
      </p>
      <p class="text-xs text-slate-500">
        Revisa con tu asesor legal el registro ante el INAI (si aplica), el
        procedimiento interno ARCO y que domicilio, razón social y correo
        coincidan con tu constancia fiscal y operación real.
      </p>
    </section>
  </LegalPageShell>
</template>
