# Documentación — Portfolio Felipe Hernández

Documentación técnica completa del proyecto.

## Tabla de contenidos

1. [Visión general](#visión-general)
2. [Stack técnico](#stack-técnico)
3. [Estructura de carpetas](#estructura-de-carpetas)
4. [Sistema de temas (5 estilos)](#sistema-de-temas)
5. [Modo claro/oscuro](#modo-claroscuro)
6. [Routing y compatibilidad GitHub Pages](#routing-y-compatibilidad-github-pages)
7. [Componentes](#componentes)
8. [Datos y contenido](#datos-y-contenido)
9. [Animaciones](#animaciones)
10. [Formulario de contacto](#formulario-de-contacto)
11. [Internacionalización](#internacionalización)
12. [Cómo añadir un nuevo estilo](#cómo-añadir-un-nuevo-estilo)
13. [Cómo añadir una sección/ruta nueva](#cómo-añadir-una-sección-o-ruta-nueva)
14. [Solución de problemas](#solución-de-problemas)

---

## Visión general

Sitio estático one-page con navegación interna por scroll suave. Construido para deploy en **GitHub Pages** sin ningún servidor, base de datos ni función serverless. Todo es HTML, CSS y JS empaquetado por Vite.

Principios:
- **Cero backend.** Cualquier interacción dinámica usa servicios externos vía AJAX (Formspree, badges de imagen).
- **Cero rutas absolutas.** Todo es relativo (`./...`) para funcionar en `https://usuario.github.io/repo/`.
- **Tematización por CSS variables.** Cambiar de estilo no recompila — sólo intercambia un atributo `data-theme` en `<html>`.

## Stack técnico

| Capa | Tecnología | Por qué |
|---|---|---|
| Build | Vite 5 | Genera bundle estático con paths relativos. |
| UI | React 18 + TypeScript | Componentes tipados. |
| Routing | react-router-dom v6 (HashRouter) | Compatible con Pages sin trucos de 404. |
| Estilos | Tailwind CSS 3 + CSS variables | Utilidades + theming dinámico. |
| Animación | framer-motion | Fade-in on scroll. |
| Iconos | lucide-react, react-icons (Simple Icons) | UI + logos de marca. |

## Estructura de carpetas

```
felipe-portfolio/
├── public/
│   ├── .nojekyll          # Necesario en Pages para servir _assets/
│   └── favicon.svg
├── src/
│   ├── assets/            # (vacío; añade imágenes aquí, importa con import img from "./assets/x.png")
│   ├── components/        # Componentes de UI por sección
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── data/              # Toda la copia y datos editables
│   ├── hooks/
│   │   └── Reveal.tsx     # Wrapper de animación on-scroll
│   ├── themes/            # 5 archivos CSS, uno por estilo
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts         # base: "./"
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## Sistema de temas

Cada estilo es un archivo `src/themes/<nombre>.css` que define un bloque:

```css
:root[data-theme="<nombre>"] {
  --bg, --surface, --text, --muted, --accent, --accent2,
  --border, --shadow-card, --radius, --backdrop,
  --font-display, --font-body
}
:root[data-theme="<nombre>"].dark { /* overrides modo oscuro */ }
```

Estilos incluidos:

| ID | Nombre | Estética |
|---|---|---|
| `glass` | Modern Glass | Glassmorphism + gradiente índigo/rosa (default). |
| `neumorphic` | Neumorphic Soft | Sombras suaves bicolores, pasteles. |
| `terminal` | Terminal Hacker | Verde sobre negro, monospace, scanlines. |
| `minimal` | Minimal Mono | Editorial b/n, cero sombras, serif display. |
| `synthwave` | Sunset Synthwave | Neón rosa/cyan, grid retro. |

`ThemeContext` aplica el atributo `data-theme="<id>"` en `<html>` y persiste en `localStorage` (`fh_theme`).

## Modo claro/oscuro

`ThemeContext` también gestiona `mode: "light" | "dark"`:
- Inicializa desde `localStorage` (`fh_mode`) o `prefers-color-scheme`.
- Aplica/quita la clase `.dark` en `<html>`.
- Cada theme define overrides bajo `:root[data-theme="x"].dark`.

## Routing y compatibilidad GitHub Pages

Tres claves:

1. **`base: "./"`** en `vite.config.ts` → Vite emite `<script src="./assets/x.js">` en lugar de `/assets/x.js`. Sin esto, una app servida en `usuario.github.io/repo/` recibe 404 en cada asset.
2. **`HashRouter`** → todas las rutas viven después de `#`. El servidor sólo ve `/index.html`, así que cualquier deep link o refresh funciona sin configurar redirects.
3. **`public/.nojekyll`** → sin este archivo, GitHub Pages aplica Jekyll que ignora carpetas que empiezan con `_`. Vite genera por defecto `assets/` (sin underscore), pero `.nojekyll` evita problemas con cualquier asset oculto y futuras versiones.

## Componentes

| Archivo | Rol |
|---|---|
| `Navbar.tsx` | Navegación sticky + selector de tema + toggle modo + menú móvil. |
| `Hero.tsx` | Cabecera con foto, nombre, role, tagline, CTAs, links sociales. |
| `About.tsx` | Bio + avatar. |
| `TechStack.tsx` | Grid de tecnologías con icono y color de marca. |
| `Projects.tsx` | Cards de proyectos destacados. |
| `GitHubStats.tsx` | Embeds de github-readme-stats, streak, trophy y visitor counter. |
| `Contact.tsx` | Email copiable, link GitHub, formulario Formspree. |
| `Footer.tsx` | Crédito + links. |

Cada sección tiene `id` (`hero`, `about`, `stack`, `projects`, `stats`, `contact`) usado por la navegación scroll.

## Datos y contenido

Todo el texto editable vive en `src/data/`:

- **`content.ts`** — strings, foto, email, GitHub, endpoint Formspree.
- **`projects.ts`** — array de proyectos.
- **`techStack.ts`** — array de tecnologías.

Edita estos archivos para personalizar — no toques los componentes salvo cambios estructurales.

## Animaciones

`src/hooks/Reveal.tsx` envuelve cualquier hijo con `framer-motion`:
- `initial: { opacity: 0, y: 24 }` → `whileInView: { opacity: 1, y: 0 }`.
- `viewport: { once: true, amount: 0.2 }` → se anima sólo la primera vez.
- Acepta `delay` para escalonar grupos (usado en grids).

Microinteracciones extra: `hover:-translate-y-1` en cards y botones, `transition-opacity` en links.

## Formulario de contacto

Cliente puro: `fetch(formspreeEndpoint, { method: "POST", body: FormData })`.
- Si el endpoint contiene `REPLACE_ME`, muestra mensaje de configuración.
- Sin endpoint válido, los visitantes pueden usar el botón "Copiar email" o el `mailto:`.

Para activar:
1. Regístrate en [formspree.io](https://formspree.io).
2. Copia tu endpoint (ej. `https://formspree.io/f/abcdwxyz`).
3. Pégalo en `src/data/content.ts` → `formspreeEndpoint`.

## Internacionalización

Toda la copia está aislada en `content.ts`. Para añadir inglés:
1. Crea `src/data/content.en.ts` con la misma estructura.
2. Añade un toggle de idioma (similar al de tema) que cambie el import.
3. (Opcional) Migra a `react-i18next` si necesitas plurales o interpolación.

## Cómo añadir un nuevo estilo

1. Crea `src/themes/mi-estilo.css` con el bloque `:root[data-theme="mi-estilo"] { ... }`.
2. Impórtalo en `src/index.css`.
3. Añade `{ id: "mi-estilo", label: "Mi Estilo", description: "..." }` al array `THEMES` en `ThemeContext.tsx`.
4. Listo — aparece automáticamente en el selector.

## Cómo añadir una sección o ruta nueva

**Sección en la home** (recomendado):
1. Crea `src/components/MiSeccion.tsx` con `<section id="mi-seccion">...`.
2. Inclúyela en `App.tsx` dentro de `<Home>`.
3. Añade `{ id: "mi-seccion", label: "..." }` a `sections` en `Navbar.tsx`.

**Ruta separada** (HashRouter):
1. Crea componente en `src/pages/`.
2. Añade `<Route path="/mi-ruta" element={<MiPagina />} />` en `App.tsx`.
3. Navega con `<Link to="/mi-ruta">` — la URL será `/#/mi-ruta`.

## Solución de problemas

| Problema | Solución |
|---|---|
| Pantalla blanca en Pages | Confirma `base: "./"` y rebuild. Inspecciona Network: si pide `/assets/...` sin tu repo, falta `base`. |
| 404 en assets `_assets/` | Falta `.nojekyll` en la raíz publicada. |
| Refresh da 404 | Estás usando `BrowserRouter` por error — debe ser `HashRouter`. |
| Imágenes locales no salen | Importa con `import img from "./assets/x.png"` (Vite las hashea). NO uses `src="/assets/x.png"`. |
| Stats de GitHub no cargan | Los servicios externos pueden ir lentos en cold start; recarga. |

---

¿Dudas? Abre un issue en el repo o escríbeme: felipe.hdez.522@email.com
