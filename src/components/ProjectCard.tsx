import { useMemo, useState, useEffect, useCallback } from "react";
import type { Project } from "../data/projects";
import useEmblaCarousel from "embla-carousel-react";
import { ExternalLink, Video, ChevronLeft, ChevronRight } from "lucide-react";
import GithubIcon from "../assets/GitHub_Invertocat_White.svg"

export default function ProjectCard({ project }: { project: Project }) {
    const { title, blurb, about, tags, images, links } = project;

    const [open, setOpen] = useState(false);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });
    const [selectedIdx, setSelectedIdx] = useState(0);

    const hasManyImages = images.length > 1;
    const prettyLinks = useMemo(() => links ?? [], [links]);

    // keep counter in sync
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIdx(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    // when switching projects, reset to the first slide
    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.scrollTo(0, true);
        setSelectedIdx(0);
    }, [project.slug, emblaApi]);

    // helpers for carousel images
    const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 shadow-sm backdrop-blur 
        transition hover:border-zinc-700">
            {/* Subtle shine */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -inset-24 bg-[radial-gradient(circle_at_30%_10%,rgba(124,58,237,0.18),transparent_55%)]" />
            </div>

            {/* Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                {images?.length ? (
                    <>
                    {/* Embla viewport */}
                    <div ref={emblaRef} className="h-full w-full overflow-hidden">
                        {/* Embla container */}
                        <div className="flex h-full">
                            {images.map((src) => (
                                <div key={src} className="min-w-0 flex-[0_0_100%]">
                                    <img src={src} alt={`${title} preview`} loading="lazy"
                                        className="h-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                        draggable={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Slideshow controls */}
                    {hasManyImages && (
                        <div className={["absolute inset-x-3 bottom-3 z-20 flex items-center justify-between",
                            "opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0",
                            "focus-within:opacity-100 focus-within:translate-y-0"].join(" ")}>
                            <button type="button" onClick={prev} 
                                className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-2 text-zinc-200 hover:bg-zinc-900"
                                aria-label="Previous image">
                            <ChevronLeft className="h-4 w-4" />
                            </button>

                            <div className="rounded-full border border-zinc-700 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-200">
                                {selectedIdx+1} / {images.length}
                            </div>

                            <button type="button" onClick={next} 
                                className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-2 text-zinc-200 hover:bg-zinc-900"
                                aria-label="Next image">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                        No image yet
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="relative flex flex-1 flex-col p-5">
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

                {/* Expandable about */}
                {about && (
                    <div
                        className={[
                        "mt-4 grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out",
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        ].join(" ")}
                    >
                        <div className="overflow-hidden">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4 text-sm text-zinc-300">
                            {about}
                        </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-auto pt-5 flex flex-wrap items-center gap-2">
                    {prettyLinks.map((l) => {
                        const isGithub = /github\.com/i.test(l.href);
                        const isYoutube = /youtube\.com/i.test(l.href);
                        return (
                            <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950/30 px-3 py-2 text-sm text-zinc-100
                           hover:bg-zinc-900">
                            {isGithub ? <img src={GithubIcon} alt="" className="h-4 w-4" /> : isYoutube ? <Video className="h-4 w-4" /> 
                            : <ExternalLink className="h-4 w-4" />}
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
            </div>
        </article>
    );
}