import { useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

export default function Projects({ setBg }: { setBg: (url: string) => void }) {
    useEffect(() => {
        setBg("/renderhoneycombv2.png");
    }, [setBg]);

    return (
        <main className="mx-auto max-w-5xl px-6 py-20">
            {/* Header */}
            <section className="mx-auto max-w-5xl px-6 text-center">
                <h1 className="text-5xl font-bold tracking-tight text-zinc-100">
                    Projects
                </h1>
            </section>

            {/* Project cards */}
            <section className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                ))}
            </section>
        </main>
    );
}