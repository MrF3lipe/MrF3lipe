import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Github, Menu, Moon, Sun, X } from 'lucide-react';
import avatar from '../assets/avatar.jpg';
import kitchenLogo from '../assets/kitchen-gabinet.png';
import { projects } from './projects';
import { PencilArrow } from './Sketch';
import Contact from './Contact';
import useNotebookMotion from './useNotebookMotion';
import SketchBuild from './SketchBuild';
import revealFrom from './reveal';
import { LangProvider, useLang } from './i18n';

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
  // A circle of the new theme grows from the button.
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage blocked */ }
    revealFrom(event.currentTarget, () => { document.documentElement.dataset.theme = next; setTheme(next); });
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
/** The page turns to the other language the same way it turns to the other theme. */
function LangToggle() {
  const { lang, t, setLang } = useLang();
  const next = lang === 'es' ? 'en' : 'es';
  return <button className="lang-toggle" type="button" onClick={e => revealFrom(e.currentTarget, () => setLang(next))} aria-label={t.nav.language} title={t.nav.language}><span className={lang === 'es' ? 'is-current' : ''}>es</span><i aria-hidden="true">/</i><span className={lang === 'en' ? 'is-current' : ''}>en</span></button>;
}
function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const { tucked, scrolled } = useHeaderTucked(open || focused);
  useEffect(() => { const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; if (open) document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape); }, [open]);
  const links = [['projects', t.nav.projects], ['about', t.nav.about], ['tools', t.nav.tools], ['contact', t.nav.contact]];
  return <header className={`site-header${tucked ? ' is-tucked' : ''}${scrolled ? ' is-scrolled' : ''}`} onFocus={() => setFocused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}><nav className="nav page-width" aria-label={t.nav.label}><a className="signature" href="#top" onClick={() => setOpen(false)}><span>{t.nav.signature}</span><strong>Felipe Hernández<span className="signature-dot">.</span></strong></a><div className="nav-tools"><LangToggle /><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? t.nav.toLight : t.nav.toDark} title={theme === 'dark' ? t.nav.light : t.nav.dark}><span className="theme-icon" key={theme}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</span></button><button className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-nav" aria-label={open ? t.nav.closeMenu : t.nav.openMenu} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div><div className={`nav-links ${open ? 'is-open' : ''}`} id="main-nav">{links.map(([id, label]) => <a key={id} className={id === 'contact' ? 'nav-contact' : ''} href={`#${id}`} onClick={() => setOpen(false)}>{label}{id === 'contact' && <ArrowUpRight size={15} />}</a>)}<a className="nav-github" href="https://github.com/MrF3lipe" target="_blank" rel="noopener noreferrer" aria-label={t.nav.github}><Github size={19} /></a></div></nav></header>;
}
function Hero() {
  const { hero } = useLang().t;
  return <section className="hero page-width" id="top" aria-labelledby="hero-title"><div className="hero-copy"><p className="availability"><span />{hero.availability}</p><p className="handwritten hero-note">{hero.note}</p><h1 id="hero-title">{hero.title[0]}<br />{hero.title[1]}<br /><span className="hand-underline">{hero.titleMark}</span></h1><p className="hero-intro">{hero.intro}</p><div className="hero-actions"><a className="sketch-button" href="#projects">{hero.cta} <ArrowRight size={18} /></a><a className="text-link" href="#contact">{hero.talk} <ArrowUpRight size={16} /></a></div></div><div className="hero-art"><SketchBuild kind="hero" title={hero.artTitle} /><div className="sticky-note hero-sticky"><span className="note-pin" /><small>{hero.reminder}</small><p>{hero.motto[0]}<br />{hero.motto[1]}</p><span className="note-star">✳</span></div></div><div className="hero-foot"><a href="#projects"><ArrowDown size={15} /> {hero.browse}</a><span>{hero.place} <span className="tiny-star">✧</span> {hero.tagline}</span></div></section>;
}
function Projects() {
  const { lang, t } = useLang();
  const copy = t.projects;
  return <section className="projects-section" id="projects" aria-labelledby="projects-title"><div className="page-width"><header className="section-intro"><span className="page-index">{copy.index}</span><h2 id="projects-title">{copy.title[0]}<br />{copy.title[1]}<span className="highlight-word">{copy.titleMark}</span></h2><p>{copy.intro[0]}<br />{copy.intro[1]}</p><span className="margin-note">{copy.margin[0]}<br />{copy.margin[1]}</span></header>
    <div className="featured-projects">{projects.filter(p => p.featured).map((p, index) => {
      // English copy lives next to each project; anything it leaves out stays as written.
      const text = lang === 'en' ? { ...p, ...p.en } : p;
      return <article className={`featured-project project-${p.id}${index % 2 ? ' project-flip' : ''}`} key={p.id}><div className="project-art-sheet" style={{ '--project-wash': `var(--wash-${p.id})` } as CSSProperties}><span className="sheet-tape" aria-hidden="true" />{p.id === 'kitchen' && <img className="kitchen-logo" src={kitchenLogo} width="48" height="48" alt={copy.kitchenLogo} loading="lazy" />}<SketchBuild kind={p.id as 'dky' | 'kitchen' | 'kanban' | 'zofloridane' | 'glamour'} title={p.title} href={p.page} repo={p.repo} variant={p.variant} /></div><div className="project-copy"><div className="project-number"><span>{String(index + 1).padStart(2, '0')}</span><span>{text.kicker ?? (p.category === 'Android' ? copy.kickerApp : p.category === 'Web' && p.id !== 'kanban' ? copy.kickerShop : copy.kickerOther)}</span></div><h3>{p.title}</h3><p>{text.description}</p><ul className="project-tech" aria-label={copy.tech}>{text.tech.map(item => <li key={item}>{item}</li>)}</ul><div className="project-links">{p.page && <a className="text-link" href={p.page} target="_blank" rel="noopener noreferrer">{copy.see} <ArrowUpRight size={16} /></a>}{p.repo && <a className="text-link muted-link" href={p.repo} target="_blank" rel="noopener noreferrer"><Github size={15} />{p.category === 'Android' ? copy.androidCode : copy.code} <ArrowUpRight size={14} /></a>}</div><details className="project-notes"><summary>{copy.notes}</summary><ul>{text.features?.map(feature => <li key={feature}>{feature}</li>)}</ul></details><span className="project-hand-note">{text.note}</span></div></article>;
    })}</div>
  </div></section>;
}
function About() {
  const { about } = useLang().t;
  return <section id="about" className="about-section page-width" aria-labelledby="about-title"><div className="about-photo"><figure className="portrait-sheet"><span className="sheet-tape" aria-hidden="true" /><img src={avatar} width="400" height="400" alt={about.photo} loading="lazy" /><figcaption>{about.caption}</figcaption></figure><span className="photo-note">{about.me} <PencilArrow /></span><div className="location-stamp">CAMAGÜEY<br /><span>CUBA</span><span className="stamp-star">✧</span></div></div><div className="about-copy"><span className="page-index">{about.index}</span><h2 id="about-title">{about.title}<br /><span className="hand-parenthesis">{about.aside}</span></h2>{about.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<blockquote>{about.quote[0]}<br />{about.quote[1]}<span>{about.quoteNote}</span></blockquote><a className="text-link" href="#contact">{about.together} <ArrowUpRight size={17} /></a></div></section>;
}
function Tools() {
  const copy = useLang().t.tools;
  const groups = [['JavaScript', 'TypeScript', 'Python', 'GDScript'], ['React', 'Vue', 'HTML', 'CSS', 'Node.js', 'Express'], ['Kotlin', 'Jetpack Compose', 'Room', 'Capacitor'], ['Git', 'GitHub', 'Supabase', 'Godot']];
  return <section className="tools-section" id="tools" aria-labelledby="tools-title"><div className="page-width"><header className="tools-heading"><div><span className="page-index">{copy.index}</span><h2 id="tools-title">{copy.title}</h2></div><p>{copy.intro[0]}<br />{copy.intro[1]}</p></header><div className="tool-groups">{groups.map((tools, index) => <div className={`tool-group tool-group-${index}`} key={index}><span className="tool-number">{String(index + 1).padStart(2, '0')}.</span><h3>{copy.groups[index]}</h3><ul>{tools.map(tool => <li key={tool}>{tool}</li>)}</ul></div>)}</div><p className="tools-note handwritten">{copy.note}</p></div></section>;
}
function Process() {
  const { process } = useLang().t;
  return <section className="process-section page-width" aria-labelledby="process-title"><header className="section-intro"><span className="page-index">{process.index}</span><h2 id="process-title">{process.title[0]}<br />{process.title[1]}<span className="highlight-word">{process.titleMark}</span></h2></header><div className="process-steps">{process.steps.map(([title, label, copy], index) => <div className="process-step" key={index}><span className="step-circle">{index + 1}</span><h3>{title}</h3><strong>{label}</strong><p>{copy}</p>{index < 2 && <PencilArrow className="step-arrow" />}</div>)}</div><div className="process-note"><span>{process.question}</span><p>{process.answer}</p></div></section>;
}
function Footer() { const { footer, hero } = useLang().t; return <footer className="site-footer page-width"><a className="footer-signature" href="#top">Felipe Hernández.</a><span>{footer.made}<br />© {new Date().getFullYear()} · {hero.place}</span><a className="text-link" href="#top">{footer.top} <ArrowUp size={16} /></a></footer>; }
function Notebook() { useNotebookMotion(); const { t } = useLang(); return <><a href="#main" className="skip-link">{t.skip}</a><Navbar /><main id="main"><Hero /><Projects /><About /><Tools /><Process /><Contact /></main><Footer /></>; }
export default function App() { return <LangProvider><Notebook /></LangProvider>; }
