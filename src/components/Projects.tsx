import { Github, ExternalLink } from "lucide-react";
import { Reveal } from "../hooks/Reveal";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-10">Proyectos destacados</h2>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1}>
            <article className="surface-card overflow-hidden flex flex-col h-full transition-transform hover:-translate-y-1">
              <div className="w-full h-60 flex items-center justify-center" style={{ backgroundColor: p.color || "transparent" }}>
                <img src={p.image} alt={p.title} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 className="font-display text-2xl font-bold">{p.title}</h3>
                <p className="text-sm flex-1" style={{ color: "var(--muted)" }}>{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded-md"
                      style={{ background: "color-mix(in oklab, var(--accent) 15%, transparent)", color: "var(--accent)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm hover:opacity-70">
                      <Github size={16} /> Repo
                    </a>
                  )}
                  {p.page ? (
                    <a href={p.page} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm hover:opacity-70">
                      <ExternalLink size={16} /> Página
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm opacity-50">
                      <ExternalLink size={16} /> Página (próximamente)
                    </span>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
