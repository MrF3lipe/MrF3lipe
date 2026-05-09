import { useState } from "react";
import { Copy, Check, Github, Mail } from "lucide-react";
import { Reveal } from "../hooks/Reveal";
import { content } from "../data/content";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const copyEmail = async () => {
    await navigator.clipboard.writeText(content.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Pure client-side AJAX to Formspree — no backend code runs in our project.
  // Replace `formspreeEndpoint` in src/data/content.ts with your real endpoint.
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content.contact.formspreeEndpoint.includes("REPLACE_ME")) {
      setStatus("err");
      return;
    }
    setStatus("sending");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch(content.contact.formspreeEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus("err");
    }
  };

  return (
    <section id="contact" className="section">
      <Reveal>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{content.contact.title}</h2>
        <p className="mb-8 max-w-xl" style={{ color: "var(--muted)" }}>{content.contact.intro}</p>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-6">
        <Reveal>
          <div className="surface-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span className="font-mono text-sm break-all">{content.contact.email}</span>
              </div>
              <button
                onClick={copyEmail}
                className="text-sm inline-flex items-center gap-2 px-3 py-1.5 rounded-md"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <a
              href={content.contact.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-70"
            >
              <Github size={18} /> @{content.contact.github}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="surface-card p-6 flex flex-col gap-3">
            <input name="name" required placeholder="Tu nombre" className="px-3 py-2 rounded-md bg-transparent" style={{ border: "1px solid var(--border)" }} />
            <input type="email" name="email" required placeholder="Tu email" className="px-3 py-2 rounded-md bg-transparent" style={{ border: "1px solid var(--border)" }} />
            <textarea name="message" required rows={4} placeholder="Mensaje" className="px-3 py-2 rounded-md bg-transparent" style={{ border: "1px solid var(--border)" }} />
            <button
              type="submit"
              disabled={status === "sending"}
              className="px-4 py-2 rounded-md font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {status === "sending" ? "Enviando..." : "Enviar mensaje"}
            </button>
            {status === "ok" && <p className="text-sm" style={{ color: "var(--accent)" }}>¡Mensaje enviado!</p>}
            {status === "err" && (
              <p className="text-sm opacity-70">
                Configura tu endpoint Formspree en <code>src/data/content.ts</code> o escríbeme directo.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
