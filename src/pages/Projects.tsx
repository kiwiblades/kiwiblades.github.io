import Masonry from "react-masonry-css";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

const breakpoints = {
    default: 3,
    1024: 2,
    640: 1,
};

export default function Projects() {

    return (
        <main className="mx-auto max-w-5xl px-6 py-20">
            {/* Header */}
            <section className="mx-auto max-w-5xl px-6 text-center">
                <h1 className="text-5xl font-bold tracking-tight text-zinc-100">
                    Projects
                </h1>
            </section>

            {/* Project cards */}
            <Masonry
                breakpointCols={breakpoints}
                className="mt-20 flex gap-6"
                columnClassName="flex flex-col gap-6"
            >
                {projects.map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                ))}
            </Masonry>
        </main>
    );
}