import { Github, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { content } from "../data/content";

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="section pt-16 md:pt-24">
      <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: "var(--muted)" }}>
            Hola, soy
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-4">
            {content.hero.name}
          </h1>
          <p className="text-lg md:text-xl mb-2" style={{ color: "var(--accent)" }}>
            {content.hero.role}
          </p>
          <p className="text-base md:text-lg mb-8 max-w-xl" style={{ color: "var(--muted)" }}>
            {content.hero.tagline}
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => scrollTo("projects")}
              className="px-6 py-3 rounded-lg font-medium transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {content.hero.ctaProjects}
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-6 py-3 rounded-lg font-medium transition-transform hover:-translate-y-0.5"
              style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              {content.hero.ctaContact}
            </button>
          </div>

          <div className="flex gap-4">
            <a href={content.contact.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 hover:opacity-70">
              <Github size={22} />
            </a>
            <a href={`mailto:${content.contact.email}`} aria-label="Email" className="p-2 hover:opacity-70">
              <Mail size={22} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="justify-self-center"
        >
          <div className="surface-card p-2 rounded-full">
            <img
              src={content.hero.photo}
              alt={content.hero.name}
              className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
