import { Reveal } from "../hooks/Reveal";
import { content } from "../data/content";
import { Lightbulb } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="section">
      <Reveal>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-10">{content.about.title}</h2>
      </Reveal>
      <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
        <Reveal>
          <div className="surface-card p-4 rounded-full w-fit mx-auto md:mx-0">
            <Lightbulb size={40} style={{ color: "var(--accent)" }} />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            {content.about.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
