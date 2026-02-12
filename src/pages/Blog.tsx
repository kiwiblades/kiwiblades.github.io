import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts, type BlogPost } from "../data/blog";

export default function Blog() {
  const [selected, setSelected] = useState<BlogPost | null>(null);

  if (selected) {
    return (
      <div className="relative max-w-3xl mx-auto px-4 py-10">

        <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-b from-black/50 via-black/30 to-black/50 blur-xl" />
        {/* <div className="absolute inset-0 -z-10 rounded-3xl border border-white/10" /> */}

        <article>
            <button onClick={() => setSelected(null)} className="mb-6 underline underline-offset-4 opacity-80 hover:opacity-100">
            ← Back to blog
            </button>

            <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{selected.title}</h1>
            <p className="opacity-70 mt-2">{selected.date}</p>

            {!!selected.tags?.length && (
                <div className="mt-4 flex flex-wrap gap-2">
                {selected.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded border border-white/10 opacity-80">
                    {t}
                    </span>
                ))}
                </div>
            )}
            </header>

            <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selected.content}
            </ReactMarkdown>
            </div>
        </article>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Blog</h1>

      {posts.length === 0 ? (
        <p className="opacity-70">No posts yet — check back soon.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="rounded border border-white/10 bg-white/5">
              <button
                onClick={() => setSelected(p)}
                className="text-left w-full p-4 hover:bg-white/5 transition"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-xl font-semibold">{p.title}</div>
                  <div className="opacity-70 text-sm whitespace-nowrap">{p.date}</div>
                </div>

                {p.summary && <div className="opacity-80 mt-2">{p.summary}</div>}

                {!!p.tags?.length && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded border border-white/10 opacity-80">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}