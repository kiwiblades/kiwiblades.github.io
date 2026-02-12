import matter from "gray-matter";

export type BlogPostMeta = {
    slug: string;
    title: string;
    date: string;
    tags?: string[];
    summary?: string;
};

export type BlogPost = BlogPostMeta & {
    content: string;
};

// load all markdown files as raw text
const modules = import.meta.glob<string>("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const posts: BlogPost[] = Object.entries(modules).map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/,"");
    const { data, content } = matter(raw);

    return {
        slug,
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? "1970-01-01",
        tags: (data.tags as string[]) ?? [],
        summary: (data.summary as string) ?? "",
        content,
    };
}).sort((a,b) => (a.date < b.date ? 1 : -1)); // sort w/ newest first