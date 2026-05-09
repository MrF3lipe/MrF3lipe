# Felipe Hernández — Portfolio

Sitio personal estático construido con **Vite + React + TypeScript**, listo para desplegar en **GitHub Pages** sin configuración de servidor.

## Características

- 100% estático (HTML/CSS/JS) — no requiere backend.
- Routing con `HashRouter` (URLs tipo `/#/`) — sin errores 404 al refrescar.
- Todos los assets con rutas relativas (`./assets/...`).
- 5 estilos visuales conmutables: Glass, Neumorphic, Terminal, Minimal, Synthwave.
- Modo claro/oscuro con persistencia (`localStorage`) y respeto a `prefers-color-scheme`.
- Animaciones con `framer-motion`, mobile-first, totalmente responsive.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Salida: carpeta `dist/` con todo lo necesario (incluye `.nojekyll`).

---

## Despliegue en GitHub Pages

Existen dos métodos. Ambos funcionan porque `vite.config.ts` define `base: "./"`.

### Opción A — Carpeta `/docs` (la más simple)

1. `npm run build`
2. Renombra/copia el `dist/` resultante a `docs/` en la raíz de tu repo:
   ```bash
   rm -rf docs && cp -r dist docs
   ```
3. Asegúrate de que `docs/.nojekyll` existe (ya viene incluido).
4. Commit + push:
   ```bash
   git add docs && git commit -m "deploy" && git push
   ```
5. En GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `/docs`**.
6. Visita `https://<usuario>.github.io/<repo>/`.

### Opción B — Rama `gh-pages`

1. `npm install -D gh-pages`
2. Añade a `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist -t true"
   }
   ```
   El flag `-t true` incluye archivos ocultos como `.nojekyll`.
3. `npm run deploy`
4. En GitHub: **Settings → Pages → Branch: `gh-pages` / `/ (root)`**.

### Opción C — Deploy manual rápido

Sube el contenido de `dist/` (no la carpeta, sino su contenido) a la rama configurada para Pages.

---

## ¿Por qué funciona en GitHub Pages?

| Decisión | Razón |
|---|---|
| `base: "./"` en Vite | Todas las URLs en `index.html` son relativas, así funciona en cualquier subpath (`/repo-name/`). |
| `HashRouter` | Las rutas viven en el fragmento `#/...`, que el navegador no envía al servidor → no hay 404. |
| `.nojekyll` | Evita que GitHub procese archivos con `_` (Vite genera `_assets`). |
| Sin `process.env`, sin SSR | Todo el código es cliente puro. |

---

## Estructura

```
felipe-portfolio/
  public/.nojekyll
  src/
    components/      # Navbar, Hero, About, TechStack, Projects, GitHubStats, Contact, Footer
    themes/          # 5 archivos CSS, uno por estilo
    context/         # ThemeContext (estilo + modo)
    data/            # content.ts, projects.ts, techStack.ts (edita aquí)
    hooks/Reveal.tsx # animación de aparición
    App.tsx, main.tsx, index.css
  vite.config.ts     # base: "./"
```

Más detalles en [`DOCUMENTATION.md`](./DOCUMENTATION.md).

## Personalizar

- **Texto:** `src/data/content.ts`
- **Proyectos:** `src/data/projects.ts`
- **Stack:** `src/data/techStack.ts`
- **Estilos:** `src/themes/*.css` (modifica variables CSS)
- **Formspree:** reemplaza `formspreeEndpoint` en `content.ts` por tu endpoint real.

---

Hecho con ❤️ por Felipe Hernández.
