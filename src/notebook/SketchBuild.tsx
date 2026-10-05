import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github, Maximize2, Monitor, Pencil, RotateCcw, Smartphone, X } from 'lucide-react';
import Sketch from './Sketch';
import { fill, useLang, type Lang } from './i18n';

/** A second way to see the same project: its desktop layout, or its phone app. */
export type Variant = { scene: string; label: string; back: string; to: 'desktop' | 'phone'; app?: boolean };
type Props = { kind: 'hero' | 'dky' | 'kitchen' | 'kanban' | 'zofloridane' | 'glamour'; title: string; href?: string; repo?: string; variant?: Variant };
export default function SketchBuild({ kind, title, href, repo, variant }: Props) {
  const { lang, t: { build: t } } = useLang();
  const [stage, setStage] = useState(0);
  const [run, setRun] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [scale, setScale] = useState(0.4);
  const [zoomed, setZoomed] = useState(false);
  const [theme, setTheme] = useState('light');
  // Like the theme, a scene keeps the language it was built in; changing it never restarts a scene.
  const [sceneLang, setSceneLang] = useState<Lang>(lang);
  // Projects with a second scene can switch between both from the small button.
  const [alt, setAlt] = useState(false);
  // Each scene draws itself once; coming back to it shows it finished.
  const built = useRef(new Set<string>());
  const [instant, setInstant] = useState(false);
  const [leaving, setLeaving] = useState<{ run: number; src: string; live?: string; ready: boolean } | null>(null);
  const leaveTimer = useRef(0);
  // The new scene stays hidden until it reports in, so the swap is a true crossfade.
  const [waiting, setWaiting] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLIFrameElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const using = alt && variant ? variant : null;
  // A live site to reveal at the end; apps and alternate scenes stay on their own finished scene.
  const live = using ? undefined : kind === 'hero' ? `./?preview=1&lang=${sceneLang}` : href;
  const sceneKey = using ? using.scene : kind;
  const sceneSrc = `./build-scenes/${sceneKey}${sceneKey === 'hero' && sceneLang === 'en' ? '-en' : ''}.html?theme=${theme}&lang=${sceneLang}${instant ? '&final=1' : ''}`;
  const isApp = kind === 'kitchen' || Boolean(using?.app);
  const steps = live ? t.web : isApp ? t.app : using?.to === 'desktop' ? [...t.site.slice(0, 5), t.desktopDone] : t.site;
  // The button shows where it leads: the variant's form, or back to the original one.
  const toggleTo = variant ? (alt ? (variant.to === 'desktop' ? 'phone' : 'desktop') : variant.to) : 'desktop';
  const toggleName = variant ? (alt ? variant.back : variant.label) : '';
  const toggleLabel = (t.variants as Record<string, string>)[toggleName] ?? toggleName;
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
      if (Number.isInteger(next) && next >= 1 && next <= 5) { setStage(next); setWaiting(false); }
      // A scene counts as drawn as soon as it starts: coming back never redraws it.
      built.current.add(sceneKey);
    };
    window.addEventListener('message', receive);
    const timer = live ? window.setTimeout(() => setSlow(true), 25000) : 0;
    return () => { window.removeEventListener('message', receive); window.clearTimeout(timer); };
  }, [run, loaded, live, sceneKey]);
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);
  useEffect(() => {
    if (!leaving) return;
    // Once the new scene is ready (or after 2.5 s at most), the old one fades and goes.
    const delay = waiting ? 2500 : 700;
    leaveTimer.current = window.setTimeout(() => { setWaiting(false); if (!waiting) setLeaving(null); }, delay);
    return () => window.clearTimeout(leaveTimer.current);
  }, [leaving, waiting]);
  const start = (finished = false) => {
    if (run > 0) {
      // Keep the current scene on screen while it fades out under the next one.
      setLeaving({ run, src: sceneSrc, live: live && stage === 5 ? live : undefined, ready: loaded });
      setWaiting(true);
    }
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    setSceneLang(lang);
    setInstant(finished);
    setStage(finished ? 5 : 1); setLoaded(false); setSlow(false); setRun(value => value + 1);
  };
  const toggle = () => {
    const next = !alt;
    setAlt(next);
    start(built.current.has(next && variant ? variant.scene : kind));
  };
  if (new URLSearchParams(window.location.search).has('preview')) return <><Sketch kind={kind} /><span className="art-caption">{kind === 'kitchen' ? t.captionApp : t.captionWeb}</span></>;
  const frame = { width: 1120, height: 948, transform: `scale(${scale})` };
  const finishedApp = !live && stage === 5;
  const site = live ?? href;
  const exit = kind === 'hero' ? { href: '#projects', label: t.explore, code: false } : site ? { href: site, label: t.openSite, code: false } : repo ? { href: repo, label: t.seeCode, code: true } : null;
  const what = live ? t.realSite : isApp ? t.theApp : t.theWeb;
  return <div className={`sketch-build real-build build-${kind}`} data-stage={stage}>
    <div className="real-canvas" ref={canvas}>
      {run === 0 && <div className="build-drawing"><Sketch kind={kind} /></div>}
      {run > 0 && <div className={`creation-workspace${finishedApp ? ' is-interactive' : ''}`}>
        {leaving && <div key={`layer-${leaving.run}`} className={`scene-layer ${waiting ? 'is-holding' : 'is-leaving'}`} aria-hidden="true"><iframe key="scene" title="" src={leaving.src} sandbox="allow-scripts" style={frame} tabIndex={-1} />{leaving.live && <iframe key="live" className={`creation-live ${leaving.ready ? 'is-ready' : ''}`} title="" src={leaving.live} style={frame} tabIndex={-1} />}</div>}
        <div key={`layer-${run}`} className={`scene-layer ${leaving && waiting ? 'is-waiting' : 'is-entering'}`}><iframe key="scene" ref={scene} title={fill(t.sceneTitle, { title })} src={sceneSrc} sandbox="allow-scripts" style={frame} tabIndex={finishedApp ? 0 : -1} />{live && stage === 5 && <iframe key="live" className={`creation-live ${loaded ? 'is-ready' : ''}`} title={fill(t.liveTitle, { title })} src={live} onLoad={() => { setLoaded(true); setSlow(false); }} style={frame} tabIndex={loaded ? 0 : -1} />}</div>
      </div>}
      {variant && <button type="button" className="variant-toggle" onClick={toggle} aria-label={fill(t.variantLabel, { label: toggleLabel, title })} title={fill(t.variantTitle, { label: toggleLabel })}>{toggleTo === 'phone' ? <Smartphone size={15} /> : <Monitor size={15} />}<span>{toggleLabel}</span></button>}
      {stage === 0 && <button type="button" className="real-start" onClick={() => start()} aria-label={fill(live ? t.startLive : isApp ? t.startApp : t.startWeb, { title })}><span className="build-invitation"><Pencil size={17} />{live ? t.inviteLive : isApp ? t.inviteApp : t.inviteWeb}</span></button>}
    </div>
    <div className="build-caption"><span role="status" aria-live="polite">{slow ? t.slow : steps[stage]}</span><div className="build-steps" aria-hidden="true">{[1,2,3,4,5].map(step => <i key={step} className={stage >= step ? 'done' : ''} />)}</div></div>
    {run > 0 && <div className="real-controls">{stage === 5 && <><button className="text-link" type="button" onClick={() => start()}><RotateCcw size={14} /> {t.replay}</button><button className="text-link" type="button" onClick={() => { setZoomed(true); dialog.current?.showModal(); }}><Maximize2 size={14} /> {t.zoom}</button></>}{exit && <a className="text-link" href={exit.href} target={kind === 'hero' ? undefined : '_blank'} rel="noopener noreferrer">{exit.code && <Github size={14} />}{exit.label} <ArrowUpRight size={14} /></a>}</div>}
    <dialog className="real-site-dialog" ref={dialog} onClose={() => setZoomed(false)} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}><div className="real-dialog-bar"><strong>{title} · {what}</strong><button type="button" autoFocus aria-label={t.close} onClick={() => dialog.current?.close()}><X size={21} /></button></div>{zoomed && (live ? <iframe title={fill(t.zoomLive, { title })} src={live} /> : <iframe title={fill(t.zoomScreens, { title, what })} src={`${sceneSrc}&final=1`} sandbox="allow-scripts" />)}{live && <p>{t.fallback} <a href={live} target="_blank" rel="noopener noreferrer">{t.fallbackLink}</a>.</p>}</dialog>
  </div>;
}
