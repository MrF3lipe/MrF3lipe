import { useState } from "react";
import { Moon, Sun, Palette, Menu, X } from "lucide-react";
import { THEMES, useTheme } from "../context/ThemeContext";
import { content } from "../data/content";

const sections = [
  { id: "about", label: content.nav.about },
  { id: "stack", label: content.nav.stack },
  { id: "projects", label: content.nav.projects },
  { id: "contact", label: content.nav.contact },
];

export default function Navbar() {
  const { theme, setTheme, mode, toggleMode } = useTheme();
  const [openTheme, setOpenTheme] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpenMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "color-mix(in oklab, var(--bg) 70%, transparent)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        <button onClick={() => scrollTo("hero")} className="font-display font-bold text-lg tracking-tight">
          <span style={{ color: "var(--accent)" }}>{"<"}</span>FH<span style={{ color: "var(--accent)" }}>{" />"}</span>
        </button>

        <nav className="hidden md:flex gap-6 text-sm">
          {sections.map((s) => (
            <button key={s.id} onClick={() => scrollTo(s.id)} className="hover:opacity-70 transition-opacity">
              {s.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setOpenTheme((v) => !v)}
              className="p-2 rounded-lg hover:opacity-70"
              aria-label="Cambiar estilo"
              title="Cambiar estilo"
            >
              <Palette size={18} />
            </button>
            {openTheme && (
              <div className="absolute right-0 mt-2 w-56 surface-card p-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setOpenTheme(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:opacity-80 flex flex-col"
                    style={{
                      background: theme === t.id ? "color-mix(in oklab, var(--accent) 15%, transparent)" : "transparent",
                    }}
                  >
                    <span className="font-medium text-sm">{t.label}</span>
                    <span className="text-xs opacity-60">{t.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggleMode} className="p-2 rounded-lg hover:opacity-70" aria-label="Modo oscuro">
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="md:hidden p-2 rounded-lg" onClick={() => setOpenMenu((v) => !v)} aria-label="Menú">
            {openMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {openMenu && (
        <nav className="md:hidden px-5 pb-4 flex flex-col gap-2">
          {sections.map((s) => (
            <button key={s.id} onClick={() => scrollTo(s.id)} className="text-left py-2 border-b" style={{ borderColor: "var(--border)" }}>
              {s.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
