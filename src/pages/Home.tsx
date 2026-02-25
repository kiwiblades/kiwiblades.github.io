import { useState } from "react";

type Page = "home" | "projects" | "tools";

export default function Home({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const CONTACT_API = "https://worker.brynn-0e7.workers.dev"; 

  async function onSubmitContact(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(CONTACT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error ?? `Request failed (${res.status})`);
        return;
      }

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg("Network error (is the worker running?)");
    }
  }

  const primaryBtn = "rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-400 transition";
  const secondaryBtn = "rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-zinc-800/60 transition";
  const card = "relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30 p-10";
  const glow = (
    <>
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
    </>
  )

  const REPO = "https://github.com/kiwiblades/kiwiblades.github.io"


    return (
      <main className="mx-auto max-w-5xl px-6 py-20">
        {/* Hero */}
        <section className={card}>
          {glow}
          <div className="relative max-w-2xl">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-100">
              Backend-focused builder
              <span className="text-zinc-400"> creating practical tools.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              Hey! I'm Rye, a CS student building reliable backend systems with a healthcare + human-centered focus.
            </p>

            {/* Call-to-actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("projects")}
                className={primaryBtn}>
                  View Projects
              </button>
              <button
                onClick={() => onNavigate("tools")}
                className={secondaryBtn}>
                  Try Tools
              </button>
            </div>

            {/* Quick tags */}
            <div className="mt-8 flex flex-wrap gap-2 text-sm">
              {["Backend", "APIs & Database", "Healthcare"].map((t) => (
                <span key={t} className="rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1 text-zinc-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* About: Proof of Work */}
        <section className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="text-sm font-semibold text-zinc-100">What I build</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>- Rest APIs</li>
              <li>- PostgreSQL schemas + relationships</li>
              <li>- Auth flows (JWT, refresh tokens)</li>
              <li>- Realtime features (sockets/listeners)</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="text-sm font-semibold text-zinc-100">Current focus</div>
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              Building tools that reduce friction for users, especially in healthcare-adjacent workflows.
            </p>
              <button onClick={() => onNavigate("tools")}
              className="mt-4 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800/60 transition">
                Explore Tools
              </button>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="text-sm font-semibold text-zinc-100">This site</div>
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              Curious how it's built? Check out the portfolio code.
            </p>
            <a href={REPO} target="_blank" rel="nonreferrer"
              className="mt-4 inline-flex rounded-lg bg-zinc-950/40 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800/60 transition border border-zinc-800">
                View website repo
              </a>
          </div>
        </section>

        {/* Featured project + contact */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className={card}>
            {glow}
            <div className="relative">
              <div className="text-xs test-zinc-400">Featured</div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-100">
                Sunrise - Mental Health Web App
              </h2>
              <p className="mt-3 text-sm text-sinc-300 leading-relaxed">
                A backend-heavy project showcasing API design, data modeling, and real-world features.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                <li>- Advanced calendar capabilities</li>
                <li>- PostgreSQL persistence + relationships</li>
                <li>- Clean error handling + validation</li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => onNavigate("projects")} className={primaryBtn}>
                  View details
                </button>
                <button onClick={() => onNavigate("projects")} className={secondaryBtn}>
                  See all projects →
                </button>
              </div>
            </div>
          </div>

          <div className={card}>
            {glow}
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-100">
                Let's talk!
              </h2>
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                If you're hiring, collaborating, or just want to say hi, send a message here.
              </p>

              <form onSubmit={onSubmitContact} className="mt-6 space-y-3">
                <input
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <input
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />

                <input
                  type="text"
                  name="company"
                  value={(form as any).company ?? ""}
                  onChange={(e) => setForm({ ...(form as any), company: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <textarea
                  className="w-full min-h-30 rounded-lg border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />

                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className={primaryBtn + (status === "sending" ? " opacity-70 cursor-not-allowed" : "")}
                  >
                    {status === "sending" ? "Sending..." : "Send message"}
                  </button>

                  {status === "sent" && (
                    <span className="text-sm text-emerald-300">Sent! I'll get back to you.</span>
                  )}
                  {status === "error" && (
                    <span className="text-sm text-red-300">
                      {errorMsg || "Something went wrong."}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>

        </section>

        {/* About me*/}
        <section className="mt-6 relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30 p-10">
          {glow}

          <div className="relative max-w-2xl">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-100">
              About me
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              Always looking for a new project! I'm a third year student, double majoring in Computer Science and Software Engineering.<br /><br />
              Working in pharmacy has given me a strong curiosity for the medical field. Medical technology has a unique opportunity to directly improve
              users' lives, starting with their physical wellbeing.
            </p>
          </div>
        </section>

      </main>
  );
}