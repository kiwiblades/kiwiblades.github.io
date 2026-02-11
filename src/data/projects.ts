export type Project = {
    slug: string;
    title: string;
    blurb: string;
    about?: string;
    tags: string[];
    images: string[]; // image paths
    links?: { label: string; href: string }[];
};

const imgs = (slug: string, count: number, ext = "png") =>
    Array.from({ length: count }, (_, i) => `/projects/${slug}/${i+1}.${ext}`);

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
        about: "Sunrise was built as a semester-long project for Software Engineering II. It focuses on providing users a place to store medical "
        + "information, receive medication and appointment reminders, and use an AI moderated chat forum to vent their stress.",
        tags: ["JavaScript", "React", "Express.JS", "PostgreSQL"],
        images: [],
        links: [{ label: "", href: "https://www.youtube.com/watch?v=38e8BM6-y-0" }],
    },
    {
        slug: "the-coop",
        title: "The Coop (In Progress)",
        blurb: "Daily chat app for nuturing all types of relationships",
        about: "The Coop is a mobile app that offers daily question prompts to promote conversation. Built during the Computer Science capstone.",
        tags: ["Flutter", "Dart", "Docker", "JavaScript", "Express.JS"],
        images: [],
        links: [],
    },
    {
        slug: "pharmacy-mock",
        title: "Pharmacy Mock",
        blurb: "Reinvention of pharmacy software",
        about: "",
        tags: ["Rust", "Docker"],
        images: [],
        links: [],
    },
    {
        slug: "fallout-shelter",
        title: "Fallout Shelter Exhibit",
        blurb: "Living 'Under a Nuclear Sword of Damocles:' Elk City's Fallout Shelter Supplies.",
        about: "This website was built during my time working at the Elk City Route 66 Museum, and acts as a virtual counterpart to the physical exhibit in the Old Town Museum.",
        tags: ["HTML/CSS", "Research", "History"],
        images: imgs("fallout-shelter", 2),
        links: [{label: "Exhibit", href: "https://elkcitymuseumcomplex.weebly.com/exhibit.html" }],
    }
];
