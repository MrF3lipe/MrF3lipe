import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Github, Mail, Send } from 'lucide-react';
import { content } from '../data/content';

export default function Contact() {
  const [opportunity, setOpportunity] = useState('Proyecto freelance');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const request = useRef<AbortController>();
  useEffect(() => () => { clearTimeout(timer.current); request.current?.abort(); }, []);
  async function copyEmail() {
    try { await navigator.clipboard.writeText(content.contact.email); setCopyState('copied'); }
    catch { setCopyState('error'); }
    clearTimeout(timer.current); timer.current = setTimeout(() => setCopyState('idle'), 3500);
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (status === 'sending') return;
    const form = e.currentTarget; const data = new FormData(form);
    if (!String(data.get('name') || '').trim() || !String(data.get('message') || '').trim()) { setStatus('error'); return; }
    data.set('_subject', `${opportunity} · Portfolio Felipe Hernández`);
    request.current = new AbortController();
    const timeout = setTimeout(() => request.current?.abort(), 15000);
    setStatus('sending');
    try {
      const response = await fetch(content.contact.formspreeEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: request.current.signal });
      if (!response.ok) throw new Error('Message rejected');
      form.reset(); setStatus('success');
    } catch { setStatus('error'); }
    finally { clearTimeout(timeout); }
  }
  return <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="page-width contact-layout">
    <div className="contact-copy"><span className="page-index">05 / la próxima página</span><h2 id="contact-title">¿Y si lo<br /><span className="hand-underline">hacemos realidad?</span></h2><p>Si tienes una idea, un proyecto o un equipo al que pueda aportar, cuéntame. La próxima página empieza con un «hola».</p>
      <div className="contact-address"><Mail size={19} /><a href={`mailto:${content.contact.email}`}>{content.contact.email}</a><button type="button" className="copy-email" onClick={copyEmail} aria-label={copyState === 'copied' ? 'Correo copiado' : 'Copiar correo'}>{copyState === 'copied' ? <Check size={17} /> : <Copy size={17} />}</button></div>
      <p className="copy-status" role="status">{copyState === 'copied' ? '¡Copiado! Ya puedes pegarlo en tu correo.' : copyState === 'error' ? 'Puedes seleccionar la dirección o abrir tu correo haciendo clic en ella.' : ''}</p><a className="text-link" href={content.contact.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={17} /> También estoy en GitHub <ArrowUpRight size={16} /></a>
      <div className="contact-scribble handwritten">No hace falta tener<br />todo resuelto para empezar. <span>↗</span></div>
    </div>
    <form className="contact-form paper-sheet" onSubmit={submit} aria-label="Enviar un mensaje a Felipe"><span className="sheet-tape" aria-hidden="true" /><div className="form-heading"><span>un apunte para Felipe</span><Send size={23} strokeWidth={1.2} /></div>
      <fieldset className="opportunity-options"><legend>Te escribo por…</legend>{['Proyecto freelance', 'Oportunidad de empleo'].map(option => <label key={option} className={opportunity === option ? 'checked' : ''}><input type="radio" name="opportunity" value={option} checked={opportunity === option} onChange={() => setOpportunity(option)} />{option}</label>)}</fieldset>
      <div className="form-row"><label htmlFor="contact-name">Tu nombre</label><input id="contact-name" name="name" autoComplete="name" placeholder="¿Cómo te llamas?" required maxLength={100} /></div>
      <div className="form-row"><label htmlFor="contact-email">Tu correo</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="Para poder responderte" required maxLength={254} /></div>
      <div className="form-row"><label htmlFor="contact-message">Lo que tienes en mente</label><textarea id="contact-message" name="message" rows={4} placeholder="Una idea, una oportunidad, una pregunta…" required maxLength={5000} /></div>
      <div className="honeypot" aria-hidden="true"><label>No completar<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label></div>
      <button className="sketch-button form-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando tu apunte…' : 'Enviar este apunte'}{status !== 'sending' && <ArrowUpRight size={18} />}</button><p className="form-footnote">Tu mensaje llega a mi correo. Así de sencillo.</p>
      {status === 'success' && <p className="form-feedback success" role="status"><Check size={18} />¡Apunte recibido! Gracias por escribirme.</p>}{status === 'error' && <p className="form-feedback error" role="alert">No pude enviar el mensaje. Revisa los campos y vuelve a intentarlo, o escríbeme por correo.</p>}
    </form>
  </div></section>;
}
