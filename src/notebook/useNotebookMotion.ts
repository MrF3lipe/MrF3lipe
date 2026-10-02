import { useEffect } from 'react';

const REVEAL = '.section-intro, .project-copy, .project-art-sheet, .about-copy, .about-photo, .tools-heading, .tool-group, .tools-note, .process-step, .process-note, .contact-copy, .contact-form';
const INK = '.sketch-art, .pencil-arrow';
const EASE = 'cubic-bezier(.23,1,.32,1)';

/**
 * One-time, progressively enhanced motion. Content remains readable without JS.
 * Only elements still below the fold get hidden, so nothing visible flashes out.
 * Animates the individual `translate` property, so each sheet keeps its CSS rotation.
 */
export default function useNotebookMotion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const animations: Animation[] = [];
    const below = (element: Element) => element.getBoundingClientRect().top > window.innerHeight * 0.92;
    const reveal = [...document.querySelectorAll<HTMLElement>(REVEAL)].filter(below);
    // The hero sketch draws itself on load through CSS.
    const ink = [...document.querySelectorAll(INK)].filter(element => !element.closest('.hero') && below(element));
    reveal.forEach(element => element.classList.add('reveal-pending'));
    ink.forEach(element => element.classList.add('ink-pending'));

    const observer = new IntersectionObserver(entries => {
      let order = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        if (element.classList.contains('ink-pending')) element.classList.replace('ink-pending', 'ink-revealed');
        if (!element.classList.contains('reveal-pending')) return;
        // Siblings entering together (tool groups, process steps) arrive one after another.
        animations.push(element.animate(
          [{ opacity: 0, translate: '0 18px' }, { opacity: 1, translate: '0 0' }],
          { duration: 650, delay: order++ * 90, easing: EASE, fill: 'backwards' },
        ));
        element.classList.remove('reveal-pending');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    [...reveal, ...ink].forEach(element => observer.observe(element));

    const showAll = () => {
      observer.disconnect();
      animations.splice(0).forEach(animation => animation.finish());
      reveal.forEach(element => element.classList.remove('reveal-pending'));
      ink.forEach(element => element.classList.remove('ink-pending', 'ink-revealed'));
    };
    const onChange = () => { if (preference.matches) showAll(); };
    preference.addEventListener('change', onChange);
    return () => { showAll(); preference.removeEventListener('change', onChange); };
  }, []);
}
