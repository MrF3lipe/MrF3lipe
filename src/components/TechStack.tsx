import { Reveal } from "../hooks/Reveal";
import { techStack } from "../data/techStack";

export default function TechStack() {
  return (
    <section id="stack" className="section">
      <Reveal>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-10">Tech Stack</h2>
      </Reveal>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {techStack.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.04}>
            <div
              className="surface-card p-5 flex flex-col items-center gap-3 transition-transform hover:-translate-y-1"
              style={{ borderTop: `3px solid ${t.color}` }}
            >
              <t.Icon size={36} color={t.color} />
              <span className="text-sm font-medium">{t.name}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
