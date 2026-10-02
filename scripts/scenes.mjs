// Prepares public/build-scenes before a build:
// - inlines assembly.css/js into every scene (scenes with <base href> can't load them by URL);
// - copies the notebook stylesheet to hero.css so the hero scene matches the live page.
// Run with: npm run scenes
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = new URL('../public/build-scenes/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const css = readFileSync(join(dir, 'assembly.css'), 'utf8').trim();
const js = readFileSync(join(dir, 'assembly.js'), 'utf8').trim();
const block = (name, tag, content) => `<!--assembly-${name}--><${tag}>\n${content}\n</${tag}><!--/assembly-${name}-->`;

for (const file of readdirSync(dir).filter(name => name.endsWith('.html'))) {
  const path = join(dir, file);
  let html = readFileSync(path, 'utf8');
  // First run: replace the legacy inline copies; later runs: replace between markers.
  html = html
    .replace(/<!--assembly-css-->[\s\S]*?<!--\/assembly-css-->|<style>html\{scroll-behavior:auto!important\}[\s\S]*?<\/style>/, () => block('css', 'style', css))
    .replace(/<!--assembly-js-->[\s\S]*?<!--\/assembly-js-->|<script>\s*(?:\/\/[^\n]*\n\s*)*\(\(\) => \{\s*const template = document\.getElementById\('creation-source'\)[\s\S]*?<\/script>/, () => block('js', 'script', js))
    .replace(/<div id="codex-browser-sidebar-comments-root"[^>]*><\/div>/g, '');
  if (!html.includes('<!--assembly-css-->') || !html.includes('<!--assembly-js-->')) throw new Error(`${file}: assembly blocks not found`);
  writeFileSync(path, html);
  console.log(`scene ready: ${file}`);
}

const notebook = readFileSync(new URL('../src/notebook/notebook.css', import.meta.url), 'utf8')
  .replace(/url\('\.\.\/\.\.\/node_modules\/@fontsource-variable\/(\w+)\/files\/([\w-]+\.woff2)'\)/g, "url('fonts/$2')");
writeFileSync(join(dir, 'hero.css'), notebook);
console.log('hero.css synced');
