import { useEffect } from 'react';
import { animate, inView } from 'framer-motion';

/** One-time, progressively enhanced motion. Content remains readable without JS. */
export default function useNotebookMotion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations: ReturnType<typeof animate>[] = [];
    const stops: (() => void)[] = [];
    const touched = new Set<Element>();
    const clear = () => {
      stops.splice(0).forEach(stop => stop());
      animations.splice(0).forEach(animation => animation.stop());
      touched.forEach(element => {
        (element as HTMLElement).style.removeProperty('opacity');
        (element as HTMLElement).style.removeProperty('transform');
        element.classList.remove('ink-revealed');
      });
      touched.clear();
    };
    const start = () => {
      clear();
      if (preference.matches) return;
      const ease = [0.23, 1, 0.32, 1] as const;
      const selectors = '.hero-copy > *, .hero-art, .section-intro, .project-copy, .project-art-sheet, .archive-heading, .about-copy, .about-photo, .tools-heading, .tool-group, .process-step, .process-note, .contact-copy, .contact-form';
      document.querySelectorAll(selectors).forEach(element => {
        stops.push(inView(element, () => {
          touched.add(element);
          animations.push(animate(element, {
            opacity: [0.25, 1],
            transform: ['translateY(14px)', 'translateY(0px)'],
          }, { duration: 0.55, ease: [...ease], onComplete: () => {
            (element as HTMLElement).style.removeProperty('transform');
            (element as HTMLElement).style.removeProperty('opacity');
          } }));
          // No exit animation: reading and returning to content stays immediate.
        }, { amount: 0.12 }));
      });

    };
    start();
    preference.addEventListener('change', start);
    return () => { clear(); preference.removeEventListener('change', start); };
  }, []);
}

