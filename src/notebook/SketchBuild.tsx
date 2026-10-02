import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, Pencil, RotateCcw, X } from 'lucide-react';
import Sketch from './Sketch';

type Props = { kind: 'hero' | 'dky' | 'kitchen' | 'kanban' | 'zofloridane'; title: string; href?: string };
const steps = ['Toca el boceto y dale vida', '01 / Creando los bloques HTML', '02 / Aplicando el diseño CSS', '03 / Insertando los textos', '04 / Incorporando las imágenes', '05 / Conectando la web real'];
export default function SketchBuild({ kind, title, href }: Props) {
  const [stage, setStage] = useState(0);
  const [run, setRun] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [scale, setScale] = useState(0.4);
  const canvas = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLIFrameElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const source = kind === 'hero' ? './?preview=1' : href;
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
    const timer = window.setTimeout(() => setSlow(true), 20000);
    return () => { window.removeEventListener('message', receive); window.clearTimeout(timer); };
  }, [run, loaded]);
  const start = () => { setStage(1); setLoaded(false); setSlow(false); setRun(value => value + 1); };
  if (!source || new URLSearchParams(window.location.search).has('preview')) return <><Sketch kind={kind} /><span className="art-caption">{kind === 'kitchen' ? 'una aplicación Android, en un boceto' : 'de la idea a la pantalla'}</span></>;
  return <div className={`sketch-build real-build build-${kind}`} data-stage={stage}>
    <div className="real-canvas" ref={canvas}>
      {run === 0 && <div className="build-drawing"><Sketch kind={kind} /></div>}
      {run > 0 && <div className="creation-workspace"><iframe ref={scene} key={run} title={`Creación paso a paso de ${title}`} src={`./build-scenes/${kind}.html`} sandbox="allow-scripts" style={{ width:1120, height:948, transform:`scale(${scale})` }} tabIndex={-1} />{stage === 5 && <iframe className={`creation-live ${loaded ? 'is-ready' : ''}`} title={`Sitio real de ${title}`} src={source} onLoad={() => { setLoaded(true); setSlow(false); }} style={{ width:1120, height:948, transform:`scale(${scale})` }} tabIndex={loaded ? 0 : -1} />}</div>}
      {stage === 0 && <button type="button" className="real-start" onClick={start} aria-label={`Construir el sitio real de ${title}`}><span className="build-invitation"><Pencil size={17} />Tócame. Construyamos la web real.</span></button>}
    </div>
    <div className="build-caption"><span role="status" aria-live="polite">{slow ? 'La web tarda en responder. Puedes abrirla directamente.' : steps[stage]}</span><div className="build-steps" aria-hidden="true">{[1,2,3,4,5].map(step => <i key={step} className={stage >= step ? 'done' : ''} />)}</div></div>
    {run > 0 && <div className="real-controls">{stage === 5 && <><button className="text-link" type="button" onClick={start}><RotateCcw size={14} /> Repetir construcción</button><button className="text-link" type="button" onClick={() => dialog.current?.showModal()}><Maximize2 size={14} /> Ampliar</button></>}<a className="text-link" href={kind === 'hero' ? '#projects' : source} target={kind === 'hero' ? undefined : '_blank'} rel="noopener noreferrer">{kind === 'hero' ? 'Explorar portfolio' : 'Abrir sitio real'} <ArrowUpRight size={14} /></a></div>}
    <dialog className="real-site-dialog" ref={dialog}><div className="real-dialog-bar"><strong>{title} · sitio real</strong><button type="button" autoFocus aria-label="Cerrar sitio ampliado" onClick={() => dialog.current?.close()}><X size={21} /></button></div>{run > 0 && <iframe title={`${title}, sitio ampliado`} src={source} loading="lazy" />}<p>Si el sitio no se muestra, <a href={source} target="_blank" rel="noopener noreferrer">ábrelo en su propia pestaña ↗</a>.</p></dialog>
  </div>;
}
