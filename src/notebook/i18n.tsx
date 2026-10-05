import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import copy from './copy.json';

export type Lang = 'es' | 'en';
export type Copy = typeof copy.es;
export const LANG_KEY = 'notebook-lang';
// Typed against the Spanish copy, so a missing English string fails the build.
const texts: Record<Lang, Copy> = { es: copy.es, en: copy.en };

/** Fills `{name}` placeholders in a string from the copy. */
export const fill = (text: string, values: Record<string, string>) => text.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

type Value = { lang: Lang; t: Copy; setLang: (lang: Lang) => void };
const LangContext = createContext<Value>({ lang: 'es', t: texts.es, setLang: () => {} });

/** The initial language is set by an inline script in index.html, before the first paint. */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => document.documentElement.lang === 'en' ? 'en' : 'es');
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = texts[lang].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', texts[lang].meta.description);
  }, [lang]);
  useEffect(() => {
    // Embedded previews of this page pick up a language chosen in the parent window.
    const sync = (event: StorageEvent) => { if (event.key === LANG_KEY && (event.newValue === 'es' || event.newValue === 'en')) setLangState(event.newValue); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const setLang = (next: Lang) => {
    try { localStorage.setItem(LANG_KEY, next); } catch { /* storage blocked */ }
    setLangState(next);
  };
  return <LangContext.Provider value={{ lang, t: texts[lang], setLang }}>{children}</LangContext.Provider>;
}
export const useLang = () => useContext(LangContext);
