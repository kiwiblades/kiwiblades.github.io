type Page = "home" | "projects" | "tools";

export default function Home({ onNavigate }: { onNavigate: (p: Page) => void }) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20">
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30 p-10">
          {/* Subtle glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"/>
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl"/>

          {/* Hero */}
          <div className="relative max-w-2xl">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-100">
              Backend-focused builder
              <span className="text-zinc-400"> creating practical tools.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              I'm Rye, a CS student interested in healthcare and human-centered software.
              I like clean architecture, reliable systems, and projects that solve real problems.
            </p>

            {/* Call-to-actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("projects")}
                className="rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-400 transition">
                  View Projects
              </button>
              <button
                onClick={() => onNavigate("tools")}
                className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-zinc-800/60 transition">
                  Try Tools
              </button>
            </div>

            {/* Quick tags */}
            <div className="mt-8 flex flex-wrap gap-2 text-sm">
              {["Backend", "APIs & Database", "Medical Coding"].map((t) => (
                <span key={t} className="rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1 text-zinc-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
  );
}