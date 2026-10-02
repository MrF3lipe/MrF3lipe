// Builds a page in front of the visitor, in the notebook's pencil style:
// 01 sketch the blocks · 02 paint the colours · 03 write the texts · 04 develop the images.
// Inlined into every scene by scripts/scenes.mjs; reports progress to the parent page.
(() => {
  const template = document.getElementById('creation-source');
  const source = template && template.content.querySelector('#creation-root');
  if (!source) return;
  const params = new URLSearchParams(location.search);
  const dark = params.get('theme') === 'dark';
  const instant = params.has('final') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const timers = [];
  let cancelled = false;
  const wait = ms => new Promise(resolve => timers.push(setTimeout(resolve, ms)));
  const emit = stage => {
    root.dataset.creation = String(stage);
    parent.postMessage({ type: 'notebook-creation', stage }, '*');
  };
  addEventListener('pagehide', () => { cancelled = true; timers.forEach(clearTimeout); }, { once: true });
  // data-theme lets the notebook's own stylesheet (hero scene) follow the visitor's theme too.
  if (dark) { root.dataset.sceneTheme = 'dark'; root.dataset.theme = 'dark'; }

  // Rebuild the real containers with empty texts and reserved media boxes.
  const textParts = [], mediaParts = [];
  const copy = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const placeholder = document.createTextNode('');
      if (node.textContent.trim()) textParts.push([placeholder, node.textContent]);
      else placeholder.textContent = node.textContent;
      return placeholder;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return document.createTextNode('');
    if (['IMG', 'VIDEO', 'PICTURE', 'CANVAS'].includes(node.tagName)) {
      const placeholder = node.cloneNode(false);
      placeholder.classList.add('creation-media-space');
      if (placeholder.tagName === 'IMG') {
        ['srcset', 'data-src', 'data-srcset'].forEach(name => placeholder.removeAttribute(name));
        placeholder.alt = '';
        placeholder.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
      }
      mediaParts.push([placeholder, node.cloneNode(true)]);
      return placeholder;
    }
    const element = node.cloneNode(false);
    if (element.tagName === 'STYLE' || element.tagName === 'SCRIPT') { element.textContent = node.textContent; return element; }
    node.childNodes.forEach(child => element.append(copy(child)));
    return element;
  };
  for (const attribute of source.attributes) if (attribute.name !== 'id') document.body.setAttribute(attribute.name, attribute.value);
  const interactive = document.body.hasAttribute('data-interactive');
  document.body.style.pointerEvents = 'none';
  const fragment = document.createDocumentFragment();
  source.childNodes.forEach(child => fragment.append(copy(child)));
  template.remove();
  document.body.prepend(fragment);
  const containers = [...document.querySelectorAll('header,nav,main,section,article,footer,aside,[class*="hero"],[class*="card"],[data-sketch]')];
  containers.forEach(element => element.classList.add('creation-container'));

  const finish = () => {
    textParts.forEach(([node, value]) => { node.textContent = value; });
    mediaParts.forEach(([placeholder, media]) => placeholder.replaceWith(media));
    containers.forEach(element => element.classList.add('is-sketched'));
    root.classList.remove('creation-paint');
    if (interactive) document.body.style.pointerEvents = '';
    emit(5);
  };
  if (instant) { finish(); return; }

  // ---- Measuring (before the wireframe hides colours) ----
  const W = innerWidth, H = innerHeight;
  const onScreen = rect => rect.width > 0 && rect.bottom > 0 && rect.top < H && rect.right > 0 && rect.left < W;
  // What can actually be seen of an element: clipped by every ancestor that hides its overflow.
  const box = element => {
    const rect = element.getBoundingClientRect();
    let { left, top, right, bottom } = rect;
    for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.overflowX === 'visible' && style.overflowY === 'visible') continue;
      const clip = node.getBoundingClientRect();
      left = Math.max(left, clip.left); top = Math.max(top, clip.top);
      right = Math.min(right, clip.right); bottom = Math.min(bottom, clip.bottom);
    }
    if (right <= left || bottom <= top) return { left, top, right: left, bottom: top, width: 0, height: 0 };
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  };
  const visible = containers
    .map(element => ({ element, rect: box(element) }))
    .filter(({ rect }) => onScreen(rect) && rect.width > 30 && rect.height > 16)
    .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
  // Colour starts at the top of the page and flows down.
  // Read every position first, then write, so the page is laid out only once.
  // Raw rects are enough for colour timing and the palette, and much cheaper on big pages.
  const raw = element => element.getBoundingClientRect();
  const delays = [...document.querySelectorAll('body *')].map(element => [element, raw(element)]).filter(([, rect]) => onScreen(rect));
  delays.forEach(([element, rect]) => element.style.setProperty('--d', `${(Math.max(rect.top, 0) / H * 0.85).toFixed(2)}s`));
  // The page's own palette, weighted by painted area.
  const palette = (() => {
    const areas = new Map();
    const add = (color, weight) => {
      const match = color.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
      if (!match || (match[4] !== undefined && +match[4] < 0.6)) return;
      const key = `rgb(${match[1]}, ${match[2]}, ${match[3]})`;
      areas.set(key, (areas.get(key) || 0) + weight);
    };
    add(getComputedStyle(document.body).backgroundColor, W * H);
    add(getComputedStyle(root).backgroundColor, W * H * 0.5);
    document.querySelectorAll('body *').forEach(element => {
      const rect = raw(element);
      if (!onScreen(rect)) return;
      const style = getComputedStyle(element);
      add(style.backgroundColor, rect.width * rect.height);
      if (/^H[1-3]$|^A$|^BUTTON$/.test(element.tagName)) add(style.color, 40000);
    });
    const rgb = key => key.match(/[\d.]+/g).map(Number);
    const distinct = [];
    [...areas.entries()].sort((a, b) => b[1] - a[1]).forEach(([key]) => {
      const [r, g, b] = rgb(key);
      if (distinct.length < 5 && distinct.every(other => { const [r2, g2, b2] = rgb(other); return Math.hypot(r - r2, g - g2, b - b2) > 48; })) distinct.push(key);
    });
    return distinct;
  })();

  // ---- The pencil layer, isolated from the page's own CSS ----
  const host = document.createElement('div');
  host.id = 'sketch-layer';
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
  const shadow = host.attachShadow({ mode: 'open' });
  const ink = dark ? '#e8c9a6' : '#8a5a3c';
  const fontUrl = new URL('fonts/caveat-latin-wght-normal.woff2', location.href).href;
  shadow.innerHTML = `<style>
    @font-face{font-family:SceneHand;src:url(${fontUrl}) format('woff2');font-weight:400 700}
    :host{all:initial}
    *{box-sizing:border-box}
    svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
    .rough{fill:none;stroke:${ink};stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1 2;stroke-dashoffset:1.02;animation:draw var(--t,.42s) cubic-bezier(.5,0,.3,1) forwards}
    .rough.faint{stroke-width:1.6;opacity:.45}
    .rough.ghost{opacity:.35;stroke-width:1.8}
    .fade{transition:opacity .6s ease}
    .label{position:absolute;font:600 34px/1 SceneHand,'Comic Sans MS',cursive;color:${ink};transform:rotate(-3deg);white-space:nowrap;opacity:0;animation:pop .35s cubic-bezier(.23,1,.32,1) forwards}
    .label::after{content:'';position:absolute;left:2px;right:-6px;bottom:-4px;height:2px;background:currentColor;opacity:.5;border-radius:2px}
    .pencil{position:absolute;left:0;top:0;width:86px;height:86px;transform:translate(-200px,-200px);will-change:transform;filter:drop-shadow(3px 6px 5px rgba(0,0,0,.18))}
    .pencil svg{position:static;width:86px;height:86px}
    .sweep{position:absolute;left:-5%;right:-5%;height:210px;top:-230px;background:linear-gradient(180deg,transparent,rgba(255,214,92,.28) 35%,rgba(255,214,92,.42) 70%,rgba(255,214,92,0));transform:rotate(-2deg);mix-blend-mode:multiply}
    .note{position:absolute;right:36px;bottom:40px;padding:22px 26px 20px;background:${dark ? '#5b4f2c' : '#f6e7a3'};color:${dark ? '#f3ead2' : '#3d3628'};font:600 36px/1 SceneHand,'Comic Sans MS',cursive;transform:rotate(3deg) translateY(30px);opacity:0;box-shadow:4px 8px 14px rgba(0,0,0,.16);transition:transform .5s cubic-bezier(.23,1,.32,1),opacity .4s ease}
    .note.show{transform:rotate(3deg);opacity:1}
    .note .swatches{display:flex;gap:12px;margin-top:14px}
    .note i{width:42px;height:42px;border-radius:47% 53% 45% 55%;border:2px solid ${dark ? '#f3ead2' : '#3d3628'};transform:scale(0);animation:swatch .45s cubic-bezier(.34,1.56,.64,1) forwards}
    .caret{position:absolute;width:3px;height:30px;background:${ink};border-radius:2px;animation:blink .7s steps(1) infinite;visibility:hidden;transition:transform .09s linear}
    .done{position:absolute;font:700 64px/1 SceneHand,'Comic Sans MS',cursive;color:${ink};transform:rotate(-6deg);opacity:0;animation:pop .45s cubic-bezier(.34,1.56,.64,1) forwards}
    @keyframes draw{to{stroke-dashoffset:0}}
    @keyframes pop{from{opacity:0;transform:rotate(-3deg) translateY(8px) scale(.9)}to{opacity:1}}
    @keyframes swatch{to{transform:scale(1)}}
    @keyframes blink{50%{opacity:0}}
  </style>
  <svg class="sketches" viewBox="0 0 ${W} ${H}"></svg>
  <div class="sweep"></div>
  <div class="caret"></div>
  <div class="pencil"><svg viewBox="0 0 86 86" fill="none" stroke="${dark ? '#f3ead2' : '#2f2a22'}" stroke-width="2" stroke-linejoin="round">
    <path d="M6 80 14 58 64 8a7 7 0 0 1 10 0l4 4a7 7 0 0 1 0 10L28 72Z" fill="${dark ? '#c9a24a' : '#f2c94c'}"/>
    <path d="M58 14l14 14" /><path d="M64 8a7 7 0 0 1 10 0l4 4a7 7 0 0 1 0 10l-6 6-14-14Z" fill="#e8a0a0"/>
    <path d="M6 80 14 58l14 14Z" fill="#f4dcb4"/><path d="M6 80l4-11 7 7Z" fill="#2f2a22"/>
  </svg></div>`;
  root.append(host);
  const sketches = shadow.querySelector('.sketches');
  const pencil = shadow.querySelector('.pencil');
  const caret = shadow.querySelector('.caret');
  const svgNS = 'http://www.w3.org/2000/svg';
  // The pencil's tip sits at the bottom-left corner of its drawing.
  const tip = (x, y) => `translate(${x - 6}px, ${y - 80}px) rotate(${-4 + Math.sin(x / 90) * 4}deg)`;
  const movePencil = (x, y, ms = 260) => pencil.animate([{ transform: getComputedStyle(pencil).transform }, { transform: tip(x, y) }], { duration: ms, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' });
  const jitter = (amount = 2.5) => (Math.random() - 0.5) * amount * 2;
  const roughRect = (rect, className = '', duration = 420) => {
    const x1 = Math.max(rect.left, 4), y1 = Math.max(rect.top, 4), x2 = Math.min(rect.right, W - 4), y2 = Math.min(rect.bottom, H - 4);
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', `M${x1 + jitter()} ${y1 + jitter()} L${x2 + jitter()} ${y1 + jitter()} L${x2 + jitter()} ${y2 + jitter()} L${x1 + jitter()} ${y2 + jitter()} Z M${x1 - 5} ${y1 + 3} L${x1 + 22} ${y1 + jitter(1)}`);
    path.setAttribute('pathLength', '1');
    path.setAttribute('class', `rough fade ${className}`);
    path.style.setProperty('--t', `${duration}ms`);
    sketches.append(path);
    return { path, corners: [[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]] };
  };
  const tracePencil = (corners, duration) => pencil.animate(corners.map(([x, y]) => ({ transform: tip(x, y) })), { duration, easing: 'linear', fill: 'forwards' });
  const label = (text, x, y) => {
    const element = document.createElement('div');
    element.className = 'label fade';
    element.textContent = text;
    element.style.left = `${Math.min(Math.max(x, 10), W - 220)}px`;
    element.style.top = `${Math.min(Math.max(y - 40, 6), H - 50)}px`;
    // Once it has popped in, hand opacity back to the fade transition.
    element.addEventListener('animationend', () => { element.style.opacity = '1'; element.style.animation = 'none'; }, { once: true });
    shadow.append(element);
    return element;
  };
  const nameFor = element => {
    if (element.dataset.sketch) return element.dataset.sketch;
    const tag = element.tagName.toLowerCase(), cls = String(element.className);
    if (tag === 'nav') return 'menú';
    if (tag === 'header') return 'cabecera';
    if (tag === 'footer') return 'pie';
    if (/hero/i.test(cls)) return 'portada';
    if (/card/i.test(cls) || tag === 'article') return 'tarjeta';
    if (tag === 'section' || tag === 'main') return 'sección';
    return '';
  };
  const reveal = element => { for (let node = element; node && node !== document.body; node = node.parentElement) if (node.classList.contains('creation-container')) node.classList.add('is-sketched'); };

  const run = async () => {
    // ---- 01 · Sketching the structure ----
    emit(1);
    containers.forEach(element => { if (!onScreen(box(element))) element.classList.add('is-sketched'); });
    pencil.style.transform = tip(W * 0.62, H + 60);
    // The biggest visible blocks get the pencil and a name; the rest just appear in reading order.
    // Big pages repaint slowly, so the pencil visits fewer blocks there.
    const heavy = document.getElementsByTagName('*').length > 2500;
    // Blocks the scene names itself come first, then the largest ones.
    const area = ({ rect }) => rect.width * rect.height;
    const named = ({ element }) => (element.dataset.sketch ? 1 : 0);
    const featured = new Set([...visible].sort((a, b) => named(b) - named(a) || area(b) - area(a)).slice(0, heavy ? 5 : 7).map(item => item.element));
    const started = performance.now();
    // Secondary blocks share at most 1.6 s, however many a page has.
    const quietCount = visible.filter(({ element }) => !featured.has(element)).length;
    const quietStep = Math.min(45, 1600 / Math.max(quietCount, 1));
    const labelled = new Map();
    const placed = [];
    let quiet = 0;
    for (const { element, rect } of visible) {
      if (cancelled) return;
      if (!featured.has(element)) {
        timers.push(setTimeout(() => { reveal(element); roughRect(rect, 'faint', 320); }, 120 + quiet++ * quietStep));
        continue;
      }
      // Wait on timers, not on animation promises: an off-screen iframe pauses its animations.
      movePencil(rect.left, rect.top, 170);
      await wait(170);
      const { corners } = roughRect(rect, '', 380);
      tracePencil(corners, 380);
      reveal(element);
      const name = nameFor(element);
      const crowded = placed.some(([x, y]) => Math.abs(x - rect.left) < 170 && Math.abs(y - rect.top) < 60);
      // Page-wide wrappers are obvious; their names would only crowd the corner.
      const wrapper = rect.width * rect.height > W * H * 0.6;
      if (name && !crowded && !wrapper && (labelled.get(name) || 0) < 2) {
        labelled.set(name, (labelled.get(name) || 0) + 1);
        placed.push([rect.left, rect.top]);
        label(name, rect.left + 14, rect.top + 4);
      }
      await wait(280);
    }
    await wait(Math.max(0, started + 120 + quiet * quietStep + 320 - performance.now()));
    containers.forEach(element => element.classList.add('is-sketched'));
    await wait(250);

    // ---- 02 · Painting with CSS ----
    root.classList.add('creation-paint');
    emit(2);
    shadow.querySelectorAll('.fade').forEach(element => { element.style.opacity = element.classList.contains('label') ? '0' : '.28'; });
    shadow.querySelector('.sweep').animate([{ top: '-230px' }, { top: `${H + 40}px` }], { duration: 1150, easing: 'cubic-bezier(.45,0,.4,1)', fill: 'forwards' });
    pencil.animate([{ transform: tip(W - 120, -40) }, { transform: tip(W - 150, H * 0.55) }, { transform: tip(W - 110, H + 90) }], { duration: 1150, easing: 'ease-in-out', fill: 'forwards' });
    if (palette.length) {
      const note = document.createElement('div');
      note.className = 'note';
      note.innerHTML = `paleta<div class="swatches">${palette.map((color, i) => `<i style="background:${color};animation-delay:${250 + i * 110}ms"></i>`).join('')}</div>`;
      shadow.append(note);
      await wait(380);
      note.classList.add('show');
      await wait(1250);
    } else await wait(1300);

    // ---- 03 · Writing the texts ----
    emit(3);
    const positioned = textParts.map(([node, value]) => ({ node, value, rect: node.parentElement ? box(node.parentElement) : { top: H + 1 } }));
    const typed = positioned.filter(item => onScreen(item.rect) && item.rect.width > 0).sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left).slice(0, 16);
    const typedSet = new Set(typed);
    positioned.forEach(item => { if (!typedSet.has(item)) item.node.textContent = item.value; });
    caret.style.visibility = 'visible';
    let latest = null;
    const typing = typed.map((item, index) => (async () => {
      await wait(index * 85);
      const total = Math.min(item.value.length, 70);
      const step = Math.max(10, Math.min(24, 900 / total));
      for (let shown = 1; shown <= total && !cancelled; shown++) {
        item.node.textContent = item.value.slice(0, shown);
        latest = item;
        await wait(step);
      }
      item.node.textContent = item.value;
    })());
    // Caret and pencil follow whatever is being written right now.
    const follow = setInterval(() => {
      if (!latest || !latest.node.isConnected || !latest.node.length) return;
      const range = document.createRange();
      range.setStart(latest.node, Math.max(latest.node.length - 1, 0));
      range.setEnd(latest.node, latest.node.length);
      const rect = range.getBoundingClientRect();
      if (!rect.height) return;
      caret.style.height = `${Math.min(Math.max(rect.height, 18), 70)}px`;
      caret.style.transform = `translate(${rect.right + 2}px, ${rect.top}px)`;
      pencil.style.transform = tip(rect.right + 10, rect.bottom);
      pencil.getAnimations().forEach(animation => animation.cancel());
    }, 40);
    await Promise.all(typing);
    clearInterval(follow);
    caret.style.visibility = 'hidden';
    await wait(250);

    // ---- 04 · Placing the images ----
    emit(4);
    shadow.querySelector('.note')?.classList.remove('show');
    const media = mediaParts.map(([placeholder, element]) => ({ placeholder, element, rect: box(placeholder) }));
    const shown = media.filter(item => onScreen(item.rect) && item.rect.width > 12 && item.rect.height > 12).slice(0, 8);
    const shownSet = new Set(shown);
    media.forEach(item => { if (!shownSet.has(item)) item.placeholder.replaceWith(item.element); });
    for (const [index, item] of shown.entries()) {
      if (cancelled) return;
      const { rect } = item;
      const { path, corners } = roughRect(rect, '', 300);
      const cross = document.createElementNS(svgNS, 'path');
      const mx = rect.left + rect.width * 0.35, my = rect.top + rect.height * 0.7;
      cross.setAttribute('d', `M${rect.left + 8} ${rect.bottom - 8} L${mx} ${my - rect.height * 0.25} L${mx + rect.width * 0.15} ${my - rect.height * 0.08} L${rect.left + rect.width * 0.7} ${rect.top + rect.height * 0.35} L${rect.right - 8} ${rect.bottom - 8} M${rect.right - rect.width * 0.22} ${rect.top + rect.height * 0.25} m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0`);
      cross.setAttribute('pathLength', '1');
      cross.setAttribute('class', 'rough fade');
      cross.style.setProperty('--t', '420ms');
      cross.style.animationDelay = '200ms';
      sketches.append(cross);
      if (index < 4) { movePencil(rect.left, rect.top, 160); await wait(160); tracePencil(corners, 300); }
      timers.push(setTimeout(() => {
        item.element.classList.add('creation-arrival');
        item.placeholder.replaceWith(item.element);
        path.style.opacity = '0';
        cross.style.opacity = '0';
      }, 650));
      await wait(index < 4 ? 320 : 90);
    }
    await wait(shown.length ? 900 : 300);

    // ---- Done: a checkmark and a signature ----
    shadow.querySelectorAll('.fade').forEach(element => { element.style.opacity = '0'; });
    const check = document.createElementNS(svgNS, 'path');
    check.setAttribute('d', `M${W - 250} ${H - 150} l34 40 l78 -100`);
    check.setAttribute('pathLength', '1');
    check.setAttribute('class', 'rough');
    check.style.strokeWidth = '7';
    check.style.setProperty('--t', '420ms');
    sketches.append(check);
    tracePencil([[W - 250, H - 150], [W - 216, H - 110], [W - 138, H - 210]], 420);
    const done = document.createElement('div');
    done.className = 'done';
    done.textContent = interactive ? '¡lista!' : '¡listo!';
    done.style.left = `${W - 300}px`;
    done.style.top = `${H - 100}px`;
    shadow.append(done);
    await wait(520);
    pencil.animate([{ transform: getComputedStyle(pencil).transform }, { transform: tip(W + 120, H + 120) }], { duration: 500, easing: 'ease-in', fill: 'forwards' });
    finish();
    await wait(1400);
    host.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
  };
  run();
})();
