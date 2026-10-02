import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Github, Menu, Moon, Sun, X } from 'lucide-react';
import avatar from '../assets/avatar.jpg';
import kitchenLogo from '../assets/kitchen-gabinet.png';
import { projects } from './projects';
import { PencilArrow } from './Sketch';
import Contact from './Contact';
import useNotebookMotion from './useNotebookMotion';
import SketchBuild from './SketchBuild';

type Theme = 'light' | 'dark';
const THEME_KEY = 'notebook-theme';
/** The initial theme is set by an inline script in index.html, before the first paint. */
function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1d1b17' : '#f9f7ef');
  }, [theme]);
  useEffect(() => {
    // Follow the system until the visitor picks a theme themselves.
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const follow = () => { try { if (localStorage.getItem(THEME_KEY)) return; } catch { /* storage blocked */ } setTheme(query.matches ? 'dark' : 'light'); };
    // Embedded previews of this page pick up a theme chosen in the parent window.
    const sync = (event: StorageEvent) => { if (event.key === THEME_KEY && (event.newValue === 'dark' || event.newValue === 'light')) setTheme(event.newValue); };
    query.addEventListener('change', follow);
    window.addEventListener('storage', sync);
    return () => { query.removeEventListener('change', follow); window.removeEventListener('storage', sync); };
  }, []);
  // A circle of the new theme grows from the button; plain swap where View Transitions are missing.
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage blocked */ }
    const root = document.documentElement;
    const apply = () => { root.dataset.theme = next; flushSync(() => setTheme(next)); };
    const start = (document as Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } }).startViewTransition;
    if (!start || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return; }
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2, y = top + height / 2;
    root.style.setProperty('--theme-x', `${x}px`);
    root.style.setProperty('--theme-y', `${y}px`);
    root.style.setProperty('--theme-r', `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
    root.classList.add('theme-switching');
    start.call(document, apply).finished.finally(() => root.classList.remove('theme-switching'));
  };
  return [theme, toggle] as const;
}
/** Hides the header while reading down the page and brings it back on any upward scroll. */
function useHeaderTucked(locked: boolean) {
  const [tucked, setTucked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(window.scrollY, 0);
      const delta = y - last.current;
      setScrolled(y > 8);
      if (y < 120) setTucked(false);
      else if (delta > 6) setTucked(true);
      else if (delta < -6) setTucked(false);
      if (Math.abs(delta) > 6 || y < 120) last.current = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return { tucked: tucked && !locked, scrolled };
}
function Navbar() {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const { tucked, scrolled } = useHeaderTucked(open || focused);
  useEffect(() => { const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; if (open) document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape); }, [open]);
  return <header className={`site-header${tucked ? ' is-tucked' : ''}${scrolled ? ' is-scrolled' : ''}`} onFocus={() => setFocused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}><nav className="nav page-width" aria-label="Navegación principal"><a className="signature" href="#top" onClick={() => setOpen(false)}><span>el cuaderno de</span><strong>Felipe Hernández<span className="signature-dot">.</span></strong></a><div className="nav-tools"><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}><span className="theme-icon" key={theme}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</span></button><button className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-nav" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div><div className={`nav-links ${open ? 'is-open' : ''}`} id="main-nav">{[['projects', 'Proyectos'], ['about', 'Sobre mí'], ['tools', 'Herramientas'], ['contact', 'Hablemos']].map(([id, label]) => <a key={id} className={id === 'contact' ? 'nav-contact' : ''} href={`#${id}`} onClick={() => setOpen(false)}>{label}{id === 'contact' && <ArrowUpRight size={15} />}</a>)}<a className="nav-github" href="https://github.com/MrF3lipe" target="_blank" rel="noopener noreferrer" aria-label="Ver el perfil de Felipe en GitHub"><Github size={19} /></a></div></nav></header>;
}
function Hero() {
  return <section className="hero page-width" id="top" aria-labelledby="hero-title"><div className="hero-copy"><p className="availability"><span />Abierto a empleo y proyectos freelance</p><p className="handwritten hero-note">una nueva página empieza aquí</p><h1 id="hero-title">Una idea.<br />Un boceto.<br /><span className="hand-underline">Algo que funciona.</span></h1><p className="hero-intro">Soy Felipe, desarrollador frontend. Convierto problemas cotidianos en herramientas digitales que ayudan a las personas.</p><div className="hero-actions"><a className="sketch-button" href="#projects">Ver mis proyectos <ArrowRight size={18} /></a><a className="text-link" href="#contact">Hablemos <ArrowUpRight size={16} /></a></div></div><div className="hero-art"><SketchBuild kind="hero" title="Una idea que cobra vida" /><div className="sticky-note hero-sticky"><span className="note-pin" /><small>recordatorio:</small><p>Si funciona,<br />se puede mejorar.</p><span className="note-star">✳</span></div></div><div className="hero-foot"><a href="#projects"><ArrowDown size={15} /> seguir hojeando</a><span>Camagüey, Cuba <span className="tiny-star">✧</span> Diseño, código y curiosidad.</span></div></section>;
}
function Projects() {
  return <section className="projects-section" id="projects" aria-labelledby="projects-title"><div className="page-width"><header className="section-intro"><span className="page-index">01 / proyectos</span><h2 id="projects-title">Cosas que ya salieron<br />del <span className="highlight-word">cuaderno.</span></h2><p>De una necesidad real a algo que puedes usar.<br />Estos son algunos de mis proyectos.</p><span className="margin-note">menos promesas,<br />más cosas hechas ↙</span></header>
    <div className="featured-projects">{projects.filter(p => p.featured).map((p, index) => <article className={`featured-project project-${p.id}${index % 2 ? ' project-flip' : ''}`} key={p.id}><div className="project-art-sheet" style={{ '--project-wash': `var(--wash-${p.id})` } as CSSProperties}><span className="sheet-tape" aria-hidden="true" />{p.id === 'kitchen' && <img className="kitchen-logo" src={kitchenLogo} width="48" height="48" alt="Icono original de Kitchen Cabinet" loading="lazy" />}<SketchBuild kind={p.id as 'dky' | 'kitchen' | 'kanban' | 'zofloridane' | 'glamour'} title={p.title} href={p.page} repo={p.repo} variant={p.variant} /></div><div className="project-copy"><div className="project-number"><span>{String(index + 1).padStart(2, '0')}</span><span>{p.kicker ?? (p.category === 'Android' ? 'una app para el día a día' : p.category === 'Web' && p.id !== 'kanban' ? 'comercio que funciona' : 'un poco de organización')}</span></div><h3>{p.title}</h3><p>{p.description}</p><ul className="project-tech" aria-label="Tecnologías">{p.tech.map(t => <li key={t}>{t}</li>)}</ul><div className="project-links">{p.page && <a className="text-link" href={p.page} target="_blank" rel="noopener noreferrer">Ver proyecto <ArrowUpRight size={16} /></a>}{p.repo && <a className="text-link muted-link" href={p.repo} target="_blank" rel="noopener noreferrer"><Github size={15} />{p.category === 'Android' ? 'Ver código Android' : 'Código'} <ArrowUpRight size={14} /></a>}</div><details className="project-notes"><summary>Ver notas del proyecto</summary><ul>{p.features?.map(feature => <li key={feature}>{feature}</li>)}</ul></details><span className="project-hand-note">{p.note}</span></div></article>)}</div>
  </div></section>;
}
function About() {
  return <section id="about" className="about-section page-width" aria-labelledby="about-title"><div className="about-photo"><figure className="portrait-sheet"><span className="sheet-tape" aria-hidden="true" /><img src={avatar} width="400" height="400" alt="Felipe Hernández, fotografía del portfolio original" loading="lazy" /><figcaption>Felipe, detrás del código.</figcaption></figure><span className="photo-note">este soy yo <PencilArrow /></span><div className="location-stamp">CAMAGÜEY<br /><span>CUBA</span><span className="stamp-star">✧</span></div></div><div className="about-copy"><span className="page-index">02 / detrás de los bocetos</span><h2 id="about-title">Un poco de mí.<br /><span className="hand-parenthesis">(y de cómo trabajo)</span></h2><p>Me gusta crear cosas que sirven. Tiendas online, aplicaciones y herramientas que resuelven problemas reales, con interfaces claras y atención a los detalles.</p><p>Soy desarrollador frontend y disfruto el camino completo: entender qué hace falta, probar una idea, llevarla a código y mejorarla. Mi trabajo cruza la web, Android y, de vez en cuando, los juegos.</p><blockquote>«Si funciona,<br />se puede mejorar.»<span>una idea que me acompaña</span></blockquote><a className="text-link" href="#contact">¿Construimos algo juntos? <ArrowUpRight size={17} /></a></div></section>;
}
function Tools() {
  const groups = [['Lenguajes', ['JavaScript', 'TypeScript', 'Python', 'GDScript']], ['En la web', ['React', 'Vue', 'HTML', 'CSS', 'Node.js', 'Express']], ['En el bolsillo', ['Kotlin', 'Jetpack Compose', 'Room', 'Capacitor']], ['Para construir', ['Git', 'GitHub', 'Supabase', 'Godot']]] as const;
  return <section className="tools-section" id="tools" aria-labelledby="tools-title"><div className="page-width"><header className="tools-heading"><div><span className="page-index">03 / herramientas</span><h2 id="tools-title">Mi caja de herramientas.</h2></div><p>No todas las ideas necesitan lo mismo.<br />Elijo la herramienta según el problema.</p></header><div className="tool-groups">{groups.map(([name, tools], index) => <div className={`tool-group tool-group-${index}`} key={name}><span className="tool-number">{String(index + 1).padStart(2, '0')}.</span><h3>{name}</h3><ul>{tools.map(tool => <li key={tool}>{tool}</li>)}</ul></div>)}</div><p className="tools-note handwritten">y siempre hay espacio para aprender algo nuevo. ✧</p></div></section>;
}
function Process() {
  const steps = [['Escuchar.', 'Primero, entender.', 'Qué necesitas, quién lo va a usar y qué debería ser más sencillo. Las buenas preguntas ahorran vueltas.'], ['Dibujar.', 'Darle forma a la idea.', 'Bocetos, estructura y una primera propuesta. Algo que podamos ver, conversar y mejorar juntos.'], ['Construir.', 'Hacerlo funcionar.', 'Llevar la idea a código, cuidar los detalles y comprobar que la experiencia funciona de verdad.']];
  return <section className="process-section page-width" aria-labelledby="process-title"><header className="section-intro"><span className="page-index">04 / mi manera de trabajar</span><h2 id="process-title">Las buenas ideas<br />se hacen <span className="highlight-word">paso a paso.</span></h2></header><div className="process-steps">{steps.map(([title, label, copy], index) => <div className="process-step" key={title}><span className="step-circle">{index + 1}</span><h3>{title}</h3><strong>{label}</strong><p>{copy}</p>{index < 2 && <PencilArrow className="step-arrow" />}</div>)}</div><div className="process-note"><span>¿Un equipo o un proyecto independiente?</span><p>Me interesa aportar en ambos. Podemos empezar por una conversación.</p></div></section>;
}
function Footer() { return <footer className="site-footer page-width"><a className="footer-signature" href="#top">Felipe Hernández.</a><span>Hecho con código y curiosidad.<br />© {new Date().getFullYear()} · Camagüey, Cuba</span><a className="text-link" href="#top">Volver al principio <ArrowUp size={16} /></a></footer>; }
export default function App() { useNotebookMotion(); return <><a href="#main" className="skip-link">Saltar al contenido</a><Navbar /><main id="main"><Hero /><Projects /><About /><Tools /><Process /><Contact /></main><Footer /></>; }
