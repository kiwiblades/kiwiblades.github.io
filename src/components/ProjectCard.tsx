import { useMemo, useState } from "react";
import type { Project } from "../data/projects";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import GithubIcon from "../assets/GitHub_Invertocat_White.svg"

export default function ProjectCard({ project }: { project: Project }) {
    const { title, blurb, about, tags, images, links } = project;

    const [open, setOpen] = useState(false);
    const [idx, setIdx] = useState(0);

    const hasManyImages = images.length > 1;
    const currentImage = images[Math.min(idx, images.length-1)];

    const prettyLinks = useMemo(() => links ?? [], [links]);

    // helpers for carousel images
    function prev() {
        setIdx((i) => (i-1+images.length) % images.length);
    }
    function next() {
        setIdx((i) => (i+1) % images.length);
    }

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 shadow-sm backdrop-blur
        transition hover:border-zinc-700">
            {/* Subtle shine */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -inset-24 bg-[radial-gradient(circle_at_30%_10%,rgba(124,58,237,0.18),transparent_55%)]" />
            </div>

            {/* Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                {currentImage ? (
                    <img src={currentImage} alt={`${title} preview`} 
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                        No image yet
                    </div>
                )}

                {/* Slideshow controls */}
                {hasManyImages && (
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                        <button type="button" onClick={prev} 
                        className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-2 text-zinc-200 hover:bg-zinc-900"
                        aria-label="Previous image">
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="rounded-full border border-zinc-700 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-200">
                            {idx+1} / {images.length}
                        </div>

                        <button type="button" onClick={next} 
                        className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-2 text-zinc-200 hover:bg-zinc-900"
                        aria-label="Next image">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="relative p-5">
                <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
                    {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{blurb}</p>

                {/* Tags */}
                {tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span key={t} className="rounded-full border border-zinc-700 bg-zinc-950/30 px-2.5 py-1 text-xs text-zinc-200">
                                {t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                    {prettyLinks.map((l) => {
                        const isGithub = /github\.com/i.test(l.href);
                        return (
                            <a key={l.href} href={l.href} target="_blank" rel="nonreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950/30 px-3 py-2 text-sm text-zinc-100
                           hover:bg-zinc-900">
                            {isGithub ? <img src={GithubIcon} alt="" className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                            {l.label}
                           </a>
                        );
                    })}

                    {about && (
                        <button type="button" onClick={() => setOpen((v) => !v)}
                        className="ml-auto rounded-xl border border-zinc-700 bg-zinc-950/30 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-900"
                        aria-expanded={open}>
                            {open ? "Hide details" : "About"}
                        </button>
                    )}
                </div>

                {/* Expandable about */}
                {about && open && (
                    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/30 p-4 text-sm text-zinc-300">
                        {about}
                    </div>
                )}
            </div>
        </article>
    );
}