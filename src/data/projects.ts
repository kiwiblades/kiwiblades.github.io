export type Project = {
    slug: string;
    title: string;
    blurb: string;
    about?: string;
    tags: string[];
    images: string[]; // image paths
    links?: { label: string; href: string }[];
};

// all hardcoded project data exists here to declutter the design/page formatting space
export const projects: Project[] = [
    {
        slug: "langcura",
        title: "LangCura",
        blurb: "Medical documentation for quick AI translation.",
        about: "LangCura was made for HackOKState, a 24-hour hackathon held at Oklahoma State University.",
        tags: ["Python", "Flask", "OpenRouter", "Hackathon"],
        images: [],
        links: [{ label: "", href: "https://github.com/kiwiblades/LangCura" }],
    },
    {
        slug: "sunrise",
        title: "Sunrise",
        blurb: "Mental health community support and medical adherence.",
        about: "",
        tags: ["JavaScript", "Express.JS", "PostgreSQL"],
        images: [],
        links: [{ label: "", href: "https://www.youtube.com/watch?v=38e8BM6-y-0" }],
    }
];
