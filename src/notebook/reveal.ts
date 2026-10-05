import { flushSync } from 'react-dom';

/**
 * Applies a page-wide change (theme, language) as a circle of the new page growing from the button.
 * Plain swap where View Transitions are missing or motion is reduced.
 */
export default function revealFrom(button: HTMLElement, update: () => void) {
  const apply = () => flushSync(update);
  const root = document.documentElement;
  const start = (document as Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } }).startViewTransition;
  if (!start || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return; }
  const { left, top, width, height } = button.getBoundingClientRect();
  const x = left + width / 2, y = top + height / 2;
  root.style.setProperty('--theme-x', `${x}px`);
  root.style.setProperty('--theme-y', `${y}px`);
  root.style.setProperty('--theme-r', `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
  root.classList.add('theme-switching');
  start.call(document, apply).finished.finally(() => root.classList.remove('theme-switching'));
}
