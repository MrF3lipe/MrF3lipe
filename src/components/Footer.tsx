import { Github, Mail } from "lucide-react";
import { content } from "../data/content";

export default function Footer() {
  return (
    <footer className="py-10 px-5 text-center" style={{ borderTop: "1px solid var(--border)" }}>
      <p className="mb-3" style={{ color: "var(--muted)" }}>
        {content.footer.text} – {content.footer.year}
      </p>
      <div className="flex justify-center gap-4">
        <a href={content.contact.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:opacity-70">
          <Github size={20} />
        </a>
        <a href={`mailto:${content.contact.email}`} aria-label="Email" className="hover:opacity-70">
          <Mail size={20} />
        </a>
      </div>
    </footer>
  );
}
