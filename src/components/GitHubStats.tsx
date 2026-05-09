import { Reveal } from "../hooks/Reveal";

const USER = "MrF3lipe";

export default function GitHubStats() {
  return (
    <section id="stats" className="section">
      <Reveal>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">GitHub Stats</h2>
        <p className="mb-8" style={{ color: "var(--muted)" }}>
          Visitas:{" "}
          <img
            alt="visitors"
            className="inline-block align-middle"
            src={`https://komarev.com/ghpvc/?username=${USER}&color=blueviolet&style=flat`}
          />
        </p>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-6">
        <Reveal>
          <div className="surface-card p-4 flex justify-center">
            <img alt="GitHub stats" src={`https://github-readme-stats.vercel.app/api?username=${USER}&show_icons=true&theme=transparent&hide_border=true`} />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="surface-card p-4 flex justify-center">
            <img alt="GitHub streak" src={`https://github-readme-streak-stats.herokuapp.com/?user=${USER}&theme=transparent&hide_border=true`} />
          </div>
        </Reveal>
        <Reveal delay={0.2} className="md:col-span-2">
          <div className="surface-card p-4 flex justify-center overflow-x-auto">
            <img alt="GitHub trophies" src={`https://github-profile-trophy.vercel.app/?username=${USER}&theme=flat&no-bg=true&no-frame=true`} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
