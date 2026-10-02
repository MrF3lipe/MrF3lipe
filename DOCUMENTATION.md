# Felipe Hernández — Conceptual Sketch

Portfolio completo para oportunidades de empleo y proyectos freelance. React, TypeScript y Vite; diseño de cuaderno con bocetos SVG, papel cálido y tipografías locales.

## Desarrollo

```sh
npm ci
npm run dev
npm run build
```

La compilación queda en `dist/`. `docs/` contiene la misma versión preparada para GitHub Pages desde la rama main, carpeta /docs. Versión publicada en GitHub Pages: https://mrf3lipe.github.io/MrF3lipe/.

## Editar contenido

- `src/notebook/App.tsx`: portada, perfil, herramientas y proceso.
- `src/notebook/projects.ts`: proyectos destacados y enlaces; incluye ZoFloridane.
- `src/notebook/Sketch.tsx`: ilustraciones de los proyectos.
- `src/notebook/notebook.css`: diseño y adaptación a móvil.
- `src/notebook/Contact.tsx`: formulario y copia del correo.
- `src/data/content.ts`: correo y endpoint original de Formspree.

El formulario conserva el servicio existente e incluye validación, tiempo límite y estados de éxito/error. La entrega real del correo requiere que ese endpoint siga activo; no se han enviado mensajes de prueba.

Kitchen Cabinet no enlaza a ningún repositorio: el código (kitchen-gabinet) es privado. En la tarjeta se ve su construcción con capturas reales de la app. No se muestran descargas de APK porque los repositorios revisados no tienen APK publicadas en Releases. Actualizar o firmar las APK sigue siendo un trabajo separado.

Los bocetos son ilustraciones, no capturas de aplicaciones. No se incluyen métricas, clientes ni resultados inventados.

Los bocetos se construyen al tocarlos en cinco etapas y terminan en una vista ilustrada en color. El botón permite repetir; el enlace al sitio real se muestra por separado. Se retiró la sección Otros apuntes / Otras ideas.

Corrección: la construcción ahora descubre el sitio web REAL en un iframe, no una composición ilustrada. Se carga tras tocar el boceto, se revela por etapas y permite interactuar, ampliar o abrir en otra pestaña. Kitchen Cabinet mantiene su boceto de aplicación Android. La incrustación depende de que el destino permita frames; se ofrece siempre enlace directo.

La versión definitiva recrea la creación de la página: añade estructura HTML, aplica estilos reales, inserta textos e imágenes y finalmente conecta la web en vivo. Las escenas usan HTML público capturado en public/build-scenes; para reflejar cambios futuros de las webs hay que actualizar esas escenas.
