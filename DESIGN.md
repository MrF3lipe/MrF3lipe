# Conceptual Sketch

La propuesta 17 fue seleccionada expresamente por el usuario para desarrollar el portfolio completo.

## Scene

Una persona revisa el trabajo de Felipe en su portátil a la luz del día; la página se siente como abrir su cuaderno de proyectos sobre una mesa.

## Visual system

- Papel marfil, tinta cálida, anotaciones en terracota y resaltador amarillo suave.
- Color strategy: restrained, con énfasis en los botones y las notas.
- Caveat para titulares y anotaciones; Karla para descripciones y controles.
- Retícula asimétrica, bordes irregulares de lápiz, flechas y esquemas SVG propios.
- Fotografía del repositorio dentro de una nota de perfil; recursos reales de los proyectos cuando estén disponibles.
- Proyectos como hojas de trabajo con etiquetas, descripción y enlace, en vez de una cuadrícula de tarjetas idénticas.
- Transiciones breves de opacidad y transform, sin ocultar contenido si JavaScript falla.

## Page

Inicio con el boceto aprobado, proyectos destacados, índice filtrable del resto de repositorios, perfil, caja de herramientas, proceso y contacto con el endpoint original de Formspree. Navegación por anclas y menú móvil accesible.

## Constraints

React y TypeScript existentes. Assets y fuentes locales. Compilación estática con rutas relativas. Sin métricas de habilidad inventadas ni APKs ficticias. El repositorio original contiene el correo y el endpoint de contacto que se conservarán.

## Movimiento inspirado en el segundo vídeo

Motion (framer-motion ya instalado) activa entradas una sola vez al entrar en pantalla. Los trazos SVG se dibujan con CSS y los controles responden al pulsar. Se conservan el desplazamiento nativo, el acceso por teclado y prefers-reduced-motion, incluso si esa preferencia cambia con la página abierta. El contenido está visible por defecto y las animaciones limpian observadores y estilos al desmontar.

## Bocetos interactivos

Se retiró el archivo Otros apuntes / Otras ideas. ZoFloridane se incorporó a los proyectos destacados, con información del sitio público y sin atribuirle un repositorio o stack no confirmado. Cada boceto es un botón accesible: un toque inicia cinco etapas y al finalizar aparece una composición ilustrada en color, con opción de repetir y enlace separado al sitio real. No se carga ni suplanta el sitio externo dentro del portfolio. Con movimiento reducido, la vista terminada aparece de inmediato. Los temporizadores se cancelan al desmontar.

Corrección: la construcción ahora descubre el sitio web REAL en un iframe, no una composición ilustrada. Se carga tras tocar el boceto, se revela por etapas y permite interactuar, ampliar o abrir en otra pestaña. Kitchen Cabinet mantiene su boceto de aplicación Android. La incrustación depende de que el destino permita frames; se ofrece siempre enlace directo.

## Secuencia definitiva de creación

El clic retira el boceto y reconstruye el DOM capturado de cada web: contenedores HTML vacíos, estilos originales, nodos de texto insertados progresivamente y elementos multimedia incorporados después. Son componentes reales de las páginas públicas, conservados en public/build-scenes, con scripts originales y eventos eliminados. Al terminar se conecta la web en vivo. La escena se ejecuta en un iframe aislado y el padre valida el emisor de los mensajes. Los estilos se guardan localmente para que la primera etapa no espere a hojas externas. No se modifica ninguna página externa.
