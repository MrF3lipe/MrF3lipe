import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Github, Mail, Send } from 'lucide-react';
import { content } from '../data/content';
import { useLang } from './i18n';

export default function Contact() {
  const { contact: t } = useLang().t;
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
    <div className="contact-copy"><span className="page-index">{t.index}</span><h2 id="contact-title">{t.title}<br /><span className="hand-underline">{t.titleMark}</span></h2><p>{t.intro}</p>
      <div className="contact-address"><Mail size={19} /><a href={`mailto:${content.contact.email}`}>{content.contact.email}</a><button type="button" className="copy-email" onClick={copyEmail} aria-label={copyState === 'copied' ? t.copied : t.copy}>{copyState === 'copied' ? <Check size={17} /> : <Copy size={17} />}</button></div>
      <p className="copy-status" role="status">{copyState === 'copied' ? t.copiedStatus : copyState === 'error' ? t.copyError : ''}</p><a className="text-link" href={content.contact.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={17} /> {t.github} <ArrowUpRight size={16} /></a>
      <div className="contact-scribble handwritten">{t.scribble[0]}<br />{t.scribble[1]} <span>↗</span></div>
    </div>
    <form className="contact-form paper-sheet" onSubmit={submit} aria-label={t.form}><span className="sheet-tape" aria-hidden="true" /><div className="form-heading"><span>{t.formTitle}</span><Send size={23} strokeWidth={1.2} /></div>
      <fieldset className="opportunity-options"><legend>{t.reason}</legend>{['Proyecto freelance', 'Oportunidad de empleo'].map((option, index) => <label key={option} className={opportunity === option ? 'checked' : ''}><input type="radio" name="opportunity" value={option} checked={opportunity === option} onChange={() => setOpportunity(option)} />{t.options[index]}</label>)}</fieldset>
      <div className="form-row"><label htmlFor="contact-name">{t.name}</label><input id="contact-name" name="name" autoComplete="name" placeholder={t.namePlaceholder} required maxLength={100} /></div>
      <div className="form-row"><label htmlFor="contact-email">{t.email}</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder={t.emailPlaceholder} required maxLength={254} /></div>
      <div className="form-row"><label htmlFor="contact-message">{t.message}</label><textarea id="contact-message" name="message" rows={4} placeholder={t.messagePlaceholder} required maxLength={5000} /></div>
      <div className="honeypot" aria-hidden="true"><label>{t.honeypot}<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label></div>
      <button className="sketch-button form-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? t.sending : t.send}{status !== 'sending' && <ArrowUpRight size={18} />}</button><p className="form-footnote">{t.footnote}</p>
      {status === 'success' && <p className="form-feedback success" role="status"><Check size={18} />{t.success}</p>}{status === 'error' && <p className="form-feedback error" role="alert">{t.error}</p>}
    </form>
  </div></section>;
}
