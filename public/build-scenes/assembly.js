(() => {
  const template = document.getElementById('creation-source');
  const source = template.content.querySelector('#creation-root');
  const fragment = document.createDocumentFragment();
  const textParts = [], mediaParts = [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const emit = stage => {
    document.documentElement.dataset.creation = String(stage);
    parent.postMessage({ type: 'notebook-creation', stage }, '*');
  };
  // Rebuild actual containers first; reserve media dimensions to keep the layout stable.
  const copy = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const placeholder = document.createTextNode('');
      if (node.textContent.trim()) textParts.push([placeholder, node.textContent]);
      else placeholder.textContent = node.textContent;
      return placeholder;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return document.createTextNode('');
    if (['IMG','SVG','VIDEO','PICTURE','CANVAS'].includes(node.tagName)) {
      const placeholder = node.cloneNode(false);
      placeholder.classList.add('creation-media-space');
      if (placeholder.tagName === 'IMG') {
        placeholder.removeAttribute('srcset');
        placeholder.removeAttribute('data-src');
        placeholder.removeAttribute('data-srcset');
        placeholder.alt = '';
        placeholder.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
      }
      mediaParts.push([placeholder, node.cloneNode(true)]);
      return placeholder;
    }
    const element = node.cloneNode(false);
    if (element.tagName === 'STYLE') { element.textContent = node.textContent; return element; }
    node.childNodes.forEach(child => element.append(copy(child)));
    return element;
  };
  if (!source) return;
  // Restore body classes used by the site's own stylesheet.
  for (const attribute of source.attributes) document.body.setAttribute(attribute.name, attribute.value);
  document.body.style.pointerEvents = 'none';
  source.childNodes.forEach(child => fragment.append(copy(child)));
  template.remove();
  document.body.prepend(fragment);
  document.querySelectorAll('header,nav,main,section,article,[class*="hero"],[class*="card"]').forEach(element => element.classList.add('creation-container'));
  emit(1);
  const insertTexts = () => textParts.forEach(([node, value], i) => later(() => { node.textContent = value; }, Math.min(i * 14, 1100)));
  const insertMedia = () => mediaParts.forEach(([placeholder, media], i) => later(() => {
    media.classList.add('creation-arrival');
    placeholder.replaceWith(media);
  }, Math.min(i * 90, 1400)));
  if (reduced) {
    textParts.forEach(([node,value]) => node.textContent = value);
    mediaParts.forEach(([node,media]) => node.replaceWith(media));
    emit(5);
  } else {
    later(() => emit(2), 1100);
    later(() => { emit(3); insertTexts(); }, 2400);
    later(() => { emit(4); insertMedia(); }, 4100);
    later(() => emit(5), 6000);
  }
  addEventListener('pagehide', () => timers.forEach(clearTimeout), { once:true });
})();
