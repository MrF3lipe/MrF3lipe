import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeName =
  | "glass"
  | "neumorphic"
  | "terminal"
  | "minimal"
  | "synthwave";

export const THEMES: { id: ThemeName; label: string; description: string }[] = [
  { id: "glass", label: "Modern Glass", description: "Glassmorphism + gradientes" },
  { id: "neumorphic", label: "Neumorphic Soft", description: "Sombras suaves" },
  { id: "terminal", label: "Terminal Hacker", description: "Verde sobre negro" },
  { id: "minimal", label: "Minimal Mono", description: "Editorial b/n" },
  { id: "synthwave", label: "Sunset Synthwave", description: "Neón retro" },
];

type Mode = "light" | "dark";

type Ctx = {
  theme: ThemeName;
  mode: Mode;
  setTheme: (t: ThemeName) => void;
  toggleMode: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

const STORAGE_THEME = "fh_theme";
const STORAGE_MODE = "fh_mode";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return "glass";
    return (localStorage.getItem(STORAGE_THEME) as ThemeName) || "glass";
  });

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(STORAGE_MODE) as Mode | null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem(STORAGE_MODE, mode);
  }, [mode]);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      mode,
      setTheme: setThemeState,
      toggleMode: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    }),
    [theme, mode]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
