import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github, Maximize2, Pencil, RotateCcw, X } from 'lucide-react';
import Sketch from './Sketch';

type Props = { kind: 'hero' | 'dky' | 'kitchen' | 'kanban' | 'zofloridane' | 'glamour'; title: string; href?: string; repo?: string };
const webSteps = ['Toca el boceto y dale vida', '01 / Bocetando la estructura', '02 / Dando color con CSS', '03 / Escribiendo los textos', '04 / Revelando las imágenes', '05 / ¡Listo! Conectando la web real'];
const siteSteps = ['Toca el boceto y dale vida', '01 / Bocetando la estructura', '02 / Dando color con CSS', '03 / Escribiendo los textos', '04 / Revelando las fotos', '05 / ¡Lista! Toca un teléfono'];
const appSteps = ['Toca el boceto y dale vida', '01 / Bocetando las pantallas', '02 / Aplicando la paleta de la app', '03 / Escribiendo los textos', '04 / Revelando las capturas', '05 / ¡App lista! Toca un teléfono'];
export default function SketchBuild({ kind, title, href, repo }: Props) {
  const [stage, setStage] = useState(0);
  const [run, setRun] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [scale, setScale] = useState(0.4);
  const [zoomed, setZoomed] = useState(false);
  const [theme, setTheme] = useState('light');
  const canvas = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLIFrameElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  // A live site to reveal at the end; apps without one stay on their own finished scene.
  const live = kind === 'hero' ? './?preview=1' : href;
  const sceneSrc = `./build-scenes/${kind}.html?theme=${theme}`;
  const isApp = kind === 'kitchen';
  const steps = live ? webSteps : isApp ? appSteps : siteSteps;
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1120));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!run || loaded) return;
    const receive = (event: MessageEvent) => {
      if (event.source !== scene.current?.contentWindow || event.data?.type !== 'notebook-creation') return;
      const next = event.data.stage;
      if (Number.isInteger(next) && next >= 1 && next <= 5) setStage(next);
    };
    window.addEventListener('message', receive);
    const timer = live ? window.setTimeout(() => setSlow(true), 25000) : 0;
    return () => { window.removeEventListener('message', receive); window.clearTimeout(timer); };
  }, [run, loaded, live]);
  const start = () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    setStage(1); setLoaded(false); setSlow(false); setRun(value => value + 1);
  };
  if (new URLSearchParams(window.location.search).has('preview')) return <><Sketch kind={kind} /><span className="art-caption">{kind === 'kitchen' ? 'una aplicación Android, en un boceto' : 'de la idea a la pantalla'}</span></>;
  const frame = { width: 1120, height: 948, transform: `scale(${scale})` };
  const finishedApp = !live && stage === 5;
  const exit = kind === 'hero' ? { href: '#projects', label: 'Explorar portfolio' } : live ? { href: live, label: 'Abrir sitio real' } : repo ? { href: repo, label: 'Ver código' } : null;
  return <div className={`sketch-build real-build build-${kind}`} data-stage={stage}>
    <div className="real-canvas" ref={canvas}>
      {run === 0 && <div className="build-drawing"><Sketch kind={kind} /></div>}
      {run > 0 && <div className={`creation-workspace${finishedApp ? ' is-interactive' : ''}`}><iframe ref={scene} key={run} title={`Creación paso a paso de ${title}`} src={sceneSrc} sandbox="allow-scripts" style={frame} tabIndex={finishedApp ? 0 : -1} />{live && stage === 5 && <iframe className={`creation-live ${loaded ? 'is-ready' : ''}`} title={`Sitio real de ${title}`} src={live} onLoad={() => { setLoaded(true); setSlow(false); }} style={frame} tabIndex={loaded ? 0 : -1} />}</div>}
      {stage === 0 && <button type="button" className="real-start" onClick={start} aria-label={live ? `Construir el sitio real de ${title}` : isApp ? `Construir la app ${title}` : `Construir la web ${title}`}><span className="build-invitation"><Pencil size={17} />{live ? 'Tócame. Construyamos la web real.' : isApp ? 'Tócame. Construyamos la app.' : 'Tócame. Construyamos la web.'}</span></button>}
    </div>
    <div className="build-caption"><span role="status" aria-live="polite">{slow ? 'La web tarda en responder. Puedes abrirla directamente.' : steps[stage]}</span><div className="build-steps" aria-hidden="true">{[1,2,3,4,5].map(step => <i key={step} className={stage >= step ? 'done' : ''} />)}</div></div>
    {run > 0 && <div className="real-controls">{stage === 5 && <><button className="text-link" type="button" onClick={start}><RotateCcw size={14} /> Repetir construcción</button><button className="text-link" type="button" onClick={() => { setZoomed(true); dialog.current?.showModal(); }}><Maximize2 size={14} /> Ampliar</button></>}{exit && <a className="text-link" href={exit.href} target={kind === 'hero' ? undefined : '_blank'} rel="noopener noreferrer">{!live && <Github size={14} />}{exit.label} <ArrowUpRight size={14} /></a>}</div>}
    <dialog className="real-site-dialog" ref={dialog} onClose={() => setZoomed(false)} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}><div className="real-dialog-bar"><strong>{title} · {live ? 'sitio real' : isApp ? 'la app' : 'la web'}</strong><button type="button" autoFocus aria-label="Cerrar vista ampliada" onClick={() => dialog.current?.close()}><X size={21} /></button></div>{zoomed && (live ? <iframe title={`${title}, sitio ampliado`} src={live} /> : <iframe title={`${title}, pantallas de ${isApp ? 'la app' : 'la web'}`} src={`${sceneSrc}&final=1`} sandbox="allow-scripts" />)}{live && <p>Si el sitio no se muestra, <a href={live} target="_blank" rel="noopener noreferrer">ábrelo en su propia pestaña ↗</a>.</p>}</dialog>
  </div>;
}
